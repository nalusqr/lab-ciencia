# Revisão das 15 telas v3 (figura de IA + pontos + animação)

Revisores: Taxon (plantas, animais, microrganismos) e Sapien (embriologia, histologia, biologia molecular). Uma rodada, 2026-11-16.

O que conferimos em cada tela:
- se a figura está certa do ponto de vista científico;
- se cada ponto está na estrutura certa;
- se o texto está correto e curto;
- se a animação não ensina nada errado;
- as regras de texto (sem "!", sem "·", sem "→" ou "↔" como separador, "cerca de" em vez de "~", sem códigos internos);
- se algum elemento encosta em outro ou sai cortado.

Para checar a posição dos pontos, desenhamos as coordenadas sobre as imagens `.webp`. Depois tiramos novas capturas com Playwright em 1280 px e 390 px (e 360 px para a tela do blastóporo).

## Resultado geral

Nenhuma imagem precisa ser descartada. Recomendamos refazer uma: a da esponja (poríferos e cnidários), por causa da seta dupla no ósculo. As outras 14 ficam como estão. Corrigimos os erros pequenos nos próprios arquivos `cenas-figura.js`.

## Plantas e animais (`site/plantas-animais/cenas-figura.js`)

| Tela | Figura | Pontos, texto e animação | Correção |
|---|---|---|---|
| animalia/cordados | Fiel. A estrela-do-mar aparece em vista oral e a larva bilateral está simplificada. | Os pontos estão nas estruturas certas. Os canais radiais animados terminam nas pontas dos cinco braços. | Nenhuma |
| animalia/novidades | Fiel. Anêmona em corte com septos. | O alimento vai do tentáculo à boca, desce pela faringe e chega à cavidade. Está correto. | Nenhuma |
| animalia/poriferos-cnidarios | **Refazer recomendado.** A seta do ósculo tem duas pontas: uma delas aponta para dentro e sugere que a água também entra pelo ósculo. Também há duas setas ambíguas na base. | A animação está certa: a água entra pelos poros, sobe pelo átrio e sai pelo ósculo. O texto também está certo. | Ponto "Poros" movido para a parede (12 → 14,5 %) |
| plantae/angiospermas | Fiel. Lírio: as peças externas parecem pétalas, o que é aceitável. | A animação está na ordem certa: pólen até o estigma, depois o tubo polínico desce o estilete, depois fecundação no ovário. | "Estame: antera" virou "Antera". O texto dizia "o estame, junto com seu filete" (o filete faz parte do estame) e passou a dizer "o conjunto dos estames forma o androceu". Corrigido também o estigma: "com a polinização começa a fecundação" virou "a chegada do pólen ao estigma é a polinização". |
| plantae/conquista | Fiel. | Os destaques seguem a ordem alga, briófita, pteridófita, gimnosperma, angiosperma. | Nenhuma |
| plantae/orgaos | Fiel. | A direção está certa: o xilema sobe da raiz à folha (pontos azuis) e o floema desce da folha (pontos laranja). | Texto do caule completado: o floema leva a seiva "das folhas para o resto da planta", e uma frase nova explica o que significam os pontos azuis e laranja. |
| plantae/pteridofitas | Fiel. O protalo não aparece. | Os esporos saem dos soros e caem. Está correto. | Ponto "Rizoma" descido para cima do caule (77 → 80 %) |

## Embriologia (bloco V3 de `site/embriologia/cenas-figura.js`)

| Tela | Figura | Pontos, texto e animação | Correção |
|---|---|---|---|
| desenvolvimento/gastrula | Fiel. A mesoderme aparece junto aos lábios do blastóporo, o que é uma simplificação aceitável. | As células passam da ectoderme, entram pelo lábio do blastóporo e forram o arquêntero (invaginação). Está correto. | Ponto "Blastocele" estava sobre a ectoderme. Foi movido para o espaço entre as camadas (68 → 62,3 %). |
| desenvolvimento/blastoporo | Fiel, com ressalva: o destino de cada abertura aparece só nas fichas. | As fichas e os textos estão corretos: no protostômio o blastóporo vira a boca, no deuterostômio vira o ânus. | Em 390 px, os títulos "Protostômio" e "Deuterostômio" ficavam por cima das fichas verdes ("ânus" e "boca"). Os títulos passaram para baixo, à direita de cada gástrula. Conferido em 1280, 390 e 360 px: nada encosta nem fica cortado. |
| desenvolvimento/neurula | Fiel. | A indução está certa: ondas verdes sobem da notocorda até o tubo neural. Já a migração da crista neural terminava dentro do somito. | O caminho da crista agora passa logo abaixo da ectoderme. O ponto "Crista neural" foi movido para cima da célula da crista. O texto da endoderme dizia "forma o teto do arquêntero", mas o ponto fica no assoalho; agora diz que a endoderme "reveste o arquêntero". |

## Histologia (bloco V3 de `site/histologia/cenas-figura.js`)

| Tela | Figura | Pontos, texto e animação | Correção |
|---|---|---|---|
| conjuntivo/ossificacao | Fiel, com ressalva: só mostra a ossificação endocondral. As "abas" no meio da diáfise são inofensivas. | As células vão da cartilagem (azul) para o osso (creme), sempre no sentido da epífise para a diáfise, dos dois lados. Está correto. | "Existe uma em cada ponta" virou "um" (concorda com "disco"). O texto do canal medular dizia "foi aberta" e "medula amarela" numa figura de criança. Agora diz que o canal é aberto pela reabsorção feita por osteoclastos e que guarda medula vermelha na criança e sobretudo amarela no adulto. |

## Biologia molecular (`site/biologia-molecular/cenas-figura.js`)

| Tela | Figura | Pontos, texto e animação | Correção |
|---|---|---|---|
| agua/calor | Fiel. | A areia e o mar recebem a mesma energia. O termômetro da areia oscila muito e o do mar quase não muda. A brisa marítima está correta. | "O mar varia só cerca de 3 °C no dia" era um número discutível e virou "a temperatura do mar muda pouco ao longo do dia". |
| vit/avitaminoses | Fiel. A acerola parece cereja e a couve parece couve crespa, o que é aceitável. | A vitamina C vai até a gengiva e o sangramento some. É uma simplificação aceitável. | "Podem ficar moles" virou "podem ficar frouxos e cair". No texto da couve, o "Ela" era ambíguo e foi trocado por "a vitamina C"; o texto também passou a dizer que a vitamina é sensível ao calor. |

## Microrganismos (fim de `site/microrganismos/cenas-figura.js`)

| Tela | Figura | Pontos, texto e animação | Correção |
|---|---|---|---|
| fungi/fungos | Fiel. Ressalva leve: algumas hifas parecem ter septos. | Os nutrientes sobem pelo esporangióforo e os esporos saem do esporângio aberto. Está correto. | Nenhuma |
| monera/doencas | Fiel. A pelve aparece com genitais masculinos, o que é sóbrio. | Os pontos estão certos. Em 1280 px, os pés ficam a cerca de 6 px da legenda, mas sem cortar. O fundo da imagem aparece como um retângulo levemente mais claro (a tela usa `mask: false`), o que é só cosmético. | O carrapato animado andava até a mancha da hanseníase e podia sugerir que ele a transmite. Agora anda até o braço, em outro ponto. O texto dizia "a capivara não transmite a doença", o que é impreciso, porque a capivara é hospedeira amplificadora. Agora diz que ela "não passa a doença direto para as pessoas: quem transmite é o carrapato". |

## Imagens a refazer

- `plantas-animais-animalia-poriferos-cnidarios-a`: pedir de novo a mesma composição com as setas de água entrando só pelos poros e saindo só pelo ósculo, cada seta com uma só ponta. Até a nova imagem ficar pronta, a tela pode continuar como está, porque o texto e a animação mostram o sentido certo.

## Testes

`node testes/fumaca.js` passou nos cinco módulos, sem falhas e sem avisos:

| Módulo | Telas ok |
|---|---|
| plantas-animais | 14 |
| embriologia | 19 |
| histologia | 19 |
| biologia-molecular | 1 |
| microrganismos | 8 |

As capturas Playwright das telas alteradas não mostraram erros de página.
