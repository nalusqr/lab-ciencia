/* LAB, módulo Taxonomia. Cenas D: cladística (lendo um cladograma; monofilético, parafilético e polifilético).
   Roteiro: docs/revisao-biologia/taxonomia-roteiro.md (Taxon, revisão do Sapien), tópicos K1 e K2.
   Código, textos e desenhos da equipe (Leo). Cladograma em "V" desenhado em canvas 2D; bichos em esquema próprio. */
'use strict';
{
  // ---------------------------------------------------------------------------------
  // cores e utilidades locais
  // ---------------------------------------------------------------------------------
  const CC = typeof C !== 'undefined' ? C : {};
  const TXT = CC.txt || '#E8EDF7', DIM = CC.dim || '#9DA9C4';
  const AMB = CC.sinapo || '#FFB347', VERDE = CC.mono || '#6BCB77', AMAR = CC.para || '#F2D04B', VERM = CC.poli || '#F0605D', RAMO = '#8494BD', ICO = '#C9D3F0', FUNDO = 'rgba(11,15,28,.84)';

  // pontas do cladograma (nomes populares, por isso sem itálico); g = gênero gramatical
  const TIP = {
    lam: { n: 'lampreia', g: 'a', b: 'lampreia' }, tub: { n: 'tubarão', g: 'o', b: 'tubarao' }, sap: { n: 'sapo', g: 'o', b: 'sapo' }, hum: { n: 'ser humano', g: 'o', b: 'humano' },
    lag: { n: 'lagarto', g: 'o', b: 'lagarto' }, cro: { n: 'crocodilo', g: 'o', b: 'crocodilo' }, ave: { n: 'ave', g: 'a', b: 'ave' }
  };
  const isTip = id => !!TIP[id];
  const art = id => `${TIP[id].g} ${TIP[id].n}`, de = id => `${TIP[id].g === 'a' ? 'da' : 'do'} ${TIP[id].n}`;
  const cap1 = s => s.charAt(0).toUpperCase() + s.slice(1);
  // (lampreia, (tubarão, (sapo, (ser humano, (lagarto, (crocodilo, ave))))))
  const VERT = { root: 'n0', k: { n0: ['lam', 'n1'], n1: ['tub', 'n2'], n2: ['sap', 'n3'], n3: ['hum', 'n4'], n4: ['lag', 'n5'], n5: ['cro', 'ave'] } };
  const CLADO = { n0: 'vertebrados', n1: 'vertebrados com mandíbula', n2: 'tetrápodes', n3: 'amniotas', n4: 'répteis (com as aves)', n5: 'arcossauros' };
  // sinapomorfias, de baixo para cima; em = ramo que chega a esse nó ou ponta (n0 = haste da raiz)
  const NOV = [
    { n: 'crânio', em: 'n0' }, { n: 'mandíbula', em: 'n1' }, { n: 'quatro membros', em: 'n2' }, { n: 'ovo amniótico', em: 'n3' },
    { n: 'pelos e glândulas mamárias', em: 'hum' }, { n: 'moela', em: 'n5' }, { n: 'penas', em: 'ave' }
  ];

  const kidsOf = (T, id, flip) => { const k = T.k[id]; return flip && flip[id] ? [k[1], k[0]] : k; };
  function ordem(T, flip) { const out = []; (function go(id) { if (isTip(id)) out.push(id); else kidsOf(T, id, flip).forEach(go); })(T.root); return out; }
  const desc = (T, id) => isTip(id) ? [id] : T.k[id].flatMap(c => desc(T, c));
  const sub = (T, id) => isTip(id) ? [id] : [id, ...T.k[id].flatMap(c => sub(T, c))];
  const pai = (T, id) => Object.keys(T.k).find(n => T.k[n].includes(id)) || null;
  const todos = T => sub(T, T.root);
  function mrcaT(T, ids) {
    let best = T.root;
    const walk = id => { if (isTip(id)) return; for (const c of T.k[id]) if (ids.every(i => desc(T, c).includes(i))) { best = c; walk(c); } };
    walk(T.root); return best;
  }
  const lista = a => a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' e ' + a[a.length - 1];
  const nomes = T => id => TIP[id].n;
  function segDist(px, py, a, b) {
    const dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy || 1, u = cl(((px - a[0]) * dx + (py - a[1]) * dy) / L, 0, 1);
    return Math.hypot(px - a[0] - u * dx, py - a[1] - u * dy);
  }
  // escreve na faixa do controle quando a própria cena muda S.v
  function setV(o, S, v) {
    S.v = v; const r = document.getElementById('ctlR'), vv = document.getElementById('ctlV'), s = o.ctl.f(v);
    if (r) { r.value = v; r.setAttribute('aria-valuetext', s); } if (vv) vv.textContent = s;
  }
  function syncX(o, S) { document.querySelectorAll('#extra button').forEach((b, i) => { const x = o.extra[i]; if (x) b.setAttribute('aria-pressed', x.pressed ? !!x.pressed(S) : false); }); }

  // toques: o motor chama o.tap/o.grab; cada quadro guarda em S as funções certas para o modo atual
  const ENTRADA = { tap(x, y, S) { if (S._tap) S._tap(x, y); }, grab(x, y, S) { return S._grab ? !!S._grab(x, y) : false; },
    grabMove(x, y, S) { if (S._move) S._move(x, y); }, grabEnd(x, y, S) { if (S._end) S._end(x, y); } };
  const limpa = S => { S._tap = S._grab = S._move = S._end = null; };

  // ---------------------------------------------------------------------------------
  // desenho do cladograma em "V"
  // ---------------------------------------------------------------------------------
  // posição animada de cada ponta (índice fracionário); anda até a ordem atual
  function anima(S, T, flip) {
    const now = performance.now(), dt = Math.min(.05, (now - (S.lt || now)) / 1000); S.lt = now;
    const o = ordem(T, flip); S.idx = S.idx || {};
    o.forEach((id, i) => { if (S.idx[id] == null) S.idx[id] = i; else { S.idx[id] += (i - S.idx[id]) * Math.min(1, dt * 6); if (Math.abs(i - S.idx[id]) < .002) S.idx[id] = i; } });
    return S.idx;
  }
  // altura da faixa dos nomes e ícones; com pouco espaço, os nomes vão em duas fileiras alternadas
  function faixa(T, w, mini) {
    const n = desc(T, T.root).length, sp = w / n, fs = NAR || mini ? 12 : 13;
    const mw = Math.max(...desc(T, T.root).map(id => tw(TIP[id].n, fs, 600)));
    const two = mw > sp - 10, r = mini ? 0 : cl(sp * .2, 8, 13);
    return { sp, fs, two, r, h: (r ? 2 * r + 8 : 0) + fs + 10 + (two ? fs + 6 : 0) };
  }
  // R = { x0, x1, top, bot, haste, smax }; devolve as posições dos nós e das pontas
  function lay(T, idx, R) {
    const n = desc(T, T.root).length, sp = (R.x1 - R.x0) / n, P = {}, xi = i => R.x0 + sp * (i + .5);
    const s = Math.min(R.smax || 1.25, Math.max(.2, (R.bot - R.haste - R.top) / Math.max(1, (n - 1) * sp / 2)));
    (function go(id) {
      if (isTip(id)) { const x = xi(idx[id]); P[id] = [x, R.top]; return [x, x]; }
      const sps = T.k[id].map(go), a = Math.min(...sps.map(q => q[0])), b = Math.max(...sps.map(q => q[1]));
      P[id] = [(a + b) / 2, R.top + (b - a) / 2 * s]; return [a, b];
    })(T.root);
    const r = P[T.root]; P.haste = [r[0], r[1] + R.haste];
    return { P, sp, s, R };
  }
  // ponta inicial do ramo que chega em id
  const base = (T, L, id) => id === T.root ? L.P.haste : L.P[pai(T, id)];
  // ramos; sty(id) devolve { c, lw, dash, a, z, skip } para o ramo que chega em id
  function ramos(T, L, sty) {
    const lst = todos(T).map(id => [id, sty ? sty(id) || {} : {}]).filter(q => !q[1].skip).sort((a, b) => (a[1].z || 0) - (b[1].z || 0));
    X.lineCap = 'round';
    for (const [id, st] of lst) {
      const p = base(T, L, id), q = L.P[id];
      X.save(); X.globalAlpha *= st.a == null ? 1 : st.a; line(p[0], p[1], q[0], q[1], st.c || RAMO, st.lw || 3, st.dash); X.restore();
    }
    X.lineCap = 'butt';
  }
  // nomes e ícones das pontas; sty(id) devolve { c, bg, dash, a }; off = deslocamento por ponta; devolve as áreas de toque
  function rotulos(T, L, F, idx, sty, off, toque) {
    const hits = [];
    for (const id of desc(T, T.root)) {
      const st = sty ? sty(id) || {} : {}, o = off && off[id] || [0, 0], x = L.P[id][0] + o[0], y = L.R.top + o[1];
      const row = F.two ? Math.round(idx[id]) % 2 : 0, iy = y - F.r - 4, ny = y - (F.r ? 2 * F.r + 8 : 0) - F.fs / 2 - 4 - row * (F.fs + 6);
      X.save(); X.globalAlpha *= st.a == null ? 1 : st.a;
      if (F.r) bicho(TIP[id].b, x, iy, F.r * 2.1, { c: st.ic || st.c || ICO });
      if (LB || !F.r) {
        const w = tw(TIP[id].n, F.fs, 600) + 12;
        if (st.bg) rr(x - w / 2, ny - F.fs / 2 - 4, w, F.fs + 8, 999, rgba(st.bg, .2), st.bg, 1.5);
        if (st.dash) { X.setLineDash([4, 3]); rr(x - w / 2, ny - F.fs / 2 - 4, w, F.fs + 8, 999, null, st.dash, 1.5); X.setLineDash([]); }
        tx(TIP[id].n, x, ny, { s: F.fs, w: 600, c: st.c || TXT });
      }
      X.restore();
      hits.push([id, x - L.sp / 2, ny - F.fs, L.sp, y - ny + F.fs + 6]); if (toque) hitR(x - L.sp / 2, ny - F.fs, L.sp, y - ny + F.fs + 6, id);
    }
    return hits;
  }
  // marca âmbar de novidade evolutiva sobre um ramo, com o número
  function marca(T, L, k, a, pulse) {
    const m = NOV[k], p = base(T, L, m.em), q = L.P[m.em], f = m.em === T.root ? .5 : isTip(m.em) ? .42 : .5;
    const x = lerp(p[0], q[0], f), y = lerp(p[1], q[1], f), ang = Math.atan2(q[1] - p[1], q[0] - p[0]) + PI / 2;
    X.save(); X.globalAlpha *= a;
    if (pulse) circ(x, y, 13 + 3 * pulse, rgba(AMB, .22));
    line(x - Math.cos(ang) * 15, y - Math.sin(ang) * 15, x + Math.cos(ang) * 15, y + Math.sin(ang) * 15, AMB, 4);
    circ(x, y, 9.5, AMB, '#0B0F1C', 2);
    X.font = `700 12px ${FT}`; X.fillStyle = '#1A1206'; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillText(String(k + 1), x, y + .5);
    X.restore();
  }
  // onde cabe a caixa (legenda ou veredito): no triângulo vazio à direita da raiz ou embaixo do cladograma
  function planta(A, T, F, idx, bw, bh) {
    const top = A.y0 + F.h + 6, R = { x0: A.x0, x1: A.x1, top, bot: A.y1 - 2, haste: 22, smax: NAR ? 2 : 1.25 };
    if (!NAR) {
      const L = lay(T, idx, R), n = desc(T, T.root).length, xr = R.x0 + L.sp * (n - .5), bx = R.x1 - bw, by = R.bot - bh;
      const yl = R.top + (xr - bx) * L.s;
      if (bx > L.P[T.root][0] + 20 && by > yl + 16) return { L, box: { x: bx, y: by, w: bw, h: bh } };
    }
    R.bot = A.y1 - bh - 10; const L = lay(T, idx, R);
    const w = Math.min(A.w, Math.max(bw, 260));
    return { L, box: { x: A.cx - w / 2, y: R.bot + 10, w, h: bh } };
  }
  function caixa(b) { rr(b.x, b.y, b.w, b.h, 12, 'rgba(19,26,43,.78)', 'rgba(255,255,255,.12)', 1); }

  // =================================================================================
  // TÓPICO K1: #cladistica/cladograma
  // =================================================================================
  {
    const DEMO1 = [['cro', 'ave'], ['cro', 'lag'], ['hum', 'lag'], ['hum', 'sap']];
    const DEMO2 = ['n5', 'n3', 'n1', 'n5', 'n3', 'n1'];
    // "O mesmo cladograma?": 1 e 3 são o mesmo (3 = raiz girada); 2 conta outra história
    const QA = { root: 'a1', k: { a1: ['hum', 'a2'], a2: ['lag', 'a3'], a3: ['cro', 'ave'] } };
    const QB = { root: 'b1', k: { b1: ['hum', 'b2'], b2: ['cro', 'b3'], b3: ['lag', 'ave'] } };
    const QUIZ = [{ T: QA, flip: {} }, { T: QB, flip: {} }, { T: QA, flip: { a1: true } }];
    const RH = () => NAR ? 19 : 21;

    function aparentado(par0, par1) {
      const c = par0.find(i => par1.includes(i)); if (!c) return '';
      const o0 = par0.find(i => i !== c), o1 = par1.find(i => i !== c); if (!o0 || !o1 || o0 === o1) return '';
      const d0 = desc(VERT, mrcaT(VERT, par0)).length, d1 = desc(VERT, mrcaT(VERT, par1)).length, adj = TIP[c].g === 'a' ? 'aparentada' : 'aparentado';
      if (d0 === d1) return ` ${cap1(art(c))} é tão ${adj} com ${art(o0)} quanto com ${art(o1)}: os dois pares têm o mesmo ancestral comum mais recente.`;
      const [perto, longe] = d1 < d0 ? [o1, o0] : [o0, o1];
      return ` Conclusão: <b>${art(c)} é mais ${adj} com ${art(perto)} do que com ${art(longe)}</b>.`;
    }
    function escolhe(S, id) {
      const i = S.sel.indexOf(id);
      if (i >= 0) { S.sel.splice(i, 1); return; }
      if (S.sel.length === 2) { S.prev = S.sel.slice(); S.sel = [S.sel[1]]; }
      S.sel.push(id);
    }

    function quiz(A, S, o) {
      const n = 3, gap = NAR ? 10 : 24, head = NAR ? 30 : 36;
      const top = A.y0 + head, avail = A.y1 - top - 4;
      const cols = NAR ? 1 : 3, rows = NAR ? 3 : 1, pw = (A.w - gap * (cols - 1)) / cols, ph = (avail - gap * (rows - 1)) / rows;
      tx('Quais dois desenhos contam a mesma história?', A.cx, A.y0 + head / 2 - 2, { s: NAR ? 13 : 15, w: 700, c: TXT, f: FH });
      const sel = S.q, done = sel.length === 2, ok = done && sel.includes(0) && sel.includes(2), hits = [];
      QUIZ.forEach((qz, i) => {
        const bx = A.x0 + (NAR ? 0 : i * (pw + gap)), by = top + (NAR ? i * (ph + gap) : 0), on = sel.includes(i);
        const cor = done && on ? (ok ? VERDE : VERM) : on ? AMB : 'rgba(255,255,255,.14)';
        rr(bx, by, pw, ph, 12, on ? 'rgba(30,40,64,.7)' : 'rgba(19,26,43,.55)', cor, on ? 2.5 : 1);
        const bd = 11, bxN = bx + 10 + bd, byN = by + 10 + bd; circ(bxN, byN, bd, on ? cor : 'rgba(255,255,255,.1)', cor, 1.5);
        tx(String(i + 1), bxN, byN + .5, { s: 13, w: 700, c: on ? '#1A1206' : TXT, bg: false });
        const F = faixa(qz.T, pw - 24, true), idx = {}; ordem(qz.T, qz.flip).forEach((id, j) => { idx[id] = j; });
        const R = { x0: bx + 12, x1: bx + pw - 12, top: by + 14 + F.h, bot: by + ph - 10, haste: 12, smax: .9 };
        if (NAR) { R.x0 = bx + 44; R.top = by + 8 + F.h; }
        const L = lay(qz.T, idx, R);
        ramos(qz.T, L, () => ({ c: on ? light(cor === 'rgba(255,255,255,.14)' ? RAMO : cor, .2) : RAMO, lw: 2.5 }));
        Object.keys(qz.T.k).forEach(k => circ(L.P[k][0], L.P[k][1], 3, TXT));
        rotulos(qz.T, L, F, idx, () => ({ c: TXT }));
        hits.push([i, bx, by, pw, ph]); hitR(bx, by, pw, ph, 'q' + i);
      });
      S._tap = (x, y) => {
        const h = hits.find(q => x >= q[1] && x <= q[1] + q[3] && y >= q[2] && y <= q[2] + q[4]); if (!h) return;
        const i = sel.indexOf(h[0]); if (i >= 0) sel.splice(i, 1); else { if (sel.length >= 2) sel.length = 0; sel.push(h[0]); }
      };
      if (!sel.length) cap('Toque em dois desenhos. Compare quem sai de cada nó, e não a ordem das pontas.');
      else if (!done) cap(`Desenho ${sel[0] + 1} escolhido. Agora toque no outro desenho que conta a mesma história.`);
      else if (ok) cap('Isso: <b>1 e 3 são o mesmo cladograma</b>. Nos dois, crocodilo e ave são grupos-irmãos, o lagarto se junta a eles e o ser humano fica de fora. Em 3, só o nó de baixo foi girado.');
      else cap('Ainda não. No desenho 2, <b>lagarto e ave</b> são grupos-irmãos e o crocodilo fica de fora: é outra história, mesmo com as pontas quase na mesma ordem. Toque de novo para trocar.');
      void o;
    }

    const K1 = {
      t: 'Lendo um cladograma', s: 'ramos, nós e o ancestral comum', loc: 'Cladograma dos vertebrados', still: 0, stillV: 7,
      ctl: { l: 'Novidades', min: 0, max: 7, step: 1, v: 0, f: v => `${Math.round(v)} de 7` },
      auto: S => S.mode ? 0 : .55,
      alt: 'Cladograma em forma de V com sete pontas no alto: lampreia, tubarão, sapo, ser humano, lagarto, crocodilo e ave. Da raiz, embaixo, sai um ramo para cada grupo. Marcas âmbar numeradas sobre os ramos mostram as novidades evolutivas: crânio na base de todos, mandíbula do tubarão em diante, quatro membros do sapo em diante, ovo amniótico no ramo de ser humano, lagarto, crocodilo e ave, pelos e glândulas mamárias só no ser humano, moela no ramo de crocodilo e ave e penas só na ave. Botões permitem achar o ancestral comum de duas pontas, girar os nós e comparar três desenhos',
      d: `<p>A <b>cladística</b>, ou sistemática filogenética, foi proposta pelo entomólogo alemão <b>Willi Hennig</b> (1950). Ela classifica os seres pela <b>história evolutiva</b>: dois grupos são próximos quando têm um <b>ancestral comum recente</b>. Essa história é desenhada num <b>cladograma</b>. As pontas dos ramos são os grupos atuais. Cada ponto em que um ramo se divide é um <b>nó</b>, e representa o <b>ancestral comum</b> de tudo o que fica acima dele. As características marcadas nos ramos são as <b>novidades evolutivas</b> (<b>caracteres derivados</b>) que surgiram naquele ancestral e foram herdadas por todos os seus descendentes. Uma novidade compartilhada por um grupo, como o pelo nos mamíferos, é uma <b>sinapomorfia</b>, e é ela que mostra o parentesco.</p>
<p>Para saber quem é mais aparentado com quem, procure o <b>ancestral comum mais recente</b>, e não quem está desenhado mais perto. Dois grupos que saem do mesmo nó são <b>grupos-irmãos</b>. Os ramos podem <b>girar</b> em torno do nó, como um móbile, sem mudar o parentesco. E um cladograma não mostra "quem evoluiu de quem" entre os seres atuais: o ser humano <b>não descende</b> do chimpanzé; os dois descendem de um ancestral comum que não era nenhum dos dois.</p>
<p>A faixa mostra as novidades evolutivas uma a uma, de baixo para cima. Nos botões: <b>Ancestral comum</b> (toque em duas pontas), <b>Gire o nó</b> (toque ou arraste uma bolinha de nó) e <b>O mesmo cladograma?</b> (três desenhos para comparar).</p>`,
      kv: [['Nó', 'ancestral comum de tudo o que fica acima dele'], ['Grupos-irmãos', 'saem do mesmo nó'], ['Sinapomorfia', 'novidade evolutiva compartilhada por um grupo; mostra o parentesco'], ['Girar um nó', 'muda o desenho, não o parentesco']],
      enem: 'Para ler um cladograma: o parentesco é dado pelo <b>nó</b> (ancestral comum) <b>mais recente</b>, não pela distância entre as pontas no desenho. A característica marcada num ramo está presente em <b>todos</b> os grupos acima dela. Pegadinha: "o ser humano veio do macaco" está errado; o cladograma mostra um <b>ancestral comum</b>, não um descendendo do outro.',
      links: [['Monofilético, parafilético, polifilético', '#cladistica/grupos'], ['Homologia e analogia', '#cladistica/homologia'], ['Blastóporo na Embriologia', '../embriologia/index.html#desenvolvimento/blastoporo']],
      extra: ['Novidades', 'Ancestral comum', 'Gire o nó', 'O mesmo cladograma?'].map((t, i) => ({
        t, pressed: S => (S.mode || 0) === i,
        on(S) { S.mode = i; S.user = false; S.tk = 0; S.sel = []; S.prev = null; S.q = []; S.last = null; if (i) setV(K1, S, 7); else setV(K1, S, 0); }
      })),
      init(S) { if (S.mode == null) { S.mode = 0; S.sel = []; S.q = []; S.flip = {}; S.tk = 0; } },
      draw(t, S) {
        const A = area(), o = this, now = performance.now();
        limpa(S);
        if (S.mode === 3) { quiz(A, S, o); return; }
        // demonstrações enquanto ninguém mexe
        if (!S.user && !S.paused && S.mode) {
          S.tk += S.dt;
          if (S.mode === 1) { const k = Math.floor(S.tk / 3.4) % DEMO1.length, p = DEMO1[k]; if (!S.sel.length || S.sel.join() !== p.join()) { if (S.sel.length === 2) S.prev = S.sel.slice(); S.sel = p.slice(); if (k === 0) S.prev = null; } }
          if (S.mode === 2 && S.tk > 1.2) { const k = Math.floor((S.tk - 1.2) / 3) , nd = DEMO2[k % DEMO2.length]; if (S.dk !== k) { S.dk = k; S.flip[nd] = !S.flip[nd]; S.last = nd; S.rotT = now; } }
        }
        const T = VERT, idx = anima(S, T, S.flip), F = faixa(T, A.w), rh = RH();
        const bw = NAR ? A.w : 250, bh = 7 * rh + 34;
        const { L, box } = planta(A, T, F, idx, bw, bh), P = L.P;
        const nv = Math.round(S.v), cur = S.mode === 0 ? nv - 1 : -1;
        // estilos dos ramos
        let sty = () => null, tsty = () => null;
        if (S.mode === 0 && cur >= 0) {
          const em = NOV[cur].em, s2 = sub(T, em);
          sty = id => s2.includes(id) ? { c: light(AMB, .25), lw: 4, z: 1 } : null;
          tsty = id => s2.includes(id) ? { c: AMB, ic: light(AMB, .3) } : null;
        }
        let m = null;
        if (S.mode === 1 && S.sel.length) {
          m = S.sel.length === 2 ? mrcaT(T, S.sel) : null;
          const cam = new Set(); if (m) for (const s of S.sel) { let x = s; while (x && x !== m) { cam.add(x); x = pai(T, x); } }
          sty = id => cam.has(id) ? { c: AMB, lw: 4.5, z: 2 } : { a: .75 };
          tsty = id => S.sel.includes(id) ? { c: AMB, bg: AMB, ic: AMB } : { a: .8 };
        }
        ramos(T, L, sty);
        // novidades evolutivas
        const aM = S.mode === 0 ? 1 : .55;
        if (S.mode !== 2) for (let k = 0; k < Math.min(7, nv); k++) marca(T, L, k, aM, k === cur ? .5 + .5 * Math.sin(t * 5) : 0);
        // nós
        const nos = Object.keys(T.k);
        if (S.mode === 2) {
          for (const k of nos) {
            const [x, y] = P[k], hot = S.last === k ? Math.max(0, 1 - (now - (S.rotT || 0)) / 900) : 0, ag = S.agarra === k;
            if (hot > 0) circ(x, y, 12 + 22 * (1 - hot), null, rgba(AMB, hot), 2);
            circ(x, y, 9, ag ? AMB : '#1A2236', AMB, 2.5); circ(x, y, 3, ag ? '#1A1206' : AMB);
          }
        } else for (const k of nos) circ(P[k][0], P[k][1], k === m ? 7 : 3.5, k === m ? AMB : TXT, k === m ? '#fff' : null, 2);
        if (m) {
          const [x, y] = P[m]; circ(x, y, 14 + 3 * Math.sin(t * 4), null, rgba(AMB, .55), 2);
          const s = 'ancestral comum', w = tw(s, 12, 700) + 14, lx = cl(x + 14, A.x0, A.x1 - w);
          rr(lx, y + 10, w, 22, 999, FUNDO, AMB, 1); tx(s, lx + w / 2, y + 21.5, { s: 12, w: 700, c: AMB, bg: false });
        }
        const hits = rotulos(T, L, F, idx, tsty, null, S.mode === 1);
        // legenda das novidades
        if (S.mode !== 2) {
        caixa(box);
        tx('Novidades evolutivas', box.x + 14, box.y + 15, { s: 12, w: 700, c: DIM, a: 'left', bg: false });
        NOV.forEach((q, k) => {
          const y = box.y + 30 + k * rh + rh / 2, on = k < nv, now2 = k === cur;
          X.save(); X.globalAlpha *= on ? 1 : .38;
          circ(box.x + 22, y, 8, on ? AMB : 'rgba(255,179,71,.25)', null);
          tx(String(k + 1), box.x + 22, y + .5, { s: 12, w: 700, c: '#1A1206', bg: false });
          tx(q.n, box.x + 38, y, { s: NAR ? 12 : 13, w: now2 ? 700 : 600, c: now2 ? AMB : TXT, a: 'left', bg: false });
          X.restore();
        });
        }
        // toques
        const tipAt = (x, y) => { const h = hits.find(q => x >= q[1] && x <= q[1] + q[3] && y >= q[2] && y <= q[2] + q[4]); return h ? h[0] : null; };
        const noAt = (x, y) => { let b = null, bd = 24; for (const k of nos) { const d = Math.hypot(x - P[k][0], y - P[k][1]); if (d < bd) { bd = d; b = k; } } return b; };
        const gira = k => { S.flip[k] = !S.flip[k]; S.last = k; S.rotT = performance.now(); S.user = true; S.giros = (S.giros || 0) + 1; };
        if (S.mode === 1) { S._tap = (x, y) => { const id = tipAt(x, y); if (id) { if (!S.user) { S.sel = []; S.prev = null; } S.user = true; escolhe(S, id); } }; }
        if (S.mode === 2) {
          for (const k of nos) hitC(P[k][0], P[k][1], 20, k);
          // mouse e caneta: arrastar para o lado gira; soltar sem arrastar também gira (no toque, basta tocar)
          S._grab = (x, y) => { const k = noAt(x, y); if (!k) return false; S.agarra = k; S.gx = x; S.arrastou = false; return true; };
          S._move = x => { if (S.agarra && !S.arrastou && Math.abs(x - S.gx) > 28) { gira(S.agarra); S.arrastou = true; } };
          S._end = () => { if (S.agarra && !S.arrastou) gira(S.agarra); S.agarra = null; };
          S._tap = (x, y) => { const k = noAt(x, y); if (k) gira(k); };
        }
        // legenda do passo
        if (S.mode === 0) {
          if (cur < 0) cap('Cada <b>nó</b> é um ancestral comum, e as pontas são os grupos atuais. Avance a faixa para ver as <b>novidades evolutivas</b> surgindo de baixo para cima.');
          else {
            const q = NOV[cur], d = desc(T, q.em).map(nomes(T));
            cap(isTip(q.em) ? `${cur + 1}. <b>${cap1(q.n)}</b>: novidade que surgiu só no ramo ${TIP[q.em].g === 'a' ? 'da' : 'do'} ${TIP[q.em].n}; nenhuma outra ponta do desenho a tem.`
              : `${cur + 1}. <b>${cap1(q.n)}</b>: novidade que surgiu no ancestral comum de ${lista(d)}, e todos eles a herdaram.${cur === 0 ? '' : ' É uma sinapomorfia desse grupo.'}`);
          }
        } else if (S.mode === 1) {
          if (S.sel.length < 2) cap(S.sel.length ? `${cap1(art(S.sel[0]))} escolhido. Toque em outra ponta.` : 'Toque em <b>duas pontas</b> para acender o ancestral comum mais recente delas.');
          else {
            const [a, b] = S.sel, irm = T.k[m].includes(a) && T.k[m].includes(b);
            cap(`O ancestral comum mais recente ${de(a)} e ${de(b)} é o nó dos <b>${CLADO[m]}</b>.${irm ? ' Saem do mesmo nó: são <b>grupos-irmãos</b>.' : ''}${S.prev ? aparentado(S.prev, S.sel) : ''}`);
          }
        } else if (S.mode === 2) {
          cap(S.last ? `Nó dos <b>${CLADO[S.last]}</b> girado: os ramos trocaram de lado, mas saem do mesmo ancestral. <b>O parentesco não mudou.</b>`
            : 'Toque numa bolinha de nó (ou arraste para o lado) para girar os ramos em volta dela, como num móbile.');
        }
      }
    };
    def('cladistica', 'cladograma', Object.assign(K1, ENTRADA));
  }

  // =================================================================================
  // TÓPICO K2: #cladistica/grupos
  // =================================================================================
  {
    const PRE = [
      { t: 'Mamíferos', sel: ['hum'], cap: '<b>Mamíferos</b> (aqui, o ser humano): grupo <b>monofilético</b>. Reúne o ancestral que já tinha pelos e glândulas mamárias e todos os seus descendentes.' },
      { t: 'Répteis tradicionais', sel: ['lag', 'cro'], cap: '<b>Répteis tradicionais</b> (lagarto e crocodilo): grupo <b>parafilético</b>. O ancestral comum deles também deu origem à ave, que fica de fora (ramo tracejado). O crocodilo é mais aparentado com a ave do que com o lagarto.' },
      { t: 'Répteis + aves', sel: ['lag', 'cro', 'ave'], cap: '<b>Répteis com as aves</b>: grupo <b>monofilético</b>, um clado. Tem o ancestral comum e todos os descendentes; por isso a cladística diz que as aves são répteis.' },
      { t: 'Peixes', sel: ['lam', 'tub'], cap: '<b>Peixes</b> (lampreia e tubarão): grupo <b>parafilético</b> no contexto dos vertebrados. O ancestral comum deles também originou os tetrápodes, que ficam de fora.' },
      { t: 'Sangue quente', sel: ['hum', 'ave'], cap: '<b>Animais de sangue quente</b> (ser humano e ave): grupo <b>polifilético</b>. São ramos separados, a homeotermia surgiu de forma independente em cada um, e o ancestral comum deles fica de fora.' }
    ];
    const ORD = [1, 2, 3, 4, 0], CORTES = ['n5', 'n3', 'hum', 'n2'];
    const COR = { mono: VERDE, para: AMAR, poli: VERM };
    const TIT = { mono: 'Monofilético (clado)', para: 'Parafilético', poli: 'Polifilético' };
    function classe(T, sel) {
      if (!sel.length) return null;
      const m = mrcaT(T, sel), D = desc(T, m), fora = D.filter(i => !sel.includes(i));
      if (!fora.length) return { k: 'mono', m, fora };
      // parcimônia (Fitch) para "pertence ao grupo" na subárvore do ancestral: se o ancestral sai dentro, é parafilético
      const fit = id => { if (isTip(id)) return new Set([sel.includes(id) ? 1 : 0]); const [a, b] = T.k[id].map(fit), i = [...a].filter(v => b.has(v)); return new Set(i.length ? i : [...a, ...b]); };
      const r = fit(m);
      return { k: r.size === 1 && r.has(1) ? 'para' : 'poli', m, fora };
    }
    const ramoDe = id => isTip(id) ? `no ramo ${TIP[id].g === 'a' ? 'da' : 'do'} ${TIP[id].n}` : `no ramo dos ${CLADO[id]}`;

    const K2 = {
      t: 'Monofilético, parafilético, polifilético', s: 'quem fica dentro e quem fica fora', loc: 'Grupos no cladograma dos vertebrados', still: 0, ctl: false,
      alt: 'O mesmo cladograma dos vertebrados, com lampreia, tubarão, sapo, ser humano, lagarto, crocodilo e ave. Botões pintam grupos: mamíferos e répteis com aves em verde (monofiléticos); répteis tradicionais e peixes em amarelo, com o ramo que fica de fora tracejado (parafiléticos); ser humano e ave como sangue quente em vermelho, só nas pontas (polifilético). No modo tesoura, um corte num ramo separa um clado inteiro',
      d: `<p>Um <b>grupo monofilético</b>, ou <b>clado</b>, reúne um ancestral comum e <b>todos</b> os seus descendentes. Para a cladística, só os grupos monofiléticos são grupos naturais: mamíferos, aves, vertebrados e tetrápodes são exemplos. No cladograma, é o que se "corta" com um único golpe de tesoura num ramo: sai tudo o que está acima dele.</p>
<p>Um <b>grupo parafilético</b> reúne um ancestral comum e só <b>parte</b> dos seus descendentes. O exemplo clássico são os <b>répteis</b> do jeito tradicional (lagartos, cobras, tartarugas e crocodilos): o crocodilo é mais aparentado com a <b>ave</b> do que com o lagarto, e o grupo deixa a ave de fora. Por isso a cladística diz que as aves são <b>répteis</b>, e mais exatamente <b>dinossauros</b> que sobreviveram. "Peixes" também é parafilético: deixa de fora os tetrápodes, que descendem de peixes. Um <b>grupo polifilético</b> junta seres de linhagens diferentes <b>sem</b> o ancestral comum deles, só porque se parecem: "animais de sangue quente" (aves e mamíferos, que desenvolveram a homeotermia de forma independente) ou "algas". Os nomes tradicionais continuam úteis no dia a dia e nos livros, mas é bom saber quando não são clados.</p>
<p>Na animação, toque nas pontas para montar um grupo e veja a classificação, ou use os botões prontos. Em <b>Tesoura</b>, toque num ramo para cortá-lo.</p>`,
      kv: [['Monofilético (clado)', 'ancestral comum e todos os descendentes'], ['Parafilético', 'ancestral comum e só parte dos descendentes'], ['Polifilético', 'linhagens diferentes, sem o ancestral comum']],
      enem: '<b>Monofilético</b> = ancestral + <b>todos</b> os descendentes (o único aceito pela cladística). <b>Parafilético</b> = ancestral + <b>parte</b> dos descendentes (répteis sem as aves; peixes sem os tetrápodes). <b>Polifilético</b> = linhagens diferentes <b>sem</b> o ancestral comum (aves + mamíferos como "sangue quente"). Se um cladograma mostrar crocodilos mais perto das aves, a prova espera que você conclua que "répteis", sem as aves, não é grupo natural.',
      links: [['Lendo um cladograma', '#cladistica/cladograma'], ['Homologia e analogia', '#cladistica/homologia']],
      extra: [...PRE.map((p, i) => ({ t: p.t, pressed: S => !S.tes && S.pre === i, on(S) { S.user = true; S.tes = false; S.pre = i; S.sel = p.sel.slice(); } })),
        { t: 'Tesoura', pressed: S => !!S.tes, on(S) { S.tes = !S.tes; S.user = false; S.tk = 0; S.cut = S.tes ? CORTES[0] : null; S.ck = 0; S.cutT = performance.now(); } }],
      init(S) { if (S.pre == null) { S.pre = 1; S.sel = PRE[1].sel.slice(); S.tk = 0; S.k = 0; } },
      draw(t, S) {
        const A = area(), o = this, now = performance.now(), T = VERT;
        limpa(S);
        // ciclo dos exemplos enquanto ninguém mexe
        if (!S.user && !S.paused) {
          S.tk += S.dt;
          if (S.tes) { const k = Math.floor(S.tk / 3.6) % CORTES.length; if (k !== S.ck) { S.ck = k; S.cut = CORTES[k]; S.cutT = now; } }
          else { const k = Math.floor(S.tk / 4.5) % ORD.length; if (k !== S.k) { S.k = k; S.pre = ORD[k]; S.sel = PRE[S.pre].sel.slice(); syncX(o, S); } }
        }
        const res = S.tes ? (S.cut ? { k: 'mono', m: S.cut, fora: [] } : null) : classe(T, S.sel);
        const ln = !res ? '' : S.tes ? `sai o clado inteiro: ${lista(desc(T, S.cut).map(nomes(T)))}` : res.k === 'mono' ? 'ancestral comum e todos os descendentes' : res.k === 'para' ? `ancestral comum, mas fica de fora: ${lista(res.fora.map(nomes(T)))}` : 'linhagens separadas, sem o ancestral comum delas';
        const idx = anima(S, T, null), F = faixa(T, A.w), bw = NAR ? A.w : 270;
        let nl = 1, cur0 = ''; for (const w of ln.split(' ')) { const t2 = cur0 ? cur0 + ' ' + w : w; if (cur0 && tw(t2, 13, 600) > bw - 28) { nl++; cur0 = w; } else cur0 = t2; }
        const bh = 50 + nl * 16;
        const { L, box } = planta(A, T, F, idx, bw, bh), P = L.P;

        let sty, tsty, off = null;
        if (S.tes) {
          const s2 = S.cut ? sub(T, S.cut) : [], k = ss((now - (S.cutT || 0)) / 500);
          if (S.cut) {
            const p = base(T, L, S.cut), q = P[S.cut], d = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1, ux = (q[0] - p[0]) / d, uy = (q[1] - p[1]) / d;
            off = {}; const dx = ux * 16 * k, dy = uy * 16 * k;
            for (const id of s2) { P[id] = [P[id][0] + dx, P[id][1] + dy]; if (isTip(id)) off[id] = [0, dy]; }
            sty = id => id === S.cut ? { skip: true } : s2.includes(id) ? { c: VERDE, lw: 4.5, z: 2 } : { a: .55 };
            tsty = id => s2.includes(id) ? { c: VERDE, bg: VERDE, ic: VERDE } : { a: .6 };
            ramos(T, L, sty);
            // ramo cortado: metade de baixo fica, metade de cima sai com o clado
            const pm = [lerp(p[0], q[0] - dx, .5), lerp(p[1], q[1] - dy, .5)];
            X.lineCap = 'round'; X.save(); X.globalAlpha *= .55; line(p[0], p[1], pm[0] - ux * 5, pm[1] - uy * 5, RAMO, 3); X.restore();
            line(pm[0] + ux * 5 + dx, pm[1] + uy * 5 + dy, q[0], q[1], VERDE, 4.5); X.lineCap = 'butt';
            // tesoura
            const an = Math.atan2(uy, ux) + PI / 2, cx = pm[0] + dx / 2, cy = pm[1] + dy / 2;
            X.save(); X.translate(cx, cy); X.rotate(an);
            line(-11, -6, 11, 6, AMB, 2.5); line(-11, 6, 11, -6, AMB, 2.5); circ(-14, -7.5, 4, null, AMB, 2); circ(-14, 7.5, 4, null, AMB, 2);
            X.restore();
          } else ramos(T, L, () => null);
        } else {
          const r = res, s2 = r ? sub(T, r.m) : [], cor = r ? COR[r.k] : RAMO;
          sty = id => {
            if (!r) return null;
            if (r.k === 'mono') return s2.includes(id) ? { c: cor, lw: 4.5, z: 2 } : { a: .6 };
            if (r.k === 'para') { if (!s2.includes(id)) return { a: .6 }; return desc(T, id).some(i => S.sel.includes(i)) ? { c: cor, lw: 4.5, z: 2 } : { c: cor, lw: 2.5, dash: [6, 6], z: 1, a: .9 }; }
            return isTip(id) && S.sel.includes(id) ? { c: cor, lw: 4.5, z: 2 } : { a: .6 };
          };
          tsty = id => !r ? null : S.sel.includes(id) ? { c: cor, bg: cor, ic: cor } : r.k === 'para' && r.fora.includes(id) ? { dash: cor, a: .85 } : { a: .65 };
          ramos(T, L, sty);
          if (r && r.k === 'poli') { const [x, y] = P[r.m]; X.setLineDash([3, 3]); circ(x, y, 8, null, cor, 1.5); X.setLineDash([]); }
        }
        for (const k of Object.keys(T.k)) { if (!(S.tes && S.cut && sub(T, S.cut).includes(k))) circ(P[k][0], P[k][1], 3.5, TXT); else circ(P[k][0], P[k][1], 3.5, VERDE); }
        if (!S.tes && res && res.k !== 'poli') { const [x, y] = P[res.m]; circ(x, y, 7, COR[res.k], '#fff', 2); }
        const hits = rotulos(T, L, F, idx, tsty, off, true);
        // veredito
        caixa(box);
        if (res) {
          const c = COR[res.k], tt = TIT[res.k];
          circ(box.x + 20, box.y + 20, 6, c);
          tx(tt, box.x + 34, box.y + 20, { s: NAR ? 14 : 15, w: 700, c, a: 'left', bg: false, f: FH });


          wrapTx(ln, box.x + 14, box.y + 44, box.w - 28, { s: 13, w: 600, c: TXT, a: 'left', lh: 16 });
        } else tx(S.tes ? 'Toque num ramo para cortar' : 'Toque nas pontas para montar um grupo', box.x + box.w / 2, box.y + box.h / 2, { s: 13, w: 600, c: DIM, bg: false });
        // toques
        const tipAt = (x, y) => { const h = hits.find(q => x >= q[1] && x <= q[1] + q[3] && y >= q[2] && y <= q[2] + q[4]); return h ? h[0] : null; };
        const ramoAt = (x, y) => { let b = null, bd = 16; for (const id of todos(T)) { const d = segDist(x, y, base(T, L, id), P[id]); if (d < bd) { bd = d; b = id; } } return b; };
        if (S.tes) {
          S._tap = (x, y) => { const id = tipAt(x, y) || ramoAt(x, y); if (id) { S.user = true; S.cut = id; S.cutT = performance.now(); } };
          for (const id of todos(T)) { const a = base(T, L, id), b = P[id]; for (let f = .15; f < 1; f += .2) hitC(lerp(a[0], b[0], f), lerp(a[1], b[1], f), 12, 'r' + id); }
        } else {
          S._tap = (x, y) => { const id = tipAt(x, y); if (!id) return; S.user = true; S.pre = -1; const i = S.sel.indexOf(id); if (i >= 0) S.sel.splice(i, 1); else S.sel.push(id); syncX(o, S); };
        }
        // legenda do passo
        if (S.tes) {
          cap(S.cut ? `Um corte ${ramoDe(S.cut)} separa ${lista(desc(T, S.cut).map(nomes(T)))}: sai o ancestral com <b>todos</b> os descendentes, um grupo <b>monofilético</b>. Nenhum corte tira lagarto e crocodilo sem levar a ave.`
            : 'Toque num ramo para cortá-lo com a tesoura.');
        } else if (S.pre >= 0) cap(PRE[S.pre].cap);
        else if (!res) cap('Toque nas pontas para montar um grupo; toque de novo para tirar.');
        else {
          const ns = lista(S.sel.map(nomes(T))), pl = S.sel.length > 1;
          cap(res.k === 'mono' ? `${cap1(ns)}: grupo <b>monofilético</b> (clado), com o ancestral comum e todos os seus descendentes.`
            : res.k === 'para' ? `${cap1(ns)}: grupo <b>parafilético</b>. O ancestral comum ${pl ? 'deles' : ''} também originou ${lista(res.fora.map(nomes(T)))}, que ${res.fora.length > 1 ? 'ficam' : 'fica'} de fora.`
              : `${cap1(ns)}: grupo <b>polifilético</b>. São linhagens separadas, e o grupo não inclui o ancestral comum delas.`);
        }
      }
    };
    def('cladistica', 'grupos', Object.assign(K2, ENTRADA));
  }
}
