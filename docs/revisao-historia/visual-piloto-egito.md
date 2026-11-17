# Visual do piloto de História: seção Egito (Apolo)

Base: Campo escuro (`docs/GUIA-DE-ESTILO.md`) e o padrão aprovado em 15/11/2026. Só a seção Egito (E1 a E4) e a linha do tempo. Orientação, sem código de produção.

## 1. Paleta de épocas e de mapa
Tokens novos, usados só em História. Contraste medido sobre `--bg` / `--panel` (AA exige 4,5 para texto e 3 para contorno). Cor nunca é a única pista: toda mancha tem nome escrito e, no Kush, hachura.

| Token | Hex | Uso | Contraste |
|---|---|---|---|
| `--his-rio` | `#4FB3E8` | Nilo, cheia, rotas de barco | 8,1 / 7,4 |
| `--his-deserto` | `#C9A66B` | Terra vermelha (Deshret), fundo do mapa em 18% | 8,3 / 7,6 |
| `--his-limo` | `#8B6B4A` | Terra fértil (Kemet), só preenchimento e contorno | 3,9 / 3,6 |
| `--his-broto` | `#5FBF6A` | Plantio depois da cheia | 8,3 / 7,6 |
| `--his-alto` | `#F2EEDF` | Alto Egito (coroa branca) | 16,4 / 14,9 |
| `--his-baixo` | `#F0707A` | Baixo Egito (coroa vermelha) | 6,6 / 6,0 |
| `--his-kush` | `#D98A3D` | Kush e Núbia, sempre com hachura diagonal | 7,0 / 6,3 |
| `--his-seca` | `#E8C547` | Plantação amarela, cheia fraca | 11,4 / 10,3 |
| `--amber` (já existe) | `#FFB347` | Marco ativo na régua e no mapa | 10,7 / 9,7 |

Terra do mapa: `#131A2B` com textura de grão a 6%. Cada sociedade tem uma cor de faixa própria, escolhida pela dona na revisão; no piloto só o Egito aparece colorido e as outras ficam em `--line-strong`.

## 2. Linha do tempo arrastável
- Forma: trilho horizontal de 72 px com régua em cima, faixas de sociedades por baixo e uma alça (pega) circular de 44 px. Arrasta com mouse, toque, setas do teclado (passo de um marco) e Home/End.
- Escala quebrada: 10 000 a 3500 a.C. comprimido em cerca de 12% da largura, com um corte em zigue-zague e o aviso "aqui a régua pula milhares de anos". Depois, escala linear até 330 a.C.
- Faixas: uma linha por sociedade, empilhadas, para o aluno ver a sobreposição. Egito faraônico (cerca de 3100 a 332 a.C.) em `--his-alto`; no piloto, as faixas das outras sociedades ficam cinza com nome.
- Marcos: 44 px de área de toque, ponto de 12 px com nome em pastilha escura. Marco ativo: âmbar, aro branco, nome em negrito. Datas em JetBrains Mono. No piloto, 7 marcos egípcios (3100, 2560, 1550, 1350, 1157, 728, 656 a.C.).
- 1280 px: régua inteira visível, nomes dos marcos acima e abaixo alternados, mapa grande ao lado (8 colunas de 12) e régua embaixo.
- 390 px: régua rola de lado (único elemento que pode rolar), mostra cerca de 3 marcos por vez, com sombra nas bordas indicando que há mais; o marco ativo se centraliza sozinho. Botões "Marco anterior" e "Próximo marco" de 44 px embaixo da régua, porque arrastar não pode ser o único caminho. Mapa em cima, régua embaixo.
- Mostrar a data atual grande ("cerca de 3100 a.C.") e, ao lado, o nome do período (Antigo Império).

## 3. Mapa animado (SVG próprio)
- Desenhado do zero em SVG, vetor limpo, traço fino de 1,5 px, sem copiar mapa de terceiros nem contorno de atlas. Referência só de proporções (vale estreito, delta em leque). Nota fixa: "Mapa esquemático, contornos aproximados".
- Camadas: terra, deserto, faixa fértil, Nilo, delta, cataratas numeradas, cidades, manchas de território, rotas.
- Cheia: o Nilo é um traço que engrossa de 4 para 22 px, cobre a faixa do vale em azul translúcido, recua e deixa o limo marrom, onde nasce o verde. O nilômetro (escada de pedra) ao lado sobe e desce; baixo demais, o campo fica `--his-seca`; alto demais, as aldeias ficam sob a água.
- Manchas: Alto e Baixo Egito aparecem em `--his-alto` e `--his-baixo`; em cerca de 3100 a.C. elas se fundem por dissolução de 700 ms numa só. Depois, a mancha egípcia sobe até a 4ª catarata (1450 a.C.), a kushita (hachura) desce de Napata ao delta (728 a.C.) e recua (656 a.C.). A mancha acompanha a data da alça: fora da época, apaga a 15% de opacidade.
- Rotas de barcos: linha tracejada em `--his-rio`, com barquinho de silhueta andando de Assuã a Gizé (cerca de 800 km), levando blocos. Camada "Mostrar rotas" liga e desliga.
- Zoom: Gizé e Tebas por clique ou botões Aproximar e Afastar.

## 4. Cartões
- Fonte histórica: cartão `--panel` com borda de 4 px na cor da época, citação em Atkinson 16 px com aspas, crédito em 13 px dim (autor, obra, data). Abaixo, botão secundário "O que essa fonte mostra?". Ao tocar, a resposta se revela em dois blocos, "O que ela diz" e "Cuidado com quem escreveu" (o ponto de vista). A resposta abre sozinha só depois de o aluno tocar; nunca já aberta.
- Cartão "No ENEM": caixa `--panel-2` com selo âmbar "No ENEM" e ícone do conjunto; texto de até 4 linhas, com o termo cobrado em negrito. Uma pegadinha por cartão, em destaque.

## 5. Figura de IA e viagem por etapas (padrão do digestório)
- Vista A (geral): o vale do Nilo visto de cima, do delta ao sul, ilustração 3D realista sobre `#0B0F1C`, sem texto na imagem, em `site/img/ia/` com o `.js` de data URI. Vista B (de perto): a cena de época (campo pós-cheia, obra em Gizé, pesagem do coração, faraó de Kush). O botão "Ver de perto" troca A por B, como no duodeno.
- Hotspots no mesmo padrão: pontos de 22 px (área de 44), cor da época, rótulo com título e uma frase ao passar, tocar ou focar; Esc fecha.
- Viagem em etapas com botões Anterior, Pausar e Próxima, medidor e partícula viajante. Cada cena vira uma jornada: E1 segue uma gota da chuva da Etiópia até o delta, com o medidor do nilômetro no lugar do pH; E2 segue um bloco de calcário até Gizé, com medidor de rações; E3 segue o coração até a balança; E4 sobe o Nilo até Napata. Legenda de uma frase com o termo novo em negrito, e as datas na régua mudam junto com a etapa.
- Escrever "Ilustração com cores adicionadas, proporções aproximadas". Pele em tons variados, sem caricatura.

## 6. Movimento
- Anima: cheia e recuo (4 s, pausável), fusão das coroas (700 ms), manchas de território (400 ms ao mudar de data), partícula e barco (6 a 9 s por etapa, pausáveis), troca de vista A para B (600 a 800 ms). Só transform e opacity, 60 fps.
- Retorno de interface (hover, foco, revelar resposta): 120 a 200 ms. Pulso de convite nos hotspots: 2 ciclos e para. Nada pisca mais de 3 vezes por segundo.
- `prefers-reduced-motion: reduce`: a cheia vira três quadros (seca, cheia, depois), que o aluno troca por botão; manchas mudam por corte com esmaecimento de 150 ms; a partícula não anda sozinha, só por Próxima; sem pulso e sem desfoque.
