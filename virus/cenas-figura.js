/* LAB Vírus: figura de IA por padrão em 3 rotas sem 3D (Aurelius).
   Figura (figura-ia.js v2, vistas A e B, pontos e zoom) abre primeiro; o botão "Ver esquema" mostra a cena 2D antiga e "Ver figura" volta.
   O .js de cada imagem só entra na página quando a cena abre. Usa os globais do motor (SC, X, W, H, NAR, cap).
   Carregar antes de LAB_VIRUS_iniciar(). */
'use strict';
(function () {
  if (!window.LAB_FIGALT || !window.LAB_FIGIA) return;
  const MASK = { miolo: .86, borda: 1 };
  const amb = {
    SC, X: () => X, W: () => W, H: () => H, nar: () => NAR, tela: cv.parentNode, cap: html => cap(html),
    t: a => a[0], baixo: nar => nar ? 100 : 84,
    rot3d: 'Ver esquema', dica3d: '',
    esconder: ['.hud.onde'], esconderFig: ['.palco .ctl', '#extra']
  };

  // ================= NATUREZA =================
  LAB_FIGALT.cena(amb, 'natureza/vivo', {
    pref: 'virus', nome: 'Mosaico do tabaco e o vírus', mask: MASK,
    vistas: [
      ['a', 'natureza-vivo-a', 'Folha com mosaico', 'Folha de tabaco com a doença do mosaico: manchas claras e escuras e o limbo deformado'],
      ['b', 'natureza-vivo-b', 'Vírus ao microscópio', 'Vírus do mosaico do tabaco ao microscópio eletrônico: partículas em forma de bastão']
    ],
    hs: [
      { id: 'mos', c: '#A9C54A', t: 'Manchas de mosaico', d: 'Áreas verde-claras alternam com áreas verde-escuras. O vírus prejudica a clorofila nas células infectadas.', em: { a: [57, 56] }, z: 2.6 },
      { id: 'def', c: '#FFD43B', t: 'Folha deformada', d: 'A borda fica enrugada e irregular. A planta cresce menos e produz menos.', em: { a: [34, 40] }, z: 2.6 },
      { id: 'ner', c: '#8FD8FF', t: 'Nervura central', d: 'O vírus se espalha pelo suco da planta. Ivanovsky e Beijerinck mostraram que esse suco, mesmo filtrado, continuava infectando outras folhas.', em: { a: [50, 28] }, z: 2.6 },
      { id: 'bas', c: '#CFE0FF', t: 'Partícula em bastão', d: 'O vírus do mosaico do tabaco é um cilindro helicoidal: um RNA envolvido por proteínas repetidas. Foi o primeiro vírus visto ao microscópio eletrônico.', em: { b: [50, 40] }, z: 2.8 },
      { id: 'esc', c: '#FFA94D', t: 'Muito menor que uma célula', d: 'Cada bastão mede cerca de 300 nm de comprimento. Só aparece ao microscópio eletrônico e passa pelos filtros que seguram as bactérias.', em: { b: [28, 70] }, z: 2.6 },
      { id: 'sem', c: '#F2B6C6', t: 'Sem célula', d: 'A partícula não tem citoplasma nem metabolismo próprio. Só se multiplica dentro de uma célula hospedeira.', em: { b: [78, 30] }, z: 2.6 }
    ]
  });

  // ================= DOENÇAS =================
  LAB_FIGALT.cena(amb, 'doencas/arboviroses', {
    pref: 'virus', nome: 'Mosquito Aedes aegypti e criadouros', mask: MASK,
    vistas: [
      ['a', 'doencas-arboviroses-a', 'Aedes aegypti', 'Aedes aegypti: o mosquito que transmite dengue, zika e chikungunya'],
      ['b', 'doencas-arboviroses-b', 'Criadouros', 'Água parada em pneu, vaso e caixa-d\'água: lugares onde o mosquito põe ovos']
    ],
    hs: [
      { id: 'lira', c: '#FFD43B', t: 'Desenho em forma de lira', d: 'Faixas brancas no dorso do tórax identificam o Aedes aegypti.', em: { a: [51, 40] }, z: 2.8 },
      { id: 'pat', c: '#CFE0FF', t: 'Patas listradas', d: 'Anéis brancos nas patas dão ao mosquito o aspecto de listrado. Ele costuma picar de dia, principalmente de manhã e no fim da tarde.', em: { a: [53, 70] }, z: 2.6 },
      { id: 'prob', c: '#F28B8B', t: 'Fêmea que pica', d: 'Só a fêmea suga sangue, que ela precisa para amadurecer os ovos. Ao picar, transmite o vírus.', em: { a: [33, 34] }, z: 2.8 },
      { id: 'asa', c: '#8FD8FF', t: 'Asas', d: 'O Aedes voa pouco, em geral algumas centenas de metros. Por isso o foco costuma estar perto de onde a pessoa mora.', em: { a: [65, 39] }, z: 2.6 },
      { id: 'pneu', c: '#FFA94D', t: 'Pneu com água', d: 'A água da chuva fica parada dentro do pneu. Os ovos ficam na parede e eclodem quando a água sobe.', em: { b: [17, 76] }, z: 2.6 },
      { id: 'vaso', c: '#A9C54A', t: 'Prato de vaso', d: 'Basta um pouco de água no pratinho. Encher de areia ou virar o recipiente evita o criadouro.', em: { b: [48, 64] }, z: 2.8 },
      { id: 'cx', c: '#8FD8FF', t: 'Caixa-d\'água aberta', d: 'Caixa sem tampa acumula larvas. Mantê-la vedada e eliminar a água parada interrompe o ciclo do mosquito.', em: { b: [76, 48] }, z: 2.4 }
    ]
  });

  LAB_FIGALT.cena(amb, 'doencas/hepatites-hpv', {
    pref: 'virus', nome: 'Fígado e lesão causada pelo HPV', mask: MASK,
    vistas: [
      ['a', 'doencas-hepatites-hpv-a', 'Fígado sadio e cirrose', 'À esquerda, fígado saudável; à direita, fígado com cirrose, que pode ser consequência de hepatite crônica'],
      ['b', 'doencas-hepatites-hpv-b', 'Verruga do HPV', 'Verruga comum na mão, causada por um tipo de HPV, o papilomavírus humano']
    ],
    hs: [
      { id: 'sad', c: '#F28B8B', t: 'Fígado saudável', d: 'Superfície lisa e cor uniforme. O fígado filtra o sangue, produz bile e armazena nutrientes.', em: { a: [29, 45] }, z: 2.4 },
      { id: 'ves', c: '#A9C54A', t: 'Vesícula biliar', d: 'Guarda a bile produzida pelo fígado. A bile ajuda na digestão das gorduras.', em: { a: [19, 59] }, z: 2.8 },
      { id: 'cir', c: '#FFA94D', t: 'Fígado com cirrose', d: 'Superfície cheia de nódulos e menor que o normal. O tecido sadio é trocado por cicatriz (fibrose).', em: { a: [75, 45] }, z: 2.4 },
      { id: 'cau', c: '#FFD43B', t: 'Hepatite crônica', d: 'As hepatites B e C, quando duram anos, podem levar a cirrose e a câncer de fígado. A vacina protege contra A e B.', em: { a: [82, 36] }, z: 2.6 },
      { id: 'ver', c: '#F2B6C6', t: 'Verruga', d: 'Pequena elevação na pele causada por HPV. O vírus infecta as células da pele e faz com que se multipliquem.', em: { b: [49, 49] }, z: 3 },
      { id: 'pon', c: '#FFD43B', t: 'Pontos escuros', d: 'São pequenos vasos de sangue que se fecham dentro da lesão. A verruga comum costuma sumir sozinha ou com tratamento.', em: { b: [50, 54] }, z: 3.2 },
      { id: 'pel', c: '#8FD8FF', t: 'Contato com a pele', d: 'Esse HPV passa pelo contato direto com a pele. Outros tipos infectam mucosas e se ligam ao câncer de colo do útero, por isso existe a vacina.', em: { b: [28, 30] }, z: 2.4 }
    ]
  });
})();
