/* LAB Genética: figura de IA por padrão em 7 tópicos sem 3D (Aurelius).
   Figura (figura-ia.js v2, vistas A e B, pontos e zoom) abre primeiro; o botão "Ver esquema" mostra a cena 2D e "Ver figura" volta.
   Os tópicos desta página vêm de novos-a.js, novos-b.js e do index.html: o index aplica window.GEN_3D[sec/id] a cada um (como o gen3d-pecas.js).
   Aqui cada rota registra um embrulho que passa o tópico para LAB_FIGALT.cena. O .js de cada imagem só entra quando o tópico abre.
   Carregar depois de figura-ia.js, figura-alterna.js e gen3d-pecas.js, e antes do script inline do index. */
'use strict';
(function () {
  if (!window.LAB_FIGALT || !window.LAB_FIGIA) return;
  const MASK = { miolo: .94, borda: 1 };
  const legenda = (K, s) => {
    const X = K.X, W = K.W, H = K.H, sz = W < 520 ? 13 : 15, mw = Math.min(W - 28, 640), ws = s.split(' ');
    X.save(); X.font = '600 ' + sz + "px 'Space Grotesk',sans-serif";
    let ln = '', ls = []; for (const w of ws) { const t = ln ? ln + ' ' + w : w; if (X.measureText(t).width > mw && ln) { ls.push(ln); ln = w; } else ln = t; } ls.push(ln);
    const lh = sz * 1.35, y0 = H - 14 - (ls.length - 1) * lh - lh / 2, bw = Math.max(...ls.map(l => X.measureText(l).width)) + 24;
    X.beginPath(); X.roundRect(W / 2 - bw / 2, y0 - lh / 2 - 6, bw, ls.length * lh + 12, 10); X.fillStyle = 'rgba(11,15,28,.74)'; X.fill();
    X.fillStyle = '#E8EDF7'; X.textAlign = 'center'; X.textBaseline = 'middle'; ls.forEach((l, i) => X.fillText(l, W / 2, y0 + i * lh)); X.restore();
  };
  const reg = (chave, cfg) => {
    (window.GEN_3D = window.GEN_3D || {})[chave] = (old, K) => {
      const amb = {
        SC: { [chave]: old }, X: () => K.X, W: () => K.W, H: () => K.H, nar: () => K.W < 520, tela: document.getElementById('cv').parentNode,
        cap: s => legenda(K, s), t: () => K.T, baixo: nar => nar ? 84 : 66,
        rot3d: 'Ver esquema', dica3d: '', esconder: [], esconderFig: ['#ui']
      };
      try { LAB_FIGALT.cena(amb, chave, Object.assign({ pref: 'genetica', mask: MASK }, cfg)); } catch (e) { console.error(e); }
      return old;
    };
  };
  const V = '#FFD43B', AZ = '#8FD8FF', RS = '#F2B6C6', LJ = '#FFA94D', VD = '#A9C54A', VM = '#F28B8B', GL = '#CFE0FF';

  reg('variacoes/incompleta', {
    nome: 'Maravilha, dominância incompleta',
    vistas: [
      ['a', 'variacoes-incompleta-a', 'Três plantas', 'Maravilha (Mirabilis jalapa) com flores vermelhas, rosas e brancas em plantas separadas'],
      ['b', 'variacoes-incompleta-b', 'As três cores', 'Flores vermelha, rosa e branca da maravilha lado a lado']
    ],
    hs: [
      { id: 'ver', c: VM, t: 'Flores vermelhas', d: 'Planta homozigota para o alelo da cor vermelha (VV). Produz muito pigmento.', em: { a: [26, 36] }, z: 2.4 },
      { id: 'ros', c: RS, t: 'Flores rosas', d: 'Planta heterozigota (VB). O fenótipo é intermediário, e não vermelho: nenhum alelo domina por completo o outro.', em: { a: [52, 36] }, z: 2.4 },
      { id: 'bra', c: GL, t: 'Flores brancas', d: 'Planta homozigota para o alelo sem pigmento (BB).', em: { a: [77, 39] }, z: 2.4 },
      { id: 'f2', c: V, t: 'Cruzamento rosa com rosa', d: 'Dá 1 vermelha, 2 rosas e 1 branca. Na dominância incompleta, a proporção dos fenótipos é igual à dos genótipos: 1 : 2 : 1.', em: { a: [51, 84] }, z: 2 },
      { id: 'vb', c: VM, t: 'Vermelha, VV', d: 'Dois alelos para pigmento forte. Todos os seus gametas levam o alelo V.', em: { b: [17, 49] }, z: 3 },
      { id: 'rb', c: RS, t: 'Rosa, VB', d: 'Metade dos gametas leva V e metade leva B. A cor rosa mostra o efeito intermediário do heterozigoto.', em: { b: [50, 49] }, z: 3 },
      { id: 'bb', c: GL, t: 'Branca, BB', d: 'Sem pigmento, por ter só o alelo B. Cruzada com a vermelha, dá filhos rosas, e não brancos nem vermelhos.', em: { b: [82, 49] }, z: 3 }
    ]
  });

  reg('variacoes/codominancia', {
    nome: 'Gado ruão, codominância',
    vistas: [
      ['a', 'variacoes-codominancia-a', 'Três pelagens', 'Gado vermelho, ruão e branco lado a lado no pasto'],
      ['b', 'variacoes-codominancia-b', 'Pelos do ruão', 'Pelagem ruão de perto, com pelos vermelhos e pelos brancos misturados']
    ],
    hs: [
      { id: 'ver', c: VM, t: 'Gado vermelho', d: 'Homozigoto para o alelo da pelagem vermelha. Todos os pelos são vermelhos.', em: { a: [20, 48] }, z: 2.4 },
      { id: 'ruo', c: LJ, t: 'Gado ruão', d: 'Heterozigoto. Expressa os dois alelos ao mesmo tempo, com pelos vermelhos e pelos brancos misturados. Isso é codominância.', em: { a: [52, 52] }, z: 2.6 },
      { id: 'bra', c: GL, t: 'Gado branco', d: 'Homozigoto para o alelo da pelagem branca.', em: { a: [79, 52] }, z: 2.4 },
      { id: 'pv', c: VM, t: 'Pelos vermelhos', d: 'Cada pelo é de uma cor só. O alelo vermelho age nos pelos que ele controla.', em: { b: [22, 44] }, z: 2.4 },
      { id: 'pb', c: GL, t: 'Pelos brancos', d: 'O alelo branco age nos outros pelos. As cores aparecem lado a lado e não se fundem.', em: { b: [75, 36] }, z: 2.4 },
      { id: 'mis', c: V, t: 'Não é mistura', d: 'Na dominância incompleta o fenótipo é um meio-termo único. Aqui, cada pelo mostra um alelo, e a soma dá o ruão.', em: { b: [50, 62] }, z: 2.2 }
    ]
  });

  reg('variacoes/abo', {
    nome: 'Tipagem sanguínea ABO',
    vistas: [
      ['a', 'variacoes-abo-a', 'Lâmina de tipagem', 'Lâmina de tipagem sanguínea com gotas aglutinadas e gotas sem aglutinação'],
      ['b', 'variacoes-abo-b', 'Hemácias ao microscópio', 'Hemácias ao microscópio, livres e em aglomerados de aglutinação']
    ],
    hs: [
      { id: 'agl', c: VM, t: 'Gota aglutinada', d: 'O soro com anticorpo reconheceu o antígeno das hemácias e as uniu em grumos. Reação positiva para aquele antígeno.', em: { a: [31, 70] }, z: 2.4 },
      { id: 'agl2', c: LJ, t: 'Grumos', d: 'Cada grumo é um conjunto de hemácias ligadas pelos anticorpos do soro. É a aglutinação.', em: { a: [43, 45] }, z: 2.8 },
      { id: 'liso', c: AZ, t: 'Gota sem aglutinação', d: 'Gota lisa e uniforme: o anticorpo do soro não encontrou o antígeno correspondente. Reação negativa.', em: { a: [54, 60] }, z: 2.4 },
      { id: 'liv', c: AZ, t: 'Hemácia livre', d: 'Disco bicôncavo, com o centro mais claro. Sem anticorpo ligado, as hemácias ficam separadas.', em: { b: [32, 14] }, z: 3 },
      { id: 'agl3', c: VM, t: 'Aglomerado', d: 'Hemácias unidas pelos anticorpos formam grandes redes. No corpo, essa reação obstrui vasos e destrói hemácias na transfusão incompatível.', em: { b: [28, 63] }, z: 2.4 },
      { id: 'agl4', c: LJ, t: 'Agregado grande', d: 'O sangue do tipo A tem antígeno A e anticorpo anti-B. Misturado a soro anti-A, aglutina.', em: { b: [76, 30] }, z: 2.4 }
    ]
  });

  reg('determinacao/barr', {
    nome: 'Corpúsculo de Barr',
    vistas: [
      ['a', 'determinacao-barr-a', 'Núcleo corado', 'Núcleo de célula da mucosa bucal corado, com o corpúsculo de Barr junto ao envelope nuclear'],
      ['b', 'determinacao-barr-b', 'Esfregaço bucal', 'Esfregaço de células da mucosa bucal ao microscópio']
    ],
    hs: [
      { id: 'barr', c: V, t: 'Corpúsculo de Barr', d: 'Mancha escura na periferia do núcleo, junto ao envelope nuclear. É o cromossomo X inativado e muito condensado. Número de corpúsculos de Barr = número de X menos 1.', em: { a: [60, 36] }, z: 3.2 },
      { id: 'nuc', c: AZ, t: 'Núcleo', d: 'Corado de azul, contém a cromatina. Em célula de mulher XX, um dos dois X fica inativo.', em: { a: [48, 54] }, z: 2.4 },
      { id: 'env', c: LJ, t: 'Envelope nuclear', d: 'Dupla membrana que delimita o núcleo. O X inativo costuma ficar encostado nela.', em: { a: [39, 65] }, z: 2.6 },
      { id: 'cit', c: RS, t: 'Citoplasma', d: 'Região clara em volta do núcleo, na célula achatada da mucosa da bochecha.', em: { a: [28, 50] }, z: 2.4 },
      { id: 'nu2', c: AZ, t: 'Núcleos corados', d: 'Cada célula tem um núcleo roxo. Em mulheres, parte deles mostra o corpúsculo de Barr. Nesta ampliação ele não se distingue.', em: { b: [52, 48] }, z: 2.6 },
      { id: 'cel', c: RS, t: 'Célula da mucosa', d: 'Célula epitelial achatada, fácil de coletar raspando a bochecha. Serve para contar corpúsculos de Barr.', em: { b: [57, 44] }, z: 2.2 },
      { id: 'bac', c: VD, t: 'Bactérias', d: 'Os pontos escuros em volta são bactérias da boca. Não fazem parte da célula humana.', em: { b: [30, 12] }, z: 2.6 }
    ]
  });

  // biotec/clonagem: a figura e a viagem da Dolly estão em cenas-figura-clonagem.js

  reg('extras/interacao', {
    nome: 'Labradores e epistasia',
    vistas: [
      ['a', 'extras-interacao-a', 'Três cores', 'Labradores preto, chocolate e amarelo lado a lado'],
      ['b', 'extras-interacao-b', 'Os focinhos', 'Focinhos de labradores preto, chocolate e amarelo, com nariz preto ou marrom']
    ],
    hs: [
      { id: 'pre', c: GL, t: 'Labrador preto', d: 'Tem pelo menos um alelo B, que produz pigmento preto, e pelo menos um alelo E, que deixa o pigmento ser depositado no pelo.', em: { a: [26, 33] }, z: 2.4 },
      { id: 'cho', c: LJ, t: 'Labrador chocolate', d: 'Genótipo bb, com pelo menos um E. Sem o alelo B, o pigmento é marrom e o nariz também.', em: { a: [51, 35] }, z: 2.4 },
      { id: 'ama', c: V, t: 'Labrador amarelo', d: 'Genótipo ee. O gene E é epistático: sem ele, o pigmento não vai para o pelo, qualquer que seja o genótipo de B.', em: { a: [74, 35] }, z: 2.4 },
      { id: 'np', c: GL, t: 'Nariz preto', d: 'Nariz preto indica pelo menos um alelo B, que produz pigmento preto.', em: { b: [23, 48] }, z: 3 },
      { id: 'nm', c: LJ, t: 'Nariz marrom', d: 'Indica genótipo bb. O pigmento do nariz segue o gene B, sem sofrer a epistasia de E.', em: { b: [51, 50] }, z: 3 },
      { id: 'na', c: V, t: 'Amarelo com nariz preto', d: 'O pelo é amarelo por causa do ee, mas o nariz preto revela que o cão tem pelo menos um alelo B.', em: { b: [83, 49] }, z: 3 }
    ]
  });

  reg('extras/poligenica', {
    nome: 'Herança quantitativa',
    vistas: [
      ['a', 'extras-poligenica-a', 'Tons de pele', 'Mãos humanas lado a lado em gradiente de tons de pele']
    ],
    hs: [
      { id: 'cla', c: RS, t: 'Tons mais claros', d: 'Com poucos alelos que somam pigmento (melanina), o tom fica mais claro. Cada alelo contribui com um pouco.', em: { a: [9, 57] }, z: 2.2 },
      { id: 'med', c: LJ, t: 'Tons intermediários', d: 'Os mais comuns na população. Muitos genes, cada um com efeito pequeno, somam-se a influências do ambiente. Com n pares de genes, há 2n + 1 classes fenotípicas, e as do meio formam o pico da curva normal.', em: { a: [52, 56] }, z: 2.2 },
      { id: 'esc', c: VD, t: 'Tons mais escuros', d: 'Com muitos alelos que aumentam a pigmentação, o tom fica mais escuro. A variação é contínua, sem categorias separadas.', em: { a: [90, 54] }, z: 2.2 }
    ]
  });
})();
