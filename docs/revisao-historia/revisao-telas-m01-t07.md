# Revisão das telas: M01 T07, China, Índia e Japão

📜 Heródoto, 17/11/2026. Uma rodada. Capturas conferidas: todas as de 1280 (e1 a e6 e o estudo) e uma por etapa no 390 (e1-t3, e2-t3, e3-t1, e4-t3, e5-t3, e6-t4). Notação: eN-tK = etapa N, tomada K.

Resumo: a fidelidade geral é boa (muralha de taipa e não de tijolo, xogunato fora da Antiguidade, castas depois dos indo-arianos, budismo "contra as castas"). Os problemas são de enquadramento no 390, posição no mapa e lacunas de conteúdo.

## Itens, por prioridade

1. **e2-t3, 390 (e também 1280): texto "imperador" passa da borda da pirâmide.**
   Problema: no topo estreito, "imperador" e "mandato do céu" são mais largos que o trapézio e invadem as bordas inclinadas (no 390 fica claro; no 1280 encosta na borda). O mesmo ocorre em e4-t4 ("brâmanes" no ápice da pirâmide das varnas) e em e6-t4 ("imperador", apertado).
   Correção: o topo deve ser mais largo (topo truncado com largura de pelo menos 55% da base, ou ápice plano) e o texto do topo com fonte menor e `max-width` igual à largura interna do trapézio na altura do texto. Subtítulo "mandato do céu" em uma linha menor ou movido para uma etiqueta ao lado, com fio. Aplicar a mesma regra às três pirâmides.

2. **e4-t1 a e4-t3 (1280 e 390): Mohenjo-Daro e Harappa fora do lugar, e seta dos indo-arianos sai de Harappa.**
   Problema: o ponto de Mohenjo-Daro cai a oeste da linha do Indo, em pleno deserto; a seta tracejada laranja nasce em Harappa e segue para leste, o que sugere que os indo-arianos saíram das cidades do Indo. Eles vieram do noroeste (Ásia Central, passando pelo Hindu Kush) por volta de 1500 a.C., depois do declínio das cidades. O polígono do "vale do Indo" é um retângulo que termina no mar.
   Correção: pôr Mohenjo-Daro sobre o curso baixo do Indo (Sindh) e Harappa no Punjab, perto do afluente Ravi. Fazer a seta nascer no noroeste (acima do Hindu Kush, fora do polígono do Indo), entrar pelo Punjab e seguir para o Ganges. Redesenhar o polígono acompanhando o rio (faixa irregular, não retângulo).

3. **e4-t3, 390: etiquetas cortadas à esquerda.**
   Problema: "Mohenjo-Daro" aparece como "njo-Daro", a nota amarela como "as vieram depois, / indo-arianos, / de cerca de 1500 a.C." e o ícone do algodão fica pela metade.
   Correção: no 390, enquadrar o zoom pelo centro do vale do Indo (deslocar o mapa cerca de 80 px para a direita) ou ancorar as etiquetas com `left: 8px` mínimo e quebrar o texto em até 3 linhas. Mover a nota amarela para a faixa de mar embaixo, sem cobrir o polígono.

4. **e1-t3 e e1-t5, 1280 e 390: rótulos dos rios cortados ou riscados pela linha; China fora do quadro no 390.**
   Problema: em e1-t3 ("rio Indo", "rio Amarelo", "rio Azul (Yan..."), a linha azul passa por cima das palavras e o último rótulo sai do quadro. No 390, só a Índia aparece e "rio..." fica cortado à direita. Em e1-t5 os rios não têm nome e Japão, China e Índia perdem a etiqueta; a seta da Europa termina no Tibete e não em um dos três povos. O texto diz "Azul"; o mapa mostra "Yangtzé" no estudo, convém padronizar.
   Correção: rótulos com fundo de papel (como as etiquetas brancas) e deslocados 12 px para fora da linha; "rio Azul (Yangtzé)" em duas linhas; no 390, reenquadrar para mostrar Índia e China juntas, ou dividir em duas tomadas (Índia, depois China). Em e1-t5, reexibir as etiquetas China, Índia e Japão e apontar a seta para o centro da Ásia continental, mantendo a nota amarela.

5. **Lacuna de conteúdo no mapa: Rota da Seda e Grande Muralha.**
   Problema: a Rota da Seda não aparece em nenhuma tela do mapa (só é citada no estudo, e o trajeto amarelo de e6-t2 é a rota do budismo, que pode ser confundido com ela). A Muralha em e2-t1 é um zigue-zague amarelo cartunesco, e o texto não indica o ano da unificação.
   Correção: em e2-t1 desenhar a Muralha como linha contínua mais fina, só ao norte do rio Amarelo, e acrescentar à etiqueta "unificação do império: 221 a.C.". Em e6-t2, trocar o título do trajeto para "caminho do budismo (via Rota da Seda e Coreia)" ou desenhar a Rota da Seda como linha separada, em tracejado fino, de Chang'an ao Mediterrâneo.

6. **Datas e dinastias ausentes (Shang, Zhou, Qin, Han) e Ashoka.**
   Problema: as telas só falam "século III a.C." para Qin Shi Huang; as dinastias Shang, Zhou e Han e Ashoka (Império Máuria, século III a.C.) não aparecem nas capturas, e o estudo só cita o Máuria de passagem. O pedido da prova costuma cobrar a ordem das dinastias e Ashoka como rei budista.
   Correção: acrescentar à fita do tempo da faixa China um marco "Shang, Zhou: antes de 221 a.C.", "221 a.C.: Qin Shi Huang unifica", "Han: depois de 206 a.C.", e na faixa Índia "século III a.C.: Ashoka (Máuria) adota o budismo". Se não couber, uma frase no estudo e uma nota na pirâmide ou na etapa 5.

7. **e5-t1: símbolo do hinduísmo (Om) mal desenhado.**
   Problema: o glifo parece um "3" com um ponto e uma curva, não reproduz com fidelidade o sinal Om (ॐ); pode soar como erro ou desrespeito. O rótulo "a religião mais antiga" é afirmação forte demais para uma prova; "muitos deuses" sem nuance.
   Correção: refazer o Om a partir de um glifo real (fonte Devanagari, por exemplo Noto Sans Devanagari, convertida em caminho), com proporções corretas. Texto do cartão: "Hinduísmo: tradição muito antiga; muitos deuses, os Vedas, sustenta as castas". Revisar jainismo e budismo: símbolos (mão com roda, roda do Dharma) estão adequados e respeitosos.

8. **e4-t4 (e e5-t4/e5-t5): "párias" é termo pejorativo e o cadeado.**
   Problema: o rótulo "párias, ou dalits" põe primeiro a palavra de origem colonial e depreciativa; dalits (hoje o termo usado por eles) vem em segundo. O cadeado é infantil para o assunto, e em e5-t4 o X vermelho cobre o cadeado e a seta tracejada termina nele, ao lado do cartão cortado.
   Correção: "dalits (antes chamados de intocáveis)", sem "párias" no desenho (manter só no estudo, entre aspas e com explicação). Trocar o cadeado por uma corrente simples ou por uma seta vertical bloqueada, em desenho mais sóbrio. Em e5-t4 terminar a seta na borda do cartão da pirâmide, com o X ao lado do cadeado e nunca sobre ele.

9. **e6-t6 (1280) e e6-t4/e2-t4 etc.: texto cortado nas fitas do tempo e Japão incompleto; kami cortado no 390.**
   Problema: em e6-t6 a nota "a régua não está em e..." é cortada na borda direita; nas fitas de e2-t4, e3-t4 e e5-t6 o primeiro marco da China (Shang/Zhou) e o texto de "cerca de 1500 a.C." ficam fora da borda esquerda. No 390 (e6-t4), o cartão "kami: espíritos da natureza" aparece como "kami: espíritos da nat". Em e6-t2 a etiqueta "Coreia" cai sobre o mar Amarelo, a oeste da península.
   Correção: limitar a rolagem lateral da fita ao conteúdo (`scroll-padding` de 24 px) e encurtar a nota para "régua fora de escala". No 390, empilhar os dois cartões do xintoísmo (um sobre o outro) ou reduzir a fonte. Mover "Coreia" 40 px à direita, sobre a península.

10. **e2-t2: foto da muralha, legenda e círculo.**
    Problema: o círculo amarelo está certo nas camadas de terra batida, mas a seta tracejada sai da base do círculo e termina fora da etiqueta (pousa na fita adesiva da etiqueta). O estudo diz que o trecho de pedra e tijolo das fotos de turismo é da dinastia Ming; a foto de taipa não informa época nem lugar.
    Correção: encurtar a seta para terminar em cima da borda da etiqueta e acrescentar à etiqueta, em letra menor, "trecho antigo, dinastia Han (cerca de 2 mil anos)", se a legenda da foto confirmar; senão, "trecho antigo de taipa".

## Verificado e sem correção

- 221 a.C. e Qin Shi Huang: texto correto ("século III a.C.", escrita, moedas e pesos padronizados); só falta o ano preciso (item 5).
- Confúcio e Lao-Tsé: século VI e V a.C., com "pela tradição" para Lao-Tsé; o trecho dos Analectos (XII, 11) está certo, com fonte citada. Yin e yang respeitoso.
- Xogunato de 1192 a 1867 fora da Antiguidade, xintoísmo, kami e budismo chegando pela China e Coreia no século VI: corretos. Torii e monte Fuji: adequados, sem anacronismo.
- Ícones: pincel e rolo, algodão, pimenta e gema não são infantis em si, mas a gema (e5 e e4-t2/t3) é um diamante lapidado moderno com brilhinhos; preferir uma pedra bruta ou cabochão e posicionar os três ícones sobre o subcontinente, não sobre o oceano.
