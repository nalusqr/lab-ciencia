# Revisão de Biologia: Biologia Molecular

Revisor: Taxon. Material: `site/biologia-molecular/index.html`, `cenas-a.js` e `cenas-b.js` (Apolo), `cenas-enzimas-vitaminas.js` (Prometeu); capturas em `/mnt/project-files/prints/biomol/` (`pc-*`, `cel-*`, `prom-d-*`).
Veredito: **aprovar com 3 correções obrigatórias** (A-E1, P-E1, P-E2). As demais são recomendadas e podem entrar depois.

## O que está correto

### Apolo: composição, água e sais (`cenas-a.js`)
- **Composição da célula (Alberts):** animal [70, 18, 5, 2, 1, 1, 3] e bactéria [70, 15, 2, 3, 7, 1, 2] batem com a tabela do Alberts. A grade de 100 quadrados com "cada quadrado = 1% da massa" é uma ótima leitura (`pc-comp-celula.png`).
- **Elementos do corpo:** O ≈ 65% da massa, C ≈ 18,5%, H ≈ 62% dos átomos. CHONPS "cerca de 98%" (a soma real é ~97,5%): adequado.
- **Teor de água por tecido:** os valores (pulmões 83, músculos 79, rins 79, encéfalo 73, coração 73, pele 64, ossos 31, adiposo 15) batem com Mitchell et al. (1945), a fonte clássica dessa tabela. Por idade: embrião ~90, recém-nascido ~75, adulto ~60, idoso 50–55. Correto.
- **Capilaridade e xilema:** h ≈ 29,7/d mm (lei de Jurin, água a 20 °C) está certo. O texto diz que a capilaridade sozinha não basta para árvores altas e chama a coesão-tensão. É exatamente o ponto que os livros erram, e aqui está certo.
- **Gelo e calor:** densidade 0,92 g/cm³, ângulo de 104,5°, calor específico da areia ~0,2 cal/g·°C, calor de vaporização ~540 cal/g. Correto.
- **NaCl 0,9% e osmose:** isotonia do soro fisiológico, hemácia em meio hipo e hipertônico, conservação com sal ou açúcar. Correto.
- **Políticas públicas:** sal iodado por lei (Lei 6.150/1974) e farinhas de trigo e de milho fortificadas com ferro e ácido fólico (RDC Anvisa). Correto.
- **Cálcio e raquitismo:** já vem "junto com a vitamina D", sem atribuir o raquitismo só ao cálcio. Bom.
- **Carboidratos:** mono, di e polissacarídeos; amido × celulose (α × β); ruminantes com microrganismos (mutualismo); teste do iodo. Correto.

### Apolo: lipídios, proteínas e ácidos nucleicos (`cenas-b.js`)
- **Lipídios:** proibição da gordura trans pela Anvisa a partir de 2023 está certa. O tom de "LDL ruim, HDL bom" está bem resolvido: vem marcado como "de forma simplificada", e o texto diz que LDL e HDL **não são tipos de colesterol**, e sim lipoproteínas que o transportam. "Cerca de dois terços produzidos pelo fígado": aceitável.
- **Aminoácidos essenciais:** os 9 estão certos (His, Ile, Leu, Lys, Met, Phe, Thr, Trp, Val), com a nota sobre a arginina. A complementaridade arroz (metionina) e feijão (lisina) está certa.
- **Fenilcetonúria:** a enzima que falta transforma fenilalanina em tirosina; teste do pezinho; dieta; aviso "contém fenilalanina" do aspartame. Correto.
- **Chargaff:** A = T e C = G, com A + G = T + C. O exemplo resolvido (100 pares, 30% de A → 240 ligações de hidrogênio) está certo.
- **Ligações de hidrogênio:** A–T 2, C–G 3, com o empilhamento das bases como principal estabilizador da dupla-hélice. Correto e acima da média dos livros didáticos.
- **Proteínas:** ligação peptídica, níveis estruturais e desnaturação. Correto.

### Prometeu: enzimas e vitaminas (`cenas-enzimas-vitaminas.js`)
- **Modelos de encaixe:** Fischer 1894 (chave-fechadura) e Koshland 1958 (encaixe induzido, "mais aceito hoje"). Datas e autores certos. "Quase todas são proteínas" deixa espaço para as ribozimas. Bom.
- **Energia de ativação:** a enzima baixa o pico e não muda a energia dos reagentes, a dos produtos nem o ΔG. As pegadinhas listadas ("fornece energia", "mais exotérmica") são as da prova.
- **pHs ótimos:** pepsina ~2 (estômago), amilase salivar ~6,8 (boca), tripsina ~8 (intestino delgado). Correto.
- **Temperatura:** ótimo perto de 37 °C; frio inibe sem desnaturar (geladeira); calor desnatura, em geral de forma irreversível; *Thermus aquaticus* e Taq polimerase no PCR, perto de 70 °C (o ótimo real é de 72 a 80 °C). Correto.
- **Inibição:** a competitiva se resolve com mais substrato (mesma Vmáx); a não competitiva reduz a Vmáx. As sulfas imitam o PABA e competem pelo sítio ativo da enzima bacteriana que faz ácido fólico. Correto. As curvas estão certas: Km × 5 na competitiva, Vmáx × 0,45 na não competitiva.
- **Vitaminas:**
  - ADEK lipossolúveis, com armazenamento e risco de hipervitaminose; C e complexo B hidrossolúveis.
  - A reserva hepática de B12 (anos) está certa e é bem notada.
  - A vitamina D é feita na pele com sol.
  - A vitamina K também é produzida por bactérias do intestino.
  - Funções, carências e fontes da tabela (A, D, E, K, C, B1, B9, B12) estão todas certas: xeroftalmia, raquitismo e osteomalácia, escorbuto, beribéri e arroz polido, tubo neural com B9, e B12 só em alimentos de origem animal.
- **Anemia perniciosa:** associada à falta de fator intrínseco, com "poucas hemácias, grandes e imaturas" (megaloblástica). Correto no núcleo. Ver P-E2 para a formulação.

### `index.html`
- Rodapé com as fontes (Alberts, Lehninger, Campbell, Amabis & Martho, Guyton, Emsley, DRI, Guia Alimentar 2014, Watson & Crick 1953, Chargaff 1950) e as notas "cores adicionadas, fora de escala" e "curvas são modelos didáticos". Adequado.
- Legenda CPK (O, H, C, N, P): correta.

## Erros (o aluno aprenderia errado)

### Apolo

**A-E1. Iodo apresentado como uma das carências mais comuns no Brasil hoje. Prioridade: obrigatória (média).**
- **Onde:** `cenas-a.js:286` ("As carências mais comuns no Brasil são de ferro (anemia), de cálcio e de iodo.").
- **O problema:** a deficiência de iodo foi praticamente controlada no Brasil justamente pela iodação do sal, que o próprio parágrafo cita logo em seguida. Do jeito que está, a frase contradiz a política pública que ela apresenta como exemplo de sucesso. Ferro (anemia) e, em parte, vitamina A e cálcio continuam sendo carências relevantes.
- **Correção:** "As carências mais comuns no Brasil são de **ferro** (anemia) e de **cálcio**. A de **iodo**, que causava bócio, era comum e foi controlada pela iodação do sal, obrigatória por lei desde 1974." O cartão ENEM da linha 289 ("iodo e bócio") pode ficar como está.

**A-R1. Recomendado: massa seca dos ácidos nucleicos (prioridade baixa).**
- `cenas-a.js:23`, terceira série [0, 60, 17, 7, **3**, 3, 10]: pelo Alberts, DNA + RNA ≈ 1,35% da massa total, ou seja, ~4,5% da massa seca. Sugestão: [0, 60, 16, 7, **5**, 3, 9] (a soma continua 100). Se mexer na grade der trabalho, pode ficar; a ordem de grandeza está certa.

**A-R2. Recomendado: onde existe RNA (prioridade baixa).**
- `cenas-b.js:313`, linha "Onde": "RNA: núcleo e citoplasma". Sugestão: "RNA: núcleo, citoplasma (ribossomos), mitocôndria e cloroplasto". O DNA já cita mitocôndria e cloroplasto; o RNA ficou para trás, e o aluno pode concluir que essas organelas não fazem proteína.

**A-R3. Recomendado: "todas as células têm o mesmo DNA" (prioridade baixa).**
- `cenas-b.js:312`: a exceção citada é só a hemácia. Sugestão: "(com poucas exceções, como as hemácias dos mamíferos, que não têm núcleo, e os gametas, que têm metade do DNA)". Isso liga com o módulo 07 (meiose).

**A-R4. Recomendado: nome da enzima da fenilcetonúria (opcional).**
- `cenas-b.js:134`: pode acrescentar "(a fenilalanina-hidroxilase)". Não é cobrado no ENEM, mas é o termo que o aluno vai encontrar se for pesquisar.

**A-R5. Recomendado: por que o soro caseiro leva açúcar (opcional).**
- `cenas-a.js:312`: acrescentar "o açúcar ajuda o intestino a absorver o sódio, e a água vai junto". Sem isso, o aluno costuma achar que o açúcar está lá "para dar energia".

**I-R1. Recomendado: fonte da tabela de água por tecido (`index.html`, rodapé; prioridade baixa).**
- Os números de `TEC` são os de Mitchell, Hamilton, Steggerda & Bean, *J. Biol. Chem.* 158:625 (1945), reproduzidos em vários livros. Guyton cobre a água corporal total, mas não essa tabela. Sugestão: acrescentar "Mitchell et al., 1945 (água por tecido)".

### Prometeu

**P-E1. Legenda de temperatura diz que a termófila "está no seu melhor" quando ela está com 13%. Prioridade: obrigatória (alta, contradiz o gráfico).**
- **Onde:** a legenda dinâmica de `enz/temperatura` (`cenas-enzimas-vitaminas.js:142`), condição `T0 > 45 && T0 < 80`.
- **O problema:** pelo próprio `tAct`, a termófila tem 13% a 46 °C, 23% a 50 °C e 42% a 55 °C. A frase "a termófila está no seu melhor" aparece em toda essa faixa, enquanto o número na mesma legenda diz o contrário. O aluno lê que "o ótimo da termófila começa onde a humana desnatura", o que está errado.
- **Correção:** separar as duas condições.
  - Quando `T0 > 45`: "A humana já **desnaturou**."
  - Quando `b >= 80` (entre ~63 e 77 °C pelo modelo): acrescentar "a termófila está perto do seu ótimo".
  - Quando `T0 > 45` e `T0 < 63`: "a termófila ainda está abaixo do seu ótimo".
  - Manter "As duas estão desnaturando" para `T0 >= 80`.

**P-E2. A anemia perniciosa aparece como se também pudesse ter causa alimentar. Prioridade: obrigatória (média).**
- **Onde:** texto de `vit/avitaminoses`: "Na **anemia perniciosa**, a causa mais comum nem é a dieta: o estômago deixa de produzir o fator intrínseco..."
- **O problema:** por definição, anemia perniciosa é a anemia por falta de **fator intrínseco**, quase sempre autoimune (gastrite atrófica). "A causa mais comum nem é a dieta" sugere que ela também tem causa alimentar. Quando o problema é falta de B12 na dieta (por exemplo, numa alimentação vegetariana estrita sem suplemento), a anemia é megaloblástica por carência de B12, mas não é chamada de perniciosa.
- **Correção:** "Na **anemia perniciosa**, a B12 até chega pela comida, mas não é absorvida: o estômago deixa de produzir o **fator intrínseco**, proteína necessária para absorver a vitamina B12 no intestino (em geral por uma doença autoimune). A falta de B12 na dieta causa uma anemia parecida. Por isso, quem não come nenhum alimento de origem animal precisa de B12 suplementada: as plantas não a fornecem." A associação "anemia perniciosa → B12" do cartão ENEM continua certa.

**P-R1. Recomendado: metais pesados (prioridade média-baixa).**
- `enz/inibicao`, cartão ENEM: "Metais pesados, como mercúrio e chumbo, se ligam a outras partes das enzimas e mudam sua forma." O tipo de inibição não é nomeado. Sugestão: "...se ligam a grupos –SH (enxofre) fora do sítio ativo e mudam a forma da enzima: agem como inibidores **não competitivos** e, muitas vezes, **irreversíveis**." É assim que a prova os classifica, e o aluno precisa do nome para ligar o exemplo ao gráfico.

**P-R2. Recomendado: por que a sulfa não nos prejudica (opcional).**
- Depois do exemplo do PABA, pode acrescentar: "Nós não fabricamos ácido fólico, que vem da dieta, e por isso a sulfa atinge a bactéria e não as nossas células." É o raciocínio de toxicidade seletiva que a prova cobra junto.

**P-R3. Recomendado: quanto a enzima acelera (prioridade baixa).**
- `enz/ativacao`: "milhares ou milhões de vezes" subestima. Para muitas enzimas, o aumento é de milhões a bilhões de vezes ou mais. Sugestão: "milhões de vezes ou mais".

**P-R4. Recomendado: subida da curva humana (prioridade baixa).**
- O texto ENEM fala em "morro assimétrico: sobe devagar e cai de repente", mas `TEMP[0]` usa `w: 13`, `d: 8.5`. Com isso, a curva tem 13% a 20 °C e 1% a 10 °C, e a subida fica quase tão íngreme quanto a queda (`pc-enz-temperatura.png`). Sugestão: `w` entre 18 e 20 para a enzima humana (~35–45% a 20 °C), o que deixa a assimetria visível e combina com "no frio fica lenta".

## Simplificações aceitáveis (não mexer)
- **Água e metabolismo:** "tecidos de metabolismo intenso têm mais água" (o encéfalo tem 73%, menos que os pulmões, com 83%). É regra de livro didático e de ENEM; os números mostram a nuance.
- **CHONPS** como "cerca de 98%"; **tecido de reserva e sustentação** com pouca água.
- **"LDL ruim, HDL bom"**, já marcado como simplificação no texto.
- **Inibidor não competitivo** descrito como "liga-se a outro ponto e deforma o sítio ativo" (modelo alostérico do ensino médio). As curvas "alcança/não alcança a Vmáx" são o critério certo para a prova.
- **Vitaminas como coenzimas:** "muitas funcionam como coenzimas" vale para o complexo B; A e D agem mais como hormônios. O "muitas" protege a frase.
- **"A vitamina D é a única que o corpo produz em boa quantidade"**: a niacina também pode vir do triptofano, e a K vem das bactérias intestinais (já citada). Aceitável no nível do módulo.
- **Taq "perto de 70 °C"** (o ótimo real é de 72 a 80 °C).
- **Curvas de enzima** como gaussianas assimétricas, declaradas no rodapé como modelos didáticos.
