/* LAB, Matemática, módulo 2: Plano cartesiano, razão, proporção e regra de três.
   Telas do ⚙️ Arquimedes e do 🔭 Galileo; roteiro do 📐 Tales e da 🌀 Hipátia (docs/revisao-matematica/proporcao-roteiro.md).
   Usa o motor comum em ../comum/motor.js. */
'use strict';
SECS = [
  { id: 'plano', n: 'Produto e plano cartesiano', c: '#4B9BFF' },
  { id: 'razao', n: 'Razão e proporção', c: '#3FBF6A' },
  { id: 'regra', n: 'Regra de três', c: '#F06AAE' },
  { id: 'questoes', n: 'Questões', c: '#FFB347' }
];
const brl = v => 'R$ ' + (Math.round(v * 100) / 100).toFixed(2).replace('.', ',');
const nb = v => fm(Math.round(v * 100) / 100);
const par = (x, y) => `(${fm(x)}; ${fm(y)})`;

// plano cartesiano com a mesma escala nos dois eixos
function plane(a, lo, hi, o = {}) {
  const u = Math.min(a.w / (hi - lo), a.h / (hi - lo)), ox = a.cx - ((lo + hi) / 2) * u, oy = a.cy + ((lo + hi) / 2) * u;
  const P = { u, ox, oy, lo, hi, px: x => ox + x * u, py: y => oy - y * u, vx: p => (p - ox) / u, vy: p => (oy - p) / u };
  for (let k = Math.ceil(lo); k <= hi; k++) {
    line(P.px(k), P.py(lo), P.px(k), P.py(hi), k === 0 ? C.line : 'rgba(91,108,153,.18)', k === 0 ? 1.6 : 1);
    line(P.px(lo), P.py(k), P.px(hi), P.py(k), k === 0 ? C.line : 'rgba(91,108,153,.18)', k === 0 ? 1.6 : 1);
    if (k && o.labels !== false && (!NAR || k % 2 === 0)) {
      tx(fm(k), P.px(k), P.oy + 14, { f: FM, w: 500, s: NAR ? 10 : 11, c: C.dim });
      tx(fm(k), P.ox - 8, P.py(k), { a: 'right', f: FM, w: 500, s: NAR ? 10 : 11, c: C.dim });
    }
  }
  tx('x', P.px(hi) - 4, P.oy - 12, { f: FM, w: 500, s: 14, c: C.txt }); tx('y', P.ox + 12, P.py(hi) + 6, { f: FM, w: 500, s: 14, c: C.txt });
  return P;
}
// gráfico no primeiro quadrante
function graph(a, xmax, ymax, xl, yl) {
  const x0 = a.x0 + (NAR ? 36 : 56), y0 = a.y1 - 26, x1 = a.x1 - 10, y1 = a.y0 + (NAR ? 48 : 20);
  const G = { x0, y0, x1, y1, px: x => x0 + x / xmax * (x1 - x0), py: y => y0 - y / ymax * (y0 - y1) };
  line(x0, y0, x1 + 6, y0, C.line, 1.5); line(x0, y0, x0, y1 - 6, C.line, 1.5);
  tx(xl, x1, y0 + 20, { a: 'right', s: NAR ? 11 : 13, c: C.dim }); tx(yl, x0 + 8, y1 - 10, { a: 'left', s: NAR ? 11 : 13, c: C.dim });
  return G;
}

// =====================================================================================
// 1. Par ordenado e produto cartesiano
// =====================================================================================
{
  const LB = ['a', 'b', 'c', 'd'];
  def('plano', 'produto-cartesiano', {
    t: 'Par ordenado e produto cartesiano', st: 'A × B: todo mundo com todo mundo',
    init: () => ({ na: 3, nb: 2, sw: false, sel: null, cells: [] }),
    draw(S) {
      const a = area(), rows = S.sw ? S.nb : S.na, cols = S.sw ? S.na : S.nb;
      const rl = i => S.sw ? LB[i] : String(i + 1), cl_ = j => S.sw ? String(j + 1) : LB[j];
      const R = S.sw ? 'B' : 'A', Co = S.sw ? 'A' : 'B', cR = S.sw ? C.B : C.A, cC = S.sw ? C.A : C.B;
      pill(`${R} × ${Co}: ${rows} × ${cols} = ${rows * cols} pares`, a.cx, a.y0 + 8, null, { a: 'center', f: FM, w: 500, s: NAR ? 13 : 16, st: C.res, tc: C.res });
      const gx0 = a.x0 + (NAR ? 40 : 90), gy0 = a.y0 + (NAR ? 86 : 80), gw = a.x1 - gx0 - 10, gh = a.y1 - gy0 - 10;
      const cw = Math.min(170, gw / cols), ch = Math.min(64, gh / rows), ox = gx0 + (gw - cw * cols) / 2;
      tx(`elementos de ${Co}`, ox + cw * cols / 2, gy0 - (NAR ? 40 : 44), { s: NAR ? 11 : 13, c: cC });
      tx(R, ox - (NAR ? 30 : 56), gy0 - 18, { f: FH, s: 18, w: 700, c: cR });
      for (let j = 0; j < cols; j++) token(ox + cw * (j + .5), gy0 - 18, NAR ? 13 : 16, cl_(j), false, cC, { s: NAR ? 13 : 15 });
      S.cells = [];
      for (let i = 0; i < rows; i++) {
        const y = gy0 + ch * i;
        token(ox - (NAR ? 22 : 34), y + ch / 2, NAR ? 13 : 16, rl(i), false, cR, { s: NAR ? 13 : 15 });
        for (let j = 0; j < cols; j++) {
          const k = ss((S.t - (i * cols + j) * .06) / .3); if (k <= 0) continue;
          const x = ox + cw * j, on = S.sel && S.sel[0] === i && S.sel[1] === j;
          X.save(); X.globalAlpha = k;
          rr(x + 4, y + 4, cw - 8, ch - 8, 10, on ? C.res : '#1E2846', on ? '#FFE0AE' : 'rgba(120,138,190,.4)', 1.2);
          tx(`(${rl(i)}, ${cl_(j)})`, x + cw / 2, y + ch / 2 + 1, { f: FM, w: 500, s: NAR ? 12 : 16, c: on ? C.ink : C.txt });
          X.restore(); S.cells.push({ x: x + 4, y: y + 4, w: cw - 8, h: ch - 8, i, j });
        }
      }
    },
    down(S, x, y) { const c = S.cells.find(c => inBox(c, x, y)); if (c) S.sel = [c.i, c.j]; return false; },
    hover: (S, x, y) => S.cells.some(c => inBox(c, x, y)) ? 'pointer' : '',
    ui: () => [
      { type: 'range', l: 'Elementos de A', min: 1, max: 5, get: S => S.na, set: (S, v) => { if (v !== S.na) { S.na = v; S.t = 0; S.sel = null; } } },
      { type: 'range', l: 'Elementos de B', min: 1, max: 4, get: S => S.nb, set: (S, v) => { if (v !== S.nb) { S.nb = v; S.t = 0; S.sel = null; } } },
      { type: 'btns', items: [{ l: 'Trocar a ordem: B × A', on: S => S.sw, f: S => { S.sw = !S.sw; S.t = 0; S.sel = null; } }] }
    ],
    cap(S) {
      if (!S.sel) return `Cada linha é um elemento do 1º conjunto, e ele forma par com <b>cada</b> elemento do 2º. São ${S.sw ? S.nb : S.na} linhas de ${S.sw ? S.na : S.nb}: <b>${S.na * S.nb} pares</b>.`;
      const [i, j] = S.sel, p = S.sw ? `(${LB[i]}, ${j + 1})` : `(${i + 1}, ${LB[j]})`;
      return `<b>${p}</b>: o 1º termo vem de ${S.sw ? 'B' : 'A'}, o 2º de ${S.sw ? 'A' : 'B'}. A ordem importa: ${p} é diferente de ${S.sw ? `(${j + 1}, ${LB[i]})` : `(${LB[j]}, ${i + 1})`}.`;
    },
    desc: `<p>Um <b>par ordenado</b> <span class="q">(a, b)</span> junta dois elementos numa ordem fixa: <b>primeiro</b> a, <b>depois</b> b. Por isso <span class="q">(2, 5) ≠ (5, 2)</span>, como o endereço “rua 2, número 5” não é o mesmo lugar que “rua 5, número 2”.</p>
<p>O <b>produto cartesiano</b> <span class="q">A × B</span> é o conjunto de <b>todos</b> os pares com o 1º termo em A e o 2º em B: <span class="q">A × B = {(a, b) | a ∈ A e b ∈ B}</span>.</p>
<div class="passos"><b>De onde vem n(A × B) = n(A) · n(B)</b><ol>
<li>Escolha um elemento de A, por exemplo o 1. Ele forma par com cada elemento de B: (1, a), (1, b). É uma <b>linha</b> da tabela, com n(B) pares.</li>
<li>Cada elemento de A gera a sua linha, do mesmo tamanho. São n(A) linhas.</li>
<li>Linhas iguais empilhadas formam um retângulo, como as casas de um tabuleiro: o total é linhas × colunas.</li>
<li>Logo <span class="q">n(A × B) = n(A) · n(B)</span>. Com 3 camisetas e 2 bermudas, há 3 · 2 = 6 combinações de roupa.</li>
</ol></div>
<p>Em geral <span class="q">A × B ≠ B × A</span> (os pares saem invertidos), mas os dois têm a mesma quantidade de pares.</p>`,
    kv: [['(a, b)', 'par ordenado: a ordem importa'], ['A × B', 'todos os pares (a, b) com a ∈ A e b ∈ B'], ['n(A × B)', 'n(A) · n(B)'], ['A²', 'A × A']],
    enem: 'O ENEM não costuma escrever “A × B”, mas cobra a ideia o tempo todo no <b>princípio multiplicativo</b>: cardápios (prato × bebida), senhas, placas de carro, roupas. Cada escolha de um grupo se combina com cada escolha do outro.'
  });
}

// =====================================================================================
// 2. Plano cartesiano
// =====================================================================================
{
  const PRE = [[3, 2], [-4, 3], [-2, -3], [5, -1], [0, 4], [0, 0]];
  const quad = (x, y) => x > 0 && y > 0 ? 1 : x < 0 && y > 0 ? 2 : x < 0 && y < 0 ? 3 : x > 0 && y < 0 ? 4 : 0;
  def('plano', 'plano-cartesiano', {
    t: 'O plano cartesiano', st: 'Um ponto, um par de números', drag: true,
    init: () => ({ x: 3, y: 2, P: null, dr: false }),
    draw(S) {
      const a = area(), P = S.P = plane(a, -6, 6);
      const qs = [['1º quadrante', '(+, +)', 3, 5.4], ['2º quadrante', '(−, +)', -3, 5.4], ['3º quadrante', '(−, −)', -3, -5.4], ['4º quadrante', '(+, −)', 3, -5.4]], q = quad(S.x, S.y);
      qs.forEach(([n, sg, x, y], i) => { const on = q === i + 1; tx(n, P.px(x), P.py(y) - 8, { s: NAR ? 10 : 12, c: on ? C.res : C.dim, al: on ? 1 : .7 }); tx(sg, P.px(x), P.py(y) + 8, { f: FM, w: 500, s: NAR ? 10 : 12, c: on ? C.res : C.dim, al: on ? 1 : .7 }); });
      const X0 = P.px(S.x), Y0 = P.py(S.y);
      line(X0, Y0, X0, P.oy, rgba(C.A, .9), 2, [5, 4]); line(X0, Y0, P.ox, Y0, rgba(C.B, .9), 2, [5, 4]);
      X.save(); X.shadowColor = rgba(C.A, .6); X.shadowBlur = 10; circ(X0, P.oy, 5, C.A); X.shadowColor = rgba(C.B, .6); circ(P.ox, Y0, 5, C.B); X.restore();
      tx(`x = ${fm(S.x)}`, X0, P.oy + (S.y >= 0 ? 30 : -28), { f: FM, w: 500, s: 13, c: C.A });
      tx(`y = ${fm(S.y)}`, P.ox + (S.x >= 0 ? -12 : 12), Y0 - 14, { a: S.x >= 0 ? 'right' : 'left', f: FM, w: 500, s: 13, c: C.B });
      token(X0, Y0, NAR ? 9 : 11, null, true);
      pill(`P = ${par(S.x, S.y)}`, X0 > a.x1 - 130 ? X0 - 16 : X0 + 16, Y0 - 24, null, { a: X0 > a.x1 - 130 ? 'right' : 'left', f: FM, w: 500, s: NAR ? 13 : 15, st: C.res, tc: C.res });
    },
    down(S, x, y) { const P = S.P; if (!P) return false; S.x = cl(Math.round(P.vx(x) * 2) / 2, -6, 6); S.y = cl(Math.round(P.vy(y) * 2) / 2, -6, 6); S.dr = true; },
    move(S, x, y) { const P = S.P; S.x = cl(Math.round(P.vx(x) * 2) / 2, -6, 6); S.y = cl(Math.round(P.vy(y) * 2) / 2, -6, 6); },
    up(S) { S.dr = false; },
    hover: () => 'crosshair',
    ui: () => [{ type: 'btns', l: 'Pontos', items: PRE.map(([x, y]) => ({ l: par(x, y), on: S => S.x === x && S.y === y, f: S => { S.x = x; S.y = y; } })) }],
    cap(S) {
      const q = quad(S.x, S.y);
      if (S.x === 0 && S.y === 0) return 'A <b>origem</b> (0; 0) é o cruzamento dos eixos. Toque ou arraste em qualquer lugar do plano.';
      if (S.x === 0) return `P está <b>sobre o eixo y</b>: x = 0, então ele não anda nada para os lados.`;
      if (S.y === 0) return `P está <b>sobre o eixo x</b>: y = 0, então ele não sobe nem desce.`;
      return `Para chegar em P, saia da origem, ande <b>${fm(Math.abs(S.x))} para a ${S.x > 0 ? 'direita' : 'esquerda'}</b> e <b>${fm(Math.abs(S.y))} para ${S.y > 0 ? 'cima' : 'baixo'}</b>. Ele está no ${q}º quadrante.`;
    },
    desc: `<p>O plano cartesiano são duas retas numéricas cruzadas em ângulo reto na <b>origem</b> (0; 0): o eixo horizontal <b>x</b> (abscissas) e o eixo vertical <b>y</b> (ordenadas).</p>
<div class="passos"><b>De onde vem a ideia</b><ol>
<li>Você já sabe localizar um número numa reta: basta uma informação, a distância e o lado em relação ao zero.</li>
<li>Uma folha não é uma reta. Para achar um ponto nela você precisa de <b>duas</b> informações, como no jogo de batalha naval (“B5”) ou num endereço (rua e número).</li>
<li>Descartes juntou duas retas numéricas: uma diz quanto andar para os lados (x), a outra quanto subir ou descer (y).</li>
<li>Assim cada ponto vira exatamente um <b>par ordenado</b> (x; y), e cada par vira exatamente um ponto. O plano é o produto cartesiano <span class="q">ℝ × ℝ = ℝ²</span>.</li>
</ol></div>
<p>Os eixos dividem o plano em <b>quatro quadrantes</b>, contados no sentido anti-horário a partir do canto de cima à direita. O sinal das coordenadas diz em qual quadrante o ponto está. Pontos <b>sobre os eixos</b> não pertencem a nenhum quadrante.</p>`,
    kv: [['(x; y)', 'x: anda para os lados; y: sobe ou desce'], ['abscissa', 'a coordenada x'], ['ordenada', 'a coordenada y'], ['(0; 0)', 'origem']],
    enem: 'O plano cartesiano aparece em <b>mapas com malha quadriculada</b>, em leitura de gráficos e em questões de localização (“a escola fica no ponto (3; −2)…”). Cuidado com a ordem: <b>primeiro x, depois y</b>.'
  });
}

// =====================================================================================
// 3. Produto cartesiano no plano
// =====================================================================================
{
  const M = [
    { k: '{1, 2, 3} × {1, 2}', c: 'Conjuntos finitos dão <b>pontos soltos</b>: cada x de A se junta a cada y de B, 3 · 2 = 6 pontos.' },
    { k: '[1; 4] × [1; 3]', c: 'Intervalos dão uma <b>região</b>: cada x entre 1 e 4 se junta a cada y entre 1 e 3, e os infinitos pontos preenchem um retângulo.' },
    { k: 'ℝ × {2}', c: 'Todo x real junto com y = 2: uma <b>reta horizontal</b>, a reta y = 2.' },
    { k: '{3} × ℝ', c: 'Só x = 3, com qualquer y: uma <b>reta vertical</b>, a reta x = 3.' },
    { k: '[−2; 2] × ℝ', c: 'Qualquer y, desde que x esteja entre −2 e 2: uma <b>faixa vertical</b> infinita.' }
  ];
  def('plano', 'produto-no-plano', {
    t: 'O produto cartesiano desenhado no plano', st: 'Pontos, retângulos e retas',
    init: () => ({ m: 0, tc: 0 }),
    draw(S) {
      const a = area(), P = plane(a, -5, 5), k = ss((S.t - S.tc) / 1.2);
      X.save(); X.shadowColor = rgba(C.res, .6); X.shadowBlur = 12;
      if (S.m === 0) { let i = 0; for (const x of [1, 2, 3]) for (const y of [1, 2]) { if (k * 6 > i) token(P.px(x), P.py(y), NAR ? 6 : 8, null, true); i++; } }
      if (S.m === 1) { const x1 = lerp(1, 4, k); rr(P.px(1), P.py(3), P.px(x1) - P.px(1), P.py(1) - P.py(3), 2, rgba(C.res, .35), C.res, 2); line(P.px(x1), P.py(1), P.px(x1), P.py(3), C.res, 3); }
      if (S.m === 2) line(P.px(-5), P.py(2), P.px(lerp(-5, 5, k)), P.py(2), C.res, 4);
      if (S.m === 3) line(P.px(3), P.py(-5), P.px(3), P.py(lerp(-5, 5, k)), C.res, 4);
      if (S.m === 4) { const x1 = lerp(-2, 2, k); X.fillStyle = rgba(C.res, .28); X.fillRect(P.px(-2), P.py(5), P.px(x1) - P.px(-2), P.py(-5) - P.py(5)); line(P.px(-2), P.py(-5), P.px(-2), P.py(5), C.res, 2); if (k >= 1) line(P.px(2), P.py(-5), P.px(2), P.py(5), C.res, 2); }
      X.restore();
      // os conjuntos de origem nos eixos
      const ax = [[[1, 2, 3], null], [null, [1, 4]], [null, 'R'], [[3], null], [null, [-2, 2]]][S.m];
      const xs = [[1, 2, 3], [1, 4], 'R', [3], [-2, 2]][S.m], ys = [[1, 2], [1, 3], [2], 'R', 'R'][S.m];
      const mark = (set, horiz, discrete) => {
        if (set === 'R') { if (horiz) line(P.px(-5), P.oy, P.px(5), P.oy, C.A, 4); else line(P.ox, P.py(-5), P.ox, P.py(5), C.B, 4); return; }
        if (discrete || set.length === 1) set.forEach(v => horiz ? circ(P.px(v), P.oy, 5, C.A) : circ(P.ox, P.py(v), 5, C.B));
        else horiz ? line(P.px(set[0]), P.oy, P.px(set[1]), P.oy, C.A, 4) : line(P.ox, P.py(set[0]), P.ox, P.py(set[1]), C.B, 4);
      };
      mark(xs, true, S.m === 0); mark(ys, false, S.m === 0 || S.m === 2);
      pill(M[S.m].k, a.cx, a.y0 + 8, null, { a: 'center', f: FM, w: 500, s: NAR ? 13 : 16, st: C.res, tc: C.res });
      void ax;
    },
    ui: () => [{ type: 'btns', items: M.map((m, i) => ({ l: m.k, on: S => S.m === i, f: S => { S.m = i; S.tc = S.t; } })) }],
    cap: S => M[S.m].c + ' Em azul, o 1º conjunto no eixo x; em rosa, o 2º no eixo y.',
    desc: `<p>Como o plano é <span class="q">ℝ × ℝ</span>, todo produto cartesiano de conjuntos de números vira um <b>desenho</b>: o 1º conjunto fica no eixo x, o 2º no eixo y, e o produto é tudo que se forma combinando os dois.</p>
<div class="passos"><b>Como montar o desenho</b><ol>
<li>Marque o 1º conjunto no eixo x (em azul) e o 2º no eixo y (em rosa).</li>
<li>Para cada x marcado, suba uma “coluna” com todos os y marcados.</li>
<li>Se os dois conjuntos são finitos, sobram pontos soltos. Se são intervalos, as colunas se encostam e formam um retângulo.</li>
<li>Se um dos conjuntos é ℝ inteiro, a figura não tem fim naquela direção: vira reta ou faixa.</li>
</ol></div>
<p>A área do retângulo <span class="q">[1; 4] × [1; 3]</span> é <span class="q">3 · 2 = 6</span>: comprimento do 1º intervalo vezes o do 2º, a mesma conta de “linhas × colunas” do produto cartesiano finito.</p>`,
    kv: [['ℝ²', 'ℝ × ℝ: o plano inteiro'], ['[a; b] × [c; d]', 'retângulo'], ['ℝ × {k}', 'reta horizontal y = k'], ['{k} × ℝ', 'reta vertical x = k']],
    enem: 'Regiões do plano aparecem em questões de <b>mapas e plantas</b> (“a área de cobertura da antena”) e mais tarde em inequações e funções. Saber que y = 2 é uma reta horizontal e x = 3 uma vertical evita erros clássicos de leitura de gráfico.'
  });
}

// =====================================================================================
// 4. Razão
// =====================================================================================
def('razao', 'razao', {
  t: 'Razão: comparar por divisão', st: 'Para cada 1, quantos?',
  init: () => ({ a: 2, b: 6 }),
  draw(S) {
    const a = area(), g = gcd(S.a, S.b), ga = S.a / g, gb = S.b / g;
    pill(`concentrado : água = ${S.a} : ${S.b} = ${ga} : ${gb}`, a.cx, a.y0 + 8, null, { a: 'center', f: FM, w: 500, s: NAR ? 13 : 16, st: C.res, tc: C.res });
    const cup = (x, y, w, h, c) => { X.save(); X.shadowColor = rgba(c, .5); X.shadowBlur = 8; X.beginPath(); X.moveTo(x, y); X.lineTo(x + w, y); X.lineTo(x + w * .88, y + h); X.lineTo(x + w * .12, y + h); X.closePath(); const gr = X.createLinearGradient(x, y, x, y + h); gr.addColorStop(0, rgba(c, .95)); gr.addColorStop(1, rgba(c, .6)); X.fillStyle = gr; X.fill(); X.restore(); };
    const top = a.y0 + 52, cw = Math.min(NAR ? 26 : 44, (a.w - 40) / Math.max(10, (ga + gb) * g + g * 1.5)), chh = cw * 1.35, gap = cw * .25;
    // fileira de cima: tudo misturado
    tx('A receita inteira', a.x0 + 4, top, { a: 'left', s: NAR ? 12 : 14, c: C.dim });
    let x = a.x0 + 4; const y1 = top + 16;
    for (let i = 0; i < S.a; i++) { cup(x, y1, cw, chh, '#F2A93B'); x += cw + gap; }
    for (let i = 0; i < S.b; i++) { cup(x, y1, cw, chh, '#4B9BFF'); x += cw + gap; }
    // grupos iguais
    const y2 = y1 + chh + (NAR ? 40 : 56);
    tx(`Separada em ${g} grupo${g > 1 ? 's' : ''} iguais`, a.x0 + 4, y2 - 16, { a: 'left', s: NAR ? 12 : 14, c: C.dim });
    const k = ss(S.t / 1.2); x = a.x0 + 4;
    for (let G = 0; G < g; G++) {
      const gx = x;
      for (let i = 0; i < ga; i++) { cup(x, y2 + (1 - k) * 10, cw, chh, '#F2A93B'); x += cw + gap; }
      for (let i = 0; i < gb; i++) { cup(x, y2 + (1 - k) * 10, cw, chh, '#4B9BFF'); x += cw + gap; }
      rr(gx - 5, y2 - 6, x - gx + 4 - gap, chh + 12, 10, null, rgba(C.res, .7 * k), 1.5);
      x += cw * .9;
    }
    const y3 = y2 + chh + (NAR ? 40 : 60), fs = NAR ? 13 : 17;
    const l1 = `razão = ${S.a}/${S.b} = ${ga}/${gb}` + (gb % ga === 0 && ga === 1 ? '' : ` ≈ ${nb(S.a / S.b)}`);
    tx(l1, a.x0 + 4, y3, { a: 'left', f: FM, w: 500, s: fit(l1, a.w, fs, 500, FM), c: C.txt });
    const l2 = `para cada 1 copo de concentrado: ${nb(S.b / S.a)} de água`;
    tx(l2, a.x0 + 4, y3 + (NAR ? 22 : 30), { a: 'left', f: FM, w: 500, s: fit(l2, a.w, fs, 500, FM), c: '#4B9BFF' });
    const l3 = `concentrado na mistura: ${S.a}/${S.a + S.b} ≈ ${nb(100 * S.a / (S.a + S.b))}%`;
    tx(l3, a.x0 + 4, y3 + (NAR ? 44 : 60), { a: 'left', f: FM, w: 500, s: fit(l3, a.w, fs, 500, FM), c: '#F2A93B' });
  },
  ui: () => [
    { type: 'range', l: 'Concentrado', min: 1, max: 6, get: S => S.a, set: (S, v) => { S.a = v; S.t = 0; } },
    { type: 'range', l: 'Água', min: 1, max: 12, get: S => S.b, set: (S, v) => { S.b = v; S.t = 0; } }
  ],
  cap: S => { const g = gcd(S.a, S.b); return g > 1 ? `${S.a} : ${S.b} e ${S.a / g} : ${S.b / g} são a <b>mesma razão</b>: a receita é só ${g} cópias do grupo pequeno, e o sabor não muda.` : `${S.a} : ${S.b} já está na forma mais simples: não dá para separar em grupos iguais menores.`; },
  desc: `<p>Uma <b>razão</b> compara duas quantidades pela divisão: <span class="q">a/b</span> (ou <span class="q">a : b</span>, “a está para b”). Ela responde: <b>quanto de uma coisa existe para cada unidade da outra</b>?</p>
<div class="passos"><b>De onde vem a ideia</b><ol>
<li>Comparar por subtração diz “quanto a mais”: 6 copos de água têm 4 a mais que 2 de concentrado. Mas isso não diz o sabor.</li>
<li>Dobre a receita: 4 e 12. A diferença virou 8, porém o suco tem o mesmo gosto. A subtração não captura o que importa.</li>
<li>O que fica igual é a divisão: 2/6 = 4/12 = 1/3. Em qualquer tamanho, há 3 copos de água para cada 1 de concentrado.</li>
<li>Por isso usamos a razão: ela mede a <b>relação</b> entre as partes, sem depender do tamanho total. A tela separa a receita em grupos iguais para mostrar isso.</li>
</ol></div>
<p>Razões famosas: <b>escala</b> (distância no mapa ÷ distância real), <b>velocidade média</b> (distância ÷ tempo), <b>densidade demográfica</b> (habitantes ÷ área) e <b>porcentagem</b> (uma razão com denominador 100).</p>
<p>A ordem importa: “concentrado para água” é 1/3, “água para concentrado” é 3/1. E <b>parte para parte</b> (1 : 3) não é o mesmo que <b>parte para o todo</b> (1 em 4, ou 25%).</p>`,
  kv: [['a : b', 'a está para b, ou a/b'], ['escala', 'mapa ÷ real (mesma unidade)'], ['velocidade', 'distância ÷ tempo'], ['%', 'razão com denominador 100']],
  enem: '<b>Escala</b> é campeã no ENEM: “1 : 500 000” quer dizer que 1 cm no mapa vale 500 000 cm = 5 km. Também caem razões de mistura (tinta, remédio, concreto) e a confusão entre parte : parte e parte : todo.'
});

// =====================================================================================
// 5. Proporção
// =====================================================================================
def('razao', 'proporcao', {
  t: 'Proporção: duas razões iguais', st: 'Ampliar sem deformar',
  init: () => ({ k: 1.5, est: false }),
  draw(S) {
    const a = area(), w0 = 4, h0 = 3, w1 = w0 * S.k, h1 = S.est ? h0 : h0 * S.k;
    const u = Math.min((a.w - 60) / (w0 + w1 + 1.5), (a.h - 110) / Math.max(h0, h1, 3));
    const base = a.y1 - 60, x0 = a.x0 + 20, x1 = x0 + (w0 + 1.5) * u;
    const fig = (x, w, h, c) => {
      X.save(); X.shadowColor = rgba(c, .5); X.shadowBlur = 14; rr(x, base - h * u, w * u, h * u, 4, rgba(c, .16), c, 2); X.restore();
      for (let i = 1; i < w; i++) line(x + i * u, base - h * u, x + i * u, base, rgba(c, .18), 1);
      for (let j = 1; j < h; j++) line(x, base - j * u, x + w * u, base - j * u, rgba(c, .18), 1);
      // casinha: telhado e porta, para ver a deformação
      X.beginPath(); X.moveTo(x + w * u * .2, base - h * u * .55); X.lineTo(x + w * u * .5, base - h * u * .85); X.lineTo(x + w * u * .8, base - h * u * .55); X.strokeStyle = c; X.lineWidth = 2; X.stroke();
      rr(x + w * u * .42, base - h * u * .4, w * u * .16, h * u * .4, 2, rgba(c, .5));
      tx(`${nb(w)}`, x + w * u / 2, base + 18, { f: FM, w: 500, s: 14, c });
      tx(`${nb(h)}`, x - 10, base - h * u / 2, { a: 'right', f: FM, w: 500, s: 14, c });
    };
    fig(x0, w0, h0, C.A); fig(x1, w1, h1, S.est ? C.bad : C.res);
    const r1 = w0 / h0, r2 = w1 / h1, eq = Math.abs(r1 - r2) < 1e-9;
    const s1 = `${w0}/${h0}  ${eq ? '=' : '≠'}  ${nb(w1)}/${nb(h1)}`;
    pill(s1, a.cx, a.y0 + 8, null, { a: 'center', f: FM, w: 500, s: NAR ? 14 : 17, st: eq ? C.ok : C.bad, tc: eq ? C.ok : C.bad });
    const s2 = eq ? `produto cruzado: ${w0} · ${nb(h1)} = ${h0} · ${nb(w1)} = ${nb(w0 * h1)}` : `produto cruzado: ${w0} · ${nb(h1)} = ${nb(w0 * h1)}, mas ${h0} · ${nb(w1)} = ${nb(h0 * w1)}`;
    tx(s2, a.cx, a.y0 + 40, { f: FM, w: 500, s: fit(s2, a.w, NAR ? 12 : 15, 500, FM), c: C.txt });
  },
  ui: () => [
    { type: 'range', l: 'Fator', min: .5, max: 2.5, step: .25, get: S => S.k, set: (S, v) => S.k = v, fmt: v => '× ' + fm(v) },
    { type: 'btns', items: [{ l: 'Ampliar igual', on: S => !S.est, f: S => S.est = false }, { l: 'Esticar só a largura', on: S => S.est, f: S => S.est = true }] }
  ],
  cap: S => S.est ? 'Esticando só a largura, a razão largura : altura <b>muda</b>, e a casa sai <b>deformada</b>. Não é proporção.' : `Largura e altura foram multiplicadas pelo <b>mesmo fator ${fm(S.k)}</b>: a razão não muda, e a figura só muda de tamanho.`,
  desc: `<p>Uma <b>proporção</b> é uma igualdade entre duas razões: <span class="q">a/b = c/d</span> (lê-se “a está para b assim como c está para d”). Ampliar uma foto sem deformar é exatamente isso: a razão largura : altura continua a mesma.</p>
<div class="passos"><b>De onde vem a propriedade fundamental (o “produto cruzado”)</b><ol>
<li>Comece com duas frações iguais: <span class="q">4/3 = 6/4,5</span>.</li>
<li>Se duas quantidades são iguais, multiplicar as duas pelo mesmo número mantém a igualdade. Multiplique os dois lados por 3 e por 4,5 (os dois denominadores).</li>
<li>Do lado esquerdo o 3 se cancela e sobra 4 · 4,5. Do lado direito o 4,5 se cancela e sobra 6 · 3.</li>
<li>Resultado: <span class="q">4 · 4,5 = 3 · 6</span> (18 = 18). Em geral, <span class="q">a/b = c/d ⇔ a · d = b · c</span>: o produto dos <b>extremos</b> é igual ao produto dos <b>meios</b>.</li>
</ol><p>Essa regra não é mágica: ela é só a igualdade das frações escrita sem denominadores. É ela que faz a regra de três funcionar.</p></div>`,
  kv: [['a/b = c/d', 'proporção'], ['a e d', 'extremos'], ['b e c', 'meios'], ['a · d = b · c', 'propriedade fundamental']],
  enem: 'Ampliação e redução de figuras, maquetes, plantas de casa e receitas são proporções. Em figuras, lembre: se as medidas de comprimento são multiplicadas por k, a <b>área</b> fica multiplicada por k² (a figura cresce nas duas direções).'
});

// =====================================================================================
// 6. Grandezas diretamente e inversamente proporcionais
// =====================================================================================
def('razao', 'grandezas', {
  t: 'Grandezas direta e inversamente proporcionais', st: 'A razão fica fixa, ou o produto fica fixo',
  init: () => ({ m: 0, x: 4, v: 60 }),
  draw(S) {
    const a = area();
    if (S.m === 0) {
      const G = graph(a, 10, 20, 'quantidade (kg)', 'preço (R$)'), y = 2 * S.x;
      for (let i = 2; i <= 10; i += 2) { tx(String(i), G.px(i), G.y0 + 14, { f: FM, w: 500, s: 11, c: C.dim }); tx(String(2 * i), G.x0 - 8, G.py(2 * i), { a: 'right', f: FM, w: 500, s: 11, c: C.dim }); }
      X.save(); X.shadowColor = rgba(C.ok, .6); X.shadowBlur = 12; line(G.px(0), G.py(0), G.px(10), G.py(20), C.ok, 3); X.restore();
      X.beginPath(); X.moveTo(G.px(0), G.py(0)); X.lineTo(G.px(S.x), G.py(0)); X.lineTo(G.px(S.x), G.py(y)); X.closePath(); X.fillStyle = rgba(C.ok, .14); X.fill();
      line(G.px(S.x), G.py(0), G.px(S.x), G.py(y), rgba(C.ok, .8), 1.5, [4, 4]);
      token(G.px(S.x), G.py(y), 9, null, true);
      pill(NAR ? `preço ÷ qtd = ${nb(y)} ÷ ${nb(S.x)} = 2` : `${nb(S.x)} kg → ${brl(y)}      preço ÷ quantidade = ${nb(y)} ÷ ${nb(S.x)} = 2`, a.cx, a.y0 + 4, null, { a: 'center', f: FM, w: 500, s: NAR ? 11 : 15, st: C.ok, tc: C.ok });
    } else {
      const G = graph(a, 130, 14, 'velocidade (km/h)', 'tempo (h)'), t = 240 / S.v;
      for (let i = 20; i <= 120; i += 20) tx(String(i), G.px(i), G.y0 + 14, { f: FM, w: 500, s: 11, c: C.dim });
      for (let i = 2; i <= 12; i += 2) tx(String(i), G.x0 - 8, G.py(i), { a: 'right', f: FM, w: 500, s: 11, c: C.dim });
      X.fillStyle = rgba(C.B, .18); X.fillRect(G.px(0), G.py(t), G.px(S.v) - G.px(0), G.py(0) - G.py(t));
      rr(G.px(0), G.py(t), G.px(S.v) - G.px(0), G.py(0) - G.py(t), 0, null, rgba(C.B, .8), 1.5);
      tx(`área = ${S.v} · ${nb(t)} = 240`, (G.px(0) + G.px(S.v)) / 2, (G.py(0) + G.py(t)) / 2, { f: FM, w: 500, s: NAR ? 11 : 14, c: C.txt });
      X.save(); X.shadowColor = rgba(C.B, .6); X.shadowBlur = 12; X.beginPath();
      for (let v = 18; v <= 130; v += 1) { const p = [G.px(v), G.py(240 / v)]; v === 18 ? X.moveTo(...p) : X.lineTo(...p); }
      X.strokeStyle = C.B; X.lineWidth = 3; X.stroke(); X.restore();
      token(G.px(S.v), G.py(t), 9, null, true);
      pill(NAR ? `${S.v} · ${nb(t)} = 240 km` : `${S.v} km/h → ${nb(t)} h      velocidade · tempo = 240 km`, a.cx, a.y0 + 4, null, { a: 'center', f: FM, w: 500, s: NAR ? 11 : 15, st: C.B, tc: C.B });
    }
  },
  ui: S => [
    { type: 'btns', items: [{ l: 'Direta: preço do pão', on: S => S.m === 0, f: S => { S.m = 0; buildSoon(); } }, { l: 'Inversa: viagem de 240 km', on: S => S.m === 1, f: S => { S.m = 1; buildSoon(); } }] },
    S.m === 0 ? { type: 'range', l: 'Quantidade (kg)', min: .5, max: 10, step: .5, get: S => S.x, set: (S, v) => S.x = v, fmt: v => fm(v) + ' kg' }
      : { type: 'range', l: 'Velocidade', min: 20, max: 120, step: 10, get: S => S.v, set: (S, v) => S.v = v, fmt: v => v + ' km/h' }
  ],
  cap: S => S.m === 0 ? 'Dobrou a quantidade, <b>dobra</b> o preço. O gráfico é uma reta que passa pela origem, e a <b>razão</b> preço ÷ quantidade fica sempre igual a 2.' : 'Dobrou a velocidade, o tempo cai <b>pela metade</b>. O retângulo muda de forma, mas a <b>área</b> velocidade × tempo fica sempre 240.',
  desc: `<p>Duas grandezas são <b>diretamente proporcionais</b> quando, multiplicando uma por um número, a outra fica multiplicada pelo <b>mesmo</b> número. Então a <b>razão</b> entre elas é constante: <span class="q">y/x = k</span>.</p>
<p>São <b>inversamente proporcionais</b> quando, multiplicando uma por um número, a outra fica <b>dividida</b> por ele. Então o <b>produto</b> é constante: <span class="q">x · y = k</span>.</p>
<div class="passos"><b>Como enxergar a diferença</b><ol>
<li>Preço do pão: cada quilo custa R$ 2. Para 3 kg, são 3 “pedaços” de R$ 2; para 6 kg, 6 pedaços. O preço acompanha a quantidade no mesmo ritmo: razão fixa, reta pela origem.</li>
<li>Viagem de 240 km: a distância total é fixa. Velocidade × tempo = distância, então a 60 km/h são 4 h e a 120 km/h são 2 h. Uma sobe, a outra desce na mesma proporção.</li>
<li>No gráfico, o produto fixo aparece como um <b>retângulo de área constante</b>: ele fica mais largo e mais baixo, ou mais estreito e mais alto. A curva que liga os cantos é uma hipérbole.</li>
<li>Teste rápido: “se dobrar um, o outro dobra?” Direta. “Se dobrar um, o outro cai pela metade?” Inversa. Se não acontece nenhum dos dois, as grandezas não são proporcionais.</li>
</ol></div>
<p>Cuidado: “aumenta junto” não basta. A idade e a altura de uma pessoa crescem juntas, mas não são proporcionais.</p>`,
  kv: [['direta', 'y/x constante (reta pela origem)'], ['inversa', 'x · y constante (hipérbole)'], ['teste', 'dobra e dobra, ou dobra e cai pela metade']],
  enem: 'Antes de fazer qualquer regra de três, o ENEM quer que você decida <b>se as grandezas são direta ou inversamente proporcionais</b>. Mais operários e menos dias, mais velocidade e menos tempo, mais torneiras e menos tempo para encher: todas inversas.'
});
let buildSoon = () => setTimeout(() => document.dispatchEvent(new Event('lab-rebuild')), 0);

// =====================================================================================
// 7. Regra de três simples direta
// =====================================================================================
def('regra', 'direta', {
  t: 'Regra de três simples (direta)', st: 'Passando pela unidade',
  init: () => ({ a1: 3, b1: 12, a2: 7 }),
  draw(S) {
    const a = area(), u = S.b1 / S.a1, b2 = u * S.a2, k = S.t;
    const xL = a.x0 + a.w * (NAR ? .22 : .3), xR = a.x0 + a.w * (NAR ? .72 : .62), fs = NAR ? 16 : 24;
    const ys = [a.y0 + a.h * .12, a.y0 + a.h * .42, a.y0 + a.h * .72];
    tx('quantidade', xL, a.y0 - 6 + 14, { s: NAR ? 11 : 13, c: C.dim }); tx('preço', xR, a.y0 + 8, { s: NAR ? 11 : 13, c: C.dim });
    const rows = [[`${nb(S.a1)} kg`, brl(S.b1), 0], ['1 kg', brl(u), .8], [`${nb(S.a2)} kg`, brl(b2), 1.8]];
    rows.forEach(([l, r, t0], i) => {
      const al = ss((k - t0) / .5); if (al <= 0) return;
      X.save(); X.globalAlpha = al;
      const bw = NAR ? 96 : 150, bh = NAR ? 40 : 54, hot = i === 2;
      [[xL, l], [xR, r]].forEach(([x, s]) => { X.save(); X.shadowColor = hot ? rgba(C.res, .6) : 'rgba(0,0,0,.4)'; X.shadowBlur = hot ? 16 : 6; rr(x - bw / 2, ys[i] - bh / 2, bw, bh, 12, hot ? '#3A2C12' : '#1E2846', hot ? C.res : 'rgba(120,138,190,.45)', 1.5); X.restore(); tx(s, x, ys[i] + 1, { f: FM, w: 500, s: fs, c: hot ? C.res : C.txt }); });
      line(xL + bw / 2 + 8, ys[i], xR - bw / 2 - 8, ys[i], 'rgba(157,169,196,.5)', 1.5, [4, 5]);
      X.restore();
      if (i > 0 && al > 0) {
        const op = i === 1 ? `÷ ${nb(S.a1)}` : `× ${nb(S.a2)}`, ya = (ys[i - 1] + ys[i]) / 2, c = i === 1 ? C.A : C.ok;
        [xL - (NAR ? 64 : 100), xR + (NAR ? 64 : 100)].forEach(x => { X.save(); X.globalAlpha = al; line(x, ys[i - 1] + 18, x, ys[i] - 18, c, 2); X.beginPath(); X.moveTo(x, ys[i] - 14); X.lineTo(x - 5, ys[i] - 22); X.lineTo(x + 5, ys[i] - 22); X.closePath(); X.fillStyle = c; X.fill(); tx(op, x + (x < a.cx ? -8 : 8), ya, { a: x < a.cx ? 'right' : 'left', f: FM, w: 500, s: NAR ? 12 : 15, c }); X.restore(); });
      }
    });
    if (k > 2.6) {
      const s = `atalho (produto cruzado): ${nb(S.a1)} · x = ${nb(S.a2)} · ${nb(S.b1)}  →  x = ${nb(S.a2 * S.b1)} ÷ ${nb(S.a1)} = ${nb(b2)}`;
      tx(s, a.cx, a.y1 - 6, { f: FM, w: 500, s: fit(s, a.w, NAR ? 12 : 15, 500, FM, 9), c: C.dim, al: ss((k - 2.6) / .5) });
    }
  },
  ui: () => [
    { type: 'range', l: 'kg na compra conhecida', min: 1, max: 10, get: S => S.a1, set: (S, v) => { S.a1 = v; S.t = 3; } },
    { type: 'range', l: 'Preço (R$)', min: 1, max: 40, get: S => S.b1, set: (S, v) => { S.b1 = v; S.t = 3; } },
    { type: 'range', l: 'kg que eu quero', min: 1, max: 20, get: S => S.a2, set: (S, v) => { S.a2 = v; S.t = 3; } }
  ],
  cap: S => `Se ${nb(S.a1)} kg custam ${brl(S.b1)}, <b>1 kg</b> custa ${brl(S.b1)} ÷ ${nb(S.a1)} = ${brl(S.b1 / S.a1)}. Então ${nb(S.a2)} kg custam ${nb(S.a2)} × ${brl(S.b1 / S.a1)} = <b>${brl(S.b1 / S.a1 * S.a2)}</b>.`,
  desc: `<p>A <b>regra de três simples</b> resolve problemas com duas grandezas proporcionais em que você conhece três valores e procura o quarto.</p>
<div class="passos"><b>De onde vem a regra de três</b><ol>
<li>Problema: 3 kg de feijão custam R$ 12. Quanto custam 7 kg?</li>
<li>Primeiro, a pergunta mais fácil: <b>quanto custa 1 kg?</b> Se 3 kg custam 12, 1 kg custa 12 ÷ 3 = R$ 4. Isso é a <b>redução à unidade</b>.</li>
<li>Agora é só multiplicar: 7 kg custam 7 × 4 = R$ 28.</li>
<li>Juntando os dois passos numa conta só: <span class="q">x = 12 ÷ 3 × 7</span>. Isso é o mesmo que <span class="q">3/7 = 12/x</span>, uma proporção.</li>
<li>Pela propriedade fundamental, <span class="q">3 · x = 7 · 12</span>, então <span class="q">x = 84 ÷ 3 = 28</span>. O famoso “multiplica cruzado” é só o atalho dos passos 2 e 3.</li>
</ol></div>
<p>Monte sempre a tabela com as grandezas em colunas e os valores correspondentes na mesma linha. As setas na tela mostram que, nas duas colunas, se faz a mesma operação (÷ 3 e depois × 7): é isso que significa “diretamente proporcional”.</p>`,
  kv: [['redução à unidade', 'quanto vale 1? depois multiplica'], ['a/b = c/x', 'a · x = b · c'], ['direta', 'as setas apontam no mesmo sentido']],
  enem: 'Regra de três é o cálculo <b>mais usado</b> de toda a prova de Matemática do ENEM: receitas, consumo de combustível, dosagem de remédio, câmbio, escalas. Quando os números são “quebrados”, a redução à unidade costuma ser mais segura que o produto cruzado.'
});

// =====================================================================================
// 8. Regra de três simples inversa
// =====================================================================================
def('regra', 'inversa', {
  t: 'Regra de três simples (inversa)', st: 'O trabalho total não muda',
  init: () => ({ w1: 6, d1: 10, w2: 4 }),
  draw(S) {
    const a = area(), tot = S.w1 * S.d1, d2 = tot / S.w2, k = ss(S.t / 1.4);
    const maxD = Math.max(S.d1, Math.ceil(d2)), maxW = Math.max(S.w1, S.w2);
    const side = NAR ? 'v' : 'h';
    const availW = side === 'h' ? (a.w - 80) / 2 : a.w - 50, availH = side === 'h' ? a.h - 110 : (a.h - 120) / 2;
    const c = Math.min(availW / maxD, availH / maxW, 28);
    const grid = (x0, y0, w, d, col, lbl, kk) => {
      tx(lbl, x0, y0 - 14, { a: 'left', s: NAR ? 12 : 14, c: col });
      let n = 0;
      for (let i = 0; i < w; i++) for (let j = 0; j < Math.ceil(d); j++) {
        const frac = Math.min(1, d - j), show = n++ < kk * w * Math.ceil(d); if (!show) continue;
        rr(x0 + j * c + 1.5, y0 + i * c + 1.5, c * frac - 3, c - 3, 3, rgba(col, .55), col, 1);
      }
      tx('dias →', x0 + Math.ceil(d) * c, y0 + w * c + 14, { a: 'right', s: 11, c: C.dim });
    };
    const x0 = a.x0 + 30, y0 = a.y0 + 54;
    grid(x0, y0, S.w1, S.d1, C.A, `${S.w1} pedreiros × ${S.d1} dias = ${tot} pedreiro-dias`, 1);
    const x1 = side === 'h' ? a.cx + 20 : x0, y1 = side === 'h' ? y0 : y0 + S.w1 * c + 50;
    grid(x1, y1, S.w2, d2, C.res, `${S.w2} pedreiros × ${nb(d2)} dias = ${tot} pedreiro-dias`, k);
    pill(`${S.w1} · ${S.d1} = ${S.w2} · x   →   x = ${tot} ÷ ${S.w2} = ${nb(d2)} dias`, a.cx, a.y0 + 8, null, { a: 'center', f: FM, w: 500, s: NAR ? 12 : 16, st: C.res, tc: C.res });
  },
  ui: () => [
    { type: 'range', l: 'Pedreiros (antes)', min: 2, max: 10, get: S => S.w1, set: (S, v) => { S.w1 = v; S.t = 0; } },
    { type: 'range', l: 'Dias (antes)', min: 2, max: 15, get: S => S.d1, set: (S, v) => { S.d1 = v; S.t = 0; } },
    { type: 'range', l: 'Pedreiros (agora)', min: 1, max: 12, get: S => S.w2, set: (S, v) => { S.w2 = v; S.t = 0; } }
  ],
  cap: S => `Cada quadradinho é <b>1 pedreiro trabalhando 1 dia</b>. O muro precisa sempre de ${S.w1 * S.d1} quadradinhos: ${S.w2 < S.w1 ? 'com menos gente, a fila fica mais comprida' : S.w2 > S.w1 ? 'com mais gente, a fila fica mais curta' : 'mesma equipe, mesmos dias'}.`,
  desc: `<p>Na regra de três <b>inversa</b>, as grandezas são inversamente proporcionais: quando uma aumenta, a outra diminui na mesma proporção.</p>
<div class="passos"><b>De onde vem a conta</b><ol>
<li>Problema: 6 pedreiros constroem um muro em 10 dias. Em quantos dias 4 pedreiros constroem o mesmo muro?</li>
<li>Meça o trabalho numa unidade que não muda: <b>pedreiro-dia</b> (1 pedreiro trabalhando 1 dia). O muro custa 6 × 10 = 60 pedreiro-dias.</li>
<li>Com 4 pedreiros, cada dia rende 4 pedreiro-dias. Para juntar 60: 60 ÷ 4 = <b>15 dias</b>.</li>
<li>Em uma conta só: <span class="q">6 · 10 = 4 · x</span>. O <b>produto</b> fica constante, como a área do retângulo na tela, que só muda de formato.</li>
<li>Se você fizesse o produto cruzado direto (6/4 = 10/x), acharia x ≈ 6,7 dias: menos gente terminando mais rápido, o que não faz sentido. Por isso, na inversa, inverte-se uma das razões antes de cruzar: <span class="q">6/4 = x/10</span>.</li>
</ol></div>`,
  kv: [['inversa', 'produto constante: a · b = c · x'], ['setas', 'apontam em sentidos opostos'], ['teste', 'mais de um, menos do outro?']],
  enem: 'Problemas de <b>obra, torneiras enchendo tanques, velocidade e tempo, máquinas e produção</b>. Antes de calcular, pergunte: “se eu aumentar isso, o resultado aumenta ou diminui?”. Se diminui, é inversa.'
});

// =====================================================================================
// 9. Regra de três composta
// =====================================================================================
def('regra', 'composta', {
  t: 'Regra de três composta', st: 'Várias grandezas ao mesmo tempo',
  init: () => ({ m2: 6, h2: 8 }),
  draw(S) {
    const a = area(), m1 = 4, h1 = 6, p1 = 360, taxa = p1 / (m1 * h1), p2 = S.m2 * S.h2 * taxa, k = ss(S.t / 1.4);
    const side = NAR ? 'v' : 'h', maxM = Math.max(m1, S.m2), maxH = Math.max(h1, S.h2);
    const availW = side === 'h' ? (a.w - 80) / 2 : a.w - 50, availH = side === 'h' ? a.h - 130 : (a.h - 150) / 2;
    const c = Math.min(availW / maxH, availH / maxM, 34);
    const grid = (x0, y0, m, h, col, lbl, kk) => {
      tx(lbl, x0, y0 - 14, { a: 'left', s: NAR ? 12 : 14, c: col }); let n = 0;
      for (let i = 0; i < m; i++) for (let j = 0; j < h; j++) { if (n++ >= kk * m * h) continue; rr(x0 + j * c + 1.5, y0 + i * c + 1.5, c - 3, c - 3, 3, rgba(col, .5), col, 1); if (c > 24 && !NAR) tx('15', x0 + j * c + c / 2, y0 + i * c + c / 2 + 1, { f: FM, w: 500, s: 10, c: C.txt, al: .8 }); }
      tx('horas →', x0 + h * c, y0 + m * c + 14, { a: 'right', s: 11, c: C.dim }); tx('máquinas ↓', x0 - 6, y0 + m * c / 2, { a: 'right', s: 11, c: C.dim });
    };
    const x0 = a.x0 + (NAR ? 74 : 90), y0 = a.y0 + 56;
    grid(x0, y0, m1, h1, C.A, `${m1} máquinas × ${h1} h = ${m1 * h1} máquina-horas → ${p1} peças`, 1);
    const x1 = side === 'h' ? a.cx + 70 : x0, y1 = side === 'h' ? y0 : y0 + m1 * c + 56;
    grid(x1, y1, S.m2, S.h2, C.res, `${S.m2} × ${S.h2} = ${S.m2 * S.h2} máquina-horas → ${nb(p2)} peças`, k);
    pill(`1 máquina em 1 hora: ${p1} ÷ (${m1} · ${h1}) = ${nb(taxa)} peças`, a.cx, a.y0 + 8, null, { a: 'center', f: FM, w: 500, s: NAR ? 12 : 16, st: C.res, tc: C.res });
    const s = `x = ${p1} · (${S.m2}/${m1}) · (${S.h2}/${h1}) = ${nb(p2)} peças`;
    tx(s, a.cx, a.y1 - 6, { f: FM, w: 500, s: fit(s, a.w, NAR ? 13 : 16, 500, FM), c: C.txt });
  },
  ui: () => [
    { type: 'range', l: 'Máquinas', min: 1, max: 10, get: S => S.m2, set: (S, v) => { S.m2 = v; S.t = 0; } },
    { type: 'range', l: 'Horas por dia', min: 1, max: 12, get: S => S.h2, set: (S, v) => { S.h2 = v; S.t = 0; } }
  ],
  cap: S => `Cada quadradinho é <b>1 máquina trabalhando 1 hora</b>, e ele sempre rende 15 peças. Contou os quadradinhos, achou a produção: ${S.m2 * S.h2} × 15 = <b>${nb(S.m2 * S.h2 * 15)} peças</b>.`,
  desc: `<p>Na <b>regra de três composta</b> a resposta depende de <b>mais de duas</b> grandezas ao mesmo tempo. Problema da tela: 4 máquinas, trabalhando 6 horas, produzem 360 peças. Quantas peças produzem 6 máquinas trabalhando 8 horas?</p>
<div class="passos"><b>De onde vem a conta</b><ol>
<li>Descubra a <b>unidade de trabalho</b>, igual à da regra de três inversa: aqui é a máquina-hora (1 máquina ligada por 1 hora).</li>
<li>No caso conhecido houve 4 × 6 = 24 máquina-horas, que fizeram 360 peças. Então cada máquina-hora faz 360 ÷ 24 = <b>15 peças</b> (redução à unidade).</li>
<li>No caso novo há 6 × 8 = 48 máquina-horas. Produção: 48 × 15 = <b>720 peças</b>.</li>
<li>Escrito em uma linha: <span class="q">x = 360 · (6/4) · (8/6)</span>. Cada fração é o quanto aquela grandeza mudou, e ela multiplica a resposta se for <b>direta</b> (mais máquinas, mais peças).</li>
<li>Se uma grandeza fosse <b>inversa</b> (por exemplo, mais máquinas para a mesma produção, menos dias), a fração dela entraria <b>de cabeça para baixo</b>.</li>
</ol></div>
<p>Método das setas, para conferir: coloque a seta na coluna da incógnita; para cada outra coluna, pergunte “se isso aumentar, a resposta aumenta?”. Se sim, seta no mesmo sentido; se não, sentido oposto (e inverta a razão).</p>`,
  kv: [['unidade de trabalho', 'máquina-hora, pessoa-dia…'], ['direta', 'a razão entra como está'], ['inversa', 'a razão entra invertida']],
  enem: 'A composta aparece em <b>produção industrial, obras, consumo de ração ou de água</b>. A forma mais segura no ENEM é achar quanto rende 1 unidade de trabalho (1 operário em 1 hora, 1 animal em 1 dia) e depois multiplicar.'
});

// =====================================================================================
// 10. Questões
// =====================================================================================
{
  const QS = [
    { q: 'Um mapa está na escala 1 : 500 000. Duas cidades estão a 4 cm de distância no mapa. Qual a distância real entre elas?', o: ['2 km', '20 km', '200 km', '2 000 km', '0,2 km'], c: 1,
      r: '4 cm × 500 000 = 2 000 000 cm. Como 1 km = 100 000 cm, isso dá <b>20 km</b>. O erro mais comum é converter cm em km dividindo por 1 000.' },
    { q: 'Com 5 litros de tinta pinta-se uma parede de 40 m². Quantos m² são pintados com 12 litros da mesma tinta?', o: ['48 m²', '80 m²', '96 m²', '100 m²', '120 m²'], c: 2,
      r: '1 litro pinta 40 ÷ 5 = 8 m². Com 12 litros: 12 × 8 = <b>96 m²</b>. Grandezas diretas: mais tinta, mais área.' },
    { q: 'Oito torneiras iguais enchem um tanque em 6 horas. Em quanto tempo 12 dessas torneiras enchem o mesmo tanque?', o: ['9 h', '5 h', '4 h', '3 h', '2 h'], c: 2,
      r: 'O tanque precisa de 8 × 6 = 48 torneira-horas. Com 12 torneiras: 48 ÷ 12 = <b>4 h</b>. A resposta 9 h vem de tratar como direta.' },
    { q: 'Três impressoras iguais, em 4 horas, imprimem 1 200 páginas. Quantas páginas 5 dessas impressoras imprimem em 6 horas?', o: ['1 800', '2 000', '2 500', '3 000', '3 600'], c: 3,
      r: 'Uma impressora em 1 hora: 1 200 ÷ (3 × 4) = 100 páginas. Agora são 5 × 6 = 30 impressora-horas: 30 × 100 = <b>3 000</b>.' },
    { q: 'Numa turma de 40 alunos, a razão entre o número de meninas e o de meninos é 3 : 5. Quantas meninas há na turma?', o: ['12', '15', '24', '25', '30'], c: 1,
      r: 'A cada 3 + 5 = 8 alunos, 3 são meninas. 40 ÷ 8 = 5 grupos, então 5 × 3 = <b>15 meninas</b>. A alternativa 24 vem de confundir 3/5 com a fração do total.' },
    { q: 'Uma lanchonete oferece 3 tipos de pão e 4 tipos de recheio. Quantos sanduíches diferentes, com 1 pão e 1 recheio, podem ser feitos?', o: ['7', '12', '16', '24', '64'], c: 1,
      r: 'Cada sanduíche é um par (pão, recheio): o produto cartesiano tem 3 × 4 = <b>12</b> pares. Somar (7) esquece que cada pão combina com cada recheio.' },
    { q: 'O ponto P = (−3; 5) está localizado em qual quadrante do plano cartesiano?', o: ['1º', '2º', '3º', '4º', 'Sobre o eixo y'], c: 1,
      r: 'x negativo (esquerda) e y positivo (cima): <b>2º quadrante</b>. Confira a ordem: primeiro x, depois y.' }
  ];
  def('questoes', 'questoes', {
    t: 'Questões no estilo ENEM', st: '7 questões com resolução', quiz: true,
    init: () => ({ ans: QS.map(() => -1) }),
    draw() {},
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
    desc: `<p>Sete questões no formato do ENEM, cobrindo escala, regra de três direta, inversa e composta, razão parte : todo, produto cartesiano e quadrantes.</p><p>Em cada uma, a resolução mostra o raciocínio pela unidade (quanto vale 1?) e de onde costuma vir a alternativa errada.</p>`,
    kv: [],
    enem: 'Razão, proporção e regra de três estão entre os conteúdos <b>mais frequentes</b> da prova de Matemática do ENEM, quase sempre dentro de uma situação do dia a dia. Leia o contexto, decida se é direta ou inversa e só então calcule.'
  });
}
