/* LAB Citogenética: cenas 3D do ciclo celular (Martin). Interfase (o anel do ciclo continua em 2D, por cima, e a célula
   do meio ganha volume), pontos de checagem com aprovado ou barrado, e o câncer num epitélio em volume, com uma célula
   mutante que se divide sem controle, atravessa a lâmina basal e cai no sangue. Tudo desenhado em código. */
'use strict';
(function () {
  if (!window.CITO3D) return;
  const C3 = CITO3D, { cl, mix, add, sub, mul, nrm, len, lerp3, hash, TAU } = C3.V;
  const RED = () => window.MOL3D && MOL3D.reduz;
  const R0 = 100, KW = .1;
  const sst = x => { x = cl(x, 0, 1); return x * x * (3 - 2 * x); };

  // estados da célula da interfase (os mesmos da cena 2D, centrados na origem)
  function estadosInterfase(K) {
    const r = R0, M = K.mkMitose(0, 0, r, { labs: false }), g2 = M[0];
    const k = (q, d, same) => Object.assign({}, g2, { labs: [], cells: [{ x: 0, y: 0, r: r * q }, { x: 0, y: 0, r: r * q }], dup: d, poles: same ? [{ x: -.03 * r, y: -.6 * r }, { x: -.03 * r, y: -.6 * r }] : [{ x: -.1 * r, y: -.62 * r }, { x: .07 * r, y: -.64 * r }], nuc: [{ x: 0, y: 0, r: .5 * r }, { x: 0, y: 0, r: .5 * r }] });
    return [k(.8, 0, true), k(.9, 1, false), Object.assign({}, g2, { labs: [] }), Object.assign({}, M[2], { labs: [] })];
  }
  // câmera que põe a célula (raio R0 no mundo) com raio rpx na tela, centrada em (sx, sy) do palco
  function camTela(g, rpx, sx, sy, th, fi) {
    const v = g.v, tg = Math.tan(v.cam.fov * Math.PI / 360), d = 10 * (v.h / 2) / (Math.max(20, rpx) * tg), pu = (v.h / 2) / (d * tg);
    return { th, fi, d, al: [-(sx - v.w / 2) / pu, (sy - v.h / 2) / pu, 0] };
  }

  // ---------- interfase ----------
  C3.cena('ciclo/interfase', K => {
    const st = estadosInterfase(K), G = K.geo(R0);
    return {
      fit: 40, vista: { th: 0, fi: .1 },
      pecas: {
        dup: { nome: 'DNA sendo duplicado', cor: '#9A6BFF', frase: 'Na fase S, cada molécula de DNA é copiada. Cada cromossomo passa a ter duas cromátides-irmãs.' },
        cen: { nome: 'Centrossomos duplicados', cor: '#CFE0FF', frase: 'Em G2 a célula já tem dois centrossomos, que vão organizar o fuso na mitose.' }
      },
      rotulos: [{ pc: 'dup', t: 'DNA sendo duplicado' }, { pc: 'cen', t: 'Centrossomos duplicados' }],
      montar(g) { g.D = C3.divisao(g, { aster: true }); },
      animar(g, P) {
        const i = cl(P.i, 0, 3), S = K.mixS(st[Math.max(0, i - 1)], st[i], i ? P.e : 1);
        g.D.set(S, G, g.t);
        if (i === 1 && P.e > .3) { g.vis.dup = 1; g.anc.dup = g.D.wm(.2 * R0, .14 * R0, 1.5); }
        if (i === 2 && P.e > .3) { g.vis.cen = 1; g.anc.cen = g.D.wm(.07 * R0, -.72 * R0, .5); }
      },
      camera(g, P) {
        const W = g.v.w, H = g.v.h, Ro = Math.min(W / 2 - 46, (H - 60) / 2 - 30), wd = Math.max(24, Ro * .15), r = (Ro - wd) * .74;
        return C3.viva(camTela(g, r, W / 2, (52 + H - 8) / 2, -.18 + .12 * Math.sin(P.u * .7), .12), g.t, .35);
      },
      sobre(g, S, K) {
        const W = K.W, H = K.H, cy = (52 + H - 8) / 2, cx = W / 2, Ro = Math.min(W / 2 - 46, (H - 60) / 2 - 30), i = S.i, f = S.f;
        const R = K.ring(cx, cy, Ro, [['G1', 11 / 24, K.RINGC[0], '11 h'], ['S', 8 / 24, K.RINGC[1], '8 h'], ['G2', 4 / 24, K.RINGC[2], '4 h'], ['M', 1 / 24, K.RINGC[3], '1 h']], i, null);
        const [a0, a1] = R.out[i], ang = a0 + (a1 - a0) * f, px = cx + Math.cos(ang) * R.Rm, py = cy + Math.sin(ang) * R.Rm;
        K.circ(px, py, R.wd / 2 + 3, null, 'rgba(11,15,28,.9)', 5); K.circ(px, py, R.wd / 2 + 3, null, '#fff', 2);
      }
    };
  });

  // ---------- pontos de checagem: aprovado ou barrado ----------
  C3.cena('ciclo/checagem', K => {
    const M = K.mkMitose(0, 0, R0, { labs: false }), sti = estadosInterfase(K);
    const est = [sti[0], Object.assign({}, M[0], { labs: [] }), Object.assign({}, M[2], { labs: [] }), sti[0]], G = K.geo(R0);
    const FR = [.36, .26, .2, .18];
    const T = [['Antes de duplicar o DNA', ['Tamanho adequado', 'Nutrientes e sinais', 'DNA sem danos']], ['Antes de dividir', ['DNA todo duplicado', 'DNA sem danos', 'Tamanho adequado']], ['No meio da mitose', ['Alinhados no equador', 'Todos presos ao fuso']], ['Dano no DNA', ['DNA danificado', 'p53 pausa o ciclo', 'Reparo ou apoptose']]];
    const VER = ['Aprovado: a célula entra na fase S', 'Aprovado: a célula entra na mitose', 'Aprovado: as cromátides podem se separar', 'Barrado: o ciclo fica parado'];
    const lay = (W, H) => W >= 700 ? { cx: W * .3, cy: (52 + H - 8) / 2, Ro: Math.min(W * .3 - 40, (H - 60) / 2 - 26), lx: W * .58, ly: (52 + H - 8) / 2, lw: W * .36 } : { cx: W / 2, cy: 52 + (H - 60) * .33, Ro: Math.min(W / 2 - 30, (H - 60) * .3), lx: 18, ly: 52 + (H - 60) * .77, lw: W - 36 };
    return {
      fit: 40, vista: { th: 0, fi: .1 },
      pecas: { dano: { nome: 'DNA danificado', cor: '#FF6B7D', frase: 'Quebras no DNA ativam a proteína p53, que segura o ciclo até o reparo. Sem reparo, a célula entra em apoptose.' } },
      rotulos: [{ pc: 'dano', t: 'DNA danificado' }],
      montar(g) { g.D = C3.divisao(g, { aster: true }); g.dano = new g.T.Mesh(C3.lumpy(g, 'dano', 21, 2, 5, .3, .4, .9), C3.emis(g, '#FF4D5E', 2.4)); g.dano.userData.peca = g.pecas.dano; g.raiz.add(g.dano); g.pick.push(g.dano); },
      animar(g, P) {
        const i = cl(P.i, 0, 3), S = K.mixS(est[Math.max(0, i - 1)], est[i], i ? P.e : 1), ver = sst((P.f - .62) / .2);
        g.D.tom = { cor: '#7FE0A0', k: i < 3 ? ver * .55 : 0 }; g.D.alerta = i === 3 ? [ver, ver] : [];
        g.D.set(S, G, g.t);
        g.D.mK.color.set(i === 2 && ver > .5 ? '#9FF0B8' : '#DDE8FF');
        g.dano.visible = i === 3 && P.e > .05; if (g.dano.visible) { const pu = RED() ? 1 : 1 + .2 * Math.sin(g.t * 5); g.dano.position.copy(new g.T.Vector3(...g.D.wm(.12 * R0, .08 * R0, 1.2))); g.dano.scale.setScalar(.55 * P.e * pu); g.vis.dano = 1; g.anc.dano = g.D.wm(.12 * R0, .08 * R0, 1.6); }
      },
      camera(g, P) { const L = lay(g.v.w, g.v.h), R = { wd: Math.max(24, L.Ro * .15) }; return C3.viva(camTela(g, (L.Ro - R.wd) * .7, L.cx, L.cy, -.15, .1), g.t, .3); },
      sobre(g, S, K) {
        const W = K.W, H = K.H, X = K.X, L = lay(W, H), cx = L.cx, cy = L.cy, Ro = L.Ro, i = S.i, f = S.f, e = S.e, PI = Math.PI;
        const act = i === 0 ? 0 : i === 1 ? 2 : i === 2 ? 3 : 0, R = K.ring(cx, cy, Ro, [['G1', FR[0], K.RINGC[0]], ['S', FR[1], K.RINGC[1]], ['G2', FR[2], K.RINGC[2]], ['M', FR[3], K.RINGC[3]]], act, null);
        const ga = [-PI / 2 + FR[0] * 2 * PI, -PI / 2 + (FR[0] + FR[1] + FR[2]) * 2 * PI, -PI / 2 + (FR[0] + FR[1] + FR[2] + FR[3] * .5) * 2 * PI], gi = i === 3 ? 0 : i;
        const ver = K.ss((f - .62) / .2), bad = i === 3;
        ga.forEach((a, k) => {
          const c = Math.cos(a), s = Math.sin(a), on = k === gi, col = on ? (bad ? K.C.red : ver > .5 ? K.C.ok : '#E8EDF7') : 'rgba(232,237,247,.45)';
          X.lineCap = 'round'; K.line(cx + c * (Ro - R.wd - 3), cy + s * (Ro - R.wd - 3), cx + c * (Ro + 3), cy + s * (Ro + 3), col, on ? (bad ? 7 : 5) : 3);
          const bx = cx + c * (Ro + 15), by = cy + s * (Ro + 15); K.circ(bx, by, 10, on ? col : 'rgba(11,15,28,.9)', col, 1.5); K.tx(String(k + 1), bx, by + .5, { f: K.FD, s: 12, w: 500, c: on ? '#0B0F1C' : K.C.dim, bg: false });
        });
        // marcador: chega ao portão; se aprovado, passa por ele; se barrado, para e treme de leve
        const from = i === 0 ? -PI / 2 : i === 3 ? ga[0] - .5 : ga[i - 1], to = ga[gi], ang = K.lerp(from, to, K.ss(f / .6)) + (bad ? 0 : ver * .16) + (bad && !RED() ? Math.sin(g.t * 18) * .006 * ver : 0);
        const mx = cx + Math.cos(ang) * R.Rm, my = cy + Math.sin(ang) * R.Rm;
        K.circ(mx, my, R.wd / 2 + 3, null, 'rgba(11,15,28,.9)', 5); K.circ(mx, my, R.wd / 2 + 3, null, bad ? K.C.red : ver > .5 ? K.C.ok : '#fff', 2);
        // lista de condições, fora do anel
        const n = T[i][1].length, lh = 26, wide = W >= 700, x0 = wide ? L.lx : Math.max(16, W / 2 - 110), y0 = wide ? cy - (n * lh) / 2 - 10 : L.ly - (n * lh) / 2 + 4;
        K.tx(T[i][0], x0, y0 - 28, { a: 'left', f: K.FTT, s: 15, w: 600, c: K.C.txt });
        T[i][1].forEach((s, k) => {
          const al = cl(e * n * 1.2 - k, 0, 1), y = y0 + k * lh, b = bad && k === 0; X.globalAlpha = .25 + .75 * al; const col = b ? K.C.red : bad ? K.C.txt : K.C.ok;
          K.circ(x0 + 8, y, 8, null, col, 1.6); X.lineCap = 'round'; X.lineJoin = 'round'; X.beginPath();
          if (b) { X.moveTo(x0 + 5, y - 3); X.lineTo(x0 + 11, y + 3); X.moveTo(x0 + 11, y - 3); X.lineTo(x0 + 5, y + 3); }
          else if (bad) { X.moveTo(x0 + 5, y); X.lineTo(x0 + 11, y); X.moveTo(x0 + 8.5, y - 2.5); X.lineTo(x0 + 11, y); X.lineTo(x0 + 8.5, y + 2.5); }
          else { X.moveTo(x0 + 4.5, y + .5); X.lineTo(x0 + 7.2, y + 3); X.lineTo(x0 + 11.5, y - 2.8); }
          X.strokeStyle = col; X.lineWidth = 1.6; X.stroke(); K.tx(s, x0 + 24, y + .5, { a: 'left', s: 13, c: K.C.txt, bg: false }); X.globalAlpha = 1;
        });
        // veredito
        if (ver > .01) {
          const y = y0 + n * lh + 14, s = VER[i]; X.font = `600 14px ${K.FT}`; const tw = Math.min((wide ? L.lw : W - 32), X.measureText(s).width + 44), xx = wide ? x0 : (W - tw) / 2, col = bad ? K.C.red : K.C.ok;
          X.globalAlpha = ver; X.save(); X.translate(xx + tw / 2, y + 16); const sc = RED() ? 1 : 1 + .06 * (1 - ver); X.scale(sc, sc);
          K.rr(-tw / 2, -16, tw, 32, 16); X.fillStyle = bad ? 'rgba(70,14,26,.94)' : 'rgba(14,52,34,.94)'; X.fill(); X.strokeStyle = col; X.lineWidth = 1.5; X.stroke();
          X.beginPath(); X.lineCap = 'round'; X.lineWidth = 2.2; X.strokeStyle = col; const ix = -tw / 2 + 18;
          if (bad) { X.moveTo(ix - 4, -4); X.lineTo(ix + 4, 4); X.moveTo(ix + 4, -4); X.lineTo(ix - 4, 4); } else { X.moveTo(ix - 5, 0); X.lineTo(ix - 1.5, 3.5); X.lineTo(ix + 5, -4); }
          X.stroke(); K.tx(s, ix + 14, 1, { a: 'left', s: 14, w: 600, c: bad ? '#FFD0D6' : '#CFF7DD', bg: false }); X.restore(); X.globalAlpha = 1;
        }
      }
    };
  });

  // ---------- câncer: epitélio em volume ----------
  C3.cena('ciclo/cancer', K => {
    const pc = (nome, cor, frase) => ({ nome, cor, frase });
    const NX = 11, NZ = 5, SP = 2.05, HC = 3.3, YV = -4.6, RV = 1.7;
    const cel = []; for (let z = 0; z < NZ; z++) for (let x = 0; x < NX; x++) cel.push({ x: (x - (NX - 1) / 2 + (z & 1) * .5) * SP, z: (z - (NZ - 1) / 2) * SP * .866, ix: x, iz: z });
    const mut = cel.findIndex(c => c.ix === 5 && c.iz === 2), dk = cel.findIndex(c => c.ix === 8 && c.iz === 1);
    const viz = cel.map((c, j) => j !== mut && Math.hypot(c.x - cel[mut].x, c.z - cel[mut].z) < SP * 1.1);
    const GX = cel[mut].x + 1.6;
    return {
      fit: 40, vista: { th: -.5, fi: .4 },
      pecas: {
        epi: pc('Epitélio', '#F06AAE', 'Camada de células bem unidas, sobre a lâmina basal. Aqui as divisões só repõem as células que morrem.'),
        lam: pc('Lâmina basal', '#CFE0FF', 'Tapete de proteínas sob o epitélio. Atravessá-la é o que define um tumor invasivo.'),
        vaso: pc('Vaso sanguíneo', '#D7303B', 'Pelo sangue, células do tumor chegam a outros órgãos: é a metástase.'),
        mut: pc('Célula com mutações', '#FF6B7D', 'Mutações em genes que controlam o ciclo (como o da p53) fazem a célula ignorar os pontos de checagem.'),
        tumor: pc('Tumor', '#FF6B7D', 'A célula alterada se divide sem parar e passa as mutações às filhas.'),
        meta: pc('Metástase', '#D7303B', 'Células do tumor entram no sangue e formam novos tumores em outros órgãos.'),
        morre: pc('Célula velha', '#F06AAE', 'Células velhas morrem (apoptose) e uma divisão as repõe: o total fica igual.')
      },
      rotulos: [{ pc: 'epi', t: 'Epitélio' }, { pc: 'lam', t: 'Lâmina basal' }, { pc: 'vaso', t: 'Vaso' }, { pc: 'morre', t: 'Célula velha morre', passo: P => P.f < .6 }, { pc: 'mut', t: 'Mutações em genes do ciclo' }, { pc: 'tumor', t: 'Tumor' }, { pc: 'meta', t: 'Metástase' }],
      montar(g) {
        const T = g.T, q = g.q;
        const geoC = g.geoC = new T.CylinderGeometry(1, .96, 1, 6, 1); g.geos.push(geoC);
        g.cel = C3.inst(g, geoC, C3.fis(g, '#ffffff', { p: { roughness: .38, clearcoat: .7, clearcoatRoughness: .25, transparent: true, opacity: .62, depthWrite: false, sheen: .5, sheenColor: new T.Color('#FFD0E6') }, rim: '#FFC2DD', rimK: .3 }), NX * NZ, null, g.pecas.epi); g.pick.push(g.cel.m);
        g.nuc = C3.inst(g, C3.esfera(g, q.seg), C3.fis(g, '#ffffff', { p: { roughness: .5, sheen: .5, sheenColor: new T.Color('#D8C8FF') }, rimK: .3 }), NX * NZ + 60);
        g.lam = C3.inst(g, new T.CylinderGeometry(1, 1, 1, 6, 1), C3.fis(g, '#CFE0FF', { p: { roughness: .5, transparent: true, opacity: .55, depthWrite: false } }), 260, null, g.pecas.lam); g.pick.push(g.lam.m);
        g.tum = C3.inst(g, C3.lumpy(g, 'tum', 31, q.det - 1, 6, .18, .4, .8), C3.fis(g, '#ffffff', { p: { roughness: .4, clearcoat: .6, sheen: .5, sheenColor: new T.Color('#FFC8D0') }, rim: '#FFB0BC', rimK: .32 }), 80, null, g.pecas.tumor); g.pick.push(g.tum.m);
        const vg = new T.CylinderGeometry(RV, RV, 46, 40, 1, true); g.geos.push(vg); g.vaso = new T.Mesh(vg, C3.filme(g, '#E0404C', { cor2: '#FFB0B8', dentro: '#3A0E18', base: .08, fr: .7, esc: .6 })); g.vaso.rotation.z = Math.PI / 2; g.vaso.position.set(0, YV, 0); g.vaso.renderOrder = 3; g.vaso.userData.peca = g.pecas.vaso; g.raiz.add(g.vaso); g.pick.push(g.vaso);
        g.hem = C3.inst(g, C3.lumpy(g, 'hem', 4, 2, 2, .05, .4, .5), C3.fis(g, '#C8303C', { p: { roughness: .45, clearcoat: .5 }, rim: '#FF9AA0', rimK: .3 }), 40, null, g.pecas.vaso);
        g.raio = new T.Mesh(C3.lumpy(g, 'raio', 8, 2, 4, .3, .4, .8), C3.emis(g, '#FF4D5E', 2.6)); g.raiz.add(g.raio);
      },
      animar(g, P) {
        const i = P.i, e = P.e, f = P.f, t = g.t, red = RED();
        // células do epitélio
        cel.forEach((c, j) => {
          let s = 1, hex = '#E7A2CB', nk = '#8A63D2';
          if (i === 0 && j === dk) { const d = sst(f / .35), n = sst((f - .4) / .4); s = n > 0 ? n : 1 - d; if (n > 0) hex = '#F0B8D8'; }
          const mm = j === mut ? (i === 1 ? e : i > 1 ? 1 : 0) : viz[j] ? (i === 2 ? e : i > 2 ? 1 : 0) : 0;
          if (mm > 0) { hex = mm > .5 ? '#FF7E8E' : '#F2A0BE'; nk = mm > .5 ? '#E0344A' : '#9A5ACB'; }
          if (s < .02) return;
          C3.put(g, g.cel, [c.x, HC / 2 * s, c.z], null, SP * .55 * s, HC * s, SP * .55 * s, hex, 1, j === mut && i > 0 ? g.pecas.mut : g.pecas.epi);
          C3.put(g, g.nuc, [c.x, HC * .42 * s, c.z], null, .52 * s, .62 * s, .52 * s, nk, 1);
        });
        C3.fim(g.cel);
        // lâmina basal: ladrilhos; abre um buraco sob o tumor na invasão
        const gp = i === 3 ? e : 0;
        for (let x = -13; x <= 13; x++) for (let z = -3; z <= 3; z++) { const px = x * 1.05 + (z & 1) * .52, pz = z * .91, dd = Math.hypot(px - GX, pz - cel[mut].z), s = dd < 1.6 ? 1 - gp : 1; if (s < .03) continue; C3.put(g, g.lam, [px, -.12, pz], null, .62 * s, .14, .62 * s, '#9FB6E8', 1, g.pecas.lam); }
        C3.fim(g.lam);
        // tumor: células empilhadas numa cúpula sobre a célula mutante
        const base = [cel[mut].x, HC, cel[mut].z], N = i < 2 ? 0 : i === 2 ? Math.round(mix(1, 46, e)) : 46;
        let topo = HC;
        for (let k = 0; k < N; k++) {
          const a = k * 2.39996, rr = .62 * Math.sqrt(k + .5), hh = Math.max(0, 2.6 - rr * .55) * (1 + k * .012);
          const p = [base[0] + Math.cos(a) * rr * 1.05, base[1] + .55 + hh + (hash(k, 3) - .5) * .4, base[2] + Math.sin(a) * rr * .9];
          const pul = red ? 1 : 1 + .04 * Math.sin(t * 2 + k); topo = Math.max(topo, p[1]);
          g._e.set(k, k * .7, 0); g._q.setFromEuler(g._e); C3.put(g, g.tum, p, g._q, .62 * pul, .58 * pul, .62 * pul, k % 3 ? '#E25A6E' : '#C94458', 1, g.pecas.tumor);
        }
        // invasão e metástase: células descem pelo buraco e seguem no sangue
        if (i === 3) for (let k = 0; k < 6; k++) {
          const u = red ? (k + .5) / 6 : ((t * .09 + k / 6) % 1); let p;
          if (u < .35) { const q = u / .35; p = lerp3([GX, .4, cel[mut].z], [GX + .4, YV + .4, cel[mut].z * .3], q); }
          else { const q = (u - .35) / .65; p = [GX + .4 + q * 16, YV + Math.sin(q * 9 + k) * .45, Math.cos(q * 7 + k) * .5]; }
          C3.put(g, g.tum, p, null, .5 * e, .46 * e, .5 * e, '#E25A6E', 1, g.pecas.tumor);
        }
        C3.fim(g.tum);
        // hemácias correndo
        for (let k = 0; k < 40; k++) { const u = ((red ? 0 : t * .05) + hash(k, 1)) % 1, x = -22 + u * 44, an = hash(k, 2) * TAU, rr = RV * .62 * Math.sqrt(hash(k, 4)); g._e.set(an, k, t * .3 * (red ? 0 : 1)); g._q.setFromEuler(g._e); C3.put(g, g.hem, [x, YV + Math.sin(an) * rr, Math.cos(an) * rr], g._q, .5, .18, .5, '#C8303C', 1, g.pecas.vaso); }
        C3.fim(g.hem);
        C3.fim(g.nuc);
        g.raio.visible = i === 1 && e > .05; if (g.raio.visible) { g.raio.position.set(cel[mut].x, HC * .42, cel[mut].z); g.raio.scale.setScalar(.75 * e * (red ? 1 : 1 + .2 * Math.sin(t * 6))); }
        g.vis.epi = 1; g.anc.epi = [-9.5, HC, -3.4]; g.vis.lam = 1; g.anc.lam = [-11, -.1, 3.6]; g.vis.vaso = 1; g.anc.vaso = [-12, YV + RV, 0];
        if (i === 0) { g.vis.morre = 1; g.anc.morre = [cel[dk].x, HC + .2, cel[dk].z]; }
        if (i === 1) { g.vis.mut = 1; g.anc.mut = [cel[mut].x, HC + .3, cel[mut].z]; }
        if (i >= 2) { g.vis.tumor = 1; g.anc.tumor = [base[0], topo + .7, base[2]]; }
        if (i === 3 && e > .3) { g.vis.meta = 1; g.anc.meta = [GX + 9, YV + RV * .6, 0]; }
      },
      camera(g, P) { const big = P.i >= 2, nar = g.v.w < 640; return C3.viva({ th: -.42 + .08 * P.u, fi: nar ? .7 : .34, d: C3.enquadrar(g, nar ? 11.5 : 13.5, big ? 8.5 : 7.5, 6), al: [0, big ? 0 : -.6, 0] }, g.t, .7); },
      sobre(g, S, K) {
        if (S.i !== 0) return; const p = C3.tela(g, [cel[dk].x, HC + 2.6, cel[dk].z]), n = K.ss((S.f - .4) / .4);
        if (n > .5) K.lab(p[0], p[1] + 14, p[0], p[1] - 22, 'Célula nova repõe a perdida', 1);
      }
    };
  });
})();
