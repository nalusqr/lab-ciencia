# Revisão de biologia: cenas 3D de Microrganismos (Taxon e Sapien)

Arquivos: `site/microrganismos/micro3d-pecas.js`, `cenas3d-monera.js`, `cenas3d-protoctista.js`, `cenas3d-fungi.js`.
Rodada única. Regras de texto (sem "!", "·", "→", "↔", "~", códigos internos): nenhuma violação nos textos visíveis.

## Coerência biológica (ok)
- Bactéria em corte: cápsula, parede de peptidoglicano, membrana, nucleoide sem membrana, plasmídeos, ribossomos 70S, fímbrias e flagelo corretos.
- Divisão binária: cópia do cromossomo, alongamento, septo e população dobrando a cada cerca de 20 min.
- Conjugação (pilus, cópia do plasmídeo, doadora mantém o seu), transformação e transdução (fago leva DNA da bactéria lisada) coerentes.
- Ameba (pseudópodes, fagocitose, vacúolo contrátil), tripanossomo (membrana ondulante, flagelo livre na frente), paramécio (cílios em onda metacrônica, macro e micronúcleo, vacúolos em estrela), plasmódio (anel e esquizonte na hemácia).
- Hifas, micélio, esporângios, digestão extracorpórea, cogumelo como corpo de frutificação, lamelas.

## Corrigido nesta rodada
- Monera, "População": "se divide a cada cerca de 20 minutos" virou "se divide em cerca de 20 minutos".
- Protoctista, "Plasmódio": acrescentado que, no corpo humano, vive em células do fígado e nas hemácias.
- Fungi, "Hifas": "Fios de células" virou "Filamentos finos" (o bolor do pão, Rhizopus, tem hifas sem septos).
- Fungi, bolor: hifas presas aos limites da fatia de pão (uma colônia saía da fatia e ficava no ar).
- Fungi, solo: hifas do micélio presas abaixo da superfície (galhos furavam o chão).
- Monera, transdução: o fago começa mais baixo no computador (a cabeça saía pelo topo do palco e cobria a pastilha de etapa).

## Para programação (não corrigido)
- Transformação: a "bactéria morta" aparece inteira, só escurecida; a frase diz "a parede se rompe". Falta abrir a parede (corte ou lacuna) para coincidir com o texto.
- Protozoários no celular: o flagelo livre do tripanossomo sai pela borda direita da tela; ajustar a posição ou o enquadramento do quadro 2 por 2.
- Conferir de novo os screenshots depois destas edições (os de /tmp/claude-0/t10/shots/ são anteriores; alguns ainda mostram textos antigos, como o rótulo "Plasmodium" e a dica "toque de novo em Troca de genes").

## Teste
`node testes/fumaca.js microrganismos`: 8 ok, 0 falhas, 0 avisos.
