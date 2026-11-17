# Tópico 13: Ecologia (revisão Taxon e Sapien)

## 3D (eco3d-pecas.js, cenas3d-teias.js, cenas3d-ciclos.js, cenas3d-populacoes.js)
- Cadeia, fluxo e pirâmides: cerca de 10% entre níveis, calor da respiração, fluxo de mão única, pirâmides invertidas (biomassa no plâncton, números na árvore) corretos.
- Ciclo do nitrogênio: fixação (Rhizobium nos nódulos, cianobactérias, raios), amonificação (decompositores), nitrificação (Nitrosomonas, Nitrobacter), assimilação, desnitrificação (Pseudomonas). Correto.
- Carbono e água: corretos. Predador e presa (capivara e onça): correto.
- Efeito estufa: separado da camada de ozônio (rota própria e alerta no ENEM). Corrigido: a luz do Sol "atravessa a camada de gases de efeito estufa quase sem ser absorvida" (antes dizia "a atmosfera", o que ignora a absorção de UV pelo ozônio).
- Sem "!", "·", "→", "↔" ou "~" em textos visíveis.

## Figuras de IA (cenas-figura.js), 12 imagens conferidas
Todas fiéis: líquen folioso com apotécios, nódulos de leguminosa (um cortado, rosado), Amazônia com rio escuro, Cerrado com troncos retorcidos e solo vermelho, manguezal com raízes-escora, pneumatóforos e caranguejos, recife, floração de algas com peixes mortos, esgoto em rio urbano, rocha com líquens e musgos, pasto abandonado com embaúbas, queimada com pasto, Achatina fulica com jovens. Nenhuma a refazer; 0 créditos gastos.

Hotspots ajustados:
- Casca da árvore: [37,17] para [15,20] (estava quase sobre o talo).
- Troncos retorcidos (Cerrado): [31,65] para [33,71] (estava ao lado do tronco).
- Líquen crostoso: [28,69] para [23,77] (agora sobre a mancha laranja).
- Estradas (desmatamento): [66,67] para [54,74] (agora sobre a trilha).
- Achatina: "Folha comida" virou "Folha" (a folha da imagem está inteira).

## Screenshots
Amostra (nitrogênio desktop, estufa celular, pirâmides desktop) sem sobreposição ou texto cortado.

## Teste
`node testes/fumaca.js ecologia`: 1 ok, 0 falhas, 0 avisos.

## Pendências de dev
Nenhuma.
