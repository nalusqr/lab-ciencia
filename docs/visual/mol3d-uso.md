# mol3d: cenas 3D de moléculas (🎬 Martin)
`site/biologia-molecular/mol3d.js` põe um modelo 3D (THREE de `site/celula/vendor/r3f.js`) por cima do `#cv` do motor. O `#cv` continua pintado com o fundo do palco, então o teste de fumaça segue passando. O bundle (1,2 MB, cerca de 200 ms) só carrega quando uma cena 3D abre; se o WebGL falhar, a cena desenha `plano(t, S)`.
Modelos prontos para copiar: `agua/molecula` (cenas-a.js, `agua3dMontar`) e `na/dna-rna` (cenas-b.js, `na3dMontar`).

## Montar uma cena
```js
def('prot', 'peptidica', MOL3D.cena({
  t, s, c, d, kv, enem, links, alt,                 // campos de sempre do def()
  ctl: escolha('Passo', ['separados', 'unidos'], 6), // passos; com reduced-motion abre parado e já no fim
  montar(M) { ... },                                 // uma vez: átomos, ligações, grupos
  animar(M, P) { ... },                              // todo quadro: mexe nós e pontes
  legenda: P => ['texto do passo 1', 'texto do passo 2'][P.passo],
  plano(t, S) { /* desenho 2D antigo, só se o 3D falhar */ }
}));
```
Carregue `mol3d.js` depois de `motor.js` no index.html. Unidade: 1 = 1 Å, eixo Y para cima.

## Construtor `M` (em montar)
- `M.grupo(id, { nome, frase, cor })`: conjunto tocável. Tocar num átomo dele destaca o grupo e abre o painel (nome e uma frase).
- `M.no(id, { pai, origem: [x,y,z], eixo })`: nó de movimento. Coordenadas sempre na posição final da cena; o nó só desloca.
- `M.atomo('O', [x,y,z], { no, grupo, nome, frase, rotulo, prio, r: [bola, volume], cor })` devolve o índice. Elementos: H C N O P S Na K Cl Ca Mg Fe e `X` (conta genérica: açúcar, fosfato).
- `M.ligacao(a, b, { ordem: 2, cor, raio })`: bastão meio a meio nas cores CPK. `{ forma: 'placa', larg, esp }` vira placa (base nitrogenada, anel).
- `M.ponteH(a, b, { k: 0 })`: ligação de hidrogênio tracejada, do H (a) ao aceptor (b). Também é tocável.
- `M.rotulo(atomoOuPonte, 'até 3 palavras', prio)`: ponto tocável com pastilha; obedece ao botão Nomes (5 no celular, 8 no computador).
- `M.vista = { th, fi, zoom }`: vista inicial em radianos (três quartos: th -0,5, fi 0,3).

## Animar (em animar, `P` = passo e tempo)
- `P.passo`, `P.tp` (s desde que o passo começou), `P.entre(a, b)` 0 a 1 com `--e-out`, `P.linear(a, b)` para o tracejado.
- Nó: `M.nos[id].pos = [x,y,z]` (deslocamento), `.rot = [x,y,z]`, `.ang` (giro no `eixo`), `.esc` (0 some, 1 inteiro).
- Ponte: `ponte.k` de 0 a 1 desenha o tracejado traço a traço. `M.enquadrar(z)` aproxima a câmera até o aluno mexer.
- Exemplo (água): `no.pos = v3.k(dir, 3.2 * (1 - P.entre(0, 1)))` e `ponte.k = P.linear(.8, 1.4)`.
- Todo passo precisa ter estado final legível: com reduced-motion e Pausar o `P.tp` vai ao fim.

## O que o visor já faz (não refaça)
Luz de estúdio do guia (chave morna, preenchimento e recorte frios, RoomEnvironment), material físico fosco, bola e bastão ou Volume, arrastar ou dedo gira, roda ou pinça aproxima, botões Frente, Lado, Cima, zoom e Vista inicial, autorrotação lenta que para no primeiro toque (e no Pausar), painel com Aproximar, teclado no modelo (setas, + e -, 0, Enter percorre os grupos, Esc fecha) e reduced-motion (sem giro, sem pulso, troca de vista em corte).
Texto na tela: sem "!", "·" ou setas; números aproximados com "cerca de". Teste: `node testes/fumaca.js biologia-molecular`.
