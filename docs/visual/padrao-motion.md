# Padrão de motion do Lab (🎬 Martin)
Vale para todas as cenas: figura-ia, motion e modelo-3d. Usa só canvas 2D, CSS e JS puros, abre por file://. Segue o GUIA-DE-ESTILO (seção Animação).

## Tokens (em `base.css`, `:root`; espelhar em `LAB.motion` no JS)
| Token | Valor | Uso |
|---|---|---|
| `--m-instant` | 90 ms | press, troca de cor de hotspot |
| `--m-fast` | 160 ms | tooltip, rótulo, retorno de toque (faixa 120–200) |
| `--m-base` | 280 ms | painel de legenda, troca de passo |
| `--m-view` | 700 ms | troca de vista, zoom até a estrutura (faixa 600–800) |
| `--m-reveal` | 900 ms | entrada da figura e máscara de revelação (teto de 1 s) |
| `--m-stagger` | 60 ms | intervalo entre hotspots e rótulos |
| `--e-out` | `cubic-bezier(.16,1,.3,1)` | tudo que entra |
| `--e-in` | `cubic-bezier(.7,0,.84,0)` | saída, cerca de 25% mais curta que a entrada |
| `--e-move` | `cubic-bezier(.65,0,.35,1)` | A para B, câmera, zoom |
| `linear` | | só para processo em loop (fluxo de elétrons, rotação da ATP sintase) |
No celular, durações × 0,8. Só processo biológico passa de 1 s, e sempre com Pausar.

## Coreografia padrão de cena
1. **0 ms**: o palco já está pintado (degradê radial `#161D33` → `#0B0F1C`). Nunca uma tela vazia: a cena abre com o estado 1 montado (problema hoje em divisao-celular 14 e 15).
2. **0–900 ms, entrada**: figura com opacity 0→1, scale 1,03→1 e máscara de revelação (ver abaixo), em `--e-out`.
3. **600 ms, hotspots**: entram em stagger de 60 ms, da estrutura principal para as secundárias, com fade e scale de 0,6→1 em 160 ms. Depois, um pulso de convite: 2 ciclos de 1,2 s, e para.
4. **900 ms, legenda**: o título da cena e a frase-guia sobem 8 px com fade em 280 ms. A barra de escala e o aviso "ilustração, cores adicionadas" vêm junto.
5. **Toque num hotspot**: resposta em 90 ms (anel âmbar `#FFB347`). A linha-guia se desenha em 160 ms e a pastilha do rótulo entra em 160 ms, com o painel de texto em 280 ms. O resto da figura escurece para 70% (foco), sem desfoque.
6. **Processo (cenas motion)**: um passo por vez, com cadência fixa de 1,6 a 2,4 s, setas ‹ › e Pausar. O passo novo entra em `--e-out` e o anterior esmaece. Nada se mexe fora do que está sendo explicado.
7. **Saída e troca de aba**: 200 ms com `--e-in` e opacity. A próxima cena começa sem esperar o fim da saída.

## Como animar as figuras de IA (canvas + CSS + JS)
A Íris entrega cada figura em camadas PNG/WebP de até 2K: `fundo`, `figura` (recorte com alfa) e, quando fizer sentido, `detalhe` (uma peça separada, como um órgão ou uma organela), mais `mapa.json` com os hotspots em coordenadas 0–1 da figura.
- **Parallax leve**: as camadas deslocam 2 a 8 px conforme o ponteiro, ou o giroscópio com permissão. Use `transform: translate3d` em `<img>`/`<div>` sobrepostos, com lerp de 0,08 por frame dentro do rAF. Fundo 0,3×, figura 1×, detalhe 1,4×. Some no toque e no teclado.
- **Respiração**: só em material vivo (coração, célula, embrião). Scale de 1 a 1,012 e brilho de 1 a 1,04 em senoide de 4 s (coração: no ritmo do pulso, cerca de 1 s). Use transform e opacity de uma camada de luz, nunca `filter` em loop. Pausa fora da tela (IntersectionObserver) e com a aba oculta.
- **Pulso nos hotspots**: um anel de 1 px a partir do ponto, raio de 1→2,2× e opacidade de 0,6→0, em 1,2 s. Só 2 ciclos ao abrir, mais 1 ciclo quando o aluno fica 8 s sem interagir. Sem piscar e nunca mais de 3 por segundo.
- **Máscara de revelação**: um canvas 2D desenha a figura com `globalCompositeOperation='destination-in'` sobre um gradiente radial ou linear que cresce em `--m-reveal`. Serve para a entrada e para "abrir o corte" (por exemplo a blastocele, o interior da mitocôndria ou a lupa histológica). Alternativa só em CSS: `mask-image` com radial-gradient e `mask-size` animado.
- **Overlay de processo**: as partículas, setas e fluxos do motion são desenhados num canvas transparente por cima da figura, com DPR limitado a 2 e cores da paleta científica.
- Os rótulos são HTML posicionado a partir de `mapa.json` e recalculado no resize. Nunca há texto dentro da imagem.
- Peso: até 400 KB por figura (WebP qualidade 80), carregada com lazy, e um `poster` chapado de 20 KB enquanto a figura carrega.

## Reduced motion (`prefers-reduced-motion: reduce`)
- Sem parallax, sem respiração e sem pulso. O hotspot fica com um anel estático de 1 px.
- Entrada e máscara viram fade de 150 ms. A troca de vista vira corte com esmaecimento de 150 ms.
- O processo não roda sozinho: abre parado no passo 1 e avança pelas setas. O botão "Animar" liga o processo se o aluno quiser.
- Os rótulos aparecem já ligados e sem stagger. Toda informação continua legível sem movimento.
- Teste com o DevTools emulando o modo reduzido, em toda cena, antes de entregar.

## Checklist por cena
Somente transform e opacity, 60 fps no celular médio e CLS 0. Pausar em toda animação automática acima de 5 s. Foco visível nos hotspots (`--focus`), que também funcionam com Tab, Enter e Esc. Cor nunca é a única pista. Nada de neon nem `box-shadow` de brilho.
