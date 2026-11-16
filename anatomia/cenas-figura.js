/* LAB Anatomia: figura de IA por padrão em 3 rotas sem 3D (Aurelius).
   Figura (figura-ia.js v2, vistas A e B, pontos e zoom) abre primeiro; o botão "Ver esquema" mostra a cena 2D e "Ver figura" volta.
   O .js de cada imagem só entra na página quando a cena abre. Usa os globais do motor (SC, X, W, H, NAR, cap, cv).
   Carregar depois de figura-alterna.js e antes de LAB_ANATOMIA_iniciar(). */
'use strict';
(function () {
  if (!window.LAB_FIGALT || !window.LAB_FIGIA) return;
  const MASK = { miolo: .94, borda: 1 };
  const SEM = false;   // as figuras novas já vêm com a borda esfumada no azul-noite do palco
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
      ['b', 'nervoso-organizacao-b2', 'Arco reflexo', 'Corte transversal da medula espinal com o arco reflexo, da pele ao músculo']
    ],
    hs: [
      { id: 'enc', c: '#FFD43B', t: 'Encéfalo', d: 'Cérebro, cerebelo e tronco encefálico, dentro do crânio. Com a medula, forma o sistema nervoso central (SNC).', em: { a: [50, 9] }, z: 3 },
      { id: 'med', c: '#FFA94D', t: 'Medula espinal', d: 'Cordão dentro da coluna vertebral. Liga o encéfalo aos nervos e comanda os reflexos. Também é parte do SNC.', em: { a: [50, 33] }, z: 2.8 },
      { id: 'plx', c: '#8FD8FF', t: 'Nervos do braço', d: 'Nervos espinais levam sensações da pele e dos músculos até a medula e trazem de volta as ordens de movimento.', em: { a: [41, 33] }, z: 2.6 },
      { id: 'cia', c: '#A9C54A', t: 'Nervo ciático', d: 'O maior nervo do corpo, na perna. Nervos e gânglios formam o sistema nervoso periférico (SNP).', em: { a: [46, 68] }, z: 2.8 },
      { id: 'rec', c: '#F2B6C6', t: 'Receptor na pele', d: 'Capta o estímulo, como calor ou dor, e começa o impulso no neurônio sensitivo.', em: { b: [12, 78] }, z: 3 },
      { id: 'gan', c: '#FFD43B', t: 'Gânglio da raiz dorsal', d: 'Dilatação da raiz dorsal onde ficam os corpos dos neurônios sensitivos. O impulso entra na medula por essa raiz.', em: { b: [33, 34] }, z: 3 },
      { id: 'int', c: '#8FD8FF', t: 'Interneurônio', d: 'Neurônio de associação na substância cinzenta. Passa o sinal do neurônio sensitivo ao motor.', em: { b: [54.5, 32.5] }, z: 3 },
      { id: 'cin', c: '#CFE0FF', t: 'Substância cinzenta', d: 'Região em forma de borboleta, com corpos de neurônios. Em volta fica a substância branca, com axônios.', em: { b: [68, 38] }, z: 2.6 },
      { id: 'mot', c: '#FFA94D', t: 'Neurônio motor e raiz ventral', d: 'O corpo do neurônio motor fica na medula e o axônio sai pela raiz ventral rumo ao músculo.', em: { b: [52.5, 42.5] }, z: 3 },
      { id: 'mus', c: '#F28B8B', t: 'Músculo efetor', d: 'Recebe a ordem do neurônio motor e se contrai. A resposta ocorre antes de a dor chegar ao cérebro.', em: { b: [48, 78] }, z: 3 }
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

  // =====================================================================
  // Figuras de IA v2 para as telas que eram desenho fraco (Íris + Aurelius).
  // Figura padrão, pontos tocáveis, motion leve por cima (sobre) e botão para a cena antiga (plano B).
  // Sem motion com prefers-reduced-motion: os marcadores ficam parados e a informação continua legível.
  // =====================================================================
  const RED = LAB_FIGALT.RED, PI = Math.PI;
  const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; };
  const mixc = (a, b, k) => { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16); const m = (s) => Math.round(((A >> s) & 255) * (1 - k) + ((B >> s) & 255) * k); return `rgb(${m(16)},${m(8)},${m(0)})`; };
  const ptsR = (R, P) => P.map(p => R.pt(p[0], p[1]));
  // ponto e ângulo na fração f (0 a 1) de uma linha quebrada já em pixels
  function ao(P, f) {
    let L = 0; const D = []; for (let i = 1; i < P.length; i++) { const d = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); D.push(d); L += d; }
    let s = Math.max(0, Math.min(1, f)) * L, i = 0; while (i < D.length - 1 && s > D[i]) { s -= D[i]; i++; }
    const u = D[i] ? s / D[i] : 0, a = P[i], b = P[i + 1];
    return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, Math.atan2(b[1] - a[1], b[0] - a[0])];
  }
  const dot = (X, x, y, r, cor, al) => { X.save(); X.globalAlpha = Math.max(0, Math.min(1, al)); X.beginPath(); X.arc(x, y, r, 0, PI * 2); X.fillStyle = cor; X.fill(); X.restore(); };
  // pontos que correm por um caminho (n pontos, v ciclos por segundo); parado no modo reduzido
  function fluxo(X, P, t, o) {
    const n = o.n || 6, tt = RED ? 0 : t;
    for (let i = 0; i < n; i++) {
      let f = (((tt * (o.v || .25) + i / n) % 1) + 1) % 1; if (o.rev) f = 1 - f;
      const q = ao(P, f), fade = Math.sin(PI * f) * (o.a == null ? .9 : o.a);
      dot(X, q[0], q[1], (o.r || 3) * 2.5, o.c, fade * .25);
      dot(X, q[0], q[1], o.r || 3, o.cf ? o.cf(f) : o.c, fade);
    }
  }
  // cometa: cabeça e rastro que percorrem o caminho e voltam a zero
  function cometa(X, P, t, o) {
    const tt = RED ? (o.par == null ? .45 : o.par) : ((t * (o.v || .2) + (o.off || 0)) % 1 + 1) % 1;
    for (let k = 0; k < 9; k++) { const f = tt - k * .018; if (f < 0 || f > 1) continue; const q = ao(P, f); dot(X, q[0], q[1], (o.r || 4) * (1 - k * .08), o.c, (1 - k / 9) * .85); }
    const q = ao(P, tt); dot(X, q[0], q[1], (o.r || 4) * 2.4, o.c, .18);
  }
  function anel(X, x, y, t, cor, per, rmax, off, al) {
    if (RED) { X.beginPath(); X.arc(x, y, rmax * .6, 0, PI * 2); X.strokeStyle = rgba(cor, .55); X.lineWidth = 1.5; X.stroke(); return; }
    const u = (((t + (off || 0)) / per) % 1 + 1) % 1;
    X.beginPath(); X.arc(x, y, 4 + rmax * (1 - Math.pow(1 - u, 3)), 0, PI * 2); X.strokeStyle = rgba(cor, (al == null ? .85 : al) * (1 - u)); X.lineWidth = 2; X.stroke();
  }
  function seta(X, x, y, ang, tam, cor, al) {
    X.save(); X.translate(x, y); X.rotate(ang); X.fillStyle = rgba(cor, al); X.beginPath(); X.moveTo(tam, 0); X.lineTo(-tam * .7, tam * .7); X.lineTo(-tam * .7, -tam * .7); X.closePath(); X.fill(); X.restore();
  }
  function trilhaTenue(X, P, cor, al, lw) { X.save(); X.setLineDash([2, 6]); X.lineCap = 'round'; X.strokeStyle = rgba(cor, al); X.lineWidth = lw || 1.5; X.beginPath(); P.forEach((p, i) => i ? X.lineTo(p[0], p[1]) : X.moveTo(p[0], p[1])); X.stroke(); X.restore(); }
  function leg(X, x, y, itens, nar, dir) {
    X.save(); X.font = `600 ${nar ? 12 : 13}px system-ui, -apple-system, "Segoe UI", sans-serif`; X.textBaseline = 'middle';
    const w = Math.max(...itens.map(i => X.measureText(i[1]).width)) + 34, h = itens.length * 20 + 10; if (dir) x = x - w;
    X.fillStyle = 'rgba(11,15,28,.78)'; X.beginPath(); X.roundRect ? X.roundRect(x, y, w, h, 8) : X.rect(x, y, w, h); X.fill();
    itens.forEach((it, i) => { dot(X, x + 14, y + 15 + i * 20, 4.5, it[0], 1); X.fillStyle = '#E8EDF7'; X.fillText(it[1], x + 26, y + 15 + i * 20); });
    X.restore();
  }

  // ---------- ambiente das rotas com 3D e modos (usado pelas cenas abaixo) ----------
  const amb3 = Object.assign({}, amb, { rot3d: 'Ver modelos e 3D', dica3d: 'Troque de modo nos botões do palco' });
  // a figura da hematose agora é a viagem do ar em cenas-figura-circ-resp.js (vias respiratórias e alvéolos)

  // ---------- Endócrino: glândulas ----------
  const GLD = [[49.6, 15.2, '#F2A65A'], [49.5, 30, '#F28B8B'], [46.4, 55.7, '#FFD43B'], [53.9, 55.2, '#FFD43B'], [50.9, 59.1, '#FFB347'], [45.2, 74.5, '#F2B6C6'], [54.8, 74.5, '#F2B6C6']];
  LAB_FIGALT.cena(amb3, 'endocrino/glandulas', {
    pref: 'anatomia', nome: 'Glândulas endócrinas', mask: SEM,
    vistas: [['a', 'endocrino-glandulas-a', 'Glândulas endócrinas', 'Corpo humano translúcido com as glândulas endócrinas acesas: hipotálamo e hipófise, tireoide, adrenais, pâncreas e ovários']],
    sobre(R, X, t) {
      const s = R.s;
      GLD.forEach((g, i) => {
        const p = R.pt(g[0], g[1]);
        anel(X, p[0], p[1], t, g[2], 3.4, s * 4.2, i * .47);
        if (RED) return;
        for (let k = 0; k < 4; k++) { // hormônio solto no sangue: pontinhos que se afastam da glândula
          const u = (((t / 3.4) + i * .13 + k * .25) % 1), a = i * 2.1 + k * 1.57 + .5, D = s * 6 * u;
          dot(X, p[0] + Math.cos(a) * D, p[1] + Math.sin(a) * D, 2.2, g[2], .85 * (1 - u));
        }
      });
    },
    hs: [
      { id: 'hip', c: '#F2A65A', t: 'Hipotálamo e hipófise', d: 'O hipotálamo, no encéfalo, liga o sistema nervoso ao endócrino. Ele comanda a hipófise, que libera hormônios que regulam outras glândulas e produz hormônios como o do crescimento.', em: { a: [49.6, 15.2] }, z: 3 },
      { id: 'tir', c: '#F28B8B', t: 'Tireoide e paratireoides', d: 'A tireoide, no pescoço, produz T3 e T4, que regulam o metabolismo. Atrás dela ficam as paratireoides, que controlam o cálcio do sangue.', em: { a: [49.5, 30] }, z: 3 },
      { id: 'adr', c: '#FFD43B', t: 'Adrenais (suprarrenais)', d: 'Ficam sobre os rins. A medula produz adrenalina, de ação rápida no estresse, e o córtex produz cortisol e aldosterona.', em: { a: [46.4, 55.7] }, z: 3 },
      { id: 'pan', c: '#FFB347', t: 'Pâncreas', d: 'Glândula mista: libera insulina e glucagon no sangue, que controlam a glicemia, e enzimas digestivas no duodeno.', em: { a: [51.5, 60] }, z: 3 },
      { id: 'ova', c: '#F2B6C6', t: 'Ovários', d: 'Produzem estrógeno e progesterona. Nos homens, o equivalente são os testículos, que produzem testosterona.', em: { a: [45.2, 74.5] }, z: 3 }
    ]
  });

  // ---------- Reprodutor ----------
  const OVO = [[88, 38.5], [92.5, 39], [95, 35], [95.5, 30], [93, 26], [89, 26.5], [85, 29], [80, 30.5], [76.5, 34], [74.5, 40], [73.5, 47]];
  const ESP = [[73.8, 76], [73.8, 66], [73.6, 59], [73.5, 50], [73, 42], [70, 34], [66, 31], [61, 30], [57, 27.5], [53, 26], [51.8, 29], [52.5, 36]];
  const ESM = [[20.5, 78], [20.8, 66], [19.5, 58], [18.2, 50], [17.2, 42], [17, 36], [18.5, 32], [24, 30.5], [29.5, 31.5], [31.2, 36], [30, 42], [27, 47], [25.8, 52], [18, 53], [12, 56], [9.5, 65], [9, 74]];
  const HSREP = [
    { id: 'tes', c: '#F28B8B', t: 'Testículo', d: 'Produz os espermatozoides nos túbulos seminíferos e a testosterona nas células intersticiais. Fica fora do abdome, na bolsa escrotal, onde a temperatura é cerca de 2 °C menor.', em: { a: [19.6, 74.2] }, z: 3 },
    { id: 'def', c: '#FFB347', t: 'Ducto deferente', d: 'Leva os espermatozoides do epidídimo até a uretra. Passa por cima da bexiga.', em: { a: [17.3, 42] }, z: 3 },
    { id: 'ves', c: '#FFD43B', t: 'Vesícula seminal', d: 'Produz parte do sêmen, um líquido rico em frutose que nutre os espermatozoides. A próstata também contribui com líquido.', em: { a: [32.7, 37.8] }, z: 3 },
    { id: 'pro', c: '#F2A65A', t: 'Próstata', d: 'Glândula em volta da uretra, logo abaixo da bexiga. Produz um líquido alcalino que compõe o sêmen.', em: { a: [25.4, 45.6] }, z: 3 },
    { id: 'bex', c: '#8FD8FF', t: 'Bexiga urinária', d: 'Guarda a urina. A uretra, que sai dela, passa pela próstata e pelo pênis, e leva urina e sêmen, nunca juntos.', em: { a: [24.7, 33.9] }, z: 2.8 },
    { id: 'ova', c: '#F2B6C6', t: 'Ovário', d: 'Guarda os folículos, libera o ovócito na ovulação e produz estrógeno e progesterona.', em: { a: [88, 38.5] }, z: 3 },
    { id: 'tub', c: '#FFB347', t: 'Tuba uterina', d: 'Recolhe o ovócito com as fímbrias e o leva ao útero. A fecundação costuma ocorrer aqui.', em: { a: [57, 28] }, z: 3 },
    { id: 'ute', c: '#F28B8B', t: 'Útero', d: 'Órgão muscular com a parede interna, o endométrio, que engrossa a cada ciclo. É onde o embrião se implanta.', em: { a: [73.4, 39] }, z: 2.8 },
    { id: 'col', c: '#CFE0FF', t: 'Colo do útero', d: 'Parte inferior e estreita do útero, que se abre para a vagina. O muco do colo muda ao longo do ciclo.', em: { a: [73.6, 60] }, z: 3 },
    { id: 'vag', c: '#F2B6C6', t: 'Vagina', d: 'Canal que liga o colo do útero ao exterior. Recebe o sêmen e é o canal do parto.', em: { a: [73.8, 72.9] }, z: 2.8 }
  ];
  LAB_FIGALT.cena(amb, 'reprodutor/ciclo', {
    pref: 'anatomia', nome: 'Sistemas genitais masculino e feminino', mask: SEM,
    vistas: [['a', 'reprodutor-ciclo-a', 'Cortes dos sistemas genitais', 'Corte do sistema genital masculino, de lado, e do feminino, de frente, com o caminho dos gametas']],
    sobre(R, X, t) {
      const Pf = ptsR(R, OVO), Ps = ptsR(R, ESP), Pm = ptsR(R, ESM);
      [[Pm, '#8FD8FF'], [Ps, '#8FD8FF'], [Pf, '#FFB347']].forEach(([P, c]) => trilhaTenue(X, P, c, .35, 1.3));
      cometa(X, Pm, t, { c: '#8FD8FF', v: .09, r: 3.6 }); cometa(X, Pm, t, { c: '#8FD8FF', v: .09, off: .5, r: 3.6, par: .3 });
      cometa(X, Ps, t, { c: '#8FD8FF', v: .09, r: 3.6, off: .15 });
      cometa(X, Pf, t, { c: '#FFB347', v: .09, r: 4.4, off: .1, par: .6 });
      const o = R.pt(88, 38.5); anel(X, o[0], o[1], t, '#FFB347', 4, R.s * 4, 0);
      if (R.w > 520) leg(X, R.x + R.w - 188, R.y + R.h - 58, [['#8FD8FF', 'espermatozoides'], ['#FFB347', 'ovócito']]);
    },
    hs: HSREP
  });
  LAB_FIGALT.cena(amb, 'reprodutor/prevencao', {
    pref: 'anatomia', nome: 'Onde os métodos agem', mask: SEM,
    vistas: [['a', 'reprodutor-ciclo-a', 'Cortes dos sistemas genitais', 'Sistemas genitais masculino e feminino, com os pontos em que cada tipo de método impede o encontro dos gametas ou a gravidez']],
    sobre(R, X, t) {
      const Pf = ptsR(R, OVO), Ps = ptsR(R, ESP);
      trilhaTenue(X, Ps, '#8FD8FF', .35, 1.3); trilhaTenue(X, Pf, '#FFB347', .35, 1.3);
      cometa(X, Ps, t, { c: '#8FD8FF', v: .09, r: 3.6 }); cometa(X, Pf, t, { c: '#FFB347', v: .09, r: 4.4, off: .1, par: .6 });
      // os métodos acendem um a um: ovulação, barreira no colo, útero, tubas e ducto deferente
      const alvo = [[88, 38.5, '#F28B8B'], [73.6, 60, '#CFE0FF'], [73.4, 38, '#FFD43B'], [57, 28, '#FFB347'], [17.3, 42, '#8FD8FF']];
      alvo.forEach((a, i) => { const p = R.pt(a[0], a[1]); anel(X, p[0], p[1], t, a[2], 5, R.s * 4.4, i * 1, .9); });
    },
    hs: [
      { id: 'ova', c: '#F28B8B', t: 'Ovário: métodos hormonais', d: 'Pílula, injeção, adesivo, anel e implante impedem a ovulação. Sem ovócito liberado, não há o que fecundar.', em: { a: [88, 38.5] }, z: 3 },
      { id: 'tub', c: '#FFB347', t: 'Tuba uterina: laqueadura', d: 'Na laqueadura, método cirúrgico, as tubas são cortadas ou fechadas. O ovócito e os espermatozoides não se encontram.', em: { a: [57, 28] }, z: 3 },
      { id: 'ute', c: '#FFD43B', t: 'Útero: DIU', d: 'O DIU, colocado dentro do útero, dificulta a passagem e a sobrevivência dos espermatozoides. O DIU hormonal também afina o endométrio.', em: { a: [73.4, 39] }, z: 2.8 },
      { id: 'col', c: '#CFE0FF', t: 'Colo do útero: barreira', d: 'Camisinha feminina e diafragma são barreiras que impedem a entrada dos espermatozoides. A camisinha, masculina ou feminina, também protege contra ISTs.', em: { a: [73.6, 60] }, z: 3 },
      { id: 'def', c: '#8FD8FF', t: 'Ducto deferente: vasectomia', d: 'Na vasectomia, método cirúrgico, os ductos deferentes são cortados. O sêmen deixa de levar espermatozoides, mas a ejaculação continua.', em: { a: [17.3, 42] }, z: 3 },
      { id: 'pen', c: '#CFE0FF', t: 'Pênis: camisinha masculina', d: 'A camisinha masculina cobre o pênis e retém o sêmen. Com a feminina, é o único tipo de método que também previne a maioria das ISTs, como HIV e sífilis.', em: { a: [11.6, 63.8] }, z: 3 }
    ]
  });

  // ---------- Locomotor: bíceps e tríceps ----------
  LAB_FIGALT.cena(amb, 'locomotor/movimento', {
    pref: 'anatomia', nome: 'Braço: bíceps e tríceps', mask: SEM,
    vistas: [['a', 'locomotor-movimento-a', 'Músculos do braço', 'Braço dobrado com bíceps, tríceps, úmero, rádio e ulna, vistos de lado']],
    sobre(R, X, t) {
      // ciclo de 6 s: flexão (bíceps contrai, tríceps relaxa) e extensão (o contrário)
      const u = RED ? .25 : (t / 6) % 1, flex = u < .5, k = Math.sin(PI * ((u * 2) % 1));
      const B = ptsR(R, [[30, 29], [39, 46], [48, 65]]), T = ptsR(R, [[24.5, 37], [33, 57], [43, 76]]);
      X.save(); X.globalCompositeOperation = 'lighter'; X.lineCap = 'round';
      const brilho = (P, cor, a, lw) => { X.strokeStyle = rgba(cor, a); X.lineWidth = lw; X.beginPath(); P.forEach((p, i) => i ? X.lineTo(p[0], p[1]) : X.moveTo(p[0], p[1])); X.stroke(); };
      brilho(B, '#FF9A3C', (flex ? .45 * k : .06) + (RED ? .25 : 0), R.s * 5.2);
      brilho(T, '#6EC8E8', (flex ? .04 : .4 * k) + (RED ? .2 : 0), R.s * 4.6);
      X.restore();
      // seta de puxão ao longo do bíceps e do tríceps e arco do antebraço em volta do cotovelo
      const cot = R.pt(44.5, 73);
      const a0 = flex ? .02 : -.9, a1 = flex ? -.9 : .02, ang = RED ? -.45 : a0 + (a1 - a0) * (k < 0 ? 0 : k), r = R.s * 17;
      X.save(); X.strokeStyle = rgba(flex ? '#FFB347' : '#6EC8E8', .85); X.lineWidth = 2; X.setLineDash([5, 5]); X.beginPath(); X.arc(cot[0], cot[1], r, a0, ang, a1 < a0); X.stroke(); X.setLineDash([]);
      const ex = cot[0] + Math.cos(ang) * r, ey = cot[1] + Math.sin(ang) * r; seta(X, ex, ey, ang + (a1 < a0 ? -PI / 2 : PI / 2), 7, flex ? '#FFB347' : '#6EC8E8', .95); X.restore();
      const pb = ao(B, .72); seta(X, pb[0], pb[1], pb[2] - PI, 7, '#FFB347', flex ? .95 : .25);
      const pt2 = ao(T, .72); seta(X, pt2[0], pt2[1], pt2[2] + PI, 7, '#6EC8E8', flex ? .25 : .95);
      leg(X, R.x + R.w - 232, R.y + 10, [[flex ? '#FFB347' : '#6EC8E8', flex ? 'Flexão: bíceps contrai' : 'Extensão: tríceps contrai']], R.w < 520);
    },
    hs: [
      { id: 'bic', c: '#FFB347', t: 'Bíceps braquial', d: 'Fica na frente do braço e tem duas cabeças, presas na escápula. Seu tendão prende no rádio. Ao contrair, flexiona o cotovelo.', em: { a: [39, 45] }, z: 2.6 },
      { id: 'tri', c: '#6EC8E8', t: 'Tríceps braquial', d: 'Fica atrás do braço e tem três cabeças. Seu tendão prende no olécrano da ulna. Ao contrair, estende o cotovelo.', em: { a: [27.5, 47] }, z: 2.6 },
      { id: 'umr', c: '#FFD43B', t: 'Úmero', d: 'Osso do braço. Ao dobrar e esticar o cotovelo ele fica parado, e quem se move como alavanca são o rádio e a ulna, puxados pelos tendões.', em: { a: [29.5, 36.6] }, z: 2.6 },
      { id: 'esc', c: '#CFE0FF', t: 'Escápula', d: 'Osso da cintura escapular. É onde começam as cabeças do bíceps e uma cabeça do tríceps.', em: { a: [15, 30] }, z: 2.6 },
      { id: 'olc', c: '#F28B8B', t: 'Olécrano da ulna', d: 'A ponta do cotovelo. Recebe o tendão do tríceps. O ponto de apoio da alavanca é a articulação do cotovelo, logo ao lado.', em: { a: [42.7, 79] }, z: 3 },
      { id: 'tbi', c: '#FFB347', t: 'Tendão do bíceps', d: 'Liga o bíceps ao rádio. Quando o músculo encurta, o tendão puxa o antebraço para cima.', em: { a: [48, 66] }, z: 3 },
      { id: 'ant', c: '#A9C54A', t: 'Músculos do antebraço', d: 'Movem o punho e os dedos por meio de tendões longos. Cada músculo só puxa, por isso o movimento contrário usa outro músculo.', em: { a: [67, 68] }, z: 2.6 }
    ]
  });

  // Nervoso: autônomo passou para cenas-figura-rim-nervo.js (viagem do impulso, com esta figura como uma das vistas).

  // ---------- Circulatório: sangue e linfa ----------
  const AFL = [[35, 23], [31, 52], [23, 73.5]], VFL = [[50, 82], [52, 61], [53.5, 39], [54, 19]];
  const CPL = [[71, 17], [69.5, 33], [69, 47], [72, 59], [78, 66], [85, 69]], VNL = [[89.5, 15], [91, 30], [92.2, 45], [92.5, 55], [91.5, 68]];
  const LFL = [[78.5, 76], [80, 66], [79, 53.8], [83, 41], [83.5, 27], [87, 22.4]];
  LAB_FIGALT.cena(amb, 'circulatorio/sangue-linfa', {
    pref: 'anatomia', nome: 'Artéria, veia, capilares e linfa', mask: SEM,
    vistas: [['a', 'circulatorio-sangue-linfa-a', 'Vasos em corte', 'Artéria com parede grossa, veia com válvulas e rede de capilares com um vaso linfático']],
    sobre(R, X, t) {
      fluxo(X, ptsR(R, AFL), t, { n: 4, v: .22, r: 6, c: '#FFB0B0' });
      fluxo(X, ptsR(R, VFL), t, { n: 4, v: .12, r: 6, c: '#C9C1FF' });
      fluxo(X, ptsR(R, CPL), t, { n: 4, v: .1, r: 5, c: '#FFB0B0' });
      fluxo(X, ptsR(R, VNL), t, { n: 3, v: .1, r: 5, c: '#C9C1FF' });
      fluxo(X, ptsR(R, LFL), t, { n: 3, v: .05, r: 5, c: '#FFE88A' });
      leg(X, R.x + 10, R.y + R.h - 64, [['#F2686B', 'sangue arterial'], ['#9C90F0', 'sangue venoso'], ['#FFE88A', 'linfa']]);
    },
    hs: [
      { id: 'art', c: '#F28B8B', t: 'Artéria', d: 'Parede grossa, com músculo liso e fibras elásticas, que suporta a pressão alta do sangue vindo do coração. Em geral leva sangue arterial, e a artéria pulmonar é a exceção.', em: { a: [16.8, 66] }, z: 3 },
      { id: 'hem', c: '#E5484D', t: 'Hemácias', d: 'Células que carregam o O₂ preso à hemoglobina. Dão a cor vermelha ao sangue.', em: { a: [21.8, 69.5] }, z: 3.2 },
      { id: 'vei', c: '#8E83E6', t: 'Veia', d: 'Parede mais fina e luz mais larga que a da artéria, com pressão baixa. Em geral leva sangue venoso de volta ao coração.', em: { a: [42.2, 68.4] }, z: 3 },
      { id: 'val', c: '#FFD43B', t: 'Válvulas da veia', d: 'Dobras em forma de bolsa que impedem o sangue de voltar. Ajudam o retorno, ao lado da contração dos músculos da perna.', em: { a: [50.1, 43] }, z: 3.2 },
      { id: 'ate', c: '#F28B8B', t: 'Arteríola', d: 'Pequena artéria que leva o sangue aos capilares e regula quanto passa por eles.', em: { a: [70.5, 19.5] }, z: 3 },
      { id: 'cap', c: '#F2B6C6', t: 'Capilares', d: 'Vasos de parede com uma só camada de células. Nelas, o sangue troca gases, nutrientes e resíduos com os tecidos.', em: { a: [72.7, 43] }, z: 3 },
      { id: 'lin', c: '#FFE88A', t: 'Capilar linfático', d: 'Começa fechado numa ponta e recolhe o líquido que sai dos capilares sanguíneos. Esse líquido, a linfa, volta ao sangue pelo sistema linfático.', em: { a: [82.8, 39] }, z: 3 },
      { id: 'vnl', c: '#8E83E6', t: 'Vênula', d: 'Pequena veia que recolhe o sangue dos capilares e o leva às veias maiores.', em: { a: [91.6, 43] }, z: 3 }
    ]
  });
})();
