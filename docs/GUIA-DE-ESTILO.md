# Guia de estilo do LAB

Dono: diretor de arte. Vale para todos os módulos (01 DNA, 02 Tabela periódica, 03 Moléculas, 04 Biomoléculas, 05 Célula, 06 Morfofisiologia e os próximos).
Quem implementa: engenheiro. Quem desenha ícones e materiais: artista. Dúvida ou exceção: pedir ao PM.

---

## 1. Estilo estético

### Três caminhos possíveis

**A. Painel de controle (o que o site é hoje).** Fonte de código (JetBrains Mono) em todo o texto, rótulos em CAIXA ALTA espaçada, brilhos âmbar, ponto vermelho piscando "ao vivo", setas em todo link. Tem personalidade, mas parece tela de nave ou de hacker. O texto fica pequeno (9,5 a 10,5 px) e cansa quem vai ler uma explicação inteira. A interface compete com a célula pelo olhar.

**B. Campo escuro (recomendado).** Inspirado na microscopia de campo escuro: fundo azul-noite profundo, e a peça 3D iluminada no centro, como uma amostra sob a lente. A cor mora na ciência (organelas, átomos, bases do DNA). A interface fica neutra e quieta: grafite, branco suave, vidro fosco discreto, e um âmbar só para dizer "isto está escolhido". Texto de leitura numa fonte feita para ser legível, em caixa normal. A fonte de código fica só para números, unidades e sequências.

**C. Livro didático claro.** Fundo branco, ilustrações chapadas, muito legível e fácil de imprimir. Só que o 3D realista (membranas translúcidas, relevo, brilho de borda) perde quase toda a força num fundo claro, e o site inteiro mudaria de cara.

### Por que o Campo escuro

- **Combina com ciência de verdade.** Imagens de microscopia de fluorescência e de campo escuro são assim: estruturas coloridas brilhando sobre o escuro. O aluno reconhece o visual de "imagem de laboratório", não de videogame.
- **Valoriza o 3D realista.** Translucidez, brilho de borda e sombras suaves só aparecem bem sobre fundo escuro. É o mesmo gosto da referência que a Nalu escolheu: a célula grande no centro e todo o resto discreto em volta.
- **Ajuda a estudar para o ENEM.** Como a cor é reservada para a ciência, ela passa a ensinar: núcleo é sempre violeta, mitocôndria é sempre laranja-avermelhado, em todos os módulos. O aluno associa a cor à função, e a interface quieta deixa a atenção no conteúdo. Texto maior, em caixa normal e numa fonte legível, rende mais em sessões longas de estudo.
- **Conversa com adolescentes sem ser infantil.** É bonito e "de verdade", sem mascote nem cores de jardim de infância.
- **Aproveita o que já existe.** O fundo azul-noite, o âmbar e a fonte de títulos continuam. O que muda é a disciplina: menos efeito, mais leitura.

### O que manter e o que mudar no site atual

| Manter | Mudar |
|---|---|
| Fundo azul-noite e o degradê radial suave atrás do conteúdo | Texto corrido em JetBrains Mono: passa para Atkinson Hyperlegible Next |
| Âmbar como cor da marca e da seleção | Âmbar em brilho (`box-shadow` de neon) nos cartões e chips: sai |
| Space Grotesk nos títulos | Tamanhos de 9,5 a 10,5 px: o mínimo passa a 12 px, e o texto corrido a 15 ou 16 px |
| Barra de escala, cartão "ampliado", aviso "ilustração, cores adicionadas" | Rótulos em CAIXA ALTA espaçada em todo canto: só siglas (DNA, ATP, ENEM) ficam em maiúsculas |
| Barra de ferramentas flutuante no 3D | Separadores com ponto "Módulo 05 · Biologia celular · Pasta…": viram dois elementos (um texto pequeno e um selo), ou uma frase |
| Prévias 3D animadas nos cartões da página inicial | Setas "ABRIR →" em todo link: o cartão inteiro é clicável e não precisa de seta. A seta fica só no botão Voltar |
| | Faixa âmbar na borda esquerda (`.head`, `.hero`): sai |
| | Ponto vermelho piscando "ao vivo": sai (nada ali é ao vivo) |
| | Cartões todos iguais na página inicial: um módulo em destaque maior, os outros menores |
| | Abas de navegação "LAB DNA TABELA BIO": nomes completos em caixa normal e com ícone |

---

## 2. Paleta

### 2.1 Interface (versão escura, a principal)

Nomes de token próximos dos atuais, para facilitar a troca.

| Token | Nome | Hex | Papel |
|---|---|---|---|
| `--bg` | Noite | `#0B0F1C` | Fundo da página |
| `--panel` | Lâmina | `#131A2B` | Cartões, painel de informação, barra de abas |
| `--panel-2` | Lâmina alta | `#1B2440` | Hover, aba ativa, item selecionado, campo de busca |
| `--line` | Borda | `#2C3757` | Divisórias e contorno decorativo de cartão |
| `--line-strong` | Borda forte | `#5B6C99` | Contorno de botão e campo (precisa de 3:1) |
| `--txt` | Texto | `#E8EDF7` | Texto principal e títulos |
| `--dim` | Texto suave | `#9DA9C4` | Legendas, notas, rótulos secundários |
| `--amber` | Âmbar | `#FFB347` | Marca e seleção: aba atual, botão principal, item ativo. Nunca como enfeite |
| `--focus` | Gelo | `#8FD8FF` | Anel de foco do teclado, e só isso |
| `--red` | Alerta | `#FF6B7D` | Erro, mutação, aviso. Nunca decorativo |

Saem: `--violet` (o violeta agora é do núcleo, na paleta científica) e `--ice` (substituído por `--txt` e `--focus`). O `--dim` atual (`#6b7899`) não passa no contraste e deve ser trocado.

Fundo do palco 3D: degradê radial de `#161D33` no centro para `#0B0F1C` nas bordas. Sem estrelas, partículas ou grade atrás do modelo.

**Versão clara (opcional, para projetor e impressão):** fundo `#F6F7FA`, painel `#FFFFFF`, borda `#D5DAE6`, borda forte `#8792AE`, texto `#141A2B`, texto suave `#4F5A75`, âmbar escurecido para `#A65F00` (texto e borda), foco `#0B6FB8`. O 3D continua sobre o palco escuro mesmo na versão clara.

### 2.2 Regra de contraste (WCAG AA)

- Texto normal: pelo menos **4,5:1** contra o fundo onde está. Texto grande (24 px, ou 19 px em negrito): pelo menos **3:1**.
- Contorno de botão, campo e anel de foco: pelo menos **3:1** contra o fundo vizinho.
- Medido para esta paleta (sobre `--bg` / `--panel`): texto 16,3 / 14,8; texto suave 8,1 / 7,4; âmbar 10,7 / 9,7; gelo 12,2 / 11,1; alerta 7,0 / 6,3; borda forte 3,7 / 3,3. Tudo passa.
- Texto escuro sobre botão âmbar: use `#1A1206` (10,4:1).
- Texto por cima do 3D (rótulos, cartão de ampliação) fica sempre sobre uma pastilha escura (`rgba(11,15,28,.82)` com desfoque), nunca solto sobre a imagem.
- Cor nunca é a única pista: todo ponto colorido vem com nome escrito ao lado.

### 2.3 Paleta científica (ilustração e 3D)

A mesma família de estrutura tem a mesma cor em todos os módulos. A cor é **inventada para ensinar** (organelas não têm cor de verdade), e o site diz isso sempre. As cores foram espalhadas pelo círculo cromático para que vizinhas não se confundam. Quando duas famílias ficam próximas (vacúolo e lisossomo, por exemplo), o tamanho e a forma as separam.

| Família | Estruturas | Cor base | Hex |
|---|---|---|---|
| Informação genética | núcleo, cromatina, nucleoide, plasmídeo, DNA dentro da célula | Violeta | `#9A6BFF` (nucléolo e partes densas: `#6A45D8`) |
| Membranas | membrana plasmática, envelope nuclear, bicamada lipídica, bainha de mielina | Rosa | `#F06AAE` |
| Envoltórios rígidos | parede de celulose, peptidoglicano, parede de levedura | Lima-oliva | `#A9C54A` |
| Energia | mitocôndria, cristas, ATP sintase | Laranja-avermelhado | `#F25C3B` |
| Fotossíntese | cloroplasto, tilacoides, clorofila | Verde | `#3FBF6A` (grana: `#2A9450`) |
| Síntese de proteínas | retículo endoplasmático | Azul | `#4B7BFF` |
| Empacotamento | complexo de Golgi, vesículas de secreção | Amarelo-ouro | `#F7C13B` |
| Ribossomos e proteínas soltas | ribossomos, grânulos | Creme | `#FFE1A6` (pontos pequenos) |
| Digestão e defesa química | lisossomos, peroxissomos | Turquesa | `#2FCFBF` |
| Água e reserva | vacúolo central, vacúolo de levedura | Azul-água | `#2A9FC9`, sempre translúcido |
| Sustentação e movimento | citoesqueleto, centríolos, flagelo, cílios, pili | Azul-gelo | `#CFE0FF` (linhas finas) |
| Citoplasma | o "recheio" da célula | Ameixa escuro | `#2A1E3D` translúcido |

Exceções com cor real, porque a cor é parte do conteúdo: hemácia `#D7303B` (hemoglobina), clorofila nas folhas, sangue. Vírus (capsídeo) usa cinza-prata `#B9C2D3`, para não parecer célula.

Moléculas e átomos seguem a convenção CPK, que é a dos livros: C cinza `#9AA3B2`, H branco `#F2F4F8`, O vermelho `#FF4D4D`, N azul `#4D7DFF`, S amarelo `#F2D24B`, P laranja `#FF9A3C`. Bases do DNA mantêm as cores do módulo 01 (A verde `#39E58C`, T vermelho `#FF4F6D`, G amarelo `#FFC53D`, C azul `#3FA9FF`, U violeta `#C77DFF`), sempre com a letra escrita.

Implementação: virar tokens `--sci-nucleo`, `--sci-membrana` e assim por diante, num só arquivo de dados compartilhado, em vez dos cerca de 37 hex soltos que o módulo Célula usa hoje.

---

## 3. Tipografia

### Famílias (Google Fonts)

| Família | Papel |
|---|---|
| **Space Grotesk** 500, 600, 700 | Títulos, nome do módulo, nome da organela no painel, números grandes |
| **Atkinson Hyperlegible Next** 400, 600, 700 | Todo o texto de leitura e da interface: parágrafos, botões, abas, rótulos, legendas. Foi desenhada para baixa visão e separa bem I, l e 1, o e 0 |
| **JetBrains Mono** 500 | Só dados: valores com unidade na tabela de dados, barra de escala, ampliação, sequências de DNA, fórmulas, configuração eletrônica |

Link único:
`https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:wght@400;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@500&display=swap`

Use `font-variant-numeric: tabular-nums` em tabelas de números.

### Escala

| Papel | Computador | Celular | Família e peso | Entrelinha |
|---|---|---|---|---|
| Título de capa (página inicial) | 48 px | 34 px | Space Grotesk 700, `letter-spacing:-0.01em` | 1,05 |
| Título do módulo (h1) | 32 px | 26 px | Space Grotesk 700 | 1,1 |
| Título do painel, nome da organela (h2) | 24 px | 21 px | Space Grotesk 600 | 1,2 |
| Título de cartão, subtítulo (h3) | 18 px | 17 px | Space Grotesk 600 | 1,3 |
| Texto corrido | 16 px | 15 px | Atkinson 400; destaque em 700 | 1,6 |
| Interface (botões, abas, lista) | 14 px | 14 px | Atkinson 600 | 1,3 |
| Legenda e nota | 13 px | 12,5 px | Atkinson 400 | 1,5 |
| Dados | 13 px | 12 px | JetBrains Mono 500 | 1,4 |

Regras:
- **Nada abaixo de 12 px**, nem no celular, nem em rótulo do 3D.
- Caixa normal em tudo. Maiúsculas só em siglas e símbolos (DNA, RNA, ATP, ENEM, pH). Espaçamento extra entre letras só no título de capa, e negativo.
- Comprimento de linha: **55 a 72 caracteres** no texto corrido (`max-width: 68ch`); legendas até 50 caracteres. No celular a coluna inteira serve.
- No máximo três tamanhos diferentes numa mesma tela, fora os títulos.
- Número e unidade sempre juntos, com espaço que não quebra: `10&nbsp;µm`. Vírgula decimal: `0,5 µm`.

---

## 4. Layout e componentes

### Grade e espaço

- Escala de espaço (múltiplos de 4): **4, 8, 12, 16, 24, 32, 48, 64 px**. Nada fora dela.
- Largura máxima: 1320 px em módulos com 3D; 1100 px na página inicial e em módulos de leitura.
- Computador (a partir de 1100 px): palco 3D com 8 colunas de 12, painel de informação com 4 colunas ao lado, espaço entre colunas de 24 px.
- Tablet (700 a 1099 px): palco em largura total, painel e lista lado a lado embaixo.
- Celular (até 699 px): uma coluna, margem lateral de 16 px, sem rolagem horizontal da página (só listas de chips podem rolar de lado, com indicação visual de que há mais).
- Entre seções: 32 px. Dentro de cartão: 16 px (24 px no computador).

### Raios de borda (hierarquia)

| Raio | Onde |
|---|---|
| 4 px | Selos pequenos, células da tabela periódica, teclas |
| 8 px | Botões, campos, chips, itens de lista |
| 12 px | Cartões, painel de informação, barra de ferramentas, cartão de ampliação |
| 20 px | Palco 3D (a "janela" principal) |
| 999 px | Só pastilhas de rótulo no 3D e pontos clicáveis |

Regra: o que está dentro tem raio menor do que o que está fora.

### Profundidade

Nada de sombra cinza igual em todos os cartões. Três níveis:
1. Plano (cartões na página): fundo `--panel` e borda `--line`, sem sombra.
2. Flutuante sobre o 3D (barra de ferramentas, cartão de ampliação, rótulos): `rgba(19,26,43,.78)`, `backdrop-filter: blur(10px)`, borda `rgba(255,255,255,.08)`, sombra `0 8px 24px rgba(0,0,0,.45)`.
3. Sobreposição (folha do celular, caixa de diálogo): igual ao nível 2, com fundo escurecido atrás.

### Componentes

**Botão principal**: fundo âmbar, texto `#1A1206`, Atkinson 600 14 px, altura 44 px, raio 8. Um por tela, no máximo.
**Botão secundário**: fundo `--panel`, borda `--line-strong`, texto `--txt`.
**Botão de ícone**: 44 × 44 px de área de toque, ícone de 20 px, com `aria-label` e dica (`title`).

**Abas de navegação entre módulos**: ícone de 20 px + nome completo ("Início", "DNA", "Tabela periódica", "Moléculas", "Biomoléculas", "Célula"). Aba atual: fundo `--panel-2`, texto `--txt` e um traço âmbar de 2 px embaixo. As outras: texto `--dim`. No celular: rolagem lateral com o nome curto, e a aba atual sempre visível.

**Abas de tipo (seletor de célula, de molécula)**: um trilho `--panel` com raio 12, e cada opção com miniatura e nome. Ativa: fundo `--panel-2`, texto branco, contorno interno de 1 px `rgba(255,255,255,.08)`. Não use âmbar aqui, para não haver dois âmbares competindo com a aba do módulo.

**Cartões**: o cartão inteiro é o link. Hover: borda `--line-strong` e fundo `--panel-2`, em 150 ms. Sem brilho, sem seta. Na página inicial, o módulo mais novo ou em destaque ocupa duas colunas.

**Painel de informação** (o "inspetor" da organela), nesta ordem:
1. Família (selo pequeno com o ponto de cor, caixa normal: "Energia").
2. Nome (h2).
3. Uma frase-resumo em negrito: o que faz.
4. Explicação curta (até 3 parágrafos de 2 a 3 linhas).
5. Tabela de dados (tamanho, quantidade), com o valor em JetBrains Mono.
6. Caixa "No ENEM": o que costuma cair e com qual tema se liga (texto do professor).
7. Links para outros módulos, como botões secundários.

**Barra de ferramentas do 3D**: flutuante, centrada embaixo, a 16 px da borda. Ordem fixa em todos os módulos: Nomes, Afastar, Aproximar, Voltar à vista inicial, Pausar, Passeio guiado. No celular só os ícones, e os nomes vão na dica e no `aria-label`.

**Cartão de ampliação** (canto superior direito do palco): ampliação arredondada a 2 algarismos ("cerca de 480 vezes", nunca "×413.070"), barra de escala com número redondo, largura da vista e a nota "Ilustração com cores adicionadas". No celular: só a barra de escala e a ampliação.

**Pontos clicáveis no 3D**: 22 px de desenho e 44 px de área de toque. Miolo com a cor da família, aro branco.

### Estados (todos os controles)

| Estado | Como fica |
|---|---|
| Normal | Conforme o componente |
| Hover | Fundo um passo mais claro (`--panel` para `--panel-2`) ou borda `--line-strong`. 150 ms |
| Foco visível | `outline: 2px solid var(--focus); outline-offset: 2px`. Obrigatório em todo botão, aba, link, ponto do 3D e item da lista. Nunca `outline:none` sem um substituto |
| Ativo ou selecionado | Âmbar: texto, ou borda, ou traço de 2 px. Também `aria-pressed` ou `aria-current` |
| Pressionado | Fundo 4% mais escuro, sem mudar de tamanho |
| Desabilitado | Opacidade 0,45, cursor padrão, sem hover, e o motivo na dica ("Disponível só na célula vegetal") |
| Carregando | Silhueta cinza do modelo e a frase "Carregando a célula…"; nada de rodinha infinita sem texto |

### Celular

- Palco 3D com 62 a 70% da altura da tela (`svh`), painel embaixo.
- Ao tocar numa organela, o nome aparece numa faixa fixa no pé do palco, e o painel rola até a explicação.
- Gestos: um dedo gira, dois dedos aproximam. A rolagem da página precisa funcionar fora do palco.
- Rótulos do 3D: no máximo 5 ao mesmo tempo no celular (8 no computador).

---

## 5. 3D e ilustração

### Luz
- Mesmo esquema em todos os módulos, para que tudo pareça do mesmo "laboratório":
  - Luz principal morna (`#FFF4E6`), vindo de cima e da esquerda, a 45°. Intensidade 1.
  - Luz de preenchimento fria (`#CFE0FF`), da direita, a 30% da principal.
  - Luz de contorno (por trás), branca, que desenha a borda e separa o modelo do fundo.
  - Ambiente suave (`RoomEnvironment` ou HDRI neutro feito por nós) em intensidade baixa, para dar reflexo sem espelhar.
- Tone mapping ACES Filmic ou AgX, exposição perto de 1. Saída em sRGB.

### Materiais
- **Membranas**: translúcidas (`MeshPhysicalMaterial`, `transmission` 0,3 a 0,6 ou opacidade 0,35 a 0,55), rugosidade 0,45, e um brilho de borda (efeito Fresnel) na cor da família. É o brilho de borda que faz a membrana parecer membrana.
- **Organelas**: foscas, com aparência de cera ou argila (rugosidade 0,55 a 0,75, metalicidade 0), e relevo sutil por mapa de normal ou ruído. Nada de plástico brilhante.
- **Interior em corte**: a face cortada fica um tom mais escuro e plano, para o aluno entender que é um corte.
- **Brilho (emissivo)**: só para seleção e para coisas que de fato emitem (nenhuma organela emite). Organela selecionada: halo branco suave. As outras perdem 40% de saturação enquanto uma está selecionada.
- Sombra de contato suave embaixo do modelo, se o desempenho permitir.

### Fundo e câmera
- Fundo: o degradê do palco (seção 2.1), uma vinheta leve e nada mais.
- Campo de visão de 30 a 35° (pouca distorção). Vista inicial em três quartos, 20 a 30° acima, com o modelo ocupando cerca de 70% do menor lado do palco.
- Órbita com amortecimento; limites de aproximação para nunca atravessar o modelo nem perdê-lo de vista.
- Ir até uma organela: transição de 600 a 800 ms, com desaceleração no fim. O botão "Voltar à vista inicial" sempre funciona.

### Escala
- Barra de escala sempre visível, com número redondo (1, 2, 5, 10, 20, 50, 100) e unidade (nm, µm, mm).
- Primeira vez que aparece µm ou nm: explicar em comparação ("1 µm é um milésimo de milímetro; uma hemácia tem cerca de 7 µm").
- Quando a vista muda de escala (célula para organela), o cartão de ampliação anima o número e a barra, para o aluno sentir o "mergulho".
- Comparações concretas valem mais do que números grandes: "esta bactéria caberia 30 vezes na largura de um fio de cabelo".

### Rótulos
- Rótulos são HTML por cima do canvas, nunca texto dentro do 3D.
- Pastilha escura (nível 2), Atkinson 600 13 px, com o ponto de cor da família à esquerda. Linha-guia de 1 px branca a 60%.
- Até 3 palavras. O nome completo vai no painel.
- Sem sobreposição: se dois se chocam, mostre o mais importante e esconda o outro até a aproximação.
- Botão "Nomes" liga e desliga todos. Ao abrir o módulo, começam ligados.

### Animação
- Pouca, e sempre com propósito: mostrar um processo (vesícula indo ao Golgi, flagelo girando), dar retorno a um toque ou explicar uma troca de vista.
- Nada se mexe "só para enfeitar": sem partículas flutuando no fundo, sem rotação automática contínua da célula inteira e sem ponto piscando.
- Pulso de convite nos pontos clicáveis: 2 ciclos ao abrir a tela, e para.
- Animações de processo sempre pausáveis (botão Pausar).
- Duração: retorno de interface entre 120 e 200 ms; troca de vista entre 600 e 800 ms; nada acima de 1 s, a não ser processos biológicos.
- **`prefers-reduced-motion: reduce`**: sem pulso, sem rotação, sem animação de processo ao abrir (o aluno pode ligar), troca de câmera por corte com esmaecimento de 150 ms e sem desfoque.

---

## 6. Ícones e assets (para o artista)

### Ícones de interface
- Grade de **24 × 24 px**, área útil de 20 × 20 (2 px de respiro).
- **Traço de 1,75 px**, pontas e cantos arredondados, sem preenchimento. Detalhes pequenos (um ponto, um núcleo) podem ser preenchidos.
- Cor sempre `currentColor`, para herdar o estado do botão.
- Exibidos em 20 px (botões) ou 24 px (abas grandes). Teste a leitura em 16 px.
- Formas simples e geométricas: círculos, cápsulas, linhas. Nada de perspectiva ou sombra no ícone.
- Um conjunto só, desenhado por nós: módulos (DNA, tabela, molécula, biomolécula, célula, morfofisiologia), ações (nomes, aproximar, afastar, voltar à vista, pausar, tocar, passeio, fechar, voltar, informação, ENEM).
- Arquivo: SVG limpo, `viewBox="0 0 24 24"`, sem cores fixas, em `site/assets/icones/`.

### Miniaturas de tipos (célula, molécula)
- Miniatura renderizada do **nosso próprio** modelo 3D, com a mesma luz do palco, fundo transparente, enquadramento de três quartos.
- 40 × 40 px na tela (exportar 80 × 80 e 120 × 120), WebP ou PNG.
- Todas com o mesmo tamanho aparente e a mesma direção de luz.

### Materiais 3D (biblioteca)
- Membrana, organela fosca, vidro (capsídeo, vacúolo), corte, halo de seleção. Cada material recebe a cor da família por parâmetro, nunca uma cor fixa.

### Regras gerais
- Tudo feito pela equipe. Nada copiado da referência ou de outros sites.
- Cada asset novo é registrado em `docs/ASSETS.md`, com origem e licença das fontes.

---

## 7. Texto na interface

- **Fale com o aluno de "você", com frases curtas e diretas.** Ex.: "Toque numa organela para ver de perto."
- **Caixa normal sempre**: "Biologia celular", não "BIOLOGIA CELULAR".
- **Verbos claros nos botões**, dizendo o que acontece: "Mostrar nomes", "Voltar à célula inteira", "Começar o passeio", "Abrir módulo". Evite "OK", "Ir", "Clique aqui".
- **Termo novo em negrito e explicado na mesma frase**: "As **cristas** são dobras da membrana interna que aumentam a área."
- Primeiro o que a estrutura **faz**, depois os detalhes. O aluno do ENEM precisa da função e da relação entre estruturas.
- Analogias são bem-vindas, desde que não enganem ("usina de energia" vem com a ressalva de que a mitocôndria transforma energia, não a cria). O professor revisa.
- Seja honesto sobre o desenho: "Ilustração com cores adicionadas; proporções aproximadas."
- Números à brasileira: `0,5 µm`, `30 trilhões`, `16 569 pares de bases`.
- Sem ponto de exclamação de animação, sem gírias que envelhecem e sem "Incrível!".
- Mensagem de erro diz o que fazer: "Seu navegador não mostrou o 3D. Tente atualizar a página ou abrir no Chrome ou no Firefox."
- Separadores: em vez de "A · B · C", use frase ("Eucarionte, sem parede celular") ou elementos separados.

---

## 8. Aplicar já no módulo Célula (para o engenheiro)

Arquivo: `site/celula/index.html`. Mudanças em `site/base.css` e nas abas comuns afetam todos os módulos: o PM combina antes com a conversa do módulo 06. Até lá, aplique os tokens novos no próprio módulo Célula.

1. **Fontes**: carregar Atkinson Hyperlegible Next e usá-la no corpo e na interface. JetBrains Mono fica só em `.kv` (valores), na barra de escala e na ampliação. Texto `#desc` em 16 px (15 px no celular), com `max-width:68ch`.
2. **Tamanho mínimo de 12 px**: hoje há 9,5 a 10,5 px em `.k`, `.insp .sub`, `.lbl`, `.mag .n`, `.tag small` e `.dl span` no celular.
3. **Contraste**: trocar `--dim` de `#6b7899` para `#9DA9C4`. Criar `--panel-2`, `--line-strong` e `--focus`.
4. **Caixa alta e espaçamento**: tirar `text-transform:uppercase` e `letter-spacing` de `.tabs a`, `.tag`, `.insp .sub`, `.lbl` e `.orgs button.all`. Abas com nomes completos em caixa normal.
5. **Cabeçalho**: "MÓDULO 05 · BIOLOGIA CELULAR" vira "Módulo 5" (texto pequeno) mais o selo "Biologia celular". Trocar a bolha violeta `.top .ic` pelo ícone do módulo, de traço.
6. **Paleta científica**: substituir os cerca de 37 hex soltos em `ORG` (campo `c`) por tokens por família (seção 2.3). Núcleo e nucleoide violeta, membranas rosa, paredes lima-oliva, mitocôndria laranja-avermelhado, e assim por diante.
7. **Foco visível** em `.types button`, `.tool button`, `.orgs button`, `.links` e `#back` (hoje só os pontos do 3D têm).
8. **Áreas de toque**: botões da barra de ferramentas de 38 para 44 px; pontos clicáveis com 44 px de área (o desenho continua com 22 px).
9. **Animação**: o pulso `ping` para depois de 2 ciclos, e não em loop infinito. A transição `fadein` perde o `blur` e passa para 250 ms.
10. **Cartão de ampliação**: arredondar a ampliação ("cerca de 480 vezes") e escrever "Ilustração com cores adicionadas" com inicial maiúscula.
11. **Botão voltar**: "← Célula inteira" vira ícone de seta para a esquerda (chevron) + "Voltar à célula inteira", sempre no mesmo lugar (canto superior esquerdo do palco).
12. **Materiais 3D**: membranas translúcidas com brilho de borda, organelas foscas com relevo, as não selecionadas dessaturadas quando há seleção, e as três luzes da seção 5.
13. **Painel**: adicionar o espaço "No ENEM" (texto vem da revisão do professor) e a frase-resumo em negrito antes da explicação.

## 9. Padrão de animação aprovado (Nalu, 15/11/2026)

A Nalu aprovou o piloto (coração, moluscos, sangue e cadeia respiratória) e pediu este estilo em TODAS as animações do site. Nada de desenho chapado, de elipse com contorno ou de cara de cartum.

- **Figuras realistas por IA** para órgãos, organismos, células e cenas: ilustração médica 3D, luz de estúdio suave, fundo azul-noite `#0B0F1C`, sem texto na imagem. As regras estão em `docs/visual/padrao-figuras-ia.md`.
  - Geração: conta Higgsfield da Nalu, conectada no Claude, com o modelo GPT Image 2.6 em qualidade média (0,5 crédito por imagem no plano Plus; o piloto usou Nano Banana 2). Antes de gerar, sempre mostrar o custo e pedir o ok.
  - Entrega: `site/img/ia/NOME.webp` e `NOME.js`, este com data URI em `window.LAB_IMG`. O `.js` é obrigatório, porque o site abre por file://.
- **Motion graphics** para processos (cadeias, ciclos, fluxos): volume, luz, partículas, coreografia por etapas. Tokens e regras em `docs/visual/padrao-motion.md`.
- **Pontos clicáveis (hotspots)** sobre a figura: pulso suave e rótulo com título e uma frase, ao passar o mouse, tocar ou focar pelo teclado; Esc fecha.
- **Interação**: o aluno pode dar zoom, mudar o ângulo e ver as estruturas em detalhe.
  - Moléculas e estruturas viram 3D em código, com girar, zoom, botões de ângulo e toque para ver o detalhe (`site/biologia-molecular/mol3d.js`, uso em `docs/visual/mol3d-uso.md`).
  - Figuras de IA têm zoom e lupa de detalhe, e 2 vistas quando o ângulo importa.
- **Sempre**: prefers-reduced-motion, foco visível, nada pisca mais de 3 vezes por segundo, 60 fps (só transform e opacity).
- **Ordem**: tópico por tópico da ementa, começando pelo 1 (Biologia molecular). Só avança para o próximo com a autorização da Nalu.
- Referências dela, só para olhar e nunca copiar: o coração 3D com pontos clicáveis e os vídeos da cliptalk.pro (robot head visualizer e "distilbook: from PDF to explainer").
