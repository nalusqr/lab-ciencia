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
  /* ===== Figura v3 (rodada Nalu): 7 telas que eram de primitivas viram figura de IA + animação leve por cima =====
     A animação (sobre) usa coordenadas em % da figura (R.pt) e respeita prefers-reduced-motion (mostra o quadro de maior sentido).
     A cena antiga (esquema 2D ou 3D) fica no botão ao lado. */
  const RED = LAB_FIGALT.RED, TAU3 = Math.PI * 2;
  const sg = (p, a, b) => Math.max(0, Math.min(1, (p - a) / (b - a)));
  const ez = v => { v = Math.max(0, Math.min(1, v)); return v * v * (3 - 2 * v); };
  const f1 = v => v - Math.floor(v);
  const brilho = (X, x, y, r, cor, a) => { X.save(); X.globalAlpha *= a; const g = X.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, cor); g.addColorStop(1, 'rgba(0,0,0,0)'); X.fillStyle = g; X.beginPath(); X.arc(x, y, r, 0, TAU3); X.fill(); X.restore(); };
  const anel = (X, x, y, r, cor, a, lw) => { X.save(); X.globalAlpha *= a; X.strokeStyle = cor; X.lineWidth = lw || 2; X.beginPath(); X.arc(x, y, r, 0, TAU3); X.stroke(); X.restore(); };
  const pto = (X, x, y, r, cor, a) => { X.save(); X.globalAlpha *= a; X.fillStyle = cor; X.beginPath(); X.arc(x, y, Math.max(.8, r), 0, TAU3); X.fill(); X.restore(); };
  const ao = (P, u) => { const n = P.length - 1, q = Math.max(0, Math.min(.9999, u)) * n, i = Math.floor(q), f = q - i; return [P[i][0] + (P[i + 1][0] - P[i][0]) * f, P[i][1] + (P[i + 1][1] - P[i][1]) * f]; };
  const tt = t => RED ? 6 : t;
  const amb3 = Object.assign({}, amb, { rot3d: undefined, dica3d: undefined });
  const fluxo = (X, R, T, P, cor, n, vel, off) => { for (let i = 0; i < n; i++) { const u = f1(T * vel + i / n + (off || 0)), p = ao(P, u); pto(X, p[0], p[1], R.s * .7, cor, RED ? .75 : Math.sin(u * Math.PI)); } };

  // ---------- Equinodermos: estrela-do-mar (adulto pentarradial) e larva bilateral ----------
  LAB_FIGALT.cena(amb, 'animalia/cordados', {
    pref: 'plantas-animais', nome: 'Estrela-do-mar e larva', mask: MASK,
    vistas: [['a', 'animalia-cordados-a', 'Adulto e larva', 'Estrela-do-mar vista por baixo, com cinco braços, e uma larva de simetria bilateral ao lado']],
    hs: [
      { id: 'boc', c: '#F28B8B', t: 'Boca no centro', d: 'Fica na face de baixo, no meio do disco. A estrela-do-mar abre o estômago para fora e digere a presa antes de engoli-la.', em: { a: [31, 51] }, z: 2.6 },
      { id: 'pod', c: '#8FD8FF', t: 'Pés ambulacrais', d: 'Fileiras de pés tubulares, parte do sistema ambulacral cheio de água. Funcionam como ventosas para andar e prender a presa.', em: { a: [44, 39] }, z: 3 },
      { id: 'bra', c: '#FFA94D', t: 'Cinco braços', d: 'No adulto a simetria é pentarradial, uma forma de simetria radial: o corpo se repete em cinco partes ao redor do centro.', em: { a: [31, 9] }, z: 2.2 },
      { id: 'esp', c: '#A9C54A', t: 'Espinhos da pele', d: 'A pele fica sobre um esqueleto interno de placas de calcário, com espinhos. Ter esqueleto interno calcário é marca dos equinodermos.', em: { a: [20, 78] }, z: 2.8 },
      { id: 'lar', c: '#CFE0FF', t: 'Larva bilateral', d: 'A larva nada livre e tem simetria bilateral, com lado direito e esquerdo. Isso mostra que o ancestral era bilateral e a simetria radial surgiu depois.', em: { a: [76, 48] }, z: 3 }
    ],
    sobre(R, X, t) {
      const T = tt(t), P = R.pt.bind(R), c = P(31, 51), ph = f1(T * .1);
      const pontas = [[31, 9], [54, 37], [46, 88], [16, 88], [8, 37]].map(q => P(q[0], q[1]));
      brilho(X, c[0], c[1], R.s * 8, '#F28B8B', RED ? .3 : .15 + .15 * Math.sin(T * 2.2));
      pontas.forEach((p, i) => {
        const on = RED ? 1 : ez(sg(ph, .1 + i * .1, .35 + i * .1)) * (1 - ez(sg(ph, .85, 1)));
        X.save(); X.globalAlpha *= .55 * on; X.strokeStyle = '#FFE08A'; X.lineWidth = 1.6; X.setLineDash([4, 5]); X.beginPath(); X.moveTo(c[0], c[1]); X.lineTo(p[0], p[1]); X.stroke(); X.restore();
        for (let k = 0; k < 3; k++) { const u = f1(T * .5 + k / 3 + i * .13); pto(X, c[0] + (p[0] - c[0]) * u * .9, c[1] + (p[1] - c[1]) * u * .9, R.s * .5, '#CFE9FF', RED ? .6 : Math.sin(u * Math.PI) * .9); }
      });
      const l = P(76, 48), a = P(76, 26), b = P(76, 72), on = RED ? 1 : .45 + .45 * Math.sin(T * 1.6);
      X.save(); X.globalAlpha *= on; X.strokeStyle = '#9BD0FF'; X.lineWidth = 1.8; X.setLineDash([5, 5]); X.beginPath(); X.moveTo(a[0], a[1]); X.lineTo(b[0], b[1]); X.stroke(); X.restore();
      brilho(X, l[0], l[1], R.s * 9, '#9BD0FF', RED ? .22 : .1 + .12 * Math.sin(T * 1.6));
    }
  });

  // ---------- Cnidário: anêmona-do-mar em corte ----------
  LAB_FIGALT.cena(amb3, 'animalia/novidades', {
    pref: 'plantas-animais', nome: 'Anêmona-do-mar em corte', mask: MASK,
    vistas: [['a', 'animalia-novidades-a', 'Cnidário em corte', 'Anêmona-do-mar cortada ao meio, com tentáculos, boca, faringe e a cavidade digestiva única']],
    hs: [
      { id: 'ten', c: '#FFA94D', t: 'Tentáculos com cnidócitos', d: 'Os tentáculos têm cnidócitos, células com um filamento urticante que paralisa a presa. É a marca dos cnidários.', em: { a: [51, 16] }, z: 2.6 },
      { id: 'boc', c: '#F28B8B', t: 'Boca única', d: 'A boca é a única abertura do corpo: por ela entra o alimento e saem os restos. O tubo digestório é incompleto.', em: { a: [50, 33] }, z: 3 },
      { id: 'far', c: '#FFD43B', t: 'Faringe', d: 'Um tubo curto leva o alimento da boca até a cavidade do corpo.', em: { a: [50, 44] }, z: 3 },
      { id: 'cav', c: '#8FD8FF', t: 'Cavidade gastrovascular', d: 'Nela o alimento é digerido e os nutrientes se espalham pelo corpo. A digestão começa fora das células e termina dentro delas.', em: { a: [50, 62] }, z: 2.4 },
      { id: 'sep', c: '#C9AEFF', t: 'Septos', d: 'Dobras da parede do corpo que se projetam para dentro e aumentam a superfície de digestão.', em: { a: [56, 54] }, z: 3 },
      { id: 'par', c: '#A9C54A', t: 'Parede em duas camadas', d: 'O corpo tem epiderme (de ectoderme) e gastroderme (de endoderme), com uma camada gelatinosa entre elas. Por isso o cnidário é diblástico.', em: { a: [41, 63] }, z: 3 },
      { id: 'bas', c: '#F2B6C6', t: 'Disco pedal', d: 'A base achatada gruda na rocha. A anêmona é um pólipo, forma fixa e sem natação.', em: { a: [49, 80] }, z: 2.6 }
    ],
    sobre(R, X, t) {
      const T = tt(t), P = R.pt.bind(R);
      const rota = [P(40, 16), P(46, 27), P(50, 33), P(50, 44), P(50, 56), P(46, 63)];
      fluxo(X, R, T, rota, '#FFE08A', 6, .14);
      const m = P(50, 33), ph = f1(T * .25);
      brilho(X, m[0], m[1], R.s * 7, '#F28B8B', RED ? .3 : .1 + .22 * Math.sin(ph * Math.PI));
      [[51, 16], [37, 24], [66, 26]].forEach((q, i) => { const p = P(q[0], q[1]), k = f1(T * .35 + i * .33); anel(X, p[0], p[1], R.s * (2 + 4 * k), '#FFA94D', RED ? .35 : .7 * (1 - k), 1.6); });
    }
  });

  // ---------- Poríferos e cnidários: esponja, água-viva e hidra ----------
  LAB_FIGALT.cena(amb3, 'animalia/poriferos-cnidarios', {
    pref: 'plantas-animais', nome: 'Esponja, água-viva e hidra', mask: MASK,
    vistas: [['a', 'animalia-poriferos-cnidarios-a', 'Esponja e cnidários', 'Esponja em corte com poros, coanócitos e ósculo; água-viva e hidra à direita']],
    hs: [
      { id: 'por', c: '#8FD8FF', t: 'Poros', d: 'A água entra pelos poros da parede. Poríferos quer dizer animais com poros.', em: { a: [14.5, 60] }, z: 3 },
      { id: 'coa', c: '#FFA94D', t: 'Coanócitos', d: 'Células com colar e flagelo que revestem a cavidade. O flagelo cria a corrente de água e o colar prende as partículas de alimento.', em: { a: [32, 39] }, z: 3 },
      { id: 'esp', c: '#C9AEFF', t: 'Átrio (espongiocele)', d: 'Cavidade central por onde a água sobe. A esponja não tem tecidos verdadeiros nem sistema digestório.', em: { a: [25, 42] }, z: 2.8 },
      { id: 'osc', c: '#F28B8B', t: 'Ósculo', d: 'Grande abertura no alto, por onde a água sai. A esponja é filtradora e vive fixa.', em: { a: [25, 10] }, z: 3 },
      { id: 'med', c: '#CFE0FF', t: 'Água-viva (medusa)', d: 'Forma livre e nadadora do cnidário, com corpo em sino e simetria radial. Tem cnidócitos e boca única.', em: { a: [73, 20] }, z: 2.6 },
      { id: 'ten', c: '#FFD43B', t: 'Tentáculos', d: 'Longos e cheios de cnidócitos, que causam as queimaduras de contato nas águas-vivas.', em: { a: [69, 49] }, z: 2.8 },
      { id: 'hid', c: '#A9C54A', t: 'Hidra (pólipo)', d: 'Forma fixa de cnidário. Tem corpo em tubo, boca cercada de tentáculos e pode se reproduzir por brotamento, como o broto na lateral.', em: { a: [84, 56] }, z: 2.8 }
    ],
    sobre(R, X, t) {
      const T = tt(t), P = R.pt.bind(R);
      fluxo(X, R, T, [P(10, 62), P(18, 61), P(25, 56), P(25, 38), P(25, 20), P(25, 5)], '#8FD8FF', 7, .13);
      fluxo(X, R, T, [P(11, 40), P(17, 41), P(25, 42), P(25, 24), P(25, 8)], '#8FD8FF', 5, .13, .3);
      const o = P(25, 10), k = f1(T * .3); anel(X, o[0], o[1], R.s * (3 + 5 * k), '#F28B8B', RED ? .4 : .7 * (1 - k), 1.6);
      const s = P(73, 20), pu = RED ? .5 : .5 + .5 * Math.sin(T * 2);
      brilho(X, s[0], s[1], R.s * (13 + 3 * pu), '#CFE0FF', .1 + .12 * pu);
      const h = P(84, 52), kk = f1(T * .4); anel(X, h[0], h[1], R.s * (2 + 4 * kk), '#A9C54A', RED ? .4 : .7 * (1 - kk), 1.6);
    }
  });

  // ---------- Angiospermas: flor com cálice, corola, androceu e gineceu ----------
  LAB_FIGALT.cena(amb3, 'plantae/angiospermas', {
    pref: 'plantas-animais', nome: 'Flor em corte longitudinal', mask: MASK,
    vistas: [['a', 'plantae-angiospermas-a', 'Flor em corte', 'Flor cortada ao meio, com sépalas, pétalas, estames e o carpelo com óvulos']],
    hs: [
      { id: 'est', c: '#F28B8B', t: 'Estigma', d: 'Ponta do carpelo, em geral pegajosa, que recebe o grão de pólen. A chegada do pólen ao estigma é a polinização.', em: { a: [50, 9] }, z: 3 },
      { id: 'sty', c: '#FFD43B', t: 'Estilete', d: 'Tubo que liga o estigma ao ovário. O tubo polínico cresce por dentro dele até chegar aos óvulos.', em: { a: [50, 33] }, z: 3 },
      { id: 'ova', c: '#A9C54A', t: 'Ovário com óvulos', d: 'Guarda os óvulos. Depois da fecundação, o óvulo vira semente e o ovário vira fruto. Só as angiospermas têm fruto.', em: { a: [50, 64] }, z: 3 },
      { id: 'ant', c: '#FFA94D', t: 'Antera', d: 'Parte do estame que produz os grãos de pólen. O conjunto dos estames forma o androceu, a parte masculina da flor.', em: { a: [57, 21] }, z: 3 },
      { id: 'fil', c: '#C9AEFF', t: 'Filete', d: 'Haste fina que sustenta a antera.', em: { a: [53, 39] }, z: 3 },
      { id: 'pet', c: '#F2B6C6', t: 'Pétalas', d: 'Formam a corola. Com cores e perfume, atraem polinizadores. Em outras flores, o vento poliniza e as pétalas são pequenas.', em: { a: [69, 39] }, z: 2.4 },
      { id: 'sep', c: '#8FD8FF', t: 'Sépalas', d: 'Folhas verdes e pequenas na base da flor. Formam o cálice e protegem o botão ainda fechado.', em: { a: [36, 66] }, z: 2.8 }
    ],
    sobre(R, X, t) {
      const T = tt(t), P = R.pt.bind(R), ph = (T % 9) / 9;
      const ants = [[41, 17], [44, 17], [57, 21], [59, 22]].map(q => P(q[0], q[1])), est = P(50, 9), ov = P(50, 64);
      if (RED) { ants.forEach((a, i) => { const u = .3 + i * .1; pto(X, a[0] + (est[0] - a[0]) * u, a[1] + (est[1] - a[1]) * u - R.s * 4 * Math.sin(u * Math.PI), R.s * .8, '#FFE08A', .8); }); }
      else {
        const v = ez(sg(ph, 0, .35));
        ants.forEach((a, i) => { if (v > 0 && v < 1) { const u = ez(v), x = a[0] + (est[0] - a[0]) * u, y = a[1] + (est[1] - a[1]) * u - Math.sin(u * Math.PI) * R.s * 7; pto(X, x, y, R.s * .8, '#FFE08A', Math.sin(u * Math.PI)); } });
        const tubo = ez(sg(ph, .38, .8)); if (tubo > 0 && tubo < 1) { const y = est[1] + (ov[1] - est[1]) * tubo; X.save(); X.strokeStyle = 'rgba(255,224,138,.8)'; X.lineWidth = 2.2; X.beginPath(); X.moveTo(est[0], est[1]); X.lineTo(est[0], y); X.stroke(); X.restore(); pto(X, est[0], y, R.s * 1, '#FFF2B8', 1); }
        const fe = ez(sg(ph, .8, .9)) * (1 - ez(sg(ph, .92, 1))); brilho(X, ov[0], ov[1], R.s * 9, '#A9C54A', .5 * fe); anel(X, ov[0], ov[1], R.s * (3 + 5 * fe), '#E8FFA8', .6 * fe, 1.8);
      }
      brilho(X, est[0], est[1], R.s * 5, '#F28B8B', RED ? .3 : .1 + .2 * sg(ph, .1, .4) * (1 - sg(ph, .5, .6)));
    }
  });

  // ---------- Conquista do ambiente terrestre: alga, musgo, samambaia, araucária, flor ----------
  const CONQ = [[7, 83], [40, 72], [62, 56], [75, 30], [86, 44]];
  LAB_FIGALT.cena(amb3, 'plantae/conquista', {
    pref: 'plantas-animais', nome: 'Da alga à flor', mask: false,
    vistas: [['a', 'plantae-conquista-a', 'Da água à terra', 'Alga na água, musgo, samambaia, araucária e planta com flores em uma paisagem que sobe da água para a terra']],
    hs: [
      { id: 'alg', c: '#8FD8FF', t: 'Algas verdes', d: 'Vivem na água, que sustenta o corpo e leva os gametas. Um grupo de algas verdes é o ancestral das plantas terrestres.', em: { a: [7, 83] }, z: 2.8 },
      { id: 'mus', c: '#A9C54A', t: 'Briófitas', d: 'Primeiras plantas na terra, sem vasos condutores. Pequenas e presas à umidade, porque o anterozoide nada até a oosfera.', em: { a: [40, 72] }, z: 2.8 },
      { id: 'sam', c: '#FFD43B', t: 'Pteridófitas', d: 'Têm vasos condutores, o que permite maior porte. Ainda dependem de água para a fecundação e se reproduzem por esporos.', em: { a: [62, 56] }, z: 2.8 },
      { id: 'ara', c: '#FFA94D', t: 'Gimnospermas', d: 'Têm sementes expostas e tubo polínico, e a fecundação já não depende de água. A araucária é um exemplo brasileiro.', em: { a: [75, 30] }, z: 2.4 },
      { id: 'ang', c: '#F28B8B', t: 'Angiospermas', d: 'Têm flor e fruto, que protege a semente e ajuda a dispersá-la. É o grupo mais numeroso de plantas hoje.', em: { a: [86, 44] }, z: 2.8 }
    ],
    sobre(R, X, t) {
      const T = tt(t), P = R.pt.bind(R), k = RED ? 4 : Math.floor((T / 2.2) % 5), ph = f1(T / 2.2);
      const cor = ['#8FD8FF', '#A9C54A', '#FFD43B', '#FFA94D', '#F28B8B'];
      const L = CONQ.map(q => P(q[0], q[1] - 8));
      X.save(); X.strokeStyle = 'rgba(232,237,247,.35)'; X.lineWidth = 1.5; X.setLineDash([3, 6]); X.beginPath(); L.forEach((p, i) => i ? X.lineTo(p[0], p[1]) : X.moveTo(p[0], p[1])); X.stroke(); X.restore();
      const u = RED ? 1 : (k + ez(sg(ph, .2, 1))) / 4.999, p = ao(L, Math.min(.999, u / 1.25 * 1.25 - 0));
      L.forEach((q, i) => pto(X, q[0], q[1], R.s * (i === k ? 1.5 : 1), cor[i], RED ? .8 : (i <= k ? .9 : .3)));
      const q = L[k]; brilho(X, q[0], q[1], R.s * 10, cor[k], RED ? .3 : .45 * Math.sin(ph * Math.PI)); anel(X, q[0], q[1], R.s * (3 + 5 * ph), cor[k], RED ? .5 : .8 * (1 - ph), 2);
    }
  });

  // ---------- Órgãos da planta: raiz, caule, folha, flor e fruto ----------
  LAB_FIGALT.cena(amb3, 'plantae/orgaos', {
    pref: 'plantas-animais', nome: 'Tomateiro: raiz, caule, folha, flor e fruto', mask: MASK,
    vistas: [['a', 'plantae-orgaos-a', 'Planta inteira', 'Tomateiro com raízes no solo em corte, caule, folhas, flores e um fruto maduro']],
    hs: [
      { id: 'rai', c: '#FFA94D', t: 'Raiz', d: 'Fixa a planta e absorve água e sais minerais pelos pelos absorventes. Esta é uma raiz pivotante, com um eixo principal e ramificações.', em: { a: [50, 83] }, z: 2.4 },
      { id: 'cau', c: '#FFD43B', t: 'Caule', d: 'Sustenta folhas, flores e frutos. Por dentro, o xilema leva água e sais da raiz às folhas, e o floema leva a seiva elaborada, com açúcares, das folhas para o resto da planta. Na animação, os pontos azuis sobem pelo xilema e os laranja descem pelo floema.', em: { a: [51, 39] }, z: 2.6 },
      { id: 'fol', c: '#A9C54A', t: 'Folha', d: 'É onde ocorre a fotossíntese, que usa luz, gás carbônico e água para produzir açúcar. Por pequenos poros, os estômatos, a folha troca gases e perde água.', em: { a: [60, 26] }, z: 2.6 },
      { id: 'flo', c: '#F28B8B', t: 'Flor', d: 'Órgão reprodutor da angiosperma. Depois da polinização e da fecundação, ela se transforma em fruto.', em: { a: [44, 25] }, z: 3 },
      { id: 'fru', c: '#FF7B7B', t: 'Fruto', d: 'O tomate é um fruto: vem do ovário da flor e guarda as sementes. Protege as sementes e ajuda a dispersá-las.', em: { a: [55, 43] }, z: 3 },
      { id: 'sol', c: '#C9AEFF', t: 'Solo em perfil', d: 'O solo é a fonte de água e de sais minerais. As raízes se espalham nele em busca desses recursos.', em: { a: [62, 65] }, z: 2.2 }
    ],
    sobre(R, X, t) {
      const T = tt(t), P = R.pt.bind(R);
      const xil = [P(50, 90), P(50, 77), P(50, 64), P(51, 52), P(51, 40), P(55, 28), P(60, 24)];
      const flo = [P(60, 24), P(55, 30), P(51, 40), P(51, 52), P(50, 64), P(50, 77)];
      fluxo(X, R, T, xil, '#8FD8FF', 8, .1);
      fluxo(X, R, T, flo, '#FFD08A', 5, .1, .25);
      const f = P(60, 26), k = f1(T * .3); brilho(X, f[0], f[1], R.s * 9, '#A9C54A', RED ? .25 : .1 + .15 * Math.sin(k * Math.PI));
    }
  });

  // ---------- Pteridófitas: samambaia com soros, báculo e rizoma ----------
  LAB_FIGALT.cena(amb3, 'plantae/pteridofitas', {
    pref: 'plantas-animais', nome: 'Samambaia com soros e rizoma', mask: MASK,
    vistas: [['a', 'plantae-pteridofitas-a', 'Samambaia', 'Samambaia com soros no verso das folhas, báculos jovens e rizoma no solo']],
    hs: [
      { id: 'sor', c: '#FFA94D', t: 'Soros', d: 'Pontos marrons no verso da folha. Cada soro é um grupo de esporângios, onde se formam os esporos por meiose.', em: { a: [36, 26] }, z: 3 },
      { id: 'fro', c: '#A9C54A', t: 'Fronde', d: 'A folha da samambaia. O corpo verde que vemos é o esporófito (2n), a fase dominante nas pteridófitas.', em: { a: [62, 23] }, z: 2.4 },
      { id: 'bac', c: '#F28B8B', t: 'Báculo', d: 'Folha nova, enrolada como um cajado. Ela se desenrola ao crescer.', em: { a: [70, 39] }, z: 3 },
      { id: 'riz', c: '#FFD43B', t: 'Rizoma', d: 'Caule que cresce horizontal, sob a terra ou rente a ela, e dá origem às folhas e às raízes. Tem vasos condutores, de xilema e floema.', em: { a: [47, 80] }, z: 3 },
      { id: 'rai', c: '#C9AEFF', t: 'Raízes', d: 'Saem do rizoma e absorvem água e sais minerais. A samambaia tem raiz, caule e folha verdadeiros.', em: { a: [65, 89] }, z: 2.8 }
    ],
    sobre(R, X, t) {
      const T = tt(t), P = R.pt.bind(R);
      const fontes = [[36, 26], [31, 42], [42, 34]].map(q => P(q[0], q[1]));
      fontes.forEach((o, j) => {
        for (let i = 0; i < 5; i++) {
          const u = f1(T * .1 + i / 5 + j * .27), dx = 8 + 20 * u + j * 2, x = o[0] - dx * R.s * .55, y = o[1] - R.s * 3 * u + Math.sin(u * 6 + i) * R.s * 1.2 + u * u * R.s * 18;
          pto(X, x, y, R.s * .5, '#FFD08A', RED ? .7 : Math.sin(u * Math.PI) * .9);
        }
      });
      const s = P(36, 26), k = f1(T * .3); brilho(X, s[0], s[1], R.s * 7, '#FFA94D', RED ? .3 : .12 + .2 * Math.sin(k * Math.PI));
    }
  });
})();
