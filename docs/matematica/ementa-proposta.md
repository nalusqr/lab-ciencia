# Matemática · proposta do 📐 Tales (15/11/2026)

Proposta para a Nalu aprovar antes de qualquer código. Segue a forma de trabalho do projeto: um tópico por vez, na ordem da ementa, com esteira (o roteiro do próximo é escrito enquanto o atual é programado).

## Time de Matemática

| Quem | Papel | Onde escreve |
|---|---|---|
| 📐 **Tales**, professor PhD de Matemática, líder do time | Ementa, roteiros, revisão matemática e ligação com o ENEM. Também programa (10+ anos de matemática computacional): escreve os "motores" de cálculo e simulação | `docs/revisao-matematica/`, `site/matematica/` |
| 🌀 **Hipátia**, professora sênior de Matemática | Divide os roteiros com o Tales e revisa o trabalho dele (e ele o dela). Foco em questões do ENEM, erros comuns e linguagem para o ensino médio | `docs/revisao-matematica/` |
| ⚙️ **Arquimedes**, engenheiro sênior de visualização matemática | Gráficos interativos, sliders, geometria em canvas/SVG e 3D (three.js), testes com capturas | `site/matematica/<tópico>/` |

O time de Matemática não cria estilo próprio: usa o guia "Campo escuro" do 🎨 Apolo, ícones da 🌈 Íris e combina com o ✨ Leo (pelo 🧭 Atlas) a entrada de Matemática na roda da página inicial.

## Ementa proposta (ordem de construção)

A ordem vai do que sustenta o resto para o que depende dele. Os marcados com ★ são os mais cobrados no ENEM.

1. **Números e operações**: frações, decimais, potências, raízes, notação científica, MMC/MDC.
2. **Razão, proporção e porcentagem** ★: regra de três simples e composta, escalas, aumentos e descontos sucessivos.
3. **Grandezas e medidas** ★: unidades, conversões, área, volume, capacidade, velocidade e densidade.
4. **Matemática financeira**: juros simples e compostos, comparação de planos de pagamento.
5. **Equações, inequações e sistemas**: 1º e 2º grau, problemas com texto.
6. **Funções** ★: leitura de gráficos, função afim e quadrática (com sliders para mexer nos coeficientes).
7. **Exponencial e logaritmo**: crescimento, meia-vida, escala Richter e pH.
8. **Sequências**: PA e PG.
9. **Geometria plana** ★: ângulos, triângulos, semelhança, teorema de Tales, Pitágoras, áreas.
10. **Trigonometria**: razões no triângulo retângulo, ciclo trigonométrico, funções periódicas.
11. **Geometria espacial** ★: prismas, cilindros, cones, esferas, planificações e volumes em 3D.
12. **Geometria analítica**: ponto, reta, distância e circunferência no plano cartesiano.
13. **Estatística** ★: média, mediana, moda, desvio padrão, leitura de tabelas e gráficos.
14. **Contagem e probabilidade** ★: princípio multiplicativo, arranjo, combinação, probabilidade.
15. **Matrizes e determinantes** (pouco cobrado no ENEM; fica por último).

## Como cada tópico vai ser

- Pasta `site/matematica/<tópico>/` com `index.html`, um `motor.js` e arquivos de cenas, no mesmo formato dos módulos de Biologia.
- Cada conceito tem uma cena interativa: o aluno mexe (arrasta um ponto, muda um valor) e vê o resultado mudar na hora.
- Cada tópico fecha com questões no estilo ENEM, com resolução passo a passo e os erros mais comuns.
- Prévia ao vivo no Claude a cada versão, como nos outros módulos.
