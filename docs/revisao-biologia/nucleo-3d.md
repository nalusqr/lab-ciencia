# Revisão de Biologia: núcleo 3D

Revisor: Taxon. Material: `site/assets/modelos/previa-nucleo.png`, `site/assets/modelos/fonte/nucleo.py`, `docs/ASSETS.md` §5.2 e §5.3, rótulos em `site/celula/fonte/src/e_modelos.js` (`MODELOS.ROTULOS.nucleo`).
Veredito: **aprovar com 2 correções obrigatórias** (E1 e E2). E3 é recomendada antes de publicar a página.

## O que está correto
- **Envelope nuclear:** duas membranas da mesma cor, porque são da mesma família, com o espaço perinuclear entre elas.
- **Poros:** em cada poro, a membrana externa e a interna são uma só membrana, dobrada em volta do canal, e o espaço perinuclear termina antes do canal. Esse é o detalhe que os livros erram, e aqui está certo. Os dois poros no plano do corte deixam isso visível.
- **Complexo do poro:** tem anel citoplasmático, anel nuclear, cesta nuclear e filamentos citoplasmáticos. O exagero de 2× no tamanho e a densidade reduzida cabem na nota.
- **Retículo endoplasmático:**
  - a membrana do retículo continua a membrana externa, e o lúmen continua o espaço perinuclear, sem emenda na fatia;
  - o lúmen e o espaço perinuclear usam o mesmo material;
  - a passagem do rosa ao azul, feita na cor dos vértices, evita a leitura de duas peças coladas.

  É exatamente a relação que o ENEM e os vestibulares cobram ("o envelope nuclear é contínuo com o RE").
- **Ribossomos:** ficam na face citosólica do retículo e também na membrana nuclear externa. É correto e pouco mostrado.
- **Heterocromatina:** densa, junto ao envelope e em volta do nucléolo, com falhas sob os poros (as zonas livres de heterocromatina). É a distribuição das micrografias.
- **Nucléolo:** sem membrana. É o ponto mais cobrado sobre ele.
- **Tamanho:** 6 µm, dentro da faixa real de 5 a 10 µm.

## Erros conceituais (o aluno aprenderia errado)
**E1. O nucléolo tem a mesma cara de uma "bola" de heterocromatina.**
- **O problema:** o nucléolo é `#6A45D8`, e a heterocromatina é a mistura `genetica` → `genetica_densa` a 60% (`#7D54E8`). Na prévia, as duas peças têm quase o mesmo tom, a mesma superfície lisa e o mesmo volume arredondado. A fatia do nucléolo é uma mancha lisa igual às outras (zoom em `previa-nucleo.png`, região central à esquerda).
- **O que o aluno conclui:** que o nucléolo é só um pedaço maior de cromatina, ou não o encontra sem o rótulo. É justamente a estrutura que o ENEM pede para reconhecer ("região do núcleo onde se formam os ribossomos").
- **Correção:** separar as duas pelo tom e pela textura, sem sair da família violeta.
  - Heterocromatina mais clara e mais próxima de `genetica` (mistura de 20 a 30%, e não de 60%).
  - Nucléolo no `#6A45D8` do guia, com um aspecto granuloso: um ruído no relevo, ou pequenos grânulos creme (`#FFE1A6`, a cor dos ribossomos) espalhados na superfície e na fatia. Os grânulos ligam o nucléolo à fabricação das subunidades ribossômicas. Não é preciso modelar as regiões fibrilar e granular.
  - Bônus, se couber: duas ou três fibras de eucromatina entrando no nucléolo (as regiões organizadoras do nucléolo, os genes do RNA ribossômico).

**E2. O nucleoplasma parece quase vazio, e o DNA parece estar quase todo nas "bolas" da borda.**
- **O problema:** a eucromatina são 22 fibras finas (tubo de 0,018 µm, 4 lados) num núcleo de 6 µm. Na prévia, o interior é um fundo escuro com fios soltos, e o volume de DNA visível está quase todo na heterocromatina.
- **O que o aluno conclui:** o inverso do real. A eucromatina, a cromatina ativa, ocupa a maior parte do núcleo. O aluno também pode achar que "núcleo = líquido com alguns fios", e isso atrapalha a ideia de que os cromossomos estão lá dentro o tempo todo, só que descondensados.
- **Correção (qualquer uma das duas resolve):**
  - aumentar bastante a eucromatina: mais fibras (de 80 a 120) e um pouco mais grossas, para ler como uma rede frouxa que preenche o interior;
  - ou manter as fibras e pôr, no nucleoplasma, uma névoa violeta translúcida (opacidade de 0,15 a 0,25) que preencha o volume entre elas.

  Em ambos os casos, a heterocromatina deve continuar visivelmente mais compacta.

**E3. Falta a lâmina nuclear (lacuna, não erro de desenho).**
- Hoje a ausência está declarada em "Fora do modelo". É aceitável para o ENEM, mas a lâmina explica por que a heterocromatina fica presa à borda e por que o envelope se desfaz na prófase. Esse último ponto liga este modelo ao módulo 07 (Divisão celular).
- **Correção (opcional):** uma película fina de azul-gelo (`#CFE0FF`, a família do citoesqueleto, porque são filamentos intermediários) logo abaixo da membrana interna, visível na fatia. Se não couber, ponha uma frase na nota.

## Simplificações aceitáveis (vão na nota "fora de escala / simplificado")
Texto sugerido para a página:
> Modelo simplificado e fora de escala. As membranas estão cerca de 4 vezes mais grossas e aparecem como uma faixa única, embora cada uma seja uma bicamada de fosfolipídios. Os poros estão maiores e em menor número do que na célula real, que tem milhares deles. O retículo foi desenhado como uma única bolsa; na célula, ele forma uma rede que se espalha por todo o citoplasma. Faltam a lâmina nuclear e o transporte de moléculas pelos poros.

Também cabem na nota, sem precisar de mudança:
- a quantidade de ribossomos;
- a forma e o lugar do nucléolo (pode haver mais de um);
- as fibras de cromatina desenhadas como tubos lisos.

## Rótulos na Célula (`MODELOS.ROTULOS.nucleo`)
Hoje estão em minúscula e vários passam de três palavras, com a função entre parênteses. O guia (seções 3 e 5, "Rótulos") pede caixa normal, ou seja, inicial maiúscula e o resto em minúscula, com siglas em maiúsculas. Pede também no máximo três palavras, porque a função vai no painel. A ordem da lista é a prioridade: no celular só aparecem os 5 primeiros, e no computador os 8 primeiros.

| Ordem | Peça | Hoje | Como deve ficar |
|---|---|---|---|
| 1 | `membrana_externa` | envelope nuclear (membrana dupla) | **Envelope nuclear** |
| 2 | `poros_nucleares` | poro nuclear | **Poro nuclear** |
| 3 | `nucleolo` | nucléolo (fábrica de ribossomos) | **Nucléolo** |
| 4 | `heterocromatina` | heterocromatina (DNA compactado) | **Heterocromatina** |
| 5 | `eucromatina` | eucromatina (DNA ativo) | **Eucromatina** |
| 6 | `reticulo_endoplasmatico` | retículo ligado ao núcleo | **Retículo rugoso** |
| 7 | `espaco_perinuclear` | espaço perinuclear | **Espaço perinuclear** |
| 8 | `ribossomos` | ribossomos | **Ribossomos** |
| 9 | `membrana_interna` | membrana interna | **Membrana interna** |
| 10 | `lumen_do_reticulo` | lúmen do retículo | **Lúmen do retículo** |
| 11 | `nucleoplasma` | nucleoplasma | **Nucleoplasma** |

Por quê:
- "Retículo rugoso" diz o tipo de retículo, que é o que se cobra. "Ligado ao núcleo" é o que a imagem já mostra.
- O espaço perinuclear sobe para a 7ª posição porque, junto com o retículo, mostra a continuidade dos compartimentos.
- O que estava entre parênteses vai para a legenda do painel (tabela abaixo).

Vale o mesmo para `MODELOS.ROTULOS.mitocondria`, fora do escopo desta revisão:
- "Membrana externa", "Membrana interna", "Cristas", "Matriz", "ATP sintase", "DNA mitocondrial", "Ribossomos", "Espaço intermembranas";
- "Cadeia transportadora" (a forma completa, "Cadeia transportadora de elétrons", tem 4 palavras e fica para o painel).

## Legendas recomendadas (pt-BR, uma frase cada)
| Parte (`rotulo`) | Legenda | Ligação com o ENEM |
|---|---|---|
| Núcleo | Compartimento que guarda o DNA da célula eucarionte e controla suas atividades. | Diferença entre procarionte e eucarionte |
| Envelope nuclear | Envoltório de duas membranas, também chamado carioteca, que separa o DNA do citoplasma. | Carioteca existe só em eucariontes |
| Espaço perinuclear | Espaço entre as duas membranas do envelope, que continua no interior do retículo. | Continuidade envelope e retículo |
| Poro nuclear | Canal proteico que controla o que entra e sai do núcleo, como o RNA mensageiro e as subunidades dos ribossomos. | O RNAm sai do núcleo para a tradução no citoplasma |
| Nucléolo | Região sem membrana onde se produz o RNA ribossômico e se montam as subunidades dos ribossomos. | Some na prófase e reaparece na telófase |
| Heterocromatina | Cromatina muito compactada, com genes quase sempre inativos. | Grau de condensação e expressão gênica |
| Eucromatina | Cromatina frouxa, onde estão os genes que a célula está usando. | Transcrição (DNA → RNA) ocorre no núcleo |
| Nucleoplasma | Líquido interno do núcleo, com as enzimas que copiam o DNA e produzem RNA. | Replicação e transcrição são nucleares |
| Retículo rugoso | Rede de membranas com ribossomos que produz proteínas de exportação e de membrana. | Via de secreção: RER → complexo de Golgi → vesícula |
| Ribossomos | Partículas de RNA e proteína que fabricam proteínas, livres ou presos ao retículo e ao envelope. | Tradução no citoplasma |

Nota de página "No ENEM": durante a divisão, a cromatina se condensa em cromossomos, o nucléolo some e o envelope se desfaz. Na interfase, tudo volta a aparecer como neste modelo. Ligar com `../divisao-celular/index.html#mitose/fases`.
