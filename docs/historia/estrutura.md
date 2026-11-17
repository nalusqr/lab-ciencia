# Estrutura da História (🧭 Atlas, 17/11/2026)

Base: os dois roteiros que a Nalu mandou em 17/11 05:29 UTC (`prompts-nalu-roteiro.md`).
- **Roteiro 1** ("História Geral e do Brasil", 51 blocos): define a linha cronológica e a lista de assuntos.
- **Roteiro 2** ("Volume 1": Grécia, Roma, feudalismo, Estados Nacionais, Absolutismo, Expansão Marítima, América espanhola, América inglesa e Povos africanos): é o conteúdo detalhado desses assuntos e tem prioridade onde os dois se sobrepõem.

Regras da Nalu:
- Ignorar narração e visual dos prompts, porque o visual já foi escolhido: colagem estilo Vox, ver `GUIA-DE-ESTILO-HISTORIA.md`.
- Manter a ordem cronológica e todos os assuntos citados.
- Pode adaptar e mesclar os dois prompts.
- Ela quer "começar do começo", ou seja, pela Pré-História.

Esta estrutura substitui a trilha de 6 blocos (`trilha.md`) como ordem de construção. Os temas de Ceará e Cariri da trilha antiga entram como tópicos extras no fim dos módulos do Brasil, se a Nalu confirmar.

## Módulos e tópicos

Cada tópico vira uma página de colagem com cerca de 6 a 9 etapas, como no piloto aprovado (`site/historia/piloto-vox.html`).

| Módulo | Tópicos (blocos do roteiro 1; módulos do roteiro 2) |
|---|---|
| 1 Pré-História e Antiguidade | 1 Pré-História (B1); 2 Mesopotâmia (B2); 3 Egito (B3, já tem piloto); 4 Persas, fenícios e hebreus (B3); 5 Grécia (B5; FA-M01); 6 Roma (B6; FA-M02); 7 Povos orientais: China, Índia e Japão (B7) |
| 2 Idade Média | 1 Alta Idade Média e reinos germânicos (B8); 2 Feudalismo (B9; FA-M03); 3 Islamismo (B4); 4 Reinos africanos: Gana, Mali e Songhai (FB-M04); 5 Cruzadas, renascimento comercial e crise do feudalismo (B10; FA-M03); 6 Renascimento (B11); 7 Reforma e Contrarreforma (B12) |
| 3 Idade Moderna | 1 Estados Nacionais (B13; FA-M04); 2 Expansão marítima e Grandes Navegações (B13, B21; FB-M01); 3 Absolutismo (B14; FA-M05); 4 Mercantilismo (B15); 5 América espanhola (FB-M02); 6 América inglesa (FB-M03); 7 Iluminismo (B16) |
| 4 Revoluções burguesas | Revolução Inglesa (B17), Americana (B18), Francesa (B19), Período Napoleônico (B20) |
| 5 Brasil Colônia | B22 a B29, mais Povos africanos no Brasil (FB-M04, diáspora) junto da Escravidão (B23) |
| 6 Brasil: do período joanino à Regência | B30 a B33 |
| 7 Indústria, capitalismo e imperialismo | B34 a B37 |
| 8 Guerras e revoluções do século XX | B38 a B43 |
| 9 Brasil Império e República | B44 a B51 |

## Formato do roteiro de cada tópico (para a programação ler direto)

Os roteiros vão em `docs/revisao-historia/mNN-tNN-tema.md`. Cada tópico tem:

1. **Título e subtítulo**, curtos.
2. **Etapas** (6 a 9). Cada etapa traz:
   - título de até 6 palavras;
   - texto do aluno de cerca de 90 a 140 palavras (pedido da Nalu em 17/11 06:31 UTC: explicações completas, no nível da Biologia), com 1 a 3 palavras-chave entre `==assim==`, que viram marca-texto na tela;
   - **palco**: o que a colagem mostra e faz, com as peças, o gesto da câmera e o que se desenha (região colorida no mapa, rota tracejada, círculo e seta numa foto, nota amarela, fita do tempo).
3. **Texto de estudo** (abaixo da colagem): explicação completa do tópico, de cerca de 900 a 1400 palavras, em seções com título; termina com "Resumo para revisar" (6 a 10 itens), "No ENEM" e "Nos vestibulares do Ceará (URCA)", ligando ao Ceará e ao Cariri quando houver ligação real. Público: preparação para ENEM e vestibulares, com foco inicial na URCA (Universidade Regional do Cariri).
4. **Fonte histórica**: um trecho curto parafraseado com referência, a pergunta "O que essa fonte mostra?" e a resposta.
4. **No ENEM**: 2 ou 3 frases sobre o que cai e as pegadinhas.
5. **Figuras**: no máximo 2 por tópico. Cada uma tem a descrição para gerar com IA, fiel à arqueologia e às fontes, ou indica uma figura já existente para reaproveitar.
6. **Mapa**: qual base de mapa usar (abaixo) e quais camadas animadas entram por cima.

Na tela não vão questões; o tópico é 100% explicativo, como pede o roteiro 2. Questões ficam para depois, se a Nalu quiser.

## Economia de créditos (pedido da Nalu: gastar pouco)

**Bases de mapa compartilhadas:** são poucas imagens grandes de mapa antigo, geradas uma vez e reaproveitadas com zoom e camadas SVG em vários tópicos.
- **Mediterrâneo e Oriente Próximo:** Mesopotâmia, Egito, Persas, Fenícia, Hebreus, Grécia, Roma, Islamismo, Cruzadas.
- **Mundo antigo e Ásia:** Pré-História e Povos orientais.
- **Europa:** Idade Média, Estados Nacionais, Reforma e Revoluções.
- **Atlântico, com África e Américas:** Navegações, reinos africanos, Américas e tráfico.
- **Brasil:** módulos 5, 6 e 9.

**Figuras:**
- Uma ou duas por tópico, em uma rodada.
- Refazer só em erro de fidelidade.
- Reaproveitar sempre que der.
- Custo estimado do módulo 1: cerca de 15 créditos, sendo 2 bases de mapa e cerca de 8 figuras.

## Fluxo por módulo (igual ao da Biologia)

1. 📜 Heródoto e 🪶 Tucídides escrevem os roteiros e cada um revisa o do outro.
2. Atlas gera as figuras e os mapas.
3. 🏛️ Aurelius, 🔥 Prometeu e 🎬 Martin programam a partir do motor do piloto.
4. Checagem automática.
5. Os professores revisam as telas.
6. Correções.
7. Testes e publicação (main, gh-pages e PC).

Quando um módulo termina, segue o próximo, como na noite de 16/11.
