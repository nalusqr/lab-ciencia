# Tópico 8: Vírus, cenas 3D (revisão Taxon e Sapien)

Arquivos: `site/virus/vir3d.js`, `vir3d-pecas.js`, `cenas3d-estrutura.js`, `cenas3d-fagos.js`, `cenas3d-replicacao.js`, `cenas3d-prevencao.js`.
Screenshots vistos (amostra): desk-tipos, cel-tipos, cel-hiv3d, desk-vacinas3d, cel-liso-22.

## Regras de texto
Nenhum "!", "·", "→", "↔" ou "~" em texto de tela; o tempo do ciclo lítico já usa "cerca de". Sem códigos internos visíveis.

## Corrigido
- `cenas3d-replicacao.js`, integrase: "no cromossomo do linfócito, que vira provírus" dava a entender que o cromossomo vira provírus. Agora: "Integrado, esse DNA passa a se chamar provírus."
- `cenas3d-estrutura.js`, capsídeo da gripe: o modelo mostra uma capa única em volta dos 8 RNAs, mas no influenza a proteína envolve cada segmento (ribonucleoproteínas helicoidais). Acrescentada nota de simplificação no detalhe ao tocar.

## Biologia conferida (ok)
Capsômeros, nucleocapsídeo, envelope tirado da membrana, H e N; formas helicoidal (TMV), icosaédrica (adenovírus, 12 fibras) e complexa (T4); ciclo lítico em 5 etapas, só o DNA entra, 100 a 200 fagos; lisogênico com prófago, divisões e indução por UV; vírus animal (receptor, endocitose, desnudamento, DNA no núcleo, brotamento ou lise); HIV (gp120/gp41 e CD4, 2 RNAs, transcriptase reversa, integrase, protease); anticorpos em Y neutralizando espículas.

## Pendente para dev
- `prevencao/vacinas` (Anticorpos em 3D, desktop): parte dos anticorpos aparece solta, longe da espícula, e um atravessa o envelope. Seria bom prender a ponta dos braços na espícula de forma visível.
- O modelo da gripe tem capsídeo esférico único (ver nota acima). Se o desenho for refeito, o certo é fazer as proteínas em volta de cada bastão de RNA, com a matriz (M1) sob o envelope.
- `cel-hiv3d`: "DNA" aparece duas vezes, no texto fixo e no rótulo da peça. Pequeno.
- `cel-liso-22`: há um ponto de âncora sem rótulo na bactéria de cima, à esquerda (provavelmente o rótulo "bactéria" foi escondido e o ponto ficou).

## Teste
`node testes/fumaca.js virus`: 14 ok, 0 falhas, 0 avisos.
