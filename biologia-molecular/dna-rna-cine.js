/* LAB Biologia molecular: rota na/dna-rna, versão cinematográfica (a padrão). Código da equipe (Martin).
   Da transcrição à tradução em 3D real e interativo, com o visor do mol3d.js (girar, zoom, Frente/Lado/Cima, toque nas peças):
   1 DNA e RNA comparados; 2 a RNA polimerase abre a hélice e monta o mRNA; 3 o mRNA sai pelo poro do núcleo;
   4 o ribossomo lê os códons, os RNA transportadores trazem os aminoácidos e a cadeia se dobra numa proteína.
   Tudo é função do passo e do tempo dentro do passo (P.passo, P.tp): pausar congela, reduced-motion abre cada passo no fim.
   Imagem: material físico, luz de contorno, névoa, profundidade de campo e brilho feitos aqui (render próprio, sem bibliotecas).
   Versões anteriores continuam na URL: ?v=a (Dry, canvas 2D) e ?v=3d (Prometeu). Carregue depois de dna-rna-3d.js. */
(() => {
  'use strict';
  if (/[?&]v=(a|3d)\b/.test(location.search) || typeof SC === 'undefined' || !SC['na/dna-rna'] || typeof MOL3D === 'undefined') return;
  const old = SC['na/dna-rna'];
  const REDUZ = MOL3D.reduz, EZ = MOL3D.E, TAU = Math.PI * 2;
  const cl = (v, a, b) => (v < a ? a : v > b ? b : v), mix = (a, b, t) => a + (b - a) * t;
  const seg = (t, a, b) => cl((t - a) / (b - a), 0, 1);
  const sst = (a, b, x) => { const t = seg(x, a, b); return t * t * (3 - 2 * t); };
  const outBack = t => { const c = 1.25; t -= 1; return 1 + (c + 1) * t * t * t + c * t * t; };
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const len = a => Math.hypot(a[0], a[1], a[2]), nrm = a => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const lerp3 = (a, b, t) => [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];
  function rng(s) { return () => { s |= 0; s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function h3(x, y, z) { let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(z | 0, 1274126177); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
  function vnoise(x, y, z) {
    const X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z), fx = x - X, fy = y - Y, fz = z - Z;
    const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy), w = fz * fz * (3 - 2 * fz);
    const L = (a, b, t) => a + (b - a) * t;
    return L(L(L(h3(X, Y, Z), h3(X + 1, Y, Z), u), L(h3(X, Y + 1, Z), h3(X + 1, Y + 1, Z), u), v),
      L(L(h3(X, Y, Z + 1), h3(X + 1, Y, Z + 1), u), L(h3(X, Y + 1, Z + 1), h3(X + 1, Y + 1, Z + 1), u), v), w);
  }

  // ---------- conteúdo: um gene curto, transcrito e traduzido ----------
  const FL1 = 'GCTATAAAGGCTCA', GENE = 'ATGGCATTCGGTAAATGCGAACTGTGGAAGCATTAA', FL2 = 'GCCTTAGGCATCGA';
  const TOP = FL1 + GENE + FL2, NBP = TOP.length, I0 = FL1.length, NR = GENE.length;       // fita codificadora, 5' para 3'
  const PAR = { A: 'T', T: 'A', G: 'C', C: 'G' }, RPAR = { A: 'U', U: 'A', G: 'C', C: 'G' };
  const BOT = [...TOP].map(b => PAR[b]).join('');                                          // fita molde
  const MRNA = GENE.replace(/T/g, 'U');
  const AA = [['Met', 'Metionina'], ['Ala', 'Alanina'], ['Phe', 'Fenilalanina'], ['Gly', 'Glicina'], ['Lys', 'Lisina'], ['Cys', 'Cisteína'], ['Glu', 'Ácido glutâmico'], ['Leu', 'Leucina'], ['Trp', 'Triptofano'], ['Lys', 'Lisina'], ['His', 'Histidina']];
  const NAA = AA.length, NCIC = NAA - 1;
  const LET = 'ATGCU';
  const BCOR = { A: '#39E58C', T: '#FF4F6D', G: '#FFC53D', C: '#3FA9FF', U: '#C77DFF' };
  const COR = { fita: '#5D78B6', rna: '#E05A44', desox: '#93A8D6', ribose: '#F2DDB0', oh: '#FF5A5A', fosf: '#FF9A3C', pol: '#E07A88', ribo1: '#E6A283', ribo2: '#D88E70', poro: '#A68AD8', fundo: '#13203B', pep: '#F4E6C8' };
  const TRNA_COR = ['#2EB5A9', '#F2994A', '#72C34B', '#D86BA8'];
  const AA_COR = ['#F2C14E', '#4FB8E6', '#9A84F2', '#9AD0C2', '#5B8DEF', '#F2D24B', '#E8554E', '#7FD49B', '#B98CFF', '#5B8DEF', '#F28EC2'];

  // ---------- peças tocáveis (painel do mol3d) ----------
  const BASE = {
    A: 'Base púrica, de dois anéis. Pareia com a timina no DNA e com a uracila no RNA, por 2 ligações de hidrogênio.',
    T: 'Base pirimídica, de um anel, que só existe no DNA. Pareia com a adenina por 2 ligações de hidrogênio. No RNA, a uracila fica no lugar dela.',
    G: 'Base púrica, de dois anéis. Pareia com a citosina por 3 ligações de hidrogênio.',
    C: 'Base pirimídica, de um anel. Aparece no DNA e no RNA e pareia com a guanina por 3 ligações de hidrogênio.',
    U: 'Base pirimídica, de um anel, que só existe no RNA. Fica no lugar da timina e pareia com a adenina.'
  };
  const NOMEB = { A: 'Adenina (A)', T: 'Timina (T)', G: 'Guanina (G)', C: 'Citosina (C)', U: 'Uracila (U)' };
  const PC = {};
  const peca = (id, nome, cor, frase, sub) => (PC[id] = { id, nome, cor, frase, sub: sub || '', c: [0, 0, 0], r: 3, centro() { return [this.c[0], this.c[1], this.c[2], this.r]; } });
  for (const b of LET) peca('b' + b, NOMEB[b], BCOR[b], BASE[b], b === 'T' ? 'Base nitrogenada, só no DNA' : b === 'U' ? 'Base nitrogenada, só no RNA' : 'Base nitrogenada');
  peca('desox', 'Desoxirribose', COR.desox, 'Açúcar de 5 carbonos do DNA, sem o oxigênio do carbono 2 (tem um H no lugar do OH da ribose). Com o fosfato, forma o esqueleto da fita.', 'Açúcar do DNA');
  peca('ribose', 'Ribose', COR.ribose, 'Açúcar de 5 carbonos do RNA, com um grupo OH a mais no carbono 2 (a bolinha vermelha). Esse OH deixa o RNA menos estável que o DNA, bom para uma cópia temporária.', 'Açúcar do RNA');
  peca('dna', 'DNA', COR.fita, 'Duas fitas antiparalelas enroladas em dupla hélice, unidas por ligações de hidrogênio entre as bases. Guarda a informação genética no núcleo.', 'Ácido desoxirribonucleico');
  peca('rna', 'RNA', COR.rna, 'Uma fita só, com ribose e uracila. Pode ser mensageiro, transportador ou ribossômico.', 'Ácido ribonucleico');
  peca('molde', 'Fita molde', COR.fita, 'Fita do DNA que a RNA polimerase lê. O RNA é montado complementar a ela: onde há A, entra U; onde há T, entra A; onde há G, entra C; onde há C, entra G.', 'DNA, uma das duas fitas');
  peca('cod', 'Fita codificadora', COR.fita, 'A outra fita do DNA. Tem a mesma sequência do RNA mensageiro, só que com T no lugar de U.', 'DNA, uma das duas fitas');
  peca('pol', 'RNA polimerase', COR.pol, 'Enzima que abre a dupla hélice, lê a fita molde e liga os nucleotídeos de RNA um a um. Na célula avança cerca de 40 nucleotídeos por segundo; aqui está mais devagar.', 'Enzima da transcrição');
  peca('nt', 'Nucleotídeo de RNA', COR.ribose, 'Ribose, fosfato e uma base (A, U, G ou C). Chega livre e só se encaixa se a base parear com a da fita molde.', 'Matéria-prima do RNA');
  peca('mrna', 'mRNA', COR.rna, 'RNA mensageiro: uma fita só, cópia de um gene. Leva a receita da proteína do núcleo até o ribossomo, em trincas de bases (códons).', 'RNA mensageiro');
  peca('nucleo', 'Núcleo', '#8EB6FF', 'Guarda o DNA. É envolvido pelo envoltório nuclear, uma membrana dupla com poros. A transcrição acontece aqui dentro.', 'Envoltório nuclear');
  peca('poro', 'Poro nuclear', COR.poro, 'Canal formado por proteínas no envoltório nuclear. Por ele o RNA mensageiro sai para o citoplasma.', 'Saída do núcleo');
  peca('cito', 'Citoplasma', '#7FA6D9', 'Região entre o núcleo e a membrana da célula, onde ficam os ribossomos. É aqui que acontece a tradução.', 'Fora do núcleo');
  peca('ribo1', 'Ribossomo', COR.ribo1, 'Subunidade maior do ribossomo: catalisa as ligações peptídicas entre os aminoácidos. A menor, abaixo, prende o mRNA e confere o pareamento códon e anticódon.', 'Subunidade maior');
  peca('ribo2', 'Ribossomo', COR.ribo2, 'Subunidade menor: prende o mRNA e lê os códons, de 3 em 3 bases.', 'Subunidade menor');
  peca('codon', 'Códon', BCOR.G, 'Trinca de bases do mRNA. Cada códon indica um aminoácido (exceto os de parada, como o UAA que encerra este gene); AUG é o códon de início e indica a metionina.', 'Trinca do mRNA');
  peca('anti', 'Anticódon', BCOR.C, 'Trinca do RNA transportador que pareia com o códon do mRNA, A com U e G com C. É assim que o aminoácido certo chega na hora certa.', 'Trinca do RNA transportador');
  peca('trna', 'RNA transportador', TRNA_COR[0], 'Leva um aminoácido até o ribossomo. A fita dobra sobre si mesma em forma de trevo, com o anticódon numa ponta e o aminoácido na outra.', 'tRNA');
  peca('aa', 'Aminoácido', AA_COR[0], 'Unidade das proteínas. Existem 20 tipos; a ordem deles na cadeia segue a ordem dos códons do mRNA.');
  peca('pep', 'Ligação peptídica', COR.pep, 'Liga o grupo carboxila de um aminoácido ao grupo amino do seguinte e libera uma molécula de água. Quem faz a ligação é o ribossomo.', 'Entre dois aminoácidos');
  peca('prot', 'Proteína', '#E07AD8', 'A cadeia de aminoácidos se dobra numa forma própria, que define a função da proteína. Aqui são só 11 aminoácidos; proteínas reais têm de cerca de 50 a milhares.', 'Cadeia dobrada');
  const AAP = AA.map((a, i) => ({ id: 'aa' + i, nome: a[1] + ' (' + a[0] + ')', cor: AA_COR[i], frase: PC.aa.frase, sub: 'Aminoácido ' + (i + 1) + ' da cadeia, códon ' + MRNA.substr(3 * i, 3), c: [0, 0, 0], r: 2, centro() { return [this.c[0], this.c[1], this.c[2], this.r]; } }));

  // ---------- passos ----------
  const PASSOS = ['DNA e RNA', 'transcrição', 'saída do mRNA', 'tradução'];
  const LEG = [
    'DNA: duas fitas em dupla hélice, com desoxirribose e timina (T). RNA: uma fita só, com ribose e uracila (U) no lugar da timina',
    'Transcrição, no núcleo: a RNA polimerase abre a dupla hélice, lê a fita molde e monta o RNA mensageiro: para cada base do molde entra a complementar, A recebe U, T recebe A, G recebe C e C recebe G',
    'O RNA mensageiro pronto sai do núcleo por um poro do envoltório nuclear e chega ao citoplasma',
    'Tradução, no ribossomo: cada códon do mRNA (3 bases) recebe o RNA transportador de anticódon complementar, e os aminoácidos se unem por ligações peptídicas até formar a proteína'
  ];
  const DUR = [13, 13, 11.5, 15];          // duração de cada ato (s); o controle troca de passo a cada 16 s

  // ---------- geometria fixa do mundo (unidades de cerca de 1 nm, fora de escala entre as partes) ----------
  const R = 1, RISE = .55, TW = TAU / 10, DEL = 2.4, PARW = 1.86;  // hélice: raio, subida por par, giro por par, sulco, largura do par
  const xOf = i => (i - (NBP - 1) / 2) * RISE;
  const NC = [2, -3, -16], RN = 30;                       // núcleo
  const PDIR = nrm([.55, .55, .63]), PORO = add(NC, mul(PDIR, RN));
  const RIBO = add(add(PORO, mul(PDIR, 17)), [7, -4, 2]);  // ribossomo no citoplasma
  const NTS = RISE, CW = 3 * NTS, XP = -CW / 2;           // espaço entre nucleotídeos, largura do códon, centro do sítio P
  const TY = 2.66, TZ = 1.9;                              // altura e frente dos tRNAs no ribossomo

  // ---------- qualidade por tamanho de tela ----------
  function qualidade() {
    const cel = Math.min(innerWidth, innerHeight) < 560 || innerWidth < 700;
    return cel ? { cel: 1, det: 32, part: 170, mol: 14, msaa: 4, maxPx: 2.0e6, maxR: 5, rs: 1.3, blobs: 4 }
      : { cel: 0, det: 56, part: 560, mol: 30, msaa: 4, maxPx: 5.0e6, maxR: 7, rs: 1, blobs: 7 };
  }

  let G = null;            // tudo o que a cena montada usa (refeito a cada entrada)
  const CACHE = {};        // geometrias caras (bolhas de proteína, tRNA), guardadas entre visitas
  let DSQ = 5, TPFIX = null, CAMFIX = null, QFIX = null;   // ganchos de teste (window.DNACINE)

  // ---------- fábricas de geometria ----------
  function lumpy(T, key, seed, det, nb, amp, w0, w1) {
    const k = key + ':' + det; if (CACHE[k]) return CACHE[k];
    let g = new T.IcosahedronGeometry(1, det); g.deleteAttribute('normal'); g.deleteAttribute('uv'); g = window.R3F.mergeVertices(g);
    const r = rng(seed), B = [];
    for (let j = 0; j < nb; j++) { const z = r() * 2 - 1, a = r() * TAU, s = Math.sqrt(1 - z * z), w = mix(w0, w1, r()); B.push([s * Math.cos(a), s * Math.sin(a), z, w * w, (.5 + .5 * r()) * amp]); }
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i); let m = 0;
      for (const b of B) { const d2 = (x - b[0]) ** 2 + (y - b[1]) ** 2 + (z - b[2]) ** 2; if (d2 < b[3]) { const t = 1 - d2 / b[3], h = b[4] * t * t, q = cl(.5 + .5 * (h - m) / .035, 0, 1); m = mix(m, h, q) + .035 * q * (1 - q); } }
      const rr = 1 + m + (vnoise(x * 1.9 + seed, y * 1.9, z * 1.9) - .5) * .22;
      p.setXYZ(i, x * rr, y * rr, z * rr);
    }
    g.computeVertexNormals(); CACHE[k] = g; return g;
  }
  // bastão de base com cantos arredondados (1 de comprimento no eixo x)
  function bastao(T) {
    if (CACHE.bastao) return CACHE.bastao.clone();
    const g = new T.BoxGeometry(1, .3, .3, 14, 8, 8), p = g.attributes.position, n = g.attributes.normal, hx = .5, hy = .15, rr = .075;
    // leva os vértices da grade para perto das arestas, onde fica a curva do canto
    const aperta = (u, h) => { const t = u / h, a = Math.abs(t), f = 1 - rr / h; return Math.sign(t) * h * (a < .5 ? a * 2 * f : f + (a - .5) * 2 * (1 - f)); };
    for (let i = 0; i < p.count; i++) {
      const x = aperta(p.getX(i), hx), y = aperta(p.getY(i), hy), z = aperta(p.getZ(i), hy), ix = cl(x, -hx + rr, hx - rr), iy = cl(y, -hy + rr, hy - rr), iz = cl(z, -hy + rr, hy - rr);
      const d = [x - ix, y - iy, z - iz], l = len(d);
      if (l > 1e-6) { const u = mul(d, 1 / l); p.setXYZ(i, ix + u[0] * rr, iy + u[1] * rr, iz + u[2] * rr); n.setXYZ(i, u[0], u[1], u[2]); }
    }
    CACHE.bastao = g; return g.clone();
  }
  // tRNA em forma de trevo: tubo no plano xy, anticódon embaixo (y cerca de -1,25) e ponta aceptora em cima (y cerca de 1,6)
  function trevo(T) {
    if (CACHE.trevo) return CACHE.trevo;
    const P = [], arc = (cx, cy, rx, ry, a0, a1, n, z) => { for (let i = 0; i <= n; i++) { const a = mix(a0, a1, i / n); P.push(new T.Vector3(cx + rx * Math.cos(a), cy + ry * Math.sin(a), z || 0)); } };
    P.push(new T.Vector3(-.1, 1.62, 0), new T.Vector3(-.1, 1.1, .02), new T.Vector3(-.12, .6, .04));
    arc(-.82, .38, .34, .3, .3, TAU - .3, 12, .08);                  // braço D
    P.push(new T.Vector3(-.16, .18, .06), new T.Vector3(-.16, -.45, .04));
    arc(0, -.95, .56, .32, Math.PI - .55, TAU + .55, 14, 0);          // alça do anticódon
    P.push(new T.Vector3(.16, -.45, -.04), new T.Vector3(.16, .18, -.06));
    arc(.82, .38, .34, .3, Math.PI + .3, 3 * Math.PI - .3, 12, -.08);                  // braço T
    P.push(new T.Vector3(.12, .6, -.04), new T.Vector3(.1, 1.1, -.02), new T.Vector3(.1, 1.72, 0));
    const g = new T.TubeGeometry(new T.CatmullRomCurve3(P, false, 'centripetal'), 220, .095, 10, false);
    CACHE.trevo = g; return g;
  }

  // ---------- materiais: físico com luz de contorno e, nos bastões, letra impressa ----------
  function fisico(T, cor, o = {}) {
    const m = new T.MeshPhysicalMaterial(Object.assign({ color: cor, roughness: .36, metalness: 0, clearcoat: .7, clearcoatRoughness: .22, envMapIntensity: .5 }, o.p || {}));
    const rimC = new T.Color(o.rim || '#8FB6FF').multiplyScalar((o.rimK == null ? .22 : o.rimK) * .55), letras = !!o.letras;
    m.userData.rim = rimC;
    m.onBeforeCompile = sh => {
      sh.uniforms.uRim = { value: rimC };
      let f = 'uniform vec3 uRim;\n' + sh.fragmentShader.replace('#include <opaque_fragment>',
        'outgoingLight += uRim * pow(1.0 - clamp(abs(dot(normal, normalize(vViewPosition))), 0.0, 1.0), 2.6);\n#include <opaque_fragment>');
      let vs = sh.vertexShader;
      if (letras) {
        sh.uniforms.uAtlas = { value: G.atlas }; sh.uniforms.uGs = { value: .3 };
        vs = 'attribute float aL;\nvarying float vVar;\nvarying float vL;\nvarying vec3 vOP;\nvarying vec3 vON;\nvarying float vUp;\n' + vs.replace('#include <begin_vertex>', `#include <begin_vertex>
  vL = aL; vOP = position; vON = normal;
  #ifdef USE_INSTANCING
  vVar = fract(sin(dot(instanceMatrix[3].xyz, vec3(12.9898, 78.233, 37.719))) * 43758.5453);
  #else
  vVar = 0.5;
  #endif
  { vec3 an = abs(normal); vec3 upO = vec3(0.0, 1.0, 0.0);
    if (an.y > an.z && an.y > an.x) upO = vec3(0.0, 0.0, -sign(normal.y));
    #ifdef USE_INSTANCING
    vUp = (modelViewMatrix * instanceMatrix * vec4(upO, 0.0)).y;
    #else
    vUp = (modelViewMatrix * vec4(upO, 0.0)).y;
    #endif
  }`);
        f = 'uniform sampler2D uAtlas;\nuniform float uGs;\nvarying float vVar;\nvarying float vL;\nvarying vec3 vOP;\nvarying vec3 vON;\nvarying float vUp;\n' + f.replace('#include <color_fragment>', `#include <color_fragment>
  float dcInk = 0.0, dcAo = 0.62 + 0.38 * smoothstep(0.5, 0.33, abs(vOP.x));
  diffuseColor.rgb *= 0.93 + 0.12 * vVar;
  if (vL > -0.5) {
    vec3 an = abs(vON); vec2 g = vec2(9.0);
    if (an.z >= an.y && an.z > an.x) g = vec2(vOP.x * sign(vON.z), vOP.y);
    else if (an.y > an.x) g = vec2(vOP.x, -vOP.z * sign(vON.y));
    if (vUp < 0.0) g = -g;
    vec2 q = g / uGs + 0.5;
    if (q.x > 0.0 && q.x < 1.0 && q.y > 0.0 && q.y < 1.0) { float a = texture2D(uAtlas, vec2((vL + q.x) / 5.0, q.y)).a; dcInk = a; diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.03, 0.04, 0.08), a); }
  }`);
        f = f.replace('#include <opaque_fragment>', 'outgoingLight *= mix(1.0, dcAo, 0.75);\n  outgoingLight = mix(outgoingLight, vec3(0.025, 0.03, 0.06), dcInk * 0.94);\n#include <opaque_fragment>');
      }
      sh.vertexShader = vs; sh.fragmentShader = f;
    };
    m.customProgramCacheKey = () => (letras ? 'dc-letras' : 'dc-rim');
    return m;
  }
  function atlas(T) {
    const c = document.createElement('canvas'); c.width = 1280; c.height = 256; const x = c.getContext('2d');
    const pinta = () => { x.clearRect(0, 0, 1280, 256); x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = "800 226px 'Atkinson Hyperlegible Next', 'Segoe UI', system-ui, sans-serif"; [...LET].forEach((l, i) => x.fillText(l, 128 + i * 256, 136)); };
    pinta(); const t = new T.CanvasTexture(c); t.anisotropy = G && G.v.ren.capabilities.getMaxAnisotropy ? Math.min(16, G.v.ren.capabilities.getMaxAnisotropy()) : 8;
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { pinta(); t.needsUpdate = true; });
    return t;
  }

  // ---------- instâncias reescritas a cada quadro ----------
  function inst(T, geo, mat, max, pai, letras) {
    const m = new T.InstancedMesh(geo, mat, max); m.frustumCulled = false; m.count = 0; m.instanceMatrix.setUsage(T.DynamicDrawUsage);
    m.setColorAt(0, new T.Color(1, 1, 1)); m.instanceColor.setUsage(T.DynamicDrawUsage); pai.add(m);
    const W = { m, n: 0, max, info: new Array(max) };
    if (letras) { W.L = new Float32Array(max).fill(-1); W.La = new T.InstancedBufferAttribute(W.L, 1); W.La.setUsage(T.DynamicDrawUsage); geo.setAttribute('aL', W.La); }
    m.userData.info = W.info; return W;
  }
  const cores = {};
  function cor(T, h) { return cores[h] || (cores[h] = new T.Color(h)); }
  function put(W, p, q, sx, sy, sz, hex, k, info, letra) {
    if (W.n >= W.max) return; const g = G, i = W.n++;
    g._p.set(p[0], p[1], p[2]); g._s.set(sx, sy, sz); g._m.compose(g._p, q, g._s); W.m.setMatrixAt(i, g._m);
    g._c.copy(cor(g.T, hex)); if (k !== 1) g._c.multiplyScalar(k); W.m.setColorAt(i, g._c);
    W.info[i] = info || null; if (W.L) W.L[i] = letra == null ? -1 : letra;
  }
  function fim(W) { W.m.count = W.n; W.m.instanceMatrix.needsUpdate = true; if (W.m.instanceColor) W.m.instanceColor.needsUpdate = true; if (W.La) W.La.needsUpdate = true; W.m.boundingSphere = null; W.n = 0; }
  // quaternion com o eixo x na direção dada e o eixo y o mais perto possível de "cima"
  function qx(dir, cima) {
    const g = G, x = nrm(dir); let c = cima || [0, 1, 0]; if (Math.abs(dot(x, c)) > .97) c = Math.abs(x[2]) < .9 ? [0, 0, 1] : [1, 0, 0];
    const z = nrm(cross(x, c)), y = cross(z, x);
    g._b.set(x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, 0, 0, 0, 1);
    return g._q2.setFromRotationMatrix(g._b);
  }
  function qy(dir) { const g = G, y = nrm(dir); g._v1.set(0, 1, 0); g._v2.set(y[0], y[1], y[2]); return g._q2.setFromUnitVectors(g._v1, g._v2); }

  // ---------- tubo dinâmico (fitas) ----------
  function tubo(T, max, rad, mat, pai) {
    const nv = max * (rad + 1), pos = new Float32Array(nv * 3), nor = new Float32Array(nv * 3), idx = [];
    for (let i = 0; i < max - 1; i++) for (let j = 0; j < rad; j++) { const a = i * (rad + 1) + j, b = a + rad + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.BufferAttribute(pos, 3).setUsage(T.DynamicDrawUsage)); g.setAttribute('normal', new T.BufferAttribute(nor, 3).setUsage(T.DynamicDrawUsage)); g.setIndex(idx);
    const mesh = new T.Mesh(g, mat); mesh.frustumCulled = false; pai.add(mesh);
    return {
      mesh, set(P, rf) {
        const n = Math.min(P.length, max); if (n < 2) { mesh.visible = false; return; } mesh.visible = true;
        let N = null;
        for (let i = 0; i < n; i++) {
          const t = nrm(sub(P[Math.min(i + 1, n - 1)], P[Math.max(i - 1, 0)]));
          if (N) { N = sub(N, mul(t, dot(N, t))); if (len(N) < 1e-4) N = null; else N = nrm(N); }
          if (!N) N = nrm(cross(t, Math.abs(t[1]) < .9 ? [0, 1, 0] : [1, 0, 0]));
          const B = cross(t, N), r = rf(i, n), o = i * (rad + 1) * 3;
          for (let j = 0; j <= rad; j++) {
            const a = j / rad * TAU, c = Math.cos(a), s = Math.sin(a), nx = N[0] * c + B[0] * s, ny = N[1] * c + B[1] * s, nz = N[2] * c + B[2] * s, k = o + j * 3;
            pos[k] = P[i][0] + nx * r; pos[k + 1] = P[i][1] + ny * r; pos[k + 2] = P[i][2] + nz * r; nor[k] = nx; nor[k + 1] = ny; nor[k + 2] = nz;
          }
        }
        g.setDrawRange(0, (n - 1) * rad * 6); g.attributes.position.needsUpdate = true; g.attributes.normal.needsUpdate = true; g.boundingSphere = null;
      }
    };
  }
  function cr(p0, p1, p2, p3, t) { const t2 = t * t, t3 = t2 * t; return [0, 1, 2].map(k => .5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)); }
  function denso(P, s) { const o = [], n = P.length; for (let i = 0; i < n - 1; i++) { const a = P[Math.max(i - 1, 0)], b = P[i], c = P[i + 1], d = P[Math.min(i + 2, n - 1)]; for (let k = 0; k < s; k++) o.push(cr(a, b, c, d, k / s)); } o.push(P[n - 1]); return o; }
  const conta = (r0, s, ab) => (i, n) => { const tp = Math.min(1, i / 2, (n - 1 - i) / 2); return r0 * (1 + ab * Math.cos(TAU * i / s)) * Math.sqrt(Math.max(0, tp)); };

  // ---------- trilha do mRNA que sai da polimerase (coordenadas da hélice, relativas ao ponto de saída) ----------
  const TR = [];
  function trilhaDir(a) { const w = sst(0, 7, a); let d = lerp3([-.25, .35, .9], [-.6, .8, .2 + .25 * Math.sin(a * .13)], w); d = add(d, [.12 * Math.sin(a * .37 + 1), 0, .16 * Math.sin(a * .55)]); return nrm(d); }
  { let p = [0, 0, 0]; for (let a = 0; a <= 80; a++) { TR.push(p); p = add(p, mul(trilhaDir(a), NTS)); } }
  const trilha = a => { a = cl(a, 0, 79.999); const i = Math.floor(a); return lerp3(TR[i], TR[i + 1], a - i); };

  // ---------- montagem ----------
  function montar(M) {
    const v = MOL3D.visor, T = v.THREE, q = qualidade();
    if (QFIX) Object.assign(q, QFIX);
    const g = G = { T, v, M, q, esc: 1, ema: 16, lento: 0, rapido: 0, tpAnt: 0, pick: [], pickNucleo: null, mats: [], geos: [], luz0: [] };
    g._m = new T.Matrix4(); g._b = new T.Matrix4(); g._p = new T.Vector3(); g._s = new T.Vector3(); g._c = new T.Color(); g._q2 = new T.Quaternion(); g._q = new T.Quaternion(); g._v1 = new T.Vector3(); g._v2 = new T.Vector3(); g._w = new T.Vector3();
    g.qI = new T.Quaternion();
    g.atlas = atlas(T);
    M.semVolume = true; M.fitFixo = 20; M.raioFixo = 60; M.vista = { th: -.2, fi: .12, zoom: .8, alvo: [0, 0, 0] };
    const raiz = M._nos.raiz;
    // grupos: hélice (passos 1 a 3), ribossomo (passo 4) e mundo
    g.dna = new T.Group(); g.dna.rotation.set(-.08, -.12, .4); raiz.add(g.dna);
    g.rib = new T.Group(); g.rib.position.set(RIBO[0], RIBO[1], RIBO[2]); g.rib.rotation.set(0, -.25, 0); raiz.add(g.rib);
    g.mundo = new T.Group(); raiz.add(g.mundo);
    raiz.updateMatrixWorld(true);
    g.DW = g.dna.matrixWorld.clone(); g.DWi = g.DW.clone().invert(); g.RW = g.rib.matrixWorld.clone(); g.RWi = g.RW.clone().invert();
    // materiais
    const mF = fisico(T, COR.fita, { p: { roughness: .38, clearcoat: .4, clearcoatRoughness: .34, envMapIntensity: .28, sheen: .15, sheenColor: new T.Color('#C9D8FF'), sheenRoughness: .4 } });
    const mR = fisico(T, COR.rna, { p: { roughness: .34, clearcoat: .5, clearcoatRoughness: .2, envMapIntensity: .3 }, rim: '#FFB8A0', rimK: .2 });
    const mBar = fisico(T, '#ffffff', { letras: true, p: { roughness: .42, clearcoat: .45, clearcoatRoughness: .38, envMapIntensity: .32 } });
    const mBar2 = fisico(T, '#ffffff', { letras: true, p: { roughness: .42, clearcoat: .45, clearcoatRoughness: .38, envMapIntensity: .32 } });
    const mAc = fisico(T, '#ffffff', { p: { roughness: .4, clearcoat: .4, clearcoatRoughness: .36, envMapIntensity: .3 } });
    const mPol = fisico(T, COR.pol, { p: { roughness: .5, clearcoat: .35, clearcoatRoughness: .4, sheen: .5, sheenColor: new T.Color('#FFB8B0'), sheenRoughness: .5 }, rim: '#FFB0C0', rimK: .28 });
    const mRb1 = fisico(T, COR.ribo1, { p: { roughness: .5, clearcoat: .35, clearcoatRoughness: .4, sheen: .45, sheenColor: new T.Color('#FFD8B0'), sheenRoughness: .5 }, rim: '#FFD2B0', rimK: .25 });
    const mRb2 = fisico(T, COR.ribo2, { p: { roughness: .5, clearcoat: .35, clearcoatRoughness: .4, sheen: .45, sheenColor: new T.Color('#FFD8B0'), sheenRoughness: .5 }, rim: '#FFD2B0', rimK: .25 });
    const mT = fisico(T, '#ffffff', { p: { roughness: .3, clearcoat: 1, clearcoatRoughness: .12 } });
    const mPoro = fisico(T, COR.poro, { p: { roughness: .45, sheen: .8, sheenColor: new T.Color('#E6D8FF') } });
    const mBlob = fisico(T, '#ffffff', { p: { roughness: .55, sheen: .8, sheenColor: new T.Color('#E8E0FF'), clearcoat: .2 } });
    g.mats.push(mF, mR, mBar, mBar2, mAc, mPol, mRb1, mRb2, mT, mPoro, mBlob); g.mPol = mPol; g.mRb1 = mRb1; g.mRb2 = mRb2; g.mF = mF; g.mR = mR;
    const geS = new T.SphereGeometry(1, q.cel ? 32 : 44, q.cel ? 22 : 30), geC = new T.CylinderGeometry(1, 1, 1, q.cel ? 16 : 24, 1), geP = new T.CylinderGeometry(1, 1, 1, 5, 1);
    geC.rotateZ(Math.PI / 2); g.geos.push(geS, geC, geP);
    // hélice e mRNA no núcleo
    const DS = DSQ = q.cel ? 6 : 10, RD = q.cel ? 16 : 24;
    g.tM = tubo(T, (NBP + 2) * DS + 1, RD, mF, g.dna); g.tC = tubo(T, (NBP + 2) * DS + 1, RD, mF, g.dna); g.tR = tubo(T, (NR + 2) * DS + 1, RD - 4, mR, g.dna);
    g.tM.mesh.userData.peca = PC.molde; g.tC.mesh.userData.peca = PC.cod; g.tR.mesh.userData.peca = PC.mrna;
    const gb1 = bastao(T), gb2 = bastao(T); g.geos.push(gb1, gb2);
    g.barD = inst(T, gb1, mBar, NBP * 2 + NR + 24, g.dna, true);
    g.acD = inst(T, geP, mAc, NBP * 2 + NR + 24, g.dna); g.bolD = inst(T, geS, mAc, (NR + 24) * 2, g.dna);
    g.pol = new T.Mesh(lumpy(T, 'pol', 3, q.det, 240, .36, .19, .32), mPol); g.pol.userData.peca = PC.pol; g.dna.add(g.pol);
    // ribossomo e tradução
    g.rbG = new T.Mesh(lumpy(T, 'rb1', 7, q.det, 300, .28, .16, .27), mRb1); g.rbG.position.set(0, 2.2, -1.05); g.rbG.scale.set(3.5, 2.4, 2.55); g.rbG.userData.peca = PC.ribo1;
    g.rbP = new T.Mesh(lumpy(T, 'rb2', 11, q.det, 240, .28, .16, .27), mRb2); g.rbP.position.set(0, -1.42, -.62); g.rbP.scale.set(3.2, 1.42, 2.3); g.rbP.userData.peca = PC.ribo2;
    g.rib.add(g.rbG, g.rbP);
    g.tR2 = tubo(T, 42 * DS + 1, RD - 4, mR, g.rib); g.tR2.mesh.userData.peca = PC.mrna;
    g.barR = inst(T, gb2, mBar2, 80, g.rib, true); g.acR = inst(T, geP, mAc, 50, g.rib); g.bolR = inst(T, geS, mAc, 90, g.rib); g.stR = inst(T, geC, mAc, 30, g.rib);
    g.trn = inst(T, trevo(T), mT, 6, g.rib);
    // mundo: núcleo, poro, nucléolo, hélices ao longe, moléculas e partículas fora de foco
    montarMundo(T, g, q, geS, geC, mF, mBar, mT, mBlob, mPoro);
    g.pick = [g.pol, g.tM.mesh, g.tC.mesh, g.tR.mesh, g.barD.m, g.acD.m, g.bolD.m, g.rbG, g.rbP, g.tR2.mesh, g.barR.m, g.acR.m, g.bolR.m, g.stR.m, g.trn.m, g.poro];
    // luz: a do visor anda com a câmera; aqui a chave fica mais quente e o recorte mais forte
    v.cam.children.forEach(o => { if (o.isLight) g.luz0.push([o, o.intensity]); });
    if (g.luz0[0]) g.luz0[0][0].intensity = 1.5; if (g.luz0[1]) g.luz0[1][0].intensity = .35; if (g.luz0[2]) g.luz0[2][0].intensity = 2.6;
    g.hemi = new T.HemisphereLight('#BFD4FF', '#2A1E3D', .25); g.mundo.add(g.hemi);
    g.fog0 = v.cena.fog; g.bg0 = v.cena.background;
    v.cena.fog = new T.FogExp2(COR.fundo, q.cel ? .008 : .007); v.cena.background = new T.Color(COR.fundo);
    montarPos(T, g);
    montarRotulos(g);
    M.render = render; M.pegar = pegar; M.limpar = limpar; M.pecas = pecasVisiveis;
  }

  function montarMundo(T, g, q, geS, geC, mF, mBar, mT, mBlob, mPoro) {
    const r = rng(42);
    // envoltório nuclear: bolha translúcida (borda clara, centro quase invisível, manchas leves) com o furo do poro
    const shU = { uPd: { value: new T.Vector3(...PDIR) }, uCos: { value: Math.cos(2.1 / RN) }, uOp: { value: 1 }, uSel: { value: 0 } };
    g.nucM = new T.ShaderMaterial({
      uniforms: shU, transparent: true, depthWrite: false, side: T.DoubleSide,
      vertexShader: 'varying vec3 vN; varying vec3 vV; varying vec3 vO; void main(){ vO = normal; vN = normalize(normalMatrix*normal); vec4 mv = modelViewMatrix*vec4(position,1.0); vV = -mv.xyz; gl_Position = projectionMatrix*mv; }',
      fragmentShader: `uniform vec3 uPd; uniform float uCos, uOp, uSel; varying vec3 vN; varying vec3 vV; varying vec3 vO;
        float hs(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
        float vn(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
          return mix(mix(mix(hs(i), hs(i+vec3(1,0,0)), f.x), mix(hs(i+vec3(0,1,0)), hs(i+vec3(1,1,0)), f.x), f.y), mix(mix(hs(i+vec3(0,0,1)), hs(i+vec3(1,0,1)), f.x), mix(hs(i+vec3(0,1,1)), hs(i+vec3(1,1,1)), f.x), f.y), f.z); }
        void main(){
          float c = dot(normalize(vO), uPd); if (c > uCos) discard;
          float rim = smoothstep(uCos, uCos - 0.004, c);
          float fr = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.4);
          float n = vn(vO * 7.0) * 0.6 + vn(vO * 19.0) * 0.4;
          float lip = smoothstep(uCos - 0.02, uCos - 0.002, c);
          vec3 col = mix(vec3(0.35, 0.5, 0.8), vec3(0.75, 0.88, 1.2), fr) * (0.8 + n * 0.5) + vec3(0.6, 0.5, 0.9) * lip;
          float a = (0.025 + fr * 0.32 + n * 0.03 + lip * 0.4 + uSel * 0.08) * rim * uOp;
          gl_FragColor = vec4(col, a); }`
    });
    g.nucleo = new T.Mesh(new T.SphereGeometry(RN, 96, 64), g.nucM); g.nucleo.position.set(NC[0], NC[1], NC[2]); g.nucleo.renderOrder = 2; g.nucleo.userData.peca = PC.nucleo; g.mundo.add(g.nucleo);
    g.geos.push(g.nucleo.geometry); g.mats.push(g.nucM);
    // poro: anel de proteínas no furo do envoltório
    g.poro = new T.Mesh(new T.TorusGeometry(2.15, .42, 14, 40), mPoro); g.poro.position.set(PORO[0], PORO[1], PORO[2]);
    g.poro.quaternion.setFromUnitVectors(new T.Vector3(0, 0, 1), new T.Vector3(...PDIR)); g.poro.userData.peca = PC.poro; g.mundo.add(g.poro); g.geos.push(g.poro.geometry);
    // nucléolo
    g.nucl = new T.Mesh(lumpy(T, 'nucl', 19, 18, 70, .25, .3, .5), fisico(T, '#5E4A8E', { p: { roughness: .6, sheen: .3, sheenColor: new T.Color('#A88AE0') }, rimK: .12 }));
    g.nucl.position.set(NC[0] - 17, NC[1] - 13, NC[2] - 10); g.nucl.scale.setScalar(5); g.mundo.add(g.nucl); g.mats.push(g.nucl.material);
    // duas hélices ao longe, dentro do núcleo (estáticas)
    g.longe = [];
    [[add(NC, [-13, 11, -3]), [1, .25, -.5], 34], [add(NC, [9, -12, -8]), [.3, 1, .35], 30], [add(NC, [-4, -2, -24]), [1, -.4, .2], 36]].forEach(([c, d, nb], h) => {
      const gr = new T.Group(); g.mundo.add(gr); const ax = nrm(d), up = nrm(cross(ax, [0, 0, 1])), sd = cross(ax, up);
      const B0 = [], B1 = [], L = (nb - 1) * RISE;
      for (let i = 0; i < nb; i++) { const th = i * TW + h; const at = add(c, mul(ax, i * RISE - L / 2)); B1.push(add(at, add(mul(up, R * Math.cos(th)), mul(sd, R * Math.sin(th))))); B0.push(add(at, add(mul(up, R * Math.cos(th + DEL)), mul(sd, R * Math.sin(th + DEL))))); }
      const t1 = tubo(T, nb * 5 + 1, 10, mF, gr), t2 = tubo(T, nb * 5 + 1, 10, mF, gr); t1.set(denso(B1, 5), conta(.17, 5, .1)); t2.set(denso(B0, 5), conta(.17, 5, .1));
      const bars = new T.InstancedMesh(new T.BoxGeometry(1, .28, .28), fisico(T, '#ffffff'), nb * 2); g.mats.push(bars.material); g.geos.push(bars.geometry);
      for (let i = 0; i < nb; i++) { const mid = lerp3(B0[i], B1[i], .5); [[B1[i], 'ATGC'[(i * 7 + h) % 4]], [B0[i], null]].forEach(([b, l], k) => {
        const ll = l || PAR['ATGC'[(i * 7 + h) % 4]], d2 = sub(mid, b), L2 = len(d2) - .12; G._p.set(...add(b, mul(nrm(d2), .06 + L2 / 2))); G._s.set(L2, 1, 1); G._m.compose(G._p, qx(d2, ax), G._s); bars.setMatrixAt(i * 2 + k, G._m); bars.setColorAt(i * 2 + k, cor(T, BCOR[ll])); }); }
      gr.add(bars); g.longe.push(gr);
    });
    // moléculas pequenas flutuando (bola e bastão), dentro e fora do núcleo
    g.mol = []; const nm = q.mol;
    for (let i = 0; i < nm; i++) {
      const dentro = i < nm * .45; let c;
      for (let t = 0; t < 20; t++) {
        c = dentro ? add(NC, mul(nrm([r() - .5, r() - .5, r() - .5]), RN * (.25 + .6 * r()))) : add(RIBO, mul(nrm([r() - .5, (r() - .5) * .8, r() - .5]), 8 + 26 * r()));
        if (len(sub(c, [0, 0, 0])) > 7 && len(sub(c, RIBO)) > 6.5 && (dentro || len(sub(c, NC)) > RN + 3)) break;
      }
      const ns = 2 + (r() * 3 | 0), sat = []; for (let k = 0; k < ns; k++) sat.push(nrm([r() - .5, r() - .5, r() - .5]));
      g.mol.push({ c, sat, ax: nrm([r() - .5, r() - .5, r() - .5]), w: .15 + .3 * r(), fase: r() * TAU, s: .7 + .6 * r(), cor: ['#5C7CC7', '#6A86D0', '#4E6DB8', '#7A6BC4'][i % 4], sc: ['#E86A6A', '#F2F4F8', '#E86A6A', '#9FB0D8'] });
    }
    g.bolW = inst(T, geS, fisico(T, '#ffffff', { p: { roughness: .35, clearcoat: .8 } }), nm * 6 + 40, g.mundo); g.stW = inst(T, geC, g.bolW.m.material, nm * 5, g.mundo); g.mats.push(g.bolW.m.material);
    // proteínas e ribossomos ao fundo (bolhas)
    g.blobs = [];
    const gbl = lumpy(T, 'blob', 23, 16, 60, .26, .3, .5);
    for (let i = 0; i < q.blobs; i++) {
      const m = new T.Mesh(i < 2 ? lumpy(T, 'rb1b', 7, 22, 300, .28, .16, .27) : gbl, i < 2 ? g.mRb1 : mBlob.clone());
      const d = nrm([Math.cos(i * 2.3) , Math.sin(i * 1.7) * .7, Math.sin(i * 2.3 + 1)]), c = add(RIBO, mul(d, 14 + (i % 3) * 7));
      m.position.set(c[0], c[1], c[2]); m.scale.setScalar(i < 2 ? 2.6 : 1.4 + (i % 3) * .5); m.rotation.set(i, i * 2, i * .5);
      if (i >= 2) { m.material.color.set(['#A688D8', '#D98FB5', '#7FA0E0', '#C98AD0', '#8C9BE0'][i % 5]); g.mats.push(m.material); }
      g.mundo.add(m); g.blobs.push(m);
    }
    // tRNAs soltos no citoplasma
    g.trW = inst(T, trevo(T), mT.clone(), 8, g.mundo); g.mats.push(g.trW.m.material); g.trSoltos = [];
    for (let i = 0; i < (q.cel ? 4 : 8); i++) { const d = nrm([Math.cos(i * 1.9 + .5), Math.sin(i * 1.3) * .8 + .2, Math.sin(i * 1.9 + .5)]); g.trSoltos.push({ c: add(RIBO, mul(d, 7 + (i % 4) * 4)), ax: nrm([r() - .5, r() - .5, r() - .5]), f: r() * TAU, cor: TRNA_COR[i % 4], aa: AA_COR[(i * 3) % NAA] }); }
    // partículas (bokeh): discos maiores e mais apagados quanto mais longe do foco
    const np = q.part, P = new Float32Array(np * 3), S = new Float32Array(np), A = new Float32Array(np), Cc = new Float32Array(np * 3);
    const cP = [[.75, .85, 1], [.9, .95, 1], [1, .85, .7], [.7, .8, 1]];
    for (let i = 0; i < np; i++) {
      const fora = i % 3 === 0, c = fora ? add(RIBO, [(r() - .5) * 70, (r() - .5) * 50, (r() - .5) * 60]) : add(NC, [(r() - .5) * 64, (r() - .5) * 56, (r() - .5) * 64]);
      P.set(c, i * 3); S[i] = .05 + .16 * r() * r(); A[i] = .25 + .75 * r(); Cc.set(cP[i % 4], i * 3);
    }
    const gp = new T.BufferGeometry(); gp.setAttribute('position', new T.BufferAttribute(P, 3)); gp.setAttribute('aS', new T.BufferAttribute(S, 1)); gp.setAttribute('aA', new T.BufferAttribute(A, 1)); gp.setAttribute('aC', new T.BufferAttribute(Cc, 3));
    g.partU = { uFoc: { value: 12 }, uPx: { value: 800 }, uT: { value: 0 }, uMov: { value: REDUZ ? 0 : 1 } };
    g.part = new T.Points(gp, new T.ShaderMaterial({
      uniforms: g.partU, transparent: true, depthWrite: false, blending: T.AdditiveBlending,
      vertexShader: `attribute float aS; attribute float aA; attribute vec3 aC; uniform float uFoc, uPx, uT, uMov; varying float vA; varying vec3 vC;
        void main(){ vec3 p = position + uMov * vec3(sin(uT*.11 + position.y*.3), cos(uT*.09 + position.x*.2), sin(uT*.1 + position.z*.25)) * .8;
          vec4 mv = modelViewMatrix * vec4(p, 1.0); float z = max(-mv.z, .1); float coc = clamp(abs(z - uFoc) / max(uFoc, 1.0), 0.0, 2.0);
          gl_PointSize = clamp(aS * uPx / z * (1.0 + coc * 6.0), 1.5, 72.0);
          vA = aA * clamp(1.8 / (1.0 + coc * 5.0), 0.05, 1.0) * smoothstep(0.8, 4.0, z); vC = aC; gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `varying float vA; varying vec3 vC; void main(){ vec2 q = gl_PointCoord * 2.0 - 1.0; float d = length(q); if (d > 1.0) discard;
          float disc = smoothstep(1.0, 0.8, d), ring = smoothstep(0.55, 0.93, d) * disc; gl_FragColor = vec4(vC * (disc * 0.45 + ring * 0.5) * vA * 0.55, 1.0); }`
    }));
    g.part.frustumCulled = false; g.mundo.add(g.part); g.geos.push(gp); g.mats.push(g.part.material);
  }

  // ---------- render: cena em HDR, profundidade de campo, brilho e acabamento ----------
  const VS = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }';
  const LZ = 'uniform float uN, uF; float lz(float d){ return uN * uF / (uF - d * (uF - uN)); }';
  const COC = 'uniform float uFoc, uMax; float coc(float z){ float dz = z - uFoc; float a = clamp((dz - uFoc * 0.55) / (uFoc * 1.3), 0.0, 1.0); float b = clamp((-dz - uFoc * 0.38) / (uFoc * 0.4), 0.0, 1.0); return max(a, b) * uMax; }';
  function montarPos(T, g) {
    const tipo = T.HalfFloatType, rt = (o = {}) => new T.WebGLRenderTarget(4, 4, Object.assign({ type: tipo, depthBuffer: false }, o));
    try {
      g.rtA = new T.WebGLRenderTarget(4, 4, { type: tipo, samples: g.q.msaa, depthBuffer: true, depthTexture: new T.DepthTexture(4, 4) });
      g.rtH = rt(); g.rtB = rt(); g.rtQ1 = rt(); g.rtQ2 = rt();
      [g.rtH, g.rtB, g.rtQ1, g.rtQ2].forEach(t => { t.texture.minFilter = t.texture.magFilter = T.LinearFilter; });
      const quad = (fs, u) => { const m = new T.ShaderMaterial({ uniforms: u, vertexShader: VS, fragmentShader: fs, depthTest: false, depthWrite: false }); g.mats.push(m); return m; };
      const U = { uN: { value: .1 }, uF: { value: 100 }, uFoc: { value: 12 }, uMax: { value: 10 } };
      g.pU = U;
      g.mPrep = quad(`${LZ} uniform sampler2D tC, tD; uniform vec2 uTx; varying vec2 vUv;
        // meia resolução: na borda de uma peça, guarda só o fundo (assim o desfoque do fundo não espalha a cor da peça em foco, sem halo)
        void main(){ vec2 o[4]; o[0] = vec2(-.5,-.5); o[1] = vec2(.5,-.5); o[2] = vec2(-.5,.5); o[3] = vec2(.5,.5);
          float z[4]; float zm = 0.0; for (int i = 0; i < 4; i++) { z[i] = lz(texture2D(tD, vUv + uTx * o[i]).r); zm = max(zm, z[i]); }
          vec3 c = vec3(0.0); float w = 0.0; for (int i = 0; i < 4; i++) { float k = step(zm * 0.92, z[i]); c += texture2D(tC, vUv + uTx * o[i]).rgb * k; w += k; }
          gl_FragColor = vec4(min(c / max(w, 1.0), vec3(40.0)), zm); }`, Object.assign({ tC: { value: null }, tD: { value: null }, uTx: { value: new T.Vector2() } }, U));
      g.mDof = quad(`${COC} uniform sampler2D tH; uniform vec2 uPx; uniform float uRs; varying vec2 vUv;
        void main(){ vec4 c0 = texture2D(tH, vUv); float cs = coc(c0.a); vec3 acc = c0.rgb; float tot = 1.0, r = uRs, ang = 0.0;
          for (int i = 0; i < 90; i++) { if (r > uMax) break;
            vec4 s = texture2D(tH, vUv + vec2(cos(ang), sin(ang)) * uPx * r); float ss = coc(s.a);
            if (s.a > c0.a) ss = clamp(ss, 0.0, cs * 2.0); else if (s.a < c0.a * 0.86) ss = 0.0;
            float m = smoothstep(r - 0.5, r + 0.5, ss); acc += mix(acc / tot, s.rgb, m); tot += 1.0; ang += 2.39996; r += uRs / r; }
          gl_FragColor = vec4(acc / tot, cs); }`, Object.assign({ tH: { value: null }, uPx: { value: new T.Vector2() }, uRs: { value: g.q.rs } }, U));
      g.mBri = quad(`uniform sampler2D tH; uniform vec2 uTx; varying vec2 vUv;
        void main(){ vec3 c = texture2D(tH, vUv + uTx * vec2(-.5,-.5)).rgb + texture2D(tH, vUv + uTx * vec2(.5,-.5)).rgb + texture2D(tH, vUv + uTx * vec2(-.5,.5)).rgb + texture2D(tH, vUv + uTx * vec2(.5,.5)).rgb;
          c *= 0.25; float l = max(c.r, max(c.g, c.b)); float k = smoothstep(2.6, 6.0, l); gl_FragColor = vec4(c * k, 1.0); }`, { tH: { value: null }, uTx: { value: new T.Vector2() } });
      g.mBlur = quad(`uniform sampler2D tH; uniform vec2 uDir; varying vec2 vUv;
        void main(){ vec3 c = texture2D(tH, vUv).rgb * 0.227; c += (texture2D(tH, vUv + uDir * 1.385).rgb + texture2D(tH, vUv - uDir * 1.385).rgb) * 0.316; c += (texture2D(tH, vUv + uDir * 3.231).rgb + texture2D(tH, vUv - uDir * 3.231).rgb) * 0.07; gl_FragColor = vec4(c, 1.0); }`, { tH: { value: null }, uDir: { value: new T.Vector2() } });
      g.mFin = quad(`${LZ} ${COC} uniform sampler2D tC, tD, tB, tG; uniform float uExp, uT, uAsp, uBl, uDof, uSh, uSS; uniform vec2 uTx, uOp; varying vec2 vUv;
        vec3 aces(vec3 x){ return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0); }
        void main(){ vec3 s = uSS > 0.5 ? (texture2D(tC, vUv + uOp * vec2(-.25,-.25)).rgb + texture2D(tC, vUv + uOp * vec2(.25,-.25)).rgb + texture2D(tC, vUv + uOp * vec2(-.25,.25)).rgb + texture2D(tC, vUv + uOp * vec2(.25,.25)).rgb) * 0.25 : texture2D(tC, vUv).rgb; float z = lz(texture2D(tD, vUv).r); float k = coc(z) / uMax; vec4 b = texture2D(tB, vUv);
          for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) { if (i == 0 && j == 0) continue; k = min(k, coc(lz(texture2D(tD, vUv + vec2(float(i), float(j)) * uTx).r)) / uMax); }
          float kb = min(k, b.a * 2.0 / uMax);
          vec3 c = mix(s, b.rgb, smoothstep(0.08, 0.5, kb) * uDof);
          c += texture2D(tG, vUv).rgb * uBl;
          vec2 q = (vUv - vec2(0.16, 0.95)) * vec2(uAsp, 1.0); c += vec3(0.22, 0.27, 0.36) * exp(-dot(q, q) * 1.7) * 0.32;
          c *= uExp; c = mix(vec3(dot(c, vec3(0.2126, 0.7152, 0.0722))), c, 1.16); c = aces(max(c, 0.0)); c += vec3(0.012, 0.02, 0.04) * (1.0 - c);
          vec2 vq = (vUv - 0.5) * vec2(uAsp, 1.0); c *= 1.0 - 0.36 * smoothstep(0.38, 1.05, length(vq));
          c = pow(c, vec3(1.0 / 2.2));
          c += (fract(sin(dot(gl_FragCoord.xy + uT, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;
          gl_FragColor = vec4(c, 1.0); }`, Object.assign({ tC: { value: null }, tD: { value: null }, tB: { value: null }, tG: { value: null }, uExp: { value: .82 }, uT: { value: 0 }, uAsp: { value: 1 }, uBl: { value: .07 }, uDof: { value: 1 }, uSh: { value: 0 }, uSS: { value: 0 }, uTx: { value: new T.Vector2() }, uOp: { value: new T.Vector2() } }, U));
      g.quad = new T.Mesh(new T.PlaneGeometry(2, 2), g.mPrep); g.quad.frustumCulled = false; g.qScene = new T.Scene(); g.qScene.add(g.quad); g.qCam = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      g.geos.push(g.quad.geometry); g.pos = true;
    } catch (e) { console.warn('[dna-rna] sem pós-processamento:', e.message); g.pos = false; }
  }
  const _sz = { w: 0, h: 0 };
  function render(v, dt) {
    const g = G; if (!g) return; const ren = v.ren, cam = v.cam;
    if (!g.pos) { ren.render(v.cena, cam); rotulos(g, g.passo, g.tp); return; }
    // qualidade adaptativa: se o quadro passar de cerca de 24 ms por 1,5 s, a resolução interna cai; se sobrar folga, sobe
    if (!QFIX) {
      g.ema = mix(g.ema, Math.min(dt, .1) * 1000, .05); g.idade = (g.idade || 0) + dt;
      // ignora os primeiros 3 s (carga e compilação); só reduz se ficar abaixo de cerca de 33 fps; volta a subir em telas de 60 Hz
      if (g.idade < 3) { g.lento = 0; g.rapido = 0; }
      else if (g.ema > 30) { g.lento += dt; g.rapido = 0; if (g.lento > 2) { g.esc = Math.max(.75, g.esc * .9); g.lento = 0; } }
      else if (g.ema < 20) { g.rapido += dt; g.lento = 0; if (g.rapido > 1.5 && g.esc < 1) { g.esc = Math.min(1, g.esc * 1.12); g.rapido = 0; } }
      else { g.lento = 0; g.rapido = 0; }
    }
    if (!g._dv) g._dv = new g.T.Vector2(); ren.getDrawingBufferSize(g._dv); const W = g._dv.x, H = g._dv.y;
    const dpr = Math.max(1, W / Math.max(1, v.w)), kMx = dpr < 1.5 ? 2 : 1, k = Math.max(Math.min(1, 1.25 / dpr), Math.min(kMx, Math.sqrt(g.q.maxPx / Math.max(1, W * H))) * g.esc), w = Math.max(64, Math.round(W * k)), h = Math.max(64, Math.round(H * k));
    if (w !== _sz.w || h !== _sz.h) {
      _sz.w = w; _sz.h = h; g.rtA.setSize(w, h); g.rtH.setSize(w >> 1, h >> 1); g.rtB.setSize(w >> 1, h >> 1); g.rtQ1.setSize(w >> 2, h >> 2); g.rtQ2.setSize(w >> 2, h >> 2);
    }
    const U = g.pU; U.uN.value = cam.near; U.uF.value = cam.far; U.uFoc.value = v.orb.d; U.uMax.value = g.q.maxR * (h / 1080 * 1.6 + .2);
    g.partU.uFoc.value = v.orb.d; g.partU.uPx.value = h / (2 * Math.tan(cam.fov * Math.PI / 360));
    const pass = (m, alvo) => { g.quad.material = m; ren.setRenderTarget(alvo); ren.render(g.qScene, g.qCam); };
    ren.setRenderTarget(g.rtA); ren.render(v.cena, cam);
    g.mPrep.uniforms.tC.value = g.rtA.texture; g.mPrep.uniforms.tD.value = g.rtA.depthTexture; g.mPrep.uniforms.uTx.value.set(1 / w, 1 / h); pass(g.mPrep, g.rtH);
    U.uMax.value *= .5; g.mDof.uniforms.tH.value = g.rtH.texture; g.mDof.uniforms.uPx.value.set(2 / w, 2 / h); pass(g.mDof, g.rtB); U.uMax.value *= 2;
    g.mBri.uniforms.tH.value = g.rtH.texture; g.mBri.uniforms.uTx.value.set(2 / w, 2 / h); pass(g.mBri, g.rtQ1);
    g.mBlur.uniforms.tH.value = g.rtQ1.texture; g.mBlur.uniforms.uDir.value.set(4 / w, 0); pass(g.mBlur, g.rtQ2);
    g.mBlur.uniforms.tH.value = g.rtQ2.texture; g.mBlur.uniforms.uDir.value.set(0, 4 / h); pass(g.mBlur, g.rtQ1);
    const F = g.mFin.uniforms; F.tC.value = g.rtA.texture; F.tD.value = g.rtA.depthTexture; F.tB.value = g.rtB.texture; F.tG.value = g.rtQ1.texture; F.uT.value = REDUZ ? 0 : (performance.now() % 1000); F.uAsp.value = w / h; F.uTx.value.set(2 / W, 2 / H); F.uOp.value.set(1 / W, 1 / H); F.uSS.value = w > W * 1.2 ? 1 : 0;
    pass(g.mFin, null);
    rotulos(g, g.passo, g.tp);
  }

  // ---------- rótulos com linha-guia (entram e saem com o movimento) ----------
  // a0/a1: janela de tempo no passo; dx/dy: para onde a pastilha vai; pr: prioridade (no celular só os 5 primeiros)
  const ROT = [
    { p: 0, t: 'Núcleo', pc: 'nucleo', a0: .5, a1: 3.1, dx: -1, dy: -.6, pr: 1 },
    { p: 0, t: 'DNA: duas fitas', pc: 'dna', a0: 3.3, dx: 1, dy: -1, pr: 1 },
    { p: 0, t: 'Desoxirribose', pc: 'desox', a0: 3.7, dx: -1, dy: -1, pr: 3 },
    { p: 0, t: 'Timina (T)', pc: 'bT', a0: 4.1, dx: 1, dy: -.6, pr: 2 },
    { p: 0, t: 'RNA: uma fita', pc: 'rna', a0: 5.5, dx: 1, dy: 1, pr: 1 },
    { p: 0, t: 'Ribose', pc: 'ribose', a0: 5.9, dx: -1, dy: 1, pr: 3 },
    { p: 0, t: 'Uracila (U)', pc: 'bU', a0: 6.3, dx: -1, dy: .8, pr: 2 },
    { p: 1, t: 'RNA polimerase', pc: 'pol', a0: 1.4, dx: 1, dy: -1, pr: 1 },
    { p: 1, t: 'Fita molde', pc: 'molde', a0: 2.5, dx: -1, dy: 1, pr: 1 },
    { p: 1, t: 'Fita codificadora', pc: 'cod', a0: 2.9, dx: -1, dy: -1, pr: 3 },
    { p: 1, t: 'Nucleotídeos de RNA', pc: 'nt', a0: 3.4, a1: 10.6, dx: 1, dy: .7, pr: 2 },
    { p: 1, t: 'mRNA', pc: 'mrna', a0: 4.8, dx: -1, dy: -.4, pr: 1 },
    { p: 2, t: 'mRNA', pc: 'mrna', a0: .9, dx: 1, dy: -1, pr: 1 },
    { p: 2, t: 'Núcleo', pc: 'nucleo', a0: 1.6, a1: 7.4, dx: -1, dy: 1, pr: 2 },
    { p: 2, t: 'Poro nuclear', pc: 'poro', a0: 3.6, dx: 1, dy: 1, pr: 1 },
    { p: 2, t: 'Citoplasma', pc: 'cito', a0: 8.2, dx: 1, dy: -1, pr: 2 },
    { p: 3, t: 'Ribossomo', pc: 'ribo1', a0: .9, dx: -1, dy: -1, pr: 1 },
    { p: 3, t: 'mRNA', pc: 'mrna', a0: 1.3, dx: 1, dy: .9, pr: 1 },
    { p: 3, t: 'RNA transportador', pc: 'trna', a0: 2.0, a1: 9.2, dx: -1, dy: -.4, pr: 2 },
    { p: 3, t: 'Códon', pc: 'codon', a0: 2.3, a1: 7.6, dx: 1, dy: 1.3, pr: 2 },
    { p: 3, t: 'Anticódon', pc: 'anti', a0: 2.6, a1: 7.6, dx: 1, dy: -.2, pr: 3 },
    { p: 3, t: 'Aminoácido', pc: 'aa', a0: 1.8, a1: 7.6, dx: 1, dy: -1, pr: 3 },
    { p: 3, t: 'Ligação peptídica', pc: 'pep', a0: 3.1, a1: 11.6, dx: -1, dy: -1, pr: 2 },
    { p: 3, t: 'Proteína', pc: 'prot', a0: 12.4, dx: 1, dy: -1, pr: 1 }
  ];
  function estilos() {
    if (document.getElementById('dc-css')) return;
    const st = document.createElement('style'); st.id = 'dc-css';
    st.textContent = `.dc-lb{position:absolute;inset:0;pointer-events:none;overflow:hidden}
.dc-sv{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.dc-sv line{stroke:rgba(232,237,247,.78);stroke-width:1.2}
.dc-sv circle{fill:rgba(10,16,30,.55);stroke:#fff;stroke-width:1.6}
.dc-p{position:absolute;left:0;top:0;pointer-events:auto;display:flex;align-items:center;gap:7px;padding:6px 11px;border-radius:999px;border:1px solid rgba(255,255,255,.16);background:rgba(10,16,30,.8);color:#E8EDF7;font:600 13px/1.15 var(--f-txt,system-ui);white-space:nowrap;cursor:pointer;opacity:0;will-change:transform,opacity;margin:0}
.dc-p::before{content:"";position:absolute;inset:-9px -4px}
.dc-p i{width:8px;height:8px;border-radius:50%;flex:none}
.dc-p:hover{border-color:rgba(255,255,255,.4)}
.dc-p.sel{border-color:#FFB347}
.dc-p:focus-visible{outline:2px solid var(--focus,#8FD8FF);outline-offset:2px}
@media(max-width:699px){.dc-p{font-size:12px;padding:5px 9px;gap:6px}}`;
    document.head.appendChild(st);
  }
  function montarRotulos(g) {
    estilos();
    const host = document.createElement('div'); host.className = 'dc-lb';
    const NS = 'http://www.w3.org/2000/svg', sv = document.createElementNS(NS, 'svg'); sv.setAttribute('class', 'dc-sv'); sv.setAttribute('aria-hidden', 'true'); host.appendChild(sv);
    g.rots = ROT.map((r, i) => {
      const ln = document.createElementNS(NS, 'line'), ci = document.createElementNS(NS, 'circle'); ci.setAttribute('r', 3.2); sv.appendChild(ln); sv.appendChild(ci);
      const b = document.createElement('button'); b.type = 'button'; b.className = 'dc-p'; b.innerHTML = `<i style="background:${PC[r.pc].cor}"></i>${r.t}`; b.setAttribute('aria-label', r.t + ': ver detalhe'); b.tabIndex = -1;
      b.addEventListener('click', () => { const v = g.v; v.selecionar({ custom: r.pc === 'aa' && g.aaA != null ? AAP[g.aaA] : PC[r.pc] }); });
      host.appendChild(b); return { r, ln, ci, b, w: 0, h: 0, on: false };
    });
    g.v.tela.insertBefore(host, g.v.info); g.rotHost = host;
  }
  function rotulos(g, passo, tp) {
    const v = g.v, W = v.w, H = v.h, cel = W < 700, max = cel ? 5 : 8, ocup = [], LBon = typeof LB === 'undefined' ? true : LB;
    const lado = cel ? 30 : 52, lst = g.rots.filter(o => o.r.p === passo).sort((a, b) => a.r.pr - b.r.pr);
    g.rots.forEach(o => { if (o.r.p !== passo && o.on) esconde(o); });
    let n = 0;
    for (const o of lst) {
      const r = o.r, pc = PC[r.pc];
      let k = REDUZ ? (tp >= r.a0 && tp < (r.a1 || 1e12) ? 1 : 0) : seg(tp, r.a0, r.a0 + .35) * (r.a1 ? 1 - seg(tp, r.a1 - .25, r.a1) : 1);
      if (!LBon || n >= max || (cel && r.pr > 2)) k = 0;
      const a = g.anc[r.pc]; if (!a || k <= .01) { if (o.on) esconde(o); continue; }
      g._w.set(a[0], a[1], a[2]).project(v.cam); const x = (g._w.x + 1) / 2 * W, y = (1 - g._w.y) / 2 * H;
      if (g._w.z > 1 || x < 6 || x > W - 6 || y < 6 || y > H - (cel ? 120 : 6)) { if (o.on) esconde(o); continue; }
      if (!o.w) { o.w = o.b.offsetWidth || 120; o.h = o.b.offsetHeight || 28; }
      let L = x + r.dx * lado, Tt = y + r.dy * lado * .75 - o.h / 2; if (r.dx < 0) L -= o.w;
      const fundoL = cel ? 120 : 104; L = cl(L, 8, W - o.w - 8); const topoL = L + o.w > W - 270 ? 84 : L < 160 ? 58 : 8; Tt = cl(Tt, topoL, H - o.h - fundoL);
      for (let t = 0; t < 6; t++) { const hit = ocup.find(q => L < q[0] + q[2] + 6 && L + o.w + 6 > q[0] && Tt < q[1] + q[3] + 4 && Tt + o.h + 4 > q[1]); if (!hit) break; Tt = r.dy < 0 ? hit[1] - o.h - 6 : hit[1] + hit[3] + 6; Tt = cl(Tt, topoL, H - o.h - fundoL); }
      ocup.push([L, Tt, o.w, o.h]); n++;
      const ax = x < L ? L : x > L + o.w ? L + o.w : x, ay = Tt + o.h / 2;
      const kl = REDUZ ? 1 : seg(tp, r.a0, r.a0 + .2) * (r.a1 ? 1 - seg(tp, r.a1 - .25, r.a1) : 1), kp = REDUZ ? k : seg(tp, r.a0 + .1, r.a0 + .38) * (r.a1 ? 1 - seg(tp, r.a1 - .22, r.a1) : 1);
      o.ln.setAttribute('x1', x.toFixed(1)); o.ln.setAttribute('y1', y.toFixed(1)); o.ln.setAttribute('x2', mix(x, ax, kl).toFixed(1)); o.ln.setAttribute('y2', mix(y, ay, kl).toFixed(1));
      o.ln.style.opacity = kl; o.ci.setAttribute('cx', x.toFixed(1)); o.ci.setAttribute('cy', y.toFixed(1)); o.ci.style.opacity = kl;
      o.b.style.transform = `translate3d(${L.toFixed(1)}px,${(Tt + (1 - kp) * 6 * Math.sign(r.dy || 1)).toFixed(1)}px,0)`; o.b.style.opacity = kp.toFixed(2);
      o.b.style.pointerEvents = kp > .5 ? 'auto' : 'none'; o.b.tabIndex = kp > .5 ? 0 : -1;
      o.b.classList.toggle('sel', !!(v.sel && v.sel.custom && v.sel.custom.id === pc.id)); o.on = true;
    }
  }
  function esconde(o) { o.on = false; o.b.style.opacity = 0; o.b.style.pointerEvents = 'none'; o.b.tabIndex = -1; o.ln.style.opacity = 0; o.ci.style.opacity = 0; }

  // ---------- câmera: quadros-chave por passo (alvo no mundo, ângulos do visor) ----------
  function kf(tp, K) {
    if (tp <= K[0].t) return K[0]; const l = K[K.length - 1]; if (tp >= l.t) return l;
    let i = 0; while (K[i + 1].t < tp) i++; const a = K[i], b = K[i + 1], u = EZ.move((tp - a.t) / (b.t - a.t));
    return { th: mix(a.th, b.th, u), fi: mix(a.fi, b.fi, u), d: mix(a.d, b.d, u), al: lerp3(a.al, b.al, u) };
  }
  const wD = p => { G._w.set(p[0], p[1], p[2]).applyMatrix4(G.DW); return [G._w.x, G._w.y, G._w.z]; };
  const wR = p => { G._w.set(p[0], p[1], p[2]).applyMatrix4(G.RW); return [G._w.x, G._w.y, G._w.z]; };
  const lD = p => { G._w.set(p[0], p[1], p[2]).applyMatrix4(G.DWi); return [G._w.x, G._w.y, G._w.z]; };

  // ---------- estado da transcrição (passo 2) e da saída (passo 3) ----------
  const pPol = tp => 14 + 4 * cl(tp - 2, 0, 9);                   // posição da polimerase (par de bases)
  const tDock = k => 2 + k / 4;                                    // quando o nucleotídeo k se encaixa
  function bolha(i, p, oS) { if (oS <= 0) return 0; const a = sst(p - 15, p - 11, i) * (1 - sst(p, p + 2, i)); return a * oS; }
  function helice(o) {   // o(i): abertura de 0 a 1. Devolve as posições das duas fitas (coordenadas da hélice)
    const B0 = [], B1 = [];
    for (let i = 0; i < NBP; i++) {
      const th = i * TW, x = xOf(i), e = o ? o(i) : 0;
      const h1 = [x, R * Math.cos(th), R * Math.sin(th)], h0 = [x, R * Math.cos(th + DEL), R * Math.sin(th + DEL)];
      B1.push(e > 0 ? lerp3(h1, [x, 3.0, .3], e) : h1); B0.push(e > 0 ? lerp3(h0, [x, -1.5, -.1], e) : h0);
    }
    return { B0, B1 };
  }
  const pontaFita = (B, i0, i1) => { const d = sub(B[i1], B[i0]); return add(B[i1], d); };

  // ---------- quadro: anima tudo conforme o passo e o tempo ----------
  function animar(M, P) {
    const g = G; if (!g) return;
    const passo = P.passo, tp = TPFIX != null ? TPFIX : Math.min(P.tp, 60), t = REDUZ ? 0 : P.t, sel = g.v.sel && g.v.sel.custom;
    g.anc = {}; g.tp = tp; g.passo = passo;
    const brilho = id => (sel && sel.id === id ? 1.55 : 1);
    // ----- hélice -----
    let oS = 0, p = 14, saida = 0;
    if (passo === 1) { oS = EZ.out(seg(tp, 1.2, 2)); p = pPol(tp); saida = p - 11 + 11 * EZ.move(seg(tp, 11, 12.4)); }
    else if (passo === 2) { oS = 1 - EZ.move(seg(tp, .2, 1.8)); p = 50; saida = 50; }
    const { B0, B1 } = helice(oS > 0 ? i => bolha(i, p, oS) : null);
    const ext = B => [pontaFita(B, 1, 0), ...B, pontaFita(B, NBP - 2, NBP - 1)];
    g.tM.set(denso(ext(B0), DSQ), conta(.17, DSQ, .12)); g.tC.set(denso(ext(B1), DSQ), conta(.17, DSQ, .12));
    const Wb = g.barD, Wa = g.acD, Wo = g.bolD, ax = [1, 0, 0], q0 = g.qI;
    const pulsoT = passo === 0 ? (REDUZ ? .35 : .35 * sst(7.6, 8.4, tp) * (1 - sst(10.6, 11.4, tp)) * (.6 + .4 * Math.sin(P.t * 5))) : 0;
    const pulsoA = passo === 0 ? (REDUZ ? 0 : .3 * sst(10.4, 11, tp) * (1 - sst(12.4, 13, tp)) * (.6 + .4 * Math.sin(P.t * 5))) : 0;
    let ancT = null, ancD = null, best = -9, bestD = -9;
    for (let i = 0; i < NBP; i++) {
      const a = B1[i], b = B0[i], d = sub(b, a), dl = len(d), u = mul(d, 1 / dl), L = Math.min(.9, dl / 2 - .12);
      const c1 = TOP[i], c0 = BOT[i];
      put(Wb, add(a, mul(u, .1 + L / 2)), qx(u, ax), L, 1, 1, BCOR[c1], brilho('b' + c1) + (c1 === 'T' ? pulsoT : 0), PC['b' + c1], LET.indexOf(c1));
      put(Wb, sub(b, mul(u, .1 + L / 2)), qx(mul(u, -1), ax), L, 1, 1, BCOR[c0], brilho('b' + c0) + (c0 === 'T' ? pulsoT : 0), PC['b' + c0], LET.indexOf(c0));
      put(Wa, a, qy(mul(u, -1)), .2, .1, .2, COR.desox, brilho('desox') + pulsoA, PC.desox); put(Wa, b, qy(u), .2, .1, .2, COR.desox, brilho('desox') + pulsoA, PC.desox);
      // âncoras do passo 1: uma timina e uma desoxirribose de frente para a câmera, perto do meio
      if (passo === 0 && i >= I0 + 9 && i <= I0 + 19) { const f = a[2] - Math.abs(i - I0 - 14) * .05; if (c1 === 'T' && f > best) { best = f; ancT = add(a, mul(u, .5)); } if (f > bestD && i < I0 + 13) { bestD = f; ancD = a; } }
    }
    // ----- RNA no núcleo -----
    const ptsR = [], rnaVis = passo <= 2;
    const ntAt = [];      // posição e direção de cada nucleotídeo do mRNA (coordenadas da hélice)
    if (passo === 0) {
      const e = REDUZ ? 1 : EZ.out(seg(tp, 4.2, 5.8)), off = mul([0, -3.5, 8], 1 - e), ph = t * .7;
      if (e > 0) for (let k = 0; k < 18; k++) {
        const x = xOf(I0 + 4 + k), y = -3.5 + .32 * Math.sin(k * .55 + ph), z = 1.5 + .35 * Math.cos(k * .42 + ph * .8), f = .55 * Math.sin(k * .5 + ph * .6);
        ntAt[k] = { p: add([x, y, z], off), d: nrm([0, Math.cos(f), -Math.sin(f) * .6]), s: 1 };
      }
    } else if (passo === 1) {
      for (let k = 0; k < NR; k++) {
        const i = I0 + k, td = tDock(k);
        if (tp >= td) {
          if (i >= saida) { const b = B0[i], u = nrm(sub(B1[i], b)); ntAt[k] = { p: add(b, mul(u, PARW)), d: mul(u, -1), s: 1 }; }
          else { const E0 = [xOf(saida), -1.5 + PARW - .04, -.1], a = saida - i, pp = add(E0, trilha(a)), tg = trilhaDir(a); ntAt[k] = { p: pp, d: nrm(sub([0, -1, .3], mul(tg, dot([0, -1, .3], tg)))), s: 1 }; }
        } else if (tp > td - 3.2) {
          // nucleotídeo livre: flutua na frente da polimerase e voa até o encaixe
          const r = rng(k * 7 + 3), off = nrm([(r() - .5) * 1.4, (r() - .1) * 1.2, .9 + r() * .6]), dist = 3.4 + 1.6 * r();
          const b = B0[i], u = nrm(sub(B1[i], b)), alvo = add(b, mul(u, PARW)), wob = [Math.sin(t * 1.3 + k) * .35, Math.cos(t * 1.1 + k * 2) * .3, Math.sin(t * .9 + k * 3) * .3];
          const ini = add(add(alvo, mul(off, dist)), wob), f = seg(tp, td - .55, td), e = outBack(f);
          const dIni = nrm([r() - .5, r() - .5, r() - .5]);
          ntAt[k] = { p: lerp3(ini, alvo, f > 0 ? e : 0), d: nrm(lerp3(dIni, mul(u, -1), EZ.out(f))), s: Math.min(1, seg(tp, td - 3.2, td - 2.6)), livre: 1, fosf: 1 - seg(tp, td - .1, td + .2) };
        }
      }
    } else if (passo === 2) {
      const trav = (g.splL / NTS) * .86 * EZ.move(seg(tp, .8, 10));
      for (let k = 0; k < NR; k++) { const a = NR - k + trav, pp = caminho(a), tg = nrm(sub(caminho(a + .3), caminho(a - .3))); ntAt[k] = { p: pp, d: nrm(sub([0, -1, .3], mul(tg, dot([0, -1, .3], tg)))), s: 1 }; }
      g.cabeca = ntAt[0].p;
    }
    for (let k = 0; k < NR; k++) {
      const n = ntAt[k]; if (!n || n.s <= .01) continue; const c = MRNA[k], s = n.s;
      if (!n.livre) ptsR.push(n.p);
      put(Wb, add(n.p, mul(n.d, .1 + .45 * s)), qx(n.d, ax), .9 * s, s, s, BCOR[c], brilho('b' + c) + (c === 'U' ? pulsoT : 0), n.livre ? PC.nt : PC['b' + c], LET.indexOf(c));
      const side = nrm(cross(n.d, ax));
      put(Wa, n.p, qy(mul(n.d, -1)), .22 * s, .12 * s, .22 * s, COR.ribose, brilho('ribose') + pulsoA, n.livre ? PC.nt : PC.ribose);
      put(Wo, add(n.p, add(mul(side, .27), mul(n.d, -.05))), q0, .095 * s, .095 * s, .095 * s, COR.oh, brilho('ribose') + pulsoA * 2, n.livre ? PC.nt : PC.ribose);
      if (n.livre && n.fosf > .01) { const fs = n.fosf * s; for (let j = 0; j < 3; j++) put(Wo, add(n.p, add(mul(side, -.3 - j * .26), mul(n.d, -.12))), q0, .12 * fs, .12 * fs, .12 * fs, COR.fosf, 1, PC.nt); }
    }
    // nucleotídeos livres que só passeiam perto da polimerase (um deles leva o rótulo)
    let ancNt = null;
    if (passo === 1) {
      const vis = seg(tp, .6, 1.6) * (1 - seg(tp, 10.4, 11.2));
      for (let j = 0; j < 5 && vis > .01; j++) {
        const r = rng(900 + j), c = 'AUGC'[j % 4], s = vis;
        const pp = [xOf(p + 1 + j * 1.6 - 3) + Math.sin(t * .7 + j) * .5, 2.2 + (r() - .5) * 3 + Math.cos(t * .6 + j) * .4, 3.6 + r() * 2 + Math.sin(t * .5 + j * 2) * .4];
        const d = nrm([Math.sin(t * .4 + j), Math.cos(t * .3 + j * 3), .3]), side = nrm(cross(d, ax));
        put(Wb, add(pp, mul(d, .55 * s)), qx(d, ax), .9 * s, s, s, BCOR[c], 1, PC.nt, LET.indexOf(c));
        put(Wa, pp, qy(mul(d, -1)), .22 * s, .12 * s, .22 * s, COR.ribose, 1, PC.nt);
        put(Wo, add(pp, mul(side, .27)), q0, .095 * s, .095 * s, .095 * s, COR.oh, 1, PC.nt);
        for (let q = 0; q < 3; q++) put(Wo, add(pp, mul(side, -.3 - q * .26)), q0, .12 * s, .12 * s, .12 * s, COR.fosf, 1, PC.nt);
        if (j === 1) ancNt = add(pp, mul(d, .6));
      }
    }
    fim(Wb); fim(Wa); fim(Wo);
    if (rnaVis && ptsR.length > 1) g.tR.set(denso(ptsR, DSQ), conta(.15, DSQ, .1)); else g.tR.mesh.visible = false;
    // ----- polimerase -----
    g.pol.visible = passo === 1 || (passo === 2 && tp < 3.2);
    if (g.pol.visible) {
      let pos = [xOf(p + 4.5), .55, -.35], s = 1;
      if (passo === 1) { const e = EZ.out(seg(tp, 0, 1.4)); pos = add(pos, mul([3, 6, 7], 1 - e)); s = mix(.7, 1, e); }
      else { const e = EZ.in(seg(tp, .4, 3)); pos = add(pos, mul([4, 7, -9], e)); }
      const br = REDUZ ? 1 : 1 + .018 * Math.sin(t * 2.1);
      g.pol.position.set(pos[0], pos[1], pos[2]); g.pol.scale.set(2.45 * s * br, 2.2 * s / br, 2.1 * s * br); g.pol.rotation.set(.3, t * .05 + .4, .1);
      g.anc.pol = wD(add(pos, [.4, 1.1, 1.9]));
    }
    // ----- tradução -----
    traducao(g, passo === 3 ? tp : 0, t, brilho, passo);
    // ----- mundo: moléculas, tRNAs soltos, partículas -----
    mundo(g, t);
    g.nucM.uniforms.uSel.value = sel && sel.id === 'nucleo' ? 1 : 0;
    // destaque das peças inteiras
    g.mPol.emissive.set(sel && sel.id === 'pol' ? '#5A2A14' : '#000000'); g.mRb1.emissive.set(sel && (sel.id === 'ribo1' || sel.id === 'ribo2') ? '#4A3014' : '#000000'); g.mRb2.emissive.copy(g.mRb1.emissive);
    g.mF.emissive.set(sel && (sel.id === 'molde' || sel.id === 'cod' || sel.id === 'dna') ? '#1C2E5A' : '#000000'); g.mR.emissive.set(sel && (sel.id === 'mrna' || sel.id === 'rna') ? '#5A1C10' : '#000000');
    // ----- âncoras dos rótulos e centros das peças (mundo) -----
    const A = g.anc, mid = Math.floor(NR / 2);
    if (passo === 0) {
      A.nucleo = add(NC, mul(nrm([-.62, .5, .6]), RN)); A.cod = A.dna = wD(B1[I0 + 17]); if (ancD) A.desox = wD(ancD); if (ancT) A.bT = wD(ancT);
      if (ntAt[14]) { A.mrna = A.rna = wD(ntAt[14].p); A.ribose = wD(ntAt[9].p); const ku = 7; A.bU = wD(add(ntAt[ku].p, mul(ntAt[ku].d, .55))); }
    } else if (passo === 1) {
      const ib = Math.round(p) - 7; A.molde = wD(B0[ib]); A.cod = wD(B1[Math.round(p) - 5]); if (ancNt) A.nt = wD(ancNt);
      const km = Math.max(0, Math.min(NR - 1, Math.floor(saida - I0) - 3)); if (ntAt[km]) A.mrna = wD(ntAt[km].p);
    } else if (passo === 2) {
      A.mrna = wD(ntAt[2].p); A.nucleo = add(NC, mul(nrm([-.2, .85, .5]), RN)); A.poro = add(PORO, mul(nrm(cross(PDIR, [0, 0, 1])), 2.2)); A.cito = add(PORO, add(mul(PDIR, 9), [-3, 4, 2]));
    }
    // centros para "Aproximar"
    const C = (id, p, r) => { if (p) { PC[id].c = p; PC[id].r = r; } };
    C('nucleo', NC, RN * .7); C('poro', PORO, 4); C('cito', add(PORO, mul(PDIR, 9)), 8); C('pol', g.anc.pol, 4);
    C('molde', A.molde || wD(B0[I0 + 20]), 5); C('cod', A.cod || wD(B1[I0 + 20]), 5); C('desox', A.desox || wD(B1[I0 + 20]), 2.5); C('bT', A.bT || wD(B1[I0 + 20]), 2.5);
    ['bA', 'bG', 'bC'].forEach(id => C(id, wD(B1[I0 + 18]), 3)); C('bU', A.bU || g.anc.codon, 2.5); C('ribose', A.ribose || A.mrna, 2.5); C('nt', A.nt, 3); C('mrna', A.mrna, 5); C('dna', A.dna || wD(B1[I0 + 20]), 6); C('rna', A.rna || A.mrna, 5);
    // câmera
    M.cam = camera(g, passo, tp, p, saida);
    if (CAMFIX) Object.assign(M.cam, CAMFIX);
    g.mid = mid;
  }

  // caminho do mRNA no passo 3: a trilha deixada na transcrição e depois a curva até o poro e para fora (coordenadas da hélice)
  function caminho(a) {
    const g = G; if (a <= NR) return add([xOf(50), -1.5 + PARW - .04, -.1], trilha(a));
    const u = (a - NR) * NTS / g.splL; if (u <= 1) { g.spl.getPointAt(u, g._v1); return [g._v1.x, g._v1.y, g._v1.z]; }
    g.spl.getPointAt(1, g._v1); g.spl.getTangentAt(1, g._v2); const x = (u - 1) * g.splL; return [g._v1.x + g._v2.x * x, g._v1.y + g._v2.y * x, g._v1.z + g._v2.z * x];
  }
  function montarCaminho(g) {
    const T = g.T, A0 = add([xOf(50), -1.5 + PARW - .04, -.1], trilha(NR)), dA = trilhaDir(NR);
    const pl = lD(PORO), pd = nrm(sub(lD(add(PORO, PDIR)), pl)), rb = lD(RIBO);
    const P = [A0, add(A0, mul(dA, 2.2)), add(add(pl, mul(pd, -6)), [-1.5, 1, 1]), add(pl, mul(pd, -1.6)), add(pl, mul(pd, 1.8)), add(add(pl, mul(pd, 6.5)), mul(nrm(sub(rb, pl)), 1.5)), lerp3(add(pl, mul(pd, 9)), rb, .45)];
    g.spl = new T.CatmullRomCurve3(P.map(p => new T.Vector3(p[0], p[1], p[2])), false, 'centripetal'); g.splL = g.spl.getLength();
  }

  // ---------- tradução (passo 4); com tp = 0 mostra o ribossomo pronto, à espera ----------
  const CS = [], CD = [];
  { let t0 = 1.2; for (let c = 0; c < NCIC; c++) { const d = c < 3 ? 2.15 : .62; CS.push(t0); CD.push(d); t0 += d; } }
  const FIMC = CS[NCIC - 1] + CD[NCIC - 1];
  function ciclo(tp) { if (tp < CS[0]) return { c: -1, u: 1 }; if (tp >= FIMC) return { c: NCIC - 1, u: 1 }; let c = 0; while (c < NCIC - 1 && tp >= CS[c + 1]) c++; return { c, u: (tp - CS[c]) / CD[c] }; }
  const forma = (j, ph) => nrm([-.55 - .05 * j, .85 - .04 * j, .35 + .25 * Math.sin(j * .9 + ph)]);
  function cadeia(n, ph) { const o = [[0, 0, 0]]; for (let j = 1; j < n; j++) { const z = j % 2 ? .22 : -.22; o.push(add(add(o[j - 1], mul(forma(j, ph), .64)), [z * .5, 0, z * .3])); } return o; }
  function dobrada(j) { if (j < 2) return null; const k = j - 2, a = k * 1.75, c = [-2.3, 2.2, 1.2]; return add(c, [Math.cos(a) * .95 - k * .12, k * .3 - .6, Math.sin(a) * .95]); }
  function traducao(g, tp, t, brilho, passo) {
    const Wb = g.barR, Wa = g.acR, Wo = g.bolR, Ws = g.stR, Wt = g.trn, ax = [1, 0, 0], q0 = g.qI, up = [0, 1, 0];
    const { c, u } = ciclo(tp), cc = Math.max(0, c);
    const tr = c < 0 ? 0 : EZ.move(seg(u, .72, 1));
    const cP = c < 0 ? 0 : c + tr;                       // códon no sítio P (contínuo durante a translocação)
    const xNt = k => (k - (3 * cP + 1)) * NTS + XP;
    // mRNA atravessando o ribossomo
    const pts = []; let primeiro = -1;
    for (let k = 0; k < NR; k++) { const x = xNt(k); if (x < -11 || x > 11) continue; if (primeiro < 0) primeiro = k; pts.push([x, 0, TZ]); }
    const pts2 = pts.length ? [add(pts[0], [-NTS * 2, -.3, 0]), ...pts, add(pts[pts.length - 1], [NTS * 2, -.2, -.3])] : pts;
    g.tR2.set(denso(pts2, DSQ), conta(.15, DSQ, .1));
    // brilho de encaixe: códon e anticódon no sítio A quando o tRNA chega
    const enc = m => (passo === 3 && c === m - 1 && !REDUZ ? Math.sin(Math.PI * seg(u, .4, .6)) * .9 : 0);
    for (let k = 0; k < NR; k++) {
      const x = xNt(k); if (x < -11 || x > 11) continue; const cc2 = MRNA[k], m = Math.floor(k / 3);
      const pp = [x, 0, TZ];
      put(Wb, add(pp, [0, .12 + .31, 0]), qx(up, [0, 0, 1]), .62, .86, .86, BCOR[cc2], brilho('b' + cc2) + enc(m) + (sel3(g, 'codon') && m === cc + 1 ? .5 : 0), PC.codon, LET.indexOf(cc2));
      put(Wa, pp, q0, .2, .11, .2, COR.ribose, brilho('ribose'), PC.ribose); put(Wo, add(pp, [0, -.08, .26]), q0, .085, .085, .085, COR.oh, 1, PC.ribose);
    }
    // tRNAs: chegam ao sítio A, passam ao P e ao E, e saem
    g.aaA = null; let ancT = null, ancAc = null, ancAa = null;
    const tPos = [];
    for (let m = 0; m < NAA; m++) {
      let pos = null, s = 1, rot = 0;
      const bound = [xNt(3 * m + 1), TY, TZ + (m === cc + 1 ? .18 : 0)];
      if (m === 0) { if (c <= 0 || (c === 1 && u < .72)) pos = bound; else if (c === 1) { const e = EZ.in(seg(u, .72, 1)); pos = add(bound, mul([-5, 6, 3], e)); s = 1 - e; } }
      else {
        const chega = m - 1, sai = m + 1;
        if (c < chega) pos = null;
        else if (c === chega && u < .42) { const f = u / .42, r = rng(m * 13), ini = [4.5 + r() * 2, 5.5 + r() * 2, 6 + r() * 3]; pos = lerp3(add(bound, ini), bound, outBack(f)); rot = (1 - EZ.out(f)) * (r() - .5) * 2.4; s = Math.min(1, f * 3); }
        else if (c < sai || (c === sai && u < .72)) pos = bound;
        else if (c === sai) { const e = EZ.in(seg(u, .72, 1)); pos = add(bound, mul([-5, 6, 3], e)); s = 1 - e; }
      }
      if (!pos || s < .01) { tPos[m] = null; continue; }
      tPos[m] = { pos, s };
      g._q.setFromAxisAngle(g._v1.set(0, 0, 1), rot);
      put(Wt, pos, g._q, s, s, s, TRNA_COR[m % 4], brilho('trna') + enc(m) * .3, PC.trna);
      // anticódon pendurado na alça de baixo
      const anti = MRNA.substr(3 * m, 3).split('').map(b => RPAR[b]);
      for (let j = 0; j < 3; j++) {
        const xo = (j - 1) * NTS, b = anti[j], pb = add(pos, [xo * s * Math.cos(rot), (-1.22 - .31) * s, 0]);
        put(Wb, pb, qx([0, -1, 0], [0, 0, 1]), .62 * s, .86 * s, .86 * s, BCOR[b], brilho('anti') + enc(m) + (sel3(g, 'anti') ? .4 : 0), PC.anti, LET.indexOf(b));
      }
      if (m === cc + 1) { ancAc = add(pos, [NTS * 1.2, -1.45, .2]); }
      if (m === cc) { ancT = add(pos, [-.92, .4, .1]); }
    }
    // cadeia de aminoácidos
    let head = c < 0 ? 0 : c, w = 0; if (c >= 0) { const tw = seg(u, .52, .72); w = EZ.move(tw); if (u >= .72) { head = c + 1; w = 0; } }
    const ph = REDUZ ? 0 : t * .4, fold = passo === 3 ? EZ.move(seg(tp, FIMC - .2, FIMC + 2.2)) : 0;
    const topo = m => (tPos[m] ? add(tPos[m].pos, [.1, 1.98 * tPos[m].s, 0]) : null);
    const posAA = [];
    const lay = (anc, n) => cadeia(n, ph).map((o, j) => { let p = add(anc, o); const f = dobrada(j); if (f && fold > 0) p = lerp3(p, add(anc, f), fold); return p; });
    const ancH = topo(head);
    if (ancH) {
      const L = lay(ancH, head + 1); for (let m = 0; m <= head; m++) posAA[m] = L[head - m];
      if (w > 0 && topo(head + 1)) { const L2 = lay(topo(head + 1), head + 2); for (let m = 0; m <= head; m++) posAA[m] = lerp3(posAA[m], L2[head + 1 - m], w); }
    }
    for (let m = head + 1; m < NAA; m++) { const tt = topo(m); if (tt) posAA[m] = tt; }
    for (let m = 0; m < NAA; m++) {
      const p = posAA[m]; if (!p) continue; const s = m > head && tPos[m] ? tPos[m].s : 1;
      put(Wo, p, q0, .34 * s, .34 * s, .34 * s, AA_COR[m], (sel3(g, 'aa' + m) || sel3(g, 'prot') ? 1.5 : 1), AAP[m]);
      if (m > 0 && m <= head && posAA[m - 1]) { const a = posAA[m], b = posAA[m - 1], d = sub(b, a); put(Ws, lerp3(a, b, .5), qx(d), len(d) - .5, .08, .08, COR.pep, sel3(g, 'pep') ? 1.6 : 1, PC.pep); }
      if (m === head + 1 && passo === 3 && c >= 0 && u < .72) { ancAa = p; g.aaA = m; }
    }
    if (w > 0 && posAA[head] && posAA[head + 1]) { const a = posAA[head + 1], b = posAA[head], d = sub(b, a); put(Ws, lerp3(a, b, .5), qx(d), Math.max(.01, (len(d) - .5) * w), .08, .08, COR.pep, 1.8, PC.pep); }
    fim(Wb); fim(Wa); fim(Wo); fim(Ws); fim(Wt);
    // âncoras (mundo)
    const A = g.anc;
    if (passo === 3) {
      A.ribo1 = wR([-2.4, 3.9, .9]); A.mrna = wR([xNt(Math.min(NR - 1, 3 * cc + 9)), -.05, TZ + .1]); if (ancT) A.trna = wR(ancT);
      A.codon = wR([xNt(3 * (cc + 1) + 1) + .2, .55, TZ + .3]); if (ancAc) A.anti = wR(ancAc); if (ancAa) A.aa = wR(ancAa);
      if (head >= 1 && posAA[head] && posAA[head - 1]) A.pep = wR(lerp3(posAA[head], posAA[head - 1], .5));
      if (fold > .3 && posAA[Math.max(0, head - 5)]) A.prot = wR(posAA[Math.max(0, head - 6)]);
    }
    const C = (id, p, r) => { if (p) { PC[id].c = p; PC[id].r = r; } };
    C('ribo1', wR([0, 1, 0]), 6); C('ribo2', wR([0, -1, 0]), 6); C('codon', A.codon || wR([XP + CW, .5, TZ]), 2.5); C('anti', A.anti || wR([XP + CW, 1.2, TZ]), 2.5); C('trna', A.trna || wR([XP, TY, TZ]), 3.5);
    C('pep', A.pep || wR([XP, 5, TZ]), 3); C('prot', wR([-1.7, 6.5, 1]), 5.5); AAP.forEach((a, m) => { if (posAA[m]) { a.c = wR(posAA[m]); a.r = 2; } });
    if (passo === 3) { A.mrnaLocal = null; PC.mrna.c = A.mrna; PC.mrna.r = 5; }
  }
  const sel3 = (g, id) => !!(g.v.sel && g.v.sel.custom && g.v.sel.custom.id === id);

  function mundo(g, t) {
    const Wb = g.bolW, Ws = g.stW, q0 = g.qI;
    for (const m of g.mol) {
      g._q.setFromAxisAngle(g._v1.set(m.ax[0], m.ax[1], m.ax[2]), m.fase + t * m.w);
      const c = add(m.c, REDUZ ? [0, 0, 0] : [Math.sin(t * .2 + m.fase) * .6, Math.cos(t * .17 + m.fase) * .5, 0]);
      put(Wb, c, q0, .36 * m.s, .36 * m.s, .36 * m.s, m.cor, 1, null);
      m.sat.forEach((d, i) => { g._v2.set(d[0], d[1], d[2]).applyQuaternion(g._q); const dd = [g._v2.x, g._v2.y, g._v2.z], p = add(c, mul(dd, .75 * m.s)); put(Wb, p, q0, .2 * m.s, .2 * m.s, .2 * m.s, m.sc[i % 4], 1, null); put(Ws, add(c, mul(dd, .38 * m.s)), qx(dd), .5 * m.s, .07 * m.s, .07 * m.s, '#C8D2E8', 1, null); });
    }
    const Wt = g.trW;
    g.trSoltos.forEach((s, i) => {
      g._q.setFromAxisAngle(g._v1.set(s.ax[0], s.ax[1], s.ax[2]), s.f + t * .12); const c = add(s.c, REDUZ ? [0, 0, 0] : [Math.sin(t * .23 + i) * .8, Math.cos(t * .19 + i) * .6, Math.sin(t * .15 + i * 2) * .5]);
      put(Wt, c, g._q, 1, 1, 1, s.cor, 1, null);
      g._v2.set(.1, 1.98, 0).applyQuaternion(g._q); put(Wb, add(c, [g._v2.x, g._v2.y, g._v2.z]), q0, .34, .34, .34, s.aa, 1, null);
    });
    fim(Wb); fim(Ws); fim(Wt);
    g.partU.uT.value = t;
  }

  // ---------- coreografia da câmera ----------
  function camera(g, passo, tp, p, saida) {
    let k;
    if (passo === 0) {
      const alvo = wD([xOf(I0 + 13), -1.7, .6]);
      k = kf(tp, [{ t: 0, th: -.5, fi: .2, d: 17, al: alvo }, { t: 3.6, th: -.22, fi: .1, d: 12, al: alvo }, { t: 13, th: .3, fi: .15, d: 11.5, al: alvo }]);
    } else if (passo === 1) {
      const al = wD([xOf(p - 1.5), .5, .4]), al2 = wD([xOf(p - 5), 2.2, 1.6]);
      k = kf(tp, [{ t: 0, th: -.5, fi: .2, d: 18, al: wD([xOf(16), .5, .4]) }, { t: 2.2, th: -.34, fi: .12, d: 10.5, al }, { t: 9.5, th: .16, fi: .1, d: 11.5, al }, { t: 13, th: .3, fi: .22, d: 19, al: al2 }]);
      if (tp > 2.2 && tp < 9.5) k.al = al; else if (tp >= 9.5) k.al = lerp3(al, al2, EZ.move(seg(tp, 9.5, 13)));
    } else if (passo === 2) {
      const h = g.cabeca ? wD(g.cabeca) : PORO, mid = wD(trilha(18)), lado = Math.atan2(-.75, .66);
      k = kf(tp, [{ t: 0, th: .3, fi: .22, d: 19, al: wD([xOf(45), 2, 1.6]) }, { t: 3, th: -.2, fi: .14, d: 15, al: h }, { t: 6.4, th: lado + .1, fi: .08, d: 15, al: h },
        { t: 8.6, th: lado + .3, fi: .14, d: 17, al: h }, { t: 11.5, th: -.3, fi: .2, d: 32, al: lerp3(add(PORO, mul(PDIR, 6)), RIBO, .45) }]);
      if (tp > .3 && tp < 9.5) k.al = lerp3(k.al, h, sst(.3, 2.2, tp) * (1 - sst(8.6, 9.5, tp)));
      void mid;
    } else {
      k = kf(tp, [{ t: 0, th: -.6, fi: .26, d: 30, al: wR([0, 1.2, 1]) }, { t: 2.7, th: -.24, fi: .1, d: 14.5, al: wR([-.3, 1.4, 1.4]) }, { t: 8, th: .18, fi: .12, d: 14, al: wR([-.3, 1.6, 1.4]) },
        { t: FIMC - .2, th: .1, fi: .14, d: 14, al: wR([-.6, 1.9, 1.4]) }, { t: FIMC + 2.6, th: .05, fi: .2, d: 19.5, al: wR([-1.7, 3.4, 1.2]) }]);
    }
    return { th: k.th, fi: k.fi, d: k.d, tx: k.al[0], ty: k.al[1], tz: k.al[2] };
  }

  // ---------- toque: peças próprias ----------
  function pegar(ray) {
    const g = G; if (!g) return null;
    const vivo = o => { for (let x = o; x; x = x.parent) if (!x.visible) return false; return !(o.isInstancedMesh && !o.count); };
    const hs = ray.intersectObjects(g.pick.filter(vivo), false);
    for (const h of hs) { const pc = h.object.userData.info ? h.object.userData.info[h.instanceId] : h.object.userData.peca; if (pc) return pc; }
    const hn = ray.intersectObject(g.nucleo, false)[0]; return hn ? PC.nucleo : null;
  }
  function pecasVisiveis() { const g = G; if (!g) return []; const ids = []; g.rots.forEach(o => { if (o.on && ids.indexOf(o.r.pc) < 0) ids.push(o.r.pc); }); return ids.map(id => PC[id]); }

  function limpar(v) {
    const g = G; if (!g) return;
    if (g.rotHost) g.rotHost.remove();
    g.luz0.forEach(([l, i]) => { l.intensity = i; });
    v.cena.fog = g.fog0 || null; v.cena.background = g.bg0 || null;
    v.ren.setRenderTarget(null);
    [g.rtA, g.rtH, g.rtB, g.rtQ1, g.rtQ2].forEach(r => r && r.dispose());
    g.mats.forEach(m => m.dispose()); g.geos.forEach(x => x.dispose()); if (g.atlas) g.atlas.dispose();
    [g.barD, g.acD, g.bolD, g.barR, g.acR, g.bolR, g.stR, g.trn, g.bolW, g.stW, g.trW].forEach(W => W && W.m.dispose());
    G = null; _sz.w = _sz.h = 0;
  }

  // o mol3d chama montar uma vez; o caminho do passo 3 depende da posição do poro na hélice
  const montarTudo = M => { montar(M); montarCaminho(G); };

  const spec = {
    t: old.t || 'DNA × RNA', s: old.s || 'duas fitas ou uma; T ou U', c: old.c, loc: old.loc || 'Modelo 3D simplificado', still: 3,
    ctl: escolha('Passo', PASSOS, 16), girar: false,
    alt: 'Animação 3D: no núcleo, o DNA de duas fitas ao lado de um RNA de uma fita; a RNA polimerase abre a hélice e monta o RNA mensageiro; o mRNA sai pelo poro do núcleo; no citoplasma, o ribossomo lê os códons, os RNA transportadores trazem os aminoácidos e a cadeia se dobra numa proteína. Dá para girar, aproximar e tocar nas peças',
    d: old.d, kv: old.kv, enem: old.enem, links: old.links,
    montar: montarTudo, animar,
    legenda: P => LEG[P.passo],
    plano(t, S) { if (old.draw) { if (!this._pi && old.init) { old.init(S); this._pi = 1; } old.draw.call(old, t, S); } }
  };
  def('na', 'dna-rna', MOL3D.cena(spec));
  ORDER.na = ORDER.na.filter((x, i, a) => a.indexOf(x) === i);
  void DUR;
  // ganchos de teste e de captura: fixar o tempo do passo, a câmera e a qualidade
  window.DNACINE = { fixar: tp => { TPFIX = tp; }, camera: c => { CAMFIX = c; }, qualidade: q => { QFIX = q; }, g: () => G, get estado() { return G ? { passo: G.passo, tp: G.tp, esc: G.esc, ema: G.ema } : null; } };
})();
