/* LAB, módulo Plantas e animais. Cenas do Animalia: A1 a A7.
   Código da equipe (Prometeu). Textos: roteiro do Taxon revisado pelo Sapien (docs/revisao-biologia/seres-vivos-roteiro.md).
   Os parágrafos do aluno e os cartões "No ENEM" entre as marcas TXT vêm do roteiro. */
'use strict';
{
  const ANI = '#E08A5A', NOTA = 'Desenho esquemático, fora de escala';
  const ECT = '#6FB1E8', MES = '#E5646B', END = '#F2C94C', CAV = '#1D2B4C', GUT = '#0B0F1C';
  const dtv = S => S.paused ? 0 : Math.min(.05, S.dt || .016);
  const modo = (id, t) => ({ t, on: S => { S.modo = id; S.msg = null; S.fl = null; }, pressed: S => S.modo === id });
  const toque = S => { const now = performance.now(), ok = now - (S.tapT || 0) > 200; S.tapT = now; return ok; };
  const flash = (S, k, i) => { S.fl = { k, i, t: performance.now() }; };
  const TXT = {};
  //TXT-INICIO
  TXT.A1 = {"d":"<p>Os animais são eucariontes <b>pluricelulares</b> e <b>heterótrofos por ingestão</b>: comem o alimento e o digerem dentro do corpo. Suas células não têm parede, e quase todos se movem em alguma fase da vida. Para comparar os filos (os grandes grupos de animais), os livros usam algumas <b>novidades evolutivas</b>, que aparecem como marcas no cladograma:</p><ol><li><b>Tecidos verdadeiros.</b> As <b>esponjas</b> (poríferos) têm células especializadas, mas não organizadas em tecidos. Todos os outros animais têm tecidos.</li><li><b>Simetria.</b> Os <b>cnidários</b> (águas-vivas, corais) têm simetria <b>radial</b>: o corpo pode ser cortado em metades iguais por vários planos, como uma pizza, o que serve bem a quem vive parado ou à deriva. Os demais têm simetria <b>bilateral</b>: um lado direito e um esquerdo, uma frente e um trás. Com ela vem a <b>cefalização</b>, a concentração de órgãos dos sentidos e de neurônios na cabeça, que vai à frente quando o animal se desloca.</li><li><b>Folhetos embrionários.</b> Os cnidários são <b>diblásticos</b> (ectoderme e endoderme). Os animais com simetria bilateral são <b>triblásticos</b>: têm também a <b>mesoderme</b>, que forma músculos, sangue, ossos e outros órgãos (ver Embriologia).</li><li><b>Celoma.</b> É uma cavidade cheia de líquido, <b>revestida por mesoderme</b>, entre o tubo digestório e a parede do corpo. Os <b>platelmintos</b> são <b>acelomados</b> (sem cavidade); os <b>nematódeos</b> são <b>pseudocelomados</b> (a cavidade existe, mas não é toda revestida por mesoderme); moluscos, anelídeos, artrópodes, equinodermos e cordados são <b>celomados</b>. O celoma dá espaço para os órgãos crescerem e se moverem e funciona como um esqueleto de líquido.</li><li><b>Tubo digestório completo.</b> Cnidários e platelmintos têm uma cavidade com <b>uma só abertura</b> (boca e \"ânus\" juntos). A partir dos nematódeos, há <b>boca e ânus</b> separados: o alimento passa num sentido só, e cada trecho do tubo se especializa.</li><li><b>Destino do blastóporo.</b> Nos <b>protostômios</b> (moluscos, anelídeos, artrópodes e outros), o blastóporo vira a <b>boca</b>; nos <b>deuterostômios</b> (equinodermos e cordados), vira o <b>ânus</b> (ver Embriologia). Por isso a estrela-do-mar é mais aparentada conosco do que a minhoca.</li><li><b>Segmentação</b> (ou metameria). Anelídeos, artrópodes e cordados têm o corpo em partes que se repetem, como os anéis da minhoca e as vértebras.</li></ol><p>Uma ressalva: a sequência \"acelomado, pseudocelomado, celomado\" é um <b>esquema para comparar planos de corpo</b>, não a ordem exata em que os grupos surgiram. Estudos de DNA mostram, por exemplo, que os nematódeos são parentes próximos dos artrópodes (os dois trocam de \"pele\" por muda) e que os platelmintos provavelmente descendem de ancestrais que tinham celoma e o perderam. Para a prova, vale o esquema dos livros.</p><p>Junto com essas novidades, os sistemas do corpo mudam. Animais pequenos e achatados fazem trocas gasosas por <b>difusão</b> pela superfície; os maiores precisam de órgãos respiratórios (<b>brânquias</b> na água; <b>traqueias</b> nos insetos; <b>pulmões</b>; ou a <b>pele úmida</b>, como na minhoca e nos anfíbios) e de um <b>sistema circulatório</b>, que pode ser <b>aberto</b> (o sangue sai dos vasos e banha os órgãos, como nos artrópodes e na maioria dos moluscos) ou <b>fechado</b> (o sangue corre sempre dentro de vasos, como nos anelídeos, nos polvos e nos vertebrados).</p>","enem":"A prova costuma trazer um <b>cladograma</b> ou uma <b>tabela</b> de características e pedir o grupo, ou dar um animal e pedir a novidade. Saiba a ordem: <b>tecidos</b> (todos menos esponjas), <b>simetria bilateral</b> com <b>mesoderme</b> e <b>cefalização</b> (de platelmintos em diante), <b>tubo digestório completo</b> (de nematódeos em diante), <b>celoma</b> (de moluscos em diante), e <b>deuterostômios</b> = equinodermos e cordados. Circulação <b>aberta</b> (artrópodes, maioria dos moluscos) versus <b>fechada</b> (anelídeos, cefalópodes, vertebrados) também é cobrada."};
  TXT.A2 = {"d":"<p>Os <b>poríferos</b> (esponjas) são animais <b>aquáticos</b>, quase todos marinhos, que vivem <b>fixos</b> em rochas e no fundo. O corpo é cheio de <b>poros</b>, por onde a água entra, e tem uma abertura maior no alto, o <b>ósculo</b>, por onde ela sai. A água é movimentada por células com flagelo, os <b>coanócitos</b>, que forram o interior e <b>capturam partículas de alimento</b> da água que passa: as esponjas são <b>filtradoras</b>. Elas não têm tecidos verdadeiros, órgãos, sistema nervoso nem tubo digestório; a digestão é dentro das células. O corpo é sustentado por pequenas peças de calcário ou sílica (as <b>espículas</b>) ou por uma rede de proteína; as esponjas de banho naturais eram esse esqueleto de proteína. As esponjas se reproduzem por <b>brotamento</b>, por fragmentação (têm grande poder de <b>regeneração</b>) e de forma sexuada.</p><p>Os <b>cnidários</b> são as <b>águas-vivas</b>, as <b>anêmonas</b>, os <b>corais</b> e a <b>hidra</b> (de água doce). Têm simetria <b>radial</b>, dois folhetos e uma <b>cavidade gastrovascular</b> com uma só abertura, rodeada de <b>tentáculos</b>. A marca do grupo são os <b>cnidócitos</b>, células com uma cápsula que dispara um filamento com veneno ao ser tocada; é a \"queimadura\" de água-viva na praia. Há duas formas de corpo: o <b>pólipo</b>, fixo, com a boca para cima (anêmona, coral, hidra), e a <b>medusa</b>, que nada, com a boca para baixo (água-viva). Em muitas espécies, as duas formas se alternam no ciclo de vida. Os <b>corais</b> formam colônias de pólipos que fabricam um esqueleto de <b>calcário</b>; ao longo de milhares de anos, esses esqueletos constroem os <b>recifes de coral</b>, que abrigam uma enorme biodiversidade marinha. Dentro dos pólipos vivem as <b>zooxantelas</b> (ver P1), algas que fazem fotossíntese e alimentam o coral. Quando a água <b>esquenta</b> demais, os corais expulsam as zooxantelas, ficam brancos (<b>branqueamento</b>) e, se o calor dura, morrem de fome. O aquecimento global e a acidificação dos oceanos ameaçam os recifes do mundo, inclusive os do litoral do Nordeste brasileiro e de Abrolhos, na Bahia.</p>","enem":"<b>Esponjas</b>: animais <b>filtradores</b>, <b>sem tecidos verdadeiros</b>, com <b>coanócitos</b>. <b>Cnidários</b>: <b>cnidócitos</b> (queimadura de água-viva), simetria radial, <b>pólipo e medusa</b>. O tema mais frequente é ambiental: <b>recifes de coral</b>, <b>zooxantelas</b> em mutualismo e o <b>branqueamento</b> causado pelo aquecimento da água."};
  TXT.A3 = {"d":"<p>Os <b>platelmintos</b> são vermes de <b>corpo achatado</b>, bilaterais, triblásticos e <b>acelomados</b>, com tubo digestório <b>incompleto</b> (sem ânus) ou nenhum. Há espécies de vida livre, como a <b>planária</b> de água doce, com olhos simples na cabeça e grande poder de <b>regeneração</b>, e muitas parasitas. Os <b>nematódeos</b> são vermes <b>cilíndricos</b>, pseudocelomados, com tubo digestório <b>completo</b>. Vivem no solo, na água e como parasitas de plantas e animais. Juntos, causam as verminoses mais importantes do Brasil, quase todas ligadas à <b>falta de saneamento</b>.</p><p><b>Esquistossomose</b> (<i>Schistosoma mansoni</i>, platelminto). Os ovos saem nas <b>fezes</b> de pessoas doentes; na água doce, eclode uma larva (o <b>miracídio</b>) que penetra num <b>caramujo</b> do gênero <i>Biomphalaria</i>, o <b>hospedeiro intermediário</b>. No caramujo, ela se multiplica e sai como <b>cercária</b>, uma larva com cauda que nada e <b>penetra pela pele</b> de quem entra na água (lagoas, riachos, valas). No ser humano, o <b>hospedeiro definitivo</b>, os vermes adultos vivem nas veias do intestino e do fígado; nos casos graves, o fígado é lesado e a barriga se enche de líquido (<b>barriga d'água</b>). Prevenção: <b>saneamento</b> (esgoto longe da água), evitar entrar em lagoas onde há caramujos, tratar os doentes.</p><p><b>Teníase e cisticercose</b> (<i>Taenia solium</i>, do porco, e <i>Taenia saginata</i>, do boi; platelmintos). A <b>teníase</b> é a <b>solitária</b>: um verme de metros de comprimento no intestino. Pega-se ao comer <b>carne crua ou malpassada</b> de porco ou boi com <b>cisticercos</b> (larvas). A pessoa com teníase elimina <b>ovos</b> nas fezes. A <b>cisticercose</b> é outra coisa: acontece quando alguém <b>engole os ovos</b> da <i>T. solium</i> (em água ou verduras contaminadas com fezes humanas, ou mãos sujas); as larvas se instalam nos músculos, nos olhos e no <b>cérebro</b> (neurocisticercose, uma causa importante de convulsões). Ou seja, na cisticercose o ser humano faz o papel que seria do porco. Prevenção: carne bem cozida e inspecionada, saneamento, lavar as mãos e as verduras.</p><p><b>Ascaridíase</b> (<i>Ascaris lumbricoides</i>, a <b>lombriga</b>, nematódeo). Pega-se ao engolir <b>ovos</b> em água, verduras ou mãos sujas de terra contaminada com fezes. A larva sai no intestino, passa pelo sangue até os <b>pulmões</b> (pode causar tosse), sobe até a garganta, é engolida e vira adulta no intestino. <b>Ancilostomose</b> (<i>Ancylostoma duodenale</i> e <i>Necator americanus</i>, o <b>amarelão</b>). As larvas vivem no <b>solo</b> contaminado com fezes e <b>penetram pela pele</b> dos pés descalços. Os vermes adultos se prendem à parede do intestino e sugam sangue, causando <b>anemia</b>, cansaço e palidez; é a doença do personagem <b>Jeca Tatu</b>, de Monteiro Lobato. Prevenção: <b>calçados</b>, saneamento. O <b>bicho-geográfico</b> é a larva de ancilostomídeos de cães e gatos que entra na pele de quem anda descalço ou senta em <b>areia</b> com fezes desses animais e cava \"caminhos\" na pele. A <b>filariose</b> ou <b>elefantíase</b> (<i>Wuchereria bancrofti</i>) é transmitida pelo pernilongo <b><i>Culex</i></b>; os vermes entopem os vasos linfáticos e causam inchaço enorme das pernas. Em 2024, a OMS reconheceu que o Brasil <b>eliminou a filariose linfática como problema de saúde pública</b>, graças ao tratamento em massa da população em risco, ao controle do mosquito e à vigilância; a vigilância continua, para evitar a volta da doença. A <b>oxiurose</b> (<i>Enterobius vermicularis</i>), comum em crianças, causa coceira anal, sobretudo à noite.</p>","enem":"Verminoses estão entre os temas de saúde mais cobrados. Saiba a <b>forma de contágio</b> de cada uma, porque é ela que indica a prevenção: <b>esquistossomose</b> pela pele na água com <b>caramujos</b> (hospedeiro intermediário); <b>teníase</b> por <b>carne malpassada</b>; <b>cisticercose</b> por <b>ovos</b> ingeridos (não pela carne); <b>ascaridíase</b> por <b>ovos</b> ingeridos; <b>amarelão</b> por larvas que entram pelos <b>pés descalços</b>, com <b>anemia</b>. A medida que corta mais ciclos é o <b>saneamento básico</b>."};
  TXT.A4 = {"d":"<p>Os <b>moluscos</b> têm corpo mole, não segmentado, com três partes: a <b>cabeça</b>, o <b>pé</b> musculoso e a <b>massa visceral</b>, coberta por uma dobra de pele, o <b>manto</b>, que em muitos produz uma <b>concha de calcário</b>. Muitos raspam o alimento com a <b>rádula</b>, uma \"língua\" com dentinhos. Vivem no mar, na água doce e em terra úmida. Os principais grupos são os <b>gastrópodes</b> (caramujos, caracóis e lesmas, com uma concha em espiral ou sem concha), os <b>bivalves</b> (mexilhões, ostras e mariscos, com duas valvas e sem rádula) e os <b>cefalópodes</b> (polvos e lulas, com os tentáculos ligados à cabeça). Os <b>bivalves</b> são <b>filtradores</b>: passam muita água pelas brânquias e acumulam o que nela houver, de toxinas da maré vermelha (ver P1) a metais pesados e bactérias do esgoto; por isso são usados para monitorar a poluição da água e não devem ser colhidos em praias poluídas. Os <b>cefalópodes</b> são os invertebrados com sistema nervoso mais desenvolvido, olhos complexos e circulação <b>fechada</b>; os demais moluscos têm circulação <b>aberta</b>. O caramujo <i>Biomphalaria</i> é o hospedeiro intermediário da esquistossomose (ver A3), e o <b>caramujo-africano</b> (<i>Achatina fulica</i>), trazido para criação e solto, virou praga em cidades brasileiras.</p><p>Os <b>anelídeos</b> têm o corpo dividido em <b>anéis</b> (segmentos ou metâmeros), repetidos por fora e por dentro, com <b>celoma</b> em cada segmento. São os <b>oligoquetos</b> (minhocas), os <b>poliquetos</b> (vermes marinhos com cerdas) e os <b>hirudíneos</b> (sanguessugas). Têm circulação <b>fechada</b>, com sangue vermelho de <b>hemoglobina</b>. A <b>minhoca</b> respira pela <b>pele</b>, que precisa estar sempre úmida (por isso ela sai do solo encharcado depois da chuva). É <b>hermafrodita</b>, mas a fecundação é <b>cruzada</b>: duas minhocas trocam espermatozoides. Ao cavar túneis e comer terra, a minhoca <b>areja</b> o solo, facilita a entrada de água e raízes e deixa fezes ricas em nutrientes (o <b>húmus</b>); é usada na <b>compostagem</b> de lixo orgânico (minhocário). As <b>sanguessugas</b> produzem uma substância anticoagulante, a <b>hirudina</b>, e ainda são usadas em alguns tratamentos médicos.</p>","enem":"A <b>minhoca</b> é a estrela: <b>aerar</b> o solo, formar <b>húmus</b> e ajudar na <b>compostagem</b>; respiração <b>cutânea</b> (pele úmida); hermafrodita com <b>fecundação cruzada</b>. Dos moluscos, caem os <b>bivalves filtradores</b> que <b>acumulam poluentes</b> e toxinas (por isso servem como bioindicadores e trazem risco ao consumo), o caramujo da esquistossomose e o caramujo-africano como espécie invasora. Anelídeos têm circulação <b>fechada</b>; a maioria dos moluscos, <b>aberta</b>."};
  TXT.A5 = {"d":"<p>Os <b>artrópodes</b> são o maior grupo de animais: só os <b>insetos</b> somam cerca de <b>1 milhão de espécies descritas</b>, cerca de metade de todas as espécies conhecidas. A marca do grupo é o <b>exoesqueleto</b> de <b>quitina</b>, uma armadura externa que protege, evita a perda de água e serve de apoio para os músculos, e as <b>patas articuladas</b> (artro = articulação; podos = pés). O corpo é <b>segmentado</b>, a circulação é <b>aberta</b> e o sistema nervoso tem um \"cérebro\" e um cordão nervoso <b>ventral</b>. Como o exoesqueleto não cresce, o artrópode precisa <b>trocar de casca</b> de tempos em tempos: é a <b>muda</b> (ou ecdise), quando o animal fica mole e vulnerável até o novo exoesqueleto endurecer.</p><p>Os grupos se reconhecem por patas, antenas e partes do corpo. Os <b>insetos</b> têm o corpo em <b>cabeça, tórax e abdome</b>, <b>três pares de patas</b>, <b>um par de antenas</b> e, muitos, <b>asas</b>; respiram por <b>traqueias</b>, tubos que levam o ar direto às células (por isso o sangue deles quase não transporta oxigênio), e excretam <b>ácido úrico</b> pelos <b>túbulos de Malpighi</b>, o que economiza água. Os <b>aracnídeos</b> (aranhas, escorpiões, carrapatos e ácaros) têm <b>cefalotórax e abdome</b>, <b>quatro pares de patas</b> e <b>nenhuma antena</b>; as aranhas e os escorpiões são predadores com veneno. Os <b>crustáceos</b> (camarões, caranguejos, siris, lagostas) têm <b>dois pares de antenas</b> e respiram por <b>brânquias</b>; quase todos são aquáticos, mas o <b>tatuzinho-de-jardim</b> é um crustáceo terrestre. Os <b>quilópodes</b> (lacraias, um par de patas por segmento, venenosas) e os <b>diplópodes</b> (piolhos-de-cobra, dois pares por segmento, inofensivos) completam a lista.</p><p>Muitos insetos passam por <b>metamorfose</b>. Nos <b>ametábolos</b> (como a traça-dos-livros), o filhote já nasce parecido com o adulto. Nos <b>hemimetábolos</b> (gafanhoto, barata, <b>barbeiro</b>), do ovo sai uma <b>ninfa</b>, parecida com o adulto mas sem asas, que cresce por mudas. Nos <b>holometábolos</b> (borboletas, moscas, besouros, abelhas e <b>mosquitos</b>), a metamorfose é completa: <b>ovo, larva, pupa e adulto</b>, com formas totalmente diferentes. O <i>Aedes aegypti</i>, vetor da dengue, da zika e da chikungunya (ver Vírus), põe ovos na parede de recipientes com <b>água parada e limpa</b>; os ovos resistem secos por <b>mais de um ano</b>; a <b>larva</b> e a <b>pupa</b> vivem na água; e o adulto sai em cerca de <b>7 a 10 dias</b>. Por isso <b>eliminar criadouros</b> (e esfregar as paredes dos recipientes) é a medida mais eficaz: corta o ciclo na fase aquática. Os insetos também são <b>polinizadores</b> (abelhas, borboletas), <b>decompositores</b> (besouros, larvas de moscas), <b>pragas</b> agrícolas e alvo de <b>controle biológico</b>, como o uso de vespas que parasitam lagartas nas plantações. Escorpiões, como o escorpião-amarelo (<i>Tityus serrulatus</i>), se espalham em cidades com lixo e entulho, onde encontram baratas para comer, e causam muitos acidentes.</p>","enem":"Saiba separar <b>inseto</b> (3 pares de patas, 1 par de antenas, corpo em cabeça, tórax e abdome) de <b>aracnídeo</b> (4 pares, sem antenas): <b>aranha, escorpião e carrapato não são insetos</b>. <b>Exoesqueleto de quitina</b> explica a <b>muda</b>. A <b>metamorfose completa</b> do mosquito, com <b>larva e pupa na água</b>, explica por que combater a dengue é <b>eliminar criadouros</b> de água parada. <b>Traqueias</b> e <b>ácido úrico</b> são adaptações à vida em terra. Polinização e <b>controle biológico</b> com insetos aparecem em questões de agricultura."};
  TXT.A6 = {"d":"<p>Os <b>equinodermos</b> (estrelas-do-mar, ouriços, pepinos-do-mar, bolachas-da-praia) são <b>exclusivamente marinhos</b>. Têm a pele com espinhos e um <b>endoesqueleto</b> de placas de calcário logo abaixo dela. O adulto tem simetria <b>radial</b>, quase sempre em cinco partes, mas a <b>larva</b> é <b>bilateral</b>, sinal de que descendem de ancestrais bilaterais. A novidade do grupo é o <b>sistema ambulacral</b>: canais cheios de água do mar que terminam em centenas de <b>pés ambulacrais</b>, pequenos tubos com ventosas usados para andar, se prender e até abrir conchas. As estrelas-do-mar têm grande poder de <b>regeneração</b>. Equinodermos e cordados são <b>deuterostômios</b> (ver A1).</p><p>Os <b>cordados</b> têm, pelo menos no embrião, quatro características: a <b>notocorda</b>, um bastão flexível nas costas que sustenta o corpo; o <b>tubo nervoso dorsal</b>, oco, acima da notocorda (nos vertebrados, ele vira o encéfalo e a medula espinal); as <b>fendas faríngeas</b>, aberturas na garganta (nos peixes, viram as brânquias; em nós, aparecem só no embrião e originam partes do ouvido e da garganta); e uma <b>cauda pós-anal</b>, que continua depois do ânus. Há cordados sem crânio nem coluna, os <b>protocordados</b>: o <b>anfioxo</b>, um animalzinho marinho que enterra o corpo na areia e mantém as quatro características a vida toda, e as <b>ascídias</b>, cuja larva nada e tem as quatro características, mas o adulto vive fixo e perde a notocorda, a cauda e o tubo nervoso, ficando só com as fendas faríngeas, que usa para filtrar a água. Os <b>vertebrados</b> têm <b>crânio</b> e, em quase todos, <b>coluna vertebral</b>, que substitui a notocorda.</p><p>Os primeiros vertebrados viviam na água e não tinham mandíbula; os <b>ágnatos</b> atuais são as <b>lampreias</b> e as feiticeiras. Os demais têm <b>mandíbula</b>, que permite morder e caçar presas maiores. Os <b>peixes cartilaginosos</b> (tubarões e raias) têm esqueleto de <b>cartilagem</b>, fendas branquiais visíveis, <b>escamas</b> que parecem dentinhos e <b>não têm bexiga natatória</b> (o fígado cheio de óleo ajuda a flutuar). Os <b>peixes ósseos</b> (a grande maioria: tilápia, sardinha, pirarucu) têm esqueleto de <b>osso</b>, uma tampa sobre as brânquias (o <b>opérculo</b>) e a <b>bexiga natatória</b>, uma bolsa de gás que ajusta a flutuação. Peixes respiram por <b>brânquias</b> e têm coração com <b>duas cavidades</b> (um átrio e um ventrículo), que só recebe sangue pobre em oxigênio. Os peixes têm a <b>linha lateral</b>, um órgão que sente vibrações na água. O controle de água e sais é diferente conforme o ambiente: o <b>peixe de água doce</b> ganha água por osmose sem parar, por isso <b>não bebe</b> água e faz <b>muita urina diluída</b>; o <b>peixe ósseo marinho</b> perde água para o mar salgado, por isso <b>bebe água do mar</b>, faz <b>pouca urina</b> e elimina o sal pelas brânquias. Os tubarões guardam <b>ureia</b> no sangue, o que deixa o corpo quase tão concentrado quanto o mar.</p>","enem":"As <b>quatro características dos cordados</b> (notocorda, tubo nervoso dorsal, fendas faríngeas, cauda pós-anal) caem com frequência, às vezes com a pergunta \"quais aparecem no embrião humano?\" (todas). Equinodermos são <b>deuterostômios</b>, como nós, apesar da simetria radial no adulto. Nos peixes, caem a <b>bexiga natatória</b> (ósseos) e a <b>osmorregulação</b>: peixe de <b>água doce</b> não bebe água e faz <b>urina abundante e diluída</b>; peixe <b>marinho</b> bebe água do mar e <b>elimina sal pelas brânquias</b>."};
  TXT.A7 = {"d":"<p>Os <b>anfíbios</b> (sapos, rãs, pererecas, salamandras e cobras-cegas) foram os primeiros vertebrados a viver em terra firme, mas <b>não se livraram da água</b>. A maioria tem <b>fecundação externa</b> e põe <b>ovos sem casca</b> na água ou em lugares muito úmidos. Do ovo sai o <b>girino</b>, que vive na água, respira por <b>brânquias</b> e tem cauda; por <b>metamorfose</b>, ele perde a cauda e as brânquias, ganha patas e <b>pulmões</b> e vira adulto. O adulto respira pelos pulmões, que são simples, e também pela <b>pele</b>, fina, <b>úmida</b> e cheia de vasos (<b>respiração cutânea</b>). Por isso os anfíbios vivem perto da água ou em locais úmidos, e por isso também são muito <b>sensíveis à poluição</b> e a mudanças no ambiente: servem como <b>bioindicadores</b>. Hoje, cerca de <b>41% das espécies</b> de anfíbios estão ameaçadas, sobretudo por mudanças climáticas, perda de habitat e doenças, como a causada pelo fungo <i>Batrachochytrium</i> (ver F1). As glândulas da pele produzem substâncias tóxicas contra predadores; o sapo <b>não \"espirra\" veneno</b>, ele só libera o veneno se for apertado.</p><p>Os <b>répteis</b> (lagartos, cobras, tartarugas, jacarés) conquistaram de vez o ambiente seco. A pele é <b>seca</b> e coberta de <b>escamas de queratina</b>, que quase não perdem água; a respiração é só <b>pulmonar</b>; a <b>fecundação é interna</b>; e eles põem o <b>ovo amniótico</b>, com <b>casca</b> e membranas que protegem o embrião, guardam água e alimento e recolhem as excretas (âmnio, córion, alantoide e saco vitelino: ver Embriologia). Com esse ovo, a reprodução <b>deixou de depender da água</b>. Os répteis são <b>ectotérmicos</b> (de \"sangue frio\"): a temperatura do corpo depende do ambiente, por isso tomam sol para se aquecer. Excretam <b>ácido úrico</b>, que gasta pouca água.</p><p>As <b>aves</b> descendem de <b>dinossauros</b> e são os parentes vivos mais próximos dos jacarés (ver o cladograma da Taxonomia). Só elas têm <b>penas</b>. Para voar, têm <b>ossos ocos</b> (pneumáticos), <b>sacos aéreos</b> ligados aos pulmões, que mantêm um fluxo contínuo de ar, <b>bico sem dentes</b>, e não têm bexiga urinária (excretam <b>ácido úrico</b>, como os répteis). Todas põem <b>ovos com casca</b>. Os <b>mamíferos</b> têm <b>pelos</b> e <b>glândulas mamárias</b>, que produzem o leite que alimenta os filhotes, e um músculo, o <b>diafragma</b>, que ajuda na respiração. Há três grupos: os <b>monotremados</b> (ornitorrinco e équidnas, que põem ovos), os <b>marsupiais</b> (como o <b>gambá</b>, ou saruê, e o canguru, cujos filhotes nascem muito pequenos e terminam o desenvolvimento numa bolsa, mamando) e os <b>placentários</b> (a maioria, com o filhote nutrido pela <b>placenta</b> até nascer: ver Embriologia). Aves e mamíferos são <b>endotérmicos</b> (de \"sangue quente\"): produzem calor e mantêm a temperatura do corpo <b>constante</b>, o que gasta muita energia, mas permite viver ativo no frio e à noite.</p><p>Duas tendências atravessam os vertebrados. A <b>circulação</b>: nos peixes, o coração tem <b>duas cavidades</b> e o sangue passa uma só vez por ele em cada volta (circulação <b>simples</b>); nos anfíbios, há <b>três cavidades</b> (dois átrios e um ventrículo), a circulação é <b>dupla</b> (vai ao pulmão e volta ao coração antes de ir ao corpo), mas o sangue rico e o pobre em oxigênio <b>se misturam</b> no ventrículo (circulação <b>incompleta</b>); nos répteis, o ventrículo tem uma divisão parcial e a mistura é menor (os jacarés já têm quatro cavidades); nas aves e nos mamíferos, o coração tem <b>quatro cavidades</b>, e o sangue rico em oxigênio <b>não se mistura</b> com o pobre (circulação <b>dupla e completa</b>), o que sustenta o metabolismo alto da endotermia. E a <b>excreção</b>: <b>amônia</b>, muito tóxica e que precisa de muita água para ser eliminada, em peixes ósseos e girinos; <b>ureia</b>, menos tóxica, em mamíferos, anfíbios adultos e tubarões; <b>ácido úrico</b>, quase insolúvel, que sai como uma pasta com pouquíssima água, em répteis, aves e insetos, que põem ovos com casca, onde as excretas ficam presas até o filhote nascer.</p>","enem":"A sequência <b>água para terra</b> é das mais cobradas: <b>anfíbios</b> dependem da água para a reprodução (ovo sem casca, girino) e respiram também pela <b>pele úmida</b> (por isso são bioindicadores); <b>répteis</b> se libertam da água com o <b>ovo amniótico</b> e a pele de <b>queratina</b>; <b>aves</b> e <b>mamíferos</b> são <b>endotérmicos</b>, com coração de <b>quatro cavidades</b> e circulação <b>dupla e completa</b>. Relacione a excreta ao ambiente: <b>amônia</b> na água, <b>ureia</b> em mamíferos, <b>ácido úrico</b> em quem põe ovo com casca e precisa economizar água. Pegadinhas: <b>baleia e morcego são mamíferos</b>, <b>pinguim é ave</b>, <b>cobra-cega é anfíbio</b>."};
  //TXT-FIM

  // ---------- ajudantes ----------
  function chips(S, list, x, y, w, cols, h, pre, o = {}) {
    const g = 8, cw = (w - (cols - 1) * g) / cols, fs = NAR ? 12 : 13;
    list.forEach((s, i) => {
      const cx = x + (i % cols) * (cw + g), cy = y + Math.floor(i / cols) * (h + g);
      const fl = S.fl && S.fl.k === pre && S.fl.i === i && performance.now() - S.fl.t < 700, ox = fl ? Math.sin((performance.now() - S.fl.t) / 25) * 4 : 0;
      const on = o.on && o.on(i), dn = o.dn && o.dn(i), cor = o.cor || ANI;
      rr(cx + ox, cy, cw, h, 8, on ? rgba(cor, .25) : 'rgba(19,26,43,.94)', fl ? C.erro : dn ? C.ok : cor, fl || on ? 2.2 : 1.3);
      const th = wrapTx(s, 0, 0, cw - 10, { s: fs, w: 600, lh: fs + 3, dry: true });
      wrapTx(s, cx + ox + cw / 2, cy + h / 2 - th / 2 + (fs + 3) / 2, cw - 10, { s: fs, w: 600, lh: fs + 3, c: C.txt });
      hitR(cx, cy, cw, h, pre + i);
    });
    return Math.ceil(list.length / cols) * (h + g) - g;
  }
  const idTap = (S, x, y) => { if (!toque(S)) return null; const h = hitAt(x, y); return typeof h === 'string' ? h : null; };
  // texto centrado verticalmente em y, com quebra
  function ctx(s, x, y, maxw, o = {}) { const fs = o.s || (NAR ? 12 : 13), lh = fs + 3, th = wrapTx(s, 0, 0, maxw, { s: fs, w: o.w || 600, lh, dry: true }); wrapTx(s, x, y - th / 2 + lh / 2, maxw, Object.assign({ s: fs, w: 600, lh, c: C.txt }, o)); return th; }
  const ic = (id, txt) => (cx, cy, w, h, pl) => {
    const s = Math.min(h - 8, 46); bicho(id, cx - w / 2 + s / 2 + 6, cy, s, { c: C.txt });
    ctx(txt, cx + s / 2 + 4, cy, w - s - 20, { s: 12 });
  };
  function cartas(B, S, A, n, ch3, cols, ch) {
    cols = cols || (NAR ? 2 : 4); ch = ch || (NAR ? 40 : 46); const g = NAR ? 6 : 8, rows = Math.ceil(n / cols), ay0 = A.y0 + rows * (ch + g) + 4, na = B.alvos.length;
    B.draw(S, { x0: A.x0, y0: A.y0, x1: A.x1, y1: A.y1 }, {
      cols, cartaH: ch, slotH: NAR ? 30 : 34,
      alvoRect: k => { const rw = (A.w - (na - 1) * 10) / na; return { x: A.x0 + k * (rw + 10), y: ay0, w: rw, h: A.y1 - ay0 }; }
    });
    cap(B.msg(S) || ch3);
  }
  function arrTap(B, S, x, y) { return B.tap(x, y, S); }

  // quiz de um cartão por vez: itens { t, id, k, x, dica }; ops = rótulos das respostas
  function quiz(cfg) {
    const nm = cfg.nome, st = S => S[nm] || (S[nm] = { i: 0, ok: 0, res: false, err: false, msg: null });
    return {
      zera(S) { S[nm] = null; st(S); },
      msg: S => st(S).msg,
      tap(x, y, S) {
        const b = st(S), h = hitAt(x, y); if (typeof h !== 'string' || !h.startsWith(nm + ':')) return false;
        if (!toque(S)) return true; const [k, v] = h.slice(nm.length + 1).split('='), n = +v, it = cfg.itens[b.i];
        if (k === 'n') { if (b.res) { b.i++; b.res = false; b.err = false; b.msg = null; } return true; }
        if (k === 'r') { b.i = 0; b.ok = 0; b.res = false; b.err = false; b.msg = null; return true; }
        if (!it || b.res) return true;
        if (n === it.k) { b.res = true; if (!b.err) b.ok++; b.msg = '<b>Certo.</b> ' + it.x; if (b.i === cfg.itens.length - 1) b.msg += ' ' + cfg.fim(b.ok, cfg.itens.length); }
        else { b.err = true; flash(S, nm + ':o=', n); b.msg = '<b>Ainda não.</b> ' + (it.dica || 'Pense nas características do grupo.'); }
        return true;
      },
      draw(S, A, ch3) {
        const b = st(S), it = cfg.itens[b.i], fim = b.res && b.i === cfg.itens.length - 1, n = cfg.itens.length;
        const ph = NAR ? 112 : Math.min(150, A.h * .34); panel(A.x0, A.y0, A.w, ph);
        mtx(`${Math.min(b.i + 1, n)} de ${n}`, A.x1 - 10, A.y0 + 14, { s: 12, a: 'right', c: C.dim });
        if (it) {
          const s = ph - 28; if (it.id && BICHOS[it.id]) bicho(it.id, A.x0 + s / 2 + 18, A.y0 + ph / 2 + 2, s, { c: C.txt });
          const tx0 = it.id && BICHOS[it.id] ? A.x0 + s + 36 : A.x0 + 18;
          wrapTx(it.t, tx0, A.y0 + ph / 2 - 6, A.x1 - tx0 - 40, { s: NAR ? 16 : 19, w: 700, f: FH, lh: 24, c: C.txt, a: 'left' });
        }
        const oy = A.y0 + ph + 12, cols = NAR ? 2 : cfg.ops.length, h = NAR ? 34 : 40;
        chips(S, cfg.ops, A.x0, oy, A.w, cols, h, nm + ':o=', { cor: ANI });
        const hh = Math.ceil(cfg.ops.length / cols) * (h + 8) + oy + 4;
        if (b.res) { const bw = Math.min(200, A.w), by = Math.min(hh + 4, A.y1 - 40); btn(A.cx - bw / 2, by, bw, 36, fim ? 'Recomeçar' : 'Próximo', C.ok, nm + (fim ? ':r=0' : ':n=0'), { on: true }); }
        cap(b.msg || ch3);
      }
    };
  }

  // ---------- ícones só deste módulo (unidades de -1 a 1; cabeça à direita) ----------
  {
    const P = () => X.beginPath(), FS = () => { X.fill(); X.stroke(); }, ST = () => X.stroke();
    const E = (x, y, rx, ry, r = 0) => { P(); X.ellipse(x, y, rx, ry, r, 0, TAU); FS(); };
    const L = (...p) => { P(); X.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) X.lineTo(p[i], p[i + 1]); ST(); };
    const Q = (x0, y0, qx, qy, x1, y1) => { P(); X.moveTo(x0, y0); X.quadraticCurveTo(qx, qy, x1, y1); ST(); };
    const SH = (...p) => { P(); X.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) X.lineTo(p[i], p[i + 1]); X.closePath(); FS(); };
    const par = (xs, dy, ox) => xs.forEach((x, i) => { L(x, 0, x + ox * (i - 1), -dy); L(x, 0, x + ox * (i - 1), dy); });
    const seg = (n, x0, dx, ry, rx) => { for (let i = 0; i < n; i++) E(x0 + i * dx, 0, rx, ry); };
    Object.assign(BICHOS, {
      formiga() { par([-.15, -.02, .11], .62, .2); Q(.55, -.08, .8, -.5, .95, -.28); Q(.55, .08, .8, .5, .95, .28); E(-.6, 0, .3, .2); E(-.05, 0, .2, .14); E(.42, 0, .19, .16); },
      camarao() { for (let i = 2; i < 6; i++) L(-.55 + i * .2, .1, -.6 + i * .2, .45); for (let i = 0; i < 6; i++) E(-.55 + i * .2, -.2 * Math.sin(i / 5 * PI) + .12, .2, .17 - i * .006); SH(-.72, .25, -.97, .08, -.97, .4); Q(.5, -.1, .85, -.65, 1, -.5); Q(.5, -.02, .9, -.3, 1, -.1); },
      lacraia() { for (let i = 0; i < 8; i++) { const x = -.8 + i * .2; L(x, 0, x - .1, -.5); L(x, 0, x - .1, .5); } seg(8, -.8, .2, .12, .14); E(.92, 0, .12, .11); Q(1, -.05, 1.05, -.3, .9, -.5); },
      piolhocobra() { for (let i = 0; i < 7; i++) { const x = -.75 + i * .22; L(x - .03, .1, x - .08, .45); L(x + .04, .1, x + .02, .45); } seg(7, -.75, .22, .2, .15); E(.85, 0, .12, .13); },
      barata() { par([-.2, 0, .2], .7, .22); E(0, 0, .55, .36); E(.62, 0, .15, .14); Q(.7, -.08, 1, -.4, .9, -.85); Q(.7, .08, 1, .4, .9, .85); },
      barbeiro() { par([-.2, 0, .2], .55, .2); E(-.15, 0, .6, .2); E(.55, 0, .2, .12); L(.7, .05, .95, .22); L(.62, -.1, .85, -.4); },
      escorpiao() { par([-.25, -.1, .05, .2], .55, .12); E(-.1, 0, .38, .2); L(.25, -.1, .55, -.3); E(.68, -.36, .2, .12, -.5); L(.25, .1, .55, .3); E(.68, .36, .2, .12, .5); Q(-.45, 0, -.95, -.05, -.85, -.65); Q(-.85, -.65, -.7, -.9, -.45, -.8); },
      tatuzinho() { for (let i = 0; i < 7; i++) L(-.5 + i * .16, .3, -.55 + i * .16, .58); E(0, 0, .62, .38); for (let i = -2; i <= 2; i++) L(i * .2, -.36, i * .2, .36); E(.65, .05, .13, .14); Q(.74, -.05, .95, -.4, 1, -.25); Q(.74, 0, 1, -.1, 1.05, 0); },
      carrapato() { for (let i = 0; i < 4; i++) { L(-.2 + i * .16, .05, -.3 + i * .22, -.6); L(-.2 + i * .16, .05, -.3 + i * .22, .7); } E(0, .05, .38, .34); E(.42, .05, .1, .1); },
      caramujo() { E(-.05, .5, .8, .17); E(-.15, -.05, .46, .46); E(-.15, -.05, .26, .26); E(-.15, -.05, .08, .08); E(.72, .38, .14, .12); L(.76, .3, .86, -.15); L(.66, .3, .66, -.18); },
      lesma() { E(-.1, .45, .82, .22); E(.7, .3, .16, .16); L(.76, .2, .88, -.25); L(.66, .2, .68, -.25); },
      ostra() { E(0, 0, .62, .62, .3); E(0, .05, .44, .44, .3); L(-.3, .3, .3, -.3); L(-.1, .5, .35, .0); },
      mexilhao() { E(0, 0, .8, .5, -.3); E(0, 0, .55, .33, -.3); L(-.7, .3, .55, -.35); },
      lula() { P(); X.moveTo(0, -.95); X.quadraticCurveTo(.3, -.5, .18, .15); X.lineTo(-.18, .15); X.quadraticCurveTo(-.3, -.5, 0, -.95); X.closePath(); FS(); SH(0, -.95, .4, -.6, .12, -.5); SH(0, -.95, -.4, -.6, -.12, -.5); for (let i = 0; i < 5; i++) Q(-.16 + i * .08, .15, -.3 + i * .15, .6, -.25 + i * .12, .92); },
      esponja() { P(); X.moveTo(-.55, .9); X.bezierCurveTo(-.7, .2, -.45, -.3, -.3, -.6); X.lineTo(.3, -.6); X.bezierCurveTo(.45, -.3, .7, .2, .55, .9); X.closePath(); FS(); E(0, -.6, .3, .1); for (let i = 0; i < 6; i++) { P(); X.arc(-.3 + (i % 3) * .3, .1 + Math.floor(i / 3) * .4, .05, 0, TAU); X.stroke(); } },
      aguaviva() { P(); X.ellipse(0, -.2, .7, .55, 0, PI, TAU); X.closePath(); FS(); for (let i = 0; i < 5; i++) { const x = -.5 + i * .25; P(); X.moveTo(x, -.2); X.bezierCurveTo(x - .15, .15, x + .15, .45, x, .9); ST(); } },
      anemona() { E(0, .85, .4, .1); P(); X.roundRect(-.18, .1, .36, .78, .1); FS(); for (let i = 0; i < 7; i++) L(-.15 + i * .05, .12, -.6 + i * .2, -.7); },
      coral() { L(0, .9, 0, -.1); L(0, .5, -.4, -.2); L(0, .3, .38, -.45); L(-.4, -.2, -.5, -.6); L(.38, -.45, .5, -.85); L(0, -.1, .05, -.7); E(0, .92, .5, .08); for (const [x, y] of [[-.5, -.6], [.5, -.85], [.05, -.7], [-.4, -.2], [.38, -.45]]) E(x, y, .09, .09); },
      hidra() { E(0, .9, .22, .06); P(); X.roundRect(-.1, -.3, .2, 1.2, .08); FS(); for (let i = 0; i < 5; i++) Q(-.08 + i * .04, -.3, -.5 + i * .25, -.55, -.7 + i * .35, -.9); E(.22, .4, .08, .1); }
    });
  }

  // ---------- A1: cladograma, cortes e ficha ----------
  const FIL = ['poríferos', 'cnidários', 'platelmintos', 'nematódeos', 'moluscos', 'anelídeos', 'artrópodes', 'equinodermos', 'cordados'];
  const TR = { n0: { u: .03, k: [0, 'n1'] }, n1: { u: .14, k: [1, 'n2'], m: 0 }, n2: { u: .27, k: [2, 'n3'], m: 1 }, n3: { u: .42, k: [3, 'n4'], m: 2 }, n4: { u: .56, k: ['n5', 'n6'], m: 3 }, n5: { u: .7, k: [4, 'n7'] }, n7: { u: .82, k: [5, 6] }, n6: { u: .7, k: [7, 8] } };
  const MK = [
    { n: 'tecidos verdadeiros', tp: 'dib', d: 'Todos os animais têm tecidos, menos as esponjas. Os cnidários têm só duas camadas: ectoderme e endoderme (diblásticos).' },
    { n: 'simetria bilateral e mesoderme', tp: 'ace', d: 'Surgem a simetria bilateral, a cefalização e a terceira camada, a mesoderme (triblásticos). Aqui a mesoderme preenche o corpo: acelomado, como nos platelmintos.' },
    { n: 'boca e ânus', tp: 'pse', d: 'O tubo digestório fica completo, com boca e ânus. Surge uma cavidade entre a mesoderme e a endoderme: pseudocelomado, como nos nematódeos.' },
    { n: 'celoma', tp: 'cel', d: 'A cavidade fica toda revestida por mesoderme: celomado (moluscos, anelídeos, artrópodes, equinodermos e cordados).' },
    { n: 'protostômios e deuterostômios', tp: 'blas', d: 'O blastóporo vira a boca nos protostômios e o ânus nos deuterostômios (equinodermos e cordados).' }
  ];
  function clado(t, x0, y0, tw, dy, o) {
    const yl = i => y0 + i * dy, yn = {}, yo = k => typeof k === 'number' ? yl(k) : yn[k] || (yn[k] = TR[k].k.reduce((s, q) => s + yo(q), 0) / TR[k].k.length);
    const xu = u => x0 + u * tw, g = o.g == null ? 1 : o.g, xe = x0 + tw * .98, mk = [], col = '#9DA9C4', fs = NAR ? 12 : 13;
    X.save(); X.beginPath(); X.rect(x0 - 4, y0 - dy, tw * g + 6, dy * 10); X.clip();
    const walk = (k, pu) => {
      const n = TR[k], x = xu(n.u), ys = n.k.map(yo); line(xu(pu), yo(k), x, yo(k), col, 2); line(x, Math.min(...ys), x, Math.max(...ys), col, 2);
      if (n.m != null) mk[n.m] = { x: (xu(pu) + x) / 2, y: yo(k) };
      n.k.forEach(q => { if (typeof q === 'number') line(x, yl(q), xe, yl(q), col, 2); else walk(q, n.u); });
    };
    walk('n0', 0); X.restore(); mk[4] = { x: (xu(TR.n4.u) + xu(TR.n6.u)) / 2, y: yo('n6') };
    const done = o.done;
    for (let i = 0; i < 9; i++) {
      const sh = !done || done[i]; if (g > .9) { circ(xe, yl(i), 3.5, sh ? ANI : null, sh ? null : C.dim, 1.2); if (sh) mtx(FIL[i], xe + 8, yl(i), { s: fs, a: 'left', w: 600, c: C.txt }); else mtx('?', xe + 8, yl(i), { s: fs, a: 'left', c: C.dim }); }
    }
    if (o.brk && g > .9) {
      const bx = xe + 8 + 100;
      [[4, 6, 'protostômios'], [7, 8, 'deuterostômios']].forEach(([a, b, s]) => { const y1 = yl(a) - dy * .35, y2 = yl(b) + dy * .35; line(bx, y1, bx, y2, C.dim, 1.5); line(bx - 4, y1, bx, y1, C.dim, 1.5); line(bx - 4, y2, bx, y2, C.dim, 1.5); mtx(s, bx + 8, (y1 + y2) / 2, { s: 13, a: 'left', c: C.dim }); });
    }
    if (g > .95) mk.forEach((p, i) => {
      const on = o.sel === i, pu = o.pulse === i ? 3 * Math.sin(t * 8) : 0;
      circ(p.x, p.y, 11 + pu, on ? '#FFD27F' : C.amber, on ? '#fff' : GUT, on ? 2.5 : 1.4); tx(String(i + 1), p.x, p.y + .5, { s: 12, w: 700, c: GUT, bg: false });
      if (o.tap !== false) hitC(p.x, p.y, 16, 'm' + i);
    });
    return mk;
  }
  function corte(tp, cx, cy, R) {
    const k = (r, f, s) => circ(cx, cy, R * r, f, s, 1.2);
    if (tp === 'blas') {
      [['protostômio', 'boca', -1], ['deuterostômio', 'ânus', 1]].forEach(([n, b, sd]) => {
        const x = cx + sd * R * .95, r = R * .62; circ(x, cy - R * .1, r, ECT, GUT, 1.5); circ(x, cy - R * .1, r * .7, END);
        X.save(); X.beginPath(); X.arc(x, cy - R * .1, r * 1.05, PI * .35, PI * .65); X.lineWidth = r * .3; X.strokeStyle = CAV; X.stroke(); X.restore();
        mtx('blastóporo', x, cy + r * .75, { s: 12, c: C.dim }); mtx(`<b>${b}</b>`, x, cy + r * .75 + 16, { s: 13, c: C.amber }); mtx(n, x, cy - R * .1 - r - 10, { s: 12, c: C.txt });
      }); return;
    }
    k(1, ECT, GUT);
    if (tp === 'dib') { k(.84, END, GUT); k(.4, GUT); return; }
    k(.88, MES, GUT);
    if (tp === 'ace') { k(.42, END, GUT); k(.24, GUT); return; }
    if (tp === 'pse') { k(.72, CAV, '#9EC9F2'); k(.42, END, GUT); k(.24, GUT); return; }
    k(.74, CAV, '#9EC9F2'); k(.56, MES, GUT); k(.42, END, GUT); k(.24, GUT);
  }
  const LEG = { dib: [[ECT, 'ectoderme'], [END, 'endoderme'], [GUT, 'tubo digestório']], ace: [[ECT, 'ectoderme'], [MES, 'mesoderme'], [END, 'endoderme'], [GUT, 'tubo digestório']], pse: [[ECT, 'ectoderme'], [MES, 'mesoderme'], [CAV, 'cavidade'], [END, 'endoderme']], cel: [[ECT, 'ectoderme'], [MES, 'mesoderme'], [CAV, 'cavidade (celoma)'], [END, 'endoderme']], blas: [] };
  function painel(S, t, A, px, py, pw, ph, sel) {
    panel(px, py, pw, ph); const m = MK[sel], R = NAR ? 34 : Math.min(pw * .17, 70), cx = px + (m.tp === 'blas' ? pw / 2 : R + 16), cy = py + R + (m.tp === 'blas' ? 40 : 36);
    mtx(`<b>${sel + 1}. ${m.n}</b>`, px + 10, py + 16, { s: NAR ? 13 : 15, a: 'left', c: C.amber });
    corte(m.tp, cx, cy, m.tp === 'blas' ? R * .8 : R);
    LEG[m.tp].forEach(([c, s], i) => { const ly = cy - R * .7 + i * 18; rr(cx + R + 14, ly - 6, 12, 12, 3, c, '#9DA9C4', 1); mtx(s, cx + R + 32, ly, { s: 12, a: 'left', c: C.txt }); });
    wrapTx(m.d, px + 10, cy + R + (m.tp === 'blas' ? 34 : 18), pw - 20, { s: NAR ? 12 : 13, lh: NAR ? 15 : 17, a: 'left', c: C.txt });
  }
  const COLS = ['tecidos verdadeiros', 'simetria bilateral', 'três folhetos (triblástico)', 'celoma verdadeiro', 'boca e ânus', 'deuterostômio'];
  const FICHA = [[0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 0], [1, 1, 1, 0, 0, 0], [1, 1, 1, 0, 1, 0], [1, 1, 1, 1, 1, 0], [1, 1, 1, 1, 1, 0], [1, 1, 1, 1, 1, 0], [1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1]];
  const DICA = ['Só as esponjas não têm tecidos verdadeiros (marca 1).', 'Os cnidários têm simetria radial; a bilateral vem de platelmintos em diante (marca 2). Equinodermos: a larva é bilateral, o adulto é radial.', 'A mesoderme vem junto com a simetria bilateral: de platelmintos em diante (marca 2).', 'Celoma revestido por mesoderme: de moluscos em diante; o nematódeo é pseudocelomado (marca 4).', 'Tubo completo, com boca e ânus: de nematódeos em diante (marca 3).', 'Só equinodermos e cordados são deuterostômios (marca 5).'];
  const MCOL = [0, 1, 1, 3, 2, 4];
  function drawFicha(t, S, A) {
    const wide = !NAR, lw = wide ? A.w * .5 : A.w, ch = NAR ? 28 : 32; let y = A.y0;
    y += chips(S, FIL, A.x0, y, lw, 3, ch, 'f', { on: i => S.fi === i, dn: i => S.ok[i] }) + 12;
    if (S.fi != null) {
      const rh = NAR ? 30 : 34, an = S.ans[S.fi]; mtx(`Ficha: <b>${FIL[S.fi]}</b>`, A.x0, y + 6, { s: 14, a: 'left', c: C.amber }); y += 22;
      COLS.forEach((c, i) => {
        const fl = S.fl && S.fl.k === 'r' && S.fl.i === i && performance.now() - S.fl.t < 900; rr(A.x0, y, lw, rh - 4, 8, 'rgba(19,26,43,.9)', fl ? C.erro : C.line, fl ? 2 : 1);
        mtx(c, A.x0 + 8, y + rh / 2 - 2, { s: NAR ? 12 : 13, a: 'left', c: C.txt });
        [['sim', 1], ['não', 0]].forEach(([s, v], j) => { const bw = 52, bx = A.x0 + lw - 2 * bw - 14 + j * (bw + 6); btn(bx, y + 2, bw, rh - 8, s, ANI, 'v' + i + '=' + v, { on: an[i] === v, s: 12 }); });
        y += rh;
      });
      btn(A.x0, y + 4, 150, 34, 'Conferir a ficha', C.ok, 'conf', { on: true });
    } else mtx('Escolha um filo para montar a ficha.', A.x0, y + 8, { s: 13, a: 'left', c: C.dim });
    const nok = S.ok.filter(Boolean).length;
    if (wide) {
      const tx0 = A.x0 + lw + 24, tw = A.x1 - tx0 - 118; mtx(`No cladograma: ${nok} de 9 filos`, tx0, A.y0 + 4, { s: 13, a: 'left', c: C.dim });
      clado(t, tx0, A.y0 + 30, tw, Math.min(36, (A.h - 50) / 8.4), { done: S.ok, pulse: S.ac, tap: false });
    } else mtx(`No cladograma: ${nok} de 9 filos`, A.x1, A.y1 - 8, { s: 12, a: 'right', c: C.dim });
    cap(S.msg || 'Monte a ficha de cada filo: marque sim ou não nas seis linhas e confira. Cada filo certo entra no cladograma.');
  }
  def('animalia', 'novidades', {
    t: 'O que mudou na evolução dos animais', s: 'tecidos, simetria, folhetos, celoma, boca e ânus', c: ANI,
    loc: S => S.modo === 'ficha' ? 'Monte a ficha do filo' : 'Cladograma dos animais', locNota: () => NOTA,
    ctlVis: S => S.modo === 'clado',
    alt: 'o cladograma dos nove filos de animais com cinco marcas numeradas e, ao tocar numa marca, o corte esquemático do corpo (diblástico, acelomado, pseudocelomado ou celomado); e uma ficha em que o aluno marca sim ou não em seis características de cada filo',
    still: 7,
    extra: [modo('clado', 'Cladograma'), modo('ficha', 'Monte a ficha do filo')],
    init(S) { S.modo = 'clado'; S.sel = null; S.fi = null; S.ans = FIL.map(() => [null, null, null, null, null, null]); S.ok = FIL.map(() => false); S.ac = null; S.msg = null; S.fl = null; },
    d: TXT.A1.d + '<p>No cladograma, toque nos números para ver o corte do corpo em cada etapa. Em "Monte a ficha do filo", marque sim ou não e confira.</p>',
    enem: TXT.A1.enem,
    links: [LK.clado, LK.folhetos, LK.blastoporo],
    tap(x, y, S) {
      const h = idTap(S, x, y); if (!h) return;
      if (S.modo === 'clado') { if (h[0] === 'm') S.sel = +h.slice(1); return; }
      if (h[0] === 'f' && h.length === 2) { S.fi = +h[1]; S.msg = null; S.ac = null; }
      else if (h[0] === 'v' && S.fi != null) { const [i, v] = h.slice(1).split('='); S.ans[S.fi][+i] = +v; S.msg = null; }
      else if (h === 'conf' && S.fi != null) {
        const an = S.ans[S.fi], ok = FICHA[S.fi];
        if (an.some(v => v == null)) { S.msg = 'Responda as seis linhas antes de conferir.'; return; }
        const bad = an.findIndex((v, i) => v !== ok[i]);
        if (bad < 0) { S.ok[S.fi] = true; S.ac = null; S.msg = `<b>Certo.</b> ${FIL[S.fi]} entrou no cladograma.`; }
        else { flash(S, 'r', bad); S.ac = MCOL[bad]; S.msg = '<b>Ainda não.</b> ' + DICA[bad]; }
      }
    },
    draw(t, S) {
      const A = area();
      if (S.modo === 'ficha') { drawFicha(t, S, A); return; }
      const g = ss(seg(t, 0, 4.5)), wide = !NAR, dy = wide ? Math.min(40, (A.h - 10) / 8.6) : 22, ty = A.y0 + 14;
      const lw = NAR ? 96 : 100, brk = wide ? 118 : 0, ww = wide ? Math.min(A.w * .5, 580) : A.w, tw = ww - lw - brk - 6;
      const sel = g < .9 ? null : S.sel != null ? S.sel : Math.floor(t / 5) % 5;
      clado(t, A.x0 + 4, ty, tw, dy, { g, brk: wide, sel });
      if (sel != null) {
        if (wide) painel(S, t, A, A.x0 + ww + 12, A.y0, A.x1 - A.x0 - ww - 12, Math.min(A.h, 330), sel);
        else { const py = ty + 8 * dy + 22; painel(S, t, A, A.x0, py, A.w, Math.min(A.y1 - py, 200), sel); }
      }
      cap(g < .9 ? 'O cladograma cresce da base: cada marca é uma novidade evolutiva.' : 'Toque nos números das marcas. O celoma é um esquema para comparar planos de corpo, não a ordem exata em que os grupos surgiram.');
    }
  });

  // ---------- A2: poríferos e cnidários ----------
  const AZUL = '#4DA3FF';
  function drawEsp(t, S, A) {
    const vw = Math.min(A.w * (NAR ? .62 : .34), 260), cx = A.cx, ty = A.y0 + A.h * .22, by = A.y1 - 24, th = vw * .17, hh = by - ty;
    const wl = f => vw * (.32 + .13 * Math.sin(f * PI) * .8 + .1 * f), xL = f => cx - wl(f), xR = f => cx + wl(f);
    // parede (corte)
    X.beginPath(); for (let i = 0; i <= 20; i++) { const f = i / 20, y = ty + f * hh; i ? X.lineTo(xL(f), y) : X.moveTo(xL(f), y); } for (let i = 20; i >= 0; i--) { const f = i / 20, y = ty + f * hh; X.lineTo(xR(f) , y); } X.closePath(); X.fillStyle = rgba('#C9B38A', .35); X.fill(); X.strokeStyle = '#C9B38A'; X.lineWidth = 2; X.stroke();
    X.beginPath(); for (let i = 0; i <= 20; i++) { const f = i / 20, y = ty + f * hh; i ? X.lineTo(xL(f) + th, y) : X.moveTo(xL(f) + th, y); } for (let i = 20; i >= 0; i--) { const f = i / 20, y = ty + f * hh; X.lineTo(xR(f) - th, y); } X.closePath(); X.fillStyle = rgba(AZUL, .1); X.fill(); X.strokeStyle = 'rgba(201,179,138,.6)'; X.lineWidth = 1.4; X.stroke();
    ell(cx, ty, wl(0) - 2, 7, 0, 'rgba(11,15,28,.7)', '#C9B38A', 1.6);
    // coanócitos e poros
    for (let i = 0; i < 5; i++) { const f = .18 + i * .17, y = ty + f * hh; [[xL(f) + th, 1], [xR(f) - th, -1]].forEach(([x, sd]) => { ell(x + sd * 4, y, 7, 11, 0, rgba('#E5A56B', .85), '#8A5A2B', 1.2); const w = Math.sin(t * 9 + i * 2 + sd) * 4; line(x + sd * 10, y, x + sd * 22, y + w, '#F7D9A8', 1.4); }); }
    for (let i = 0; i < 5; i++) { const f = .12 + i * .17 + .08, y = ty + f * hh; [xL(f), xR(f)].forEach(x => ell(x, y, 3, 5, 0, GUT, null)); }
    // água com corante
    const N = NAR ? 10 : 14;
    for (let i = 0; i < N; i++) {
      const f = fr(t * .16 + i / N), k = i / N, yk = ty + (.1 + .75 * ((i * 7) % N) / N) * hh, sd = i % 2 ? 1 : -1, wk = wl(Math.min(1, (yk - ty) / hh)); let x, y;
      const xin = cx + sd * (wk + 38), xp = cx + sd * (wk - th * .2), xc = cx + sd * (wk - th - 8);
      if (f < .3) { const u = f / .3; x = lerp(xin, xp, u); y = yk; } else if (f < .5) { const u = (f - .3) / .2; x = lerp(xp, cx + sd * 10, u); y = yk; } else { const u = (f - .5) / .5; x = cx + sd * 10 * (1 - u); y = lerp(yk, ty - 46, u); }
      circ(x, y, 3.2, rgba(AZUL, f > .92 ? .2 : .95));
      if (f > .38 && f < .5 && i % 3 === 0) circ(xc + sd * 10, yk - 8, 2.4, C.amber);
    }
    if (LB) {
      lab(xL(.55), ty + .55 * hh, cx - A.w * .36, ty + .62 * hh, 'poros: a água entra');
      lab(cx, ty - 4, cx + A.w * .22, ty - 20, 'ósculo: a água sai');
      lab(xR(.35) - th, ty + .35 * hh, cx + A.w * .3, ty + .3 * hh, 'coanócitos (flagelo)');
      lab(cx, ty + .72 * hh, cx + A.w * .26, ty + .8 * hh, 'sem tubo digestório');
    }
    cap('A água com corante azul entra pelos <b>poros</b>, passa pelos <b>coanócitos</b>, que capturam as partículas de alimento (pontos âmbar), e sai pelo <b>ósculo</b>. Esponjas são filtradoras.');
  }
  function drawCnid(t, S, A) {
    const T = t % 10, cx0 = A.x0 + A.w * (NAR ? .32 : .3), cy0 = A.y0 + A.h * .36, r = Math.min(A.w * (NAR ? .2 : .13), A.h * .22, 80), tip = [cx0 + r * .95, cy0 + r * .75];
    rr(A.x0 - 4, A.y0, A.w * .5, r * .5, 12, rgba('#E7B9D4', .3), '#E7B9D4', 1.6); mtx('tentáculo', A.x0 + 12, A.y0 + r * .25, { s: 12, a: 'left', c: C.dim });
    circ(cx0, cy0, r, rgba('#E7B9D4', .2), '#E7B9D4', 2); ell(cx0 - r * .1, cy0 - r * .1, r * .62, r * .45, .4, rgba('#2B3454', .9), C.line, 1.6);
    for (let k = 0; k < 4; k++) { X.beginPath(); X.ellipse(cx0 - r * .1, cy0 - r * .1, r * (.5 - k * .1), r * (.36 - k * .07), .4, 0, TAU); X.strokeStyle = 'rgba(255,225,166,.5)'; X.lineWidth = 1.4; X.stroke(); }
    line(cx0 + r * .6, cy0 + r * .3, tip[0] + 4, tip[1] + 4, C.amber, 2.2);
    const fx = lerp(A.x1 - 30, tip[0] + 36, ss(seg(T, .3, 3))) + (T > 4 ? 0 : 0), fy = lerp(cy0 + r * 1.9, tip[1] + 14, ss(seg(T, .3, 3))), p = ss(seg(T, 3.3, 4.3)) * (1 - ss(seg(T, 7.5, 9)));
    if (p > .01) { const ex = lerp(tip[0], fx - 6, p), ey = lerp(tip[1], fy, p); line(cx0 + r * .3, cy0 + r * .1, tip[0], tip[1], C.amber, 2.5); line(tip[0], tip[1], ex, ey, '#FFE1A6', 2.5); for (let i = 0; i < 6; i++) circ(lerp(tip[0], ex, i / 6) + Math.sin(t * 6 + i) * 2, lerp(tip[1], ey, i / 6) + Math.cos(t * 5 + i) * 2, 2, '#9BE08A'); }
    const sw = T > 4 && T < 8.5 ? .5 : 1; bicho('peixe', fx + (T > 4.2 ? 0 : Math.sin(t * 5) * 2), fy, NAR ? 44 : 56, { c: C.txt, a: sw });
    if (LB) { lab(cx0 - r * .1, cy0 - r * .1, A.x1 - A.w * .3, A.y0 + A.h * .1, 'cápsula com filamento enrolado'); lab(tip[0] + 2, tip[1] + 2, A.x1 - A.w * .28, A.y0 + A.h * .3, 'gatilho (cnidocílio)'); lab(cx0 - r * .8, cy0 + r * .3, A.x0 + A.w * .14, cy0 + r * 1.5, 'cnidócito'); }
    cap(T < 3 ? 'Um peixinho nada até o tentáculo.' : T < 4.4 ? 'Ao tocar o gatilho, a cápsula do <b>cnidócito</b> dispara o filamento com veneno.' : '<b>Cnidócitos</b> são a marca dos cnidários: é a "queimadura" de água-viva.');
  }
  const POL = baralho({
    nome: 'pol', alvos: [{ t: 'pólipo', c: '#E7B9D4' }, { t: 'medusa', c: '#7CC4FF' }],
    cartas: [{ t: 'anêmona', k: 0, ic: ic('anemona', 'anêmona'), x: 'a anêmona é pólipo, fixa, com a boca para cima.' }, { t: 'água-viva', k: 1, ic: ic('aguaviva', 'água-viva'), x: 'a água-viva é a medusa, que nada.' }, { t: 'coral', k: 0, ic: ic('coral', 'coral'), x: 'os corais são colônias de pólipos.' }, { t: 'hidra', k: 0, ic: ic('hidra', 'hidra'), x: 'a hidra, de água doce, é um pólipo.' }],
    certo: c => '<b>Certo.</b> ' + c.x.charAt(0).toUpperCase() + c.x.slice(1), errado: c => `<b>Ainda não.</b> ${c.t} não vai aí. Lembre: boca para cima e fixo é pólipo; boca para baixo e nadando é medusa.`,
    fim: () => '<b>Pronto.</b> Em muitas espécies, as duas formas se alternam no ciclo de vida.', dica: 'Toque num cartão e depois no lugar certo.'
  });
  const CORC = [['#F28C8C', '#F2B35C', '#E58BD1']];
  function drawRec(t, S, A) {
    const dt = dtv(S), v = S.v; S.sem = S.sem || 0;
    if (!S.morto) { if (v >= 2) S.sem = Math.min(9, S.sem + dt * 1.2 * (v - 1)); else S.sem = Math.max(0, S.sem - dt * 1.4); if (S.sem >= 8) S.morto = true; }
    const bl = S.morto ? 1 : cl(S.sem / 6, 0, 1), wide = !NAR, rh = wide ? A.h : A.h * .52, rw = wide ? A.w * .62 : A.w, gy = A.y0 + rh;
    const grad = X.createLinearGradient(0, A.y0, 0, gy); grad.addColorStop(0, rgba(AZUL, v >= 2 ? .1 : .16)); grad.addColorStop(1, rgba(v >= 2 ? '#F0A060' : AZUL, .22)); rr(A.x0, A.y0, rw, rh, 12, grad, C.line, 1);
    rr(A.x0 + 2, gy - 14, rw - 4, 12, 6, '#6B5B3E'); const cores = ['#F28C8C', '#F2B35C', '#E58BD1', '#9BE08A'];
    for (let i = 0; i < 6; i++) { const x = A.x0 + rw * (.1 + i * .15), h = rh * (.2 + (i % 3) * .08), c = S.morto ? '#6B6B58' : mix(cores[i % 4], '#F4F4F4', bl);
      for (let k = -1; k <= 1; k++) { line(x, gy - 12, x + k * 14, gy - 12 - h, c, 5); circ(x + k * 14, gy - 12 - h, 6, c); } if (S.morto) for (let k = 0; k < 3; k++) circ(x + (k - 1) * 8, gy - 20 - k * 6, 3, '#4F7A3A'); }
    if (!S.morto) for (let i = 0; i < 3; i++) bicho('peixe', A.x0 + ((t * 30 * (1 + i * .3) + i * 150) % (rw + 60)) - 30, A.y0 + rh * (.25 + i * .15), 28, { c: C.dim, a: .8 });
    mtx(S.morto ? 'recife com coral morto' : 'recife de coral', A.x0 + 10, A.y0 + 14, { s: 12, a: 'left', c: C.dim });
    // termômetro e contador
    const tx0 = wide ? A.x0 + rw + 16 : A.x0, ty0 = wide ? A.y0 : gy + 10, zr = Math.min(wide ? Math.min((A.w - rw - 32) * .4, (A.h - 130) / 2) : A.w * .22, 80), zx = wide ? tx0 + (A.x1 - tx0) / 2 : tx0 + A.w - zr - 6, zy = wide ? A.y0 + 96 + zr : ty0 + zr + 16;
    mtx(`Aquecimento: <b>+${v} °C</b>`, tx0, ty0 + 10, { s: 13, a: 'left', c: v >= 2 ? '#FFB347' : C.txt });
    mtx(`Semanas de calor: <b>${Math.floor(S.sem)}</b>`, tx0, ty0 + 30, { s: 13, a: 'left', c: C.txt });
    rr(tx0, ty0 + 44, wide ? 130 : Math.min(150, A.w * .4), 10, 5, 'rgba(19,26,43,.9)', C.line, 1); rr(tx0, ty0 + 44, (wide ? 130 : Math.min(150, A.w * .4)) * cl(S.sem / 8, 0, 1), 10, 5, S.morto ? C.erro : '#FFB347');
    mtx('limite: 8 semanas', tx0, ty0 + 66, { s: 12, a: 'left', c: C.dim });
    // pólipo ampliado
    circ(zx, zy, zr, 'rgba(11,15,28,.88)', C.amber, 2); X.save(); X.beginPath(); X.arc(zx, zy, zr - 2, 0, TAU); X.clip();
    const pc = S.morto ? '#6B6B58' : mix('#F28C8C', '#F4F4F4', bl); rr(zx - zr * .28, zy - zr * .1, zr * .56, zr * .9, 8, rgba(pc, .6), pc, 2);
    for (let i = 0; i < 6; i++) line(zx - zr * .25 + i * zr * .1, zy - zr * .1, zx - zr * .6 + i * zr * .24, zy - zr * .75, pc, 2);
    const nz = S.morto ? 0 : Math.round(12 * (1 - bl)), R0 = rng(5); for (let i = 0; i < 12; i++) { const px = zx - zr * .2 + R0() * zr * .4, py = zy + R0() * zr * .6; if (i < nz) circ(px, py, 3.4, '#4CC25D', '#1E6B33', 1); } X.restore();
    mtx('pólipo ampliado', zx, zy - zr - 9, { s: 12, c: C.dim }); mtx('zooxantelas (pontos verdes)', zx, zy + zr + 11, { s: 12, c: '#6BCB77' });
    const bx = wide ? tx0 : A.x0, by = wide ? A.y1 - 34 : A.y1 - 34; if (S.morto || S.sem > 0) btn(bx, by, 150, 32, 'Recomeçar o recife', C.ok, 'rec', { s: 12 });
    cap(S.morto ? 'O coral morreu: o calor durou demais e as zooxantelas não voltaram.' : bl > .5 ? '<b>Branqueamento.</b> O coral branco ainda está vivo, mas sem alimento. Volte a água ao normal a tempo.' : v >= 2 ? 'A água esquenta e os corais expulsam as zooxantelas. O contador mostra as semanas de calor.' : 'Suba o aquecimento da água em passos de 1 °C e acompanhe a cor do coral.');
  }
  def('animalia', 'poriferos-cnidarios', {
    t: 'Poríferos e cnidários', s: 'esponjas que filtram e águas-vivas que queimam', c: ANI,
    loc: S => ({ esp: 'Esponja em corte', cnid: 'Cnidócito em ação', pol: 'Pólipo ou medusa?', rec: 'Branqueamento do coral' })[S.modo] || '', locNota: S => S.modo === 'pol' ? '' : NOTA,
    ctl: { l: 'Aquecimento da água', min: 0, max: 4, step: 1, v: 0, f: v => '+' + v + ' °C', rate: () => 1 }, ctlVis: S => S.modo === 'rec',
    alt: 'uma esponja em corte com corante azul entrando pelos poros e saindo pelo ósculo, o disparo de um cnidócito num tentáculo, um jogo de classificar pólipo ou medusa e um recife de coral que branqueia quando a água esquenta',
    still: 6, extra: [modo('esp', 'Esponja que filtra'), modo('cnid', 'Cnidócito'), modo('pol', 'Pólipo ou medusa?'), modo('rec', 'Branqueamento')],
    init(S) { S.modo = 'esp'; S.sem = 0; S.morto = false; S.v = 0; POL.zera(S); },
    d: TXT.A2.d + '<p>Veja a esponja em corte e o cnidócito. Classifique os quatro animais e, no branqueamento, suba a temperatura aos poucos.</p>', enem: TXT.A2.enem,
    links: [LK.ecologia, LK.endossimbiose],
    tap(x, y, S) { if (S.modo === 'pol') { POL.tap(x, y, S); return; } if (S.modo === 'rec') { const h = idTap(S, x, y); if (h === 'rec') { S.sem = 0; S.morto = false; S.v = 0; } } },
    grab(x, y, S) { return S.modo === 'pol' && POL.grab(x, y, S); }, grabMove(x, y, S) { POL.grabMove(x, y, S); }, grabEnd(x, y, S) { POL.grabEnd(x, y, S); },
    draw(t, S) {
      const A = area();
      if (S.modo === 'esp') drawEsp(t, S, A); else if (S.modo === 'cnid') drawCnid(t, S, A); else if (S.modo === 'pol') cartas(POL, S, A, 4, 'Pólipo: fixo, boca para cima. Medusa: nada, boca para baixo. Leve cada animal ao seu lugar.', NAR ? 2 : 4, NAR ? 58 : 64); else drawRec(t, S, A);
    }
  });

  // ---------- A3: verminoses, rodas de ciclo ----------
  const HC = { d: '#FFB347', i: '#5FC7B8', a: '#7CC4FF' }, HN = { d: 'definitivo', i: 'intermediário', a: 'ambiente' };
  const CIC = {
    esq: { n: 'Esquistossomose', nodes: [['Pessoa com esquistossomose', 'd'], ['Fezes com ovos', 'a'], ['Ovo na água doce', 'a'], ['Miracídio', 'a'], ['Caramujo <i>Biomphalaria</i>', 'i'], ['Cercária', 'a'], ['Pele de quem entra na água', 'a']], ed: [['tratar'], ['esgoto'], [], [], [], ['lagoa'], []] },
    ten: { n: 'Teníase', nodes: [['Pessoa com teníase', 'd'], ['Ovos nas fezes', 'a'], ['Porco ou boi', 'i'], ['Cisticercos na carne', 'i']], ed: [['tratar'], ['esgoto'], [], ['cozinhar', 'inspecao']], ramo: { de: 1, t: 'Cisticercose' } },
    cis: { n: 'Cisticercose', nodes: [['Pessoa com teníase', 'd'], ['Ovos nas fezes', 'a'], ['Água, verduras e mãos sujas', 'a'], ['Ovos engolidos', 'i'], ['Larvas no cérebro e nos músculos', 'i']], ed: [['tratar'], ['esgoto'], ['lavar'], []], ab: true },
    asc: { n: 'Ascaridíase', nodes: [['Pessoa com ascaridíase', 'd'], ['Fezes com ovos', 'a'], ['Solo, água e verduras', 'a'], ['Ovos engolidos', 'a'], ['Larva: sangue e pulmões', 'a']], ed: [['tratar'], ['esgoto'], ['lavar'], [], []] },
    anc: { n: 'Ancilostomose', nodes: [['Pessoa com amarelão', 'd'], ['Fezes com ovos', 'a'], ['Solo com larvas', 'a'], ['Pele dos pés descalços', 'a'], ['Larva: sangue e pulmões', 'a']], ed: [['tratar'], ['esgoto'], ['calcado'], [], []] }
  };
  const CK = ['esq', 'ten', 'cis', 'asc', 'anc'];
  const MED = [['esgoto', 'Rede de esgoto'], ['cozinhar', 'Cozinhar bem a carne'], ['calcado', 'Usar calçados'], ['lavar', 'Lavar verduras e mãos'], ['lagoa', 'Não entrar em lagoas com caramujos'], ['inspecao', 'Inspecionar a carne no abate'], ['tratar', 'Tratar os doentes']];
  const nCorta = m => CK.filter(k => CIC[k].ed.some(e => e.includes(m))).length;
  function roda(t, cic, cx, cy, rx, ry, o = {}) {
    const n = cic.nodes.length, ed = n - (cic.ab ? 1 : 0), rN = NAR ? 13 : 15, P = i => { const a = -PI / 2 + i * TAU / n; return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, a]; };
    for (let e = 0; e < ed; e++) {
      const a = P(e), b = P((e + 1) % n), d = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / d, uy = (b[1] - a[1]) / d, cut = o.cut === e;
      arrow(a[0] + ux * (rN + 2), a[1] + uy * (rN + 2), b[0] - ux * (rN + 4), b[1] - uy * (rN + 4), cut ? C.erro : '#9DA9C4', 1.8, cut ? [5, 4] : null);
      const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      if (o.handles) { circ(mx, my, cut ? 11 : 10, cut ? rgba(C.erro, .35) : rgba(C.amber, .18), cut ? C.erro : C.amber, 2); if (cut) { line(mx - 5, my - 5, mx + 5, my + 5, C.erro, 2.4); line(mx + 5, my - 5, mx - 5, my + 5, C.erro, 2.4); } hitC(mx, my, 15, 'h' + e); }
    }
    let br = null; if (cic.ramo) {
      const a = P(cic.ramo.de), bx = cx + (a[0] - cx) * 1.55, by = cy + (a[1] - cy) * 1.55 - ry * .1; br = [bx, by];
      arrow(a[0] + 8, a[1] - 4, bx - 12, by + 5, C.erro, 1.6, [5, 4]); circ(bx, by, rN - 1, rgba(C.erro, .25), C.erro, 2); tx('R', bx, by + .5, { s: 12, w: 700, bg: false, c: C.txt });
      if (o.direct) mtx(`<b>${cic.ramo.t}</b>`, bx + rN + 6, by - 8, { s: 13, a: 'left', c: C.erro }), wrapTx('outra pessoa engole os ovos: larvas no cérebro e nos músculos', bx + rN + 6, by + 8, 150, { s: 12, a: 'left', c: C.txt });
    }
    // viajante
    const st = o.cut != null ? (o.cut + 1) % n : 0, L = ed - (o.cut != null ? 1 : 0), u = fr(t * .07) * L, kk = Math.floor(u), f = u - kk, e = (st + kk) % n, a = P(e), b = P((e + 1) % n);
    circ(lerp(a[0], b[0], f), lerp(a[1], b[1], f), 5, '#fff', C.amber, 2);
    for (let i = 0; i < n; i++) {
      const [x, y, an] = P(i), tp = cic.nodes[i][1]; circ(x, y, rN, rgba(HC[tp], .3), HC[tp], 2.2); tx(String(i + 1), x, y + .5, { s: 12, w: 700, bg: false, c: C.txt });
      if (o.direct) {
        const c = Math.cos(an), s = Math.sin(an), lw = 150, th = wrapTx(cic.nodes[i][0], 0, 0, lw, { s: 13, w: 600, lh: 16, dry: true }), al = c > .35 ? 'left' : c < -.35 ? 'right' : 'center';
        const lx = al === 'left' ? x + rN + 6 : al === 'right' ? x - rN - 6 : x, ly = al === 'center' ? (s < 0 ? y - rN - 8 - th - 14 + 8 : y + rN + 10) : y - th / 2 - 4;
        wrapTx(cic.nodes[i][0], lx, ly + 8, lw, { s: 13, w: 600, lh: 16, a: al, c: C.txt }); mtx(HN[tp], lx, ly + th + 10, { s: 12, a: al, c: HC[tp] });
      }
    }
    return br;
  }
  function legNum(cic, x, y, w) {
    const fs = 12; cic.nodes.forEach((nd, i) => { const yy = y + i * 16; circ(x + 8, yy, 6, rgba(HC[nd[1]], .4), HC[nd[1]], 1.5); mtx(`${i + 1}. ${nd[0]} (${HN[nd[1]]})`, x + 20, yy, { s: fs, a: 'left', c: C.txt }); });
    if (cic.ramo) mtx(`R. ${cic.ramo.t}: outra pessoa engole os ovos`, x + 20, y + cic.nodes.length * 16, { s: fs, a: 'left', c: C.erro });
  }
  function legHosp(x, y) { let xx = x; [['d', NAR ? 'definitivo' : 'hospedeiro definitivo'], ['i', NAR ? 'intermediário' : 'hospedeiro intermediário'], ['a', 'ambiente']].forEach(([k, s]) => { circ(xx + 6, y, 5, rgba(HC[k], .4), HC[k], 1.5); const w = mtx(s, xx + 16, y, { s: 12, a: 'left', c: C.txt }); xx += w + 34; }); }
  function drawCiclo(t, S, A) {
    let y = A.y0; y += chips(S, ['Esquistossomose', '<i>Taenia solium</i>'], A.x0, y, Math.min(A.w, 420), 2, NAR ? 30 : 34, 'c', { on: i => S.cz === i }) + 8;
    const cic = S.cz ? CIC.ten : CIC.esq, wide = !NAR, ly = A.y1 - 16, avail = ly - y - 8;
    if (wide) { const ry = Math.min(avail / 2 - 62, 130), rx = Math.min(A.w * .2, ry * 1.7); roda(t, cic, A.cx - 40, y + avail / 2, rx, ry, { direct: true }); }
    else { const ry = Math.min(76, (avail - 112 - 30) / 2), n = cic.nodes.length + (cic.ramo ? 1 : 0); roda(t, cic, A.cx, y + ry + 22, A.w * .36, ry, {}); legNum(cic, A.x0 + 2, y + ry * 2 + 52, A.w); }
    legHosp(A.x0 + 2, ly);
    cap(S.cz ? 'Na <b>teníase</b>, a pessoa come carne com cisticercos. Na <b>cisticercose</b> (ramo R), outra pessoa engole os <b>ovos</b>: a carne não é o caminho.' : 'Os <b>ovos</b> saem nas fezes; na água, o miracídio entra no <b>caramujo</b>; a <b>cercária</b> penetra pela pele de quem entra na água. A falta de saneamento mantém o ciclo.');
  }
  function aplica(S, e) {
    const k = CK[S.dz], cic = CIC[k], m = S.med; if (m == null) { S.msg = 'Escolha uma medida primeiro.'; return; }
    if (S.cut[k] != null) { S.msg = 'Este ciclo já foi cortado. Escolha outra doença.'; return; }
    const mid = MED[m][0];
    if (cic.ed[e].includes(mid)) { S.cut[k] = e; const nn = nCorta(mid); S.msg = `<b>Cortou.</b> "${MED[m][1]}" interrompe o ciclo aqui. Ela corta o ciclo de ${nn} das 5 doenças.` + (mid === 'esgoto' ? ' O saneamento é a medida que corta mais ciclos, e é responsabilidade pública.' : ''); }
    else { flash(S, 'h', e); S.msg = `<b>Ainda não.</b> Essa medida não atua nesse ponto do ciclo de ${cic.n.toLowerCase()}. Pense em onde cada medida age.`; }
  }
  function drawCorte(t, S, A) {
    const wide = !NAR; let y = A.y0; y += chips(S, CK.map(k => CIC[k].n), A.x0, y, A.w, wide ? 5 : 3, NAR ? 28 : 32, 'z', { on: i => S.dz === i, dn: i => S.cut[CK[i]] != null }) + 10;
    const cic = CIC[CK[S.dz]], k = CK[S.dz], cut = S.cut[k];
    if (wide) {
      const mw = Math.min(300, A.w * .3), rw = A.w - mw - 16, ry = Math.min((A.y1 - y) / 2 - 62, 120), rx = Math.min(rw * .3, ry * 1.7);
      roda(t, cic, A.x0 + rw / 2, y + (A.y1 - y) / 2, rx, ry, { direct: true, handles: true, cut: cut == null ? null : cut });
      chips(S, MED.map(m => m[1]), A.x1 - mw, y, mw, 1, 34, 'q', { on: i => S.med === i }); legHosp(A.x0 + 2, A.y1 - 12);
    } else {
      const ry = 54; roda(t, cic, A.cx, y + ry + 18, A.w * .36, ry, { handles: true, cut: cut == null ? null : cut });
      legNum(cic, A.x0 + 2, y + ry * 2 + 44, A.w); const my = y + ry * 2 + 44 + (cic.nodes.length + 1) * 16 - 4;
      chips(S, MED.map(m => m[1]), A.x0, my, A.w, 2, 28, 'q', { on: i => S.med === i });
    }
    if (S.dr) { const m = MED[S.dr.i][1]; const w = mtw(m, 12, 600) + 16; rr(S.dr.x - w / 2, S.dr.y - 14, w, 28, 8, 'rgba(255,179,71,.3)', C.amber, 2); mtx(m, S.dr.x, S.dr.y, { s: 12, w: 600, c: C.txt, bg: false }); }
    const nc = Object.keys(S.cut).length;
    cap(S.msg || (nc === 5 ? '<b>Pronto.</b> Cinco ciclos cortados. Veja o quadro-resumo.' : 'Escolha uma medida (ou arraste) e leve-a ao círculo tracejado do ciclo onde ela age. Em cada ciclo há um ponto fraco.'));
  }
  const QD = [['esq', 'Esquistossomose', '<i>Schistosoma mansoni</i>', 'platelminto', 'a cercária penetra pela pele em água doce com caramujos', 'saneamento; evitar lagoas com caramujos'], ['ten', 'Teníase', '<i>Taenia solium</i>, <i>T. saginata</i>', 'platelminto', 'carne de porco ou boi malpassada, com cisticercos', 'carne bem cozida e inspecionada'], ['cis', 'Cisticercose', '<i>Taenia solium</i> (ovos)', 'platelminto', 'ovos em água, verduras e mãos sujas', 'saneamento; lavar mãos e verduras'], ['asc', 'Ascaridíase', '<i>Ascaris lumbricoides</i>', 'nematódeo', 'ovos em água, alimentos e mãos sujas', 'saneamento e higiene'], ['anc', 'Ancilostomose (amarelão)', '<i>Ancylostoma</i>, <i>Necator americanus</i>', 'nematódeo', 'larva penetra pela pele (pés descalços)', 'calçados; saneamento'], ['fil', 'Filariose', '<i>Wuchereria bancrofti</i>', 'nematódeo', 'picada do <i>Culex</i>', 'controle do mosquito e tratamento']];
  function drawQuadro(t, S, A) {
    let y = A.y0; y += chips(S, QD.map(q => q[1]), A.x0, y, A.w, NAR ? 2 : 3, NAR ? 30 : 34, 'd', { on: i => S.qz === i, dn: i => QD[i][0] === 'fil' || S.cut[QD[i][0]] != null }) + 10;
    const q = QD[S.qz], ok = q[0] === 'fil' || S.cut[q[0]] != null, h = A.y1 - y; panel(A.x0, y, A.w, h);
    mtx(`<b>${q[1]}</b>`, A.x0 + 12, y + 18, { s: 16, f: FH, a: 'left', c: C.amber });
    cap('Quadro-resumo preenchido conforme os ciclos cortados.');
    if (!ok) { wrapTx('Corte o ciclo desta doença, em "Corte o ciclo", para preencher esta linha do quadro.', A.x0 + 12, y + 46, A.w - 24, { s: 13, a: 'left', c: C.dim }); return; }
    const f = NAR ? 12 : 14, lh = f + 5; let yy = y + 44;
    [['Agente', q[2]], ['Grupo', q[3]], ['Como se pega', q[4]], ['Prevenção principal', q[5]]].forEach(([a, b]) => { yy += wrapTx(`<b>${a}:</b> ${b}`, A.x0 + 12, yy, A.w - 24, { s: f, lh, a: 'left', c: C.txt }) + 6; });
    if (q[0] === 'fil') wrapTx('Em 2024, a OMS reconheceu que o Brasil <b>eliminou a filariose linfática como problema de saúde pública</b>, graças ao tratamento em massa da população em risco, ao controle do mosquito e à vigilância; a vigilância continua, para evitar a volta da doença.', A.x0 + 12, yy + 6, A.w - 24, { s: f, lh, a: 'left', c: C.ok });
    else wrapTx('Verminoses ligadas à falta de saneamento: levar esgoto e água tratada a todos é responsabilidade pública.', A.x0 + 12, yy + 6, A.w - 24, { s: f, lh, a: 'left', c: C.dim });
  }
  def('animalia', 'vermes', {
    t: 'Platelmintos, nematódeos e verminoses', s: 'esquistossomose, teníase, cisticercose, ascaridíase e amarelão', c: ANI,
    loc: S => ({ ciclo: 'Rodas de ciclo', corte: 'Corte o ciclo', quadro: 'Quadro-resumo' })[S.modo] || '', locNota: () => 'Esquema, sem imagens de doentes',
    ctlVis: S => S.modo === 'ciclo',
    alt: 'duas rodas de ciclo de vida, da esquistossomose e da Taenia solium (com o ramo da cisticercose), um jogo em que o aluno leva medidas de prevenção ao ponto do ciclo onde cortam a transmissão em cinco verminoses e um quadro-resumo',
    still: 8, extra: [modo('ciclo', 'Rodas de ciclo'), modo('corte', 'Corte o ciclo'), modo('quadro', 'Quadro-resumo')],
    init(S) { S.modo = 'ciclo'; S.cz = 0; S.dz = 0; S.med = null; S.cut = {}; S.qz = 0; S.dr = null; S.msg = null; S.fl = null; },
    d: TXT.A3.d + '<p>Veja as duas rodas de ciclo. Em "Corte o ciclo", escolha uma doença e uma medida e leve-a ao ponto certo da roda. O quadro-resumo se preenche conforme você corta os ciclos.</p>', enem: TXT.A3.enem,
    links: [LK.ecologia],
    tap(x, y, S) {
      const h = idTap(S, x, y); if (!h) return;
      if (S.modo === 'ciclo') { if (h[0] === 'c') S.cz = +h.slice(1); return; }
      if (S.modo === 'quadro') { if (h[0] === 'd') S.qz = +h.slice(1); return; }
      if (h[0] === 'z') { S.dz = +h.slice(1); S.med = null; S.msg = null; } else if (h[0] === 'q') { S.med = S.med === +h.slice(1) ? null : +h.slice(1); S.msg = null; } else if (h[0] === 'h') aplica(S, +h.slice(1));
    },
    grab(x, y, S) { if (S.modo !== 'corte') return false; const h = hitAt(x, y); if (typeof h === 'string' && h[0] === 'q') { S.med = +h.slice(1); S.dr = { i: S.med, x, y }; return true; } return false; },
    grabMove(x, y, S) { if (S.dr) { S.dr.x = x; S.dr.y = y; } },
    grabEnd(x, y, S) { if (!S.dr) return; S.dr = null; const h = hitAt(x, y); if (typeof h === 'string' && h[0] === 'h') aplica(S, +h.slice(1)); },
    draw(t, S) { const A = area(); if (S.modo === 'ciclo') drawCiclo(t, S, A); else if (S.modo === 'corte') drawCorte(t, S, A); else drawQuadro(t, S, A); }
  });

  // ---------- A4: moluscos e anelídeos ----------
  const CAB = '#6FB1E8', PE = '#E5646B', VIS = '#F2994A', MAN = '#9B7FD9';
  function molusco(tp, cx, cy, s) {
    if (tp === 0) {
      ell(cx, cy + .3 * s, .46 * s, .09 * s, 0, PE, GUT, 1.2); ell(cx + .42 * s, cy + .18 * s, .13 * s, .11 * s, 0, CAB, GUT, 1.2); line(cx + .46 * s, cy + .1 * s, cx + .55 * s, cy - .15 * s, CAB, 2); line(cx + .38 * s, cy + .1 * s, cx + .4 * s, cy - .15 * s, CAB, 2);
      circ(cx - .1 * s, cy - .05 * s, .3 * s, rgba(MAN, .35), MAN, 2.4); circ(cx - .1 * s, cy - .05 * s, .17 * s, VIS, GUT, 1.2); X.beginPath(); X.arc(cx - .1 * s, cy - .05 * s, .24 * s, PI * .2, PI * 1.6); X.strokeStyle = rgba(MAN, .8); X.lineWidth = 1.5; X.stroke();
    } else if (tp === 1) {
      ell(cx, cy, .45 * s, .3 * s, -.2, rgba(MAN, .3), MAN, 2.4); ell(cx - .02 * s, cy, .27 * s, .16 * s, -.2, VIS, GUT, 1.2); ell(cx + .28 * s, cy + .15 * s, .12 * s, .05 * s, .5, PE, GUT, 1.2); circ(cx + .4 * s, cy - .04 * s, .05 * s, CAB, GUT, 1.2);
      line(cx - .4 * s, cy + .02 * s, cx + .38 * s, cy - .1 * s, rgba(MAN, .7), 1.4);
    } else {
      ell(cx, cy - .2 * s, .25 * s, .3 * s, 0, rgba(MAN, .35), MAN, 2.4); ell(cx, cy - .2 * s, .14 * s, .18 * s, 0, VIS, GUT, 1.2); ell(cx, cy + .12 * s, .2 * s, .11 * s, 0, CAB, GUT, 1.2); circ(cx - .08 * s, cy + .1 * s, .025 * s, GUT); circ(cx + .08 * s, cy + .1 * s, .025 * s, GUT);
      for (let i = 0; i < 6; i++) { X.beginPath(); X.moveTo(cx - .17 * s + i * .068 * s, cy + .18 * s); X.quadraticCurveTo(cx - .25 * s + i * .1 * s, cy + .4 * s, cx - .3 * s + i * .12 * s, cy + .5 * s); X.strokeStyle = PE; X.lineWidth = 3; X.stroke(); }
    }
  }
  const MN = [['caramujo (gastrópode)', 'uma concha em espiral'], ['mexilhão (bivalve)', 'duas valvas'], ['polvo (cefalópode)', 'tentáculos ligados à cabeça']];
  function legMol(A, y) { const L = [[CAB, 'cabeça'], [PE, 'pé'], [VIS, 'massa visceral'], [MAN, 'manto (e concha)']], cw = A.w / (NAR ? 2 : 4); L.forEach(([c, s], i) => { const x = A.x0 + (i % (NAR ? 2 : 4)) * cw, yy = y + Math.floor(i / (NAR ? 2 : 4)) * 20; rr(x, yy - 6, 12, 12, 3, c, GUT, 1); mtx(s, x + 18, yy, { s: 12, a: 'left', c: C.txt }); }); }
  function drawMol(t, S, A) {
    const s = NAR ? Math.min(90, (A.h - 60) / 3.4) : Math.min(A.w / 3.6, A.h * .55);
    for (let i = 0; i < 3; i++) {
      const cx = NAR ? A.x0 + s * .8 : A.x0 + A.w * (i + .5) / 3, cy = NAR ? A.y0 + s * (.7 + i * 1.1) : A.y0 + s * .75;
      molusco(i, cx, cy, s);
      if (NAR) { wrapTx(MN[i][0], cx + s * .8, cy - 8, A.w - s * 1.6 - 8, { s: 13, w: 700, lh: 16, a: 'left', c: C.txt }); wrapTx(MN[i][1], cx + s * .8, cy + 16, A.w - s * 1.6 - 8, { s: 12, lh: 15, a: 'left', c: C.dim }); }
      else { mtx(`<b>${MN[i][0]}</b>`, cx, cy + s * .72, { s: 14, c: C.txt }); mtx(MN[i][1], cx, cy + s * .72 + 20, { s: 13, c: C.dim }); }
    }
    legMol(A, A.y1 - (NAR ? 34 : 26));
    cap('O mesmo plano de corpo, rearranjado: <b>cabeça</b>, <b>pé</b> musculoso e <b>massa visceral</b> coberta pelo <b>manto</b>, que em muitos forma a concha. Cores iguais, partes iguais.');
  }
  function drawMex(t, S, A) {
    const s = Math.min(A.w * (NAR ? .36 : .34), A.h * .6), cx = A.cx, cy = A.cy, T = t % 20, acc = Math.min(12, Math.floor(T / 1.4));
    molusco(1, cx, cy, s);
    const pts = [[cx - .95 * s, cy - .75 * s], [cx - .3 * s, cy - .08 * s], [cx - .05 * s, cy + .02 * s], [cx + .5 * s, cy - .35 * s], [cx + .95 * s, cy - .8 * s]];
    for (let i = 0; i < 18; i++) {
      const f = fr(t * .11 + i / 18), red = i % 3 === 0; if (red && f > .5) continue;
      const q = f * 4, j = Math.min(3, Math.floor(q)), u = q - j, x = lerp(pts[j][0], pts[j + 1][0], u), y = lerp(pts[j][1], pts[j + 1][1], u) + Math.sin(i * 3 + t) * 3;
      circ(x, y, red ? 3.6 : 2.8, red ? C.erro : 'rgba(180,200,230,.8)', red ? '#7A1F1F' : null, 1);
    }
    const R0 = rng(9); for (let i = 0; i < acc; i++) circ(cx - .15 * s + R0() * .28 * s, cy - .06 * s + R0() * .1 * s, 3.4, C.erro, '#7A1F1F', 1);
    arrow(pts[0][0] - 4, pts[0][1] - 10, pts[1][0] - 20, pts[1][1] - 6, AZUL, 1.8); arrow(pts[3][0] + 14, pts[3][1] - 6, pts[4][0] + 6, pts[4][1] + 6, AZUL, 1.8);
    if (LB) { lab(pts[0][0] + 20, pts[0][1] - 4, A.x0 + 20, A.y0 + 20, 'água com partículas entra'); lab(pts[4][0] - 10, pts[4][1] + 4, A.x1 - 10, A.y0 + 20, 'água filtrada sai'); lab(cx - .1 * s, cy, cx - s * .1, cy + s * .75, 'toxinas ficam no corpo'); }
    wrapTx('pontos cinza: partículas de alimento; pontos vermelhos: toxinas, metais e bactérias do esgoto', A.x0, A.y1 - (NAR ? 22 : 10), A.w, { s: 12, lh: 15, a: 'left', c: C.dim });
    cap('O <b>mexilhão</b> é <b>filtrador</b>: passa muita água pelas brânquias e <b>acumula</b> o que houver nela. Por isso serve para monitorar a poluição e não deve ser colhido em praia poluída.');
  }
  function drawMin(t, S, A) {
    const wide = !NAR, sw = wide ? A.w * .6 : A.w, sh = wide ? A.h : A.h * .55, gy = A.y0 + 34;
    rr(A.x0, A.y0, sw, sh, 12, 'rgba(92,64,40,.5)', C.line, 1); rr(A.x0, A.y0, sw, 34, 10, rgba('#6BCB77', .2)); mtx('superfície', A.x0 + 10, A.y0 + 17, { s: 12, a: 'left', c: C.dim });
    const R0 = rng(5); for (let i = 0; i < 50; i++) circ(A.x0 + 8 + R0() * (sw - 16), gy + R0() * (sh - 40), 1 + R0() * 1.8, 'rgba(60,40,22,.6)');
    for (let k = 0; k < 3; k++) { X.beginPath(); for (let i = 0; i <= 24; i++) { const x = A.x0 + 20 + i * (sw - 40) / 24, y = gy + sh * (.22 + k * .22) + Math.sin(i * .7 + k * 2) * 8; i ? X.lineTo(x, y) : X.moveTo(x, y); } X.strokeStyle = 'rgba(30,20,10,.55)'; X.lineWidth = 11; X.lineCap = 'round'; X.stroke(); }
    const f = fr(t * .06), hx = A.x0 + 20 + f * (sw - 40), N = 18; let wy = gy + sh * .44;
    for (let i = N; i >= 0; i--) { const x = hx - i * 6.5; if (x < A.x0 + 20) continue; const y = gy + sh * .44 + Math.sin((x - A.x0) / 28 * 1 + 2.1) * 8; circ(x, y, 5.6, '#E39A94', '#8A4A45', 1); if (i === 0) wy = y; }
    circ(hx + 2, wy - 1, 1.4, GUT);
    for (let i = 0; i < 9; i++) { const x = hx - 30 - i * 18; if (x > A.x0 + 16) circ(x, gy + sh * .44 + 14 + (i % 3) * 3, 3, '#4B2F14'); }
    if (LB) { lab(hx - 40, wy, A.x0 + sw * .3, A.y0 + sh * .86, 'túnel: aera o solo'); lab(hx - 100, wy + 16, A.x0 + sw * .6, A.y0 + sh * .9, 'húmus (fezes)'); }
    // zoom
    const zr = wide ? Math.min((A.w - sw) * .4, 100) : Math.min(A.w * .2, 70), zx = wide ? A.x0 + sw + (A.w - sw) / 2 : A.cx, zy = wide ? A.cy : A.y0 + sh + zr + 26;
    circ(zx, zy, zr, 'rgba(11,15,28,.88)', C.amber, 2); X.save(); X.beginPath(); X.arc(zx, zy, zr - 2, 0, TAU); X.clip();
    for (let i = 0; i < 6; i++) { const x = zx - zr * .8 + i * zr * .3; ell(x + zr * .15, zy, zr * .12, zr * .36, 0, rgba('#E39A94', .5), '#E39A94', 1.5); line(x + zr * .3, zy - zr * .5, x + zr * .3, zy + zr * .5, '#8A4A45', 1.4); }
    line(zx - zr, zy - zr * .38, zx + zr, zy - zr * .38, C.erro, 3); X.restore();
    mtx('anéis ampliados', zx, zy - zr - 9, { s: 12, c: C.dim }); mtx('vaso com sangue vermelho (hemoglobina)', zx, zy + zr + 11, { s: 12, c: C.erro });
    cap('A <b>minhoca</b> cava túneis, engole terra e deixa <b>húmus</b>. O corpo é dividido em <b>anéis</b>, com <b>celoma</b> em cada um, e a circulação é <b>fechada</b>. Ela respira pela <b>pele úmida</b>.');
  }
  function drawSolo(t, S, A) {
    const k = ss(S.v / 8), pw = (A.w - 14) / 2, bw = pw - 20, gy = A.y0 + A.h * .4;
    [[A.x0, true], [A.x0 + pw + 14, false]].forEach(([x, com]) => {
      const kk = com ? k : k * .12; panel(x, A.y0, pw, A.h); mtx(com ? '<b>com</b> minhocas' : '<b>sem</b> minhocas', x + pw / 2, A.y0 + 14, { s: 14, f: FH, c: C.txt });
      rr(x + 8, gy, pw - 16, A.h * .24, 6, 'rgba(110,76,44,.8)'); const R0 = rng(com ? 3 : 4);
      if (com) { for (let i = 0; i < 2 + Math.round(kk * 4); i++) { const yy = gy + 10 + R0() * A.h * .18; line(x + 14, yy, x + pw - 14, yy + (R0() - .5) * 8, 'rgba(30,20,10,.6)', 5); } for (let i = 0; i < 3; i++) bicho('minhoca', x + 30 + R0() * (pw - 80), gy + 14 + i * 12, 24, { c: '#E39A94' }); }
      for (let i = 0; i < 8; i++) { const f = fr(t * .3 + i * .13), dx = x + 16 + (i / 8) * (pw - 32), pen = lerp(.1, com ? .1 + kk * .8 : .1 + kk * .8, 1) * A.h * .24; circ(dx, gy - 16 + f * (16 + pen * (com ? 1 : .35)), 2.4, rgba(AZUL, .9 - f * .4)); }
      const ph = A.h * (.1 + .17 * (com ? kk : .1 + k * .1)); line(x + pw / 2, gy, x + pw / 2, gy - ph, '#3FA45A', 3); for (let i = 0; i < 2 + Math.round(ph / 18); i++) ell(x + pw / 2 + (i % 2 ? 10 : -10), gy - 8 - i * 14, 9, 3.5, i % 2 ? -.5 : .5, rgba('#3FA45A', .85), '#1E6B33', 1);
      [['aeração', com ? .2 + .7 * k : .2 + .08 * k], ['infiltração de água', com ? .25 + .65 * k : .25 + .06 * k], ['crescimento da planta', com ? .2 + .7 * k : .2 + .1 * k]].forEach(([n, v], i) => { const by = gy + A.h * .24 + 22 + i * 30; mtx(n, x + 12, by - 7, { s: 12, a: 'left', c: C.dim }); rr(x + 12, by + 2, bw - 4, 8, 4, 'rgba(19,26,43,.9)', C.line, 1); rr(x + 12, by + 2, (bw - 4) * v, 8, 4, com ? C.ok : '#C9A27A'); });
    });
    cap(S.v < 1 ? 'Dois vasos iguais. Avance as semanas e compare aeração, infiltração de água e crescimento da planta.' : 'Com minhocas, os túneis <b>arejam</b> o solo, a água entra e as raízes crescem melhor. Sem elas, o solo fica compacto.');
  }
  const MOL = baralho({
    nome: 'mol', alvos: [{ t: 'gastrópode', c: '#E7B9D4' }, { t: 'bivalve', c: '#7CC4FF' }, { t: 'cefalópode', c: '#FFB347' }],
    cartas: [{ t: 'caramujo', k: 0, ic: ic('caramujo', 'caramujo'), x: 'o caramujo tem concha em espiral.' }, { t: 'lesma', k: 0, ic: ic('lesma', 'lesma'), x: 'a lesma é gastrópode sem concha.' }, { t: 'ostra', k: 1, ic: ic('ostra', 'ostra'), x: 'a ostra tem duas valvas.' }, { t: 'mexilhão', k: 1, ic: ic('mexilhao', 'mexilhão'), x: 'o mexilhão tem duas valvas e filtra a água.' }, { t: 'lula', k: 2, ic: ic('lula', 'lula'), x: 'a lula tem tentáculos ligados à cabeça.' }, { t: 'polvo', k: 2, ic: ic('polvo', 'polvo'), x: 'o polvo é cefalópode, com sistema nervoso muito desenvolvido.' }],
    certo: c => '<b>Certo.</b> ' + c.x.charAt(0).toUpperCase() + c.x.slice(1), errado: c => `<b>Ainda não.</b> ${c.t} não vai aí. Procure a concha em espiral, as duas valvas ou os tentáculos na cabeça.`,
    fim: () => '<b>Pronto.</b> Cefalópodes têm circulação fechada; a maioria dos outros moluscos, aberta.', dica: 'Toque num cartão e depois no lugar certo.'
  });
  def('animalia', 'moluscos-anelideos', {
    t: 'Moluscos e anelídeos', s: 'corpo mole, concha e o corpo em anéis', c: ANI,
    loc: S => ({ mol: 'Plano do molusco', mex: 'Mexilhão filtrador', min: 'A minhoca no solo', solo: 'Solo com e sem minhoca', carta: 'Que molusco é esse?' })[S.modo] || '', locNota: S => S.modo === 'carta' ? '' : NOTA,
    ctl: { l: 'Semanas', min: 0, max: 8, step: 1, v: 0, f: v => v + (v === 1 ? ' semana' : ' semanas'), rate: () => 1 }, ctlVis: S => S.modo === 'solo', stillV: 8,
    alt: 'três moluscos em corte com as mesmas cores para cabeça, pé, massa visceral e manto, um mexilhão filtrando água com toxinas, uma minhoca no solo com os anéis ampliados, dois vasos com e sem minhoca e um jogo de classificar seis moluscos',
    still: 6, extra: [modo('mol', 'Plano do molusco'), modo('mex', 'Mexilhão'), modo('min', 'Minhoca'), modo('solo', 'Solo com e sem minhoca'), modo('carta', 'Que molusco é esse?')],
    init(S) { S.modo = 'mol'; MOL.zera(S); },
    d: TXT.A4.d + '<p>Compare os três moluscos, veja o mexilhão filtrar e a minhoca no solo. Avance as semanas nos vasos e classifique os seis moluscos.</p>', enem: TXT.A4.enem,
    links: [LK.ecologia],
    tap(x, y, S) { if (S.modo === 'carta') MOL.tap(x, y, S); },
    grab(x, y, S) { return S.modo === 'carta' && MOL.grab(x, y, S); }, grabMove(x, y, S) { MOL.grabMove(x, y, S); }, grabEnd(x, y, S) { MOL.grabEnd(x, y, S); },
    draw(t, S) { const A = area(); if (S.modo === 'mol') drawMol(t, S, A); else if (S.modo === 'mex') drawMex(t, S, A); else if (S.modo === 'min') drawMin(t, S, A); else if (S.modo === 'solo') drawSolo(t, S, A); else cartas(MOL, S, A, 6, 'Leve cada molusco ao seu grupo.', NAR ? 2 : 3, NAR ? 44 : 50); }
  });

  // ---------- A5: artrópodes ----------
  const AN5 = [['formiga', 'formiga (inseto)', ['corpo: cabeça, tórax e abdome', '3 pares de patas', '1 par de antenas'], 3], ['aranha', 'aranha (aracnídeo)', ['corpo: cefalotórax e abdome', '4 pares de patas', 'sem antenas'], 4], ['camarao', 'camarão (crustáceo)', ['corpo: cefalotórax e abdome', '2 pares de antenas', 'respira por brânquias'], 0], ['lacraia', 'lacraia (quilópode)', ['corpo em segmentos', '1 par de patas por segmento', '1 par de antenas'], 0]];
  function drawSilh(t, S, A) {
    const cols = NAR ? 2 : 4, g = 8, pw = (A.w - (cols - 1) * g) / cols, ph = NAR ? (A.h - g) / 2 : A.h;
    AN5.forEach(([id, n, tx2, pares], i) => {
      const x = A.x0 + (i % cols) * (pw + g), y = A.y0 + Math.floor(i / cols) * (ph + g), on = S.sa === i;
      rr(x, y, pw, ph, 12, on ? rgba(ANI, .12) : 'rgba(19,26,43,.78)', on ? C.amber : C.line, on ? 2.2 : 1); hitR(x, y, pw, ph, 'a' + i);
      const s = Math.min(pw * .8, ph * .36, 120); bicho(id, x + pw / 2, y + 14 + s / 2, s, { c: C.txt });
      wrapTx(n, x + pw / 2, y + s + 30, pw - 14, { s: 13, w: 700, lh: 16, c: C.txt });
      tx2.forEach((q, k) => wrapTx(q, x + 10, y + s + 60 + k * (NAR ? 30 : 34), pw - 20, { s: 12, lh: 15, a: 'left', c: k === 0 ? C.dim : C.txt }));
      if (on && pares) { const c = 1 + Math.floor(t * 1.1) % pares; mtx(`contados: <b>${c}</b> de ${pares} pares`, x + pw / 2, y + ph - 14, { s: 12, c: C.amber }); }
    });
    cap('Conte patas e antenas. <b>Inseto</b>: 3 pares de patas e 1 par de antenas. <b>Aracnídeo</b>: 4 pares e nenhuma antena. <b>Crustáceo</b>: 2 pares de antenas. Toque num bicho para contar.');
  }
  function drawMuda(t, S, A) {
    const T = t % 14, p = ss(seg(T, 1.2, 8)), w = ss(seg(T, 8, 12)), s = Math.min(A.w * (NAR ? .5 : .22), A.h * .4), cx = A.cx - s * .2, cy = A.cy + s * .3;
    line(A.x0 + 20, cy + s * .55, A.x1 - 20, cy + s * .35, '#7A5A38', 10);
    for (const k of [-1, 0, 1]) line(cx + k * s * .22, cy + s * .42, cx + k * s * .3, cy + s * .08, '#A88A60', 2);
    ell(cx, cy, s * .52, s * .2, -.3, rgba('#C9B38A', .55), '#C9B38A', 2); line(cx - s * .3, cy + s * .02, cx + s * .26, cy - s * .12, '#7A5A38', 1.6);
    const ax = cx + p * s * .62, ay = cy - p * s * .78;
    if (p > .02) { ell(ax, ay, s * .5, s * .17, -.3 - p * .5, rgba('#9BE08A', .9), '#3E7A33', 2); circ(ax + s * .35, ay - s * .17 - p * 4, s * .1, '#9BE08A', '#3E7A33', 2); if (w > .02) for (const sd of [-1, 1]) ell(ax - s * .02 + sd * s * .05, ay - s * .2 * w, s * .14 * w, s * .5 * w, -.4 + sd * .3, rgba('#D8F2FF', .55), '#9DC8D8', 1.2); }
    if (LB) { lab(cx - s * .3, cy + s * .02, A.x0 + A.w * .15, A.y0 + A.h * .75, 'casca velha: exoesqueleto de quitina'); if (p > .3) lab(ax, ay, A.x1 - A.w * .2, A.y0 + A.h * .15, 'adulto novo, ainda mole'); }
    cap(T < 1.2 ? 'O exoesqueleto não cresce: a cigarra precisa trocar de casca.' : T < 8 ? 'Na <b>muda</b> (ecdise), a casca velha se abre nas costas e o animal sai, mole e vulnerável.' : 'As asas se enchem de líquido e o novo exoesqueleto endurece.');
  }
  function mosq(x, y, s, a, c) { bicho('mosquito', x, y, s, { c: c || C.txt, a }); }
  function drawAedes(t, S, A) {
    const T = t % 16, dr = S.dr = lerp(S.dr || 0, S.vira ? 1 : 0, 1 - Math.exp(-3 * Math.max(dtv(S), .016))), rx = Math.min(A.w * (NAR ? .36 : .27), 210), ry = rx * .42, cx = A.cx, cy = A.cy - (NAR ? 0 : 6), irx = rx * .64, iry = ry * .56;
    const fase = T < 3 ? 0 : T < 8 ? 1 : T < 11 ? 2 : 3;
    ell(cx, cy, rx, ry, 0, '#2B2F3A', '#6B7186', 3);
    X.save(); X.beginPath(); X.ellipse(cx, cy, irx, iry, 0, 0, TAU); X.clip(); X.fillStyle = '#12151F'; X.fillRect(cx - irx, cy - iry, irx * 2, iry * 2);
    const lv = lerp(cy - iry, cy + iry, dr); X.fillStyle = rgba(AZUL, .45); X.fillRect(cx - irx, lv, irx * 2, cy + iry - lv + 2);
    if (dr < .3) {
      if (fase === 1) for (let i = 0; i < 5; i++) { const x = cx - irx * .6 + i * irx * .3 + Math.sin(t * 2 + i) * 8, y = cy + Math.sin(t * 3 + i * 2) * iry * .3; line(x, y, x + 8, y + Math.sin(t * 9 + i) * 3, '#F4F0E0', 2.4); circ(x - 1, y, 2.4, '#F4F0E0'); }
      if (fase === 2) for (let i = 0; i < 3; i++) { const x = cx - irx * .4 + i * irx * .4, y = cy - iry * .15 + Math.sin(t * 2 + i) * 4; ell(x, y, 8, 5.5, 0, '#E8D9A8', '#8A7A44', 1.2); circ(x - 6, y - 3, 2, '#E8D9A8'); }
    }
    X.restore(); ell(cx, cy, irx, iry, 0, null, '#6B7186', 1.5);
    for (let i = 0; i < 16; i++) { const a = PI * (.08 + .84 * i / 15) + PI, x = cx + Math.cos(a) * irx * .98, y = cy + Math.sin(a) * iry * .98; if (T > .5 || dr > .5) ell(x, y, 2.6, 1.8, a, '#F4F0E0', null); }
    if (fase === 3 && dr < .3) { const u = ss(seg(T, 11, 14)); mosq(lerp(cx, cx + rx * .8, u), lerp(cy - iry * .3, A.y0 + 30, u), 44, 1 - ss(seg(T, 14, 16)) * .9); }
    ['ovo', 'larva', 'pupa', 'adulto'].forEach((s, i) => { const on = dr < .3 && fase === i, bw = 62, bx = A.cx - 2 * bw - 9 + i * (bw + 6); rr(bx, A.y0, bw, 26, 13, on ? rgba(ANI, .3) : 'rgba(19,26,43,.8)', on ? C.amber : C.line, on ? 2 : 1); mtx(s, bx + bw / 2, A.y0 + 13, { s: 12, w: 600, c: on ? C.txt : C.dim, bg: false }); });
    if (LB) { lab(cx + irx * .75, cy - iry * .6, A.x1 - A.w * .08, cy - ry - 4 > A.y0 + 40 ? cy - ry - 4 : A.y0 + 50, 'ovos na parede, acima da água'); lab(cx, cy + iry * .9, A.x0 + A.w * .2, A.y1 - 54, dr < .5 ? 'água parada e limpa' : 'sem água'); }
    btn(A.x0, A.y1 - 36, NAR ? 190 : 230, 34, S.vira ? 'Encher o pneu de novo' : 'Virar o pneu e esfregar', ANI, 'vira', { on: !!S.vira });
    cap(S.vira ? 'Sem água, a larva e a pupa não se desenvolvem: o ciclo para. Os <b>ovos</b> secos resistem por <b>mais de um ano</b>, por isso é preciso esfregar a parede.' : ['Os ovos ficam na parede, logo acima da água parada.', 'A <b>larva</b> vive na água e se contorce.', 'A <b>pupa</b> também vive na água. O adulto sai em cerca de 7 a 10 dias.', 'O <b>adulto</b> sai da água e voa: <i>Aedes aegypti</i>, vetor de dengue, zika e chikungunya.'][fase]);
  }
  const ART = quiz({
    nome: 'art', ops: ['inseto', 'aracnídeo', 'crustáceo', 'quilópode', 'diplópode'],
    itens: [{ t: 'barata', id: 'barata', k: 0, x: 'É inseto: 3 pares de patas e 1 par de antenas.' }, { t: 'aranha', id: 'aranha', k: 1, x: 'É aracnídeo: 4 pares de patas e nenhuma antena.' }, { t: 'escorpião', id: 'escorpiao', k: 1, x: 'É aracnídeo: 4 pares de patas e sem antenas.' }, { t: 'tatuzinho-de-jardim', id: 'tatuzinho', k: 2, x: 'É um crustáceo terrestre: tem 2 pares de antenas.' }, { t: 'carrapato', id: 'carrapato', k: 1, x: 'É aracnídeo, não inseto: 4 pares de patas e sem antenas.' }, { t: 'borboleta', id: 'borboleta', k: 0, x: 'É inseto: 3 pares de patas, 1 par de antenas e asas.' }, { t: 'piolho-de-cobra', id: 'piolhocobra', k: 4, x: 'É diplópode: 2 pares de patas por segmento; é inofensivo.' }, { t: 'barbeiro', id: 'barbeiro', k: 0, x: 'É inseto: 3 pares de patas; tem metamorfose incompleta.' }, { t: 'camarão', id: 'camarao', k: 2, x: 'É crustáceo: 2 pares de antenas e respira por brânquias.' }, { t: 'lacraia', id: 'lacraia', k: 3, x: 'É quilópode: 1 par de patas por segmento; é venenosa.' }].map(i => Object.assign({ dica: 'Conte as patas e as antenas na silhueta: 3 pares é inseto; 4 pares e sem antenas, aracnídeo; 2 pares de antenas, crustáceo; muitos segmentos com patas, quilópode ou diplópode.' }, i)),
    fim: (o, n) => `Você acertou ${o} de ${n} de primeira.`
  });
  const ORG = [['Barbeiro', ['ovo', 'ninfa, sem asas', 'adulto, com asas'], 'hemimetábolo: a ninfa parece o adulto e cresce por mudas.', [2, 0, 1]], ['Borboleta', ['ovo', 'lagarta (larva)', 'crisálida (pupa)', 'adulto'], 'holometábolo: metamorfose completa.', [3, 1, 0, 2]], ['Mosquito', ['ovo na parede', 'larva na água', 'pupa na água', 'adulto'], 'holometábolo: larva e pupa vivem na água; por isso se eliminam os criadouros.', [2, 0, 3, 1]], ['Traça-dos-livros', ['ovo', 'filhote parecido com o adulto', 'adulto'], 'ametábolo: sem metamorfose.', [2, 0, 1]]];
  function drawMeta(t, S, A) {
    let y = A.y0; y += chips(S, ORG.map(o => o[0]), A.x0, y, A.w, NAR ? 2 : 4, NAR ? 30 : 34, 'o', { on: i => S.mo === i }) + 14;
    if (S.mo == null) { wrapTx('Escolha um inseto e toque nas fases na ordem em que aparecem.', A.x0, y + 8, A.w, { s: 13, lh: 16, a: 'left', c: C.dim }); cap(S.msg || 'Que metamorfose? Ordene as fases de cada inseto.'); return; }
    const o = ORG[S.mo], n = o[1].length, sq = S.mseq;
    mtx(`Ordene as fases do <b>${o[0]}</b>`, A.x0, y + 4, { s: 14, a: 'left', c: C.amber }); y += 24;
    const lst = o[3].map(i => o[1][i]), cols = NAR ? 1 : 2;
    chips(S, lst.map((s, k) => { const pos = sq.indexOf(o[3][k]); return pos >= 0 ? `${pos + 1}. ${s}` : s; }), A.x0, y, A.w, cols, NAR ? 32 : 36, 'p', { on: k => sq.includes(o[3][k]), dn: k => sq.includes(o[3][k]) });
    cap(S.msg || 'Toque nas fases na ordem em que aparecem no ciclo de vida.');
  }
  def('animalia', 'artropodes', {
    t: 'Artrópodes', s: 'exoesqueleto, patas articuladas e o maior grupo de animais', c: ANI,
    loc: S => ({ silh: 'Quatro silhuetas', muda: 'A muda', aedes: 'Ciclo do <i>Aedes aegypti</i>', cart: 'Inseto ou não?', meta: 'Que metamorfose?' })[S.modo] || '', locNota: S => S.modo === 'cart' || S.modo === 'meta' ? '' : NOTA,
    ctlVis: S => S.modo === 'muda' || S.modo === 'aedes',
    alt: 'silhuetas de formiga, aranha, camarão e lacraia com as partes do corpo, patas e antenas contadas, a muda de uma cigarra, o ciclo do Aedes aegypti num pneu com água que para ao virar o pneu, um jogo de classificar dez artrópodes e um de ordenar as fases da metamorfose',
    still: 6, extra: [modo('silh', 'Silhuetas'), modo('muda', 'A muda'), modo('aedes', '<i>Aedes aegypti</i>'), modo('cart', 'Inseto ou não?'), modo('meta', 'Que metamorfose?')],
    init(S) { S.modo = 'silh'; S.sa = 0; S.vira = false; S.dr = 0; S.mo = null; S.mseq = []; ART.zera(S); },
    d: TXT.A5.d + '<p>Toque nas silhuetas para contar patas e antenas, veja a muda e o ciclo do <i>Aedes</i> (vire o pneu para parar o ciclo). Depois classifique os dez bichos e ordene as fases da metamorfose.</p>', enem: TXT.A5.enem,
    links: [['Arboviroses nos Vírus', '../virus/index.html'], LK.clado],
    tap(x, y, S) {
      if (S.modo === 'cart') { ART.tap(x, y, S); return; }
      const h = idTap(S, x, y); if (!h) return;
      if (S.modo === 'silh' && h[0] === 'a') S.sa = +h.slice(1);
      else if (S.modo === 'aedes' && h === 'vira') S.vira = !S.vira;
      else if (S.modo === 'meta') {
        if (h[0] === 'o') { S.mo = +h.slice(1); S.mseq = []; S.msg = null; }
        else if (h[0] === 'p' && S.mo != null) { const o = ORG[S.mo], k = +h.slice(1), idx = o[3][k]; if (S.mseq.includes(idx)) return; if (idx === S.mseq.length) { S.mseq.push(idx); S.msg = S.mseq.length === o[1].length ? `<b>Certo.</b> ${o[0]}: ${o[2]}` : null; } else { flash(S, 'p', k); S.msg = '<b>Ainda não.</b> Qual fase vem primeiro? Lembre que tudo começa pelo ovo.'; } }
      }
    },
    draw(t, S) { const A = area(); if (S.modo === 'silh') drawSilh(t, S, A); else if (S.modo === 'muda') drawMuda(t, S, A); else if (S.modo === 'aedes') drawAedes(t, S, A); else if (S.modo === 'cart') ART.draw(S, A, 'Que grupo é esse? Conte as patas e as antenas.'); else drawMeta(t, S, A); }
  });

  // ---------- A6: equinodermos, cordados e peixes ----------
  function drawEstr(t, S, A) {
    const cx = A.cx - (NAR ? 0 : A.w * .12), cy = A.cy + (NAR ? 24 : 0), L = Math.min(A.w * (NAR ? .36 : .2), A.h * .3), ar = [];
    for (let i = 0; i < 5; i++) {
      const a = -PI / 2 + i * TAU / 5, dx = Math.cos(a), dy = Math.sin(a), nx = -dy, ny = dx, bw = L * .2, r0 = L * .1;
      shape([[cx + dx * r0 + nx * bw, cy + dy * r0 + ny * bw], [cx + dx * L, cy + dy * L], [cx + dx * r0 - nx * bw, cy + dy * r0 - ny * bw]], rgba('#E58B5A', .5), '#E58B5A', 2);
      line(cx, cy, cx + dx * L * .92, cy + dy * L * .92, AZUL, 3);
      for (let j = 1; j <= 7; j++) { const r = L * (.14 + j * .115), w = bw * (1 - j / 9) * .8 + 2, px = cx + dx * r, py = cy + dy * r, o = Math.sin(t * 4 + j + i) * 2.5 + 6; for (const sd of [-1, 1]) { line(px + nx * w * sd, py + ny * w * sd, px + nx * (w + o) * sd, py + ny * (w + o) * sd, '#F7D9A8', 1.6); circ(px + nx * (w + o) * sd, py + ny * (w + o) * sd, 2.2, '#F7D9A8'); } }
    }
    circ(cx, cy, L * .15, rgba('#E58B5A', .8), '#E58B5A', 2); circ(cx, cy, L * .05, GUT);
    const tx0 = cx, ty0 = cy - L, g = 3 + 5 * (.5 + .5 * Math.sin(t * 1.5)); X.save(); X.translate(tx0, ty0 - L * .12);
    X.beginPath(); X.ellipse(0, -g, L * .2, L * .1, 0, PI, TAU); X.fillStyle = rgba('#C9B38A', .7); X.fill(); X.strokeStyle = '#C9B38A'; X.lineWidth = 2; X.stroke();
    X.beginPath(); X.ellipse(0, g, L * .2, L * .1, 0, 0, PI); X.fill(); X.stroke(); X.restore();
    // larva bilateral
    const lx = A.x1 - (NAR ? 56 : 110), ly = A.y1 - (NAR ? 44 : 60); ell(lx, ly, 22, 12, 0, rgba('#E58B5A', .4), '#E58B5A', 1.8); line(lx - 22, ly, lx + 22, ly, C.dim, 1, [3, 3]);
    mtx('larva: simetria bilateral', lx, ly + 24, { s: 12, c: C.txt }); mtx('adulto: simetria radial, em cinco partes', A.x0 + 6, A.y1 - 8, { s: 12, a: 'left', c: C.txt });
    if (LB) { lab(cx + L * .5 * Math.cos(-PI / 2 + TAU / 5) , cy + L * .5 * Math.sin(-PI / 2 + TAU / 5), A.x1 - A.w * .08, A.y0 + A.h * .3, 'pés ambulacrais, com ventosa'); lab(cx + L * .6 * Math.cos(-PI / 2 + 2 * TAU / 5), cy + L * .6 * Math.sin(-PI / 2 + 2 * TAU / 5), A.x1 - A.w * .08, A.y0 + A.h * .62, 'canal com água do mar'); lab(tx0, ty0 - L * .12, A.x0 + A.w * .08, A.y0 + A.h * .12, 'concha sendo aberta'); lab(cx, cy, A.x0 + A.w * .08, A.y0 + A.h * .8, 'boca, vista por baixo'); }
    cap('A novidade dos <b>equinodermos</b> é o <b>sistema ambulacral</b>: canais com água do mar que terminam nos <b>pés ambulacrais</b>, usados para andar, se prender e abrir conchas. São deuterostômios, como nós.');
  }
  const FT4 = ['notocorda', 'tubo nervoso dorsal', 'fendas faríngeas', 'cauda pós-anal'], FC = [END, ECT, MES, '#B38CFF'];
  function cordado(tp, cx, cy, s, on) {
    const g = '#9DA9C4', f = rgba(g, .18); const ln = (a, b, c, d, col, w) => line(cx + a * s, cy + b * s, cx + c * s, cy + d * s, col, w);
    if (tp === 0) ell(cx, cy, .5 * s, .12 * s, 0, f, g, 1.6);
    else if (tp === 1) { ell(cx + .2 * s, cy, .22 * s, .14 * s, 0, f, g, 1.6); shape([[cx - .05 * s, cy - .08 * s], [cx - .5 * s, cy - .015 * s], [cx - .5 * s, cy + .015 * s], [cx - .05 * s, cy + .08 * s]], f, g, 1.6); }
    else if (tp === 2) { circ(cx + .28 * s, cy - .02 * s, .15 * s, f, g, 1.6); ell(cx, cy + .02 * s, .28 * s, .14 * s, 0, f, g, 1.6); shape([[cx - .22 * s, cy - .02 * s], [cx - .42 * s, cy + .1 * s], [cx - .22 * s, cy + .08 * s]], f, g, 1.6); }
    else { rr(cx - .14 * s, cy - .1 * s, .28 * s, .26 * s, 8, f, g, 1.6); ln(-.08, -.1, -.1, -.22, g, 4); ln(.08, -.1, .1, -.22, g, 4); for (let i = 0; i < 5; i++) ln(-.1 + i * .05, -.02, -.1 + i * .05, .11, MES, 2); return; }
    const X0 = [-.46, -.46, -.36], X1 = [.44, -.02, .4], Y = [0, 0, .03];
    if (on[0]) ln(X0[tp], Y[tp], X1[tp], Y[tp], END, 3);
    if (on[1]) ln(X0[tp], Y[tp] - .05, X1[tp] + (tp === 2 ? -.02 : 0), Y[tp] - .05 - (tp === 2 ? .04 : 0), ECT, 3);
    if (on[2]) { const x0 = [.08, .1, .2][tp], dx = [.07, .045, .035][tp]; for (let i = 0; i < 5; i++) ln(x0 + i * dx, Y[tp] + .01, x0 + i * dx, Y[tp] + .09, MES, 2.2); }
    if (on[3]) { const a = [-.5, -.5, -.42][tp], b = [-.32, -.05, -.24][tp], yy = [.17, .12, .17][tp]; ln(a, yy, b, yy, '#B38CFF', 2.4); ln(a, yy - .02, a, yy + .02, '#B38CFF', 2.4); ln(b, yy - .02, b, yy + .02, '#B38CFF', 2.4); circ(cx + b * s, cy + (Y[tp] + .03) * s, 3, '#B38CFF'); mtx('ânus', cx + b * s + 6, cy + (Y[tp] + .03) * s, { s: 10 }); }
  }
  function drawCord(t, S, A) {
    const rows = Math.ceil(5 / (NAR ? 2 : 5)), chH = rows * ((NAR ? 28 : 32) + 8) - 8, cy0 = A.y1 - chH;
    const nm = ['anfioxo (protocordado)', S.ad ? 'ascídia adulta' : 'larva de ascídia', 'embrião humano (esquemático)'], wide = !NAR, cw = A.w / 3, rh = (cy0 - A.y0 - 6) / 3;
    for (let i = 0; i < 3; i++) {
      const tp = i === 1 && S.ad ? 3 : i, s = wide ? Math.min(cw * .85, 220) : Math.min(A.w * .5, 190, rh * 2.4), cx = wide ? A.x0 + cw * (i + .5) : A.cx + (NAR ? 40 : 0), cy = wide ? A.y0 + (cy0 - A.y0) * .45 : A.y0 + rh * (i + .6);
      cordado(tp, cx, cy, s, S.on);
      if (wide) mtx(`<b>${nm[i]}</b>`, cx, cy - s * .38, { s: 13, c: C.txt }); else mtx(`<b>${nm[i]}</b>`, A.x0 + 4, cy - rh * .38, { s: 12, a: 'left', c: C.txt });
    }
    FT4.forEach((n, i) => { const cols = NAR ? 2 : 5, cw2 = (A.w - (cols - 1) * 8) / cols, x = A.x0 + (i % cols) * (cw2 + 8), y = cy0 + Math.floor(i / cols) * ((NAR ? 28 : 32) + 8), on = S.on[i]; rr(x, y, cw2, NAR ? 28 : 32, 8, on ? rgba(FC[i], .22) : 'rgba(19,26,43,.94)', FC[i], on ? 2.2 : 1.2); mtx(n, x + cw2 / 2, y + (NAR ? 14 : 16), { s: NAR ? 12 : 13, w: 600, c: C.txt, bg: false }); hitR(x, y, cw2, NAR ? 28 : 32, 'x' + i); });
    { const cols = NAR ? 2 : 5, cw2 = (A.w - (cols - 1) * 8) / cols, x = A.x0 + (4 % cols) * (cw2 + 8), y = cy0 + Math.floor(4 / cols) * ((NAR ? 28 : 32) + 8); rr(x, y, cw2, NAR ? 28 : 32, 8, S.ad ? rgba(ANI, .25) : 'rgba(19,26,43,.94)', ANI, S.ad ? 2.2 : 1.2); mtx('Ascídia adulta', x + cw2 / 2, y + (NAR ? 14 : 16), { s: NAR ? 12 : 13, w: 600, c: C.txt, bg: false }); hitR(x, y, cw2, NAR ? 28 : 32, 'xa'); }
    cap(S.ad ? 'O <b>adulto de ascídia</b> vive fixo e perde a notocorda, a cauda e o tubo nervoso, mas <b>mantém as fendas faríngeas</b>, que usa para filtrar a água.' : 'As <b>quatro características dos cordados</b> aparecem, ao menos no embrião, nos três: o mesmo traço, a mesma cor. No embrião humano, as fendas viram partes do ouvido e da garganta.');
  }
  function drawOsmo(t, S, A) {
    const wide = !NAR, aw = wide ? A.w * .46 : A.w, ah = wide ? A.h - 70 : Math.min(160, A.h * .34), dt = dtv(S), fx = A.x0 + aw / 2, fy = A.y0 + ah / 2;
    const dw = (S.env ? -1.5 : 1.5) + (S.be ? 2 : 0) + (S.ur ? -.5 : -1.5), ds = (S.env ? 1 : -1) + (S.sa ? -1 : 1);
    S.w = cl(S.w + dw * dt * 4, 0, 100); S.s = cl(S.s + ds * dt * 4, 0, 100); const ok = S.w > 35 && S.w < 65 && S.s > 35 && S.s < 65; S.okT = ok ? S.okT + dt : 0;
    rr(A.x0, A.y0, aw, ah, 12, S.env ? rgba('#2F6FDB', .28) : rgba('#7CC4FF', .12), C.line, 1); mtx(S.env ? 'água do mar (salgada)' : 'água doce', A.x0 + 10, A.y0 + 14, { s: 12, a: 'left', c: C.dim });
    const sc = (1 + (S.w - 50) / 110) * Math.min(1, aw / 330), col = ok ? C.txt : S.w > 65 ? '#9BE08A' : S.w < 35 ? C.erro : C.amber;
    bicho('peixe', fx, fy, Math.min(120, ah * .55) * sc, { c: col });
    const ar = S.env ? -1 : 1, R = Math.min(120, ah * .55) * .55;
    for (let i = 0; i < 4; i++) { const f = fr(t * .5 + i * .25), y = fy + (i - 1.5) * R * .4; for (const sd of [-1, 1]) { const x1 = fx + sd * (R * 1.3 - ar * f * R * .5); circ(x1, y + (sd > 0 ? 6 : -6), 2.6, rgba(AZUL, .9)); } }
    mtx(S.env ? 'a água sai do corpo por osmose' : 'a água entra no corpo por osmose', fx, A.y0 + ah - 12, { s: 12, c: AZUL });
    if (S.be) for (let i = 0; i < 3; i++) { const f = fr(t * .6 + i / 3); circ(lerp(fx + R * 1.4, fx + R * .9, f), lerp(fy - R * .5, fy - R * .05, f), 2.6, '#9DD0FF'); }
    for (let i = 0; i < (S.ur ? 2 : 6); i++) { const f = fr(t * (S.ur ? .35 : .7) + i * .17); circ(fx - R * 1.1 - f * 26, fy + R * .1 + f * 10, S.ur ? 3 : 2.8, S.ur ? '#E3C14A' : rgba('#E8E3A0', .5), S.ur ? '#8A6D1A' : '#B8B070', 1); }
    for (let i = 0; i < 3; i++) { const f = fr(t * .5 + i / 3), dir = S.sa ? -1 : 1; circ(lerp(fx + R * (S.sa ? .5 : 1.3), fx + R * (S.sa ? 1.3 : .5), f) , fy + R * .3 + (i - 1) * 6, 2.4, '#FFD27F'); }
    // medidores
    const my = A.y0 + ah + 12, mw = aw; [['água no corpo', S.w], ['sal no corpo', S.s]].forEach(([n, v], i) => { const y = my + i * 28; mtx(n, A.x0, y + 6, { s: 12, a: 'left', c: C.dim }); rr(A.x0 + 108, y, mw - 108, 12, 6, 'rgba(19,26,43,.9)', C.line, 1); rr(A.x0 + 108 + (mw - 108) * .35, y, (mw - 108) * .3, 12, 3, rgba(C.ok, .25)); const bx = A.x0 + 108 + (mw - 108) * v / 100; circ(bx, y + 6, 6, v > 35 && v < 65 ? C.ok : C.erro, GUT, 1.5); });
    // controles
    const cx0 = wide ? A.x0 + aw + 18 : A.x0, cw = wide ? A.x1 - cx0 : A.w; let y = wide ? A.y0 : my + 62;
    ['Água doce', 'Água do mar'].forEach((s, i) => btn(cx0 + i * (cw / 2 + 3), y, cw / 2 - 3, 32, s, AZUL, 'e' + i, { on: S.env === i }));
    y += 44; [['Beber água', 'be', ['não', 'sim']], ['Urina', 'ur', ['muita e diluída', 'pouca e concentrada']], ['Sal nas brânquias', 'sa', ['absorve', 'elimina']]].forEach(([n, k, ops]) => {
      mtx(n, cx0, y + 4, { s: 13, a: 'left', c: C.txt }); y += 18; ops.forEach((s, j) => btn(cx0 + j * (cw / 2 + 3), y, cw / 2 - 3, 30, s, ANI, k + j, { on: S[k] === j, s: 12 })); y += 42;
    });
    cap(S.okT > 3 ? '<b>Equilíbrio.</b> ' + (S.env ? 'O peixe marinho perde água e por isso <b>bebe água do mar</b>, faz <b>pouca urina</b> e <b>elimina sal pelas brânquias</b>.' : 'O peixe de água doce ganha água sem parar e por isso <b>não bebe</b>, faz <b>muita urina diluída</b> e absorve sal pelas brânquias.') : S.w > 65 ? 'Entra água demais: o peixe está inchando.' : S.w < 35 ? 'O peixe está perdendo água: desidratando.' : S.s > 65 ? 'Sal demais no corpo.' : S.s < 35 ? 'Falta sal no corpo.' : 'Ajuste os três controles para manter o peixe saudável nesse ambiente.');
  }
  const TUB = baralho({
    nome: 'tub', alvos: [{ t: 'tubarão (cartilaginoso)', c: '#7CC4FF' }, { t: 'tilápia (ósseo)', c: '#FFB347' }],
    cartas: [{ t: 'esqueleto de cartilagem', k: 0, x: 'os tubarões têm esqueleto de cartilagem.' }, { t: 'bexiga natatória', k: 1, x: 'só os peixes ósseos têm bexiga natatória.' }, { t: 'opérculo sobre as brânquias', k: 1, x: 'o opérculo é a tampa das brânquias dos ósseos.' }, { t: 'fígado cheio de óleo para flutuar', k: 0, x: 'sem bexiga natatória, o óleo do fígado ajuda a flutuar.' }, { t: 'escamas como dentinhos', k: 0, x: 'as escamas dos tubarões lembram pequenos dentes.' }, { t: 'ureia no sangue', k: 0, x: 'a ureia deixa o corpo quase tão concentrado quanto o mar.' }],
    certo: c => '<b>Certo.</b> ' + c.x.charAt(0).toUpperCase() + c.x.slice(1), errado: c => `<b>Ainda não.</b> "${c.t}" não vai aí. Pense em cartilagem, bexiga natatória, opérculo e ureia.`,
    fim: () => '<b>Pronto.</b> Tubarões e raias são peixes cartilaginosos; a grande maioria dos peixes é óssea.', dica: 'Toque num cartão e depois no lugar certo.'
  });
  def('animalia', 'cordados', {
    t: 'Equinodermos, cordados e peixes', s: 'os deuterostômios, a notocorda e a vida na água', c: ANI,
    loc: S => ({ estr: 'Estrela-do-mar', cord: 'Quatro características dos cordados', osmo: 'Água doce ou mar?', tub: 'Tubarão ou tilápia?' })[S.modo] || '', locNota: S => S.modo === 'tub' || S.modo === 'osmo' ? '' : NOTA,
    ctlVis: S => S.modo === 'estr',
    alt: 'uma estrela-do-mar vista por baixo com os pés ambulacrais abrindo uma concha, o anfioxo, a larva de ascídia e um embrião humano com as quatro características dos cordados em cores, um peixe ósseo em água doce ou do mar com controles de beber água, urina e sal, e um jogo tubarão ou tilápia',
    still: 5, extra: [modo('estr', 'Estrela-do-mar'), modo('cord', 'Cordados'), modo('osmo', 'Água doce ou mar?'), modo('tub', 'Tubarão ou tilápia?')],
    init(S) { S.modo = 'estr'; S.on = [true, true, true, true]; S.ad = false; S.env = 0; S.be = 0; S.ur = 1; S.sa = 0; S.w = 50; S.s = 50; S.okT = 0; TUB.zera(S); },
    d: TXT.A6.d + '<p>Veja a estrela-do-mar e compare os três cordados, ligando e desligando cada característica. No aquário, ajuste o peixe ao ambiente. Depois separe as características do tubarão e da tilápia.</p>', enem: TXT.A6.enem,
    links: [LK.clado, LK.folhetos, LK.blastoporo],
    tap(x, y, S) {
      if (S.modo === 'tub') { TUB.tap(x, y, S); return; }
      const h = idTap(S, x, y); if (!h) return;
      if (S.modo === 'cord') { if (h === 'xa') S.ad = !S.ad; else if (h[0] === 'x') S.on[+h[1]] = !S.on[+h[1]]; }
      else if (S.modo === 'osmo') { const m = h.match(/^(be|ur|sa)(\d)$/); if (m) S[m[1]] = +m[2]; else if (h[0] === 'e') { S.env = +h.slice(1); S.w = 50; S.s = 50; S.okT = 0; } }
    },
    grab(x, y, S) { return S.modo === 'tub' && TUB.grab(x, y, S); }, grabMove(x, y, S) { TUB.grabMove(x, y, S); }, grabEnd(x, y, S) { TUB.grabEnd(x, y, S); },
    draw(t, S) { const A = area(); if (S.modo === 'estr') drawEstr(t, S, A); else if (S.modo === 'cord') drawCord(t, S, A); else if (S.modo === 'osmo') drawOsmo(t, S, A); else cartas(TUB, S, A, 6, 'Leve cada característica ao peixe certo.', NAR ? 2 : 3, NAR ? 44 : 50); }
  });

  // ---------- A7: anfíbios, répteis, aves e mamíferos ----------
  const RED = '#E5484D', BLU = '#4D7CFF', MIXC = '#A66BD6';
  function coracao(x, y, w, tp, t) {
    const h = w, k = 1 + .04 * Math.sin(t * 5); X.save(); X.translate(x, y + h / 2); X.scale(k, k); X.translate(-x, -(y + h / 2));
    const R = (a, b, c, d, f) => rr(a, b, c, d, 7, rgba(f, .75), f, 1.6);
    if (tp === 0) { R(x - w * .3, y, w * .6, h * .4, BLU); R(x - w * .3, y + h * .45, w * .6, h * .55, BLU); }
    else if (tp === 3) { R(x - w * .5, y, w * .48, h * .4, RED); R(x + w * .02, y, w * .48, h * .4, BLU); R(x - w * .5, y + h * .45, w * .48, h * .55, RED); R(x + w * .02, y + h * .45, w * .48, h * .55, BLU); }
    else { R(x - w * .5, y, w * .48, h * .4, RED); R(x + w * .02, y, w * .48, h * .4, BLU); R(x - w * .5, y + h * .45, w, h * .55, MIXC); if (tp === 2) line(x, y + h, x, y + h * .72, '#fff', 2.4); else for (let i = 0; i < 4; i++) circ(x - w * .3 + ((t * 20 + i * 17) % (w * .6)), y + h * .72 + Math.sin(t * 3 + i) * h * .1, 2.4, i % 2 ? RED : BLU); }
    X.restore();
  }
  const AN7 = [['peixe', 'Peixe ósseo', 0, '2 cavidades', 'amônia', 'água', 'Brânquias; coração com 2 cavidades e circulação simples; ectotérmico; excreta amônia; ovos sem casca, na água.'], ['sapo', 'Anfíbio', 1, '3 cavidades', 'amônia (girino) e ureia (adulto)', 'água e terra úmida', 'Girino com brânquias; adulto com pulmões e pele úmida; 3 cavidades e circulação dupla incompleta (o sangue se mistura no ventrículo); ectotérmico; ovos sem casca, na água.'], ['lagarto', 'Réptil', 2, '3 cavidades com septo parcial', 'ácido úrico', 'terra seca', 'Pulmões; pele de queratina; 3 cavidades com septo parcial (4 nos jacarés); ectotérmico; ácido úrico; ovo amniótico, com casca.'], ['ave', 'Ave', 3, '4 cavidades', 'ácido úrico', 'terra e ar', 'Penas, ossos ocos e sacos aéreos; 4 cavidades e circulação dupla e completa; endotérmica; ácido úrico; ovo com casca.'], ['cao', 'Mamífero', 3, '4 cavidades', 'ureia', 'terra, ar e água', 'Pelos, glândulas mamárias e diafragma; 4 cavidades; endotérmico; ureia; a maioria tem placenta.']];
  function drawLinha(t, S, A) {
    const cw = A.w / 5, s = Math.min(cw * .6, A.h * .16), hw = Math.min(cw * .42, A.h * .13); line(A.x0, A.y0 + 8, A.x1, A.y0 + 8, AZUL, 2); if (!NAR) mtx('da água para a terra', A.x0 + 4, A.y0 + 22, { s: 12, a: 'left', c: C.dim });
    let lx = A.x1; [[MIXC, 'misturado'], [BLU, 'pobre em oxigênio'], [RED, 'rico em oxigênio']].forEach(([c, s2]) => { const w = mtw(s2, 12, 400); lx -= w; mtx(s2, lx, A.y0 + 22, { s: 12, a: 'left', c: C.txt }); lx -= 16; rr(lx, A.y0 + 16, 12, 12, 3, c); lx -= 14; });
    AN7.forEach(([id, n, hp, hs, ex, env, info], i) => {
      const x = A.x0 + cw * (i + .5), on = S.sa === i; rr(A.x0 + cw * i + 2, A.y0 + 34, cw - 4, A.h - 34, 10, on ? rgba(ANI, .12) : 'rgba(19,26,43,.5)', on ? C.amber : C.line, on ? 2 : 1); hitR(A.x0 + cw * i, A.y0 + 34, cw, A.h - 34, 'a' + i);
      mtx(`<b>${n}</b>`, x, A.y0 + 50, { s: NAR ? 12 : 14, c: C.txt }); bicho(id, x, A.y0 + 58 + s / 2, s, { c: C.txt });
      const hy = A.y0 + 66 + s; coracao(x, hy, hw, hp, t); const th = wrapTx(hs, x, hy + hw + 14, cw - 10, { s: 12, lh: 14, c: C.txt }); const ey = hy + hw + 14 + th + 10; for (let k = 0; k < 3; k++) { if (ex.startsWith('ácido')) ell(x - 14 + k * 14, ey, 6, 4, 0, '#F4F0E0', '#9DA9C4', 1); else circ(x - 14 + k * 14, ey, 4, ex.startsWith('ureia') ? '#E3C14A' : '#9DD0FF'); }
      wrapTx(ex, x, ey + 16, cw - 10, { s: 12, lh: 14, c: C.dim });
    });
    cap(`<b>${AN7[S.sa][1]}:</b> ${AN7[S.sa][6]} Toque nos animais para ver os detalhes.`);
  }
  const QCL = ['peixes ósseos', 'anfíbios', 'répteis', 'aves', 'mamíferos'], QRW = ['respiração', 'coração', 'temperatura do corpo', 'excreta principal', 'ovo e fecundação', 'cobertura do corpo'];
  const QV = [
    ['brânquias', 'brânquias no girino; pulmões e pele no adulto', 'pulmões', 'pulmões com sacos aéreos', 'pulmões, com diafragma'],
    ['2 cavidades', '3 cavidades', '3 cavidades com septo parcial (4 nos jacarés)', '4 cavidades', '4 cavidades'],
    ['ectotérmico', 'ectotérmico', 'ectotérmico', 'endotérmico', 'endotérmico'],
    ['amônia', 'amônia no girino; ureia no adulto', 'ácido úrico', 'ácido úrico', 'ureia'],
    ['sem casca, na água; fecundação quase sempre externa', 'sem casca, na água; fecundação quase sempre externa', 'amniótico, com casca; fecundação interna', 'amniótico, com casca; fecundação interna', 'fecundação interna; a maioria com placenta'],
    ['escamas', 'pele lisa, úmida, com glândulas', 'escamas de queratina', 'penas', 'pelos']
  ];
  const QO = QV.map(r => [...new Set(r)]);
  function drawQuadro7(t, S, A) {
    const wide = !NAR; let y = A.y0; y += chips(S, QCL, A.x0, y, A.w, wide ? 5 : 3, NAR ? 28 : 32, 'c', { on: i => S.qc === i, dn: i => QRW.every((_, r) => S.q[r + ':' + i]) }) + 10;
    const lw = wide ? A.w * .5 - 8 : A.w, rh = NAR ? 32 : 36, n = Object.keys(S.q).length;
    mtx(`<b>${QCL[S.qc]}</b>  (${n} de 30)`, A.x0, y + 6, { s: 14, a: 'left', c: C.amber }); y += 22; const y0 = y;
    QRW.forEach((r, i) => {
      const done = S.q[i + ':' + S.qc], on = S.qr === i; rr(A.x0, y, lw, rh - 4, 8, on ? rgba(ANI, .18) : 'rgba(19,26,43,.9)', done ? C.ok : on ? C.amber : C.line, on ? 2 : 1.2); hitR(A.x0, y, lw, rh - 4, 'r' + i);
      mtx(r, A.x0 + 8, y + (rh - 4) / 2 - (done ? 7 : 0), { s: 12, a: 'left', c: C.dim }); if (done) wrapTx(QV[i][S.qc], A.x0 + 8, y + (rh - 4) / 2 + 8, lw - 16, { s: 12, lh: 13, a: 'left', c: C.txt }); else mtx('?', A.x1 - (wide ? A.w * .5 : 0) - 14, y + (rh - 4) / 2, { s: 14, c: C.dim });
      y += rh;
    });
    const ox = wide ? A.x0 + A.w * .5 + 8 : A.x0, oy = wide ? y0 : y + 8, ow = wide ? A.w * .5 - 8 : A.w;
    if (S.qr != null && !S.q[S.qr + ':' + S.qc]) { mtx(`Qual é a ${QRW[S.qr]} de <b>${QCL[S.qc]}</b>?`, ox, oy + 4, { s: 13, a: 'left', c: C.txt }); chips(S, QO[S.qr], ox, oy + 18, ow, NAR ? 1 : 1, NAR ? 32 : 36, 'o'); }
    else if (S.qr == null) mtx('Escolha uma linha para responder.', ox, oy + 6, { s: 13, a: 'left', c: C.dim });
    cap(S.msg || 'Escolha o grupo, depois uma linha, e toque na resposta certa. O ovo amniótico e a placenta estão na Embriologia.');
  }
  const PEG = quiz({
    nome: 'peg', ops: ['peixe', 'anfíbio', 'réptil', 'ave', 'mamífero'],
    itens: [{ t: 'baleia', id: 'baleia', k: 4, x: 'É mamífero: respira por pulmões, tem pelos, glândulas mamárias e diafragma.' }, { t: 'pinguim', k: 3, x: 'É ave: tem penas e põe ovos com casca. Não voa, mas é ave.' }, { t: 'cobra-cega', k: 1, x: 'É anfíbio: sem patas, mas de pele úmida e sem escamas de queratina.' }, { t: 'morcego', id: 'morcego', k: 4, x: 'É mamífero: tem pelos e amamenta, e voa com as asas de pele.' }, { t: 'ornitorrinco', k: 4, x: 'É mamífero: tem pelos e glândulas mamárias, embora ponha ovos.' }, { t: 'tartaruga-marinha', id: 'tartaruga', k: 2, x: 'É réptil: pele de queratina, respira por pulmões e põe ovos com casca.' }].map(i => Object.assign({ dica: 'Pense na cobertura do corpo, na respiração e no jeito de se reproduzir, não no ambiente onde vive.' }, i)),
    fim: (o, n) => `Você acertou ${o} de ${n} de primeira.`
  });
  def('animalia', 'vertebrados', {
    t: 'Anfíbios, répteis, aves e mamíferos', s: 'da água para a terra: pulmão, ovo com casca, penas, pelos e sangue quente', c: ANI,
    loc: S => ({ linha: 'Da água para a terra', quadro: 'Quadro dos vertebrados', peg: 'Animais pegadinha' })[S.modo] || '', locNota: S => S.modo === 'peg' || S.modo === 'quadro' ? '' : NOTA,
    ctlVis: S => S.modo === 'linha',
    alt: 'uma linha do tempo da água para a terra com peixe, anfíbio, réptil, ave e mamífero, o coração esquemático de cada um (duas, três, três com septo parcial e quatro cavidades) e a excreta, um quadro para preencher e um jogo com animais pegadinha',
    still: 4, extra: [modo('linha', 'Da água para a terra'), modo('quadro', 'Quadro dos vertebrados'), modo('peg', 'Animais pegadinha')],
    init(S) { S.modo = 'linha'; S.sa = 2; S.q = {}; S.qc = 0; S.qr = 0; S.msg = null; S.fl = null; PEG.zera(S); },
    d: TXT.A7.d + '<p>Toque nos animais da linha do tempo. No quadro, escolha o grupo e responda linha por linha. No fim, resolva os animais pegadinha.</p>', enem: TXT.A7.enem,
    links: [LK.clado, LK.amniotico, LK.placenta, LK.ecologia],
    tap(x, y, S) {
      if (S.modo === 'peg') { PEG.tap(x, y, S); return; }
      const h = idTap(S, x, y); if (!h) return;
      if (S.modo === 'linha') { if (h[0] === 'a') S.sa = +h.slice(1); return; }
      if (h[0] === 'c') { S.qc = +h.slice(1); S.qr = QRW.findIndex((_, r) => !S.q[r + ':' + S.qc]); if (S.qr < 0) S.qr = 0; S.msg = null; }
      else if (h[0] === 'r') { S.qr = +h.slice(1); S.msg = null; }
      else if (h[0] === 'o' && S.qr != null) {
        const i = +h.slice(1), val = QO[S.qr][i];
        if (val === QV[S.qr][S.qc]) { S.q[S.qr + ':' + S.qc] = 1; const nx = QRW.findIndex((_, r) => !S.q[r + ':' + S.qc]); S.msg = nx < 0 ? `<b>Certo.</b> ${QCL[S.qc]} completo.` : '<b>Certo.</b>'; S.qr = nx < 0 ? null : nx; }
        else { flash(S, 'o', i); S.msg = '<b>Ainda não.</b> ' + (S.qr === 1 ? 'Lembre: o coração ganha divisões da água para a terra.' : S.qr === 3 ? 'Relacione a excreta ao ambiente: amônia na água, ureia em mamíferos, ácido úrico em quem põe ovo com casca.' : 'Pense na sequência da água para a terra.'); }
      }
    },
    draw(t, S) { const A = area(); if (S.modo === 'linha') drawLinha(t, S, A); else if (S.modo === 'quadro') drawQuadro7(t, S, A); else PEG.draw(S, A, 'Que classe é esse animal? Não se deixe enganar pela aparência.'); }
  });
}
