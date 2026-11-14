# Revisão · Módulo 03 · Moléculas em 3D

Arquivos revisados: `site/moleculas/index.html` e `site/moleculas/dados.js`.
Os textos de `dados.js` saem de `scripts/gen_mol.py`. Corrija nos dois lugares.

Este módulo é de **química estrutural**. Revisei a química básica e a ligação com a biologia. O que está marcado **[química]** precisa de confirmação de um especialista.

No geral, os valores medidos estão certos e bem citados: comprimentos de ligação, ângulos (H₂O 104,5°, NH₃ 106,7°, O₃ 116,8°), momentos de dipolo (H₂O 1,85 D, NH₃ 1,47 D, HCl 1,08 D, O₃ 0,53 D), frequências de vibração (CO₂ 667/1333/2349 cm⁻¹; H₂O 1595/3657/3756 cm⁻¹), energia da N≡N (945 kJ/mol) e a composição do ar (78% e 21%).

---

## 1. Erros (por gravidade)

### E1 · O grupo "Elementos" junta substâncias simples (média)
- **Onde:** `dados.js` (e `gen_mol.py`), `"grupo":"Elementos"` em H₂, N₂, O₂, O₃ e no diamante. Aparece como cabeçalho `ELEMENTOS` na lista de moléculas.
- **Problema:** H₂, O₂, O₃ e diamante são **substâncias simples**, não elementos. A distinção entre elemento e substância simples, e a alotropia (O₂ × O₃, diamante × grafite), é conteúdo clássico do ENEM, e o rótulo atual ensina o contrário.
- **Correção:** trocar `"grupo":"Elementos"` por `"grupo":"Substâncias simples"` nas 5 entradas. No ozônio e no diamante, citar a alotropia (ver S1).

### E2 · Ozônio "absorve a maior parte da radiação ultravioleta" (baixa a média)
- **Trecho:** `Na estratosfera, a camada de ozônio absorve a maior parte da radiação ultravioleta do Sol.`
- **Problema:** o ozônio absorve quase toda a UV-C e a maior parte da UV-B, mas deixa passar quase toda a UV-A. É justamente por isso que protetor solar e óculos com filtro UV continuam necessários, e essa diferença já apareceu no ENEM.
- **Texto proposto:** `Na estratosfera, a camada de ozônio absorve quase toda a radiação UV-C e a maior parte da UV-B do Sol, as mais perigosas para o DNA. A UV-A passa quase toda, e por isso o protetor solar continua necessário.`

### E3 · Hidrogênio: a molécula não é o "combustível das estrelas" (baixa)
- **Trecho:** `A molécula mais leve que existe. É o combustível das estrelas, que fundem hidrogênio em hélio.`
- **Problema:** no núcleo das estrelas não há moléculas de H₂, só núcleos de hidrogênio (prótons). A frase mistura o **elemento** com a **substância**, a mesma confusão de E1.
- **Texto proposto:** `A molécula mais leve que existe. O elemento hidrogênio é o combustível das estrelas: no núcleo delas, núcleos de hidrogênio (prótons) se fundem em hélio.`

---

## 2. Simplificações que enganam

### S1 · Alotropia fica só implícita
- **Diamante, trecho:** `Mesmo elemento do grafite, só que arrumado de outro jeito.`
- **Proposta:** `Diamante e grafite são alótropos: substâncias simples diferentes formadas pelo mesmo elemento, o carbono.` No **ozônio**, acrescentar: `O₂ e O₃ são alótropos do oxigênio.`

### S2 · CO₂: não é só o dobramento que absorve infravermelho
- **Trecho:** `As vibrações de dobramento (667 cm⁻¹) absorvem infravermelho, e é isso que faz dele um gás de efeito estufa.`
- **Problema:** o estiramento assimétrico (2349 cm⁻¹) também absorve; só o estiramento simétrico não absorve, porque não muda o dipolo. A ideia central (molécula apolar que absorve IR ao vibrar) é ótima para o ENEM e vale ficar completa.
- **Texto proposto:** `Quando a molécula se dobra (667 cm⁻¹) ou estica de forma assimétrica (2349 cm⁻¹), aparece um dipolo momentâneo, e é isso que permite absorver infravermelho. O estiramento simétrico não cria dipolo e não absorve. A absorção do dobramento, na faixa em que a Terra emite calor, é o que faz do CO₂ um gás de efeito estufa.` **[química]**

### S3 · O₂ desenhado com ligação dupla, mas paramagnético
- O texto está certo, mas o modelo de Lewis (O=O, todos os elétrons emparelhados) não explica os 2 elétrons desemparelhados, e o aluno vai perceber a contradição. Sugestão de acréscimo: `O desenho com ligação dupla (modelo de Lewis) não mostra esses elétrons desemparelhados; quem explica é a teoria dos orbitais moleculares.` **[química]**

### S4 · Etanol "em qualquer proporção" e as ligações de hidrogênio
- Correto. Vale acrescentar o contexto brasileiro, que o ENEM usa muito: `No Brasil, o etanol da cana é usado como combustível puro ou misturado à gasolina.` (H26.)

---

## 3. Lacunas com ligação à biologia

Os 15 compostos são bem escolhidos para a química. Para a biologia e o ENEM, sugiro acrescentar (o gerador já suporta):
- **Glicose (C₆H₁₂O₆)**, para fechar o ciclo da fotossíntese e da respiração, que o módulo Célula já cita.
- **Metano (já existe):** ligar ao efeito estufa, ao gado e aos aterros sanitários (H10).
- **Água oxigenada (H₂O₂)**, ligada ao peroxissomo do módulo Célula.

---

## 4. Linguagem e nível

- **"pontes de hidrogênio"** (água, etanol): trocar por **"ligações de hidrogênio"** em todo o site. É o termo da IUPAC e dos livros atuais.
- **"Pirâmide trigonal"**: nos livros brasileiros é **"piramidal"** ou "pirâmide trigonal". Ok, mas vale usar `Piramidal (pirâmide trigonal)`.
- "D" (debye), "cm⁻¹", "Å" e "δ−/δ+" aparecem sem explicação. Sugestão de dicas curtas: `D = debye, unidade de polaridade`; `cm⁻¹ = número de ondas por centímetro, que mede a frequência da vibração`.
- "aromaticidade" (benzeno): ok como termo, com a explicação que já está lá.
- O resto do tom está bom: frases curtas e concretas ("oxigênio líquido gruda num ímã").

---

## 5. ENEM

**Habilidades:** H24 (nomenclatura e representação), H17 (modelos 3D ↔ fórmula ↔ dados), H18 (propriedades → usos: N₂ inerte, acetileno na solda, ozônio como filtro), H21/H22 (interação da radiação com a matéria: IR do CO₂, UV do O₃), H10 e H12 (efeito estufa, camada de ozônio).

**Temas recorrentes:** polaridade e solubilidade ("semelhante dissolve semelhante"), ligações de hidrogênio e propriedades da água, geometria molecular, efeito estufa e aquecimento global, camada de ozônio e CFCs, alotropia, biocombustíveis.

**Ideias de pergunta no estilo ENEM:**
1. "O CO₂ é uma molécula apolar, mas é um dos principais gases de efeito estufa. Isso acontece porque…" Resposta: algumas vibrações criam um dipolo momentâneo que absorve infravermelho. Distratores: "porque é polar", "porque absorve luz visível", "porque destrói o ozônio". No módulo, o aluno toca nas vibrações do CO₂ no modo POLARIDADE e vê o dipolo aparecer.
2. "Uma pessoa ficou sob sol forte usando roupa clara e ainda assim se queimou, mesmo num dia sem buraco na camada de ozônio. Com base no papel do O₃, explique." Depende de E2.
