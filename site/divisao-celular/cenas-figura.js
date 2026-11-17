/* LAB Citogenética: figura de IA por padrão nas rotas ciclo/cancer e erros/aneuploidias (Aurelius).
   Cada rota já tem uma cena 3D do Martin; aqui a figura (figura-ia.js v2) abre primeiro e o botão "Ver em 3D" alterna.
   O .js de cada imagem só entra na página quando a cena abre. O motion é leve e fica por cima da figura. */
'use strict';
(function () {
  if (!window.LAB_FIGALT || !window.LAB_FIGIA) return;
  const TAU = Math.PI * 2, RED = LAB_FIGALT.RED;
  const MASK = { miolo: .9, borda: 1 };
  const clk = () => RED ? 0 : performance.now() / 1000;
  (window.LAB_CITO = window.LAB_CITO || []).push(K => {
    const amb = {
      SC: K.SC, X: () => K.X, W: () => K.W, H: () => K.H, tela: document.getElementById('view'),
      t: () => clk(),
      plano: (o3, a) => o3.plano(0, { i: a[0], e: a[1], f: a[2], tm: a[3] }),
      esconder: ['.hud', '.ctrl'],
      ao3d() { const b = document.getElementById('again'); if (b) b.click(); }
    };
    const anel = (X, x, y, r, p, cor, lw) => { X.strokeStyle = cor.replace('A', (.75 * (1 - p)).toFixed(3)); X.lineWidth = lw || 2; X.beginPath(); X.arc(x, y, r, 0, TAU); X.stroke(); };
    const brilho = (X, x, y, r, cor) => { const g = X.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, cor); g.addColorStop(1, 'rgba(0,0,0,0)'); X.fillStyle = g; X.beginPath(); X.arc(x, y, r, 0, TAU); X.fill(); };

    // ---------- Ciclo celular: câncer ----------
    LAB_FIGALT.cena(amb, 'ciclo/cancer', {
      pref: 'divisao-celular', nome: 'Epitélio com célula mutante e tumor', mask: MASK,
      vistas: [
        ['a', 'ciclo-cancer-a', 'Epitélio e mutação', 'Células mutantes se destacam na camada ordenada do epitélio'],
        ['b', 'ciclo-cancer-b', 'Tumor formado', 'Um tumor: células em divisão sem controle, perto do vaso sanguíneo']
      ],
      hs: [
        { id: 'mut1', c: '#FF7A7A', t: 'Célula mutante', d: 'Perdeu o controle do ciclo celular. O núcleo está escuro e irregular, e a célula escapa da camada ordenada.', em: { a: [36, 37] }, z: 2.6 },
        { id: 'mut2', c: '#FF9A6A', t: 'Célula em proliferação', d: 'Ela se divide sem parar e empurra as vizinhas. Cada divisão copia a mutação para as células-filhas.', em: { a: [57, 40] }, z: 2.6 },
        { id: 'norm', c: '#F2B6C6', t: 'Célula normal', d: 'Núcleo regular, forma alinhada e divisão só quando o tecido precisa repor células.', em: { a: [17, 72] }, z: 2.4 },
        { id: 'basal', c: '#C9AEFF', t: 'Membrana basal', d: 'Separa o epitélio do tecido de baixo. Enquanto o tumor não a rompe, ele ainda não invadiu os tecidos vizinhos.', em: { a: [22, 84] }, z: 2.4 },
        { id: 'mit1', c: '#FFD43B', t: 'Mitose no tumor', d: 'Várias células do tumor estão em divisão ao mesmo tempo: a proliferação é descontrolada.', em: { b: [64, 28] }, z: 3 },
        { id: 'mit2', c: '#FFB3E6', t: 'Cromossomos em divisão', d: 'Na mitose os cromossomos se condensam e se alinham no meio da célula. Em células tumorais a divisão costuma ter erros.', em: { b: [53, 56] }, z: 3 },
        { id: 'massa', c: '#E58FB0', t: 'Massa tumoral', d: 'As células mutantes se acumulam e formam o tumor, que cresce e deforma o tecido.', em: { b: [45, 30] }, z: 2.2 },
        { id: 'epit', c: '#F2B6C6', t: 'Epitélio normal', d: 'Células alinhadas, com núcleo regular, ao lado do tumor.', em: { b: [14, 64] }, z: 2.4 },
        { id: 'conj', c: '#C9AEFF', t: 'Tecido conjuntivo', d: 'Camada de fibras abaixo do epitélio. Se as células do tumor atravessam a membrana basal e chegam aqui, o câncer é invasivo.', em: { b: [35, 84] }, z: 2.4 },
        { id: 'vaso', c: '#FF5A5A', t: 'Vaso sanguíneo', d: 'Por vasos como este as células tumorais podem cair na circulação e formar metástases em outros órgãos.', em: { b: [75, 83] }, z: 2.6 }
      ],
      sobre(R, X, t) {
        if (R.k < .6) return;
        if (R.vista === 'a') {
          // as duas células mutantes pulsam e soltam anéis, como divisões em sequência
          [[36, 37, 0], [57, 40, .5]].forEach(([x, y, off]) => {
            const [px, py] = R.pt(x, y), p = RED ? .4 : ((t * .45 + off) % 1);
            brilho(X, px, py, R.s * 5.5, `rgba(255,90,90,${.22 + .1 * Math.sin(p * TAU)})`);
            anel(X, px, py, R.s * (3 + 5 * p), p, 'rgba(255,120,120,A)', 2);
            if (!RED) { const d = R.s * 3.2 * Math.min(1, p * 1.6), a = Math.sin(p * Math.PI); X.fillStyle = `rgba(255,150,150,${.55 * a})`; X.beginPath(); X.arc(px - d, py, R.s * 1.1, 0, TAU); X.arc(px + d, py, R.s * 1.1, 0, TAU); X.fill(); }
          });
        } else {
          [[64, 28, 0], [53, 56, .35]].forEach(([x, y, off]) => {
            const [px, py] = R.pt(x, y), p = RED ? .4 : ((t * .5 + off) % 1);
            anel(X, px, py, R.s * (2.5 + 5 * p), p, 'rgba(255,214,90,A)', 2);
          });
        }
      }
    });

    // ---------- Alterações cromossômicas: aneuploidias ----------
    LAB_FIGALT.cena(amb, 'erros/aneuploidias', {
      pref: 'divisao-celular', nome: 'Cariótipo com trissomia do 21 e célula em anáfase', mask: false,
      vistas: [
        ['a', 'erros-aneuploidias-a', 'Cariótipo trissomia 21', 'Cariótipo com três cromossomos 21: a trissomia que causa a síndrome de Down'],
        ['b', 'erros-aneuploidias-b', 'Anáfase', 'Anáfase: cromátides vão para polos opostos. Se a separação falha, surge uma aneuploidia']
      ],
      hs: [
        { id: 'tri', c: '#FFD43B', t: 'Três cromossomos 21', d: 'O par 21 tem um cromossomo extra: é a trissomia do 21, que causa a síndrome de Down. O indivíduo tem 47 cromossomos em vez de 46.', em: { a: [48, 84] }, z: 3 },
        { id: 'par', c: '#CFE0FF', t: 'Par normal', d: 'Um par de homólogos completo: um cromossomo veio do pai e outro da mãe. O normal é ter dois de cada.', em: { a: [13, 86] }, z: 3 },
        { id: 'grande', c: '#C9AEFF', t: 'Par 1, o maior', d: 'Os pares são numerados do maior para o menor. Cada cromossomo aparece duplicado, com duas cromátides.', em: { a: [11, 16] }, z: 2.6 },
        { id: 'cent', c: '#F2B33D', t: 'Centrômero', d: 'A região mais estreita, onde as cromátides ficam unidas e onde se prendem as fibras do fuso.', em: { a: [49, 15] }, z: 3.4 },
        { id: 'polo', c: '#FFD43B', t: 'Polo da célula', d: 'Nos polos ficam os centrossomos, de onde saem as fibras do fuso que puxam os cromossomos.', em: { b: [12, 49] }, z: 2.8 },
        { id: 'fuso', c: '#F2B33D', t: 'Fibras do fuso', d: 'Puxam as cromátides para os polos opostos. Se um par não se separa, a não disjunção gera células com um cromossomo a mais ou a menos.', em: { b: [22, 38] }, z: 2.6 },
        { id: 'roxo', c: '#B08CFF', t: 'Cromossomos migrando', d: 'Na anáfase as cromátides irmãs se separam e cada polo recebe um conjunto igual de cromossomos.', em: { b: [33, 32] }, z: 2.8 },
        { id: 'verm', c: '#FF7A7A', t: 'Outro conjunto', d: 'O outro grupo de cromossomos, também a caminho do polo. Se um deles ficar para trás, a célula-filha terá um cromossomo a menos.', em: { b: [68, 58] }, z: 2.8 }
      ],
      sobre(R, X, t) {
        if (R.vista !== 'a' || R.k < .6) return;
        const [px, py] = R.pt(48, 84), p = RED ? .4 : ((t * .5) % 1);
        anel(X, px, py, R.s * (4 + 4 * p), p, 'rgba(255,212,59,A)', 2.2);
      }
    });
  });
})();
