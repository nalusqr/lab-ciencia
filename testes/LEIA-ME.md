# Testes do LAB

`fumaca.js` é um teste de fumaça. Ele abre cada página por `file://`, como a usuária abre com duplo clique, e falha se aparecer erro de console, exceção na página ou arquivo que não carregou. Páginas testadas: início (a roda de matérias), biologia (a trilha), dna, tabela-periodica, moleculas, biomoleculas, celula, morfofisiologia, embriologia, histologia, taxonomia e virus.

Na Célula, o teste percorre pelo hash as 8 células e os 12 detalhes. Em cada um, confere que o canvas existe e que os pontos (`.hs`) ou rótulos (`.dl`) apareceram. Também abre `site/celula/fonte/teste-modelo.html` para validar o modelo do Blender.

Na Embriologia (canvas 2D), o teste percorre todas as rotas pela API da página (`window.LAB_EMBRIO.rotas` e `.ir`). Em cada uma, confere que não surgiu erro e que o canvas desenhou algo. Para rodar só ela: `node testes/fumaca.js embriologia`.

Na Histologia, que usa o mesmo motor, o teste faz o mesmo pela `window.LAB_HISTO` (`.rotas` e `.ir`), rota por rota, das 18 telas (tecidos, epitelial, conjuntivo, sangue, muscular e nervoso). Para rodar só ela: `node testes/fumaca.js histologia`.

Na Taxonomia, também com o mesmo motor, o teste percorre pela `window.LAB_TAXO` (`.rotas` e `.ir`) as 12 telas (história, categorias, espécie, nomes, sistemas, cladística e chave). Ela está na lista fixa do teste, então roda mesmo antes de entrar em `scripts/modulos.json`. Para rodar só ela: `node testes/fumaca.js taxonomia`.

Nos Vírus, também com o mesmo motor, o teste percorre pela `window.LAB_VIRUS` (`.rotas` e `.ir`) as 13 telas (natureza, estrutura, fagos, replicação, doenças e prevenção). O módulo está na lista fixa do teste, então roda mesmo antes de entrar em `scripts/modulos.json`. Para rodar só ele: `node testes/fumaca.js virus`.

## No container (Linux)

Usa o Playwright já instalado. Não instale outro.

```
cd /home/user/lab-ciencia
node testes/fumaca.js            # tudo (alguns minutos: o WebGL aqui é SwiftShader, na CPU)
node testes/fumaca.js celula     # só as páginas cujo nome contém "celula"
```

O teste sai com código 0 quando tudo passa e com 1 quando algo falha.

## No PC da usuária (Windows, Edge)

Precisa do Node.js instalado. O teste usa o Edge que já vem no Windows; não baixa navegador nenhum.

```
cd caminho\do\lab-ciencia
npm install --no-save playwright-core
set LAB_NAVEGADOR=msedge
node testes\fumaca.js
```

No PowerShell, troque a linha do `set` por `$env:LAB_NAVEGADOR="msedge"`. Com essa variável, o script usa `require('playwright-core')` e `chromium.launch({channel:'msedge'})`.

## Modelos do Blender

Depois de exportar ou alterar um `.glb` em `site/assets/modelos/`, rode `python3 scripts/glb2js.py` para gerar o `.glb.js`. Depois abra `site/celula/fonte/teste-modelo.html` com duplo clique. Para outro modelo, use `teste-modelo.html?modelo=nome`.

Para conferir se os `.glb.js` estão em dia, rode `python3 scripts/glb2js.py --verificar`.
