# Tópico 12, Evolução: revisão de biologia (Taxon e Sapien)

Rodada única. Arquivos: `site/evolucao/evo3d-pecas.js`, `cenas3d-origem.js`, `cenas3d-ideias.js`, `cenas3d-especiacao.js`, `cenas-figura.js`, as 10 imagens `site/img/ia/evolucao-*.webp` e uma amostra de capturas em `/tmp/claude-0/t13/shots/`.

## 3D
Miller-Urey (gases redutores, sem O2, 1953, glicina e alanina), endossimbiose (duas membranas, DNA circular, ribossomos 70S, divisão própria, cloroplasto numa linhagem que já tinha mitocôndria), tempo geológico (4,6; 3,8 a 3,5; 2,4; cerca de 2,0; 0,6; 0,45 bilhões de anos), árvore filogenética, seleção natural com besouros e especiação alopátrica: conteúdo correto. Lamarck e Darwin (2D) corretos.

Corrigido:
- `cenas3d-origem.js`: rótulo "surgem os oceanos" (entre 3,85 e 3,5 bilhões de anos) trocado por "oceanos e primeiras células"; os oceanos já existiam antes de 4,0 bilhões de anos.
- `cenas-o.js` (legenda da régua, vista no 3D): entre 4,6 e 3,8 a legenda dizia "cerca de 3,8 bilhões de anos atrás: a Terra se forma". Agora: "Terra jovem, formada há cerca de 4,6 bilhões de anos e ainda sem sinais de vida".

## Figuras de IA e hotspots
| Imagem | Fidelidade | Hotspots |
|---|---|---|
| fosseis-a | trilobita e amonita boas | ok |
| fosseis-b | estratos e fósseis ok | textos corrigidos (abaixo) |
| comparacao-a | **asa de ave com 4 a 5 dedos longos e livres**; nadadeira de baleia parece mão | ok |
| comparacao-b | ceco com apêndice e pelve vestigial de baleia ok | ok |
| selecao-casos-a e b | Biston clara e escura corretas | ok |
| irradiacao-a | 4 bicos distintos; o bico longo é curvo demais (parece de outro grupo), ressalva | ok |
| irradiacao-b | Galápagos (Bartolomé), iguana-marinha, cactos | ok |
| humana-origem-a | **proporções erradas** | ok |
| humana-origem-b | mãos, pés e lascas ok; item 3 tem dedos longos demais | "Pé humano" movido para o pé da direita |

Textos corrigidos em `cenas-figura.js`:
- Camadas mais antigas: agora cita amonitas e trilobitas (os dois estão lá).
- Peixe fóssil: o texto dizia que peixes ósseos são um "grupo mais novo" que o das camadas de baixo, o que é falso (peixes ósseos são anteriores às amonitas). Agora diz só que esse peixe viveu depois.
- Ilhas vulcânicas: "perto da costa do Equador" trocado por "a cerca de 1.000 km da costa do Equador".
- Pé humano: hotspot de b [65,33] para b [81,30].

## Refazer
1. `evolucao-evidencias-comparacao-a`. Motivo: a asa de ave tem 4 a 5 dedos longos e separados, mas deveria ter 3 dedos reduzidos e fundidos (carpometacarpo). Isso contradiz o hotspot e é a pegadinha clássica de homologia. A nadadeira de baleia aparece como mão comum.
   Prompt: "Scientific museum illustration on dark navy background, four forelimb skeletons side by side, same scale feel, ivory bones: (1) human arm: humerus, radius and ulna, carpals, five fingers; (2) bat wing: short humerus, radius, very elongated fingers 2 to 5 and a short clawed thumb; (3) whale flipper: very short flat humerus, short flat radius and ulna, carpals, five digits with many short flat phalanges enclosed in a paddle-shaped flipper outline; (4) bird wing: humerus, radius and ulna, then fused carpometacarpus with only three reduced digits, no long free fingers. Same arrangement humerus at top, two forearm bones below. No text, no labels."
2. `evolucao-humana-origem-a`. Motivo: o Homo sapiens é o crânio maior da fileira e o Neandertal é arredondado e alto. Na realidade o Neandertal tem volume igual ou maior (cerca de 1.400 cm³) e crânio longo e baixo, com coque occipital. O H. erectus não tem toro supraorbital forte nem caixa baixa, e o Australopithecus não tem face bem projetada. Isso induz à leitura em "escada".
   Prompt: "Museum display case, four hominin skull replicas in left profile view on identical black stands, consistent scale: (1) Australopithecus afarensis: small braincase about 450 cm3, strongly projecting lower face, no chin, small brow ridge; (2) Homo erectus: long low braincase about 900 cm3, thick continuous brow ridge, sloping forehead, no chin; (3) Neanderthal: large long low skull about 1450 cm3, equal or larger than modern human, occipital bun at the back, double-arched brow ridge, large nose opening, no chin; (4) Homo sapiens: high rounded globular skull about 1350 cm3, vertical forehead, small brow ridge, flat short face, prominent chin. Neutral lighting, dark blue backdrop, no text, no labels."
   Hotspots devem ser reconferidos depois.

Ressalva (sem refazer agora): irradiacao-a, bico longo muito curvo; se sobrar crédito, pedir "cactus finch with long slightly decurved pointed beak, same size as others".

## Capturas (amostra)
- desk-3 (O ar do planeta): mostrava "cerca de 3,8 bilhões de anos atrás: a Terra se forma" e "surgem os oceanos". Corrigido.
- desk-6 (especiação): a legenda "Uma barreira geográfica divide a população" aparece antes de a cordilheira subir (de 0 a 8% do ciclo). Pendência de dev: sincronizar a legenda com o início da subida.
- cel-toque-arvore: ok. As bolhas vermelhas desfocadas do fundo competem com a árvore no celular (pendência visual).

## Teste
`node testes/fumaca.js evolucao`: 17 ok, 0 falhas, 0 avisos.
