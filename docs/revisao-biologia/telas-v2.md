# Revisão das 21 telas v2 (figura de IA + pontos + animação)

Revisores: Taxon e Sapien. Uma rodada. Data: 2026-11-16.

Método: cada imagem original (`/tmp/claude-0/ia2/png/`) recebeu os pontos desenhados nas coordenadas atuais do código. As animações foram conferidas no código e nos screenshots de `/tmp/claude-0/v2/`. Biogênese, estufa, locomotor e desarmônicas foram refotografadas depois das correções.

## Resultado

Nenhuma imagem precisa ser descartada. Uma (Lamarck B) deve ser refeita quando der.

## Correções feitas

| Tela | Arquivo | Correção |
|---|---|---|
| origem/biogenese | evolucao/cenas-figura.js | **Animação errada.** A poeira passava pela curva em U, subia o arco e parava quase na entrada do frasco (fração 0,78 do caminho). Isso contradizia o experimento. Agora ela para no fundo do U (`RET = .36`), onde está o ponto "Poeira retida". |
| origem/biogenese | evolucao/cenas-figura.js | O ponto "Pescoço de cisne" estava no vazio, dentro do arco. Foi movido para o tubo (34, 27). |
| origem/primeiras-celulas | evolucao/cenas-figura.js | O ponto "Membrana da célula" caía sobre a bactéria. Foi movido para a borda da dobra (36,5, 41). |
| locomotor/movimento | anatomia/cenas-figura.js | Úmero: o texto dizia que ele "funciona como alavanca". Na flexão do cotovelo, o úmero fica parado e quem se move são o rádio e a ulna. O texto foi corrigido. |
| locomotor/movimento | anatomia/cenas-figura.js | Olécrano: o texto o chamava de "ponto de apoio". O apoio da alavanca é a articulação do cotovelo, e o olécrano é onde o tríceps se insere. O texto foi corrigido. |
| reprodutor/prevencao | anatomia/cenas-figura.js | A camisinha masculina era chamada de "único método" que previne ISTs, mas o ponto do colo do útero diz que a feminina também previne. Agora o texto diz: "Com a feminina, é o único tipo de método…". |
| reprodutor/ciclo | anatomia/cenas-figura.js | Testículo: "a cerca de 2 °C a menos" virou "onde a temperatura é cerca de 2 °C menor". |
| circulatorio/sangue-linfa | anatomia/cenas-figura.js | O ponto "Hemácias" estava no espaço vazio da luz da artéria. Foi movido para uma hemácia (21,8, 69,5). |
| relacoes/desarmonicas | ecologia/cenas-figura-v2.js | O ponto "Árvore hospedeira" caía numa touceira da erva-de-passarinho. Foi movido para o galho da árvore (94,5, 54,7). |
| impactos/ozonio | ecologia/cenas-figura-v2.js | O texto do ponto "Cloro dos CFCs" ganhou: "O maior buraco se abre sobre a Antártida." O fato é clássico no ENEM, e a figura não mostra o polo. |
| impactos/estufa | ecologia/cenas-figura-v2.js | O rótulo do termômetro ("+1,8 °C") ficava sob a borda esfumada da figura. O termômetro foi deslocado 24 px para dentro. |

## Conferido e correto (sem mudança)

- **respiratorio/hematose**: pulmão direito do lado esquerdo da tela, como se vê de frente. Pontos de traqueia, brônquios, bronquíolo, alvéolos, sangue venoso (violeta) e arterial (vermelho) estão certos. Na animação, o ar desce na inspiração e sobe na expiração. A seta do diafragma desce na inspiração. O O₂ vai do alvéolo para o sangue e o CO₂ vai ao contrário. O sangue chega violeta e sai vermelho.
- **endocrino/glandulas**: hipotálamo e hipófise, tireoide, adrenais sobre os rins, pâncreas e ovários estão no lugar.
- **reprodutor/ciclo**: os espermatozoides saem do testículo, passam pelo ducto deferente, pela vesícula e pela próstata e seguem pela uretra até o pênis. No sistema feminino, eles sobem pela vagina, pelo colo e pelo útero até a tuba. O ovócito vai do ovário à fímbria e daí à tuba. Os pontos estão nas estruturas certas.
- **locomotor/movimento**: o bíceps fica na frente e o tríceps atrás, com o olécrano na ponta posterior. Na flexão, o bíceps acende, a seta puxa para a origem e o antebraço sobe. Na extensão, ocorre o oposto.
- **nervoso/autonomo**: o simpático aparece no coração rápido, nas adrenais e nos pulmões. O parassimpático aparece no estômago e nos intestinos. Os textos estão corretos (vago, saídas toracolombar e craniossacral, bexiga).
- **circulatorio/sangue-linfa**: as válvulas da veia têm as bordas livres para cima, e o fluxo desenhado sobe, o que está coerente. O sangue vai da arteríola para os capilares e daí para a vênula.
- **ideias/lamarck**, **especiacao/isolamento** (62, 63 e 64 cromossomos), **especiacao/modos** (esquilo-antílope de Harris no lado sul e de cauda branca no lado norte; as aparências batem): pontos e textos estão corretos.
- **Ecologia** (escada, produtividade, ozônio, predador, cadeia, chuva, polinização): os pontos estão nas estruturas certas. Na animação, a energia segue a direção certa: produtor, depois herbívoro e depois predadores, com calor perdido em cada nível. O UV é barrado pela camada e passa pelo buraco. O infravermelho sobe e uma parte volta. Os gases vão da chaminé até a nuvem e voltam como chuva. O pólen sai das flores, e a semente vai da cutia até a muda.
- **Regras de texto**: não há "!", "·" nem "~" nos três blocos. O único "→" está na equação química `Cl + O₃ → ClO + O₂`, que é seta de reação, não separador. Não há códigos internos.

## Ressalvas (não exigem descarte)

1. **Lamarck B (`evolucao-ideias-lamarck-b`)**: as cinco girafas mudam de tamanho no corpo inteiro, não só no pescoço. Elas parecem uma série de idades ou uma "marcha do progresso", e não uma população de adultos com variação no pescoço. Os pontos e o texto explicam a ideia certa. **Recomendo refazer** a imagem com adultos de corpo igual e pescoços diferentes, misturados e fora de ordem.
2. **nervoso-autonomo**: a cadeia de gânglios simpáticos aparece nas laterais do tórax, e não junto da coluna. Os rins aparecem na frente dos intestinos. Nada disso tem ponto ou texto. Pode ficar.
3. **respiratorio-hematose**: o diafragma tem forma estranha, com pilares à frente, e o recuo cardíaco do pulmão esquerdo é pouco visível. Pode ficar.
4. **impactos/estufa**: o termômetro usa 3 °C por dobra de CO₂, a sensibilidade de equilíbrio. Com 420 ppm ele mostra +1,8 °C, mais do que o aquecimento medido hoje (cerca de 1,2 a 1,3 °C). É o mesmo modelo da cena 3D antiga (`cenas3d-ciclos.js`), por isso não mexi. Se quiserem, um rótulo como "no equilíbrio" resolveria.
5. **circulatorio (vênula)**: a figura não deixa claro para que lado a vênula drena. A animação desce em direção à ponta mais larga, que fica cortada, e isso é aceitável.

## Testes

`node testes/fumaca.js`: anatomia com 17 ok, evolucao com 17 ok e ecologia com 1 ok. Nenhuma falha, nenhum aviso e nenhum erro de página nas capturas novas.
