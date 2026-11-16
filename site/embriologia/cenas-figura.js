/* LAB Embriologia: figura de IA por padrão em 13 rotas que já têm cena 3D do Martin (Aurelius).
   A figura (figura-ia.js v2, vistas A e B, pontos e zoom) abre primeiro; o botão "Ver em 3D" alterna e "Ver figura" volta.
   O .js de cada imagem só entra na página quando a cena abre. Nas rotas com barras, linha do tempo ou gráfico, a cena 2D antiga
   continua desenhada em volta da figura (o controle de tempo segue valendo). Usa os globais do motor (SC, X, W, H, NAR, area, cap).
   Carregar antes de LAB_EMBRIO_iniciar(). */
'use strict';
(function () {
  if (!window.LAB_FIGALT || !window.LAB_FIGIA) return;
  const TAU = Math.PI * 2, RED = LAB_FIGALT.RED;
  const MASK = { miolo: .86, borda: 1 };
  const amb = {
    SC, X: () => X, W: () => W, H: () => H, nar: () => NAR, tela: cv.parentNode, cap: html => cap(html),
    t: a => a[0], baixo: nar => nar ? 100 : 84, plano: (o3, a) => o3.plano(a[0], a[1]),
    esconder: ['.hud.onde'], esconderFig: ['.palco .ctl']
  };
  const cl = (v, a, b) => Math.max(a, Math.min(b, v)), seg = (p, a, b) => cl((p - a) / (b - a), 0, 1);
  const tam = R => Math.max(12, Math.min(14, R.s * 1.5));
  const FT = "'Atkinson Hyperlegible Next', system-ui, sans-serif";
  function ficha(X, x, y, s, cor, a, px) {
    X.save(); X.globalAlpha *= a; X.font = `600 ${px || 13}px ${FT}`; X.textAlign = 'center'; X.textBaseline = 'middle';
    const w = X.measureText(s).width + 16, h = (px || 13) + 10;
    X.fillStyle = 'rgba(11,15,28,.86)'; X.strokeStyle = cor; X.lineWidth = 1.5; X.beginPath(); X.roundRect(x - w / 2, y - h / 2, w, h, h / 2); X.fill(); X.stroke();
    X.fillStyle = '#F2F5FB'; X.fillText(s, x, y + .5); X.restore();
  }
  const brilho = (X, x, y, r, cor) => { const g = X.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, cor); g.addColorStop(1, 'rgba(0,0,0,0)'); X.fillStyle = g; X.beginPath(); X.arc(x, y, r, 0, TAU); X.fill(); };
  const anel = (X, x, y, r, a, cor, lw) => { X.strokeStyle = cor.replace('A', a.toFixed(3)); X.lineWidth = lw || 2; X.beginPath(); X.arc(x, y, r, 0, TAU); X.stroke(); };
  const txt = (X, s, x, y, o = {}) => { X.save(); X.font = `${o.w || 400} ${o.s || 12}px ${FT}`; X.textAlign = o.a || 'left'; X.textBaseline = 'middle'; X.fillStyle = o.c || '#C9D2E6'; X.fillText(s, x, y); X.restore(); };
  const barra = (X, x, y, w, f, cor) => { X.fillStyle = 'rgba(91,108,153,.3)'; X.beginPath(); X.roundRect(x, y, w, 8, 4); X.fill(); if (f > .01) { X.fillStyle = cor; X.beginPath(); X.roundRect(x, y, Math.max(6, w * cl(f, 0, 1)), 8, 4); X.fill(); } };

  // ================= OVOS =================
  LAB_FIGALT.cena(amb, 'ovos/tipos', {
    pref: 'embriologia', nome: 'Quatro tipos de ovo em corte', mask: MASK,
    vistas: [
      ['a', 'ovos-tipos-a', 'Quatro ovos', 'Da esquerda para a direita: isolécito, heterolécito, telolécito e centrolécito', [0, .2, 1, .62]],
      ['b', 'ovos-tipos-b', 'Ovo telolécito de perto', 'Ovo com muito vitelo: o disco germinativo fica no alto']
    ],
    hs: [
      { id: 'iso', c: '#CFE0FF', t: 'Ovo isolécito', d: 'Pouco vitelo, espalhado por igual no citoplasma. Ocorre em equinodermos e mamíferos placentários.', em: { a: [14, 47] }, z: 2.8 },
      { id: 'het', c: '#FFD43B', t: 'Ovo heterolécito', d: 'Vitelo em quantidade média, mais concentrado no polo vegetal. O núcleo fica no polo animal. Ocorre em anfíbios.', em: { a: [37, 56] }, z: 2.8 },
      { id: 'tel', c: '#FFA94D', t: 'Ovo telolécito', d: 'Muito vitelo, que ocupa quase todo o ovo. O citoplasma ativo forma só um pequeno disco no polo animal. Ocorre em aves, répteis e peixes.', em: { a: [62, 52] }, z: 2.8 },
      { id: 'cen', c: '#F2B33D', t: 'Ovo centrolécito', d: 'O vitelo fica no centro, cercado de citoplasma. Ocorre em insetos e outros artrópodes.', em: { a: [86, 48] }, z: 2.8 },
      { id: 'disco', c: '#F2B6C6', t: 'Disco germinativo', d: 'Pequena região de citoplasma sem vitelo, no polo animal. É onde o embrião se forma e as divisões acontecem.', em: { b: [50, 17] }, z: 3 },
      { id: 'vit', c: '#FFA94D', t: 'Vitelo', d: 'Reserva de nutrientes, ricos em proteínas e lipídios. Em ovos telolécitos ocupa quase todo o volume.', em: { b: [45, 52] }, z: 2.2 },
      { id: 'veg', c: '#FFD43B', t: 'Polo vegetal', d: 'O lado do ovo com mais vitelo. As divisões ali são lentas ou nem acontecem.', em: { b: [45, 86] }, z: 2.4 },
      { id: 'mem', c: '#8FD8FF', t: 'Membrana do ovo', d: 'Envolve a célula. Em aves e répteis ainda há clara e casca por fora dela.', em: { b: [90, 48] }, z: 2.6 }
    ]
  });

  // As barras do desenvolvimento direto e indireto continuam: reserva de vitelo e nutrientes pela placenta, pelo tempo do controle.
  LAB_FIGALT.cena(amb, 'ovos/vitelo', {
    pref: 'embriologia', nome: 'Ovo de ave, ovo de anfíbio e útero', mask: MASK, oculto: true, ctl: true,
    reserva: nar => nar ? 230 : 166,
    vistas: [
      ['a', 'ovos-vitelo-a', 'Ave e anfíbio', 'Ovo de galinha com embrião e ovos de anfíbio com girino'],
      ['b', 'ovos-vitelo-b', 'Útero e ovócito', 'Útero com embrião implantado: o ovócito humano quase não tem vitelo']
    ],
    hs: [
      { id: 'gema', c: '#FFA94D', t: 'Gema (vitelo)', d: 'Reserva de nutrientes do ovo de ave. Com muito vitelo, o embrião fica muito tempo dentro do ovo.', em: { a: [21, 50] }, z: 2.4 },
      { id: 'emb', c: '#F2B6C6', t: 'Embrião de ave', d: 'Cresce sobre a gema consumindo o vitelo. O pintinho sai parecido com o adulto: é o desenvolvimento direto.', em: { a: [38, 46] }, z: 2.8 },
      { id: 'ovos', c: '#BFE6FF', t: 'Ovos de anfíbio', d: 'Vitelo em quantidade média, dentro de uma cápsula gelatinosa. O vitelo acaba cedo e sai uma larva.', em: { a: [72, 34] }, z: 2.6 },
      { id: 'gir', c: '#A9C54A', t: 'Girino', d: 'Larva do anfíbio. Come sozinha e depois passa por metamorfose: é o desenvolvimento indireto.', em: { a: [76, 72] }, z: 2.8 },
      { id: 'imp', c: '#F2B6C6', t: 'Embrião implantado', d: 'Quase sem vitelo, o embrião se implanta na parede do útero e passa a receber nutrientes da mãe pela placenta.', em: { b: [46, 36] }, z: 3.4 },
      { id: 'ovoc', c: '#CFE0FF', t: 'Ovócito humano', d: 'Mede cerca de 0,1 mm e tem pouquíssimo vitelo. Por isso o embrião depende da placenta.', em: { b: [79, 63] }, z: 2.8 },
      { id: 'ute', c: '#F28B8B', t: 'Útero', d: 'Onde o embrião se implanta e se desenvolve até o nascimento.', em: { b: [47, 56] }, z: 2.2 },
      { id: 'tuba', c: '#F2A3A3', t: 'Tuba uterina', d: 'Canal onde ocorre a fecundação. O embrião desce por ela até o útero.', em: { b: [13, 14] }, z: 2.8 }
    ],
    fora(X, t, c) {
      const S = c.S || {}, T = cl((S.v || 0) / 100, 0, 1), W = c.W, H = c.H, nar = c.nar;
      const res = [T >= .93 ? .08 : 1 - .9 * T, .55 * Math.max(0, 1 - T / .3), .04 * Math.max(0, 1 - T / .08)];
      const nomes = ['Ave: reserva de vitelo', 'Anfíbio: reserva de vitelo', 'Mamífero: reserva de vitelo'];
      const x0 = nar ? 12 : 28, w = W - 2 * x0, y0 = H - (nar ? 100 : 84) - (nar ? 224 : 150);
      X.save();
      if (!nar) {
        const cw = (w - 32) / 3;
        res.forEach((f, i) => { const x = x0 + i * (cw + 16); txt(X, nomes[i], x, y0 + 8, { s: 13, w: 600 }); barra(X, x, y0 + 20, cw, f, '#F2B33D'); });
        txt(X, 'Mamífero: nutrientes pela placenta', x0 + 2 * (cw + 16), y0 + 54, { s: 13, w: 600 }); barra(X, x0 + 2 * (cw + 16), y0 + 66, cw, 1, '#E07A98');
        txt(X, T < .1 ? 'Mesma régua de tempo, da fecundação ao jovem' : T > .95 ? 'Fim do desenvolvimento' : `Tempo: ${Math.round(T * 100)}% do desenvolvimento`, x0, y0 + 64, { s: 13, c: '#9DA9C4' });
      } else {
        res.forEach((f, i) => { const y = y0 + i * 44; txt(X, nomes[i], x0, y + 8, { s: 13, w: 600 }); barra(X, x0, y + 20, w, f, '#F2B33D'); });
        txt(X, 'Mamífero: nutrientes pela placenta', x0, y0 + 140, { s: 13, w: 600 }); barra(X, x0, y0 + 152, w, 1, '#E07A98');
      }
      X.restore();
    }
  });

  // ================= DESENVOLVIMENTO =================
  LAB_FIGALT.cena(amb, 'desenvolvimento/segmentacao', {
    pref: 'embriologia', nome: 'Zigoto em segmentação', mask: MASK,
    vistas: [
      ['a', 'desenvolvimento-segmentacao-a', 'Quatro blastômeros', 'Segmentação: o zigoto se divide sem crescer e forma blastômeros'],
      ['b', 'desenvolvimento-segmentacao-b', 'Ovo com vitelo', 'Com o vitelo concentrado no polo vegetal, a segmentação é desigual: células pequenas em cima e grandes embaixo']
    ],
    hs: [
      { id: 'bl', c: '#CFE0FF', t: 'Blastômero', d: 'Cada célula formada pelas divisões. O conjunto não cresce: as células ficam menores a cada divisão.', em: { a: [38, 38] }, z: 2.6 },
      { id: 'sulco', c: '#FFD43B', t: 'Sulcos de clivagem', d: 'As divisões do zigoto são rápidas e sem crescimento entre elas. Os sulcos separam as células.', em: { a: [50, 50] }, z: 3 },
      { id: 'zp', c: '#8FD8FF', t: 'Zona pelúcida', d: 'Envoltório de glicoproteínas que mantém as células juntas durante a segmentação.', em: { a: [76, 52] }, z: 2.6 },
      { id: 'mic', c: '#F2A3A3', t: 'Micrômeros', d: 'Células pequenas do polo animal, com pouco vitelo. Dividem-se mais depressa.', em: { b: [50, 26] }, z: 2.6 },
      { id: 'mac', c: '#FFA94D', t: 'Macrômeros', d: 'Células grandes do polo vegetal, cheias de vitelo. A divisão é mais lenta: a segmentação é desigual, típica do ovo heterolécito.', em: { b: [50, 68] }, z: 2.6 },
      { id: 'lim', c: '#FFD43B', t: 'Limite entre os grupos', d: 'O vitelo atrapalha as divisões do lado vegetal, por isso as células ficam de tamanhos diferentes.', em: { b: [30, 43] }, z: 3 }
    ],
    sobre(R, X, t) {
      if (R.vista !== 'a' || R.k < .6) return;
      // sulcos de clivagem se desenhando: primeiro o vertical, depois o horizontal, e o ciclo recomeça
      const p = RED ? 1 : (t * .22) % 1, a = seg(p, 0, .35), b = seg(p, .35, .7), fade = 1 - seg(p, .85, 1);
      X.save(); X.lineCap = 'round'; X.strokeStyle = `rgba(255,236,170,${.9 * fade})`; X.lineWidth = Math.max(2, R.s * .4);
      const [vx, vy0] = R.pt(49.5, 50 - 32 * a), [, vy1] = R.pt(49.5, 50 + 32 * a); X.beginPath(); X.moveTo(vx, vy0); X.lineTo(vx, vy1); X.stroke();
      const [hx0, hy] = R.pt(50 - 29 * b, 50.5), [hx1] = R.pt(50 + 29 * b, 50.5); X.beginPath(); X.moveTo(hx0, hy); X.lineTo(hx1, hy); X.stroke();
      X.restore();
    }
  });

  function corte(R, X, t, cutX, cor) {
    // metade da figura escurece com o formato da máscara e uma linha tracejada marca o plano do corte
    const [cx, cy] = R.pt(cutX, 50), top = R.pt(cutX, 8)[1], bot = R.pt(cutX, 92)[1];
    X.save(); X.beginPath(); X.rect(R.x - 20, R.y - 20, cx - R.x + 20, R.h + 40); X.clip(); R.veu(.62); X.restore();
    X.save(); X.setLineDash([6, 6]); X.lineDashOffset = RED ? 0 : -t * 14; X.strokeStyle = cor; X.lineWidth = 2; X.beginPath(); X.moveTo(cx, top); X.lineTo(cx, bot); X.stroke(); X.restore();
    return [cx, cy];
  }
  LAB_FIGALT.cena(amb, 'desenvolvimento/morula', {
    pref: 'embriologia', nome: 'Mórula ao microscópio', mask: MASK,
    vistas: [
      ['a', 'desenvolvimento-morula-a', 'Mórula', 'Mórula: bola maciça de células dentro da zona pelúcida'],
      ['b', 'desenvolvimento-morula-b', 'Mórula de outro ângulo', 'A mórula vista de outro ângulo: as células se apertam, sem cavidade no meio']
    ],
    hs: [
      { id: 'bl', c: '#F2B6C6', t: 'Blastômeros', d: 'Cerca de 16 a 32 células agrupadas formam uma bola maciça, parecida com uma amora.', em: { a: [50, 44] }, z: 2.4 },
      { id: 'zp', c: '#8FD8FF', t: 'Zona pelúcida', d: 'Envoltório que ainda cobre o embrião. As divisões acontecem dentro dele, sem aumentar o tamanho do conjunto.', em: { a: [77, 45] }, z: 2.6 },
      { id: 'comp', c: '#FFD43B', t: 'Compactação', d: 'Nesta fase as células se apertam e se unem. Ainda não há cavidade no meio: a mórula é maciça.', em: { a: [30, 70] }, z: 2.6 },
      { id: 'bl2', c: '#F2B6C6', t: 'Blastômeros', d: 'Cada célula é um blastômero. Os do centro ficam cercados pelos de fora, e depois surge a cavidade da blástula.', em: { b: [48, 50] }, z: 2.4 },
      { id: 'ext', c: '#8FD8FF', t: 'Camada externa', d: 'As células de fora formam a superfície da mórula e, depois, a parede da blástula.', em: { b: [82, 50] }, z: 2.6 }
    ],
    sobre(R, X, t) {
      if (R.k < .6 || R.z > 1.5) return;
      const cut = 50 + (RED ? 0 : 22 * Math.sin(t * .45));
      const [cx] = corte(R, X, t, cut, 'rgba(255,225,166,.9)');
      ficha(X, cx, R.y + 14, 'plano do corte', '#FFE1A6', 1, tam(R));
      ficha(X, R.pt(50, 93)[0], R.pt(50, 93)[1], 'a mórula é maciça: não tem cavidade', '#F2B6C6', 1, tam(R));
    }
  });

  function veuOco(R, X, t, cx, cy, rx, ry, a) {
    // escurece tudo menos a cavidade (furo elíptico), com o formato da máscara
    const [px, py] = R.pt(cx, cy);
    X.save(); X.beginPath(); X.rect(R.x - 30, R.y - 30, R.w + 60, R.h + 60); X.ellipse(px, py, rx * R.s, ry * R.s * R.w / R.h * R.h / R.w, 0, 0, TAU); X.clip('evenodd');
    R.veu(a); X.restore();
    X.save(); X.strokeStyle = 'rgba(160,215,255,.9)'; X.lineWidth = 2; X.setLineDash([5, 5]); X.beginPath(); X.ellipse(px, py, rx * R.s, ry * R.s, 0, 0, TAU); X.stroke(); X.restore();
    return [px, py];
  }
  LAB_FIGALT.cena(amb, 'desenvolvimento/blastula', {
    pref: 'embriologia', nome: 'Blástula com blastocele', mask: MASK,
    vistas: [
      ['a', 'desenvolvimento-blastula-a', 'Blástula', 'Blástula: uma esfera de células em volta da blastocele'],
      ['b', 'desenvolvimento-blastula-b', 'Blástula com vitelo', 'Com vitelo, a blastocele fica deslocada para o polo animal']
    ],
    hs: [
      { id: 'bc', c: '#8FD8FF', t: 'Blastocele', d: 'Cavidade cheia de líquido no centro da blástula. Surge quando a mórula se enche de líquido.', em: { a: [50, 48] }, z: 2 },
      { id: 'bd', c: '#F2B6C6', t: 'Blastoderme', d: 'A camada de células que forma a parede da blástula.', em: { a: [22, 45] }, z: 2.8 },
      { id: 'bd2', c: '#F2B6C6', t: 'Células da parede', d: 'São de uma só camada. A divisão continua, mas o conjunto não cresce.', em: { a: [53, 11] }, z: 3 },
      { id: 'bc2', c: '#8FD8FF', t: 'Blastocele deslocada', d: 'No ovo heterolécito a cavidade fica mais perto do polo animal, empurrada pelo vitelo.', em: { b: [50, 40] }, z: 2 },
      { id: 'mi', c: '#F2A3A3', t: 'Micrômeros', d: 'Células pequenas que formam o teto da blastocele, no polo animal.', em: { b: [58, 10] }, z: 3 },
      { id: 'ma', c: '#FFA94D', t: 'Macrômeros com vitelo', d: 'Células grandes e cheias de vitelo formam o chão da blastocele, no polo vegetal.', em: { b: [52, 82] }, z: 2.6 }
    ],
    sobre(R, X, t) {
      if (R.k < .6 || R.z > 1.5) return;
      const k = RED ? .7 : .5 + .5 * Math.sin(t * .8), a = .5 * k;
      const [px, py] = R.vista === 'a' ? veuOco(R, X, t, 50, 48, 28, 26, a) : veuOco(R, X, t, 50, 40, 26, 20, a);
      if (a > .12) ficha(X, px, py, 'blastocele', '#A0D7FF', Math.min(1, a * 2.2), tam(R));
    }
  });

  const CAMADAS = [
    { n: 'Ectoderma', f: 'epiderme e sistema nervoso', c: '#6FA8FF', a: [[38, 13], [30, 28], [74, 55]], b: [[50, 9], [20, 36], [80, 36]] },
    { n: 'Mesoderma', f: 'músculos, ossos, sangue e coração', c: '#FF6B6B', a: [[44, 44], [62, 50], [45, 80]], b: [[26, 55], [74, 55], [50, 22]] },
    { n: 'Endoderma', f: 'revestimento do tubo digestório, fígado e pulmões', c: '#FFD43B', a: [[54, 33], [50, 52], [52, 66]], b: [[36, 70], [64, 70], [50, 42]] }
  ];
  LAB_FIGALT.cena(amb, 'desenvolvimento/folhetos', {
    pref: 'embriologia', nome: 'Folhetos embrionários e seus órgãos', mask: MASK,
    vistas: [
      ['a', 'desenvolvimento-folhetos-a', 'Corpo translúcido', 'Cada folheto embrionário forma órgãos: azul, ectoderma; vermelho, mesoderma; amarelo, endoderma'],
      ['b', 'desenvolvimento-folhetos-b', 'Corte em camadas', 'Corte do embrião: ectoderma por fora, mesoderma no meio e endoderma por dentro']
    ],
    hs: [
      { id: 'ec', c: '#6FA8FF', t: 'Ectoderma', d: 'Folheto externo. Forma a epiderme e o sistema nervoso, como o encéfalo (em azul).', em: { a: [38, 13] }, z: 2.6 },
      { id: 'me', c: '#FF6B6B', t: 'Mesoderma', d: 'Folheto do meio. Forma músculos, esqueleto, sangue e coração (em vermelho).', em: { a: [63, 50] }, z: 2.6 },
      { id: 'en', c: '#FFD43B', t: 'Endoderma', d: 'Folheto interno. Forma o revestimento do tubo digestório e órgãos como fígado e pulmões (em amarelo).', em: { a: [54, 33] }, z: 2.8 },
      { id: 'in', c: '#FFD43B', t: 'Intestino', d: 'O tubo digestório tem o revestimento de origem endodérmica. As camadas de músculo em volta vêm do mesoderma.', em: { a: [50, 65] }, z: 3 },
      { id: 'ec2', c: '#6FA8FF', t: 'Ectoderma', d: 'A camada azul, a mais externa, dá origem à pele e ao sistema nervoso.', em: { b: [18, 40] }, z: 2.6 },
      { id: 'me2', c: '#FF6B6B', t: 'Mesoderma', d: 'A camada vermelha, no meio, origina músculos, ossos, sangue, coração e rins.', em: { b: [23, 54] }, z: 2.6 },
      { id: 'en2', c: '#FFD43B', t: 'Endoderma', d: 'A camada amarela, mais interna, reveste o tubo digestório e origina fígado, pâncreas e pulmões.', em: { b: [34, 71] }, z: 2.6 },
      { id: 'cav', c: '#F2B33D', t: 'Cavidade interna', d: 'O endoderma envolve o espaço que dará origem à cavidade do tubo digestório.', em: { b: [50, 55] }, z: 2.4 }
    ],
    sobre(R, X, t) {
      if (R.k < .6 || R.z > 1.5) return;
      // os órgãos acendem por folheto, um de cada vez
      const i = RED ? 0 : Math.floor((t / 3.2) % 3), u = RED ? .5 : ((t / 3.2) % 1), L = CAMADAS[i], al = Math.sin(Math.min(1, u * 1.2) * Math.PI) * .9;
      R.veu(.38 * al);
      X.save(); X.globalCompositeOperation = 'lighter';
      (R.vista === 'a' ? L.a : L.b).forEach(([x, y]) => { const [px, py] = R.pt(x, y); brilho(X, px, py, R.s * 9, L.c.replace('#', '#') + '99'); });
      X.restore();
      ficha(X, R.pt(50, 94)[0], R.pt(50, 94)[1], `${L.n}: ${L.f}`, L.c, Math.min(1, al * 1.4), tam(R));
    }
  });

  // A linha do tempo de teratógenos e a régua de tamanho do embrião seguem desenhadas pela cena antiga.
  LAB_FIGALT.cena(amb, 'desenvolvimento/organogenese', {
    pref: 'embriologia', nome: 'Embrião humano na organogênese', mask: MASK, ctl: true,
    manter(W, H, nar) { const A = area(), tlY = A.y1 - (nar ? 70 : 78) + 26, top = A.y0 + (nar ? 34 : 16); return { x: A.x0, y: top, w: nar ? A.w : A.w * .66, h: tlY - 56 - top }; },
    vistas: [
      ['a', 'desenvolvimento-organogenese-a', 'Embrião no âmnio', 'Embrião humano de 4 a 8 semanas dentro do âmnio, preso ao cordão umbilical'],
      ['b', 'desenvolvimento-organogenese-b', 'Órgãos por dentro', 'Os órgãos esboçados vistos por transparência']
    ],
    hs: [
      { id: 'olho', c: '#CFE0FF', t: 'Olho', d: 'Os olhos se esboçam na 4ª e 5ª semanas. A retina se forma a partir de uma extensão do encéfalo.', em: { a: [44, 32] }, z: 3.2 },
      { id: 'mao', c: '#F2B6C6', t: 'Broto de membro', d: 'Os brotos dos braços aparecem na 4ª semana e os das pernas logo depois. Os dedos surgem por volta da 6ª semana.', em: { a: [58, 52] }, z: 3 },
      { id: 'pe', c: '#F2B6C6', t: 'Perna', d: 'Os membros inferiores se formam um pouco depois dos superiores.', em: { a: [48, 71] }, z: 3 },
      { id: 'cor', c: '#FF8FA3', t: 'Cordão umbilical', d: 'Liga o embrião à placenta. Leva nutrientes e O₂ e traz excretas e CO₂.', em: { a: [14, 50] }, z: 2.6 },
      { id: 'amn', c: '#8FD8FF', t: 'Âmnio', d: 'Bolsa com líquido que protege e amortece o embrião.', em: { a: [80, 56] }, z: 2.4 },
      { id: 'olho2', c: '#CFE0FF', t: 'Olho', d: 'A cor escura do olho já aparece, com o cristalino em formação.', em: { b: [32, 33] }, z: 3.2 },
      { id: 'som', c: '#F2B6C6', t: 'Somitos', d: 'Blocos de mesoderma ao longo das costas. Originam as vértebras e os músculos do tronco.', em: { b: [74, 46] }, z: 2.8 },
      { id: 'org', c: '#F28B8B', t: 'Órgãos internos', d: 'Fígado, intestino e outros órgãos já estão esboçados dentro do corpo.', em: { b: [55, 66] }, z: 2.6 },
      { id: 'cauda', c: '#F2B6C6', t: 'Cauda', d: 'O embrião humano tem uma cauda curta, que regride até o fim da organogênese.', em: { b: [30, 69] }, z: 3 }
    ]
  });

  // ================= ANEXOS =================
  LAB_FIGALT.cena(amb, 'anexos/funcoes', {
    pref: 'embriologia', nome: 'Ovo de galinha em corte e seus anexos', mask: MASK,
    vistas: [
      ['a', 'anexos-funcoes-a', 'Ovo em corte', 'Corte do ovo de galinha: embrião no âmnio, saco vitelino, alantoide e córion'],
      ['b', 'anexos-funcoes-b', 'Pinto no ovo', 'O pinto quase formado, com os vasos sanguíneos do saco vitelino']
    ],
    hs: [
      { id: 'amn', c: '#8FD8FF', t: 'Âmnio', d: 'Bolsa cheia de líquido que envolve o embrião. Protege contra choques e contra a desidratação.', em: { a: [45, 34] }, z: 2.8 },
      { id: 'vit', c: '#FFA94D', t: 'Saco vitelino', d: 'Guarda o vitelo e nutre o embrião da ave. Os vasos do saco levam os nutrientes até ele.', em: { a: [47, 68] }, z: 2.4 },
      { id: 'ala', c: '#C9AEFF', t: 'Alantoide', d: 'Guarda as excretas, como o ácido úrico. Com o córion, faz as trocas gasosas através da casca.', em: { a: [68, 30] }, z: 2.6 },
      { id: 'cor', c: '#F2B6C6', t: 'Córion', d: 'Membrana mais externa, sob a casca. Faz as trocas gasosas com o exterior e envolve os outros anexos.', em: { a: [11, 50] }, z: 2.6 },
      { id: 'cam', c: '#E8EDF7', t: 'Câmara de ar', d: 'Bolsa de ar na ponta mais larga do ovo, que o pinto usa nos últimos dias, antes de quebrar a casca.', em: { a: [89, 46] }, z: 3 },
      { id: 'amn2', c: '#8FD8FF', t: 'Âmnio', d: 'A bolsa transparente em volta do pinto mantém o embrião num meio líquido.', em: { b: [26, 26] }, z: 2.4 },
      { id: 'pin', c: '#F2B6C6', t: 'Embrião de ave', d: 'Já tem penas e bico. Os anexos o alimentam e o protegem até o nascimento.', em: { b: [50, 28] }, z: 2.6 },
      { id: 'vit2', c: '#FFA94D', t: 'Saco vitelino', d: 'A gema envolvida pelo saco. É a reserva de nutrientes do embrião.', em: { b: [60, 78] }, z: 2.4 },
      { id: 'vas', c: '#FF6B6B', t: 'Vasos do vitelo', d: 'Os vasos sanguíneos levam os nutrientes da gema até o embrião.', em: { b: [52, 63] }, z: 3 },
      { id: 'cas', c: '#E8C48A', t: 'Casca', d: 'Protege o ovo e tem poros que deixam passar gases.', em: { b: [8, 50] }, z: 2.6 }
    ]
  });

  // A linha do tempo da evolução (de 400 a 300 milhões de anos) e os anexos de cada grupo seguem desenhados pela cena antiga.
  LAB_FIGALT.cena(amb, 'anexos/amniotico', {
    pref: 'embriologia', nome: 'Ovos de vertebrados e embrião humano no âmnio', mask: MASK, ctl: true,
    manter(W, H, nar) { const A = area(); return { x: A.x0, y: A.y0 + (nar ? 28 : 34), w: A.w, h: A.h * (nar ? .73 : .64) - (nar ? 28 : 34) }; },
    vistas: [
      ['a', 'anexos-amniotico-a', 'Ovos de peixe a ave', 'Da esquerda para a direita: ovos de peixe, de anfíbio, de réptil e de ave', [0, .15, 1, .65]],
      ['b', 'anexos-amniotico-b', 'Embrião humano no âmnio', 'Mamíferos placentários também são amniotas']
    ],
    hs: [
      { id: 'pei', c: '#8FD8FF', t: 'Ovos de peixe', d: 'Postos na água, sem casca e sem âmnio. Peixes e anfíbios são anamniotas: dependem da água para se reproduzir.', em: { a: [10, 50] }, z: 2.6 },
      { id: 'anf', c: '#A9C54A', t: 'Ovo de anfíbio', d: 'Envolto por uma geleia, sem casca. Precisa de ambiente úmido. Sai uma larva aquática.', em: { a: [36, 48] }, z: 2.6 },
      { id: 'rep', c: '#E8C48A', t: 'Ovo de réptil', d: 'Casca resistente e quatro anexos: âmnio, córion, alantoide e saco vitelino. Répteis são amniotas e se reproduzem longe da água.', em: { a: [59, 50] }, z: 2.6 },
      { id: 'ave', c: '#F2F4F8', t: 'Ovo de ave', d: 'Casca rígida de calcário, com os mesmos anexos do réptil. O âmnio mantém o embrião num meio líquido.', em: { a: [81, 48] }, z: 2.6 },
      { id: 'emb', c: '#F2B6C6', t: 'Embrião humano', d: 'Mamíferos placentários também são amniotas: o embrião fica dentro do âmnio.', em: { b: [52, 38] }, z: 2.4 },
      { id: 'liq', c: '#8FD8FF', t: 'Líquido amniótico', d: 'Amortece choques, ajuda a manter a temperatura e deixa o embrião se movimentar.', em: { b: [70, 78] }, z: 2.4 },
      { id: 'cord', c: '#FF8FA3', t: 'Cordão umbilical', d: 'Liga o embrião à placenta.', em: { b: [33, 56] }, z: 2.8 },
      { id: 'mem', c: '#CFE0FF', t: 'Membrana do âmnio', d: 'Bolsa fina e transparente que envolve o embrião.', em: { b: [86, 40] }, z: 2.6 }
    ]
  });

  // ================= HUMANO =================
  LAB_FIGALT.cena(amb, 'humano/fecundacao', {
    pref: 'embriologia', nome: 'Aparelho reprodutor feminino e fecundação do ovócito', mask: MASK,
    vistas: [
      ['a', 'humano-fecundacao-a', 'Aparelho reprodutor', 'Aparelho reprodutor feminino: o ovócito desce pela tuba uterina até o útero'],
      ['b', 'humano-fecundacao-b', 'Ovócito e espermatozoides', 'Espermatozoides chegam ao ovócito, cercado pela corona radiata e pela zona pelúcida']
    ],
    hs: [
      { id: 'ovo', c: '#F2B6C6', t: 'Ovócito na tuba', d: 'A fecundação ocorre na tuba uterina, em geral na ampola. O ovócito é liberado do ovário na ovulação.', em: { a: [22, 22] }, z: 3 },
      { id: 'fim', c: '#F28B8B', t: 'Fímbrias', d: 'Franjas da tuba que recolhem o ovócito liberado pelo ovário.', em: { a: [9, 44] }, z: 2.8 },
      { id: 'ova', c: '#FFD9A0', t: 'Ovário', d: 'Produz os ovócitos e hormônios como o estrogênio e a progesterona.', em: { a: [18, 46] }, z: 2.6 },
      { id: 'tub', c: '#F2A3A3', t: 'Tuba uterina', d: 'Canal por onde o ovócito segue até o útero. É onde o espermatozoide o encontra.', em: { a: [37, 31] }, z: 2.6 },
      { id: 'ute', c: '#F28B8B', t: 'Útero', d: 'Onde o embrião se implanta e se desenvolve.', em: { a: [50, 48] }, z: 2.2 },
      { id: 'cor', c: '#C9AEFF', t: 'Corona radiata', d: 'Camada de células que envolve o ovócito. O espermatozoide precisa atravessá-la.', em: { b: [10, 22] }, z: 2.6 },
      { id: 'zp', c: '#8FD8FF', t: 'Zona pelúcida', d: 'Envoltório de glicoproteínas. Quando um espermatozoide entra, ela muda e bloqueia a entrada de outros.', em: { b: [77, 62] }, z: 2.6 },
      { id: 'nu', c: '#B08CFF', t: 'Núcleo do ovócito', d: 'Guarda o conjunto de cromossomos da mãe, que se une ao do espermatozoide.', em: { b: [41, 57] }, z: 2.8 },
      { id: 'esp', c: '#E8EDF7', t: 'Espermatozoide', d: 'Atravessa a zona pelúcida com as enzimas do acrossomo. Só um espermatozoide entra no ovócito, e o núcleo dele se une ao do ovócito.', em: { b: [62, 36] }, z: 3 }
    ],
    sobre(R, X, t) {
      if (R.vista !== 'b' || R.k < .6) return;
      // espermatozoides nadando em direção ao ovócito (cabeça e cauda ondulante); somem ao chegar à zona pelúcida
      const cx = 50, cy = 56, N = 6;
      X.save(); X.lineCap = 'round';
      for (let i = 0; i < N; i++) {
        const ang = i / N * TAU + .5, f = RED ? .3 + i * .1 : ((t * .1 + i * .17) % 1), r = 62 - 26 * f, a = Math.sin(Math.min(1, f * 1.4) * Math.PI) * .9;
        const hx = cx + Math.cos(ang) * r, hy = cy + Math.sin(ang) * r * .8, [px, py] = R.pt(hx, hy), dx = Math.cos(ang), dy = Math.sin(ang) * .8, L = Math.hypot(dx, dy);
        const ux = dx / L, uy = dy / L;
        X.strokeStyle = `rgba(235,240,255,${a})`; X.lineWidth = Math.max(1.4, R.s * .22); X.beginPath();
        for (let k = 0; k <= 14; k++) { const s = k / 14, w = Math.sin(s * 8 - (RED ? 0 : t * 9) + i) * R.s * .5 * s, bx = px + ux * s * R.s * 9 - uy * w, by = py + uy * s * R.s * 9 + ux * w; k ? X.lineTo(bx, by) : X.moveTo(bx, by); }
        X.stroke(); X.fillStyle = `rgba(255,255,255,${a})`; X.beginPath(); X.ellipse(px, py, R.s * .9, R.s * .55, Math.atan2(uy, ux), 0, TAU); X.fill();
      }
      X.restore();
    }
  });

  const CAM = [[26, 33], [34, 35], [48, 32], [62, 36], [72, 50]];
  LAB_FIGALT.cena(amb, 'humano/nidacao', {
    pref: 'embriologia', nome: 'Tuba, útero e implantação do embrião', mask: MASK, ctl: true,
    manter(W, H, nar) { const A = area(); return nar ? { x: A.x0, y: A.y0 + 26, w: A.w, h: A.h * .52 - 26 } : { x: A.x0, y: A.y0 + 26, w: A.w * .632, h: A.h - 26 }; },
    vistas: [
      ['a', 'humano-nidacao-a', 'Tuba e útero', 'O embrião desce pela tuba uterina até o útero'],
      ['b', 'humano-nidacao-b', 'Implantação', 'O blastocisto se implanta no endométrio: é a nidação']
    ],
    hs: [
      { id: 'emb', c: '#F2B6C6', t: 'Embrião na tuba', d: 'Nos primeiros dias o embrião se divide e desce pela tuba, empurrado por cílios e contrações. Chega ao útero em cerca de 3 a 5 dias.', em: { a: [34, 35] }, z: 3 },
      { id: 'tub', c: '#F2A3A3', t: 'Tuba uterina', d: 'Canal onde ocorre a fecundação e por onde o embrião desce até o útero.', em: { a: [18, 20] }, z: 2.6 },
      { id: 'ova', c: '#FFD9A0', t: 'Ovário', d: 'Libera o ovócito na ovulação. Depois da ovulação, o corpo-lúteo produz progesterona.', em: { a: [22, 62] }, z: 2.6 },
      { id: 'ute', c: '#F28B8B', t: 'Endométrio', d: 'Camada interna do útero, preparada pela progesterona. É onde o embrião se implanta.', em: { a: [72, 45] }, z: 2.4 },
      { id: 'bc', c: '#CFE0FF', t: 'Blastocele', d: 'Cavidade do blastocisto, cheia de líquido.', em: { b: [50, 28] }, z: 2.8 },
      { id: 'mci', c: '#F2B6C6', t: 'Massa celular interna', d: 'Grupo de células que formará o embrião. É também chamada de embrioblasto.', em: { b: [50, 45] }, z: 3 },
      { id: 'tro', c: '#C9AEFF', t: 'Trofoblasto', d: 'Camada externa do blastocisto. Invade o endométrio e forma a parte fetal da placenta, que produz o hCG.', em: { b: [66, 20] }, z: 2.8 },
      { id: 'end', c: '#F28B8B', t: 'Endométrio', d: 'O embrião afunda na parede do útero. Esse processo, a nidação, ocorre cerca de 6 a 7 dias depois da fecundação.', em: { b: [30, 65] }, z: 2.4 },
      { id: 'inv', c: '#C9AEFF', t: 'Trofoblasto invadindo', d: 'Projeções do trofoblasto penetram o tecido e alcançam os vasos da mãe.', em: { b: [46, 70] }, z: 3 },
      { id: 'cap', c: '#FF6B6B', t: 'Vasos da mãe', d: 'O hCG liberado pelo trofoblasto chega a esses vasos e sustenta o corpo-lúteo.', em: { b: [17, 87] }, z: 2.6 }
    ],
    sobre(R, X, t, c) {
      if (R.k < .6) return;
      const S = c.S || {}, d = S.v || 0;
      if (R.vista === 'a') {
        // marcador de luz acompanha o embrião pela tuba, conforme o dia do controle
        const f = cl((d - 1) / 3.5, 0, 1) * (CAM.length - 1), i = Math.min(CAM.length - 2, Math.floor(f)), u = f - i;
        const x = CAM[i][0] + (CAM[i + 1][0] - CAM[i][0]) * u, y = CAM[i][1] + (CAM[i + 1][1] - CAM[i][1]) * u, [px, py] = R.pt(x, y);
        brilho(X, px, py, R.s * 4, 'rgba(255,230,160,.55)'); anel(X, px, py, R.s * 2.2, .9, 'rgba(255,230,160,A)', 2);
        X.save(); X.setLineDash([4, 6]); X.strokeStyle = 'rgba(255,230,160,.45)'; X.lineWidth = 2; X.beginPath(); CAM.forEach((p, k) => { const [qx, qy] = R.pt(p[0], p[1]); k ? X.lineTo(qx, qy) : X.moveTo(qx, qy); }); X.stroke(); X.restore();
      } else {
        const p = RED ? .4 : (t * .35) % 1, [px, py] = R.pt(50, 45);
        anel(X, px, py, R.s * (3 + 7 * p), 1 - p, 'rgba(201,174,255,A)', 2);
      }
    }
  });

  LAB_FIGALT.cena(amb, 'humano/placenta', {
    pref: 'embriologia', nome: 'Útero com feto e placenta', mask: MASK,
    vistas: [
      ['a', 'humano-placenta-a', 'Útero com feto', 'O feto no âmnio, ligado à placenta pelo cordão umbilical'],
      ['b', 'humano-placenta-b', 'Placenta em corte', 'Placenta em corte: vilosidades banhadas pelo sangue da mãe']
    ],
    hs: [
      { id: 'pla', c: '#FF6B6B', t: 'Placenta', d: 'Órgão de troca entre mãe e feto. O sangue dos dois circula perto, mas não se mistura. Também produz hormônios, como o hCG e a progesterona.', em: { a: [64, 38] }, z: 2.6 },
      { id: 'cor', c: '#FF8FA3', t: 'Cordão umbilical', d: 'Tem duas artérias, que levam o sangue pobre em O₂ do feto até a placenta, e uma veia, que traz sangue rico em O₂ de volta.', em: { a: [53, 44] }, z: 3 },
      { id: 'amn', c: '#8FD8FF', t: 'Âmnio', d: 'Bolsa com líquido amniótico que protege o feto e permite que ele se mexa.', em: { a: [28, 60] }, z: 2.4 },
      { id: 'fet', c: '#F2B6C6', t: 'Feto', d: 'Recebe O₂ e nutrientes pela placenta e devolve CO₂ e excretas.', em: { a: [41, 45] }, z: 2.6 },
      { id: 'mio', c: '#F28B8B', t: 'Parede do útero', d: 'Musculosa, cresce muito durante a gestação e se contrai no parto.', em: { a: [21, 55] }, z: 2.4 },
      { id: 'cor2', c: '#FF8FA3', t: 'Cordão umbilical', d: 'O cordão sai da face fetal da placenta. Os vasos azuis e vermelhos mostram o sangue pobre e o rico em O₂.', em: { b: [89, 13] }, z: 2.6 },
      { id: 'vil', c: '#F2B6C6', t: 'Vilosidades coriônicas', d: 'Ramos do córion com vasos do feto. É onde ocorrem as trocas de gases e nutrientes com o sangue da mãe.', em: { b: [45, 65] }, z: 2.6 },
      { id: 'fac', c: '#CFE0FF', t: 'Face fetal', d: 'Lado liso da placenta, voltado para o feto, de onde saem os vasos do cordão.', em: { b: [32, 27] }, z: 2.4 },
      { id: 'mae', c: '#E04B4B', t: 'Sangue materno', d: 'Enche os espaços entre as vilosidades. Entrega O₂ e nutrientes e recebe CO₂ e excretas do feto.', em: { b: [52, 82] }, z: 2.6 }
    ]
  });

  // A linha do tempo (semanas após a fecundação e pela DUM) e o tamanho do embrião seguem desenhados pela cena antiga.
  LAB_FIGALT.cena(amb, 'humano/semanas', {
    pref: 'embriologia', nome: 'Embrião humano por semana', mask: MASK, ctl: true,
    manter(W, H, nar) {
      const A = area(), by = A.y1 - (nar ? 86 : 74), top = nar ? A.y0 + 96 : A.y0 + 8, bw = nar ? A.w : A.w * .56;
      return { x: A.x0 + (nar ? 0 : 8), y: top, w: bw, h: by - 66 - top };
    },
    vistas: [
      ['a', 'humano-semanas-a', 'Quatro fases', 'Quatro fases do crescimento, do embrião ao início do período fetal'],
      ['b', 'humano-semanas-b', 'Embrião e saco vitelino', 'Embrião ligado ao saco vitelino pelo pedículo, dentro do âmnio']
    ],
    hs: [
      { id: 'e1', c: '#FFD9A0', t: 'Embrião mais jovem', d: 'Corpo curvo e com cauda. Os órgãos mal começam a se esboçar. Mede poucos milímetros.', em: { a: [8, 66] }, z: 3 },
      { id: 'e2', c: '#FFD9A0', t: 'Embrião em crescimento', d: 'Aparecem os brotos dos membros e a cabeça fica maior em relação ao corpo.', em: { a: [25, 62] }, z: 3 },
      { id: 'e3', c: '#FFD9A0', t: 'Dedos esboçados', d: 'Olhos, orelhas e dedos começam a se formar. Os órgãos principais já estão esboçados.', em: { a: [46, 57] }, z: 2.8 },
      { id: 'e4', c: '#FFD9A0', t: 'Fim do período embrionário', d: 'Aspecto já humano, com cabeça grande e dedos separados. A partir da 9ª semana após a fecundação, é chamado de feto.', em: { a: [79, 47] }, z: 2.4 },
      { id: 'sv', c: '#F2D24B', t: 'Saco vitelino', d: 'Nas primeiras semanas ajuda a nutrir o embrião e forma as primeiras células do sangue e as células germinativas.', em: { b: [21, 60] }, z: 2.6 },
      { id: 'em', c: '#F2B6C6', t: 'Embrião', d: 'Está dobrado em forma de C, no período em que os órgãos se formam. É a fase mais sensível a agentes que causam malformações.', em: { b: [55, 38] }, z: 2.6 },
      { id: 'ped', c: '#FF8FA3', t: 'Pedículo e cordão', d: 'Liga o embrião à placenta em formação.', em: { b: [41, 63] }, z: 3 },
      { id: 'amn', c: '#8FD8FF', t: 'Âmnio', d: 'Bolsa de líquido que envolve o embrião e o protege.', em: { b: [84, 47] }, z: 2.4 }
    ]
  });
})();
