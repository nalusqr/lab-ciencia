# Guia de estilo da História: "colagem explicativa" (estilo Vox)

Decisão da Nalu em 17/11/2026, 04:26 UTC: a matéria de História usa o estilo de design e animação dos vídeos explicativos da Vox. Motivo dela: como não há professor narrando, a tela precisa explicar sozinha, prender a atenção e ser interativa.

As quatro imagens que ela mandou servem só de referência de estilo. Nada delas é copiado (nem fotos, nem tipos, nem logotipos); tudo é recriado do zero, como manda a regra do projeto.

Este guia substitui o "Campo escuro" apenas dentro de `site/historia/`. Biologia e Matemática continuam como estão.

## A linguagem visual

- **Papel de fundo:** folha clara e levemente amassada, com grade fina quadriculada (como papel milimetrado) e textura sutil. Pode haver recortes de jornal antigo ao fundo, muito apagados, com texto ilegível desenhado por nós.
- **Fotos recortadas:** imagens de época em preto e branco ou sépia, com borda de papel rasgado, sombra curta e às vezes um pedaço de fita adesiva. As figuras de IA viram recortes desse tipo, pelo filtro (escala de cinza, contraste, grão) e pela máscara de papel rasgado. A cor fica reservada para o que importa.
- **Marcação à mão:** marca-texto amarelo atrás das palavras-chave e dos títulos; círculos amarelos ou vermelhos desenhados à mão em volta do detalhe que o texto explica; setas tracejadas curvas ligando a explicação ao ponto da imagem.
- **Mapas:** mapa de papel envelhecido, recortado como as fotos, com a rota ou a fronteira desenhada em amarelo forte que se traça diante do aluno, e etiquetas de papel branco presas no mapa.
- **Linhas de construção:** linhas tracejadas finas, círculos de compasso e arcos de fundo ligando os recortes, como num quadro de investigação.
- **Tipografia:** títulos em serifa pesada de jornal; textos em sans legível (Atkinson Hyperlegible Next, como no resto do LAB); citação de fonte histórica em serifa itálica, como recorte de documento.
- **Cores:** papel claro (quase branco quente), tinta preta, amarelo marca-texto como cor principal de destaque, vermelho-alaranjado para setas e alertas, e um azul petróleo só para faixas e legendas. Cada sociedade pode ter uma cor de faixa na linha do tempo, sempre em tom de papel colorido, nunca neon.

## O movimento (o que mais conta)

A animação faz o papel do professor que narra. Cada etapa da viagem é um "plano" do vídeo:

1. O recorte entra deslizando ou "cai" sobre a mesa, com um leve giro, e assenta.
2. O marca-texto passa sobre a palavra-chave da etapa, da esquerda para a direita.
3. O círculo se desenha em volta do detalhe na imagem, e a seta tracejada sai dele até a explicação.
4. No mapa, a rota se traça em amarelo e a etiqueta de papel aparece no fim.
5. Na troca de etapa, a câmera desliza (pan e zoom) sobre a colagem até o próximo ponto, em vez de trocar a tela de uma vez.

Durações curtas (entre 300 e 900 ms por gesto), sempre um gesto de cada vez, para o olho acompanhar. Com `prefers-reduced-motion`, os recortes aparecem já no lugar, com troca suave de opacidade, sem deslizamentos nem traçados.

## Mapas (referências da Nalu, 17/11/2026, 04:33 UTC)

Os mapas seguem a mesma colagem e são sempre interativos e animados. Referências só de estilo, nada copiado; o contorno das terras é desenhado por nós.

- **Base:** mapa de papel claro e envelhecido, com relevo e rios em traço fino e textura de papel. O mar é escuro, quase preto, e o contraste com a terra clara recorta bem a costa.
- **Região em foco:** pintada em cor chapada (coral ou vermelho), com a borda levemente rasgada ou em relevo, como um recorte colado sobre o mapa. Outra possibilidade são listras diagonais em amarelo, com contorno vermelho, para mostrar uma área disputada ou uma província.
- **Rotas:** linha tracejada que se desenha diante do aluno, com um barco ou um ponto viajando por ela. As cidades são pontos com etiqueta, e a capital leva estrela.
- **Recortes sobre o mapa:** retratos de personagens em círculo recortado, fotos de época como polaroides presas na lateral, etiquetas de papel branco, marca-texto e mão recortada apontando para o lugar.
- **Movimento:** a câmera dá zoom e desliza de uma região para outra; a mancha de cor cresce ou recua conforme a data da linha do tempo; as fronteiras se desenham em traço; o globo pode girar para situar a região no mundo antes do zoom.
- **Interação:** tocar numa região ou num ponto abre a explicação e leva a viagem até a etapa; arrastar a linha do tempo muda o mapa; botões de zoom e de "ver rotas".

## Interatividade

- O aluno avança no próprio ritmo: anterior, pausar, próxima e "Etapa N de M", como na Biologia.
- Tocar num recorte ou num círculo abre a explicação daquele ponto e leva a viagem até a etapa certa.
- A fonte histórica é um recorte de documento com a pergunta "O que essa fonte mostra?" e a resposta revelada ao tocar.
- A linha do tempo continua arrastável, desenhada como fita de papel com marcos presos por alfinete.

## Regras que continuam valendo

Sem "!", sem "·", "→" ou "↔" como separador, "cerca de" em vez de "~", sem códigos internos na tela, contraste de leitura AA, foco visível, teclado e 390 px sem rolagem lateral.

## O que muda no piloto do Egito

O conteúdo, as etapas, os mapas e as quatro figuras já geradas continuam. Muda a pele visual e o movimento: fundo de papel com grade, figuras como recortes P&B com destaques em cor, marca-texto, círculos e setas desenhados à mão, mapa de papel com rota em amarelo e transições de câmera entre as etapas. A princípio, nenhuma figura nova é necessária.
