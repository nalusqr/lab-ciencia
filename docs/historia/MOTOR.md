# Motor da colagem (História)

Cada tópico é uma página curta mais um arquivo de dados. O motor faz o resto: palco com câmera, painel, marca-texto, peças, mapas, traços à mão, teclado, `prefers-reduced-motion` e o layout de 390 px.

- `site/historia/colagem.css` e `colagem.js`: o motor.
- `site/historia/recortes.js`: ilustrações desenhadas em código e esquemas (pirâmide, comparação, tabela).
- `site/historia/dados/mNN-tNN-tema.js`: os dados do tópico.
- Exemplo completo: `m01-t03-egito.html` + `dados/m01-t03-egito.js`.

## Página do tópico

Copie `m01-t03-egito.html`, troque título, descrição, as imagens de `../img/ia/*.js` (uma `<script>` por figura usada) e o arquivo de dados. Depois troque "em breve" pelo link na lista do módulo em `site/historia/index.html`.

## Formato do arquivo de dados

```js
Colagem.montar({
  modulo:'Módulo 1: Pré-História e Antiguidade', titulo:'Mesopotâmia', subtitulo:'...',
  credito:'...', enem:'Texto do cartão No ENEM. ==palavra== vira marca-texto.',
  ritmo:9000,              // ms por etapa na viagem automática
  mesa:{w:1600,h:1000},    // tamanho da mesa em px; as peças usam essas coordenadas
  pecas:[ ... ], etapas:[ ... ]
});
```

**Etapa:** `titulo`, `texto` (parágrafos separados por linha em branco; `==x==` vira `<mark>`, `**x**` negrito), `foco` (`[x,y,w,h]` na mesa, um id ou lista de ids; padrão: as peças da etapa), `focoM` (foco opcional para celular), `mostra` (peças que entram aqui e ficam), `so` (peças só desta etapa, como notas), `tracos`, `realce` (`[{peca,item}]` em pirâmide, comparação e tabela), `fonte` (id da peça-fonte: o painel mostra "Ver o que essa fonte mostra").

**Peça:** sempre `id`, `tipo`, `x`, `y`, `w`, `h` (px na mesa), `giro` (graus), `rotulo` (leitor de tela). Tocar na peça leva à etapa em que ela entra (ou `ir`).

| tipo | campos próprios |
|---|---|
| `foto` | `img` (chave em `window.LAB_IMG`), `foco`, `zoom`, `fita` (`false` ou `{x,g}`), `legenda`, `cor:true` para não ficar P&B |
| `retrato` | `img`, `zoom`, `foco` (ex. `'62% 62%'`) |
| `fonte` | `texto`, `ref`, `resposta`, `pergunta` (padrão "O que essa fonte mostra?") |
| `tempo` | `marcos:[{p:% , t:'cerca de 3100 a.C.', etapa, cor}]` |
| `nota` | `texto` (nota amarela; use em `so`) |
| `icone` | `nome` (ver `Colagem.ICONES`), `legenda`, `fundo` (cor ou `false`) |
| `piramide` | `camadas:[{t,s}]` do topo para a base |
| `comparacao` | `titulo`, `a:{titulo,itens}`, `b:{titulo,itens}` (itens de `b` contam a partir de 100 no `realce`) |
| `tabela` | `titulo`, `colunas`, `linhas` |
| `mapa` | `base`, `camadas` (abaixo) |

Ícones: pedra-lascada, pedra-polida, fogo, espiga-foice, tabua, zigurate, coluna, anfora, moeda, coroa, pergaminho, balanca, navio, muralha. Cores: `amarelo`, `coral`, `coral-esc`, `seta`, `petroleo`, `tinta`, `rio`, `branco` ou qualquer CSS.

**Traços** (coordenadas em % da peça): `{tipo:'circulo', peca, x, y, w, h, cor, espessura}` (x,y é o centro; w,h o diâmetro); `{tipo:'seta', de:{peca,x,y}, para:{peca,x,y} ou [x,y] na mesa, curva}`; `{tipo:'sublinha', de, para}`. Desenham-se em sequência na etapa.

## Mapas

Bases: `historia-egito-mapa` (1152 x 928), `historia-mapa-mediterraneo` (1376 x 768), `historia-mapa-mundo` (1376 x 768). Pontos em pixels da base, ou em longitude e latitude com `ll:true` na camada (só Mediterrâneo e mundo; o do Mediterrâneo é aproximado, erro de até cerca de 13 px). Também há `Colagem.lonlat(base, lon, lat)` e `Colagem.suave(pontos)` (Catmull-Rom).

Cada camada: `etapas:[...]` ou `desde`/`ate`; `atraso` (ms ao entrar); `dura` (ms visível na última etapa); `tam` (escala de rótulos e marcadores).

| tipo | campos |
|---|---|
| `regiao` | `pts` (polígono), `estilo:'listra'` ou cor chapada coral, `suave:false`, `corte:[x,y,w,h]` |
| `corredor` | `pts`, `largura` (faixa colorida ao longo de um rio) |
| `rota` | `pts` ou `d`, `estilo:'rota'|'rio'|'fronteira'`, `movel:'barco'|'ponto'`, `volta` (ms), `invisivel:true` |
| `pulso` | `pts` ou `d`, `largura` (a cheia) |
| `cidade` | `p`, `nome`, `sub`, `capital:true`, `lado:'d'|'e'|'c'` |
| `etiqueta` | `p` (canto), `texto`, `sub`, `cor:'amarelo'` |
| `rotulo` | `p`, `texto`, `classe:'mar'|'regiao'|'terra'`, `giro` |

## Exemplo mínimo

```js
Colagem.montar({
  modulo:'Módulo 1: Pré-História e Antiguidade', titulo:'Fenícios', subtitulo:'Mercadores do mar',
  pecas:[
    {id:'mapa',tipo:'mapa',base:'historia-mapa-mediterraneo',x:40,y:40,w:1100,h:614,rotulo:'Mapa do Mediterrâneo',camadas:[
      {tipo:'cidade',ll:true,p:[35.6,34.1],nome:'Biblos'},
      {tipo:'rota',ll:true,pts:[[35.5,33.9],[28,34],[20,35],[10.3,36.9]],movel:'barco',desde:1},
      {tipo:'cidade',ll:true,p:[10.3,36.9],nome:'Cartago',capital:true,desde:1}]},
    {id:'navio',tipo:'icone',nome:'navio',legenda:'Navio mercante',x:1180,y:120,w:300,h:300},
    {id:'n1',tipo:'nota',x:1180,y:460,w:260,texto:'Rotas de comércio pelo mar'}
  ],
  etapas:[
    {titulo:'Uma faixa de terra',mostra:['mapa'],texto:'Os ==fenícios== viviam no litoral.'},
    {titulo:'Pelo mar',mostra:['navio'],so:['n1'],foco:[40,40,1460,640],
     tracos:[{tipo:'seta',de:{peca:'navio',x:20,y:60},para:[700,380]}],
     texto:'Fundaram ==Cartago== e espalharam o alfabeto.'}
  ]
});
```

Regras de texto na tela: sem "!", sem "·", "→", "↔" ou "~" ("cerca de" no lugar).

## Textos longos, tomadas de câmera e texto de estudo (17/11/2026)

**Texto de etapa de 90 a 140 palavras.** O painel rola por dentro (no desktop) e os botões ficam fixos no topo dele; no celular o texto fica abaixo do palco. Para a viagem automática esperar o tempo de leitura, use no arquivo de dados `ritmo:9000` e `msPalavra:250`: cada etapa espera `ritmo + palavras x msPalavra` (e nunca menos que `tempo` da etapa). Sem `msPalavra`, vale o `ritmo` fixo (o Egito continua assim). Rolar ou tocar no painel pausa a viagem; trocar de etapa volta o texto ao topo.

**Celular.** `celularGrande:true` deixa o palco mais alto e sobe as letras das peças (legendas, notas, etiquetas, fita, fonte, pirâmide) para ficarem com cerca de 11 px ou mais depois do zoom. Regra: no celular, menos peças por tomada e zoom maior; confira a letra mais pequena de cada tomada.

**Tomadas da câmera numa etapa.** Além de `foco`/`focoM`: `foco2` + `foco2Em` (ms) + `foco2M` é uma segunda tomada; `tomadas:[[ms,[x,y,w,h]],...]` faz quantas quiser, e `tomadasM` vale só no celular (fica o `focoM` como primeira). Peça com `atraso` (ms) entra depois desse tempo; traço com `atraso` também. `data-et="0,3"` em qualquer elemento de uma peça o acende nas etapas listadas (classe `on`). `tempo` aceita `aviso` (ex.: "a régua não está em escala"). Camada de região aceita `mistura:false` (cor sem multiplicar, p. ex. gelo). Botões do painel têm `#bAnt`, `#bPlay` e `#bProx`.

**Texto de estudo (`estudo`).** Aparece abaixo da colagem, em coluna de leitura de cerca de 70 caracteres, com sumário de âncoras no topo e três quadros em papel no fim. Campos:

```js
estudo:[{titulo:'O que é a Pré-História', texto:'Parágrafos separados por linha em branco.\n\n==marca-texto== e **negrito**.'}, ...],
resumo:['Item curto 1', 'Item 2', ...],          // quadro "Resumo para revisar" (lista, 6 a 10 itens)
enem:'Texto do quadro No ENEM. ==x== marca.',     // o mesmo campo do cartão antigo
urca:'Texto do quadro Nos vestibulares do Ceará (URCA).'
```

Com `estudo`, o cartão "No ENEM" do painel some (o quadro o substitui) e o painel ganha o link "Ler o texto de estudo, abaixo da colagem". O sumário lista as seções e os quadros. Sem `estudo`, nada muda.
