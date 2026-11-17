# Plano padrão v5: o que falta para o novo sistema de design

Revisão de Taxon e Sapien, 17/11/2026. Base: varredura-biologia.csv, triagens v2 a v4, arquivos cenas-figura*.js e capturas novas de cerca de 60 rotas em dúvida (em /tmp/claude-0/v7/). A tabela completa, rota por rota, está em plano-padrao-v5.csv (293 rotas).

Classes: (a) já no padrão; (b) tem figura IA estática, mas o conteúdo é um processo e ganha uma viagem; (c) desenho fraco ou 3D de formas primitivas, precisa de figura IA nova e talvez viagem; (d) bom como está. Abaixo, só os itens b e c.

Achado geral: fora da Anatomia, nenhuma rota tem viagem por etapas ainda. As figuras IA dos outros módulos são boas e fiéis, mas paradas. Os 3D de célula, molécula e organela (mitose, meiose, cadeia respiratória, fase clara, bomba de sódio, fagos, replicação viral) já andam por passos e ficam como estão.

## Por tópico

**1. Biologia molecular.** Nada a fazer. As duas figuras fracas (calor da água, avitaminoses) já foram trocadas por figura IA, e a síntese de proteínas já tem passo a passo em 3D.

**2. Morfofisiologia.** Osmose (membranas/osmose): viagem curta com as moléculas de água atravessando a membrana nos três meios e um medidor de concentração, reaproveitando as figuras das hemácias e das células vegetais. Prioridade baixa.

**Célula.** Nada a fazer. A célula 3D detalhada é o próprio conteúdo.

**3. Citogenética.** Nada a fazer. Mitose, meiose e gametogênese já são 3D por passos, com contador de etapa.

**4. Bioenergética.** Fotossíntese (foto/geral) é a falta mais importante do módulo: hoje só mostra o cloroplasto parado. Precisa de viagem da luz, da água e do CO2 até a glicose, com O2 saindo na fase clara, e de uma figura nova da planta com folha em corte como vista A. Fermentação alcoólica pode ganhar viagem curta da glicose até etanol e CO2 com as figuras que já existem (prioridade baixa).

**5. Embriologia.** Fecundação (humano/fecundacao): viagem do espermatozoide até a tuba e do zigoto até a nidação, só com figuras que já existem. Segmentação (desenvolvimento/segmentacao): viagem do zigoto à gástrula usando as figuras prontas de mórula, blástula e gástrula como etapas (prioridade baixa).

**6. Histologia.** Nada a fazer. A sinapse já entra na viagem do sistema nervoso da Anatomia.

**7. Taxonomia.** Nada a fazer.

**8. Vírus.** Arboviroses: viagem do vírus entre pessoa e mosquito e do ciclo do Aedes na água parada, com uma figura nova de ovos, larvas e pupas. Doenças respiratórias: as pessoas da sala ainda são pictogramas; figura IA de sala vista de cima é opcional.

**9. Seres vivos.** Protozooses: viagem da doença de Chagas e da malária pelo corpo, com uma figura nova do sangue de perto. Vermes: o ciclo da esquistossomose e da tênia ainda é uma roda de bolinhas; precisa de duas figuras novas e da viagem do parasita. Briófitas e angiospermas: viagem do ciclo de vida (anterozoide nadando até o arquegônio; pólen, tubo polínico e dupla fecundação), uma figura nova em cada. Protozoários (protoctista/grupos) ainda são blobs 3D: figura IA de microscopia (prioridade baixa).

**10. Anatomia.** Confirmado: 10 de 16 rotas no padrão. Uma falha real: glicemia (endocrino/glicemia) desenha pâncreas, músculo e fígado como elipses; precisa de viagem da glicose depois da refeição e de uma figura nova de pâncreas com ilhota e fígado (o corpo de endocrino/glandulas serve de vista A). Absorção (digestorio/absorcao) pode ganhar viagem curta do nutriente até a veia porta, sem figura nova (prioridade baixa).

**11. Genética.** Clonagem (biotec/clonagem): viagem da clonagem da Dolly, da célula da mama ao filhote, só com as figuras que já existem.

**12. Evolução.** Especiação alopátrica (especiacao/modos): viagem no cânion, da população única ao reencontro sem cruzamento, com um medidor de diferença genética, sem figura nova.

**13. Ecologia.** É o módulo com mais trabalho. Os ciclos do carbono, do nitrogênio e da água são 3D de árvore de bolas e boi de blocos, exatamente o que a Nalu chamou de desastroso. Carbono e nitrogênio podem usar a paisagem da Bioenergética (relacao-carbono-a) como vista A e os nódulos de leguminosa como vista B do nitrogênio, sem figura nova; a água precisa de uma paisagem nova. Efeito estufa, eutrofização e chuva ácida já têm figura IA boa e só precisam da viagem com medidor (temperatura, O2 dissolvido, pH). Magnificação trófica, ciclo do fósforo, teia alimentar e controle biológico ainda são ícones ou desenho plano e precisam de figura nova; sucessão primária ganha etapas no tempo com uma figura nova.

## Resumo

| Prioridade | Viagens novas | Figuras novas | Créditos |
|---|---|---|---|
| 1 (alta) | 8 | 5 | 7,5 |
| 2 | 9 | 5 | 7,5 |
| 3 | 6 | 6 | 9 |
| Total | 23 | 16 | 24 |

Além das 23 viagens, 4 rotas da prioridade 3 só trocam o desenho por figura IA, sem viagem (doenças respiratórias, protoctista/grupos, teia alimentar, controle biológico). Sempre que a figura atual é realista e fiel, ela vira a vista A ou B e não gasta crédito: 12 das 23 viagens não precisam de figura nova.

Ordem sugerida (peso no ENEM):

1. Ecologia: ciclo do carbono e ciclo do nitrogênio (0 figuras novas)
2. Bioenergética: fotossíntese (1 figura)
3. Ecologia: efeito estufa e eutrofização (0 figuras)
4. Anatomia: glicemia, insulina e glucagon (1 figura)
5. Seres vivos: protozooses, Chagas e malária (1 figura)
6. Seres vivos: verminoses, esquistossomose e tênia (2 figuras)
7. Ecologia: ciclo da água, magnificação trófica e chuva ácida (2 figuras)
8. Vírus: arboviroses e o ciclo do Aedes (1 figura)
9. Embriologia: da fecundação à nidação (0 figuras)
10. Seres vivos: ciclo das briófitas e das angiospermas (2 figuras)
11. Genética: clonagem; Evolução: especiação alopátrica (0 figuras)
12. Prioridade 3, quando sobrar crédito: osmose, fermentação alcoólica, segmentação, absorção, ciclo do fósforo, sucessão primária, teia alimentar, controle biológico, protozoários e sala de aula (6 figuras)
