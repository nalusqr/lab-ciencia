/* LAB Microrganismos e fungos: figura de IA por padrão em rotas sem 3D (Aurelius).
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

  // protoctista/protozooses: a figura agora vem de cenas-figura-protozooses.js (viagem de Chagas e malária)

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

  // ================= v3: Rhizopus no pão e portas de entrada das doenças bacterianas (Íris e Dry) =================
  const RED = window.LAB_FIGALT.RED, TAU = Math.PI * 2;
  const cl = (v, a, b) => Math.max(a, Math.min(b, v)), fr = v => v - Math.floor(v);
  const sg = (v, a, b) => cl((v - a) / (b - a), 0, 1), ez = u => u * u * (3 - 2 * u);
  const tt = t => RED ? 3.7 : t;
  const pto = (X, x, y, r, cor, a) => { X.save(); X.globalAlpha *= a == null ? 1 : a; X.fillStyle = cor; X.beginPath(); X.arc(x, y, Math.max(.3, r), 0, TAU); X.fill(); X.restore(); };
  const brilho = (X, x, y, r, cor, a) => { const g = X.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, cor); g.addColorStop(1, 'rgba(0,0,0,0)'); X.save(); X.globalAlpha *= a == null ? 1 : a; X.fillStyle = g; X.beginPath(); X.arc(x, y, r, 0, TAU); X.fill(); X.restore(); };
  const anel = (X, x, y, r, cor, a, lw) => { X.save(); X.globalAlpha *= a; X.strokeStyle = cor; X.lineWidth = lw || 2; X.beginPath(); X.arc(x, y, r, 0, TAU); X.stroke(); X.restore(); };
  const amb3 = Object.assign({}, amb, { rot3d: 'Ver em 3D', dica3d: undefined });
  const MASK2 = { miolo: .94, borda: 1 };

  LAB_FIGALT.cena(amb3, 'fungi/fungos', {
    pref: 'microrganismos', nome: 'Bolor Rhizopus no pão', mask: MASK2,
    vistas: [['a', 'fungi-fungos-a', 'Bolor no pão', 'Fatia de pão mofada, à esquerda, e ampliação do Rhizopus com hifas, estolões, rizoides e esporângios, à direita']],
    hs: [
      { id: 'pao', c: '#E8C99A', t: 'Pão mofado', d: 'As manchas escuras são colônias de bolor. O pão úmido e morno é alimento e abrigo para os esporos que vêm do ar.', em: { a: [22, 50] }, z: 2.4 },
      { id: 'esp', c: '#CFE0FF', t: 'Esporângio', d: 'A bolinha preta no alto da haste é o esporângio. Ele produz esporos por mitose, e a cor escura vem dos esporos amadurecidos. O Rhizopus é um zigomiceto.', em: { a: [81, 16] }, z: 3 },
      { id: 'abe', c: '#F2C14E', t: 'Esporângio aberto', d: 'Quando o esporângio se rompe, os esporos leves se soltam e o ar os espalha. Se caírem em outro alimento úmido, germinam e formam novas hifas.', em: { a: [64, 14] }, z: 3 },
      { id: 'hastes', c: '#A9C54A', t: 'Hastes que sobem', d: 'Cada haste ereta (esporangióforo) é uma hifa especializada que leva o esporângio para cima, onde o vento espalha melhor os esporos.', em: { a: [76, 30] }, z: 2.6 },
      { id: 'est', c: '#8FD8FF', t: 'Hifas na superfície', d: 'As hifas que correm sobre o pão, os estolões, avançam e se fixam em novos pontos. Hifas do Rhizopus não têm paredes divisórias completas: formam um tubo contínuo com muitos núcleos.', em: { a: [73, 51] }, z: 2.6 },
      { id: 'miz', c: '#FF9F6B', t: 'Micélio e rizoides', d: 'Dentro do pão, as hifas ramificadas formam o micélio. Elas liberam enzimas e absorvem os nutrientes já digeridos: a digestão é feita fora do corpo do fungo.', em: { a: [62, 74] }, z: 2.6 }
    ],
    sobre(R, X, t) {
      const T = tt(t), P = R.pt.bind(R), s = R.s;
      // nutrientes absorvidos pelas hifas sobem pela haste até o esporângio
      const rz = P(62, 74), ba = P(62, 56), ha = P(62, 33), es = P(64, 18);
      for (let i = 0; i < 7; i++) {
        const u = fr(T * .1 + i / 7), seg = u < .4 ? [rz, ba, u / .4] : u < .7 ? [ba, ha, (u - .4) / .3] : [ha, es, (u - .7) / .3];
        pto(X, seg[0][0] + (seg[1][0] - seg[0][0]) * seg[2], seg[0][1] + (seg[1][1] - seg[0][1]) * seg[2], s * .5, '#FFE8A8', RED ? .8 : Math.sin(u * Math.PI) * .95);
      }
      brilho(X, rz[0], rz[1], s * 7, '#FF9F6B', RED ? .25 : .12 + .12 * Math.sin(T * 2));
      // esporos saindo do esporângio aberto, levados pelo ar
      const ab = P(64, 14);
      for (let i = 0; i < 12; i++) { const u = fr(T * .12 + i / 12), x = ab[0] + Math.sin(i * 2.7) * s * 2 + u * s * (6 + (i % 4) * 2), y = ab[1] - u * s * 9 + Math.sin(u * 7 + i) * s * .8; pto(X, x, y, s * (.5 - .2 * u), '#D8D8C8', RED ? .6 : .85 * Math.sin(u * Math.PI)); }
      // esporos do pão chegando ao ar
      const pa = P(22, 40);
      for (let i = 0; i < 6; i++) { const u = fr(T * .09 + i / 6 + .3), x = pa[0] + u * s * 22 + Math.sin(i * 3) * s * 2, y = pa[1] - u * s * 10 - Math.sin(u * 5 + i) * s; pto(X, x, y, s * .4, '#C8CDB8', RED ? .5 : .55 * Math.sin(u * Math.PI)); }
    }
  });

  LAB_FIGALT.cena(amb, 'monera/doencas', {
    pref: 'microrganismos', nome: 'Corpo humano e portas de entrada das bactérias', mask: false,
    vistas: [['a', 'monera-doencas-a', 'Portas de entrada', 'Silhueta do corpo com pulmões, intestino, pelve, nervo do cotovelo, mancha na pele, ferimento no pé e carrapato']],
    hs: [
      { id: 'pul', c: '#8FD8FF', t: 'Pulmões: tuberculose', d: 'O Mycobacterium tuberculosis entra pelo ar, nas gotículas de quem tosse, e ataca sobretudo os pulmões. Tem cura, com antibióticos por pelo menos seis meses. A vacina BCG protege contra as formas graves na criança.', em: { a: [44, 26] }, z: 3 },
      { id: 'int', c: '#F2C14E', t: 'Intestino: cólera e febre tifoide', d: 'O Vibrio cholerae e a Salmonella Typhi vêm de água e alimentos contaminados por fezes. A cólera causa diarreia intensa, tratada com soro de reidratação oral. Saneamento e água tratada previnem.', em: { a: [50, 42] }, z: 3 },
      { id: 'pel', c: '#F2B6C6', t: 'Pele: hanseníase', d: 'O Mycobacterium leprae causa manchas na pele com perda de sensibilidade. Passa só por contato próximo e prolongado, e deixa de passar quando o tratamento começa. Tem cura, gratuita no SUS.', em: { a: [71, 41] }, z: 3.4 },
      { id: 'ner', c: '#FFA94D', t: 'Nervos periféricos', d: 'A bactéria da hanseníase também ataca os nervos. Por isso a pele perde a sensibilidade. Quanto mais cedo o diagnóstico, menos sequelas.', em: { a: [27, 43] }, z: 3.4 },
      { id: 'pel2', c: '#F28B8B', t: 'Pelve: sífilis', d: 'O Treponema pallidum passa pelo sexo e da gestante para o feto (sífilis congênita), por isso há teste no pré-natal. Trata-se com penicilina, e o preservativo previne.', em: { a: [49, 52] }, z: 3 },
      { id: 'pe', c: '#A9C54A', t: 'Ferimento: tétano e leptospirose', d: 'Esporos de Clostridium tetani do solo entram em ferimentos, e a toxina causa contrações musculares: previne-se com vacina e reforço a cada dez anos. A leptospirose vem da urina de ratos na água de enchente e entra pela pele, sobretudo com feridas.', em: { a: [42, 94] }, z: 3.4 },
      { id: 'car', c: '#C9AEFF', t: 'Carrapato: febre maculosa', d: 'A Rickettsia rickettsii passa pela picada do carrapato-estrela, que vive em cavalos e capivaras, em áreas de mata e beira de rio. A capivara não passa a doença direto para as pessoas: quem transmite é o carrapato.', em: { a: [82, 37] }, z: 3.4 }
    ],
    sobre(R, X, t) {
      const T = tt(t), P = R.pt.bind(R), s = R.s;
      const pts = [[P(44, 26), '#8FD8FF', 7], [P(50, 42), '#F2C14E', 6], [P(71, 41), '#F2B6C6', 4], [P(27, 43), '#FFA94D', 3.5], [P(49, 52), '#F28B8B', 5], [P(42, 94), '#A9C54A', 4], [P(82, 37), '#C9AEFF', 3.5]];
      const k = RED ? -1 : Math.floor(T / 1.8) % pts.length, ph = fr(T / 1.8);
      pts.forEach(([p, cor, r], i) => { const on = RED || i === k; brilho(X, p[0], p[1], s * (r + 3), cor, on ? (RED ? .3 : .4 * Math.sin(ph * Math.PI)) : 0); if (on) anel(X, p[0], p[1], s * (r * .7 + ph * 4), cor, RED ? .5 : .8 * (1 - ph), 2); });
      // ar entrando pela traqueia até os pulmões
      const a0 = P(49, 15), a1 = P(47, 24);
      for (let i = 0; i < 4; i++) { const u = fr(T * .25 + i / 4); pto(X, a0[0] + (a1[0] - a0[0]) * u, a0[1] + (a1[1] - a0[1]) * u, s * .4, '#CFE8FF', RED ? .6 : Math.sin(u * Math.PI)); }
      // carrapato caminhando até a pele do braço
      const c0 = P(82, 37), c1 = P(70, 35);   // vai ao braço, não à mancha da hanseníase
      for (let i = 0; i < 3; i++) { const u = fr(T * .2 + i / 3); pto(X, c0[0] + (c1[0] - c0[0]) * u, c0[1] + (c1[1] - c0[1]) * u, s * .35, '#E3D2FF', RED ? .6 : Math.sin(u * Math.PI)); }
    }
  });
})();
