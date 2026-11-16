# Revisão das telas novas do tópico 1 (Biologia molecular), rodada das animações

Revisores: Taxon e Sapien. Escopo: na/dna-rna (versão cinematográfica), na/nucleotideo, na/pareamento, enz/encaixe, agua/molecula, agua/solvente, agua/capilaridade, agua/teor, sais/funcoes, sais/osmose, carb/mono-di, carb/polissacarideos, lip/glicerideos, lip/classes, lip/colesterol, prot/aminoacidos, prot/peptidica, prot/niveis. Base: capturas q3-*, dna-q2-*, enz-encaixe-*, fig-*-1280 e leitura dos textos nos .js. Nada foi editado no código.

Resultado do item 3 (texto proibido): nenhum "!", "·", "→" ou "↔" aparece em texto de tela nos quatro arquivos (os "·" achados estão só no comentário da linha 1 de cenas-a.js e cenas-b.js). Nenhum código interno aparece nos rótulos. Os números aproximados sem "cerca de" estão no achado B1.

Pontos conferidos e corretos: sequência do gene (AUG GCA UUC GGU AAA UGC GAA CUG UGG AAG CAU, UAA de parada) e os 11 aminoácidos; T só no DNA e U só no RNA em todos os passos; RNA montado na fita molde, igual à codificadora com U; polimerase andando no sentido certo e 5' do mRNA saindo primeiro; mRNA correndo pelo ribossomo com sítios A, P e E na ordem certa; transferência da cadeia para o tRNA do sítio A antes da translocação; anticódons complementares aos códons; nucleotídeos livres com três fosfatos que perdem dois ao se ligar; 240 ligações de hidrogênio para 100 pares com 30% de A; hidratação do Na⁺ pelo O e do Cl⁻ pelo H; frutose em anel de cinco; 11 não essenciais e 9 essenciais; valina no lugar de glutamato na anemia falciforme.

## Achados de gravidade média

### M1. na/nucleotideo: o terceiro OH do fosfato aparece solto, sem ligação com o P
- Onde: nuc3dMontar, cenas-b.js linha 417 (`G.lig(I.p, I.op3, 1, { sem: true })`). Visível em q3-na_nucleotideo.png e na-nucleotideo.png: o HO no alto, à direita do fosfato, flutua sem traço até o P.
- O que está errado: a ligação P–OH foi marcada com `sem: true` para o nucleotídeo b (que perde esse OH na água), mas o nucleotídeo a (o único visível nos passos 1 e 2) herda o mesmo ajuste e fica com um OH desconectado. O monofosfato mostra só três grupos presos ao P.
- Correção: desenhar a ligação P–op3 sempre para o nucleotídeo a. Só o nucleotídeo b precisa da ligação fantasma `dW`. Por exemplo, passar `sem: true` apenas quando `no` for 'b', ou criar a ligação de a depois do `emit`.
- Gravidade: média.
- Status: resolvido. A ligação P–OH do nucleotídeo a agora é desenhada; só o nucleotídeo b mantém `sem: true` (a dele é a fantasma `dW`, que sai com a água). Conferido na cena: o P do a tem quatro O ligados nos três passos.

### M2. na/nucleotideo: o carbono 2 da pentose fica com três vizinhos nos dois estados (leitura do código; conferir com zoom)
- Onde: nucleotidoG, cenas-b.js linhas 395 e 397-398. O `hd` (H do 2' do DNA) é criado antes de `G.hid()`, então o carbono 2 já conta com 4 ligações (C1, C3, O2 e hd) e não recebe seu H automático.
- O que está errado: no passo DNA, o O2 e seu H são escondidos e só resta o `hd`, de modo que o C2' fica CH e não CH₂. No passo RNA, o `hd` é escondido e o C2' fica com OH e sem H. Como a legenda destaca justamente "sem OH" e "com OH no carbono 2", o desenho do carbono 2 precisa estar completo. No passo 3, o nucleotídeo b mostra `boh` e `bhd` juntos, com o H dentro da ligação C–O.
- Correção: chamar `G.hid()` antes de criar o `hd`, para o C2' ganhar o H automático. Assim o DNA mostra 2 H no C2' (o automático e o `hd`) e o RNA mostra OH e H. Esconder `bhd` ou `boh` no nucleotídeo b conforme o passo, para não sobrepor.
- Gravidade: média.
- Status: resolvido. Conferido antes de mudar, com zoom na captura e contando as ligações visíveis na cena: o C2' tinha só três vizinhos (CH no DNA, C com OH e sem H no RNA), então precisava de correção. `G.hid()` agora roda antes de criar o `hd`, e o C2' ganha o seu H: DNA com 2 H, RNA com OH e H. No passo 3 o nucleotídeo b entra como ribonucleotídeo, igual ao a (`boh` visível, `bhd` escondido), sem H dentro da ligação C–O.

### M3. enz/encaixe: o sítio ativo não "envolve" o substrato
- Onde: encAnimar, cenas-enzimas-vitaminas.js (posição `boca = [0, 4.2, 0]`, k indo a 0). Capturas enz-encaixe-2-9.png e enz-encaixe-3-18.png.
- O que está errado: a legenda do passo 3 diz "O sítio ativo muda de forma e envolve o substrato", mas na animação o substrato fica espetado no alto da fenda, com os dois anéis e a ponte de fora, e os lobos da enzima não passam por cima dele. Na reação (passo 4), a água e a quebra também acontecem fora da enzima. O encaixe induzido, que é o ponto central da tela, fica pouco visível.
- Correção na animação: descer o substrato para dentro da fenda (por exemplo `sp` final em y ao redor de 1,5 em vez de 0) e fechar a fenda um pouco além (k final ligeiramente abaixo de 0) para os lobos cobrirem os anéis. Se não for viável, trocar a legenda por "O sítio ativo muda de forma e se fecha sobre o substrato" e reposicionar o rótulo "água" para não cobrir "substrato" (ver B8).
- Gravidade: média.
- Status: resolvido na animação, legenda mantida. No encaixe induzido o substrato desce 1,5 dentro da fenda (`FUNDO`) e os domínios fecham um pouco além da forma de repouso (`KF = -0,2`): o lobo da frente passa por cima dos anéis. A reação (água e quebra) e o início da saída dos produtos acontecem nessa mesma posição, dentro da enzima; no passo 5 a enzima volta a abrir a partir dela. Capturas fix-enz-encaixe-2 e -3.

### M4. na/pareamento: o subtítulo diz 100 pares, mas a cena mostra 10
- Onde: `loc: 'Trecho de DNA com 100 pares'` (cenas-b.js linha 858); a cena 3D tem PA3.n = 10 degraus (capturas q3-na_pareamento.png e q3-390-na_pareamento.png).
- O que está errado: o rótulo do canto afirma uma quantidade que a figura não mostra. A legenda "em 100 pares, 240 ligações" está correta como conta, mas o aluno vê dez degraus.
- Correção: `loc: 'Dez pares mostrados, de um trecho de 100'` e, na legenda, "A = T = 30% e G = C = 20%; em 100 pares (aqui, dez são mostrados), 240 ligações de hidrogênio". Manter a conta como está.
- Gravidade: média.
- Status: resolvido. Subtítulo: "Dez pares mostrados, de um trecho de 100"; legenda: "em 100 pares (aqui, dez são mostrados), 240 ligações de hidrogênio", com a conta mantida. O desenho plano (sem WebGL) também passou a mostrar dez pares, com a mesma legenda.

### M5. na/dna-rna, passo 1: o rótulo "DNA: duas fitas" abre o painel "Fita codificadora"
- Onde: dna-rna-cine.js linha 497 (`{ p: 0, t: 'DNA: duas fitas', pc: 'cod' ... }`) e linha 500 (`'RNA: uma fita'` aponta para `mrna`). Captura dna-q2-iframe-1-7.png.
- O que está errado: no passo de comparação o aluno toca em "DNA: duas fitas" e recebe um painel chamado "Fita codificadora" ("A outra fita do DNA... mesma sequência do mRNA"), que ainda nem foi apresentada. O rótulo de RNA abre o painel "mRNA", com texto de cópia de gene, também antes da transcrição.
- Correção: criar duas peças para o passo 1, `dna` (nome "DNA", texto "Duas fitas antiparalelas enroladas em dupla hélice, unidas por ligações de hidrogênio entre as bases. Guarda a informação genética no núcleo.") e `rna` (nome "RNA", texto "Uma fita só, com ribose e uracila. Pode ser mensageiro, transportador ou ribossômico."), e apontar os rótulos 'DNA: duas fitas' e 'RNA: uma fita' para elas.
- Gravidade: média.
- Status: resolvido. Novas peças `dna` (DNA, ácido desoxirribonucleico) e `rna` (RNA, ácido ribonucleico) com os textos sugeridos; os rótulos "DNA: duas fitas" e "RNA: uma fita" do passo 1 apontam para elas e o destaque da malha acende junto. Conferido clicando nos dois rótulos (capturas fix-dna-rna-0-painel-dna e -rna).

## Achados de gravidade baixa

### B1. agua/teor: números aproximados sem "cerca de" e dois valores diferentes para o adulto
- Onde: medidor lateral "59 % de água" contra a legenda "Adulto: cerca de 60% de água" aos 30 anos (captura fig-agua-teor-1280.png); título e barras "teor de água por tecido (adulto)" com 83 %, 79 %, 79 %, 73 %, 73 %, 64 %, 31 %, 15 % sem qualificação; parágrafo de detalhe: "e um idoso, de 50 a 55%".
- Correção: arredondar o medidor para múltiplos de 5 (função idadeAgua) e exibir "cerca de 60 %"; mudar o título das barras para "teor aproximado de água por tecido (adulto)" e o rótulo de cada barra para "cerca de 83 %" (ou deixar só o título se o espaço faltar); trocar o parágrafo por "e um idoso, cerca de 50 a 55%". Padronizar também "83 %" e "75%" (com ou sem espaço antes do sinal).
- Gravidade: baixa.
- Status: resolvido. O medidor arredonda para múltiplos de 5 e mostra "cerca de 60%"; a legenda do adulto usa o mesmo valor arredondado. Título "teor aproximado de água por tecido (adulto)" e cada barra com "cerca de 83%". Parágrafo: "e um idoso, cerca de 50 a 55%". Porcentagens padronizadas sem espaço antes do sinal.

### B2. agua/capilaridade: a frase final da legenda não combina com o tubo mostrado
- Onde: cap da cena, cenas-a.js linha 375: "Tubo de 0,6 mm: a água sobe cerca de 5,0 cm. Metade do diâmetro, o dobro da altura".
- O que está errado: 0,6 mm não é metade de nenhum tubo na figura (os outros têm 2,0 e 1,0 mm), então a segunda frase parece uma comparação errada.
- Correção: "Tubo de 0,6 mm: a água sobe cerca de 5,0 cm. A altura é inversamente proporcional ao diâmetro: com metade do diâmetro, sobe o dobro". Nos pontos "Tubo largo, 2 mm" e "Tubo médio, 1 mm", escrever "de diâmetro" ("Tubo largo, 2 mm de diâmetro").
- Gravidade: baixa.
- Status: resolvido. Legenda com a frase da proporção inversa e pontos "Tubo largo, 2 mm de diâmetro" e "Tubo médio, 1 mm de diâmetro".

### B3. carb/polissacarideos: formulações imprecisas
- (a) Texto de detalhe: "Quase todos os importantes são feitos só de glicose", seguido da quitina, que é de N-acetilglicosamina. Corrigir para "A maioria é feita de glicose (a quitina, de um derivado dela, com nitrogênio)".
- (b) Legenda da lupa: "amilose em hélice e poucas ramificações" mistura as duas moléculas do amido. Corrigir para "amilose em hélice, sem ramificações; a amilopectina tem poucas". No ponto "Grão de amido": "amilopectina, pouco ramificada" fica correto, mas acrescentar "(mais que a amilose, menos que o glicogênio)".
- (c) Glicogênio: o texto de detalhe e o kv dizem "dos animais" e "reserva animal", enquanto INFO e o ponto dizem "animais e fungos". Padronizar para "animais e fungos".
- Gravidade: baixa.
- Status: resolvido. (a) "A maioria é feita de glicose (a quitina, de um derivado dela, com nitrogênio)". (b) Lupa: "amilose em hélice, sem ramificações; a amilopectina tem poucas"; o parágrafo do amido foi ajustado do mesmo modo; ponto "Grão de amido" com "(mais que a amilose, menos que o glicogênio)". (c) Glicogênio como reserva de "animais e fungos" no texto, no kv e na legenda.

### B4. na/dna-rna, passo 2: legenda de pareamento ambígua
- Onde: LEG[1] ("...monta o RNA mensageiro, A com U, T com A, G com C e C com G") e peça `molde` (mesma sequência).
- O que está errado: "A com U, T com A" pode ser lido como pares DNA com DNA ou RNA com RNA, e "T com A" parece contradizer "só U no RNA".
- Correção: "...lê a fita molde e monta o RNA mensageiro: para cada base do molde entra a complementar, A recebe U, T recebe A, G recebe C e C recebe G". Peça `molde`: "O RNA é montado complementar a ela: onde há A, entra U; onde há T, entra A; onde há G, entra C; onde há C, entra G."
- Gravidade: baixa.
- Status: resolvido. LEG[1] e a peça `molde` com os textos sugeridos.

### B5. na/dna-rna, passo 4: painel "Ribossomo" com texto do ribossomo inteiro na subunidade maior
- Onde: peças `ribo1` (subtítulo "Subunidade maior") e `ribo2` (dna-rna-cine.js linhas 68 e 69). O rótulo da cena fica na subunidade maior, mas o painel diz "Lê o mRNA de 3 em 3 bases".
- Correção: `ribo1`: "Subunidade maior do ribossomo: catalisa as ligações peptídicas entre os aminoácidos. A menor, abaixo, prende o mRNA e confere o pareamento códon e anticódon." `ribo2`: "Subunidade menor: prende o mRNA e lê os códons, de 3 em 3 bases."
- Observação: a peça `codon` diz "Cada códon indica um aminoácido"; acrescentar "(exceto os de parada, como o UAA que encerra este gene)".
- Gravidade: baixa.
- Status: resolvido. `ribo1` e `ribo2` com os textos sugeridos; `codon` com "(exceto os de parada, como o UAA que encerra este gene)".

### B6. prot/peptidica, passo 1: o rótulo "ligação peptídica" está no oxigênio da carbonila
- Onde: pep3dMontar, cenas-b.js linha 268 (`M.rotulo(I.o1, 'ligação peptídica', 0)`), captura q3-prot_peptidica.png. Antes da reação não há ligação; o rótulo marca o O do grupo C=O.
- Correção: ancorar o rótulo no C da carboxila (ou no N do outro aminoácido) e escrever "onde vai se formar a ligação peptídica" no passo 1; "ligação peptídica" só nos passos 2 e 3.
- Gravidade: baixa.
- Status: resolvido. No passo 1 o rótulo "onde vai se formar a ligação peptídica" fica no C da carboxila; nos passos 2 e 3, "ligação peptídica" fica no N do outro aminoácido, já ligado. O O da carbonila não tem mais rótulo.

### B7. lip/colesterol: gênero de LDL e HDL varia no mesmo parágrafo
- Onde: "A LDL leva... A HDL recolhe..." e logo depois "o LDL é o colesterol ruim e o HDL, o bom".
- Correção: manter "o LDL" e "o HDL" (colesterol "ruim" e "bom") nas duas frases, ou "a LDL" e "a HDL" (lipoproteína) em ambas, mas sem alternar. Sugestão: "O LDL leva colesterol do fígado aos tecidos... O HDL recolhe...".
- Gravidade: baixa.
- Status: resolvido. "O LDL leva..." e "O HDL recolhe...", sem alternar com "a".

### B8. enz/encaixe, passo 4: o rótulo "água" cobre o rótulo "substrato"
- Onde: captura enz-encaixe-3-18.png: as pílulas "água" e "substrato" se sobrepõem no alto da fenda.
- Correção: dar `dx` e `dy` opostos aos dois rótulos (por exemplo "água" para a direita e para cima, "substrato" para a esquerda e para baixo) ou esconder o rótulo "água" enquanto "substrato" estiver visível.
- Gravidade: baixa.
- Status: resolvido. O rótulo "substrato" foi para a ponta do anel de baixo e à direita, longe do caminho da água; os dois não se cobrem mais no passo 4 (captura fix-enz-encaixe-3).

## Resumo
- Situação: os 13 achados foram resolvidos (rodada de correção do Dry, sem mexer em mol3d.js, motor.js, enquadramento, materiais ou imagens).
- Alta: 0
- Média: 5 (M1 a M5)
- Baixa: 8 (B1 a B8)
