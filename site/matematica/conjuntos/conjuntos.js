/* LAB, Matemática, módulo 1: Conjuntos e números. Telas do ⚙️ Arquimedes e do 🔭 Galileo; roteiro do 📐 Tales e da 🌀 Hipátia
   (docs/revisao-matematica/conjuntos-roteiro.md). Usa o motor comum em ../comum/motor.js. */
'use strict';
SECS = [
  { id: 'linguagem', n: 'Linguagem dos conjuntos', c: '#4B9BFF' },
  { id: 'numericos', n: 'Conjuntos numéricos', c: '#9A6BFF' },
  { id: 'intervalos', n: 'Intervalos reais', c: '#3FBF6A' },
  { id: 'questoes', n: 'Questões', c: '#FFB347' }
];

// =====================================================================================
// 1. Conjunto, elemento e pertinência
// =====================================================================================
{
  const VOG = ['a', 'e', 'i', 'o'], CON = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n'];
  def('linguagem', 'elementos', {
    t: 'Conjunto, elemento e pertinência', st: 'Os símbolos ∈ e ∉',
    init: () => ({ sel: null, pts: [] }),
    draw(S) {
      const a = area(); const r = (NAR ? 15 : 18) * K;
      frame(a.x0, a.y0, a.w, a.h);
      pill('U = {a, b, c, …, o}: as 15 primeiras letras', a.x0 + 10, a.y0 + 20, null, { s: NAR ? 11 : 13 });
      const ex = a.x0 + a.w * (NAR ? .3 : .3), ey = a.cy + 4, erx = a.w * (NAR ? .24 : .2), ery = a.h * .3;
      blob(ex, ey, erx, ery, C.A);
      tx('A', ex - erx * .75, ey - ery * .85, { f: FH, s: 20, w: 700, c: C.A });
      S.pts = [];
      VOG.forEach((l, i) => { const ang = -Math.PI / 2 + i * TAU / 4 + .5; S.pts.push({ l, x: ex + Math.cos(ang) * erx * .5, y: ey + Math.sin(ang) * ery * .5, v: true }); });
      const gx0 = a.x0 + a.w * (NAR ? .6 : .56), gx1 = a.x1 - r - 10, cols = NAR ? 3 : 4, rows = Math.ceil(CON.length / cols);
      const gy0 = a.y0 + a.h * .22, gy1 = a.y1 - a.h * .22;
      CON.forEach((l, i) => { const c = i % cols, w = Math.floor(i / cols); S.pts.push({ l, x: lerp(gx0, gx1, cols > 1 ? c / (cols - 1) : .5), y: lerp(gy0, gy1, rows > 1 ? w / (rows - 1) : .5), v: false }); });
      for (const p of S.pts) {
        const on = S.sel === p.l, pulse = on ? 1 + .08 * Math.sin(S.t * 6) : 1;
        token(p.x, p.y, r * pulse, p.l, on, p.v ? C.A : C.line, { s: NAR ? 15 : 17 });
        if (on) pill(p.v ? `${p.l} ∈ A` : `${p.l} ∉ A`, p.x, p.y - r - 18, null, { a: 'center', st: C.res, tc: C.res, s: NAR ? 13 : 15, f: FM, w: 500 });
      }
      const by = a.y1 - (NAR ? 44 : 50), bx = a.x0 + 14, fs = NAR ? 12 : 14;
      tx('Enumeração:  A = {a, e, i, o}', bx, by, { a: 'left', f: FM, w: 500, s: fs, c: C.txt });
      tx('Propriedade: A = {x | x é vogal de U}', bx, by + (NAR ? 18 : 22), { a: 'left', f: FM, w: 500, s: fs, c: C.txt });
      if (!NAR) tx('n(A) = 4', a.x1 - 14, by + 11, { a: 'right', f: FM, w: 500, s: 15, c: C.A });
    },
    down(S, x, y) { const r = NAR ? 17 : 20; const p = S.pts.find(p => Math.hypot(p.x - x, p.y - y) < r); if (!p) return false; S.sel = p.l; return false; },
    hover: (S, x, y) => S.pts.some(p => Math.hypot(p.x - x, p.y - y) < 20) ? 'pointer' : '',
    ui: () => [{ type: 'btns', items: [{ l: 'Sortear uma letra', f: S => { const all = VOG.concat(CON); S.sel = all[Math.random() * all.length | 0]; } }] }],
    cap(S) {
      if (!S.sel) return 'Toque numa letra para ver se ela <b>pertence</b> (∈) ou <b>não pertence</b> (∉) ao conjunto A das vogais.';
      return VOG.includes(S.sel) ? `<b>${S.sel} ∈ A</b>: “${S.sel}” é vogal, então é elemento de A.` : `<b>${S.sel} ∉ A</b>: “${S.sel}” não é vogal. Ela está em U, mas fora de A.`;
    },
    desc: `<p>Um <b>conjunto</b> é uma coleção de objetos bem definida: dá para dizer, sem dúvida, se um objeto está ou não nele. Cada objeto do conjunto é um <b>elemento</b>.</p>
<p>A relação entre <b>elemento e conjunto</b> é a <b>pertinência</b>: escrevemos <span class="q">e ∈ A</span> (e pertence a A) ou <span class="q">b ∉ A</span> (b não pertence a A).</p>
<p>Há três jeitos de representar um conjunto: <b>enumerando</b> os elementos entre chaves, <span class="q">A = {a, e, i, o}</span>; por uma <b>propriedade</b>, <span class="q">A = {x | x é vogal}</span> (lê-se “x tal que x é vogal”); ou por um <b>diagrama de Venn</b>, a curva fechada da animação.</p>
<p>Ordem e repetição não mudam um conjunto: <span class="q">{1, 2, 2, 3} = {3, 2, 1}</span>. O número de elementos de A se escreve <span class="q">n(A)</span>.</p>`,
    kv: [['∈', 'pertence (liga um elemento a um conjunto)'], ['∉', 'não pertence'], ['{ }', 'chaves: dentro delas vêm os elementos'], ['n(A)', 'número de elementos de A']],
    enem: 'O ENEM quase nunca pede o símbolo isolado. Ele pede que você <b>traduza um texto em conjuntos</b> (“pessoas que leem o jornal A”) e conte os elementos. Erro comum: usar ⊂ entre um elemento e um conjunto. Elemento usa ∈.'
  });
}

// =====================================================================================
// 2. Subconjuntos
// =====================================================================================
{
  const subs = n => { const L = []; for (let m = 0; m < 1 << n; m++) { const e = []; for (let i = 0; i < n; i++) if (m >> i & 1) e.push(i + 1); L.push(e); } const by = (p, q) => p.length - q.length || p.join().localeCompare(q.join()); return n ? L.filter(e => !e.includes(n)).sort(by).concat(L.filter(e => e.includes(n)).sort(by)) : L; };
  const sstr = e => e.length ? `{${e.join(', ')}}` : '∅';
  def('linguagem', 'subconjuntos', {
    t: 'Subconjuntos', st: 'B ⊂ A e o total 2ⁿ',
    init: () => ({ n: 3, sel: -1, boxes: [] }),
    draw(S) {
      const a = area(), L = subs(S.n), n = S.n;
      const head = n ? `A = {${Array.from({ length: n }, (_, i) => i + 1).join(', ')}}` : 'A = ∅';
      pill(head, a.x0, a.y0 + 8, C.A, { f: FM, w: 500, s: NAR ? 13 : 15 });
      pill(`n(A) = ${n}  →  2${sup(n)} = ${1 << n} subconjuntos`, NAR ? a.x0 : a.x1, a.y0 + (NAR ? 36 : 8), null, { a: NAR ? 'left' : 'right', f: FM, w: 500, s: NAR ? 12 : 14, tc: C.res });
      const gy0 = a.y0 + (NAR ? 64 : 48), gh = a.y1 - gy0 - 8, fs = NAR ? 12 : 16;
      let cw = tw(sstr(Array.from({ length: Math.max(n, 2) }, (_, i) => i + 1)), fs, 500, FM) + 26;
      const cols = Math.max(1, Math.min(n ? L.length / 2 : L.length, Math.floor(a.w / (cw + 8))));
      cw = Math.max(cw, Math.min(NAR ? cw : 168, a.w / cols - 10));
      const rows = Math.ceil(L.length / cols), ch0 = Math.min(NAR ? 46 : 58, gh / rows - 6), gw = Math.min(n ? L.length / 2 : L.length, cols) * (cw + 8) - 8, gx0 = a.cx - gw / 2;
      S.boxes = [];
      const half = n ? L.length / 2 : L.length, hr = Math.ceil(half / cols), gapH = n ? 34 : 0;
      const ch2 = Math.min(NAR ? 46 : 58, (gh - gapH - 24) / (2 * hr) - 6);
      if (n) {
        tx(`sem o ${n}: os ${half} subconjuntos de {${Array.from({ length: n - 1 }, (_, i) => i + 1).join(', ')}}`.replace('{}', '∅'), gx0, gy0 + 6, { a: 'left', s: NAR ? 11 : 13, c: C.dim });
        const y2 = gy0 + 18 + hr * (ch2 + 6) + 10;
        if (S.t > half * .07) tx(`com o ${n}: os mesmos ${half}, agora com o ${n} dentro`, gx0, y2 + 6, { a: 'left', s: NAR ? 11 : 13, c: C.res });
      }
      L.forEach((e, i) => {
        const k = ss((S.t - i * .07) / .3); if (k <= 0) return;
        const sec = n && i >= half ? 1 : 0, j = i - sec * half, c = j % cols, r = Math.floor(j / cols);
        const x = gx0 + c * (cw + 8), y = gy0 + (n ? 18 : 0) + sec * (hr * (ch2 + 6) + 28) + r * (ch2 + 6) + (1 - k) * 10, ch = n ? ch2 : ch0;
        const on = S.sel === i, full = e.length === n;
        X.save(); X.globalAlpha = k;
        X.shadowColor = on ? rgba(C.res, .6) : 'rgba(0,0,0,.45)'; X.shadowBlur = on ? 16 : 6; rr(x, y, cw, ch, 10, on ? C.res : sec ? '#2A2416' : '#1E2846', null); X.shadowBlur = 0;
        rr(x, y, cw, ch, 10, null, on ? C.res : full || !e.length ? C.res : rgba(sec ? C.res : C.A, .6), on ? 2 : 1.2);
        tx(sstr(e), x + cw / 2, y + ch / 2 + 1, { f: FM, w: 500, s: fs, c: on ? C.ink : C.txt });
        X.restore(); S.boxes.push({ x, y, w: cw, h: ch, i });
      });
    },
    down(S, x, y) { const b = S.boxes.find(b => inBox(b, x, y)); if (b) S.sel = b.i; return false; },
    hover: (S, x, y) => S.boxes.some(b => inBox(b, x, y)) ? 'pointer' : '',
    ui: () => [{ type: 'range', l: 'Elementos de A', min: 0, max: 5, get: S => S.n, set: (S, v) => { if (v !== S.n) { S.n = v; S.sel = -1; S.t = 0; } } }],
    cap(S) {
      if (S.sel < 0) return S.n ? `Cada elemento novo <b>dobra</b> a lista: os subconjuntos sem ele, mais os mesmos com ele. Por isso ${S.n > 1 ? '2' + sup(S.n - 1) + ' + 2' + sup(S.n - 1) + ' = ' : ''}2${sup(S.n)} = ${1 << S.n}.` : 'O vazio só tem um subconjunto: ele mesmo. 2⁰ = 1.';
      const e = subs(S.n)[S.sel];
      if (!e.length) return '<b>∅ ⊂ A</b>: o conjunto vazio é subconjunto de qualquer conjunto.';
      if (e.length === S.n) return '<b>A ⊂ A</b>: todo conjunto é subconjunto de si mesmo.';
      return `<b>${sstr(e)} ⊂ A</b>: todo elemento de ${sstr(e)} também está em A.`;
    },
    desc: `<p><b>B ⊂ A</b> (B está contido em A) quando <b>todo</b> elemento de B também é elemento de A. Basta um elemento de B fora de A para escrever <span class="q">B ⊄ A</span>.</p>
<p>Atenção à diferença: <b>∈</b> liga elemento a conjunto, <b>⊂</b> liga conjunto a conjunto. Com A = {1, 2, 3}: <span class="q">1 ∈ A</span> e <span class="q">{1} ⊂ A</span>, mas escrever “1 ⊂ A” está errado.</p>
<p>Dois subconjuntos estão sempre lá: o vazio <span class="q">∅</span> e o próprio <span class="q">A</span>. O conjunto de todos os subconjuntos é o <b>conjunto das partes</b>, <span class="q">P(A)</span>.</p>
<div class="passos"><b>De onde vem o 2ⁿ</b><ol>
<li>Comece pequeno. O conjunto vazio tem 1 subconjunto: ele mesmo.</li>
<li>Coloque um elemento, A = {1}. Os subconjuntos são os de antes (∅) e os de antes com o 1 dentro ({1}): 2.</li>
<li>Coloque o 2. Pegue a lista anterior (∅, {1}) e copie com o 2 dentro ({2}, {1, 2}): 4.</li>
<li>Cada elemento novo faz a mesma coisa: a lista inteira aparece duas vezes, sem ele e com ele. A quantidade <b>dobra</b>: 1, 2, 4, 8, 16…</li>
<li>Dobrar n vezes a partir de 1 é multiplicar 2 por ele mesmo n vezes: <b>2ⁿ</b>. É o que a tela mostra, com as duas metades separadas.</li>
</ol><p>Outro jeito de ver: para montar um subconjunto, você decide elemento por elemento, “entra” ou “não entra”. São 2 opções em cada uma das n decisões, e decisões em sequência se multiplicam (como roupas: 3 camisas e 2 calças dão 3 × 2 = 6 combinações).</p></div>`,
    kv: [['B ⊂ A', 'B está contido em A'], ['A ⊃ B', 'A contém B (mesma relação, lida ao contrário)'], ['P(A)', 'conjunto das partes de A'], ['n(P(A))', '2ⁿ, se n(A) = n']],
    enem: 'Aparece disfarçado de contagem: “uma pizzaria oferece 5 coberturas e o cliente pode escolher qualquer combinação, inclusive nenhuma. Quantos pedidos diferentes existem?” São os subconjuntos de 5 elementos: <b>2⁵ = 32</b>. Sem a opção “nenhuma”, 32 − 1 = 31.'
  });
}

// =====================================================================================
// 3. Conjunto universo e conjunto vazio
// =====================================================================================
{
  const LV = ['ℕ', 'ℤ', 'ℚ', 'ℝ'], LC = [C.N, C.Z, C.Q, C.R];
  const EQS = [
    { e: 'x² = 4', s: [['2', 0], ['−2', 1]] },
    { e: 'x + 5 = 2', s: [['−3', 1]] },
    { e: '2x = 3', s: [['3/2', 2]] },
    { e: 'x² = 2', s: [['√2', 3], ['−√2', 3]] },
    { e: 'x² = −1', s: [] }
  ];
  const sol = S => EQS[S.e].s.filter(p => p[1] <= S.u);
  def('linguagem', 'universo-vazio', {
    t: 'Conjunto universo e conjunto vazio', st: 'A resposta depende de U',
    init: () => ({ e: 0, u: 0, tc: 0 }),
    draw(S) {
      const a = area(), top = a.y0 + 30, ins = Math.min(a.w * .1, (a.h - 30) * .13);
      const R = []; for (let k = 3; k >= 0; k--) { const d = (3 - k) * ins; R[k] = { x: a.x0 + d, y: top + d, w: a.w - 2 * d, h: a.y1 - top - 2 * d }; }
      const E = EQS[S.e];
      pill(`Resolver ${E.e} com U = ${LV[S.u]}`, a.cx, a.y0 + 8, null, { a: 'center', f: FM, w: 500, s: NAR ? 13 : 15, st: C.res });
      for (let k = 3; k >= 0; k--) {
        const r = R[k], on = k <= S.u, cur = k === S.u;
        rr(r.x, r.y, r.w, r.h, 14, on ? rgba(LC[k], cur ? .1 : .05) : 'rgba(255,255,255,.01)', on ? LC[k] : C.faint, cur ? 2.5 : 1.2);
        tx(LV[k], r.x + 14, r.y + 16, { a: 'left', f: FH, s: 17, w: 700, c: on ? LC[k] : C.line });
        if (cur) tx('universo U', r.x + 36, r.y + 17, { a: 'left', s: 12, w: 600, c: C.dim });
      }
      const k2 = ss((S.t - S.tc) / .4);
      E.s.forEach((p, j) => {
        const [s, L] = p, r = R[L], inner = L ? R[L - 1] : null, inU = L <= S.u;
        let x, y;
        if (!inner) { x = r.x + r.w * (E.s.length > 1 ? .35 + .3 * j : .5); y = r.y + r.h * .55; }
        else { const sib = E.s.filter(q => q[1] === L), jj = sib.indexOf(p); x = r.x + r.w * (sib.length > 1 ? .62 + .2 * jj : .7); y = r.y + (inner.y - r.y) / 2 + 2; }
        const rad = NAR ? 17 : 21;
        X.save(); X.globalAlpha = .35 + .65 * (inU ? k2 : 1) * (inU ? 1 : .6);
        token(x, y, rad, null, inU, C.line);
        if (!inU) { X.setLineDash([3, 3]); circ(x, y, rad + 4, null, C.line, 1); X.setLineDash([]); }
        tx(s, x, y + 1, { f: FM, w: 500, s: NAR ? 13 : 15, c: inU ? C.ink : C.dim });
        X.restore();
      });
      const s = sol(S), txt = s.length ? `S = {${s.map(p => p[0]).join(', ')}}` : 'S = ∅ = { }';
      pill(txt, R[0].x + R[0].w / 2, R[0].y + R[0].h - 20, null, { a: 'center', f: FM, w: 500, s: NAR ? 14 : 16, st: s.length ? C.res : C.bad, tc: s.length ? C.res : C.bad });
    },
    ui: () => [
      { type: 'btns', l: 'Equação', items: EQS.map((q, i) => ({ l: q.e, on: S => S.e === i, f: S => { S.e = i; S.tc = S.t; } })) },
      { type: 'btns', l: 'Universo', items: LV.map((v, i) => ({ l: v, on: S => S.u === i, f: S => { S.u = i; S.tc = S.t; } })) }
    ],
    cap(S) {
      const E = EQS[S.e], s = sol(S);
      if (!E.s.length) return `${E.e} não tem solução real: nenhum número real ao quadrado dá negativo. <b>S = ∅</b> em qualquer um desses universos.`;
      if (!s.length) return `Em ${LV[S.u]}, ${E.e} <b>não tem solução</b>: S = ∅. Troque o universo e veja a solução aparecer.`;
      const fora = E.s.length - s.length;
      return `Em ${LV[S.u]}, <b>S = {${s.map(p => p[0]).join(', ')}}</b>.` + (fora ? ` A outra raiz existe, mas fica fora de U.` : '');
    },
    desc: `<p>O <b>conjunto universo</b> U reúne todos os elementos que valem no problema. A mesma pergunta pode ter respostas diferentes em universos diferentes: <span class="q">x² = 4</span> tem <span class="q">S = {2}</span> em ℕ e <span class="q">S = {−2, 2}</span> em ℤ.</p>
<p>O <b>conjunto vazio</b> não tem elementos: <span class="q">∅ = { }</span> e <span class="q">n(∅) = 0</span>. Ele aparece quando nenhum elemento de U satisfaz a condição, como <span class="q">{x ∈ ℕ | x &lt; 0}</span>.</p>
<p>Cuidado: <span class="q">{0}</span> e <span class="q">{∅}</span> <b>não</b> são vazios. Cada um tem 1 elemento (o número zero e o próprio vazio).</p>`,
    kv: [['U', 'conjunto universo'], ['∅ ou { }', 'conjunto vazio'], ['n(∅)', '0'], ['{∅}', 'conjunto com 1 elemento, não é vazio']],
    enem: 'Nos problemas do ENEM o universo vem do <b>contexto</b>. Pessoas, ônibus e caixas só podem ser números naturais: se a conta dá 12,4 ônibus, a resposta é 13. Ler o universo evita marcar uma alternativa certa na conta e impossível na situação.'
  });
}

// =====================================================================================
// 4. Operações entre conjuntos (Venn)
// =====================================================================================
{
  const A = [1, 2, 3, 5, 8], B = [2, 4, 6, 8, 10];
  const OPS = [
    { k: 'A ∪ B', f: (a, b) => a || b, r: 'x ∈ A <b>ou</b> x ∈ B', n: 'união' },
    { k: 'A ∩ B', f: (a, b) => a && b, r: 'x ∈ A <b>e</b> x ∈ B', n: 'interseção' },
    { k: 'A − B', f: (a, b) => a && !b, r: 'x ∈ A <b>e</b> x ∉ B', n: 'diferença' },
    { k: 'B − A', f: (a, b) => b && !a, r: 'x ∈ B <b>e</b> x ∉ A', n: 'diferença' },
    { k: 'Aᶜ', f: (a) => !a, r: 'x ∈ U <b>e</b> x ∉ A', n: 'complementar de A' },
    { k: '(A ∪ B)ᶜ', f: (a, b) => !a && !b, r: 'x ∉ A <b>e</b> x ∉ B', n: 'complementar da união' }
  ];
  function geo() {
    const a = area(), top = a.y0 + 34, U = { x: a.x0, y: top, w: a.w, h: a.y1 - top };
    const r = Math.min(U.h * .4, a.w * (NAR ? .3 : .22)), d = r * .62, cy = U.y + U.h / 2 + 4;
    return { a, U, r, cy, ax: a.cx - d, bx: a.cx + d };
  }
  def('linguagem', 'operacoes', {
    t: 'União, interseção, diferença e complementar', st: '∪, ∩, − e ᶜ no diagrama',
    init: () => ({ op: 0, tc: 0 }),
    draw(S) {
      const g = geo(), { U, r, cy, ax, bx } = g, o = OPS[S.op];
      frame(U.x, U.y, U.w, U.h);
      tx('U = {1, 2, …, 10}', U.x + 14, U.y + 18, { a: 'left', f: FM, w: 500, s: NAR ? 11 : 13, c: C.dim });
      const pA = pEll(ax, cy, r, r), pB = pEll(bx, cy, r, r), pU = pRect(U.x, U.y, U.w, U.h);
      const regs = [[['add', pA], ['add', pB]], [['add', pA], ['in', pB]], [['add', pA], ['out', pB]], [['add', pB], ['out', pA]], [['add', pU], ['out', pA]], [['add', pU], ['out', pA], ['out', pB]]];
      region(regs[S.op], C.res, .34 * ss((S.t - S.tc) / .35));
      blob(ax, cy, r, r, C.A, { a0: .14, a1: .03 }); blob(bx, cy, r, r, C.B, { a0: .14, a1: .03 });
      tx('A', ax - r * .7, cy - r * .86, { f: FH, s: 20, w: 700, c: C.A }); tx('B', bx + r * .7, cy - r * .86, { f: FH, s: 20, w: 700, c: C.B });
      const P = {
        1: [ax - r * .5, cy - r * .38], 3: [ax - r * .62, cy + .08 * r], 5: [ax - r * .4, cy + r * .48],
        2: [g.a.cx, cy - r * .3], 8: [g.a.cx, cy + r * .3],
        4: [bx + r * .5, cy - r * .38], 6: [bx + r * .62, cy + .08 * r], 10: [bx + r * .4, cy + r * .48],
        7: [U.x + U.w - 34, U.y + U.h - 30], 9: [U.x + 34, U.y + U.h - 30]
      };
      const res = [];
      for (let v = 1; v <= 10; v++) {
        const on = o.f(A.includes(v), B.includes(v)); if (on) res.push(v);
        const [x, y] = P[v], rad = (NAR ? 13 : 16) * K;
        token(x, y, rad, String(v), on, C.line, { s: NAR ? 13 : 15, tc: C.dim });
      }
      pill(`${o.k} = ${res.length ? '{' + res.join(', ') + '}' : '∅'}`, g.a.cx, g.a.y0 + 8, null, { a: 'center', f: FM, w: 500, s: NAR ? 13 : 16, st: C.res, tc: C.res });
    },
    ui: () => [{ type: 'btns', items: OPS.map((o, i) => ({ l: o.k, on: S => S.op === i, f: S => { S.op = i; S.tc = S.t; } })) }],
    cap: S => `<b>${OPS[S.op].n[0].toUpperCase() + OPS[S.op].n.slice(1)}</b>: entram os elementos com ${OPS[S.op].r}.`,
    desc: `<p>Com A = {1, 2, 3, 5, 8} e B = {2, 4, 6, 8, 10}:</p>
<p><b>União</b> <span class="q">A ∪ B</span>: tudo que está em A <b>ou</b> em B (ou nos dois). <b>Interseção</b> <span class="q">A ∩ B</span>: o que está em A <b>e</b> em B ao mesmo tempo. Se <span class="q">A ∩ B = ∅</span>, os conjuntos são <b>disjuntos</b>.</p>
<p><b>Diferença</b> <span class="q">A − B</span>: o que está em A e <b>não</b> está em B. Em geral <span class="q">A − B ≠ B − A</span>.</p>
<p><b>Complementar</b> <span class="q">Aᶜ</span> (ou <span class="q">Ā</span>): o que falta em A para completar U, ou seja, <span class="q">U − A</span>. Quando B ⊂ A, o complementar de B em relação a A é <span class="q">∁<sub>A</sub>B = A − B</span>.</p>
<p>Leis de De Morgan: <span class="q">(A ∪ B)ᶜ = Aᶜ ∩ Bᶜ</span> e <span class="q">(A ∩ B)ᶜ = Aᶜ ∪ Bᶜ</span>. Teste no diagrama: (A ∪ B)ᶜ = {7, 9}.</p>`,
    kv: [['A ∪ B', 'união: “ou”'], ['A ∩ B', 'interseção: “e”, “ambos”'], ['A − B', 'diferença: “só A”, “apenas A”'], ['Aᶜ', 'complementar: “não A”']],
    enem: 'Traduza as palavras do enunciado: “ou” é <b>união</b>; “e”, “ambos”, “simultaneamente” é <b>interseção</b>; “apenas”, “somente” é <b>diferença</b>; “nenhum dos dois” é o <b>complementar da união</b>.'
  });
}

// =====================================================================================
// 5. Contagem: n(A ∪ B)
// =====================================================================================
{
  const fixI = S => { S.I = cl(S.I, Math.max(0, S.M + S.F - S.tot), Math.min(S.M, S.F)); };
  def('linguagem', 'contagem', {
    t: 'Contando elementos: n(A ∪ B)', st: 'O problema de pesquisa do ENEM',
    init: () => ({ M: 60, F: 45, I: 20, tot: 100 }),
    draw(S) {
      const a = area(), top = a.y0 + 34, U = { x: a.x0, y: top, w: a.w, h: a.y1 - top - (NAR ? 66 : 58) };
      const r = Math.min(U.h * .42, a.w * (NAR ? .28 : .2)), d = r * .62, cy = U.y + U.h / 2 + 6, ax = a.cx - d, bx = a.cx + d;
      pill('Pesquisa com 100 alunos: gosta de Matemática (M)? E de Física (F)?', a.cx, a.y0 + 8, null, { a: 'center', s: NAR ? 11 : 14 });
      frame(U.x, U.y, U.w, U.h);
      tx('U: 100 alunos', U.x + 14, U.y + 18, { a: 'left', s: 13, c: C.dim });
      const pA = pEll(ax, cy, r, r), pB = pEll(bx, cy, r, r);
      region([['add', pA], ['in', pB]], C.res, .22 + .12 * Math.sin(S.t * 3));
      blob(ax, cy, r, r, C.A, { a0: .14, a1: .03 }); blob(bx, cy, r, r, C.B, { a0: .14, a1: .03 });
      tx('M', ax - r * .7, cy - r * .86, { f: FH, s: 20, w: 700, c: C.A }); tx('F', bx + r * .7, cy - r * .86, { f: FH, s: 20, w: 700, c: C.B });
      const big = NAR ? 20 : 26, sm = NAR ? 11 : 12, un = S.M + S.F - S.I, nen = S.tot - un;
      tx(String(S.M - S.I), ax - r * .45, cy, { f: FM, w: 500, s: big, c: C.A }); tx('só M', ax - r * .45, cy + big * .9, { s: sm, c: C.dim });
      tx(String(S.I), a.cx, cy, { f: FM, w: 500, s: big, c: C.res }); tx('as duas', a.cx, cy + big * .9, { s: sm, c: C.dim });
      tx(String(S.F - S.I), bx + r * .45, cy, { f: FM, w: 500, s: big, c: C.B }); tx('só F', bx + r * .45, cy + big * .9, { s: sm, c: C.dim });
      tx(String(nen), U.x + U.w - 40, U.y + U.h - 34, { f: FM, w: 500, s: big * .8, c: C.txt }); tx('nenhuma', U.x + U.w - 40, U.y + U.h - 14, { s: sm, c: C.dim });
      const fy = a.y1 - (NAR ? 44 : 36), f1 = `n(M ∪ F) = n(M) + n(F) − n(M ∩ F) = ${S.M} + ${S.F} − ${S.I} = ${un}`;
      tx(f1, a.cx, fy, { f: FM, w: 500, s: fit(f1, a.w, NAR ? 13 : 16, 500, FM), c: C.txt });
      const f2 = `Nenhuma das duas: 100 − ${un} = ${nen}`;
      tx(f2, a.cx, fy + (NAR ? 18 : 24), { f: FM, w: 500, s: fit(f2, a.w, NAR ? 13 : 15, 500, FM), c: C.dim });
    },
    ui: () => [
      { type: 'range', l: 'Gostam de M', min: 0, max: 100, get: S => S.M, set: (S, v) => { S.M = v; fixI(S); } },
      { type: 'range', l: 'Gostam de F', min: 0, max: 100, get: S => S.F, set: (S, v) => { S.F = v; fixI(S); } },
      { type: 'range', l: 'Gostam das duas', min: 0, max: 100, get: S => S.I, set: (S, v) => { S.I = v; fixI(S); } }
    ],
    cap: S => `Somar ${S.M} + ${S.F} = ${S.M + S.F} conta <b>duas vezes</b> os ${S.I} alunos que gostam das duas matérias. Por isso a interseção é subtraída uma vez.`,
    desc: `<p>Para contar os elementos de uma união, some os dois conjuntos e tire a parte contada em dobro:</p>
<div class="passos"><b>De onde vem a fórmula</b><ol>
<li>Pense em cada aluno como uma bolinha. Contar a união é contar as bolinhas que estão dentro de pelo menos um dos círculos, <b>uma vez cada</b>.</li>
<li>Se você conta o círculo M (60) e depois o círculo F (45), as bolinhas da parte do meio entram nas duas contagens.</li>
<li>Então 60 + 45 = 105 é maior que o número real de alunos: as 20 bolinhas do meio foram contadas duas vezes.</li>
<li>Para corrigir, tire uma vez o que sobrou em dobro: 105 − 20 = 85. Escrevendo em geral:</li>
</ol><span class="eq">n(A ∪ B) = n(A) + n(B) − n(A ∩ B)</span>
<p>Se os conjuntos não se tocam (interseção vazia), nada foi contado em dobro e a união é só a soma.</p></div>
<p>Esse é o <b>princípio da inclusão e exclusão</b>. Os controles respeitam os limites reais: a interseção não pode passar do menor conjunto, e a união não pode passar de 100 alunos.</p>
<p>Método seguro: preencha o diagrama <b>de dentro para fora</b>. Comece pela interseção, depois “só M” = n(M) − n(M ∩ F), depois “só F”, e por último quem está fora dos dois.</p>
<p>Com três conjuntos: <span class="q">n(A ∪ B ∪ C) = n(A) + n(B) + n(C) − n(A ∩ B) − n(A ∩ C) − n(B ∩ C) + n(A ∩ B ∩ C)</span>.</p>`,
    kv: [['n(A ∪ B)', 'n(A) + n(B) − n(A ∩ B)'], ['só A', 'n(A) − n(A ∩ B)'], ['nenhum', 'n(U) − n(A ∪ B)']],
    enem: 'Um dos assuntos de conjuntos <b>mais cobrados</b>: pesquisas de opinião, leitores de revistas, vacinação, tipos sanguíneos (antígenos A, B e fator Rh). Quase sempre a pergunta é “quantos não…” ou “quantos só…”. Preencha o Venn de dentro para fora antes de fazer qualquer conta.'
  });
}

// =====================================================================================
// Diagrama dos conjuntos numéricos (usado em 6 e 10)
// =====================================================================================
const NUMS = [
  { s: '5', L: 0 }, { s: '0', L: 0 }, { s: '√9', L: 0, n: '√9 = 3, que é natural.' },
  { s: '−3', L: 1 }, { s: '−√16', L: 1, n: '−√16 = −4.' },
  { s: '3/4', L: 2 }, { s: '−0,25', L: 2, n: '−0,25 = −1/4.' }, { s: '0,333…', L: 2, n: '0,333… = 1/3: dízima periódica.' },
  { s: '√2', L: 3, n: 'Decimal infinito que não se repete.' }, { s: 'π', L: 3, n: 'π ≈ 3,14 é só uma aproximação.' },
  { s: '√−4', L: 4, n: 'Nenhum número real ao quadrado dá −4.' }
];
function numGeo() {
  const a = area(), top = a.y0 + 32, Rh = a.y1 - top - 34;
  const R = { x: a.x0, y: top, w: a.w, h: Rh }, cy = top + Rh / 2;
  const Q = { cx: a.x0 + a.w * .37, cy, rx: a.w * .34, ry: Rh * .46 };
  const Z = { cx: a.x0 + a.w * .3, cy, rx: a.w * .245, ry: Rh * .34 };
  const N = { cx: a.x0 + a.w * .23, cy, rx: a.w * .145, ry: Rh * .21 };
  const Ix = Q.cx + Q.rx + (R.x + R.w - Q.cx - Q.rx) / 2;
  const P = {};
  P['5'] = [N.cx - N.rx * .42, cy - N.ry * .3]; P['0'] = [N.cx + N.rx * .42, cy - N.ry * .3]; P['√9'] = [N.cx, cy + N.ry * .45];
  const zx = (N.cx + N.rx + Z.cx + Z.rx) / 2; P['−3'] = [zx, cy - Z.ry * .4]; P['−√16'] = [zx, cy + Z.ry * .4];
  const qx = (Z.cx + Z.rx + Q.cx + Q.rx) / 2; P['3/4'] = [qx, cy - Rh * .2]; P['−0,25'] = [qx, cy]; P['0,333…'] = [qx, cy + Rh * .2];
  P['√2'] = [Ix, cy - Rh * .16]; P['π'] = [Ix, cy + Rh * .16]; P['√−4'] = [R.x + R.w - 40, a.y1 - 12];
  return { a, R, Q, Z, N, Ix, P, paths: {
    R: pRect(R.x, R.y, R.w, R.h), Q: pEll(Q.cx, Q.cy, Q.rx, Q.ry), Z: pEll(Z.cx, Z.cy, Z.rx, Z.ry), N: pEll(N.cx, N.cy, N.rx, N.ry),
    I: Object.assign(c => { c.roundRect(R.x, R.y, R.w, R.h, 14); c.ellipse(Q.cx, Q.cy, Q.rx, Q.ry, 0, 0, TAU); }, { eo: true })
  } };
}
function drawNumSets(g, glow = {}) {
  const { R, Q, Z, N, Ix } = g, gl = k => glow[k] ? 3 : 1.6;
  X.save(); X.shadowColor = rgba(C.R, .5); X.shadowBlur = glow.R ? 20 : 10; rr(R.x, R.y, R.w, R.h, 16, rgba(C.R, .05), C.R, gl('R')); X.restore();
  blob(Q.cx, Q.cy, Q.rx, Q.ry, C.Q, { a0: .12, a1: .03, lw: gl('Q'), glow: glow.Q ? 22 : 10 });
  blob(Z.cx, Z.cy, Z.rx, Z.ry, C.Z, { a0: .14, a1: .04, lw: gl('Z'), glow: glow.Z ? 22 : 10 });
  blob(N.cx, N.cy, N.rx, N.ry, C.N, { a0: .18, a1: .05, lw: gl('N'), glow: glow.N ? 22 : 10 });
  const fs = NAR ? 15 : 18;
  tx('ℝ', R.x + 14, R.y + 16, { a: 'left', f: FH, s: fs, w: 700, c: C.R });
  tx('ℚ', Q.cx, Q.cy - Q.ry + 15, { f: FH, s: fs, w: 700, c: C.Q });
  tx('ℤ', Z.cx, Z.cy - Z.ry + 15, { f: FH, s: fs, w: 700, c: C.Z });
  tx('ℕ', N.cx, N.cy - N.ry + 14, { f: FH, s: fs, w: 700, c: C.N });
  tx('𝕀', Ix, R.y + 18, { f: FH, s: fs, w: 700, c: C.I });
  if (!NAR) tx('irracionais', Ix, R.y + 36, { s: 12, c: C.dim });
  if (glow.I) { X.save(); X.beginPath(); g.paths.I(X); X.clip('evenodd'); rr(R.x, R.y, R.w, R.h, 14, null, C.I, 3); ell(Q.cx, Q.cy, Q.rx, Q.ry, null, C.I, 3); X.restore(); }
}
const LVS = [['N', 'ℕ'], ['Z', 'ℤ'], ['Q', 'ℚ'], ['R', 'ℝ']];
function memb(L) { // conjuntos que contêm um número de nível L
  if (L === 4) return []; if (L === 3) return ['I', 'R'];
  return LVS.slice(L).map(p => p[0]);
}
const SYM = { N: 'ℕ', Z: 'ℤ', Q: 'ℚ', R: 'ℝ', I: '𝕀' };

// =====================================================================================
// 6. Conjuntos numéricos
// =====================================================================================
def('numericos', 'numericos', {
  t: 'Os conjuntos numéricos', st: 'ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ',
  init: () => ({ sel: 3, boxes: [] }),
  draw(S) {
    const g = numGeo(), cur = NUMS[S.sel], m = memb(cur.L), glow = {}; m.forEach(k => glow[k] = 1);
    drawNumSets(g, glow);
    pill('ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ      ℝ = ℚ ∪ 𝕀', g.a.cx, g.a.y0 + 8, null, { a: 'center', f: FM, w: 500, s: NAR ? 12 : 14 });
    S.boxes = [];
    NUMS.forEach((n, i) => {
      const [x, y] = g.P[n.s], on = i === S.sel;
      const b = pill(n.s, x, y, null, { a: 'center', f: FM, w: 500, s: NAR ? 12 : 14, bg: on ? C.res : 'rgba(11,15,28,.9)', st: on ? C.res : 'rgba(255,255,255,.18)', tc: on ? C.ink : C.txt });
      S.boxes.push({ ...b, i });
    });
    tx('fora de ℝ', g.P['√−4'][0] - 34, g.a.y1 - 12, { a: 'right', s: 12, c: C.dim });
  },
  down(S, x, y) { const b = S.boxes.find(b => inBox(b, x, y)); if (b) S.sel = b.i; return false; },
  hover: (S, x, y) => S.boxes.some(b => inBox(b, x, y)) ? 'pointer' : '',
  ui: () => [{ type: 'btns', l: 'Número', items: NUMS.map((n, i) => ({ l: n.s, on: S => S.sel === i, f: S => { S.sel = i; } })) }],
  cap(S) {
    const n = NUMS[S.sel], m = memb(n.L);
    if (!m.length) return `<b>${n.s} ∉ ℝ</b>. ${n.n}`;
    const no = ['N', 'Z', 'Q', 'I'].filter(k => !m.includes(k) && !(k === 'I' && n.L < 3) && !(n.L === 3 && k !== 'I'));
    const yes = m.map(k => `${n.s} ∈ ${SYM[k]}`).join(', ');
    const notS = n.L === 3 ? ` mas ${n.s} ∉ ℚ` : n.L > 0 ? ` mas ${n.s} ∉ ${SYM[LVS[n.L - 1][0]]}` : '';
    return `<b>${yes}</b>${notS ? ',' + notS : ''}. ${n.n || ''}`.replace(/,([^,]*)$/, ' e$1').replace(' e mas', ', mas');
  },
  desc: `<p>Cada conjunto apareceu para resolver uma conta que o anterior não resolvia (veja o tópico 9). Por isso eles se encaixam um dentro do outro, como na tela.</p>
<p><b>Naturais</b> <span class="q">ℕ = {0, 1, 2, 3, …}</span>: os números de contar.</p>
<p><b>Inteiros</b> <span class="q">ℤ = {…, −2, −1, 0, 1, 2, …}</span>: naturais e seus opostos.</p>
<p><b>Racionais</b> <span class="q">ℚ = {a/b | a, b ∈ ℤ, b ≠ 0}</span>: tudo que se escreve como fração. Inclui inteiros (5 = 5/1), decimais finitos (0,25 = 1/4) e dízimas periódicas (0,333… = 1/3).</p>
<p><b>Irracionais</b> <span class="q">𝕀</span>: decimais infinitos <b>e</b> não periódicos, que não viram fração: √2, √3, π.</p>
<p><b>Reais</b> <span class="q">ℝ = ℚ ∪ 𝕀</span>: todos os pontos da reta numérica.</p>
<p>Notações: o asterisco tira o zero (<span class="q">ℤ* = ℤ − {0}</span>); o sinal + deixa só os não negativos (<span class="q">ℤ₊ = ℕ</span>) e o sinal − só os não positivos (<span class="q">ℤ₋</span>).</p>`,
  kv: [['ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ', 'cada conjunto está dentro do seguinte'], ['ℚ ∩ 𝕀', '∅: nenhum número é os dois'], ['ℚ ∪ 𝕀', 'ℝ']],
  enem: 'Armadilhas clássicas: <b>√9 é natural</b> (vale 3); <b>0,333… é racional</b> (vale 1/3); <b>π ≈ 3,14</b> é aproximação, π continua irracional. Raiz quadrada de número negativo não é real.'
});

// =====================================================================================
// 7. Racionais: decimais e fração geratriz (🔭 Galileo: divisão longa com detecção de período)
// =====================================================================================
{
  function expand(a, b) {
    const g = gcd(a, b); a /= g; b /= g;
    const ip = Math.floor(a / b); let r = a % b; const dig = [], rems = [], seen = new Map();
    while (r !== 0 && !seen.has(r)) { seen.set(r, dig.length); rems.push(r); r *= 10; dig.push(Math.floor(r / b)); r %= b; }
    const per = r === 0 ? -1 : seen.get(r);
    return { a, b, ip, dig, rems, per, rep: r };
  }
  function factor(n) { const f = []; for (let p = 2; p * p <= n; p++) { let k = 0; while (n % p === 0) { n /= p; k++; } if (k) f.push([p, k]); } if (n > 1) f.push([n, 1]); return f; }
  const fstr = f => f.length ? f.map(([p, k]) => p + (k > 1 ? sup(k) : '')).join(' · ') : '1';
  const EX = [[1, 3], [1, 6], [3, 11], [7, 8], [1, 7], [5, 12]];
  def('numericos', 'racionais', {
    t: 'Racionais: decimais e fração geratriz', st: 'Por que a dízima se repete',
    init: () => ({ a: 1, b: 6 }),
    draw(S) {
      const a = area(), E = expand(S.a, S.b), fin = E.per < 0;
      const pre = fin ? E.dig : E.dig.slice(0, E.per), per = fin ? [] : E.dig.slice(E.per);
      let y = a.y0 + (NAR ? 26 : 34);
      // fração e decimal
      const fs = NAR ? 22 : 30, x0 = a.x0 + (NAR ? 6 : 20);
      tx(String(S.a), x0 + 22, y - fs * .55, { f: FM, w: 500, s: fs, c: C.txt }); line(x0, y, x0 + 44, y, C.txt, 2);
      tx(String(S.b), x0 + 22, y + fs * .6, { f: FM, w: 500, s: fs, c: C.txt });
      const intS = String(E.ip) + (E.dig.length ? ',' : '');
      const preS = pre.join(''), perS = per.join(''), tail = fin ? '' : '…';
      let ds = fs; const maxw = a.x1 - x0 - 80; while (ds > 11 && tw('= ' + intS + preS + perS + perS + tail, ds, 500, FM) > maxw) ds--;
      let cx = x0 + 60; X.font = `500 ${ds}px ${FM}`;
      tx('= ' + intS + preS, cx, y + 2, { a: 'left', f: FM, w: 500, s: ds });
      cx += tw('= ' + intS + preS, ds, 500, FM);
      if (perS) {
        const pw = tw(perS, ds, 500, FM); tx(perS, cx, y + 2, { a: 'left', f: FM, w: 500, s: ds, c: C.res });
        line(cx, y - ds * .62, cx + pw, y - ds * .62, C.res, 2); cx += pw;
        tx(perS + tail, cx, y + 2, { a: 'left', f: FM, w: 500, s: ds, c: C.dim });
      }
      // classificação
      y += fs + (NAR ? 20 : 26);
      const fb = factor(E.b), so25 = fb.every(([p]) => p === 2 || p === 5);
      const cls = fin ? 'decimal finito' : pre.length ? 'dízima periódica composta' : 'dízima periódica simples';
      const pb = pill(cls, x0, y, fin ? C.ok : C.res, { s: NAR ? 12 : 14 });
      const fl = `${S.a}/${S.b}` + (E.a !== S.a ? ` = ${E.a}/${E.b}` : '') + `   denominador ${E.b} = ${fstr(fb)}`;
      if (NAR) { y += 24; tx(fl.trim(), x0, y, { a: 'left', f: FM, w: 500, s: fit(fl, a.x1 - x0, 12, 500, FM, 9), c: so25 ? C.ok : C.dim }); }
      else tx(fl, pb.x + pb.w + 12, y, { a: 'left', f: FM, w: 500, s: fit(fl, a.x1 - pb.x - pb.w - 12, 14, 500, FM), c: so25 ? C.ok : C.dim });
      // restos da divisão
      y += NAR ? 34 : 44;
      tx('Restos da divisão longa:', x0, y, { a: 'left', s: NAR ? 12 : 14, c: C.dim });
      y += NAR ? 24 : 30;
      const list = E.rems.concat(fin ? [0] : [E.rep]), rad = NAR ? 13 : 16, gap = rad * 2 + (NAR ? 10 : 18);
      const maxn = Math.max(2, Math.floor((a.x1 - x0) / gap));
      const shown = list.length > maxn ? list.slice(0, maxn - 2).concat(['…', list[list.length - 1]]) : list;
      shown.forEach((r, i) => {
        const x = x0 + rad + i * gap, last = i === shown.length - 1, first = !fin && r === E.rep && E.rems.indexOf(r) === E.per && !last;
        if (i) line(x - gap + rad + 2, y, x - rad - 2, y, C.line, 1.2);
        if (r === '…') { tx('…', x, y, { s: 16, c: C.dim }); return; }
        const hi = (last && !fin) || first, zero = last && fin;
        circ(x, y, rad, hi ? C.res : zero ? C.ok : C.panel2, hi ? C.res : zero ? C.ok : C.line, 1.5);
        tx(String(r), x, y + 1, { f: FM, w: 500, s: NAR ? 12 : 14, c: hi || zero ? C.ink : C.txt });
      });
      tx(fin ? 'resto 0: a divisão termina' : `o resto ${E.rep} repetiu: daqui em diante tudo se repete`, x0, y + rad + 16, { a: 'left', s: NAR ? 11 : 13, c: fin ? C.ok : C.res });
      // fração geratriz
      y += rad + (NAR ? 44 : 56);
      if (y > a.y1 - 20) return;
      tx(fin ? 'De volta à fração:' : 'Fração geratriz (de volta à fração):', x0, y, { a: 'left', s: NAR ? 12 : 14, c: C.dim });
      const m = pre.length, p = per.length, lines = [];
      const xs = intS + preS + (perS ? perS.repeat(Math.max(2, Math.ceil(4 / Math.max(1, perS.length)))) + '…' : '');
      if (fin) {
        const D = 10n ** BigInt(m), Nn = BigInt(E.ip) * D + BigInt(preS || '0');
        lines.push(`x = ${xs}`, `x = ${Nn}/${D} = ${E.a}/${E.b}`);
      } else {
        const big = BigInt(E.ip), hiN = big * 10n ** BigInt(m + p) + BigInt(preS + perS || '0'), loN = big * 10n ** BigInt(m) + BigInt(preS || '0');
        const k1 = m + p, k0 = m, Dn = 10n ** BigInt(k1) - 10n ** BigInt(k0), Nn = hiN - loN;
        const sh = (k) => { const s = intS.replace(',', '') + preS + perS.repeat(Math.max(3, Math.ceil(6 / p) + 2)); return s.slice(0, intS.length - 1 + k).replace(/^0+(?=\d)/, '') + ',' + s.slice(intS.length - 1 + k) + '…'; };
        lines.push(`x = ${xs}`);
        lines.push(`10${sup(k1)}·x = ${sh(k1)}` + (k0 ? `      10${sup(k0)}·x = ${sh(k0)}` : ''));
        lines.push(`${Dn}·x = ${Nn}   →   x = ${Nn}/${Dn} = ${E.a}/${E.b}`);
      }
      lines.forEach((s, i) => { const yy = y + 24 + i * (NAR ? 20 : 26); if (yy < a.y1 + 10) tx(s, x0, yy, { a: 'left', f: FM, w: 500, s: fit(s, a.x1 - x0, NAR ? 12 : 15, 500, FM, 9), c: i === lines.length - 1 ? C.res : C.txt }); });
    },
    ui: () => [
      { type: 'range', l: 'Numerador', min: 1, max: 24, get: S => S.a, set: (S, v) => S.a = v },
      { type: 'range', l: 'Denominador', min: 1, max: 24, get: S => S.b, set: (S, v) => S.b = v },
      { type: 'btns', l: 'Exemplos', items: EX.map(([p, q]) => ({ l: `${p}/${q}`, on: S => S.a === p && S.b === q, f: S => { S.a = p; S.b = q; } })) }
    ],
    cap(S) {
      const E = expand(S.a, S.b);
      if (E.per < 0) return 'Fração irredutível com denominador só de fatores <b>2 e 5</b>: o decimal <b>termina</b>.';
      return `Os restos só podem ir de 1 a ${E.b - 1}. Uma hora um <b>resto se repete</b>, e os algarismos passam a se repetir para sempre: é a dízima periódica.`;
    },
    desc: `<p>Todo racional <span class="q">a/b</span> vira, na divisão, um <b>decimal finito</b> ou uma <b>dízima periódica</b>. Nunca um decimal infinito sem padrão.</p>
<div class="passos"><b>Por que a dízima sempre se repete</b><ol>
<li>Na divisão longa de a por b, cada passo depende só do <b>resto</b> do passo anterior: você “desce um zero” e divide de novo.</li>
<li>O resto é sempre menor que o divisor: na divisão por 6, só pode ser 0, 1, 2, 3, 4 ou 5.</li>
<li>Se aparecer resto 0, a divisão acaba: decimal finito.</li>
<li>Se o 0 nunca aparece, sobram só 5 restos possíveis (1 a 5). Depois de no máximo 5 passos, algum resto <b>tem que repetir</b>, como 6 pessoas em 5 cadeiras.</li>
<li>Resto repetido significa a mesma conta de novo, com os mesmos algarismos, para sempre. Esse bloco é o período.</li>
</ol></div>
<p>Regra rápida: simplifique a fração. Se o denominador só tiver fatores <b>2 e 5</b>, o decimal é finito (7/8 = 0,875). Qualquer outro fator primo gera dízima (1/6 = 0,1666…).</p>
<div class="passos"><b>De onde vem a fração geratriz</b><ol>
<li>O problema da dízima é a cauda infinita: 0,1666… não acaba. A ideia é fazer a cauda <b>se cancelar</b>.</li>
<li>Multiplicar por 10 só anda com a vírgula uma casa para a direita: 10 × 0,1666… = 1,666…</li>
<li>Escolha duas potências de 10 que deixem a <b>mesma cauda</b> depois da vírgula: 100x = 16,666… e 10x = 1,666… Ambas terminam em ,666… para sempre.</li>
<li>Subtraia uma da outra. As caudas iguais somem: 100x − 10x = 16,666… − 1,666… = 15.</li>
<li>Sobra uma conta comum: 90x = 15, logo x = 15/90 = <b>1/6</b>. A fração “escondida” na dízima apareceu.</li>
</ol><p>A tela faz essa mesma construção para qualquer fração que você escolher.</p></div>
<p>Curiosidade: <span class="q">0,999… = 1</span>. Faça a conta: 10x − x = 9,999… − 0,999… = 9, logo x = 1.</p>`,
    kv: [['decimal finito', 'denominador só com fatores 2 e 5'], ['período', 'bloco de algarismos que se repete (com traço em cima)'], ['dízima simples', 'o período começa logo após a vírgula'], ['dízima composta', 'há algarismos antes do período (anteperíodo)']],
    enem: 'O ENEM cobra frações e decimais <b>em contexto</b>: comparar preços, dividir contas, converter receitas. Saber que 1/3 = 0,333… e 2/3 = 0,666… e reconhecer frações simples (1/4 = 0,25; 1/8 = 0,125) poupa tempo nas contas sem calculadora.'
  });
}

// =====================================================================================
// 8. Irracionais na reta
// =====================================================================================
def('numericos', 'irracionais', {
  t: 'Irracionais na reta: √2 e π', st: 'Pontos que nenhuma fração alcança',
  init: () => ({ m: 0 }),
  draw(S) {
    const a = area(), t = S.t, r2 = S.m === 0;
    const span0 = r2 ? 3 : 4, span = Math.max(span0, (a.w - 46) / (a.h * (r2 ? .42 : .4))), lo = r2 ? -.5 : -.3;
    const L = axis({ x0: a.x0 + 20, x1: a.x1 - 26, y: a.y0 + a.h * .7, lo, hi: lo + span });
    drawAxis(L, {});
    const u = L.u, o = L.px(0), y = L.y;
    if (r2) {
      const k1 = ss(t / 1), k2 = ss((t - 1) / 1), k3 = ss((t - 2.2) / 1.8), k4 = ss((t - 4.2) / .6);
      X.save(); X.globalAlpha = k1; rr(o, y - u, u, u, 0, rgba(C.A, .1), C.A, 2); X.restore();
      if (k1 > .5) { tx('1', o + u / 2, y - u - 12, { f: FM, w: 500, s: 14, c: C.A }); tx('1', o + u + 12, y - u / 2, { f: FM, w: 500, s: 14, c: C.A }); }
      if (k2 > 0) {
        const ang = -Math.PI / 4 * (1 - k3), len = u * Math.SQRT2 * (k3 > 0 ? 1 : k2);
        line(o, y, o + Math.cos(ang) * len, y + Math.sin(ang) * len, C.res, 3);
        if (k3 > 0) { X.beginPath(); X.arc(o, y, u * Math.SQRT2, -Math.PI / 4, ang, false); X.strokeStyle = rgba(C.res, .7); X.setLineDash([5, 5]); X.lineWidth = 1.5; X.stroke(); X.setLineDash([]); }
        if (k3 === 0 && k2 > .8) tx('d² = 1² + 1² = 2', o + u * .2, y - u * 1.25, { a: 'left', f: FM, w: 500, s: NAR ? 13 : 16, c: C.res });
      }
      if (k4 > 0) {
        const x = L.px(Math.SQRT2); X.save(); X.globalAlpha = k4; circ(x, y, 7, C.res); line(x, y, x, y + 38, C.res, 1.2, [3, 3]);
        pill('√2', x, y + 52, null, { a: 'center', f: FM, w: 500, st: C.res, tc: C.res }); X.restore();
        const dg = '1,41421356237309504880168872420969807856967187537694';
        const n = Math.floor(cl((t - 4.6) * 10, 0, dg.length));
        tx('√2 = ' + dg.slice(0, Math.max(4, n)) + '…', a.x0 + 10, a.y0 + 20, { a: 'left', f: FM, w: 500, s: fit('√2 = ' + dg + '…', a.w - 20, NAR ? 13 : 16, 500, FM, 8), c: C.txt });
      }
    } else {
      const R = u / 2, th = TAU * ss((t - .6) / 3.4), cxp = o + th * R, cyp = y - R;
      X.save(); X.lineCap = 'round'; line(o, y, cxp, y, C.res, 5); X.restore();
      circ(cxp, cyp, R, rgba(C.B, .08), C.B, 2);
      X.beginPath(); X.arc(cxp, cyp, R, Math.PI / 2, Math.PI / 2 + th, false); X.strokeStyle = C.res; X.lineWidth = 5; X.stroke();
      const mx = cxp + Math.cos(Math.PI / 2 + th) * R, my = cyp + Math.sin(Math.PI / 2 + th) * R; circ(mx, my, 6, C.res);
      line(cxp - R, cyp, cxp + R, cyp, rgba(C.B, .7), 1.2, [4, 4]);
      tx('diâmetro 1', cxp, cyp - 10, { s: 12, c: C.B });
      if (t > 4.1) {
        const x = L.px(Math.PI); line(x, y, x, y + 38, C.res, 1.2, [3, 3]); pill('π', x, y + 52, null, { a: 'center', f: FM, w: 500, st: C.res, tc: C.res });
        const dg = '3,14159265358979323846264338327950288419716939937510';
        const n = Math.floor(cl((t - 4.3) * 10, 0, dg.length));
        tx('π = ' + dg.slice(0, Math.max(4, n)) + '…', a.x0 + 10, a.y0 + 20, { a: 'left', f: FM, w: 500, s: fit('π = ' + dg + '…', a.w - 20, NAR ? 13 : 16, 500, FM, 8), c: C.txt });
      }
    }
  },
  ui: () => [{ type: 'btns', items: [{ l: '√2: diagonal do quadrado', on: S => S.m === 0, f: S => { S.m = 0; S.t = 0; } }, { l: 'π: volta da roda', on: S => S.m === 1, f: S => { S.m = 1; S.t = 0; } }] }],
  cap: S => S.m === 0
    ? 'A diagonal do quadrado de lado 1 mede <b>√2</b> (Pitágoras). Girada com o compasso, ela marca na reta um ponto exato que <b>nenhuma fração</b> alcança.'
    : 'Uma roda de diâmetro 1 dá uma volta e percorre <b>π</b> na reta: o comprimento da circunferência dividido pelo diâmetro.',
  desc: `<p>Um número <b>irracional</b> tem infinitas casas decimais <b>sem período</b>: nunca termina e nunca entra em repetição. Por isso não pode ser escrito como a/b.</p>
<p>Exemplos: <span class="q">√2 ≈ 1,414</span>, <span class="q">√3 ≈ 1,732</span>, <span class="q">π ≈ 3,1416</span>, <span class="q">e ≈ 2,718</span>. A raiz quadrada de um natural que <b>não</b> é quadrado perfeito é sempre irracional (√5, √7, √10), mas √4 = 2 e √25 = 5 são naturais.</p>
<div class="passos"><b>De onde vem o √2, e por que ele não é fração</b><ol>
<li>Você já conhece a área do quadrado: lado × lado. Um quadrado de lado 1 tem área 1.</li>
<li>A diagonal divide esse quadrado em dois triângulos retângulos com catetos 1 e 1. Pelo teorema de Pitágoras, d² = 1² + 1² = 2.</li>
<li>Então a diagonal é o número que, ao quadrado, dá 2: <b>d = √2</b>. Ele existe, é um comprimento que você pode desenhar.</li>
<li>Será que é uma fração a/b? Se fosse, simplificada ao máximo, a² = 2b². Então a² é par, logo a é par (a = 2k). Trocando: 4k² = 2b², ou seja, b² = 2k², e b também é par.</li>
<li>Mas a fração já estava simplificada e não podia ter os dois termos pares. Contradição: <b>√2 não é fração</b>. É irracional.</li>
</ol></div>
<p>Mesmo sem fração, o irracional tem lugar exato na reta: a animação constrói √2 com régua e compasso. Juntos, racionais e irracionais preenchem a reta inteira, sem buracos: é a <b>reta real</b>, e cada ponto dela é um número real.</p>
<p>Entre dois reais quaisquer existem infinitos outros reais.</p>`,
  kv: [['√2', '≈ 1,41'], ['√3', '≈ 1,73'], ['π', '≈ 3,14'], ['√n', 'irracional se n não é quadrado perfeito']],
  enem: 'O enunciado costuma dar a aproximação: “use π = 3” ou “considere √2 = 1,4”. Use exatamente o valor dado, senão a conta não bate com as alternativas. Também cai <b>estimar</b> uma raiz: √50 fica entre 7 e 8, porque 49 &lt; 50 &lt; 64.'
});

// =====================================================================================
// 9. Operações com números: fechamento
// =====================================================================================
{
  const P = [
    { l: '2 + 5', a: 2, r: 7, e: '2 + 5 = 7', b: [['2', '∈ ℕ', 1], ['5', '∈ ℕ', 1], ['7', '∈ ℕ', 1]], k: 'Natural mais natural dá natural: <b>ℕ é fechado para a adição</b>.' },
    { l: '2 − 5', a: 2, r: -3, e: '2 − 5 = −3', b: [['2', '∈ ℕ', 1], ['5', '∈ ℕ', 1], ['−3', '∉ ℕ', 0]], k: '2 e 5 são naturais, mas −3 não: <b>a subtração não é fechada em ℕ</b>. Em ℤ ela é.' },
    { l: '(−2) × 3', a: -2, r: -6, e: '(−2) × 3 = −6', b: [['−2', '∈ ℤ', 1], ['3', '∈ ℤ', 1], ['−6', '∈ ℤ', 1]], k: 'Inteiro vezes inteiro dá inteiro: <b>ℤ é fechado para a multiplicação</b>. Sinais diferentes, produto negativo.' },
    { l: '1 ÷ 2', a: 1, r: .5, e: '1 ÷ 2 = 0,5', b: [['1', '∈ ℤ', 1], ['2', '∈ ℤ', 1], ['0,5', '∉ ℤ', 0]], k: '1 e 2 são inteiros, mas 0,5 não: <b>a divisão não é fechada em ℤ</b>. Em ℚ ela é, com divisor diferente de zero.' },
    { l: '√2 × √2', a: Math.SQRT2, r: 2, e: '√2 × √2 = 2', b: [['√2', '∈ 𝕀', 1], ['√2', '∈ 𝕀', 1], ['2', '∉ 𝕀', 0]], k: 'Dois irracionais deram um natural: <b>𝕀 não é fechado para a multiplicação</b>.' },
    { l: '√2 + (−√2)', a: Math.SQRT2, r: 0, e: '√2 + (−√2) = 0', b: [['√2', '∈ 𝕀', 1], ['−√2', '∈ 𝕀', 1], ['0', '∉ 𝕀', 0]], k: 'A soma de irracionais pode dar racional: <b>𝕀 também não é fechado para a adição</b>.' },
    { l: '1 + √2', a: 1, r: 1 + Math.SQRT2, e: '1 + √2 ≈ 2,414', b: [['1', '∈ ℚ', 1], ['√2', '∈ 𝕀', 1], ['1 + √2', '∈ 𝕀', 1]], k: 'Racional somado a irracional dá <b>sempre irracional</b>.' }
  ];
  def('numericos', 'fechamento', {
    t: 'Operações com números: quando o resultado escapa', st: 'Fechamento de ℕ, ℤ, ℚ e ℝ',
    init: () => ({ p: 1, tc: 0 }),
    draw(S) {
      const a = area(), p = P[S.p], k = ss((S.t - S.tc) / 1.1);
      tx(p.e, a.cx, a.y0 + 16, { f: FM, w: 500, s: NAR ? 22 : 30, c: C.txt });
      const L = axis({ x0: a.x0 + 16, x1: a.x1 - 26, y: a.y0 + a.h * .58, lo: -7, hi: 7 });
      for (let v = -7; v <= 7; v++) circ(L.px(v), L.y, 3.2, v >= 0 ? C.N : C.Z);
      drawAxis(L, {});
      tx('naturais', L.px(3.5), L.y - 24, { s: 12, c: C.N }); tx('inteiros negativos', L.px(-3.5), L.y - 24, { s: 12, c: C.Z });
      const xa = L.px(p.a), xr = L.px(p.r), h = Math.min(a.h * .3, Math.abs(xr - xa) * .5 + 30);
      circ(xa, L.y, 7, C.A);
      X.beginPath(); const steps = 40;
      for (let i = 0; i <= steps * k; i++) { const s = i / steps, x = lerp(xa, xr, s), y = L.y - Math.sin(s * Math.PI) * h; i ? X.lineTo(x, y) : X.moveTo(x, y); }
      X.strokeStyle = C.res; X.lineWidth = 2.5; X.stroke();
      if (k >= 1) { circ(xr, L.y, 8, C.res); }
      const by = L.y + 56, bw = Math.min(a.w / 3 - 8, 190);
      p.b.forEach(([n, rel, ok], i) => {
        if (i === 2 && k < 1) return;
        const x = a.cx + (i - 1) * (bw + 8);
        pill(`${n} ${rel}`, x, by, null, { a: 'center', f: FM, w: 500, s: NAR ? 12 : 15, st: ok ? C.ok : C.bad, tc: ok ? C.ok : C.bad, lw: 1.5 });
      });
    },
    ui: () => [{ type: 'btns', l: 'Conta', items: P.map((p, i) => ({ l: p.l, on: S => S.p === i, f: S => { S.p = i; S.tc = S.t; } })) }],
    cap: S => P[S.p].k,
    desc: `<div class="passos"><b>Por que os conjuntos foram crescendo</b><ol>
<li>Os naturais nasceram de contar: 0, 1, 2, 3… Somar e multiplicar naturais dá natural.</li>
<li>Mas “tenho 2 e devo 5” não tem resposta em ℕ. Para a subtração sempre funcionar, criamos os negativos: ℤ.</li>
<li>“Dividir 1 pizza entre 2 pessoas” não tem resposta em ℤ. Para a divisão funcionar, criamos as frações: ℚ.</li>
<li>“Qual o lado de um quadrado de área 2?” não tem resposta em ℚ. Para medir qualquer comprimento, completamos a reta com os irracionais: ℝ.</li>
<li>Cada conjunto novo <b>contém</b> o anterior e resolve a conta que escapava dele. Por isso ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ.</li>
</ol></div>
<p>Um conjunto é <b>fechado</b> para uma operação quando operar dois elementos dele sempre dá um resultado que também está nele. Cada ampliação dos conjuntos numéricos resolveu uma operação que “escapava”:</p>
<div class="tab"><table><thead><tr><th>Operação</th><th>ℕ</th><th>ℤ</th><th>ℚ</th><th>ℝ</th></tr></thead><tbody>
<tr><td>adição</td><td>sim</td><td>sim</td><td>sim</td><td>sim</td></tr>
<tr><td>subtração</td><td>não (2 − 5)</td><td>sim</td><td>sim</td><td>sim</td></tr>
<tr><td>multiplicação</td><td>sim</td><td>sim</td><td>sim</td><td>sim</td></tr>
<tr><td>divisão (divisor ≠ 0)</td><td>não (1 ÷ 2)</td><td>não (1 ÷ 2)</td><td>sim</td><td>sim</td></tr>
<tr><td>raiz quadrada</td><td>não (√2)</td><td>não</td><td>não (√2)</td><td>só de não negativos</td></tr>
</tbody></table></div>
<p>Lembretes das operações: sinais iguais dão produto positivo, sinais diferentes dão negativo. Frações se somam com o mesmo denominador (MMC) e se dividem multiplicando pelo inverso: <span class="q">(2/3) ÷ (4/5) = (2/3) × (5/4) = 10/12 = 5/6</span>. Divisão por zero não existe em nenhum conjunto.</p>`,
    kv: [['fechado', 'a operação nunca sai do conjunto'], ['(−) × (−)', '+'], ['(+) × (−)', '−'], ['a ÷ 0', 'não existe']],
    enem: 'O ENEM não usa a palavra “fechado”, mas cobra as operações o tempo todo: <b>frações, decimais, sinais e ordem das operações</b> aparecem em quase toda questão de Matemática. Um saldo bancário negativo, uma temperatura abaixo de zero ou a divisão de uma conta entre amigos são essas operações em contexto.'
  });
}

// =====================================================================================
// 10. Operações entre conjuntos numéricos
// =====================================================================================
{
  const OPS = [
    { k: 'ℤ − ℕ', sh: '{…, −2, −1}', reg: p => [['add', p.Z], ['out', p.N]], in: L => L === 1, r: '{…, −3, −2, −1}: os inteiros negativos' },
    { k: 'ℕ ∩ ℤ', sh: 'ℕ', reg: p => [['add', p.N], ['in', p.Z]], in: L => L === 0, r: 'ℕ, porque ℕ ⊂ ℤ' },
    { k: 'ℕ ∪ ℤ', sh: 'ℤ', reg: p => [['add', p.N], ['add', p.Z]], in: L => L <= 1, r: 'ℤ, porque ℕ ⊂ ℤ' },
    { k: 'ℚ − ℤ', sh: 'frações não inteiras', reg: p => [['add', p.Q], ['out', p.Z]], in: L => L === 2, r: 'as frações que não são inteiras, como 3/4 e −0,25' },
    { k: 'ℚ ∩ 𝕀', sh: '∅', reg: p => [['add', p.Q], ['in', p.I]], in: () => false, r: '∅: nenhum número é racional e irracional ao mesmo tempo' },
    { k: 'ℚ ∪ 𝕀', sh: 'ℝ', reg: p => [['add', p.Q], ['add', p.I]], in: L => L <= 3, r: 'ℝ, todos os reais' },
    { k: 'ℝ − ℚ', sh: '𝕀', reg: p => [['add', p.R], ['out', p.Q]], in: L => L === 3, r: '𝕀, os irracionais' }
  ];
  def('numericos', 'entre-conjuntos', {
    t: 'Operações entre os conjuntos numéricos', st: 'ℤ − ℕ, ℚ ∩ 𝕀, ℝ − ℚ…',
    init: () => ({ op: 0, tc: 0 }),
    draw(S) {
      const g = numGeo(), o = OPS[S.op];
      drawNumSets(g);
      region(o.reg(g.paths), C.res, .3 * ss((S.t - S.tc) / .35));
      NUMS.forEach(n => { if (n.L === 4) return; const [x, y] = g.P[n.s], on = o.in(n.L);
        pill(n.s, x, y, null, { a: 'center', f: FM, w: 500, s: NAR ? 11 : 13, bg: on ? C.res : 'rgba(11,15,28,.82)', st: on ? C.res : 'rgba(255,255,255,.12)', tc: on ? C.ink : C.dim }); });
      pill(`${o.k} = ${o.sh}`, g.a.cx, g.a.y0 + 8, null, { a: 'center', f: FM, w: 500, s: NAR ? 12 : 15, st: C.res, tc: C.res });
    },
    ui: () => [{ type: 'btns', items: OPS.map((o, i) => ({ l: o.k, on: S => S.op === i, f: S => { S.op = i; S.tc = S.t; } })) }],
    cap: S => `<b>${OPS[S.op].k}</b> = ${OPS[S.op].r}.`,
    desc: `<p>Os conjuntos numéricos são conjuntos como quaisquer outros, então valem as mesmas operações do diagrama de Venn.</p>
<p>Como <span class="q">ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ</span>, a união de dois deles é sempre o maior, e a interseção é sempre o menor: <span class="q">ℤ ∪ ℚ = ℚ</span>, <span class="q">ℤ ∩ ℚ = ℤ</span>.</p>
<p>Racionais e irracionais são <b>disjuntos</b> e, juntos, formam os reais: <span class="q">ℚ ∩ 𝕀 = ∅</span> e <span class="q">ℚ ∪ 𝕀 = ℝ</span>. Por isso <span class="q">𝕀 = ℝ − ℚ</span>: irracional é o real que não é racional.</p>
<p>A diferença “tira” um conjunto do outro: <span class="q">ℤ − ℕ</span> deixa só os inteiros negativos; <span class="q">ℚ − ℤ</span> deixa as frações que não são inteiras.</p>`,
    kv: [['A ⊂ B', 'então A ∪ B = B e A ∩ B = A'], ['ℚ ∩ 𝕀', '∅'], ['ℝ − ℚ', '𝕀']],
    enem: 'Questões de vestibular e do ENEM pedem para marcar a afirmação <b>verdadeira</b> sobre conjuntos numéricos (“ℤ ⊂ ℚ”, “ℚ ∩ 𝕀 = ∅”, “ℕ ∪ ℤ = ℤ”). Desenhe o diagrama de ovais encaixadas e confira cada item nele.'
  });
}

// =====================================================================================
// 11. Intervalos reais
// =====================================================================================
{
  const LO = -6, HI = 6, snap = v => cl(Math.round(v * 2) / 2, LO, HI);
  const iv = S => ({ a: S.ia ? -Infinity : S.a, b: S.ib ? Infinity : S.b, ca: !S.ia && S.ca, cb: !S.ib && S.cb });
  function sb(I) {
    const l = I.a === -Infinity ? '' : `${fm(I.a)} ${I.ca ? '≤' : '<'} `, r = I.b === Infinity ? '' : ` ${I.cb ? '≤' : '<'} ${fm(I.b)}`;
    if (!l && !r) return 'ℝ';
    return `{x ∈ ℝ | ${l}x${r}}`;
  }
  function ints(I) {
    if (I.a === -Infinity || I.b === Infinity) return null;
    const L = []; for (let k = Math.ceil(I.a); k <= Math.floor(I.b); k++) { if ((k === I.a && !I.ca) || (k === I.b && !I.cb)) continue; L.push(k); } return L;
  }
  def('intervalos', 'intervalos', {
    t: 'Intervalos de números reais', st: 'Bolinha cheia e bolinha vazia', drag: true,
    init: () => ({ a: -2, b: 3, ca: true, cb: false, ia: false, ib: false, dr: null, L: null }),
    draw(S) {
      const a = area(), I = iv(S);
      const L = S.L = axis({ x0: a.x0 + 22, x1: a.x1 - 30, y: a.y0 + a.h * (NAR ? .55 : .58), lo: LO, hi: HI });
      const s1 = ivStr(I), s2 = s1.replace(/^\]/, '(').replace(/\[$/, ')').replace(/^\[/, '[').replace(/\]$/, ']');
      const alt = (I.a === -Infinity ? '(−∞' : (I.ca ? '[' : '(') + fm(I.a)) + '; ' + (I.b === Infinity ? '+∞)' : fm(I.b) + (I.cb ? ']' : ')'));
      X.save(); X.shadowColor = rgba(C.res, .5); X.shadowBlur = 18; tx(s1, a.cx, a.y0 + (NAR ? 14 : 26), { f: FM, w: 500, s: NAR ? 26 : 44, c: C.res }); X.restore();
      if (NAR) { tx(`também escrito ${alt}`, a.cx, a.y0 + 44, { f: FM, w: 500, s: 12, c: C.txt }); tx(sb(I), a.cx, a.y0 + 64, { f: FM, w: 500, s: fit(sb(I), a.w, 13, 500, FM), c: C.txt }); }
      else { const s3 = `também escrito ${alt}      ${sb(I)}`; tx(s3, a.cx, a.y0 + 76, { f: FM, w: 500, s: fit(s3, a.w, 15, 500, FM), c: C.txt }); }
      drawAxis(L, {});
      drawIv(L, I, C.res, L.y, 7);
      const it = ints(I);
      if (it) it.forEach(k => { const x = L.px(k); circ(x, L.y + 34, 4, C.A); });
      const i1 = it ? `Inteiros no intervalo: ${it.length ? it.map(fm).join(', ') : 'nenhum'} (${it.length})` : 'Intervalo infinito: contém infinitos inteiros.', i2 = it ? `comprimento: ${fm(I.b - I.a)}` : '';
      if (NAR) { tx(i1, a.cx, L.y + 64, { f: FM, w: 500, s: fit(i1, a.w, 12, 500, FM, 9), c: C.A }); if (i2) tx(i2, a.cx, L.y + 84, { f: FM, w: 500, s: 12, c: C.dim }); }
      else { const info = i1 + (i2 ? '      ' + i2 : ''); tx(info, a.cx, L.y + 64, { f: FM, w: 500, s: fit(info, a.w, 14, 500, FM, 9), c: C.A }); }
      if (!S.ia) tx('a', L.px(S.a), L.y - 22, { f: FM, w: 500, s: 14, c: C.dim });
      if (!S.ib) tx('b', L.px(S.b), L.y - 22, { f: FM, w: 500, s: 14, c: C.dim });
    },
    down(S, x, y) {
      const L = S.L; if (!L || Math.abs(y - L.y) > 30) return false;
      const da = S.ia ? 1e9 : Math.abs(x - L.px(S.a)), db = S.ib ? 1e9 : Math.abs(x - L.px(S.b));
      if (Math.min(da, db) > 24) return false;
      S.dr = da <= db ? 'a' : 'b'; S.x0 = x; S.mv = false;
    },
    move(S, x) { if (!S.dr) return; if (Math.abs(x - S.x0) > 4) S.mv = true; if (!S.mv) return; const v = snap(S.L.val(x));
      if (S.dr === 'a') S.a = Math.min(v, S.b - .5); else S.b = Math.max(v, S.a + .5); },
    up(S) { if (S.dr && !S.mv) { if (S.dr === 'a') S.ca = !S.ca; else S.cb = !S.cb; } S.dr = null; },
    hover: (S, x, y) => S.L && Math.abs(y - S.L.y) < 30 && ((!S.ia && Math.abs(x - S.L.px(S.a)) < 24) || (!S.ib && Math.abs(x - S.L.px(S.b)) < 24)) ? 'ew-resize' : '',
    ui: () => [{ type: 'btns', l: 'Extremos', items: [
      { l: 'a fechado', on: S => S.ca && !S.ia, f: S => { S.ia = false; S.ca = !S.ca; } },
      { l: 'b fechado', on: S => S.cb && !S.ib, f: S => { S.ib = false; S.cb = !S.cb; } },
      { l: '−∞', on: S => S.ia, f: S => { S.ia = !S.ia; } },
      { l: '+∞', on: S => S.ib, f: S => { S.ib = !S.ib; } }
    ] }],
    cap: () => '<b>Bolinha cheia</b>: o extremo pertence ao intervalo. <b>Bolinha vazia</b>: não pertence. Arraste os extremos; toque num deles para abrir ou fechar.',
    desc: `<p>Um <b>intervalo</b> é o conjunto de <b>todos</b> os números reais entre dois extremos. Na reta ele é um segmento inteiro, não só alguns pontos: <span class="q">[1; 3]</span> contém 1, 1,5, √2, 2,999… e infinitos outros, enquanto <span class="q">{1, 2, 3}</span> tem só 3 elementos.</p>
<p><b>Fechado</b> <span class="q">[a; b] = {x ∈ ℝ | a ≤ x ≤ b}</span>: os extremos entram (bolinha cheia).<br><b>Aberto</b> <span class="q">]a; b[ = {x ∈ ℝ | a &lt; x &lt; b}</span>: os extremos ficam de fora (bolinha vazia). Também se escreve <span class="q">(a; b)</span>.<br><b>Semiabertos</b>: <span class="q">[a; b[</span> e <span class="q">]a; b]</span>.</p>
<p><b>Infinitos</b>: <span class="q">[a; +∞[ = {x ∈ ℝ | x ≥ a}</span> e <span class="q">]−∞; b[ = {x ∈ ℝ | x &lt; b}</span>. O lado do infinito é <b>sempre aberto</b>, porque ∞ não é um número.</p>
<p>No Brasil, como a vírgula é decimal, separamos os extremos com ponto e vírgula: <span class="q">[2,5; 4]</span>.</p>`,
    kv: [['[ ]', 'colchete virado para dentro: extremo incluído'], ['] [ ou ( )', 'extremo excluído'], ['±∞', 'sempre com o colchete aberto']],
    enem: 'Intervalos aparecem como <b>faixas de valores</b>: faixas do IMC, tarifas por consumo, faixas do imposto de renda, temperatura ideal, idade mínima. A pergunta clássica é se o valor da borda entra ou não (“até 100 kWh” inclui o 100; “acima de 100” não inclui).'
  });
}

// =====================================================================================
// 12. Operações com intervalos
// =====================================================================================
{
  const LO = -6, HI = 6, snap = v => cl(Math.round(v * 2) / 2, LO, HI);
  const OPS = [
    { k: 'A ∪ B', f: (A, B) => ivUnion([A, B]), r: 'onde <b>pelo menos um</b> dos dois existe. Um extremo entra se estiver fechado em um deles.' },
    { k: 'A ∩ B', f: (A, B) => ivInter(A, B), r: 'onde os dois existem <b>ao mesmo tempo</b>. Um extremo só entra se estiver fechado nos dois.' },
    { k: 'A − B', f: (A, B) => ivDiff(A, B), r: 'a parte de A que <b>não</b> está em B. O extremo de B que corta A troca de cheio para vazio (e vice-versa).' },
    { k: 'B − A', f: (A, B) => ivDiff(B, A), r: 'a parte de B que <b>não</b> está em A.' }
  ];
  def('intervalos', 'operacoes-intervalos', {
    t: 'União, interseção e diferença de intervalos', st: 'Um embaixo do outro na reta', drag: true,
    init: () => ({ A: { a: -3, b: 2, ca: true, cb: false }, B: { a: 0, b: 4, ca: false, cb: true }, op: 1, dr: null, Ls: null }),
    draw(S) {
      const a = area(), lx0 = a.x0 + (NAR ? 18 : 92), lx1 = a.x1 - 30, o = OPS[S.op];
      const ys = [a.y0 + a.h * .2, a.y0 + a.h * .5, a.y0 + a.h * .84];
      const Ls = S.Ls = ys.map(y => axis({ x0: lx0, x1: lx1, y, lo: LO, hi: HI }));
      [S.A.a, S.A.b, S.B.a, S.B.b].forEach(v => { const x = Ls[0].px(v); line(x, ys[0] - 20, x, ys[2] + 8, 'rgba(157,169,196,.28)', 1, [3, 4]); });
      const res = o.f(S.A, S.B), names = ['A', 'B', o.k], cols = [C.A, C.B, C.res];
      const strs = [`A = ${ivStr(S.A)}`, `B = ${ivStr(S.B)}`, `${o.k} = ${ivsStr(res)}`];
      Ls.forEach((L, i) => {
        drawAxis(L, { labels: i === 2 || !NAR });
        if (!NAR) tx(names[i], a.x0, L.y, { a: 'left', f: FM, w: 500, s: 15, c: cols[i] });
        tx(strs[i], L.x1 + 8, L.y - 22, { a: 'right', f: FM, w: 500, s: NAR ? 13 : 15, c: cols[i] });
      });
      drawIv(Ls[0], S.A, C.A); drawIv(Ls[1], S.B, C.B);
      res.forEach(I => drawIv(Ls[2], I, C.res));
      if (!res.length) tx('∅ (nenhum número)', Ls[2].px(0), Ls[2].y - 22, { f: FM, w: 500, s: 14, c: C.res });
    },
    down(S, x, y) {
      if (!S.Ls) return false; let best = null, bd = 26;
      [['A', 0], ['B', 1]].forEach(([k, i]) => { const L = S.Ls[i]; if (Math.abs(y - L.y) > 28) return;
        ['a', 'b'].forEach(e => { const d = Math.abs(x - L.px(S[k][e])); if (d < bd) { bd = d; best = [k, e, i]; } }); });
      if (!best) return false; S.dr = best; S.x0 = x; S.mv = false;
    },
    move(S, x) { if (!S.dr) return; if (Math.abs(x - S.x0) > 4) S.mv = true; if (!S.mv) return; const [k, e, i] = S.dr, v = snap(S.Ls[i].val(x)), I = S[k];
      if (e === 'a') I.a = Math.min(v, I.b - .5); else I.b = Math.max(v, I.a + .5); },
    up(S) { if (S.dr && !S.mv) { const [k, e] = S.dr; S[k]['c' + e] = !S[k]['c' + e]; } S.dr = null; },
    hover: (S, x, y) => S.Ls && [['A', 0], ['B', 1]].some(([k, i]) => Math.abs(y - S.Ls[i].y) < 28 && ['a', 'b'].some(e => Math.abs(x - S.Ls[i].px(S[k][e])) < 24)) ? 'ew-resize' : '',
    ui: () => [{ type: 'btns', items: OPS.map((o, i) => ({ l: o.k, on: S => S.op === i, f: S => { S.op = i; } })) }],
    cap: S => `<b>${OPS[S.op].k}</b>: ${OPS[S.op].r} Arraste os extremos de A e B; toque para abrir ou fechar.`,
    desc: `<p>Para operar intervalos, desenhe cada um numa reta, <b>alinhados um embaixo do outro</b>, e trace linhas verticais nos extremos. As linhas tracejadas da animação fazem isso.</p>
<p><b>Interseção</b> <span class="q">A ∩ B</span>: a faixa onde aparecem os dois traços. <b>União</b> <span class="q">A ∪ B</span>: onde aparece pelo menos um. Se os intervalos não se tocam, a união fica em dois pedaços, como <span class="q">[−3; −1] ∪ [2; 4]</span>.</p>
<p><b>Diferença</b> <span class="q">A − B</span>: o pedaço de A que sobra quando você apaga B.</p>
<p>O cuidado está nos extremos. Na interseção, o ponto entra se estiver incluído <b>nos dois</b>; na união, basta estar incluído <b>em um</b>. Quando a interseção é um único ponto, ela vira um conjunto unitário, como <span class="q">[−2; 1] ∩ [1; 5] = {1}</span>.</p>`,
    kv: [['A ∩ B', 'onde os dois existem'], ['A ∪ B', 'onde pelo menos um existe'], ['A − B', 'A sem a parte de B']],
    enem: 'Operar intervalos é o passo final de <b>sistemas de inequações</b> (a solução é a interseção das soluções) e do estudo de domínios de funções. Num problema, “ter entre 18 e 60 anos <b>e</b> pesar mais de 50 kg” é uma interseção.'
  });
}

// =====================================================================================
// 13. Questões no estilo ENEM
// =====================================================================================
{
  const QS = [
    { q: 'Uma pesquisa com 200 pessoas mostrou que 120 leem o jornal A, 90 leem o jornal B e 40 leem os dois. Quantas pessoas não leem nenhum dos dois jornais?', o: ['10', '30', '50', '70', '110'], c: 1,
      r: 'Leem pelo menos um: n(A ∪ B) = 120 + 90 − 40 = 170. Nenhum: 200 − 170 = <b>30</b>. A alternativa 10 vem de somar 120 + 90 sem tirar a interseção.' },
    { q: 'Qual das afirmações é verdadeira?', o: ['√4 é irracional.', 'π é racional, pois π = 3,14.', '0,272727… é racional.', '−5 é natural.', '√−9 é um número real.'], c: 2,
      r: '0,272727… é dízima periódica, logo é racional: vale 27/99 = <b>3/11</b>. √4 = 2 é natural; π ≈ 3,14 é só aproximação; −5 é inteiro negativo; √−9 não é real.' },
    { q: 'Sendo A = [−1; 4[ e B = ]2; 6], o conjunto A ∩ B é:', o: [']2; 4[', '[2; 4]', '[−1; 6]', ']2; 4]', '[−1; 2]'], c: 0,
      r: 'Os dois existem entre 2 e 4. O 2 não entra (aberto em B) e o 4 não entra (aberto em A): <b>]2; 4[</b>.' },
    { q: 'Uma sorveteria oferece 4 coberturas, e o cliente pode escolher qualquer combinação delas, inclusive nenhuma. Quantas escolhas diferentes existem?', o: ['4', '8', '12', '16', '24'], c: 3,
      r: 'Cada escolha é um subconjunto do conjunto das 4 coberturas: 2⁴ = <b>16</b>. Cada cobertura entra ou não entra (2 opções), e 2 · 2 · 2 · 2 = 16.' },
    { q: 'A fração geratriz da dízima 0,4555… é:', o: ['41/90', '455/999', '5/11', '41/99', '9/20'], c: 0,
      r: 'x = 0,4555…; 100x = 45,555… e 10x = 4,555…. Subtraindo: 90x = 41, então x = <b>41/90</b>.' },
    { q: 'Quantos números inteiros pertencem ao intervalo ]−2,5; 3]?', o: ['4', '5', '6', '7', 'infinitos'], c: 2,
      r: 'Os inteiros são −2, −1, 0, 1, 2 e 3 (o 3 entra, o −2,5 não é inteiro): <b>6</b>. “Infinitos” seria a quantidade de números reais do intervalo.' }
  ];
  def('questoes', 'questoes', {
    t: 'Questões no estilo ENEM', st: '6 questões com resolução', quiz: true,
    init: () => ({ ans: QS.map(() => -1) }),
    draw(S) {
      const a = area(); X.save(); X.globalAlpha = .06;
      const sy = ['∈', '∪', '∩', '⊂', 'ℝ', 'ℚ', '∅', 'π', '√2'];
      for (let i = 0; i < 28; i++) tx(sy[i % sy.length], a.x0 + ((i * 97) % a.w), a.y0 + ((i * 53) % a.h), { f: FH, s: 40, w: 700, c: C.txt });
      X.restore();
    },
    html(S, el) {
      const done = S.ans.filter(v => v >= 0).length, ok = S.ans.filter((v, i) => v === QS[i].c).length;
      el.innerHTML = `<div class="qz-h"><b>Questões no estilo ENEM</b><span>${done ? `${ok} de ${done} certas` : 'Toque numa alternativa'}</span></div>` + QS.map((q, i) => {
        const a = S.ans[i];
        return `<div class="qz-q"><p><b>${i + 1}.</b> ${q.q}</p><div class="qz-o">${q.o.map((o, j) => `<button type="button" data-q="${i}" data-o="${j}" class="${a < 0 ? '' : j === q.c ? 'ok' : j === a ? 'no' : ''}"${a >= 0 ? ' disabled' : ''}><em>${'ABCDE'[j]}</em>${o}</button>`).join('')}</div>${a >= 0 ? `<p class="qz-r ${a === q.c ? 'ok' : 'no'}">${a === q.c ? 'Certo!' : 'Ainda não.'} ${q.r}</p>` : ''}</div>`;
      }).join('');
      el.querySelectorAll('button[data-q]').forEach(b => b.onclick = () => { S.ans[+b.dataset.q] = +b.dataset.o; renderQuiz(); });
    },
    ui: () => [{ type: 'btns', items: [{ l: 'Refazer as questões', f: S => { S.ans = S.ans.map(() => -1); renderQuiz(); } }] }],
    cap: () => '',
    desc: `<p>Seis questões no formato do ENEM, uma de cada ideia do módulo: contagem com diagrama, classificação de números, interseção de intervalos, subconjuntos, fração geratriz e inteiros num intervalo.</p>
<p>Escolha a alternativa e leia a resolução. Quando errar, a explicação mostra de onde costuma vir a alternativa errada.</p>`,
    kv: [],
    enem: 'Em conjuntos, a maior parte das questões do ENEM é de <b>contagem com diagrama de Venn</b> em contexto (pesquisas, vacinas, tipos sanguíneos). Intervalos e conjuntos numéricos aparecem misturados com funções, inequações e porcentagem.'
  });
}

