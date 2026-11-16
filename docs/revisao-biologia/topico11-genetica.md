# Tópico 11, Genética: revisão de biologia (Taxon e Sapien)

Rodada única. Arquivos: site/genetica/gen3d-pecas.js, cenas3d-mendel.js, cenas3d-cromossomos.js, cenas3d-biotec.js e cenas-figura.js.

## 3D: corrigido
- conceitos/gene: os homólogos da ervilha vinham "pelo espermatozoide" e "pelo óvulo". Agora: gameta masculino (no grão de pólen) e gameta feminino (dentro do óvulo da flor). O texto do loco também ficou mais claro.
- sexo/daltonismo e sexo/hemofilia: "ligado ao hemofilia" virou "ligado à hemofilia". O detalhe do cromossomo X agora explica que a mulher precisa de dois alelos recessivos e o homem de um só.
- extras/ligacao: "Genes colados" virou "Ligação completa".
- biotec/recombinante: o gene da insulina ganhou uma nota sobre DNA complementar (sem íntrons). A enzima de restrição corta uma "sequência específica" e deixa "pontas coesivas".
- Proporções conferidas: 3 : 1 e 1 : 2 : 1 (lei1), 1/4 de cada gameta (lei2), r/2 por recombinante (ligacao) e as frações dos filhos na herança ligada ao X. Todas estão corretas.

## Figuras de IA (14 imagens abertas)
- As 3 cores de Mirabilis, o gado ruão com pelos misturados, a aglutinação na lâmina e na microscopia, a Finn Dorset com a Blackface, os labradores e o nariz conferem com o texto.
- Barr A: o corpúsculo é triangular e fica perto da borda do núcleo, mas não encosta nela. O texto passou a dizer "na periferia do núcleo, junto ao envelope". O hotspot do envelope, que caía no citoplasma, foi movido para a borda. O do citoplasma foi recentrado.
- Barr B: o hotspot da célula foi recentrado.
- ABO B: "rejeição na transfusão errada" virou "obstrui vasos e destrói hemácias na transfusão incompatível".
- **Vista removida: poligenica B (Distribuição de alturas).** A foto é um grupo em arquibancada no formato de sino, mas as pessoas não estão agrupadas por altura. Ela não mostra uma distribuição de alturas. A cena fica só com a vista A (mãos). A informação de 2n + 1 classes e do pico da curva passou para o hotspot "Tons intermediários".
- Os arquivos genetica-extras-poligenica-b.webp/.js ficaram sem uso e podem ser apagados.

## Pendências de dev (screenshots)
- extras_ligacao-cel: a caixa da legenda cobre parte dos rótulos dos gametas (AB) no celular.
- sexo_daltonismo-desk: os cromossomos do zigoto ficam por cima do rótulo "menina normal".

## Teste
`node testes/fumaca.js genetica`: 32 ok, 0 falhas, 0 avisos.
