# Anatomia v4, viagens interativas: revisão de biologia (Taxon e Sapien)

Escopo: as quatro rotas refeitas como viagem sobre figuras de IA.
- `anatomia#circulatorio/coracao` e `anatomia#respiratorio/hematose`: `site/anatomia/cenas-figura-circ-resp.js`
- `anatomia#excretor/nefron` e `anatomia#nervoso/autonomo`: `site/anatomia/cenas-figura-rim-nervo.js`

Método: os caminhos (pontos das curvas) e os hotspots foram desenhados sobre cada imagem com uma grade em %, e depois conferidos nas screenshots de todas as etapas em 1280 e 390 px.

## Caminhos

| Rota | Caminho | Situação |
|---|---|---|
| Coração, vista A (corte) | cavas, átrio direito, tricúspide, ventrículo direito, valva pulmonar, tronco pulmonar; veias pulmonares, átrio esquerdo, mitral, ventrículo esquerdo, valva aórtica, aorta (passa atrás do tronco pulmonar, hemácia meio apagada), arco | ok |
| Coração, vista B (tórax) | cava superior, coração, tronco pulmonar, ramo esquerdo, pulmão, veias pulmonares, ventrículo esquerdo, arco, aorta descendente, abdome, volta pela cava inferior | ok |
| Respiratório | narina, cavidade nasal, faringe, laringe, traqueia, brônquio direito, bronquíolo, alvéolos; ar só avança na inspiração | ok |
| Néfron, vista A | aorta descendo, artéria renal, rim; veia renal até a cava subindo; pelve, ureter, bexiga, uretra | ok |
| Néfron, vista B | cápsula, túbulo proximal, ramo descendente, fundo da alça, ramo ascendente, túbulo distal, ducto coletor | ok |
| Nervoso, corpo | mão, nervo do braço, medula cervical; medula até o encéfalo | ok |
| Nervoso, arco reflexo | pele, gânglio da raiz dorsal, corno dorsal, interneurônio, neurônio motor no corno ventral | ok depois do ajuste abaixo |

### Ressalva do tórax (ramo da artéria pulmonar atrás da cava)
Aceitável. Na anatomia real a artéria pulmonar direita passa mesmo atrás da cava superior; a figura só não mostra a origem dela no tronco. O caminho da hemácia usa o ramo esquerdo e não passa por esse trecho. Não exige imagem nova.

### Ressalva do arco reflexo (nervo do músculo do lado oposto)
Erro real da figura: o axônio motor (ciano) sai pelo corno ventral esquerdo e segue na raiz ventral do mesmo lado, mas o músculo está ligado ao nervo espinal do lado direito. Quem segue o nervo vê o comando "atravessar" a medula.
Ajuste feito, sem imagem nova:
- a etapa "Arco reflexo" agora continua depois do neurônio motor pelo axônio ciano até a raiz ventral do mesmo lado (antes parava no corpo celular);
- a cor do impulso passa a motora só no neurônio motor (antes trocava já na entrada do corno dorsal, ainda no amarelo do interneurônio);
- a etapa "Efetor" mostra só o trecho final do nervo, na placa motora, e não percorre mais o nervo que sai do outro lado;
- legenda da etapa e hotspot do neurônio motor dizem que o axônio sai pela raiz ventral do mesmo lado.
Mesmo assim a imagem continua mostrando a ligação errada. **Recomendo refazer `nervoso-organizacao-b`** (prioridade média): músculo ligado ao nervo espinal do mesmo lado da pele e do neurônio motor.

## Medidores

| Medidor | Valores | Situação |
|---|---|---|
| Saturação da hemoglobina | cerca de 75% no venoso, cerca de 98% no arterial, transição nos pulmões e no corpo | ok |
| Pressões parciais | ar cerca de 159 mmHg de O₂ (umedecido cerca de 150), alvéolo cerca de 104 e 40, sangue venoso 40 e 46, arterial cerca de 100 e 40 | ok |
| Pressão no pulmão | abaixo da do ar na inspiração, acima na expiração | ok |
| Osmolaridade | 300 no filtrado e no proximal, cerca de 1200 no fundo da alça, cerca de 100 no fim do ramo ascendente | ok |
| Osmolaridade do ducto coletor e da urina | estava 1000 | **corrigido para cerca de 1200** |
| Volume | cerca de 900 L de plasma, 180 L de filtrado, 60 após o proximal, cerca de 1,5 L de urina por dia | ok |
| Potencial de membrana | repouso -70 mV, limiar -55 mV, pico +35 mV, hiperpolarização -80 mV | ok |

## Hotspots e textos
- Coração, septo: o ponto ficava na borda da cavidade do ventrículo direito. Passou de [49, 64] para [52.5, 64], sobre o septo.
- Coração, painel: "Lado esquerdo do coração" aparecia na etapa das veias pulmonares e "Lado direito" na das cavas, que são vasos fora do coração. Agora: "Chegando ao lado direito/esquerdo do coração" e "Saindo do coração" na artéria pulmonar e na aorta.
- Néfron, arteríola eferente: o caminho do sangue terminava saindo pela ponta solta do vaso, para a esquerda. Agora segue para a direita, para os capilares em volta do túbulo.
- Demais hotspots conferidos sobre as imagens: na estrutura certa. Textos curtos e corretos para o ENEM.

## Regras de texto e layout
- Sem "!", "·", "→", "↔" ou "~" nos textos de tela; "cerca de" usado em todos os valores aproximados; sem códigos internos.
- Nomes de etapa cortados com reticências no painel de 1280 px: "Medula: arco reflexo" virou "Arco reflexo" e "Autônomo: simpático e parassimpático" virou "Sistema autônomo".
- "Glomérulo e cápsula de Bowman" cortava em 1280 e 390: virou "Glomérulo" (a legenda da etapa cita a cápsula de Bowman).
- Coração em 1280: "Veias pulmonares" e "Ventrículo esquerdo" cortavam. O painel passou de 304 para 330 px de largura, o que também afasta "ainda há O₂ de reserva" dos círculos de O₂.
- Traçado do potencial: os rótulos "limiar" e "repouso" se sobrepunham. "repouso" foi para baixo da linha.
- Em 390 px, a primeira linha da faixa (saturação, pressões parciais, mV, mOsm/L) encostava nos botões de etapa. Desceu de 4 a 8 px nas quatro rotas.

## Exige imagem nova
- `nervoso-organizacao-b` (arco reflexo): nervo do músculo saindo do lado oposto da medula. Contornado nas etapas, mas a figura continua errada.
