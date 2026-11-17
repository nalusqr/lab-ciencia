/* LAB, módulo Anatomia e fisiologia. Cenas do reprodutor (R1, R2) e do locomotor (L1, L2).
   Código da equipe (Prometeu). Textos: roteiro docs/revisao-biologia/anatomia-roteiro-parte2.md (parágrafos e cartões "No ENEM" entre as marcas TXT).
   Reprodutor: só cortes esquemáticos internos, em traço único, sem contorno externo. */
'use strict';
{
  const NOTA = 'Desenho esquemático, fora de escala', EDU = 'Conteúdo educativo, não substitui orientação médica.';
  const AMB = '#F2C94C', GUT = '#0B0F1C', AZ = '#7CC4FF', LIL = '#C58BE8', ROSA = '#F06AAE', CAL = '#FF9A3C', OSSO = '#E8E1D0', LN = '#C9D3E8';
  const TXT = {};
  //TXT-INICIO
  TXT.R1 = {"d":"<p>No <b>sistema genital masculino</b>, os <b>testículos</b> ficam na <b>bolsa escrotal</b>, fora do abdome, porque a produção de espermatozoides precisa de temperatura cerca de 2 °C mais baixa que a do corpo. Dentro deles, nos <b>túbulos seminíferos</b>, se formam os <b>espermatozoides</b> (ver Divisão celular), e as <b>células intersticiais</b> (de Leydig) fazem <b>testosterona</b>. Os espermatozoides amadurecem no <b>epidídimo</b> e seguem pelo <b>ducto deferente</b> (o que é cortado na <b>vasectomia</b>) até a <b>uretra</b>. No caminho, recebem os líquidos da <b>vesícula seminal</b>, da <b>próstata</b> e das <b>glândulas bulbouretrais</b>, que nutrem e protegem: o conjunto é o <b>sêmen</b> (ou esperma). A testosterona, comandada pelo <b>LH</b> da hipófise, faz as características sexuais secundárias (pelos, voz mais grave, massa muscular); o <b>FSH</b> estimula a produção de espermatozoides.</p><p>No <b>sistema genital feminino</b>, os <b>ovários</b> guardam os folículos e fazem <b>estrógeno</b> e <b>progesterona</b>. Na <b>ovulação</b>, um ovócito secundário sai do ovário e é captado pela <b>tuba uterina</b>, onde pode ocorrer a <b>fecundação</b> (ver Embriologia). As tubas levam ao <b>útero</b>, cuja camada interna, o <b>endométrio</b>, engrossa a cada ciclo para receber o embrião. O útero se abre na <b>vagina</b> pelo <b>colo do útero</b>.</p><p>O <b>ciclo menstrual</b> dura <b>cerca de 28 dias</b> (varia muito, e é normal variar) e é comandado por quatro hormônios. Do dia 1 até cerca do dia 5 ocorre a <b>menstruação</b>: o endométrio descama. Na <b>fase folicular</b>, o <b>FSH</b> da hipófise faz um folículo crescer, e o folículo produz <b>estrógeno</b>, que reconstrói o endométrio. Quando o estrógeno fica alto, a hipófise solta um <b>pico de LH</b>, que provoca a <b>ovulação</b>, por volta do <b>dia 14</b> num ciclo de 28 dias. Na <b>fase lútea</b>, o folículo vazio vira o <b>corpo lúteo</b> (corpo amarelo), que produz <b>progesterona</b> e estrógeno: a progesterona mantém o endométrio grosso e cheio de vasos. Na fase lútea, progesterona e estrógeno altos <b>freiam</b> o FSH e o LH (retroalimentação negativa); só o estrógeno alto e sustentado do fim da fase folicular faz o contrário e dispara o pico de LH. Se não houver gravidez, o corpo lúteo se desfaz, progesterona e estrógeno caem, o endométrio descama, e começa um novo ciclo. Se houver gravidez, o embrião solta <b>hCG</b>, que mantém o corpo lúteo vivo (é o hormônio detectado no teste de gravidez, ver <a href=\"../embriologia/index.html#humano/placenta\">Embriologia</a>). O período fértil fica em torno da ovulação, mas, como o ciclo varia e o espermatozoide sobrevive alguns dias, ele não é previsível com segurança.</p>","enem":"O <b>gráfico do ciclo menstrual</b> é dos mais cobrados de toda a Biologia: saiba ler qual hormônio sobe em cada fase, que o <b>pico de LH</b> provoca a ovulação, que a <b>progesterona</b> mantém o endométrio e que a sua <b>queda</b> leva à menstruação. Liga com <b>contracepção hormonal</b> (a pílula impede o pico de LH) e com o <b>teste de gravidez</b> (hCG). No masculino, cai a <b>vasectomia</b> (corta o ducto deferente; o sêmen continua saindo, sem espermatozoides, e a testosterona não muda) e o porquê dos testículos fora do abdome."};
  TXT.R2 = {"d":"<p>Os <b>métodos contraceptivos</b> impedem a gravidez agindo em pontos diferentes do caminho entre o gameta e a nidação. Os <b>de barreira</b> impedem o encontro dos gametas: a <b>camisinha externa</b> (masculina) e a <b>camisinha interna</b> (feminina) são os <b>únicos métodos que também protegem das ISTs</b>; o <b>diafragma</b> cobre o colo do útero. Os <b>hormonais</b> (pílula, injeção, adesivo, anel vaginal, implante) usam estrógeno e progesterona sintéticos, ou só progesterona, e, em geral, <b>impedem a ovulação</b> porque freiam o FSH e o LH (retroalimentação negativa, ver <a href=\"#reprodutor/ciclo\">ciclo menstrual</a>); também engrossam o muco do colo. O <b>DIU</b> fica dentro do útero: o de <b>cobre</b> prejudica os espermatozoides e o de <b>hormônio</b> age localmente no endométrio e no muco. Os <b>cirúrgicos</b> são a <b>vasectomia</b> (corta os ductos deferentes) e a <b>laqueadura</b> (corta ou fecha as tubas uterinas); são considerados definitivos. Os <b>comportamentais</b> (tabelinha, temperatura, muco, coito interrompido) têm <b>alta taxa de falha</b>, porque o ciclo varia e pode haver espermatozoides no líquido que sai antes da ejaculação. A <b>contracepção de emergência</b> é para uso eventual, não regular, e é mais eficaz quanto mais cedo for tomada. O SUS oferece vários desses métodos; a escolha é feita com orientação de profissional de saúde.</p><p>As <b>infecções sexualmente transmissíveis (ISTs)</b> são causadas por <b>vírus</b> (HIV, HPV, herpes genital, hepatite B), <b>bactérias</b> (sífilis, gonorreia, clamídia) e <b>protozoários</b> (tricomoníase). Muitas não dão sintomas por muito tempo, e a pessoa transmite sem saber. A <b>sífilis</b> pode passar da gestante para o bebê (<b>sífilis congênita</b>), por isso o pré-natal inclui testes. A prevenção combina várias estratégias: <b>camisinha</b> em todas as relações, <b>testagem</b> regular (o SUS tem testes rápidos gratuitos de HIV, sífilis e hepatites), <b>tratamento</b> de quem tem a infecção e das parcerias, <b>vacinas</b> contra <b>HPV</b> (que previne verrugas genitais e vários cânceres, como o de colo do útero) e contra <b>hepatite B</b>, e as <b>profilaxias</b> contra o HIV: a <b>PrEP</b> (antes da exposição, para pessoas com maior risco) e a <b>PEP</b> (logo depois de uma exposição de risco, com prazo curto para começar). Quem vive com HIV e faz tratamento até atingir <b>carga viral indetectável</b> não transmite o vírus pela via sexual (<b>indetectável igual a intransmissível</b>). Para idades e doses das vacinas, veja o <b>calendário de vacinação vigente</b> do Ministério da Saúde. Detalhes de cada agente: HIV, HPV e hepatite B em <a href=\"../virus/index.html#doencas/hiv\">Vírus</a>; sífilis, gonorreia e clamídia em <a href=\"../microrganismos/index.html#monera/doencas\">Microrganismos</a>.</p>","enem":"As questões pedem para relacionar o <b>método ao seu mecanismo</b> (pílula impede a ovulação, vasectomia impede a saída dos espermatozoides, DIU age no útero) e quase sempre têm a pegadinha: <b>só a camisinha protege contra ISTs</b>. Também caem a <b>vacina contra o HPV</b> e a prevenção do câncer de colo do útero, a <b>sífilis congênita</b> e o pré-natal, e por que a <b>tabelinha</b> falha. Em textos sobre HIV, saiba a diferença entre <b>PrEP</b> (antes) e <b>PEP</b> (depois) e o que significa <b>indetectável igual a intransmissível</b>."};
  TXT.L1 = {"d":"<p>O esqueleto adulto tem <b>cerca de 206 ossos</b> (o bebê nasce com mais peças, que se fundem). Ele <b>sustenta</b> o corpo, <b>protege</b> órgãos (o crânio protege o encéfalo; as costelas, o coração e os pulmões; as vértebras, a medula), serve de <b>alavanca</b> para os músculos, <b>guarda cálcio e fósforo</b> e, na <b>medula óssea vermelha</b>, produz as <b>células do sangue</b>. Divide-se em <b>esqueleto axial</b> (crânio, coluna vertebral, costelas e esterno) e <b>apendicular</b> (membros e as cinturas que os prendem: a escapular, no ombro, e a pélvica, no quadril). Pela forma, há ossos <b>longos</b> (fêmur, úmero), <b>curtos</b> (do punho), <b>planos</b> (crânio, escápula) e irregulares (vértebras).</p><p>O osso é <b>tecido vivo</b> (ver Histologia): os <b>osteoblastos</b> fabricam matriz, os <b>osteoclastos</b> a reabsorvem, e os <b>osteócitos</b> a mantêm. A matriz tem <b>colágeno</b> (que dá flexibilidade) e <b>sais de cálcio e fosfato</b> (que dão dureza). O osso está sempre sendo desmanchado e refeito; por isso se recupera de uma fratura e engrossa com o exercício. Os ossos longos crescem em comprimento pelo <b>disco epifisário</b> de cartilagem, até o fim da adolescência, sob ação do <b>GH</b> e dos hormônios sexuais (ver <a href=\"#endocrino/glandulas\">Endócrino: glândulas</a>). O cálcio do sangue é ajustado pelo <b>paratormônio</b> (tira cálcio do osso) e pela <b>calcitonina</b> (ver <a href=\"#endocrino/glandulas\">Endócrino: glândulas</a>), e a <b>vitamina D</b> (feita na pele com a luz do sol) ajuda o intestino a absorver cálcio. Falta de vitamina D causa <b>raquitismo</b> na criança. Na <b>osteoporose</b>, a reabsorção supera a formação e os ossos ficam porosos e frágeis; é mais comum em mulheres depois da <b>menopausa</b>, quando o estrógeno cai. Cálcio na dieta, vitamina D, exercício com carga e não fumar ajudam a prevenir.</p><p>As <b>articulações</b> são os pontos de encontro entre ossos. As <b>imóveis</b> (fibrosas, como as suturas do crânio) não se mexem; as <b>semimóveis</b> (cartilagíneas, como entre as vértebras, com os <b>discos intervertebrais</b>) se mexem pouco; as <b>móveis</b> (<b>sinoviais</b>, como joelho, cotovelo e ombro) têm as pontas dos ossos cobertas por <b>cartilagem</b>, uma <b>cápsula</b> cheia de <b>líquido sinovial</b> que lubrifica, e <b>ligamentos</b> que prendem osso a osso. Já os <b>tendões</b> prendem músculo a osso. No ombro e no quadril, a articulação é tipo <b>bola e soquete</b> (gira em vários sentidos); no cotovelo e no joelho, tipo <b>dobradiça</b> (um só plano).</p>","enem":"Costuma cair a <b>osteoporose</b> (por que é mais comum depois da menopausa, como prevenir), a <b>vitamina D</b> com sol e absorção de cálcio, e o osso como <b>tecido vivo</b> que se renova (osteoblastos e osteoclastos). Também aparecem as funções do esqueleto (proteção, sustentação, produção de células do sangue) e a diferença entre <b>tendão</b> (músculo e osso) e <b>ligamento</b> (osso e osso), às vezes em textos sobre lesões no esporte."};
  TXT.L2 = {"d":"<p>Há três tipos de músculo (ver Histologia): o <b>estriado esquelético</b>, preso aos ossos por tendões, de <b>contração voluntária</b>; o <b>estriado cardíaco</b>, do coração, involuntário; e o <b>liso</b>, nas paredes de órgãos e vasos (intestino, útero, bexiga), involuntário e lento. Todo músculo só <b>puxa</b>, nunca empurra. Por isso os músculos esqueléticos trabalham em <b>pares antagônicos</b>: para dobrar o cotovelo, o <b>bíceps</b> contrai e o <b>tríceps</b> relaxa; para esticar, o contrário. O osso funciona como <b>alavanca</b> e a articulação, como ponto de apoio.</p><p>Dentro de cada fibra muscular há milhares de unidades repetidas, os <b>sarcômeros</b>, com filamentos finos de <b>actina</b> e grossos de <b>miosina</b>. Na contração, as cabeças da miosina se prendem à actina e a puxam para o centro do sarcômero: os filamentos <b>deslizam</b> uns sobre os outros, sem mudar de tamanho, e o sarcômero encurta. Isso exige dois ingredientes. O <b>cálcio</b>: o impulso nervoso chega ao músculo pela <b>placa motora</b> (a sinapse entre nervo e músculo, com <b>acetilcolina</b>, ver <a href=\"#nervoso/autonomo\">sistema autônomo</a>), e a fibra solta cálcio guardado no <b>retículo sarcoplasmático</b>; o cálcio \"destrava\" a actina para a miosina. O <b>ATP</b>: é usado pela miosina para puxar e, principalmente, para <b>soltar</b> da actina. Sem ATP, a miosina fica presa: é a <b>rigidez cadavérica</b>, que aparece algumas horas depois da morte. Quando o impulso para, o cálcio é bombeado de volta (com gasto de ATP) e o músculo relaxa. Detalhes em <a href=\"../histologia/index.html#muscular/contracao\">Histologia</a>.</p><p>O ATP vem da <b>respiração celular</b> nas mitocôndrias (ver Bioenergética) e, por poucos segundos, da <b>creatina fosfato</b>. Em exercício intenso, quando o oxigênio não basta, a fibra faz <b>fermentação lática</b>: produz pouco ATP e <b>ácido lático</b> (lactato), que se acumula no esforço intenso; a fadiga tem várias causas, e o lactato depois é reaproveitado pelo fígado. O treino aumenta as <b>mitocôndrias</b> e o tamanho das fibras (<b>hipertrofia</b>); a falta de uso faz o músculo atrofiar.</p>","enem":"As questões trazem o <b>modelo do deslizamento</b> e perguntam o papel do <b>cálcio</b> (libera a ligação actina e miosina) e do <b>ATP</b> (energia e, principalmente, separação da miosina), com a <b>rigidez cadavérica</b> como exemplo clássico. Também caem a <b>fermentação lática</b> e a fadiga no exercício intenso, os <b>músculos antagônicos</b> (bíceps e tríceps) e a ligação com o sistema nervoso pela <b>placa motora</b> (venenos que bloqueiam a acetilcolina paralisam)."};
  //TXT-FIM
  const modo = (id, t) => ({ t, on: S => { S.modo = id; S.msg = null; S.fl = null; }, pressed: S => S.modo === id });
  const hid = (x, y) => { const h = hitAt(x, y); return typeof h === 'string' ? h : null; };
  const flash = (S, k, i) => { S.fl = { k, i, t: performance.now() }; };
  const isfl = (S, k, i) => S.fl && S.fl.k === k && S.fl.i === i && performance.now() - S.fl.t < 800;
  const fs = () => NAR ? 12 : 13;
  const gau = (d, m, s) => Math.exp(-(((d - m) / s) ** 2));
  const pathPt = (P, f) => { f = cl(f, 0, 1); const n = P.length - 1, i = Math.min(n - 1, Math.floor(f * n)), q = f * n - i; return [lerp(P[i][0], P[i + 1][0], q), lerp(P[i][1], P[i + 1][1], q)]; };
  const chip = (S, k, i, s, x, y, w, h, on, c) => { c = c || AMB; rr(x, y, w, h, 8, on ? rgba(c, .25) : 'rgba(19,26,43,.94)', isfl(S, k, i) ? C.erro : c, on || isfl(S, k, i) ? 2.2 : 1.3); wrapTx(s, x + w / 2, y + h / 2 - (wrapTx(s, 0, 0, w - 8, { s: fs(), w: 600, lh: fs() + 3, dry: true }) - fs() - 3) / 2, w - 8, { s: fs(), w: 600, lh: fs() + 3, c: C.txt }); hitR(x, y, w, h, k + i); };
  const mkdrag = (ps, soltar) => ({
    grab(x, y, S) { const h = hid(x, y); if (h && h.startsWith(ps) && h.length > ps.length) { S.dr = { i: +h.slice(ps.length), x, y }; return true; } return false; },
    grabMove(x, y, S) { if (S.dr) { S.dr.x = x; S.dr.y = y; } },
    grabEnd(x, y, S) { const d = S.dr; S.dr = null; if (d) soltar(S, d.i, hid(x, y)); }
  });
  const nm = (s, x, y, o) => mtx(s, x, y, Object.assign({ s: 11, c: C.dim }, o));

  // ---------- cortes esquemáticos internos (traço único) ----------
  const MN = [['testículo', 'faz espermatozoides nos túbulos seminíferos e testosterona nas células intersticiais; fica fora do abdome, a cerca de 2 °C a menos.'], ['epidídimo', 'os espermatozoides amadurecem aqui.'], ['ducto deferente', 'leva os espermatozoides até a uretra; é o que a vasectomia corta.'], ['vesícula seminal', 'solta líquido que nutre os espermatozoides (parte do sêmen).'], ['próstata', 'solta líquido que protege os espermatozoides (parte do sêmen).'], ['glândulas bulbouretrais', 'soltam líquido que prepara a uretra.'], ['uretra', 'canal final por onde saem o sêmen e a urina.'], ['bolsa escrotal', 'mantém os testículos fora do abdome, mais frios.']];
  const FN = [['ovário', 'guarda os folículos, libera o ovócito na ovulação e faz estrógeno e progesterona.'], ['tuba uterina', 'capta o ovócito; é onde costuma ocorrer a fecundação.'], ['útero', 'abriga o embrião; a camada interna é o endométrio.'], ['endométrio', 'engrossa a cada ciclo para receber o embrião; descama na menstruação.'], ['colo do útero', 'abre o útero para a vagina.'], ['vagina', 'canal que liga o colo do útero ao exterior.']];
  const DF = [[.79, .68], [.82, .5], [.76, .3], [.62, .24], [.53, .36]];
  const SPM = [[.72, .78], [.79, .7], [.82, .5], [.76, .3], [.62, .24], [.53, .36], [.5, .5], [.5, .92]];
  function genM(bx, by, bw, bh, t, hl) {
    const x = a => bx + a * bw, y = b => by + b * bh, c = i => hl === i ? AMB : LN, w = i => hl === i ? 2.8 : 1.5, f = i => hl === i ? rgba(AMB, .22) : 'rgba(201,211,232,.07)';
    X.setLineDash([4, 4]); ell(x(.72), y(.76), bw * .16, bh * .13, .3, null, c(7), w(7)); X.setLineDash([]);
    ell(x(.5), y(.19), bw * .12, bh * .11, 0, 'rgba(201,211,232,.04)', '#7C8AA8', 1.2); nm('bexiga', x(.5), y(.19));
    rr(x(.5) - bw * .045, y(.68), bw * .09, y(.95) - y(.68), bw * .045, 'rgba(201,211,232,.05)', '#7C8AA8', 1.2); nm('pênis', x(.5) - bw * .11, y(.88));
    line(x(.5), y(.3), x(.5), y(.93), c(6), w(6) + 1); ell(x(.5), y(.4), bw * .09, bh * .06, 0, f(4), c(4), w(4)); ell(x(.64), y(.31), bw * .07, bh * .035, .5, f(3), c(3), w(3));
    circ(x(.45), y(.62), bw * .022, f(5), c(5), w(5)); circ(x(.55), y(.62), bw * .022, f(5), c(5), w(5)); poly(DF.map(p => [x(p[0]), y(p[1])]), c(2), w(2) + .6);
    ell(x(.72), y(.76), bw * .1, bh * .075, .3, f(0), c(0), w(0)); for (let i = 0; i < 3; i++) { X.beginPath(); X.moveTo(x(.67 + i * .035), y(.74)); X.bezierCurveTo(x(.66 + i * .035), y(.8), x(.7 + i * .035), y(.7), x(.69 + i * .035), y(.78)); X.strokeStyle = rgba(c(0), .5); X.lineWidth = 1; X.stroke(); }
    X.beginPath(); X.ellipse(x(.72), y(.76), bw * .115, bh * .09, .3, -2.7, -.2); X.strokeStyle = c(1); X.lineWidth = w(1) + 1.2; X.stroke();
    for (let i = 0; i < 6; i++) { const [px, py] = pathPt(SPM, fr(t * .09 + i / 6)); circ(x(px), y(py), 2.6, '#E8EDF7', null); }
    [[.72, .76], [.8, .7], [.8, .5], [.64, .31], [.5, .4], [.5, .62], [.5, .8], [.86, .86]].forEach(([a, b], i) => hitC(x(a), y(b), 16, 'm' + i));
  }
  const SPF = [[.5, .95], [.5, .72], [.5, .56], [.56, .38], [.69, .32], [.8, .2], [.9, .27]], OVF = [[.9, .36], [.9, .27], [.8, .2], [.69, .32], [.56, .4], [.5, .48]];
  function genF(bx, by, bw, bh, t, hl, dots) {
    const x = a => bx + a * bw, y = b => by + b * bh, c = i => hl === i ? AMB : LN, w = i => hl === i ? 2.8 : 1.5, f = i => hl === i ? rgba(AMB, .22) : 'rgba(201,211,232,.07)';
    shape([[.3, .3], [.7, .3], [.62, .55], [.55, .64], [.45, .64], [.38, .55]].map(p => [x(p[0]), y(p[1])]), f(2), c(2), w(2)); shape([[.37, .34], [.63, .34], [.57, .52], [.5, .58], [.43, .52]].map(p => [x(p[0]), y(p[1])]), hl === 3 ? rgba(AMB, .4) : 'rgba(240,106,174,.2)', c(3), w(3));
    [-1, 1].forEach(sd => { const q = a => sd > 0 ? a : 1 - a; X.beginPath(); X.moveTo(x(q(.69)), y(.32)); X.quadraticCurveTo(x(q(.82)), y(.14), x(q(.9)), y(.27)); X.strokeStyle = c(1); X.lineWidth = w(1) + 1; X.stroke(); [-.3, 0, .3].forEach(k => line(x(q(.9)), y(.27), x(q(.9)) + k * 12 * sd, y(.27) + 9, c(1), 1)); ell(x(q(.9)), y(.4), bw * .06, bh * .08, 0, f(0), c(0), w(0)); });
    rr(x(.45), y(.64), bw * .1, bh * .08, 3, f(4), c(4), w(4)); rr(x(.42), y(.72), bw * .16, bh * .22, 6, f(5), c(5), w(5));
    if (dots !== false) { for (let i = 0; i < 5; i++) { const [px, py] = pathPt(SPF, fr(t * .09 + i / 5)); circ(x(px), y(py), 2.6, '#E8EDF7', null); } const [ox, oy] = pathPt(OVF, fr(t * .07)); circ(x(ox), y(oy), 5.5, rgba(ROSA, .9), '#fff', 1.2); }
    [[.9, .4], [.78, .22], [.5, .46], [.5, .44], [.5, .68], [.5, .82]].forEach(([a, b], i) => hitC(x(a), y(b), 15, 'f' + i));
    return { x, y };
  }
  function drawSis(t, S, A) {
    const wide = !NAR, tab = NAR ? 34 : 0; if (NAR) ['Masculino', 'Feminino'].forEach((s, i) => btn(A.x0 + i * (A.w / 2), A.y0, A.w / 2 - 6, tab - 2, s, ROSA, 'x' + i, { on: S.sx === i }));
    const pw = wide ? (A.w - 12) / 2 : A.w, ph = A.h - (NAR ? tab + 2 : 0), y0 = A.y0 + (NAR ? tab + 2 : 0);
    [0, 1].forEach(k => {
      if (NAR && S.sx !== k) return; const px = A.x0 + (wide ? k * (pw + 12) : 0), L = k ? FN : MN, sel = (k ? S.hf : S.hm) != null ? (k ? S.hf : S.hm) : Math.floor(t / 2.6) % L.length;
      panel(px, y0, pw, ph); mtx(`<b>Sistema genital ${k ? 'feminino' : 'masculino'}</b>`, px + 10, y0 + 16, { s: fs() + 1, a: 'left', c: ROSA });
      const dh = ph - 100, dw = Math.min(pw - 20, dh * 1.05), bx = px + (pw - dw) / 2, by = y0 + 30;
      if (k) genF(bx, by, dw, dh, t, sel); else genM(bx, by, dw, dh, t, sel);
      mtx(`<b>${L[sel][0]}</b>`, px + 10, y0 + ph - 62, { s: fs(), a: 'left', c: AMB }); wrapTx(L[sel][1], px + 10, y0 + ph - 44, pw - 20, { s: 12, lh: 15, a: 'left', c: C.txt });
    });
    cap(S.msg || 'Toque nas estruturas. Os pontos mostram o caminho dos espermatozoides e do ovócito.');
  }
  // ciclo menstrual
  function hor(d, S) {
    const pl = S.pl, pg = S.pg && !pl; let fsh, lh, e, p, hc = 0, en;
    if (pl) { fsh = .1; lh = .1; e = .38; p = .38; en = .32; }
    else {
      fsh = .18 + .32 * gau(d, 3, 3.2) + .3 * gau(d, 14, 1.1); lh = .1 + .85 * gau(d, 14, 1) + .06 * gau(d, 21, 3); e = .1 + .62 * gau(d, 13, 2.6) + .3 * gau(d, 21, 3.4); p = .05 + .9 * gau(d, 21, 3.6);
      en = d <= 5 ? lerp(.4, .12, (d - 1) / 4) : d <= 14 ? lerp(.12, .55, (d - 5) / 9) : d <= 26 ? lerp(.55, .9, (d - 14) / 12) : lerp(.9, .35, (d - 26) / 2);
      if (pg && d > 21) { p = .95; e = lerp(.45, .7, seg(d, 21, 28)); fsh = lh = .08; hc = .85 * seg(d, 21, 28); en = .9 + .04 * seg(d, 26, 28); }
    }
    return { fsh, lh, e, p, hc, en };
  }
  function drawCic(t, S, A) {
    const d = Math.round(S.v), gap = 6, bh = (A.h - 3 * gap) / 4, x0 = A.x0 + 6, w = A.w - 12, X_ = dd => x0 + (dd - 1) / 27 * w, pl = S.pl, pg = S.pg && !pl;
    const band = (i, n) => { const y = A.y0 + i * (bh + gap); panel(A.x0, y, A.w, bh); mtx(n, x0, y + 11, { s: 11, a: 'left', c: C.dim }); return y; };
    const curves = (y, cs) => cs.forEach(([k, c, nme, lx]) => { const pts = []; for (let q = 1; q <= 28.01; q += .5) pts.push([X_(q), y + bh - 6 - hor(q, S)[k] * (bh - 22)]); poly(pts, c, 2.3); nm(nme, x0 + lx, y + 11, { a: 'left', c, w: 700 }); });
    const cur = y => line(X_(d), y, X_(d), y + bh, 'rgba(255,255,255,.55)', 1.5);
    let y = band(0, 'hipófise'); curves(y, [['fsh', AZ, 'FSH', 70], ['lh', AMB, 'LH', 110]]); cur(y);
    if (!pl && d >= 13 && d <= 15) { const p = Math.sin(t * 6) * .5 + .5; rr(X_(d) + 8, y + 16, 74, 20, 8, rgba(AMB, .25 + .2 * p), AMB, 1.5); nm('ovulação', X_(d) + 45, y + 26, { c: C.txt, w: 700 }); }
    y = band(1, 'ovário'); const oy = y + bh / 2 + 4, ox = x0 + (NAR ? 40 : 60), ry = Math.min(bh * .36, 28), rx = ry * 1.6;
    ell(ox, oy, rx, ry, 0, 'rgba(240,106,174,.12)', '#C88AA8', 1.5);
    let fol, ph;
    if (pl) { circ(ox - rx * .2, oy, ry * .18, 'rgba(255,255,255,.2)', LN, 1.4); ph = 'sem ovulação: os hormônios de fora freiam o FSH e o LH'; }
    else if (d < 13.5) { circ(ox - rx * .2, oy, ry * lerp(.15, .6, (d - 1) / 12.5), 'rgba(255,255,255,.2)', LN, 1.6); ph = d <= 5 ? 'menstruação (folículo começa a crescer)' : 'fase folicular: o folículo cresce e faz estrógeno'; }
    else if (d < 14.6) { circ(ox + rx * .5, oy, ry * .55, 'rgba(255,255,255,.2)', AMB, 2); const f = fr(t * .8); circ(ox + rx * .7 + f * 18, oy - f * 14, 4, ROSA, '#fff', 1); ph = 'ovulação: o ovócito sai do ovário'; }
    else { const r = (pg ? .55 : .5 * (1 - seg(d, 25, 28))) * ry; circ(ox - rx * .1, oy, Math.max(.1, r), 'rgba(242,201,76,.55)', AMB, 1.6); ph = pg ? 'gravidez: o corpo lúteo continua' : d < 25 ? 'fase lútea: o corpo lúteo faz progesterona' : 'o corpo lúteo se desfaz'; }
    wrapTx(ph, ox + rx + 16, oy, A.x1 - ox - rx - 30, { s: fs(), lh: fs() + 3, a: 'left', c: C.txt });
    cur(y); y = band(2, 'hormônios do ovário'); curves(y, [['e', ROSA, 'estrógeno', 130], ['p', '#2FCFBF', 'progesterona', 200]]);
    if (pg) { const pts = []; for (let q = 1; q <= 28.01; q += .5) pts.push([X_(q), y + bh - 6 - hor(q, S).hc * (bh - 22)]); poly(pts, LIL, 2.3); nm('hCG', x0 + 290, y + 11, { a: 'left', c: LIL, w: 700 }); }
    cur(y); y = band(3, 'útero: endométrio'); const en = hor(d, S).en, ey = y + bh - 8; rr(x0, ey - (bh - 24) * en, w, (bh - 24) * en, 3, 'rgba(240,106,174,.28)', '#C88AA8', 1.2); rr(x0, y + 14, w, 1, 0, null, null); cur(y);
    nm(!pl && d <= 5 ? 'menstruação: o endométrio descama' : !pl && !pg && d >= 27 ? 'queda da progesterona: menstruação' : pg && d > 26 ? 'sem menstruação' : 'endométrio', X_(d) + 6 > A.x1 - 190 ? X_(d) - 6 : X_(d) + 6, y + 26, { a: X_(d) + 6 > A.x1 - 190 ? 'right' : 'left', c: C.txt, w: 700 });
    const lab = [['dia ' + d]]; nm('dia ' + d, X_(d), A.y1 + 8, { c: C.txt, w: 700 });
    cap(S.msg || (pl ? 'Pílula combinada: estrógeno e progesterona de fora ficam constantes, FSH e LH ficam baixos e o pico de LH some: sem ovulação.' : pg ? 'Gravidez: o hCG mantém o corpo lúteo, a progesterona não cai e não há menstruação.' : 'O pico de LH dispara a ovulação; a queda da progesterona dispara a menstruação.'));
  }
  def('reprodutor', 'ciclo', {
    t: 'Os sistemas genitais e o ciclo menstrual', s: 'quatro hormônios, um ciclo de cerca de 28 dias', c: '#E58AB0',
    loc: S => S.modo === 'ciclo' ? 'Calendário do ciclo' : 'Cortes esquemáticos internos', locNota: S => NOTA, still: 4, stillV: 14,
    alt: 'cortes esquemáticos internos dos sistemas genitais masculino e feminino com o caminho dos gametas, e um calendário do ciclo menstrual em quatro faixas (FSH e LH, ovário, estrógeno e progesterona, endométrio) com um controle de dia de 1 a 28, e as opções gravidez e pílula combinada.',
    extra: [modo('sis', 'Sistemas genitais'), modo('ciclo', 'Calendário do ciclo'), { t: 'Gravidez', on: S => { S.modo = 'ciclo'; S.pg = !S.pg; S.pl = false; S.msg = null; }, pressed: S => !!S.pg }, { t: 'Pílula combinada', on: S => { S.modo = 'ciclo'; S.pl = !S.pl; S.pg = false; S.msg = null; }, pressed: S => !!S.pl }],
    ctl: { l: 'Dia do ciclo', min: 1, max: 28, step: 1, v: 1, f: v => 'dia ' + v, rate: () => 1 }, ctlVis: S => S.modo === 'ciclo', auto: .9,
    init(S) { S.modo = 'sis'; S.hm = null; S.hf = null; S.sx = 0; S.pg = false; S.pl = false; S.msg = null; },
    d: TXT.R1.d + '<p>Mova o controle de dia no calendário e ligue "gravidez" ou "pílula combinada".</p>', enem: TXT.R1.enem + '<br>' + EDU,
    links: [['Relembre: espermatogênese', '../divisao-celular/index.html#gametogenese/espermatogenese'], ['Ovogênese', '../divisao-celular/index.html#gametogenese/ovogenese'], ['Gametas na Embriologia', '../embriologia/index.html#gametas/resumo']],
    tap(x, y, S) { const h = hid(x, y); if (!h) return; if (h[0] === 'm') S.hm = +h.slice(1); else if (h[0] === 'f') S.hf = +h.slice(1); else if (h[0] === 'x') S.sx = +h.slice(1); },
    draw(t, S) { const A = area(); if (S.modo === 'ciclo') drawCic(t, S, A); else drawSis(t, S, A); }
  });

  // ---------- R2: contracepção e ISTs ----------
  const GR = [['hormonais', 'Pílula, injeção, adesivo, anel e implante impedem a ovulação: freiam o FSH e o LH. Também engrossam o muco do colo.'], ['de barreira', 'As camisinhas externa e interna e o diafragma impedem o encontro dos gametas. Só as camisinhas protegem das ISTs.'], ['cirúrgicos', 'Vasectomia (corta os ductos deferentes) e laqueadura (fecha as tubas): o encontro dos gametas não acontece. São considerados definitivos.'], ['DIU', 'Fica dentro do útero: o de cobre prejudica os espermatozoides; o hormonal age no endométrio e no muco.'], ['comportamentais', 'Tabelinha, temperatura, muco e coito interrompido não têm barreira: a taxa de falha é alta, porque o ciclo varia e pode haver espermatozoides antes da ejaculação.']];
  const BLK = [1, .12, .62, .42, 1], STN = ['ovulação', 'encontro dos gametas', 'nidação'], STB = [0, 1, 1, 2, -1];
  function drawTri(t, S, A) {
    const g = S.g != null ? S.g : Math.floor(t / 5) % 5, wide = !NAR, bw = wide ? Math.min(A.w * .5, 420) : A.w - 20, bh = wide ? Math.min(A.h - 96, bw * .9) : Math.min(A.h - 250, bw * .8), bx = A.x0 + 10, by = A.y0 + 4;
    const F = genF(bx, by, bw, bh, t, -1, false), x = F.x, y = F.y;
    nm('desenho esquemático, corte interno', bx + bw / 2, by + bh + 2, {});
    for (let i = 0; i < 6; i++) { const f = fr(t * .09 + i / 6); if (f <= BLK[g]) { const [px, py] = pathPt(SPF, f); circ(x(px), y(py), 2.6, '#E8EDF7', null); } else if (f < BLK[g] + .05) { const [px, py] = pathPt(SPF, BLK[g]); circ(x(px), y(py), 2.6, C.erro, null); } }
    const lim = g === 2 ? .3 : 1; if (g !== 0) { const [ox, oy] = pathPt(OVF, Math.min(lim, fr(t * .07))); circ(x(ox), y(oy), 5.5, rgba(ROSA, .9), '#fff', 1.2); } else { X.setLineDash([3, 3]); circ(x(.9), y(.4), 6, null, rgba(ROSA, .8), 1.4); X.setLineDash([]); }
    const bar = (a, b, a2, b2) => line(x(a), y(b), x(a2), y(b2), C.erro, 4);
    if (g === 0) { bar(.84, .46, .96, .46); nm('sem ovulação', x(.9), y(.5), { c: C.erro }); }
    if (g === 1) { bar(.4, .82, .6, .82); nm('camisinha ou diafragma', x(.5), y(.99), { c: C.erro }); }
    if (g === 2) { bar(.7, .29, .76, .35); bar(.24, .29, .3, .35); nm('tubas fechadas (e deferentes cortados)', x(.5), y(.1), { c: C.erro }); }
    if (g === 3) { line(x(.5), y(.36), x(.5), y(.56), '#C9843B', 3); line(x(.43), y(.36), x(.57), y(.36), '#C9843B', 3); nm('DIU', x(.5), y(.6), { c: '#C9843B', w: 700 }); }
    // trilha
    const ty = by + bh + 30, tx0 = bx + 40, tx1 = bx + bw - 40, blk = STB[g], p = fr(t * .1);
    line(tx0, ty, tx1, ty, rgba('#9DA9C4', .5), 2); STN.forEach((s, i) => { const sx = lerp(tx0, tx1, i / 2), bl = blk === i; circ(sx, ty, 8, bl ? rgba(C.erro, .3) : 'rgba(111,177,232,.2)', bl ? C.erro : '#6FB1E8', 1.6); nm(s, sx, ty + 20, { c: bl ? C.erro : C.txt, w: 600, s: NAR ? 10 : 11 }); if (bl) nm('x', sx, ty, { c: C.erro, w: 700, s: 13, bg: false }); });
    const lm = blk < 0 ? 1 : blk / 2, mp = Math.min(p * 1.25, lm); circ(lerp(tx0, tx1, mp), ty, 5, blk >= 0 && mp >= lm ? C.erro : AMB, '#fff', 1.2);
    // grupos
    const gx = wide ? bx + bw + 24 : A.x0, gy = wide ? A.y0 + 6 : ty + 42, gw = wide ? A.x1 - gx : A.w, cols = wide ? 1 : 3, cw = (gw - (cols - 1) * 6) / cols, chh = wide ? 34 : 32;
    GR.forEach(([n], i) => chip(S, 'g', i, n, gx + (i % cols) * (cw + 6), gy + Math.floor(i / cols) * (chh + 6), cw, chh, g === i, AMB));
    if (wide) wrapTx(GR[g][1], gx, gy + 5 * (chh + 6) + 14, gw, { s: fs(), lh: fs() + 4, a: 'left', c: C.txt });
    cap(wide ? 'Toque num grupo de métodos para ver onde ele age no caminho dos gametas.' : '<b>' + GR[g][0] + '.</b> ' + GR[g][1]);
  }
  const MET = [['camisinha externa', 1, 1, 1], ['camisinha interna', 1, 1, 1], ['pílula', 0, 1, 0], ['injeção', 0, 1, 0], ['implante', 0, 1, 0], ['DIU de cobre', 2, 1, 0], ['DIU hormonal', 2, 1, 0], ['diafragma', 1, 1, 0], ['vasectomia', 1, 1, 0], ['laqueadura', 1, 1, 0], ['tabelinha', 1, 0, 0], ['coito interrompido', 1, 0, 0]];
  const ALVO = ['impede a ovulação', 'impede o encontro dos gametas', 'age no útero'];
  function soltar(S, i, h) {
    if (h == null || h[0] !== 'a' || h.length !== 2 || S.on[i] != null) return; const k = +h[1];
    if (MET[i][1] === k) { S.on[i] = k; S.sel = null; S.msg = '<b>Certo.</b> ' + MET[i][0] + ': ' + (MET[i][3] ? 'único tipo de método que também protege das ISTs.' : 'não protege das ISTs.'); if (S.on.every(v => v != null)) S.msg = '<b>Pronto.</b> Para evitar gravidez há vários métodos; para evitar IST, a camisinha, junto com testagem, vacina e tratamento.'; }
    else { flash(S, 'a', k); S.msg = '<b>Ainda não.</b> Pense no ponto do caminho em que ' + MET[i][0] + ' age.'; }
  }
  const dragR2 = mkdrag('c', soltar);
  function drawMet(t, S, A) {
    const cols = NAR ? 3 : 6, ch = NAR ? 34 : 36, cw = (A.w - (cols - 1) * 6) / cols, left = MET.map((m, i) => i).filter(i => S.on[i] == null);
    mtx('Toque num método e depois no ponto em que ele age (ou arraste)', A.x0, A.y0 + 6, { s: 12, a: 'left', c: C.dim });
    left.forEach((i, j) => { const pr = S.dr && S.dr.i === i, x = A.x0 + (j % cols) * (cw + 6), y = A.y0 + 20 + Math.floor(j / cols) * (ch + 6); rr(x, y, cw, ch, 8, S.sel === i ? rgba(AMB, .25) : 'rgba(19,26,43,.94)', S.sel === i ? AMB : C.line, S.sel === i ? 2.2 : 1.3); wrapTx(MET[i][0], x + cw / 2, y + ch / 2 - (wrapTx(MET[i][0], 0, 0, cw - 6, { s: 11, w: 600, lh: 13, dry: true }) - 13) / 2, cw - 6, { s: 11, w: 600, lh: 13, c: C.txt }); if (!pr) hitR(x, y, cw, ch, 'c' + i); });
    const ty = A.y0 + 20 + Math.ceil(Math.max(1, left.length) / cols) * (ch + 6) + 4, tw = (A.w - 12) / 3, th = A.y1 - ty - (NAR ? 0 : 30);
    ALVO.forEach((n, k) => {
      const x = A.x0 + k * (tw + 6), fl = isfl(S, 'a', k); rr(x, ty, tw, th, 10, 'rgba(19,26,43,.6)', fl ? C.erro : S.sel != null ? AMB : C.line, fl || S.sel != null ? 2 : 1.3); hitR(x, ty, tw, th, 'a' + k);
      wrapTx(n, x + tw / 2, ty + 14, tw - 10, { s: NAR ? 11 : 13, w: 700, lh: 14, c: AMB });
      let yy = ty + (NAR ? 40 : 38); MET.forEach((m, i) => { if (S.on[i] !== k) { return; } rr(x + 4, yy, tw - 8, NAR ? 40 : 32, 6, 'rgba(111,177,232,.14)', '#6FB1E8', 1); wrapTx(`<b>${m[0]}</b>`, x + 8, yy + 9, tw - 16, { s: 11, lh: 12, a: 'left', c: C.txt }); mtx(`gravidez: ${m[2] ? 'alta' : 'baixa'} | IST: ${m[3] ? '<b>sim</b>' : 'não'}`, x + 8, yy + (NAR ? 31 : 24), { s: NAR ? 9 : 10, a: 'left', c: m[3] ? C.ok : C.dim, bg: false }); yy += NAR ? 44 : 36; });
    });
    if (S.dr) { rr(S.dr.x - 55, S.dr.y - 16, 110, 32, 8, rgba(AMB, .3), AMB, 2); mtx(MET[S.dr.i][0], S.dr.x, S.dr.y, { s: 12, w: 600, c: C.txt }); }
    cap((S.msg || 'Eficácia alta depende do uso correto e contínuo.') + '<br>' + EDU);
  }
  const PC = [['camisinha', 'Camisinha externa ou interna em todas as relações: é o único método de barreira que também protege das ISTs.'], ['teste rápido', 'Testagem regular: o SUS oferece testes rápidos gratuitos (HIV, sífilis, hepatites). Muitas ISTs não dão sintoma por muito tempo.'], ['vacina', 'Vacinas contra HPV (previne verrugas genitais e vários cânceres, como o de colo do útero) e contra hepatite B. Idades e doses: veja o calendário vigente do Ministério da Saúde.'], ['tratamento', 'Tratar quem tem a infecção e as parcerias. Quem vive com HIV, em tratamento e com carga viral indetectável, não transmite o vírus pela via sexual.'], ['PrEP e PEP', 'PrEP é a profilaxia antes da exposição, para pessoas com maior risco. PEP é logo depois de uma exposição de risco, com prazo curto para começar.']];
  const URLC = typeof LK !== 'undefined' && LK.calendario ? LK.calendario[1] : 'https://www.gov.br/saude/pt-br/vacinacao/calendario';
  function drawComb(t, S, A) {
    const n = 5, cw = (A.w - (n - 1) * 8) / n, ch = NAR ? 78 : 100, sel = S.pc;
    PC.forEach(([nme], i) => {
      const x = A.x0 + i * (cw + 8), y = A.y0 + 6, on = sel === i, cx = x + cw / 2, cy = y + ch * .4; rr(x, y, cw, ch, 10, on ? rgba(AMB, .22) : 'rgba(19,26,43,.94)', on ? AMB : C.line, on ? 2.2 : 1.3); hitR(x, y, cw, ch, 'p' + i);
      const k = NAR ? 11 : 14, c = on ? AMB : AZ; if (i === 0) rr(cx - k * .55, cy - k, k * 1.1, k * 2, k * .5, null, c, 2); if (i === 1) { rr(cx - k * .5, cy - k, k, k * 2, 3, null, c, 2); circ(cx, cy + k * .3, k * .3, c); } if (i === 2) { shape([[cx - k, cy - k], [cx + k, cy - k], [cx + k, cy + k * .2], [cx, cy + k * 1.1], [cx - k, cy + k * .2]], null, c, 2); line(cx, cy - k * .5, cx, cy + k * .3, c, 2); line(cx - k * .4, cy - k * .1, cx + k * .4, cy - k * .1, c, 2); } if (i === 3) { circ(cx, cy, k, null, c, 2); poly([[cx - k * .5, cy], [cx - k * .1, cy + k * .4], [cx + k * .5, cy - k * .4]], c, 2); } if (i === 4) { circ(cx - k * .5, cy, k * .6, null, c, 2); circ(cx + k * .5, cy, k * .6, null, c, 2); }
      wrapTx(nme, cx, y + ch - 20 - (wrapTx(nme, 0, 0, cw - 6, { s: 11, w: 600, lh: 13, dry: true }) - 13) / 2, cw - 6, { s: NAR ? 10 : 12, w: 600, lh: 13, c: C.txt });
    });
    const ty = A.y0 + ch + 22; panel(A.x0, ty, A.w, Math.min(A.y1 - ty, 190));
    if (sel == null) wrapTx('Cada estratégia protege de um jeito; juntas, protegem mais. Toque num ícone.', A.x0 + 12, ty + 22, A.w - 24, { s: 14, lh: 19, a: 'left', c: C.dim });
    else { mtx(`<b>${PC[sel][0]}</b>`, A.x0 + 12, ty + 18, { s: 15, a: 'left', c: AMB }); const hh = wrapTx(PC[sel][1], A.x0 + 12, ty + 44, A.w - 24, { s: fs() + 1, lh: fs() + 6, a: 'left', c: C.txt }); if (sel === 2) btn(A.x0 + 12, ty + 52 + hh, Math.min(A.w - 24, 260), 36, 'Abrir o calendário vigente', C.ok, 'vac', { on: true }); }
    cap('Prevenção combinada: camisinha, testagem, vacina, tratamento e profilaxias, juntas.<br>' + EDU);
  }
  def('reprodutor', 'prevencao', {
    t: 'Métodos contraceptivos e ISTs', s: 'cada método age num ponto do caminho, e só a camisinha protege das ISTs', c: '#E58AB0',
    loc: S => ({ tri: 'Onde cada método age', met: 'Onde ele age? Protege de IST?', comb: 'Prevenção combinada' })[S.modo] || '', locNota: () => NOTA, still: 4,
    alt: 'o caminho do ovócito e dos espermatozoides em corte esquemático interno, com cada grupo de métodos contraceptivos como uma barreira no ponto em que age; cartões de métodos para arrastar até o ponto certo, com as marcas de eficácia e de proteção contra ISTs; e a faixa de prevenção combinada.',
    extra: [modo('tri', 'Trilha dos gametas'), modo('met', 'Onde ele age?'), modo('comb', 'Prevenção combinada')], ctl: false,
    init(S) { S.modo = 'tri'; S.g = null; S.on = MET.map(() => null); S.sel = null; S.dr = null; S.pc = null; S.msg = null; },
    d: TXT.R2.d + '<p>Veja onde cada grupo age, classifique os métodos e conheça a prevenção combinada.</p>', enem: TXT.R2.enem + '<br>' + EDU,
    links: [['Calendário de vacinação vigente (Ministério da Saúde)', URLC], ['Sífilis, gonorreia e clamídia', '../microrganismos/index.html#monera/doencas'], ['Vírus: HIV, HPV e hepatite B', '../virus/index.html']],
    tap(x, y, S) {
      const h = hid(x, y); if (!h) return;
      if (S.modo === 'tri') { if (h[0] === 'g') S.g = +h.slice(1); return; }
      if (S.modo === 'comb') { if (h[0] === 'p') S.pc = +h.slice(1); else if (h === 'vac') window.open(URLC, '_blank', 'noopener'); return; }
      if (h[0] === 'c') S.sel = S.sel === +h.slice(1) ? null : +h.slice(1); else if (h[0] === 'a' && S.sel != null) soltar(S, S.sel, h);
    },
    grab: (x, y, S) => S.modo === 'met' ? dragR2.grab(x, y, S) : false, grabMove: (x, y, S) => dragR2.grabMove(x, y, S), grabEnd: (x, y, S) => dragR2.grabEnd(x, y, S),
    draw(t, S) { const A = area(); if (S.modo === 'met') drawMet(t, S, A); else if (S.modo === 'comb') drawComb(t, S, A); else drawTri(t, S, A); }
  });

  // ---------- L1: ossos e articulações ----------
  const PEC = [['crânio', 'protege o encéfalo; as suturas são articulações imóveis.'], ['coluna vertebral', 'sustenta o corpo e protege a medula; entre as vértebras há discos.'], ['costelas e esterno', 'protegem o coração e os pulmões.'], ['cintura escapular', 'prende os membros superiores ao tronco (ombro).'], ['membros superiores', 'úmero, rádio e ulna: alavancas para os músculos.'], ['cintura pélvica', 'liga as pernas à coluna e sustenta órgãos (quadril).'], ['membros inferiores', 'fêmur, tíbia e fíbula: sustentam o corpo e fazem alavanca.']];
  const AXC = '#7CC4FF', APC = '#E5A56B';
  function skel(cx, cy, h, hl) {
    const u = h / 10, x = a => cx + a * u, y = b => cy + b * u, ax = i => hl === i ? AMB : AXC, ap = i => hl === i ? AMB : APC, lw = i => hl === i ? 6 : 4.5, bone = (p, c, l) => { poly(p.map(q => [x(q[0]), y(q[1])]), c, l); };
    ell(x(0), y(-4.1), .72 * u, .88 * u, 0, rgba(ax(0), .12), ax(0), hl === 0 ? 2.8 : 1.6); rr(x(-.4), y(-3.4), .8 * u, .35 * u, 3, rgba(ax(0), .12), ax(0), 1.4);
    for (let i = 0; i < 11; i++) rr(x(-.22), y(-3.1 + i * .38), .44 * u, .26 * u, 2, rgba(ax(1), .2), ax(1), hl === 1 ? 2.2 : 1.3);
    for (let i = 0; i < 6; i++) [-1, 1].forEach(sd => { X.beginPath(); X.moveTo(x(0), y(-2.7 + i * .3)); X.quadraticCurveTo(x(sd * 1.3), y(-2.75 + i * .3), x(sd * (1.15 - i * .07)), y(-1.85 + i * .26)); X.strokeStyle = ax(2); X.lineWidth = hl === 2 ? 2.2 : 1.4; X.stroke(); });
    rr(x(-.1), y(-2.8), .2 * u, 1.3 * u, 3, rgba(ax(2), .3), ax(2), 1.3);
    [-1, 1].forEach(sd => {
      bone([[sd * .1, -2.85], [sd * 1.3, -2.75]], ap(3), lw(3) - 1); shape([[sd * 1.0, -2.6], [sd * 1.35, -2.1], [sd * 1.05, -1.7]].map(q => [x(q[0]), y(q[1])]), rgba(ap(3), .15), ap(3), 1.4);
      bone([[sd * 1.4, -2.75], [sd * 1.8, -1.1]], ap(4), lw(4)); bone([[sd * 1.8, -1.1], [sd * 2.1, .35]], ap(4), 3); bone([[sd * 1.75, -1.1], [sd * 1.95, .35]], ap(4), 2.4); circ(x(sd * 2.05), y(.6), .22 * u, rgba(ap(4), .2), ap(4), 1.3);
      bone([[sd * .65, 1.3], [sd * .72, 3.1]], ap(6), lw(6)); bone([[sd * .72, 3.25], [sd * .7, 4.9]], ap(6), lw(6) - 1); circ(x(sd * .72), y(3.18), .2 * u, rgba(ap(6), .2), ap(6), 1.2); rr(x(sd * .7 - .22), y(4.9), .5 * u, .22 * u, 3, rgba(ap(6), .15), ap(6), 1.3);
    });
    shape([[-1.1, .7], [-.35, .55], [0, 1.2], [.35, .55], [1.1, .7], [.9, 1.3], [.2, 1.6], [-.2, 1.6], [-.9, 1.3]].map(q => [x(q[0]), y(q[1])]), rgba(ap(5), .15), ap(5), hl === 5 ? 2.8 : 1.6);
    [[0, 0, -4.1, 1], [1, 0, -1, 1.2], [2, 0, -2.2, 1.4], [3, 1, -2.7, .7], [3, -1, -2.7, .7], [4, 1.9, -1, .6], [4, -1.9, -1, .6], [5, 0, 1.0, 1], [6, .7, 3, .7], [6, -.7, 3, .7]].forEach(([i, a, b, r]) => hitC(x(a), y(b), Math.max(14, r * u * .7), 'b' + i));
  }
  function drawEsq(t, S, A) {
    const bh = NAR ? Math.min(A.h * .6, 300) : Math.min(A.h * .94, 400), cx = NAR ? A.cx : A.x0 + Math.min(A.w * .28, 240), cy = A.y0 + bh / 2 + 6, sel = S.pt != null ? S.pt : Math.floor(t / 3) % 7;
    skel(cx, cy, bh, sel);
    rr(A.x0, A.y0 + 2, 12, 12, 3, AXC, null); mtx('esqueleto axial', A.x0 + 18, A.y0 + 8, { s: 11, a: 'left', c: C.txt }); rr(A.x0, A.y0 + 22, 12, 12, 3, APC, null); mtx('esqueleto apendicular', A.x0 + 18, A.y0 + 28, { s: 11, a: 'left', c: C.txt });
    const px = NAR ? A.x0 : cx + 160, py = NAR ? cy + bh / 2 + 6 : A.y0 + 40, pw = A.x1 - px, ph = A.y1 - py - 4; if (pw < 140 || ph < 90) return;
    panel(px, py, pw, ph); mtx(`<b>${PEC[sel][0]}</b>`, px + 10, py + 18, { s: fs() + 2, a: 'left', c: AMB }); let yy = py + 38; yy += wrapTx(PEC[sel][1], px + 10, yy, pw - 20, { s: fs() + 1, lh: fs() + 5, a: 'left', c: C.txt });
    wrapTx('O esqueleto adulto tem cerca de 206 ossos. Sustenta, protege, serve de alavanca, guarda cálcio e fósforo e, na medula óssea vermelha, produz as células do sangue.', px + 10, yy + 12, pw - 20, { s: 12, lh: 16, a: 'left', c: C.dim });
    cap('Toque num osso ou numa região para ver o nome e a função.');
  }
  const OS = [['periósteo', 'membrana de tecido conjuntivo que reveste o osso por fora.'], ['osso compacto', 'camada dura e densa da diáfise.'], ['osso esponjoso', 'rede de trabéculas nas pontas; leve e resistente.'], ['medula óssea vermelha', 'produz as células do sangue.'], ['medula óssea amarela', 'tecido com gordura, no canal da diáfise.'], ['disco epifisário', 'faixa de cartilagem onde o osso cresce em comprimento, até o fim da adolescência.'], ['cartilagem articular', 'cobre a ponta do osso na articulação.']];
  function drawOsso(t, S, A) {
    const sel = S.os, h = Math.min(A.h - 10, 400), cx = NAR ? A.x0 + A.w * .32 : A.x0 + A.w * .26, top = A.y0 + 6, ew = Math.min(A.w * .3, 120) * (NAR ? .8 : 1), dw = ew * .52, ey = h * .22;
    const c = i => sel === i ? AMB : '#9DA9C4';
    rr(cx - dw / 2, top + ey, dw, h - 2 * ey, 4, 'rgba(232,225,208,.18)', c(1), sel === 1 ? 3 : 1.6); rr(cx - dw / 2 + 9, top + ey, dw - 18, h - 2 * ey, 3, 'rgba(242,201,76,.35)', c(4), sel === 4 ? 2.5 : 1);
    [[top, 1], [top + h - ey, -1]].forEach(([y0, sd], k) => {
      rr(cx - ew / 2, y0, ew, ey, 16, 'rgba(232,225,208,.14)', c(1), 1.6); const sg = 'seed' + k;
      for (let i = 0; i < 14; i++) { const a = ((i * 73 + k * 31) % 100) / 100, b = ((i * 41 + k * 17) % 100) / 100; line(cx - ew / 2 + 8 + a * (ew - 16), y0 + 8 + b * (ey - 16), cx - ew / 2 + 8 + ((a + .3) % 1) * (ew - 16), y0 + 8 + ((b + .4) % 1) * (ey - 16), c(2), sel === 2 ? 1.8 : 1); }
      if (k === 0) rr(cx - ew / 2 + 10, y0 + 12, ew - 20, ey - 24, 10, 'rgba(215,48,59,.22)', null);
      line(cx - ew / 2 + 2, y0 + (k ? 0 : ey), cx + ew / 2 - 2, y0 + (k ? 0 : ey), '#7CC4FF', sel === 5 ? 4 : 2.4, [5, 3]);
      X.beginPath(); X.arc(cx, y0 + (k ? ey : 0) - (k ? 4 : -4) * 0, ew * .5, k ? .2 : PI + .2, k ? PI - .2 : TAU - .2); X.strokeStyle = sel === 6 ? AMB : '#9FD8FF'; X.lineWidth = sel === 6 ? 5 : 3.5; X.stroke();
    });
    rr(cx - dw / 2 - 3, top + ey - 2, dw + 6, 4, 2, null, c(0), sel === 0 ? 3 : 1.2); rr(cx - dw / 2 - 3, top + h - ey - 2, dw + 6, 4, 2, null, c(0), sel === 0 ? 3 : 1.2);
    const lab = [[0, top + ey + 30, cx + dw / 2 + 3], [1, top + ey + 60, cx + dw / 2], [2, top + ey * .55, cx + ew * .3], [3, top + ey * .3, cx + ew * .15], [4, top + h / 2, cx], [5, top + ey, cx + ew / 2], [6, top + 4, cx + ew * .35]];
    const lx = NAR ? A.x0 + A.w * .55 : A.x0 + A.w * .52; lab.forEach(([i, ly, px]) => { const y = top + 12 + i * (NAR ? 32 : 34); line(px, ly, lx - 6, y, rgba('#9DA9C4', .45), 1); rr(lx, y - 13, A.x1 - lx, 26, 7, sel === i ? rgba(AMB, .22) : 'rgba(19,26,43,.9)', sel === i ? AMB : C.line, sel === i ? 2 : 1); mtx(OS[i][0], lx + 8, y, { s: fs(), a: 'left', w: 600, c: C.txt }); hitR(lx, y - 13, A.x1 - lx, 26, 'k' + i); });
    wrapTx(`<b>${OS[sel][0]}:</b> ${OS[sel][1]}`, lx, top + 12 + 7 * (NAR ? 32 : 34) + 6, A.x1 - lx, { s: fs(), lh: fs() + 4, a: 'left', c: C.txt });
    cap(S.msg || 'Um osso longo por dentro. Toque nos nomes. Osteoblastos fabricam a matriz, osteoclastos a reabsorvem e osteócitos a mantêm: o osso é tecido vivo.');
  }
  function drawCal(t, S, A) {
    const age = [25, 50, 75][S.id], D = cl(.95 - Math.max(0, age - 30) * .004 - (S.cal ? .15 : 0) - (S.vd ? .15 : 0) + (S.ex ? .1 : 0) - (S.me && age >= 50 ? .14 : 0), .2, 1), stress = (S.cal ? 1 : 0) + (S.vd ? 1 : 0) + (S.me && age >= 50 ? .5 : 0), wide = !NAR;
    const cw = wide ? A.w * .5 : A.w, ch = NAR ? 140 : A.h - 140, cx = A.x0 + cw / 2, by = A.y0 + 20, tilt = stress ? .06 : 0;
    // balança
    line(cx, by + 30, cx, by + ch - 20, '#9DA9C4', 3); rr(cx - 30, by + ch - 20, 60, 8, 3, '#9DA9C4'); const bw2 = cw * .34; line(cx - bw2, by + 30 + tilt * 60, cx + bw2, by + 30 - tilt * 60, '#9DA9C4', 3);
    [-1, 1].forEach(sd => { const px = cx + sd * bw2, py = by + 30 - sd * tilt * 60; line(px, py, px - 30, py + 40, rgba('#9DA9C4', .6), 1); line(px, py, px + 30, py + 40, rgba('#9DA9C4', .6), 1); line(px - 34, py + 40, px + 34, py + 40, '#9DA9C4', 3); });
    const oy = by + 30 + tilt * 60 + 40, sy = by + 30 - tilt * 60 + 40; rr(cx - bw2 - 26, oy - 30, 52, 30, 6, rgba(OSSO, .25), OSSO, 1.6); nm('osso', cx - bw2, oy - 15, { c: C.txt }); ell(cx + bw2, sy - 18, 16, 18, 0, 'rgba(240,96,93,.3)', C.sangue, 1.6); nm('sangue', cx + bw2, sy + 12, { c: C.txt });
    nm('cálcio no sangue: normal', cx + bw2, sy + 26, { c: C.ok, w: 700 });
    mtx('paratormônio', cx - 4, by + 6, { s: 11, c: AMB }); circ(cx, by + 20, 7, AMB, GUT, 1.2);
    if (stress) for (let i = 0; i < 4; i++) { const f = fr(t * .4 + i / 4); circ(lerp(cx, cx - bw2, ss(f)), lerp(by + 22, oy - 28, ss(f)), 3, AMB, null); const g = fr(t * .4 + i / 4 + .5); circ(lerp(cx - bw2 + 10, cx + bw2, g), lerp(oy - 32, sy - 20, g) - Math.sin(g * PI) * 26, 3, '#fff', null); }
    // osso esponjoso
    const qx = wide ? A.x0 + cw + 14 : A.x0, qy = wide ? A.y0 + 4 : by + ch + 4, qw = A.x1 - qx, qh = wide ? A.h - 130 : 120; panel(qx, qy, qw, qh);
    nm('corte do osso esponjoso (trabéculas)', qx + 10, qy + 12, { a: 'left' }); const gx = qx + 14, gy = qy + 26, gw = qw - 28, gh = qh - 66, n = 12; const pt = (i, j) => [gx + (i + ((j * 7 + i * 3) % 3 - 1) * .08) / (n - 1) * gw, gy + j / (n - 1) * gh + ((i * 5 + j) % 3 - 1) * 2];
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { [[1, 0], [0, 1], [1, 1]].forEach(([di, dj], k) => { if (i + di >= n || j + dj >= n) return; const hs = ((i * 31 + j * 17 + k * 13) % 100) / 100; if (hs < D - .08) line(...pt(i, j), ...pt(i + di, j + dj), rgba(OSSO, .85), 1 + 2 * D); }); }
    rr(qx + 14, qy + qh - 30, qw - 28, 10, 5, 'rgba(255,255,255,.08)', C.line, 1); rr(qx + 14, qy + qh - 30, (qw - 28) * D, 10, 5, D > .65 ? C.ok : D > .45 ? AMB : C.erro); nm('densidade óssea', qx + 14, qy + qh - 10, { a: 'left', c: C.txt });
    const by2 = A.y1 - 120, bw = (A.w - 6) / 2;
    [['cal', 'pouco cálcio na dieta'], ['vd', 'pouca vitamina D'], ['ex', 'exercício com carga'], ['me', 'menopausa']].forEach(([k, s], i) => btn(A.x0 + (i % 2) * (bw + 6), by2 + Math.floor(i / 2) * 40, bw, 34, s, k === 'ex' ? C.ok : AMB, 'z' + k, { on: S[k] }));
    btn(A.x0, by2 + 80, A.w, 34, 'idade: ' + ['jovem', 'adulta', 'idosa'][S.id] + ' (toque para mudar)', AZ, 'zi', { on: true });
    cap(S.msg || (stress ? 'O sangue fica normal, e é o osso que paga: o paratormônio tira cálcio do osso para manter o sangue.' : 'Ajuste o cálcio, a vitamina D, o exercício, a menopausa e a idade.') + '<br>' + EDU);
  }
  function artFib(x, y, w, h) { const my = y + h * .4; rr(x + w * .08, my - h * .16, w * .38, h * .32, 6, rgba(OSSO, .18), OSSO, 1.5); rr(x + w * .54, my - h * .16, w * .38, h * .32, 6, rgba(OSSO, .18), OSSO, 1.5); const zz = []; for (let i = 0; i <= 8; i++) zz.push([x + w / 2 + (i % 2 ? 4 : -4), my - h * .16 + i * h * .04]); poly(zz, AMB, 1.6); nm('sutura', x + w / 2, my + h * .26, { c: C.txt }); }
  function artCart(x, y, w, h, m) { const cx = x + w / 2, cy = y + h * .4, a = m * .07; rr(cx - w * .22, cy + 8, w * .44, h * .2, 8, rgba(OSSO, .18), OSSO, 1.5); X.save(); X.translate(cx, cy + 6); X.rotate(a); rr(-w * .22, -h * .2 - 8, w * .44, h * .2, 8, rgba(OSSO, .18), OSSO, 1.5); X.restore(); ell(cx, cy + 3, w * .2, 6 - m * 1.5, 0, 'rgba(124,196,255,.45)', AZ, 1.4); nm('disco', cx + w * .3, cy + 3, { c: C.txt }); nm('vértebras', cx, cy + h * .38, { c: C.dim }); }
  function artSin(x, y, w, h, m, bola) {
    const cx = x + w / 2, ky = y + h * .46, L = h * .34; rr(cx - 9, ky + 6, 18, L, 7, rgba(OSSO, .18), OSSO, 1.5);
    if (bola) { const a = Math.sin(m * TAU) * .6, b = m * 1.2 - .3; X.save(); X.translate(cx, ky); X.rotate(a + .0 * b); rr(-8, -L, 16, L, 7, rgba(OSSO, .18), OSSO, 1.5); circ(0, 0, 11, rgba(OSSO, .3), OSSO, 1.5); X.restore(); X.beginPath(); X.arc(cx, ky + 4, 17, .1, PI - .1); X.strokeStyle = AZ; X.lineWidth = 3; X.stroke(); }
    else { const a = m * 1.3; X.save(); X.translate(cx, ky); X.rotate(a); rr(-8, -L, 16, L, 7, rgba(OSSO, .18), OSSO, 1.5); X.restore(); circ(cx, ky, 6, rgba(AZ, .5), AZ, 1.4); }
    X.setLineDash([4, 3]); rr(cx - 24, ky - 22, 48, 44, 12, null, '#9DA9C4', 1.2); X.setLineDash([]); for (let i = 0; i < 6; i++) circ(cx - 14 + (i * 11) % 28 + Math.sin(t0() + i) * 1.5, ky - 8 + (i * 7) % 16, 1.5, rgba(AMB, .8));
    line(cx - 11, ky - 12, cx - 11, ky + 12, AMB, 1.8); line(cx + 11, ky - 12, cx + 11, ky + 12, AMB, 1.8); nm(bola ? 'bola e soquete' : 'dobradiça', cx, y + h * .1, { c: AMB, w: 700 }); nm('cápsula, líquido sinovial, cartilagem e ligamentos', cx, ky + L + 18, { c: C.dim, s: 10 });
  }
  let T0 = 0; const t0 = () => T0;
  function drawArt(t, S, A) {
    T0 = t; const wide = !NAR, tw = (A.w - 12) / 3, m = S.v, nmz = ['fibrosa (imóvel)', 'cartilagínea (semimóvel)', 'sinovial (móvel)'];
    if (NAR) nmz.forEach((s, i) => btn(A.x0 + i * (A.w / 3), A.y0, A.w / 3 - 5, 34, ['fibrosa', 'cartilagínea', 'sinovial'][i], AZ, 'r' + i, { on: S.ar === i }));
    const top = A.y0 + (NAR ? 42 : 6), hh = (NAR ? A.h - 46 : A.h - 56);
    [0, 1, 2].forEach(i => { if (NAR && S.ar !== i) return; const x = NAR ? A.x0 : A.x0 + i * (tw + 6), w = NAR ? A.w : tw; panel(x, top, w, hh); mtx(`<b>${nmz[i]}</b>`, x + w / 2, top + 16, { s: fs(), c: C.txt }); if (i === 0) artFib(x, top + 20, w, hh - 20); if (i === 1) artCart(x, top + 20, w, hh - 20, m); if (i === 2) { artSin(x, top + 20, w, hh - 20, m, S.bs); hitR(x, top, w, hh, 'sb'); } });
    mtx(NAR ? 'Use o controle Movimento. Toque na sinovial para trocar.' : 'Mexa no controle Movimento. Toque na sinovial para trocar entre dobradiça e bola e soquete.', A.x0, A.y1 - 8, { s: 11, a: 'left', c: C.dim });
    cap(S.msg || 'A fibrosa não se mexe, a cartilagínea mexe pouco e a sinovial dobra ou gira. Tendões prendem músculo a osso; ligamentos prendem osso a osso.');
  }
  def('locomotor', 'esqueleto', {
    t: 'Ossos e articulações', s: 'um esqueleto vivo, que guarda cálcio e se refaz', c: '#B8C27A',
    loc: S => ({ esq: 'O esqueleto', osso: 'Um osso longo por dentro', cal: 'Banco de cálcio', art: 'Três articulações' })[S.modo] || '', locNota: S => S.modo === 'cal' ? EDU : NOTA, still: 4, stillV: .5,
    alt: 'um esqueleto esquemático com o esqueleto axial e o apendicular em duas cores; o corte de um osso longo; uma balança entre osso e sangue em que o aluno vê o que acontece com o cálcio e a densidade óssea; e três articulações (fibrosa, cartilagínea e sinovial) que o aluno movimenta.',
    extra: [modo('esq', 'Esqueleto'), modo('osso', 'Osso por dentro'), modo('cal', 'Banco de cálcio'), modo('art', 'Três articulações')],
    ctl: { l: 'Movimento', min: 0, max: 1, step: .05, v: 0, f: v => Math.round(v * 100) + '%', rate: () => 1 }, ctlVis: S => S.modo === 'art', auto: .2,
    init(S) { S.modo = 'esq'; S.pt = null; S.os = 2; S.cal = S.vd = S.ex = S.me = false; S.id = 0; S.ar = 2; S.bs = false; S.msg = null; },
    d: TXT.L1.d + '<p>Veja o esqueleto, um osso por dentro, o banco de cálcio e as três articulações.</p>', enem: TXT.L1.enem + '<br>' + EDU,
    links: [['Relembre na Histologia: o osso', '../histologia/index.html#conjuntivo/osso'], ['A cartilagem', '../histologia/index.html#conjuntivo/cartilagem']],
    tap(x, y, S) { const h = hid(x, y); if (!h) return; if (h[0] === 'b') S.pt = +h.slice(1); else if (h[0] === 'k') S.os = +h.slice(1); else if (h === 'zi') S.id = (S.id + 1) % 3; else if (h[0] === 'z') S[h.slice(1)] = !S[h.slice(1)]; else if (h[0] === 'r') S.ar = +h.slice(1); else if (h === 'sb') S.bs = !S.bs; },
    draw(t, S) {
      const A = area(); if (S.modo === 'osso') drawOsso(t, S, A); else if (S.modo === 'cal') drawCal(t, S, A); else if (S.modo === 'art') drawArt(t, S, A); else drawEsq(t, S, A);
    }
  });

  // ---------- L2: músculos e contração ----------
  const ACT = '#7CC4FF', MIO = '#E5646B';
  function sarc(x, y, w, h, c, o) {
    o = o || {}; const L = lerp(1, .66, c), hw = w / 2, cx = x + w / 2, my = y + h / 2, ah = hw * .62, mh = hw * .5, rows = 4, rh = h / (rows + 1);
    rr(x, y, w, h, 8, 'rgba(19,26,43,.5)', null);
    [-1, 1].forEach(sd => line(cx + sd * hw * L, y, cx + sd * hw * L, y + h, LIL, 4));
    for (let r = 0; r < rows; r++) { const ya = y + (r + 1) * rh; [-1, 1].forEach(sd => { line(cx + sd * hw * L, ya, cx + sd * (hw * L - ah), ya, ACT, 2.6); if (o.lock) for (let q = 1; q < 5; q++) rr(cx + sd * (hw * L - ah * q / 5) - 3, ya - 3, 6, 6, 1.5, C.erro, null); }); }
    for (let r = 0; r < 3; r++) { const ym = y + (r + 1.5) * rh; line(cx - mh, ym, cx + mh, ym, MIO, 6); const nh = 6; for (let q = 0; q < nh; q++) [-1, 1].forEach(sd => { const hx = cx + sd * (mh * (q + .5) / nh * 1.0 + 4), tl = o.att ? o.tilt || 0 : 0, up = (q + r) % 2 ? -1 : 1; if (Math.abs(hx - cx) < mh) line(hx, ym, hx + sd * 7 * tl, ym + up * (rh * .5 - 1), o.att ? AMB : rgba(MIO, .8), 2); }); }
    if (w > 200) { nm('linha Z', cx - hw * L, y - 8, { c: LIL }); nm('actina', cx - hw * .78, y + h + 10, { c: ACT }); nm('miosina', cx, y + h + 10, { c: MIO }); nm('linha Z', cx + hw * L, y - 8, { c: LIL }); }
  }
  function braco(sx, sy, s, th) {
    const La = s, Lf = s * .95, E = [sx, sy + La], d = [Math.sin(th), Math.cos(th)], n = [Math.cos(th), -Math.sin(th)], H = [E[0] + d[0] * Lf, E[1] + d[1] * Lf];
    const mus = (O, I, L0, sd, fil, nme) => { const dx = I[0] - O[0], dy = I[1] - O[1], len = Math.hypot(dx, dy), p = [dy / len * sd, -dx / len * sd], tw = cl(11 * L0 / len, 6, 17), top = [], bot = []; for (let i = 0; i <= 10; i++) { const u = i / 10, k = Math.sin(u * PI) ** .7 * tw + 1.5, cx = lerp(O[0], I[0], u) + p[0] * Math.sin(u * PI) * 9, cy = lerp(O[1], I[1], u) + p[1] * Math.sin(u * PI) * 9; top.push([cx + p[0] * k, cy + p[1] * k]); bot.push([cx - p[0] * k, cy - p[1] * k]); } shape(top.concat(bot.reverse()), fil, MIO, 1.6); mtx(nme, (O[0] + I[0]) / 2 + p[0] * (tw + 20), (O[1] + I[1]) / 2 + p[1] * (tw + 20), { s: 11, c: C.txt }); return { len, mid: [(O[0] + I[0]) / 2, (O[1] + I[1]) / 2], O, I }; };
    line(sx, sy, E[0], E[1], OSSO, 10); line(E[0], E[1], H[0], H[1], OSSO, 9); circ(sx, sy, 9, OSSO, GUT, 1.5); circ(E[0], E[1], 8, OSSO, GUT, 1.5); circ(H[0], H[1], 7, rgba(OSSO, .6), null);
    const Ob = [sx + 8, sy + La * .12], Ib = [E[0] + d[0] * Lf * .16 + n[0] * 8, E[1] + d[1] * Lf * .16 + n[1] * 8], Ot = [sx - 8, sy + La * .12], It = [E[0] - n[0] * 9 - d[0] * 4, E[1] - n[1] * 9 - d[1] * 4];
    const b0 = Math.hypot(sx + 8 - (sx + 8), La * .88 + Lf * .16), t0_ = Math.hypot(1, La * .88), c = th / 2.2;
    const bi = mus(Ob, Ib, b0, 1, rgba(MIO, .35 + .3 * c), 'bíceps'), tr = mus(Ot, It, t0_, -1, rgba(MIO, .35 + .3 * (1 - c)), 'tríceps');
    const a = c > .5 ? bi : tr; const dx = a.O[0] - a.I[0], dy = a.O[1] - a.I[1], l = Math.hypot(dx, dy); arrow(a.mid[0] - dx / l * 4, a.mid[1] - dy / l * 4, a.mid[0] + dx / l * 22, a.mid[1] + dy / l * 22, AMB, 2.2);
    return { bi };
  }
  function drawBraco(t, S, A) {
    const th = 1.1 * (1 - Math.cos(t * TAU / 6)), c = th / 2.2, rise = Math.sin(t * TAU / 6) > 0, wide = !NAR, pw = wide ? A.w * .46 : A.w, ph = wide ? A.h : A.h * .5, s = Math.min(ph * .42, pw * .4, 170);
    panel(A.x0, A.y0, pw, ph); const r = braco(A.x0 + pw * .35, A.y0 + 28, s, th);
    mtx(rise ? 'dobrando: o bíceps contrai, o tríceps relaxa' : 'esticando: o tríceps contrai, o bíceps relaxa', A.x0 + pw / 2, A.y0 + ph - 14, { s: fs(), c: AMB });
    const qx = wide ? A.x0 + pw + 16 : A.x0, qy = wide ? A.y0 + ph * .2 : A.y0 + ph + 10, qw = A.x1 - qx, qh = wide ? ph * .5 : A.y1 - qy - 16; panel(qx, qy, qw, qh);
    nm('zoom: um sarcômero da fibra do bíceps', qx + 10, qy + 12, { a: 'left' }); sarc(qx + 12, qy + 36, qw - 24, qh - 66, c, { att: true, tilt: .8 });
    X.setLineDash([4, 4]); line(r.bi.mid[0], r.bi.mid[1], qx, qy + qh / 2, rgba('#9DA9C4', .5), 1.2); X.setLineDash([]);
    cap('Cada músculo só puxa. No sarcômero, a actina desliza sobre a miosina sem mudar de tamanho: o sarcômero encurta e o músculo também.');
  }
  function drawIng(t, S, A) {
    const eff = S.im && !S.bl, tgt = !eff ? 0 : !S.ca ? 0 : !S.at ? .55 : .5 + .5 * Math.sin(t * 2.2), c = (S.c = S.c == null ? 0 : lerp(S.c, tgt, 1 - Math.exp(-6 * (S.dt || .016))));
    const sy0 = A.y0 + 4, sh = 56; panel(A.x0, sy0, A.w, sh); const nx = A.x0 + 16, nw = A.w * .3, fx = A.x0 + A.w * .55;
    rr(nx, sy0 + 12, nw, 32, 14, 'rgba(111,177,232,.18)', '#6FB1E8', 1.5); nm('neurônio motor', nx + nw / 2, sy0 + 28, { c: C.txt }); rr(fx, sy0 + 12, A.x1 - fx - 12, 32, 6, 'rgba(229,100,107,.18)', MIO, 1.5); nm('fibra muscular', fx + (A.x1 - fx - 12) / 2, sy0 + 28, { c: C.txt }); nm('placa motora', (nx + nw + fx) / 2, sy0 + 8, {});
    line(nx + nw, sy0 + 28, fx, sy0 + 28, rgba('#9DA9C4', .5), 1, [3, 3]);
    if (S.im) { const f = fr(t * .5); if (S.bl) { const x = lerp(nx + 20, nx + nw, Math.min(1, f * 1.4)); circ(x, sy0 + 28, 5, AZ, '#fff', 1); nm('acetilcolina bloqueada', (nx + nw + fx) / 2, sy0 + 48, { c: C.erro, w: 700 }); line((nx + nw + fx) / 2 - 3, sy0 + 20, (nx + nw + fx) / 2 + 3, sy0 + 36, C.erro, 3); } else circ(lerp(nx + 20, fx + 40, f), sy0 + 28, 5, AZ, '#fff', 1); }
    const qy = sy0 + sh + 12, qh = Math.min(A.h - sh - (NAR ? 150 : 110), 150), mid = qy + qh / 2; panel(A.x0, qy, A.w, qh + 34);
    const att = eff && S.ca && (!S.at || Math.sin(t * 2.2 + 1.2) > 0); sarc(A.x0 + 14, qy + 14, A.w - 28, qh - 10, c, { lock: eff && !S.ca, att, tilt: .9 });
    const ry = qy + qh + 22; ell(A.x0 + 70, ry, 52, 11, 0, 'rgba(255,154,60,.1)', CAL, 1.2); nm('retículo sarcoplasmático', A.x0 + 70, ry + 17, { c: C.dim });
    if (S.ca) for (let i = 0; i < 6; i++) { const f = eff ? fr(t * .5 + i / 6) : 0, x = lerp(A.x0 + 40 + i * 8, A.cx - 30 + i * 12, ss(f)), y = lerp(ry, qy + 24 + (i % 4) * (qh / 5), ss(f)); circ(x, y, 3, CAL, null); }
    nm('cálcio', A.x0 + 70, ry - 18, { c: CAL });
    const by = A.y1 - (NAR ? 80 : 40), cols = NAR ? 2 : 4, bw = (A.w - (cols - 1) * 6) / cols;
    [['im', 'impulso nervoso'], ['ca', 'cálcio'], ['at', 'ATP'], ['bl', 'bloquear a acetilcolina']].forEach(([k, s], i) => btn(A.x0 + (i % cols) * (bw + 6), by + Math.floor(i / cols) * 40, bw, 34, s, k === 'bl' ? C.erro : AMB, 'i' + k, { on: S[k] }));
    cap(S.bl && S.im ? 'O curare bloqueia a acetilcolina: o impulso para na placa motora e o músculo não contrai.' : !S.im ? 'Sem impulso nervoso, nada acontece. Ligue os três interruptores.' : !S.ca ? 'Sem cálcio, a actina fica travada e a miosina não consegue se ligar.' : !S.at ? 'Cálcio sem ATP: a miosina prende e não solta. É a rigidez cadavérica.' : 'Impulso, cálcio e ATP: a miosina puxa a actina e solta, em ciclos. O sarcômero encurta e relaxa.');
  }
  def('locomotor', 'movimento', {
    t: 'Músculos e contração', s: 'actina desliza sobre miosina, com cálcio e ATP', c: '#B8C27A',
    loc: S => S.modo === 'ing' ? 'Os três ingredientes' : 'O braço e o sarcômero', locNota: () => NOTA, still: 1.5,
    alt: 'um braço esquemático dobrando e esticando, com bíceps e tríceps, e o zoom de um sarcômero em que a actina desliza sobre a miosina; e um sarcômero com interruptores de impulso nervoso, cálcio e ATP, mais um botão que bloqueia a acetilcolina.',
    extra: [modo('braco', 'O braço e o sarcômero'), modo('ing', 'Os três ingredientes')], ctl: false,
    init(S) { S.modo = 'braco'; S.im = S.ca = S.at = true; S.bl = false; S.c = null; S.msg = null; },
    d: TXT.L2.d + '<p>Veja o braço em movimento e depois ligue e desligue os ingredientes da contração.</p>', enem: TXT.L2.enem,
    links: [['Relembre na Histologia: o sarcômero', '../histologia/index.html#muscular/sarcomero'], ['A contração', '../histologia/index.html#muscular/contracao']],
    tap(x, y, S) { const h = hid(x, y); if (h && h[0] === 'i') S[h.slice(1)] = !S[h.slice(1)]; },
    draw(t, S) { const A = area(); if (S.modo === 'ing') drawIng(t, S, A); else drawBraco(t, S, A); }
  });
}
