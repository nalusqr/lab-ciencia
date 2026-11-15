# Direção de arte: Evolução (novo) e Ecologia (9 tópicos novos)

Estilo: Campo escuro (docs/GUIA-DE-ESTILO.md). Motor 2D: helpers de site/anatomia/motor.js (circ, ell, rr, shape, poly, arrow, qarrow, bicho, fita, membrana, celula, regua, panel, pill, lab, tok, btn, hitR/hitC, rng). Nada de estilo novo.
Texto de tela: sem exclamação, sem "·", "→", "↔" como separador, sem neon, sem maiúsculas fora de siglas, vírgula decimal.

## 1. Paleta

Base (todas as cenas): fundo `#0B0F1C`, palco com radial `#161D33` para `#0B0F1C`, painel `#131A2B`, linha `#2C3757`, texto `#E8EDF7`, suave `#9DA9C4`, âmbar `#FFB347` só para seleção e botão principal, foco `#8FD8FF` só para foco, alerta `#FF6B7D` só para erro e mutação perigosa.
Ciência (do guia 2.3): violeta `#9A6BFF`, rosa `#F06AAE`, lima `#A9C54A`, laranja-vermelho `#F25C3B`, verde `#3FBF6A` (escuro `#2A9450`), azul `#4B7BFF`, ouro `#F7C13B`, turquesa `#2FCFBF`, azul-água `#2A9FC9`, gelo `#CFE0FF`, creme `#FFE1A6`, solo `#8A6A4A`, cinza `#9AA3B2`.

### Evolução (uma cor-âncora por seção, usada em aba, título de cena e destaque)
| Seção | Âncora | Uso interno |
|---|---|---|
| origem | laranja-vermelho `#F25C3B` | Terra primitiva; faísca ouro `#F7C13B`; moléculas CPK do guia; bactéria engolida violeta `#9A6BFF` |
| ideias | violeta claro `#B79BFF` (Lamarck) e turquesa `#2FCFBF` (Darwin e Wallace) | mesmas cores em I1 e I2; ideia refutada em cinza `#9AA3B2` com borda tracejada |
| evidencias | ouro `#F7C13B` | camadas de rocha em solo `#8A6A4A`, cinza e creme; bactéria sensível azul `#4B7BFF`, resistente laranja `#FF9A3C` |
| sintetica | rosa `#F06AAE` | DNA gelo; mutação com contorno brilhante creme na 1a geração |
| selecao | verde `#3FBF6A` | filtro verde sobre curva em sino; sino da geração anterior em cinza por trás |
| acaso | violeta `#9A6BFF` (deriva) e azul `#4B7BFF` (fluxo gênico, setas) | bolinhas dos alelos abaixo |
| especiacao | azul-água `#2A9FC9` | barreira geográfica solo `#8A6A4A`; portão pré-zigótico azul `#4B7BFF`, pós-zigótico laranja `#F25C3B` |
| padroes | lima `#A9C54A` | ramos da irradiação em gradiente lima para ouro; convergência em tracejado turquesa |
| humana | ocre `#D9A441` (Australopithecus) e azul-água `#2A9FC9` (Homo), Homo sapiens com halo âmbar | ramos extintos terminam em ponta cortada cinza |

Alelos (todo o módulo): claro areia `#E8D9B5`, escuro grafite `#4A4A4A` sempre com contorno gelo `#CFE0FF` 1,5 px (grafite some no fundo), resistência coral `#FF6B6B`.
Régua do tempo geológico (O2, O3, V1): Terra cinza `#9AA3B2`, sem oxigênio marrom-avermelhado `#A5543A`, oxigênio azul-claro `#7FB8E8`, eucariontes verde `#3FBF6A`, animais e plantas verde escuro `#2A9450`. Marcador do momento em âmbar.
Silhuetas de seres, fósseis, cientistas e hominíneos: formas próprias, sem retrato; legenda "desenho esquemático".

### Ecologia (manter o objeto C de site/ecologia/index.html, não criar hex novo)
produtividade E3: sol `C.sol`, PPB `C.prod`, respiração R `C.calor`, PPL `C.prod` com contorno gelo. Fósforo C4: rocha `C.carb`, solo `C.solo`, rio e mar `C.agua`, fosfato `C.c2` (laranja, partícula pequena), lago eutrofizado `C.oliva`. Polinização R4: flores `C.rosa`, `C.c1`, `C.calor`, pólen `C.sol`, frutos `C.c2`. Controle R5: praga `C.calor`, vespa `C.c1`, cana `C.prod`, linha de dano tracejada `C.dim`.
Estratégias N1: curvas em `C.c2` (populações). Costeiros N2: mata `C.prod`, mangue `C.dec`, restinga `C.oliva`, recife `C.rosa`, água `C.agua`. Desmatamento N3: floresta `C.prod`, pasto `C.oliva`, borda `C.c1`. Invasoras N4: nativa `C.prod`, exótica `C.calor` (como no roteiro). Conservação N5: UC com contorno tracejado `C.agua` mais pastilha "UC" (nunca só a cor, o rio também é azul), mata ciliar `C.prod`, rio barrento `C.solo`.

## 2. Ícone do módulo

Fóssil de amonita (evolução como registro no tempo; não repete a árvore da taxonomia). Verificar em 16 px na página assets/icons/preview.html e ajustar o espiral se as voltas se fundirem.

```html
<symbol id="mod-evolucao" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12.5a1.5 1.5 0 0 1 1.5-1.5 3 3 0 0 1 3 3 4.5 4.5 0 0 1-4.5 4.5 6 6 0 0 1-6-6 7.5 7.5 0 0 1 7.5-7.5"/><path d="M13.5 5A9 9 0 0 1 20.5 10"/><circle cx="12" cy="12.5" r="1" fill="currentColor" stroke="none"/></g></symbol>
```
Registrar em site/assets/icons/sprite.svg e na home, e em docs/ASSETS.md.

## 3. Composição das cenas

- Canvas com proporção fluida: 390 a 1280 px de largura, altura de 0,62 a 0,9 da largura (retrato no celular, paisagem no desktop). Reflow por `NAR` (largura menor que 700): empilhar painéis lado a lado em coluna, nunca reduzir fonte.
- Margem interna 16 px (celular) e 24 px (desktop). Topo livre: faixa de 44 px (celular) ou 56 px (desktop) só para o título da cena (`title()` em Space Grotesk 600, 15 a 17 px) e, à direita, a pastilha do estado. Nada de desenho nessa faixa.
- Área útil do desenho: abaixo da faixa, acima do rodapé de 40 px reservado para gráfico baixo, legenda ou régua. Um foco só por tela: o desenho principal ocupa 60% ou mais da área; gráficos de apoio ficam num painel `panel()` de até 28% da altura.
- Rótulos: Atkinson 12 px no mínimo (13 px no desktop), sempre sobre pastilha `rgba(11,15,28,.82)` via `pill()`/`lab()`, linha-guia fina `#5B6C99`. No máximo 6 rótulos visíveis no celular, 10 no desktop; o restante aparece ao tocar. Valores e fórmulas em JetBrains Mono.
- Cor nunca sozinha: toda cor do desenho tem nome escrito (legenda curta ou rótulo direto). Contraste do rótulo 4,5:1.
- Alvos de toque de 44 px mínimo (`hitR` com folga), mesmo que o desenho seja menor.
- Legibilidade nos dois extremos: testar em 390 e 1280 px. Elementos finos (linhas de 1 px) engrossam para 1,5 px abaixo de 500 px de largura. Populações de partículas escalam por área (menos pontos no celular, ex. 40 em vez de 120).
- Legenda de rodapé de uma frase explica o que mudou depois de cada ação; a mesma frase vai em `aria-live` polite.

## 4. Movimento

- Uma animação principal por cena; o resto só reage a toque. Nada anima o fundo, nada pisca, sem partículas decorativas.
- Durações: retorno de toque 120 a 200 ms; troca de estado ou de vista 600 a 800 ms; processo biológico (miller, fóssil, geração, maré) 4 a 10 s por ciclo, em laço suave que para ao fim de 2 ciclos e espera o aluno.
- Easing: entradas `cubic-bezier(.2,.7,.2,1)` (ease-out); saídas e fechamentos `cubic-bezier(.4,0,1,1)`; movimento contínuo de processo linear. Sem mola nem bounce.
- Pulso de convite nos pontos clicáveis: 2 ciclos ao abrir e para.
- Botão Pausar sempre presente em animação de processo e Reiniciar quando houver fim.
- Geração em dinâmica populacional: passo de 400 a 600 ms por geração, com o número da geração escrito.
- `prefers-reduced-motion: reduce`: abre no estado final já desenhado, sem pulso e sem laço automático; o aluno liga com "Mostrar passo a passo"; trocas viram esmaecimento de 150 ms.
- Aviso de pausa: cena fora da tela ou aba oculta para o laço (requestAnimationFrame com `document.hidden`).

## 5. Interação

- Barra de controles abaixo do canvas, no padrão da página existente: grupo de opções (botões de seleção única com `aria-pressed`, âmbar para o ativo), um slider no máximo por vez em destaque, botões de ação (Pausar, Reiniciar). Rótulo de slider com valor ao lado em mono (`10 %`, `geração 12`).
- Só mostrar controles que agem no modo atual: um slider ou botão sem efeito naquele modo fica oculto (não apenas desabilitado), como em `syncExtra`/`ctlShow` do motor. Ao trocar de modo, o controle certo entra com 150 ms de esmaecimento.
- Retorno visual imediato (menos de 100 ms): o elemento tocado ganha anel gelo `#8FD8FF` 2 px; o resultado aparece no desenho e na frase de rodapé; acerto em verde `#3FBF6A` com ícone de visto, erro em `#FF6B7D` com ícone e a correção escrita, nunca só a cor.
- Arrastar cartões (O1, I1, ES2): alvo de soltura com contorno tracejado que acende ao passar; soltar errado devolve o cartão em 200 ms e mostra o motivo; sempre há alternativa de toque (tocar no cartão, depois tocar na caixa) e de teclado (setas e Enter).
- Teclado: setas movem sliders (passo visível), Tab percorre a ordem do desenho para a barra, foco gelo 2 px; Esc fecha cartões.
- Estados de todo controle: padrão, hover, foco, pressionado, selecionado, desabilitado (40%). Resultado de ação nunca bloqueia nova ação.
- Texto do rótulo de botão é verbo ou nome do que acontece ("Soltar vespas", "Retirar a cutia"); sem "Clique aqui".

## 6. Uma linha por tópico: desenho principal e momento animado

### Evolução
- O1 biogenese: quatro bancadas (Redi, Needham, Spallanzani, Pasteur) com frasco controle e teste; momento: passam os dias e surgem larvas ou nada, o balão de pescoço de cisne de Pasteur fica limpo.
- O2 hipoteses: aparelho de Miller em corte de vidro; momento: faísca entre eletrodos e o coletor em U escurece com aminoácidos. Régua geológica no topo.
- O3 primeiras-celulas: célula grande engolfando bactéria roxa; momento: a segunda membrana e as cristas se formam em passos; cursor "O ar do planeta" muda o céu e o gráfico de O2 em degraus.
- I1 lamarck: tela dividida, girafas lilás e turquesa; momento: pescoço esticado em vida versus população com variação e filhotes de pescoço longo selecionados.
- I2 darwin: mapa da viagem e árvore da vida; momento: o galho se divide e a cruz cinza marca extinção; tocar duas pontas acende o ancestral comum.
- V1 fosseis: corte de lago em camadas; momento: peixe afunda, camadas cobrem, minerais substituem osso, erosão expõe; régua radioativa com meia-vida em barras.
- V2 comparacao: quatro membros com ossos coloridos (úmero, rádio, ulna, punho, dedos); momento: um membro se transforma lentamente no outro.
- V3 resistencia: placa de Petri com bactérias azuis e poucas laranja; momento: a gota cobre a placa, as azuis somem, as laranja se dividem; barras de proporção ao lado.
- S1 variacao: fita de DNA passando pela copiadora; momento: uma letra sai trocada com contorno brilhante, depois crossing-over gera quatro gametas diferentes.
- SE1 tipos: três painéis com curva em sino cinza; momento: o filtro verde desce e a curva nova colorida aparece por cima.
- SE2 casos: tronco em três momentos com mariposas; momento: a ave pega as mais visíveis e o gráfico de linha sobe e desce.
- A1 deriva: saco de bolinhas de duas cores; momento: a amostra vira a geração seguinte, em saco pequeno uma cor some; depois gargalo em funil e setas de fluxo gênico.
- ES1 modos: mapa com população de uma cor; momento: cordilheira sobe e divide, os dois lados mudam de tom, a barreira cai e o ícone de "não cruzam" aparece.
- ES2 isolamento: trilha do encontro aos netos com portões; momento: os portões fecham um a um, azuis antes do zigoto e laranja depois.
- P1 irradiacao: tentilhão ancestral abrindo em leque de bicos; momento: leque cresce e depois três silhuetas convergentes (tubarão, ictiossauro, golfinho) se aproximam em forma.
- H1 origem: árvore que cresce sobre linha de milhões de anos; momento: galhos ocre e azul-água brotam, extintos terminam em ponta cortada, Homo sapiens acende em âmbar.

### Ecologia
- E3 produtividade: planta e tanque de PPB; momento: partículas amarelas entram, R sai como calor vermelho, barra PPL cresce; herbívoro muda de tamanho com o ambiente.
- C4 fosforo: paisagem estilo cenaCiclo (rocha, solo, rio, mar, ave), sem nuvem; momento: seta do processo escolhido acende e o fosfato percorre o caminho; adubo faz o lago ficar verde.
- R4 polinizacao: dois painéis, flores com abelha e castanheira com cutia; momento: a abelha leva pólen e flores viram fruto; sem cutia os ouriços ficam fechados.
- R5 controle: talhão de cana de lado e gráfico de linhas; momento: vespas soltas, as duas curvas oscilam como predador e presa sob a linha de dano.
- N1 estrategias: sardinha com ovos versus onça com 2 filhotes; momento: ovos somem aos poucos enquanto filhotes crescem; curva de sobrevivência se desenha no rodapé.
- N2 costeiros: corte lateral da mata ao mar; momento: a maré sobe e desce no mangue e as raízes respiratórias ficam submersas ou à mostra; zoom ao escolher o trecho.
- N3 desmatamento: vista de cima quadriculada; momento: slider abre pasto em espinha de peixe e a faixa de borda amarela cresce, contador de fragmentos e de espécies.
- N4 invasoras: lago com nativos e casco de navio; momento: mexilhões laranja crescem em J e cobrem pedras; com inimigo a curva se estabiliza.
- N5 conservacao: a paisagem fragmentada de N3 com rio; momento: o corredor liga fragmentos e a onça atravessa; a mata ciliar cresce e o rio barrento clareia.

## 7. Desenhos para a Íris

Nenhum desenho exige a Íris: tudo se faz com formas simples no canvas. Se o resultado das silhuetas de hominíneos (H1) ou do tentilhão e bicos (P1) ficar pobre depois do primeiro teste no canvas, a programação devolve esse item para a Íris desenhar como sprite SVG de traço único, no mesmo estilo de linha do ícone.
