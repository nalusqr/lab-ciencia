# Revisão de Biologia · Citogenética (partes novas)

🔬 Taxon, 2026-11-15. Para 🏛️ Aurelius aplicar.
Revisado: `site/divisao-celular/cromossomos.js` (#cromossomos/estrutura, classificacao, cariotipo, homologos) e `site/divisao-celular/index.html` (#erros/aneuploidias, #erros/euploidias, título "Citogenética", seção "Alterações cromossômicas").
Base: o roteiro `docs/revisao-biologia/citogenetica-roteiro.md` e as fontes listadas nele (Amabis & Martho, Lopes & Rosso, Alberts, Thompson & Thompson).

## Resultado

**Não há erro científico.** Conferi os números (46/92, n = 23, grupos A a G, metacêntricos 1, 3, 16, 19, 20; acrocêntricos 13, 14, 15, 21, 22, Y; nenhum telocêntrico humano; espécies 8/14/20/38/46/48/62/64/78; mula 63; banana e melancia 33, batata 48, algodão 52, trigo e aveia 42, morango 56, zangão 16/32, triploidia humana 69), os cariótipos (47,XX,+21; 45,X; 47,XXY; 47,+18; 47,+13) e os desenhos:
- estrutura: braço p mais curto (centrômero em 0,36), cromátides-irmãs da mesma cor, contagem 1 → 1 → 2 cromossomos;
- cariótipo: cromossomos duplicados, 21 menor que 22, Y bem menor que o X, X materno e Y paterno em 46,XY;
- homólogos: gameta com um cromossomo materno e um paterno (sem sugerir que os conjuntos se separam por origem);
- euploidias: 3n × 2n + 1 (6 × 5) e a tabela de nomenclatura, com o ajuste da tetrassomia já aplicado.

## Correções obrigatórias (2, só de texto)

### 1. `cromossomos.js`, tópico `cariotipo`: "Pares 4 a 5", "Pares 19 a 20", "Pares 21 a 22"
Em grupos de dois cromossomos, "a" fica errado em português (e sugere um intervalo). O correto é "e". Isso vale para as fases (`ph`) e para o painel (`inf`).

Antes (fases):
```js
  ...GR.slice(0,7).map(([g,ns,s])=>[`Grupo ${g}`,`Pares ${ns[0]} a ${ns[ns.length-1]}: ${s}.`]),
```
Depois:
```js
  ...GR.slice(0,7).map(([g,ns,s])=>[`Grupo ${g}`,`Pares ${ns[0]} ${ns.length===2?'e':'a'} ${ns[ns.length-1]}: ${s}.`]),
```
Antes (`inf`):
```js
...GR.slice(0,7).map(([g,ns])=>[`Grupo ${g}`,`pares ${ns[0]} a ${ns[ns.length-1]}`]),
```
Depois:
```js
...GR.slice(0,7).map(([g,ns])=>[`Grupo ${g}`,`pares ${ns[0]} ${ns.length===2?'e':'a'} ${ns[ns.length-1]}`]),
```
Resultado: "Pares 4 e 5", "Pares 19 e 20", "Pares 21 e 22"; os demais continuam "1 a 3", "6 a 12", "13 a 15", "16 a 18".

### 2. `cromossomos.js`, tópico `cariotipo`, grupo E incompleto
O grupo A descreve os três cromossomos; o E só fala do 16, e o aluno pode concluir que o 17 e o 18 também são metacêntricos.

Antes:
```js
['E',[16,17,18],'pequenos; 16 metacêntrico']
```
Depois:
```js
['E',[16,17,18],'pequenos; 16 metacêntrico, 17 e 18 submetacêntricos']
```

## Opcionais (aplicar só se sobrar tempo; não bloqueiam a publicação)
- `cariotipo`, texto `d`: na classificação oficial (Denver/ISCN), o X fica no grupo C e o Y no grupo G; o desenho os põe à parte, o que é bom para a didática. Se quiser, acrescente ao fim do 2º parágrafo: "Na classificação oficial, o X entra no grupo C e o Y no grupo G; aqui eles aparecem à parte."
- `cromossomos.js`, linhas 3 e 4 (comentário): "ajustar ao roteiro do Taxon (...) quando chegar" já está desatualizado. Pode virar "conteúdo conforme o roteiro do Taxon (...)".
