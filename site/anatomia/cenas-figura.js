/* LAB Anatomia: figura de IA por padrão em 3 rotas sem 3D (Aurelius).
   Figura (figura-ia.js v2, vistas A e B, pontos e zoom) abre primeiro; o botão "Ver esquema" mostra a cena 2D e "Ver figura" volta.
   O .js de cada imagem só entra na página quando a cena abre. Usa os globais do motor (SC, X, W, H, NAR, cap, cv).
   Carregar depois de figura-alterna.js e antes de LAB_ANATOMIA_iniciar(). */
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

  LAB_FIGALT.cena(amb, 'digestorio/absorcao', {
    pref: 'anatomia', nome: 'Intestino delgado e vilosidades', mask: MASK,
    vistas: [
      ['a', 'digestorio-absorcao-a', 'Parede do intestino', 'Corte da parede do intestino delgado com dobras e vilosidades, com capilares e vaso lácteo dentro de cada vilosidade'],
      ['b', 'digestorio-absorcao-b', 'Borda em escova', 'Células do epitélio intestinal com microvilosidades no alto, formando a borda em escova']
    ],
    hs: [
      { id: 'vil', c: '#F2A65A', t: 'Vilosidade', d: 'Projeção da mucosa em forma de dedo. Com as dobras e as microvilosidades, ela aumenta muito a superfície de absorção do intestino delgado.', em: { a: [50, 24] }, z: 2.6 },
      { id: 'lac', c: '#FFD43B', t: 'Vaso lácteo (quilífero)', d: 'Vaso linfático no centro da vilosidade. Recolhe boa parte das gorduras absorvidas, que seguem pela linfa até o sangue.', em: { a: [50, 36] }, z: 3 },
      { id: 'cap', c: '#F28B8B', t: 'Capilares sanguíneos', d: 'Recebem glicose, aminoácidos, sais e água. Esse sangue vai pela veia porta ao fígado antes de seguir pelo corpo.', em: { a: [63, 38] }, z: 3 },
      { id: 'epi', c: '#8FD8FF', t: 'Epitélio', d: 'Uma camada de células cobre a vilosidade e controla o que passa do alimento digerido para o sangue e a linfa.', em: { a: [13, 18] }, z: 2.6 },
      { id: 'mus', c: '#A9C54A', t: 'Camadas musculares', d: 'O músculo liso da parede faz o peristaltismo e mistura o alimento, o que facilita a digestão e a absorção.', em: { a: [55, 80] }, z: 2.2 },
      { id: 'mic', c: '#FFA94D', t: 'Microvilosidades', d: 'Prolongamentos da membrana de cada célula, que formam a borda em escova. Aumentam a superfície de contato e trazem enzimas da digestão final.', em: { b: [30, 18] }, z: 3 },
      { id: 'jun', c: '#CFE0FF', t: 'Junções entre células', d: 'Prendem as células vizinhas e impedem que o conteúdo do intestino vaze entre elas. A absorção passa pelas próprias células.', em: { b: [19, 31] }, z: 3 },
      { id: 'mit', c: '#F28B8B', t: 'Mitocôndria', d: 'Fornece ATP para o transporte ativo, como o da glicose, que as células intestinais fazem contra o gradiente.', em: { b: [27, 36] }, z: 3 },
      { id: 'cal', c: '#8FD8FF', t: 'Célula caliciforme', d: 'Produz muco, que protege e lubrifica a mucosa do intestino. Fica entre as células absortivas.', em: { b: [65, 35] }, z: 2.8 },
      { id: 'vas', c: '#F2B6C6', t: 'Vasos sob o epitélio', d: 'Logo abaixo das células há capilares que levam os nutrientes absorvidos embora.', em: { b: [15, 87] }, z: 2.6 }
    ]
  });

  LAB_FIGALT.cena(amb, 'nervoso/organizacao', {
    pref: 'anatomia', nome: 'Sistema nervoso e arco reflexo', mask: MASK,
    vistas: [
      ['a', 'nervoso-organizacao-a', 'Sistema nervoso', 'Sistema nervoso humano: encéfalo, medula espinal e nervos periféricos'],
      ['b', 'nervoso-organizacao-b', 'Arco reflexo', 'Corte transversal da medula espinal com o arco reflexo, da pele ao músculo']
    ],
    hs: [
      { id: 'enc', c: '#FFD43B', t: 'Encéfalo', d: 'Cérebro, cerebelo e tronco encefálico, dentro do crânio. Com a medula, forma o sistema nervoso central (SNC).', em: { a: [50, 9] }, z: 3 },
      { id: 'med', c: '#FFA94D', t: 'Medula espinal', d: 'Cordão dentro da coluna vertebral. Liga o encéfalo aos nervos e comanda os reflexos. Também é parte do SNC.', em: { a: [50, 33] }, z: 2.8 },
      { id: 'plx', c: '#8FD8FF', t: 'Nervos do braço', d: 'Nervos espinais levam sensações da pele e dos músculos até a medula e trazem de volta as ordens de movimento.', em: { a: [41, 33] }, z: 2.6 },
      { id: 'cia', c: '#A9C54A', t: 'Nervo ciático', d: 'O maior nervo do corpo, na perna. Nervos e gânglios formam o sistema nervoso periférico (SNP).', em: { a: [46, 68] }, z: 2.8 },
      { id: 'rec', c: '#F2B6C6', t: 'Receptor na pele', d: 'Capta o estímulo, como calor ou dor, e começa o impulso no neurônio sensitivo.', em: { b: [16, 78] }, z: 3 },
      { id: 'gan', c: '#FFD43B', t: 'Gânglio da raiz dorsal', d: 'Dilatação da raiz dorsal onde ficam os corpos dos neurônios sensitivos. O impulso entra na medula por essa raiz.', em: { b: [30, 36] }, z: 3 },
      { id: 'int', c: '#8FD8FF', t: 'Interneurônio', d: 'Neurônio de associação na substância cinzenta. Passa o sinal do neurônio sensitivo ao motor.', em: { b: [50, 36] }, z: 3 },
      { id: 'cin', c: '#CFE0FF', t: 'Substância cinzenta', d: 'Região em forma de borboleta, com corpos de neurônios. Em volta fica a substância branca, com axônios.', em: { b: [67, 34] }, z: 2.6 },
      { id: 'mot', c: '#FFA94D', t: 'Neurônio motor e raiz ventral', d: 'O corpo do neurônio motor fica na medula e o axônio sai pela raiz ventral rumo ao músculo.', em: { b: [56, 46] }, z: 3 },
      { id: 'mus', c: '#F28B8B', t: 'Músculo efetor', d: 'Recebe a ordem do neurônio motor e se contrai. A resposta ocorre antes de a dor chegar ao cérebro.', em: { b: [74, 76] }, z: 3 }
    ]
  });

  LAB_FIGALT.cena(amb, 'locomotor/esqueleto', {
    pref: 'anatomia', nome: 'Esqueleto humano e osso longo', mask: MASK,
    vistas: [
      ['a', 'locomotor-esqueleto-a', 'Esqueleto adulto', 'Esqueleto humano adulto completo, visto de frente'],
      ['b', 'locomotor-esqueleto-b', 'Osso longo em corte', 'Osso longo cortado no comprimento, com osso compacto, esponjoso e medula']
    ],
    hs: [
      { id: 'cra', c: '#FFD43B', t: 'Crânio', d: 'Protege o encéfalo. Faz parte do esqueleto axial, junto com a coluna e a caixa torácica.', em: { a: [50, 10] }, z: 2.8 },
      { id: 'cos', c: '#8FD8FF', t: 'Costelas', d: 'O adulto tem 12 pares: 7 verdadeiras, presas ao esterno, 3 falsas e 2 flutuantes. Protegem o coração e os pulmões.', em: { a: [46, 29] }, z: 2.6 },
      { id: 'col', c: '#F28B8B', t: 'Coluna vertebral', d: 'Formada por vértebras, protege a medula espinal e sustenta o corpo. Tem curvaturas que ajudam a amortecer o peso.', em: { a: [50, 40] }, z: 2.6 },
      { id: 'pel', c: '#A9C54A', t: 'Pelve', d: 'Os ossos do quadril formam a cintura pélvica. Ela liga a coluna às pernas e sustenta o peso do tronco.', em: { a: [50, 47] }, z: 2.8 },
      { id: 'fem', c: '#FFA94D', t: 'Fêmur', d: 'Osso da coxa. É o maior e o mais resistente do corpo, e pertence ao esqueleto apendicular.', em: { a: [45, 60] }, z: 2.6 },
      { id: 'cmp', c: '#FFD43B', t: 'Osso compacto', d: 'Tecido ósseo denso nas paredes da diáfise. Dá resistência e rigidez ao osso.', em: { b: [40, 42] }, z: 3 },
      { id: 'esp', c: '#F28B8B', t: 'Osso esponjoso e medula vermelha', d: 'Nas epífises, o osso esponjoso tem trabéculas com espaços. A medula óssea vermelha ali produz as células do sangue.', em: { b: [18, 38] }, z: 3 },
      { id: 'cav', c: '#FFA94D', t: 'Cavidade medular', d: 'Canal no centro da diáfise. No adulto ele guarda a medula amarela, rica em gordura e reserva de energia.', em: { b: [54, 49] }, z: 3 },
      { id: 'dis', c: '#CFE0FF', t: 'Epífise distal', d: 'A ponta do osso é de osso esponjoso, que distribui o impacto da articulação.', em: { b: [85, 50] }, z: 3 },
      { id: 'car', c: '#8FD8FF', t: 'Cartilagem articular', d: 'Capa lisa sobre as pontas do osso. Reduz o atrito e amortece o choque na articulação.', em: { b: [6, 59] }, z: 3.2 }
    ]
  });
})();
