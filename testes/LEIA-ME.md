# Testes do LAB

`fumaca.js` é um teste de fumaça. Ele abre cada página por `file://`, como a usuária abre com duplo clique, e falha se aparecer erro de console, exceção na página ou arquivo que não carregou. Páginas testadas: início (a roda de matérias), biologia (a trilha), dna, tabela-periodica, moleculas, biomoleculas, celula e morfofisiologia.

Na Célula, o teste percorre pelo hash as 8 células e os 12 detalhes. Em cada um, confere que o canvas existe e que os pontos (`.hs`) ou rótulos (`.dl`) apareceram. Também abre `site/celula/fonte/teste-modelo.html` para validar o modelo do Blender.

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
