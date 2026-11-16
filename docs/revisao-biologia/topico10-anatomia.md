# Tópico 10, Anatomia: revisão de biologia (Taxon e Sapien)

Escopo: 3D (anat3d-pecas.js e cenas3d-*.js), figuras de IA com hotspots (cenas-figura.js) e uma amostra de screenshots em /tmp/claude-0/t11/shots/.

## Corrigido
- Néfron 3D: a ficha "3. secreção de H⁺" e as bolinhas de H⁺ ficavam na alça néfrica. Agora ficam no túbulo distal. O texto do H⁺ cita os túbulos, sobretudo o distal.
- Néfron 3D, ducto coletor: troquei "urina pouca e escura" por "volta mais água ao sangue e a urina sai pouca e concentrada".
- Coração 3D, ventrículo direito: a parede fina passa a ser explicada pela pressão menor da circulação pulmonar, e não pelo "caminho curto".
- Coração 3D, miocárdio: troquei "sem cansar" por "de forma rítmica e involuntária".
- Digestório 3D, amido: a amilase do pâncreas continua a digestão no duodeno e as enzimas do intestino a terminam.
- Sinapse 3D, curare: o texto agora diz que ele age na junção entre nervo e músculo.
- Figura do olho: o hotspot da córnea ficava fora da imagem. Passou de [14, 50] para [16.5, 50].
- Nenhum "!", "·", "→", "↔", "~" nem código interno nos textos revisados.

## Figuras de IA
| Imagem | Situação | Hotspots |
|---|---|---|
| digestorio-absorcao-a | ok: vilosidades com vaso lácteo central e capilares, camadas musculares | ok |
| digestorio-absorcao-b | ok: borda em escova, junções, célula caliciforme | ok |
| nervoso-organizacao-a | **refazer** | ok depois do ajuste da córnea |
| nervoso-organizacao-b | ok: ordem pavilhão, canal, tímpano, ossículos, cóclea, nervo; canais semicirculares presentes | ok |
| locomotor-esqueleto-a | ok: contei cerca de 11 a 12 pares de costelas, com as flutuantes; braços um pouco curtos (as mãos chegam só ao quadril) | ok |
| locomotor-esqueleto-b | **refazer** | ok |

Motivos para refazer:
- nervoso-organizacao-a (olho): atrás do cristalino há uma faixa grossa de músculo estriado que ocupa toda a altura do olho e fica entre o cristalino e o humor vítreo, no caminho da luz. O corpo ciliar real é só um anel em volta do cristalino. A íris também aparece vista de frente dentro de um corte lateral.
- locomotor-esqueleto-b (osso longo): dois discos grandes de anéis concêntricos saem da parede da diáfise para dentro da cavidade medular, sem correspondência anatômica (parecem ósteons em escala gigante). O osso esponjoso também avança demais pela diáfise. Pedir corte longitudinal do fêmur com a cavidade medular livre na diáfise, ocupada só por medula amarela.

## Pendências de dev
- A rota nervoso/organizacao tem o título "Central, periférico e o arco reflexo", mas a figura padrão mostra o olho e a orelha. Ajustar o título ou mover a figura para uma rota de sentidos.
- Sinapse 3D, droga depressora: aparece só como "menos neurotransmissor liberado". É uma simplificação aceitável, mas o álcool age sobretudo reforçando o GABA. Pode virar uma nota no texto.
- Depois de refazer as duas imagens, conferir de novo as posições dos hotspots.

## Teste
`node testes/fumaca.js anatomia`: 17 ok, 0 falhas, 0 avisos.
