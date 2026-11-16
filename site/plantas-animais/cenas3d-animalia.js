/* LAB Plantas e animais: cenas 3D dos animais (Martin), sobre o kit do módulo Vírus (vir3d.js e vir3d-pecas.js) e as
   peças deste módulo (plantas3d-pecas.js).
   O que mudou na evolução dos animais: o corpo de cada plano aberto em cunha, com o corte transversal e o longitudinal
   pintados em camadas (ectoderme, mesoderme, endoderme, cavidade e tubo digestório). Pólipo diblástico de simetria radial,
   verme acelomado, pseudocelomado e celomado de simetria bilateral (com boca e ânus quando o tubo é completo) e as duas
   gástrulas com o blastóporo que vira boca ou ânus. As cinco marcas viram botões sobre o palco.
   Esponja em corte: a água com corante entra pelos poros, passa pelos coanócitos e sai pelo ósculo.
   O jogo da ficha, o cnidócito, o jogo de pólipo ou medusa e o recife continuam no desenho plano. */
'use strict';
(function () {
  const V3 = window.VIR3D; if (!V3 || !V3.paFolha) return;
  const { V } = V3, { cl, mix, sst, add, mul, nrm, hash, lerp3, trilha, fr, TAU } = V;
  const RED = () => V3.REDUZ();
  const limpa2D = () => { try { X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.clearRect(0, 0, X.canvas.width, X.canvas.height); X.restore(); } catch (e) { /* sem canvas 2D */ } };
  const ach = (g, id, p) => { g.anc[id] = p; g.vis[id] = true; };
  const cam = (g, P, hx, hy, o = {}) => V3.viva({ th: o.th == null ? .3 : o.th, fi: o.fi == null ? .22 : o.fi, d: V3.enquadrar(g, hx, hy) * (o.k || 1.05), al: o.al || [0, 0, 0] }, P.t, o.viva == null ? .5 : o.viva);
  const AM = '#FFB347', ECT = '#6FB1E8', MES = '#E5646B', END = '#F2C94C', CAV = '#2F4E86', LUM = '#222B44';

  // =====================================================================================
  // O QUE MUDOU NA EVOLUÇÃO DOS ANIMAIS: PLANOS DE CORPO
  // =====================================================================================
  const PE1 = {
    ect: { nome: 'Ectoderme', frase: 'Folheto de fora: forma a pele (epiderme) e o sistema nervoso.', cor: ECT },
    mes: { nome: 'Mesoderme', frase: 'Folheto do meio: forma músculos, ossos, sangue e os órgãos de excreção e reprodução. Só nos triblásticos.', cor: MES },
    end: { nome: 'Endoderme', frase: 'Folheto de dentro: reveste o tubo digestório e forma glândulas como o fígado.', cor: END },
    gut: { nome: 'Tubo digestório', frase: 'Por onde passa o alimento. Incompleto (só boca) em cnidários e platelmintos; completo (boca e ânus) dos nematódeos em diante.', cor: '#8C9BBF' },
    gv: { nome: 'Cavidade gastrovascular', frase: 'Saco com uma só abertura, que serve de boca e de ânus. Digere e distribui o alimento.', cor: '#8C9BBF' },
    pseudo: { nome: 'Pseudoceloma', frase: 'Cavidade entre a mesoderme e a endoderme: a mesoderme reveste só a parede do corpo (nematódeos).', cor: CAV },
    celoma: { nome: 'Celoma', frase: 'Cavidade toda revestida por mesoderme, por fora e em volta do tubo digestório. Abriga os órgãos com espaço para se mexer.', cor: CAV },
    boca: { nome: 'Boca', frase: 'Entrada do tubo digestório.', cor: '#C9D3E6' },
    anus: { nome: 'Ânus', frase: 'Saída do tubo digestório. Com boca e ânus, o alimento anda num sentido só e cada parte do tubo se especializa.', cor: '#C9D3E6' },
    simetria: { nome: 'Plano de simetria', frase: 'Divide o corpo em metades iguais. Radial: vários planos passam pelo eixo. Bilateral: um só plano separa direita e esquerda.', cor: AM },
    cabeca: { nome: 'Cabeça (cefalização)', frase: 'Com a simetria bilateral, os órgãos dos sentidos e os nervos se juntam na frente do corpo, que vai primeiro.', cor: '#E8EDF7' },
    tentaculo: { nome: 'Tentáculos', frase: 'Em volta da boca, com cnidócitos que capturam presas.', cor: ECT },
    blast: { nome: 'Blastóporo', frase: 'Abertura da gástrula, o embrião em forma de copo. Vira boca nos protostômios e ânus nos deuterostômios.', cor: AM },
    arq: { nome: 'Arquêntero', frase: 'O intestino primitivo do embrião, revestido por endoderme.', cor: END }
  };
  const MKN = ['tecidos verdadeiros', 'simetria bilateral e mesoderme', 'boca e ânus', 'celoma', 'protostômios e deuterostômios'];
  const MKC = ['tecidos', 'bilateral', 'boca e ânus', 'celoma', 'blastóporo'];
  const MKD = [
    'Todos os animais têm tecidos, menos as esponjas. Os cnidários têm só duas camadas, ectoderme e endoderme (diblásticos), e simetria radial.',
    'Surgem a simetria bilateral, a cabeça e a mesoderme (triblásticos). Aqui a mesoderme preenche o corpo: acelomado, como nos platelmintos.',
    'O tubo digestório fica completo, com boca e ânus. Surge uma cavidade entre a mesoderme e a endoderme: pseudocelomado, como nos nematódeos.',
    'A cavidade fica toda revestida por mesoderme: celomado (moluscos, anelídeos, artrópodes, equinodermos e cordados).',
    'O blastóporo vira a boca nos protostômios e o ânus nos deuterostômios (equinodermos e cordados).'
  ];
  const HB = 1.45; // meio comprimento do corpo bilateral
  // camadas [cor, raio, peça]; a última é a luz do tubo
  const CAM = {
    ace: [[ECT, .62, 'ect'], [MES, .53, 'mes'], [END, .3, 'end'], [LUM, .16, 'gut']],
    pse: [[ECT, .62, 'ect'], [MES, .53, 'mes'], [CAV, .43, 'pseudo'], [END, .3, 'end'], [LUM, .16, 'gut']],
    cel: [[ECT, .62, 'ect'], [MES, .53, 'mes'], [CAV, .44, 'celoma'], [MES, .35, 'mes'], [END, .27, 'end'], [LUM, .14, 'gut']]
  };

  function basica(g, cor) { const m = new g.T.MeshBasicMaterial({ color: new g.T.Color(cor).multiplyScalar(.92), side: g.T.DoubleSide }); g.mats.push(m); return m; }
  function forma(g, f) { const T = g.T, s = new T.Shape(); f(s); const geo = new T.ShapeGeometry(s, g.q.cel ? 14 : 22); g.geos.push(geo); return geo; }
  // metade de um disco (u >= 0), para o corte transversal
  const meioDisco = r => s => { s.moveTo(0, -r); s.absarc(0, 0, r, -Math.PI / 2, Math.PI / 2, false); s.lineTo(0, -r); };
  // meia cápsula deitada (x de 0 até h + r), para o corte longitudinal; ab = vai até a ponta como abertura
  const meiaCap = (r, h, ab) => s => { if (ab) { s.moveTo(0, -r); s.lineTo(ab, -r); s.lineTo(ab, r); s.lineTo(0, r); s.lineTo(0, -r); return; } s.moveTo(0, -r); s.lineTo(h, -r); s.absarc(h, 0, r, -Math.PI / 2, Math.PI / 2, false); s.lineTo(0, r); s.lineTo(0, -r); };
  // perfil de meia cápsula em pé (u de 0 até r), para o pólipo; topo aberto em yTop
  const meioPerfil = (r, h, yTop) => s => { s.moveTo(0, -h - r); s.absarc(0, -h, r, -Math.PI / 2, 0, false); if (yTop != null) { s.lineTo(r, yTop); s.lineTo(0, yTop); } else { s.lineTo(r, h); s.absarc(0, h, r, 0, Math.PI / 2, false); } s.lineTo(0, -h - r); };

  function corpoBilateral(g, tp) {
    const T = g.T, gr = new T.Group(); g.raiz.add(gr);
    const L = CAM[tp], R0 = L[0][1], lumAb = HB + R0 + .03;
    // superfície de fora (cortada em cunha) e as tampas de corte, de fora para dentro
    const sup = V3.solido(g, V3.capsula(g, 1, HB / R0, g.q.cel ? 26 : 36), ECT, g.cunha, { corte: ECT, kc: .9, pai: gr, pc: 'ect', m: { p: { roughness: .5, sheen: .5, sheenColor: new T.Color('#E0F0FF') }, rim: '#D8ECFF', rimK: .3 } });
    sup.scale.setScalar(R0); sup.rotation.z = -Math.PI / 2;
    L.forEach(([cor, r, pc], i) => {
      const m = basica(g, cor), lum = i === L.length - 1;
      const a = V3.peca(g, forma(g, meioDisco(r)), m, pc, gr); a.rotation.y = -Math.PI / 2; a.position.x = .002 + i * .003;
      const b = V3.peca(g, forma(g, meiaCap(r, HB + (R0 - r) * .2, lum ? lumAb : 0)), m, pc, gr); b.position.z = .002 + i * .003;
    });
    return gr;
  }
  function corpoPolipo(g) {
    const T = g.T, gr = new T.Group(); g.raiz.add(gr);
    const h = .7, top = h + .65;
    const s = V3.solido(g, V3.capsula(g, 1, h / .6, g.q.cel ? 26 : 36), ECT, g.cunha, { corte: ECT, kc: .9, pai: gr, pc: 'ect', m: { p: { roughness: .5, sheen: .5, sheenColor: new T.Color('#E0F0FF') }, rim: '#D8ECFF', rimK: .3 } });
    s.scale.setScalar(.6);
    [[ECT, .6, 'ect', null], [END, .48, 'end', null], [LUM, .3, 'gv', top]].forEach(([cor, r, pc, yt], i) => {
      const m = basica(g, cor), geo = forma(g, meioPerfil(r, h + (.6 - r) * .1, yt));
      const a = V3.peca(g, geo, m, pc, gr); a.rotation.y = -Math.PI / 2; a.position.x = .002 + i * .003;
      const b = V3.peca(g, geo, m, pc, gr); b.position.z = .002 + i * .003;
    });
    return gr;
  }
  function gastrula(g, x) {
    const T = g.T, gr = new T.Group(); g.raiz.add(gr); gr.position.x = x;
    V3.solido(g, V3.esfera(g, g.q.cel ? 28 : 40), ECT, [g.meia], { corte: ECT, kc: .9, pai: gr, pc: 'ect', m: { p: { roughness: .5 }, rimK: .3 } }).scale.setScalar(.72);
    const C = [[ECT, s => { s.absarc(0, 0, .72, 0, TAU, false); }, 'ect'], ['#24304F', s => { s.absarc(0, 0, .58, 0, TAU, false); }, null],
      [END, s => { s.moveTo(-.3, -.8); s.lineTo(-.3, .05); s.absarc(0, .05, .3, Math.PI, 0, true); s.lineTo(.3, -.8); s.lineTo(-.3, -.8); }, 'arq'],
      [LUM, s => { s.moveTo(-.14, -.8); s.lineTo(-.14, .05); s.absarc(0, .05, .14, Math.PI, 0, true); s.lineTo(.14, -.8); s.lineTo(-.14, -.8); }, 'arq']];
    C.forEach(([cor, f, pc], i) => { const b = V3.peca(g, forma(g, f), basica(g, cor), pc, gr); b.position.z = .002 + i * .003; });
    return gr;
  }

  V3.cena('animalia/novidades', {
    fit: 10, raio: 7, bolas: 120, pecas: PE1,
    so2D: S => S.modo !== 'clado',
    sair() { botoes(null, null, false); limpa2D(); },
    rotulos: [{ pc: 'ect', t: 'ectoderme', pr: 1 }, { pc: 'mes', t: 'mesoderme', pr: 1 }, { pc: 'end', t: 'endoderme', pr: 1 }, { pc: 'pseudo', t: 'pseudoceloma', pr: 2 }, { pc: 'celoma', t: 'celoma', pr: 2 },
      { pc: 'gut', t: 'tubo digestório', pr: 3 }, { pc: 'gv', t: 'cavidade gastrovascular', pr: 3 }, { pc: 'boca', t: 'boca', pr: 4 }, { pc: 'anus', t: 'ânus', pr: 4 }, { pc: 'tentaculo', t: 'tentáculos', pr: 5 },
      { pc: 'cabeca', t: 'cabeça', pr: 6 }, { pc: 'blast', t: 'blastóporo', pr: 2 }, { pc: 'arq', t: 'arquêntero', pr: 3 }],
    montar(g) {
      const T = g.T;
      const a = V3.corte(g, g.raiz, [-1, 0, 0], 0), b = V3.corte(g, g.raiz, [0, 0, -1], 0); g.cunha = [a, b]; g.meia = V3.corte(g, g.raiz, [0, 0, -1], 0);
      g.W = V3.kitV(g, { knobs: 1, cascas: 1, envs: 1, rods: 120 });
      g.corpos = { dib: corpoPolipo(g), ace: corpoBilateral(g, 'ace'), pse: corpoBilateral(g, 'pse'), cel: corpoBilateral(g, 'cel') };
      g.gas = [gastrula(g, -1.05), gastrula(g, 1.05)];
      // a cunha só corta onde os dois planos cortam
      g.mats.forEach(m => { if (m.clippingPlanes && m.clippingPlanes.length === 2) m.clipIntersection = true; });
      g.selU = null; g.selT = -9;
    },
    animar(g, P) {
      const S = P.S, t = P.t, W = g.W, info = g.pecas;
      const sel = S.sel != null ? S.sel : RED() ? 0 : Math.floor(t / 6) % 5;
      if (sel !== g.selU) { g.selU = sel; g.selT = t; }
      g.mk = sel; botoes(g, S, true);
      const tp = ['dib', 'ace', 'pse', 'cel', 'blas'][sel], e = RED() ? 1 : E().out(cl((t - g.selT) / .6, 0, 1)), s = .9 + .1 * e;
      Object.keys(g.corpos).forEach(k => { const c = g.corpos[k]; c.visible = k === tp; c.scale.setScalar(s); });
      g.gas.forEach(c => { c.visible = tp === 'blas'; c.scale.setScalar(s); });
      if (tp === 'dib') polipo(g, t, s, info);
      else if (tp === 'blas') blas(g, s, info);
      else verme(g, tp, s, info);
      V3.fimKit(W);
    },
    legenda(g) { const i = g.mk || 0; return `<b>${i + 1}. ${MKN[i]}</b>. ${MKD[i]}`; },
    camera(g, P) {
      const d = V3.deitado(g), tp = g.mk;
      if (tp === 0) return cam(g, P, d ? 2.6 : 1.5, d ? 2.3 : 2.6, { al: [0, .1, 0], th: .62, fi: .3 });
      if (tp === 4) return cam(g, P, d ? 2.4 : 1.95, d ? 1.4 : 2.2, { al: [0, -.05, 0], th: .2, fi: .12 });
      return cam(g, P, d ? 2.6 : 2.4, d ? 1.4 : 2.4, { al: [.1, 0, 0], th: .55, fi: .3 });
    }
  });
  const E = () => V3.E();
  // contorno de um plano de simetria (bastões âmbar)
  function moldura(g, c, u, v, a, b, info) { const W = g.W, P = [add(c, add(mul(u, a), mul(v, b))), add(c, add(mul(u, -a), mul(v, b))), add(c, add(mul(u, -a), mul(v, -b))), add(c, add(mul(u, a), mul(v, -b)))]; for (let i = 0; i < 4; i++) V3.bastao(g, W.rod, P[i], P[(i + 1) % 4], .012, AM, 1.1, info); return P[0]; }
  function polipo(g, t, s, info) {
    const W = g.W, top = (.7 + .6) * s;
    // tentáculos em volta da boca
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * TAU + .2; let p = [Math.cos(a) * .42 * s, top - .08, Math.sin(a) * .42 * s];
      if (Math.cos(a) > .2 && Math.sin(a) > .2) continue; // ficaria dentro da cunha aberta
      for (let j = 1; j <= 6; j++) { const w = RED() ? 0 : Math.sin(t * 1.6 + i + j * .6) * .08, q = add(p, [Math.cos(a) * (.12 + w), .16 - j * .012, Math.sin(a) * (.12 + w)]); V3.bastao(g, W.rod, p, q, .045 * (1 - j * .1), ECT, 1, info.tentaculo); p = q; }
      if (i === 3) ach(g, 'tentaculo', p);
    }
    V3.put(g, g.mS, [-.12 * s, top - .02, -.12 * s], null, .12 * s, .03, .12 * s, LUM, 1, info.boca); ach(g, 'boca', [-.15, top + .05, -.15]);
    // três planos de simetria radial
    for (let k = 0; k < 3; k++) { const a = k / 3 * Math.PI + .3; const p = moldura(g, [0, .15 * s, 0], [Math.cos(a), 0, Math.sin(a)], [0, 1, 0], .95 * s, 1.35 * s, info.simetria); if (k === 1) ach(g, 'simetria', p); }
    ach(g, 'ect', [-.45 * s, -.2, .35]); ach(g, 'end', [.003, -.3 * s, .39 * s]); ach(g, 'gv', [.15 * s, .55 * s, .02]);
    V3.ficha(g, [0, -1.35 * s, 0], 'simetria radial', AM, { pr: 1, dy: 1 });
  }
  function verme(g, tp, s, info) {
    const R = .62 * s, xe = (HB + .62) * s;
    // cabeça com manchas oculares (frente, +x) e as aberturas
    V3.put(g, g.mS, [xe * .86, R * .55, -R * .45], null, .06, .06, .04, '#1A1F2E', 1, info.cabeca); ach(g, 'cabeca', [xe * .9, R * .9, -R * .4]);
    ach(g, 'boca', [xe + .05, 0, .02]);
    if (tp !== 'ace') { V3.put(g, g.mS, [-xe + .02, 0, 0], null, .02, .1 * s, .1 * s, LUM, 1, info.anus); ach(g, 'anus', [-xe - .05, 0, 0]); }
    const p = moldura(g, [0, 0, 0], [1, 0, 0], [0, 1, 0], xe + .25, R + .25, info.simetria); ach(g, 'simetria', p);
    const L = CAM[tp];
    ach(g, 'ect', [-.7 * s, R * .9, R * .3]); ach(g, 'end', [.003, -L.find(c => c[2] === 'end')[1] * s * .85, .3 * s * .5]);
    ach(g, 'mes', [.6 * s, -.47 * s, .01]); ach(g, 'gut', [1.0 * s, 0, .02]);
    if (tp === 'pse') ach(g, 'pseudo', [.003, .38 * s, .15 * s]); if (tp === 'cel') ach(g, 'celoma', [.003, .4 * s, .15 * s]);
    V3.ficha(g, [-.6 * s, -R - .45, 0], 'simetria bilateral', AM, { pr: 1, dy: 1 });
  }
  function blas(g, s, info) {
    ach(g, 'blast', [-1.05 * s, -.75 * s, .05]); ach(g, 'arq', [1.05 * s, .1 * s, .02]); ach(g, 'ect', [1.05 * s + .55 * s, .45 * s, 0]);
    V3.ficha(g, [-1.05 * s + .3, -.8 * s, 0], 'vira boca', AM, { pr: 1, dx: 1, dy: 0 }); V3.ficha(g, [1.05 * s + .3, -.8 * s, 0], 'vira ânus', AM, { pr: 1, dx: 1, dy: 0 });
    V3.ficha(g, [-1.05 * s, .9 * s, 0], 'protostômio', '#C9D3E6', { pr: 2, dy: -1 }); V3.ficha(g, [1.05 * s, .9 * s, 0], 'deuterostômio', '#C9D3E6', { pr: 2, dy: -1 });
  }

  // botões das cinco marcas sobre o palco (o canvas 2D por cima não recebe toque no 3D)
  let BT = null;
  function botoes(g, S, on) {
    if (!BT) {
      if (!on) return;
      const tl = document.getElementById('cv').parentElement; BT = document.createElement('div'); BT.className = 'hud pa-marcas'; BT.setAttribute('role', 'group'); BT.setAttribute('aria-label', 'Marcas do cladograma');
      BT.innerHTML = MKC.map((n, i) => `<button type="button" data-q="${i}" aria-pressed="false" aria-label="${i + 1}. ${MKN[i]}"><b>${i + 1}</b><span>${n}</span></button>`).join('');
      if (!document.getElementById('pa-marcas-css')) {
        const st = document.createElement('style'); st.id = 'pa-marcas-css'; st.textContent = `.pa-marcas{z-index:3;left:16px;top:64px;display:flex;flex-direction:column;gap:6px}.pa-marcas[hidden]{display:none}
.pa-marcas button{font:inherit;font-size:14px;font-weight:600;min-height:44px;padding:0 12px 0 6px;display:flex;align-items:center;gap:8px;border-radius:8px;border:1px solid var(--line-strong,#5B6C99);background:rgba(19,26,43,.9);color:var(--txt,#E8EDF7);cursor:pointer;white-space:nowrap;text-align:left}
.pa-marcas button b{display:inline-grid;place-items:center;width:28px;height:28px;border-radius:50%;background:var(--amber,#FFB347);color:#0B0F1C;font-size:13px;flex:none}
.pa-marcas button:hover{background:var(--panel-2,#1B2440)}.pa-marcas button[aria-pressed="true"]{color:var(--amber,#FFB347);border-color:var(--amber,#FFB347)}
.pa-marcas button:focus-visible{outline:2px solid var(--focus,#8FD8FF);outline-offset:2px}
@media (max-width:700px){.pa-marcas{top:56px;left:10px;right:10px;flex-direction:row}.pa-marcas button{flex:1;justify-content:center;padding:0}.pa-marcas button span{display:none}}`;
        document.head.appendChild(st);
      }
      BT.addEventListener('click', e => { const b = e.target.closest('button'); if (!b || !BT.S) return; BT.S.sel = +b.dataset.q; });
      tl.appendChild(BT);
    }
    BT.hidden = !on; if (!on) return; BT.S = S;
    [...BT.children].forEach((b, i) => b.setAttribute('aria-pressed', g && g.mk === i ? 'true' : 'false'));
  }

  // =====================================================================================
  // ESPONJA EM CORTE
  // =====================================================================================
  const PE2 = {
    parede: { nome: 'Parede da esponja', frase: 'Células pouco especializadas, que não formam tecidos verdadeiros, sustentadas por espículas. Esponjas não têm órgãos.', cor: '#C9B38A' },
    poro: { nome: 'Poros', frase: 'Furinhos por toda a parede: é por onde a água entra.', cor: '#3A2E1E' },
    coanocito: { nome: 'Coanócitos', frase: 'Células com flagelo e colarinho que forram o lado de dentro. O flagelo bate, puxa a água e o colarinho prende o alimento.', cor: '#E5A56B' },
    atrio: { nome: 'Átrio (cavidade central)', frase: 'Por onde a água passa antes de sair. Não é um tubo digestório: a digestão acontece dentro das células.', cor: '#5AA9FF' },
    osculo: { nome: 'Ósculo', frase: 'A abertura grande no alto, por onde a água sai.', cor: '#C9B38A' },
    agua: { nome: 'Água com corante', frase: 'O corante azul mostra o caminho: entra pelos poros e sai pelo ósculo.', cor: '#5AA9FF' },
    alimento: { nome: 'Partículas de alimento', frase: 'Capturadas pelos coanócitos: a esponja é filtradora.', cor: AM },
    espicula: { nome: 'Espículas', frase: 'Agulhas de calcário ou sílica que sustentam o corpo. Muitas esponjas têm também fibras de espongina.', cor: '#F2F4F8' }
  };
  // perfil da esponja: raio de fora e de dentro ao longo da altura
  const HE = 2.3, ro = f => .55 + .32 * Math.sin(f * Math.PI * .9) - .08 * f, ri = f => ro(f) - .2;
  V3.cena('animalia/poriferos-cnidarios', { sair: limpa2D,
    fit: 9, raio: 5, bolas: 260, pecas: PE2,
    so2D: S => S.modo !== 'esp',
    rotulos: [{ pc: 'poro', t: 'poros: a água entra', pr: 1 }, { pc: 'osculo', t: 'ósculo: a água sai', pr: 1 }, { pc: 'coanocito', t: 'coanócitos', pr: 2 }, { pc: 'atrio', t: 'átrio', pr: 3 }, { pc: 'alimento', t: 'alimento', pr: 4 }, { pc: 'espicula', t: 'espículas', pr: 5 }],
    montar(g) {
      const T = g.T, n = 16, perf = [[.001, 0]];
      for (let i = 0; i <= n; i++) perf.push([ro(i / n), i / n * HE]);
      for (let i = n; i >= 0; i--) perf.push([ri(i / n), Math.max(.18, i / n * HE)]);
      perf.push([.001, .18]);
      g.pl = V3.corte(g, g.raiz, [0, 0, -1], 0);
      V3.solido(g, V3.torno(g, perf, g.q.cel ? 28 : 40, 'pa-esponja'), '#C9B38A', [g.pl], { corte: '#E2CDA0', kc: 1, pc: 'parede', m: { p: { roughness: .85, sheen: .4, sheenColor: new T.Color('#FFF0D0') }, rimK: .15 } });
      g.base = V3.peca(g, V3.cilindro(g, 24), V3.fis(g, '#4A3A2A', { p: { roughness: .95 }, rimK: .05 }), null); g.base.scale.set(1.15, .1, 1.0); g.base.position.y = -.06;
      g.W = V3.kitV(g, { knobs: 1, cascas: 1, envs: 1, rods: 160 });
    },
    animar(g, P) {
      const t = P.t, W = g.W, info = g.pecas, rv = RED() ? 0 : 1;
      g.fichas.length = 0; g.textos.length = 0; // a esponja não tem fichas: descarta as da cena do pólipo, que ficavam atrás da legenda
      // poros (lado de trás e bordas do corte) e espículas na parede cortada
      for (let i = 0; i < 26; i++) {
        const f = .12 + (i % 7) * .12, a = Math.PI * (1.05 + (i / 26) * .9) + hash(i, 1) * .2, r = ro(f) + .005;
        V3.put(g, g.mS, [Math.cos(a) * r, f * HE, Math.sin(a) * r], null, .045, .06, .045, '#3A2E1E', 1, info.poro);
      }
      for (let i = 0; i < 18; i++) { const f = .1 + (i / 18) * .8, sd = i % 2 ? 1 : -1, x = sd * (ri(f) + .1), y = f * HE; V3.bastao(g, W.rod, [x - .06, y - .05, .004], [x + .06, y + .05, .004], .008, '#F2F4F8', 1, info.espicula); }
      ach(g, 'espicula', [ri(.55) + .1, .55 * HE, .01]);
      ach(g, 'poro', [-ro(.45) - .02, .45 * HE, -.05]); ach(g, 'osculo', [ro(1) * .7, HE + .05, 0]); ach(g, 'atrio', [0, HE * .35, -.2]);
      // coanócitos forrando o lado de dentro, com flagelo que bate
      for (let i = 0; i < 30; i++) {
        const f = .14 + (i % 6) * .14, a = Math.PI * (1.08 + (Math.floor(i / 6) / 5) * .84), r = ri(f) - .04, b = [Math.cos(a) * r, f * HE, Math.sin(a) * r];
        V3.put(g, g.mS, b, null, .05, .07, .05, '#E5A56B', 1, info.coanocito);
        const w = Math.sin(t * 9 * rv + i * 1.7) * .05, c = [-Math.cos(a), 0, -Math.sin(a)];
        V3.bastao(g, W.rod, add(b, mul(c, .05)), add(add(b, mul(c, .2)), [0, w, 0]), .006, '#F7D9A8', 1, info.coanocito);
        if (i === 9) ach(g, 'coanocito', b);
      }
      // água com corante: de fora, pelos poros (nas bordas do corte), até o átrio e para fora pelo ósculo
      const N = g.q.cel ? 14 : 22;
      for (let i = 0; i < N; i++) {
        const f = fr(t * .12 * rv + i / N), sd = i % 2 ? 1 : -1, yk = (.15 + .7 * ((i * 7) % N) / N), y = yk * HE, z = -.05 - (i % 3) * .06;
        const path = [[sd * (ro(yk) + .7), y, z], [sd * (ro(yk) + .02), y, z], [sd * (ri(yk) - .1), y, z], [sd * .1, y + .15, z * .5], [sd * .05, HE + .1, -.05], [sd * .2, HE + .9, -.05]];
        const p = trilha(path, f), a = f > .9 ? 1 - sst(.9, 1, f) : 1;
        if (a > .05) V3.bola(g, p, .04 * a, '#5AA9FF', 1.1, info.agua);
        if (i === 2) ach(g, 'agua', p);
        // partícula de alimento presa no coanócito
        if (i % 4 === 0) { const q = trilha(path, Math.min(f, .3)); if (f < .55) V3.bola(g, q, .028, AM, 1.1, info.alimento); if (i === 0 && f < .55) ach(g, 'alimento', q); }
      }
      V3.fimKit(W);
    },
    camera(g, P) {
      const d = V3.deitado(g);
      return cam(g, P, d ? 1.9 : 1.3, d ? 1.6 : 1.9, { al: [0, 1.2, 0], th: .25, fi: .3 });
    }
  });
})();
