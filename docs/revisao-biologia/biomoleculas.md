# Revisão · Módulo 04 · Biomoléculas

Arquivos revisados: `site/biomoleculas/index.html` e `site/biomoleculas/dados.js`.
Os textos de `dados.js` saem de `scripts/gen_bio.py`. Corrija nos dois lugares; a classe "Básico (carga +1)" vem do dicionário `CLS` do gerador.

No geral, é um módulo de alta qualidade. Os pontos fortes:
- A sequência da β-globina está certa: conferi os 146 resíduos, e o resíduo 6 é mesmo E.
- As massas molares das formas ionizadas em pH 7 estão certas.
- Os 9 aminoácidos essenciais estão certos.
- Os ângulos φ/ψ estão certos (α-hélice −57°/−47°, 3,6 resíduos por volta, 1,5 Å por resíduo; folha β antiparalela −139°/+135°), assim como o C–N peptídico de 1,33 Å e o número de hélices da globina (8 na cadeia β, 7 na α).

---

## 1. Erros (por gravidade)

### E1 · Histidina "Básico (carga +1)" (média)
- **Onde:** `dados.js`, entrada `"id":"his"`: o campo `"geo":"Básico (carga +1)"` e o par `['Classe','Básico (carga +1)']`. No gerador, o dicionário `CLS` aplica o mesmo rótulo a Lys, Arg e His.
- **Problema:** a cadeia lateral da histidina tem pKa ≈ 6. Em pH 7, só ~10% das moléculas estão com carga +1; a maioria está neutra. O próprio modelo 3D foi montado **neutro** (massa 155,16, sem carga formal em `fc`), e a curiosidade da ficha diz, com razão, que ela "ganha ou perde H⁺ perto de pH 7". Então o rótulo contradiz o modelo e o texto.
- **Correção:** só para a His, usar `Básico (carga 0 ou +1; pKa ≈ 6)`. No gerador, isso pede uma exceção no `CLS` (por exemplo, um campo próprio de classe para HIS).

### E2 · Fórmulas dos aminoácidos com carga aparecem sem o sinal (baixa a média)
- **Onde:** `dados.js`, campo `"f"`: Asp `C₄H₆NO₄`, Glu `C₅H₈NO₄`, Lys `C₆H₁₅N₂O₂`, Arg `C₆H₁₅N₄O₂`.
- **Problema:** essas são as fórmulas dos **íons** (em pH 7), mas aparecem como se fossem moléculas neutras. O aluno que conferir no livro vai encontrar C₄H₇NO₄ (ácido aspártico) e achar que o site errou.
- **Correção:** `C₄H₆NO₄⁻`, `C₅H₈NO₄⁻`, `C₆H₁₅N₂O₂⁺`, `C₆H₁₅N₄O₂⁺`, e na ficha `Fórmula (em pH 7)`.

### E3 · Fosfolipídio: "cabeça… carregada" (baixa)
- **Trecho:** `Uma ponta ama água (cabeça com fosfato e colina, carregada)`
- **Problema:** a fosfatidilcolina tem uma carga − (fosfato) e uma + (colina): a cabeça é **polar, com carga total zero**. A própria ficha mostra `fosfato (−) + colina (+)`.
- **Texto proposto:** `Uma ponta atrai a água: a cabeça, com um fosfato (−) e uma colina (+), é polar, mas tem carga total zero. A outra ponta repele a água (duas caudas de hidrocarboneto).`

---

## 2. Simplificações que enganam

### S1 · Gordura trans "se comporta como saturada no corpo" (média)
- **Trecho:** `É por isso que a gordura trans se comporta como saturada no corpo, e foi restringida em vários países.`
- **Problema:** **fisicamente** ela se empilha como uma saturada. Mas, para a saúde, é **pior** que a saturada: aumenta o LDL e diminui o HDL. A frase sugere que as duas são equivalentes. O contexto brasileiro também falta.
- **Texto proposto:** `Por isso ela se empilha como uma gordura saturada e é sólida à temperatura ambiente. No corpo, é ainda mais prejudicial: aumenta o colesterol "ruim" (LDL) e diminui o "bom" (HDL). No Brasil, a Anvisa proibiu os óleos parcialmente hidrogenados, a principal fonte de gordura trans, a partir de 2023.`

### S2 · "é assim que nasce a membrana das células"
- **Trecho:** `Na água, essas moléculas se organizam sozinhas em camadas duplas: é assim que nasce a membrana das células.`
- **Problema:** a auto-organização em bicamada é real, mas a célula não monta a membrana do zero. Ela acrescenta lipídios novos a membranas que já existem, a partir do retículo endoplasmático liso. A frase pode reforçar a ideia de geração espontânea de membranas.
- **Texto proposto:** `Na água, essas moléculas se organizam sozinhas em camadas duplas (bicamadas). É essa propriedade que faz a membrana das células ser estável. Na célula, os fosfolipídios novos são feitos no retículo endoplasmático liso e somados às membranas que já existem.`

### S3 · Arginina "Não essencial"
- Em adultos, sim. Em crianças e em algumas situações (crescimento, trauma), é **condicionalmente essencial**. Sugestão: `Não essencial (condicional em crianças)`. O mesmo vale para a tirosina, que depende da fenilalanina, um gancho direto para a fenilcetonúria.

### S4 · Fenilcetonúria: "o corpo não consegue processá-la"
- **Trecho:** `Na fenilcetonúria o corpo não consegue processá-la, por isso o teste do pezinho a procura.`
- **Texto proposto (mais preciso e mais ENEM):** `Na fenilcetonúria, falta a enzima que transforma fenilalanina em tirosina. A fenilalanina se acumula e prejudica o cérebro. O teste do pezinho detecta a doença logo após o nascimento, e uma dieta pobre em fenilalanina evita o dano. É por isso que refrigerantes diet avisam: "contém fenilalanina".` O aviso nos rótulos com aspartame é um contexto que o ENEM já usou.

### S5 · "Ácido (carga −1)" e o nome dos aminoácidos ácidos
- Os livros do ensino médio chamam Asp e Glu de **ácido aspártico** e **ácido glutâmico**. O site usa os nomes das formas ionizadas (aspartato, glutamato), que estão corretos em pH 7. Sugestão: `Aspartato (ácido aspártico)` e `Glutamato (ácido glutâmico)`. A nota do DNA, `Glu6 (glutamato)`, já está ok.

---

## 3. Valores numéricos conferidos

| Valor | Situação | Referência |
|---|---|---|
| ~9 kcal/g gordura × ~4 kcal/g açúcar/proteína | correto | Lehninger; tabelas de Atwater |
| Glicina = 1 em cada 3 resíduos do colágeno | correto (repetição Gly-X-Y) | Alberts; Lehninger |
| Asparagina, primeiro aminoácido isolado (1806) | correto | Vauquelin e Robiquet |
| Glutamina, o aminoácido livre mais abundante no sangue | correto | Lehninger |
| Azeite com ~70% de ácido oleico | correto (55–83%) | Codex Alimentarius |
| Bicamada ~4 nm de espessura; ~0,64 nm² por lipídio (POPC) | corretos | Alberts, cap. 10 |
| Ligação C=O(i) → N–H(i+4) na α-hélice | correto | Pauling 1951 |
| Folha β: ~4,8 Å entre fitas | correto (média dos espaçamentos alternados) | Lehninger |

---

## 4. Lacunas de conteúdo (prioridade ENEM)

O módulo não tem **carboidratos** nem **enzimas**, e os dois estão entre os temas mais cobrados.
1. **Carboidratos:** glicose (α e β), sacarose, amido, glicogênio e celulose. Em 3D, dá para mostrar por que o amido é digerível e a celulose não (ligações α × β). Liga com a parede celular do módulo Célula.
2. **Enzimas:** sítio ativo, encaixe induzido e desnaturação por temperatura e pH. A ligação com o lisossomo (pH 4,5–5) já existe no módulo Célula.
3. **Nucleotídeos e ATP:** o DNA está no módulo 01, mas o ATP, citado em Célula, não tem estrutura em lugar nenhum.
4. **Colesterol:** citado na membrana do módulo Célula, sem modelo.

---

## 5. Linguagem e nível

- **"pontes de hidrogênio"** (tags, legendas e fatos da hélice e da folha): trocar por **"ligações de hidrogênio"**.
- **"ama água" / "foge dela" / "caudas (fogem da água)"**: é simpático, mas use também o termo técnico na primeira vez: `hidrofílica (atrai a água)` e `hidrofóbica (repele a água)`. Hidrofílico e hidrofóbico são termos de prova.
- **"φ/ψ", "POPC", "cis-Δ9"**: acima do ensino médio. Podem ficar na ficha técnica, mas não no texto principal. "Ômega-9" (já presente) é o termo que o aluno conhece. Para o palmítico, "C16:0" pode vir com `(16 carbonos, nenhuma dupla)`.
- O texto dos níveis de estrutura (primária a quaternária) está claro e no nível certo.

---

## 6. ENEM

**Habilidades:** H15 (modelos), H17 (sequência ↔ estrutura), H13 (do gene à proteína, junto com o módulo DNA), H14 e H30 (nutrição e saúde: gorduras, fenilcetonúria), H18 (propriedades → função: gordura trans), H29 (biotecnologia de alimentos: hidrogenação).

**Temas recorrentes:** nutrientes e dieta (gorduras saturadas, insaturadas e trans; colesterol), aminoácidos essenciais e dieta vegetariana, estrutura de proteínas e desnaturação, membrana plasmática (bicamada, permeabilidade), fenilcetonúria e teste do pezinho.

**Ideias de pergunta no estilo ENEM:**
1. "A hidrogenação parcial de óleos vegetais produz gordura trans, mais sólida e durável. Do ponto de vista da estrutura molecular, ela é mais sólida porque…" Resposta: a cadeia trans é quase reta e as moléculas se empilham melhor. Distratores: "tem mais duplas ligações", "é mais polar", "tem cadeia mais curta". No módulo, o aluno compara oleico × elaídico em 3D.
2. "Uma pessoa vegetariana deve combinar arroz e feijão porque…" Resposta: os dois se complementam nos aminoácidos essenciais (o feijão tem lisina; o arroz, metionina). A ficha "Na dieta humana" já marca quais são essenciais.
