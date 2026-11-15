# ROADMAP · LAB Ciência em movimento

Site estático (HTML + JS, sem build) com módulos de ciência em português, para o ensino médio e o ENEM.
Este arquivo é o plano vivo da equipe. Quem lidera é o PM; cada frente tem um dono e um arquivo de saída.

## Equipe

| Papel | O que faz | Onde escreve |
|---|---|---|
| 🧭 **Atlas**, líder de equipe / PM | Planeja, distribui, revisa, integra, publica as prévias, sobe para o GitHub, chama a Nalu só em bloqueio ou conflito grave | `ROADMAP.md` |
| 🏛️ **Aurelius**, engenheiro sênior fullstack | Implementa módulos, 3D (three.js / React Three Fiber), testes com capturas | `site/<módulo>/` |
| 🔥 **Prometeu**, engenheiro fullstack sênior (18 anos; React, Node/Next, Java, APIs, CI) | Ajuda o Aurelius: bundle e infraestrutura do 3D, carregamento de modelos .glb, testes automáticos | `site/celula/fonte/entry.js`, `site/celula/fonte/src/e_modelos.js`, `site/celula/vendor/`, `site/assets/modelos/*.glb.js`, `site/assets/modelos/indice.js`, `scripts/glb2js.py`, `testes/` |
| 🎨 **Apolo**, diretor de arte | Identidade visual, paleta, tipografia, estilo estético, regras de UI/UX | `docs/GUIA-DE-ESTILO.md` |
| 🌈 **Íris**, artista / gerente de assets | Ícones, sprites, fontes, efeitos visuais, materiais 3D, seguindo o guia | `site/assets/`, `docs/ASSETS.md` |
| ✨ **Leo**, programador sênior de UI/UX front-end (entrou em 2026-11-15) | Dono da página inicial: layout, tipografia, botões, microinterações, hierarquia e acessibilidade, dentro do guia Campo escuro | `site/index.html`, `site/home.css`, `site/home.js` |
| 🔬 **Taxon**, professor de Biologia (PhD, ensino médio e ENEM) | Revisa a ciência, o nível e a linguagem; liga cada módulo ao que o ENEM cobra | `docs/revisao-biologia/` |
| 🧬 **Sapien**, professor sênior de Biologia (entrou em 2026-11-15) | Divide com o Taxon os roteiros e as revisões científicas; cada um revisa o trabalho do outro | `docs/revisao-biologia/` |

Matemática: ver docs/matematica/TIME.md. Módulos prontos: 1 Conjuntos e números, 2 Plano cartesiano e proporção.

## Regras de trabalho

- Emojis da equipe (pedido da Nalu, 2026-11-15): sempre que um agente for citado, o emoji dele vem junto do nome: 🧭 Atlas, 🏛️ Aurelius, 🔥 Prometeu, 🎨 Apolo, 🌈 Íris, 🔬 Taxon, 🧬 Sapien, ✨ Leo; time de Matemática: 📐 Tales, 🌀 Hipátia, ⚙ Arquimedes, 🔭 Galileo.

- Todos os agentes também são programadores fullstack sênior (decisão da Nalu, 2026-11-14). Quem ficar livre ajuda outra frente, pegando do PM uma tarefa com arquivos próprios, sem editar o arquivo que outro agente está editando.

- Aurelius e Prometeu não editam o mesmo arquivo. Na Célula, o Aurelius fica com `head.html`, `data.js` e `src/a_` a `src/d_`; o Prometeu, com `entry.js`, `src/e_modelos.js`, o bundle e `testes/`. Para ligar uma coisa na outra, combinam pelo PM.

- Cada pessoa da equipe só edita os arquivos da sua coluna "Onde escreve". Mudança em arquivo de outro dono vira pedido ao PM.
- Página inicial: o Leo é dono de `site/index.html` (fora do bloco `abas`) e de `site/home.css`/`site/home.js`. O Prometeu fica com o modo `?embed=1` da Célula e com `scripts/abas.py`/`scripts/modulos.json`, que geram a trilha.
- O professor não edita o código: escreve as correções, e o engenheiro aplica.
- Nada de copiar imagens, código ou assets de terceiros. Tudo é feito por nós.
- Prévia do módulo Célula: sempre no mesmo link do Claude. Cópia na pasta da Nalu e no GitHub (`nalusqr/lab-ciencia`) a cada versão.
- A conversa "Criar novos módulos do Lab" cuida do módulo 06. Antes de mexer em arquivos comuns (`site/index.html`, `site/base.css`, abas de navegação), o PM combina com ela.

## Frentes

### 1. Módulo 05 Célula em 3D (React Three Fiber) · em andamento
- [x] Bibliotecas empacotadas num arquivo local: `site/celula/vendor/r3f.js` (React 19, three.js 0.187, R3F 9, drei 10). Funciona sem internet e sem build.
- [x] 8 células modeladas em 3D e 12 telas de detalhe das organelas, em corte.
- [ ] Testar em capturas (computador e celular), corrigir erros e desempenho.
- [ ] Aplicar o guia de estilo e a revisão de biologia.
- [ ] Publicar a prévia, salvar na pasta, enviar ao GitHub.

### 2. Guia de estilo (diretor de arte) · a começar
- [ ] Recomendar um estilo estético e explicar à Nalu por quê.
- [ ] Paleta, tipografia, escala de espaçamento, componentes de interface, regras para 3D e animação, acessibilidade.

### 3. Assets (artista) · depois do guia
- [ ] Ícones dos módulos e dos tipos de célula, num só desenho.
- [ ] Biblioteca de materiais 3D (membrana, organela, vidro) e efeitos.

### 4. Revisão de Biologia dos módulos 01 a 05 (professor) · feita; correções aplicadas em 01 a 04
- [ ] Erros científicos, simplificações que enganam, vocabulário.
- [ ] Ligação com as habilidades e os temas mais cobrados no ENEM.

### 5. Módulo 06 Morfofisiologia celular · na conversa "Criar novos módulos do Lab"
- [x] Combinado: a conversa do 06 escreve só em `site/morfofisiologia/` e aplica o "Campo escuro" dentro da própria página.
- [ ] PM: links do painel da Célula para o 06 (membrana `#membranas/mosaico`, núcleo `#nucleo/geral`, mitocôndria `#origem/mito`, cloroplasto `#origem/cloro`, bactéria `#tipos/proc`).
- [ ] PM, quando o 06 estiver pronto: card "Módulo 6, Morfofisiologia celular" em `site/index.html` (contador 5 → 6) e aba "Morfofisiologia" nos módulos 01 a 05.
- [ ] Revisão do professor antes de publicar.

### 6. Estilo "Campo escuro" escolhido pela Nalu (2026-11-14)
- [x] Guia em `docs/GUIA-DE-ESTILO.md`.
- [ ] Aplicar na Célula; depois em `site/base.css` e nos módulos 01 a 04.

### 8. Modelos do Blender (Íris + Prometeu) · em andamento

A Íris gera a mitocôndria em .glb (`site/assets/modelos/`). O site abre por duplo clique (file://), e nesse modo o navegador bloqueia o fetch de .glb. Por isso cada modelo também vira um `.glb.js` embutido em base64, e o Prometeu faz o carregador com recurso de volta para a versão procedural.

### 7. Pendências da revisão (decidir depois)
- Fusão do arsênio sob pressão: 28 ou ~36 atm (falta fonte); carbono sem número.
- Nomes em português de Ts e Ds (lista oficial da SBQ).
- "Semimetal" como categoria nas fichas da tabela.
- Unificar classes e cores dos aminoácidos entre DNA e Biomoléculas (Tyr).
- Glossário/dicas para pb, Tm, kDa, Å, D, cm⁻¹, RefSeq, B-DNA (padrão com o diretor de arte).
- Sugestões de conteúdo: bloco "Para ir além" no Modelo Padrão, °C nos mapas, modo "No corpo humano", glicose e H₂O₂, carboidratos, enzimas, ATP.
- Os geradores em `scripts/` têm caminhos fixos `/home/claude/...`: torná-los relativos.

## Vocabulário do site (decisão do PM)
- "eucarionte" e "procarionte" (não "eucariota"/"procariota").
- "complexo de Golgi"; na primeira menção de cada módulo, "complexo de Golgi (complexo golgiense)".

## Escalar para a Nalu quando
- Duas frentes precisam do mesmo arquivo e não há acordo.
- Uma escolha muda o objetivo do site (público, estilo, escopo).
- Algo não pode ser desfeito.


## Próxima etapa (decidida pela Nalu em 2026-11-15)

A página inicial vira uma roda de matérias que o aluno gira: Química, Biologia, História, Geografia, Física, Português, Literatura, Inglês e Espanhol. Todas as 9 aparecem normalmente. Desde 2026-11-15 (rodada de design aprovada pela Nalu), as que ainda não têm conteúdo mostram o selo "Em breve" no cartão do centro, e o botão leva ao aviso da faixa; as que têm conteúdo mostram quantos módulos já estão no ar. Cada matéria tem um ícone em diorama 3D isométrico, feito pela Íris no Blender. No celular, a roda vira um arco ou carrossel e responde às setas do teclado. A página atual, com a célula 3D e a trilha, passa a ser a página da Biologia. Responsáveis: Leo (roda) e Íris (dioramas).

## Ementa da Nalu (fila de etapas, uma por vez)

Esteira (ligada pela Nalu em 2026-11-15): enquanto a equipe programa o tópico N, o 🔬 Taxon já escreve o roteiro do tópico N+1 em docs/revisao-biologia/<tema>-roteiro.md. A publicação continua sendo um tópico por vez.

1. Biologia molecular: publicada.
2. Teoria celular e morfofisiologia: publicada (módulo Morfofisiologia).
3. Citogenética (classificação dos cromossomos, mitose e meiose, euploidias e aneuploidias): em andamento, no módulo divisao-celular, que passa a se chamar Citogenética.
4. Bioenergética (respiração, fermentação, fotossíntese e quimiossíntese): o módulo já existe; o 🔬 Taxon confere o que falta para o ENEM.
5. Embriologia: tipos de ovos quanto à quantidade e à distribuição do vitelo; segmentação, mórula, blástula, gástrula, nêurula e organogênese; anexos embrionários (vesícula vitelínica, alantoide, córion e âmnio); gametogênese (ovulogênese e espermatogênese); embriologia humana. É um módulo novo (site/embriologia/), que reaproveita a gametogênese da Citogenética.
6. Histologia: características gerais e fisiologia dos tecidos epiteliais, conjuntivos, musculares e nervoso. Módulo novo (site/histologia/).
7. Taxonomia e nomenclatura: publicada (site/taxonomia/, 12 tópicos, 2026-11-15).
8. Os vírus: publicado (site/virus/, 13 tópicos, Etapa 9 da trilha, 2026-11-15), com uma rodada de revisão dos professores (44 correções). Genética passou a Etapa 10 e Ecologia a 11.
9. Os seres vivos: características gerais, habitats, morfologia e filogenia dos reinos Monera, Protoctista, Fungi, Plantae (Metaphyta) e Animalia (Metazoa). Decisão da Nalu (2026-11-15): dois módulos. "Microrganismos e fungos" (site/microrganismos/: Monera, Protoctista e Fungi, 7 tópicos) e "Plantas e animais" (site/plantas-animais/: 13 tópicos). Roteiro pronto (docs/revisao-biologia/seres-vivos-roteiro.md, 20 tópicos, no branch WIP); as rotas internas ficam como no roteiro. Parte 1 publicada em 2026-11-15: Microrganismos e fungos (site/microrganismos/, 7 tópicos, Etapa 10; Genética 11, Ecologia 12). Parte 2 publicada no mesmo dia: Plantas e animais (site/plantas-animais/, 13 tópicos, Etapa 11; Genética 12, Ecologia 13). Tópico 9 concluído.
10. Anatomia e fisiologia humana: sistemas digestório, respiratório, circulatório, excretor, endócrino, nervoso, reprodutor e locomotor. Publicado em 2026-11-15: Anatomia e fisiologia (site/anatomia/, 16 tópicos, dois por sistema, Etapa 12; Genética 13, Ecologia 14). Revisão única dos professores com 23 ajustes aplicados.
11. Genética: conceitos; 1ª lei de Mendel e probabilidade; heredogramas; alelos letais, dominância incompleta, alelos múltiplos; grupos sanguíneos; 2ª lei; linkage; genética do sexo; pleiotropia e interação gênica; biotecnologia; Hardy-Weinberg. O módulo site/genetica/ já existe (Mendel, heredogramas, grupos sanguíneos, ligada ao sexo, linkage); é preciso completar o resto. Completado em 2026-11-15: 12 tópicos novos (alelos letais, pleiotropia, herança poligênica, determinação do sexo, corpúsculo de Barr, herança restrita ao Y e calvície, DNA recombinante, PCR e eletroforese, clonagem, CRISPR, Hardy-Weinberg e fatores evolutivos), em site/genetica/novos-a.js e novos-b.js. Tópico 11 concluído.
12. Origem da vida (hipóteses e experimentos) e evolução (Lamarckismo, Darwinismo, teoria sintética). Módulo novo.
13. Ecologia: conceitos; cadeias e teias; fluxo de energia; pirâmides; ciclos biogeoquímicos; dinâmica populacional; relações ecológicas; sucessão; biomas; desequilíbrios. O módulo site/ecologia/ está pausado em cerca de 90% (fora do main, no WIP); retomar e completar.

## Lembretes da Nalu

- 2026-11-15: melhorar o design da Embriologia (e dos módulos 2D que usam o mesmo motor) numa rodada de polimento visual, depois dos próximos tópicos.
