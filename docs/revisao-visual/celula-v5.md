# Revisão visual: Célula 3D, versão 5

Autor: Apolo (direção de arte). Para: Aurelius (engenharia), artista de materiais, professor de biologia e PM.
Base: `docs/GUIA-DE-ESTILO.md` (Campo escuro) e as 22 capturas em `/mnt/project-files/prints/3d/` (20 de computador em 1280 × 860 e 2 de celular em 390 de largura).

Ressalvas sobre o que foi avaliado:
- Só imagens paradas. Animação, transição de câmera, foco do teclado e `prefers-reduced-motion` não foram vistos.
- As capturas parecem ter saído com fonte reserva (o título não tem o desenho da Space Grotesk). Pode ser só o ambiente de captura sem acesso ao Google Fonts. Vale conferir num aparelho real antes de julgar a tipografia.
- `site/celula/fonte/src/d_app.js` estava sendo editado enquanto eu lia (o teto de rótulos mudou de 5/8 para 6/12 entre duas leituras). Os nomes de classe abaixo são os de `site/celula/index.html` naquele momento.

---

## 1. Nota geral e acertos

**Nota de aderência ao guia: 7,5 de 10.**
A interface está em cerca de 9: tokens, caixa normal, tamanhos mínimos, raios, vidro fosco e ordem da barra seguem o guia. O 3D está em cerca de 6,5: a luz e a ideia de material estão certas, mas várias organelas saem lavadas ou estouradas, e o enquadramento não respeita a área livre do palco.

**Os 3 maiores acertos**

1. **A interface ficou quieta e a cor ficou com a ciência.** Abas com nome completo e traço âmbar, seletor de tipos sem âmbar, pastilhas escuras com ponto da família, cartão de ampliação com número arredondado ("cerca de 9.500 vezes", "4,9 milhões"). Nada compete com a célula.
2. **Núcleo, mitocôndria e células do sangue são a referência de material.** Corte com face mais escura na mitocôndria, envelope com poros e cromatina no núcleo, hemácias foscas com relevo e cor real. É este o nível que as outras organelas precisam alcançar.
3. **A paleta por família funciona na célula inteira.** Na célula animal, violeta, azul, ouro, laranja-avermelhado e turquesa se separam de primeira, e o brilho de borda rosa faz a membrana parecer membrana.

---

## 2. Ajustes, em ordem de prioridade

| # | Tela | Problema | Correção | Prioridade |
|---|---|---|---|---|
| 1 | Todas no computador; pior em `re`, `membrana`, `citoesqueleto`, `centriolo`, `sangue`, `vegetal` | O cartão de ampliação mede cerca de 412 × 131 px. É o maior elemento sobre o palco e o modelo passa por trás dele em 6 telas. A linha de dados usa ponto e vírgula ("2 µm; vista de 34 µm"), e a explicação de µm se repete em toda tela (o guia pede só na primeira vez). | Largura máxima de 280 px, `padding` 12 px, título 15 px. Barra de escala em cima e o texto embaixo, alinhados à direita. "Vista de 34 µm" vira linha própria, sem ponto e vírgula. A explicação de µm ou nm aparece só na primeira visita (guardar em `sessionStorage`) e depois mora na linha "Tamanho" do painel. CSS no bloco A; o texto e a regra de primeira vez são 2 linhas de JS em `updMag`. | Alta |
| 2 | Todas no computador | O palco tem 72svh e começa a 262 px do topo: em 1280 × 860 ele termina em 881 px. A barra de ferramentas fica cortada na dobra. | Altura do palco `clamp(460px, calc(100svh - 286px), 820px)` a partir de 700 px de largura (262 px de cabeçalho mais 24 px de respiro). CSS no bloco B. | Alta |
| 3 | `fago`, `vacuolo`, `centriolo`, `membrana`, `esperma`, `neuronio` | O ajuste de câmera (`fitK`) só olha a proporção do palco, não a forma do modelo. Modelos altos passam por baixo da barra (fibras do fago, parede no vacúolo, microtúbulos do centríolo). O espermatozoide ocupa 85% da largura com a cabeça em 140 px e 70% do palco vazio. O neurônio fica na metade de cima, com 180 px vazios embaixo. | Enquadrar pela caixa do modelo dentro da área livre: da esquerda 16 px à direita 16 px, do topo 64 px até a barra (`H - BAR()`). Regra: o modelo ocupa 70% do menor lado da área livre e nunca mais de 85% do maior. Centralizar a caixa nessa área. Modelos compridos (espermatozoide, neurônio, bactéria com flagelo): vista inicial com o eixo longo girado 20 a 25° em relação à tela e a cabeça ou o corpo mais perto da câmera. Centríolo: cortar os microtúbulos soltos em 1,5 vez o comprimento do cilindro, para não saírem do quadro. | Alta |
| 4 | `golgi`, `cloroplasto`, `centriolo`, `re`, `lisossomo`, `peroxissomo`, `vacuolo` | Cor lavada ou estourada, longe do token. Golgi sai creme quase branco (confunde com ribossomo); deveria ser `--sci-golgi` `#F7C13B`. Os grana saem cinza com reflexo cônico de metal; deveriam ser `--sci-grana` `#2A9450`, foscos. O grão de amido estoura no branco. Centríolo é branco chapado, sem volume. RE liso sai quase branco e passa por citoesqueleto. Lisossomo e peroxissomo saem menta em vez de `--sci-lisossomo` `#2FCFBF`. Fibras da parede no vacúolo saem creme em vez de `--sci-parede` `#A9C54A`. | Cor base do material igual ao token da família. Rugosidade 0,65, metalicidade 0, sem `clearcoat` nem anisotropia. Brilho de borda na cor da família (não branco), intensidade até 0,35. Exposição 0,90 a 0,95. Critério de aceite: o meio-tom renderizado fica a no máximo 10 pontos de luminosidade (HSL) do token. Centríolo: `--sci-citoesqueleto` `#CFE0FF` com sombra de oclusão entre as trincas (ou a face interna 20% mais escura). Amido: `#F2EAD8`, sem emissivo. RE liso: mesmo `--sci-reticulo` `#4B7BFF` das lâminas, 10% mais claro. | Alta |
| 5 | `mitocondria`, `mobile-mitocondria`, e em menor grau `cloroplasto` | Oito pastilhas sobre um modelo de 700 × 220 px cobrem cerca de 40% da organela mais cobrada no ENEM. No celular, as duas pastilhas ficam bem em cima do corte. Não há linha-guia (o guia pede 1 px branca a 60%). | No detalhe, a pastilha vai para fora da silhueta: duas fileiras, uma acima e uma abaixo do modelo, a 24 px da borda dele, ligadas ao ponto por linha-guia de 1 px `rgba(255,255,255,.6)`. Teto do guia: 8 no computador e 5 no celular (o código estava em 12 e 6). No celular, no detalhe, 3. Enquanto a fileira externa não existe, o bloco D desenha a linha curta entre o ponto e a pastilha. | Alta |
| 6 | Todos os detalhes, menos `mitocondria` | Rótulos de detalhe em minúscula ("poro nuclear", "cisternas"), enquanto mitocôndria e célula inteira usam inicial maiúscula. Vários passam de 3 palavras: "bomba de prótons (deixa o interior ácido)", "parede celular (fibras de celulose cruzadas)", "RNA transportador (traz aminoácidos)", "cristal de enzima (urato oxidase)". | Inicial maiúscula em todos (bloco C resolve já, sem mexer nos dados). Encurtar para até 3 palavras e levar a explicação entre parênteses para o painel: "Bomba de prótons", "Parede celular", "RNA transportador", "RNA mensageiro", "Cristal de enzima", "Vacúolo central", "Tonoplasto", "Aquaporina", "Microtúbulo", "Cinesina", "Face cis", "Face trans", "Granum", "Estroma", "Tilacoide". O professor confirma os nomes. | Média |
| 7 | `membrana`, `golgi` | Na membrana, "glicoproteína (crachá da célula)" sai cortada pela borda de cima do palco. No Golgi, o ponto de "vesícula" está solto no vazio, ao lado do cartão, longe de qualquer vesícula. | Pastilha nunca a menos de 16 px da borda do palco (hoje a folga é 4 px em `free`). Incluir a etiqueta do canto (`#tag`) e o botão Voltar na lista de áreas bloqueadas, como já se faz com o cartão. Se a âncora sai do quadro, esconder ponto e pastilha juntos. Golgi: prender a âncora de "Vesícula" a uma vesícula parada, encostada na face trans. | Média |
| 8 | `animal`, `neuronio`, `vegetal`, `mobile-animal` | Pontos sem nome (membrana e centríolos na animal, mitocôndria no neurônio, membrana e citoesqueleto na vegetal) têm o mesmo peso dos nomeados e parecem erro. Pontos de ribossomo e Golgi se encostam. No celular, 9 pontos de 22 px em 300 px de célula se sobrepõem, e os 3 nomes mostrados são Núcleo, Centríolos e Citoesqueleto, deixando Mitocôndria de fora. | Ponto cujo nome está escondido encolhe para 16 px de desenho, com aro a 70% (a área de toque continua 44 px, e o nome aparece ao passar o mouse, focar ou tocar). É uma exceção nova ao guia, que eu acrescento na seção 4. CSS no bloco E. Ordem de prioridade dos nomes: Núcleo, Mitocôndria, Retículo, Golgi, Membrana, Lisossomo, Cloroplasto, Vacúolo, e só depois Ribossomo, Peroxissomo, Citoesqueleto, Centríolos. Âncoras a pelo menos 28 px uma da outra na vista inicial: levar a do ribossomo para um grupo no lado esquerdo de baixo e a da mitocôndria do neurônio para fora do núcleo. | Média |
| 9 | `vegetal`, `bacteria`, `neuronio`, `levedura` | O "recheio" sai cinza-oliva (vegetal), cinza chapado (bactéria) e marrom (corpo do neurônio); o guia pede ameixa escuro translúcido. A parede da levedura sai ocre, mas o ponto dela é lima-oliva. Os pili da bactéria são linhas brancas de 1 px e parecem linhas-guia de rótulo. Dendritos e axônio usam creme, que é a cor dos ribossomos. | Citoplasma `--sci-citoplasma` `#2A1E3D` com opacidade 0,35 a 0,45 em todas as células; face de corte um tom mais escura. Parede da levedura em `--sci-parede` `#A9C54A`, igual à vegetal e à bacteriana; broto na mesma cor, com opacidade 0,5. Pili como tubos de 3 px na tela, em `--sci-citoesqueleto` `#CFE0FF`. Neurônio: corpo, dendritos e axônio em `--sci-membrana` `#F06AAE` a 60% de saturação; a mielina fica com o rosa cheio. | Média |
| 10 | `membrana` | Parede de cabeças rosa saturadas de ponta a ponta (900 px). As proteínas somem no meio, e o trecho passa por trás do cartão. A proteína violeta usa a cor da família do núcleo. | Trecho menor (cerca de 14 × 10 lipídios), dentro da regra do item 3. Cabeças em `--sci-membrana` com 70% da saturação e caudas 15% mais escuras, para as proteínas saltarem. Proteínas em creme `--sci-ribossomo` `#FFE1A6` (a família "proteínas soltas"), com o canal num tom 15% mais escuro. Colesterol continua ouro. | Média |
| 11 | Todas no computador | O seletor de tipos não cabe em 1280 px: o oitavo ("Bacteriófago (vírus)") aparece cortado como "Bacte". | Nomes curtos só no trilho: "Vegetal", "Animal", "Bactéria", "Neurônio", "Espermatozoide", "Levedura", "Sangue", "Vírus" (o título da página já diz "célula"; o nome completo continua na etiqueta do palco e no `aria-label`). Enquanto isso, o bloco F aperta o trilho e faz os 8 caberem a partir de 1280 px. | Média |
| 12 | `mobile-animal`, `mobile-mitocondria`; no computador, todos os detalhes | No celular a célula ocupa cerca de 43% da altura do palco e a mitocôndria cerca de 20%; sobra palco vazio. No computador a etiqueta fica no canto de cima e o Voltar embaixo dela; no celular é o contrário. O guia pede o Voltar sempre no canto superior esquerdo. | Celular: palco em 62svh (mínimo do guia), bloco B. Célula inteira com a câmera 45 a 50° acima, para a elipse ficar mais alta na tela em pé; organela comprida com o eixo longo girado 35° (ganha cerca de 20% de tamanho). Computador: Voltar em `top:16px; left:16px` e a etiqueta logo abaixo, em `top:68px`. Bloco G, que pede uma classe `det` em `#view`. | Baixa |

---

## 3. CSS pronto para colar

Para o Aurelius. Tudo isto vai **no fim do `<style>` de `site/celula/index.html`** (ou do `head.html` em `site/celula/fonte/`), depois das regras atuais. Nada mexe em `site/base.css`. Não apliquei nada: outros agentes estão editando esses arquivos.

Os blocos não mudam a distância entre ponto e pastilha, então a conta de colisão em `layoutLabels` continua valendo. O cartão menor também é seguro: a função lê o tamanho real dele com `getBoundingClientRect`.

### Bloco A. Cartão de ampliação compacto (ajuste 1)

```css
/* A. Cartão de ampliação: no máximo 280 px, barra em cima e texto embaixo */
@media (min-width:700px){
  .mag{min-width:0;max-width:280px;padding:12px}
  .mag b{display:block;font-size:15px;line-height:1.3}
  .mag .sb{flex-direction:column;align-items:flex-end;gap:4px;margin:8px 0}
  .mag .sb em{white-space:normal;text-align:right}
  #magBar{max-width:100%}
  .mag .n{max-width:256px;margin-left:auto}
}
```

Falta em JS (2 linhas em `updMag`): trocar `; vista de` por uma linha própria, `<span class="vw">Vista de 34 µm</span>`, e mostrar `#magU` só na primeira visita. Com isso, acrescentar:

```css
.mag .vw{display:block;color:var(--dim)}
```

### Bloco B. Palco inteiro na primeira dobra (ajustes 2 e 12)

```css
/* B. Palco: cabe na tela junto com a barra de ferramentas */
@media (min-width:700px){
  #view{height:clamp(460px,calc(100svh - 286px),820px)}
}
@media (max-width:699px){
  #view{height:62svh;min-height:400px}
}
```

Se o cabeçalho mudar de altura, o 286 muda junto: é a distância do topo da página ao topo do palco (262 px hoje) mais 24 px de respiro.

### Bloco C. Inicial maiúscula nos rótulos de detalhe (ajuste 6)

```css
/* C. Rótulos de detalhe em caixa normal, com inicial maiúscula */
.dl span::first-letter{text-transform:uppercase}
```

Funciona porque a pastilha é `position:absolute` (vira bloco). Não altera siglas nem o resto do texto.

### Bloco D. Linha-guia entre o ponto e a pastilha (ajuste 5)

```css
/* D. Linha-guia de 1 px, branca a 60%, do ponto até a pastilha (rótulos de detalhe ao lado do ponto) */
.dl:not(.hid):not(.t):not(.b)::after{content:'';position:absolute;top:0;left:4px;width:8px;height:1px;background:rgba(255,255,255,.6)}
.dl.r:not(.hid):not(.t):not(.b)::after{left:auto;right:4px}
```

As classes `.t` e `.b` (pastilha acima ou abaixo do ponto) apareceram no código durante a leitura. Se elas ganharem linha-guia própria, é a mesma regra na vertical: `left:0;width:1px;height:8px`, com `bottom:4px` ou `top:4px`.

### Bloco E. Ponto sem nome fica secundário (ajuste 8)

```css
/* E. Ponto cujo nome está escondido: 16 px de desenho em vez de 22; a área de toque continua 44 px */
.hs.hid button::before{inset:17px;box-shadow:0 0 0 3px rgba(255,255,255,.7),0 2px 6px 2px rgba(0,0,0,.5)}
.hs.hid button:hover::before,
.hs.hid button:focus-visible::before{inset:15px;box-shadow:0 0 0 4px rgba(255,255,255,.94),0 2px 8px 4px rgba(0,0,0,.55)}
```

### Bloco F. Seletor de tipos cabe em 1280 px (ajuste 11)

```css
/* F. Trilho de tipos: os 8 cabem a partir de 1280 px; abaixo disso continua rolando com o esmaecido */
@media (min-width:1280px){
  .types{gap:2px;padding-right:4px;-webkit-mask-image:none;mask-image:none}
  .types>button{padding:8px 10px;gap:6px}
  .types svg{width:20px;height:20px}
}
```

Conta: os 8 nomes somam cerca de 800 px de texto, mais 8 × 46 px de ícone e respiro, mais folgas: cerca de 1190 px, contra 1230 px disponíveis. A folga é pequena (40 px), por isso os nomes curtos do ajuste 11 continuam sendo a correção de verdade.

### Bloco G. Voltar sempre no canto, etiqueta embaixo (ajuste 12)

Pede uma linha de JS em `render`: `viewEl.classList.toggle('det', !cell)`.

```css
/* G. No detalhe: Voltar no canto superior esquerdo, etiqueta logo abaixo */
@media (min-width:700px){
  #back{top:16px}
  #view.det .tag{top:68px}
}
```

---

## 4. O que não é CSS (resumo para dividir o trabalho)

- **Câmera e enquadramento** (ajustes 3 e 12): `Rig` e `fitK` em `d_app.js`.
- **Materiais e cores** (ajustes 4, 9 e 10): biblioteca de materiais e `e_modelos.js`, com o artista.
- **Posição das pastilhas, tetos e prioridade** (ajustes 5, 7 e 8): `layoutLabels` e a ordem das organelas em `data.js`.
- **Textos dos rótulos e nomes curtos** (ajustes 6 e 11): `data.js`, com o professor.

Mudança que vou fazer no guia depois que o ajuste 8 entrar: na seção 4, "Pontos clicáveis no 3D", acrescentar "ponto com o nome escondido: 16 px de desenho, aro a 70%".
