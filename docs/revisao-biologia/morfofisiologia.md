# Revisão · Módulo 06 · Morfofisiologia celular

Arquivo revisado: `site/morfofisiologia/index.html` (arquivo único). Os textos estão nos objetos `def('seção','id',{...})`: `t` título, `s` subtítulo, `sz` caixa de escala, `d` descrição, `kv` pares, e os rótulos do canvas em `lab(...)`, `tx(...)` e `caps=[...]`. Todos os trechos abaixo foram conferidos com `grep -F` e aparecem **uma única vez** no arquivo.

No geral, o módulo é muito bom: os números estão quase todos certos (ver a tabela da seção 3), a composição de membranas usa os dados reais de Guidotti, e há nuances raras em material de ensino médio (fibra de 30 nm "mais irregular", hospedeira Asgard, endossimbiose secundária). Os erros estão em três pontos: a **célula vegetal na tela da osmose**, a **origem das duas membranas** da mitocôndria e do cloroplasto, e a **hospedeira** da endossimbiose, que o texto chama de arqueia e o desenho mostra com núcleo.

Não repito aqui o que já foi apontado em `celula.md`; os cruzamentos com aquele módulo estão na seção 5.

---

## 1. Erros (por gravidade)

### E1 · Osmose: a célula vegetal "sofre plasmólise" em 1% de NaCl (alta, tema clássico do ENEM)
- **Onde:** `membranas/osmose`, no `draw`. O estado da célula vegetal usa os limites da **hemácia**.
- **Trecho:** `tx(hypo?'túrgida':iso?'flácida':'plasmólise'`
- **Problema:** a célula vegetal muda de estado no mesmo ponto que a hemácia. Com o controle em 1,0% de NaCl, a tela já mostra "plasmólise". Isso ensina que 0,9% de NaCl é isotônico para qualquer célula, mas a **tonicidade é relativa**. O suco celular de uma célula vegetal é bem mais concentrado que o plasma: 0,9% de NaCl é **hipotônico** para a maioria delas, que continuam túrgidas. A epiderme de cebola, por exemplo, só começa a plasmolisar com cerca de 0,4–0,5 mol/L de sacarose, o que equivale a uns 1,5% de NaCl. A ideia de que "isotônico" é uma propriedade da solução, e não da relação entre a solução e a célula, é exatamente o erro que as questões de osmose exploram.
- **Correção no desenho (engenheiro):** dar à célula vegetal limites próprios, por exemplo `túrgida` até ~1,2%, `flácida` entre ~1,2% e ~1,5% e `plasmólise` acima de ~1,5%, com a legenda `célula vegetal (valores ilustrativos)`. Os valores exatos dependem da espécie e do tecido.
- **Texto proposto (acrescentar ao fim de `d`, depois de** `no hipertônico a membrana se solta da parede (<b>plasmólise</b>).</p>`**, como novo parágrafo):** `<p><b>A tonicidade é sempre relativa.</b> O soro a 0,9% é isotônico para a hemácia, mas é hipotônico para a maioria das células vegetais, cujo suco é mais concentrado; elas só sofrem plasmólise em soluções bem mais salgadas.</p>`

### E2 · Endossimbiose: "2 membranas: a sua + a da vesícula" (média a alta)
- **Onde:** rótulo da animação compartilhada por `origem/mito` e `origem/cloro` (função `endoSym`), e o texto de `origem/evid`.
- **Trechos:**
  - `'2 membranas: a sua + a da vesícula'`
  - `4. Têm <b>duas membranas</b>: a interna lembra a membrana bacteriana (tem cardiolipina) e a externa lembra a da vesícula que as englobou.`
- **Problema:** as α-proteobactérias e as cianobactérias são **gram-negativas**, ou seja, **já têm duas membranas** (a plasmática e a membrana externa). Pela conta da animação, bactéria + vesícula daria três. As proteínas da membrana externa da mitocôndria (porinas, a Sam50) e do cloroplasto (a Toc75) são da família da Omp85 bacteriana, o que indica que a membrana externa veio da própria bactéria (Gray, 2012; Archibald, 2015; Alberts, cap. 14). A versão "uma é da bactéria e a outra é da vesícula" ainda está em muitos livros didáticos, por isso vale citá-la como explicação clássica, sem apresentá-la como fato. O próprio módulo Célula diz que a *E. coli*, gram-negativa, tem membrana externa (ver C1).
- **Textos propostos:**
  - Rótulo: `'2 membranas, herdadas da bactéria'`. No desenho, sugiro que a bactéria tenha **contorno duplo desde o início** e que o contorno da vesícula (`ell(...)` desenhado quando `p>.36`) desapareça no passo 3.
  - `evid.d`: `4. Têm <b>duas membranas</b>, como as bactérias gram-negativas de que descendem. A interna tem cardiolipina, um lipídio típico de bactérias, e a externa tem porinas parecidas com as da membrana externa bacteriana. (Muitos livros dizem que a membrana externa veio da vesícula que englobou a bactéria; é a explicação clássica, mas as proteínas dessa membrana indicam origem bacteriana.)`

### E3 · A hospedeira é uma arqueia no texto, mas uma célula com núcleo no desenho (média)
- **Onde:** `origem/mito` (texto e kv) e a animação `endoSym`, que desenha e rotula um `'núcleo'` na hospedeira nos dois tópicos. A legenda do passo 2 diz que a bactéria `é englobada por fagocitose`.
- **Trechos:**
  - `Estudos genéticos atuais indicam que a hospedeira era uma <b>arqueia</b> (do grupo Asgard), e que todos os eucariotos atuais descendem dessa fusão.`
  - `['Hospedeira','arqueia (grupo Asgard)']`
  - `'célula hospedeira (anaeróbia)'`
- **Problema:** arqueias não têm núcleo nem fazem fagocitose. O aluno vê uma célula com núcleo engolindo a bactéria e lê, logo abaixo, que a hospedeira era uma arqueia. As duas coisas só se conciliam se o texto disser que a animação mostra o modelo clássico e que a ordem dos acontecimentos (núcleo antes ou depois da mitocôndria) ainda é debatida. O tópico `origem/invag`, que vem antes, reforça a ideia de que o núcleo surgiu primeiro, sem avisar.
- **Textos propostos:**
  - `mito.d`: `A animação mostra o modelo dos livros: uma célula hospedeira com núcleo que englobou a bactéria. Estudos genéticos atuais indicam que a hospedeira era aparentada às <b>arqueias</b> (do grupo Asgard), e ainda se discute se ela já tinha núcleo e se englobou a bactéria por fagocitose. O certo é que todos os eucariotos atuais descendem dessa fusão.`
  - kv: `['Hospedeira','aparentada às arqueias Asgard']`
  - Rótulo: `'célula hospedeira (anaeróbia)'` → `'hospedeira (modelo clássico)'`
  - `invag.d`: depois de `O complexo golgiense e os lisossomos teriam vindo depois, do mesmo sistema.`, acrescentar: ` A ordem dos acontecimentos ainda é debatida: o núcleo pode ter surgido antes ou depois da chegada da mitocôndria (tópico seguinte).`

### E4 · A *E. coli* aparece sem a membrana externa (média)
- **Onde:** `tipos/proc`, texto e desenho (função `bact`, rótulos `cápsula`, `parede (peptidoglicano)`, `membrana plasmática`).
- **Trecho:** `De fora para dentro: <b>cápsula</b> (camada de açúcares, protege contra o sistema imune), <b>parede celular</b> de peptidoglicano (aguenta a pressão osmótica), <b>membrana plasmática</b>`
- **Problema:** a *E. coli* é gram-negativa: por fora da parede fina de peptidoglicano há uma **membrana externa** (com o LPS). O módulo Célula diz isso (`parede_bac`). Além disso, a cápsula existe só em algumas linhagens. Essa membrana externa é também a peça que falta para entender o E2.
- **Texto proposto:** `De fora para dentro: <b>cápsula</b> (camada de açúcares presente em algumas linhagens; protege contra o sistema imune), <b>membrana externa</b> (típica das bactérias gram-negativas, como a <i>E. coli</i>), <b>parede celular</b> de peptidoglicano (fina nas gram-negativas; aguenta a pressão osmótica), <b>membrana plasmática</b>`
- **Desenho (artista/engenheiro):** acrescentar o contorno da membrana externa e o rótulo `'membrana externa'`.

### E5 · Nucléolo: os genes do rRNA ficam "nas pontas" dos acrocêntricos (baixa)
- **Onde:** `nucleo/nucleolo.d`.
- **Trecho:** `nas pontas dos cromossomos acrocêntricos 13, 14, 15, 21 e 22`
- **Problema:** as regiões organizadoras do nucléolo ficam nos **braços curtos (p)**, na constrição secundária, entre o centrômero e o satélite. "Nas pontas" sugere os telômeros, que o tópico Cromossomos apresenta logo depois.
- **Texto proposto:** `nos braços curtos (p) dos cromossomos acrocêntricos 13, 14, 15, 21 e 22`

---

## 2. Simplificações que enganam e valores a conferir

### S1 · A bomba "deixa o interior negativo" (média)
- **Trecho (`membranas/bomba`):** `Como saem 3 cargas positivas e entram 2, a bomba também deixa o interior negativo, ajudando a formar o <b>potencial de repouso</b> (~−70 mV nos neurônios).`
- O texto diz "ajudando", o que está certo, mas o aluno sai achando que a bomba é a causa do potencial. O efeito direto da bomba é pequeno (alguns mV). A maior parte dos −70 mV vem do **K⁺ que vaza para fora por canais**, a favor do gradiente que a bomba criou (Alberts, cap. 11; Kandel, cap. 6).
- **Proposta:** `O potencial de repouso (~−70 mV nos neurônios) vem principalmente do K⁺ que vaza para fora por canais, a favor do gradiente que a bomba criou; a troca desigual de cargas (3 saem, 2 entram) contribui com uma pequena parte.`

### S2 · Poro nuclear: o mRNA não sai com exportinas
- **Trechos (`nucleo/poro`):** `<b>mRNA</b> e subunidades de ribossomo saem com <b>exportinas</b>. A energia vem da proteína Ran (GTP).` e o rótulo `'mRNA + exportina'`.
- As subunidades do ribossomo saem com exportinas (CRM1) e dependem de Ran-GTP. O mRNA usa outro receptor (NXF1/TAP), que não depende da Ran (Alberts, cap. 6 e 12; Köhler e Hurt, 2007).
- **Proposta:** `As subunidades de ribossomo saem com <b>exportinas</b>, e o <b>mRNA</b> sai com um receptor próprio. Nas importinas e exportinas, a energia vem da proteína Ran (GTP).` Rótulo: `'mRNA + receptor de exportação'`.

### S3 · Telômeros "encurtam a cada divisão"
- **Trecho (`nucleo/cromossomos`):** `repetições de TTAGGG que protegem o DNA e encurtam a cada divisão.`
- Isso vale para a maioria das células do corpo. As células germinativas, as células-tronco e muitas células de câncer têm **telomerase** (Nobel de 2009: Blackburn, Greider e Szostak). Telômeros, envelhecimento e câncer aparecem em textos de divulgação usados como base de questões.
- **Proposta:** `repetições de TTAGGG que protegem o DNA e, na maioria das células do corpo, encurtam a cada divisão (células germinativas, células-tronco e muitas células de câncer têm a <b>telomerase</b>, que os refaz).`

### S4 · Ribossomos "70S" nas mitocôndrias
- **Trechos:** `<td>80S (60S + 40S); 70S nas mitocôndrias e cloroplastos</td>` (`tipos/lado`), `2. Têm <b>ribossomos 70S</b>` (`origem/evid`) e o `sz` de `evid`.
- Os cloroplastos têm 70S. Os mitorribossomos humanos são **55S** (28S + 39S); nos fungos são ~74S e nas plantas ~78S (Amunts et al., *Science* 2015). Todos são do tipo bacteriano em origem e sensibilidade a antibióticos. O "70S" é a convenção do livro didático e pode ficar, desde que acompanhado da ressalva.
- **Proposta (`evid.d`):** `2. Têm <b>ribossomos do tipo bacteriano</b> (70S nos cloroplastos; nas mitocôndrias humanas são um pouco menores, 55S, mas da mesma família), sensíveis…`

### S5 · Difusão "até as concentrações se igualarem"
- **Trecho (`membranas/difusao`):** `sem gasto de energia, até as concentrações se igualarem.`
- O aluno entende que as moléculas param de passar. Na verdade elas continuam passando nos dois sentidos, em igual número (equilíbrio dinâmico). A simulação mostra isso, então vale dizer.
- **Proposta:** `sem gasto de energia. Quando as concentrações se igualam, as moléculas continuam passando, mas em números iguais nos dois sentidos (equilíbrio dinâmico).`

### S6 · Parceria da endossimbiose baseada em "fornecer ATP"
- **Trecho (`origem/mito`):** `a bactéria usava O₂ para extrair muito mais energia dos alimentos e fornecia ATP`
- É a explicação dos livros, e serve para o ENEM. Mas o transportador que exporta ATP da mitocôndria (ADP/ATP translocase) é uma invenção posterior, dos eucariotos. As hipóteses atuais apostam numa troca de outras substâncias, como H₂ (hipótese do hidrogênio, Martin e Müller, 1998). Sugestão de baixa prioridade: `…e, com o tempo, passou a fornecer ATP`.

### S7 · Carboidratos "sempre na face externa"
- **Trecho (`membranas/comp`):** `e sempre na face externa.`
- Na membrana plasmática, sim. Nas organelas, ficam voltados para o **lúmen** (que, como explica o tópico Invaginação, é topologicamente o "lado de fora"). **Proposta:** `e sempre na face voltada para fora da célula (ou para o interior das organelas).`

### S8 · Valores a conferir

| Item | Valor no módulo | Situação | Proposta / referência |
|---|---|---|---|
| Hetero × eucromatina (`nucleo/eu`, `sz`) | `~10% × ~90%`, "do genoma humano" | **a conferir** | O ~10% é a heterocromatina **constitutiva** ("mais de 10%", Alberts, cap. 4). A facultativa varia muito com o tipo de célula. Proposta: `sz:['≥10%','do genoma em heterocromatina constitutiva (varia com a célula)']` |
| Parentes vivos da mitocôndria (`evid`, kv) | `Rickettsia (mito)` | **a conferir** | Filogenias recentes colocam a mitocôndria como grupo-irmão das α-proteobactérias conhecidas (Martijn et al., *Nature* 2018). Proposta: `['Parentes vivos','α-proteobactérias (mito), cianobactérias (cloro)']` |
| Vesículas (`endo`, `sz`) | `0,1–1 µm` | **a conferir** | Vesículas de clatrina ~0,1 µm, mas o fagossomo de uma bactéria passa de 1 µm. Proposta: `['0,1 µm a vários µm','da vesícula de clatrina ao fagossomo']` (Alberts, cap. 13) |
| Flip-flop (`mosaico`, kv) | horas a dias | ok, com ressalva | Alberts cita "menos de uma vez por mês" (medidas antigas); medidas recentes dão horas. "Horas a dias" é aceitável |
| Tamanho de procariotas | `0,5–5 µm` (tabela) × `~1–5 µm` (`sz`) | uniformizar | usar 0,5–5 µm nos dois |

### Números conferidos

| Item | Valor no módulo | Situação | Referência |
|---|---|---|---|
| Volume eucariota/bactéria | ~10³ | ok (10× no diâmetro) | — |
| Membrana do RE / plasmática (hepatócito) | ~50% / ~2% | ok (RE rugoso 35% + liso 16%) | Alberts, tabela 12-2 |
| Limites de resolução | olho ~100 µm; óptico ~0,2 µm; eletrônico ~1 nm | ok | Alberts, cap. 9 |
| Ribossomo, gripe, *Mycoplasma*, óvulo | 25 nm, 100 nm, 0,3 µm, 120 µm | ok | Alberts; Campbell |
| Bicamada | ~5 nm; difusão lateral ~1 µm²/s | ok | Alberts, cap. 10 |
| Composição de membranas | mielina 18/79/3 … mitocôndria interna 76/24/0 | ok, iguais à tabela original | Guidotti, 1972 (em Karp) |
| Colesterol | até ~1:1 com fosfolipídios | ok | Alberts |
| Tm DPPC / DOPC | 41 °C / −17 °C | ok | Avanti Polar Lipids |
| Permeabilidade água × íons | ~10⁹ × | ok | Alberts, fig. 11-2 |
| Canal / transportador | ~10⁸ íons/s; 10²–10⁴ moléculas/s | ok | Alberts, cap. 11 |
| Soro fisiológico | 0,9% ≈ 290 mOsm/L | ok (154 mM × 2 × 0,93 ≈ 286) | — |
| Fragilidade osmótica | hemólise começa ~0,45%, completa ~0,35% | ok (faixa de referência 0,45–0,50% e 0,30–0,35%) | Dacie & Lewis, *Practical Haematology* |
| Na⁺ e K⁺ | 145/12 mM; 4/140 mM | ok | Alberts, tabela 11-1 |
| Bomba Na⁺/K⁺ | 3 Na⁺ : 2 K⁺ : 1 ATP; ~1/3 do ATP, até 2/3 em neurônios | ok | Alberts, cap. 11 |
| Junção comunicante | < ~1 000 Da | ok | Alberts, cap. 19 |
| Microvilo | ~1 × 0,1 µm | ok | Junqueira & Carneiro |
| mtDNA humano | 16 569 pb, 37 genes; >1 000 proteínas importadas | ok | NC_012920; Alberts |
| cpDNA | 120–160 kb, ~100–130 genes | ok | Alberts, cap. 14 |
| Poro nuclear | ~120 nm, simetria 8, ~30 nucleoporinas, ~1 000 cópias, livre até ~40 kDa; 3 000–5 000 poros | ok | Alberts, cap. 12 |
| Nucleossomo | 147 pb a cada ~200 pb; 11 nm | ok | Alberts, cap. 4 |
| Cromossomo metafásico | ~1 400 nm, ~10 000× | ok | Alberts, cap. 4 |
| Telômeros humanos | TTAGGG, 5–15 kb | ok | — |
| rDNA | 45S → 18S + 5,8S + 28S; 5S fora do nucléolo; ~80 proteínas | ok | Alberts, cap. 6 |
| Idades | eucariotos ~2 bi; mitocôndria 1,5–2 bi; cloroplasto ~1,5 bi de anos | ok, ordem de grandeza | Archibald, 2015 |

---

## 3. Linguagem e nível

- **Bom nível no geral.** Analogias ("crachá", "porta giratória", "cômodos", "colar de contas", "árvore de Natal") e frases como "a água segue o soluto" funcionam bem. As animações das três tonicidades e da bomba em 6 passos são ótimas para aula.
- **"golgiense" como substantivo:** `(retículo, golgiense, lisossomos, mitocôndrias...)` e `['Origina','carioteca, RE, golgiense, lisossomos']`. "Golgiense" é adjetivo: usar **"complexo golgiense"**. O mesmo módulo tem o link `['Complexo de Golgi','../celula/index.html#golgi']`. Sugiro, na primeira menção, `complexo golgiense (complexo de Golgi)`, e depois um termo só (ver C2).
- **Três grafias no mesmo módulo:** eucariota (texto), `'eucarionte com mitocôndrias'` (rótulo) e `['Hospedeira','eucarioto com mitocôndrias']` (kv). As três estão em dicionários, mas é preciso escolher uma (ver C3).
- **Instruções de interface dentro do texto científico:** `Toque no tópico de novo para reiniciar.` e `O controle deslizante passa sozinho pelos níveis até você mexer nele.` ficam melhores numa dica separada, fora do `d`.
- **Acima do ensino médio, mas aceitável como aprofundamento:** DPPC/DOPC e Tm, mOsm/L, nucleoporinas FG, NLS, Ran-GTP, condensinas e coesinas, cardiolipina, Asgard, 45S e 5,8S, kDa. Seguir o padrão de dica curta já proposto no `resumo.md` (item 5). Os essenciais para o ENEM (carioteca, cromatina, nucléolo, osmose, plasmólise, hemólise, transporte ativo, fagocitose, pinocitose, endossimbiose) estão todos presentes e bem explicados.
- **Termos que o ENEM usa e que faltam:** "turgescência" e "deplasmólise" (a volta da célula plasmolisada em água pura), "pressão osmótica", "potencial hídrico" (só como nome), "difusão facilitada" ligada à insulina (o GLUT4 vai para a membrana por ação da insulina, gancho para diabetes), "cariótipo" e "trissomia" (o tópico Cromossomos cita o 21 como acrocêntrico, mas não fala da síndrome de Down).

---

## 4. Contradições com o módulo Célula

- **C1 · Membranas da bactéria.** O Célula (`parede_bac.d`) diz que a *E. coli* tem `membrana externa`. Aqui, ela não aparece na procariota (E4), e a endossimbiose conta a bactéria como dona de uma única membrana (E2). Corrigir o 06; o Célula está certo.
- **C2 · Nome do Golgi.** O Célula usa `Complexo de Golgi` (e só "Golgi" nos textos); o 06 usa `complexo golgiense`. Escolher um termo para o site todo. Sugiro "complexo golgiense (complexo de Golgi)" na primeira menção de cada módulo.
- **C3 · Procarionte × procariota.** O Célula usa `procarionte` e `eucarionte`; o 06 usa "procariota" e "eucariota" (e "eucarioto"). Unificar.
- **C4 · Antibióticos e mitocôndria.** O Célula (`ribo70.d`) diz que os antibióticos travam o ribossomo bacteriano `sem afetar o humano`; o 06 (`evid`) diz que `alguns antibióticos têm efeitos colaterais nas mitocôndrias`. O 06 está certo. A correção S4 do `celula.md` resolve a contradição; vale aplicá-la junto.
- **Sem contradição nos números:** E. coli (~2 µm, 4,6 Mb, 20 min, 20–70 mil ribossomos), poro (~120 nm, simetria de 8), mtDNA (16 569 pb, 37 genes), cpDNA (120–160 kb), hemácia (7,5 µm), espessura da membrana (5–10 nm com proteínas), núcleo (~6 µm), mielina (~79% lipídio).
- **O 06 evita o problema do E3 do Célula:** o kv do núcleo diz explicitamente `DNA humano`, e o tópico é sobre o núcleo em geral, não sobre a levedura.

---

## 5. ENEM

**Habilidades:**
- **H14**: equilíbrio interno. Osmose e soro fisiológico, hemólise, bomba de sódio e potássio, absorção intestinal (microvilos, cotransporte de glicose com Na⁺).
- **H15**: interpretar modelos. Mosaico fluido, níveis de compactação da cromatina, poro nuclear, modelo endossimbiótico.
- **H16**: evolução. Endossimbiose, origem das endomembranas, procariotos × eucariotos.
- **H13**: transmissão da vida. Cromossomos, cariótipo humano, corpúsculo de Barr, cromossomos acrocêntricos (base da translocação robertsoniana e da trissomia do 21).
- **H17**: ler gráficos, tabelas e escalas. Barras de composição das membranas, escala logarítmica de tamanhos, tabela procarioto × eucarioto.
- **H18**: propriedades ligadas a uma finalidade. Soro a 0,9%, conservação de alimentos com sal ou açúcar (osmose), uso clínico de soluções isotônicas.
- **H28**: adaptação. Organismos de ambientes frios com mais ácidos graxos insaturados (fluidez).
- **H30**: saúde. Antibióticos e mitocôndrias, LDL e colesterol (endocitose mediada por receptor), desidratação.
- **H3**: ciência como construção. Modelo de Singer e Nicolson (1972); endossimbiose de Margulis, inicialmente rejeitada e depois confirmada por dados genéticos.

**Temas recorrentes cobertos:** osmose (salgar carne, compotas, água do mar não mata a sede, soro caseiro, plasmólise na salada temperada cedo); transporte passivo × ativo; bomba de sódio e potássio; fagocitose e pinocitose; especializações (microvilos e absorção); diferenças procarioto × eucarioto; evidências da endossimbiose; núcleo, cromatina e cromossomos; razão superfície/volume.

**Lacunas em relação ao que o `resumo.md` esperava do módulo 06:**
- **Organelas em função** (RE → golgiense → secreção, lisossomos e autofagia, peroxissomos, síntese proteica em sequência) aparecem só como links para o módulo Célula. Um tópico "Caminho da secreção" (por exemplo, a insulina do ribossomo à exocitose) amarraria endocitose, exocitose e núcleo, e é um tema que aparece em questões com aminoácidos radioativos (o experimento de pulso e caça, de Palade).
- **Divisão celular** (mitose, meiose, crossing-over): continua sem módulo. O tópico Cromossomos dá a base, e o item 7 das lacunas do `resumo.md` continua aberto.

**Ideias de pergunta no estilo ENEM:**
1. "Para conservar carnes, é comum salgá-las. Esse método impede a proliferação de bactérias porque…" Resposta: o meio hipertônico tira água das células bacterianas por osmose. Distratores: "o sal mata as bactérias por ser tóxico", "o sal entra na bactéria e a faz estourar". A tela Osmose dá a base, sobretudo depois da correção E1.
2. "Uma pessoa recebeu, por engano, soro com água destilada na veia. O efeito esperado sobre as hemácias é…" Resposta: hemólise, porque a água entra por osmose. Distrator clássico: "crenação" (inverte hipo e hiper).
3. "Na fibrose cística, um canal de Cl⁻ não funciona…" ou "O digitálico inibe a bomba de Na⁺/K⁺…": perguntas que pedem para distinguir transporte passivo por canal de transporte ativo. As telas Difusão facilitada e Bomba mostram a diferença lado a lado.
