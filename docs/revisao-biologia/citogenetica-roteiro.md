# Roteiro científico · Citogenética (módulo `site/divisao-celular/`)

🔬 Taxon, 2026-11-15. Para 🏛️ Aurelius (implementação) e 🎨 Apolo (visual).
Item 3 da ementa: "Citogenética: classificação dos cromossomos; divisão celular mitótica e meiótica; alterações cromossômicas: euploidias e aneuploidias."

O módulo passa a se chamar **Citogenética**. Mitose, meiose, não disjunção, aneuploidias e gametogênese já existem. Faltam: a seção **Cromossomos** (4 tópicos) e o tópico **Euploidias** (na seção "Erros"). Sugestão: renomear a seção "Erros" para **"Alterações"** (rótulo curto de "alterações cromossômicas", termo da ementa), com a ordem Não disjunção → Aneuploidias → Euploidias.

Ordem sugerida das seções: **Cromossomos** → Ciclo celular → Mitose → Meiose → Mitose × meiose → Alterações → Gametogênese. A seção Cromossomos vem primeiro porque tudo depois usa cromátide, centrômero, homólogos, n e 2n.

Cores: usar as do módulo (`C.mat` roxo = origem materna, `C.pat` azul = origem paterna), como na meiose, para que os homólogos tenham a mesma leitura em todo o módulo.

Fontes (por capítulo; todas as cifras abaixo conferem com elas):
- AMABIS, J. M.; MARTHO, G. R. *Biologia Moderna*. São Paulo: Moderna, 2016. Vol. 1 (núcleo, cromossomos e divisão celular) e vol. 3 (genética e alterações cromossômicas).
- LOPES, S.; ROSSO, S. *Bio*. São Paulo: Saraiva, 2016. Vol. 1 (núcleo e divisão) e vol. 3.
- ALBERTS, B. et al. *Biologia Molecular da Célula*. 6. ed. Porto Alegre: Artmed, 2017. Cap. 4 (DNA, cromossomos e genomas) e cap. 17 (ciclo celular).
- NUSSBAUM, R. L.; McINNES, R. R.; WILLARD, H. F. *Thompson & Thompson Genética Médica*. 8. ed. Rio de Janeiro: Elsevier, 2016. Cap. 5 (citogenética clínica) e cap. 6 (distúrbios dos autossomos e dos cromossomos sexuais).

---

## (a) Seção nova: Cromossomos

Seção `{id:'cromossomos', t:'Cromossomos'}`. Quatro tópicos.

### Tópico 1 · Estrutura do cromossomo
- **Título:** "Anatomia de um cromossomo"
- **Subtítulo:** "cromátides, centrômero, braços e telômeros"

**Texto para o aluno:**
> O **cromossomo** é uma molécula de DNA muito longa enrolada em proteínas (as histonas). Na interfase ele fica descondensado, como cromatina; na divisão, se condensa ao máximo, e é na **metáfase** que fica mais visível. Depois da fase S, cada cromossomo está **duplicado**: tem duas **cromátides-irmãs**, cópias idênticas, unidas pelo **centrômero** (a constrição primária). No centrômero fica o **cinetocoro**, onde se prendem as fibras do fuso. O centrômero divide o cromossomo em dois **braços**: o curto, **p** (do francês *petit*), e o longo, **q**. Nas pontas ficam os **telômeros**, sequências repetidas (TTAGGG nos vertebrados) que protegem o DNA e encurtam a cada divisão na maioria das células. Para contar cromossomos, conte centrômeros: um cromossomo duplicado continua sendo **um** cromossomo, com duas cromátides.

**Números que podem aparecer na tela:**
- Célula humana em G1: 46 cromossomos, 46 moléculas de DNA.
- Célula humana em G2 ou metáfase: 46 cromossomos, 92 cromátides.
- O DNA de uma célula humana, esticado, mede cerca de 2 m (Alberts, cap. 4).

**O que a animação deve mostrar** (3 a 4 passos):
1. Um cromossomo **não duplicado** (um bastão só, com centrômero marcado). Rótulo: "1 cromossomo, 1 cromátide (G1)".
2. Fase S: o bastão se copia e surgem duas cromátides lado a lado, unidas no centrômero, em forma de X. Rótulo: "1 cromossomo, 2 cromátides-irmãs (G2)". O contador de cromossomos **não muda** (fica 1); o de cromátides passa de 1 para 2.
3. Rótulos com linhas de chamada: cromátide-irmã, centrômero, cinetocoro, braço p (em cima, mais curto), braço q (embaixo, mais longo), telômeros (pontas destacadas em outra cor).
4. Anáfase: as cromátides se separam e cada uma vira um cromossomo não duplicado. Contador: "agora são 2 cromossomos".

Cuidado visual: o X da metáfase é um cromossomo **duplicado**, não um par de homólogos. As duas cromátides têm a **mesma cor**, pois são cópias idênticas.

**Cartão "No ENEM":**
> A pergunta clássica é contar. Um cromossomo duplicado tem **duas cromátides**, mas continua sendo **um** cromossomo: conte os **centrômeros**. Uma célula humana em metáfase tem 46 cromossomos e 92 cromátides. As cromátides-irmãs são cópias idênticas (até o crossing-over); os homólogos não são.

---

### Tópico 2 · Classificação pela posição do centrômero
- **Título:** "Onde fica o centrômero"
- **Subtítulo:** "metacêntrico, submetacêntrico, acrocêntrico, telocêntrico"

**Texto para o aluno:**
> A posição do centrômero dá a forma do cromossomo e serve para classificá-lo. No **metacêntrico**, o centrômero fica no meio e os braços p e q têm quase o mesmo tamanho. No **submetacêntrico**, fica um pouco fora do meio: um braço é claramente mais curto. No **acrocêntrico**, fica perto de uma ponta, e o braço p é minúsculo. No **telocêntrico**, fica na própria ponta, e só há um braço. Nos seres humanos há os três primeiros tipos, mas **não há cromossomos telocêntricos**; eles existem em outras espécies, como o camundongo. Na anáfase, puxado pelo centrômero, cada tipo ganha um formato: V no metacêntrico, L ou J no submetacêntrico e bastão (I) no acrocêntrico e no telocêntrico.

**Exemplos humanos** (Thompson & Thompson, cap. 5; grupos de Denver/ISCN):

| Tipo | Centrômero | Razão q/p aproximada* | Cromossomos humanos |
|---|---|---|---|
| Metacêntrico | no meio | 1,0 a 1,7 | 1, 3, 16, 19, 20 |
| Submetacêntrico | fora do meio | 1,7 a 3,0 | 2, 4, 5, 6 a 12, 17, 18 e X |
| Acrocêntrico | perto de uma ponta | 3,0 a 7,0 | 13, 14, 15, 21, 22 e Y |
| Telocêntrico | na ponta | sem braço p | nenhum em humanos (ex.: camundongo) |

\*Critério de Levan et al. (1964). É detalhe técnico: pode ficar numa nota ou ficar de fora; o aluno do ENEM não precisa da razão numérica.

Detalhe opcional, para um "Saiba mais": os acrocêntricos 13, 14, 15, 21 e 22 têm **satélites** no braço curto, ligados por uma constrição secundária onde ficam os genes do RNA ribossômico (as regiões organizadoras do nucléolo). O Y é acrocêntrico, mas sem satélites.

**O que a animação deve mostrar:**
1. Os quatro tipos lado a lado, duplicados (forma de X), com o centrômero deslizando do meio até a ponta: metacêntrico → submetacêntrico → acrocêntrico → telocêntrico. Braço p em cima, q embaixo, com os rótulos "p" e "q".
2. Embaixo de cada um, a forma na anáfase (uma cromátide puxada pelo centrômero): V, J, I e I.
3. Um exemplo humano sob cada tipo: "cromossomo 1", "cromossomo 4", "cromossomo 21", e no telocêntrico o texto "não existe em humanos" (o rótulo em vermelho claro ou riscado, para não sugerir o contrário).

**Cartão "No ENEM":**
> As questões mostram o desenho de um cromossomo, às vezes na anáfase, e pedem o tipo. Olhe **onde está o centrômero**: no meio, metacêntrico (V na anáfase); fora do meio, submetacêntrico (J ou L); perto da ponta, acrocêntrico (I com um braço minúsculo); na ponta, telocêntrico (I sem braço p). Lembre que o ser humano **não tem telocêntricos**, e que o 21, o da síndrome de Down, é acrocêntrico.

---

### Tópico 3 · O cariótipo humano
- **Título:** "Cariótipo humano"
- **Subtítulo:** "46 cromossomos em ordem"

**Texto para o aluno:**
> O **cariótipo** é o conjunto de cromossomos de uma espécie, e também a imagem em que eles aparecem organizados em pares. A espécie humana tem **46 cromossomos**: **22 pares de autossomos**, numerados de 1 a 22 do maior para o menor, e **1 par de cromossomos sexuais**, **XX** na mulher e **XY** no homem. Para montá-lo, cultivam-se células que se dividem (em geral linfócitos do sangue) e acrescenta-se **colchicina**, que impede a formação do fuso e para as células na **metáfase**, quando os cromossomos estão mais condensados. As células são inchadas numa solução hipotônica, fixadas, espalhadas numa lâmina e coradas (o corante Giemsa dá as **bandas G**, faixas claras e escuras próprias de cada cromossomo). Depois, os cromossomos são fotografados e pareados pelo **tamanho**, pela **posição do centrômero** e pelo **padrão de bandas**, e reunidos em 7 grupos, de A a G. A notação resume o resultado: **46,XX** ou **46,XY**.

**Grupos (Denver/ISCN; Thompson & Thompson, cap. 5):**

| Grupo | Cromossomos | Como são |
|---|---|---|
| A | 1, 2, 3 | grandes; 1 e 3 metacêntricos, 2 submetacêntrico |
| B | 4, 5 | grandes, submetacêntricos |
| C | 6 a 12 e X | médios, submetacêntricos |
| D | 13, 14, 15 | médios, acrocêntricos (com satélites) |
| E | 16, 17, 18 | pequenos; 16 metacêntrico, 17 e 18 submetacêntricos |
| F | 19, 20 | pequenos, metacêntricos |
| G | 21, 22 e Y | os menores, acrocêntricos |

Observação: o cromossomo 21 é, na verdade, um pouco **menor** que o 22 (a numeração foi feita antes das bandas). Não precisa ir para o texto do aluno, mas o desenho não deve inverter os tamanhos.

**O que a animação deve mostrar:**
1. Uma célula em metáfase com os cromossomos espalhados ao acaso (a "metáfase espalhada"), com um rótulo "colchicina: as células param na metáfase".
2. Os cromossomos voam para a grade e se alinham em pares, do 1 ao 22, com o par sexual no fim, agrupados e rotulados A a G. Cada par com um homólogo roxo (materno) e um azul (paterno) só se o Apolo quiser manter a leitura de origem; numa foto real eles não têm cor (sugiro tons neutros com bandas, e a cor de origem como camada opcional).
3. Botão ou alternância **XX / XY**: o último par muda (o Y desenhado bem menor que o X, acrocêntrico).
4. Rodapé com a notação: "46,XX" ou "46,XY".

Os cromossomos do cariótipo devem estar **duplicados** (em X), pois são fotografados na metáfase.

**Cartão "No ENEM":**
> Cariótipo se monta com células em **metáfase**, paradas pela **colchicina**, que bloqueia o fuso. A prova costuma dar um cariótipo e pedir o sexo e se há alteração: conte os cromossomos (46?), veja o par sexual (XX ou XY) e procure um número com três cópias ou com uma só. O cariótipo mostra alterações de **número e de forma** dos cromossomos; uma mutação num só gene não aparece nele.

---

### Tópico 4 · Homólogos, n e 2n
- **Título:** "Homólogos, n e 2n"
- **Subtítulo:** "um conjunto da mãe, outro do pai"

**Texto para o aluno:**
> **Cromossomos homólogos** são os dois de um mesmo par: têm o mesmo tamanho, a mesma posição do centrômero e os **mesmos genes nos mesmos lugares** (loci), mas podem ter versões diferentes desses genes (alelos). Um veio da mãe, pelo óvulo, e o outro do pai, pelo espermatozoide. A letra **n** indica quantos cromossomos há num **conjunto** (o lote completo, com um de cada tipo). Uma célula **diploide (2n)** tem dois conjuntos, ou seja, os cromossomos em pares; uma **haploide (n)** tem um só conjunto, sem homólogos. No ser humano, **n = 23** e **2n = 46**: as células do corpo são 2n e os gametas, n. A fecundação junta n + n e refaz o 2n. O número de cromossomos é próprio de cada espécie e não indica complexidade: o cão tem 78, e o ser humano, 46.

**Exemplos de espécies (2n):**

| Espécie | 2n | n |
|---|---|---|
| Ser humano (*Homo sapiens*) | 46 | 23 |
| Chimpanzé | 48 | 24 |
| Cão | 78 | 39 |
| Gato | 38 | 19 |
| Cavalo | 64 | 32 |
| Jumento | 62 | 31 |
| Mosca-das-frutas (*Drosophila melanogaster*) | 8 | 4 |
| Ervilha (*Pisum sativum*) | 14 | 7 |
| Milho (*Zea mays*) | 20 | 10 |

Exemplo de alto valor para o ENEM: **burro ou mula** (cruzamento de égua com jumento) tem **63** cromossomos (32 + 31). Os cromossomos não formam pares perfeitos na meiose, e por isso o animal é, em regra, estéril.

**O que a animação deve mostrar:**
1. Uma célula 2n = 4 (o mesmo modelo da meiose: dois pares, um longo e um curto), com um homólogo roxo (materno) e um azul (paterno) em cada par. Destaque um par com chave "par de homólogos".
2. Zoom num par: os mesmos loci marcados nas mesmas alturas nos dois homólogos (por exemplo, faixas com "A" e "a", reaproveitando a notação de alelos que o módulo já usa em `alle`). Rótulo: "mesmos genes, alelos podem ser diferentes".
3. Separação dos conjuntos: um conjunto (um longo + um curto) vai para cada lado. Rótulos "n = 2" e "n = 2"; depois o encontro de dois gametas refazendo "2n = 4".
4. Contador final no caso humano: "n = 23 · 2n = 46".

**Cartão "No ENEM":**
> **Homólogos** formam um par (um da mãe, um do pai, mesmos genes, alelos que podem diferir); **cromátides-irmãs** são as duas cópias idênticas de um mesmo cromossomo duplicado. Não confunda. **n** é o número de cromossomos de um conjunto: gametas humanos têm n = 23, as demais células, 2n = 46. A mula, com 63 cromossomos, cai como exemplo de híbrido estéril porque não consegue parear os cromossomos na meiose.

---

## (b) Tópico novo: Euploidias (seção "Alterações", depois de "Aneuploidias")

- **Título:** "Euploidias"
- **Subtítulo:** "conjuntos inteiros a mais ou a menos"

**Texto para o aluno:**
> Nas **euploidias**, muda o número de **conjuntos inteiros** de cromossomos: a célula passa a ter 1, 3, 4 ou mais lotes, em vez de 2. A **haploidia (n)** é ter um só conjunto; a **poliploidia** é ter mais de dois: **triploidia (3n)**, **tetraploidia (4n)** e assim por diante. Nas **aneuploidias**, ao contrário, sobra ou falta **um ou poucos** cromossomos (2n + 1, 2n − 1). A poliploidia é comum e útil nas **plantas**: o trigo-comum tem seis conjuntos de 7 cromossomos (42), o morango cultivado tem oito (56), e a banana que comemos é **triploide**: com três conjuntos, os cromossomos não se dividem por igual na meiose, a planta não forma sementes viáveis e é propagada por mudas. Nos animais, em especial nos mamíferos, a poliploidia quase sempre é letal. No ser humano, a **triploidia** (69 cromossomos) aparece em cerca de 1% a 3% das gestações reconhecidas e é uma causa importante de aborto espontâneo: o desequilíbrio entre os genomas da mãe e do pai e na dose dos cromossomos sexuais impede o desenvolvimento normal, e os raros bebês que nascem morrem logo.

**Pontos científicos (para conferir o texto e a animação):**
- Origem da triploidia humana (Thompson & Thompson, cap. 5/6): na maioria das vezes, **dispermia** (dois espermatozoides fecundam um óvulo); às vezes, um gameta diploide por falha na meiose. Cariótipos: 69,XXX, 69,XXY ou 69,XYY. A tetraploidia (92,XXXX ou 92,XXYY) é ainda mais rara e também letal.
- Por que plantas toleram e mamíferos não: nas plantas, em geral, não há determinação do sexo por cromossomos, a reprodução pode ser vegetativa ou por autofecundação, e o desenvolvimento depende menos do equilíbrio entre os genomas materno e paterno (*imprinting* genômico). Em mamíferos, *imprinting* e a dose dos cromossomos sexuais tornam o embrião poliploide inviável.
- **Colchicina** também induz poliploidia em plantas (bloqueia o fuso: os cromossomos se duplicam e a célula não se divide). Ligação com o tópico do cariótipo.
- **Melancia sem sementes:** cruzamento de uma planta tetraploide (4n) com uma diploide (2n) dá sementes triploides (3n), que geram plantas estéreis com frutos sem sementes.
- **Trigo:** é **alopoliploide**, surgiu de hibridações entre espécies diferentes seguidas de duplicação dos cromossomos. A notação técnica é 2n = 6x = 42, com x = 7 (número básico) e gametas com n = 21. Muitos livros do ensino médio escrevem "6n = 42". Sugestão para o site: "hexaploide: 42 cromossomos, 6 conjuntos de 7", sem escrever "n = 7" (que confundiria com os gametas, que têm 21).
- **Banana Cavendish (a "nanica" e a "nanicão"):** triploide, 33 cromossomos (3 conjuntos de 11). Os pontinhos pretos no miolo são óvulos que não se desenvolveram. O fruto se forma sem fecundação (partenocarpia).
- **Morango cultivado** (*Fragaria × ananassa*): octoploide, 56 cromossomos (8 conjuntos de 7).
- Outros exemplos seguros, se precisar: batata tetraploide (48), algodão cultivado alotetraploide (52), aveia hexaploide (42).
- **Haploidia:** o zangão das abelhas (*Apis mellifera*) é haploide, n = 16, nasce de óvulo não fecundado (partenogênese); a rainha e as operárias são 2n = 32. Isso é normal na espécie, não uma alteração. Em plantas, haploides obtidos em laboratório (cultura de anteras) são estéreis e servem ao melhoramento depois de duplicados com colchicina.
- **Evolução:** a poliploidia pode formar uma espécie nova de uma vez (especiação sem isolamento geográfico), porque o poliploide não gera descendentes férteis com a espécie de origem. Ligação útil com o módulo de evolução, quando existir.

**Euploidia × aneuploidia (quadro para o aluno):**

| | Euploidia | Aneuploidia |
|---|---|---|
| O que muda | o número de **conjuntos inteiros** | o número de **um ou poucos** cromossomos |
| Notação | n, 3n, 4n, 6n... | 2n − 1, 2n + 1, 2n + 2... |
| Exemplo | banana 3n; trigo 6n; zangão n | síndrome de Down 47,+21; Turner 45,X |
| Causa típica | fecundação por 2 espermatozoides; gameta 2n; colchicina | não disjunção na meiose |
| Em plantas | comum, muitas vezes útil | geralmente prejudicial |
| Em humanos | letal (triploidia: aborto) | algumas são viáveis (Down, Turner, Klinefelter) |

**Nomenclatura (tabela para o aluno):**

| Nome | Fórmula | Tipo | Exemplo |
|---|---|---|---|
| Haploidia | n | euploidia | zangão das abelhas (n = 16) |
| Triploidia | 3n | euploidia | banana (33); em humanos, 69 cromossomos, letal |
| Tetraploidia | 4n | euploidia | batata (48) |
| Hexaploidia | 6n | euploidia | trigo-comum (42) |
| Nulissomia | 2n − 2 (falta um par inteiro) | aneuploidia | letal em humanos; viável no trigo, que tem genes de reserva nos outros conjuntos |
| Monossomia | 2n − 1 | aneuploidia | síndrome de Turner, 45,X |
| Trissomia | 2n + 1 | aneuploidia | Down (47,+21), Edwards (47,+18), Patau (47,+13), Klinefelter (47,XXY) |
| Tetrassomia | 2n + 2 (quatro cópias do mesmo cromossomo) | aneuploidia | 48,XXXX; 48,XXXY (variante de Klinefelter) |

Atenção na tabela: **nulissomia** é falta **dos dois** cromossomos de um mesmo par; **tetrassomia** é o **mesmo** cromossomo em quatro cópias. Uma pessoa com dois cromossomos extras **diferentes** (por exemplo, 48,XXY,+21) tem **dupla trissomia** (2n + 1 + 1), não tetrassomia. A monossomia autossômica completa é letal no ser humano; a única monossomia viável é a do X.

**O que a animação deve mostrar:**
1. Ponto de partida: célula 2n = 4 do modelo do módulo (dois pares, cores materno/paterno). Rótulo "2n: dois conjuntos".
2. Euploidias: a célula vira **3n** (três cromossomos longos e três curtos) e depois **4n** (quatro e quatro); depois **n** (um de cada). Contador "conjuntos: 2 → 3 → 4 → 1" e o número total (4 → 6 → 8 → 2). Destacar que **todos os tipos** mudam juntos.
3. Contraste com aneuploidia: volta a 2n e acrescenta **só um** cromossomo curto: "2n + 1: só um tipo muda". Lado a lado, "3n" e "2n + 1", com o título "euploidia × aneuploidia".
4. Meiose do triploide (o porquê da banana estéril): três homólogos tentam se separar; um polo recebe dois e o outro, um, ao acaso em cada tipo, e os gametas saem desequilibrados (rótulo "gametas desequilibrados: sem sementes viáveis"). Reaproveitar `mkMeiose` com três homólogos por tipo, se der.
5. Fechamento com três ícones e números: trigo "6 conjuntos · 42", morango "8 conjuntos · 56", banana "3 conjuntos · 33"; e um cartão humano "69 cromossomos: inviável".

**Cartão "No ENEM":**
> Euploidia mexe em **conjuntos inteiros** (n, 3n, 4n); aneuploidia, em **um** cromossomo (2n + 1, 2n − 1). A poliploidia aparece no ENEM ligada a **agricultura** (frutos maiores, banana e melancia sem sementes, uso de colchicina) e à **evolução** (uma espécie nova pode surgir de uma vez por poliploidia). Por que a banana não tem sementes? Porque é **triploide**: com três conjuntos, a meiose não divide os cromossomos por igual e os gametas são inviáveis.

---

## (c) Conferir nos tópicos existentes (Não disjunção e Aneuploidias)

Li o tópico `erros/aneuploidias` (linhas 550 a 560 do `index.html`). Está correto. Conferir e, se quiser, completar com o que segue.

**Cariótipos e nomes (padrão ISCN: total, vírgula, sexuais, vírgula, o que sobra ou falta):**

| Condição | Cariótipo | Frequência aproximada (Thompson & Thompson) |
|---|---|---|
| Síndrome de Down (trissomia do 21) | 47,XX,+21 ou 47,XY,+21 | 1 em ~700 nascimentos (já está no texto: ok) |
| Síndrome de Edwards (trissomia do 18) | 47,XX,+18 ou 47,XY,+18 | 1 em ~6.000 a 8.000 |
| Síndrome de Patau (trissomia do 13) | 47,XX,+13 ou 47,XY,+13 | 1 em ~10.000 a 20.000 |
| Síndrome de Turner (monossomia do X) | 45,X | 1 em ~2.500 a 4.000 meninas |
| Síndrome de Klinefelter | 47,XXY | 1 em ~600 a 1.000 meninos |
| Triplo X (opcional) | 47,XXX | 1 em ~1.000 meninas, em geral sem sinais marcantes |

Na tabela `kv`, sugiro trocar "trissomia do 18" e "trissomia do 13" pelos cariótipos (47,XX,+18 ou 47,XY,+18; 47,XX,+13 ou 47,XY,+13), para manter o padrão das outras linhas. Atenção: **45,X** (não "45,X0" nem "45,XO"; a forma com "0" aparece em livros antigos e em provas, e o texto pode dizer "às vezes escrito 45,X0").

**Sinais típicos (para os textos e para um "saiba mais"):**
- **Down:** deficiência intelectual de grau variável; hipotonia (pouco tônus muscular); olhos com fendas oblíquas para cima e prega no canto interno (epicanto); prega palmar única; cardiopatia congênita em cerca de 40% a 50%; maior risco de leucemia e de Alzheimer precoce. Cerca de **95%** dos casos são trissomia livre, ~4% por **translocação** (um 21 extra preso a outro cromossomo, em geral o 14; a pessoa tem 46 cromossomos) e ~1% a 2% **mosaicos** (só parte das células com o 21 extra). A não disjunção é de origem materna em cerca de 90% dos casos, na maioria na meiose I. Risco pela idade materna: ~1 em 1.250 aos 25 anos, ~1 em 350 aos 35, ~1 em 100 aos 40.
- **Edwards:** deficiência intelectual grave; mãos fechadas com dedos sobrepostos (o indicador sobre o médio, o mínimo sobre o anelar); pés em "mata-borrão" (planta arredondada, calcanhar saliente); queixo pequeno; cardiopatia. A maioria morre no primeiro ano (só 5% a 10% passam dele).
- **Patau:** fenda labial e palatina; polidactilia; olhos pequenos (microftalmia); defeitos graves do cérebro (holoprosencefalia) e do coração. Cerca de 90% morrem no primeiro ano.
- **Turner:** sexo feminino; baixa estatura; ovários pouco desenvolvidos (ovários "em fita"), sem menstruação espontânea e infertilidade; pescoço alado; inchaço de mãos e pés ao nascer; inteligência em geral normal. Cerca de 99% dos embriões 45,X são abortados espontaneamente. **Nenhum corpúsculo de Barr.**
- **Klinefelter:** sexo masculino; alto; testículos pequenos e infertilidade (em geral sem espermatozoides); às vezes mamas aumentadas (ginecomastia) e pouca pelagem; dificuldades leves de aprendizagem em parte dos casos. **Um corpúsculo de Barr** (cromatina sexual positiva), como uma mulher.
- Dica de prova sobre o corpúsculo de Barr: número de corpúsculos = número de X − 1 (45,X → 0; 46,XX → 1; 47,XXY → 1; 47,XXX → 2).

**Pequenos ajustes de texto que recomendo (sem erro científico, só precisão):**
1. Passo "Trissomia do 21" (linha 553): "Todas as células do corpo terão o cromossomo extra." Está certo para este caso (erro no gameta). Se couber, um "Saiba mais" com translocação e mosaicismo, para o aluno não achar que toda Down é igual.
2. Texto `d`: "A causa mais comum é a não disjunção na meiose." Ok. Pode acrescentar "em geral na formação do óvulo" (ligação com a idade materna, que já é citada).
3. Cartão ENEM atual de Aneuploidias já menciona euploidia (3n, 4n). Quando o tópico Euploidias existir, colocar o link `['Euploidias','#erros/euploidias']` (ou o id da seção renomeada) em `links`.
4. Se a seção "Erros" virar "Alterações", conferir os links internos `#erros/...` que já existem (Não disjunção → Aneuploidias e vice-versa) e o título da página/aba (Divisão celular → Citogenética; nome curto sugerido: "Citogenética" / "Cito").

**Fora do escopo desta ementa (não incluir agora):** alterações **estruturais** (deleção, duplicação, inversão, translocação; ex.: síndrome do miado do gato, 5p−). A ementa pede só euploidias e aneuploidias; a translocação aparece apenas como nota dentro de Down.
