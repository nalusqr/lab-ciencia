# Revisão de Biologia: mitocôndria 3D (piloto)

Revisor: Taxon. Material: `site/assets/modelos/previa-mitocondria.png`, `site/assets/modelos/fonte/mitocondria.py`, `docs/ASSETS.md` §5.1.
Veredito: **aprovar com 2 correções obrigatórias** (E1, E2). E3 é recomendada antes de publicar a página.

## O que está correto
- Duas membranas: a externa lisa e a interna dobrada em cristas. As cristas lamelares, perpendiculares ao eixo e alternadas, seguem o padrão das micrografias de célula animal.
- Crista como "U" de duas membranas com espaço intracristas; mesma cor da membrana interna (é a mesma membrana).
- ATP sintase: cabeça F1 na matriz e base Fo na membrana, em fileiras de dímeros (ângulo de ~86°) na borda curva da crista. Isso confere com a criomicroscopia eletrônica.
- mtDNA circular, em fita dupla e com várias cópias; a cor `genetica` liga o mtDNA ao DNA nuclear.
- Ribossomos próprios com duas subunidades, livres na matriz.
- Forma e tamanho (2,2 × 0,84 µm, cápsula levemente curva) dentro da faixa real (0,5–1 µm × 1–10 µm).

## Erros conceituais (o aluno aprenderia errado)
**E1. O espaço da crista está fechado, como se a crista fosse uma peça colada.** No código, os braços do "U" só entram 8 nm na membrana interna (`CRISTA_EMBUTE`), e a membrana interna continua inteira por baixo. Na prévia (zoom na borda de cima), cada crista termina em dois tampões pretos encostados na membrana interna. Assim o aluno conclui que crista e membrana interna são estruturas diferentes e que o espaço da crista não se comunica com o espaço intermembranas. Esse é justamente o compartimento onde os H⁺ se acumulam.
- Correção: no plano do corte, abra a membrana interna sob cada crista. Os dois braços do "U" devem virar a própria membrana interna (uma dobra contínua), e o lúmen deve desembocar no espaço intermembranas. Uma abertura estreita no corte representa a junção da crista e já resolve; no resto da profundidade a crista pode continuar presa como está.

**E2. O lúmen da crista tem uma cor diferente da cor do espaço intermembranas.** O lúmen usa a cor energia × 0,48 (quase preto) e o espaço intermembranas usa `#44292F`. Cor diferente comunica compartimento diferente.
- Correção: pinte o lúmen da crista com o material `espaco_intermembranas` (ou o mesmo tom), para que se leia como um compartimento só: espaço intermembranas = espaço intracristas.

**E3. Falta a cadeia transportadora de elétrons (lacuna, não erro de desenho).** Hoje a membrana interna só mostra a ATP sintase, e o aluno pode concluir que ela produz ATP sozinha. Esse é o tópico de mitocôndria que o ENEM mais cobra.
- Correção: acrescente complexos I–IV como pequenos blocos embutidos nas faces planas das cristas, longe das bordas (onde ficam de verdade), num tom distinto da ATP sintase, com o rótulo "Cadeia transportadora de elétrons". Se não couber no orçamento de triângulos, ponha pelo menos a legenda e uma seta de H⁺ da matriz para o espaço intermembranas/crista.

## Simplificações aceitáveis (vão na nota "fora de escala / simplificado")
Texto sugerido para a página:
> Modelo simplificado e fora de escala. As membranas estão cerca de 2,5 vezes mais grossas e aparecem como uma faixa única, embora cada uma seja uma bicamada de fosfolipídios. As ATP sintases foram desenhadas só perto do corte e na borda das cristas; na célula existem milhares delas. O DNA mitocondrial real, esticado, mede cerca de 5 µm (mais que a organela) e fica compactado em nucleoides. A quantidade e o tamanho dos ribossomos são ilustrativos. Na célula viva, a mitocôndria muda de forma, se funde e se divide.

Também cabem na nota, sem precisar de mudança: as junções das cristas não modeladas como tubos (depois de E1), a ausência de ATP sintase na membrana junto à parede (lá ela é rara mesmo), a ausência de porinas visíveis na membrana externa e os ribossomos só livres (alguns ficam presos à membrana interna).

## Legendas recomendadas (pt-BR, uma frase cada)
| Parte (`rotulo`) | Legenda | Ligação com o ENEM |
|---|---|---|
| Mitocôndria | Organela onde ocorre a respiração celular aeróbica, que transforma a energia da glicose em ATP. | Respiração: C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O + ATP |
| Membrana externa | Envoltório liso e bem permeável a moléculas pequenas, graças a canais chamados porinas. | Dupla membrana: evidência da endossimbiose |
| Espaço intermembranas | Espaço entre as duas membranas, onde se acumulam os H⁺ bombeados pela cadeia transportadora. | Gradiente de prótons |
| Membrana interna | Membrana pouco permeável que reúne a cadeia transportadora de elétrons e a ATP sintase. | Fosforilação oxidativa |
| Cristas | Dobras da membrana interna que aumentam a área disponível para produzir ATP. | Relação forma–função (área de superfície) |
| Matriz mitocondrial | Líquido interno onde acontecem o ciclo de Krebs e a oxidação do piruvato. | Etapas da respiração e onde ocorrem (a glicólise é no citosol) |
| ATP sintase | Enzima que usa o retorno dos H⁺ para a matriz para produzir ATP a partir de ADP e fosfato. | Quimiosmose; é a etapa que mais produz ATP |
| Cadeia transportadora (após E3) | Proteínas que passam os elétrons do NADH e do FADH₂ até o O₂, formando água e bombeando H⁺. | O₂ é o aceptor final de elétrons |
| DNA mitocondrial | DNA próprio, circular e sem histonas, como o das bactérias, herdado quase só da mãe. | Endossimbiose; herança materna |
| Ribossomos | Ribossomos próprios, menores que os do citosol e parecidos com os das bactérias. | Endossimbiose; ação de antibióticos |

Nota de página "No ENEM": a mitocôndria tem dupla membrana, DNA circular e ribossomos do tipo bacteriano e se divide sozinha, por divisão binária. Esses fatos são evidências de que ela descende de uma bactéria englobada por outra célula (teoria endossimbiótica).
