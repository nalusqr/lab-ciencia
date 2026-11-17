# Tópico 9: plantas e animais (parte nova), revisão de biologia

Revisores: Taxon e Sapien. Rodada única, sem commit.

## Escopo
- 3D: `site/plantas-animais/plantas3d-pecas.js`, `cenas3d-plantae.js`, `cenas3d-animalia.js`.
- Figuras de IA e hotspots: `site/microrganismos/cenas-figura.js`, `site/plantas-animais/cenas-figura.js` (12 imagens abertas, com os pontos sobrepostos).
- Amostra de telas em `/tmp/claude-0/t10/shots/` (pa-* e aur-*).

## Conferido sem problema
- Cladograma da conquista do ambiente terrestre: alga verde na base, anéis de vasos, semente e flor entre os grupos certos.
- Pteridófitas: soro, esporângio, ânulo, esporo (n), prótalo (n), anterídio, arquegônio, água e esporófito jovem (2n), na ordem certa.
- Flor (cálice, corola, androceu, gineceu, óvulos) e polinização pela abelha.
- Xilema (seiva bruta, para cima), floema (seiva elaborada, para baixo) e anel de Malpighi cortando só o floema.
- Planos de corpo: diblástico radial, acelomado, pseudocelomado (mesoderme só na parede) e celomado (mesoderme dos dois lados), tubo incompleto ou completo, blastóporo em protostômios e deuterostômios.
- Esponja: poros, coanócitos, átrio e ósculo, sem tecidos verdadeiros.
- Regras de texto: nenhum "!", "·", "→", "↔" ou "~" nos textos visíveis desses arquivos.

## Corrigido
| Arquivo | Mudança |
|---|---|
| cenas3d-plantae.js | Grão de pólen: "é o gametófito masculino jovem, que forma o tubo polínico" (antes: "leva o gametófito") |
| cenas3d-plantae.js | Âncora do rótulo "sépalas" vai para a ponta da sépala (antes caía no meio da flor, entre os filetes) |
| cenas3d-animalia.js | Parede da esponja: "células pouco especializadas" (antes: "células soltas"); espículas citam a espongina |
| microrganismos/cenas-figura.js | Líquen: "pequenos discos (apotécios)"; na imagem os discos são bege, não alaranjados |
| plantas-animais/cenas-figura.js | Aedes: o ponto "patas listradas" estava no chão; passou para a pata de trás (76, 75) |
| plantas-animais/cenas-figura.js | Peixe ósseo: o ponto "opérculo" estava no olho; passou para a placa das brânquias (40, 52) |
| plantas-animais/cenas-figura.js | Aedes: o texto da lira fala em escamas brancas que formam o desenho; a legenda da pinha perdeu o "aberta" |

## Imagens
| Imagem | Situação |
|---|---|
| plantas-animais-plantae-gimnospermas-b | **Refazer.** A pinha foi desenhada como um cone de Pinus aberto, com escamas lenhosas em roseta. A pinha da araucária é uma esfera compacta de pinhões, que se desmancha quando madura. A gralha também tem topete alto (lembra o gaio-de-steller), enquanto a gralha-azul tem cabeça preta e corpo azul, sem topete grande. |
| plantas-animais-plantae-briofitas-b | Refazer, se der. Duas setas parecem bifurcadas, com duas cápsulas na mesma haste, e há uma seta sem cápsula. Cada esporófito tem uma só seta e uma só cápsula. |
| microrganismos-protoctista-protozooses-b | Aceitável. As antenas são bem plumosas (lembram macho), e o texto fala da fêmea. |
| plantas-animais-animalia-artropodes-b | Aceitável. O tórax tem manchas brancas, mas a lira não aparece nítida. |
| As outras 8 | Corretas. Os pontos caem na estrutura certa. |

## Pendências de dev
1. **A lente das pteridófitas vaza para outras rotas.** Ao ir de `plantae/pteridofitas` para `plantae/angiospermas`, o círculo âmbar, o rótulo "esporófito (2n)" e a linha tracejada continuam desenhados por cima da flor. Aparece em `pa-desk-plantae_angiospermas.png` e `pa-cel-plantae_angiospermas.png`. O `sobre` da cena das pteridófitas, ou o 2D dela, segue ativo depois de `sair`.
2. Na esponja, uma ficha no pé da cena fica escondida atrás da legenda (`pa-desk-animalia_poriferos-cnidarios.png`).
3. Na lente das pteridófitas, os soros aparecem na face de cima do folíolo. O texto diz "sob o folíolo": convém virar a lâmina.
4. As figuras de IA ocupam pouco do palco no desktop (`aur-plant-animalia-vertebrados.png`).

## Testes
- `node testes/fumaca.js plantas-animais`: 14 ok, 0 falhas.
- `node testes/fumaca.js microrganismos`: na 1ª rodada, `#protoctista/protozooses` acusou "canvas vazio"; na 2ª, 8 ok e 0 falhas. É intermitente.
