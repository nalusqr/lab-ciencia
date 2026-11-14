# Revisão de Biologia · Resumo

Revisor: professor de Biologia da equipe. Data: 14/11/2026.
Detalhes, trechos exatos e textos propostos estão nos arquivos de cada módulo, nesta pasta.

## Placar

| Módulo | Erros | Simplificações que enganam | Arquivo |
|---|---|---|---|
| 01 DNA | 3 | 5 | `dna.md` |
| 02 Tabela periódica | 6 | 4 | `tabela-periodica.md` |
| 03 Moléculas | 3 | 4 | `moleculas.md` |
| 04 Biomoléculas | 3 | 5 | `biomoleculas.md` |
| 05 Célula | 6 | 10 | `celula.md` |
| **Total** | **21** | **28** | |

Avaliação geral: o conteúdo é de nível alto. Os dados reais (sequência do HBB, geometrias, massas) foram conferidos e estão quase todos certos. Os erros não estão nos números: estão em **conceitos que o ENEM cobra** (estruturas "exclusivas" da célula animal, elemento × substância, massa atômica × isótopo) e em **uma questão de segurança** (o césio).

## As 10 correções mais importantes

| # | Módulo | Correção | Por quê |
|---|---|---|---|
| 1 | Célula | `['Exclusivas','centríolos, lisossomos']` → centríolos **não** são exclusivos; só faltam nas plantas com flores (E1) | É uma pegadinha clássica de prova, e o próprio módulo se contradiz na tela Centríolos |
| 2 | Tabela | "césio derrete na mão" → nunca se toca no césio; reage de forma explosiva com a umidade (E1) | Segurança |
| 3 | Célula | Mitocôndria: prótons bombeados "para fora" → **para o espaço entre as membranas** (E2) | Erra o modelo quimiosmótico |
| 4 | Tabela | O "isótopo mais comum" usa a massa arredondada: dá Cu-64, Br-80, Ag-108… que são isótopos radioativos inexistentes na natureza. Há 31 elementos errados, e a tabela de valores certos está no arquivo (E2) | Confunde massa atômica com número de massa, tema do ENEM |
| 5 | DNA | Explicar a genética da anemia falciforme: homozigoto SS doente, heterozigoto AS com o traço, vantagem contra a malária, teste do pezinho (S1) | É o contexto em que o ENEM cobra essa mutação |
| 6 | Célula | O núcleo da levedura e da célula vegetal mostra "46 cromossomos, 2 m" (texto humano). Criar um texto próprio para a levedura (E3) | Informação errada na tela |
| 7 | Tabela | U, Th, Pa e Bi marcados como estáveis: a ficha do urânio não diz que ele é radioativo (E3) | Radioatividade e enriquecimento de urânio caem no ENEM |
| 8 | Moléculas | Grupo "Elementos" (H₂, O₂, O₃, diamante) → **"Substâncias simples"**, citando a alotropia (E1) | A diferença elemento × substância simples é conceito básico |
| 9 | Biomoléculas | Histidina "carga +1" → carga 0 ou +1 (pKa ≈ 6). O próprio modelo 3D está neutro (E1) | O rótulo contradiz o modelo e o texto |
| 10 | Célula | "Uma gota de sangue de 1 µL" → 1 µL = 1 mm³, ~1/50 de uma gota (E4) | Unidade do hemograma, que cai em questões de leitura de exames |

Logo depois desses dez vêm:
- **mitocôndria:** avisar que os livros antigos dão 36 ou 38 ATP e o valor atual é 30–32;
- **gordura trans:** é pior que a saturada para a saúde; incluir a proibição da Anvisa (2023);
- **DNA:** nomenclatura `c.20A>T` / `p.Glu7Val` (HGVS) × Glu6Val (tradicional);
- **tabela:** as exceções de configuração explicadas por "cheio ou meio cheio" mesmo quando não se aplica;
- **ozônio:** filtra UV-C e UV-B, mas não a UV-A.

## Correções que valem para todos os módulos

1. **"pontes de hidrogênio" → "ligações de hidrogênio"** em todo o site: DNA, Moléculas e Biomoléculas (tags e legendas). É o termo da IUPAC e dos livros atuais.
2. **Classes dos aminoácidos:** o DNA e as Biomoléculas usam classificações diferentes (Tyr "polar" × "aromático"). É preciso unificar as classes e as cores.
3. **Geradores:** os textos de `dados.js` saem de `scripts/gen_*.py`. Se a correção for só no `dados.js`, ela some quando o gerador rodar de novo. É preciso corrigir nos dois.
4. **Fontes da Célula em `/tmp/claude-0/r3f/`:** a pasta pode ser apagada pelo sistema. Peço ao PM que o engenheiro guarde esses fontes dentro do projeto.
5. **Termos técnicos sem explicação** (pb, Å, D, cm⁻¹, kDa, Tm): sugiro um padrão de dica curta no próprio texto, a ser combinado com o diretor de arte.
6. **Química e física:** as fichas de elementos têm um bloco de física de partículas (quarks, glúons, bósons) acima do ensino médio. Os pontos marcados [química] e [física] nos arquivos precisam de um especialista. Os mais importantes são: o nome português de Ts e Ds, a categoria "semimetal", a sublimação do As e do C, e o texto sobre o CO₂ e o infravermelho.

## Lacunas de conteúdo que valem novos módulos

Ordenei pela frequência com que caem no ENEM em Ciências da Natureza/Biologia, de acordo com a experiência com as provas de 2009 a 2025. O módulo 06 (Morfofisiologia celular) está sendo feito em outra conversa, então deixei de fora o que deve estar nele: membrana, transporte e organelas em função.

1. **Ecologia e ambiente** (o tema mais cobrado): cadeias e teias alimentares, pirâmides, ciclos do carbono, do nitrogênio e da água, eutrofização, bioacumulação de mercúrio, efeito estufa, biomas brasileiros. Habilidades H9, H10, H12 e H28. Dá para ligar ao CO₂ e ao CH₄ do módulo Moléculas e ao Hg da Tabela.
2. **Genética clássica:** 1ª lei de Mendel, heredogramas, grupos sanguíneos ABO e Rh, herança ligada ao X. A extensão mais natural é o próprio módulo DNA: um heredograma da anemia falciforme (H13).
3. **Doenças, vírus e imunidade:** vacina × soro, anticorpos, arboviroses (dengue, zika, chikungunya) e o *Aedes aegypti*, parasitoses (doença de Chagas, esquistossomose, malária). Habilidades H14 e H30. Dá para usar o fago e o neutrófilo do módulo Célula.
4. **Metabolismo energético animado:** fotossíntese (fases clara e escura), respiração aeróbica e fermentação, comparadas pelo rendimento. Os três aparecem soltos no módulo Célula; um módulo próprio, com a "contabilidade" do ATP, cobriria H9 e H17.
5. **Biotecnologia:** DNA recombinante (insulina em plasmídeo), PCR e exame de DNA, transgênicos, clonagem, CRISPR, ética (H11, H29). Usa o plasmídeo da Célula e o gene HBB do DNA.
6. **Evolução:** seleção natural (resistência a antibióticos, malária e HbS), lamarckismo × darwinismo (erro frequente nas alternativas), especiação (H16).
7. **Divisão celular:** mitose, meiose, crossing-over, câncer como divisão descontrolada. Só se não estiver no módulo 06.
8. **Bioquímica que falta:** carboidratos (amido × celulose × glicogênio), enzimas e desnaturação, vitaminas. Isso cabe como uma expansão do módulo 04 e não precisa de um módulo novo.

Fisiologia humana (digestão, circulação, hormônios, insulina e diabetes) também cai bastante, mas é um bloco grande. Sugiro tratá-la depois dos itens 1 a 5.
