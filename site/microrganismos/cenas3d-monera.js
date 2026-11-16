/* LAB Microrganismos e fungos: cenas 3D do Monera (Martin), sobre o kit do módulo Vírus (vir3d.js e vir3d-pecas.js) e
   as peças deste módulo (micro3d-pecas.js).
   A célula bacteriana: um bacilo aberto ao meio, com cápsula translúcida, parede, membrana, nucleoide enovelado, dois
   plasmídeos, ribossomos, fímbrias e o flagelo em hélice que gira; a peça da vez acende no mesmo ritmo da legenda.
   Divisão binária: o cromossomo se copia, a célula se alonga, a parede fecha no meio e a colônia dobra a cada rodada.
   Troca de genes: transformação (pedaços de DNA de uma bactéria morta entram em outra), conjugação (pilus e cópia do
   plasmídeo) e transdução (o fago T4 do módulo Vírus leva um pedaço de DNA de uma bactéria para outra).
   Gram, formas, nutrição e o jogo do antibiótico na placa continuam no desenho plano. */
'use strict';
(function () {
  const V3 = window.VIR3D; if (!V3 || !V3.bacterias) return;
  const { V, K } = V3, { cl, mix, sst, add, sub, mul, nrm, hash, lerp3, trilha, TAU } = V;
  const RED = () => V3.REDUZ();
  const ach = (g, id, p) => { g.anc[id] = p; g.vis[id] = true; };
  const cam = (g, P, hx, hy, o = {}) => V3.viva({ th: o.th == null ? .3 : o.th, fi: o.fi == null ? .22 : o.fi, d: V3.enquadrar(g, hx, hy) * (o.k || 1.05), al: o.al || [0, 0, 0] }, P.t, o.viva == null ? .5 : o.viva);
  const AM = '#FFB347', CIT = '#33244A';
  // gira um ponto em torno do eixo z
  const rz = (p, a) => { const c = Math.cos(a), s = Math.sin(a); return [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]]; };
  function acende(m, on, k) { if (!m || !m.emissive) return; m.emissive.set(on ? AM : '#000000'); m.emissiveIntensity = on ? k : 0; }

  // pastilha de etapa no canto do palco
  function etapaHud(g, s1, extra) {
    const x = NAR ? 10 : 18, y = NAR ? 50 : 74, w = Math.max(tw(s1, 14, 700), extra ? tw(extra, 12, 400) : 0) + 24, h = extra ? 44 : 28;
    rr(x, y, w, h, 8, 'rgba(19,26,43,.86)', 'rgba(255,179,71,.55)', 1);
    tx(s1, x + 12, y + 14, { s: 14, w: 700, a: 'left', c: C.txt, bg: false });
    if (extra) tx(extra, x + 12, y + 32, { s: 12, a: 'left', c: C.dim, bg: false });
    V3.reserva(g, [x, y, w, h]);
  }

  // =====================================================================================
  // A CÉLULA BACTERIANA (bacilo em corte)
  // =====================================================================================
  const PE1 = {
    capsula: { nome: 'Cápsula', frase: 'Camada de açúcares por fora da parede, que protege a bactéria das defesas do corpo.', cor: '#D9C8A0' },
    parede: { nome: 'Parede celular', frase: 'Feita de peptidoglicano: dá forma à célula e impede que ela estoure ao absorver água. É o alvo da penicilina.', cor: C.parede },
    membrana: { nome: 'Membrana plasmática', frase: 'Controla o que entra e o que sai da célula. Fica logo por dentro da parede.', cor: C.membrana },
    cito: { nome: 'Citoplasma', frase: 'Sem organelas com membrana: nada de núcleo, mitocôndria, cloroplasto ou retículo.', cor: '#C25A8E' },
    nucleoide: { nome: 'Nucleoide', frase: 'Região com o cromossomo, uma molécula de DNA circular enovelada, sem membrana em volta.', cor: C.dnaEscuro },
    plasmideo: { nome: 'Plasmídeo', frase: 'Pequeno círculo extra de DNA. Pode carregar genes úteis, como os de resistência a antibióticos, e passar para outra bactéria.', cor: C.plasmideo },
    ribo: { nome: 'Ribossomos 70S', frase: 'Fazem as proteínas. São menores que os nossos (80S), e por isso alguns antibióticos travam só os da bactéria.', cor: C.ribo },
    fimbria: { nome: 'Fímbrias', frase: 'Filamentos curtos que prendem a bactéria a superfícies, como a parede do intestino.', cor: '#C9D3E6' },
    flagelo: { nome: 'Flagelo', frase: 'Filamento longo em hélice, girado por um motor na base. Gira e faz a bactéria nadar.', cor: '#E3E0D2' }
  };
  const ORDEM = ['capsula', 'parede', 'membrana', 'nucleoide', 'plasmideo', 'ribo', 'fimbria', 'flagelo'];
  const NOMES = ['cápsula', 'parede celular', 'membrana plasmática', 'nucleoide', 'plasmídeo', 'ribossomos', 'fímbrias', 'flagelo'];
  // dentro de uma cápsula de raio 1 e meio comprimento 2,4 (eixo x)
  const dentroCap = (p, k) => { const x = Math.max(0, Math.abs(p[0]) - 1.4); return x * x + p[1] * p[1] + p[2] * p[2] < k * k; };
  const RIB = []; for (let i = 0; RIB.length < 46 && i < 400; i++) { const p = [(hash(i, 1) - .5) * 4.6, (hash(i, 2) - .5) * 1.6, -.08 - hash(i, 3) * .75]; if (dentroCap(p, .8) && !(Math.abs(p[0] + .1) < 1.1 && Math.abs(p[1]) < .45)) RIB.push(p); }
  const FIM = []; for (let i = 0; i < 44; i++) { const x = -2 + 3.8 * (i / 43) + (hash(i, 11) - .5) * .2, a = Math.PI * (.62 + hash(i, 12) * 1.75); FIM.push({ x, a, L: .26 + hash(i, 13) * .14 }); }
  const NUC = V3.nucleoide(120, [-.1, 0, -.3], 1.15, .42, 1.7);

  V3.cena('monera/celula', {
    fit: 9, raio: 5, bolas: 140, pecas: PE1,
    so2D: S => S.modo !== 'cel',
    rotulos: [{ pc: 'parede', t: 'parede', pr: 1 }, { pc: 'nucleoide', t: 'nucleoide', pr: 2 }, { pc: 'flagelo', t: 'flagelo', pr: 3 }, { pc: 'plasmideo', t: 'plasmídeo', pr: 4 }, { pc: 'membrana', t: 'membrana', pr: 5 }, { pc: 'capsula', t: 'cápsula', pr: 6 }, { pc: 'ribo', t: 'ribossomos', pr: 7 }, { pc: 'fimbria', t: 'fímbrias', pr: 8 }],
    montar(g) {
      const T = g.T, geo = V3.capsula(g, 1, 1.4, g.q.cel ? 30 : 44);
      g.pl = V3.corte(g, g.raiz, [0, 0, -1], 0);
      g.gb = new T.Group(); g.raiz.add(g.gb);
      g.par = V3.solido(g, geo, C.parede, [g.pl], { corte: '#6E8F33', kc: 1, pai: g.gb, pc: 'parede', m: { p: { roughness: .55, sheen: .6, sheenColor: new T.Color('#E8FFB0') }, rim: '#E6FFB0', rimK: .3 } });
      g.mem = V3.solido(g, geo, C.membrana, [g.pl], { corte: '#D45A98', kc: 1, pai: g.gb, pc: 'membrana', m: { p: { roughness: .4 } } }); g.mem.scale.setScalar(.935);
      g.cit = V3.solido(g, geo, '#C25A8E', [g.pl], { corte: CIT, kc: 1, pai: g.gb, pc: 'cito', m: { p: { roughness: .5 } } }); g.cit.scale.setScalar(.9);
      g.capM = V3.filme(g, '#D9C8A0', { cor2: '#FFF3D6', dentro: '#3A3020', base: .06, fr: .5, esc: 1.6, planos: [g.pl] });
      g.cap = V3.peca(g, geo, g.capM, 'capsula', g.gb); g.cap.scale.setScalar(1.17); g.cap.renderOrder = 5;
      g.W = V3.kitV(g, { knobs: 1, cascas: 1, envs: 1, rods: 260 });
      g.pls = V3.plasmideos(g, 4, 'plasmideo');
      g.flM = V3.fis(g, '#E3E0D2', { p: { roughness: .4, clearcoat: .5 }, rimK: .25 });
      g.fl = V3.flagelo(g, 70, g.flM, null, 'flagelo');
    },
    animar(g, P) {
      const S = P.S, t = P.t, W = g.W, deit = V3.deitado(g), al = deit ? 0 : Math.PI / 2;
      const idx = S.sel != null ? S.sel : (((Math.floor(t / 3.2) || 0) % 8) + 8) % 8, on = ORDEM[idx], pul = RED() ? .5 : .35 + .25 * Math.sin(t * 4);
      g.al = al; g.idx = idx; g.gb.rotation.z = Math.PI / 2 + al;
      const L = p => rz(p, al);
      acende(g.par.userData.fr.material, on === 'parede', pul * .6); acende(g.mem.userData.fr.material, on === 'membrana', pul * .6); acende(g.flM, on === 'flagelo', pul);
      g.capM.uniforms.uOp.value = on === 'capsula' ? 1.8 + pul : 1;
      ach(g, 'parede', L([.9, .98, 0])); ach(g, 'membrana', L([-1.3, -.86, 0])); ach(g, 'capsula', L([-.4, 1.16, 0]));
      // nucleoide (gira devagar dentro da célula)
      const sw = RED() ? 0 : Math.sin(t * .4) * .05, kN = on === 'nucleoide' ? 1.3 + pul : 1;
      const Pn = NUC.map(p => L([p[0] + sw, p[1] + Math.sin(p[0] * 3 + t * .6) * .02, p[2]]));
      V3.cadeia(g, W, Pn, .032, { fechado: true, cor: on === 'nucleoide' ? '#9B7BFF' : C.dnaEscuro, info: g.pecas.nucleoide }); ach(g, 'nucleoide', Pn[30]);
      // plasmídeos
      [[1.55, .42, -.32, .17], [-1.75, -.38, -.4, .15]].forEach((q, i) => { const p = L(q); V3.plasmideo(g, g.pls, p, q[3], (RED() ? 0 : t * .5) + i * 2, on === 'plasmideo' ? 1.3 + pul : 1, g.pecas.plasmideo); if (!i) ach(g, 'plasmideo', p); });
      V3.fim(g.pls);
      // ribossomos
      RIB.forEach((q, i) => { const p = L(q); V3.bola(g, p, .048, C.ribo, (on === 'ribo' ? 1.35 + pul : .9) + .15 * hash(i, 4), g.pecas.ribo); if (i === 5) ach(g, 'ribo', p); });
      // fímbrias (só as da metade de trás, presas na parede que ficou)
      FIM.forEach((f, i) => {
        const n = [0, Math.cos(f.a), Math.sin(f.a)]; if (n[2] > .25) return;
        const b = [f.x, n[1] * 1.0, n[2] * 1.0], w = RED() ? 0 : Math.sin(t * 2 + i) * .06, tp = add(b, add(mul(n, f.L), [w, 0, 0]));
        V3.bastao(g, W.rod, L(b), L(tp), .011, on === 'fimbria' ? AM : '#9FAAC0', 1, g.pecas.fimbria); if (i === 9) ach(g, 'fimbria', L(tp));
      });
      // flagelo: gira (a hélice corre para fora)
      const fP = V3.helice([2.38, 0, -.05], [1, 0, 0], 3.3, .26, 2.4, RED() ? 0 : t * 7, 70).map(L);
      g.fl.set(fP, (i, n) => .045 * (1 - .3 * i / n)); ach(g, 'flagelo', fP[44]);
      V3.bola(g, L([2.36, 0, -.05]), .09, '#B8B3A2', 1, g.pecas.flagelo);
      V3.fimKit(W);
      // ficha âmbar na peça da vez (no mesmo ritmo da legenda do desenho plano)
    },
    sobre(g, S) { if (S.sel == null) etapaHud(g, `${g.idx + 1} de 8: ${NOMES[g.idx]}`, 'toque numa peça para ver o que faz'); },
    camera(g, P) { const d = !g.al; return cam(g, P, d ? 4.6 : 2, d ? 1.9 : 5.1, { al: rz([1.3, 0, 0], g.al || 0), th: .32, fi: .24, k: 1.02 }); }
  });

  // =====================================================================================
  // DIVISÃO BINÁRIA E TROCA DE GENES
  // =====================================================================================
  const PE2 = {
    bact: { nome: 'Bactéria', frase: 'Em corte: parede (verde), membrana e citoplasma. Reproduz-se sem sexo, por divisão binária.', cor: C.parede },
    crom: { nome: 'Cromossomo circular', frase: 'É copiado antes da divisão; cada célula-filha leva uma cópia igual.', cor: C.dnaEscuro },
    septo: { nome: 'Parede nova no meio', frase: 'A parede cresce para dentro e separa as duas células-filhas.', cor: C.parede },
    colonia: { nome: 'População', frase: 'Uma vira 2, 4, 8, 16... Em condições ideais, uma bactéria do intestino se divide em cerca de 20 minutos.', cor: C.parede },
    frag: { nome: 'DNA solto no ambiente', frase: 'Pedaços do DNA de uma bactéria morta. Outra bactéria pode absorver um deles: é a transformação.', cor: C.dnaClaro },
    morta: { nome: 'Bactéria morta', frase: 'A parede se rompe e o DNA se espalha em pedaços.', cor: '#8FA25A' },
    pilus: { nome: 'Pilus', frase: 'Tubo que a doadora estica até a receptora. Por ele passa uma cópia do plasmídeo: é a conjugação.', cor: '#D8DDE8' },
    plasmideo: { nome: 'Plasmídeo', frase: 'Círculo extra de DNA. Pode levar genes de resistência a antibióticos, até para outra espécie.', cor: C.plasmideo },
    fago: { nome: 'Bacteriófago', frase: 'Vírus de bactéria. Às vezes empacota por engano um pedaço do DNA da bactéria e o leva para outra: é a transdução.', cor: C.capsideo },
    gene: { nome: 'Gene novo', frase: 'O pedaço de DNA que veio de fora se junta ao cromossomo: a bactéria ganha uma característica nova sem sexo.', cor: C.dnaClaro }
  };
  const TROC = ['Transformação', 'Conjugação', 'Transdução'];
  const R0 = .55, H0 = V3.mHL * R0, CIL = H0 - R0;
  const COL = Array.from({ length: 32 }, (_, i) => ({ c: i % 8, r: (i / 8) | 0, a: (hash(i, 71) - .5) * 1.4 }));
  const ESQ = Array.from({ length: 22 }, (_, i) => ({ d: nrm([(hash(i, 81) - .5) * 2.4, hash(i, 82) - .5, -hash(i, 83) * .6]), s: .045 + hash(i, 84) * .05 }));

  V3.cena('monera/reproducao', {
    fit: 9, raio: 5, bolas: 160, pecas: PE2,
    so2D: S => S.modo === 'placa',
    sair() { botoesTroca(null, null, false); },
    rotulos: [{ pc: 'crom', t: 'cromossomo', pr: 1 }, { pc: 'septo', t: 'parede nova', pr: 2 }, { pc: 'colonia', t: 'população', pr: 3 }, { pc: 'pilus', t: 'pilus', pr: 2 }, { pc: 'plasmideo', t: 'plasmídeo', pr: 1 }, { pc: 'fago', t: 'fago', pr: 2 }, { pc: 'frag', t: 'DNA solto', pr: 3 }, { pc: 'gene', t: 'gene novo', pr: 4 }],
    montar(g) {
      g.pl = V3.corte(g, g.raiz, [0, 0, -1], 0);
      g.B = V3.bacterias(g, 44, g.pl);
      g.W = V3.kitV(g, { knobs: 700, cascas: 4, envs: 1, rods: 700 });
      g.pls = V3.plasmideos(g, 6, 'plasmideo');
      g.piM = V3.fis(g, '#D8DDE8', { p: { roughness: .4, clearcoat: .5 }, rimK: .3 });
      g.pilus = V3.tubo(g, 24, 6, g.piM, null, 'pilus');
      g.dnM = V3.fis(g, C.dnaClaro, { p: { roughness: .4, clearcoat: .5 }, rimK: .3 });
      g.inj = V3.tubo(g, 30, 6, g.dnM, null, 'gene');
      g.q0 = new g.T.Quaternion();
    },
    animar(g, P) {
      const S = P.S, t = P.t, W = g.W, B = g.B, info = g.pecas;
      g.pilus.mesh.visible = false; g.inj.mesh.visible = false; g.modo = S.modo; botoesTroca(g, S, S.modo === 'troca');
      if (S.modo === 'troca') troca(g, P); else if (S.modo !== 'placa') divisao(g, P);
      V3.fimB(B); V3.fim(g.pls); V3.fimKit(W);
    },
    sobre(g, S) {
      botoesTroca(g, S, g.modo === 'troca');
      if (g.modo === 'troca') { etapaHud(g, `${g.q + 1} de 3: ${TROC[g.q]}`, S.q == null ? 'passa sozinho; escolha um botão para fixar' : 'escolhido no botão'); return; }
      if (g.modo === 'placa') return;
      etapaHud(g, 'cada divisão: cerca de 20 min', g.gg ? `depois de cerca de ${g.gg * 20} min: ${2 ** g.gg} bactérias` : 'no começo: 1 bactéria');
    },
    camera(g, P) {
      const d = V3.deitado(g);
      if (g.modo === 'troca') return cam(g, P, d ? 4.3 : 2.1, d ? 1.7 : 3.6, { al: [0, d ? 0 : .4, 0], th: .22, fi: .2 });
      return cam(g, P, d ? 2.6 : 2.2, 2.3, { al: [0, -.2, 0], th: .45, fi: .32 });
    }
  });


  // botões HTML da troca de genes sobre o palco 3D (o canvas 2D por cima não recebe toque no 3D)
  let BT = null;
  function botoesTroca(g, S, on) {
    if (!BT) {
      if (!on) return;
      const tl = document.getElementById('cv').parentElement; BT = document.createElement('div'); BT.className = 'hud m3-troca'; BT.setAttribute('role', 'group'); BT.setAttribute('aria-label', 'Forma de troca de genes');
      BT.innerHTML = TROC.map((n, i) => `<button type="button" data-q="${i}" aria-pressed="false">${n}</button>`).join('');
      if (!document.getElementById('m3-troca-css')) { const st = document.createElement('style'); st.id = 'm3-troca-css'; st.textContent = `.m3-troca{z-index:3;left:50%;transform:translateX(-50%);top:16px;display:flex;gap:8px}
.m3-troca button{font:inherit;font-size:14px;font-weight:600;min-height:44px;padding:0 14px;border-radius:8px;border:1px solid var(--line-strong,#5B6C99);background:rgba(19,26,43,.9);color:var(--txt,#E8EDF7);cursor:pointer;white-space:nowrap}
.m3-troca button:hover{background:var(--panel-2,#1B2440)}.m3-troca button[aria-pressed="true"]{color:var(--amber,#FFB347);border-color:var(--amber,#FFB347)}
.m3-troca button:focus-visible{outline:2px solid var(--focus,#8FD8FF);outline-offset:2px}
@media (max-width:700px){.m3-troca{top:102px;left:10px;right:10px;transform:none}.m3-troca button{flex:1;font-size:13px;padding:0 6px}}`; document.head.appendChild(st); }
      BT.addEventListener('click', e => { const b = e.target.closest('button'); if (!b || !BT.S) return; const q = +b.dataset.q; BT.S.q = BT.S.q === q ? null : q; });
      tl.appendChild(BT);
    }
    BT.hidden = !on; if (!on) return; BT.S = S;
    [...BT.children].forEach((b, i) => b.setAttribute('aria-pressed', S.q === i ? 'true' : 'false'));
  }

  function cromo(g, c, rx, ry, s, k, o = {}) {
    const P = V3.laco(56, rx, ry, .06, s, [c[0], c[1], -.24]);
    const n = Math.max(2, Math.round(P.length * (k == null ? 1 : k)));
    V3.cadeia(g, g.W, n >= P.length ? P : P.slice(0, n), .022, Object.assign({ fechado: n >= P.length, cor: C.dnaEscuro, info: g.pecas.crom }, o));
    return P;
  }

  function divisao(g, P) {
    const t = P.t, B = g.B, info = g.pecas, u = (t % 9) / 9, gg = Math.floor(t / 9) % 6;
    const p1 = sst(0, .22, u), p2 = sst(.2, .58, u), p3 = sst(.55, .82, u), p4 = sst(.84, 1, u);
    g.gg = gg;
    const yc = .75, m = CIL * p2 + (H0 - CIL) * p3 + .32 * p4, dx = [1, 0, 0];
    bact(g, B, [-m, yc, 0], info); bact(g, B, [m, yc, 0], info);
    if (p3 > .2 && p4 < 1) ach(g, 'septo', [0, yc + R0 * .7 * (1 - p3 * .4), 0]);
    // cromossomo e cópia
    const d = (m + (p4 > 0 ? 0 : 0)) * .78;
    const A = cromo(g, [-d, yc], .34, .2, 1.1, 1);
    cromo(g, [d + (1 - p2) * .04, yc + (1 - p2) * .03], .34, .2, 1.1, p1);
    ach(g, 'crom', A[12]);
    // ribossomos espalhados nas duas metades
    for (let i = 0; i < 16; i++) { const s = i % 2 ? 1 : -1, p = [s * m + (hash(i, 5) - .5) * (H0 + m * .6), yc + (hash(i, 6) - .5) * R0 * 1.2, -.08 - hash(i, 7) * .3]; V3.bola(g, p, .035, C.ribo, .9, info.bact); }
    ach(g, 'bact', [-m - H0 * .6, yc + R0 * .9, 0]);
    // população: dobra a cada rodada (as novas crescem no fim da divisão)
    const n = 2 ** gg, nPrev = gg ? n / 2 : 1, cr = .1, sp = .46, y0 = -1.15;
    for (let i = 0; i < n; i++) {
      const c = COL[i], nova = i >= nPrev, k = nova ? sst(.85, 1, u) : 1; if (k <= .02 && nova) continue;
      const p = [(c.c - 3.5) * sp, y0 - c.r * sp * .9, -1.1];
      V3.qy(g, [Math.cos(c.a), Math.sin(c.a), 0], B.q);
      V3.celula(g, B.par, p, cr * (.4 + .6 * k), C.parede, { q: B.q, pc: info.colonia });
      if (i === 0) ach(g, 'colonia', p);
    }
    if (gg === 0 && u < .1) ach(g, 'colonia', [-1.6, y0, -1.1]);
  }
  function bact(g, B, p, info, o = {}) { V3.bact(g, B, p, [1, 0, 0], R0, Object.assign({ iPar: info.bact, iMem: info.bact, iCit: info.bact }, o)); }

  // ---------- troca de genes ----------
  function troca(g, P) {
    const S = P.S, t = P.t, B = g.B, W = g.W, info = g.pecas, deit = V3.deitado(g);
    const auto = Math.floor(t / 11) % 3; S._q3 = auto;
    const q = S.q != null ? S.q : auto, u = (t % 11) / 11; g.q = q;
    const A = deit ? [-2.3, 0, 0] : [0, 1.5, 0], Bc = deit ? [2.3, 0, 0] : [0, -1.5, 0];
    const dAB = nrm(sub(Bc, A)), ed = Math.abs(dAB[0]) * H0 + (1 - Math.abs(dAB[0])) * R0 + .02;
    const eA = add(A, mul(dAB, ed)), eB = sub(Bc, mul(dAB, ed));
    if (q === 0) {
      // transformação: a bactéria A está morta (pedaços de parede e de DNA); a B absorve um pedaço
      const ins = sst(.62, .92, u);
      rompida(g, A, t, info);
      ach(g, 'morta', add(A, [0, .9, 0]));
      bact(g, B, Bc, info);
      cromo(g, Bc, .38, .22, 2.3, 1, { faixa: [10, 10 + Math.round(7 * ins), C.dnaClaro], infoF: info.gene }); if (ins > .3) ach(g, 'gene', add(Bc, [-.2, .25, -.2]));
      for (let i = 0; i < 4; i++) {
        const f = sst(.08 + i * .06, .55 + i * .03, u), s0 = add(A, [(i - 1.5) * .35, (i % 2 ? .45 : -.45), -.2]);
        if (i === 0 && u > .66) continue;
        const pos = lerp3(s0, add(eB, [0, (i - 1.5) * .12, -.2]), i === 0 ? sst(0, 1, f) * (u > .55 ? 1 + sst(.55, .66, u) * .5 : 1) : f * .7);
        fragmento(g, pos, t + i, info.frag, i === 0 || u < .58 ? 1 : .6); if (i === 1) ach(g, 'frag', pos);
      }
    } else if (q === 1) {
      // conjugação: pilus, cópia do plasmídeo passando, receptora com o plasmídeo
      const pr = sst(.05, .3, u), mm = sst(.35, .75, u), gain = sst(.75, .92, u);
      bact(g, B, A, info); bact(g, B, Bc, info);
      cromo(g, A, .36, .2, 1.4, 1); cromo(g, Bc, .36, .2, 2.6, 1); ach(g, 'crom', add(A, [-.3, .15, -.25]));
      const mid = add(lerp3(eA, eB, .5), deit ? [0, .25, 0] : [.3, 0, 0]);
      const fio = []; for (let i = 0; i < 24; i++) { const s = i / 23 * pr; fio.push(V.bez(eA, mid, eB, s)); }
      if (pr > .02) { g.pilus.set(fio, .045); g.pilus.mesh.visible = true; ach(g, 'pilus', fio[Math.round(fio.length * .6)]); }
      const pA = add(A, [.35, deit ? .18 : -.18, -.22]), pB = add(Bc, [-.35, .18, -.22]);
      V3.plasmideo(g, g.pls, pA, .13, t * .6, 1, info.plasmideo); ach(g, 'plasmideo', pA);
      if (mm > 0 && mm < 1) V3.plasmideo(g, g.pls, trilha([pA, eA, mid, eB, pB], mm), .1, t, 1.2, info.plasmideo);
      if (gain > 0) V3.plasmideo(g, g.pls, pB, .13 * gain, t * .6 + 1, 1, info.plasmideo);
    } else {
      // transdução: o fago sai da A (que se rompe) levando um pedaço do DNA dela e o injeta na B
      const ls = sst(.05, .22, u), mv = sst(.25, .55, u), ct = sst(.55, .7, u), dn = sst(.6, .8, u), k = sst(.76, .95, u);
      if (ls < .6) { bact(g, B, A, info, { k: 1 - ls * .5 }); cromo(g, A, .36, .2, 1.4, 1, { pic: ls * .9, cor: C.dnaClaro, info: info.frag }); }
      ESQ.forEach((e, i) => { if (ls <= .3) return; const p = add(A, mul(e.d, .7 + ls * (1 + hash(i, 85)))); V3.setQ(g, g.q0, hash(i, 86) * 3 + ls * 2, hash(i, 87) * 3, 0); V3.put(g, W.knob, add(p, [0, 0, -.2]), g.q0, e.s * 1.3, e.s * .3, e.s, '#8FA25A', .9, info.morta); });
      bact(g, B, Bc, info); cromo(g, Bc, .38, .22, 2.6, 1, { faixa: [12, 12 + Math.round(6 * k), C.dnaClaro], infoF: info.gene }); if (k > .3) ach(g, 'gene', add(Bc, [.1, .25, -.2]));
      if (u > .12) {
        const topo = add(Bc, [0, R0 + .02, 0]), ini = add(A, deit ? [.4, .45, .2] : [.9, .2, .3]), base = lerp3(ini, topo, mv), s = .42;
        V3.setQ(g, g.q0, 0, RED() ? .5 : .5 + t * .2 * (1 - mv), (1 - mv) * .25);
        const f = V3.fago(g, W, base, g.q0, s, { pernas: .3 + .7 * sst(.45, .55, u), contr: ct, info: { cab: info.fago, cauda: info.fago, fibra: info.fago, base: info.fago } });
        ach(g, 'fago', add(f.cabeca, [.15, .2, 0]));
        // o pedaço de DNA da A dentro da cabeça, depois descendo para a B
        if (dn <= 0) V3.bola(g, f.cabeca, s * .32, C.dnaClaro, .9, info.frag);
        else if (k < 1) { const Pi = []; for (let i = 0; i < 18; i++) Pi.push(add(topo, [Math.sin(i * .9) * .05, -i * .022 * dn * 1.6, -.1 - i * .006])); g.inj.set(Pi, .022); g.inj.mesh.visible = true; }
      }
    }
  }

  // bactéria morta: parede em cacos (com um rombo) e o cromossomo picotado em pedaços soltos
  function rompida(g, A, t, info) {
    const W = g.W, q = g.q0, cy = Math.max(0, H0 - R0);
    for (let i = 0; i < 64; i++) {
      const x = (hash(i, 91) - .5) * 2 * (cy + R0 * .6), a = Math.PI * (.5 + hash(i, 92));
      const xc = cl(x, -cy, cy), dx = x - xc, rr = Math.sqrt(Math.max(0, R0 * R0 - dx * dx)), n = nrm([dx, Math.cos(a) * rr, Math.sin(a) * rr]);
      const rombo = x > -.1 && x < .55 && Math.cos(a) > -.2; if (rombo || hash(i, 93) < .22) continue;
      const sai = .03 + hash(i, 94) * .1 + (Math.abs(x - .22) < .6 ? .12 : 0), p = add(A, add([xc, 0, 0], mul(n, R0 + sai)));
      V3.qy(g, n, q); V3.put(g, W.knob, p, q, .085 + hash(i, 95) * .05, .022, .07 + hash(i, 96) * .05, C.parede, .75, info.morta);
    }
    // cacos que saíram pelo rombo
    for (let i = 0; i < 8; i++) { const d = nrm([.3 + hash(i, 97) * .5, .5 + hash(i, 98), -hash(i, 99) * .6]), p = add(A, add([.22, 0, 0], mul(d, R0 + .25 + hash(i, 100) * .45 + (RED() ? 0 : Math.sin(t * .6 + i) * .03)))); V3.setQ(g, q, hash(i, 101) * 3, t * .15 + i, 0); V3.put(g, W.knob, p, q, .07, .02, .06, C.parede, .7, info.morta); }
    // pedaços do cromossomo, soltos dentro e fora
    for (let i = 0; i < 7; i++) fragmento(g, add(A, [(hash(i, 102) - .5) * 1.4, (hash(i, 103) - .5) * .5 + (i > 4 ? .55 : 0), -.18 - hash(i, 104) * .2]), i * 2.1 + (RED() ? 0 : t * .3), info.frag, .85);
    ach(g, 'morta', add(A, [-.6, R0 + .15, 0]));
  }
  function fragmento(g, p, s, info, k) {
    for (let j = 0; j < 4; j++) { const a = add(p, [(j - 2) * .09, Math.sin(j * 1.7 + s) * .05, Math.cos(j + s) * .03]), b = add(p, [(j - 1) * .09, Math.sin((j + 1) * 1.7 + s) * .05, Math.cos(j + 1 + s) * .03]); V3.bastao(g, g.W.rod, a, b, .034, C.dnaClaro, k, info); }
  }
})();
