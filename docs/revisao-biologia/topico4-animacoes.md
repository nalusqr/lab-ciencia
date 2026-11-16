# Revisão das animações 3D do módulo Bioenergética (tópico 4)

Revisores: 🔬 Taxon (ATP, respiração e fermentação) e 🧬 Sapien (fotossíntese, fatores e relações), cada um com uma olhada rápida na parte do outro. Escopo: as 15 rotas atp/ciclo, atp/acoplamento, resp/geral, resp/glicolise, resp/krebs, resp/cadeia, ferm/latica, ferm/alcoolica, foto/geral, foto/clara, foto/calvin, fatores/c4cam, relacao/ciclo, relacao/carbono e relacao/quimio. Base: capturas `*_fin.png` em /tmp/claude-0/t4/shots/ (1200 e 390 px), a leitura de bio3d.js, cenas3d-atp-resp.js, cenas3d-ferm-foto.js e cenas3d-relacao.js, e a referência docs/revisao-biologia/bioenergetica-enem.md. Nada foi editado no código.

Gravidade: M quer dizer que muda o conteúdo ou que há um erro científico. B quer dizer um problema menor (texto, regra de tela ou layout).

## O que conferimos e está certo

- ATP: adenina, ribose e 3 fosfatos; gasto `ATP + H₂O` forma `ADP + Pᵢ`; a recarga libera água. Acoplamento com reação que libera e que consome energia, e parte vira calor.
- Respiração: glicólise no citosol com 2 piruvatos (3 C), investimento de 2 ATP, 4 formados, saldo de 2 ATP e 2 NADH, sem O₂. Krebs na matriz, acetil-CoA mais oxaloacetato formam citrato, 2 voltas por glicose, por volta 2 CO₂, 3 NADH, 1 FADH₂ e 1 ATP, na ordem certa das etapas. Cadeia na membrana interna (cristas), complexos I a IV, H⁺ da matriz para o espaço intermembranas, O₂ como aceptor final formando água no lado da matriz, ATP sintase com a cabeça na matriz, e parada sem O₂. Saldo 2 + 2 + "cerca de 26 a 28" fecha com os 30 a 32 do módulo.
- Fermentação: lática sem CO₂ (músculo, iogurte, lactobacilos) e alcoólica com acetaldeído, 2 etanol e 2 CO₂ (levedura, pão), ambas no citosol, regenerando NAD⁺ e com só 2 ATP.
- Fotossíntese: cloroplasto com envoltório, estroma, tilacoides e grana. Fase clara na membrana do tilacoide com fotólise da água no fotossistema II (lado interno), O₂ vindo da água, H⁺ para dentro do tilacoide, ATP sintase e NADP⁺ redutase voltadas ao estroma. Calvin no estroma com RuBisCO, RuBP (5 C), 3 voltas para 1 G3P, 9 ATP e 6 NADPH (18 e 12 por glicose).
- C3, C4 e CAM: C4 com mesofilo e bainha do feixe (separação no espaço); CAM com estômato aberto à noite, ácido no vacúolo e estômato fechado de dia (separação no tempo); fotorrespiração ligada ao fechamento do estômato da C3 no calor.
- Relações: cloroplasto e mitocôndria trocando glicose e O₂ por CO₂ e H₂O; ciclo do carbono com fotossíntese, respiração, decomposição e combustão; quimiossíntese no fundo do mar, sem luz, oxidando H₂S com O₂ e fixando CO₂.
- Regras de texto: nenhum "!", "·", "→" ou "↔" nos textos das cenas; aproximação com "cerca de"; nenhum código interno visível.

## Erros de conteúdo (M)

### M1. CAM: o medidor "Fixa CO₂" fica em zero à noite
- Rota: fatores/c4cam. Arquivo: cenas3d-relacao.js, linha 26 (`estado`, CAM: `fix: D * .5`) e linhas 123 e 127 (`'Fixa CO₂ agora'` e `'Fixa CO₂'`). À noite a barra da CAM zera, mas é justamente à noite que a CAM fixa o CO₂ (como ácido, no vacúolo). O aluno lê "CAM não fixa CO₂ à noite", o contrário do que a legenda e a lição dizem. O que a barra mede, de fato, é o ciclo de Calvin.
- Correção: na linha 123, `'Fixa CO₂ agora'` passa a `'Ciclo de Calvin agora'`; na linha 127, `'Fixa CO₂'` passa a `'Ciclo de Calvin'`. Depois da linha 132, acrescentar:
  `if (i === 2 && g.D < .5) B.texto(g, B.mundo(g, gr, [0, 2.0, 0]), 'prende CO₂ como ácido', { s: 12, w: 700, c: '#9CC8FF' });`

### M2. Com "Calor e seca" no máximo, a C3 aparece perdendo menos água que a C4 e a CAM
- Rota: fatores/c4cam. Arquivo: cenas3d-relacao.js, linhas 24 a 26. Com h = 1: C3 `agua: 1 - .8 * h` = 0,20; C4 `(1 - .6 * h) * .55` = 0,22; CAM `.22`. A ordem vira C3 < C4 = CAM e contradiz a lição e a referência (perda de água CAM < C4 < C3).
- Correção: C3 `agua: 1 - .55 * h`; C4 manter `(1 - .6 * h) * .55`; CAM `agua: .2 - .1 * h`. Em h = 0 fica 1; 0,55; 0,20 e em h = 1 fica 0,45; 0,22; 0,10. A ordem CAM < C4 < C3 vale em toda a faixa.

## Problemas menores (B)

### B1. Fichas de moléculas em movimento passando sobre rótulos (já conhecido)
- Rotas e capturas: resp/geral 390 (ficha "ATP" sobre "1. Glicólise"), resp/krebs 390 (contas do ciclo sobre "CO₂ e NADH"), resp/cadeia 390 ("ADP + Pᵢ" sob a ATP sintase), foto/geral 1200 e 390 ("O₂ (vem da água)" sob "granum" e "tilacoide"), foto/calvin 390 (moléculas sobre "2. redução").
- Causa: bio3d.js, linha 225. `desenharFichas` reserva para cada texto só uma caixa fixa de 60 × 18 px no ponto não corrigido, e não reserva os rótulos tocáveis (`g.rots`).
- Correção em bio3d.js, `desenharFichas`:
  1. Linha 225: calcular `const w = tw(t.s, o.s, o.w)`, a posição desenhada `xd`, `yd` (a mesma passada a `tx`) e reservar `ocup.push([o.a === 'left' ? xd : o.a === 'right' ? xd - w : xd - w / 2, yd - 9, w, 18])`.
  2. Antes do `g.fichas.sort`, reservar os rótulos visíveis: `(g.rots || []).forEach(x => { const a = g.anc[x.r.pc]; if (!a || !g.vis[x.r.pc]) return; const q = tela(g, a); if (q[2] > 1) return; ocup.push([q[0] - 8, q[1] - 12, tw(x.r.t, 12, 600) + 34, 24]); });`
  3. Krebs (cenas3d-atp-resp.js, linha 306) e Calvin (cenas3d-ferm-foto.js, linha 314): tirar os nomes das etapas da trilha das moléculas, com `r = R + (NAR ? 1.3 : 1.1)`, e no celular somar 0,4 ao `enquadrar` da `camera` (linha 302 e linha 310).

### B2. c4cam no celular: "estômato aberto/fechado" encostado na epiderme inferior (já conhecido)
- Rota: fatores/c4cam, captura fatores_c4cam_390_fin.png. Arquivo: cenas3d-relacao.js, linha 132: `B.mundo(g, gr, [0, -1.5, .9])` com `dy: dep ? 22 : 16, dx: dep ? 0 : -34`. O texto cai sobre a epiderme, sobre o CO₂ que entra e sobre a água que sai (que vai até y = -2,15).
- Correção: `B.texto(g, B.mundo(g, gr, [0, dep ? -1.5 : -2.6, .9]), Es.ab > .15 ? 'estômato aberto' : 'estômato fechado', { s: 11, w: 600, c: C.dim, dy: dep ? 22 : 0 })`. Depois, conferir no celular a distância até o título da folha seguinte.

### B3. Quimiossíntese no celular: bactéria pequena e "vermes tubícolas" sumindo (já conhecido)
- Rota: relacao/quimio, capturas relacao_quimio_390_fin.png e relacao_quimiof9_390.png. A bactéria ocupa pouco do palco (`bs = .6`), o nome "bactéria quimiossintetizante" só aparece no computador e o rótulo "vermes tubícolas" some, porque a âncora fica colada à de "fonte hidrotermal". A ficha "CO₂" ainda cobre "fundo do mar, sem luz".
- Correção em cenas3d-relacao.js:
  - Linha 334: `const bp = dep ? [2.4, .4, .3] : [0, 2.4, .3], bs = dep ? 1 : .9;`
  - Linha 347: `g.anc.fonte = add(boca, [-.4 * vs, dep ? -1.2 * vs : .4, .3]); g.anc.verme = [V[0] + (dep ? 2.0 : 1.5), fy + (dep ? 1.2 : .4) * vs, V[2] + .8];`
  - Linha 353: tirar o nome da condição `if (g.dep)`: `B.texto(g, B.mundo(g, g.bac, [0, g.dep ? -1.75 : 1.9, 0]), 'bactéria quimiossintetizante', { s: 13, w: 700, c: '#F2E4A0' });`
  - Linha 352: no celular, descer "fundo do mar, sem luz" para logo acima do chão (`fy + .6`), longe da trilha do CO₂.

### B4. Textos alinhados à esquerda saem pela borda: "espaço intermembranas" cortado no celular
- Rota: resp/cadeia, captura resp_cadeia_390_fin.png (aparece "espaço intern"). Arquivo: bio3d.js, linha 225: o `cl(...)` usa sempre `tw / 2` dos dois lados, como se o texto fosse centrado. Com `a: 'left'` (cenas3d-atp-resp.js, linhas 401 e 402), o texto passa da borda direita.
- Correção na linha 225: `const xd = o.a === 'left' ? cl(x, 8, Wd - 8 - w) : o.a === 'right' ? cl(x, 8 + w, Wd - 8) : cl(x, 8 + w / 2, Wd - 8 - w / 2);`, com `x = q[0] + (o.dx || 0)` e `w = tw(t.s, o.s, o.w)`. É a mesma linha de B1 e pode ser corrigida junto.

### B5. Fermentações no celular: sem "piruvato vira lactato/etanol" e sem "lactobacilos"
- Rotas: ferm/latica e ferm/alcoolica, capturas ferm_latica_390_fin.png e ferm_alcoolica_390_fin.png. No lado direito do arco aparece só o ponto da âncora, sem o texto. Na lática, "lactobacilos" também não aparece, mas no computador os dois aparecem. O texto do rótulo, que fica à direita do ponto, não cabe na borda.
- Correção em cenas3d-ferm-foto.js: na linha 121, `g.anc.reg = add(R, [dep ? 0 : -1.8, -1.0, .4]);` e, na linha 75, `g.anc.lacto = B.mundo(g, g.ctxB, dep ? [0, 1.3, 0] : [-.9, 1.3, 0]);`. O `dep` já existe em `animar`.

### B6. Krebs: o quadro "por glicose" conta só o ciclo, sem a entrada do piruvato
- Rota: resp/krebs. Arquivo: cenas3d-atp-resp.js, linhas 307 e 310: `['CO₂', c.co2, 4], ['NADH', c.nadh, 6]` sob o título `'por glicose'`. Por glicose, a respiração solta 6 CO₂, e o módulo (resp/saldo) conta 10 NADH, 2 da glicólise, 2 da entrada do piruvato e 6 do ciclo. Do jeito que está, o aluno pode decorar "4 CO₂ por glicose".
- Correção: na linha 310, `'por glicose'` passa a `'no ciclo, por glicose'`. Como opção, na peça CO₂ (linha 264), terminar com: "Contando a entrada do piruvato, saem 6 CO₂ por glicose."

### B7. Calvin: em cada volta, um carbono some sem explicação
- Rota: foto/calvin. Arquivo: cenas3d-ferm-foto.js, linha 298. Nas voltas 1 e 2, depois de "2 G3P (3 C)" (6 C), a cena mostra 3 C mais 2 C com a ficha `'5 C'` e segue para "RuBP refeita (5 C)". O carbono que sobra não aparece em lugar nenhum.
- Correção: na linha 298, trocar a ficha `'5 C'` por `'parte refaz a RuBP'`. Nas voltas 1 e 2, mostrar a terceira conta com a ficha `'1 C fica para o G3P'`: `[[3, 'parte refaz a RuBP'], [2], [volta === 2 ? 0 : 1, volta < 2 ? '1 C fica para o G3P' : '']]`.

## Contagem

M: 2. B: 7.
