# ROADMAP · LAB Ciência em movimento

Site estático (HTML + JS, sem build) com módulos de ciência em português, para o ensino médio e o ENEM.
Este arquivo é o plano vivo da equipe. Quem lidera é o PM; cada frente tem um dono e um arquivo de saída.

## Equipe

| Papel | O que faz | Onde escreve |
|---|---|---|
| Líder de equipe / PM | Planeja, distribui, revisa, integra, publica as prévias, sobe para o GitHub, chama a Nalu só em bloqueio ou conflito grave | `ROADMAP.md` |
| Engenheiro fullstack | Implementa módulos, 3D (three.js / React Three Fiber), testes com capturas | `site/<módulo>/` |
| Diretor de arte | Identidade visual, paleta, tipografia, estilo estético, regras de UI/UX | `docs/GUIA-DE-ESTILO.md` |
| Artista / gerente de assets | Ícones, sprites, fontes, efeitos visuais, materiais 3D, seguindo o guia | `site/assets/`, `docs/ASSETS.md` |
| Professor de Biologia (PhD, ensino médio e ENEM) | Revisa a ciência, o nível e a linguagem; liga cada módulo ao que o ENEM cobra | `docs/revisao-biologia/` |

## Regras de trabalho

- Cada pessoa da equipe só edita os arquivos da sua coluna "Onde escreve". Mudança em arquivo de outro dono vira pedido ao PM.
- O professor não edita o código: escreve as correções, e o engenheiro aplica.
- Nada de copiar imagens, código ou assets de terceiros. Tudo é feito por nós.
- Prévia do módulo Célula: sempre no mesmo link do Claude. Cópia na pasta da Nalu e no GitHub (`nalusqr/lab-ciencia`) a cada versão.
- A conversa "Criar novos módulos do Lab" cuida do módulo 06. Antes de mexer em arquivos comuns (`site/index.html`, `site/base.css`, abas de navegação), o PM combina com ela.

## Frentes

### 1. Módulo 05 Célula em 3D (React Three Fiber) · em andamento
- [x] Bibliotecas empacotadas num arquivo local: `site/celula/vendor/r3f.js` (React 19, three.js 0.187, R3F 9, drei 10). Funciona sem internet e sem build.
- [x] 8 células modeladas em 3D e 12 telas de detalhe das organelas, em corte.
- [ ] Testar em capturas (computador e celular), corrigir erros e desempenho.
- [ ] Aplicar o guia de estilo e a revisão de biologia.
- [ ] Publicar a prévia, salvar na pasta, enviar ao GitHub.

### 2. Guia de estilo (diretor de arte) · a começar
- [ ] Recomendar um estilo estético e explicar à Nalu por quê.
- [ ] Paleta, tipografia, escala de espaçamento, componentes de interface, regras para 3D e animação, acessibilidade.

### 3. Assets (artista) · depois do guia
- [ ] Ícones dos módulos e dos tipos de célula, num só desenho.
- [ ] Biblioteca de materiais 3D (membrana, organela, vidro) e efeitos.

### 4. Revisão de Biologia dos módulos 01 a 05 (professor) · a começar
- [ ] Erros científicos, simplificações que enganam, vocabulário.
- [ ] Ligação com as habilidades e os temas mais cobrados no ENEM.

### 5. Módulo 06 Morfofisiologia celular · na conversa "Criar novos módulos do Lab"
- [x] Combinado: a conversa do 06 escreve só em `site/morfofisiologia/` e aplica o "Campo escuro" dentro da própria página.
- [ ] PM: links do painel da Célula para o 06 (membrana `#membranas/mosaico`, núcleo `#nucleo/geral`, mitocôndria `#origem/mito`, cloroplasto `#origem/cloro`, bactéria `#tipos/proc`).
- [ ] PM, quando o 06 estiver pronto: card "Módulo 6, Morfofisiologia celular" em `site/index.html` (contador 5 → 6) e aba "Morfofisiologia" nos módulos 01 a 05.
- [ ] Revisão do professor antes de publicar.

### 6. Estilo "Campo escuro" escolhido pela Nalu (2026-11-14)
- [x] Guia em `docs/GUIA-DE-ESTILO.md`.
- [ ] Aplicar na Célula; depois em `site/base.css` e nos módulos 01 a 04.

## Escalar para a Nalu quando
- Duas frentes precisam do mesmo arquivo e não há acordo.
- Uma escolha muda o objetivo do site (público, estilo, escopo).
- Algo não pode ser desfeito.
