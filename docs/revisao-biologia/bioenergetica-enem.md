# Auditoria ENEM · Bioenergética (`site/bioenergetica/`)

🔬 Taxon, 2026-11-15. Para 🎨 Apolo (autor e implementação).
Item 4 da ementa: "Bioenergética: respiração, fermentação, fotossíntese e quimiossíntese".
Lidos: `index.html`, `motor.js` (seções), `cenas-a.js` e `cenas-b.js`: textos `d`, `kv`, `enem` e os rótulos do canvas dos 19 tópicos.
Fontes: Amabis & Martho, *Biologia Moderna* (Moderna, 2016), vol. 1; Lopes & Rosso, *Bio* (Saraiva, 2016), vol. 1; Alberts et al., *Biologia Molecular da Célula*, 6. ed. (Artmed, 2017), cap. 2 e 14; Taiz et al., *Fisiologia e Desenvolvimento Vegetal*, 6. ed. (Artmed, 2017), cap. 7 a 9.

**Resumo:** o módulo está muito bom. Quase toda a lista do PM já existe: glicólise, Krebs e cadeia com saldo de ATP; fermentação lática × alcoólica com pão, iogurte e músculo; fase clara × ciclo de Calvin; luz, CO₂, temperatura e ponto de compensação; quimiossíntese com nitrificantes e fontes hidrotermais; fotossíntese × respiração. Não achei erro científico. Há 2 ajustes obrigatórios (nome que o aluno vai encontrar na prova e navegação até a quimiossíntese) e 3 lacunas que valem tópico novo.

---

## (a) O que está correto (uma linha por tópico)

| Rota | Veredito |
|---|---|
| `#atp/ciclo` | Correto: hidrólise, 30,5 kJ/mol, ATP como moeda e não como estoque, energia vinda da maior estabilidade dos produtos. |
| `#atp/acoplamento` | Correto: exergônica × endergônica, fosforilação, cerca de 1/3 da energia vai para o ATP, o resto vira calor; boa ligação com o fluxo de energia nos ecossistemas. |
| `#resp/geral` | Correto: equação, 3 etapas e 3 lugares, 30 a 32 ATP, cadeia na membrana plasmática das bactérias, respiração celular × pulmonar. |
| `#resp/glicolise` | Correto: 6C → 2 × 3C, investimento de 2 ATP e rendimento de 4 (saldo de 2), 2 NADH, sem O₂, hemácias. |
| `#resp/krebs` | Correto: acetil-CoA, oxaloacetato + acetil → citrato, por volta 2 CO₂, 3 NADH, 1 FADH₂ e 1 ATP; 2 voltas; origem do CO₂ expirado; papel indireto do O₂. |
| `#resp/cadeia` | Correto: complexos I a IV, H⁺ da matriz para o espaço intermembranas, O₂ como aceptor final, ATP sintase, quimiosmose, cianeto e desacopladores. |
| `#resp/saldo` | Correto e atualizado: 10 NADH e 2 FADH₂, 2,5 e 1,5 ATP por transportador, 30 a 32, explica os 36 a 38 dos livros antigos e as lançadeiras. |
| `#ferm/latica` | Correto: regeneração do NAD⁺, lactato sem CO₂, iogurte, músculo, hemácias, 2 ATP; desfaz o mito da dor tardia causada pelo ácido lático. |
| `#ferm/alcoolica` | Correto: piruvato → CO₂ + etanol, leveduras anaeróbias facultativas, pão, bebidas, etanol de cana, diferença entre fermentação e respiração anaeróbica. |
| `#foto/geral` | Correto: equação com 12 H₂O e 6 H₂O, O₂ vindo da água (¹⁸O), cianobactérias, clorofila *a* absorvendo azul e vermelho. |
| `#foto/clara` | Correto: FS II → FS I, fotólise da água, NADPH, H⁺ acumulados no lúmen, fotofosforilação, paralelo com a mitocôndria. |
| `#foto/calvin` | Correto: RuBisCO, RuBP, G3P/PGAL, 3 CO₂ → 1 G3P, 18 ATP e 12 NADPH por glicose, destino em sacarose, amido e celulose; matéria seca vinda do CO₂. |
| `#fatores/luz` | Correto: ponto de compensação e de saturação, plantas de sol × de sombra, leitura do gráfico. |
| `#fatores/co2` | Correto: 0,04% (420 ppm), fator limitante, patamar dependente da luz, estômatos, estufas. |
| `#fatores/temp` | Correto: curva em sino, desnaturação, ótimo entre 25 e 35 °C, ciclo de Calvin mais sensível. |
| `#relacao/ciclo` | Correto: processos complementares, não inversos; matéria circula e energia flui; plantas respiram sempre; mito do "pulmão do mundo". |
| `#relacao/carbono` | Correto: fontes, reservatórios e sumidouros, 280 → 420 ppm, biocombustível × fóssil, floresta em crescimento × madura. |
| `#relacao/quimio` | Correto: oxidação de NH₃, NO₂⁻, H₂S e Fe²⁺; fixa CO₂; fontes hidrotermais; *Nitrosomonas* e *Nitrobacter*; não libera O₂. |

---

## (b) Ajustes obrigatórios (2)

Nenhum é erro de ciência. São coisas que o aluno precisa reconhecer na prova ou encontrar no site.

### 1. `cenas-b.js`, `#foto/calvin`: dar o nome "fase escura", que o aluno vai encontrar
O texto diz "evite o nome fase escura", e é uma boa ideia explicar por quê. Só que livros e vestibulares ainda usam "fase escura", e o ENEM fala em "etapa fotoquímica" e "etapa química". O aluno precisa ligar os nomes. Hoje "fase escura" só aparece como algo a evitar, e não está na lista de sinônimos.

Antes (`kv`):
```js
['Outros nomes', 'ciclo de Calvin-Benson; etapa química']
```
Depois:
```js
['Outros nomes', 'ciclo de Calvin-Benson; etapa química; "fase escura" (nome antigo e enganoso)']
```
Antes (fim do texto `d`):
```
Por isso, evite o nome "fase escura".
```
Depois:
```
Por isso o nome "fase escura", que ainda aparece em livros e provas, engana: o ciclo acontece de dia, junto com a fase clara.
```

### 2. `motor.js`, seção `relacao`: a quimiossíntese precisa aparecer no nome da seção
A ementa cita quimiossíntese como um dos quatro temas, mas o tópico fica escondido dentro de "Fotossíntese × respiração". Quem procura não acha. Mantenha o id (`relacao`, para não quebrar os links) e troque só o rótulo.

Antes:
```js
  { id: 'relacao', t: 'Fotossíntese × respiração', c: C.agua }
```
Depois:
```js
  { id: 'relacao', t: 'Relações e quimiossíntese', c: C.agua }
```
(Se o rótulo ficar longo no celular, use "Quimiossíntese e ciclos".)

### Opcional (não bloqueia)
- `cenas-a.js`, `#atp/ciclo`, rótulo do canvas `'ligação rica em energia'`: o próprio texto diz que a energia "não fica guardada dentro da ligação". Para não se contradizer, use `'ligação que libera energia ao ser quebrada'` ou `'última ligação fosfato'`. "Ligação rica em energia" é o termo dos livros e não está errado como apelido; é só coerência.

---

## (c) Lacunas que o ENEM cobra (3 tópicos novos)

Tudo o que o PM listou já existe (ver a tabela acima). As lacunas reais, pela ordem de importância para o ENEM, são estas.

### Tópico novo 1 · `#foto/pigmentos`, "Luz, cor e pigmentos"
- **Subtítulo:** "por que a folha é verde"
- **Lugar:** em Fotossíntese, entre `geral` e `clara`.

**Texto do aluno:**
> A luz visível vai do violeta (cerca de 400 nm) ao vermelho (cerca de 700 nm), e cada pigmento absorve só algumas cores. A **clorofila *a***, o pigmento principal, absorve sobretudo o **azul-violeta** e o **vermelho**. A **clorofila *b*** e os **carotenoides** (amarelos e alaranjados) absorvem outras faixas do azul e passam a energia para a clorofila *a*, ampliando o aproveitamento da luz. O **verde** é pouco absorvido, é refletido e transmitido, e por isso as folhas parecem verdes. Em 1882, **Engelmann** iluminou uma alga filamentosa com a luz decomposta por um prisma e espalhou bactérias que procuram O₂ ao redor dela: elas se juntaram nas faixas **azul** e **vermelha**, onde a alga mais produzia O₂. A fotossíntese é mais intensa nas cores que os pigmentos absorvem. No outono, a clorofila se desfaz antes dos carotenoides, e as folhas de algumas árvores ficam amarelas.

**O que a animação mostra:**
1. A luz branca passa por um prisma e se abre no espectro de 400 a 700 nm.
2. Sobre o espectro, as curvas de absorção da clorofila *a* (picos em ~430 e ~660 nm), da clorofila *b* e dos carotenoides (400 a 500 nm), com o "vale" no verde.
3. O experimento de Engelmann: um filamento de alga sobre o espectro, com bactérias (pontos) que migram e se acumulam no azul e no vermelho. Controle "cor da luz": o aluno escolhe a cor e um medidor mostra a taxa de O₂ (alta no azul e no vermelho, baixa no verde).
4. Uma folha sob luz branca: setas de luz verde refletida para o olho.

**Cartão ENEM:**
> A prova pergunta em que cor de luz a planta faz mais fotossíntese, ou por que a folha é verde. A resposta: os pigmentos absorvem **azul e vermelho** e refletem o **verde**, a cor menos usada. Sob luz só verde, a fotossíntese é baixa. Por isso as estufas e cultivos internos com LED usam luz vermelha e azul. O experimento de Engelmann (bactérias juntas no azul e no vermelho) é a prova clássica.

### Tópico novo 2 · `#fatores/c4cam`, "Plantas C3, C4 e CAM"
- **Subtítulo:** "três jeitos de fixar o CO₂"
- **Lugar:** em Fatores limitantes, depois de `temp` (é a resposta da planta ao calor e à seca, que o tópico do CO₂ já introduz com os estômatos).

**Texto do aluno:**
> A RuBisCO tem um defeito: além do CO₂, ela também se liga ao O₂, e isso desperdiça energia (a **fotorrespiração**). O problema piora com calor e seca, quando a planta fecha os estômatos e o O₂ se acumula na folha. A maioria das plantas é **C3**: fixa o CO₂ direto no ciclo de Calvin, e o primeiro composto formado tem 3 carbonos (trigo, arroz, soja, feijão). As plantas **C4**, como **cana-de-açúcar**, milho e capins tropicais, primeiro prendem o CO₂ num composto de 4 carbonos, com outra enzima, nas células do mesofilo, e o levam para células mais internas (a bainha do feixe), onde o liberam concentrado para a RuBisCO: uma **separação no espaço**. As plantas **CAM**, como **cactos**, **abacaxi**, agave e muitas bromélias, abrem os estômatos **à noite**, guardam o CO₂ como ácido no vacúolo e o usam de dia, de estômatos fechados: uma **separação no tempo**, que economiza muita água.

**O que a animação mostra:**
1. Três folhas lado a lado (C3, C4, CAM), com um relógio dia/noite e o controle "calor e seca".
2. C3: estômato aberto de dia, CO₂ entra e vai direto ao ciclo de Calvin; com calor, o estômato se fecha, entra O₂ na RuBisCO (fotorrespiração) e o medidor de produção cai.
3. C4: o CO₂ é capturado nas células externas, vira composto de 4 C, é levado às células da bainha e liberado perto da RuBisCO; com calor, a produção cai pouco.
4. CAM: de noite os estômatos abrem e o CO₂ é guardado no vacúolo (que "enche"); de dia, os estômatos fecham, o vacúolo "esvazia" e alimenta o ciclo de Calvin. Um contador de água perdida mostra CAM << C4 < C3.

**Cartão ENEM:**
> Aparece ligado a **adaptações a ambientes secos** (Caatinga, cactos, bromélias) e a **agricultura** (cana e milho, plantas C4, muito produtivas em clima quente). Guarde: C4 separa as etapas **no espaço**, em dois tipos de célula; CAM separa **no tempo**, abrindo os estômatos à noite. A pista na questão costuma ser "estômatos abertos à noite" (CAM).

### Tópico novo 3 · `#relacao/comparar`, "Cinco jeitos de obter energia"
- **Subtítulo:** "quadro comparativo"
- **Lugar:** em `relacao`, como último tópico do módulo (fecha a ementa inteira).

**Texto do aluno:**
> Todo ser vivo precisa de uma fonte de energia e de uma fonte de carbono. Os **autótrofos** fazem a própria matéria orgânica a partir do CO₂: com energia da **luz** (fotossíntese) ou de **reações químicas** com substâncias inorgânicas (quimiossíntese). Os **heterótrofos** tiram energia e carbono do alimento orgânico. Para liberar a energia do alimento, há três caminhos: a **respiração aeróbica**, que usa O₂ como aceptor final dos elétrons e rende cerca de 30 ATP por glicose; a **respiração anaeróbica**, de certas bactérias, que tem cadeia transportadora mas usa outro aceptor, como nitrato ou sulfato; e a **fermentação**, sem cadeia transportadora, que rende só 2 ATP. Uma mesma planta faz fotossíntese e respiração, e uma mesma levedura pode respirar ou fermentar, conforme haja O₂ ou não.

**Quadro (conteúdo exato):**

| Processo | Energia vem de | Carbono vem de | Usa O₂? | Libera | ATP por glicose | Quem faz |
|---|---|---|---|---|---|---|
| Fotossíntese | luz | CO₂ | não (libera O₂) | O₂ | (produz glicose) | plantas, algas, cianobactérias |
| Quimiossíntese | oxidação de substâncias inorgânicas | CO₂ | em geral sim, para oxidar | (não libera O₂) | (produz matéria orgânica) | nitrificantes, sulfobactérias, ferrobactérias |
| Respiração aeróbica | glicose e outros orgânicos | alimento | sim, aceptor final | CO₂ e H₂O | cerca de 30 a 32 | quase todos os seres vivos |
| Respiração anaeróbica | orgânicos | alimento | não; aceptor é nitrato, sulfato etc. | CO₂ e outros | menos que a aeróbica | algumas bactérias e arqueias |
| Fermentação | glicose | alimento | não | lactato, ou etanol + CO₂ | 2 | leveduras, lactobacilos, músculo |

Nota de precisão para o quadro: nitrificantes e muitas sulfobactérias **consomem O₂** para oxidar amônia ou H₂S; nas fontes hidrotermais, esse O₂ vem da água do mar, que o recebeu da fotossíntese na superfície. Se o espaço for curto, a coluna "Usa O₂?" pode ficar só nos três processos de degradação.

**O que a animação mostra:**
1. Cinco cartões (um por processo) em volta de um ATP central, cada um com o ícone da fonte de energia (sol, rocha/fonte hidrotermal, glicose).
2. Filtros que acendem os cartões: "usa O₂", "libera CO₂", "libera O₂", "autótrofo", "sem mitocôndria". Por exemplo, "libera CO₂" acende respiração aeróbica e fermentação alcoólica, e não a lática.
3. Barras de rendimento lado a lado: respiração aeróbica (~30) × fermentação (2).
4. Mini-experimento de Priestley, opcional: sino de vidro com vela, com rato, com planta e com planta + rato, mostrando que a planta "restaura" o ar (O₂), e que no escuro isso não acontece.

**Cartão ENEM:**
> O ENEM gosta de pedir a classificação: quem é **autótrofo** (luz ou química) e quem é **heterótrofo**, quem **libera CO₂** (respiração e fermentação alcoólica, não a lática) e quem **libera O₂** (só a fotossíntese). Erros comuns: achar que planta não respira, que fermentação é "respiração sem O₂" e que quimiossíntese usa luz. Na dúvida, pergunte: de onde vem a energia e de onde vem o carbono?

---

## Fora do escopo (não incluir agora)
Fotorrespiração em detalhe, lançadeiras de NADH, fermentação acética (vinagre) e fotofosforilação cíclica. Não pesam no ENEM e não estão na ementa.

---

## Revisão da implementação (🔬 Taxon, depois do aviso do 🎨 Apolo)

Conferido em `cenas-a.js`, `cenas-b.js`, `cenas-c.js` e `motor.js`.

- Ajuste 1 (`#foto/calvin`) aplicado: "fase escura" está em "Outros nomes" e a nova frase final está no `d`. **Ok.**
- Ajuste 2 (`motor.js`) aplicado: seção "Relações e quimiossíntese", id `relacao` mantido. **Ok.**
- Opcional (`#atp/ciclo`) aplicado: rótulo "última ligação fosfato". **Ok.**
- `#foto/pigmentos`: texto e cartão conforme o roteiro. Curvas com clorofila *a* em ~430/662 nm, *b* em ~455/642 nm e carotenoides só abaixo de 530 nm; o vale está no verde; as bactérias de Engelmann se acumulam no azul e no vermelho; as legendas dos medidores estão coerentes. **Ok.**
- `#fatores/c4cam`: na C4, o ciclo de Calvin está na bainha do feixe e a captura do CO₂ no mesofilo; na CAM, CO₂ → ácido → vacúolo à noite e estômato fechado de dia; perda de água CAM < C4 < C3; a fotorrespiração aparece ligada ao fechamento do estômato na C3. **Ok.**
- `#relacao/comparar`: os cinco cartões conferem com o quadro (energia, carbono, aceptor, produtos, ATP, organismos). Filtros: "libera CO₂" (respirações e fermentação alcoólica, não a lática) e "usa O₂" (aeróbica e, em geral, quimiossíntese), corretos. Barras de 30 a 32 contra 2. **Ok.**

**Correções obrigatórias: nenhuma.** O Priestley opcional pode ficar para depois.
