/* LAB Bioenergética: figura de IA por padrão em 5 rotas (foto/geral passou para cenas-figura-foto.js) que já têm cena 3D do Martin (Aurelius).
   A figura (figura-ia.js v2, vistas A e B, pontos e zoom) abre primeiro; o botão "Ver em 3D" alterna e "Ver figura" volta.
   O .js de cada imagem só entra na página quando a cena abre. O motion é leve e fica por cima, como a nota de cada cena pede.
   Usa os globais do motor (SC, X, W, H, cap). Carregar antes de LAB8_iniciar(). */
'use strict';
(function () {
  if (!window.LAB_FIGALT || !window.LAB_FIGIA) return;
  const TAU = Math.PI * 2, RED = LAB_FIGALT.RED;
  const MASK = { miolo: .86, borda: 1 };
  const amb = {
    SC, X: () => X, W: () => W, H: () => H, tela: cv.parentNode, cap: html => cap(html),
    t: a => a[0], baixo: nar => nar ? 100 : 84,
    esconder: ['.hud.onde'], esconderFig: ['.palco .ctl']
  };
  const fz = (R, v) => Math.max(12, Math.min(14, R.s * 1.5 * v));
  const ease = u => u < .5 ? 2 * u * u : 1 - 2 * (1 - u) * (1 - u);
  // ficha de molécula com nome, centrada em (x, y)
  function ficha(X, x, y, s, cor, a, tam) {
    X.save(); X.globalAlpha *= a; X.font = `600 ${tam || 13}px 'Atkinson Hyperlegible Next', system-ui, sans-serif`; X.textAlign = 'center'; X.textBaseline = 'middle';
    const w = X.measureText(s).width + 16, h = (tam || 13) + 10;
    X.fillStyle = 'rgba(11,15,28,.86)'; X.strokeStyle = cor; X.lineWidth = 1.5; X.beginPath(); X.roundRect(x - w / 2, y - h / 2, w, h, h / 2); X.fill(); X.stroke();
    X.fillStyle = '#F2F5FB'; X.fillText(s, x, y + .5); X.restore();
  }
  function seta(X, x1, y1, x2, y2, cor, a, lw) {
    const ang = Math.atan2(y2 - y1, x2 - x1), L = 7;
    X.save(); X.globalAlpha *= a; X.strokeStyle = cor; X.fillStyle = cor; X.lineWidth = lw || 2; X.lineCap = 'round';
    X.beginPath(); X.moveTo(x1, y1); X.lineTo(x2, y2); X.stroke();
    X.beginPath(); X.moveTo(x2, y2); X.lineTo(x2 - Math.cos(ang - .5) * L, y2 - Math.sin(ang - .5) * L); X.lineTo(x2 - Math.cos(ang + .5) * L, y2 - Math.sin(ang + .5) * L); X.closePath(); X.fill(); X.restore();
  }
  // cadeia de fichas ligadas por setas, com um ponto de luz que percorre o caminho
  function via(R, X, t, pts, nomes, cor, tam) {
    const P = pts.map(p => R.pt(p[0], p[1])), tm = tam || 13;
    X.font = `600 ${tm}px 'Atkinson Hyperlegible Next', system-ui, sans-serif`;
    const mw = nomes.map(n => X.measureText(n).width / 2 + 12), mh = tm / 2 + 9;
    for (let i = 0; i < P.length - 1; i++) {
      const [a, b] = [P[i], P[i + 1]], d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, ux = (b[0] - a[0]) / d, uy = (b[1] - a[1]) / d;
      const ga = Math.abs(ux) > Math.abs(uy) ? mw[i] : mh, gb = Math.abs(ux) > Math.abs(uy) ? mw[i + 1] : mh;
      if (d > ga + gb + 14) seta(X, a[0] + ux * ga, a[1] + uy * ga, b[0] - ux * gb, b[1] - uy * gb, cor, .85);
    }
    const f = RED ? .5 : (t * .22) % 1, k = f * (P.length - 1), i = Math.min(P.length - 2, Math.floor(k)), u = k - i;
    const x = P[i][0] + (P[i + 1][0] - P[i][0]) * u, y = P[i][1] + (P[i + 1][1] - P[i][1]) * u;
    const g = X.createRadialGradient(x, y, 0, x, y, 12); g.addColorStop(0, 'rgba(255,240,180,.95)'); g.addColorStop(1, 'rgba(255,240,180,0)'); X.fillStyle = g; X.beginPath(); X.arc(x, y, 12, 0, TAU); X.fill();
    P.forEach((p, j) => ficha(X, p[0], p[1], nomes[j], cor, 1, tam));
  }
  // bolhas de gás subindo a partir de uma lista de origens [x%, y%]
  function bolhas(R, X, t, orig, n, alt, cor) {
    X.save(); X.lineWidth = 1.4;
    for (let i = 0; i < n; i++) {
      const o = orig[i % orig.length], ph = (i * .618 + (i % 3) * .11) % 1, f = RED ? ph : ((t * .16 + ph) % 1);
      const jx = (((i * 37) % 17) - 8) * .35, x = o[0] + jx + Math.sin(f * 9 + i) * 1.1, y = o[1] - f * alt, a = Math.sin(f * Math.PI), r = R.s * (.55 + ((i * 7) % 5) * .17);
      const [px, py] = R.pt(x, y); X.strokeStyle = `rgba(235,246,255,${.8 * a})`; X.fillStyle = `rgba(235,246,255,${.12 * a})`;
      X.beginPath(); X.arc(px, py, r, 0, TAU); X.fill(); X.stroke();
    }
    X.restore();
  }
  // fluxo: curva quadrática de a até b passando por c, com pontos viajando
  function fluxo(R, X, t, a, c, b, cor, off) {
    const A = R.pt(a[0], a[1]), C = R.pt(c[0], c[1]), B = R.pt(b[0], b[1]);
    const pos = u => [(1 - u) * (1 - u) * A[0] + 2 * (1 - u) * u * C[0] + u * u * B[0], (1 - u) * (1 - u) * A[1] + 2 * (1 - u) * u * C[1] + u * u * B[1]];
    X.save(); X.strokeStyle = cor; X.globalAlpha = .6; X.lineWidth = 2.4; X.setLineDash([6, 7]); X.beginPath(); X.moveTo(A[0], A[1]); X.quadraticCurveTo(C[0], C[1], B[0], B[1]); X.stroke(); X.setLineDash([]); X.globalAlpha = 1;
    for (let i = 0; i < 4; i++) {
      const u = RED ? (i + off) / 4 % 1 : ((t * .14 + off + i / 4) % 1), [x, y] = pos(u), a2 = Math.sin(u * Math.PI);
      X.fillStyle = cor; X.globalAlpha = .9 * a2; X.beginPath(); X.arc(x, y, Math.max(4, R.s * 1), 0, TAU); X.fill();
    }
    const [x2, y2] = pos(.97), [x1, y1] = pos(.9); X.globalAlpha = .9; X.fillStyle = cor;
    const an = Math.atan2(y2 - y1, x2 - x1); X.beginPath(); X.moveTo(B[0], B[1]); X.lineTo(B[0] - Math.cos(an - .5) * 9, B[1] - Math.sin(an - .5) * 9); X.lineTo(B[0] - Math.cos(an + .5) * 9, B[1] - Math.sin(an + .5) * 9); X.closePath(); X.fill();
    X.restore();
  }

  // ================= FERMENTAÇÃO =================
  LAB_FIGALT.cena(amb, 'ferm/latica', {
    pref: 'bioenergetica', nome: 'Iogurte e músculo: fermentação lática', mask: MASK,
    vistas: [
      ['a', 'ferm-latica-a', 'Iogurte', 'Lactobacilos fermentam a lactose do leite e fazem o iogurte'],
      ['b', 'ferm-latica-b', 'Músculo', 'No músculo, sem O₂ suficiente, o piruvato vira lactato']
    ],
    hs: [
      { id: 'iog', c: '#FFF1D6', t: 'Iogurte', d: 'Leite fermentado por lactobacilos. Eles transformam a lactose em ácido lático, que azeda e engrossa o leite.', em: { a: [59, 17] }, z: 2.4 },
      { id: 'pote', c: '#CFE0FF', t: 'Fermentação lática', d: 'Sem O₂, os lactobacilos fazem glicólise e convertem o piruvato em lactato. Não há liberação de CO₂.', em: { a: [54, 68] }, z: 2 },
      { id: 'acid', c: '#FFB3B3', t: 'Acidez', d: 'O lactato baixa o pH e coagula as proteínas do leite, por isso o iogurte fica espesso.', em: { a: [48, 40] }, z: 2.4 },
      { id: 'musc', c: '#FF7A7A', t: 'Músculo da coxa', d: 'Em esforço muito intenso, o O₂ não chega na mesma velocidade que a célula precisa de ATP.', em: { b: [16, 45] }, z: 2.2 },
      { id: 'fibra', c: '#FF9A9A', t: 'Fibra muscular', d: 'Sem O₂ suficiente, a fibra faz fermentação lática: o piruvato vira lactato e o NAD⁺ volta para a glicólise continuar.', em: { b: [62, 28] }, z: 2.6 },
      { id: 'mito', c: '#FFA94D', t: 'Mitocôndria', d: 'Faz a respiração aeróbia quando há O₂. Quando falta, a fermentação lática completa o ATP, mas rende só 2 por glicose.', em: { b: [67, 40] }, z: 3 },
      { id: 'hem', c: '#FF5A5A', t: 'Hemácias', d: 'Levam O₂ ao músculo. Quando o esforço é maior que o suprimento de O₂, a fermentação entra em ação.', em: { b: [74, 68] }, z: 2.8 }
    ],
    sobre(R, X, t) {
      if (R.k < .6 || R.z > 1.6) return;
      if (R.vista === 'a') via(R, X, t, [[90, 34], [90, 52], [90, 70]], ['glicose', 'piruvato', 'lactato'], '#FFD6A0', fz(R, 1));
      else via(R, X, t, [[56, 91], [72, 91], [88, 91]], ['glicose', 'piruvato', 'lactato'], '#FFD6A0', fz(R, 1));
    }
  });

  LAB_FIGALT.cena(amb, 'ferm/alcoolica', {
    pref: 'bioenergetica', nome: 'Pão e leveduras: fermentação alcoólica', mask: { miolo: .92, borda: 1 },
    vistas: [
      ['a', 'ferm-alcoolica-a', 'Pão e fermento', 'O CO₂ da fermentação das leveduras abre os buracos do pão'],
      ['b', 'ferm-alcoolica-b', 'Leveduras', 'Leveduras em brotamento liberando bolhas de CO₂']
    ],
    hs: [
      { id: 'pao', c: '#E8C48A', t: 'Pão', d: 'A massa cresce porque as leveduras liberam CO₂. O gás fica preso na rede de glúten e abre os buracos do miolo.', em: { a: [40, 46] }, z: 2 },
      { id: 'miolo', c: '#FFE1A6', t: 'Alvéolos do miolo', d: 'Cada buraco foi uma bolha de CO₂ presa na massa. O álcool também se forma, mas evapora no forno.', em: { a: [30, 63] }, z: 2.6 },
      { id: 'crosta', c: '#D49A4A', t: 'Crosta', d: 'No forno o calor mata as leveduras e a fermentação para. A cor dourada vem do calor sobre os açúcares e as proteínas.', em: { a: [11, 35] }, z: 2.4 },
      { id: 'ferm', c: '#F2D8A8', t: 'Fermento biológico', d: 'Grânulos de leveduras (Saccharomyces cerevisiae), fungos unicelulares. Na massa úmida voltam à atividade.', em: { a: [79, 78] }, z: 3 },
      { id: 'lev', c: '#CFE0FF', t: 'Levedura', d: 'Fungo unicelular. Sem O₂, quebra a glicose em etanol e CO₂ e produz 2 ATP por glicose.', em: { b: [42, 41] }, z: 2.6 },
      { id: 'broto', c: '#8FD8FF', t: 'Broto', d: 'A levedura se reproduz por brotamento: uma célula menor cresce junto da maior e depois se solta.', em: { b: [52, 34] }, z: 3 },
      { id: 'co2', c: '#E8F4FF', t: 'Bolhas de CO₂', d: 'O gás carbônico liberado forma bolhas. É ele que faz a massa crescer e o vinho e a cerveja espumarem.', em: { b: [30, 29] }, z: 3 }
    ],
    sobre(R, X, t) {
      if (R.k < .6) return;
      if (R.vista === 'a') { bolhas(R, X, t, [[79, 76], [74, 74], [84, 74]], 7, 22, '#fff'); bolhas(R, X, t + 3, [[30, 60], [50, 52], [64, 62]], 6, 12, '#fff'); }
      else bolhas(R, X, t, [[20, 40], [45, 55], [75, 60], [60, 85], [30, 80], [88, 35], [50, 20]], 18, 30, '#fff');
      const [px, py] = R.vista === 'a' ? R.pt(87, 64) : R.pt(70, 42);
      if (R.z < 1.6) ficha(X, px, py, 'CO₂', '#BFE6FF', .9, fz(R, 1));
    }
  });

  // FOTOSSÍNTESE (foto/geral): a viagem da fotossíntese mora em cenas-figura-foto.js

  // ================= FATORES LIMITANTES =================
  const ESTOMAS = [
    [14, 27, 'c3'], [29, 25, 'c3'], [16, 75, 'c3'],
    [43, 25, 'c4'], [48, 75, 'c4'],
    [76, 27, 'cam'], [92, 25, 'cam'], [82, 75, 'cam']
  ];
  LAB_FIGALT.cena(amb, 'fatores/c4cam', {
    pref: 'bioenergetica', nome: 'Cortes de folha C3, C4 e CAM', mask: false,
    vistas: [
      ['a', 'fatores-c4cam-a', 'Folhas C3, C4 e CAM', 'Da esquerda para a direita: folha C3, folha C4 com a bainha em coroa e folha CAM com vacúolos grandes'],
      ['b', 'fatores-c4cam-b', 'Estômato de perto', 'O estômato visto de perto: duas células-guarda em volta do poro']
    ],
    hs: [
      { id: 'c3', c: '#7FDA9C', t: 'Folha C3', d: 'Fixa o CO₂ direto no ciclo de Calvin, em todo o mesófilo. Com calor e seca, perde mais água e sofre fotorrespiração.', em: { a: [15, 45] }, z: 2.4 },
      { id: 'c4', c: '#E8D26A', t: 'Folha C4', d: 'Tem a bainha do feixe vascular em coroa. O CO₂ é fixado antes no mesófilo e levado à bainha, onde ocorre o ciclo de Calvin.', em: { a: [47, 48] }, z: 2.6 },
      { id: 'cam', c: '#8FD8FF', t: 'Folha CAM', d: 'Células com vacúolos grandes. O CO₂ entra à noite e é guardado como ácido. De dia os estômatos fecham e o ciclo de Calvin usa esse CO₂.', em: { a: [87, 54] }, z: 2.4 },
      { id: 'est', c: '#FFFFFF', t: 'Estômatos', d: 'Poros da epiderme que deixam entrar CO₂ e sair vapor de água. Abrem e fecham pelas células-guarda.', em: { a: [14, 27] }, z: 3.4 },
      { id: 'gu', c: '#C4E36A', t: 'Célula-guarda', d: 'Quando ganha água, a célula-guarda se curva e o poro abre. Quando perde água, o poro fecha.', em: { b: [37, 33] }, z: 2.6 },
      { id: 'os', c: '#FFFFFF', t: 'Ostíolo', d: 'O poro por onde entra o CO₂ e sai o vapor de água.', em: { b: [50, 30] }, z: 3 },
      { id: 'pal', c: '#7FDA9C', t: 'Parênquima paliçádico', d: 'Células alongadas e cheias de cloroplastos. É onde ocorre a maior parte da fotossíntese.', em: { b: [45, 66] }, z: 2.4 },
      { id: 'lac', c: '#A9C54A', t: 'Parênquima lacunoso', d: 'Células soltas, com espaços cheios de ar que levam o CO₂ até as células.', em: { b: [35, 88] }, z: 2.4 },
      { id: 'epi', c: '#CFE0FF', t: 'Epiderme', d: 'Camada externa, coberta por cutícula, que reduz a perda de água.', em: { b: [86, 22] }, z: 2.4 }
    ],
    sobre(R, X, t) {
      if (R.vista !== 'a' || R.k < .6) return;
      // dia e noite se alternam; C3 e C4 abrem de dia, CAM abre à noite
      const u = RED ? .25 : (t / 9) % 1, dia = u < .5, k = dia ? Math.sin(u * 2 * Math.PI) : Math.sin((u - .5) * 2 * Math.PI);
      const abre = g => Math.max(0, g === 'cam' ? (dia ? 0 : k) : (dia ? k : 0));
      ESTOMAS.forEach(([x, y, g]) => {
        const [px, py] = R.pt(x, y), o = abre(g), rw = R.s * 2.1, rh = R.s * 1.35;
        X.save(); X.fillStyle = 'rgba(244,247,200,.92)'; X.strokeStyle = 'rgba(30,70,30,.9)'; X.lineWidth = 1.4;
        X.beginPath(); X.ellipse(px, py, rw, rh, 0, 0, TAU); X.fill(); X.stroke();
        X.fillStyle = '#0E2410'; X.beginPath(); X.ellipse(px, py, Math.max(.4, rw * .88 * o), Math.max(.8, rh * .55), 0, 0, TAU); X.fill();
        if (o > .35) { const f = RED ? .5 : (t * .6 + x) % 1; X.fillStyle = `rgba(190,230,255,${.8 * (1 - f)})`; X.beginPath(); X.arc(px, py - R.s * 1.5 - f * R.s * 3.2, Math.max(2, R.s * .5), 0, TAU); X.fill(); }
        X.restore();
      });
      if (R.z < 1.6) {
        ficha(X, ...R.pt(19, 90), 'Planta C3', '#7FDA9C', 1, fz(R, 1)); ficha(X, ...R.pt(50, 90), 'Planta C4', '#E8D26A', 1, fz(R, 1)); ficha(X, ...R.pt(82, 90), 'Planta CAM', '#8FD8FF', 1, fz(R, 1));
        ficha(X, ...R.pt(50, 7), dia ? 'Dia: C3 e C4 abrem os estômatos' : 'Noite: a CAM abre os estômatos', dia ? '#FFD43B' : '#9DB4FF', 1, fz(R, 1));
      }
    }
  });

  // ================= RELAÇÕES E QUIMIOSSÍNTESE =================
  LAB_FIGALT.cena(amb, 'relacao/carbono', {
    pref: 'bioenergetica', nome: 'Ciclo do carbono na paisagem', mask: { miolo: .93, borda: 1 },
    vistas: [
      ['a', 'relacao-carbono-a', 'Paisagem', 'O carbono circula entre atmosfera, seres vivos, oceano e solo'],
      ['b', 'relacao-carbono-b', 'Solo por dentro', 'No solo, raízes, fungos e animais devolvem o carbono ao ambiente']
    ],
    hs: [
      { id: 'arv', c: '#7FDA9C', t: 'Árvore', d: 'Fixa o carbono do CO₂ pela fotossíntese e o guarda em açúcares e madeira.', em: { a: [15, 22] }, z: 2.4 },
      { id: 'fab', c: '#FF9A3C', t: 'Fábrica e fumaça', d: 'A queima de combustíveis fósseis devolve ao ar o carbono guardado há milhões de anos, como CO₂.', em: { a: [56, 38] }, z: 2.6 },
      { id: 'vaca', c: '#F2F4F8', t: 'Consumidor', d: 'Come o carbono guardado na planta e devolve parte ao ar pela respiração celular.', em: { a: [33, 40] }, z: 3 },
      { id: 'mar', c: '#6FC3FF', t: 'Oceano', d: 'Dissolve CO₂ do ar. Algas e fitoplâncton o fixam na fotossíntese, e os animais marinhos o devolvem pela respiração.', em: { a: [80, 58] }, z: 2.2 },
      { id: 'solo', c: '#C9A06A', t: 'Solo', d: 'Guarda carbono na matéria orgânica. Os decompositores o devolvem ao ar como CO₂.', em: { a: [30, 76] }, z: 2.2 },
      { id: 'raiz', c: '#E8C48A', t: 'Raízes', d: 'Levam água e sais para a planta. As raízes também respiram e liberam CO₂ no solo.', em: { b: [24, 55] }, z: 2.4 },
      { id: 'fungo', c: '#F2F4F8', t: 'Hifas de fungos', d: 'Os fungos decompõem a matéria morta e devolvem o carbono ao ambiente como CO₂.', em: { b: [68, 34] }, z: 2.8 },
      { id: 'min', c: '#FFB3B3', t: 'Minhoca', d: 'Detritívora: fragmenta a matéria orgânica e acelera a decomposição.', em: { b: [79, 56] }, z: 3 },
      { id: 'fol', c: '#D49A4A', t: 'Folhiço', d: 'Folhas e galhos mortos. É uma reserva de matéria orgânica que os decompositores aproveitam.', em: { b: [12, 32] }, z: 2.6 },
      { id: 'cog', c: '#E8C48A', t: 'Cogumelo', d: 'Parte reprodutiva de um fungo decompositor.', em: { b: [28, 17] }, z: 3 }
    ],
    sobre(R, X, t) {
      if (R.k < .6) return;
      if (R.vista === 'a') {
        fluxo(R, X, t, [46, 14], [30, 8], [20, 20], '#7FDA9C', 0);
        fluxo(R, X, t, [56, 32], [50, 22], [54, 12], '#FF9A3C', .3);
        fluxo(R, X, t, [62, 14], [84, 18], [80, 50], '#6FC3FF', .55);
        fluxo(R, X, t, [30, 70], [24, 54], [27, 38], '#E8C48A', .8);
        if (R.z < 1.6) {
          const L = [['#7FDA9C', 'fotossíntese'], ['#FF9A3C', 'combustão'], ['#6FC3FF', 'dissolução'], ['#E8C48A', 'decomposição']];
          L.forEach((q, i) => { const [x, y] = R.pt(14 + i * 24, 95); ficha(X, x, y, q[1], q[0], 1, fz(R, 1)); });
        }
      } else {
        fluxo(R, X, t, [68, 36], [64, 24], [68, 12], '#E8C48A', 0);
        fluxo(R, X, t, [24, 54], [14, 40], [14, 26], '#E8C48A', .5);
        if (R.z < 1.6) ficha(X, ...R.pt(68, 8), 'CO₂ para o ar', '#E8C48A', 1, fz(R, 1));
      }
    }
  });

  LAB_FIGALT.cena(amb, 'relacao/quimio', {
    pref: 'bioenergetica', nome: 'Fonte hidrotermal e bactérias quimiossintetizantes', mask: MASK,
    vistas: [
      ['a', 'relacao-quimio-a', 'Fonte hidrotermal', 'Fonte hidrotermal no fundo do mar: sem luz, a energia vem de reações químicas'],
      ['b', 'relacao-quimio-b', 'Bactérias', 'Bactérias quimiossintetizantes com grânulos de enxofre sobre a rocha']
    ],
    hs: [
      { id: 'fum', c: '#9DA9C4', t: 'Fumaça escura', d: 'Água muito quente, rica em sulfetos e H₂S, sai de fendas no fundo do mar, onde não chega luz solar.', em: { a: [62, 14] }, z: 2.4 },
      { id: 'cham', c: '#FFB074', t: 'Chaminé hidrotermal', d: 'Os minerais se depositam e formam a chaminé. É a fonte de energia química de todo esse ecossistema.', em: { a: [60, 45] }, z: 2.4 },
      { id: 'ver', c: '#FF5A6A', t: 'Vermes tubulares', d: 'Não têm boca nem intestino. Abrigam bactérias quimiossintetizantes e vivem em mutualismo com elas.', em: { a: [13, 40] }, z: 2.6 },
      { id: 'cara', c: '#F2F4F8', t: 'Caranguejo', d: 'Consumidor: se alimenta de bactérias e de outros seres da comunidade.', em: { a: [27, 79] }, z: 3 },
      { id: 'sulf', c: '#F2B33D', t: 'Rocha com sulfetos', d: 'Os sulfetos metálicos da rocha também servem de fonte de energia para as bactérias.', em: { a: [73, 66] }, z: 2.8 },
      { id: 'bac', c: '#F2D24B', t: 'Bactéria quimiossintetizante', d: 'Oxida o H₂S e usa essa energia química para fabricar glicose a partir de CO₂. Não precisa de luz.', em: { b: [59, 67] }, z: 2.6 },
      { id: 'gran', c: '#FFE24A', t: 'Grânulos de enxofre', d: 'Guardam o enxofre produzido na oxidação do H₂S.', em: { b: [13, 62] }, z: 3.2 },
      { id: 'tap', c: '#CFE0FF', t: 'Tapete de bactérias', d: 'São os produtores da base da cadeia alimentar, num lugar onde não chega luz.', em: { b: [36, 30] }, z: 2.4 },
      { id: 'roc', c: '#C9A06A', t: 'Rocha da chaminé', d: 'Fonte de sulfetos e de água quente para as bactérias.', em: { b: [86, 80] }, z: 2.6 }
    ],
    sobre(R, X, t) {
      if (R.k < .6) return;
      if (R.vista === 'a') {
        // calor e partículas subindo da chaminé
        X.save();
        for (let i = 0; i < 12; i++) { const f = RED ? i / 12 : ((t * .12 + i / 12) % 1), x = 60 + Math.sin(i * 2.1 + f * 6) * 3 + (i % 3) * 1.2, y = 44 - f * 34, [px, py] = R.pt(x, y); X.fillStyle = `rgba(255,190,130,${.55 * Math.sin(f * Math.PI)})`; X.beginPath(); X.arc(px, py, R.s * (.5 + f * .5), 0, TAU); X.fill(); }
        X.restore();
        if (R.z < 1.6) ficha(X, ...R.pt(80, 40), 'H₂S sobe com a água quente', '#FFB074', 1, fz(R, 1));
      } else {
        if (R.z > 1.6) return;
        const alvo = [59, 67], fonte = [[44, 90, 'H₂S', '#F2D24B'], [92, 22, 'O₂', '#8FD8FF'], [70, 8, 'CO₂', '#C9CED8']];
        fonte.forEach((q, i) => {
          const u = RED ? .4 : ((t * .17 + i / 3) % 1), e = ease(u), x = q[0] + (alvo[0] - q[0]) * e, y = q[1] + (alvo[1] - q[1]) * e;
          const [ax, ay] = R.pt(q[0], q[1]), [bx, by] = R.pt(alvo[0], alvo[1]);
          X.save(); X.strokeStyle = q[3]; X.globalAlpha = .28; X.lineWidth = 1.5; X.setLineDash([4, 6]); X.beginPath(); X.moveTo(ax, ay); X.lineTo(bx, by); X.stroke(); X.restore();
          const [px, py] = R.pt(x, y); ficha(X, px, py, q[2], q[3], Math.sin(u * Math.PI) * .95 + .05, fz(R, .95));
        });
        const u = RED ? .5 : ((t * .17 + .2) % 1), x = alvo[0] + (88 - alvo[0]) * ease(u), y = alvo[1] + (46 - alvo[1]) * ease(u);
        ficha(X, ...R.pt(x, y), 'glicose', '#7FDA9C', Math.sin(u * Math.PI) * .95 + .05, fz(R, .95));
      }
    }
  });
})();
