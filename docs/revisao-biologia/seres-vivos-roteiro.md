# Roteiro científico: Os Seres Vivos (módulo novo `site/seres-vivos/`)

🔬 Taxon, 2026-11-15. Escrito na "esteira", logo depois dos Vírus; fica pronto para o 🧭 Atlas distribuir. Revisão cruzada: 🧬 Sapien (notas no fim do arquivo).
Item 9 da ementa: "Os seres vivos: características gerais, habitats, morfologia e filogenia dos reinos Monera, Protoctista, Fungi, Plantae (Metaphyta) e Animalia (Metazoa)."

## Mapa do módulo

É o maior item da ementa até agora. A proposta é **um só módulo, com uma seção por reino**, na ordem de Whittaker: **Monera, Protoctista, Fungi, Plantae, Animalia**. São **20 tópicos**. A Taxonomia já explicou o que separa os reinos; aqui cada seção abre o seu reino "por dentro": como é o corpo, onde vive, como se reproduz, o que mudou na evolução e o que tem a ver com a saúde e o ambiente, que é o que o ENEM cobra.

| Seção | Rotas | Tópicos | Prioridade ENEM |
|---|---|---|---|
| Monera | `#monera/celula`, `#monera/reproducao`, `#monera/doencas` | 3 | alta (resistência a antibióticos e doenças) |
| Protoctista | `#protoctista/grupos`, `#protoctista/protozooses` | 2 | alta (protozooses) |
| Fungi | `#fungi/fungos`, `#fungi/liquens` | 2 | média a alta (liquens, decomposição, fermentação) |
| Plantae | `#plantae/conquista`, `#plantae/briofitas`, `#plantae/pteridofitas`, `#plantae/gimnospermas`, `#plantae/angiospermas`, `#plantae/orgaos` | 6 | alta (ciclos de vida, flor e fruto, órgãos) |
| Animalia | `#animalia/novidades`, `#animalia/poriferos-cnidarios`, `#animalia/vermes`, `#animalia/moluscos-anelideos`, `#animalia/artropodes`, `#animalia/cordados`, `#animalia/vertebrados` | 7 | alta (novidades evolutivas, verminoses, artrópodes, vertebrados) |

**Divisão proposta (para o 🧭 Atlas decidir):**
- **Opção A (recomendada): um módulo, cinco seções, 20 tópicos**, construído em **duas ondas**. Onda 1, o que mais cai: M2, M3, P2, F2, V1 a V5, A1, A3, A5 e A7 (13 tópicos). Onda 2, o resto: M1, P1, F1, V6, A2, A4 e A6 (7 tópicos). O menu já mostra as cinco seções desde a onda 1; os tópicos da onda 2 entram depois sem mudar rotas.
- **Opção B: dois módulos**, se o motor ficar pesado com 20 cenas: "Microrganismos e fungos" (`site/microrganismos/`: Monera, Protoctista, Fungi; 7 tópicos) e "Plantas e animais" (`site/plantas-animais/`: 13 tópicos). As rotas internas ficam iguais; muda só o caminho do arquivo.
- Não recomendo um módulo por reino: Fungi e Protoctista ficariam com dois tópicos cada, pequenos demais para um módulo.

**Fronteiras com outros módulos:**
1. **Taxonomia** (`../taxonomia/`): S1 (`#sistemas/reinos`) já tem os critérios de Whittaker e o quadro dos cinco reinos; S2 (`#sistemas/dominios`) já tem Bacteria, Archaea e Eukarya; K1 a K3 já ensinam a ler cladograma, grupos monofiléticos e parafiléticos e homologia. **Nada disso se repete.** Cada seção abre com um link "relembre na Taxonomia". Os cladogramas daqui (V1 e A1) usam a mesma linguagem visual de K1 (marcas âmbar nas novidades) e não ensinam de novo a leitura. As arqueas aparecem só numa frase em M1.
2. **Vírus** (`../virus/`, roteiro pronto): a conversão lisogênica e a transdução (F2 de lá) só são citadas em M2; "antibiótico não age em vírus" (N1 de lá) é só lembrado. O roteiro dos Vírus deixou para cá a **biologia dos mosquitos** (metamorfose, larva na água): isso está em A5, que aponta de volta para D1 dos Vírus (arboviroses).
3. **Célula** (`../celula/`): reaproveitar os modelos 3D `#celula_bacteria` (M1), `#celula_levedura` (F1) e `#celula_vegetal` (V1). Nenhum modelo novo de célula.
4. **Morfofisiologia** (`../morfofisiologia/`): a endossimbiose (origem de mitocôndrias e cloroplastos) fica lá; P1 e V1 só citam.
5. **Bioenergética** (`../bioenergetica/`): fotossíntese, quimiossíntese e fermentação ficam lá. Aqui só aparecem como "modo de nutrição" (M1, P1, F1, V1), com link.
6. **Embriologia** (`../embriologia/`): folhetos (`#desenvolvimento/folhetos`), protostômios e deuterostômios (`#desenvolvimento/blastoporo`), ovo amniótico (`#anexos/amniotico`) e placenta (`#humano/placenta`) ficam lá. A1 e A7 usam essas ideias e apontam para lá, sem explicar de novo.
7. **Histologia** (`../histologia/`): tecidos animais ficam lá. Os tecidos vegetais não têm módulo; V6 traz só o mínimo (xilema, floema, estômatos).
8. **Genética** (item 11): biotecnologia com plasmídeos (insulina, transgênicos) fica lá; M2 só apresenta o plasmídeo.
9. **Fisiologia humana** (item 10): os sistemas do corpo humano e o sistema imune ficam lá. Aqui só a comparação entre grupos de animais (respiração, circulação e excreção em A1 e A7) e o necessário de vacina e soro em M3.
10. **Evolução** (item 12): origem da vida e os mecanismos de evolução ficam lá. A resistência a antibióticos (M2) é usada como exemplo de seleção natural, com link para o futuro módulo.
11. **Ecologia** (`../ecologia/`): ciclo do nitrogênio, relações ecológicas, sucessão, biomas e eutrofização ficam lá. Aqui os seres aparecem com o seu papel (decompositor, fixador de nitrogênio, pioneiro, polinizador) e um link.

**Vocabulário:**
- "Protoctista (ou Protista)", como na Taxonomia; "Plantae (Metaphyta)" e "Animalia (Metazoa)" só no título da seção, como na ementa; no texto, "plantas" e "animais";
- "Monera" para o reino dos livros; quando a frase for sobre parentesco, "bactérias e arqueas";
- "cianobactéria", nunca "alga azul" sem aspas;
- "agente etiológico" (quem causa a doença), "vetor" (quem transmite levando o agente) e "reservatório" (quem mantém o agente na natureza), sempre separados;
- "hospedeiro definitivo" (onde o parasita faz reprodução sexuada) e "hospedeiro intermediário";
- "protozoose", "verminose" (ou helmintose), "micose";
- "hanseníase" e "pessoa com hanseníase"; nunca "lepra" nem "leproso";
- "doença de Chagas" (com "doença de" minúsculo e Chagas maiúsculo);
- "gametófito" (n) e "esporófito" (2n); "anterozoide" para o gameta masculino que nada, "oosfera" para o feminino das plantas;
- "eudicotiledôneas" (as antigas dicotiledôneas) e "monocotiledôneas";
- "pseudofruto" para a parte comestível que não vem do ovário (caju, maçã, morango);
- "seiva bruta" (água e sais, no xilema) e "seiva elaborada" (açúcares, no floema);
- "celoma", "acelomado", "pseudocelomado", "celomado";
- "peixes" e "répteis" como nomes de uso comum, com a nota de que não são clados (ver K2 da Taxonomia).

**Cores (proposta para o 🎨 Apolo):** cada seção usa a **cor do seu reino já usada na Taxonomia** (`site/taxonomia/motor.js`): Monera `#7FB2E5`, Protoctista `#C58BE8`, Fungi `#D9A066`, Plantae `#7BD88F`, Animalia `#FF8C7A`. Assim o aluno que vem da Taxonomia reconhece o reino pela cor. As **novidades evolutivas** nos cladogramas (V1, A1) são marcas **âmbar** `#FFB347`, como em K1. Nos ciclos de vida das plantas, a **fase haploide (n)** fica num fundo azul-claro e a **diploide (2n)** num fundo rosado, sempre na mesma posição da roda (2n em cima, n embaixo), com a **meiose** e a **fecundação** como dois "portões" fixos na roda; o mesmo esquema serve para os três tipos de ciclo em V1. Nas doenças (M3, P2, A3), uma cor por **via de transmissão**, a mesma dos Vírus: vetor (verde-limão), respiratória (azul), sangue e sexual (vermelho), fecal-oral (água e alimento, marrom), e uma nova, **pela pele** (solo, água ou ferimento), em laranja. A bactéria no verde-oliva `#A9C54A` do ícone `cel-bacteria`, como nos Vírus.

**Fontes:**
- AMABIS, J. M.; MARTHO, G. R. *Biologia Moderna*. São Paulo: Moderna, 2016. Vol. 2, unidades sobre seres procariontes, protoctistas, fungos, plantas e animais.
- LOPES, S.; ROSSO, S. *Bio*. São Paulo: Saraiva, 2016. Vol. 2, capítulos sobre os cinco reinos.
- LINHARES, S.; GEWANDSZNAJDER, F.; PACCA, H. *Biologia Hoje*. São Paulo: Ática, 2016. Vol. 2.
- REECE, J. B. et al. *Biologia de Campbell*. 10. ed. Porto Alegre: Artmed, 2015. Caps. 27 (bactérias e arqueas), 28 (protistas), 29 e 30 (plantas), 31 (fungos), 32 a 34 (animais).
- RAVEN, P. H.; EVERT, R. F.; EICHHORN, S. E. *Biologia Vegetal*. 8. ed. Rio de Janeiro: Guanabara Koogan, 2014. Caps. 14 a 20 (procariontes, fungos, protistas, briófitas, plantas vasculares sem semente, gimnospermas, angiospermas) e 23 a 26 (raiz, caule, folha).
- BRUSCA, R. C.; MOORE, W.; SHUSTER, S. M. *Invertebrados*. 3. ed. Rio de Janeiro: Guanabara Koogan, 2018.
- POUGH, F. H.; JANIS, C. M.; HEISER, J. B. *A Vida dos Vertebrados*. 4. ed. São Paulo: Atheneu, 2008.
- TORTORA, G. J.; FUNKE, B. R.; CASE, C. L. *Microbiologia*. 12. ed. Porto Alegre: Artmed, 2017. Caps. 4, 6, 8, 11, 12 e 20 (célula procarionte, crescimento, genética bacteriana, fungos e protozoários, antibióticos).
- NEVES, D. P. *Parasitologia Humana*. 13. ed. São Paulo: Atheneu, 2016 (protozooses e verminoses).
- BRASIL. Ministério da Saúde. *Guia de Vigilância em Saúde*. 6. ed. Brasília, 2023 (tuberculose, hanseníase, cólera, leptospirose, tétano, sífilis, febre maculosa, malária, doença de Chagas, leishmanioses, toxoplasmose, esquistossomose, geo-helmintíases, filariose).
- ORGANIZAÇÃO MUNDIAL DA SAÚDE. Fichas informativas (*fact sheets*) sobre resistência antimicrobiana, tuberculose, hanseníase, malária, doença de Chagas, leishmanioses, esquistossomose e helmintíases transmitidas pelo solo.
- FLEMING, A. On the antibacterial action of cultures of a *Penicillium*. *British Journal of Experimental Pathology*, v. 10, p. 226-236, 1929.
- CHAGAS, C. Nova tripanozomiaze humana. *Memórias do Instituto Oswaldo Cruz*, v. 1, p. 159-218, 1909.

---

## Seção: Monera (`monera`)

Abertura da seção: faixa "relembre na Taxonomia" com link para `../taxonomia/index.html#sistemas/dominios` ("Monera hoje são dois domínios: Bacteria e Archaea").

### M1 `#monera/celula`: "A célula bacteriana"
- **Subtítulo:** "pequena, sem núcleo e presente em todo lugar"

**Texto do aluno:**
> As bactérias são **procariontes**: o DNA fica solto no citoplasma, numa região chamada **nucleoide**, sem membrana em volta. Quase todas medem de **1 a 5 micrômetros**, cerca de dez vezes menos que uma célula humana. O **cromossomo** é uma molécula de DNA **circular**; muitas têm também **plasmídeos**, pequenos círculos de DNA extras, que podem carregar genes úteis, como os de resistência a antibióticos (ver M2). No citoplasma há **ribossomos** menores que os nossos (**70S**), mas nenhuma organela com membrana: nada de mitocôndria, cloroplasto ou retículo. Em volta da membrana plasmática fica a **parede celular**, feita de **peptidoglicano**, que dá forma à célula e impede que ela estoure ao absorver água. Muitas têm por fora uma **cápsula** de açúcares, que as protege das defesas do corpo, **fímbrias** para se prender a superfícies e **flagelos** para nadar.
>
> Em **1884**, o dinamarquês **Hans Christian Gram** criou um jeito de corar bactérias que ainda é usado nos hospitais. As **Gram-positivas** ficam roxas: têm parede grossa de peptidoglicano. As **Gram-negativas** ficam rosadas: têm parede fina e, por fora dela, uma **membrana externa**, que dificulta a entrada de vários antibióticos. Pela forma, as bactérias são **cocos** (esferas), **bacilos** (bastões), **espirilos** (espirais rígidas), **espiroquetas** (espirais flexíveis) e **vibriões** (vírgulas). Os cocos podem ficar em pares (**diplococos**), em fileiras (**estreptococos**) ou em cachos (**estafilococos**).
>
> As bactérias vivem em **todos os ambientes**: solo, água, ar, gelo, fontes quentes e dentro de outros seres. Há bactérias **heterótrofas**, que comem matéria orgânica: as **decompositoras**, que reciclam os restos de seres mortos; as **parasitas**, que causam doenças; e as **mutualísticas**, como as do nosso intestino, que ajudam na digestão e produzem vitamina K. Há bactérias **autótrofas**: as **fotossintetizantes**, como as **cianobactérias**, que têm clorofila *a* e liberam gás oxigênio, e as **quimiossintetizantes**, que tiram energia de substâncias minerais, como as **nitrificantes** do ciclo do nitrogênio (ver Bioenergética e Ecologia). Pela relação com o oxigênio, há **aeróbias** (precisam dele), **anaeróbias obrigatórias** (o oxigênio as mata, como o bacilo do tétano) e **facultativas** (vivem com ou sem, como a *Escherichia coli*). As **cianobactérias** merecem destaque: há cerca de 2,4 bilhões de anos, foram elas que encheram a atmosfera de oxigênio, e algumas, com células especiais chamadas **heterocistos**, fixam o nitrogênio do ar. Em lagos e represas com excesso de nutrientes, podem se multiplicar demais (**floração**) e liberar toxinas que atacam o fígado. As **arqueas**, o outro grupo de procariontes, têm a mesma aparência, mas outra química (ver Taxonomia).

**Animação:** o modelo 3D `#celula_bacteria` do módulo Célula gira; as partes acendem uma a uma com rótulo (cápsula, parede, membrana, nucleoide, plasmídeo, ribossomos, fímbrias, flagelo). Um botão "Gram" corta um pedaço da parede e mostra lado a lado a parede grossa (Gram-positiva, roxa) e a parede fina com membrana externa (Gram-negativa, rosada).
**Interação "Formas e arranjos":** oito silhuetas de bactérias (coco, diplococo, estreptococo, estafilococo, bacilo, espirilo, espiroqueta, vibrião) para arrastar até o nome. Ao acertar, aparece um exemplo: *Streptococcus* (garganta), *Staphylococcus* (pele), *Vibrio cholerae* (cólera), *Treponema pallidum* (sífilis).
**Faixa "Como se alimenta?":** quatro cartões com ícone: decompositora (folha caída), parasita (pulmão), fotossintetizante (sol), quimiossintetizante (rocha com amônia). Cada um abre uma frase e um link (Ecologia, Bioenergética).

**Cartão "No ENEM":**
> Saiba o que a célula bacteriana **tem** (parede de peptidoglicano, membrana, ribossomos 70S, DNA circular, plasmídeos) e o que **não tem** (núcleo e organelas com membrana). Muitas questões cobram o **papel ecológico**: bactérias **decompositoras** reciclam a matéria, bactérias do solo e das raízes **fixam nitrogênio**, e **cianobactérias** fazem fotossíntese mas são Monera, não plantas nem algas. Floração de cianobactérias em represa aparece ligada à **eutrofização**.

### M2 `#monera/reproducao`: "Divisão, troca de genes e resistência"
- **Subtítulo:** "uma vira duas a cada 20 minutos, e o antibiótico escolhe as que sobram"

**Texto do aluno:**
> A bactéria se reproduz de forma **assexuada**, por **divisão binária** (ou cissiparidade): copia o cromossomo, cresce e se divide em duas células iguais. Em condições ideais, a *E. coli* se divide a cada **20 minutos** ou pouco mais. Uma bactéria vira 2, 4, 8, 16... em 10 horas, seriam mais de 1 bilhão. Por isso uma infecção ou um alimento estragado "explodem" em poucas horas. Na prática, a comida e o espaço acabam, e a população para de crescer. Algumas bactérias, como as dos gêneros *Clostridium* e *Bacillus*, formam **endósporos** quando o ambiente piora: uma forma de resistência, com parede grossa, que aguenta fervura, seca e desinfetantes por anos. Para destruir endósporos, os hospitais usam a **autoclave** (vapor a 121 °C sob pressão); é por isso que conservas mal feitas podem guardar o bacilo do **botulismo**.
>
> Mesmo sem sexo, as bactérias variam. Primeiro, por **mutação**: com bilhões de divisões, sempre surgem cópias com erros, e alguns erros são úteis. Segundo, porque elas **trocam genes** por três caminhos: na **transformação**, uma bactéria absorve pedaços de DNA soltos no ambiente, de bactérias mortas (foi o que Frederick **Griffith** viu em 1928 com pneumococos); na **conjugação**, uma bactéria passa uma cópia de um **plasmídeo** para outra por um tubo, o **pilus**; na **transdução**, um **bacteriófago** leva pedaços de DNA de uma bactéria para outra (ver o módulo Vírus).
>
> Os **antibióticos** são substâncias que matam bactérias ou impedem que se multipliquem, atacando o que só a célula bacteriana tem: a **penicilina** impede a construção da **parede**; a tetraciclina e a eritromicina travam os **ribossomos 70S**. Por isso antibiótico **não age em vírus**, que não têm parede nem ribossomos. A **resistência** surge assim: numa população de milhões de bactérias, umas poucas já têm, por mutação ou por um plasmídeo, um gene que as protege. O antibiótico mata as sensíveis e **as resistentes sobrevivem e se multiplicam**: é **seleção natural** em ação. O antibiótico **não cria** a resistência; ele **seleciona** quem já era resistente. Tomar antibiótico sem necessidade (contra gripe, por exemplo), em dose errada ou **parar antes do fim** do tratamento favorece essas sobreviventes. Os genes de resistência ainda passam de uma bactéria para outra por conjugação, até entre espécies diferentes. Assim surgem as **superbactérias**, resistentes a quase todos os antibióticos, um dos maiores problemas de saúde do mundo segundo a OMS.

**Animação:** uma bactéria em divisão binária, com o cromossomo circular sendo copiado e as duas cópias indo para lados opostos; a tela se enche em progressão (1, 2, 4, 8...), com um relógio "cada divisão: cerca de 20 min". Em seguida, três quadros curtos de troca de genes: transformação (DNA solto entrando), conjugação (pilus e plasmídeo passando, plasmídeo em amarelo) e transdução (fago levando um pedaço de DNA).
**Interação "Antibiótico na placa":** uma placa com centenas de bactérias, quase todas verde-oliva (sensíveis) e umas três vermelhas (resistentes, sorteadas a cada rodada). O aluno escolhe: "tratamento completo", "parar no meio" ou "antibiótico para gripe, sem infecção bacteriana". O antibiótico entra como uma onda; as sensíveis somem e as vermelhas se multiplicam. Um gráfico embaixo mostra a porcentagem de resistentes a cada rodada. Com "parar no meio", sobram mais bactérias, e a fração resistente cresce. Um botão "plasmídeo" mostra uma vermelha passando o gene para uma verde vizinha, que fica vermelha. Frase final: "o antibiótico não ensinou as bactérias a resistir; ele eliminou as que não resistiam".

**Cartão "No ENEM":**
> É dos temas mais cobrados do item. A resposta certa fala em **seleção** de bactérias resistentes que **já existiam** na população (por mutação ou por plasmídeos), nunca em bactérias que "se adaptam", "se acostumam" ou "criam resistência para sobreviver": essa é a alternativa lamarckista, sempre errada. Também caem: por que antibiótico não serve para gripe (vírus não têm os alvos), por que não se deve interromper o tratamento, e a reprodução por **divisão binária** com crescimento muito rápido.

### M3 `#monera/doencas`: "Doenças causadas por bactérias"
- **Subtítulo:** "pelo ar, pela água, pela pele, pelo sexo e por vetores"

**Texto do aluno:**
> A maioria das bactérias é inofensiva ou útil, mas algumas causam doenças, por invadirem tecidos ou por produzirem **toxinas**. Separar as doenças pela **via de transmissão** ajuda a lembrar como evitá-las:
>
> **Pelo ar (gotículas e aerossóis).** A **tuberculose** é causada pelo *Mycobacterium tuberculosis*, o bacilo descoberto por Robert **Koch** em **1882**. Ataca sobretudo os pulmões, com tosse por mais de três semanas, febre no fim da tarde, suor noturno e emagrecimento. Tem cura, com antibióticos por **pelo menos seis meses**, gratuitos no SUS; abandonar o tratamento favorece bacilos resistentes. A vacina **BCG**, dada ao nascer, protege contra as formas graves na criança. A **hanseníase**, causada pelo *Mycobacterium leprae*, ataca a pele e os nervos, com manchas com perda de sensibilidade; passa pelas vias aéreas, só com **contato próximo e prolongado**, e deixa de passar logo que o tratamento começa. **Tem cura**, com tratamento gratuito no SUS. O Brasil é o **segundo país** com mais casos novos no mundo. Também passam pelo ar a **coqueluche**, a **difteria** e a **meningite meningocócica**, todas com vacina no calendário.
>
> **Pela água e pelos alimentos (fecal-oral).** A **cólera** (*Vibrio cholerae*) causa diarreia muito intensa, que desidrata em horas; o tratamento principal é repor água e sais (**soro de reidratação oral**). A **febre tifoide** (*Salmonella* Typhi) e as diarreias por *Salmonella* e por certas *E. coli* também vêm de água e comida contaminadas por fezes. O **botulismo** vem da toxina do *Clostridium botulinum*, que cresce sem oxigênio em **conservas e enlatados** mal preparados: lata **estufada** não se consome.
>
> **Pela pele (solo, água ou ferimento).** O **tétano** (*Clostridium tetani*) começa com um ferimento, muitas vezes profundo, contaminado com **esporos** do solo; a toxina causa contrações musculares fortes. Previne-se com **vacina** (e reforço a cada dez anos); num ferimento de risco em quem não está vacinado, usa-se também o **soro**. A **leptospirose** (*Leptospira*) vem da **urina de ratos** na água de **enchentes** e esgotos; a bactéria entra pela pele, sobretudo se houver feridas, e pelas mucosas.
>
> **Pelo sexo e da mãe para o bebê.** A **sífilis** (*Treponema pallidum*) começa com uma ferida indolor (o **cancro duro**) e, sem tratamento, pode atingir o coração e o sistema nervoso anos depois. Passa da gestante para o feto (**sífilis congênita**), por isso o teste é feito no pré-natal. Trata-se com **penicilina**. A **gonorreia** e a **clamídia** também são bactérias transmitidas pelo sexo. O **preservativo** previne as três.
>
> **Por vetores.** A **febre maculosa** (*Rickettsia rickettsii*) passa pela picada do **carrapato-estrela**, que vive em cavalos e capivaras, em áreas de mata e beira de rio no Sudeste. A **peste bubônica** (*Yersinia pestis*), que matou um terço da Europa no século XIV, passa pela **pulga** do rato.

**Animação:** um mapa de corpo humano esquemático (silhueta neutra, sem lesões) com cinco "portas" de entrada, cada uma na cor da sua via: nariz e boca (respiratória, azul), boca com copo d'água e prato (fecal-oral, marrom), pé com ferimento e pele em água de enchente (pela pele, laranja), região genital indicada só por um ícone (sexual, vermelho) e uma picada no braço (vetor, verde-limão). Ao tocar numa porta, os ícones das bactérias daquela via entram e o nome das doenças aparece.
**Interação "Por onde entra, como se evita":** cartões com doenças (tuberculose, hanseníase, cólera, botulismo, tétano, leptospirose, sífilis, febre maculosa) para arrastar até a porta certa. Depois, cada doença pede a medida de prevenção, a escolher entre: vacina, saneamento e água tratada, cozinhar e conservar bem os alimentos, preservativo e pré-natal, controle de ratos e evitar água de enchente, roupa clara e examinar o corpo depois de andar na mata, tratar todos os doentes até o fim. Algumas têm mais de uma resposta certa.

**Cartão "No ENEM":**
> O ENEM cobra a doença ligada ao **contexto**: **leptospirose** depois de **enchente**; **cólera** e diarreias onde falta **saneamento**; **tétano** com ferimento e **vacina com reforço**; **tuberculose** e o risco de **abandonar o tratamento**; **botulismo** e lata estufada; **sífilis congênita** e o **pré-natal**. Diferencie **vacina** (prevenção, o corpo produz anticorpos e memória, ação lenta e duradoura) de **soro** (anticorpos prontos, ação rápida e passageira, como no tétano). A hanseníase aparece em questões sobre preconceito: **tem cura** e não passa por um toque.

---

## Seção: Protoctista (`protoctista`)

Abertura da seção: faixa "relembre na Taxonomia" com link para `../taxonomia/index.html#cladistica/grupos` ("Protoctista não é um clado: é um grupo de conveniência").

### P1 `#protoctista/grupos`: "Protozoários e algas"
- **Subtítulo:** "eucariontes simples que nadam, rastejam ou fazem fotossíntese"

**Texto do aluno:**
> O reino **Protoctista** junta os eucariontes que não são fungos, plantas nem animais. É um grupo de **conveniência**: seus membros não têm um ancestral comum exclusivo (o grupo não é monofilético). Na escola, ele se divide em dois conjuntos: os **protozoários**, unicelulares e heterótrofos, e as **algas**, autótrofas, de uma ou muitas células, sem raiz, caule, folha nem embrião.
>
> Os **protozoários** são separados, nos livros, pelo jeito de se mover. Os **sarcodíneos** (ou rizópodes) se movem por **pseudópodes**, expansões do citoplasma que também englobam o alimento (fagocitose): é o caso da **ameba**; os foraminíferos e os radiolários, marinhos, têm carapaças que se acumulam no fundo do mar e ajudam geólogos a localizar petróleo. Os **flagelados** se movem com **flagelos**: muitos são parasitas, como os causadores da doença de Chagas, das leishmanioses e da giardíase, e outros vivem no intestino dos **cupins**, onde digerem a celulose da madeira (mutualismo). Os **ciliados**, como o **paramécio**, têm o corpo coberto de **cílios** e dois tipos de núcleo (macronúcleo e micronúcleo). Os **esporozoários** (ou apicomplexos) **não têm estrutura de locomoção** e são **todos parasitas**, como o *Plasmodium* (malária) e o *Toxoplasma* (toxoplasmose). Os protozoários de **água doce** têm um **vacúolo contrátil**, que bombeia para fora a água que entra sem parar por osmose; sem ele, a célula estouraria. Os marinhos, num meio com concentração parecida com a do citoplasma, em geral não têm.
>
> As **algas** vivem na água ou em lugares úmidos. As **euglenas**, unicelulares de água doce, fazem fotossíntese na luz e comem matéria orgânica no escuro. As **diatomáceas** têm uma carapaça de **sílica**, como uma caixinha de vidro. Os **dinoflagelados** têm dois flagelos; alguns, quando se multiplicam demais, formam a **maré vermelha** e liberam toxinas que se acumulam em mariscos e intoxicam quem os come; outros, as **zooxantelas**, vivem dentro dos **corais** e lhes dão alimento e cor. As **algas verdes** têm os mesmos pigmentos e a mesma reserva (amido) das plantas e são o grupo de onde elas vieram (ver V1). As **algas pardas** incluem os grandes *kelps*, que formam florestas submarinas, e as **algas vermelhas** fornecem o **ágar** e a **carragenana**, usados em laboratório e na indústria de alimentos. Unicelulares ou não, as algas que flutuam formam o **fitoplâncton**, base das cadeias alimentares do mar e responsável por **cerca de metade da fotossíntese** do planeta e boa parte do gás oxigênio produzido. A Amazônia, por sua vez, faz muita fotossíntese, mas **consome quase todo o oxigênio que produz**, na respiração das próprias plantas e dos decompositores; chamá-la de "pulmão do mundo" é um erro. Ela importa, e muito, para a chuva, o clima e a biodiversidade.

**Animação:** quatro protozoários em gotas de água, lado a lado: a ameba estende pseudópodes e engole uma alga; o flagelado nada girando o flagelo; o paramécio desliza com os cílios em ondas; o *Plasmodium*, parado, dentro de uma hemácia. Abaixo, uma faixa de algas: diatomácea (caixinha de vidro), dinoflagelado (dois flagelos), euglena, alga verde, alga parda e alga vermelha, cada uma com uma etiqueta de uso ("maré vermelha", "ágar", "ancestral das plantas").
**Interação "Vacúolo contrátil":** um paramécio no centro e um controle deslizante "salinidade da água", de "água doce" a "água do mar". Em água doce, o vacúolo contrátil pulsa rápido (contador de pulsações por minuto); conforme o sal aumenta, as pulsações ficam lentas. Um botão "travar o vacúolo" em água doce faz a célula inchar até o limite, com a frase "a água entra por osmose sem parar". Depois, "Quem é quem?": seis cartões (ameba, *Trypanosoma*, paramécio, *Plasmodium*, diatomácea, dinoflagelado) para arrastar até "pseudópode", "flagelo", "cílio", "sem locomoção" ou "alga".

**Cartão "No ENEM":**
> As perguntas mais comuns: o **vacúolo contrátil** e a **osmose** em protozoários de água doce; o **fitoplâncton** como grande produtor de oxigênio e base da cadeia marinha (e a Amazônia que **não** é "pulmão do mundo"); a **maré vermelha** e a intoxicação por mariscos; as **zooxantelas** e o branqueamento dos corais (ver A2). Pela locomoção, lembre: pseudópode (ameba), flagelo (tripanossomo), cílio (paramécio), nenhum (plasmódio).

### P2 `#protoctista/protozooses`: "Protozooses"
- **Subtítulo:** "malária, doença de Chagas, leishmanioses e as que vêm da água e do alimento"

**Texto do aluno:**
> **Malária.** Causada por protozoários do gênero *Plasmodium* (no Brasil, sobretudo *P. vivax* e *P. falciparum*). Passa pela picada da **fêmea** do mosquito ***Anopheles*** (o mosquito-prego), que pica ao entardecer e à noite. Mais de **99% dos casos do Brasil** ocorrem na **Amazônia Legal**. O ciclo tem duas fases. **No ser humano**, o parasita vai primeiro ao **fígado**, onde se multiplica, e depois invade as **hemácias**; a cada ciclo, as hemácias se rompem juntas e liberam parasitas, o que causa **febre alta com calafrios em intervalos regulares** (cerca de 48 horas no *P. vivax* e no *P. falciparum*). **No mosquito**, que suga sangue com as formas sexuadas, acontece a **reprodução sexuada**. Por isso o **mosquito é o hospedeiro definitivo**, e o ser humano, o **intermediário**. Prevenção: mosquiteiros e telas, repelente, roupas compridas ao anoitecer e diagnóstico e tratamento rápidos, que também cortam a transmissão.
>
> **Doença de Chagas.** Descrita por **Carlos Chagas** em **1909**, num feito raro na história da ciência: ele descobriu o agente (o *Trypanosoma cruzi*), o vetor e a doença. O vetor é o **barbeiro** (inseto do grupo dos triatomíneos), que vivia nas frestas das **casas de pau a pique** e pica à noite. O protozoário **não está na saliva**: o barbeiro **defeca** enquanto suga, e as fezes contaminadas entram pela ferida da picada ou pelas mucosas quando a pessoa coça. Hoje, a maior parte dos casos novos no Brasil vem da **transmissão oral**, por alimentos contaminados com barbeiros ou suas fezes, como **açaí** e caldo de cana mal higienizados, sobretudo na Região Norte. Também passa por transfusão e da mãe para o bebê. A fase crônica pode afetar o **coração** (que aumenta de tamanho) e o tubo digestório. Prevenção: casas de alvenaria com reboco, controle do barbeiro, higiene no preparo do açaí e triagem do sangue doado.
>
> **Leishmanioses.** Causadas por protozoários do gênero *Leishmania*, transmitidos pela picada do **mosquito-palha** (ou birigui, os flebotomíneos), que se cria em matéria orgânica úmida no chão, não em água parada. A **tegumentar** forma feridas na pele e nas mucosas (nariz e boca). A **visceral** (calazar) ataca fígado, baço e medula óssea e pode matar; o **cão** é o principal reservatório nas cidades. Prevenção: limpar quintais, recolher folhas e fezes de animais, telas e repelentes; coleira repelente nos cães.
>
> **Pela água, pelo alimento e pelo sexo.** A **amebíase** (*Entamoeba histolytica*) e a **giardíase** (*Giardia*) passam por **cistos** na água e nos alimentos contaminados com fezes e causam diarreia; prevenção: água tratada ou fervida, lavar as mãos e os alimentos, saneamento básico. A **toxoplasmose** (*Toxoplasma gondii*) tem o **gato** como hospedeiro definitivo; as pessoas se infectam comendo **carne crua ou malpassada** com cistos, ou ingerindo oocistos das fezes de gato presentes na terra, em verduras mal lavadas e na água. Em geral é leve, mas, na **gestante** que se infecta pela primeira vez, o parasita pode passar ao feto e lesar olhos e cérebro. A **tricomoníase** (*Trichomonas vaginalis*) é uma infecção sexualmente transmissível, prevenida com preservativo.

**Animação:** o ciclo da malária em uma roda com duas metades: à esquerda, o ser humano (silhueta neutra com fígado e uma gota de sangue ampliada); à direita, o mosquito *Anopheles*. A picada leva os parasitas ao fígado, depois às hemácias, que se rompem em ondas; a cada onda, um termômetro sobe ("febre"). O mosquito suga as formas sexuadas e a fase sexuada acontece no intestino dele, com o rótulo "hospedeiro definitivo". Um segundo quadro mostra o barbeiro picando e **defecando** ao lado da picada, com o *T. cruzi* nas fezes (desenho limpo, sem lesão).
**Interação "Investigação de surto":** quatro fichas fictícias (rotuladas assim), cada uma com lugar, sintomas e hábitos. Exemplo: "Garimpeiro em Rondônia, febre com calafrios a cada dois dias"; "família no Pará, febre e coração aumentado meses depois de tomar açaí de feira"; "criança numa cidade do interior, febre longa, barriga inchada, cachorro da casa doente"; "gestante que come carne malpassada, exame positivo no pré-natal". O aluno escolhe a doença, o agente, o vetor (ou "sem vetor") e uma medida de prevenção. Ao final, o quadro-resumo se preenche.

**Quadro (Ministério da Saúde, *Guia de Vigilância em Saúde*; Neves):**

| Doença | Agente | Transmissão | Prevenção principal |
|---|---|---|---|
| Malária | *Plasmodium* | picada da fêmea do *Anopheles* | mosquiteiro, tela, repelente, tratamento rápido |
| Doença de Chagas | *Trypanosoma cruzi* | fezes do barbeiro na picada; alimentos contaminados | casa de alvenaria, higiene no preparo do açaí |
| Leishmanioses | *Leishmania* | picada do mosquito-palha | limpar quintais, telas, coleira repelente no cão |
| Amebíase e giardíase | *Entamoeba histolytica*, *Giardia* | cistos na água e alimentos (fecal-oral) | saneamento, água tratada, lavar mãos e alimentos |
| Toxoplasmose | *Toxoplasma gondii* | carne crua; oocistos de fezes de gato | carne bem cozida, lavar verduras, cuidado na gestação |
| Tricomoníase | *Trichomonas vaginalis* | sexual | preservativo |

**Cartão "No ENEM":**
> Três detalhes caem sempre. Na **malária**, o mosquito é o **hospedeiro definitivo** (reprodução sexuada nele) e a febre periódica vem da **ruptura sincronizada das hemácias**. Na **doença de Chagas**, o parasita está nas **fezes** do barbeiro, não na saliva, e a **casa de pau a pique** favorece o vetor; a transmissão **oral** pelo açaí é o tema mais recente. Não confunda vetores: *Anopheles* (malária), barbeiro (Chagas), mosquito-palha (leishmanioses) e *Aedes* (dengue, que é vírus). Amebíase e giardíase pedem **saneamento**, não combate a mosquitos.

---

## Seção: Fungi (`fungi`)

Abertura da seção: faixa "relembre na Taxonomia" com link para `../taxonomia/index.html#sistemas/reinos` ("fungo não é planta").

### F1 `#fungi/fungos`: "O corpo e a vida dos fungos"
- **Subtítulo:** "hifas, esporos e digestão do lado de fora"

**Texto do aluno:**
> Os fungos são eucariontes **heterótrofos** que se alimentam por **absorção**: lançam **enzimas digestivas** no ambiente, digerem o alimento do lado de fora e absorvem as moléculas pequenas. Têm **parede celular de quitina** (a mesma substância do esqueleto dos insetos) e guardam energia como **glicogênio**, como os animais. Não fazem fotossíntese. Estudos de DNA mostram que os fungos são **mais aparentados com os animais** do que com as plantas. Há fungos **unicelulares**, as **leveduras**, como o *Saccharomyces cerevisiae* do pão e da cerveja (ver o modelo `#celula_levedura`), e **pluricelulares**, formados por filamentos chamados **hifas**. O conjunto de hifas é o **micélio**, que cresce escondido no solo, na madeira ou no pão. O **cogumelo** que vemos é só o **corpo de frutificação**, a parte que produz esporos.
>
> Os fungos se reproduzem de forma **assexuada** (por **esporos** levados pelo vento, pela água ou por animais; por **brotamento**, nas leveduras; ou por pedaços de hifa) e **sexuada**, quando hifas de linhagens diferentes se fundem. Pela estrutura que forma os esporos sexuados, os livros separam quatro grupos: **quitridiomicetos** (com esporos que nadam com flagelo; um deles, o *Batrachochytrium*, está matando sapos e rãs no mundo todo), **zigomicetos** (como o *Rhizopus*, o bolor preto do pão), **ascomicetos** (leveduras, o *Penicillium*, o *Aspergillus* e as trufas) e **basidiomicetos** (cogumelos, orelhas-de-pau e as ferrugens das plantas). Os fungos vivem no solo, na madeira, em restos de seres vivos, na água e dentro ou sobre outros seres. Gostam de **umidade** e de matéria orgânica, e muitos toleram ambientes ácidos.
>
> Com as bactérias, os fungos são os grandes **decompositores**: sem eles, troncos e folhas mortas se acumulariam e os nutrientes não voltariam ao solo. Na **alimentação**, as leveduras fazem a **fermentação alcoólica** que crescem o pão e produzem cerveja e vinho (ver Bioenergética); fungos do gênero *Penicillium* dão sabor aos queijos roquefort e camembert; e comemos vários cogumelos, como o champignon e o shimeji. Na **medicina**, Alexander **Fleming** descobriu em **1928** que um bolor, o *Penicillium*, matava bactérias numa placa: foi o início da **penicilina**, o primeiro antibiótico usado em larga escala. Do lado ruim, fungos causam **micoses**, como o pé de atleta e outras "frieiras" (pele), a **candidíase** (mucosas) e a histoplasmose (pulmões, por esporos em fezes de morcegos e aves); causam doenças em plantações, como a **vassoura-de-bruxa** do cacau e a ferrugem do café; e alguns produzem toxinas, como as **aflatoxinas** do amendoim e do milho mal armazenados. Há cogumelos **venenosos** que se parecem com os comestíveis: cogumelo do mato não se come.

**Animação:** um time-lapse de uma fatia de pão úmido: esporos pousam, as hifas crescem como fios brancos, formam o micélio e, por fim, os pontinhos pretos dos esporângios aparecem. Um zoom mostra a ponta de uma hifa liberando enzimas (pontos) e absorvendo moléculas pequenas, com o rótulo "digestão fora do corpo". Um segundo quadro mostra um cogumelo cortado ao meio, com o micélio enorme debaixo da terra e a frase "o cogumelo é só a parte que aparece".
**Interação "Fungo ou não?":** cartões para separar em "fungo" ou "não é fungo": cogumelo, levedura do pão, bolor da laranja, orelha-de-pau, musgo, alga verde, bactéria do iogurte, líquen (resposta especial: "fungo associado a alga"). Depois, "Bom ou ruim?": cada fungo aparece com o que faz (decompõe folhas, produz penicilina, causa pé de atleta, fermenta o pão, ataca o cacau, produz aflatoxina) para arrastar até "útil", "prejudicial" ou "os dois", com a lembrança de que a mesma espécie pode ser útil num lugar e praga em outro.

**Cartão "No ENEM":**
> As características que separam fungos de plantas caem muito: **heterótrofos por absorção**, **parede de quitina** e reserva de **glicogênio**. Também aparecem: o papel de **decompositores** na ciclagem da matéria, a **fermentação** das leveduras (pão, que cresce pelo gás carbônico, e bebidas alcoólicas), a **penicilina** e as condições que favorecem o bolor (umidade, calor, matéria orgânica). Pegadinha: o cogumelo **não é o fungo inteiro**, é o corpo de frutificação.

### F2 `#fungi/liquens`: "Liquens e micorrizas"
- **Subtítulo:** "fungos que vivem em parceria"

**Texto do aluno:**
> Um **líquen** não é um ser só: é a associação de um **fungo** (quase sempre um ascomiceto) com uma **alga verde** ou uma **cianobactéria**. As hifas do fungo formam o corpo do líquen e envolvem as células da alga. O fungo dá **proteção** contra a seca e a luz forte e retém **água e sais minerais**; a alga, ou a cianobactéria, faz **fotossíntese** e fornece **matéria orgânica** ao fungo. Os dois se beneficiam: é um caso de **mutualismo** (ver relações ecológicas no módulo Ecologia). Juntos, conseguem viver onde nenhum dos dois viveria sozinho: em **rochas nuas**, troncos, telhados, desertos e regiões geladas. Os liquens se reproduzem sobretudo por pedacinhos que contêm hifas e algas juntas (os **sorédios**), levados pelo vento.
>
> Os liquens são **pioneiros**: estão entre os primeiros seres a ocupar uma rocha nua. Liberam **ácidos** que desgastam a rocha e, quando morrem, deixam matéria orgânica; com o tempo, forma-se uma camada fina de solo onde musgos e depois plantas maiores conseguem crescer (é a **sucessão ecológica primária**, no módulo Ecologia). Como absorvem tudo o que chega pelo ar e pela chuva, sem uma cutícula de proteção, os liquens são muito **sensíveis à poluição do ar**, principalmente ao **dióxido de enxofre** (SO₂). Por isso funcionam como **bioindicadores**: num lugar com muitos liquens variados, o ar tende a ser limpo; nos centros de cidades poluídas, eles somem dos troncos.
>
> As **micorrizas** são associações entre fungos e **raízes de plantas**. As hifas do fungo se espalham pelo solo como uma extensão da raiz e **aumentam muito a absorção de água e de sais minerais**, principalmente o **fósforo**; a planta, em troca, fornece **açúcares** ao fungo. A grande maioria das plantas terrestres, **cerca de 80%** das espécies, tem micorrizas. Fósseis indicam que essa parceria já existia nas primeiras plantas que saíram da água, há mais de 400 milhões de anos, e pode ter sido essencial para a conquista do ambiente terrestre. Hoje, mudas com micorrizas são usadas em reflorestamento de solos pobres. Outro exemplo de fungo em parceria: as **formigas cortadeiras** (saúvas) não comem as folhas que cortam; elas cultivam com as folhas um fungo dentro do formigueiro e se alimentam dele.

**Animação:** um líquen sobre uma rocha, com zoom em corte: camada de hifas por cima, faixa de algas verdes no meio, hifas soltas embaixo agarradas à rocha. Setas desenhadas (não caractere) mostram açúcar indo da alga para o fungo, e água e sais indo do fungo para a alga. Em seguida, o tempo acelera: a rocha nua ganha liquens, depois musgos, depois capim e um arbusto, sobre uma camada de solo que engrossa.
**Interação "Mapa do ar":** um mapa esquemático de uma cidade fictícia, do centro industrial à zona rural, com dez árvores marcadas. O aluno toca em cada árvore e vê quantos tipos de líquen há no tronco (de 0 no centro a muitos no campo). Depois responde onde o ar é mais poluído e por quê. Um segundo modo, "Micorriza liga e desliga", mostra duas mudas iguais em solo pobre em fósforo; só uma tem micorriza; o aluno avança as semanas e vê a diferença de crescimento.

**Cartão "No ENEM":**
> **Líquen** = fungo + alga (ou cianobactéria), em **mutualismo**: o fungo dá proteção, água e sais; a alga dá alimento. As duas ideias mais cobradas: liquens como **pioneiros** na sucessão primária (desgastam a rocha e iniciam o solo) e como **bioindicadores da poluição do ar** (somem onde há muito SO₂). **Micorriza** = fungo + raiz, que aumenta a absorção de **água e fósforo**. Se a questão falar de "associação em que os dois ganham", é mutualismo, não parasitismo nem comensalismo.

---

## Seção: Plantae (`plantae`)

Abertura da seção: faixa "relembre na Taxonomia" com link para `../taxonomia/index.html#sistemas/reinos` ("Plantae: pluricelulares, fotossintetizantes, com embrião").

### V1 `#plantae/conquista`: "A conquista do ambiente terrestre"
- **Subtítulo:** "quatro grupos, quatro novidades e um ciclo com duas gerações"

**Texto do aluno:**
> As plantas vieram de **algas verdes** de água doce. A prova do parentesco está nas células: as duas têm **clorofila *a* e *b***, guardam **amido** e têm parede de **celulose** (ver o modelo `#celula_vegetal`). Sair da água, há cerca de **470 milhões de anos**, trouxe problemas que a alga não tinha: o ar **resseca**, não há água para **sustentar** o corpo, a água e os sais ficam no **solo** e a luz fica **no alto**, e os gametas não têm mais onde **nadar**. Cada grupo de plantas resolveu um pedaço desses problemas, e as soluções aparecem uma depois da outra no cladograma.
>
> Todas as plantas têm **embrião** protegido dentro do corpo da mãe (por isso são chamadas de **embriófitas**) e uma **cutícula** de cera que reduz a perda de água. As **briófitas** (musgos) só têm isso: não têm vasos e ficam pequenas e em lugares úmidos. As **pteridófitas** (samambaias) ganharam **vasos condutores** (xilema e floema, reforçados com **lignina**), que levam água e alimento pelo corpo e permitem crescer para o alto, com raiz, caule e folha verdadeiros. As **gimnospermas** (pinheiros) ganharam a **semente** e o **grão de pólen**: o gameta masculino chega ao feminino pelo **tubo polínico**, sem precisar de água para nadar. As **angiospermas** (plantas com flores) ganharam a **flor** e o **fruto**, que ajudam a atrair polinizadores e a espalhar as sementes. Hoje, as angiospermas são de longe o grupo mais numeroso, com cerca de **300 mil espécies**.
>
> O ciclo de vida das plantas tem **duas gerações** que se alternam (a **alternância de gerações**, ou ciclo **haplodiplobionte**). O **esporófito** é diploide (**2n**) e produz, por **meiose**, **esporos** haploides (**n**). Cada esporo germina e forma o **gametófito** (n), que produz **gametas** por **mitose**. Dois gametas se unem na **fecundação** e formam o **zigoto** (2n), que cresce e vira um novo esporófito. Note duas diferenças em relação aos animais: na planta, a meiose forma **esporos**, não gametas (meiose **espórica**), e os gametas vêm de mitose. Os outros dois tipos de ciclo são o **haplobionte** (o adulto é n e a meiose acontece logo no zigoto, como em muitas algas e fungos) e o **diplobionte** (o adulto é 2n e a meiose forma gametas, como nos animais). Ao longo da evolução das plantas, o gametófito foi **diminuindo** e o esporófito foi ficando **dominante**: nas briófitas, a planta que vemos é o gametófito; da samambaia em diante, é o esporófito.

**Animação:** o cladograma das plantas cresce da base: uma alga verde na raiz, depois o ramo das briófitas (marca âmbar "embrião e cutícula"), das pteridófitas ("vasos condutores"), das gimnospermas ("semente e grão de pólen") e das angiospermas ("flor e fruto"). Ao lado de cada ramo, um ícone (musgo, samambaia, pinheiro, ipê florido). Um segundo quadro mostra a **roda do ciclo haplodiplobionte**: metade de cima rosada (2n), de baixo azul-clara (n), com os portões "meiose" e "fecundação". Um controle "grupo" encolhe o gametófito e aumenta o esporófito conforme o aluno passa de briófita a angiosperma.
**Interação "Problema e solução":** à esquerda, cinco problemas da vida fora da água ("perder água", "levar água do solo ao alto", "ficar de pé", "gameta sem água para nadar", "espalhar os filhos"); à direita, as soluções ("cutícula e estômatos", "vasos condutores", "lignina", "grão de pólen e tubo polínico", "semente e fruto"). O aluno liga cada par e, a cada acerto, a marca âmbar correspondente acende no cladograma. Depois, "Três ciclos": três rodas (haplobionte, diplobionte, haplodiplobionte) e três exemplos (alga do gênero *Chlamydomonas*, ser humano, samambaia) para encaixar.

**Cartão "No ENEM":**
> Guarde a sequência de **novidades**: **embrião** (todas), **vasos condutores** (de pteridófitas em diante), **semente** e **pólen** (de gimnospermas em diante), **flor e fruto** (só angiospermas). A independência da água para a **fecundação** vem com o **tubo polínico**. No ciclo, a **meiose forma esporos** e os **gametas vêm de mitose**; a geração dominante muda de **gametófito** (briófitas) para **esporófito** (demais grupos). É comum a questão trazer um cladograma ou uma tabela de "presente ou ausente" e pedir o grupo.

### V2 `#plantae/briofitas`: "Briófitas"
- **Subtítulo:** "musgos: pequenos, sem vasos e dependentes da água"

**Texto do aluno:**
> As **briófitas** são os **musgos**, as **hepáticas** e os **antóceros**. Medem quase sempre poucos centímetros e vivem em **lugares úmidos e sombreados**: barrancos, troncos, pedras na beira de riachos, muros. Sem vasos condutores, a água passa de **célula em célula**, devagar, e isso limita o tamanho. Elas não têm raiz, caule e folha verdadeiros, e sim estruturas parecidas e mais simples: **rizoides** (fixam a planta), **cauloide** e **filoides**.
>
> Nas briófitas, a planta verde que vemos é o **gametófito** (n), a geração **duradoura**. Na ponta dos gametófitos ficam os órgãos que formam gametas: o **anterídio**, que produz **anterozoides** com flagelos, e o **arquegônio**, que guarda a **oosfera**. Na maioria dos musgos, há gametófitos masculinos e femininos separados. O anterozoide precisa **nadar numa película de água**, de chuva ou de orvalho, até o arquegônio; muitas vezes, uma gota de chuva respinga e o leva de uma planta a outra. A fecundação forma o **zigoto**, que cresce **em cima do gametófito feminino** e forma o **esporófito** (2n): uma haste fina com uma **cápsula** na ponta. O esporófito é **temporário** e **depende do gametófito** para receber água e alimento. Na cápsula (o esporângio), a **meiose** forma **esporos**, que o vento espalha. O esporo germina, forma um filamento verde (o **protonema**) e dele brotam novos gametófitos.
>
> Os musgos também são **pioneiros**: depois dos liquens, ocupam rochas e solos pobres e retêm água e poeira, o que ajuda a formar solo (ver F2). O musgo *Sphagnum* forma as **turfeiras**, áreas encharcadas que guardam muito carbono; é usado também em jardinagem, porque segura muita água.

**Animação:** o ciclo do musgo numa roda (fundo azul-claro embaixo para o gametófito, rosado em cima para o esporófito). Um tapete de musgo em close; uma gota de chuva cai num gametófito masculino e respinga anterozoides até o feminino; o anterozoide nada até a oosfera no arquegônio; o esporófito cresce em cima, a cápsula se abre e os esporos voam; um esporo vira protonema e novos gametófitos.
**Interação "Seca ou chuva?":** um controle "umidade". Em tempo seco, o aluno toca no anterídio e os anterozoides não saem do lugar ("sem água, não há fecundação"); com chuva ou orvalho, a fecundação acontece e o esporófito cresce. Depois, um quiz rápido de três perguntas: "Qual é a fase que vemos?" (gametófito), "O esporófito vive sozinho?" (não, depende do gametófito), "Onde acontece a meiose?" (na cápsula).

**Cartão "No ENEM":**
> As três ideias que caem: briófitas **não têm vasos condutores**, por isso são **pequenas** e vivem em lugares **úmidos**; o **gametófito é a fase duradoura** (o esporófito cresce preso a ele); e a **fecundação depende da água**, porque o anterozoide nada até a oosfera. Se a questão perguntar por que os musgos não ficam grandes, a resposta é a **falta de vasos** (e de lignina), não a falta de luz.

### V3 `#plantae/pteridofitas`: "Pteridófitas"
- **Subtítulo:** "samambaias: vasos condutores, mas ainda dependentes da água"

**Texto do aluno:**
> As **pteridófitas** são as **samambaias**, as **avencas**, as **cavalinhas** e os licopódios e selaginelas. Foram as primeiras plantas com **vasos condutores**: o **xilema** leva água e sais da raiz para cima, e o **floema** distribui os açúcares feitos nas folhas. Com vasos e **lignina**, que endurece as paredes, elas têm **raiz, caule e folha verdadeiros** e podem crescer mais. Nas samambaias comuns, o caule é subterrâneo e horizontal (um **rizoma**), e as folhas novas nascem enroladas, como um báculo. Há também samambaias arborescentes, como o **xaxim** (*Dicksonia sellowiana*), da Mata Atlântica, que foi tão explorado para fazer vasos de planta que hoje está **ameaçado de extinção**. Há cerca de 360 milhões de anos, no período **Carbonífero**, florestas de pteridófitas gigantes cobriam regiões pantanosas; seus restos, soterrados e comprimidos por milhões de anos, viraram boa parte do **carvão mineral**.
>
> Nas pteridófitas, a planta que vemos é o **esporófito** (2n), a geração **duradoura**. Embaixo de algumas folhas aparecem pontinhos marrons, os **soros**: cada soro é um grupo de **esporângios**, onde a **meiose** forma **esporos**. Muita gente acha que os soros são doença ou praga; são a reprodução da planta. O esporo cai num lugar úmido e forma o **gametófito**, chamado **prótalo**: uma plaquinha verde em forma de coração, com menos de 1 cm, que vive **independente** por pouco tempo. No prótalo ficam o anterídio e o arquegônio; o **anterozoide nada** na água do solo até a **oosfera**, como nas briófitas. O zigoto forma um novo esporófito, que no começo cresce sobre o prótalo e logo fica independente, enquanto o prótalo morre.
>
> Uma nota sobre a classificação: "pteridófitas" é um nome de uso escolar. Os licopódios e selaginelas formam uma linhagem, e as samambaias e cavalinhas outra, mais próxima das plantas com semente. Por isso as pteridófitas não formam um grupo monofilético (ver K2 na Taxonomia).

**Animação:** uma samambaia em vaso; um zoom na parte de baixo de uma folha mostra os soros, depois um esporângio que se abre como uma catapulta e lança os esporos. Um esporo cai no solo úmido e vira o prótalo em forma de coração; o anterozoide nada até o arquegônio; o esporófito jovem brota do prótalo e cresce, enquanto o prótalo murcha. Um corte do caule mostra os vasos condutores acesos.
**Interação "Briófita ou pteridófita?":** um quadro comparativo de duas colunas (musgo e samambaia) com frases para arrastar: "tem vasos condutores" (pteridófita), "fase duradoura é o gametófito" (briófita), "fase duradoura é o esporófito" (pteridófita), "anterozoide nada até a oosfera" (as duas), "tem raiz, caule e folha verdadeiros" (pteridófita), "forma esporos" (as duas), "tem semente" (nenhuma). A frase "nenhuma" fica de lado como pegadinha. No fim, a roda dos ciclos dos dois grupos aparece lado a lado, com o tamanho de cada geração proporcional.

**Cartão "No ENEM":**
> **Pteridófitas** = primeiras plantas **vasculares**, **sem sementes**, com **esporófito dominante**. A pegadinha principal: apesar dos vasos, elas **ainda dependem da água** para a fecundação (anterozoide nadando), igual às briófitas; quem se livra dessa dependência são as **gimnospermas**, com o tubo polínico. Os **soros** sob as folhas são **esporângios**, não doença. O **carvão mineral** vem de florestas de pteridófitas do Carbonífero.

### V4 `#plantae/gimnospermas`: "Gimnospermas"
- **Subtítulo:** "pinheiros: pólen, tubo polínico e semente nua"

**Texto do aluno:**
> As **gimnospermas** são os **pinheiros**, ciprestes, sequoias, as **cicas** e o *Ginkgo*. O nome quer dizer "semente nua": elas têm **semente**, mas **não têm fruto** em volta. No Brasil, a mais conhecida é a ***Araucaria angustifolia***, o pinheiro-do-paraná, árvore símbolo da **Mata de Araucárias** no Sul e nas serras do Sudeste. Ela foi tão derrubada para madeira no século XX que hoje está **criticamente ameaçada**. O **pinhão** é a **semente** da araucária, não um fruto. Aves como a **gralha-azul** e roedores como a cutia enterram pinhões para comer depois e esquecem alguns, que germinam: são dispersores importantes. Já os pinheiros do gênero *Pinus*, plantados para madeira e papel, são **exóticos** (vieram do Hemisfério Norte) e podem invadir campos nativos. As gimnospermas dominam florestas de clima frio, como as florestas de coníferas do Canadá e da Rússia; suas folhas em forma de agulha, com cutícula grossa, perdem pouca água.
>
> A planta que vemos é o **esporófito**. As estruturas reprodutivas ficam em **estróbilos** (as "pinhas" ou cones). Os **estróbilos masculinos** produzem os **grãos de pólen**, e cada grão de pólen é um **gametófito masculino** pequenininho, que o **vento** leva (muitas vezes, em nuvens amarelas). Nos **estróbilos femininos** ficam os **óvulos**, cada um com um **gametófito feminino** dentro e a **oosfera**. Quando um grão de pólen chega ao óvulo (a **polinização**), ele forma o **tubo polínico**, que cresce até a oosfera e leva até ela o **núcleo espermático**. Por isso a fecundação **não depende mais de água** para o gameta nadar. Essa é a grande novidade do grupo. Depois da fecundação, o óvulo vira a **semente**: o **embrião**, uma **reserva de alimento** e uma **casca** protetora. A semente aguenta seca e frio, espera o momento certo para germinar e pode ser levada para longe. No pinheiro, todo o processo, da polinização à semente madura, pode levar cerca de dois anos.

**Animação:** uma araucária em silhueta; zoom num ramo com estróbilo masculino liberando uma nuvem de pólen ao vento; o pólen pousa no estróbilo feminino (a "pinha" da araucária); zoom no óvulo, com o tubo polínico crescendo até a oosfera; o óvulo vira semente (pinhão), com o embrião e a reserva rotulados. Por fim, uma gralha-azul enterra um pinhão, e uma muda nasce.
**Interação "Fruto ou semente?":** fotos desenhadas de pinhão, feijão, amendoim, milho (grão), castanha-do-pará, coco, tomate e pêssego. O aluno arrasta para "semente nua (gimnosperma)", "semente dentro de fruto (angiosperma)" ou "fruto". O pinhão é o único "semente nua"; o grão de milho e o amendoim viram oportunidades para explicar que, no dia a dia, chamamos de "semente" coisas que, na botânica, são frutos ou sementes dentro de frutos (o grão de milho é um fruto com uma semente colada). Depois, "Quem precisa de água para a fecundação?": musgo, samambaia, pinheiro e ipê; só os dois primeiros.

**Cartão "No ENEM":**
> **Gimnospermas** têm **semente**, mas **não têm flor nem fruto** ("semente nua"). As novidades cobradas: **grão de pólen**, **tubo polínico** (fecundação **sem água**) e **semente** (proteção e reserva para o embrião). Polinização quase sempre pelo **vento**. Exemplo brasileiro clássico: **araucária**, cujo **pinhão é semente**, não fruto, e que está ameaçada de extinção.

### V5 `#plantae/angiospermas`: "Angiospermas: flor, fruto e semente"
- **Subtítulo:** "polinização, dupla fecundação e dispersão"

**Texto do aluno:**
> As **angiospermas** são as plantas com **flores** e **frutos**: do capim ao ipê, do feijão à mangueira. Vivem em quase todos os ambientes terrestres e em alguns aquáticos, e fornecem quase toda a nossa comida. A **flor** é um ramo modificado para a reprodução. De fora para dentro: as **sépalas** (o **cálice**), em geral verdes, protegem o botão; as **pétalas** (a **corola**), muitas vezes coloridas, atraem animais; os **estames** (o **androceu**, parte masculina), cada um com um **filete** e uma **antera**, onde se formam os **grãos de pólen**; e o **carpelo** ou pistilo (o **gineceu**, parte feminina), com o **estigma** pegajoso no alto, o **estilete** e o **ovário**, que guarda os **óvulos**.
>
> A **polinização** é a chegada do pólen ao estigma. Pode ser feita pelo **vento** (flores pequenas, sem cor nem cheiro, com muito pólen leve, como no milho e no capim), por **insetos** (flores coloridas e perfumadas, com néctar, como as visitadas pelas abelhas), por **aves** (flores tubulares e vermelhas, sem cheiro, visitadas por beija-flores) ou por **morcegos** (flores claras que abrem à noite). Flores e polinizadores evoluíram juntos (**coevolução**). As **abelhas** são as polinizadoras mais importantes da agricultura; o seu declínio, por agrotóxicos e perda de habitat, ameaça muitas colheitas. Depois da polinização, o pólen forma o **tubo polínico**, que cresce pelo estilete até o óvulo e leva **dois núcleos espermáticos**. Um se une à **oosfera** e forma o **zigoto** (2n), que vira o embrião. O outro se une a **dois núcleos polares** e forma uma célula **triploide** (3n), que origina o **endosperma**, a reserva de alimento da semente. Essa **dupla fecundação** é exclusiva das angiospermas.
>
> Depois da fecundação, o **óvulo vira a semente** e o **ovário vira o fruto**. O fruto protege a semente e ajuda a espalhá-la (**dispersão**): frutos carnosos e coloridos atraem animais que comem a polpa e soltam as sementes longe (**zoocoria**), como as aves e os macacos; frutos e sementes leves, com "asas" ou pelos, voam (**anemocoria**), como os do ipê e da paineira; e frutos que boiam viajam pela água (**hidrocoria**), como o coco. Na parte comestível do **caju**, da **maçã** e do **morango**, quem cresce é outra parte da flor, não o ovário: são **pseudofrutos** (a "castanha" do caju é o fruto verdadeiro). Algumas plantas formam frutos sem fecundação e, por isso, **sem sementes**, como a banana cultivada (**partenocarpia**).
>
> As angiospermas se dividem em dois grandes grupos. As **monocotiledôneas** (milho, arroz, trigo, cana-de-açúcar, capim, bambu, palmeiras, bananeira, orquídeas) têm embrião com **um cotilédone**, folhas com **nervuras paralelas**, raiz **fasciculada** (em cabeleira) e flores com peças em **múltiplos de 3**. As **eudicotiledôneas** (feijão, soja, laranjeira, ipê, rosa, café, mandioca) têm **dois cotilédones**, nervuras em **rede**, raiz **pivotante** (uma principal) e flores com peças em múltiplos de 4 ou 5.

**Animação:** uma flor esquemática de eudicotiledônea se desmonta em camadas, de fora para dentro, com cada peça rotulada. Uma abelha pousa, leva pólen para outra flor; o tubo polínico desce pelo estilete e os dois núcleos espermáticos se separam: um encontra a oosfera (zigoto 2n, rosado) e o outro, os dois núcleos polares (endosperma 3n, com uma cor própria). Em seguida, o ovário incha e vira fruto, as pétalas caem, e o fruto se abre mostrando as sementes. Um botão "caju" mostra o pedúnculo inchando (pseudofruto) e a castanha como fruto verdadeiro.
**Interação "Monte a polinização":** quatro flores (milho, maracujá, flor tubular vermelha, flor branca noturna) e quatro polinizadores (vento, abelha, beija-flor, morcego). O aluno liga cada flor ao polinizador mais provável, com dicas de cor, cheiro, néctar e horário. Depois, "Fruto, pseudofruto ou semente?": tomate, pepino, vagem de feijão, caju (a parte suculenta), castanha do caju, maçã, grão de feijão, morango; as respostas vêm com o órgão da flor que cresceu. Por fim, "Mono ou eudi?": quatro plantas com folha, raiz e flor desenhadas para classificar.

**Quadro (Raven, caps. 19 e 20; Amabis):**

| Característica | Monocotiledôneas | Eudicotiledôneas |
|---|---|---|
| Cotilédones no embrião | 1 | 2 |
| Nervuras da folha | paralelas | em rede (reticuladas) |
| Raiz | fasciculada | pivotante (axial) |
| Peças da flor | múltiplos de 3 | múltiplos de 4 ou 5 |
| Feixes de vasos no caule | espalhados | em anel |
| Exemplos | milho, arroz, cana, capim, palmeiras | feijão, soja, laranjeira, ipê, café |

**Cartão "No ENEM":**
> É a tela com mais detalhes cobrados. **Óvulo vira semente; ovário vira fruto.** Pseudofrutos clássicos: **caju**, **maçã**, **morango**. A **dupla fecundação** forma o **zigoto (2n)** e o **endosperma (3n)**. As **síndromes de polinização** (cor, cheiro, néctar, horário da flor) e de **dispersão** (frutos carnosos e animais, sementes aladas e vento) caem em questões de interpretação, muitas vezes com a ideia de **coevolução** e com o risco do **declínio das abelhas** para a produção de alimentos.

### V6 `#plantae/orgaos`: "Raiz, caule e folha"
- **Subtítulo:** "o que cada órgão faz e como a seiva sobe e desce"

**Texto do aluno:**
> A **raiz** fixa a planta e **absorve água e sais minerais**, sobretudo pelos **pelos absorventes** perto da ponta. Pode ser **pivotante** (uma raiz principal, como no feijão) ou **fasciculada** (um tufo de raízes finas, como no milho). Há raízes especiais: **tuberosas**, que guardam reserva (**mandioca, cenoura, beterraba, batata-doce**); **respiratórias** (os **pneumatóforos** dos mangues, que crescem para fora da lama encharcada e sem oxigênio); **escoras**, que sustentam; e **sugadoras**, como as da erva-de-passarinho, que penetram outra planta e roubam a seiva. O **caule** sustenta as folhas e liga a raiz às folhas por dentro dos vasos. Pode ser **tronco** (árvores), **colmo** (com nós, como a cana e o bambu), **estipe** (palmeiras) ou subterrâneo: o **rizoma** (gengibre, bananeira), o **tubérculo** (**batata-inglesa**, que tem "olhos", que são gemas) e o **bulbo** (**cebola** e alho, em que a parte que comemos são folhas modificadas em volta de um caule pequeno). A **folha** é o principal órgão da **fotossíntese** e das trocas gasosas. Na sua superfície ficam os **estômatos**, poros controlados por duas **células-guarda**, por onde entra o CO₂ e sai vapor de água. Em ambientes secos, como a **Caatinga**, há folhas pequenas, cutícula grossa, espinhos (no cacto, os espinhos são folhas e o caule verde faz a fotossíntese) e plantas que **perdem as folhas** na seca.
>
> Por dentro, dois tipos de vaso levam as seivas. O **xilema** leva a **seiva bruta** (água e sais) da raiz até as folhas, sempre **para cima**. A força principal vem da **transpiração**: a folha perde vapor de água pelos estômatos, e essa perda "puxa" a coluna de água no xilema, que se mantém inteira porque as moléculas de água ficam unidas umas às outras (**teoria da coesão e tensão**). O **floema** leva a **seiva elaborada** (açúcares feitos na fotossíntese) das folhas para onde a planta precisa: raízes, frutos, brotos, para cima ou para baixo. O floema fica na parte de fora do caule, junto da casca; o xilema, mais para dentro (nas árvores, o lenho). Se alguém tira um **anel de casca** em volta de um tronco (o **anel de Malpighi**), corta o floema: as folhas continuam recebendo água pelo xilema, mas o açúcar não chega às raízes, que morrem de fome, e a árvore morre semanas ou meses depois.
>
> Os **estômatos** são a válvula da planta. Com **luz** e **água disponível**, se abrem: entra CO₂ para a fotossíntese, e a planta transpira. Na **falta de água**, um hormônio (o ácido abscísico) faz os estômatos se **fecharem**: a planta economiza água, mas a fotossíntese cai. É um equilíbrio entre comer e não secar. Os cactos e outras plantas de deserto abrem os estômatos **à noite**, quando está fresco, e guardam o CO₂ para usar de dia.

**Animação:** uma planta inteira em corte esquemático, com o xilema em azul (seiva bruta subindo) e o floema em laranja (seiva elaborada indo das folhas para a raiz e para um fruto). Um zoom na folha mostra um estômato abrindo e fechando, com moléculas de água saindo e CO₂ entrando. Um botão "anel de Malpighi" retira um anel de casca do tronco: o laranja para no corte, a raiz escurece aos poucos, enquanto o azul continua subindo.
**Interação "Na feira":** uma banca com batata-inglesa, batata-doce, mandioca, cenoura, cebola, gengibre, cana, alface e beterraba. O aluno arrasta cada uma para "raiz", "caule" ou "folha". Ao errar a batata-inglesa, aparece o zoom dos "olhos" (gemas, que só caules têm). Depois, "Estômato no controle": dois controles, "luz" e "água no solo", e o estômato reage, com dois medidores ("fotossíntese" e "perda de água"); o aluno descobre que, sem água, o estômato fecha mesmo com luz forte.

**Cartão "No ENEM":**
> Caem: **xilema = seiva bruta**, da raiz para as folhas, puxada pela **transpiração**; **floema = seiva elaborada**, das folhas para o resto da planta; o **anel de Malpighi** mata a árvore porque **corta o floema**. **Estômatos** abrem com luz e água e fecham na seca, o que reduz a fotossíntese. Pegadinhas de "órgão": **batata-inglesa é caule** (tubérculo), **batata-doce e mandioca são raízes**, **cebola é bulbo** (folhas modificadas), **gengibre é rizoma**. Adaptações da Caatinga (espinhos, folhas pequenas, queda das folhas) aparecem em questões de biomas.

---
