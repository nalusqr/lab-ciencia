/* LAB Biologia molecular: figura de IA por padrão em 2 rotas que tinham desenho fraco (Íris e Dry).
   Mesmo padrão de microrganismos/cenas-figura.js (figura-ia v2 + figura-alterna.js): a figura abre primeiro, com pontos tocáveis
   e uma animação leve por cima; o botão "Ver esquema" mostra a cena antiga (gráfico do dia ou desenho animado) e "Ver figura" volta.
   Quem pede movimento reduzido vê um quadro parado. Carregar depois das cenas e antes de LAB_iniciar(). */
'use strict';
(function () {
  if (!window.LAB_FIGALT || !window.LAB_FIGIA) return;
  const RED = window.LAB_FIGALT.RED, TAU = Math.PI * 2;
  const MASK = { miolo: .94, borda: 1 };
  const cl = (v, a, b) => Math.max(a, Math.min(b, v)), fr = v => v - Math.floor(v);
  const sg = (v, a, b) => cl((v - a) / (b - a), 0, 1), ez = u => u * u * (3 - 2 * u);
  const tt = t => RED ? 3.7 : t;
  const pto = (X, x, y, r, cor, a) => { X.save(); X.globalAlpha *= a == null ? 1 : a; X.fillStyle = cor; X.beginPath(); X.arc(x, y, Math.max(.3, r), 0, TAU); X.fill(); X.restore(); };
  const brilho = (X, x, y, r, cor, a) => { const g = X.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, cor); g.addColorStop(1, 'rgba(0,0,0,0)'); X.save(); X.globalAlpha *= a == null ? 1 : a; X.fillStyle = g; X.beginPath(); X.arc(x, y, r, 0, TAU); X.fill(); X.restore(); };
  const anel = (X, x, y, r, cor, a, lw) => { X.save(); X.globalAlpha *= a; X.strokeStyle = cor; X.lineWidth = lw || 2; X.beginPath(); X.arc(x, y, r, 0, TAU); X.stroke(); X.restore(); };
  const pastilha = (X, x, y, txt, cor) => {
    X.save(); X.font = '600 13px ' + (getComputedStyle(document.body).fontFamily || 'sans-serif');
    const w = X.measureText(txt).width + 28, h = 24, x0 = x - w / 2, y0 = y - h / 2;
    X.beginPath(); X.roundRect ? X.roundRect(x0, y0, w, h, 12) : X.rect(x0, y0, w, h); X.fillStyle = 'rgba(11,15,28,.86)'; X.fill(); X.strokeStyle = 'rgba(255,255,255,.14)'; X.stroke();
    X.fillStyle = cor; X.beginPath(); X.arc(x0 + 12, y, 4, 0, TAU); X.fill();
    X.fillStyle = '#E8EDF7'; X.textBaseline = 'middle'; X.textAlign = 'left'; X.fillText(txt, x0 + 22, y + .5); X.restore();
  };
  const amb = {
    SC, X: () => X, W: () => W, H: () => H, nar: () => NAR, tela: document.querySelector('.palco .tela'), cap: html => cap(html),
    t: a => a[0], baixo: nar => nar ? 100 : 56,
    rot3d: 'Ver esquema', dica3d: '',
    esconder: ['.hud.onde'], esconderFig: ['.barra .ctl']
  };

  // ================= Calor específico: areia muito quente, mar que esquenta pouco =================
  LAB_FIGALT.cena(amb, 'agua/calor', {
    pref: 'biologia-molecular', nome: 'Praia ao meio-dia: areia e mar', mask: false,
    vistas: [['a', 'agua-calor-a', 'Areia e mar', 'Praia ao meio-dia: a areia seca, à esquerda, esquenta muito; o mar, à direita, esquenta pouco']],
    hs: [
      { id: 'sol', c: '#FFE08A', t: 'Mesma energia do Sol', d: 'A areia e a água recebem quase a mesma quantidade de energia do Sol por metro quadrado. A diferença está no que cada uma faz com ela.', em: { a: [35, 17] }, z: 2.2 },
      { id: 'are', c: '#F2B450', t: 'Areia: calor específico baixo', d: 'A areia seca tem cerca de 0,2 cal/(g °C): pouca energia basta para elevar muito a temperatura. Por isso ela queima o pé ao meio-dia e esfria depressa à noite.', em: { a: [22, 70] }, z: 2.6 },
      { id: 'ar', c: '#FFA07A', t: 'Ar quente sobe', d: 'O ar encostado na areia quente esquenta, fica menos denso e sobe. O ar mais frio que vem do mar toma o lugar dele: é a brisa marítima.', em: { a: [22, 41] }, z: 2.6 },
      { id: 'mar', c: '#4FB8E6', t: 'Mar: calor específico alto', d: 'A água tem 1 cal/(g °C), cerca de cinco vezes o da areia. Ela absorve muita energia, em parte rompendo ligações de hidrogênio, antes de esquentar. Por isso a temperatura do mar muda pouco ao longo do dia.', em: { a: [75, 75] }, z: 2.6 }
    ],
    sobre(R, X, t) {
      const T = tt(t), P = R.pt.bind(R), s = R.s, sol = P(35, 17);
      brilho(X, sol[0], sol[1], s * 14, '#FFE9A8', RED ? .3 : .22 + .1 * Math.sin(T * 1.6));
      // energia do Sol chegando: muitos pontos na areia e na água, a mesma quantidade
      [[P(22, 72), 0], [P(75, 76), 1]].forEach(([d, k]) => {
        for (let i = 0; i < 7; i++) { const u = fr(T * .2 + i / 7 + k * .07), x = sol[0] + (d[0] - sol[0]) * u + Math.sin(i * 5 + k) * s * 1.3, y = sol[1] + (d[1] - sol[1]) * u; pto(X, x, y, s * .45, '#FFE08A', RED ? .7 : Math.sin(u * Math.PI) * .9); }
      });
      // ar quente subindo da areia
      for (let i = 0; i < 6; i++) { const u = fr(T * .14 + i / 6), x = P(8 + i * 7, 0)[0] + Math.sin(u * 9 + i * 2) * s * 1.1, y = P(0, 62)[1] - u * s * 17; pto(X, x, y, s * .55, '#FFB28A', RED ? .45 : .5 * Math.sin(u * Math.PI)); }
      // termômetros: a areia sobe e desce muito; o mar quase não muda
      const ph = RED ? .25 : T * .45, fs = .55 + .38 * Math.sin(ph), fm = .5 + .05 * Math.sin(ph);
      [[P(41, 0)[0], fs, '#F2B450', 'areia'], [P(59, 0)[0], fm, '#4FB8E6', 'mar']].forEach(([x, f, cor, nome]) => {
        const y1 = P(0, 95)[1], h = s * 18, w = s * 2.2;
        X.save(); X.fillStyle = 'rgba(11,15,28,.78)'; X.strokeStyle = 'rgba(255,255,255,.35)'; X.lineWidth = 1.5; X.beginPath(); X.roundRect ? X.roundRect(x - w / 2, y1 - h, w, h, w / 2) : X.rect(x - w / 2, y1 - h, w, h); X.fill(); X.stroke();
        X.fillStyle = cor; X.beginPath(); X.roundRect ? X.roundRect(x - w / 2 + 2.5, y1 - 2.5 - (h - 5) * f, w - 5, (h - 5) * f, w / 2) : X.rect(x - w / 2 + 2.5, y1 - 2.5 - (h - 5) * f, w - 5, (h - 5) * f); X.fill(); X.restore();
        pastilha(X, x, y1 - h - 16, nome, cor);
      });
    }
  });

  // ================= Avitaminoses: escorbuto e a vitamina C =================
  LAB_FIGALT.cena(amb, 'vit/avitaminoses', {
    pref: 'biologia-molecular', nome: 'Escorbuto: gengiva e fontes de vitamina C', mask: MASK,
    vistas: [['c', 'vit-avitaminoses-c', 'Escorbuto e vitamina C', 'Corte dos dentes e da gengiva inflamada, à esquerda, e laranjas, limão, acerola e couve, à direita']],
    hs: [
      { id: 'gen', c: '#F28B8B', t: 'Gengiva que sangra', d: 'No escorbuto a gengiva incha, fica vermelha e sangra. Sem vitamina C o corpo não produz colágeno firme, e os vasos e os tecidos ficam frágeis.', em: { c: [33, 52] }, z: 2.8 },
      { id: 'den', c: '#CFE0FF', t: 'Dentes amolecidos', d: 'O colágeno também sustenta o tecido ao redor dos dentes. Na carência grave eles podem ficar frouxos e cair. Feridas demoram a cicatrizar pelo mesmo motivo.', em: { c: [41, 62] }, z: 2.6 },
      { id: 'lar', c: '#FFA94D', t: 'Laranja e limão', d: 'Frutas cítricas são ricas em vitamina C (ácido ascórbico). Os marinheiros das longas viagens tinham escorbuto até levarem frutas cítricas a bordo.', em: { c: [69, 47] }, z: 2.6 },
      { id: 'ace', c: '#E8504A', t: 'Acerola', d: 'É uma das frutas com mais vitamina C, bem mais do que a laranja em igual quantidade.', em: { c: [68, 73] }, z: 3 },
      { id: 'cou', c: '#A9C54A', t: 'Couve', d: 'Folhas verdes frescas também fornecem vitamina C. A vitamina C é hidrossolúvel e sensível ao calor, por isso se perde no cozimento longo.', em: { c: [85, 73] }, z: 2.8 }
    ],
    sobre(R, X, t) {
      const T = tt(t), P = R.pt.bind(R), s = R.s, ph = RED ? .6 : (T % 12) / 12, g = P(33, 53);
      const fontes = [P(69, 47), P(68, 73), P(85, 70)], fim = RED ? .4 : ez(sg(ph, .3, .55)) * (1 - ez(sg(ph, .92, 1)));
      // gotas na gengiva: aparecem sem vitamina C e somem quando ela chega
      const gota = RED ? 1 : 1 - ez(sg(ph, .5, .85));
      if (gota > 0) for (let i = 0; i < 3; i++) { const u = fr(T * .3 + i / 3), p = P(31 + i * 4, 55); pto(X, p[0], p[1] + u * s * 5, s * .5, '#D8403A', gota * Math.sin(u * Math.PI)); }
      fontes.forEach((f, j) => { for (let i = 0; i < 5; i++) { const u = fr(T * .13 + i / 5 + j * .17), x = f[0] + (g[0] - f[0]) * u, y = f[1] + (g[1] - f[1]) * u - Math.sin(u * Math.PI) * s * 10; pto(X, x, y, s * .55, '#FFD27A', fim * Math.sin(u * Math.PI)); } });
      anel(X, g[0], g[1], s * (4 + 3 * fr(T * .3)), fim > .2 ? '#7BE0A0' : '#F28B8B', RED ? .5 : .55 * (1 - fr(T * .3)), 2);
    }
  });
})();
