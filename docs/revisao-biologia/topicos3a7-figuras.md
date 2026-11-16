# Revisão de biologia: figuras de IA, tópicos 3 a 7

Revisores: Taxon e Sapien. Escopo: os arquivos `cenas-figura.js` de divisao-celular, bioenergetica, embriologia, histologia e taxonomia (nomes de vista, legendas, hotspots e rótulos desenhados).

## Corrigido
- embriologia, segmentação B: a legenda dizia "muito vitelo", mas a cena trata do ovo heterolécito. Agora diz "vitelo concentrado no polo vegetal".
- embriologia, anexos A: a câmara de ar fica "na ponta mais larga do ovo".
- embriologia, fecundação B: "Só o núcleo entra" estava impreciso. Agora diz que só um espermatozoide entra e que o núcleo dele se une ao do ovócito.
- embriologia, semanas A: a legenda dizia "em escala parecida", o que não é verdade. Agora diz "do embrião ao início do período fetal".
- taxonomia, Lineu: a hierarquia vai "de reino até espécie", e não "de classe até espécie".
- taxonomia, categorias: o leão está no gênero "Panthera (Panthera leo)". A legenda do filo não tem mais dois sinais de dois-pontos e não usa mais "sem coluna" (Chordata não se define pela coluna).
- taxonomia, chave: o olho composto não é exclusivo dos insetos. O texto agora diz "comum nos insetos e em outros artrópodes".
- taxonomia, binomial: os rótulos dos nomes populares se sobrepunham no celular. O espaçamento entre eles passou de 11% para 13%.
- bioenergetica, foto/geral: o texto agora diz "fase química (ou escura)".

## Conferido sem mudança
- humano-semanas-a: os hotspots e1 a e4 estão nos quatro embriões.
- foto-geral-b: pilha, proteínas e lamela estão no lugar certo.
- categorias-hierarquia-a: as caixas BIC e os hotspots batem com os 10 animais.
- cladistica-homologia-a: o 2º membro é de um carnívoro genérico. O rótulo "Cão" serve.
- Regras de texto: não há "!", "·", "→", "↔", "~" nem códigos internos.

## Pendente (precisa de dev ou de nova imagem)
- taxonomia-cladistica-homologia-a: o 4º membro, rotulado "Baleia", tem dedos longos com garras. Isso não é uma nadadeira e contradiz o hotspot `bal` ("ossos curtos... dentro da nadadeira"). É preciso gerar a imagem de novo, ou trocar o rótulo e o hotspot para outro mamífero.

## Testes
Rodado `node testes/fumaca.js` em embriologia (19 ok), taxonomia (13 ok) e bioenergetica (22 ok). Nenhuma falha.
