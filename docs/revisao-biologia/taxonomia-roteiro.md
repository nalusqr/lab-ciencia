# Roteiro científico · Taxonomia e Nomenclatura (módulo novo `site/taxonomia/`)

🔬 Taxon, 2026-11-15. Escrito na "esteira", enquanto a equipe programa a Histologia; fica pronto para o 🧭 Atlas distribuir. Revisão cruzada: 🧬 Sapien (notas no fim do arquivo).
Item 7 da ementa: "Taxonomia e nomenclatura."

## Mapa do módulo

O tema é menor que Embriologia e Histologia: são **12 tópicos num só arquivo**. Ordem das seções: **História → Categorias → Espécie → Nomes → Sistemas → Cladística → Chave**.

| Seção | Rotas |
|---|---|
| História | `#historia/aristoteles`, `#historia/lineu` |
| Categorias | `#categorias/hierarquia` |
| Espécie | `#especie/conceito` |
| Nomes | `#nomes/binomial`, `#nomes/regras` |
| Sistemas | `#sistemas/reinos`, `#sistemas/dominios` |
| Cladística | `#cladistica/cladograma`, `#cladistica/grupos`, `#cladistica/homologia` |
| Chave | `#chave/dicotomica` |

**Fronteiras com outros módulos:**
1. As características de cada reino (Monera, Protoctista, Fungi, Plantae, Animalia) ficam para o item 9 da ementa ("Os seres vivos"). Aqui os reinos aparecem só como **sistema de classificação** e pelos critérios que os separam.
2. Os mecanismos de especiação e de isolamento reprodutivo em detalhe ficam para o item 12 (evolução). Aqui só a ideia de isolamento reprodutivo, porque ela define a espécie.
3. Os vírus já têm tópico na Morfofisiologia (`../morfofisiologia/index.html#teoria/virus`) e terão módulo próprio (item 8). Aqui só a nota de que não entram em nenhum reino.
4. Protostômios e deuterostômios estão na Embriologia (`../embriologia/index.html#desenvolvimento/blastoporo`); o cladograma pode apontar para lá.

**Vocabulário:**
- "nome científico"; "epíteto específico" para a segunda palavra (não "nome da espécie": a espécie é o binômio inteiro);
- "Protoctista (ou Protista)", com Protoctista primeiro, porque é o termo da ementa;
- "táxon" (plural "táxons"; aceitar "taxa" só em citação);
- "cladograma" para a árvore de Hennig; "árvore filogenética" como termo geral;
- "grupo monofilético (clado)", "parafilético" e "polifilético".

**Cores (proposta para o 🎨 Apolo):** uma cor por categoria taxonômica, na mesma ordem do arco-íris, do domínio (violeta) à espécie (vermelho), para o aluno ver a "escada" encaixando. Nos sistemas: Bacteria em azul, Archaea em laranja, Eukarya em verde; os cinco reinos de Whittaker em tons próprios que se reencaixam nos três domínios. No cladograma, as **sinapomorfias** (novidades evolutivas) aparecem como marcas âmbar sobre os ramos, que é a cor de "destaque" do guia Campo escuro.

**Fontes:**
- AMABIS, J. M.; MARTHO, G. R. *Biologia Moderna*. São Paulo: Moderna, 2016. Vol. 2, unidade "A diversidade da vida" (classificação, nomenclatura, cladística).
- LOPES, S.; ROSSO, S. *Bio*. São Paulo: Saraiva, 2016. Vol. 2, capítulo de sistemática e classificação.
- LINHARES, S.; GEWANDSZNAJDER, F.; PACCA, H. *Biologia Hoje*. São Paulo: Ática, 2016. Vol. 2, capítulo de classificação dos seres vivos.
- RAVEN, P. H.; EVERT, R. F.; EICHHORN, S. E. *Biologia Vegetal*. 8. ed. Rio de Janeiro: Guanabara Koogan, 2014. Cap. 12 (sistemática: nomenclatura, cladística, domínios e reinos).
- REECE, J. B. et al. *Biologia de Campbell*. 10. ed. Porto Alegre: Artmed, 2015. Cap. 26 (filogenia e a árvore da vida).
- MAYR, E. *Systematics and the Origin of Species*. New York: Columbia University Press, 1942 (conceito biológico de espécie).
- HENNIG, W. *Grundzüge einer Theorie der phylogenetischen Systematik*. Berlin, 1950 (cladística).
- WHITTAKER, R. H. New concepts of kingdoms of organisms. *Science*, v. 163, p. 150-160, 1969.
- WOESE, C. R.; FOX, G. E. Phylogenetic structure of the prokaryotic domain. *PNAS*, v. 74, p. 5088-5090, 1977.
- WOESE, C. R.; KANDLER, O.; WHEELIS, M. L. Towards a natural system of organisms: proposal for the domains Archaea, Bacteria, and Eucarya. *PNAS*, v. 87, p. 4576-4579, 1990.
- MORA, C. et al. How many species are there on Earth and in the ocean? *PLoS Biology*, v. 9, e1001127, 2011.
- CHAPMAN, A. D. *Numbers of Living Species in Australia and the World*. 2. ed. Canberra: Australian Biological Resources Study, 2009.
- Código Internacional de Nomenclatura Zoológica (ICZN), 4. ed., 1999; Código Internacional de Nomenclatura para algas, fungos e plantas (ICN), 2018.

---

## Seção · História (`historia`)

### H1 `#historia/aristoteles` · "Antes de Lineu"
- **Subtítulo:** "com sangue, sem sangue, e uma escada da natureza"

**Texto do aluno:**
> Classificar é juntar em grupos o que se parece e separar o que é diferente. Toda cultura faz isso com plantas e animais que come, cultiva ou teme. O primeiro sistema escrito que conhecemos é o do filósofo grego **Aristóteles** (384-322 a.C.), que descreveu cerca de **500 tipos de animais** e os dividiu em dois grandes grupos: os **com sangue** (vermelho), que hoje correspondem mais ou menos aos vertebrados, e os **sem sangue**, como insetos, polvos e crustáceos. Dentro deles, separou os animais pelo modo de reprodução (vivíparos, que parem filhotes, e ovíparos, que põem ovos) e pelo ambiente. Seu aluno **Teofrasto** fez o mesmo com cerca de 500 plantas, separadas em árvores, arbustos e ervas.
>
> Aristóteles também imaginou a **escada da natureza** (*scala naturae*): os seres em degraus, dos mais "simples" aos mais "perfeitos", com o ser humano no topo. Essa ideia durou quase 2 mil anos. Nos séculos XVI e XVII, as grandes navegações trouxeram para a Europa milhares de plantas e animais desconhecidos, e os nomes viraram um caos: cada estudioso descrevia uma planta com uma frase longa em latim, diferente da do outro. O inglês **John Ray** (1686) foi um dos primeiros a usar a palavra **espécie** no sentido biológico: seres que se reproduzem e geram filhos parecidos com eles.

**Animação:** uma "estante" com cerca de 20 cartões de animais misturados (onça, sapo, peixe, polvo, abelha, caranguejo, pássaro, cobra, baleia, minhoca...). O aluno arrasta os cartões para duas caixas, "com sangue" e "sem sangue", como Aristóteles. Ao final, um botão "ver hoje" reorganiza os mesmos cartões em vertebrados e invertebrados, mostrando que a divisão bate quase toda, e que os grupos de baixo (os "sem sangue") são muito mais variados do que parecia.
**Faixa "Linha do tempo":** de 350 a.C. a 1758, com marcos: Aristóteles, Teofrasto, as grandes navegações, John Ray (1686) e Lineu (1735 e 1758). A faixa termina apontando para `#historia/lineu`.

**Cartão "No ENEM":**
> A prova não pede detalhes de Aristóteles, mas cobra a ideia por trás: os primeiros sistemas eram **artificiais**, baseados em poucas características escolhidas por conveniência (ter sangue, onde vive, para que serve). Os sistemas atuais são **naturais** ou **filogenéticos**: agrupam pelo **parentesco evolutivo**. Pegadinha: "baleia é peixe" é uma classificação artificial, pelo ambiente; pelo parentesco, ela é mamífero.

### H2 `#historia/lineu` · "Lineu e o *Systema Naturae*"
- **Subtítulo:** "duas palavras para cada ser vivo"

**Texto do aluno:**
> O botânico sueco **Carl von Linné**, ou **Lineu** (1707-1778), pôs ordem no caos. Em 1735 publicou o *Systema Naturae*, com os seres agrupados em **categorias** encaixadas umas nas outras: reino, classe, ordem, gênero e espécie. Anos depois, passou a usar de forma sistemática um jeito simples de dar nome: **duas palavras em latim** para cada espécie, a **nomenclatura binomial**. Em vez de uma frase descrevendo a planta, um nome curto e único. Os marcos oficiais dessa nomenclatura são duas obras dele: *Species Plantarum* (**1753**), com cerca de 6 mil espécies de plantas, e a **10ª edição** do *Systema Naturae* (**1758**), com cerca de 4.400 espécies de animais. Nomes mais antigos que essas datas não valem. Foi nessa 10ª edição que Lineu nos deu o nome ***Homo sapiens*** ("homem sábio") e nos colocou entre os primatas, ao lado dos macacos, o que chocou muita gente na época.
>
> Lineu reconhecia três reinos: animal, vegetal e mineral. Ele era **fixista**: acreditava que as espécies tinham sido criadas assim e não mudavam. Seu sistema era em parte **artificial**: as plantas, por exemplo, eram separadas pelo número de estames das flores. Depois de Darwin (*A Origem das Espécies*, 1859), as categorias de Lineu ganharam um novo sentido: seres do mesmo grupo se parecem porque **descendem de um ancestral comum**. O sistema de nomes continua o mesmo até hoje.

**Animação:** a página de rosto estilizada do *Systema Naturae* (desenho próprio, sem copiar a original) se abre em "gavetas" encaixadas: reino → classe → ordem → gênero → espécie. Ao lado, um "antes e depois": a frase-nome longa de uma planta, em latim, encolhendo até virar duas palavras.
**Interação "Frase ou binômio":** para três espécies (uma planta, o ser humano e um animal), o aluno alterna entre o nome descritivo pré-Lineu (resumido e traduzido) e o binômio. Sugestão para a planta: tomateiro, com uma frase-nome **ilustrativa** escrita pela equipe no estilo da época ("solano de caule herbáceo, folhas recortadas e fruto liso") → *Solanum lycopersicum*. A tela deve dizer "frase no estilo pré-Lineu, não é citação".

**Cartão "No ENEM":**
> Lineu é o "pai da taxonomia" e da **nomenclatura binomial**. Guarde três ideias: ele criou o sistema de **categorias hierárquicas**, deu **dois nomes em latim** a cada espécie, e era **fixista**. A classificação que usamos hoje mantém os nomes de Lineu, mas o critério mudou: agora é o **parentesco evolutivo**, uma ideia que só veio com Darwin.

---

## Seção · Categorias (`categorias`)

### C1 `#categorias/hierarquia` · "As categorias taxonômicas"
- **Subtítulo:** "do domínio à espécie, cada vez mais parecidos"

**Texto do aluno:**
> As **categorias taxonômicas** se encaixam como caixas, umas dentro das outras: **domínio**, **reino**, **filo**, **classe**, **ordem**, **família**, **gênero** e **espécie**. Cada grupo concreto, como "mamíferos" ou "felídeos", é um **táxon**. Quanto mais alta a categoria, mais seres ela reúne e menos características eles têm em comum; quanto mais baixa, menos seres e mais parecidos. Em botânica, ainda se usa **divisão** no lugar de filo. Entre as categorias principais podem entrar outras (subfilo, superordem, subfamília), quando é preciso mais detalhe.
>
> Veja três animais da sua casa (ou da sua rua). O ser humano, o cão e o gato estão no mesmo domínio, no mesmo reino, no mesmo filo e na mesma classe: são **mamíferos**. O cão e o gato também estão na mesma **ordem**, a dos **carnívoros**, e se separam na família: o cão é um **canídeo** (como o lobo e a raposa), e o gato, um **felídeo** (como a onça e o leão). O ser humano fica em outra ordem, a dos **primatas**. Conclusão: o cão é mais aparentado com o gato do que com o ser humano, porque divide com o gato **mais categorias**. Conhecemos e nomeamos cerca de **1,9 milhão de espécies** (Chapman, 2009); as estimativas do total na Terra chegam a cerca de **8,7 milhões** só de eucariontes (Mora e colaboradores, 2011). Ou seja, a maior parte da vida ainda nem tem nome.

**Quadro (Amabis; Lopes):**

| Categoria | Ser humano | Cão | Gato |
|---|---|---|---|
| Domínio | Eukarya | Eukarya | Eukarya |
| Reino | Animalia | Animalia | Animalia |
| Filo | Chordata | Chordata | Chordata |
| Classe | Mammalia | Mammalia | Mammalia |
| Ordem | Primates | Carnivora | Carnivora |
| Família | Hominidae | Canidae | Felidae |
| Gênero | *Homo* | *Canis* | *Felis* |
| Espécie | *Homo sapiens* | *Canis familiaris* (ou *Canis lupus familiaris*) | *Felis catus* |

**Animação:** "caixas dentro de caixas", em perspectiva. Cada categoria é uma caixa da sua cor (domínio violeta, espécie vermelho), com ícones dos seres que cabem nela. Ao descer da caixa "Animalia" para "Mammalia", "Carnivora", "Felidae", "*Felis*", os ícones de fora somem (minhoca, peixe, ser humano, cão) até restar só o gato. Um contador mostra "seres neste grupo: muitos → poucos" e "características em comum: poucas → muitas".
**Interação "Até onde vão juntos?":** o aluno escolhe dois seres numa lista (ser humano, chimpanzé, cão, lobo, gato, onça-pintada, galinha, sapo, abelha, milho). As duas colunas da tabela acendem juntas até a última categoria em comum, e a tela diz: "cão e lobo: mesmo gênero (*Canis*)"; "cão e gato: mesma ordem (Carnivora)"; "ser humano e galinha: mesmo filo (Chordata)"; "abelha e milho: só o domínio (Eukarya)". Dados da lista: chimpanzé *Pan troglodytes* (Hominidae); lobo *Canis lupus*; onça-pintada *Panthera onca* (Felidae); galinha *Gallus gallus* (classe Aves); sapo-cururu *Rhinella* (classe Amphibia); abelha *Apis mellifera* (filo Arthropoda); milho *Zea mays* (reino Plantae).

**Cartão "No ENEM":**
> Decore a ordem **domínio, reino, filo, classe, ordem, família, gênero, espécie** (uma frase para lembrar: "**D**ona **R**ita **F**ez **C**afé **O**ntem; **F**oi **G**ostoso **E**ssa vez"). A questão típica dá uma tabela e pergunta quais seres são **mais aparentados**: são os que dividem a categoria **mais baixa**. Dois seres do mesmo gênero estão obrigatoriamente na mesma família, ordem, classe e assim por diante; o contrário não vale.

---

## Seção · Espécie (`especie`)

### E1 `#especie/conceito` · "O que é uma espécie"
- **Subtítulo:** "cruzar e ter filhos férteis, e onde a regra falha"

**Texto do aluno:**
> Pelo **conceito biológico de espécie**, proposto por Ernst **Mayr** (1942), espécie é um grupo de populações cujos indivíduos **se cruzam na natureza** e geram **descendentes férteis**, e que estão **isoladas reprodutivamente** de outros grupos. Por isso um chihuahua e um dogue alemão, apesar de tão diferentes, são da mesma espécie: podem cruzar e ter filhotes férteis. Já o cavalo e o jumento são de espécies diferentes. O cruzamento de uma **égua** (*Equus caballus*, 2n = 64 cromossomos) com um **jumento** (*Equus asinus*, 2n = 62) gera a **mula** (fêmea) ou o **burro** (macho), com 2n = **63**. Esse híbrido é forte e muito usado no campo, mas é **estéril**: como os cromossomos vindos do pai e da mãe são diferentes, eles não formam pares na **meiose**, e quase não se formam gametas viáveis (há raríssimos registros de mulas que tiveram filhotes). O **bardoto** (cavalo com jumenta) também é estéril. O **ligre** (leão com tigresa) só nasce em cativeiro, onde as duas espécies são forçadas a se encontrar; os machos são estéreis, mas algumas fêmeas já tiveram filhotes, um sinal de que a fronteira entre espécies nem sempre é absoluta.
>
> O conceito biológico é o mais usado no ensino médio, mas tem **limites**. Ele não serve para seres que se reproduzem **sem sexo**, como as bactérias, porque não há cruzamento para testar. Não serve para **fósseis**, que não podem ser cruzados: neles, as espécies são separadas pela forma (**conceito morfológico**). E há espécies diferentes que geram **híbridos férteis**, sobretudo entre plantas, e também entre alguns animais, como o lobo e o coiote. Por isso os biólogos usam outros conceitos junto, como o **filogenético** (o menor grupo com um ancestral comum exclusivo, identificado hoje sobretudo por DNA). Espécie é uma categoria real na natureza, mas as fronteiras entre elas nem sempre são nítidas, porque elas se formam aos poucos.

**Animação:** um "cruzamento" no estilo cartão: égua (64 cromossomos) + jumento (62) → mula (63). Ao tocar na mula, a tela entra numa célula da gônada e mostra a meiose: 32 cromossomos do cavalo e 31 do jumento tentam formar pares; muitos ficam sem par ou pareiam mal, e a divisão trava, com um "X" sobre os gametas. Comparação lado a lado: dois cavalos (64 + 64, os pares se formam, gametas normais).
**Interação "É a mesma espécie?":** cartões com pares e a resposta depois do toque: chihuahua × dogue alemão (sim, filhotes férteis); égua × jumento (não, mula estéril); leão × tigresa (não, ligre, só em cativeiro e em geral estéril nos machos); duas bactérias *E. coli* (o conceito biológico não se aplica: reprodução assexuada); um fóssil de dinossauro (não se aplica: usar a forma).

**Cartão "No ENEM":**
> Espécie = cruzam **na natureza** e têm **filhos férteis**. A **mula** é o exemplo clássico: nasce, cresce e trabalha, mas é **estéril**, prova de que cavalo e jumento são espécies diferentes. O motivo é cromossômico: 63 cromossomos, que não formam pares na meiose. Saiba também os limites: o conceito **não se aplica** a seres **assexuados** nem a **fósseis**.

---

## Seção · Nomes (`nomes`)

### N1 `#nomes/binomial` · "Nomenclatura binomial"
- **Subtítulo:** "gênero + epíteto, o mesmo nome no mundo todo"

**Texto do aluno:**
> O nome popular muda de lugar para lugar: a mesma planta é **mandioca**, **aipim** ou **macaxeira**, conforme a região do Brasil, e *cassava* em inglês. E um nome popular pode servir para seres bem diferentes: "peixe-boi" é um mamífero, e "estrela-do-mar" não é peixe nem estrela. O **nome científico** resolve isso: é um só, vale no mundo todo e não se repete. Para a mandioca, é ***Manihot esculenta***.
>
> O nome da espécie tem **duas palavras**. A primeira é o **gênero** (*Manihot*); a segunda é o **epíteto específico** (*esculenta*, "comestível"). O epíteto sozinho não identifica nada: *esculenta* aparece em várias plantas de gêneros diferentes. As palavras são em **latim** ou latinizadas, e muitas descrevem o ser vivo (*Homo sapiens*, "homem sábio") ou homenageiam alguém: *Trypanosoma cruzi*, o protozoário da doença de Chagas, foi batizado por Carlos **Chagas** em 1909 em homenagem a Oswaldo **Cruz**. As regras são fixadas por **códigos internacionais**: um para animais (ICZN), um para plantas, algas e fungos (ICN) e um para procariontes. Pela **lei da prioridade**, quando a mesma espécie recebe dois nomes, vale o mais antigo, contando a partir de 1758 para animais e 1753 para plantas.

**Animação:** um mapa do Brasil com balões: "mandioca" no Sudeste, "aipim" no Sul e no Rio, "macaxeira" no Norte e no Nordeste (regiões aproximadas, sem fronteiras exatas). Os balões se fundem num único rótulo em itálico, *Manihot esculenta*. Em seguida, o binômio se separa em duas peças coloridas: "gênero" (laranja) e "epíteto específico" (vermelho).
**Interação "Monte o nome":** peças soltas com gêneros e epítetos (*Homo*, *sapiens*, *Zea*, *mays*, *Aedes*, *aegypti*, *Panthera*, *onca*, *leo*); o aluno junta pares e a tela mostra o ser vivo. Se juntar *Panthera* + *onca*, aparece a onça-pintada; *Panthera* + *leo*, o leão; e o aviso: "mesmo gênero = espécies próximas".

**Cartão "No ENEM":**
> O nome científico é **universal** e **único**, e evita a confusão dos nomes populares. A questão costuma dar nomes como *Panthera onca* e *Panthera leo* e perguntar o parentesco: **mesmo gênero**, portanto também mesma família, ordem e classe. Lembre que o nome da **espécie** é o binômio inteiro; a segunda palavra sozinha é só o **epíteto**.

### N2 `#nomes/regras` · "Como escrever um nome científico"
- **Subtítulo:** "itálico, maiúscula, sp. e subespécie"

**Texto do aluno:**
> As regras são poucas e caem muito em prova:
> 1. O nome científico vai em **itálico** no texto digitado; escrito à mão, **sublinhado** (cada palavra separadamente).
> 2. O **gênero** começa com letra **maiúscula**; o **epíteto**, sempre com **minúscula**, mesmo quando homenageia uma pessoa ou um lugar: *Trypanosoma cruzi*, *Aedes aegypti*.
> 3. Depois da primeira vez no texto, o gênero pode ser **abreviado** pela inicial: *T. cruzi*, *E. coli* (*Escherichia coli*). O epíteto nunca aparece sozinho.
> 4. Quando não se sabe (ou não importa) a espécie, escreve-se o gênero seguido de **sp.** (uma espécie) ou **spp.** (várias): *Rhinella* sp., *Plasmodium* spp. O "sp." **não** vai em itálico.
> 5. A **subespécie** ganha uma terceira palavra, também em itálico e minúscula: é o **nome trinomial**. A cascavel brasileira é *Crotalus durissus terrificus*; quem considera o cão uma subespécie do lobo escreve *Canis lupus familiaris*.
> 6. O nome do **autor** e o ano podem vir depois, sem itálico: *Homo sapiens* Linnaeus, 1758.
> 7. Nomes de categorias **acima do gênero** (família, ordem, classe...) começam com maiúscula e, no uso escolar, **não** vão em itálico: Hominidae, Felidae, Mammalia. Nos animais, o nome de família termina em **-idae**; nas plantas, em **-aceae** (Poaceae, a família do milho e da cana).

**Animação:** uma "lupa de revisor" passa sobre um nome e destaca cada regra com um rótulo: a maiúscula do gênero, a minúscula do epíteto, o itálico, o "sp." reto.
**Interação "Corretor de nomes":** dez nomes escritos de jeitos diferentes, e o aluno marca "certo" ou "errado"; nos errados, a tela aponta a regra quebrada e mostra a forma correta. Lista sugerida:
1. *Homo sapiens* (certo);
2. *homo sapiens* (errado: gênero com minúscula);
3. *Trypanosoma Cruzi* (errado: epíteto com maiúscula);
4. Aedes aegypti, sem itálico, digitado (errado: falta o itálico);
5. *Rhinella sp.*, com o "sp." em itálico (errado: "sp." fica reto);
6. *Rhinella* sp. (certo);
7. *E. coli*, depois de *Escherichia coli* já ter aparecido (certo);
8. *coli*, sozinho (errado: epíteto nunca aparece sozinho);
9. *Crotalus durissus terrificus* (certo: subespécie);
10. *Felidae*, em itálico, como nome de família (errado no padrão escolar: família sem itálico).
Opcional: um modo "escreva você", em que o aluno digita um nome e o corretor verifica maiúsculas e o "sp." (o itálico não dá para checar num campo de texto simples; nesse caso, a tela só lembra a regra).

**Cartão "No ENEM":**
> Regras que a prova cobra: **itálico** (ou sublinhado à mão); **gênero com maiúscula**, **epíteto com minúscula**; o binômio inteiro é a espécie; **sp.** quando a espécie não é identificada; **três nomes** indicam **subespécie**. Pegadinha clássica: em *Trypanosoma cruzi*, o "c" é minúsculo, mesmo homenageando Oswaldo Cruz.

---

## Seção · Sistemas (`sistemas`)

### S1 `#sistemas/reinos` · "De dois a cinco reinos"
- **Subtítulo:** "o sistema de Whittaker"

**Texto do aluno:**
> Lineu dividia os seres vivos em **dois reinos**: animais e vegetais. O microscópio complicou a história: onde pôr seres de uma célula só, alguns que nadam e fazem fotossíntese ao mesmo tempo? O alemão **Ernst Haeckel** (1866) criou um terceiro reino, **Protista**, para os seres microscópicos. Depois, ficou clara a grande diferença entre a célula **procarionte** (sem núcleo organizado) e a **eucarionte** (com núcleo envolvido por membrana), confirmada nos anos 1950 e 1960 pelo microscópio eletrônico. **Herbert Copeland** (1956) separou as bactérias num quarto reino, **Monera**.
>
> Em **1969**, o norte-americano **Robert Whittaker** propôs o **sistema de cinco reinos**, que ainda organiza a maior parte dos livros do ensino médio. Ele usou três critérios: o tipo de **célula** (procarionte ou eucarionte), o **número de células** (uni ou pluricelular) e o **modo de nutrição** (fotossíntese, absorção ou ingestão). Os reinos são: **Monera** (procariontes: bactérias e cianobactérias); **Protoctista** ou **Protista** (eucariontes simples: protozoários e algas); **Fungi** (fungos, que absorvem o alimento e têm parede de quitina); **Plantae** (plantas, pluricelulares, que fazem fotossíntese); e **Animalia** (animais, pluricelulares, que ingerem o alimento). No original de Whittaker, as algas pluricelulares ficavam em Plantae. Lynn **Margulis** e Karlene Schwartz (1982) reorganizaram o reino dos eucariontes simples com o nome **Protoctista** e levaram para ele todas as algas; Plantae ficou só com os seres que se desenvolvem a partir de um **embrião**. É essa versão que os livros do ensino médio usam. Os **vírus** não entram em nenhum reino: não têm célula (ver `../morfofisiologia/index.html#teoria/virus`).

**Quadro (versão dos livros do ensino médio, com o Protoctista de Margulis; Amabis, Lopes):**

| Reino | Célula | Nº de células | Nutrição | Exemplos |
|---|---|---|---|---|
| Monera | procarionte | unicelular | autótrofa ou heterótrofa | bactérias, cianobactérias |
| Protoctista (Protista) | eucarionte | uni ou pluricelular simples | autótrofa (algas) ou heterótrofa (protozoários) | ameba, *Plasmodium*, algas |
| Fungi | eucarionte | uni ou pluricelular | heterótrofa por absorção | cogumelos, bolores, leveduras |
| Plantae | eucarionte | pluricelular, com embrião | autótrofa (fotossíntese) | musgos, samambaias, pinheiros, plantas com flores |
| Animalia | eucarionte | pluricelular | heterótrofa por ingestão | esponjas, insetos, peixes, mamíferos |

**Animação:** a árvore "de reinos" cresce com a linha do tempo: 1735, dois galhos (animal e vegetal); 1866, surge Protista; 1956, surge Monera na base; 1969, Fungi se separa de Plantae. Cada reino ganha ícones de exemplos.
**Interação "Em que reino?":** um fluxograma com os três critérios de Whittaker, em perguntas de sim ou não: "Tem núcleo organizado?" → "É pluricelular?" → "Faz fotossíntese, absorve ou ingere?". O aluno escolhe um ser (bactéria, levedura, cogumelo, ameba, alga verde unicelular, samambaia, esponja, onça) e percorre as perguntas até o reino. A levedura ensina que fungo pode ser unicelular; a esponja, que animal pode não ter tecidos verdadeiros e mesmo assim ingerir alimento.

**Cartão "No ENEM":**
> Saiba os **critérios** de Whittaker: **célula** (procarionte só em Monera), **número de células** e **nutrição** (autótrofa, absorção, ingestão). Pegadinhas: **fungo não é planta** (não faz fotossíntese, tem quitina na parede e guarda glicogênio, como os animais); **cianobactéria** faz fotossíntese, mas é Monera; e **vírus** não está em nenhum reino.

### S2 `#sistemas/dominios` · "Os três domínios"
- **Subtítulo:** "Woese, o RNA e as arqueas"

**Texto do aluno:**
> Nos anos 1970, o microbiologista norte-americano **Carl Woese** passou a comparar seres vivos por uma molécula que todos têm: o **RNA ribossômico** (o RNA da subunidade menor do ribossomo, 16S nos procariontes). Quanto mais parecidas as sequências, mais próximo o parentesco. Em **1977**, com George Fox, ele descobriu que alguns "procariontes", muitos vivendo em ambientes extremos (fontes termais, água muito salgada, pântanos sem oxigênio), eram tão diferentes das bactérias quanto das plantas e animais. Em **1990**, Woese, Kandler e Wheelis propuseram uma categoria acima do reino, o **domínio**, e dividiram a vida em três: **Bacteria**, **Archaea** e **Eukarya**.
>
> O antigo reino Monera ficou dividido em dois domínios. As **arqueas** parecem bactérias por fora (são procariontes, sem núcleo), mas por dentro têm muito em comum com os eucariontes: algumas têm proteínas parecidas com as **histonas** que enrolam o DNA, e a enzima que copia os genes em RNA (a RNA polimerase) é complexa, com muitas subunidades, como a nossa. Elas não têm **peptidoglicano** na parede, e os lipídios da membrana são de outro tipo. Muitas são **extremófilas**, e algumas vivem no nosso intestino e no do gado, onde produzem **metano**. Os outros quatro reinos de Whittaker (Protoctista, Fungi, Plantae e Animalia) cabem todos no domínio **Eukarya**. Pesquisas recentes com DNA sugerem até que os eucariontes surgiram de dentro do grupo das arqueas; é um debate ainda em aberto.

**Quadro (Woese et al., 1990; Raven, cap. 12; Campbell, cap. 26):**

| Característica | Bacteria | Archaea | Eukarya |
|---|---|---|---|
| Núcleo com membrana | não | não | sim |
| Organelas com membrana | não | não | sim |
| Peptidoglicano na parede | sim (na maioria) | não | não |
| Histonas no DNA | não | algumas | sim |
| RNA polimerase | um tipo, simples | um tipo, complexa (parecida com a dos eucariontes) | três tipos, complexas |
| Exemplos | *E. coli*, cianobactérias | metanogênicas, halófilas, termófilas | protoctistas, fungos, plantas, animais |

**Animação:** a árvore universal com três troncos saindo de um ancestral comum (LUCA, "último ancestral comum universal"). Na base, uma "régua" de sequências de RNA ribossômico: o aluno vê trechos de letras alinhadas (sequência fictícia e didática, rotulada como tal) e as diferenças acendem; quanto mais diferenças, mais longe os ramos.
**Interação "5 reinos ↔ 3 domínios":** um botão alterna os dois sistemas. Os cinco blocos coloridos de Whittaker deslizam e se reencaixam: Monera se parte em dois (Bacteria azul e Archaea laranja), e Protoctista, Fungi, Plantae e Animalia entram juntos no bloco Eukarya (verde). Ao tocar em Archaea, aparecem os ambientes extremos com ícones (fonte termal, salina, pântano, intestino da vaca).

**Cartão "No ENEM":**
> Os três domínios são **Bacteria**, **Archaea** e **Eukarya**, e se baseiam em comparação **molecular** (RNA ribossômico), não só na aparência. A ideia cobrada: o reino **Monera foi dividido** em Bacteria e Archaea, e as **arqueas**, embora procariontes, são **mais próximas dos eucariontes** do que das bactérias. Domínio é a categoria **acima** do reino.

---

## Seção · Cladística (`cladistica`)

### K1 `#cladistica/cladograma` · "Lendo um cladograma"
- **Subtítulo:** "ramos, nós e o ancestral comum"

**Texto do aluno:**
> A **cladística**, ou sistemática filogenética, foi proposta pelo entomólogo alemão **Willi Hennig** (1950). Ela classifica os seres pela **história evolutiva**: dois grupos são próximos quando têm um **ancestral comum recente**. Essa história é desenhada num **cladograma**. As pontas dos ramos são os grupos atuais. Cada ponto em que um ramo se divide é um **nó**, e representa o **ancestral comum** de tudo o que fica acima dele. As características marcadas nos ramos são as **novidades evolutivas** (**caracteres derivados**) que surgiram naquele ancestral e foram herdadas por todos os seus descendentes. Uma novidade compartilhada por um grupo, como o pelo nos mamíferos, é uma **sinapomorfia**, e é ela que mostra o parentesco.
>
> Para saber quem é mais aparentado com quem, procure o **ancestral comum mais recente**, e não quem está desenhado mais perto. Dois grupos que saem do mesmo nó são **grupos-irmãos**. Os ramos podem **girar** em torno do nó, como um móbile, sem mudar o parentesco. E um cladograma não mostra "quem evoluiu de quem" entre os seres atuais: o ser humano **não descende** do chimpanzé; os dois descendem de um ancestral comum que não era nenhum dos dois.

**Animação:** cladograma dos vertebrados, com sete pontas: lampreia, tubarão, sapo, ser humano, lagarto, crocodilo e ave. As sinapomorfias aparecem em marcas âmbar sobre os ramos, de baixo para cima: **crânio** (todos), **mandíbula** (do tubarão em diante), **quatro membros** (do sapo em diante), **ovo amniótico** (ser humano, lagarto, crocodilo, ave), **pelos e glândulas mamárias** (só o ser humano), **moela** (crocodilo e ave) e **penas** (só a ave). Topologia: (lampreia, (tubarão, (sapo, (ser humano, (lagarto, (crocodilo, ave)))))).
**Interações:**
1. **"Ancestral comum":** o aluno toca em duas pontas e o nó do ancestral comum mais recente acende, com o ramo até cada uma. Ex.: crocodilo e ave → o nó dos dois; crocodilo e lagarto → um nó mais abaixo. Conclusão mostrada: "o crocodilo é mais aparentado com a ave do que com o lagarto".
2. **"Gire o nó":** arrastar um nó gira os ramos (por exemplo, ave e crocodilo trocam de lado), e a tela confirma "o parentesco não mudou".
3. **"O mesmo cladograma?":** três desenhos com as pontas em ordens diferentes; o aluno marca quais contam a mesma história (dois deles são o mesmo cladograma girado).

**Cartão "No ENEM":**
> Para ler um cladograma: o parentesco é dado pelo **nó** (ancestral comum) **mais recente**, não pela distância entre as pontas no desenho. A característica marcada num ramo está presente em **todos** os grupos acima dela. Pegadinha: "o ser humano veio do macaco" está errado; o cladograma mostra um **ancestral comum**, não um descendendo do outro.

### K2 `#cladistica/grupos` · "Monofilético, parafilético, polifilético"
- **Subtítulo:** "quem fica dentro e quem fica fora"

**Texto do aluno:**
> Um **grupo monofilético**, ou **clado**, reúne um ancestral comum e **todos** os seus descendentes. Para a cladística, só os grupos monofiléticos são grupos naturais: mamíferos, aves, vertebrados e tetrápodes são exemplos. No cladograma, é o que se "corta" com um único golpe de tesoura num ramo: sai tudo o que está acima dele.
>
> Um **grupo parafilético** reúne um ancestral comum e só **parte** dos seus descendentes. O exemplo clássico são os **répteis** do jeito tradicional (lagartos, cobras, tartarugas e crocodilos): o crocodilo é mais aparentado com a **ave** do que com o lagarto, e o grupo deixa a ave de fora. Por isso a cladística diz que as aves são **répteis**, e mais exatamente **dinossauros** que sobreviveram. "Peixes" também é parafilético: deixa de fora os tetrápodes, que descendem de peixes. Um **grupo polifilético** junta seres de linhagens diferentes **sem** o ancestral comum deles, só porque se parecem: "animais de sangue quente" (aves e mamíferos, que desenvolveram a homeotermia de forma independente) ou "algas". Os nomes tradicionais continuam úteis no dia a dia e nos livros, mas é bom saber quando não são clados.

**Animação:** o mesmo cladograma de K1. O aluno escolhe pontas e a tela pinta o grupo:
- tudo acima de um nó (verde): "**monofilético**";
- um nó com um ramo excluído (amarelo, com o ramo de fora tracejado): "**parafilético**";
- pontas de ramos separados, sem o ancestral comum (vermelho): "**polifilético**".
Botões prontos: "Mamíferos" (mono), "Répteis tradicionais" (para: a ave fica tracejada), "Répteis + aves" (mono), "Peixes" (lampreia + tubarão, para, no contexto dos vertebrados), "Sangue quente" (ser humano + ave, poli).
**Faixa "Tesoura":** um corte num ramo separa um clado; o aluno vê que só se tira o grupo inteiro de uma vez.

**Cartão "No ENEM":**
> **Monofilético** = ancestral + **todos** os descendentes (o único aceito pela cladística). **Parafilético** = ancestral + **parte** dos descendentes (répteis sem as aves; peixes sem os tetrápodes). **Polifilético** = linhagens diferentes **sem** o ancestral comum (aves + mamíferos como "sangue quente"). Se um cladograma mostrar crocodilos mais perto das aves, a prova espera que você conclua que "répteis", sem as aves, não é grupo natural.

### K3 `#cladistica/homologia` · "Homologia e analogia"
- **Subtítulo:** "mesma origem ou mesma função"

**Texto do aluno:**
> Estruturas **homólogas** têm a **mesma origem** evolutiva e embrionária, mesmo que hoje tenham funções diferentes. O braço humano, a nadadeira da baleia, a asa do morcego, a asa da ave e a pata do cão têm os mesmos ossos na mesma ordem (**úmero**, **rádio e ulna**, ossos do punho e dos dedos), porque vêm do membro anterior de um ancestral comum. Cada linhagem adaptou esse membro a um modo de vida: é a **divergência** (ou **irradiação adaptativa**). Só as homologias revelam parentesco e entram na construção do cladograma.
>
> Estruturas **análogas** têm a **mesma função**, mas **origens diferentes**. A asa de uma borboleta (uma dobra da parede do corpo, sem ossos) e a asa de uma ave (um membro com ossos) servem para voar, mas surgiram de forma independente. O formato hidrodinâmico do tubarão (peixe), do golfinho (mamífero) e do extinto ictiossauro (réptil) também é análogo. É a **convergência evolutiva**: ambientes parecidos selecionam soluções parecidas em linhagens que não são próximas. Atenção: a asa da ave e a asa do morcego são **homólogas como membros anteriores** (os mesmos ossos), mas **análogas como asas**, porque o voo surgiu separadamente nas duas linhagens (na ave, a asa é sustentada por penas; no morcego, por uma pele esticada entre os dedos).

**Animação:** os membros anteriores de ser humano, baleia, morcego, ave e cão lado a lado, em desenho próprio, com os ossos nas mesmas cores: úmero (âmbar), rádio e ulna (azul), punho e dedos (verde). Um botão "comparar com a borboleta" coloca a asa do inseto ao lado: ela não tem nenhum dos ossos coloridos.
**Faixa "Origem × função":** uma alternância entre dois modos. No modo "origem", os membros homólogos se agrupam pela cor dos ossos. No modo "função", as estruturas se agrupam pelo uso (voar: ave, morcego, borboleta; nadar: baleia, tubarão, golfinho), e a tela marca em cada par se é homologia ou analogia.
**Interação "Homólogo ou análogo?":** cartões com pares: braço humano × nadadeira da baleia (homólogos); asa da ave × asa da borboleta (análogas); nadadeira do tubarão × nadadeira do golfinho (análogas); asa da ave × asa do morcego (homólogas como membros, análogas como asas: a resposta pede as duas coisas).

**Cartão "No ENEM":**
> **Homologia** = mesma **origem**, função pode mudar (braço, nadadeira da baleia, asa do morcego): indica **ancestral comum** e **divergência**. **Analogia** = mesma **função**, origens diferentes (asa de inseto e de ave; corpo do tubarão e do golfinho): indica **convergência**, e **não** indica parentesco. A prova costuma mostrar o desenho dos ossos do membro e perguntar qual conceito ele ilustra.

---

## Seção · Chave (`chave`)

### Ch1 `#chave/dicotomica` · "Chave dicotômica"
- **Subtítulo:** "duas opções por vez, até o nome"

**Texto do aluno:**
> Uma **chave dicotômica** é uma ferramenta para **identificar** um ser vivo. Ela funciona como uma sequência de perguntas com **duas alternativas** que se excluem ("tem penas" ou "não tem penas"). Cada escolha leva a uma nova pergunta ou ao nome do ser. Os biólogos usam chaves em campo e em museus para identificar plantas, insetos, peixes; os guias de aves e de árvores são cheios delas.
>
> Uma boa chave usa características **fáceis de observar** e que não dependem de opinião (contar pernas é melhor que "é bonito" ou "é grande"). A chave não precisa seguir a ordem do parentesco: ela serve para chegar ao nome, não para contar a história evolutiva. E pode terminar em níveis diferentes: numa ponta, a espécie (*Panthera onca*); noutra, só o gênero (*Rhinella* sp.) ou um grupo maior, quando não é possível ir além só olhando.

**Chave do módulo (oito animais do Brasil):**

| Passo | Alternativa A | Alternativa B |
|---|---|---|
| 1 | Tem coluna vertebral → **2** | Não tem coluna vertebral → **5** |
| 2 | Corpo coberto de penas → **tucano-toco** (*Ramphastos toco*) | Sem penas → **3** |
| 3 | Corpo coberto de pelos → **onça-pintada** (*Panthera onca*) | Sem pelos → **4** |
| 4 | Pele com escamas secas → **jacaré-de-papo-amarelo** (*Caiman latirostris*) | Pele lisa, úmida e sem escamas → **sapo-cururu** (*Rhinella* sp.) |
| 5 | Pernas articuladas → **6** | Sem pernas articuladas → **7** |
| 6 | Oito pernas → **aranha-caranguejeira** (família Theraphosidae) | Seis pernas → **abelha** (*Apis mellifera*) |
| 7 | Corpo mole, dividido em anéis → **minhoca** (filo Annelida) | Corpo em forma de estrela, em geral com cinco braços, e espinhos na pele → **estrela-do-mar** (classe Asteroidea) |

**Interação (o centro do módulo):**
1. **"Identifique":** um animal "misterioso" aparece em desenho (sem o nome). O aluno responde cada passo da chave tocando em A ou B; o caminho percorrido acende numa árvore ao lado. Ao chegar no fim, o nome aparece. Se escolher errado (por exemplo, "sem penas" para o tucano), a chave chega a um nome que não bate com o desenho, e a tela pede para voltar e olhar de novo a característica.
2. **"Ao contrário":** o aluno escolhe um dos oito animais e a tela mostra o caminho inteiro dele na chave, com as características lidas em sequência ("tem coluna vertebral, sem penas, com pelos: onça-pintada").
3. **"Monte sua chave"** (opcional, para depois do lançamento): quatro objetos do dia a dia ou quatro folhas, e o aluno escolhe as perguntas de sim ou não que separam todos eles.
**Visual:** a chave desenhada como árvore de decisão, que cresce para baixo. Usar ícones próprios, com o mesmo traço dos ícones da Íris.

**Cartão "No ENEM":**
> Questões com **chave dicotômica** dão a chave pronta e um ser vivo (ou uma descrição dele) e pedem o nome ou o grupo. O segredo é **seguir os passos em ordem**, sem pular, e ler as duas alternativas antes de escolher. Lembre que a chave serve para **identificar**, não para mostrar parentesco: dois seres vizinhos na chave não são, por isso, parentes próximos.

---

## Notas para a implementação
- **Itálico:** todo nome de gênero, espécie e subespécie aparece em itálico na tela, inclusive em rótulos de animação e botões. "sp." e "spp." ficam retos. Nomes de família para cima ficam retos. Vale também para o texto alternativo das imagens, quando possível (`<i>` ou `<em>`).
- **Desenhos:** todos próprios (animais, membros, página do *Systema Naturae*), sem copiar figuras de livros. As proporções dos membros em K3 são esquemáticas; o rodapé deve dizer "desenho esquemático; cores indicam ossos homólogos".
- **Sequências de RNA em S2:** são fictícias e didáticas; o rodapé deve dizer isso.
- **Mapa da mandioca em N1:** regiões aproximadas, sem linhas de fronteira, com a nota "os nomes variam também dentro de cada região".
- **Links para fora do módulo:** Morfofisiologia (`#teoria/virus`), Embriologia (`#desenvolvimento/blastoporo`, em K1, como outro exemplo de caráter que separa grupos) e, quando existirem, os módulos dos seres vivos (item 9) e da evolução (item 12).
- **Fora do escopo:** características detalhadas de cada reino e de cada filo (item 9), mecanismos de especiação e de isolamento reprodutivo (item 12), métodos de construção de árvores (parcimônia, distância, máxima verossimilhança), relógio molecular, códigos de nomenclatura em detalhe (tipos nomenclaturais, homônimos, sinônimos) e os supergrupos atuais de eucariontes.

---


## Revisão cruzada · 🧬 Sapien (2026-11-15)

Reli o roteiro do 🔬 Taxon inteiro, como segundo professor. Corrigi direto no texto acima:

1. **H2, binomial:** o texto dava a entender que o binômio já vinha sistemático em 1735. Na 1ª edição, Lineu tinha as categorias, mas o uso consistente de duas palavras só aparece em 1753 (*Species Plantarum*). Ficou "anos depois, passou a usar de forma sistemática".
2. **H2, frase-nome do tomateiro:** a frase pré-Lineu da interação foi escrita pela equipe, não tirada de uma obra. Marquei como "ilustrativa" e pedi o aviso na tela, para não parecer citação histórica.
3. **E1, ligre:** o texto dizia que o ligre é estéril, "como a mula". Os machos são, mas há fêmeas de ligre que já tiveram filhotes. Reescrevi: o ligre só nasce em cativeiro, e o caso das fêmeas virou mais um exemplo dos limites do conceito.
4. **E1, mula:** acrescentei que há raríssimos registros de mulas com filhotes. A conclusão para a prova não muda (mula = estéril), mas o texto não fica desmentível.
5. **S1, Copeland:** o texto ligava o reino Monera de 1956 ao microscópio eletrônico como causa. A distinção procarionte/eucarionte é anterior; o microscópio eletrônico a confirmou nos anos 1950 e 1960. Reescrevi sem a relação de causa.
6. **S1, Plantae e algas:** no original de Whittaker (1969), as algas pluricelulares ficavam em **Plantae**; foram Margulis e Schwartz (1982) que as levaram para Protoctista e definiram Plantae pelo embrião. O texto e o quadro misturavam as duas versões. Agora o texto explica a mudança, e o quadro diz que é a versão dos livros do ensino médio.
7. **S2, RNA polimerase (erro de fato):** o quadro dizia que as arqueas têm "vários tipos" de RNA polimerase. Elas têm **um tipo**, complexo e parecido com o dos eucariontes; os eucariontes têm **três** (I, II e III). Corrigi o quadro e o texto.
8. **K1, sinapomorfias:** "vértebras" como caráter de todos os vertebrados é discutível na lampreia (tem só elementos rudimentares); troquei por **crânio**. Tirei "coração com quatro cavidades" do ramo crocodilo + ave: está certo para os arcossauros, mas o aluno vai lembrar que nós também temos quatro cavidades (surgiram de forma independente, por convergência) e ler aquilo como erro. Ficou só a **moela**. Se o 🧭 Atlas quiser, esse coração é um bom exemplo extra de analogia em K3.
9. **Ch1, estrela-do-mar:** "cinco braços" virou "em geral com cinco braços" (há espécies com mais).

Conferi e mantive: a topologia do cladograma (mamíferos irmãos dos sauropsídeos; crocodilo irmão da ave); os cromossomos da mula (64, 62 e 63); as datas de Haeckel (1866), Whittaker (1969), Woese e Fox (1977), Woese, Kandler e Wheelis (1990), Hennig (1950) e Mayr (1942); os números de espécies (Chapman, 2009: cerca de 1,9 milhão descritas; Mora e colaboradores, 2011: cerca de 8,7 milhões de eucariontes); *Canis familiaris* com *Canis lupus familiaris* entre parênteses (os dois usos são aceitos; Amabis e Lopes usam o primeiro); *Crotalus durissus terrificus* como subespécie; *Trypanosoma cruzi* (Chagas, 1909); a asa da ave e a do morcego como homólogas como membros e análogas como asas.

**Para o 🧭 Atlas decidir (não muda a ciência):**
- O roteiro está no limite de 12 tópicos. Se precisar enxugar, H1 e H2 viram um tópico só ("De Aristóteles a Lineu"), com a linha do tempo como interação.
- As duas interações mais úteis para a prova são a **chave dicotômica** (Ch1) e o **cladograma** (K1 e K2, que usam o mesmo desenho). Sugiro começar por elas.
- Os cartões "No ENEM" descrevem o tipo de questão, sem citar ano nem item, porque não conferimos as provas do INEP uma a uma. Citar questões reais pede uma rodada de conferência.
- N2, item 10 do corretor: família sem itálico é o padrão da zoologia e dos livros escolares; em botânica, o código recomenda itálico em todos os níveis. Por isso o exemplo é zoológico (*Felidae*) e diz "no padrão escolar". Se aparecer família de planta no corretor, não marcar o itálico como erro.
