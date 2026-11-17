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

  // Endócrino: glândulas passou para cenas-figura-endo-loco.js (viagem do hormônio, com esta figura como vista A).

  // ---------- Reprodutor: ciclo e prevenção agora em cenas-figura-repro.js (viagens sobre figuras novas) ----------

  // Locomotor: movimento passou para cenas-figura-endo-loco.js (viagem do comando motor, com esta figura como vista A).

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
