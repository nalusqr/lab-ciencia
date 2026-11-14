# Revisão · Módulo 02 · Tabela periódica

Arquivos revisados: `site/tabela-periodica/index.html`, `comum.js`, `elemento.js` (gera as 118 fichas), `dados.js`.
Os dados de `dados.js` saem de `scripts/gen_data.py`. Toda mudança em `dados.js` precisa ser feita também no gerador, senão some quando ele rodar de novo.

Este módulo é de **química**. Revisei o que toca a química básica do ensino médio e o que tem ligação com a biologia. Os pontos marcados **[química]** precisam de confirmação de um especialista de química, e os marcados **[física]** de um de física.

---

## 1. Erros (por gravidade)

### E1 · Segurança: "césio derrete na mão" (alta)
- **Onde:** `site/tabela-periodica/index.html`, objeto `MODES`, modo `fase`.
- **Trecho:** `Gálio (fusão 29,8 °C) e césio (28,4 °C) derretem na mão.`
- **Problema:** o césio reage de forma explosiva com a água, inclusive com a umidade da pele. Um aluno não pode sair do site achando que pode segurá-lo.
- **Texto proposto:** `Gálio (fusão 29,8 °C) derrete na palma da mão. O césio (28,4 °C) também derreteria, mas nunca se toca nele: reage de forma explosiva com a água, até com o suor da pele.`

### E2 · O "isótopo mais comum" mostrado está errado para 31 elementos (alta)
- **Onde:** `site/tabela-periodica/elemento.js`
  - `Contagem real para ${e.est?`o isótopo mais comum (≈ ${e.s}-${A})`:`${e.s}-${A}`}`
  - `<div>Nêutrons</div><div>${N} ${e.est?'(isótopo mais comum ≈)':`(${e.s}-${A})`}</div>`
- **Problema:** `A` é a massa atômica **arredondada** (`Math.round(parseFloat(e.m))`), e isso não dá o isótopo mais comum. Em 12 casos o número obtido é de um isótopo **radioativo que não existe na natureza em quantidade apreciável**: Ni-59, Cu-64, Zn-65, Ga-70, Se-79, Br-80, Ag-108, Sb-122, Eu-152, Re-186, Ir-192 e Tl-204. Por exemplo, a ficha do cobre mostra "Cu-64", e o cobre natural é 69% Cu-63 e 31% Cu-65. Esse é exatamente o tipo de confusão (massa atômica × número de massa) que o ENEM cobra.
- **Correção proposta (preferida):** acrescentar a `dados.js` um campo `amax`, o número de massa do isótopo mais abundante, e usá-lo no lugar de `A` quando `e.est` for verdadeiro. Valores que diferem do arredondamento (IUPAC/CIAAW, abundâncias isotópicas):

  | Z | El. | amax | | Z | El. | amax | | Z | El. | amax |
  |---|---|---|---|---|---|---|---|---|---|---|
  | 28 | Ni | 58 | | 50 | Sn | 120 | | 68 | Er | 166 |
  | 29 | Cu | 63 | | 51 | Sb | 121 | | 70 | Yb | 174 |
  | 30 | Zn | 64 | | 52 | Te | 130 | | 72 | Hf | 180 |
  | 31 | Ga | 69 | | 54 | Xe | 132 | | 75 | Re | 187 |
  | 32 | Ge | 74 | | 56 | Ba | 138 | | 76 | Os | 192 |
  | 34 | Se | 80 | | 60 | Nd | 142 | | 77 | Ir | 193 |
  | 35 | Br | 79 | | 62 | Sm | 152 | | 80 | Hg | 202 |
  | 40 | Zr | 90 | | 63 | Eu | 153 | | 81 | Tl | 205 |
  | 42 | Mo | 98 | | 64 | Gd | 158 | | 82 | Pb | 208 |
  | 44 | Ru | 102 | | 66 | Dy | 164 | | | | |
  | 47 | Ag | 107 | | 48 | Cd | 114 | | | | |

  Para os outros elementos com isótopo estável, o arredondamento coincide com o isótopo mais abundante (conferi um por um).
- **Correção mínima (se não der para mexer nos dados agora):** trocar `o isótopo mais comum (≈ ${e.s}-${A})` por `um núcleo com A = ${A} (massa atômica arredondada)` e `(isótopo mais comum ≈)` por `(A ≈ massa arredondada)`.

### E3 · Urânio, tório, protactínio e bismuto aparecem como se fossem estáveis (média)
- **Onde:** `dados.js`, campo `"est":true` em Bi (83), Th (90), Pa (91) e U (92). O texto em `elemento.js` usa esse campo.
- **Problema:** com `est:true`, a ficha do urânio diz só `é a média ponderada dos isótopos naturais de urânio` e nunca diz que ele é radioativo. Nenhum desses quatro tem isótopo estável. Eles têm massa atômica padrão porque ocorrem na natureza com uma composição isotópica conhecida. Radioatividade e enriquecimento de urânio caem com frequência no ENEM (H22, H26).
- **Correção proposta:** manter a massa decimal, mas criar um campo `radio:true` para Bi, Th, Pa e U (e para todos os de `est:false`) e acrescentar à nota da ficha: `${e.n} não tem isótopo estável: todos os seus núcleos são radioativos, mas alguns duram tanto (bilhões de anos) que ainda existem na natureza desde a formação da Terra.` Para o U, vale citar U-238 (99,3%) e U-235 (0,7%, o físsil, que é "enriquecido" para usinas nucleares). **[química]** O bismuto-209 tem meia-vida de ~2×10¹⁹ anos; o especialista decide se vale tratá-lo como "praticamente estável".

### E4 · A explicação das exceções de configuração só vale para algumas delas (média)
- **Onde:** `elemento.js`, seção II.
- **Trecho:** `este elemento é uma exceção real à regra</b>, porque subníveis cheios ou meio cheios deixam o átomo mais estável`
- **Problema:** a frase aparece para os 20 elementos da lista, mas só explica Cr, Cu, Mo, Ag, Au, Pd, Gd e Cm. Para Nb (4d⁴ 5s¹), Ru, Rh, Pt, La, Ce, Ac, Th, Pa, U, Np e Lr, o subnível não fica nem cheio nem meio cheio, e a explicação ensina errado.
- **Correção proposta:** separar em duas listas.
  - Para `['Cr','Cu','Mo','Ag','Au','Pd','Gd','Cm']`: manter o texto atual.
  - Para os outros: `este elemento é uma exceção real à regra: as energias dos subníveis são tão próximas que a ordem de preenchimento muda. A configuração mostrada é a medida em laboratório.`
- No Brasil, os livros chamam a ordem de preenchimento de **"diagrama de Linus Pauling"**. Sugiro `(regra de Madelung, o "diagrama de Pauling" dos livros)` na primeira menção.

### E5 · Arsênio: a ficha diz "1 atm", mas a fusão foi medida sob pressão (baixa a média)
- **Onde:** `elemento.js`, legenda `medidas em pressão normal (1 atm)`. Em `dados.js`, o As tem `"mp":"1090","bp":"887"`.
- **Problema:** a ficha mostra fusão (1090 K) **acima** da ebulição (887 K), sem explicar. A 1 atm o arsênio **sublima** a 887 K; ele só funde sob ~28 atm. O carbono também sublima a 1 atm (por volta de 3900 K).
- **Correção proposta:** em `dados.js`, colocar uma nota para As (`"nota":"sublima a 887 K em 1 atm; só funde sob pressão (~28 atm)"`) e para C, e mostrá-la abaixo da tabela de propriedades. **[química]**

### E6 · Vida média do nêutron (baixa) [física]
- **Onde:** `elemento.js`, texto do nível NÊUTRON.
- **Trecho:** `vive em média <b>~14,7 minutos</b> (878 s)`
- **Problema:** 878 s dá 14,6 min. Muitos livros dão a **meia-vida** (~10 min), e o aluno pode estranhar.
- **Texto proposto:** `vive em média <b>~14,6 minutos</b> (878 s; meia-vida de ~10 minutos)`

---

## 2. Simplificações que enganam

### S1 · "Mesma família = mesmo número de elétrons na última camada"
- **Trecho (index.html, MODES.cat):** `Elementos da mesma família têm o mesmo número de elétrons na última camada e por isso reagem de forma parecida.`
- **Problema:** vale para os grupos 1, 2 e 13 a 17. Não vale para o hélio (2 elétrons, grupo 18) nem para os metais de transição (Ni, Pd e Pt têm camadas externas diferentes). Além disso, as cores desse modo são **categorias** (metal alcalino, de transição, lantanídeo…), não os 18 grupos.
- **Texto proposto:** `As cores mostram tipos de elemento. Nos grupos 1, 2 e 13 a 17, elementos da mesma coluna têm o mesmo número de elétrons na camada de valência, por isso reagem de forma parecida (o hélio, com 2, é a exceção dos gases nobres).`

### S2 · Categoria "semimetal" [química]
- No Brasil, vários livros do ensino médio (seguindo orientação da SBQ) deixaram de usar "semimetais" e passaram a distribuir B, Si, Ge, As, Sb, Te e Po entre metais e não metais. O termo ainda aparece em provas antigas. Sugestão: manter a cor, mas acrescentar na legenda `Semimetal (ou metaloide): classificação intermediária que nem todos os livros usam`. Decisão do especialista de química.

### S3 · Órbitas que "giram mais rápido"
- **Trecho (elemento.js, nota do modo ÓRBITAS 3D):** `As internas giram mais rápido, porque estão mais presas ao núcleo.`
- A nota de rodapé já explica que é o modelo de Bohr, e isso é ótimo. Mas aqui a frase apresenta a órbita como fato. **Texto proposto:** `No modelo de Bohr (1913), as camadas internas giram mais rápido porque estão mais presas ao núcleo. Hoje sabemos que o elétron não segue uma trilha: veja a NUVEM ELETRÔNICA.`

### S4 · Massa do próton "vem da energia dos glúons" [física]
- **Trecho:** `~99% da massa vem da energia dos glúons</b>, não dos quarks.`
- **Mais preciso:** `~99% da massa vem da energia da interação forte (o movimento dos quarks e o campo de glúons), e não da massa dos próprios quarks.`

---

## 3. Valores conferidos (amostragem)

Conferi todas as configurações eletrônicas por camada (K a Q) de Z 1 a 118, as categorias e os estados a 25 °C. Estão coerentes com a IUPAC e com o projeto de 2021 (Lu e Lr no grupo 3). Também estão certos: H 0,00008988 g/cm³; Os 22,59 g/cm³ (o mais denso, à frente do Ir com 22,56); F 3,98; Ga 302,9 K; Cs 301,6 K; Hg 234,3 K; Br líquido; He sem ponto de fusão a 1 atm; prótons 938,27 MeV/c²; elétron 0,511 MeV/c² e 1836 vezes mais leve; raio do próton 0,84 fm; núcleo ~10⁵ vezes menor que o átomo.

**Nomes a confirmar [química]:** "Tennesso" (Ts) e "Darmstádtio" (Ds). Em português há variação (tenessino/tenesso; darmstácio/darmstádtio). Vale seguir a lista oficial em português que a SBQ adota.

---

## 4. Linguagem e nível

- O nível das fichas sobe muito no bloco "MODELO PADRÃO" (quarks, glúons, bósons W, polarização do vácuo, precessão do spin). Isso não é cobrado no ensino médio. Não está errado, mas fica acima do público. Sugestão: deixar recolhido sob um título como "Para ir além (física de partículas)".
- **"Bloco eletrônico":** `Qual subnível (s, p, d ou f) recebe o último elétron` é claro. Ok.
- **Kelvin primeiro:** os mapas de fusão usam K. No ensino médio o aluno pensa em °C. As fichas já mostram os dois; no mapa da tabela, sugiro mostrar °C também.
- "Primordial" está bem explicado no modo ORIGEM.

---

## 5. Ligação com a biologia (oportunidade)

A tabela é um bom lugar para mostrar os **elementos da vida**, um tema recorrente no ENEM: C, H, O, N, P e S formam ~99% da massa dos seres vivos; Ca, K, Na, Cl, Mg e Fe são macrominerais; I, Zn, Cu e Se são micronutrientes. Sugestão: um modo de cor "NO CORPO HUMANO" e uma linha "Papel no corpo" nas fichas desses ~20 elementos. Exemplos: Fe na hemoglobina (link para Célula › Hemácia), I nos hormônios da tireoide (ligado ao sal iodado), Ca nos ossos e na contração muscular, P no ATP e no DNA, Mg na clorofila. O texto biológico pode ficar comigo.

---

## 6. ENEM

**Habilidades:** H17 (ler tabelas e gráficos, linguagem simbólica), H24 (códigos e nomenclatura da química), H18 (propriedades e finalidades, como densidade e ponto de fusão), H22 (radiação e matéria: isótopos e radioatividade, se E3 for feito), H7 (segurança).

**Temas recorrentes:** propriedades periódicas (eletronegatividade, raio), estado físico e mudanças de fase, isótopos e massa atômica, radioatividade e meia-vida, metais pesados e contaminação (Hg, Pb, Cd), que liga química e biologia (bioacumulação, H10).

**Ideias de pergunta no estilo ENEM:**
1. "O cobre natural é formado por 69% de ⁶³Cu e 31% de ⁶⁵Cu. Explique por que a massa atômica do cobre é 63,55 u e não um número inteiro." O módulo deixa o aluno ver e calcular, desde que E2 esteja corrigido.
2. "O mercúrio usado no garimpo ilegal na Amazônia contamina peixes e ribeirinhos. Com base no estado físico do Hg a 25 °C e na sua densidade, explique por que ele se acumula no leito dos rios." O modo ESTADO e a ficha do Hg dão os dados; a parte de bioacumulação liga com ecologia (H10, H12).
