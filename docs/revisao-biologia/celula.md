# Revisão · Módulo 05 · A célula por dentro (3D)

Arquivos-fonte revisados (o `site/celula/index.html` é gerado a partir deles pelo `build.sh`):
- `/tmp/claude-0/r3f/data.js`: objeto `ORG` (t título, s subtítulo, d descrição, kv pares)
- `/tmp/claude-0/r3f/src/c_details.js`: rótulos `lab(s,'...')` das telas de detalhe
- `/tmp/claude-0/r3f/src/d_app.js`: `CELLS`, ou seja, as listas de organelas de cada tipo de célula

Atenção: esses fontes estão em `/tmp` e podem ser apagados. Recomendo ao engenheiro copiá-los para dentro do projeto antes de aplicar as correções.

No geral, o módulo é rico e quase todos os números estão certos (ver a tabela da seção 3). Os erros estão concentrados em quatro pontos clássicos de prova: as estruturas "exclusivas" da célula animal, o bombeamento de prótons na mitocôndria, o texto do núcleo humano reaproveitado em outras células e a "gota" de 1 µL.

---

## 1. Erros (por gravidade)

### E1 · "Exclusivas: centríolos, lisossomos" (alta, tema clássico do ENEM)
- **Onde:** `data.js`, `celula_animal.kv`.
- **Trecho:** `['Exclusivas','centríolos, lisossomos']`
- **Problema:** centríolos não são exclusivos da célula animal. Existem em algas, musgos, samambaias e em algumas gimnospermas (como Ginkgo e cicas, nos gametas móveis); só faltam nas **plantas com flores** (angiospermas). O próprio módulo diz isso em `centriolo.d`: `Plantas com flores não têm centríolos`. As duas telas se contradizem. Quanto aos lisossomos, nas plantas a função é feita pelo vacúolo. Questões de "célula animal × vegetal" usam exatamente essa pegadinha.
- **Texto proposto:** `['Típicas da animal','centríolos (ausentes nas plantas com flores) e lisossomos']`
- **Ajuste relacionado (baixa):** em `celula_vegetal.kv`, o trecho `['Exclusivas','cloroplastos, parede, vacúolo central']` deve virar `['Que a animal não tem','cloroplastos, parede de celulose, vacúolo central']`. Algas também têm cloroplastos, e fungos e bactérias também têm parede, então "exclusivas" é forte demais.

### E2 · Mitocôndria: prótons bombeados "para fora" (alta)
- **Onde:** `data.js`, `mitocondria.d`.
- **Trecho:** `Nela, a cadeia respiratória bombeia prótons (H⁺) para fora, e eles voltam passando pela <b>ATP sintase</b>`
- **Problema:** os prótons vão da **matriz para o espaço entre as duas membranas**, não para fora da mitocôndria. "Para fora" leva o aluno a imaginar H⁺ indo para o citoplasma, e o modelo quimiosmótico deixa de fazer sentido.
- **Texto proposto:** `Nela, a cadeia respiratória bombeia prótons (H⁺) da matriz para o espaço entre as duas membranas, e eles voltam para a matriz passando pela <b>ATP sintase</b>`

### E3 · O núcleo da levedura e da célula vegetal mostra texto de célula humana (média)
- **Onde:** `d_app.js`, `CELLS.levedura` e `CELLS.vegetal` usam a chave `'nucleo'`. O texto de `ORG.nucleo.d` começa com `Nas células humanas são 46 cromossomos; esticado, o DNA de uma única célula mediria cerca de <b>2 metros</b>`, e o kv tem `['DNA humano','46 cromossomos, ~2 m esticado']`.
- **Problema:** ao tocar no núcleo da levedura, o aluno lê "46 cromossomos, 2 m". A levedura tem 16 cromossomos e ~12 milhões de pb, o que dá uns 4 mm esticados. Na célula vegetal, o número também não é humano.
- **Correção proposta:**
  1. Deixar `ORG.nucleo.d` genérico, começando por: `<b>Onde fica o DNA.</b> Numa célula humana são 46 cromossomos; esticado, esse DNA mediria cerca de <b>2 metros</b>…` (o resto igual).
  2. Criar `ORG.nucleo_lev` e usá-lo em `CELLS.levedura` no lugar de `'nucleo'`:
     `nucleo_lev:{t:'Núcleo',s:'16 cromossomos',c:'#9775fa',bar:[1,'µm'], d:\`<b>Igual ao nosso no essencial:</b> o DNA fica dentro de um envelope de duas membranas com poros. Mas é bem menor: ~2 µm, com <b>16 cromossomos</b> e uns 12 milhões de pares de bases (cerca de 250 vezes menos DNA que uma célula humana). Na levedura, o envelope nuclear não se desfaz na divisão.\`, kv:[['Diâmetro','~2 µm'],['Cromossomos','16'],['Genoma','~12 milhões de pb'],['Membranas','2 (envelope nuclear)']],links:[['DNA dupla hélice','../dna/index.html']]}`
  Conta usada: 12 Mb contra ~3,1 Gb (haploide) dá ~260×; contra a célula diploide humana (6,2 Gb), ~500×. "Cerca de 250 vezes menos que o genoma humano" é a forma segura.

### E4 · "Uma gota de sangue de 1 µL" (média)
- **Onde:** `data.js`, `celula_sangue.d`.
- **Trecho:** `<b>Uma gota de sangue de 1 µL tem uns 5 milhões de hemácias</b>`
- **Problema:** uma gota tem cerca de 50 µL. 1 µL é 1 mm³, a unidade dos hemogramas. Questões com hemograma são comuns no ENEM, e a confusão de unidade importa.
- **Texto proposto:** `<b>Um microlitro de sangue (1 µL = 1 mm³, umas 50 vezes menos que uma gota) tem uns 5 milhões de hemácias</b>`

### E5 · Peroxissomo: o "cristal" não é de catalase (baixa a média)
- **Onde:** `data.js`, `peroxissomo.d`. O rótulo 3D em `c_details.js` já diz `'cristal de enzima (urato oxidase)'`.
- **Trecho:** `A enzima <b>catalase</b>, muitas vezes formando um "cristal" no centro, quebra o H₂O₂`
- **Problema:** o núcleo cristalino dos peroxissomos (em fígado de rato, por exemplo) é de **urato oxidase**, não de catalase (Alberts, cap. 12). O texto contradiz o rótulo da própria tela. Detalhe útil: os humanos **não têm** urato oxidase, por isso acumulamos ácido úrico (gota).
- **Texto proposto:** `A enzima <b>catalase</b> quebra o H₂O₂: 2 H₂O₂ → 2 H₂O + O₂ (bolhas). Em muitos animais, como o rato, outra enzima, a urato oxidase, forma um "cristal" no centro; os humanos perderam essa enzima, e por isso o ácido úrico pode se acumular e causar gota.`

### E6 · Espermatozoide: "A cabeça leva só o DNA" (baixa)
- **Onde:** `data.js`, `celula_esperma.d`.
- **Trecho:** `A cabeça leva só o DNA, bem compactado`
- **Problema:** a cabeça leva o núcleo **e o acrossomo**, que o próprio módulo mostra na tela seguinte.
- **Texto proposto:** `A cabeça leva o núcleo, com o DNA bem compactado, e o acrossomo`

---

## 2. Simplificações que enganam

### S1 · 30–32 ATP × 36–38 ATP dos livros (alta para o ENEM)
- **Trecho (mitocondria.d):** `Uma glicose rende cerca de 30–32 ATP.`
- O valor atual está **certo** (Alberts; Lehninger, 7ª ed.). Mas muitos livros didáticos brasileiros, e questões antigas, usam 36 ou 38, e o aluno vai estranhar. **Acrescentar:** `Livros mais antigos falam em 36 ou 38 ATP; medidas mais recentes da ATP sintase e do transporte pela membrana deram o valor menor.`

### S2 · Cloroplasto: "onde a luz vira energia"
- **Rótulo (c_details.js):** `'tilacoide: onde a luz vira energia'`. A luz já é energia.
- **Proposta:** `'tilacoide: luz → energia química (ATP)'`. Na descrição (`cloroplasto.d`), depois de `vem da quebra da água</b> (bolhas)`, acrescentar: `Isso acontece nos tilacoides (fase clara). No estroma, o ciclo de Calvin usa o ATP e o CO₂ para fazer o açúcar (fase escura, que também acontece com luz).` As fases clara e escura caem muito no ENEM.

### S3 · Levedura: "Sem oxigênio, ela fermenta"
- **Trecho (celula_levedura.d):** `Sem oxigênio, ela <b>fermenta</b> o açúcar`
- O nível está ok para o ensino médio. Só que, com muito açúcar, a *S. cerevisiae* fermenta mesmo com oxigênio, e na massa de pão o oxigênio acaba logo. Sugestão: `Sem oxigênio (e mesmo com ele, quando há muito açúcar), ela <b>fermenta</b>…`. Para o ENEM, vale acrescentar: `Com oxigênio, ela também respira e tira muito mais energia de cada glicose.` A comparação entre respiração e fermentação é tema recorrente.

### S4 · Ribossomo 70S: antibióticos "sem afetar o humano"
- **Trecho (ribo70.d):** `que travam o ribossomo da bactéria sem afetar o humano.`
- **Proposta:** `que travam o ribossomo da bactéria e quase não afetam os nossos. Os ribossomos das nossas mitocôndrias, parecidos com os bacterianos, às vezes são atingidos, mais uma pista da origem bacteriana da mitocôndria.` Liga com a endossimbiose (H16).

### S5 · Golgi: a glicosilação não começa no Golgi
- **Trecho (golgi.d):** `as proteínas atravessam a pilha ganhando "etiquetas" de açúcares (glicosilação)`
- **Proposta:** `as proteínas atravessam a pilha e têm suas "etiquetas" de açúcares (colocadas no retículo) modificadas e completadas`. Prioridade baixa.

### S6 · "a energia vem das mitocôndrias" (célula animal)
- Aceitável, mas o mais preciso é: `a maior parte do ATP vem das mitocôndrias (a glicólise acontece no citoplasma)`.

### S7 · Plasmídeos "se copiam sozinhos"
- **Proposta:** `se replicam independentemente do cromossomo (usando as enzimas da bactéria)`. Assim o aluno não pensa que o plasmídeo é um ser autônomo.

### S8 · Sinapse: só a química
- O texto descreve só a sinapse química, que é a importante. Basta trocar `Onde um neurônio passa o sinal` por `Na sinapse química, a mais comum, o neurônio passa o sinal…`.

### S9 · Célula vegetal sem citoesqueleto na lista
- `CELLS.vegetal` não inclui `'citoesqueleto'`, embora a célula vegetal tenha um. Sugestão: incluir, para o aluno não concluir que só a animal tem citoesqueleto.

---

## 3. Valores numéricos conferidos

| Item | Valor no módulo | Situação | Referência |
|---|---|---|---|
| Célula animal | 10–30 µm | ok | Alberts |
| Corpo humano | ~30 trilhões de células | ok | Sender et al., 2016 |
| DNA de uma célula humana esticado | ~2 m | ok | Alberts |
| Poro nuclear | ~120 nm, simetria de 8 | ok | Alberts, cap. 12 |
| mtDNA humano | 16 569 pb, 37 genes | ok | Anderson et al., 1981 |
| ATP sintase | ~3 ATP por volta | ok | Lehninger |
| Cloroplasto | 5–10 µm; DNA 120–160 kb | ok | Campbell; Alberts |
| Lisossomo | pH 4,5–5; ~60 hidrolases | ok (Alberts antigo diz ~40) | Alberts |
| Ribossomo | 80S = 60S + 40S; 25–30 nm | ok | Alberts |
| Velocidade de tradução | ~5 aa/s | ok (Alberts cita ~2/s; medidas recentes dão 5–6) | Ingolia et al., 2011 |
| Microtúbulo / actina / intermediário | 25 / 7 / 10 nm; 13 protofilamentos | ok | Alberts, cap. 16 |
| Cinesina | 8 nm, 1 ATP por passo | ok | Alberts |
| Centríolo | 9 trincas; ~0,2 × 0,5 µm | ok | Alberts |
| Vacúolo central | até ~90% do volume | ok | Campbell |
| E. coli | ~2 µm; 4,6 Mb; ~4 300 genes; 20 min | ok | Blattner et al., 1997 |
| Ribossomos de E. coli | 20–70 mil | ok | — |
| Neurônios no cérebro | ~86 bilhões | ok | Azevedo et al., 2009 (estudo brasileiro, vale citar!) |
| Condução | até ~120 m/s | ok | Kandel |
| Fenda sináptica | ~20 nm; ~100 trilhões de sinapses | ok | Kandel |
| Espermatozoide | ~55 µm; 50–75 mitocôndrias | ok | — |
| Levedura | 16 cromossomos, ~12 Mb, genoma de 1996 | ok | Goffeau et al., 1996 |
| Hemácia | 7,5 µm; ~270 milhões de Hb; 120 dias | ok | Campbell |
| Leucócitos / plaquetas | 4–11 mil e 150–400 mil por µL | ok | valores de referência do hemograma |
| Fago T4 | ~200 nm; 169 kb; ~300 genes; capsídeo 110 × 85 nm; bainha 98 → 42 nm | ok | Miller et al., 2003 |

O dado dos 86 bilhões de neurônios vem do grupo de Suzana Herculano-Houzel (UFRJ). É um bom gancho para "ciência feita no Brasil" (H3).

---

## 4. Linguagem e nível

- **Bom nível no geral:** analogias ("correio da célula", "crachá", "seringa") e frases curtas. Manter.
- **"pontes de hidrogênio"**: não aparece aqui, ótimo. Já **"ponte dissulfeto"** está correto.
- **"grana"** (cloroplasto): `pilhas de discos chamadas <b>grana</b>`. "Grana" é o plural de "granum", e o rótulo 3D usa `'granum (pilha de tilacoides)'`. Sugestão: `pilhas de discos, cada uma chamada <b>granum</b> (plural: grana)`.
- **"O 'estômago' da célula"** (lisossomo): é uma analogia comum, mas o estômago não "digere organelas velhas". Prefira **"centro de reciclagem"**, que combina com o subtítulo `reciclagem`.
- **Termos que o ENEM usa e o módulo não usa:** "glicocálix" (os açúcares-crachá da membrana), "autofagia" (já aparece na levedura, bom), "fagocitose" (já aparece no leucócito, bom), "osmose" e "plasmólise" (ver S10 abaixo).
- **S10 · Vacúolo e osmose:** `Quando falta água, o vacúolo murcha e a planta também` está correto. Acrescentar a palavra-chave da prova: `…a planta também murcha. Em água muito salgada, a célula perde água por osmose e a membrana se descola da parede (plasmólise).`
- **Neurônio e espermatozoide** não fazem parte do "padrão" animal × vegetal do livro, mas são ótimos para mostrar a diferenciação celular. Vale uma frase na célula animal: `Todas as células do corpo têm o mesmo DNA; o que muda é quais genes estão ligados.`

---

## 5. ENEM

**Habilidades:**
- **H15**: interpretar modelos de organelas.
- **H14**: equilíbrio interno, defesa (neutrófilo, plaquetas), sangue.
- **H16**: endossimbiose, DNA próprio das organelas.
- **H13**: núcleo, cromossomos, gametas haploides, herança mitocondrial.
- **H11 e H29**: biotecnologia (plasmídeo com insulina, fermentação).
- **H30**: antibióticos (penicilina, alvo 70S) e resistência bacteriana.
- **H9**: fotossíntese e respiração no fluxo de energia.

**Temas recorrentes cobertos:** diferenças entre célula animal, vegetal e procariótica; vírus não é célula; organelas e suas funções; respiração × fermentação × fotossíntese; resistência a antibióticos (seleção natural e conjugação); hemograma; herança mitocondrial materna; teoria endossimbiótica.

**Ideias de pergunta no estilo ENEM:**
1. "O uso indiscriminado de antibióticos favorece bactérias resistentes. Essa resistência se espalha rapidamente entre bactérias de espécies diferentes principalmente porque…" Resposta: genes de resistência em plasmídeos passam por conjugação. Distratores: "o antibiótico induz a mutação" (erro clássico de lamarckismo), "a bactéria se adapta durante o tratamento". As telas Plasmídeo e Pili dão a base.
2. "Mitocôndrias e cloroplastos têm DNA circular e ribossomos parecidos com os bacterianos, e alguns antibióticos que agem no ribossomo 70S podem afetar a mitocôndria. Esses dados reforçam qual hipótese?" Resposta: endossimbiose. O aluno compara as telas Mitocôndria, Cloroplasto e Ribossomos 70S.
