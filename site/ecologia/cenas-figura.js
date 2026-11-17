/* LAB Ecologia: figura de IA por padrão em 7 rotas sem 3D (Aurelius). Eutrofização foi para cenas-figura-ciclos.js.
   Figura (figura-ia.js v2, vistas A e B, pontos e zoom) abre primeiro; o botão "Ver esquema" mostra a cena 2D e "Ver figura" volta.
   Usa a ponte LAB_ECO (eco3d-ponte.js) para ler o motor fechado do index.html.
   Carregar depois de figura-ia.js e figura-alterna.js. Sem LAB_ECO nada acontece e fica o 2D. */
'use strict';
(function () {
  const E = window.LAB_ECO;
  if (!E || !window.LAB_FIGALT || !window.LAB_FIGIA) return;
  const MASK = { miolo: .94, borda: 1 };
  let legenda = '';
  const amb = {
    SC: E.SC, X: () => E.X, W: () => E.W, H: () => E.H, nar: () => E.W < 700, tela: document.querySelector('.palco .tela'),
    cap: html => { legenda = html; const c = document.getElementById('cap'); if (c && c.innerHTML !== html) c.innerHTML = html; },
    t: a => a[0], baixo: nar => nar ? 100 : 20,
    rot3d: 'Ver esquema', dica3d: '',
    esconder: ['.hud.onde'], esconderFig: ['#ctl', '#opts']
  };

  const cenas = [
    ['relacoes/harmonicas', {
      pref: 'ecologia', nome: 'Relações harmônicas', mask: MASK,
      vistas: [
        ['a', 'relacoes-harmonicas-a', 'Líquen em casca', 'Líquen sobre casca de árvore: associação entre um fungo e uma alga'],
        ['b', 'relacoes-harmonicas-b', 'Nódulos de leguminosa', 'Raiz de leguminosa com nódulos, onde vivem bactérias fixadoras de nitrogênio']
      ],
      hs: [
        { id: 'lta', c: '#A9C54A', t: 'Talo do líquen', d: 'Líquen é mutualismo entre um fungo e uma alga. A alga faz fotossíntese, e o fungo dá proteção e retém água e sais.', em: { a: [31, 48] }, z: 2.6 },
        { id: 'lap', c: '#FFA94D', t: 'Estruturas de reprodução', d: 'As taças alaranjadas são corpos de frutificação do fungo, que produz esporos. A alga se multiplica no interior do talo.', em: { a: [47, 43] }, z: 3 },
        { id: 'lmu', c: '#8FD8FF', t: 'Musgo vizinho', d: 'Musgos crescem junto, mas não fazem parte do líquen. Líquens são sensíveis à poluição do ar e funcionam como bioindicadores.', em: { a: [21, 64] }, z: 2.8 },
        { id: 'lca', c: '#F7C13B', t: 'Casca da árvore', d: 'O líquen só usa a casca como apoio. Ele não retira nutrientes da árvore, então não é parasita.', em: { a: [15, 20] }, z: 2.4 },
        { id: 'nno', c: '#F28B8B', t: 'Nódulo na raiz', d: 'Nos nódulos vivem bactérias do gênero Rhizobium. Elas fixam o N₂ do ar em amônia, e a planta lhes dá açúcares e abrigo.', em: { b: [53, 29] }, z: 3 },
        { id: 'nci', c: '#FFD43B', t: 'Nódulo cortado', d: 'O interior rosado vem da leg-hemoglobina, que controla o oxigênio perto das bactérias. É sinal de nódulo ativo.', em: { b: [49, 48] }, z: 3 },
        { id: 'nra', c: '#CFE0FF', t: 'Raiz da leguminosa', d: 'Feijão, soja e ervilha são leguminosas. Por causa dos nódulos, enriquecem o solo com nitrogênio e dispensam adubo nitrogenado.', em: { b: [28, 60] }, z: 2.6 },
        { id: 'nfi', c: '#A9C54A', t: 'Raízes finas', d: 'As raízes finas absorvem água e sais. O nitrogênio fixado vira amônia, que a planta usa para montar proteínas.', em: { b: [89, 54] }, z: 2.6 }
      ]
    }],
    ['biomas/mapa', {
      pref: 'ecologia', nome: 'Biomas brasileiros', mask: MASK,
      vistas: [
        ['a', 'biomas-mapa-a', 'Amazônia', 'Floresta Amazônica vista do alto, com dossel contínuo e rio de águas escuras'],
        ['b', 'biomas-mapa-b', 'Cerrado', 'Cerrado com árvores de troncos retorcidos, casca grossa e capim seco sobre solo vermelho']
      ],
      hs: [
        { id: 'adc', c: '#A9C54A', t: 'Dossel contínuo', d: 'Copas fechadas formam a maior floresta tropical do mundo. O clima é quente e úmido o ano todo, e a biodiversidade é enorme.', em: { a: [21, 62] }, z: 2.4 },
        { id: 'aem', c: '#F7C13B', t: 'Árvore emergente', d: 'Algumas árvores passam do dossel e chegam a mais de 40 m. O solo é pobre, e a floresta se mantém pela ciclagem rápida de nutrientes.', em: { a: [41, 26] }, z: 2.8 },
        { id: 'ari', c: '#8FD8FF', t: 'Rio de águas escuras', d: 'A bacia amazônica guarda a maior reserva de água doce do planeta. Os rios sobem e descem com as chuvas e alagam a mata.', em: { a: [52, 75] }, z: 2.6 },
        { id: 'ane', c: '#CFE0FF', t: 'Neblina e umidade', d: 'A transpiração das árvores devolve vapor ao ar. Esse vapor forma nuvens e chuva, em parte levada a outras regiões do país.', em: { a: [52, 17] }, z: 2.2 },
        { id: 'ali', c: '#FFA94D', t: 'Lianas e epífitas', d: 'Plantas que crescem sobre as árvores buscam luz sem gastar com tronco. Isso mostra como a competição por luz molda a floresta.', em: { a: [69, 62] }, z: 2.8 },
        { id: 'cte', c: '#F7C13B', t: 'Troncos retorcidos', d: 'Árvores baixas, de galhos tortos e casca grossa. A casca protege do fogo, comum na estação seca do Cerrado.', em: { b: [33, 71] }, z: 2.8 },
        { id: 'cfo', c: '#A9C54A', t: 'Folhas coriáceas', d: 'Folhas largas, duras e grossas perdem menos água. As raízes profundas alcançam a água do solo na seca.', em: { b: [27, 21] }, z: 3 },
        { id: 'cca', c: '#FFD43B', t: 'Capim seco', d: 'As gramíneas dominam o estrato de baixo. Na seca elas queimam fácil, e muitas plantas do Cerrado rebrotam depois do fogo.', em: { b: [81, 69] }, z: 2.6 },
        { id: 'cso', c: '#F28B8B', t: 'Solo vermelho', d: 'Solo antigo, ácido e pobre em nutrientes, rico em ferro e alumínio. Mesmo assim, o Cerrado tem biodiversidade muito alta.', em: { b: [73, 79] }, z: 2.4 }
      ]
    }],
    ['biomas/costeiros', {
      pref: 'ecologia', nome: 'Ecossistemas costeiros', mask: MASK,
      vistas: [
        ['a', 'biomas-costeiros-a', 'Manguezal', 'Manguezal na maré baixa, com raízes-escora, pneumatóforos e caranguejos sobre o lodo'],
        ['b', 'biomas-costeiros-b', 'Recife de coral', 'Recife de coral com coral-cérebro, corais ramificados e peixes de águas rasas e claras']
      ],
      hs: [
        { id: 'mra', c: '#F7C13B', t: 'Raízes-escora', d: 'Raízes em arco fixam a planta no lodo mole e instável e a sustentam quando a maré sobe.', em: { a: [70, 52] }, z: 2.6 },
        { id: 'mpn', c: '#8FD8FF', t: 'Pneumatóforos', d: 'Raízes que sobem do lodo e fazem trocas gasosas com o ar. O sedimento encharcado tem pouco oxigênio.', em: { a: [39, 77] }, z: 2.8 },
        { id: 'mlo', c: '#A9C54A', t: 'Lodo salgado', d: 'O solo é lodoso, salino e rico em matéria orgânica. Fica entre a terra e o mar, onde o rio encontra a água salgada.', em: { a: [16, 63] }, z: 2.4 },
        { id: 'mca', c: '#FFA94D', t: 'Caranguejos', d: 'Caranguejos revolvem o lodo e comem folhas caídas. O manguezal é berçário de peixes, crustáceos e moluscos.', em: { a: [55, 86] }, z: 3 },
        { id: 'rcc', c: '#F7C13B', t: 'Coral-cérebro', d: 'Corais são cnidários coloniais. O esqueleto de carbonato de cálcio de muitos pólipos forma o recife.', em: { b: [36, 69] }, z: 2.6 },
        { id: 'rcr', c: '#FFA94D', t: 'Coral ramificado', d: 'Os pólipos abrigam algas simbiontes, as zooxantelas, que fazem fotossíntese e alimentam o coral. É um mutualismo.', em: { b: [62, 35] }, z: 2.8 },
        { id: 'rpe', c: '#8FD8FF', t: 'Peixe-anjo', d: 'O recife abriga milhares de espécies, e há recifes no litoral do Nordeste ao Espírito Santo. Abrolhos, na Bahia, é o maior do Atlântico Sul.', em: { b: [58, 44] }, z: 3 },
        { id: 'rcd', c: '#CFE0FF', t: 'Cardume de peixes', d: 'O recife é cheio de abrigos e comida, e atrai muitos peixes pequenos. Corais que perdem as algas ficam brancos, o branqueamento.', em: { b: [27, 49] }, z: 3 },
        { id: 'rlu', c: '#FFD43B', t: 'Luz do sol', d: 'Corais com algas simbiontes precisam de luz. Por isso vivem em águas rasas, quentes e limpas.', em: { b: [47, 12] }, z: 2.2 }
      ]
    }],
    ['sucessao/primaria', {
      pref: 'ecologia', nome: 'Sucessão primária', mask: MASK,
      vistas: [['a', 'sucessao-primaria-a', 'Rocha nua colonizada', 'Rocha nua colonizada por líquens e musgos, as primeiras espécies pioneiras']],
      hs: [
        { id: 'pli', c: '#FFA94D', t: 'Líquen crostoso', d: 'Líquens são as pioneiras clássicas. Soltam ácidos que corroem a rocha e começam a formar solo.', em: { a: [23, 77] }, z: 3 },
        { id: 'pmu', c: '#A9C54A', t: 'Musgo', d: 'Os musgos chegam depois e seguram água e partículas. A matéria orgânica deles enriquece o solo que se forma.', em: { a: [45, 66] }, z: 3 },
        { id: 'pfe', c: '#8FD8FF', t: 'Fenda na rocha', d: 'Nas frestas se acumulam poeira e restos orgânicos. Esse solo ainda raso permite novas espécies mais tarde.', em: { a: [56, 58] }, z: 3 },
        { id: 'pro', c: '#F7C13B', t: 'Rocha nua', d: 'A sucessão primária começa onde nunca houve solo nem comunidade. Por isso é muito mais lenta que a secundária.', em: { a: [75, 79] }, z: 2.4 }
      ]
    }],
    ['sucessao/secundaria', {
      pref: 'ecologia', nome: 'Sucessão secundária', mask: MASK,
      vistas: [['a', 'sucessao-secundaria-a', 'Pasto abandonado', 'Campo abandonado com capim, arbustos e árvores jovens, e a floresta ao fundo']],
      hs: [
        { id: 'sca', c: '#FFD43B', t: 'Capim', d: 'As gramíneas ocupam primeiro o campo abandonado. Elas crescem rápido e cobrem o solo exposto.', em: { a: [47, 88] }, z: 2.4 },
        { id: 'sar', c: '#A9C54A', t: 'Arbustos', d: 'Depois do capim vêm os arbustos, que dão sombra e preparam o ambiente para árvores maiores.', em: { a: [39, 54] }, z: 2.6 },
        { id: 'sjo', c: '#F7C13B', t: 'Árvore pioneira jovem', d: 'Árvores de crescimento rápido e muita luz, como a embaúba, formam a mata secundária inicial.', em: { a: [69, 35] }, z: 2.8 },
        { id: 'sma', c: '#8FD8FF', t: 'Floresta madura', d: 'A mata ao fundo fornece sementes trazidas por animais e vento. A sucessão secundária é mais rápida porque o solo e as sementes já estavam lá.', em: { a: [34, 20] }, z: 2.4 }
      ]
    }],
    ['impactos/desmatamento', {
      pref: 'ecologia', nome: 'Desmatamento', mask: MASK,
      vistas: [['a', 'impactos-desmatamento-a', 'Borda da floresta', 'Queimada e área desmatada na borda da floresta amazônica, com pasto ao lado']],
      hs: [
        { id: 'dfu', c: '#F28B8B', t: 'Queimada', d: 'O fogo libera CO₂ e outros gases para a atmosfera. Isso agrava o efeito estufa e piora a qualidade do ar.', em: { a: [66, 42] }, z: 2.6 },
        { id: 'dbo', c: '#A9C54A', t: 'Borda da floresta', d: 'Na borda, a mata fica exposta a mais luz, vento e fogo. É o efeito de borda, que degrada o fragmento restante.', em: { a: [31, 42] }, z: 2.6 },
        { id: 'dso', c: '#FFA94D', t: 'Solo exposto', d: 'Sem cobertura vegetal, o solo sofre erosão e perde nutrientes. Também infiltra menos água e fica compactado.', em: { a: [36, 79] }, z: 2.6 },
        { id: 'dpa', c: '#F7C13B', t: 'Pasto', d: 'A pecuária é uma das principais causas do desmatamento na Amazônia. A área de floresta vira pasto, e a biodiversidade cai.', em: { a: [81, 69] }, z: 2.6 },
        { id: 'des', c: '#CFE0FF', t: 'Estradas', d: 'Estradas e ramais abrem acesso à mata e fragmentam a floresta. O desmatamento costuma avançar a partir delas.', em: { a: [54, 74] }, z: 2.6 }
      ]
    }],
    ['impactos/invasoras', {
      pref: 'ecologia', nome: 'Caramujo-gigante-africano', mask: MASK,
      vistas: [['a', 'impactos-invasoras-a', 'Achatina fulica', 'Caramujo-gigante-africano, espécie exótica invasora, com filhotes sobre uma folha']],
      hs: [
        { id: 'iad', c: '#F7C13B', t: 'Caramujo adulto', d: 'Achatina fulica veio do leste da África e foi trazida ao Brasil na década de 1980. Sem predadores naturais, a população cresce muito.', em: { a: [36, 42] }, z: 2.6 },
        { id: 'ifi', c: '#FFA94D', t: 'Filhotes', d: 'Cada indivíduo é hermafrodita e põe centenas de ovos. A reprodução rápida ajuda a espécie a se espalhar.', em: { a: [82, 49] }, z: 3 },
        { id: 'ifo', c: '#A9C54A', t: 'Folha', d: 'Come folhas de plantas de hortas e de jardins, e compete por alimento com caramujos nativos. Isso reduz a biodiversidade local.', em: { a: [19, 54] }, z: 2.6 },
        { id: 'isa', c: '#F28B8B', t: 'Risco à saúde', d: 'Pode hospedar vermes parasitas que causam doenças em humanos. Não se deve tocar nos caramujos com a mão sem proteção.', em: { a: [60, 62] }, z: 2.6 }
      ]
    }]
  ];

  cenas.forEach(([k, cfg]) => LAB_FIGALT.cena(amb, k, cfg));

  // com a figura na tela, a legenda do 2D e os cliques do mapa não valem: o motor lê o.cap e o.hit a cada quadro
  const emFigura = () => { const b = document.querySelector('.fa-barra'); const f = b && b.querySelector('button[data-m="fig"]'); return !!(b && !b.hidden && f && f.getAttribute('aria-pressed') === 'true'); };
  cenas.forEach(([k]) => {
    const o = E.SC[k]; if (!o) return;
    const cap0 = o.cap, hit0 = o.hit;
    o.cap = function (S) { return emFigura() ? legenda : (cap0 ? cap0.call(this, S) : ''); };
    if (hit0) o.hit = function (...a) { return emFigura() ? null : hit0.apply(this, a); };
  });
})();
