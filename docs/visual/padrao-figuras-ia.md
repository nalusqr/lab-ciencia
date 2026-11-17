# Padrão de figuras por IA (coleção LAB)

Gera: Íris. Anima: Martin. Toda figura deve parecer da mesma coleção.
## Estilo de render
- Ilustração médica 3D realista, como um coração anatômico renderizado: volume, subsurface scattering, textura úmida.
- Luz de estúdio suave: chave grande à esquerda e acima, recorte frio (azulado) na borda direita, sombra de contato leve.
- Leve brilho úmido (specular macio) em mucosas, membranas e tecidos. Sem reflexo duro, sem neon.
## Fundo e enquadramento
- Fundo liso azul-noite `#0B0F1C` (o `--bg` do Campo escuro). Pode haver um halo radial sutil `#161D33` atrás do objeto, nada mais.
- Sem chão, grade, estrelas, partículas nem vinheta. Bordas 100% `#0B0F1C`, para fundir com a página.
- Objeto principal centralizado, ocupa 65 a 75% do quadro, com margem de 12% para os hotspots e rótulos.
- Câmera frontal ou 3/4 suave, sem perspectiva extrema. Um tema por imagem.
- Proporção: 4:3 para cenas e órgãos (padrão), 1:1 para peças isoladas e microscópicos, 16:9 só para paisagens e biomas.
## Sem texto
- Nenhuma letra, número, seta, legenda, régua, logotipo ou marca d'água na imagem. Rótulos, setas e hotspots são feitos em HTML pelo Martin.
## Paleta por tipo (coerente com a paleta científica do guia)
- Músculo, coração, sangue arterial: vermelhos profundos `#B5303C`; sangue venoso e vasos: azul-arroxeado `#4A5FA8`.
- Pele, ossos e cartilagem: marfim quente `#E6D5B8`; tendões e fáscia: perolado.
- Órgãos viscerais (fígado, rim, intestino): marrom-avermelhado e rosado `#8C4A3C`, `#D98C7A`.
- Sistema nervoso: bege-acinzentado `#CFC3B0`, vasos finos vermelhos.
- Plantas: verdes naturais `#3F8F4A`, folhas com cera e gotas; flores e frutos com cor real da espécie.
- Animais: cor real da espécie, pelo e pele com microdetalhe; invertebrados com brilho de quitina ou muco.
- Fungos e liquens: ocre, creme, cinza-esverdeado. Bactérias: verde-oliva e roxo suave (aspecto de microscopia).
- Vírus e células: cores da paleta científica (núcleo violeta, mitocôndria laranja), translucidez e profundidade de campo rasa.
- Solo, água e rocha: terra escura `#3B2E26`, água azul-petróleo `#1F5E73`. Sem cores fluorescentes.
## Modelo de prompt (inglês)
```
Photorealistic 3D medical illustration of [SUBJECT: organ / organism / structure],
[VIEW: front / three-quarter / cross-section], centered, filling about 70% of the frame.
Soft studio lighting, large key light from upper left, cool rim light on the right,
subtle wet specular sheen, realistic [TEXTURE: moist tissue / waxy leaf / chitin / mucus],
natural colors [COLOR NOTES], accurate anatomy, fine surface detail.
Seamless flat deep navy background #0B0F1C with a faint radial glow #161D33.
Aspect ratio [4:3 / 1:1 / 16:9]. No text, no labels, no arrows, no numbers, no watermark.
```
## Evitar
- Cara de desenho: contorno grosso, cor chapada, formas de elipse, estilo vetorial ou infantil.
- Neon, brilho de videogame, gradiente roxo-rosa, fantasia, ficção científica.
- Texto ilegível, letras falsas, setas, legendas, números ou setas de IA.
- Fundo com cenário, mesa, gradiente forte, bokeh ou vinheta. Sangue gráfico ou gore.
- Anatomia inventada: dedos, patas, cavidades ou vasos errados. Conferir com a lista de partes do módulo.
## Entrega
- Formato WebP, qualidade 85 a 90, lado maior até cerca de 1600 px (2x para telas retina só se for necessário). Peso alvo abaixo de 250 KB.
- Nome: `modulo-assunto-tema.webp` (ex.: `anatomia-circulatorio-coracao.webp`), em `site/img/ia/`.
- Camadas separadas quando a animação pedir: PNG/WebP com alfa, mesmo enquadramento e mesma resolução da imagem base (fundo, objeto, partes móveis como válvula, mosquito, fluxo). Nomear `...-base`, `...-camada-01`.
- Cada figura vem com `.txt` do prompt e semente, e hotspots sugeridos (nome e posição em %).
