# Revisão de Biologia · Módulo 01 · DNA (gene HBB)

Arquivo revisado: `site/dna/index.html` (todo o texto está nele, em HTML e em strings JS).
Revisor: professor de Biologia. Para aplicar: o engenheiro busca o trecho entre crases e troca pelo texto proposto.

Visão geral: o módulo é muito bom. A sequência, a posição da mutação e a troca de aminoácido estão certas: conferi `SEQ0` com o início da região codificante de NM_000518, e o índice `MUT=19` cai mesmo no A central do códon GAG. A geometria da forma B também está certa. Os problemas estão na nomenclatura, em uma explicação incompleta da genética da anemia falciforme e em duas simplificações clássicas.

---

## 1. Erros (por gravidade)

### E1 · Nomenclatura da mutação mistura dois sistemas (média)
- **Onde:** `site/dna/index.html`, rodapé.
- **Trecho:** `mutação HbS: c.20A&gt;T, p.Glu6Val (Ingram, 1957)`
- **Problema:** `c.20A>T` está na nomenclatura HGVS, que conta a partir do A do ATG. Nessa mesma nomenclatura a proteína é **p.Glu7Val**, porque a Met inicial é contada. "Glu6Val" é a numeração tradicional, sem a Met. Misturar as duas confunde quem for pesquisar.
- **Texto proposto:** `mutação HbS: c.20A&gt;T (p.Glu7Val na nomenclatura HGVS; tradicionalmente chamada Glu6Val, sem contar a Met inicial) (Ingram, 1957)`
- O resto do módulo pode continuar usando "Glu6", porque é o nome que os livros e o ENEM usam. Basta esta nota no rodapé.

### E2 · "nt 1–60" não corresponde à numeração do NM_000518 (baixa a média)
- **Onde:** subtítulo do cabeçalho.
- **Trecho:** `Homo sapiens · cromossomo 11p15.4 · NM_000518 · éxon 1, nt 1–60`
- **Problema:** no registro NM_000518, o nt 1 é o começo do mRNA, que tem uma região 5' não traduzida antes do ATG (a região codificante começa por volta do nt 51). Os 60 nt mostrados são os 60 primeiros **da região codificante** (c.1–60), que ficam no éxon 1.
- **Texto proposto:** `Homo sapiens · cromossomo 11p15.4 · NM_000518 · éxon 1, região codificante c.1–60`

### E3 · "Sem oxigênio" (baixa)
- **Onde:** função `note()`, nota do modo FALCIFORME.
- **Trecho:** `Sem oxigênio, ela gruda numa "bolsa" de outra hemoglobina`
- **Problema:** a HbS polimeriza quando está **desoxigenada**, ou seja, nos capilares e nas veias, onde a pressão de O₂ é baixa. Ela não precisa de ausência total de oxigênio.
- **Texto proposto:** `Quando a hemoglobina solta o oxigênio (nos capilares dos tecidos), essa valina gruda numa "bolsa" hidrofóbica de outra hemoglobina`

---

## 2. Simplificações que enganam

### S1 · A nota não diz quem fica doente: falta a genética (alta para o ENEM)
- **Trecho:** `as moléculas formam fibras longas e a hemácia se deforma em foice. Os outros 59 pares continuam iguais.`
- **Problema:** do jeito que está, o aluno entende que basta uma cópia do alelo para a hemácia virar foice. No ENEM esse é justamente o ponto cobrado: a doença é **autossômica recessiva**, o heterozigoto (traço falciforme, AS) quase não tem sintomas, e o alelo é frequente em regiões com malária porque os heterozigotos resistem melhor a ela. No Brasil, a doença é a hereditária mais comum, é detectada no teste do pezinho e é mais frequente na população negra.
- **Texto proposto (acrescentar ao fim da nota):** `Cada pessoa tem duas cópias do gene HBB, uma de cada pai. Quem herda o alelo HbS dos dois (SS) tem a anemia falciforme. Quem herda só um (AS) tem o traço falciforme e quase nunca tem sintomas. Na África, onde a malária é comum, o traço protege contra a forma grave da malária, e por isso o alelo ficou frequente. No Brasil, a doença é detectada no teste do pezinho.`

### S2 · "2 ou 3 pontes, por isso mais GC é mais estável" (média)
- **Trecho:** `A·T faz 2 pontes, G·C faz 3, por isso mais GC = DNA mais estável.`
- **Problema:** é o argumento de quase todo livro do ensino médio, mas a maior parte da estabilidade da dupla hélice vem do **empilhamento das bases**, que também é mais forte nos pares G·C (Alberts, cap. 4; Lehninger, cap. 8). Dá para manter a ideia sem ensinar errado.
- **Texto proposto:** `A·T faz 2 ligações de hidrogênio e G·C faz 3. Mais GC deixa o DNA mais estável: em parte por essas ligações, mas principalmente porque os pares G·C se empilham com mais força.`

### S3 · Larguras dos sulcos 22 Å / 12 Å (baixa)
- **Trechos:** `<div>Sulco maior / menor</div><div>≈ 22 Å / 12 Å</div>` e, no desenho, `'≈22 Å'` e `'≈12 Å'`
- **Problema:** 22 e 12 Å são as distâncias medidas **ao longo do eixo**, de fita a fita (é o valor que aparece em desenhos de livro). A largura real dos sulcos, medida de fosfato a fosfato e descontado o raio dos átomos, é de cerca de 12 Å (maior) e 6 Å (menor). Fonte: Dickerson, *Science* 1982; Saenger, *Principles of Nucleic Acid Structure*.
- **Proposta:** manter os números e acrescentar à legenda da seção IV: `Sulcos medidos ao longo do eixo da hélice; a abertura real, descontando os átomos, é de ~12 Å e ~6 Å.`

### S4 · Transcrição sem núcleo e sem splicing (baixa)
- **Trecho:** `A fita molde é lida pela RNA polimerase; o mRNA sai igual à fita codificante, com U no lugar de T`
- **Problema:** o texto está certo, mas o aluno não fica sabendo onde isso acontece nem que o gene tem íntrons. O HBB tem 3 éxons e 2 íntrons, e o ENEM às vezes cobra splicing.
- **Texto proposto:** `No núcleo, a RNA polimerase lê a fita molde (3'→5') e monta o RNA de 5' para 3'. O RNA tem a mesma sequência da fita codificante, com U no lugar de T. O gene HBB tem 3 éxons e 2 íntrons; os íntrons são cortados (splicing) antes de o mRNA ir para o citoplasma. O trecho mostrado fica todo no éxon 1.`

### S5 · "Cada 3 bases = 1 aminoácido" (baixa)
- **Trecho:** `Cada 3 bases = 1 aminoácido.`
- **Texto proposto:** `Cada códon (3 bases do mRNA) corresponde a 1 aminoácido ou a um sinal de parada.`

---

## 3. Valores numéricos conferidos

| Valor no módulo | Situação | Referência |
|---|---|---|
| HBB em 11p15.4 | correto | NCBI Gene 3043 |
| SEQ0 = 60 primeiros nt da região codificante | correto | NCBI RefSeq NM_000518 |
| GAG → GTG no códon 7 (Glu6 na numeração tradicional) | correto | Ingram 1957; Alberts |
| Subida 3,38 Å, 10,5 pb/volta, 34,3°, passo 35,5 Å, diâmetro ≈ 20 Å, raio dos fosfatos 8,9 Å | corretos (os livros arredondam para 3,4 Å e 10 pb, 34 Å por volta) | Arnott & Hukins 1972; Lehninger, cap. 8 |
| Sulcos 22 / 12 Å | ver S3 | Dickerson 1982 |
| Tm = 64,9 + 41·(GC−16,4)/N | fórmula de oligonucleotídeos; o asterisco já avisa | — |
| Massas dos nucleotídeos (313,2; 304,2; 329,2; 289,2) | corretas | tabelas usuais de oligos |
| "Met inicial é removida na proteína madura" | correto para a β-globina | Lehninger |

---

## 4. Linguagem e nível

- **Difícil demais:** "NM_000518", "c.20A>T", "pb", "Tm", "kDa", "Å", "RefSeq" e "B-DNA" aparecem sem explicação. Sugestão: um pequeno glossário ou dicas ao passar o mouse (pb = pares de bases; Tm = temperatura em que metade do DNA se separa; kDa = mil vezes a massa de um átomo de hidrogênio, aproximadamente).
- **"Pontes de hidrogênio"** (rótulo da seção III e nota da mutação): os livros atuais e o ENEM usam **"ligações de hidrogênio"**. Trocar em todo o site.
- **"íons Na⁺"**: na célula, quem neutraliza o DNA são sobretudo Mg²⁺, K⁺ e as proteínas histonas. Para um modelo em solução, Na⁺ serve, mas vale um `(em solução; na célula, histonas e Mg²⁺)`.
- **Classificação dos aminoácidos:** o DNA classifica Tyr como "polar" e His como "básico"; o módulo Biomoléculas classifica Tyr como "aromático". Unificar as cores e as classes nos dois módulos.
- O tom geral (frases curtas, "toque em FALCIFORME") está bom para o ensino médio.

---

## 5. ENEM

**Habilidades da Matriz (Ciências da Natureza):**
- **H13** (mecanismos de transmissão da vida): DNA → RNA → proteína, mutação e herança.
- **H15** (interpretar modelos): o modelo 3D da hélice e a tabela do código genético.
- **H17** (relacionar linguagens): sequência de letras ↔ códons ↔ aminoácidos ↔ estrutura.
- **H14 e H30** (saúde): anemia falciforme, teste do pezinho e aconselhamento genético.
- **H16** (evolução), se entrar a nota S1: seleção natural do alelo HbS em regiões com malária.

**Temas recorrentes da prova que o módulo cobre:** código genético e tradução (degeneração do código, complementaridade de bases), mutação pontual e efeito na proteína, anemia falciforme (tema clássico do ENEM, quase sempre ligado à malária), regra de Chargaff (A = T, G = C).

**Ideias de pergunta no estilo ENEM:**

1. *Contexto:* "Na anemia falciforme, a troca de uma única base no gene da β-globina (GAG → GTG) leva à substituição de um ácido glutâmico por uma valina." *Comando:* "Essa alteração causa a doença porque…" Resposta: a valina é hidrofóbica e faz as hemoglobinas desoxigenadas se agregarem em fibras. Distratores: "muda todos os aminoácidos seguintes" (confunde com mutação por deslocamento do quadro de leitura); "impede a transcrição do gene"; "altera o número de cromossomos".
   No módulo, o aluno pode testar com o botão FALCIFORME e ver que só um aminoácido muda.

2. *Contexto:* um mapa da distribuição da malária e da frequência do alelo HbS na África. *Comando:* explicar por que o alelo, prejudicial em homozigose, é frequente nessas regiões (vantagem do heterozigoto, seleção natural). Depende da nota S1.

3. (Exercício rápido no próprio módulo) "Um trecho de DNA tem 60 pares de bases, dos quais 34 são G·C. Quantas ligações de hidrogênio unem as duas fitas?" (Resposta: 26×2 + 34×3 = 154.) É exatamente o trecho do módulo, e o painel III mostra a resposta ao vivo, então dá para usá-lo como autocorreção.
