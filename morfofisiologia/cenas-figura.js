/* LAB Morfofisiologia: 13 cenas com figura de IA interativa (Aurelius), usando figura-ia.js v2 (Biologia molecular).
   Cada cena troca só o visual (draw) da rota que o index.html já registra: lição, cards ENEM, rota e ordem ficam os mesmos.
   O .js de cada imagem só entra na página quando a cena abre (carga preguiçosa do figura-ia).
   O motion fica onde ensina: setas da água na osmose, DNA do fago entrando na bactéria, foco na cortiça de Hooke. */
'use strict';
(function () {
  const TAU = Math.PI * 2;
  const MASK = { miolo: .78, borda: .99 };
  const DICA = 'Toque nos pontos da figura para ver o que cada parte faz. Use + e - (ou a roda) para aproximar e os botões para trocar de vista.';

  (window.MORFO_CENAS = window.MORFO_CENAS || []).push(API => {
    if (!window.LAB_FIGIA) return;

    // registra uma cena: chave da rota, nome para leitores de tela, vistas [id, imagem, nome, legenda] e pontos
    function cena(chave, nome, vistas, hs, sobre) {
      const o = API.SC[chave]; if (!o) return;
      const F = LAB_FIGIA({
        nome, mask: MASK,
        vistas: vistas.map(v => ({ id: v[0], img: 'morfofisiologia-' + v[1], nome: v[2] })),
        hs
      });
      const legenda = {}; vistas.forEach(v => { legenda[v[0]] = v[3]; });
      o.ctl = null; o.tip = DICA; delete o.init;
      o.sair = function () { if (typeof window.cap === 'function') window.cap(''); };
      o.draw = function (t, S) {
        const W = API.W, H = API.H, X = API.X, nar = W < 600;
        const x0 = nar ? 6 : 24, y0 = nar ? 46 : 60, box = { x: x0, y: y0, w: W - 2 * x0, h: H - y0 - (nar ? 56 : 52) };
        F.desenhar(X, box, { sobre: sobre ? R => sobre(R, X, t) : null });
        if (typeof window.cap === 'function') window.cap(legenda[F.vistaAtual] || '');
      };
    }

    // ---------- ajudantes de motion ----------
    // setas curtas da água em volta de uma célula: dir +1 entra, -1 sai, 0 vai e volta em igual número
    function agua(R, X, cx, cy, rx, ry, dir, t, n) {
      const px = R.pt(cx, cy), kx = rx * R.s, ky = ry * R.s * R.h / R.w;
      X.save(); X.lineCap = 'round'; X.lineJoin = 'round';
      for (let i = 0; i < n; i++) {
        const a = i / n * TAU + .4, f = (t * .45 + i / n) % 1, al = Math.sin(f * Math.PI);
        const sentidos = dir === 0 ? [1, -1] : [dir];
        sentidos.forEach((d, j) => {
          const off = dir === 0 ? (j ? .06 : -.06) : 0, aa = a + off;
          const r0 = d > 0 ? 1.5 - .5 * f : 1.0 + .5 * f;
          const ux = Math.cos(aa), uy = Math.sin(aa);
          const x1 = px[0] + ux * kx * r0, y1 = px[1] + uy * ky * r0, x2 = px[0] + ux * kx * (d > 0 ? r0 - .18 : r0 + .18), y2 = px[1] + uy * ky * (d > 0 ? r0 - .18 : r0 + .18);
          X.strokeStyle = `rgba(143,216,255,${.9 * al})`; X.lineWidth = Math.max(2, R.s * .35);
          X.beginPath(); X.moveTo(x1, y1); X.lineTo(x2, y2); X.stroke();
          const hx = x2, hy = y2, ang = Math.atan2(y2 - y1, x2 - x1), L = Math.max(5, R.s * .9);
          X.beginPath(); X.moveTo(hx, hy); X.lineTo(hx - Math.cos(ang - .5) * L, hy - Math.sin(ang - .5) * L); X.moveTo(hx, hy); X.lineTo(hx - Math.cos(ang + .5) * L, hy - Math.sin(ang + .5) * L); X.stroke();
        });
      }
      X.restore();
    }
    const glow = (X, x, y, r, c) => { const g = X.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, c); g.addColorStop(1, 'rgba(0,0,0,0)'); X.fillStyle = g; X.beginPath(); X.arc(x, y, r, 0, TAU); X.fill(); };

    // ================= TEORIA CELULAR =================
    cena('teoria/hooke', 'Cortiça de Hooke e o microscópio antigo', [
      ['a', 'teoria-hooke-a', 'Cortiça na lente', 'A cortiça vista pela lente: paredes de células mortas'],
      ['b', 'teoria-hooke-b', 'Microscópio de Hooke', 'O microscópio de Hooke e o pedaço de cortiça']
    ], [
      { id: 'parede', c: '#C9A06A', t: 'Parede celular', d: 'Hooke viu só as paredes, como os muros de um favo. A cortiça é tecido morto, por isso as células estão vazias.', em: { a: [53, 45] }, z: 2.6 },
      { id: 'cela', c: '#E8C48A', t: 'Uma "cela"', d: 'Cada compartimento lembrou a Hooke as celas de um mosteiro. Daí o nome célula, do latim cella.', em: { a: [47, 47] }, z: 2.8 },
      { id: 'campo', c: '#CFE0FF', t: 'Campo de visão', d: 'Tudo o que está dentro do aro é o que o microscópio mostrava, com aumento de cerca de 30 vezes.', em: { a: [17, 46] }, z: 2 },
      { id: 'obj', c: '#8FD8FF', t: 'Lente objetiva', d: 'Pequena lente de vidro, bem curva, que formava a imagem ampliada da amostra.', em: { b: [46, 53] }, z: 2.6 },
      { id: 'tubo', c: '#F2B33D', t: 'Tubo de couro e latão', d: 'Mantinha a objetiva e a ocular alinhadas. O foco se ajustava subindo ou descendo o tubo.', em: { b: [52, 29] }, z: 2.2 },
      { id: 'luz', c: '#FFE1A6', t: 'Lente de iluminação', d: 'Concentrava a luz de uma lamparina sobre a amostra, para que desse para enxergar.', em: { b: [45, 71] }, z: 2.6 },
      { id: 'cortica', c: '#C9A06A', t: 'Fatia de cortiça', d: 'Casca do sobreiro. Hooke cortou fatias bem finas dela e examinou uma a uma, em 1665.', em: { b: [65, 83] }, z: 2.6 }
    ], (R, X, t) => {
      if (R.vista !== 'b' || R.k < .6) return;
      const [cx, cy] = R.pt(65, 83), [ox, oy] = R.pt(46, 53), p = (t * .6) % 1, r = R.s * (4 + 5 * p);
      X.strokeStyle = `rgba(255,225,166,${.7 * (1 - p)})`; X.lineWidth = 2; X.beginPath(); X.arc(cx, cy, r, 0, TAU); X.stroke();
      X.setLineDash([4, 6]); X.lineDashOffset = -t * 20; X.strokeStyle = 'rgba(255,225,166,.35)'; X.beginPath(); X.moveTo(cx, cy); X.lineTo(ox, oy); X.stroke(); X.setLineDash([]);
    });

    cena('teoria/leeuwenhoek', 'Gota de água e o microscópio de Leeuwenhoek', [
      ['a', 'teoria-leeuwenhoek-a', 'Gota ao microscópio', 'Seres vivos numa gota de água, vistos pela lente'],
      ['b', 'teoria-leeuwenhoek-b', 'Microscópio de uma lente', 'O microscópio de lente única de Leeuwenhoek']
    ], [
      { id: 'parame', c: '#8FD8FF', t: 'Paramécio', d: 'Protozoário de uma só célula, coberto de cílios, os pelos curtos que o fazem nadar.', em: { a: [36, 45] }, z: 2.4 },
      { id: 'alga', c: '#7FDA9C', t: 'Alga filamentosa', d: 'Fileira de células com cloroplastos. Faz fotossíntese, como as plantas.', em: { a: [59, 20] }, z: 2.4 },
      { id: 'rotifero', c: '#CFE0FF', t: 'Rotífero', d: 'Animal microscópico de água doce. Ao contrário dos protozoários ao redor, tem muitas células.', em: { a: [68, 48] }, z: 2.6 },
      { id: 'ameba', c: '#FFD43B', t: 'Ameba', d: 'Protozoário que se move esticando partes do corpo, os pseudópodes.', em: { a: [67, 75] }, z: 2.6 },
      { id: 'euglena', c: '#A9C54A', t: 'Euglena', d: 'Tem um flagelo para nadar e cloroplastos para a fotossíntese.', em: { a: [31, 74] }, z: 2.6 },
      { id: 'bact', c: '#F06AAE', t: 'Bactérias', d: 'Os pequenos bastões. São os menores seres que Leeuwenhoek descreveu, em 1676.', em: { a: [57, 47] }, z: 3 },
      { id: 'lente', c: '#8FD8FF', t: 'Lente única', d: 'Uma esfera de vidro minúscula, polida à mão. Aumentava até cerca de 270 vezes.', em: { b: [41, 28] }, z: 3 },
      { id: 'amostra', c: '#7FD1FF', t: 'Gota na ponta do alfinete', d: 'A amostra ficava na ponta de uma haste, bem diante da lente.', em: { b: [38, 38] }, z: 3 },
      { id: 'parafuso', c: '#F2B33D', t: 'Parafuso de ajuste', d: 'Girar o parafuso aproximava ou afastava a amostra, para ajustar o foco.', em: { b: [53, 60] }, z: 2.6 },
      { id: 'placa', c: '#C9A06A', t: 'Placa de latão', d: 'O aparelho cabia na mão. Leeuwenhoek encostava o olho na lente e olhava contra a luz.', em: { b: [31, 77] }, z: 2 }
    ]);

    cena('teoria/schleiden', 'Folha e girino: células em plantas e animais', [
      ['a', 'teoria-schleiden-a', 'Folha e girino', 'Planta e animal, ambos formados por células'],
      ['b', 'teoria-schleiden-b', 'Planta ao lado de animal', 'Tecido vegetal ao lado de tecido animal']
    ], [
      { id: 'folha', c: '#7FDA9C', t: 'Folha', d: 'Em 1838, o botânico Schleiden concluiu que todas as plantas são formadas por células.', em: { a: [16, 57] }, z: 2.2 },
      { id: 'cvegetal', c: '#A9C54A', t: 'Células vegetais', d: 'Cada célula tem parede e muitos cloroplastos verdes.', em: { a: [34, 27] }, z: 2.4 },
      { id: 'girino', c: '#FFD43B', t: 'Girino', d: 'Em 1839, o zoologista Schwann chegou à mesma ideia para os animais.', em: { a: [57, 60] }, z: 2.2 },
      { id: 'canimal', c: '#C9AEFF', t: 'Células animais', d: 'Não têm parede nem cloroplastos, mas cada uma tem núcleo.', em: { a: [80, 28] }, z: 2.4 },
      { id: 'parede', c: '#A9C54A', t: 'Parede celular', d: 'Reveste a célula vegetal por fora. As células animais não têm parede.', em: { b: [20, 42] }, z: 2.6 },
      { id: 'cloro', c: '#7FDA9C', t: 'Cloroplasto', d: 'Faz fotossíntese. Está nas células vegetais e nas das algas, não nas animais.', em: { b: [18, 29] }, z: 3 },
      { id: 'vacuolo', c: '#CFE0FF', t: 'Vacúolo central', d: 'Grande reservatório de água da célula vegetal adulta.', em: { b: [41, 41] }, z: 2.6 },
      { id: 'nucleo', c: '#9A6BFF', t: 'Núcleo da célula animal', d: 'Guarda o DNA. Plantas e animais têm núcleo: as duas células são eucariontes.', em: { b: [68, 37] }, z: 2.6 },
      { id: 'mito', c: '#F25C3B', t: 'Mitocôndria', d: 'Faz a respiração celular e libera a energia dos nutrientes na forma de ATP. Existe nos dois tipos de célula.', em: { b: [63, 44] }, z: 3.4 }
    ]);

    cena('teoria/virchow', 'Frasco de pescoço de cisne e divisão celular', [
      ['a', 'teoria-virchow-a', 'Frasco pescoço de cisne', 'O frasco de Pasteur: o caldo fervido não estraga'],
      ['b', 'teoria-virchow-b', 'Célula se dividindo', 'Toda célula vem de outra célula']
    ], [
      { id: 'caldo', c: '#E8C48A', t: 'Caldo fervido', d: 'Pasteur ferveu o caldo para matar os micróbios. Sem vida nova, o caldo ficou limpo.', em: { a: [25, 72] }, z: 2.4 },
      { id: 'pescoco', c: '#8FD8FF', t: 'Pescoço de cisne', d: 'O ar entra e sai pelo tubo, mas o caminho curvo prende a poeira e os micróbios.', em: { a: [40, 14] }, z: 2.4 },
      { id: 'poeira', c: '#C9A06A', t: 'Poeira retida', d: 'Os micróbios do ar ficam presos na curva e não chegam ao caldo. Isso refutou a geração espontânea.', em: { a: [62, 52] }, z: 3 },
      { id: 'nucleo', c: '#9A6BFF', t: 'Núcleo', d: 'O DNA foi copiado antes da divisão, e cada célula-filha recebe um conjunto completo.', em: { b: [29, 42] }, z: 2.4 },
      { id: 'ponte', c: '#F06AAE', t: 'Estrangulamento', d: 'A célula se aperta no meio e se separa em duas. Virchow resumiu em 1855: toda célula vem de outra célula.', em: { b: [51, 44] }, z: 3 },
      { id: 'mito', c: '#F25C3B', t: 'Mitocôndria', d: 'As organelas também são repartidas entre as duas células-filhas.', em: { b: [31, 23] }, z: 3 }
    ]);

    cena('teoria/virus', 'Bacteriófago e bactéria', [
      ['a', 'teoria-virus-a', 'Fagos sobre a bactéria', 'Bacteriófagos infectando uma bactéria (fora de escala: o fago tem cerca de 1/10 do comprimento dela)'],
      ['b', 'teoria-virus-b', 'Fago isolado', 'O bacteriófago por inteiro: capsídeo, cauda e fibras']
    ], [
      { id: 'fago', c: '#B9C2D3', t: 'Bacteriófago', d: 'Vírus que infecta bactérias. Não é uma célula: tem uma cápsula de proteína e uma cauda para injetar o material genético.', em: { a: [53, 21] }, z: 2.6 },
      { id: 'fibras', c: '#CFE0FF', t: 'Fibras da cauda', d: 'Reconhecem a bactéria certa e se prendem a proteínas da parede dela.', em: { a: [59, 39] }, z: 3 },
      { id: 'dna', c: '#9A6BFF', t: 'DNA injetado', d: 'Só o material genético entra. Dentro da bactéria, ele manda produzir novos vírus.', em: { a: [55, 53] }, z: 3.4 },
      { id: 'bact', c: '#FFA94D', t: 'Bactéria hospedeira', d: 'Os vírus só se multiplicam dentro de uma célula viva: são parasitas intracelulares obrigatórios.', em: { a: [74, 54] }, z: 2.2 },
      { id: 'capsideo', c: '#B9C2D3', t: 'Capsídeo', d: 'Cápsula de proteína que protege o DNA guardado dentro dela.', em: { b: [50, 20] }, z: 2.4 },
      { id: 'bainha', c: '#CFE0FF', t: 'Bainha da cauda', d: 'Se contrai e empurra o DNA para dentro da bactéria, como uma seringa.', em: { b: [50, 50] }, z: 2.4 },
      { id: 'placa', c: '#F2B33D', t: 'Placa basal', d: 'Prende o vírus à parede da bactéria antes da injeção.', em: { b: [50, 71] }, z: 3 },
      { id: 'pernas', c: '#8FD8FF', t: 'Fibras da cauda', d: 'As fibras da cauda ficam estendidas até o vírus encontrar a bactéria que ele infecta.', em: { b: [68, 67] }, z: 2.4 }
    ], (R, X, t) => {
      if (R.vista !== 'a' || R.k < .6) return;
      // o DNA descendo do fago para a bactéria: pontos de luz ao longo do trajeto
      const A = R.pt(55.4, 46), B = R.pt(53.4, 62);
      for (let i = 0; i < 4; i++) { const f = (t * .35 + i / 4) % 1, x = A[0] + (B[0] - A[0]) * f + Math.sin(f * 9 + i) * R.s * .35, y = A[1] + (B[1] - A[1]) * f; glow(X, x, y, R.s * 2.4, `rgba(201,174,255,${.75 * Math.sin(f * Math.PI)})`); }
    });

    // ================= PROCARIONTE E EUCARIONTE =================
    cena('tipos/lado', 'Bactéria e célula animal lado a lado', [
      ['a', 'tipos-lado-a', 'Célula animal e bactéria', 'A bactéria não tem organelas com membrana e é cerca de 10 vezes menor (figura fora de escala)'],
      ['b', 'tipos-lado-b', 'Corte da célula animal', 'Por dentro da célula eucarionte animal']
    ], [
      { id: 'bact', c: '#A9C54A', t: 'Bactéria', d: 'Célula procarionte: sem núcleo e sem organelas com membrana. Mede cerca de 1 a 5 µm, muito menos que a célula animal.', em: { a: [17, 53], b: [80, 83] }, z: 3 },
      { id: 'nucleo', c: '#9A6BFF', t: 'Núcleo', d: 'Só a célula eucarionte tem núcleo: o DNA fica dentro, protegido pela carioteca.', em: { a: [66, 43], b: [37, 39] }, z: 2.2 },
      { id: 'mito', c: '#F25C3B', t: 'Mitocôndria', d: 'Organela de membrana dupla onde ocorre a respiração celular. A bactéria faz isso na própria membrana.', em: { a: [52, 24], b: [15, 32] }, z: 2.8 },
      { id: 'rer', c: '#C9AEFF', t: 'Retículo endoplasmático rugoso', d: 'Dobras de membrana cobertas de ribossomos. Fabrica proteínas que serão enviadas para fora da célula.', em: { a: [46, 52], b: [22, 51] }, z: 2.4 },
      { id: 'gol', c: '#F7C13B', t: 'Complexo golgiense', d: 'Modifica, empacota e distribui proteínas e lipídios em vesículas.', em: { a: [47, 65], b: [57, 60] }, z: 2.8 },
      { id: 'cent', c: '#FFD43B', t: 'Centríolos', d: 'Par de cilindros que organiza as fibras do fuso na divisão. A bactéria não tem.', em: { b: [61, 23] }, z: 3 }
    ]);

    cena('tipos/proc', 'Bactéria em corte e por fora', [
      ['a', 'tipos-proc-a', 'Em corte', 'Bactéria em corte: o DNA fica solto no citoplasma'],
      ['b', 'tipos-proc-b', 'Vista externa', 'Bactéria por fora: pili, cápsula e flagelo']
    ], [
      { id: 'nucleoide', c: '#9A6BFF', t: 'Nucleoide', d: 'Região do citoplasma onde fica o cromossomo, um DNA circular. Não há carioteca.', em: { a: [43, 45] }, z: 2.4 },
      { id: 'plasmideo', c: '#4DD0E1', t: 'Plasmídeo', d: 'Pequeno anel de DNA separado do cromossomo. Costuma levar genes de resistência a antibióticos e pode passar para outra bactéria.', em: { a: [21, 34] }, z: 3.2 },
      { id: 'ribossomos', c: '#C9AEFF', t: 'Ribossomos', d: 'Fabricam proteínas. Os bacterianos são menores (70S) que os dos eucariontes (80S).', em: { a: [28, 57] }, z: 3.2 },
      { id: 'parede', c: '#F2B33D', t: 'Parede celular', d: 'Camada rígida de peptideoglicano. Dá forma e evita que a célula estoure. A penicilina atua nela.', em: { a: [45, 30] }, z: 3 },
      { id: 'capsula', c: '#8FD8FF', t: 'Cápsula', d: 'Capa gelatinosa por fora da parede. Ajuda a bactéria a aderir e a escapar das defesas do corpo.', em: { a: [7, 39], b: [26, 50] }, z: 2.6 },
      { id: 'pili', c: '#F06AAE', t: 'Pili e fímbrias', d: 'Pelos finos que prendem a bactéria às superfícies. Alguns pili transferem DNA na conjugação.', em: { a: [24, 17], b: [37, 28] }, z: 3 },
      { id: 'flagelo', c: '#CFE0FF', t: 'Flagelo', d: 'Filamento que gira preso a um motor na membrana e na parede. Impulsiona a bactéria como uma hélice.', em: { a: [81, 55], b: [73, 72] }, z: 2.4 }
    ]);

    cena('tipos/organelas', 'Organelas das células animal e vegetal', [
      ['a', 'tipos-organelas-a', 'Célula animal', 'Célula animal em corte'],
      ['b', 'tipos-organelas-b', 'Célula vegetal', 'Célula vegetal em corte: parede, vacúolo e cloroplastos']
    ], [
      { id: 'nucleo', c: '#9A6BFF', t: 'Núcleo', d: 'Guarda o DNA e controla a atividade da célula. É envolvido por uma membrana dupla com poros.', em: { a: [23, 24], b: [23, 26] }, z: 2.4 },
      { id: 'nucleolo', c: '#E03131', t: 'Nucléolo', d: 'Região do núcleo onde se montam as subunidades dos ribossomos. Não tem membrana.', em: { a: [37, 31], b: [34, 26] }, z: 3.2 },
      { id: 'rer', c: '#C9AEFF', t: 'Retículo endoplasmático rugoso', d: 'Ribossomos na superfície fabricam proteínas para a membrana ou para serem secretadas.', em: { a: [41, 54], b: [23, 39] }, z: 2.6 },
      { id: 'rel', c: '#8FA8FF', t: 'Retículo endoplasmático liso', d: 'Sem ribossomos. Produz lipídios, desintoxica e armazena cálcio.', em: { a: [54, 20], b: [53, 17] }, z: 2.6 },
      { id: 'gol', c: '#F7C13B', t: 'Complexo golgiense', d: 'Modifica, empacota e envia proteínas e lipídios em vesículas.', em: { a: [77, 45], b: [27, 58] }, z: 2.6 },
      { id: 'mito', c: '#F25C3B', t: 'Mitocôndria', d: 'Faz a respiração celular e produz a maior parte do ATP. Tem DNA próprio. Existe em animais e plantas.', em: { a: [34, 72], b: [30, 71] }, z: 2.8 },
      { id: 'cent', c: '#FFD43B', t: 'Centríolos', d: 'Par de cilindros que organiza os microtúbulos do fuso na divisão. Plantas com flores não têm.', em: { a: [61, 60] }, z: 3 },
      { id: 'lis', c: '#B66FD9', t: 'Lisossomo', d: 'Vesícula com enzimas que digerem partículas e organelas velhas.', em: { a: [50, 74] }, z: 3.2 },
      { id: 'parede', c: '#A9C54A', t: 'Parede celular', d: 'De celulose, por fora da membrana. Dá forma e sustentação. As células animais não têm.', em: { b: [7, 71] }, z: 2.6 },
      { id: 'vacuolo', c: '#CFE0FF', t: 'Vacúolo central', d: 'Grande reserva de água e solutos. Mantém a célula túrgida e firme.', em: { b: [60, 45] }, z: 2.2 },
      { id: 'cloro', c: '#3FBF6A', t: 'Cloroplasto', d: 'Faz a fotossíntese. As pilhas verdes são os tilacoides, com clorofila. Tem DNA próprio.', em: { b: [46, 68] }, z: 2.8 }
    ]);

    // ================= MEMBRANAS =================
    cena('membranas/mosaico', 'Modelo do mosaico fluido da membrana', [
      ['a', 'membranas-mosaico-a', 'Visão em perspectiva', 'A membrana é um mosaico fluido de lipídios e proteínas'],
      ['b', 'membranas-mosaico-b', 'Corte lateral', 'Corte da membrana: caudas hidrofóbicas por dentro']
    ], [
      { id: 'bicamada', c: '#F06AAE', t: 'Bicamada de fosfolipídios', d: 'As cabeças, que gostam de água, ficam para fora. As caudas, que fogem da água, ficam no meio.', em: { a: [34, 59], b: [26, 59] }, z: 2.4 },
      { id: 'integral', c: '#4DD0E1', t: 'Proteína integral', d: 'Atravessa a bicamada de um lado ao outro. Pode servir de canal, de receptor ou de enzima.', em: { a: [17, 45], b: [67, 60] }, z: 2.4 },
      { id: 'canal', c: '#B66FD9', t: 'Canal', d: 'Proteína integral com um poro, por onde passam íons e outras moléculas que não atravessam a bicamada.', em: { a: [65, 53], b: [59, 50] }, z: 2.4 },
      { id: 'periferica', c: '#8FA8FF', t: 'Proteína periférica', d: 'Fica presa a uma só face da membrana, sem atravessar a bicamada.', em: { a: [32, 71] }, z: 2.8 },
      { id: 'colesterol', c: '#FFD43B', t: 'Colesterol', d: 'Fica entre as caudas dos fosfolipídios e regula a fluidez da membrana animal.', em: { a: [29, 54], b: [37, 54] }, z: 3 },
      { id: 'glicocalice', c: '#C9AEFF', t: 'Glicocálix', d: 'Cadeias de açúcar ligadas a proteínas e lipídios da face externa. Participam do reconhecimento entre células.', em: { a: [53, 23], b: [23, 14] }, z: 2.8 }
    ]);

    cena('membranas/osmose', 'Osmose em hemácias e em células vegetais', [
      ['a', 'membranas-osmose-a', 'Hemácias', 'Hemácias em meio hipotônico, isotônico e hipertônico'],
      ['b', 'membranas-osmose-b', 'Células vegetais', 'Células vegetais: túrgida, flácida e plasmolisada']
    ], [
      { id: 'hipo', c: '#8FD8FF', t: 'Meio hipotônico', d: 'Há menos soluto fora do que dentro, então a água entra e a hemácia incha. Pode estourar, a hemólise.', em: { a: [18, 49] }, z: 2 },
      { id: 'iso', c: '#7FDA9C', t: 'Meio isotônico', d: 'Mesma concentração dos dois lados: entra e sai a mesma quantidade de água, e a hemácia mantém o formato de disco.', em: { a: [54, 52] }, z: 2.2 },
      { id: 'hiper', c: '#FFA94D', t: 'Meio hipertônico', d: 'Há mais soluto fora, então a água sai. A hemácia murcha e fica crenada, com pontas.', em: { a: [86, 52] }, z: 2.4 },
      { id: 'turgida', c: '#8FD8FF', t: 'Célula túrgida', d: 'Em meio hipotônico, o vacúolo enche e empurra a membrana contra a parede, que impede o estouro.', em: { b: [18, 50] }, z: 2 },
      { id: 'flacida', c: '#7FDA9C', t: 'Célula flácida', d: 'Em meio isotônico, entra e sai a mesma quantidade de água: o vacúolo fica menor que na célula túrgida e a pressão contra a parede é pequena.', em: { b: [52, 54] }, z: 2.2 },
      { id: 'plasmo', c: '#FFA94D', t: 'Plasmólise', d: 'Em meio hipertônico, a água sai e o conteúdo da célula se descola da parede.', em: { b: [83, 51] }, z: 2.2 },
      { id: 'espaco', c: '#CFE0FF', t: 'Espaço entre membrana e parede', d: 'Na plasmólise, esse espaço se enche da solução de fora.', em: { b: [80, 30] }, z: 2.6 }
    ], (R, X, t) => {
      if (R.k < .6 && R.vista === 'a') return;
      if (R.vista === 'a') {
        agua(R, X, 17.6, 49, 15.5, 22, 1, t, 6); agua(R, X, 54, 52, 16, 15, 0, t, 5); agua(R, X, 85.8, 52, 12.5, 14, -1, t, 6);
      } else {
        agua(R, X, 18, 50, 16, 27, 1, t, 6); agua(R, X, 50, 50, 16, 27, 0, t, 5); agua(R, X, 82, 50, 17, 28, -1, t, 6);
      }
    });

    cena('membranas/espec', 'Especializações da membrana no epitélio', [
      ['a', 'membranas-espec-a', 'Epitélio', 'Epitélio com microvilos e junções entre as células'],
      ['b', 'membranas-espec-b', 'Microvilos de perto', 'Microvilos e a junção que fecha o topo das células']
    ], [
      { id: 'micro', c: '#FFA94D', t: 'Microvilos', d: 'Projeções da membrana que aumentam a área de absorção. Juntos, formam a borda em escova.', em: { a: [36, 24], b: [50, 52] }, z: 2.6 },
      { id: 'oclusao', c: '#C9AEFF', t: 'Junção de oclusão', d: 'Veda o espaço entre células vizinhas e impede que o conteúdo do intestino passe por entre elas.', em: { a: [38, 32], b: [49, 79] }, z: 2.6 },
      { id: 'desmo', c: '#F2B33D', t: 'Desmossomo', d: 'Prende as células lado a lado, como um botão. Dá resistência à tração e liga-se ao citoesqueleto.', em: { a: [50, 48] }, z: 3 },
      { id: 'nucleo', c: '#9A6BFF', t: 'Núcleo', d: 'Cada célula do epitélio tem o seu, na parte de baixo da célula.', em: { a: [42, 69] }, z: 2.6 },
      { id: 'conj', c: '#F06AAE', t: 'Tecido conjuntivo e vasos', d: 'Sob o epitélio, os vasos sanguíneos levam embora os nutrientes absorvidos.', em: { a: [42, 85] }, z: 2.4 },
      { id: 'glico', c: '#CFE0FF', t: 'Glicocálix', d: 'Camada fina de açúcares na ponta dos microvilos. Protege e participa da digestão final.', em: { b: [53, 40] }, z: 3 }
    ]);

    // ================= NÚCLEO =================
    cena('nucleo/geral', 'Núcleo celular em corte e por fora', [
      ['a', 'nucleo-geral-a', 'Corte', 'Núcleo em corte: nucléolo e cromatina por dentro'],
      ['b', 'nucleo-geral-b', 'Vista externa', 'Núcleo por fora: poros e continuidade com o retículo']
    ], [
      { id: 'poro', c: '#C9AEFF', t: 'Poro nuclear', d: 'Canal formado por proteínas, por onde passam RNAs, ribossomos e proteínas entre o núcleo e o citoplasma.', em: { a: [26, 70], b: [43, 26] }, z: 3 },
      { id: 'carioteca', c: '#F06AAE', t: 'Carioteca', d: 'O envoltório nuclear: duas membranas que separam o DNA do citoplasma.', em: { a: [72, 38], b: [58, 45] }, z: 2.6 },
      { id: 'nucleolo', c: '#E03131', t: 'Nucléolo', d: 'Região onde se montam as subunidades dos ribossomos. Não tem membrana.', em: { a: [48, 40] }, z: 2.6 },
      { id: 'cromatina', c: '#9A6BFF', t: 'Cromatina', d: 'DNA associado a proteínas, as histonas. Fica espalhada no núcleo e se condensa em cromossomos na divisão.', em: { a: [31, 45] }, z: 2.4 },
      { id: 'rer', c: '#F7C13B', t: 'Retículo endoplasmático rugoso', d: 'É contínuo com a carioteca. Os pontinhos são ribossomos, que fabricam proteínas.', em: { a: [80, 57], b: [77, 57] }, z: 2.4 }
    ]);

    cena('nucleo/eu', 'Eucromatina, heterocromatina e nucleossomos', [
      ['a', 'nucleo-eu-a', 'Hetero e eucromatina', 'Heterocromatina na periferia e eucromatina no centro'],
      ['b', 'nucleo-eu-b', 'Nucleossomos', 'Nucleossomos, fibra compacta e RNA-polimerase']
    ], [
      { id: 'hetero', c: '#9A6BFF', t: 'Heterocromatina', d: 'Cromatina condensada e escura, junto à carioteca. Seus genes ficam desligados ou pouco ativos.', em: { a: [26, 45] }, z: 2.6 },
      { id: 'eu', c: '#C9AEFF', t: 'Eucromatina', d: 'Cromatina frouxa, no centro do núcleo. Seus genes estão acessíveis e podem ser lidos.', em: { a: [38, 56] }, z: 2.6 },
      { id: 'nucleolo', c: '#E03131', t: 'Nucléolo', d: 'Fábrica dos ribossomos, dentro do núcleo.', em: { a: [62, 38] }, z: 2.6 },
      { id: 'poro', c: '#F06AAE', t: 'Poro nuclear', d: 'Por ele saem os RNAs transcritos a partir da eucromatina.', em: { a: [23, 66] }, z: 3 },
      { id: 'nucleossomo', c: '#F2B33D', t: 'Nucleossomo', d: 'DNA enrolado em oito histonas, como fio num carretel. É a unidade básica da cromatina.', em: { b: [11, 52] }, z: 3 },
      { id: 'ligante', c: '#8FA8FF', t: 'DNA de ligação', d: 'Trecho de DNA entre dois nucleossomos. Fica mais exposto e mais fácil de ler.', em: { b: [47, 41] }, z: 3.2 },
      { id: 'polimerase', c: '#B66FD9', t: 'RNA-polimerase', d: 'Enzima que lê o DNA e copia o gene em RNA. Só trabalha onde a cromatina está aberta.', em: { b: [31, 44] }, z: 2.8 },
      { id: 'rna', c: '#FF8A7A', t: 'RNA recém-copiado', d: 'A fita rosa é o RNA que sai da polimerase, uma cópia do trecho lido do gene.', em: { b: [50, 58] }, z: 3.4 },
      { id: 'fibra', c: '#C9AEFF', t: 'Fibra compacta', d: 'Nucleossomos empilhados em espiral. É a cromatina condensada, onde os genes ficam pouco acessíveis e quase não são lidos.', em: { b: [82, 50] }, z: 2.4 }
    ]);
  });
})();
