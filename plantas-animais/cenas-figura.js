/* LAB Plantas e animais: figura de IA por padrão em 4 rotas sem 3D (Aurelius).
   Figura (figura-ia.js v2, vistas A e B, pontos e zoom) abre primeiro; o botão "Ver esquema" mostra a cena 2D antiga e "Ver figura" volta.
   O .js de cada imagem só entra na página quando a cena abre. Usa os globais do motor (SC, X, W, H, NAR, cap).
   Carregar antes de LAB_PLANTAS_iniciar(). */
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

  // ================= PLANTAE =================
  LAB_FIGALT.cena(amb, 'plantae/briofitas', {
    pref: 'plantas-animais', nome: 'Musgo com esporófitos', mask: MASK,
    vistas: [
      ['a', 'plantae-briofitas-a', 'Musgo no barranco', 'Musgo em barranco úmido, com hastes e cápsulas dos esporófitos'],
      ['b', 'plantae-briofitas-b', 'Cápsulas de perto', 'Detalhe do musgo: cápsulas com opérculo no alto das hastes']
    ],
    hs: [
      { id: 'cap', c: '#FFA94D', t: 'Cápsula', d: 'Dentro da cápsula se formam os esporos, por meiose. É a parte reprodutiva do esporófito.', em: { a: [46, 19], b: [56, 21] }, z: 2.8 },
      { id: 'seta', c: '#F28B8B', t: 'Haste (seta)', d: 'A haste ergue a cápsula acima do musgo, o que ajuda a dispersar os esporos pelo vento.', em: { a: [46, 30], b: [47, 43] }, z: 2.8 },
      { id: 'ope', c: '#FFD43B', t: 'Opérculo', d: 'A tampa da cápsula se solta e libera os esporos.', em: { b: [69, 25] }, z: 3.2 },
      { id: 'gam', c: '#A9C54A', t: 'Gametófito verde', d: 'A parte verde e folhosa é o gametófito (n), a fase duradoura e dominante da briófita. Faz fotossíntese e sustenta o esporófito.', em: { a: [45, 60], b: [30, 80] }, z: 2.4 },
      { id: 'umi', c: '#8FD8FF', t: 'Ambiente úmido', d: 'As briófitas não têm vasos condutores e o anterozoide precisa de uma película de água para nadar até a oosfera. Por isso vivem em lugares úmidos e são pequenas.', em: { a: [30, 86] }, z: 2.4 }
    ]
  });

  LAB_FIGALT.cena(amb, 'plantae/gimnospermas', {
    pref: 'plantas-animais', nome: 'Araucária, pinha e gralha-azul', mask: MASK,
    vistas: [
      ['a', 'plantae-gimnospermas-a', 'Araucária adulta', 'Araucária adulta em campo, com copa em forma de candelabro'],
      ['b', 'plantae-gimnospermas-b', 'Pinha e gralha-azul', 'Pinha de araucária com pinhões, e gralha-azul']
    ],
    hs: [
      { id: 'cop', c: '#A9C54A', t: 'Copa em candelabro', d: 'Os galhos ficam em verticilos no alto do tronco. As folhas são rígidas, pontiagudas e persistentes.', em: { a: [50, 19] }, z: 2.4 },
      { id: 'tro', c: '#FFD43B', t: 'Tronco com casca grossa', d: 'O tronco é reto, com lenho formado por traqueídes. A espécie é a Araucaria angustifolia, símbolo da Mata de Araucárias do Sul do Brasil.', em: { a: [50, 62] }, z: 2.4 },
      { id: 'cam', c: '#8FD8FF', t: 'Campo e floresta', d: 'A araucária ocorre nos planaltos do Sul, em meio a campos e florestas. Está ameaçada pelo desmatamento.', em: { a: [60, 82] }, z: 2 },
      { id: 'pnh', c: '#FFA94D', t: 'Pinhão', d: 'O pinhão é a semente. Ela fica exposta sobre as escamas da pinha, sem ovário e sem fruto: é isso que define a gimnosperma.', em: { b: [42, 82] }, z: 3 },
      { id: 'pin', c: '#F28B8B', t: 'Pinha', d: 'A pinha é um cone feminino com escamas que protegem as sementes. Cones masculinos e femininos ficam em árvores separadas, pois a espécie é dioica.', em: { b: [35, 47] }, z: 2.6 },
      { id: 'gra', c: '#8FD8FF', t: 'Gralha-azul', d: 'A ave come pinhões e enterra muitos deles, que podem germinar. Assim ajuda a dispersar a araucária.', em: { b: [80, 39] }, z: 2.6 }
    ]
  });

  // ================= ANIMALIA =================
  LAB_FIGALT.cena(amb, 'animalia/artropodes', {
    pref: 'plantas-animais', nome: 'Quatro grupos de artrópodes e o Aedes aegypti', mask: MASK,
    vistas: [
      ['a', 'animalia-artropodes-a', 'Quatro grupos', 'Formiga, aranha, camarão e lacraia lado a lado para contar patas e antenas'],
      ['b', 'animalia-artropodes-b', 'Aedes aegypti', 'Aedes aegypti, com listras brancas nas patas']
    ],
    hs: [
      { id: 'for', c: '#F28B8B', t: 'Inseto: 6 patas', d: 'Corpo em cabeça, tórax e abdome, três pares de patas e um par de antenas. Os insetos são o grupo mais numeroso de animais.', em: { a: [15, 52] }, z: 2.4 },
      { id: 'ara', c: '#8FD8FF', t: 'Aracnídeo: 8 patas', d: 'Corpo em cefalotórax e abdome, quatro pares de patas e nenhuma antena. Aranhas, escorpiões e carrapatos são aracnídeos.', em: { a: [38, 52] }, z: 2.4 },
      { id: 'cam', c: '#FFA94D', t: 'Crustáceo: 10 patas', d: 'O camarão tem cinco pares de patas locomotoras e dois pares de antenas. A maioria dos crustáceos vive na água e respira por brânquias.', em: { a: [63, 46] }, z: 2.4 },
      { id: 'lac', c: '#A9C54A', t: 'Miriápode: muitas patas', d: 'Corpo alongado e segmentado, com um par de patas por segmento nas lacraias e dois nos piolhos-de-cobra. Tem um par de antenas.', em: { a: [85, 50] }, z: 2.4 },
      { id: 'lir', c: '#FFD43B', t: 'Desenho em lira', d: 'Escamas brancas no dorso do tórax, que formam um desenho em lira, identificam o Aedes aegypti, vetor da dengue, zika e chikungunya.', em: { b: [43, 38] }, z: 2.8 },
      { id: 'pat', c: '#CFE0FF', t: 'Patas listradas', d: 'Anéis brancos nas seis patas dão o aspecto listrado. O Aedes pica de dia, principalmente de manhã e no fim da tarde.', em: { b: [76, 75] }, z: 2.6 },
      { id: 'tro', c: '#F28B8B', t: 'Tromba da fêmea', d: 'Só a fêmea suga sangue, que ela precisa para amadurecer os ovos. É nessa picada que o vírus é transmitido.', em: { b: [33, 50] }, z: 2.8 }
    ]
  });

  LAB_FIGALT.cena(amb, 'animalia/vertebrados', {
    pref: 'plantas-animais', nome: 'Vertebrados: sapo, lagarto, ave e mamífero; peixes', mask: MASK,
    vistas: [
      ['a', 'animalia-vertebrados-a', 'Da água para a terra', 'Anfíbio, réptil, ave e mamífero em fila'],
      ['b', 'animalia-vertebrados-b', 'Peixes', 'Peixe ósseo e tubarão, um peixe cartilaginoso']
    ],
    hs: [
      { id: 'anf', c: '#8FD8FF', t: 'Anfíbio', d: 'Pele fina, úmida e sem escamas, que ajuda na respiração. A reprodução depende da água, onde os ovos sem casca são postos.', em: { a: [15, 52] }, z: 2.6 },
      { id: 'rep', c: '#A9C54A', t: 'Réptil', d: 'Pele com escamas de queratina, que evitam a perda de água. O ovo tem casca e o embrião tem âmnio: isso libertou os répteis da água.', em: { a: [40, 54] }, z: 2.6 },
      { id: 'ave', c: '#FFA94D', t: 'Ave', d: 'Tem penas, bico sem dentes e membros anteriores em asas. É homeotérmica, ou seja, mantém a temperatura do corpo constante.', em: { a: [62, 50] }, z: 2.6 },
      { id: 'mam', c: '#F28B8B', t: 'Mamífero', d: 'Tem pelos e glândulas mamárias que produzem leite. Também é homeotérmico e tem diafragma para respirar.', em: { a: [83, 45] }, z: 2.6 },
      { id: 'ope', c: '#FFD43B', t: 'Opérculo do peixe ósseo', d: 'Uma placa óssea cobre as brânquias. O esqueleto é de osso e o corpo tem escamas e, em geral, bexiga natatória.', em: { b: [40, 52] }, z: 2.8 },
      { id: 'esc', c: '#CFE0FF', t: 'Escamas', d: 'As escamas protegem o corpo do peixe ósseo, que tem a cauda com lobos de tamanho parecido.', em: { b: [28, 43] }, z: 2.6 },
      { id: 'fen', c: '#F2B6C6', t: 'Fendas branquiais do tubarão', d: 'O tubarão tem fendas descobertas, sem opérculo. Seu esqueleto é de cartilagem, por isso ele é um condrictes.', em: { b: [73, 54] }, z: 3 },
      { id: 'cau', c: '#8FD8FF', t: 'Cauda do tubarão', d: 'A cauda é assimétrica, com o lobo de cima maior. Outros condrictes são as raias.', em: { b: [13, 34] }, z: 2.6 }
    ]
  });
})();
