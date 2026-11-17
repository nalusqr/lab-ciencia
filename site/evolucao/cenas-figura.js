/* LAB Evolução: figura de IA por padrão em 5 rotas sem 3D (Aurelius).
   Figura (figura-ia.js v2, vistas A e B, pontos e zoom) abre primeiro; o botão "Ver esquema" mostra a cena 2D e "Ver figura" volta.
   O .js de cada imagem só entra na página quando a cena abre. Usa os globais do motor (SC, X, W, H, NAR, cap, cv).
   Carregar depois de figura-alterna.js e antes de LAB_EVOLUCAO_iniciar(). */
'use strict';
(function () {
  if (!window.LAB_FIGALT || !window.LAB_FIGIA) return;
  const MASK = { miolo: .94, borda: 1 };
  const amb = {
    SC, X: () => X, W: () => W, H: () => H, nar: () => NAR, tela: cv.parentNode, cap: html => cap(html),
    t: a => a[0], baixo: nar => nar ? 100 : 56,
    rot3d: 'Ver esquema', dica3d: '',
    esconder: ['.hud.onde'], esconderFig: ['.palco .ctl', '#extra']
  };

  LAB_FIGALT.cena(amb, 'evidencias/fosseis', {
    pref: 'evolucao', nome: 'Fósseis e camadas de rocha', mask: MASK,
    vistas: [
      ['a', 'evidencias-fosseis-a', 'Fósseis na rocha', 'Fósseis de um trilobita e de uma amonita preservados em rocha sedimentar'],
      ['b', 'evidencias-fosseis-b', 'Camadas de rocha', 'Paredão de rocha sedimentar em camadas, com fósseis diferentes em cada nível']
    ],
    hs: [
      { id: 'tri', c: '#F7C13B', t: 'Trilobita', d: 'Artrópode marinho extinto, comum nos mares antigos. Seu exoesqueleto ficou preservado na rocha, e por isso ele é um fóssil de corpo.', em: { a: [33, 49] }, z: 2.6 },
      { id: 'amo', c: '#8FD8FF', t: 'Amonita', d: 'Molusco com concha em espiral, parente de lulas e polvos. Foi extinto e a concha fossilizada ajuda a datar as rochas.', em: { a: [70, 51] }, z: 2.6 },
      { id: 'roc', c: '#A9C54A', t: 'Rocha sedimentar', d: 'Os fósseis aparecem sobretudo em rochas sedimentares. O sedimento cobre o organismo, endurece e preserva sua forma.', em: { a: [16, 64] }, z: 2.4 },
      { id: 'inf', c: '#FFA94D', t: 'Camadas mais antigas', d: 'Em uma sequência sem perturbação, a camada de baixo é a mais antiga. Aqui aparecem amonitas e trilobitas, grupos marinhos hoje extintos.', em: { b: [37, 76] }, z: 2.6 },
      { id: 'med', c: '#CFE0FF', t: 'Camadas intermediárias', d: 'Cada nível guarda uma comunidade diferente. A mudança dos fósseis de baixo para cima registra a história da vida.', em: { b: [69, 52] }, z: 2.6 },
      { id: 'sup', c: '#F28B8B', t: 'Peixe fóssil', d: 'Camadas mais altas são mais recentes. Este peixe viveu depois dos organismos preservados nas camadas de baixo.', em: { b: [67, 31] }, z: 2.8 },
      { id: 'est', c: '#FFD43B', t: 'Estratos', d: 'Cada faixa colorida é um estrato, formado por sedimentos depositados em uma época. Eles montam a escala relativa do tempo.', em: { b: [31, 42] }, z: 2.4 }
    ]
  });

  LAB_FIGALT.cena(amb, 'evidencias/comparacao', {
    pref: 'evolucao', nome: 'Homologias e órgãos vestigiais', mask: MASK,
    vistas: [
      ['a', 'evidencias-comparacao-a', 'Membros anteriores', 'Ossos do membro anterior de humano, morcego, baleia e ave, com o mesmo arranjo de úmero, rádio e ulna'],
      ['b', 'evidencias-comparacao-b', 'Órgãos vestigiais', 'Apêndice vermiforme humano e ossos pélvicos reduzidos de uma baleia']
    ],
    hs: [
      { id: 'hum', c: '#F7C13B', t: 'Úmero', d: 'Um único osso no braço, em todos os quatro grupos. Esse mesmo arranjo básico indica ancestral comum e define estruturas homólogas.', em: { a: [12, 12] }, z: 2.6 },
      { id: 'rau', c: '#8FD8FF', t: 'Rádio e ulna', d: 'Dois ossos no antebraço, nos quatro membros. A origem embrionária é a mesma, mesmo com funções diferentes.', em: { a: [12, 50] }, z: 2.8 },
      { id: 'mor', c: '#FFA94D', t: 'Asa de morcego', d: 'Dedos muito alongados sustentam a membrana da asa. Mesmos ossos do braço humano, adaptados ao voo.', em: { a: [36, 68] }, z: 2.6 },
      { id: 'bal', c: '#A9C54A', t: 'Nadadeira da baleia', d: 'Ossos curtos e achatados formam a nadadeira. É homóloga ao braço humano, adaptada à natação.', em: { a: [62, 58] }, z: 2.6 },
      { id: 'ave', c: '#F28B8B', t: 'Asa de ave', d: 'Poucos dedos, em parte fundidos, sustentam as penas. A asa de ave e a de inseto são análogas, pois têm origens diferentes.', em: { a: [83, 70] }, z: 2.6 },
      { id: 'cec', c: '#F2B6C6', t: 'Ceco humano', d: 'Bolsa no início do intestino grosso. Em herbívoros ela é grande e abriga microrganismos que digerem celulose.', em: { b: [20, 42] }, z: 2.6 },
      { id: 'apv', c: '#FFD43B', t: 'Apêndice vermiforme', d: 'Pequeno e sem função digestiva importante, é um órgão vestigial. Ele lembra uma estrutura que era maior em ancestrais.', em: { b: [37, 85] }, z: 3 },
      { id: 'pel', c: '#CFE0FF', t: 'Ossos da pelve', d: 'Ossos pequenos e soltos, sem ligação com a coluna. Restos da pelve de ancestrais terrestres de quatro patas.', em: { b: [70, 67] }, z: 3 },
      { id: 'ver', c: '#8FD8FF', t: 'Vértebras', d: 'A coluna de mamíferos tem a mesma organização básica, o que reforça a origem comum das baleias e dos mamíferos terrestres.', em: { b: [73, 27] }, z: 2.6 }
    ]
  });

  LAB_FIGALT.cena(amb, 'selecao/casos', {
    pref: 'evolucao', nome: 'Mariposa Biston betularia', mask: MASK,
    vistas: [
      ['a', 'selecao-casos-a', 'Tronco com líquen', 'Mariposa clara e mariposa escura sobre tronco claro coberto de líquen'],
      ['b', 'selecao-casos-b', 'Tronco com fuligem', 'Mariposa clara e mariposa escura sobre tronco escurecido pela fuligem']
    ],
    hs: [
      { id: 'cla', c: '#CFE0FF', t: 'Forma clara camuflada', d: 'Sobre o líquen, a mariposa clara some à vista das aves. Ela sobrevive mais e deixa mais descendentes.', em: { a: [31, 52] }, z: 3 },
      { id: 'esc', c: '#F7C13B', t: 'Forma escura visível', d: 'No tronco claro a escura se destaca e as aves a comem mais. Ela era rara antes da industrialização.', em: { a: [70, 53] }, z: 3 },
      { id: 'liq', c: '#A9C54A', t: 'Líquen', d: 'Sensível à poluição, o líquen cresce em ar limpo. Seu desaparecimento escureceu os troncos.', em: { a: [12, 84] }, z: 2.6 },
      { id: 'clb', c: '#F28B8B', t: 'Forma clara exposta', d: 'No tronco escuro a clara contrasta com o fundo e é mais predada. A cor do ambiente mudou o resultado da seleção.', em: { b: [37, 65] }, z: 3 },
      { id: 'esb', c: '#FFA94D', t: 'Forma escura camuflada', d: 'A escura passou a sobreviver mais e a se tornar comum nas regiões poluídas da Inglaterra, no século XIX.', em: { b: [70, 52] }, z: 3 },
      { id: 'fui', c: '#8FD8FF', t: 'Fuligem', d: 'A poluição das fábricas cobriu o tronco de fuligem. A variação de cor já existia, e a seleção natural mudou sua frequência.', em: { b: [78, 84] }, z: 2.6 }
    ]
  });

  LAB_FIGALT.cena(amb, 'padroes/irradiacao', {
    pref: 'evolucao', nome: 'Tentilhões de Galápagos', mask: MASK,
    vistas: [
      ['a', 'padroes-irradiacao-a', 'Bicos diferentes', 'Quatro tentilhões de Galápagos com bicos de formas diferentes'],
      ['b', 'padroes-irradiacao-b', 'Ilhas Galápagos', 'Paisagem de ilhas vulcânicas do arquipélago de Galápagos']
    ],
    hs: [
      { id: 'gro', c: '#F7C13B', t: 'Bico grosso', d: 'Forte e curto, quebra sementes duras. Aves com esse bico se dão bem onde esse alimento é comum.', em: { a: [28, 26] }, z: 3 },
      { id: 'med', c: '#A9C54A', t: 'Bico médio', d: 'Serve para sementes menores e outros alimentos. É uma forma intermediária entre as extremidades da variação.', em: { a: [47, 31] }, z: 3 },
      { id: 'fin', c: '#8FD8FF', t: 'Bico fino', d: 'Pontudo, pega insetos e pequenos animais. A forma do bico se relaciona com o alimento disponível.', em: { a: [52, 55] }, z: 3 },
      { id: 'lon', c: '#F28B8B', t: 'Bico longo', d: 'Alcança alimento em lugares fundos, como flores e frestas. Também é uma adaptação a um modo de alimentação.', em: { a: [73, 30] }, z: 3 },
      { id: 'ila', c: '#FFD43B', t: 'Ilhas vulcânicas', d: 'Ilhas jovens e isoladas, a cerca de 1.000 km da costa do Equador. Uma espécie ancestral chegou do continente e se diversificou.', em: { b: [39, 40] }, z: 2.4 },
      { id: 'mar', c: '#CFE0FF', t: 'Mar entre as ilhas', d: 'A água separa as populações e reduz o fluxo gênico. Isolamento e seleção diferentes levam à irradiação adaptativa.', em: { b: [78, 63] }, z: 2.2 },
      { id: 'igu', c: '#FFA94D', t: 'Iguana-marinha', d: 'Espécie que só existe em Galápagos. As ilhas guardam muitos endemismos, que intrigaram Darwin.', em: { b: [23, 71] }, z: 2.8 },
      { id: 'cac', c: '#A9C54A', t: 'Cactos', d: 'Recurso de alimento para aves e outros animais. As plantas de cada ilha também influenciam a seleção.', em: { b: [21, 59] }, z: 2.6 }
    ]
  });

  LAB_FIGALT.cena(amb, 'humana/origem', {
    pref: 'evolucao', nome: 'Evolução humana', mask: MASK,
    vistas: [
      ['a', 'humana-origem-a', 'Crânios de hominínios', 'Réplicas de crânios de Australopithecus, Homo erectus, Neandertal e Homo sapiens em sequência'],
      ['b', 'humana-origem-b', 'Mãos, pés e ferramentas', 'Ossos de mãos e pés de primatas e de humanos, com ferramentas de pedra']
    ],
    hs: [
      { id: 'aus', c: '#F7C13B', t: 'Australopithecus', d: 'Crânio pequeno, com cerca de 400 a 500 cm³, e face projetada. Já andava ereto, como mostram os ossos da bacia e dos pés.', em: { a: [15, 52] }, z: 3 },
      { id: 'ere', c: '#8FD8FF', t: 'Homo erectus', d: 'Crânio maior, com cerca de 900 cm³, e arcos superciliares fortes. Usava fogo e ferramentas e saiu da África.', em: { a: [37, 49] }, z: 3 },
      { id: 'nea', c: '#A9C54A', t: 'Neandertal', d: 'Crânio grande, com cerca de 1.400 cm³, longo e baixo. É uma espécie próxima, e não ancestral, do Homo sapiens.', em: { a: [60, 47] }, z: 3 },
      { id: 'sap', c: '#F28B8B', t: 'Homo sapiens', d: 'Crânio alto e arredondado, com cerca de 1.350 cm³, e face curta e plana. O queixo marcado é característico da espécie.', em: { a: [85, 46] }, z: 3 },
      { id: 'pep', c: '#FFA94D', t: 'Pé de primata', d: 'O dedão afastado dos outros agarra galhos. Os dedos são longos e ajudam na vida nas árvores.', em: { b: [36, 31] }, z: 3 },
      { id: 'peh', c: '#CFE0FF', t: 'Pé humano', d: 'Dedão alinhado e arco no pé sustentam o corpo e o impulsionam no andar com duas pernas, o bipedismo.', em: { b: [81, 30] }, z: 3 },
      { id: 'mao', c: '#FFD43B', t: 'Mão de primata', d: 'O polegar oponível permite pegar objetos. Em humanos ele é mais longo e dá precisão para fabricar ferramentas.', em: { b: [17, 31] }, z: 3 },
      { id: 'fer', c: '#F2B6C6', t: 'Ferramentas de pedra', d: 'Pedras lascadas são sinal de cultura e de uso das mãos. Elas aparecem no registro fóssil há cerca de 2,5 milhões de anos.', em: { b: [45, 87] }, z: 3 }
    ]
  });

  /* ===== Figura v2 (rodada Nalu): Lamarck x Darwin, Pasteur, esquilos do Grande Cânion, mula e endossimbiose =====
     Imagens de IA como visão padrão; a animação leve por cima (sobre) usa coordenadas em % da figura (R.pt) e respeita prefers-reduced-motion
     (sem movimento, mostra o quadro de maior sentido). A cena antiga (esquema 2D ou 3D) fica no botão ao lado. */
  const RED = LAB_FIGALT.RED, TAU = Math.PI * 2;
  const cl = (v, a, b) => Math.max(a, Math.min(b, v)), fr = v => v - Math.floor(v), sg = (p, a, b) => cl((p - a) / (b - a), 0, 1);
  const ez = v => { v = cl(v, 0, 1); return v * v * (3 - 2 * v); };
  const brilho = (X, x, y, r, cor, a) => { X.save(); X.globalAlpha *= a; const g = X.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, cor); g.addColorStop(1, 'rgba(0,0,0,0)'); X.fillStyle = g; X.beginPath(); X.arc(x, y, r, 0, TAU); X.fill(); X.restore(); };
  const anel = (X, x, y, r, cor, a, lw) => { X.save(); X.globalAlpha *= a; X.strokeStyle = cor; X.lineWidth = lw || 2; X.beginPath(); X.arc(x, y, r, 0, TAU); X.stroke(); X.restore(); };
  const pto = (X, x, y, r, cor, a) => { X.save(); X.globalAlpha *= a; X.fillStyle = cor; X.beginPath(); X.arc(x, y, Math.max(.8, r), 0, TAU); X.fill(); X.restore(); };
  // ponto a uma fração u (0 a 1) de uma polilinha, em pixels
  const ao = (P, u) => { const n = P.length - 1, q = cl(u, 0, .9999) * n, i = Math.floor(q), f = q - i; return [P[i][0] + (P[i + 1][0] - P[i][0]) * f, P[i][1] + (P[i + 1][1] - P[i][1]) * f]; };
  const tt = t => RED ? 6 : t;
  const amb3 = Object.assign({}, amb, { rot3d: undefined, dica3d: undefined });

  // ---------- Lamarck e Darwin: duas visões da mesma pergunta ----------
  const CABD = [[25.8, 30.4], [53.6, 12], [58.5, 38.1], [75.3, 28.2], [88.3, 40.3]];
  LAB_FIGALT.cena(amb, 'ideias/lamarck', {
    pref: 'evolucao', nome: 'Girafas: Lamarck e Darwin', mask: false,
    vistas: [
      ['a', 'ideias-lamarck-a', 'Lamarck', 'Uma girafa estica o pescoço para alcançar as folhas do alto de uma árvore, como Lamarck imaginava'],
      ['b', 'ideias-lamarck-b', 'Darwin', 'Cinco girafas adultas com pescoços de comprimentos diferentes: só a de pescoço mais longo alcança as folhas do alto, como Darwin explicou']
    ],
    hs: [
      { id: 'pes', c: '#C9AEFF', t: 'Pescoço que se estica', d: 'Para Lamarck, a girafa estica o pescoço para alcançar as folhas e, com o uso, ele ficaria um pouco mais longo ao longo da vida.', em: { a: [52, 26] }, z: 2.4 },
      { id: 'fol', c: '#A9C54A', t: 'Folhas do alto', d: 'O alimento está só no alto da árvore. Para Lamarck, essa necessidade é o que leva o animal a usar mais o pescoço.', em: { a: [84, 11] }, z: 2.4 },
      { id: 'gal', c: '#F7C13B', t: 'Galhos baixos sem folhas', d: 'As folhas de baixo já acabaram. Com pouco alimento ao alcance, as girafas precisam chegar ao que está no alto.', em: { a: [78, 47] }, z: 2.4 },
      { id: 'uso', c: '#F28B8B', t: 'Uso e desuso', d: 'Lamarck dizia que o órgão muito usado se desenvolve e o pouco usado se atrofia. Hoje sabemos que o esforço de uma vida não altera o DNA dos gametas, então o pescoço esticado não passa aos filhotes.', em: { a: [33, 50] }, z: 2.2 },
      { id: 'cur', c: '#F28B8B', t: 'Pescoço curto', d: 'Já nasce curto, por variação que existia na população. Não alcança as folhas do alto e tende a deixar menos filhotes quando o alimento é escasso.', em: { b: [55, 45] }, z: 2.6 },
      { id: 'var', c: '#8FD8FF', t: 'Variação que já existia', d: 'Na população, os pescoços já eram de tamanhos diferentes e a diferença é herdada. Ninguém esticou o pescoço: a variação veio antes da necessidade.', em: { b: [20, 41] }, z: 2.4 },
      { id: 'lon', c: '#2FCFBF', t: 'Pescoço longo', d: 'Alcança as folhas do alto, sobrevive mais e deixa mais filhotes de pescoço longo. É a seleção natural de Darwin e Wallace, ao longo de muitas gerações.', em: { b: [52, 12] }, z: 2.6 },
      { id: 'fo2', c: '#A9C54A', t: 'Folhas do alto', d: 'O alimento do alto é o fator de seleção: favorece quem tem pescoço mais longo, sem que ele se estique durante a vida.', em: { b: [65, 10] }, z: 2.4 }
    ],
    sobre(R, X, t, c) {
      const T = tt(t), P = R.pt.bind(R), lw = Math.max(2, R.s * .28);
      if (R.vista === 'a') {
        const b = P(44, 42), h = P(62, 13), ph = (T % 8) / 8, f = RED ? 1 : .74 + .26 * ez(sg(ph, .12, .62)), esc = RED ? 1 : 1 - ez(sg(ph, .9, 1));
        const q = [b[0] + (h[0] - b[0]) * f, b[1] + (h[1] - b[1]) * f], nx = -(h[1] - b[1]), ny = h[0] - b[0], nl = Math.hypot(nx, ny) || 1, o = [nx / nl * R.s * 1.7, ny / nl * R.s * 1.7];
        X.save(); X.globalAlpha *= esc; X.lineCap = 'round';
        // quanto o pescoço "cresceu" no uso: trecho entre a marca de antes (74%) e a ponta
        const a0 = [b[0] + (h[0] - b[0]) * .74, b[1] + (h[1] - b[1]) * .74];
        X.strokeStyle = 'rgba(201,174,255,.9)'; X.lineWidth = lw; X.beginPath(); X.moveTo(b[0] + o[0], b[1] + o[1]); X.lineTo(q[0] + o[0], q[1] + o[1]); X.stroke();
        X.strokeStyle = '#FFB347'; X.lineWidth = lw * 1.5; X.beginPath(); X.moveTo(a0[0] + o[0], a0[1] + o[1]); X.lineTo(q[0] + o[0], q[1] + o[1]); X.stroke();
        [[b, '#C9AEFF'], [a0, '#FFB347'], [q, '#FFB347']].forEach(([p, cor]) => { X.strokeStyle = cor; X.lineWidth = lw; X.beginPath(); X.moveTo(p[0] + o[0] * .6, p[1] + o[1] * .6); X.lineTo(p[0] + o[0] * 1.4, p[1] + o[1] * 1.4); X.stroke(); });
        X.restore();
        for (let i = 0; i < 10; i++) { const u = fr(T * .22 + i / 10) * f; pto(X, b[0] + (h[0] - b[0]) * u - o[0] * .5, b[1] + (h[1] - b[1]) * u - o[1] * .5, R.s * .5, '#E5D6FF', esc * Math.sin(u / Math.max(f, .01) * Math.PI) * .9); }
        const pu = .5 + .5 * Math.sin(T * 2.4); brilho(X, ...P(82, 11), R.s * 9, '#A9C54A', RED ? .5 : .25 + .3 * pu);
        anel(X, h[0], h[1], R.s * (2.5 + 2.5 * fr(T * .5)), '#C9AEFF', RED ? .5 : .7 * (1 - fr(T * .5)), 1.5);
      } else {
        const s = (T % 9) / 9, k = RED ? 5.01 : s * 6.2, linha = P(0, 19)[1], x0 = P(56, 0)[0], x1 = P(99, 0)[0];
        X.save(); X.setLineDash([6, 6]); X.strokeStyle = 'rgba(169,197,74,.8)'; X.lineWidth = 1.6; X.beginPath(); X.moveTo(x0, linha); X.lineTo(x1, linha); X.stroke(); X.restore();
        const esc = RED ? 1 : 1 - ez(sg(s, .9, 1));
        CABD.forEach((q, i) => {
          const p = P(q[0], q[1] - 3), a = ez(k - i) * esc, topo = i === 1, cor = topo ? '#2FCFBF' : '#F28B8B';
          if (a <= 0) return;
          anel(X, p[0], p[1], R.s * (3.6 + (topo ? 1 : 0)) + R.s * .8 * Math.sin(T * 3 + i), cor, a * (topo ? .95 : .6), topo ? 3 : 2);
          brilho(X, p[0], p[1], R.s * 7, cor, a * .22);
        });
        if (k > 1.2 || RED) { const h = P(56, 12), f2 = RED ? .6 : sg(k, 1.2, 3); for (let i = 0; i < 8; i++) { const u = fr(T * .5 + i / 8), x = h[0] + Math.sin(i * 2.3) * R.s * 6 + u * R.s * 5, y = h[1] - u * R.s * 13; pto(X, x, y, R.s * .55, '#BFF08A', esc * f2 * Math.sin(u * Math.PI)); } }
      }
    }
  });

  // ---------- Pasteur: o pescoço de cisne segura a poeira ----------
  const CISNE = [[54, 17.2], [50.5, 17], [47.5, 20], [47.6, 43], [43, 53], [38.5, 51], [37.8, 39], [36.3, 26], [33, 12], [29, 10], [23.5, 13], [22, 26], [21.8, 43], [23, 56]];
  const RET = .36;   // fração do caminho onde a poeira para: o fundo da curva em U, antes de subir para o frasco
  const QUEB = [[69, 22], [69.6, 33], [70.5, 46], [71, 62]];
  LAB_FIGALT.cena(amb, 'origem/biogenese', {
    pref: 'evolucao', nome: 'Frascos de pescoço de cisne de Pasteur', mask: MASK,
    vistas: [['a', 'origem-biogenese-a', 'Dois frascos', 'Dois frascos com caldo: um com pescoço de cisne e caldo límpido, outro com o pescoço quebrado e caldo turvo']],
    hs: [
      { id: 'cis', c: '#F7C13B', t: 'Pescoço de cisne', d: 'Tubo curvo, aberto para o ar. O ar entra e sai, mas a poeira e os micróbios ficam presos na curva, e o caldo não é contaminado.', em: { a: [34, 27] }, z: 2.2 },
      { id: 'dep', c: '#CFE0FF', t: 'Poeira retida na curva', d: 'As partículas do ar, com os micróbios que carregam, se depositam na parte baixa da curva e não chegam ao caldo.', em: { a: [40, 52] }, z: 3 },
      { id: 'lim', c: '#A9C54A', t: 'Caldo límpido', d: 'Foi fervido antes e continuou sem crescimento de micróbios, mesmo em contato com o ar. Isso refutou a geração espontânea.', em: { a: [23, 72] }, z: 2.4 },
      { id: 'que', c: '#F28B8B', t: 'Pescoço quebrado', d: 'Sem a curva, a poeira do ar cai direto no caldo. É o controle do experimento: a única mudança é o caminho do ar.', em: { a: [78, 29] }, z: 2.4 },
      { id: 'tur', c: '#FFA94D', t: 'Caldo turvo', d: 'Os micróbios que vieram do ar se multiplicaram e deixaram o caldo turvo. A vida veio de vida que já existia, e não da matéria sem vida.', em: { a: [71, 72] }, z: 2.4 }
    ],
    sobre(R, X, t) {
      const T = tt(t), P = R.pt.bind(R), L = CISNE.map(q => P(q[0], q[1])), Q = QUEB.map(q => P(q[0], q[1]));
      for (let i = 0; i < 9; i++) {
        const u = fr(T * .09 + i / 9), parou = .64;
        if (u < parou) { const p = ao(L, u / parou * RET); pto(X, p[0], p[1], R.s * .6, '#FFE8A8', RED ? .8 : Math.min(1, u * 8)); }
        else { const p = ao(L, RET); const a = RED ? .8 : 1 - sg(u, parou, 1); pto(X, p[0] + (i % 3 - 1) * R.s * .7, p[1] + R.s * .5, R.s * .6, '#FFE8A8', a); }
      }
      brilho(X, ...ao(L, RET), R.s * 4.5, '#F7C13B', RED ? .45 : .25 + .15 * Math.sin(T * 2));
      for (let i = 0; i < 9; i++) { const u = fr(T * .11 + i / 9), p = ao(Q, u); pto(X, p[0] + Math.sin(i * 3) * R.s * .6, p[1], R.s * .6, '#FFE8A8', RED ? .8 : Math.sin(u * Math.PI)); }
      const c = P(71, 68);
      for (let i = 0; i < 12; i++) { const a = i * 2.4, u = RED ? .8 : fr(T * .12 + i * .13), r = R.s * (2 + 6 * u); pto(X, c[0] + Math.cos(a) * r * 1.4, c[1] + Math.sin(a) * r * .5, R.s * (.5 + .6 * u), '#F2C98A', RED ? .6 : .55 * Math.sin(Math.min(1, u * 1.2) * Math.PI)); }
    }
  });

  // ---------- Isolamento reprodutivo: a mula e seus pais ----------
  LAB_FIGALT.cena(amb, 'especiacao/isolamento', {
    pref: 'evolucao', nome: 'Jumento, égua e mula', mask: MASK,
    vistas: [['a', 'especiacao-isolamento-a', 'Mula e seus pais', 'Um jumento à esquerda, uma mula no centro e um cavalo à direita: a mula é filha de jumento com égua']],
    hs: [
      { id: 'jum', c: '#CFE0FF', t: 'Jumento', d: 'Espécie Equus asinus, com 62 cromossomos. É um dos pais da mula.', em: { a: [18, 60] }, z: 2.6 },
      { id: 'mul', c: '#F7C13B', t: 'Mula', d: 'Híbrida de jumento com égua. Tem 63 cromossomos, e o número ímpar impede o pareamento na meiose. Por isso é estéril: é isolamento pós-zigótico.', em: { a: [46, 55] }, z: 2.6 },
      { id: 'ore', c: '#8FD8FF', t: 'Orelhas longas', d: 'Herança do jumento. A mula mistura traços dos dois pais: corpo mais parecido com o do cavalo e orelhas e voz mais parecidas com as do jumento.', em: { a: [60, 34] }, z: 3 },
      { id: 'cav', c: '#F28B8B', t: 'Cavalo', d: 'Espécie Equus caballus, com 64 cromossomos. A mula nasce do cruzamento de égua com jumento. Os pais são de espécies diferentes, mas ainda geram um filhote.', em: { a: [84, 52] }, z: 2.6 },
      { id: 'cro', c: '#A9C54A', t: 'Cromossomos 62 e 64', d: 'A mula recebe 31 cromossomos do jumento e 32 da égua. Sem pares completos, a meiose falha e os gametas não se formam normalmente.', em: { a: [46, 66] }, z: 2.2 }
    ],
    sobre(R, X, t) {
      const T = tt(t), P = R.pt.bind(R), m = P(46, 52), es = P(22, 52), di = P(80, 50);
      [[es, '#CFE0FF', 0], [di, '#F28B8B', .5]].forEach(([o, cor, d]) => {
        for (let i = 0; i < 7; i++) {
          const u = fr(T * .14 + i / 7 + d * .1), x = o[0] + (m[0] - o[0]) * u, y = o[1] + (m[1] - o[1]) * u - Math.sin(u * Math.PI) * R.s * 12;
          pto(X, x, y, R.s * .7, cor, RED ? .7 : Math.sin(u * Math.PI));
        }
      });
      const k = RED ? .5 : fr(T * .14);
      brilho(X, m[0], m[1], R.s * 11, '#F7C13B', RED ? .22 : .12 + .22 * Math.sin(k * Math.PI));
      anel(X, m[0], m[1], R.s * (6 + 5 * k), '#F28B8B', RED ? .35 : .6 * (1 - k), 1.6);
    }
  });

  // ---------- especiacao/modos: a figura e a viagem estão em cenas-figura-especiacao.js ----------

  // ---------- Endossimbiose: bactérias que viraram organelas (a cena 3D fica no botão) ----------
  LAB_FIGALT.cena(amb3, 'origem/primeiras-celulas', {
    pref: 'evolucao', nome: 'Endossimbiose', mask: MASK,
    vistas: [['a', 'origem-primeiras-celulas-a', 'Célula e organelas', 'Célula eucarionte em corte, com núcleo, uma bactéria sendo englobada, duas mitocôndrias e um cloroplasto']],
    hs: [
      { id: 'bac', c: '#F28B8B', t: 'Bactéria aeróbia englobada', d: 'A célula hospedeira envolve uma bactéria que usa gás oxigênio. Ela não é digerida: passa a viver dentro da célula e vira a futura mitocôndria.', em: { a: [25, 61] }, z: 2.6 },
      { id: 'mit', c: '#FFA94D', t: 'Mitocôndria', d: 'Tem duas membranas: a interna é a da bactéria e a externa vem da célula hospedeira. Tem DNA circular, ribossomos próprios e se divide por conta própria.', em: { a: [52, 65] }, z: 3 },
      { id: 'nuc', c: '#C9AEFF', t: 'Núcleo', d: 'O DNA da célula fica separado por um envoltório com poros. É uma das características que definem a célula eucarionte.', em: { a: [60, 34] }, z: 2.6 },
      { id: 'clo', c: '#A9C54A', t: 'Cloroplasto', d: 'Veio de uma cianobactéria englobada depois. Tem duas membranas, DNA próprio e tilacoides, e faz a fotossíntese nas algas e nas plantas.', em: { a: [76, 56] }, z: 3 },
      { id: 'mem', c: '#F2B6C6', t: 'Membrana da célula', d: 'Ela se dobra para dentro e envolve a bactéria. Daí vem a membrana externa da mitocôndria.', em: { a: [36.5, 41] }, z: 2.8 }
    ],
    sobre(R, X, t) {
      const T = tt(t), P = R.pt.bind(R), b = P(26, 58), m1 = P(52, 63), m2 = P(39, 27), cl2 = P(76, 56);
      const bg = [[P(33, 55), P(40, 52), m1], [P(33, 53), P(36, 40), m2]];
      bg.forEach((L, j) => { for (let i = 0; i < 5; i++) { const u = fr(T * .12 + i / 5 + j * .3), x = (1 - u) * (1 - u) * L[0][0] + 2 * u * (1 - u) * L[1][0] + u * u * L[2][0], y = (1 - u) * (1 - u) * L[0][1] + 2 * u * (1 - u) * L[1][1] + u * u * L[2][1]; pto(X, x, y, R.s * .6, '#FFD08A', RED ? .7 : Math.sin(u * Math.PI)); } });
      const alvo = [[b, '#F28B8B', 4], [m1, '#FFA94D', 7], [m2, '#FFA94D', 6], [cl2, '#A9C54A', 7]], k = RED ? 1 : Math.floor((T / 2) % 4);
      alvo.forEach(([p, cor, r], i) => { const on = RED || i === k, ph = fr(T / 2); brilho(X, p[0], p[1], R.s * (r + 3), cor, on ? (RED ? .3 : .45 * Math.sin(ph * Math.PI)) : 0); if (on) anel(X, p[0], p[1], R.s * (r + ph * 3), cor, RED ? .5 : .8 * (1 - ph), 2); });
    }
  });
})();
