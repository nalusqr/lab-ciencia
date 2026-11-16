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
})();
