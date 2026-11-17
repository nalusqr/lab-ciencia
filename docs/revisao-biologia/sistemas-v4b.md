# Anatomia v4b, viagens interativas: revisão de biologia (Taxon e Sapien)

Escopo: as quatro rotas novas feitas como viagem sobre figuras de IA.
- `anatomia#endocrino/glandulas` e `anatomia#locomotor/movimento`: `site/anatomia/cenas-figura-endo-loco.js`
- `anatomia#reprodutor/ciclo` e `anatomia#reprodutor/prevencao`: `site/anatomia/cenas-figura-repro.js`

Método: caminhos e hotspots da figura do reprodutor (`anatomia-reprodutor-ciclo-v4a`) desenhados por cima da imagem original; screenshots novas de todas as etapas em 1280 e 390 px (modo reduzido, Playwright), largura dos títulos das etapas medida no DOM em modo normal, e teste do botão marcado ao alternar figura e esquema.

## 1. Ordem e direção

| Rota | Sequência | Situação |
|---|---|---|
| Endócrino, eixo da tireoide | hipotálamo (T3 e T4 baixos) solta TRH, hipófise solta TSH, TSH no sangue só age na tireoide (célula sem receptor mostrada), tireoide faz T3 e T4 com iodo, células-alvo, freio no hipotálamo e na hipófise, TSH cai | ok |
| Endócrino, outras glândulas | paratireoides (cálcio baixo, PTH, ossos e rins, freio), adrenais (susto, adrenalina, glicose sobe), pâncreas (insulina com glicose alta, glucagon com glicose baixa e fígado soltando glicose), gônadas (FSH e LH, hormônio sexual, freio pelo nível alto, anabolizante) | ok |
| Locomotor | neurônio motor da medula, placa motora com acetilcolina, Ca²⁺ do retículo sarcoplasmático, miosina com ATP puxa a actina (linhas Z se aproximam, filamentos não encolhem), flexão com bíceps agonista e tríceps antagonista (cotovelo como apoio), relaxamento (Ca²⁺ volta com ATP, ATP solta a miosina, rigidez cadavérica), extensão pelo tríceps | ok |
| Gametas, masculino | túbulos seminíferos, epidídimo, ducto deferente subindo, por cima e por trás da bexiga, vesícula seminal, próstata, uretra peniana (caminho conferido sobre a imagem) | ok |
| Gametas, feminino | vagina, colo, útero, tuba direita; ovulação no dia 14 pelo pico de LH, fímbrias, ampola, fecundação na ampola, clivagem descendo a tuba (1, 2, 4, 8, 16 células na camada animada), blastocisto e nidação no dia 20 a 21 | ok; legenda da fecundação passou a dizer "ampola" |
| Ciclo em etapas | menstruação (dias 1 a 5), fase folicular (FSH, estrogênio), ovulação (pico de LH no dia 14 e pico menor de FSH), fase lútea (corpo lúteo, progesterona muito alta no dia 20), fim do ciclo (progesterona cai) | ok |
| Prevenção | vasectomia no ducto deferente (sêmen sai sem espermatozoides), camisinha masculina no pênis, camisinha feminina na vagina, DIU no útero, laqueadura nas duas tubas, pílula freando FSH e LH (sem ovulação); só as duas camisinhas com "IST sim" | ok |

## 2. Medidores

- Endócrino: T3 e T4 abaixo do normal nas três primeiras etapas, sobem na tireoide, passam do normal nas células-alvo e voltam à faixa com o freio, enquanto o TSH cai. Cálcio, glicose e hormônio sexual coerentes com cada etapa. ok.
- Pâncreas no modo reduzido: a figura mostrava insulina e o painel, glucagon (valor final da etapa). Corrigido: no modo reduzido a figura mostra o glucagon, como o painel.
- Locomotor: sarcômero do bíceps 2,5 µm em repouso, 2,1 µm deslizando, 2,0 µm contraído, volta a 2,5 µm quando esticado pelo tríceps; cotovelo 160°, 135°, 60°, 160°. ok.
- Locomotor: o selo "ATP presente" sumia em repouso, o que sugere músculo sem ATP (é justamente a rigidez cadavérica). Agora os selos dizem "Ca²⁺ liberado" e "ATP em uso".
- Ciclo: curvas com pico de LH no dia 14, progesterona máxima por volta do dia 21, estrogênio com pico antes da ovulação. ok.
- Endométrio: aparecia "fino" no dia 10 e "engrossando" no dia 27. Faixas refeitas: descamando (dias 1 a 5), fino, engrossando, grosso (fase lútea), regredindo (depois do dia 26).
- Espermatozoides: centenas de milhões na ejaculação, algumas centenas na tuba, um só fecunda. ok.

## 3. Hotspots e textos

Hotspots da figura do reprodutor conferidos sobre a imagem (testículo, epidídimo, ducto deferente, vesícula seminal, próstata, bexiga, uretra; ovário, tuba, útero, colo, vagina; cortes da laqueadura nas duas tubas). Os da vista de perto (folículos, folículo maduro, corpo lúteo, fímbrias, ampola, clivagem, nidação, endométrio) e os do endócrino e do locomotor batem com as estruturas nas screenshots. Textos curtos e no nível do ENEM.

Ajustes de texto:
- folículo maduro: "soltar o ovócito (ovócito secundário)" virou "soltar o ovócito secundário";
- DIU: tipo "No útero" virou "Intrauterino";
- títulos de etapa cortados com reticências na tela larga: "Retroalimentação negativa" virou "Retroalimentação", "Actina desliza sobre a miosina" virou "Actina desliza", "Vesícula seminal e próstata" virou "Vesícula e próstata" (a legenda de cada etapa continua com o nome completo).

## 4. Figura e animação do reprodutor

Sóbrias e adequadas ao ensino médio: cortes anatômicos de livro didático, sem corpo exposto além do corte sagital masculino; a animação usa espermatozoides, ovócito e embrião esquemáticos, gotas na menstruação e capas translúcidas para as camisinhas. ok.

## 5. Regras e layout

Sem "!", sem "·", "→" ou "↔" como separador, sem "~" nem códigos internos no texto da tela. Corrigido em 1280 e 390 px:
- o nome do medidor encostava em "na faixa normal" ("Hormônio sexual no sangue" virou "Hormônio sexual");
- o marcador do medidor ficava em cima do nome no celular (barra desceu alguns pixels nos dois layouts);
- os três títulos de etapa cortados (acima).

Botão "Viagem dos gametas" marcado no modo esquema: corrigido. Ao abrir "Ver esquema", o botão do modo antigo que aparece ("Sistemas genitais" ou "Trilha dos gametas") fica marcado; ao voltar para "Ver figura", volta a marcar a viagem. Testado nas duas rotas e nas duas larguras.

Observação sem correção: a figura do braço é estática e dobrada, enquanto o desenho da alavanca no painel mostra o ângulo variando (160° esticado). A seta curva no cotovelo e o painel deixam claro o movimento; aceitável.

## Ressalvas da triagem

- Tireoide "vista de trás" com a traqueia como numa vista de frente: aceitável. A figura vale como tireoide transparente; o hotspot e a legenda da vista dizem que as paratireoides ficam na face de trás. Não exige imagem nova.
- Embriões da tuba fora de ordem (na figura, a partir da ampola: 2 células, mórula, 4 células, 1 célula): aceitável por ora, porque a camada animada mostra a ordem certa e nenhum texto se apoia na figura. Mas é um erro que o aluno pode memorizar. Recomendamos refazer a `anatomia-reprodutor-ciclo-v4b` (prioridade média) com os embriões em ordem crescente da ampola ao útero (zigoto, 2, 4, 8 células, mórula) e o blastocisto no endométrio.

## Teste

`node testes/fumaca.js anatomia`: 17 ok, 0 falha, 0 aviso. Sem erros no console nas screenshots.
