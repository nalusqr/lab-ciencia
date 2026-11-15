/* LAB, módulo Plantas e animais. Cenas da seção Plantae: V1 (conquista), V2 (briófitas), V3 (pteridófitas), V4 (gimnospermas), V5 (angiospermas) e V6 (raiz, caule e folha).
   Código da equipe (Aurelius). Textos: roteiro do Taxon revisado pelo Sapien (docs/revisao-biologia/seres-vivos-roteiro.md).
   Os parágrafos do aluno e os cartões "No ENEM" entre as marcas TXT vêm do roteiro. Uma só roda de ciclo de vida (roda) serve de V1 a V5. */
'use strict';
{
  const NOTA = 'Desenho esquemático, fora de escala';
  const VD = '#7FB85A', N2 = '#E58AB0', N1 = '#7FB2E5', ENDO = '#C9A227', XIL = '#5AA9FF', FLO = '#F28C3A', AM = C.amber, FOL = '#4E9A3E';
  const TXT = {};
  //TXT-INICIO
  TXT.V1 = { d: "<p>As plantas vieram de <b>algas verdes</b> de água doce. A prova do parentesco está nas células: as duas têm <b>clorofila <i>a</i> e <i>b</i></b>, guardam <b>amido</b> e têm parede de <b>celulose</b> (veja o modelo da célula vegetal, no módulo Célula). Sair da água, há cerca de <b>470 milhões de anos</b>, trouxe problemas que a alga não tinha: o ar <b>resseca</b>, não há água para <b>sustentar</b> o corpo, a água e os sais ficam no <b>solo</b> e a luz fica <b>no alto</b>, e os gametas não têm mais onde <b>nadar</b>. Cada grupo de plantas resolveu um pedaço desses problemas, e as soluções aparecem uma depois da outra no cladograma.</p><p>Todas as plantas têm <b>embrião</b> protegido dentro do corpo da mãe (por isso são chamadas de <b>embriófitas</b>) e uma <b>cutícula</b> de cera que reduz a perda de água. As <b>briófitas</b> (musgos) só têm isso: não têm vasos e ficam pequenas e em lugares úmidos. As <b>pteridófitas</b> (samambaias) ganharam <b>vasos condutores</b> (xilema e floema, reforçados com <b>lignina</b>), que levam água e alimento pelo corpo e permitem crescer para o alto, com raiz, caule e folha verdadeiros. As <b>gimnospermas</b> (pinheiros) ganharam a <b>semente</b> e o <b>grão de pólen</b>: o gameta masculino chega ao feminino pelo <b>tubo polínico</b>, sem precisar de água para nadar. As <b>angiospermas</b> (plantas com flores) ganharam a <b>flor</b> e o <b>fruto</b>, que ajudam a atrair polinizadores e a espalhar as sementes. Hoje, as angiospermas são de longe o grupo mais numeroso, com cerca de <b>300 mil espécies</b>.</p><p>O ciclo de vida das plantas tem <b>duas gerações</b> que se alternam (a <b>alternância de gerações</b>, ou ciclo <b>haplodiplobionte</b>). O <b>esporófito</b> é diploide (<b>2n</b>) e produz, por <b>meiose</b>, <b>esporos</b> haploides (<b>n</b>). Cada esporo germina e forma o <b>gametófito</b> (n), que produz <b>gametas</b> por <b>mitose</b>. Dois gametas se unem na <b>fecundação</b> e formam o <b>zigoto</b> (2n), que cresce e vira um novo esporófito. Note duas diferenças em relação aos animais: na planta, a meiose forma <b>esporos</b>, não gametas (meiose <b>espórica</b>), e os gametas vêm de mitose. Os outros dois tipos de ciclo são o <b>haplobionte</b> (o adulto é n e a meiose acontece logo no zigoto, como em muitas algas e fungos) e o <b>diplobionte</b> (o adulto é 2n e a meiose forma gametas, como nos animais). Ao longo da evolução das plantas, o gametófito foi <b>diminuindo</b> e o esporófito foi ficando <b>dominante</b>: nas briófitas, a planta que vemos é o gametófito; da samambaia em diante, é o esporófito.</p>", enem: "Guarde a sequência de <b>novidades</b>: <b>embrião</b> (todas), <b>vasos condutores</b> (de pteridófitas em diante), <b>semente</b> e <b>pólen</b> (de gimnospermas em diante), <b>flor e fruto</b> (só angiospermas). A independência da água para a <b>fecundação</b> vem com o <b>tubo polínico</b>. No ciclo, a <b>meiose forma esporos</b> e os <b>gametas vêm de mitose</b>; a geração dominante muda de <b>gametófito</b> (briófitas) para <b>esporófito</b> (demais grupos). É comum a questão trazer um cladograma ou uma tabela de \"presente ou ausente\" e pedir o grupo." };
  TXT.V2 = { d: "<p>As <b>briófitas</b> são os <b>musgos</b>, as <b>hepáticas</b> e os <b>antóceros</b>. Medem quase sempre poucos centímetros e vivem em <b>lugares úmidos e sombreados</b>: barrancos, troncos, pedras na beira de riachos, muros. Sem vasos condutores, a água passa de <b>célula em célula</b>, devagar, e isso limita o tamanho. Elas não têm raiz, caule e folha verdadeiros, e sim estruturas parecidas e mais simples: <b>rizoides</b> (fixam a planta), <b>cauloide</b> e <b>filoides</b>.</p><p>Nas briófitas, a planta verde que vemos é o <b>gametófito</b> (n), a geração <b>duradoura</b>. Na ponta dos gametófitos ficam os órgãos que formam gametas: o <b>anterídio</b>, que produz <b>anterozoides</b> com flagelos, e o <b>arquegônio</b>, que guarda a <b>oosfera</b>. Na maioria dos musgos, há gametófitos masculinos e femininos separados. O anterozoide precisa <b>nadar numa película de água</b>, de chuva ou de orvalho, até o arquegônio; muitas vezes, uma gota de chuva respinga e o leva de uma planta a outra. A fecundação forma o <b>zigoto</b>, que cresce <b>em cima do gametófito feminino</b> e forma o <b>esporófito</b> (2n): uma haste fina com uma <b>cápsula</b> na ponta. O esporófito é <b>temporário</b> e <b>depende do gametófito</b> para receber água e alimento. Na cápsula (o esporângio), a <b>meiose</b> forma <b>esporos</b>, que o vento espalha. O esporo germina, forma um filamento verde (o <b>protonema</b>) e dele brotam novos gametófitos.</p><p>Os musgos também são <b>pioneiros</b>: depois dos liquens, ocupam rochas e solos pobres e retêm água e poeira, o que ajuda a formar solo (veja Liquens e micorrizas, no módulo Microrganismos e fungos). O musgo <i>Sphagnum</i> forma as <b>turfeiras</b>, áreas encharcadas que guardam muito carbono; é usado também em jardinagem, porque segura muita água.</p>", enem: "As três ideias que caem: briófitas <b>não têm vasos condutores</b>, por isso são <b>pequenas</b> e vivem em lugares <b>úmidos</b>; o <b>gametófito é a fase duradoura</b> (o esporófito cresce preso a ele); e a <b>fecundação depende da água</b>, porque o anterozoide nada até a oosfera. Se a questão perguntar por que os musgos não ficam grandes, a resposta é a <b>falta de vasos</b> (e de lignina), não a falta de luz." };
  TXT.V3 = { d: "<p>As <b>pteridófitas</b> são as <b>samambaias</b>, as <b>avencas</b>, as <b>cavalinhas</b> e os licopódios e selaginelas. Foram as primeiras plantas com <b>vasos condutores</b>: o <b>xilema</b> leva água e sais da raiz para cima, e o <b>floema</b> distribui os açúcares feitos nas folhas. Com vasos e <b>lignina</b>, que endurece as paredes, elas têm <b>raiz, caule e folha verdadeiros</b> e podem crescer mais. Nas samambaias comuns, o caule é subterrâneo e horizontal (um <b>rizoma</b>), e as folhas novas nascem enroladas, como um báculo. Há também samambaias arborescentes, como o <b>xaxim</b> (<i>Dicksonia sellowiana</i>), da Mata Atlântica, que foi tão explorado para fazer vasos de planta que hoje está <b>ameaçado de extinção</b>. Há cerca de 360 milhões de anos, no período <b>Carbonífero</b>, florestas de pteridófitas gigantes cobriam regiões pantanosas; seus restos, soterrados e comprimidos por milhões de anos, viraram boa parte do <b>carvão mineral</b>.</p><p>Nas pteridófitas, a planta que vemos é o <b>esporófito</b> (2n), a geração <b>duradoura</b>. Embaixo de algumas folhas aparecem pontinhos marrons, os <b>soros</b>: cada soro é um grupo de <b>esporângios</b>, onde a <b>meiose</b> forma <b>esporos</b>. Muita gente acha que os soros são doença ou praga; são a reprodução da planta. O esporo cai num lugar úmido e forma o <b>gametófito</b>, chamado <b>prótalo</b>: uma plaquinha verde em forma de coração, com menos de 1 cm, que vive <b>independente</b> por pouco tempo. No prótalo ficam o anterídio e o arquegônio; o <b>anterozoide nada</b> na água do solo até a <b>oosfera</b>, como nas briófitas. O zigoto forma um novo esporófito, que no começo cresce sobre o prótalo e logo fica independente, enquanto o prótalo morre.</p><p>Uma nota sobre a classificação: \"pteridófitas\" é um nome de uso escolar. Os licopódios e selaginelas formam uma linhagem, e as samambaias e cavalinhas outra, mais próxima das plantas com semente. Por isso as pteridófitas não formam um grupo monofilético (veja os grupos que não são clados, na Taxonomia).</p>", enem: "<b>Pteridófitas</b> = primeiras plantas <b>vasculares</b>, <b>sem sementes</b>, com <b>esporófito dominante</b>. A pegadinha principal: apesar dos vasos, elas <b>ainda dependem da água</b> para a fecundação (anterozoide nadando), igual às briófitas; quem se livra dessa dependência são as <b>gimnospermas</b>, com o tubo polínico. Os <b>soros</b> sob as folhas são <b>esporângios</b>, não doença. O <b>carvão mineral</b> vem de florestas de pteridófitas do Carbonífero." };
  TXT.V4 = { d: "<p>As <b>gimnospermas</b> são os <b>pinheiros</b>, ciprestes, sequoias, as <b>cicas</b> e o <i>Ginkgo</i>. O nome quer dizer \"semente nua\": elas têm <b>semente</b>, mas <b>não têm fruto</b> em volta. No Brasil, a mais conhecida é a <b><i>Araucaria angustifolia</i></b>, o pinheiro-do-paraná, árvore símbolo da <b>Mata de Araucárias</b> no Sul e nas serras do Sudeste. Ela foi tão derrubada para madeira no século XX que hoje está <b>ameaçada de extinção</b>. O <b>pinhão</b> é a <b>semente</b> da araucária, não um fruto. Aves como a <b>gralha-azul</b> e roedores como a cutia enterram pinhões para comer depois e esquecem alguns, que germinam: são dispersores importantes. Já os pinheiros do gênero <i>Pinus</i>, plantados para madeira e papel, são <b>exóticos</b> (vieram do Hemisfério Norte) e podem invadir campos nativos. As gimnospermas dominam florestas de clima frio, como as florestas de coníferas do Canadá e da Rússia; suas folhas em forma de agulha, com cutícula grossa, perdem pouca água.</p><p>A planta que vemos é o <b>esporófito</b>. As estruturas reprodutivas ficam em <b>estróbilos</b> (as \"pinhas\" ou cones). Os <b>estróbilos masculinos</b> produzem os <b>grãos de pólen</b>, e cada grão de pólen é um <b>gametófito masculino</b> pequenininho, que o <b>vento</b> leva (muitas vezes, em nuvens amarelas). Nos <b>estróbilos femininos</b> ficam os <b>óvulos</b>, cada um com um <b>gametófito feminino</b> dentro e a <b>oosfera</b>. Quando um grão de pólen chega ao óvulo (a <b>polinização</b>), ele forma o <b>tubo polínico</b>, que cresce até a oosfera e leva até ela o <b>núcleo espermático</b>. Por isso a fecundação <b>não depende mais de água</b> para o gameta nadar. Essa é a grande novidade do grupo. Depois da fecundação, o óvulo vira a <b>semente</b>: o <b>embrião</b>, uma <b>reserva de alimento</b> e uma <b>casca</b> protetora. Nas gimnospermas, essa reserva é o próprio tecido do gametófito feminino, <b>haploide</b> (n); nas angiospermas, como se verá em Angiospermas, ela vem de uma segunda fecundação e é <b>triploide</b> (3n). A semente aguenta seca e frio, espera o momento certo para germinar e pode ser levada para longe. No pinheiro, todo o processo, da polinização à semente madura, pode levar cerca de dois anos.</p>", enem: "<b>Gimnospermas</b> têm <b>semente</b>, mas <b>não têm flor nem fruto</b> (\"semente nua\"). As novidades cobradas: <b>grão de pólen</b>, <b>tubo polínico</b> (fecundação <b>sem água</b>) e <b>semente</b> (proteção e reserva para o embrião). Polinização quase sempre pelo <b>vento</b>. Exemplo brasileiro clássico: <b>araucária</b>, cujo <b>pinhão é semente</b>, não fruto, e que está ameaçada de extinção." };
  TXT.V5 = { d: "<p>As <b>angiospermas</b> são as plantas com <b>flores</b> e <b>frutos</b>: do capim ao ipê, do feijão à mangueira. Vivem em quase todos os ambientes terrestres e em alguns aquáticos, e fornecem quase toda a nossa comida. A <b>flor</b> é um ramo modificado para a reprodução. De fora para dentro: as <b>sépalas</b> (o <b>cálice</b>), em geral verdes, protegem o botão; as <b>pétalas</b> (a <b>corola</b>), muitas vezes coloridas, atraem animais; os <b>estames</b> (o <b>androceu</b>, parte masculina), cada um com um <b>filete</b> e uma <b>antera</b>, onde se formam os <b>grãos de pólen</b>; e o <b>carpelo</b> ou pistilo (o <b>gineceu</b>, parte feminina), com o <b>estigma</b> pegajoso no alto, o <b>estilete</b> e o <b>ovário</b>, que guarda os <b>óvulos</b>.</p><p>A <b>polinização</b> é a chegada do pólen ao estigma. Pode ser feita pelo <b>vento</b> (flores pequenas, sem cor nem cheiro, com muito pólen leve, como no milho e no capim), por <b>insetos</b> (flores coloridas e perfumadas, com néctar, como as visitadas pelas abelhas), por <b>aves</b> (flores tubulares e vermelhas, sem cheiro, visitadas por beija-flores) ou por <b>morcegos</b> (flores claras que abrem à noite). Flores e polinizadores evoluíram juntos (<b>coevolução</b>). As <b>abelhas</b> são as polinizadoras mais importantes da agricultura; o seu declínio, por agrotóxicos e perda de habitat, ameaça muitas colheitas. Depois da polinização, o pólen forma o <b>tubo polínico</b>, que cresce pelo estilete até o óvulo e leva <b>dois núcleos espermáticos</b>. Um se une à <b>oosfera</b> e forma o <b>zigoto</b> (2n), que vira o embrião. O outro se une a <b>dois núcleos polares</b> e forma uma célula <b>triploide</b> (3n), que origina o <b>endosperma</b>, a reserva de alimento da semente. Essa <b>dupla fecundação</b> é exclusiva das angiospermas.</p><p>Depois da fecundação, o <b>óvulo vira a semente</b> e o <b>ovário vira o fruto</b>. O fruto protege a semente e ajuda a espalhá-la (<b>dispersão</b>): frutos carnosos e coloridos atraem animais que comem a polpa e soltam as sementes longe (<b>zoocoria</b>), como as aves e os macacos; frutos e sementes leves, com \"asas\" ou pelos, voam (<b>anemocoria</b>), como os do ipê e da paineira; e frutos que boiam viajam pela água (<b>hidrocoria</b>), como o coco. Na parte comestível do <b>caju</b>, da <b>maçã</b> e do <b>morango</b>, quem cresce é outra parte, não o ovário (o pedúnculo no caju, o receptáculo na maçã e no morango): são <b>pseudofrutos</b> (a \"castanha\" do caju é o fruto verdadeiro). Algumas plantas formam frutos sem fecundação e, por isso, <b>sem sementes</b>, como a banana cultivada (<b>partenocarpia</b>).</p><p>As angiospermas se dividem em dois grandes grupos. As <b>monocotiledôneas</b> (milho, arroz, trigo, cana-de-açúcar, capim, bambu, palmeiras, bananeira, orquídeas) têm embrião com <b>um cotilédone</b>, folhas com <b>nervuras paralelas</b>, raiz <b>fasciculada</b> (em cabeleira) e flores com peças em <b>múltiplos de 3</b>. As <b>eudicotiledôneas</b> (feijão, soja, laranjeira, ipê, rosa, café, mandioca) têm <b>dois cotilédones</b>, nervuras em <b>rede</b>, raiz <b>pivotante</b> (uma principal) e flores com peças em múltiplos de 4 ou 5.</p><div class=\"tab\"><table><thead><tr><th>Característica</th><th>Monocotiledôneas</th><th>Eudicotiledôneas</th></tr></thead><tbody><tr><td>Cotilédones no embrião</td><td>1</td><td>2</td></tr><tr><td>Nervuras da folha</td><td>paralelas</td><td>em rede (reticuladas)</td></tr><tr><td>Raiz</td><td>fasciculada</td><td>pivotante (axial)</td></tr><tr><td>Peças da flor</td><td>múltiplos de 3</td><td>múltiplos de 4 ou 5</td></tr><tr><td>Feixes de vasos no caule</td><td>espalhados</td><td>em anel</td></tr><tr><td>Exemplos</td><td>milho, arroz, cana, capim, palmeiras</td><td>feijão, soja, laranjeira, ipê, café</td></tr></tbody></table></div>", enem: "É a tela com mais detalhes cobrados. <b>Óvulo vira semente; ovário vira fruto.</b> Pseudofrutos clássicos: <b>caju</b>, <b>maçã</b>, <b>morango</b>. A <b>dupla fecundação</b> forma o <b>zigoto (2n)</b> e o <b>endosperma (3n)</b>. As <b>síndromes de polinização</b> (cor, cheiro, néctar, horário da flor) e de <b>dispersão</b> (frutos carnosos e animais, sementes aladas e vento) caem em questões de interpretação, muitas vezes com a ideia de <b>coevolução</b> e com o risco do <b>declínio das abelhas</b> para a produção de alimentos." };
  TXT.V6 = { d: "<p>A <b>raiz</b> fixa a planta e <b>absorve água e sais minerais</b>, sobretudo pelos <b>pelos absorventes</b> perto da ponta. Pode ser <b>pivotante</b> (uma raiz principal, como no feijão) ou <b>fasciculada</b> (um tufo de raízes finas, como no milho). Há raízes especiais: <b>tuberosas</b>, que guardam reserva (<b>mandioca, cenoura, beterraba, batata-doce</b>); <b>respiratórias</b> (os <b>pneumatóforos</b> dos mangues, que crescem para fora da lama encharcada e sem oxigênio); <b>escoras</b>, que sustentam; e <b>sugadoras</b>, como as da erva-de-passarinho, que penetram outra planta e roubam a seiva. O <b>caule</b> sustenta as folhas e liga a raiz às folhas por dentro dos vasos. Pode ser <b>tronco</b> (árvores), <b>colmo</b> (com nós, como a cana e o bambu), <b>estipe</b> (palmeiras) ou subterrâneo: o <b>rizoma</b> (gengibre, bananeira), o <b>tubérculo</b> (<b>batata-inglesa</b>, que tem \"olhos\", que são gemas) e o <b>bulbo</b> (<b>cebola</b> e alho, em que a parte que comemos são folhas modificadas em volta de um caule pequeno). A <b>folha</b> é o principal órgão da <b>fotossíntese</b> e das trocas gasosas. Na sua superfície ficam os <b>estômatos</b>, poros controlados por duas <b>células-guarda</b>, por onde entra o CO₂ e sai vapor de água. Em ambientes secos, como a <b>Caatinga</b>, há folhas pequenas, cutícula grossa, espinhos (no cacto, os espinhos são folhas e o caule verde faz a fotossíntese) e plantas que <b>perdem as folhas</b> na seca.</p><p>Por dentro, dois tipos de vaso levam as seivas. O <b>xilema</b> leva a <b>seiva bruta</b> (água e sais) da raiz até as folhas, sempre <b>para cima</b>. A força principal vem da <b>transpiração</b>: a folha perde vapor de água pelos estômatos, e essa perda \"puxa\" a coluna de água no xilema, que se mantém inteira porque as moléculas de água ficam unidas umas às outras (<b>teoria da coesão e tensão</b>). O <b>floema</b> leva a <b>seiva elaborada</b> (açúcares feitos na fotossíntese) das folhas para onde a planta precisa: raízes, frutos, brotos, para cima ou para baixo. O floema fica na parte de fora do caule, junto da casca; o xilema, mais para dentro (nas árvores, o lenho). Se alguém tira um <b>anel de casca</b> em volta de um tronco (o <b>anel de Malpighi</b>), corta o floema: as folhas continuam recebendo água pelo xilema, mas o açúcar não chega às raízes, que morrem de fome, e a árvore morre semanas ou meses depois.</p><p>Os <b>estômatos</b> são a válvula da planta. Com <b>luz</b> e <b>água disponível</b>, se abrem: entra CO₂ para a fotossíntese, e a planta transpira. Na <b>falta de água</b>, um hormônio (o ácido abscísico) faz os estômatos se <b>fecharem</b>: a planta economiza água, mas a fotossíntese cai. É um equilíbrio entre comer e não secar. Os cactos e outras plantas de deserto abrem os estômatos <b>à noite</b>, quando está fresco, e guardam o CO₂ para usar de dia.</p>", enem: "Caem: <b>xilema = seiva bruta</b>, da raiz para as folhas, puxada pela <b>transpiração</b>; <b>floema = seiva elaborada</b>, das folhas para o resto da planta; o <b>anel de Malpighi</b> mata a árvore porque <b>corta o floema</b>. <b>Estômatos</b> abrem com luz e água e fecham na seca, o que reduz a fotossíntese. Pegadinhas de \"órgão\": <b>batata-inglesa é caule</b> (tubérculo), <b>batata-doce e mandioca são raízes</b>, <b>cebola é bulbo</b> (um caule curto; a parte que comemos são folhas modificadas), <b>gengibre é rizoma</b>. Adaptações da Caatinga (espinhos, folhas pequenas, queda das folhas) aparecem em questões de biomas." };
  //TXT-FIM

  // ---------- ajudantes ----------
  // divide a área em duas: lado a lado no computador, uma em cima da outra no celular
  const split = (A, fr) => { const k = NAR ? Math.round(A.h * fr) : Math.round(A.w * fr); return NAR ? { a: { x: A.x0, y: A.y0, w: A.w, h: k - 4 }, b: { x: A.x0, y: A.y0 + k + 4, w: A.w, h: A.h - k - 4 } } : { a: { x: A.x0, y: A.y0, w: k - 8, h: A.h }, b: { x: A.x0 + k + 8, y: A.y0, w: A.w - k - 8, h: A.h } }; };
  const pts = (...p) => { const o = []; for (let i = 0; i < p.length; i += 2) o.push([p[i], p[i + 1]]); return o; };
  function tocaRoda(S, x, y) { const h = hitAt(x, y); if (typeof h === 'string' && h.startsWith('w:')) { S.nodo = h.slice(2); return true; } return false; }
  const DW = {
    esp: '<b>Esporófito (2n)</b>: a geração que produz esporos, por meiose.',
    spo: '<b>Esporos (n)</b>: formados por meiose. Cada esporo germina e forma um gametófito.',
    gam: '<b>Gametófito (n)</b>: produz gametas por mitose.',
    gms: '<b>Gametas (n)</b>: formados por mitose no gametófito. Dois gametas se unem na fecundação.',
    zig: '<b>Zigoto (2n)</b>: resulta da fecundação e cresce até formar um novo esporófito.',
    meiose: '<b>Meiose</b>, de 2n para n. Nas plantas ela forma <b>esporos</b>, não gametas (meiose espórica).',
    fec: '<b>Fecundação</b>, de n para 2n. Dois gametas se unem e formam o zigoto.'
  };
  const NOMES0 = { esp: 'esporófito (2n)', spo: 'esporos (n)', gam: 'gametófito (n)', gms: 'gametas (n)', zig: 'zigoto (2n)' };
  // a roda do ciclo haplodiplobionte, uma só para V1 a V5. r = retângulo; o.esp e o.gam (0 a 1) = tamanho de cada geração; o.dom = 'esp' ou 'gam'
  function roda(S, r, o = {}) {
    if (r.x == null) r = { x: r.x0, y: r.y0, w: r.w, h: r.h };
    const nm = Object.assign({}, NOMES0, o.nm), esp = o.esp == null ? .6 : o.esp, gam = o.gam == null ? .6 : o.gam;
    const nr0 = Math.min(22, r.h * .07 + 4), R = Math.max(40, Math.min((r.w / 2 - 100 - nr0) / .87, r.h / 2 - nr0 - 36));
    const cx = r.x + r.w / 2, cy = r.y + r.h / 2 + 4, pt = a => [cx + Math.cos(a * PI / 180) * R, cy + Math.sin(a * PI / 180) * R];
    const R2 = R + nr0 + 6;
    X.beginPath(); X.arc(cx, cy, R2, PI, TAU); X.closePath(); X.fillStyle = rgba(N2, .13); X.fill();
    X.beginPath(); X.arc(cx, cy, R2, 0, PI); X.closePath(); X.fillStyle = rgba(N1, .13); X.fill();
    line(cx - R2, cy, cx + R2, cy, 'rgba(255,255,255,.18)', 1, [4, 4]);
    const fs = Math.min(28, Math.max(16, R * .36));
    tx('2n', cx, cy - R * .42, { s: fs, w: 700, c: N2, f: FH, bg: false }); tx('n', cx, cy + R * .42, { s: fs, w: 700, c: N1, f: FH, bg: false });
    circ(cx, cy, R, null, 'rgba(255,255,255,.4)', 2);
    [-135, 120, 60, -60].forEach(a => { const [px, py] = pt(a); arrowHead(px, py, Math.atan2(-Math.cos(a * PI / 180), Math.sin(a * PI / 180)), 'rgba(255,255,255,.75)', 9); });
    // portões fixos: meiose (2n para n) à esquerda e fecundação (n para 2n) à direita
    [[180, 'meiose', 'meiose', 'right'], [0, 'fec', 'fecundação', 'left']].forEach(([a, id, tt, al]) => {
      const [gx, gy] = pt(a); rr(gx - 3, gy - 15, 6, 30, 3, AM, '#0B0F1C', 1); hitR(gx - 14, gy - 18, 28, 36, 'w:' + id);
      tx(tt, gx + (al === 'right' ? -11 : 11), gy, { s: 13, w: 700, c: AM, a: al });
    });
    const ND = [['esp', -90, 7 + (nr0 - 7) * esp, N2, 't'], ['spo', 150, 6, N1, 'l'], ['gam', 90, 7 + (nr0 - 7) * gam, N1, 'b'], ['gms', 30, 6, N1, 'r'], ['zig', -30, 7, N2, 'r']];
    ND.forEach(([id, a, rad, c, lado]) => {
      const [nx, ny] = pt(a); circ(nx, ny, rad, c, '#0B0F1C', 1.5); if (S.nodo === id) circ(nx, ny, rad + 4, null, AM, 2.5); hitC(nx, ny, Math.max(rad + 2, 16), 'w:' + id);
      const o2 = { s: 13, w: 600, c: C.txt };
      if (lado === 't') { tx(nm[id], nx, ny - rad - 11, o2); if (o.dom === 'esp') tx('fase dominante', nx, ny - rad - 27, { s: 12, c: AM }); }
      else if (lado === 'b') { tx(nm[id], nx, ny + rad + 11, o2); if (o.dom === 'gam') tx('fase dominante', nx, ny + rad + 27, { s: 12, c: AM }); }
      else if (lado === 'l') tx(nm[id], nx - rad - 7, ny, Object.assign({ a: 'right' }, o2)); else tx(nm[id], nx + rad + 7, ny, Object.assign({ a: 'left' }, o2));
    });
    const ang = -90 - 360 * fr(S.ph / 16), [dx, dy] = pt(ang); circ(dx, dy, 5.5, '#fff', AM, 2);
    return { cx, cy, R };
  }
  // perguntas de múltipla escolha, uma de cada vez, com fichas
  function quiz(S, A, qs, cor) {
    const qi = S.qi || 0, q = qs[qi], g = 8;
    panel(A.x0, A.y0, A.w, A.h);
    if (!q) { tx('Pronto', A.cx, A.cy - 16, { s: 24, w: 700, f: FH, c: C.ok }); wrapTx('Você respondeu as ' + qs.length + ' perguntas.', A.cx, A.cy + 14, A.w - 40, { s: 15, c: C.txt, a: 'center', lh: 20 }); btn(A.cx - 70, A.cy + 40, 140, 40, 'Refazer', cor, 'qr'); return; }
    mtx('Pergunta ' + (qi + 1) + ' de ' + qs.length, A.x0 + 16, A.y0 + 20, { s: 13, c: C.dim, a: 'left' });
    const th = wrapTx(q.q, A.x0 + 16, A.y0 + 48, A.w - 32, { s: NAR ? 17 : 20, w: 600, f: FH, c: C.txt, a: 'left', lh: NAR ? 22 : 26 });
    const oy = A.y0 + 48 + th + 4, h = NAR ? 44 : 48, fs = NAR ? 13 : 14;
    q.o.forEach((s, i) => {
      const y = oy + i * (h + g), fl = S.flash && S.flash.i === i && performance.now() - S.flash.t < 700, ox = fl ? Math.sin((performance.now() - S.flash.t) / 25) * 4 : 0;
      rr(A.x0 + 16 + ox, y, A.w - 32, h, 8, 'rgba(19,26,43,.94)', fl ? C.erro : cor, fl ? 2.2 : 1.3); hitR(A.x0 + 16, y, A.w - 32, h, 'q' + i);
      wrapTx(s, A.x0 + 28 + ox, y + h / 2 - (wrapTx(s, 0, 0, A.w - 56, { s: fs, w: 600, lh: fs + 3, dry: true }) - fs - 3) / 2, A.w - 56, { s: fs, w: 600, lh: fs + 3, c: C.txt, a: 'left' });
    });
  }
  function quizTap(S, h, qs) {
    if (h === 'qr') { S.qi = 0; S.qm = null; return true; }
    if (typeof h === 'string' && /^q\d$/.test(h)) {
      const i = +h[1], q = qs[S.qi || 0]; if (!q) return true;
      if (i === q.c) { S.qm = '<b>Certo.</b> ' + q.ok; S.qi = (S.qi || 0) + 1; S.flash = null; } else { S.qm = '<b>Ainda não.</b> ' + q.no; S.flash = { i, t: performance.now() }; }
      return true;
    }
    return false;
  }
  // ícones de grupos de plantas: (x, y) = base ao centro; s = altura
  function icone(tipo, x, y, s) {
    if (tipo === 'alga') { for (let i = -2; i <= 2; i++) { X.beginPath(); X.moveTo(x + i * s * .13, y); X.bezierCurveTo(x + i * s * .13 + s * .12, y - s * .3, x + i * s * .13 - s * .12, y - s * .6, x + i * s * .13 + s * .04 * i, y - s * (.75 + .06 * (i & 1))); X.strokeStyle = '#5FA84A'; X.lineWidth = 2.2; X.stroke(); } }
    else if (tipo === 'musgo') { for (let i = -3; i <= 3; i++) { const h = s * (.3 + .06 * (i & 1)), bx = x + i * s * .11; line(bx, y, bx + i * 1.5, y - h, FOL, 2); circ(bx + i * 1.5, y - h, 2.4, '#7FC63B'); if (i % 2 === 0) { line(bx, y, bx + 1, y - h - s * .3, '#8A6A3A', 1.2); ell(bx + 1, y - h - s * .33, 2.4, 4, 0, '#B07A3A'); } } }
    else if (tipo === 'samambaia') { for (let k = -1; k <= 1; k++) { const x1 = x + k * s * .42, y1 = y - s * (.9 - Math.abs(k) * .2), qx = x + k * s * .1, qy = y - s * 1.0; X.beginPath(); X.moveTo(x, y); X.quadraticCurveTo(qx, qy, x1, y1); X.strokeStyle = '#3E8E4A'; X.lineWidth = 1.8; X.stroke(); for (let i = 1; i < 6; i++) { const f = i / 6, [px, py] = qpt(x, y, qx, qy, x1, y1, f); line(px, py, px - s * .1 * (1 - f * .6), py + s * .03, '#4FA85A', 1.6); line(px, py, px + s * .1 * (1 - f * .6), py + s * .03, '#4FA85A', 1.6); } } }
    else if (tipo === 'pinheiro') { line(x, y, x, y - s * .25, '#6B4A2B', 4); [[.2, .55], [.45, .42], [.7, .3]].forEach(([b, w]) => shape([[x - s * w * .5, y - s * b], [x + s * w * .5, y - s * b], [x, y - s * (b + .3)]], '#2F7A45', '#1B4D2B', 1.2)); }
    else if (tipo === 'ipe') { line(x, y, x, y - s * .45, '#6B4A2B', 4); circ(x, y - s * .65, s * .3, '#E8C23C', '#B8921C', 1.4); for (let i = 0; i < 6; i++) circ(x + Math.cos(i * 1.7) * s * .2, y - s * .65 + Math.sin(i * 2.3) * s * .2, 2.2, '#F7E27A'); }
  }
  // cladograma das plantas, em escada: da alga verde (embaixo) à angiosperma (em cima); marcas âmbar nas novidades
  const GN = ['alga verde (ancestral)', 'briófitas (musgos)', 'pteridófitas (samambaias)', 'gimnospermas (pinheiros)', 'angiospermas (plantas com flores)'];
  const GS = ['alga verde', 'briófitas', 'pteridófitas', 'gimnospermas', 'angiospermas'];
  const MK = ['embrião e cutícula', 'vasos condutores', 'semente e grão de pólen', 'flor e fruto'], MKS = ['embrião e cutícula', 'vasos condutores', 'semente e pólen', 'flor e fruto'];
  const ICO = ['alga', 'musgo', 'samambaia', 'pinheiro', 'ipe'];
  function clado(S, r, lit, sel) {
    const sp = (r.h - 50) / 4, sx = r.x + 14, y0 = r.y + r.h - 18, pw = NAR ? 126 : 150, ix = sx + 24 + pw + 22, is = Math.min(34, sp * .8);
    mtx('<b>Cladograma das plantas</b>', r.x + 4, r.y + 10, { s: NAR ? 13 : 15, f: FH, a: 'left', c: C.txt });
    line(sx, y0, sx, y0 - 4 * sp, '#9DA9C4', 3);
    for (let i = 0; i <= 4; i++) {
      const y = y0 - i * sp, on = sel === i - 1 && i > 0; line(sx, y, ix - is * .6, y, on ? AM : '#9DA9C4', on ? 2.5 : 1.6); circ(sx, y, 4, '#9DA9C4');
      if (i > 0) { const lt = lit(i - 1); if (lt) tok(sx + 24 + pw / 2, y, NAR ? MKS[i - 1] : MK[i - 1], AM, { s: NAR ? 12 : 13 }); else { rr(sx + 24, y - 11, pw, 22, 6, 'rgba(19,26,43,.95)', 'rgba(255,179,71,.45)', 1.2); mtx(NAR ? MKS[i - 1] : MK[i - 1], sx + 24 + pw / 2, y + .5, { s: NAR ? 12 : 13, w: 600, c: C.dim, bg: false }); } }
      icone(ICO[i], ix, y + is / 2, is);
      mtx(NAR ? GS[i] : GN[i], ix + is * .7, y, { s: NAR ? 13 : 14, w: 600, a: 'left', c: on ? AM : C.txt });
    }
  }
  function capRoda(S, d) { return S.nodo && DW[S.nodo] ? DW[S.nodo] : d; }

  // =====================================================================================
  // V1 A CONQUISTA DO AMBIENTE TERRESTRE
  // =====================================================================================
  const GRUPOS = ['briófitas', 'pteridófitas', 'gimnospermas', 'angiospermas'];
  const GPAR = [{ esp: .25, gam: 1, dom: 'gam' }, { esp: 1, gam: .25, dom: 'esp' }, { esp: 1, gam: .12, dom: 'esp' }, { esp: 1, gam: .05, dom: 'esp' }];
  const GCAP = ['<b>Briófitas</b>: a planta que vemos é o gametófito (n); o esporófito (2n) é pequeno e cresce preso a ele.', '<b>Pteridófitas</b>: o esporófito (2n) passa a dominar, e o gametófito (n), o prótalo, fica minúsculo.', '<b>Gimnospermas</b>: o gametófito masculino (n) tem poucas células, dentro do grão de pólen; o feminino (n) fica dentro do óvulo e vira a reserva da semente.', '<b>Angiospermas</b>: o gametófito (n) é ainda menor e fica dentro da flor; o esporófito (2n) é a planta inteira.'];
  const PROB = baralho({
    nome: 'prob',
    alvos: [{ t: 'perder água', c: '#5AA9FF' }, { t: 'levar água do solo ao alto', c: '#2FCFBF' }, { t: 'ficar de pé', c: '#C08A5A' }, { t: 'gameta sem água para nadar', c: '#E58AB0' }, { t: 'espalhar os filhos', c: '#9FD84A' }],
    cartas: [
      { t: 'cutícula e estômatos', k: 0, m: 0, x: 'a cutícula de cera reduz a perda de água, e os estômatos controlam as trocas de gases.' },
      { t: 'vasos condutores', k: 1, m: 1, x: 'xilema e floema levam água, sais e açúcares pelo corpo da planta.' },
      { t: 'lignina', k: 2, m: 1, x: 'a lignina endurece as paredes dos vasos e sustenta o corpo para o alto.' },
      { t: 'grão de pólen e tubo polínico', k: 3, m: 2, x: 'o tubo polínico leva o gameta masculino até o feminino, sem água para nadar.' },
      { t: 'semente e fruto', k: 4, m: 3, x: 'a semente protege o embrião e o fruto ajuda a espalhar as sementes.' }
    ],
    certo: c => '<b>Certo.</b> ' + c.x.charAt(0).toUpperCase() + c.x.slice(1) + ' A marca âmbar acendeu no cladograma.',
    errado: (c, a) => `<b>Ainda não.</b> "${c.t}" não resolve "${a.t}". Pense em qual problema da vida fora da água ela ajuda a vencer.`,
    fim: () => '<b>Pronto.</b> Cada novidade resolveu um problema da vida fora da água, e as soluções aparecem uma depois da outra no cladograma.',
    dica: 'Toque numa solução e depois no problema que ela resolve.'
  });
  const CICL = baralho({
    nome: 'cic',
    alvos: [{ t: 'haplobionte: adulto n', c: N1 }, { t: 'diplobionte: adulto 2n', c: N2 }, { t: 'haplodiplobionte: duas gerações', c: VD }],
    cartas: [
      { t: 'alga do gênero <i>Chlamydomonas</i>', k: 0, x: 'o adulto é n, e a meiose acontece logo no zigoto.' },
      { t: 'ser humano', k: 1, x: 'o adulto é 2n, e a meiose forma gametas.' },
      { t: 'samambaia', k: 2, x: 'alterna esporófito (2n) e gametófito (n); a meiose forma esporos.' }
    ],
    certo: c => '<b>Certo.</b> ' + c.x.charAt(0).toUpperCase() + c.x.slice(1),
    errado: (c, a) => `<b>Ainda não.</b> ${semTag(c.t)} não é "${a.t}". Veja onde acontece a meiose e qual geração é adulta.`,
    fim: () => '<b>Pronto.</b> Haplobionte: adulto n. Diplobionte: adulto 2n. Haplodiplobionte: as duas gerações se alternam, como nas plantas.',
    dica: 'Toque num exemplo e depois no tipo de ciclo.'
  });
  def('plantae', 'conquista', {
    t: 'A conquista do ambiente terrestre', s: 'quatro grupos, quatro novidades e um ciclo com duas gerações', c: VD,
    loc: S => ({ clado: 'Cladograma e roda do ciclo', prob: 'Problema e solução', cic: 'Três ciclos' })[S.modo] || '', locNota: NOTA,
    alt: 'o cladograma das plantas com as novidades de cada grupo e a roda do ciclo de vida com as fases 2n e n, e dois jogos de arrastar cartões',
    still: 2,
    ctl: { l: 'Grupo', min: 0, max: 3, step: 1, v: 0, f: v => GRUPOS[v], rate: () => 1 }, stillV: 0,
    ctlVis: S => S.modo === 'clado',
    extra: [modo('clado', 'Cladograma e roda'), modo('prob', 'Problema e solução'), modo('cic', 'Três ciclos')],
    init(S) { S.modo = 'clado'; S.nodo = null; PROB.zera(S); CICL.zera(S); },
    d: TXT.V1.d + '<p>Em "Cladograma e roda", passe de um grupo ao outro com a faixa e toque nas fases da roda. Em "Problema e solução" e "Três ciclos", arraste os cartões.</p>',
    enem: TXT.V1.enem,
    links: [LK.reinos, LK.celveg, LK.bioenergetica, LK.endossimbiose],
    tap(x, y, S) { if (S.modo === 'clado') { tocaRoda(S, x, y); } else B1(S).tap(x, y, S); },
    grab(x, y, S) { return S.modo !== 'clado' && B1(S).grab(x, y, S); }, grabMove(x, y, S) { if (S.modo !== 'clado') B1(S).grabMove(x, y, S); }, grabEnd(x, y, S) { if (S.modo !== 'clado') B1(S).grabEnd(x, y, S); },
    draw(t, S) {
      const A = area();
      if (S.modo === 'clado') {
        const sp = split(A, NAR ? .45 : .5), g = S.v, P = GPAR[g];
        clado(S, sp.a, i => i <= g, g);
        roda(S, sp.b, { esp: P.esp, gam: P.gam, dom: P.dom });
        cap(capRoda(S, GCAP[g]));
      } else if (S.modo === 'prob') {
        const lit = m => PROB.cartas.some(c => c.m === m && (S.prob || {}).onde && S.prob.onde[c.i] != null);
        let bx = { x0: A.x0, y0: A.y0, x1: A.x1, y1: A.y1 };
        if (!NAR) { const sp = split(A, .4); clado(S, sp.a, lit, -1); bx = { x0: sp.b.x, y0: sp.b.y, x1: sp.b.x + sp.b.w, y1: sp.b.y + sp.b.h }; }
        PROB.draw(S, bx, { cols: NAR ? 2 : 3, cartaH: NAR ? 38 : 42 }); cap(PROB.msg(S) || 'Cinco problemas da vida fora da água. Ligue cada solução ao problema que ela resolve.');
      } else { CICL.draw(S, { x0: A.x0, y0: A.y0, x1: A.x1, y1: A.y1 }, { cols: NAR ? 1 : 3, cartaH: NAR ? 38 : 44 }); cap(CICL.msg(S) || 'Três tipos de ciclo de vida. Encaixe cada exemplo no seu ciclo.'); }
    }
  });
  const B1 = S => S.modo === 'prob' ? PROB : CICL;

  // =====================================================================================
  // V2 BRIÓFITAS
  // =====================================================================================
  const QV2 = [
    { q: 'A planta verde que vemos no musgo é qual fase?', o: ['o esporófito (2n)', 'o gametófito (n)', 'o zigoto (2n)'], c: 1, ok: 'nas briófitas, o gametófito é a fase duradoura.', no: 'o esporófito é a hastezinha com a cápsula, que cresce em cima do gametófito.' },
    { q: 'O esporófito do musgo vive sozinho?', o: ['sim, é independente', 'não, depende do gametófito', 'sim, mas só quando chove'], c: 1, ok: 'o esporófito é temporário e recebe água e alimento do gametófito.', no: 'lembre onde o zigoto cresce: em cima do gametófito feminino.' },
    { q: 'Onde acontece a meiose?', o: ['no anterídio', 'na cápsula do esporófito', 'no protonema'], c: 1, ok: 'na cápsula (o esporângio), a meiose forma os esporos.', no: 'a meiose forma esporos; procure onde eles são produzidos.' }
  ];
  const along = (P, f) => { let tot = 0; const L = []; for (let i = 1; i < P.length; i++) { const l = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); L.push(l); tot += l; } let d = cl(f, 0, 1) * tot, i = 0; while (i < L.length - 1 && d > L[i]) { d -= L[i]; i++; } const k = L[i] ? d / L[i] : 0; return [lerp(P[i][0], P[i + 1][0], k), lerp(P[i][1], P[i + 1][1], k)]; };
  function tufo(x, gy, h, seed, k = 5) { const R = rng(seed); for (let i = 0; i < 12; i++) { const dx = (i - 5.5) * k, tx0 = x + dx * 1.3 + (R() - .5) * 4, ty0 = gy - h * (.75 + R() * .25); line(x + dx * .4, gy, tx0, ty0, FOL, 2.4); circ(tx0, ty0, 2.6, '#7FC63B'); } }
  function drawSeca(t, S, A) {
    const dt = passo(S), wet = S.v >= 3;
    if (S.go) { if (wet) S.sw = Math.min(1, S.sw + dt / 4); if (S.sw >= 1) S.fe = Math.min(1, S.fe + dt / 8); if (S.fe >= 1) S.es = Math.min(1, S.es + dt / 4); }
    rr(A.x0, A.y0, A.w, A.h, 12, 'rgba(19,26,43,.5)', C.line, 1);
    const gy = A.y1 - 16, h = A.h * .32, mx = A.x0 + A.w * (NAR ? .24 : .26), fx = A.x0 + A.w * (NAR ? .74 : .7), ty = gy - h;
    rr(A.x0 + 6, gy, A.w - 12, 10, 4, '#6B4A2B');
    if (wet) {
      const film = 6 + 8 * ss(seg(S.v, 3, 6)); rr(A.x0 + 10, gy - 10 - film, A.w - 20, 10 + film, 6, rgba(XIL, .26), rgba(XIL, .55), 1);
      for (let i = 0; i < 22; i++) { const f = fr(t * .7 + i * .37), dx = A.x0 + 14 + (i * 53 % 100) / 100 * (A.w - 28), dy = A.y0 + 8 + f * (gy - A.y0 - 30); line(dx, dy, dx - 2, dy + 8, rgba(XIL, .8), 1.4); }
    }
    const kk = cl(A.w * .011, 5, 11); tufo(mx, gy, h, 3, kk); tufo(fx, gy, h, 5, kk);
    // anterídio (masculino) e arquegônio com oosfera (feminino)
    ell(mx, ty - 6, 9, 13, 0, '#E8A24A', '#7A4C1C', 1.4); hitC(mx, ty - 6, 24, 'ant');
    ell(fx, ty - 8, 7, 12, 0, '#B7D68A', '#3E6B2A', 1.4); const zig = S.sw >= 1;
    circ(fx, ty - 3, 4, zig ? N2 : '#BFE0FF', '#0B0F1C', 1);
    // caminho dos anterozoides pela película de água
    const path = [[mx, ty - 6], [mx + 12, gy - 12], [fx - 12, gy - 12], [fx, ty - 3]];
    for (let i = 0; i < 6; i++) {
      let p;
      if (!S.go) p = [mx + (i % 3 - 1) * 4, ty - 6 + (i < 3 ? -3 : 3)];
      else if (!wet && S.sw < 1) p = [mx + Math.sin(t * 7 + i * 2) * 9, ty - 6 + Math.cos(t * 5 + i * 3) * 9];
      else { const u = cl(S.sw * 1.3 - i * .05, 0, 1); p = along(path, u); p[1] += Math.sin(t * 9 + i) * 2.5; if (S.sw >= 1 && i > 0) continue; }
      circ(p[0], p[1], 2.8, '#BFE0FF', '#0B0F1C', .8); line(p[0], p[1], p[0] - 5, p[1] + 3 + Math.sin(t * 12 + i), '#BFE0FF', 1);
    }
    // esporófito cresce sobre o gametófito feminino
    if (S.fe > 0) {
      const L = h * .9 * ss(S.fe), tx0 = fx + 2, top = ty - 8 - L; line(fx, ty - 12, tx0, top, '#8A6A3A', 2.6);
      if (S.es < .05) ell(tx0, top - 7, 6, 10, 0, '#B07A3A', '#6B4A2B', 1.4);
      else { ell(tx0, top - 7, 6, 10, 0, rgba('#B07A3A', .5), '#6B4A2B', 1.2); for (let i = 0; i < 14; i++) { const u = S.es * (1 + i * .08), wx = (i - 6.5) * 7 * u + Math.sin(t * 2 + i) * 4, wy = -u * (18 + i * 4); circ(tx0 + wx, top - 8 + wy, 2, rgba('#E8E2C8', cl(1 - u * .35, 0, 1))); } }
    }
    if (LB) {
      lab(mx - 6, ty + h * .35, A.x0 + 70, gy - h * .6, 'gametófito masculino (n)'); lab(mx + 8, ty - 10, mx + 50, ty - 46, 'anterídio');
      lab(fx + 6, ty + h * .35, fx + 60, gy - h * .45, 'gametófito feminino (n)'); lab(fx - 6, ty - 10, fx - 60, ty - 50, 'arquegônio e oosfera');
      if (S.fe > .5) lab(fx + 3, ty - 8 - h * .45, fx + 70, ty - h * 1.25, S.es > .05 ? 'cápsula: meiose forma esporos (n)' : 'esporófito (2n)');
    }
    cap(!S.go ? 'Escolha a umidade e toque no <b>anterídio</b> (a bolinha laranja) para soltar os anterozoides.' : !wet && S.sw < 1 ? '<b>Sem água, não há fecundação</b>: os anterozoides não saem do lugar. Aumente a umidade.' : S.sw < 1 ? 'Com a película de água da chuva ou do orvalho, os anterozoides <b>nadam</b> até a oosfera.' : S.fe < 1 ? 'A fecundação forma o <b>zigoto</b> (2n), que cresce em cima do gametófito e forma o esporófito.' : S.es < .05 ? 'O esporófito (2n) é uma haste com uma cápsula: ele depende do gametófito.' : 'Na cápsula, a <b>meiose</b> formou esporos (n), que o vento espalha.');
  }
  def('plantae', 'briofitas', {
    t: 'Briófitas', s: 'musgos: pequenos, sem vasos e dependentes da água', c: VD,
    loc: S => ({ seca: 'Seca ou chuva', roda: 'Roda do ciclo do musgo', quiz: 'Três perguntas' })[S.modo] || '', locNota: NOTA,
    alt: 'dois gametófitos de musgo, um masculino e um feminino, com anterozoides que só nadam quando há água, a roda do ciclo e três perguntas',
    still: 2,
    ctl: { l: 'Umidade', min: 0, max: 8, step: 1, v: 0, f: v => v < 3 ? 'seco' : v < 6 ? 'orvalho' : 'chuva', rate: () => 1 }, stillV: 5,
    ctlVis: S => S.modo === 'seca',
    extra: [modo('seca', 'Seca ou chuva'), modo('roda', 'Roda do ciclo'), modo('quiz', 'Três perguntas')],
    init(S) { S.modo = 'seca'; S.nodo = null; S.go = false; S.sw = S.fe = S.es = 0; S.qi = 0; S.qm = null; S.flash = null; },
    d: TXT.V2.d + '<p>Em "Seca ou chuva", mude a umidade e toque no anterídio. Depois veja a roda do ciclo e responda às três perguntas.</p>',
    enem: TXT.V2.enem,
    links: [LK.ecologia, LK.reinos],
    tap(x, y, S) {
      const h = hitAt(x, y);
      if (S.modo === 'seca') { if (h === 'ant' && !S.go) { S.go = true; } else if (h === 'ant' && S.es >= 1) { S.go = false; S.sw = S.fe = S.es = 0; } }
      else if (S.modo === 'roda') tocaRoda(S, x, y); else quizTap(S, h, QV2);
    },
    draw(t, S) {
      const A = area();
      if (S.modo === 'seca') drawSeca(t, S, A);
      else if (S.modo === 'roda') { roda(S, A, { esp: .25, gam: 1, dom: 'gam', nm: { gam: 'gametófito (n), o musgo' } }); cap(capRoda(S, 'No musgo, o <b>gametófito</b> (n) é a fase duradoura; o esporófito (2n) cresce sobre ele. Toque nas fases e nos portões.')); }
      else { quiz(S, A, QV2, VD); cap(S.qm || 'Responda tocando na opção que você acha certa.'); }
    }
  });

  // =====================================================================================
  // V3 PTERIDÓFITAS
  // =====================================================================================
  function fronde(x0, y0, x1, y1, qx, qy, n, len, sori) {
    X.beginPath(); X.moveTo(x0, y0); X.quadraticCurveTo(qx, qy, x1, y1); X.strokeStyle = '#3E8E4A'; X.lineWidth = 2.4; X.stroke();
    for (let i = 1; i <= n; i++) {
      const f = i / (n + 1) * .95 + .03, [px, py] = qpt(x0, y0, qx, qy, x1, y1, f), [ax, ay] = qpt(x0, y0, qx, qy, x1, y1, f + .02), a = Math.atan2(ay - py, ax - px), l = len * (1 - f * .7);
      [-1, 1].forEach(sd => { const b = a + sd * 1.15, ex = px + Math.cos(b) * l, ey = py + Math.sin(b) * l; line(px, py, ex, ey, '#4FA85A', 3); if (sori && sd > 0) circ(px + Math.cos(b) * l * .6, py + Math.sin(b) * l * .6, 1.9, '#7A4B2A'); });
    }
  }
  function heart(cx, cy, k, f, s, lw) { const p = []; for (let i = 0; i < 40; i++) { const u = i / 40 * TAU; p.push([cx + 16 * Math.pow(Math.sin(u), 3) * k, cy - (13 * Math.cos(u) - 5 * Math.cos(2 * u) - 2 * Math.cos(3 * u) - Math.cos(4 * u)) * k]); } shape(p, f, s, lw); }
  const V3T = 26;
  function drawFolha(t, S, A) {
    const sp = split(A, NAR ? .34 : .4), a = sp.a, b = sp.b, T = t % V3T;
    panel(a.x, a.y, a.w, a.h); panel(b.x, b.y, b.w, b.h);
    // samambaia em vaso (esquerda)
    const bx = a.x + a.w / 2, by = a.y + a.h - (NAR ? 22 : 40), sc = Math.min(a.w / 330, a.h / 330, 1.2);
    rr(bx - 34 * sc, by, 68 * sc, 30 * sc, 5, '#B5563B', '#6E2C1C', 1.4);
    [[-120, -70, -60, -150], [-60, -110, -20, -170], [0, -120, 0, -180], [60, -110, 20, -170], [120, -70, 60, -150]].forEach(([dx, dy, qx, qy], i) => fronde(bx, by, bx + dx * sc * 1.1, by + dy * sc, bx + qx * sc, by + qy * sc, 7, 26 * sc, i > 2));
    if (LB) { tx('samambaia (esporófito, 2n)', a.x + a.w / 2, a.y + 16, { s: 13, w: 600, c: C.txt }); lab(bx + 84 * sc, by - 90 * sc, a.x + a.w - 10, by - 150 * sc, 'soros sob as folhas'); }
    if (!NAR) { // corte do caule: vasos condutores
      const qx = a.x + 38, qy = a.y + a.h - 58; circ(qx, qy, 26, '#8A6A3A', '#3E2A16', 1.4); circ(qx, qy, 17, null, FLO, 5); for (let i = 0; i < 8; i++) circ(qx + Math.cos(i * .785) * 8, qy + Math.sin(i * .785) * 8, 3, XIL);
      if (LB) tx('corte do caule', qx + 4, qy - 36, { s: 12, c: C.dim });
    }
    // lente: sequência do ciclo (direita)
    const cx = b.x + b.w / 2, soil = b.y + b.h * .8; X.save(); X.beginPath(); X.rect(b.x, b.y, b.w, b.h); X.clip();
    rr(b.x + 6, soil, b.w - 12, b.y + b.h - soil - 6, 6, 'rgba(110,76,44,.8)');
    const sz = Math.min(b.w, b.h * 1.2);
    if (T < 5) { // folíolo visto de baixo, com soros
      ell(cx, b.y + b.h * .42, sz * .4, sz * .17, -.2, '#4FA85A', '#2E6B3A', 2);
      for (let i = 0; i < 6; i++) { const u = (i % 3 - 1) * sz * .2, v = (i < 3 ? -1 : 1) * sz * .05 - (i % 3 - 1) * sz * .02; circ(cx + u, b.y + b.h * .42 + v, sz * .045, '#7A4B2A', '#3E2A16', 1.4); }
      if (LB) { tx('folíolo visto de baixo', cx, b.y + 18, { s: 13, c: C.dim }); lab(cx + sz * .2, b.y + b.h * .42, cx + sz * .3, b.y + b.h * .72, 'soro: grupo de esporângios'); }
    } else if (T < 9) { // esporângio se abre e lança esporos
      const op = ss(seg(T, 5.8, 7.2)), ex = cx, ey = b.y + b.h * .45, rx = sz * .12;
      ell(ex - op * 6, ey, rx, rx * .9, 0, '#9A6A3A', '#3E2A16', 2); ell(ex + op * 6, ey, rx * .8, rx * .9, 0, '#B07A3A', '#3E2A16', 2); X.beginPath(); X.arc(ex, ey, rx * 1.05, PI * .95, PI * 1.9); X.strokeStyle = '#5A3A1A'; X.lineWidth = 4; X.stroke();
      if (op > .05) for (let i = 0; i < 12; i++) { const f = ss(seg(T, 6.6, 8.8)), ang = -PI / 2 + (i - 5.5) * .22; circ(ex + Math.cos(ang) * f * sz * (.25 + i % 3 * .08), ey - rx * .3 + Math.sin(ang) * f * sz * .3 + f * f * 30, 2.6, '#E8D5A8', '#7A4B2A', .8); }
      if (LB) { tx('esporângio', cx, b.y + 18, { s: 13, c: C.dim }); if (op > .5) tx('esporos (n), formados por meiose', cx, b.y + b.h * .72, { s: 13, c: AM }); }
    } else if (T < 12) { const f = ss(seg(T, 9, 12)); circ(cx, lerp(b.y + 20, soil - 3, f), 3.4, '#E8D5A8', '#7A4B2A', 1); if (LB) tx('esporo em solo úmido', cx, soil + 18, { s: 13, c: C.txt }); }
    else {
      const k = ss(seg(T, 12, 17)) * Math.min(3, sz / 80), fade = 1 - .75 * ss(seg(T, 23, 26)), hy = soil - 17 * Math.max(k, .15) - 2; const kk2 = Math.min(1, k);
      X.globalAlpha = fade; heart(cx, hy, Math.max(k, .15), rgba('#7FC63B', .9), '#2E6B3A', 2);
      for (let i = -2; i <= 2; i++) line(cx + i * 6 * k, soil - 2, cx + i * 8 * k, soil + 8, '#C9A27A', 1.3);
      if (T > 15) { ell(cx + 6 * k, hy + 13 * k, 3.4 * k, 4.6 * k, 0, '#E8A24A', '#7A4C1C', 1); ell(cx - 1 * k, hy - 7 * k, 3 * k, 3.8 * k, 0, '#B7D68A', '#3E6B2A', 1); }
      X.globalAlpha = 1;
      if (T > 17 && T < 23) { X.fillStyle = rgba(XIL, .2); X.beginPath(); X.ellipse(cx, hy + 6 * k, 20 * k + 10, 16 * k + 8, 0, 0, TAU); X.fill(); for (let i = 0; i < 4; i++) { const u = cl((T - 17) / 4 * 1.2 - i * .06, 0, 1), px = lerp(cx + 6 * k, cx - 1 * k, u) + Math.sin(T * 8 + i) * 2, py = lerp(hy + 13 * k, hy - 7 * k, u); circ(px, py, 2.4, '#fff', '#0B0F1C', .8); } }
      if (T > 21) { const g = ss(seg(T, 21, 26)), top = hy - 12 * k - g * Math.min(90, b.h * .4); line(cx - k, hy - 7 * k, cx - k, top, '#3E8E4A', 3); fronde(cx - k, hy - 7 * k, cx - k + g * 26, top, cx - k + g * 4, top + 20, 4, 14 * g, false); }
      if (LB) { tx(T < 21 ? 'prótalo (gametófito, n)' : 'esporófito jovem (2n)', cx, b.y + 18, { s: 13, w: 600, c: T < 21 ? N1 : N2 }); if (T > 15 && T < 21) { lab(cx + 6 * k, hy + 13 * k, cx + 90, hy - 40, 'anterídio'); lab(cx - 1 * k, hy - 7 * k, cx - 90, hy - 40, 'arquegônio'); } }
    }
    X.restore();
    cap(T < 5 ? 'Sob algumas folhas há pontinhos marrons, os <b>soros</b>: grupos de esporângios. Não são doença nem praga.' : T < 9 ? 'O esporângio se abre como uma catapulta e lança os <b>esporos</b>, formados por meiose.' : T < 12 ? 'O esporo cai em solo úmido.' : T < 17 ? 'O esporo germina e forma o <b>prótalo</b>, o gametófito (n): uma plaquinha verde em forma de coração, com menos de 1 cm.' : T < 21 ? 'O <b>anterozoide nada</b> na água do solo até a oosfera, como nas briófitas.' : 'O zigoto (2n) vira um esporófito jovem, que cresce sobre o prótalo e logo fica independente.');
  }
  const BQ = baralho({
    nome: 'bq', cartas: [
      { t: 'tem vasos condutores', k: 1, x: 'só as pteridófitas, entre as duas, têm vasos.' },
      { t: 'a fase duradoura é o gametófito', k: 0, x: 'nas briófitas, o gametófito é a planta que vemos.' },
      { t: 'a fase duradoura é o esporófito', k: 1, x: 'nas pteridófitas, o esporófito é a geração dominante.' },
      { t: 'o anterozoide nada até a oosfera', k: 2, x: 'as duas dependem de água para a fecundação.' },
      { t: 'tem raiz, caule e folha verdadeiros', k: 1, x: 'os vasos e a lignina permitem órgãos verdadeiros.' },
      { t: 'forma esporos', k: 2, x: 'as duas formam esporos, por meiose.' },
      { t: 'tem semente', k: 3, x: 'semente só aparece nas gimnospermas e angiospermas. Pegadinha.' }
    ],
    alvos: [{ t: 'briófita (musgo)', c: '#9FD84A' }, { t: 'pteridófita (samambaia)', c: '#4FA85A' }, { t: 'as duas', c: AM }, { t: 'nenhuma', c: '#9DA9C4' }],
    certo: c => '<b>Certo.</b> ' + c.x.charAt(0).toUpperCase() + c.x.slice(1),
    errado: (c, a) => `<b>Ainda não.</b> "${semTag(c.t)}" não vai em "${a.t}".`,
    fim: () => '<b>Pronto.</b> Pteridófitas ganharam vasos e esporófito dominante, mas, como as briófitas, ainda dependem de água para a fecundação. Semente, nenhuma das duas tem.',
    dica: 'Toque numa frase e depois na coluna certa.'
  });
  def('plantae', 'pteridofitas', {
    t: 'Pteridófitas', s: 'samambaias: vasos condutores, mas ainda dependentes da água', c: VD,
    loc: S => ({ folha: 'Soros e prótalo', quadro: 'Briófita ou pteridófita', rodas: 'As duas rodas' })[S.modo] || '', locNota: NOTA,
    alt: 'uma samambaia com soros, o esporângio lançando esporos, o prótalo em forma de coração e o esporófito jovem, um quadro para classificar frases e as rodas do ciclo do musgo e da samambaia',
    still: 14, ctlVis: S => S.modo === 'folha',
    extra: [modo('folha', 'Soros e prótalo'), modo('quadro', 'Briófita ou pteridófita'), modo('rodas', 'As duas rodas')],
    init(S) { S.modo = 'folha'; S.nodo = null; S.rs = 0; BQ.zera(S); },
    d: TXT.V3.d + '<p>Veja o ciclo da samambaia, depois arraste as frases para o grupo certo e compare as duas rodas de ciclo.</p>',
    enem: TXT.V3.enem,
    links: [LK.grupos, LK.clado, LK.reinos],
    tap(x, y, S) { if (S.modo === 'quadro') BQ.tap(x, y, S); else if (S.modo === 'rodas') { const h = hitAt(x, y); if (h === 'r0' || h === 'r1') S.rs = +h[1]; else tocaRoda(S, x, y); } },
    grab(x, y, S) { return S.modo === 'quadro' && BQ.grab(x, y, S); }, grabMove(x, y, S) { if (S.modo === 'quadro') BQ.grabMove(x, y, S); }, grabEnd(x, y, S) { if (S.modo === 'quadro') BQ.grabEnd(x, y, S); },
    draw(t, S) {
      const A = area();
      if (S.modo === 'folha') drawFolha(t, S, A);
      else if (S.modo === 'quadro') { BQ.draw(S, { x0: A.x0, y0: A.y0, x1: A.x1, y1: A.y1 }, { cols: NAR ? 2 : 4, cartaH: NAR ? 44 : 44 }); cap(BQ.msg(S) || 'Sete frases e quatro colunas. A coluna "nenhuma" é a pegadinha.'); }
      else {
        const PP = [{ esp: .25, gam: 1, dom: 'gam', nome: 'musgo (briófita)' }, { esp: 1, gam: .25, dom: 'esp', nome: 'samambaia (pteridófita)' }];
        if (NAR) { const k = S.rs || 0, r = { x: A.x0, y: A.y0 + 48, w: A.w, h: A.h - 48 }; btn(A.x0, A.y0, A.w / 2 - 4, 40, 'musgo', N1, 'r0', { on: k === 0 }); btn(A.cx + 4, A.y0, A.w / 2 - 4, 40, 'samambaia', VD, 'r1', { on: k === 1 }); roda(S, r, PP[k]); }
        else { const sp = split(A, .5); [sp.a, sp.b].forEach((r, i) => { tx(PP[i].nome, r.x + r.w / 2, r.y + 12, { s: 15, w: 600, f: FH, c: C.txt }); roda(S, { x: r.x, y: r.y + 22, w: r.w, h: r.h - 22 }, PP[i]); }); }
        cap(capRoda(S, 'No musgo domina o <b>gametófito</b> (n); na samambaia, o <b>esporófito</b> (2n). O tamanho de cada fase está proporcional.'));
      }
    }
  });

  // =====================================================================================
  // V4 GIMNOSPERMAS
  // =====================================================================================
  const V4T = 26, V4P = [['Pólen', 'Polinização', 0], ['Tubo', 'Tubo polínico', 6], ['Semente', 'Semente', 14], ['Gralha', 'Dispersão', 20]];
  function ovulo(cx, cy, rx, ry, sem) {
    ell(cx, cy, rx, ry, 0, sem ? '#8A5A2B' : '#C9A66B', '#5A3A1A', sem ? 4 : 2.4); ell(cx, cy, rx * .86, ry * .88, 0, '#5C8CC4', '#3A5F88', 1.6);
  }
  function drawPinhao(t, S, A) {
    const T = t % V4T, step = T < 6 ? 0 : T < 14 ? 1 : T < 20 ? 2 : 3, sy0 = A.y0 + 44, sh = A.y1 - sy0, sc = Math.min(1.6, A.w / (NAR ? 330 : 520), sh / 260);
    const pw = (A.w - 3 * 6) / 4;
    V4P.forEach(([cu, lo, t0], i) => { const x = A.x0 + i * (pw + 6), on = i === step; rr(x, A.y0, pw, 36, 8, rgba(on ? AM : '#9DA9C4', on ? .2 : .06), on ? AM : C.line, on ? 2 : 1); hitR(x, A.y0, pw, 36, 'p' + i); mtx((i + 1) + ' ' + (NAR ? cu : lo), x + pw / 2, A.y0 + 18, { s: NAR ? 12 : 13, w: 600, c: on ? AM : C.txt }); });
    const cx = A.cx, cy = sy0 + sh * .5;
    if (step === 0) {
      const mx = A.x0 + A.w * .18, fx = A.x0 + A.w * .78, my = cy + 20 * sc;
      ell(mx, my, 18 * sc, 34 * sc, .4, '#C9A66B', '#7A5A2B', 2); for (let i = 0; i < 5; i++) line(mx - 12 * sc, my - 22 * sc + i * 11 * sc, mx + 12 * sc, my - 16 * sc + i * 11 * sc, '#7A5A2B', 1.2);
      ell(fx, my, 36 * sc, 48 * sc, 0, '#8C6A3A', '#4E3416', 2.4); for (let r2 = 0; r2 < 5; r2++) for (let c2 = 0; c2 < 4; c2++) { const sx = fx - 24 * sc + c2 * 16 * sc + (r2 % 2) * 8 * sc, sy = my - 36 * sc + r2 * 17 * sc; X.beginPath(); X.arc(sx, sy, 7 * sc, 0, PI); X.strokeStyle = '#4E3416'; X.lineWidth = 1.4; X.stroke(); }
      for (let i = 0; i < 18; i++) { const f = fr(T * .14 + i / 18), x = lerp(mx + 14 * sc, fx - 30 * sc, f), y = my - 30 * sc - Math.sin(f * PI) * 36 * sc + Math.sin(i * 3 + t * 2) * 7; if (f < .96) circ(x, y, 2.8, '#F2D35B', '#9A7A18', .8); }
      for (let i = 0; i < 3; i++) arrow(cx - 70 * sc, sy0 + 12 + i * 12, cx + 70 * sc, sy0 + 12 + i * 12, rgba('#BFE0FF', .5), 1.4);
      if (LB) { tx('vento', cx, sy0 + 50, { s: 12, c: '#BFE0FF' }); lab(mx, my + 20 * sc, mx + 6, my + 70 * sc, 'estróbilo masculino'); lab(fx, my + 30 * sc, fx - 10, my + 82 * sc, 'estróbilo feminino (pinha)'); lab(cx, my - 62 * sc, cx, my - 110 * sc, NAR ? 'grãos de pólen' : 'grãos de pólen (gametófitos masculinos)'); }
      cap('Os <b>estróbilos masculinos</b> liberam nuvens de grãos de pólen, que o <b>vento</b> leva até o estróbilo feminino. Cada grão de pólen é um gametófito masculino minúsculo.');
    } else if (step === 1) {
      const rx = Math.min(A.w * .2, 110, sh * .3), ry = Math.min(rx * 1.15, sh * .42), oy = cy + 14, top = oy - ry; ovulo(cx, oy, rx, ry, false);
      ell(cx, top - 4, 9, 6, 0, '#0B0F1C'); const tub = ss(seg(T, 8, 12)), oos = [cx, oy - ry * .45], fe = ss(seg(T, 12.4, 13.6));
      circ(cx, top - 16, 9, '#F2D35B', '#9A7A18', 1.6); circ(oos[0], oos[1], 7, fe > .5 ? N2 : '#BFE0FF', '#0B0F1C', 1.4);
      if (tub > 0) { line(cx, top - 10, cx, lerp(top - 10, oos[1] - 6, tub), '#E8C23C', 3); if (T < 12.4) circ(cx, lerp(top - 6, oos[1] - 8, tub), 3.4, '#fff', '#0B0F1C', 1); }
      if (LB) { lab(cx + 9, top - 16, cx + rx + 40, top - 30, 'grão de pólen'); if (tub > .1) lab(cx + 1, top + (oos[1] - top) * .4, cx + rx + 50, oy - ry * .1, 'tubo polínico'); lab(cx - rx * .5, oy + ry * .2, cx - rx - 20, oy + ry * .6, 'gametófito feminino (n)'); lab(oos[0] - 6, oos[1], cx - rx - 20, oy - ry * .5, fe > .5 ? 'zigoto (2n)' : 'oosfera (n)'); }
      cap(T < 8 ? 'O pólen chega ao <b>óvulo</b> (a polinização). Dentro dele há o gametófito feminino (n) e a oosfera.' : T < 12.4 ? 'O grão de pólen forma o <b>tubo polínico</b>, que cresce até a oosfera e leva o núcleo espermático. <b>Não precisa de água</b> para nadar.' : 'O núcleo espermático se une à oosfera: forma-se o <b>zigoto</b> (2n).');
    } else if (step === 2) {
      const rx = Math.min(A.w * .2, 110, sh * .3), ry = Math.min(rx * 1.15, sh * .42), oy = cy + 14, e = ss(seg(T, 14, 16)); ovulo(cx, oy, rx, ry, true);
      ell(cx, oy, rx * .86, ry * .88, 0, '#5C8CC4', '#3A5F88', 1.6); ell(cx, oy, rx * .4 * e, ry * .4 * e, 0, N2, '#7A2A5A', 1.8);
      if (LB) { lab(cx, oy, cx + rx + 40, oy - ry * .3, 'embrião (2n)'); lab(cx - rx * .6, oy + ry * .4, cx - rx - 30, oy + ry * .7, 'reserva: gametófito feminino (n)'); lab(cx + rx * .8, oy - ry * .6, cx + rx + 40, oy - ry * .85, 'casca'); }
      cap('O óvulo vira <b>semente</b>: embrião (2n), reserva de alimento (o próprio gametófito feminino, <b>n</b>) e casca protetora. O pinhão é uma semente, sem fruto em volta.');
    } else {
      const sc4 = sc * 1.8, gy = A.y1 - 22, g = ss(seg(T, 22.5, 25.5)); line(A.x0 + 8, gy, A.x1 - 8, gy, '#7A5A38', 3);
      const bx = lerp(A.x0 + 40, cx - 20, ss(seg(T, 20, 22))), by = gy - 52 * sc4 - Math.sin(ss(seg(T, 20, 22)) * PI) * 10;
      ell(bx, by, 26 * sc4, 14 * sc4, -.15, '#3A55A8', '#1B2B66', 1.8); circ(bx + 24 * sc4, by - 8 * sc4, 9 * sc4, '#3A55A8', '#1B2B66', 1.8); shape([[bx + 32 * sc4, by - 9 * sc4], [bx + 44 * sc4, by - 6 * sc4], [bx + 32 * sc4, by - 4 * sc4]], '#F2C14B', '#8A6A18', 1); ell(bx - 4 * sc4, by - 3 * sc4, 14 * sc4, 6 * sc4, -.5, '#2A3F88');
      const pin = T < 22.2 ? [bx + 42 * sc4, by - 4 * sc4] : [cx - 20 + 42 * sc4, lerp(by - 4 * sc4, gy + 8, ss(seg(T, 22.2, 23)))];
      ell(pin[0], pin[1], 6, 9, .3, '#8A5A2B', '#4E3416', 1.4);
      if (g > 0) { const hh = g * 64 * sc4; line(pin[0], gy, pin[0], gy - hh, '#3E8E4A', 3); circ(pin[0] - 10 * g * sc4, gy - hh * .8, 8 * g * sc4, '#4FA85A'); circ(pin[0] + 10 * g * sc4, gy - hh * .7, 8 * g * sc4, '#4FA85A'); }
      if (LB) { lab(bx + 20 * sc4, by - 14 * sc4, bx + 40, by - 62 * sc4, 'gralha-azul'); if (T > 23) lab(pin[0], gy + 8, pin[0] + 60, gy + 24, 'pinhão enterrado'); }
      cap(T < 22.2 ? 'A <b>gralha-azul</b> e outros animais carregam pinhões e enterram para comer depois.' : T < 23 ? 'O pinhão vai para debaixo da terra.' : 'Alguns pinhões são esquecidos e <b>germinam</b>: os animais são dispersores importantes da araucária.');
    }
  }
  const FRU = baralho({
    nome: 'fru', cartas: [
      { t: 'pinhão', k: 0, x: 'a semente da araucária fica exposta, sem fruto: é a única "semente nua" aqui.' },
      { t: 'grão de feijão', k: 1, x: 'o grão é a semente; ela estava dentro da vagem, que é o fruto.' },
      { t: 'amendoim (o grão)', k: 1, x: 'o grão é a semente, e a casca, o fruto.' },
      { t: 'grão de milho', k: 2, x: 'é um fruto com uma semente colada na parede dele.' },
      { t: 'castanha-do-pará', k: 1, x: 'a castanha é a semente; o fruto é o ouriço lenhoso.' },
      { t: 'coco', k: 2, x: 'o coco inteiro é o fruto; a semente fica dentro.' },
      { t: 'tomate', k: 2, x: 'o tomate é o fruto: o ovário cresceu, e as sementes ficam dentro.' },
      { t: 'pêssego', k: 2, x: 'o pêssego é o fruto, com o caroço guardando a semente.' }
    ],
    alvos: [{ t: 'semente nua (gimnosperma)', c: '#C9A66B' }, { t: 'semente dentro de fruto (angiosperma)', c: VD }, { t: 'fruto', c: '#F28C3A' }],
    certo: c => '<b>Certo.</b> ' + c.x.charAt(0).toUpperCase() + c.x.slice(1),
    errado: (c, a) => `<b>Ainda não.</b> "${c.t}" não vai em "${a.t}". Pergunte: há fruto em volta da semente?`,
    fim: () => '<b>Pronto.</b> No dia a dia, chamamos de "semente" coisas que, na botânica, são frutos ou sementes dentro de frutos. Só o pinhão é semente nua.',
    dica: 'Toque num cartão e depois no lugar certo.'
  });
  const AGUA = [['musgo', 'musgo', 'musgo', 1], ['samambaia', 'samambaia', 'samambaia', 1], ['pinheiro', 'pinheiro', 'pinheiro', 0], ['ipê', 'ipe', 'ipe florido', 0]];
  function drawAgua(t, S, A) {
    S.ag = S.ag || {}; const n = 4, cols = NAR ? 2 : 4, g = 10, cw = (A.w - (cols - 1) * g) / cols, ch = Math.min(170, (A.h - 78 - Math.ceil(n / cols) * g) / Math.ceil(n / cols));
    tx('Quem precisa de água para a fecundação? Toque nos que precisam.', A.cx, A.y0 + 12, { s: NAR ? 13 : 15, w: 600, f: FH, c: C.txt, bg: false });
    AGUA.forEach(([nm, ic, , ], i) => { const x = A.x0 + (i % cols) * (cw + g), y = A.y0 + 30 + Math.floor(i / cols) * (ch + g), on = !!S.ag[i]; rr(x, y, cw, ch, 10, on ? rgba(XIL, .16) : 'rgba(19,26,43,.8)', on ? XIL : C.line, on ? 2.4 : 1.3); hitR(x, y, cw, ch, 'g' + i); icone(ic, x + cw / 2, y + ch - 36, ch - 64); tx(nm, x + cw / 2, y + ch - 14, { s: 14, w: 600, c: C.txt }); if (on) tx('precisa de água', x + cw / 2, y + 14, { s: 12, c: XIL }); });
    const by = A.y0 + 30 + Math.ceil(n / cols) * (ch + g) + 2; btn(A.cx - 60, by, 120, 40, 'Conferir', VD, 'gok');
  }
  def('plantae', 'gimnospermas', {
    t: 'Gimnospermas', s: 'pinheiros: pólen, tubo polínico e semente nua', c: VD,
    loc: S => ({ ciclo: 'Do pólen ao pinhão', roda: 'Roda do ciclo do pinheiro', fruto: 'Fruto ou semente', agua: 'Quem precisa de água' })[S.modo] || '', locNota: NOTA,
    alt: 'um estróbilo masculino soltando pólen, o óvulo com o tubo polínico, a semente com embrião e reserva, uma gralha enterrando um pinhão, a roda do ciclo e dois jogos',
    still: 3, ctlVis: S => S.modo === 'ciclo',
    extra: [modo('ciclo', 'Do pólen ao pinhão'), modo('roda', 'Roda do ciclo'), modo('fruto', 'Fruto ou semente'), modo('agua', 'Quem precisa de água')],
    init(S) { S.modo = 'ciclo'; S.nodo = null; S.ag = {}; S.msg = null; FRU.zera(S); },
    d: TXT.V4.d + '<p>Siga o caminho do pólen ao pinhão (toque nas etapas para saltar), veja a roda do ciclo e arraste os alimentos entre semente nua, semente dentro de fruto e fruto.</p>',
    enem: TXT.V4.enem,
    links: [LK.ecologia, LK.clado],
    tap(x, y, S) {
      const h = hitAt(x, y);
      if (S.modo === 'ciclo') { if (typeof h === 'string' && /^p\d$/.test(h)) S.ph = V4P[+h[1]][2] + .1; }
      else if (S.modo === 'roda') tocaRoda(S, x, y); else if (S.modo === 'fruto') FRU.tap(x, y, S);
      else if (typeof h === 'string') { if (/^g\d$/.test(h)) { S.ag[+h[1]] = !S.ag[+h[1]]; S.msg = null; } else if (h === 'gok') { const ok = AGUA.every((a, i) => !!S.ag[i] === !!a[3]); S.msg = ok ? '<b>Certo.</b> Só o musgo e a samambaia: o anterozoide nada. Pinheiro e ipê usam o tubo polínico.' : '<b>Ainda não.</b> Lembre quem tem anterozoides com flagelos e quem tem tubo polínico.'; } }
    },
    grab(x, y, S) { return S.modo === 'fruto' && FRU.grab(x, y, S); }, grabMove(x, y, S) { if (S.modo === 'fruto') FRU.grabMove(x, y, S); }, grabEnd(x, y, S) { if (S.modo === 'fruto') FRU.grabEnd(x, y, S); },
    draw(t, S) {
      const A = area();
      if (S.modo === 'ciclo') drawPinhao(t, S, A);
      else if (S.modo === 'roda') { roda(S, A, { esp: 1, gam: .12, dom: 'esp', nm: { gam: 'gametófitos (n), no pólen e no óvulo' } }); cap(capRoda(S, 'Na araucária, o esporófito (2n) é a árvore. Os gametófitos (n) são minúsculos: o <b>grão de pólen</b> e o interior do óvulo.')); }
      else if (S.modo === 'fruto') { FRU.draw(S, { x0: A.x0, y0: A.y0, x1: A.x1, y1: A.y1 }, { cols: NAR ? 2 : 4, cartaH: NAR ? 38 : 42 }); cap(FRU.msg(S) || 'Oito alimentos. Qual é semente nua, qual é semente dentro de fruto e qual é o próprio fruto?'); }
      else { drawAgua(t, S, A); cap(S.msg || 'Gimnospermas e angiospermas usam o tubo polínico; musgos e samambaias, anterozoides que nadam.'); }
    }
  });

  // =====================================================================================
  // V5 ANGIOSPERMAS
  // =====================================================================================
  // flor em corte esquemático. (x, y) = base do pedúnculo; s = altura. dS, dP, dE (0 a 1) afastam sépalas, pétalas e estames; ov = tamanho do ovário
  function flor(x, y, s, o = {}) {
    const dS = o.dS || 0, dP = o.dP || 0, dE = o.dE || 0, ov = o.ov || 1, ry = y - s * .16, pet = o.pet == null ? 1 : o.pet;
    line(x, y, x, ry, '#3E8E4A', 4);
    const A = {};
    if (pet > .02) [-1, 1].forEach(sd => ell(x + sd * (s * .14 + dP * s * .3), ry - s * .26 - dP * s * .05 + (1 - pet) * s * .3 * (1 + dP), s * .07, s * .2, sd * .25, rgba('#D783B8', pet), '#8A4A78', 1.6));
    A.pet = [x - (s * .14 + dP * s * .3), ry - s * .26 - dP * s * .05];
    [-1, 1].forEach(sd => ell(x + sd * (s * .08 + dS * s * .36), ry - s * .02 + dS * s * .04, s * .075, s * .028, sd * .5, '#5FA84A', '#2E6B3A', 1.4));
    A.sep = [x - (s * .08 + dS * s * .36), ry - s * .02 + dS * s * .04];
    [-1, 1].forEach(sd => { const ex = x + sd * (s * .13 + dE * s * .34), ey = ry - s * .38 + dE * s * .02; line(x + sd * s * .035, ry - s * .04, ex, ey, '#8AB04A', 2.4); ell(ex, ey - s * .02, s * .022, s * .035, 0, '#E8C23C', '#9A7A18', 1.2); });
    A.est = [x + (s * .13 + dE * s * .34), ry - s * .4];
    const ot = ry - s * .1 - s * .09 * ov; line(x, ot, x, ry - s * .5, '#9CC070', 3);
    ell(x, ry - s * .1, s * .07 * ov, s * .09 * ov, 0, '#9CC070', '#3E6B2A', 1.8); A.ovl = [x, ry - s * .1]; A.ovr = s * .07 * ov;
    [[-.02, -.01], [.02, .02], [-.01, .04]].forEach(([u, v]) => circ(x + u * s * ov, ry - s * .1 + v * s * ov, s * .016 * ov, '#F4E3A1', '#8A7A2A', 1));
    ell(x, ry - s * .52, s * .042, s * .02, 0, '#E8B04A', '#9A6A18', 1.4); A.stg = [x, ry - s * .52]; A.stl = [x, ry - s * .34];
    return A;
  }
  function abelha(x, y, k) { ell(x - 7 * k, y - 8 * k, 8 * k, 4 * k, -.5, 'rgba(255,255,255,.75)', '#9DA9C4', 1); ell(x, y, 11 * k, 7 * k, 0, '#F2C14B', '#5A4410', 1.4); [-4, 1, 6].forEach(d => line(x + d * k, y - 6 * k, x + d * k, y + 6 * k, '#2A2210', 2 * k)); circ(x + 11 * k, y - 1 * k, 4 * k, '#2A2210'); }
  const V5T = 30;
  function drawDupla(t, S, A) {
    const T = t % V5T, sp = split(A, NAR ? .5 : .46), a = sp.a, b = sp.b; panel(a.x, a.y, a.w, a.h); panel(b.x, b.y, b.w, b.h);
    const s = Math.min(a.h * .8, a.w * 1.4), fx = a.x + a.w / 2, fy = a.y + a.h - 14, fall = ss(seg(T, 16, 19)), grow = ss(seg(T, 15, 22)), open = ss(seg(T, 23, 27));
    const F = flor(fx, fy, s, { dP: fall * 1.2, pet: 1 - ss(seg(T, 17, 21)), ov: 1 + grow * 1.5 * (open < .01 ? 1 : 0) });
    // tubo polínico no estilete
    const tub = ss(seg(T, 3.5, 9)); if (tub > 0 && T < 22) line(F.stg[0], F.stg[1], F.stg[0], lerp(F.stg[1], F.ovl[1] - 4, tub), '#E8C23C', 2.6);
    for (let i = 0; i < 3; i++) if (T > 2.5 && T < 22) circ(F.stg[0] + (i - 1) * 5, F.stg[1] - 4 - i % 2 * 3, 2.4, '#F2D35B');
    if (open > .01) { const [ox, oy] = F.ovl; ell(ox - open * 14, oy, s * .07 * 2.5, s * .09 * 2.5, 0, '#9CC070', '#3E6B2A', 1.6); ell(ox + open * 14, oy, s * .07 * 2.5, s * .09 * 2.5, 0, '#9CC070', '#3E6B2A', 1.6); circ(ox - 5, oy, 5, '#8A5A2B'); circ(ox + 5, oy + 6, 5, '#8A5A2B'); }
    // abelha
    const ab = T < 3 ? ss(T / 3) : T < 5 ? 1 : ss(seg(T, 5, 8)); if (T < 9) { const px = T < 5 ? lerp(a.x + 20, F.stg[0] + 16, ab) : lerp(F.stg[0] + 16, a.x + a.w - 20, ab), py = T < 5 ? lerp(a.y + 30, F.stg[1] - 12, ab) : lerp(F.stg[1] - 12, a.y + 30, ab); abelha(px, py + Math.sin(t * 20) * 1.5, NAR ? .8 : 1); }
    if (LB && T < 9) tx('abelha leva pólen', a.x + a.w / 2, a.y + 12, { s: 13, c: C.dim });
    // zoom no óvulo
    const rx = Math.min(b.w * .28, 100, b.h * .26), ry = Math.min(rx * 1.3, b.h * .38), cx = b.x + b.w / 2, cy = b.y + b.h * .56, top = cy - ry;
    const e1 = ss(seg(T, 9, 13)), fz = ss(seg(T, 13, 15)), sem = ss(seg(T, 17, 23));
    ell(cx, cy, rx, ry, 0, sem > .3 ? '#8A5A2B' : '#C9A66B', '#5A3A1A', 2.4 + sem * 2); ell(cx, cy, rx * .86, ry * .88, 0, '#5C8CC4', '#3A5F88', 1.4);
    const oos = [cx, cy - ry * .45], pol = [cx, cy + ry * .15];
    const tb = ss(seg(T, 3.5, 9)); line(cx, top - 14, cx, lerp(top - 14, oos[1] - 4, tb), '#E8C23C', 3);
    if (fz < .5) { circ(oos[0], oos[1], 7, '#BFE0FF', '#0B0F1C', 1.4); circ(pol[0] - 8, pol[1], 6, N1, '#0B0F1C', 1.2); circ(pol[0] + 8, pol[1], 6, N1, '#0B0F1C', 1.2); }
    else {
      circ(oos[0], oos[1], 7 + 3 * sem, N2, '#0B0F1C', 1.4); circ(pol[0], pol[1], 11 + 22 * sem, ENDO, '#6A5410', 1.6);
      if (sem > .2) ell(oos[0], cy - ry * .1, 9 + 8 * sem, 11 + 8 * sem, 0, N2, '#7A2A5A', 1.6);
    }
    if (T >= 9 && T < 13.6) { [[oos, -5], [pol, 0]].forEach(([dst, dx], i) => { const u = e1 * (1 - fz * 0); const px = lerp(cx + (i ? 12 : -12), dst[0] + (i ? 5 : -5), u), py = lerp(top - 4, dst[1] + (i ? -8 : -4), u); circ(px, py, 3.6, '#fff', '#0B0F1C', 1); }); }
    if (LB) {
      tx('zoom no óvulo, dentro do ovário', cx, b.y + 14, { s: 13, c: C.dim });
      lab(cx, top - 10, b.x + b.w - 30, b.y + 40, 'tubo polínico'); if (T < 13.6) { lab(pol[0] + 8, pol[1], b.x + b.w - 30, cy + ry * .5, '2 núcleos polares (n)'); lab(oos[0], oos[1], b.x + 30, b.y + 56, 'oosfera (n)'); }
      else { lab(pol[0], pol[1], b.x + b.w - 30, cy + ry * .5, sem > .4 ? 'endosperma (3n)' : 'célula 3n'); lab(oos[0], oos[1], b.x + 30, b.y + 56, sem > .4 ? 'embrião (2n)' : 'zigoto (2n)'); }
    }
    cap(T < 3 ? 'A abelha leva pólen de outra flor.' : T < 9 ? 'O pólen pousa no <b>estigma</b> e forma o <b>tubo polínico</b>, que desce pelo estilete até o óvulo.' : T < 13 ? 'O tubo leva <b>dois núcleos espermáticos</b> ao óvulo.' : T < 15.5 ? '<b>Dupla fecundação</b>: um núcleo se une à oosfera e forma o zigoto (2n); o outro se une aos dois núcleos polares e forma a célula 3n.' : T < 23 ? 'O <b>óvulo vira semente</b> (embrião 2n e endosperma 3n) e o <b>ovário vira fruto</b>. As pétalas caem.' : 'O fruto amadurece e se abre, mostrando as sementes.');
  }
  function drawFlor(t, S, A) {
    const v = S.v, dS = ss(seg(v, 0, 1)), dP = ss(seg(v, 1, 2)), dE = ss(seg(v, 2, 3)), sz = ss(seg(v, 3, 4));
    rr(A.x0, A.y0, A.w, A.h, 12, 'rgba(19,26,43,.5)', C.line, 1);
    const s = Math.min(A.h * .85, A.w * .9), fx = A.cx, fy = A.y1 - 14, F = flor(fx, fy, s, { dS, dP, dE, ov: 1 + sz * 1.1 });
    if (LB) {
      const lx = Math.min(A.w * .3, 200); lab(F.sep[0], F.sep[1], fx - lx - 30, fy - s * .08, 'sépalas (cálice)'); lab(F.pet[0], F.pet[1], fx - lx - 40, fy - s * .4, 'pétalas (corola)');
      lab(F.est[0], F.est[1], fx + lx + 30, fy - s * .5, 'estame: antera e filete (androceu)'); lab(F.stg[0], F.stg[1], fx + lx + 30, fy - s * .75, 'estigma'); lab(F.stl[0], F.stl[1], fx + lx + 30, fy - s * .3, 'estilete'); lab(F.ovl[0], F.ovl[1], fx + lx + 30, fy - s * .1, 'ovário com óvulos (gineceu)');
    }
    cap(v < .5 ? 'Uma flor eudicotiledônea em corte. Use a faixa "Desmontar" para separar as peças.' : v < 1.5 ? 'As <b>sépalas</b> formam o cálice e protegem o botão.' : v < 2.5 ? 'As <b>pétalas</b> formam a corola e atraem os animais.' : v < 3.5 ? 'Os <b>estames</b> (androceu) fazem os grãos de pólen nas anteras.' : 'O <b>carpelo</b> (gineceu): estigma pegajoso, estilete e ovário com os óvulos.');
  }
  function drawCaju(t, S, A) {
    const T = t % 16, g = ss(seg(T, 2, 10)), cx = A.cx, top = A.y0 + A.h * .18, base = A.y1 - 20;
    rr(A.x0, A.y0, A.w, A.h, 12, 'rgba(19,26,43,.5)', C.line, 1);
    const ph = (A.h * .5) * (.35 + .65 * g), pw = A.w * .09 * (.5 + .8 * g);
    line(cx, base, cx, top + 20, '#6B4A2B', 4); ell(cx, top + 8, 12, 6, 0, '#4FA85A');
    // pedúnculo que incha (pseudofruto) e fruto verdadeiro na ponta
    const py0 = top + 14, py1 = py0 + ph; X.beginPath(); X.moveTo(cx - 5, py0); X.bezierCurveTo(cx - pw * 1.3, py0 + ph * .35, cx - pw * 1.5, py1 - ph * .2, cx, py1); X.bezierCurveTo(cx + pw * 1.5, py1 - ph * .2, cx + pw * 1.3, py0 + ph * .35, cx + 5, py0); X.closePath(); X.fillStyle = lerpCor(g); X.fill(); X.strokeStyle = '#8A3A18'; X.lineWidth = 1.8; X.stroke();
    X.beginPath(); X.ellipse(cx + 2, py1 + 10, 9 + 5 * g, 13 + 5 * g, .5, 0, TAU); X.fillStyle = '#7A8A4A'; X.fill(); X.strokeStyle = '#3E4A1E'; X.lineWidth = 1.6; X.stroke();
    if (LB) { lab(cx, py0 + ph * .45, A.x1 - 40, py0 + ph * .3, 'parte suculenta: pedúnculo inchado (pseudofruto)'); lab(cx + 8, py1 + 12, A.x1 - 40, py1 + 32, 'castanha: o fruto verdadeiro'); lab(cx, base - 10, A.x0 + 50, base - 30, 'ramo'); }
    cap(g < .3 ? 'No caju, uma flor pequena dá origem a dois órgãos diferentes.' : g < .95 ? 'O <b>pedúnculo incha</b> e fica carnoso e doce, enquanto o ovário forma a castanha.' : 'A parte que comemos é um <b>pseudofruto</b>; a "castanha" é o <b>fruto verdadeiro</b>, com a semente dentro.');
  }
  const lerpCor = g => mix('#C9D07A', '#E8742A', g);
  const POL = baralho({
    nome: 'pol', cartas: [
      { t: 'milho: flor pequena, sem cor nem cheiro, muito pólen leve', k: 0, x: 'flores pequenas, sem cor e sem cheiro, com muito pólen leve, são polinizadas pelo vento.' },
      { t: 'maracujá: flor grande, colorida, perfumada e com néctar', k: 1, x: 'cor, perfume e néctar atraem insetos como as abelhas.' },
      { t: 'flor tubular, vermelha e sem cheiro', k: 2, x: 'flores tubulares e vermelhas, sem cheiro, são visitadas por beija-flores.' },
      { t: 'flor clara que abre à noite', k: 3, x: 'flores claras que abrem à noite atraem morcegos.' }
    ],
    alvos: [{ t: 'vento', c: '#BFE0FF' }, { t: 'abelha', c: '#F2C14B' }, { t: 'beija-flor', c: '#F0605D' }, { t: 'morcego', c: '#9A6BFF' }],
    certo: c => '<b>Certo.</b> ' + c.x.charAt(0).toUpperCase() + c.x.slice(1),
    errado: (c, a) => `<b>Ainda não.</b> Essa flor não combina com "${a.t}". Veja cor, cheiro, néctar e horário.`,
    fim: () => '<b>Pronto.</b> Flores e polinizadores evoluíram juntos: é a coevolução. O declínio das abelhas ameaça muitas colheitas.',
    dica: 'Toque numa flor e depois no polinizador mais provável.'
  });
  const FRT = baralho({
    nome: 'frt', cartas: [
      { t: 'tomate', k: 0, x: 'o ovário cresceu e virou o fruto.' },
      { t: 'pepino', k: 0, x: 'o ovário cresceu e virou o fruto.' },
      { t: 'vagem de feijão', k: 0, x: 'a vagem é o ovário desenvolvido: um fruto.' },
      { t: 'grão de feijão', k: 2, x: 'o grão é o óvulo desenvolvido: a semente.' },
      { t: 'caju (a parte suculenta)', k: 1, x: 'cresceu o pedúnculo, não o ovário.' },
      { t: 'castanha do caju', k: 0, x: 'a castanha é o ovário desenvolvido: o fruto verdadeiro.' },
      { t: 'maçã', k: 1, x: 'na parte comestível cresceu o receptáculo da flor, não o ovário.' },
      { t: 'morango', k: 1, x: 'a parte vermelha é o receptáculo; os frutinhos verdadeiros são os pontinhos.' }
    ],
    alvos: [{ t: 'fruto (ovário)', c: '#F28C3A' }, { t: 'pseudofruto', c: '#E58AB0' }, { t: 'semente (óvulo)', c: '#C9A66B' }],
    certo: c => '<b>Certo.</b> ' + c.x.charAt(0).toUpperCase() + c.x.slice(1),
    errado: (c, a) => `<b>Ainda não.</b> "${c.t}" não vai em "${a.t}". Pergunte qual parte da flor cresceu.`,
    fim: () => '<b>Pronto.</b> Óvulo vira semente; ovário vira fruto; quando outra parte da flor cresce, é pseudofruto.',
    dica: 'Toque num cartão e depois no lugar certo.'
  });
  // folha com nervuras paralelas (mono) ou em rede (eudi), desenhada no cartão
  const folhaIc = (mono, lx, y, s) => {
    const an = -.4, dx = Math.cos(an), dy = Math.sin(an), px = -dy, py = dx;
    ell(lx, y, s * .75, s * .36, an, '#4FA85A', '#2E6B3A', 1.2);
    if (mono) for (let i = -2; i <= 2; i++) line(lx - dx * s * .6 + px * i * s * .1, y - dy * s * .6 + py * i * s * .1, lx + dx * s * .6 + px * i * s * .1, y + dy * s * .6 + py * i * s * .1, 'rgba(255,255,255,.7)', 1);
    else { line(lx - dx * s * .7, y - dy * s * .7, lx + dx * s * .7, y + dy * s * .7, 'rgba(255,255,255,.8)', 1.3); for (let i = -2; i <= 2; i++) { const qx = lx + dx * i * s * .26, qy = y + dy * i * s * .26; line(qx, qy, qx + px * s * .22 + dx * s * .1, qy + py * s * .22 + dy * s * .1, 'rgba(255,255,255,.6)', 1); line(qx, qy, qx - px * s * .22 + dx * s * .1, qy - py * s * .22 + dy * s * .1, 'rgba(255,255,255,.6)', 1); } }
  };
  const MON = baralho({
    nome: 'mon',
    cartas: [['cana-de-açúcar', 0, 'monocotiledônea: nervuras paralelas e raiz fasciculada.'], ['bambu', 0, 'monocotiledônea, do grupo das gramíneas.'], ['palmeira', 0, 'monocotiledônea: nervuras paralelas.'], ['orquídea', 0, 'monocotiledônea: flores com peças em múltiplos de 3.'], ['feijão', 1, 'eudicotiledônea: nervuras em rede e raiz pivotante.'], ['laranjeira', 1, 'eudicotiledônea: dois cotilédones.'], ['ipê', 1, 'eudicotiledônea: nervuras em rede.'], ['rosa', 1, 'eudicotiledônea: flor com peças em múltiplos de 5.']].map(([n, k, x]) => ({ t: n, k, x, ic: (cx, cy, w, h) => { const sz = Math.min(h * .8, 32); folhaIc(k === 0, cx - w / 2 + 10 + sz * .75, cy, sz); tx(n, cx - w / 2 + 20 + sz * 1.5, cy, { s: 12, w: 600, c: C.txt, bg: false, a: 'left' }); } })),
    alvos: [{ t: 'monocotiledônea', c: '#9FD84A' }, { t: 'eudicotiledônea', c: '#E58AB0' }],
    certo: c => '<b>Certo.</b> ' + c.t.charAt(0).toUpperCase() + c.t.slice(1) + ' é ' + c.x,
    errado: (c, a) => `<b>Ainda não.</b> Olhe a nervura da folha: paralela é de monocotiledônea, em rede é de eudicotiledônea.`,
    fim: () => '<b>Pronto.</b> Monocotiledôneas: um cotilédone, nervuras paralelas, raiz fasciculada. Eudicotiledôneas: dois cotilédones, nervuras em rede, raiz pivotante.',
    dica: 'Toque numa planta e depois no grupo certo.'
  });
  const B5 = S => ({ poliniza: POL, frutos: FRT, mono: MON })[S.modo];
  def('plantae', 'angiospermas', {
    t: 'Angiospermas', s: 'polinização, dupla fecundação e dispersão', c: VD,
    loc: S => ({ flor: 'A flor por dentro', dupla: 'Dupla fecundação', caju: 'Caju: fruto e pseudofruto', poliniza: 'Monte a polinização', frutos: 'Fruto, pseudofruto ou semente', mono: 'Mono ou eudi', roda: 'Roda do ciclo da flor' })[S.modo] || '', locNota: NOTA,
    alt: 'uma flor desmontada em camadas, a abelha, o tubo polínico e a dupla fecundação no óvulo, o caju, três jogos de classificação e a roda do ciclo',
    still: 12,
    ctl: { l: 'Desmontar', min: 0, max: 4, step: .25, v: 0, f: v => v === 0 ? 'flor inteira' : v < 1 ? 'sépalas' : v < 2 ? 'pétalas' : v < 3 ? 'estames' : 'carpelo', rate: () => 1 }, stillV: 0,
    ctlVis: S => S.modo === 'flor',
    extra: [modo('flor', 'Flor'), modo('dupla', 'Fecundação'), modo('caju', 'Caju'), modo('poliniza', 'Polinização'), modo('frutos', 'Frutos'), modo('mono', 'Mono ou eudi'), modo('roda', 'Roda')],
    init(S) { S.modo = 'flor'; S.nodo = null; POL.zera(S); FRT.zera(S); MON.zera(S); },
    d: TXT.V5.d + '<p>Desmonte a flor com a faixa, acompanhe a dupla fecundação e depois resolva os três jogos de arrastar.</p>',
    enem: TXT.V5.enem,
    links: [LK.ecologia, LK.celveg, LK.clado],
    tap(x, y, S) { if (S.modo === 'roda') tocaRoda(S, x, y); else if (B5(S)) B5(S).tap(x, y, S); },
    grab(x, y, S) { return !!B5(S) && B5(S).grab(x, y, S); }, grabMove(x, y, S) { if (B5(S)) B5(S).grabMove(x, y, S); }, grabEnd(x, y, S) { if (B5(S)) B5(S).grabEnd(x, y, S); },
    draw(t, S) {
      const A = area(), bx = { x0: A.x0, y0: A.y0, x1: A.x1, y1: A.y1 };
      if (S.modo === 'flor') drawFlor(t, S, A); else if (S.modo === 'dupla') drawDupla(t, S, A); else if (S.modo === 'caju') drawCaju(t, S, A);
      else if (S.modo === 'poliniza') { POL.draw(S, bx, { cols: NAR ? 1 : 2, cartaH: NAR ? 44 : 44 }); cap(POL.msg(S) || 'Quatro flores e quatro polinizadores. Use as dicas de cor, cheiro, néctar e horário.'); }
      else if (S.modo === 'frutos') { FRT.draw(S, bx, { cols: NAR ? 2 : 4, cartaH: NAR ? 38 : 42 }); cap(FRT.msg(S) || 'Em cada caso, qual parte da flor cresceu?'); }
      else if (S.modo === 'mono') { MON.draw(S, bx, { cols: NAR ? 2 : 4, cartaH: NAR ? 40 : 46 }); cap(MON.msg(S) || 'Quatro monocotiledôneas e quatro eudicotiledôneas. Olhe a nervura da folha desenhada.'); }
      else { roda(S, A, { esp: 1, gam: .05, dom: 'esp', nm: { gam: 'gametófitos (n), dentro da flor' } }); cap(capRoda(S, 'Na angiosperma, o esporófito (2n) é a planta; os gametófitos (n), o grão de pólen e o saco embrionário, ficam <b>dentro da flor</b>.')); }
    }
  });

  // =====================================================================================
  // V6 RAIZ, CAULE E FOLHA
  // =====================================================================================
  function drawPlanta(t, S, A) {
    const dt = passo(S); S.an = cl((S.an || 0) + (S.anel ? dt / 12 : -dt / 3), 0, 1);
    rr(A.x0, A.y0, A.w, A.h, 12, 'rgba(19,26,43,.5)', C.line, 1);
    const cx = A.cx - (NAR ? 0 : A.w * .08), gy = A.y0 + A.h * .56, top = A.y0 + A.h * .12, rootY = A.y1 - 12, ax = cx - 5, fx = cx + 5, sy = lerp(gy, top + 30, .5);
    rr(A.x0 + 6, gy, A.w - 12, A.y1 - gy - 6, 6, 'rgba(110,76,44,.55)');
    // raiz: pivotante com ramos e pelos absorventes
    const dead = S.an;
    const rc = mix('#C9A27A', '#3A2A1C', dead);
    line(cx, gy, cx, rootY - 6, rc, 5); [[-1, .3], [1, .35], [-1, .6], [1, .65]].forEach(([sd, f]) => { const y1 = lerp(gy, rootY, f); line(cx, y1, cx + sd * A.h * .2, y1 + A.h * .08, rc, 3); for (let i = 0; i < 4; i++) line(cx + sd * A.h * .2 * (.5 + i * .15), y1 + A.h * .08 * (.5 + i * .15), cx + sd * A.h * .2 * (.5 + i * .15) + sd * 5, y1 + A.h * .08 * (.5 + i * .15) + 6, rgba('#E8DCC0', .8), 1); });
    // caule e folhas
    line(cx, gy, cx, top + 24, '#7A5A38', 12); line(ax, gy + 2, ax, top + 30, XIL, 3); line(fx, gy - 4, fx, top + 30, FLO, 3);
    const folhas = [[-1, .3], [1, .42], [-1, .62], [1, .74]], ay = f => lerp(gy - 10, top + 40, f);
    folhas.forEach(([sd, f]) => { const y = ay(f); line(cx, y, cx + sd * 18, y - 8, '#4E7A38', 3); ell(cx + sd * 56, y - 14, 42, 17, sd * -.35, '#4FA85A', '#2E6B3A', 1.6); line(cx + sd * 18, y - 8, cx + sd * 92, y - 20, 'rgba(255,255,255,.4)', 1); });
    ell(cx, top + 14, 24, 28, 0, '#4FA85A', '#2E6B3A', 1.6);
    // fruto
    const fy = ay(.52); line(fx, fy, cx + 52, fy - 4, '#7A5A38', 3); circ(cx + 58, fy + 8, 12, '#E8742A', '#8A3A18', 1.6);
    // seivas: xilema sobe (azul), floema leva açúcar das folhas ao resto (laranja)
    for (let i = 0; i < 14; i++) { const f = fr(t * .18 + i / 14), y = lerp(rootY - 14, top + 34, f); circ(ax, y, 2.6, XIL); }
    const cut = gy - A.h * .1;
    for (let i = 0; i < 14; i++) {
      const f = fr(t * .12 + i / 14);
      if (f < .5) { const u = f / .5, y = lerp(top + 34, rootY - 14, u); if (S.an > .02 && y > cut) { circ(fx, cut - 4 - (i % 5) * 4, 2.6, FLO); continue; } circ(fx, y, 2.6, FLO); }
      else { const u = (f - .5) / .5, px = lerp(fx, cx + 56, u), py = lerp(fy, fy + 8, u); circ(px, lerp(ay(.3), fy, u) * 0 + py + (1 - u) * 0, 2.6, FLO); }
    }
    // anel de Malpighi: casca retirada em volta do tronco
    if (S.anel) { rr(cx - 10, cut - 7, 20, 14, 2, '#C9A27A', '#3E2A16', 1.4); line(fx, cut - 7, fx, cut + 7, '#3A2A1C', 5); }
    if (LB) {
      lab(cx - 24, lerp(gy, rootY, .7), A.x0 + 60, rootY - 26, 'raiz: absorve água e sais'); lab(cx + 6, gy - A.h * .25, A.x1 - 30, gy - A.h * .12, 'caule: sustenta e conduz');
      lab(cx + 90, ay(.74) - 22, A.x1 - 30, top + 10, 'folha: fotossíntese'); lab(ax, gy - 40, A.x0 + 70, gy - A.h * .2, 'xilema: seiva bruta, azul'); lab(fx, gy - A.h * .3, A.x1 - 30, gy - A.h * .32, 'floema: seiva elaborada, laranja'); lab(cx + 58, fy + 8, A.x1 - 30, fy + 40, 'fruto');
    }
    cap(S.anel ? (S.an < .5 ? 'Com o <b>anel de Malpighi</b>, o floema foi cortado: o açúcar das folhas para no corte, mas o xilema continua levando água.' : 'Sem açúcar, a <b>raiz morre de fome</b>, e a árvore morre semanas ou meses depois.') : '<b>Xilema</b> (azul): seiva bruta, da raiz para as folhas. <b>Floema</b> (laranja): seiva elaborada, das folhas para a raiz, os frutos e os brotos. Toque em "Anel de Malpighi".');
  }
  function drawEstomato(t, S, A) {
    const luz = S.v / 10, agua = S.agua, ab = agua ? luz : .06, foto = ab * (.2 + .8 * luz), perda = ab;
    const sp = split(A, NAR ? .62 : .6), a = sp.a, b = sp.b; panel(a.x, a.y, a.w, a.h); panel(b.x, b.y, b.w, b.h);
    // estômato em corte: duas células-guarda e o poro
    const cx = a.x + a.w / 2, cy = a.y + a.h / 2 + 6, gw = Math.min(a.w * .16, 46), gh = Math.min(a.h * .2, 70), pore = gw * .9 * ab;
    rr(a.x + 10, cy - gh - 14, a.w - 20, 14, 4, '#7FC63B', '#3E6B2A', 1.2); rr(a.x + 10, cy + gh, a.w - 20, 14, 4, '#7FC63B', '#3E6B2A', 1.2);
    [-1, 1].forEach(sd => { X.beginPath(); X.moveTo(cx + sd * (pore / 2 + 2), cy - gh); X.quadraticCurveTo(cx + sd * (pore / 2 + gw * 1.3), cy, cx + sd * (pore / 2 + 2), cy + gh); X.quadraticCurveTo(cx + sd * (pore / 2 + gw * .35), cy, cx + sd * (pore / 2 + 2), cy - gh); X.fillStyle = '#4FA85A'; X.fill(); X.strokeStyle = '#2E6B3A'; X.lineWidth = 2; X.stroke(); });
    for (let i = 0; i < 6 * ab + .01; i++) { const f = fr(t * .5 + i / 6); circ(cx - 10 + (i % 3) * 10, lerp(cy - gh - 40, cy + gh - 6, f), 3, '#BFE0FF', '#0B0F1C', .8); const g = fr(t * .5 + i / 6 + .5); circ(cx + 10 - (i % 3) * 8, lerp(cy + gh - 6, cy - gh - 40, g), 2.6, rgba(XIL, .8)); }
    if (LB) { tx('ar', a.x + a.w - 24, a.y + 16, { s: 12, c: C.dim }); tx('dentro da folha', a.x + 52, a.y + a.h - 14, { s: 12, c: C.dim }); lab(cx - pore / 2 - gw * .6, cy + gh * .3, a.x + 70, cy + gh + 40, 'célula-guarda'); lab(cx, cy, a.x + a.w - 70, cy + gh * .3, ab < .3 ? 'estômato fechado' : 'estômato aberto'); tx('CO₂ entra', a.x + 52, a.y + 34, { s: 12, c: '#BFE0FF' }); tx('vapor de água sai', a.x + a.w - 66, a.y + 34, { s: 12, c: XIL }); }
    // medidores
    const m = (y, lb, v, c) => { tx(lb, b.x + 14, y, { s: 13, w: 600, c: C.txt, a: 'left' }); rr(b.x + 14, y + 12, b.w - 28, 16, 8, 'rgba(255,255,255,.08)', C.line, 1); rr(b.x + 14, y + 12, Math.max(4, (b.w - 28) * v), 16, 8, c); };
    m(b.y + 24, 'fotossíntese', foto, '#7FC63B'); m(b.y + 24 + 56, 'perda de água', perda, XIL);
    tx(agua ? 'solo úmido' : 'solo seco', b.x + 14, b.y + 24 + 124, { s: 13, w: 600, a: 'left', c: agua ? XIL : '#C08A5A' });
    cap(!agua ? '<b>Solo seco</b>: o ácido abscísico faz as células-guarda perderem água, e o estômato se fecha mesmo com muita luz. A planta economiza água, mas a fotossíntese cai.' : luz < .2 ? 'Com pouca luz, o estômato quase não se abre.' : 'Com <b>luz</b> e <b>água</b>, o estômato abre: entra CO₂ para a fotossíntese, e a planta transpira.');
  }
  const FEI = baralho({
    nome: 'fei', cartas: [
      { t: 'batata-inglesa', k: 1, x: 'é um tubérculo: um caule subterrâneo, com "olhos" (gemas), que só caules têm.' },
      { t: 'batata-doce', k: 0, x: 'é uma raiz tuberosa, que guarda reserva.' },
      { t: 'mandioca', k: 0, x: 'é uma raiz tuberosa.' },
      { t: 'cenoura', k: 0, x: 'é uma raiz tuberosa.' },
      { t: 'cebola', k: 1, x: 'o bulbo é um caule subterrâneo pequeno, envolvido por folhas modificadas.' },
      { t: 'gengibre', k: 1, x: 'é um rizoma: caule subterrâneo horizontal.' },
      { t: 'cana-de-açúcar', k: 1, x: 'é um colmo: caule com nós.' },
      { t: 'alface', k: 2, x: 'comemos as folhas.' },
      { t: 'beterraba', k: 0, x: 'é uma raiz tuberosa.' }
    ],
    alvos: [{ t: 'raiz', c: '#C9A27A' }, { t: 'caule', c: '#8A6A3A' }, { t: 'folha', c: '#4FA85A' }],
    certo: c => '<b>Certo.</b> ' + c.t.charAt(0).toUpperCase() + c.t.slice(1) + ': ' + c.x,
    errado: (c, a) => c.t === 'batata-inglesa' ? '<b>Ainda não.</b> Olhe os "olhos" da batata-inglesa: são gemas, e só caules têm gemas. Ela é caule.' : `<b>Ainda não.</b> "${c.t}" não é ${a.t}. Pense em onde ela cresce e se tem gemas ou nós.`,
    fim: () => '<b>Pronto.</b> Batata-inglesa é caule, batata-doce é raiz, cebola é bulbo e gengibre é rizoma.',
    dica: 'Toque num alimento e depois em raiz, caule ou folha.'
  });
  def('plantae', 'orgaos', {
    t: 'Raiz, caule e folha', s: 'o que cada órgão faz e como a seiva sobe e desce', c: VD,
    loc: S => ({ planta: 'A planta por dentro', estomato: 'Estômato no controle', feira: 'Na feira' })[S.modo] || '', locNota: NOTA,
    alt: 'uma planta em corte com o xilema em azul e o floema em laranja, o anel de Malpighi, um estômato que abre e fecha com luz e água, e um jogo de classificar alimentos em raiz, caule ou folha',
    still: 4,
    ctl: { l: 'Luz', min: 0, max: 10, step: 1, v: 8, f: v => v < 3 ? 'pouca' : v < 7 ? 'média' : 'muita', rate: () => 1 }, stillV: 8,
    ctlVis: S => S.modo === 'estomato',
    extra: [modo('planta', 'A planta'), { t: 'Anel de Malpighi', on: S => { S.modo = 'planta'; S.anel = !S.anel; }, pressed: S => S.modo === 'planta' && !!S.anel }, modo('estomato', 'Estômato'), { t: 'Solo seco', on: S => { if (S.modo === 'estomato') S.agua = S.agua ? 0 : 1; else { S.modo = 'estomato'; S.agua = 0; } }, pressed: S => S.modo === 'estomato' && !S.agua }, modo('feira', 'Na feira')],
    init(S) { S.modo = 'planta'; S.anel = false; S.an = 0; S.agua = 1; FEI.zera(S); },
    d: TXT.V6.d + '<p>Veja a planta por dentro e experimente o anel de Malpighi. No "Estômato", mude a luz e o solo. Na feira, classifique cada alimento.</p>',
    enem: TXT.V6.enem,
    links: [LK.bioenergetica, LK.ecologia],
    tap(x, y, S) { if (S.modo === 'feira') FEI.tap(x, y, S); },
    grab(x, y, S) { return S.modo === 'feira' && FEI.grab(x, y, S); }, grabMove(x, y, S) { if (S.modo === 'feira') FEI.grabMove(x, y, S); }, grabEnd(x, y, S) { if (S.modo === 'feira') FEI.grabEnd(x, y, S); },
    draw(t, S) {
      const A = area();
      if (S.modo === 'planta') drawPlanta(t, S, A); else if (S.modo === 'estomato') drawEstomato(t, S, A);
      else { FEI.draw(S, { x0: A.x0, y0: A.y0, x1: A.x1, y1: A.y1 }, { cols: NAR ? 3 : 5, cartaH: NAR ? 36 : 40 }); cap(FEI.msg(S) || 'Nove alimentos de uma banca de feira. Raiz, caule ou folha? Cuidado com as batatas.'); }
    }
  });
}
