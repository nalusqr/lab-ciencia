/* LAB Microrganismos e fungos: figura de IA por padrão em 2 rotas sem 3D (Aurelius).
   Figura (figura-ia.js v2, vistas A e B, pontos e zoom) abre primeiro; o botão "Ver esquema" mostra a cena 2D antiga e "Ver figura" volta.
   O .js de cada imagem só entra na página quando a cena abre. Usa os globais do motor (SC, X, W, H, NAR, cap).
   Carregar antes de LAB_MICRO_iniciar(). */
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

  // ================= PROTOCTISTA =================
  LAB_FIGALT.cena(amb, 'protoctista/protozooses', {
    pref: 'microrganismos', nome: 'Barbeiro, casa de pau a pique e mosquito Anopheles', mask: MASK,
    vistas: [
      ['a', 'protoctista-protozooses-a', 'Barbeiro', 'Barbeiro (Triatoma) sobre a parede de barro de uma casa de pau a pique: vetor da doença de Chagas'],
      ['b', 'protoctista-protozooses-b', 'Anopheles', 'Mosquito Anopheles pousado com o abdome inclinado para cima: vetor da malária']
    ],
    hs: [
      { id: 'cab', c: '#F28B8B', t: 'Cabeça cônica e tromba', d: 'O barbeiro é um inseto hematófago. A tromba fina perfura a pele para sugar sangue, em geral à noite.', em: { a: [41, 46] }, z: 2.8 },
      { id: 'con', c: '#FFA94D', t: 'Bordas do abdome listradas', d: 'Faixas alaranjadas e escuras no contorno do abdome ajudam a reconhecer o Triatoma. O inseto tem seis patas, como todo inseto.', em: { a: [66, 50] }, z: 2.6 },
      { id: 'fez', c: '#FFD43B', t: 'Fezes e o Trypanosoma cruzi', d: 'O barbeiro costuma defecar logo depois de picar. O protozoário vai nas fezes e entra pela ferida ou pelas mucosas, causando a doença de Chagas.', em: { a: [58, 58] }, z: 2.6 },
      { id: 'par', c: '#A9C54A', t: 'Casa de pau a pique', d: 'Frestas na parede de barro, entre as varas de madeira, abrigam o barbeiro durante o dia. Reboco, telhado e casa de alvenaria eliminam o abrigo.', em: { a: [26, 74] }, z: 2.4 },
      { id: 'abd', c: '#F28B8B', t: 'Abdome inclinado', d: 'O Anopheles pousa com o abdome erguido, quase em ângulo com a superfície. O Aedes e o Culex pousam com o corpo paralelo.', em: { b: [80, 26] }, z: 2.6 },
      { id: 'pal', c: '#8FD8FF', t: 'Cabeça, palpos e tromba', d: 'Os palpos são longos, quase do tamanho da tromba. A fêmea suga sangue ao entardecer e à noite.', em: { b: [38, 55] }, z: 2.8 },
      { id: 'pla', c: '#FFD43B', t: 'Fêmea e o Plasmodium', d: 'Só a fêmea pica. Ao picar, transmite o Plasmodium, o protozoário que causa a malária. O ciclo do mosquito depende de água parada limpa.', em: { b: [54, 38] }, z: 2.6 }
    ]
  });

  // ================= FUNGI =================
  LAB_FIGALT.cena(amb, 'fungi/liquens', {
    pref: 'microrganismos', nome: 'Liquens em casca de árvore e em rocha', mask: MASK,
    vistas: [
      ['a', 'fungi-liquens-a', 'Casca de árvore', 'Liquens foliosos e crostosos sobre a casca de uma árvore'],
      ['b', 'fungi-liquens-b', 'Rocha', 'Liquens crostosos, folioso e fruticoso sobre uma rocha']
    ],
    hs: [
      { id: 'fol', c: '#8FD8FF', t: 'Líquen folioso', d: 'O talo achatado e lobado lembra uma folha e se destaca do substrato com facilidade.', em: { a: [29, 42], b: [55, 62] }, z: 2.4 },
      { id: 'cro', c: '#FFD43B', t: 'Líquen crostoso', d: 'Forma uma crosta fundida ao substrato, difícil de remover sem levar um pedaço da casca ou da rocha.', em: { a: [62, 72], b: [22, 35] }, z: 2.6 },
      { id: 'apo', c: '#FFA94D', t: 'Discos reprodutivos', d: 'Os pequenos discos (apotécios) são estruturas do fungo que produzem esporos. A associação com a alga também se espalha por pedaços do talo.', em: { a: [70, 73] }, z: 3 },
      { id: 'sub', c: '#CFE0FF', t: 'Casca da árvore', d: 'O líquen só usa a casca como apoio e não parasita a árvore. Alga e fungo juntos fazem o líquen: a alga faz fotossíntese e o fungo protege e retém água.', em: { a: [14, 70] }, z: 2.4 },
      { id: 'fru', c: '#A9C54A', t: 'Líquen fruticoso', d: 'O talo ramificado cresce ereto, como um arbusto minúsculo. É o tipo mais sensível à poluição do ar.', em: { b: [73, 60] }, z: 2.6 },
      { id: 'roc', c: '#F2B6C6', t: 'Pioneiros da rocha', d: 'Os liquens liberam ácidos que atacam a rocha nua. É o primeiro passo para formar solo e permitir a chegada de musgos e plantas.', em: { b: [36, 86] }, z: 2.4 }
    ]
  });
})();
