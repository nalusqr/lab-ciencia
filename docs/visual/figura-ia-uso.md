# figura-ia v2: figuras de IA interativas (🎬 Martin)
`site/biologia-molecular/figura-ia.js` (já no index.html) põe a figura no `#cv` com bordas esfumadas, zoom (roda, pinça, + e -), arrastar com zoom, Vista inicial, troca de vista A e B com fade e leve deslocamento de câmera, lupa de detalhe nos pontos, teclado, aria e reduced-motion. O `.js` da imagem só é injetado quando a cena abre. Modelos: `vit/tipos`, `vit/avitaminoses` e `prot/desnaturacao` em cenas-enzimas-vitaminas.js.

## Montar (no topo do seu IIFE, uma vez)
```js
const FIG = window.LAB_FIGIA ? LAB_FIGIA({
  nome: 'Artéria com placa de gordura',                     // aria do grupo
  vistas: [{ id: 'a', img: 'biologia-molecular-lip-colesterol-a', nome: 'Corte transversal' },
           { id: 'b', img: 'biologia-molecular-lip-colesterol-b', nome: 'Corte longitudinal', recorte: [0, .1, 1, .8] }],
  hs: [{ id: 'placa', c: C.lip, t: 'Placa', d: 'Uma ou duas frases.', em: { a: [62, 60], b: [70, 40] }, z: 2.6 }],
  mask: { miolo: .66, borda: .99 },   // opcional; trocar: false esconde os botões de vista; painel: 'esq'
  aoTrocar(id) { return false; }      // opcional: a cena assume o clique em uma vista (false cancela a troca direta)
}) : null;
```
- `em`: posição do ponto em % da imagem inteira, por vista; sem a vista, o ponto some nela. `t` e `d` aceitam `{ a: '...', b: '...' }`.
- `recorte` [x, y, w, h] em 0-1: a parte da imagem que vale como figura inteira (corta o vazio de imagens largas). Os `em` continuam na imagem inteira.

## Desenhar (no draw da cena, todo quadro)
```js
const R = FIG ? FIG.desenhar(X, { x, y, w, h }, { vista: k > .5 ? 'b' : 'a', ver: h => rev > .5, sobre(R) { /* motion */ } }) : null;
```
- `vista` é opcional: só troca quando o valor muda, então o aluno ainda escolhe pelos botões. Sem `vista`, quem manda são os botões.
- Em `sobre(R)`, desenhe o motion já recortado na moldura: `R.pt(x%, y%)` dá o ponto na tela com zoom, `R.s` são px por 1% da largura, `R.k` vai de 0 a 1 na troca de vista, `R.vista`, `R.z`, `R.pronto`, e `R.veu(alfa)` escurece com o formato da máscara (nunca `fillRect` no retângulo).
- A camada, os pontos e a barra somem sozinhos quando a cena para de chamar `desenhar`. Não use `drag` do motor na mesma área.
- Outras chamadas: `FIG.mostrar('b')`, `FIG.lupa('placa')`, `FIG.inicio()`, `FIG.fechar()`, `FIG.vistaAtual`.

## Regras
Motion só onde ensina (a clara ficando branca antes do corte A para B, eixo da perna se desenhando, luz diminuindo no olho). Texto sem "!", "·" ou setas; "cerca de" para aproximados. Cuidado com nomes locais: cenas-enzimas-vitaminas.js tem um `SC` próprio. Teste: percorra `LABM.rotas` (o `#cv` pinta, console limpo) e `node testes/fumaca.js biologia-molecular`.
