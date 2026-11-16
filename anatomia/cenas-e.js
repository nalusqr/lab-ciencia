/* LAB, módulo Anatomia e fisiologia. Cenas de endócrino (E1, E2) e nervoso (N1, N2).
   Código da equipe (Prometeu). Textos: roteiro docs/revisao-biologia/anatomia-roteiro-parte2.md (parágrafos e cartões "No ENEM" entre as marcas TXT). */
'use strict';
{
  const NOTA = 'Desenho esquemático, fora de escala', EDU = 'Conteúdo educativo, não substitui orientação médica.';
  const AMB = '#F2C94C', GUT = '#0B0F1C', AZ = '#7CC4FF', GLC = '#7FD3FF', LIL = '#C58BE8', TEAL = '#4FC3B5', LAR = '#F28C3A';
  const TXT = {};
  //TXT-INICIO
  TXT.E1 = {"d":"<p>O <b>sistema endócrino</b> é formado por <b>glândulas endócrinas</b>, que lançam <b>hormônios</b> direto no <b>sangue</b>. O hormônio viaja pelo corpo todo, mas só age nas <b>células-alvo</b>, as que têm <b>receptores</b> para ele, como uma chave que só abre a fechadura certa. A resposta é mais <b>lenta</b> e mais <b>duradoura</b> que a do sistema nervoso. As glândulas <b>exócrinas</b>, ao contrário, lançam o que fazem por um <b>ducto</b> (suor, saliva, suco digestivo). O <b>pâncreas</b> é <b>misto</b>: parte exócrina (suco pancreático) e parte endócrina (insulina e glucagon, ver <a href=\"#endocrino/glicemia\">glicemia</a>).</p><p>O centro de comando é a dupla <b>hipotálamo e hipófise</b>, na base do cérebro. O <b>hipotálamo</b> é parte do sistema nervoso e controla a hipófise; por isso se diz que ele liga os dois sistemas. A <b>hipófise</b> solta hormônios que comandam outras glândulas, os <b>trópicos</b>: o <b>TSH</b> (estimula a tireoide), o <b>ACTH</b> (estimula o córtex das adrenais), o <b>FSH</b> e o <b>LH</b> (estimulam ovários e testículos, ver <a href=\"#reprodutor/ciclo\">ciclo menstrual</a>). Ela solta também o <b>GH</b> (hormônio do crescimento) e a <b>prolactina</b> (produção de leite). Pela parte de trás da hipófise saem dois hormônios feitos no hipotálamo: a <b>ocitocina</b> (contrações do parto e saída do leite) e o <b>ADH</b> (antidiurético, que faz o rim poupar água, ver <a href=\"#excretor/controle\">Excretor: controle</a>).</p><p>A <b>tireoide</b>, no pescoço, faz <b>T3 e T4</b>, que aceleram o <b>metabolismo</b> de quase todas as células, e precisam de <b>iodo</b>. Pouco hormônio (<b>hipotireoidismo</b>) dá cansaço, frio, ganho de peso e, na criança, atraso no desenvolvimento; excesso (<b>hipertireoidismo</b>) dá calor, perda de peso e coração acelerado. Sem iodo na dieta, a tireoide não consegue fazer T3 e T4; a hipófise, sem o freio, solta cada vez mais TSH, e a glândula cresce: é o <b>bócio</b>. Por isso o Brasil adiciona iodo ao <b>sal de cozinha</b>. A tireoide faz também a <b>calcitonina</b>, que baixa o cálcio do sangue; as <b>paratireoides</b>, atrás dela, fazem o <b>paratormônio</b>, que o sobe (tirando cálcio dos ossos, ver <a href=\"#locomotor/esqueleto\">esqueleto</a>). As <b>adrenais</b> (ou suprarrenais), sobre os rins, têm duas partes: a <b>medula</b> solta <b>adrenalina</b> na hora do susto (ver <a href=\"#nervoso/autonomo\">sistema autônomo</a>); o <b>córtex</b> solta <b>cortisol</b> (estresse, glicose) e <b>aldosterona</b> (sal e água, ver <a href=\"#excretor/controle\">Excretor: controle</a>).</p><p>Quase tudo isso é controlado por <b>retroalimentação negativa</b>: o <b>efeito</b> do hormônio <b>freia</b> a sua própria produção. Funciona como o termostato do ar-condicionado: esfriou o bastante, ele desliga. Quando T3 e T4 sobem no sangue, eles inibem o hipotálamo e a hipófise, que soltam menos TSH, e a tireoide desacelera. Quando caem, o freio sai, o TSH sobe e a tireoide volta a trabalhar. Assim o corpo mantém o meio interno estável, a <b>homeostase</b>. Esse mesmo freio explica por que quem toma hormônio de fora (anabolizante, por exemplo) pode ter a glândula do próprio corpo <b>parada e atrofiada</b>.</p>","enem":"O conceito mais cobrado é a <b>retroalimentação negativa</b>: em geral vem um gráfico ou um esquema de setas, e a pergunta é o que acontece com um hormônio quando outro sobe ou cai. Treine o caso do <b>bócio por falta de iodo</b> (TSH alto, T3 e T4 baixos) e o do <b>uso de anabolizantes</b> (testículos atrofiados, porque o hormônio de fora freia o LH e o FSH). Também aparece a diferença entre <b>glândula endócrina e exócrina</b> e a ideia de que o hormônio só age na célula que tem receptor."};
  TXT.E2 = {"d":"<p>A glicose é o principal combustível das células, e o seu nível no sangue, a <b>glicemia</b>, precisa ficar numa faixa estreita. Quem segura essa faixa são as <b>ilhotas pancreáticas</b> (de Langerhans), pequenos grupos de células endócrinas no meio do pâncreas. Depois de uma refeição, a glicemia sobe e as <b>células beta</b> soltam <b>insulina</b>: ela faz músculos e tecido adiposo <b>absorverem glicose</b> e faz o <b>fígado</b> e os músculos guardarem o excesso como <b>glicogênio</b>. A glicemia cai. Em jejum ou no exercício, a glicemia cai e as <b>células alfa</b> soltam <b>glucagon</b>: ele faz o fígado <b>quebrar glicogênio</b> e soltar glicose no sangue. A glicemia sobe. São hormônios <b>antagônicos</b>, e cada um é desligado pelo próprio efeito: retroalimentação negativa de novo (ver <a href=\"#endocrino/glandulas\">Endócrino: glândulas</a>). Adrenalina e cortisol também sobem a glicemia em situações de estresse.</p><p>No <b>diabetes mellitus</b>, a glicemia fica alta demais (<b>hiperglicemia</b>). No <b>tipo 1</b>, o sistema imune destrói as células beta, e o corpo quase não faz insulina; aparece geralmente em crianças e jovens, e o tratamento exige <b>insulina injetada</b> (ou por bomba), porque a insulina é proteína e seria digerida se fosse engolida. No <b>tipo 2</b>, o mais comum de longe, o corpo faz insulina, mas as células <b>respondem mal</b> a ela (<b>resistência à insulina</b>); está ligado a excesso de peso, sedentarismo e herança familiar, e pode ser prevenido ou adiado com <b>alimentação equilibrada e atividade física</b>. O excesso de glicose sai na <b>urina</b> e puxa água junto: muita sede, muita urina, fome e perda de peso são sinais clássicos. Com os anos, a glicose alta lesa vasos e nervos (olhos, rins, pés). Há também o <b>diabetes gestacional</b>, que surge na gravidez.</p><p>A insulina usada hoje é <b>humana</b>, produzida por <b>bactérias ou leveduras transgênicas</b> que receberam o gene humano, um dos primeiros produtos da biotecnologia.</p>","enem":"Caem muito o <b>gráfico de glicemia e insulina</b> depois de uma refeição (quem sobe primeiro, quem desce depois) e a comparação entre <b>tipo 1</b> (falta insulina, tratamento com insulina) e <b>tipo 2</b> (resistência, tratamento com dieta, atividade física e remédios). Cuidado com a alternativa que diz que a insulina \"produz\" glicose: ela <b>retira</b> glicose do sangue. Também aparece a <b>insulina de bactéria transgênica</b> como exemplo de biotecnologia e a pergunta \"por que a insulina não pode ser tomada por via oral\"."};
  TXT.N1 = {"d":"<p>Lembrete rápido da Histologia: o <b>neurônio</b> recebe sinais pelos <b>dendritos</b>, e o <b>impulso nervoso</b> corre pelo <b>axônio</b> como uma onda elétrica (troca rápida de sódio e potássio pela membrana); a <b>bainha de mielina</b> deixa o impulso muito mais rápido. Na ponta do axônio, a <b>sinapse</b> passa a mensagem adiante por meio de <b>neurotransmissores</b>, sempre num só sentido.</p><p>O sistema nervoso tem duas partes. O <b>sistema nervoso central (SNC)</b> é formado pelo <b>encéfalo</b> (dentro do crânio) e pela <b>medula espinal</b> (dentro da coluna), protegidos por osso, pelas <b>meninges</b> e pelo <b>líquido cefalorraquidiano</b> (a meningite é a inflamação das meninges). No encéfalo, o <b>cérebro</b> cuida do pensamento, da memória, da linguagem, dos movimentos voluntários e da interpretação dos sentidos, cada função numa região do <b>córtex</b>; o <b>cerebelo</b> cuida do <b>equilíbrio</b> e da coordenação dos movimentos (é dos primeiros a falhar com o álcool); o <b>tronco encefálico</b> (com o <b>bulbo</b>) controla funções vitais, como a respiração e os batimentos. O <b>sistema nervoso periférico (SNP)</b> é formado pelos <b>nervos</b> e <b>gânglios</b>: 12 pares de nervos cranianos e 31 pares de nervos espinais. Nos nervos correm fibras <b>sensitivas</b> (aferentes), que levam informação dos receptores até o SNC, e fibras <b>motoras</b> (eferentes), que levam ordens do SNC até músculos e glândulas.</p><p>No <b>arco reflexo</b>, a resposta não espera o cérebro. No reflexo patelar, a batida no joelho estica um receptor no músculo; o <b>neurônio sensitivo</b> leva o impulso até a <b>medula</b>; ali ele passa (às vezes por um <b>neurônio de associação</b>) para o <b>neurônio motor</b>, que manda o músculo da coxa contrair, e a perna chuta. Tirar a mão de uma panela quente funciona igual: a mão sai <b>antes</b> de a dor chegar à consciência, porque o impulso que sobe ao cérebro chega depois. O caminho é sempre: <b>receptor, neurônio sensitivo, medula, neurônio motor, efetor</b>. Por isso uma lesão na medula pode cortar tanto a sensibilidade quanto o movimento das partes abaixo dela.</p><p><b>Os sentidos</b> começam nos <b>receptores</b>: na <b>retina</b>, os <b>cones</b> veem cores e detalhes com luz forte e os <b>bastonetes</b> veem com pouca luz, em preto e branco; os dois usam pigmentos feitos com vitamina A, e a falta dela causa cegueira noturna; na <b>miopia</b>, a imagem se forma antes da retina e a lente corretora é <b>divergente</b>; na <b>hipermetropia</b>, depois, e a lente é <b>convergente</b>. Na <b>orelha interna</b>, a <b>cóclea</b> transforma vibração em impulso (audição) e os <b>canais semicirculares</b> informam a posição da cabeça (equilíbrio). Língua e nariz têm <b>quimiorreceptores</b>; a pele tem receptores de tato, pressão, calor, frio e dor.</p>","enem":"O <b>arco reflexo</b> cai com um esquema para nomear as partes ou para dizer o que falha numa lesão. Saiba que o reflexo é feito pela <b>medula</b>, sem depender do cérebro, e que a dor é percebida <b>depois</b> da retirada da mão. Também aparecem a função de cada parte do encéfalo (o <b>cerebelo</b> e o equilíbrio, o <b>bulbo</b> e a respiração), a <b>mielina</b> e a velocidade do impulso (ligação com doenças desmielinizantes) e, no olho, <b>cones e bastonetes</b> e o tipo de lente para miopia e hipermetropia (pergunta comum também na Física)."};
  TXT.N2 = {"d":"<p>Parte do sistema nervoso funciona sem a nossa vontade: é o <b>sistema nervoso autônomo</b>, que controla coração, vasos, pulmões, intestino, glândulas e pupilas. Ele tem duas divisões, que costumam ter <b>efeitos opostos</b> no mesmo órgão. O <b>simpático</b> prepara o corpo para <b>luta ou fuga</b>: acelera o coração e a respiração, dilata os brônquios e as <b>pupilas</b>, desvia sangue para os músculos, sobe a glicemia e <b>freia a digestão</b>; trabalha junto com a <b>adrenalina</b> da medula adrenal, e o seu neurotransmissor principal nos órgãos é a <b>noradrenalina</b>. O <b>parassimpático</b> cuida do <b>repouso e da digestão</b>: desacelera o coração, contrai as pupilas, <b>estimula a digestão</b> e a salivação; o seu neurotransmissor é a <b>acetilcolina</b>. Os dois trabalham o tempo todo, e o equilíbrio entre eles ajusta o corpo a cada situação (ver o controle da frequência cardíaca em <a href=\"#circulatorio/coracao\">Circulatório: coração</a>).</p><p>As <b>drogas psicoativas</b> agem nas <b>sinapses</b>, mexendo nos neurotransmissores. Há três grupos. As <b>depressoras</b> diminuem a atividade do SNC: <b>álcool</b> (age sobretudo aumentando o efeito do <b>GABA</b>, o principal neurotransmissor inibitório), calmantes, opioides (morfina, heroína) e solventes; em excesso, podem parar a respiração. As <b>estimulantes</b> aumentam a atividade: <b>nicotina</b>, cafeína, <b>cocaína</b> e anfetaminas; a cocaína, por exemplo, impede que a <b>dopamina</b> seja recolhida da sinapse, e o sinal fica \"ligado\". As <b>perturbadoras</b> (alucinógenas) alteram a percepção: maconha, LSD, ecstasy. Muitas drogas aumentam a <b>dopamina</b> no circuito de recompensa do cérebro; com o uso repetido, o cérebro diminui os próprios receptores (<b>tolerância</b>: é preciso mais droga para o mesmo efeito) e passa a precisar dela para funcionar (<b>dependência</b>, com <b>abstinência</b> quando falta). O álcool ainda deprime o <b>cerebelo</b> (perda de equilíbrio) e aumenta o tempo de reação, por isso não combina com direção. A nicotina, além da dependência, vem com o alcatrão e o monóxido de carbono do cigarro, e os cigarros eletrônicos também têm nicotina.</p><p>Alguns venenos e remédios agem na sinapse entre nervo e músculo, que usa <b>acetilcolina</b>: o <b>curare</b> e a toxina <b>botulínica</b> bloqueiam a passagem do sinal e paralisam; alguns <b>inseticidas</b> organofosforados impedem que a acetilcolina seja desmanchada, e o músculo não relaxa.</p>","enem":"Caem tabelas de efeitos para dizer qual divisão está agindo: <b>pupila dilatada, coração acelerado e digestão parada</b> é o <b>simpático</b>. Sobre drogas, a questão costuma trazer um texto sobre um neurotransmissor (dopamina, serotonina, acetilcolina) e pedir o efeito de <b>bloquear a recaptação</b> ou <b>bloquear o receptor</b>. Saiba classificar <b>depressoras, estimulantes e perturbadoras</b> (o álcool é depressor, mesmo que no começo pareça \"animar\") e explicar <b>tolerância</b> e <b>dependência</b>."};
  //TXT-FIM
  const modo = (id, t) => ({ t, on: S => { S.modo = id; S.msg = null; S.fl = null; }, pressed: S => S.modo === id });
  const hid = (x, y) => { const h = hitAt(x, y); return typeof h === 'string' ? h : null; };
  const flash = (S, k, i) => { S.fl = { k, i, t: performance.now() }; };
  const isfl = (S, k, i) => S.fl && S.fl.k === k && S.fl.i === i && performance.now() - S.fl.t < 800;
  const fs = () => NAR ? 12 : 13;
  const sm = (S, k, v, r) => { S[k] = S[k] == null ? v : lerp(S[k], v, 1 - Math.exp(-(r || 4) * (S.dt || .016))); return S[k]; };
  const bump = (x, tau) => x > 0 ? x / tau * Math.exp(1 - x / tau) : 0;
  const gau = (d, m, s) => Math.exp(-(((d - m) / s) ** 2));
  const chip = (S, k, i, s, x, y, w, h, on, c) => { c = c || AMB; rr(x, y, w, h, 8, on ? rgba(c, .25) : 'rgba(19,26,43,.94)', isfl(S, k, i) ? C.erro : c, on || isfl(S, k, i) ? 2.2 : 1.3); wrapTx(s, x + w / 2, y + h / 2 - (wrapTx(s, 0, 0, w - 8, { s: fs(), w: 600, lh: fs() + 3, dry: true }) - fs() - 3) / 2, w - 8, { s: fs(), w: 600, lh: fs() + 3, c: C.txt }); hitR(x, y, w, h, k + i); };
  // silhueta neutra (traço único); (x, y) = centro, h = altura total
  function corpo(x, y, h, c, a = 1) {
    const f = rgba(c, .14 * a), s = rgba(c, .7 * a), u = h / 10;
    circ(x, y - 4.1 * u, .9 * u, f, s, 1.5); rr(x - 1.3 * u, y - 3 * u, 2.6 * u, 4.2 * u, u, f, s, 1.5);
    rr(x - 2.5 * u, y - 2.9 * u, .9 * u, 3.8 * u, .45 * u, f, s, 1.5); rr(x + 1.6 * u, y - 2.9 * u, .9 * u, 3.8 * u, .45 * u, f, s, 1.5);
    rr(x - 1.25 * u, y + 1 * u, 1.1 * u, 4 * u, .5 * u, f, s, 1.5); rr(x + .15 * u, y + 1 * u, 1.1 * u, 4 * u, .5 * u, f, s, 1.5);
  }
  const gl = (k, x, y, r, f, s) => {
    if (k === 0) rr(x - r, y - r, 2 * r, 2 * r, 2, f, s, 1.4);
    else if (k === 1) shape([[x, y - r * 1.2], [x + r * 1.1, y + r * .8], [x - r * 1.1, y + r * .8]], f, s, 1.4);
    else shape([[x, y - r * 1.2], [x + r * 1.2, y], [x, y + r * 1.2], [x - r * 1.2, y]], f, s, 1.4);
  };
  const inib = (x1, y1, x2, y2, c, lw, dash) => { line(x1, y1, x2, y2, c, lw, dash); const a = Math.atan2(y2 - y1, x2 - x1), px = -Math.sin(a) * 8, py = Math.cos(a) * 8; line(x2 - px, y2 - py, x2 + px, y2 + py, c, Math.max(2, lw)); };
  // arrastar peça: S.dr = { i, x, y }; ps = prefixo do id da peça
  const mkdrag = (ps, soltar) => ({
    grab(x, y, S) { const h = hid(x, y); if (h && h.startsWith(ps) && h.length === ps.length + 1) { S.dr = { i: +h.slice(ps.length), x, y }; return true; } return false; },
    grabMove(x, y, S) { if (S.dr) { S.dr.x = x; S.dr.y = y; } },
    grabEnd(x, y, S) { const d = S.dr; S.dr = null; if (d) soltar(S, d.i, hid(x, y)); }
  });

  // ---------- E1: glândulas e o termostato da tireoide ----------
  const GL = [
    { n: 'hipotálamo', x: [0], y: -4.35, f: 0, h: 'controla a hipófise; faz ocitocina e ADH', d: 'Parte do sistema nervoso que comanda a hipófise: é ele que liga os dois sistemas.' },
    { n: 'hipófise', x: [0], y: -3.8, f: 1, h: 'TSH, ACTH, FSH, LH, GH, prolactina', d: 'Solta hormônios que comandam outras glândulas (os trópicos) e o GH, do crescimento. Guarda e solta a ocitocina e o ADH.' },
    { n: 'tireoide', x: [0], y: -3.15, f: 2, h: 'T3, T4 e calcitonina', d: 'T3 e T4 aceleram o metabolismo e precisam de iodo. A calcitonina baixa o cálcio do sangue.' },
    { n: 'paratireoides', x: [-.38, .38], y: -3.0, f: 0, h: 'paratormônio', d: 'Ficam atrás da tireoide. O paratormônio sobe o cálcio do sangue, tirando cálcio dos ossos.' },
    { n: 'adrenais', x: [-.85, .85], y: -.95, f: 1, h: 'adrenalina, cortisol, aldosterona', d: 'A medula solta adrenalina no susto; o córtex solta cortisol (estresse, glicose) e aldosterona (sal e água).' },
    { n: 'pâncreas', x: [-.25, .25], y: -.35, f: 2, h: 'insulina e glucagon', d: 'Glândula mista: a parte exócrina faz suco digestivo; a endócrina faz os hormônios que seguram a glicemia.' },
    { n: 'ovários', x: [-.6, .6], y: .85, f: 0, h: 'estrógeno e progesterona', d: 'As glândulas sexuais fazem os hormônios sexuais; FSH e LH da hipófise as comandam.' },
    { n: 'testículos', x: [-.3, .3], y: 1.75, f: 0, h: 'testosterona', d: 'As glândulas sexuais fazem os hormônios sexuais; FSH e LH da hipófise as comandam.' }
  ];
  const glList = S => GL.filter((g, i) => i !== (S.sx ? 6 : 7));
  function drawGl(t, S, A) {
    const L = glList(S), n = L.length, bh = NAR ? Math.min(A.h * .5, 240) : Math.min(A.h * .94, 400), u = bh / 10;
    const bx = NAR ? A.cx : A.x0 + Math.min(A.w * .3, 220), by = A.y0 + bh / 2 + 4;
    corpo(bx, by, bh, '#9DA9C4');
    const rev = S.sel == null ? Math.min(n, Math.floor(t / .6) + 1) : n;
    const sel = S.sel != null ? S.sel : rev >= n ? Math.floor((t - n * .6) / 3.2) % n : null;
    L.forEach((g, i) => {
      if (i >= rev) return; const on = sel === i, side = i % 2 ? 1 : -1, ly = by + g.y * u + (i === 1 ? 10 : i === 0 ? -6 : 0);
      g.x.forEach(gx => { const x = bx + gx * u, y = by + g.y * u; circ(x, y, Math.max(3.5, u * .17) + (on ? 2 : 0), on ? AMB : rgba('#F28C3A', .85), on ? '#fff' : GUT, on ? 2 : 1.2); });
      const gx0 = g.x[g.x.length - 1] * (side > 0 ? 1 : 1), ex = bx + (side > 0 ? Math.max(gx0, 0) : Math.min(g.x[0], 0)) * u;
      line(ex + side * 7, by + g.y * u, bx + side * 2.9 * u, ly, rgba('#9DA9C4', .6), 1);
      mtx(g.n, bx + side * 2.9 * u + side * 4, ly, { s: fs(), a: side > 0 ? 'left' : 'right', w: on ? 700 : 500, c: on ? AMB : C.txt });
      g.x.forEach(gx => hitC(bx + gx * u, by + g.y * u, 15, 'g' + i));
    });
    // painel de informação e alvo
    const px = NAR ? A.x0 : bx + 2.9 * u + 118, py = NAR ? by + bh / 2 + 6 : A.y0, pw = A.x1 - px, ph = A.y1 - py;
    if (pw < 150 || ph < 120) return;
    panel(px, py, pw, ph);
    const g = sel != null ? L[sel] : null;
    if (g) {
      mtx(`<b>${g.n}</b>`, px + 10, py + 16, { s: NAR ? 14 : 15, a: 'left', c: AMB });
      let y = py + 32; y += wrapTx(`<b>Hormônios:</b> ${g.h}.`, px + 10, y + 6, pw - 20, { s: fs(), lh: fs() + 3, a: 'left', c: C.txt });
      if (!NAR || ph > 210) y += wrapTx(g.d, px + 10, y + 8, pw - 20, { s: fs(), lh: fs() + 3, a: 'left', c: C.dim }) + 2;
      const vy = Math.max(y + 22, py + ph - 100), vw = pw - 24, f = g.f;
      mtx('o hormônio viaja pelo sangue e só age na célula com o receptor certo', px + 10, vy - 18, { s: 11, a: 'left', c: C.dim });
      rr(px + 12, vy - 8, vw, 16, 8, 'rgba(240,96,93,.22)', C.sangue, 1.2);
      for (let i = 0; i < 7; i++) gl(f, px + 12 + fr(t * .12 + i / 7) * vw, vy, 3.6, AMB, GUT);
      const cr = NAR ? 17 : 20;
      for (let k = 0; k < 4; k++) {
        const cx = px + 12 + (k + .5) * vw / 4, cy = vy + 22 + cr, rf = k % 2 ? (f + 1 + (k >> 1)) % 3 : f, ok = rf === f;
        line(cx, vy + 8, cx, cy - cr, rgba('#9DA9C4', .35), 1, [3, 3]);
        circ(cx, cy, cr, 'rgba(111,177,232,.16)', ok ? rgba(AMB, .9) : C.line, ok ? 1.8 : 1.2);
        gl(rf, cx, cy - cr + 1, 5, GUT, ok ? AMB : C.dim);
        if (ok) { const p = Math.sin(t * 4 + k) * .5 + .5; gl(f, cx, cy - cr - 7, 3.4, AMB, null); circ(cx, cy, cr + 3 + p * 2, null, rgba(AMB, .45), 1.5); }
        mtx(ok ? 'responde' : 'não responde', cx, cy + cr + 11, { s: 11, c: ok ? AMB : C.dim });
      }
    } else mtx('Toque numa glândula para ver o que ela produz', px + 10, py + 18, { s: fs(), a: 'left', c: C.dim });
    cap(S.msg || 'Toque numa glândula: os hormônios só "grudam" nas células com o receptor da mesma forma.');
  }
  const TH = {
    n: ['Em equilíbrio: o T3 e o T4 no sangue freiam a hipófise e o hipotálamo, e o TSH fica no ponto certo.', .5, .5, 1],
    i: ['Sem iodo a tireoide não faz T3 e T4. O freio some, o TSH sobe e a glândula incha: é o bócio.', .12, .95, 1.75],
    e: ['Com hormônio de fora, o freio fica forte: o TSH cai quase a zero e a tireoide, sem trabalho, encolhe.', .92, .03, .62],
    m: ['O tumor solta TSH sem obedecer ao freio: a tireoide trabalha demais e T3 e T4 ficam altos.', .95, 1, 1.4]
  };
  function drawTh(t, S, A) {
    const c = TH[S.c], T = sm(S, 'T', c[1]), H = sm(S, 'H', c[2]), G = sm(S, 'G', c[3]);
    const gap = NAR ? 30 : 60, nw = Math.min(170, (A.w - 2 * gap) / 3), nh = NAR ? 54 : 64, x0 = A.cx - (3 * nw + 2 * gap) / 2, y1 = A.y0 + 10;
    const nx = i => x0 + i * (nw + gap), by = y1 + nh + (NAR ? 58 : 78), bh = 26;
    const no = (i, s) => { rr(nx(i), y1, nw, nh, 10, 'rgba(19,26,43,.94)', C.line, 1.4); mtx(s, nx(i) + nw / 2, y1 + 13, { s: fs(), w: 700, c: C.txt }); };
    no(0, 'hipotálamo'); no(1, 'hipófise'); no(2, 'tireoide');
    // TSH na hipófise e tireoide que incha
    mtx('TSH', nx(1) + 12, y1 + nh - 14, { s: 11, a: 'left', c: C.dim }); rr(nx(1) + 40, y1 + nh - 20, nw - 52, 10, 5, 'rgba(255,255,255,.08)', C.line, 1); rr(nx(1) + 40, y1 + nh - 20, Math.max(2, (nw - 52) * H), 10, 5, AZ);
    const cx = nx(2) + nw / 2, cy = y1 + nh / 2 + 8; ell(cx - 14 * G, cy, 12 * G, 10 * G, 0, '#C9806B', '#8A4F3E', 1.4); ell(cx + 14 * G, cy, 12 * G, 10 * G, 0, '#C9806B', '#8A4F3E', 1.4); line(cx - 6, cy, cx + 6, cy, '#8A4F3E', 3);
    if (G > 1.5) mtx('bócio', cx, y1 + nh - 6, { s: 11, c: AMB });
    // estímulos
    arrow(nx(0) + nw + 3, y1 + nh / 2, nx(1) - 4, y1 + nh / 2, C.ok, 2.5); arrow(nx(1) + nw + 3, y1 + nh / 2, nx(2) - 4, y1 + nh / 2, C.ok, 1 + 3.5 * H);
    mtx('estimula', nx(0) + nw + gap / 2, y1 + nh / 2 - 12, { s: 11, c: C.ok });
    // sangue e freio
    rr(x0, by, 3 * nw + 2 * gap, bh, 8, 'rgba(240,96,93,.16)', C.sangue, 1.3); rr(x0 + 2, by + 2, Math.max(4, (3 * nw + 2 * gap - 4) * T), bh - 4, 6, rgba(AMB, .55));
    mtx(`T3 e T4 no sangue: ${T > .75 ? 'altos' : T < .3 ? 'baixos' : 'normais'}`, x0 + 10, by + bh / 2, { s: fs(), a: 'left', w: 700, c: C.txt });
    arrow(nx(2) + nw / 2, y1 + nh + 2, nx(2) + nw / 2, by - 2, AMB, 2.5);
    const fr_ = rgba(C.erro, .25 + .75 * T); [0, 1].forEach(i => inib(nx(i) + nw / 2, by - 2, nx(i) + nw / 2, y1 + nh + 4, T < .3 ? rgba(C.erro, .3) : fr_, .8 + 4 * T, T < .3 ? [4, 4] : null));
    mtx('freia', nx(0) + nw / 2 + 24, (by + y1 + nh) / 2, { s: 11, a: 'left', c: C.erro });
    const cy0 = by + bh + 14, bw = (A.w - 3 * 8) / 4, rows = NAR ? 2 : 1, cols = NAR ? 2 : 4, bw2 = NAR ? (A.w - 8) / 2 : bw;
    [['n', 'equilíbrio'], ['i', 'dieta sem iodo'], ['e', 'tomar hormônio de fora'], ['m', 'tumor que produz TSH']].forEach(([k, s], i) => btn(A.x0 + (i % cols) * (bw2 + 8), cy0 + Math.floor(i / cols) * 40, bw2, 34, s, AMB, 'c' + k, { on: S.c === k }));
    cap(S.c === 'n' ? c[0] + ' Escolha uma condição.' : c[0] + ' O efeito do hormônio freia quem o mandou fazer: retroalimentação negativa.');
  }
  def('endocrino', 'glandulas', {
    t: 'Glândulas, hormônios e o termostato do corpo', s: 'mensagens lentas pelo sangue, freadas pelo próprio efeito', c: '#C58BE8',
    loc: S => S.modo === 'termo' ? 'Termostato da tireoide' : 'Glândulas endócrinas', locNota: () => NOTA, still: 9,
    alt: 'contorno esquemático do corpo com as glândulas endócrinas e seus hormônios, e um circuito hipotálamo, hipófise e tireoide em que o aluno vê a retroalimentação negativa com dieta sem iodo, hormônio de fora ou tumor.',
    extra: [modo('gland', 'Glândulas e alvos'), modo('termo', 'Termostato da tireoide'), { t: 'Ovários ou testículos', on: S => { S.sx = S.sx ? 0 : 1; S.sel = null; }, pressed: S => !!S.sx }],
    ctl: false,
    init(S) { S.modo = 'gland'; S.sel = null; S.sx = 0; S.c = 'n'; S.msg = null; },
    d: TXT.E1.d + '<p>Toque nas glândulas para ver onde agem. Em "Termostato da tireoide", mude a condição e acompanhe o TSH.</p>', enem: TXT.E1.enem,
    links: [['Relembre: proteínas e lipídios (hormônios peptídicos e esteroides)', '../biomoleculas/index.html']],
    tap(x, y, S) { const h = hid(x, y); if (!h) return; if (h[0] === 'g') S.sel = S.sel === +h.slice(1) ? null : +h.slice(1); else if (h[0] === 'c') S.c = h[1]; },
    draw(t, S) { const A = area(); if (S.modo === 'termo') drawTh(t, S, A); else drawGl(t, S, A); }
  });

  // ---------- E2: glicemia, insulina e glucagon ----------
  const MEAL = [[.12, 'café'], [.4, 'almoço'], [.78, 'jantar']], EXE = .58;
  const gdia = u => .5 + .1 * MEAL.reduce((s, m) => s + bump(u - m[0], .045), 0) - .09 * bump(u - EXE, .05) - (u > .88 ? .02 * (u - .88) / .12 : 0);
  function drawDia(t, S, A) {
    const cw = A.w - 16, cx0 = A.x0 + 8, cy0 = A.y0 + 8, ch = NAR ? A.h * .3 : A.h * .36, yg = g => cy0 + ch * (1 - (g - .3) / .4);
    const auto = S.cuT && performance.now() - S.cuT < 5000, u = auto ? S.cu : fr(t / 18), g = gdia(u);
    panel(cx0 - 4, cy0 - 6, cw + 8, ch + 36);
    rr(cx0, yg(.64), cw, yg(.36) - yg(.64), 4, rgba(C.ok, .12)); mtx('faixa normal', cx0 + 6, yg(.64) + 9, { s: 11, a: 'left', c: C.ok });
    const ev = [[.12, 'café'], [.4, 'almoço'], [EXE, 'exercício'], [.78, 'jantar'], [.92, 'sono']];
    ev.forEach(([p, s]) => { line(cx0 + p * cw, cy0, cx0 + p * cw, cy0 + ch, rgba('#9DA9C4', .25), 1, [3, 4]); mtx(s, cx0 + p * cw, cy0 + ch + 14, { s: NAR ? 10 : 12, c: C.dim }); });
    const pts = []; for (let i = 0; i <= 120; i++) pts.push([cx0 + i / 120 * cw, yg(gdia(i / 120))]);
    poly(pts, rgba(GLC, .3), 2); poly(pts.filter((p, i) => i / 120 <= u), GLC, 2.6);
    circ(cx0 + u * cw, yg(g), 5, AMB, '#fff', 1.5); hitR(cx0, cy0, cw, ch, 'ch');
    mtx('glicemia ao longo do dia', cx0 + cw - 4, cy0 + 10, { s: 11, a: 'right', c: GLC });
    // órgãos
    const ins = g > .52, glu = g < .48, yv = cy0 + ch + 56, yo = yv + (NAR ? 62 : 72), W3 = cw / 6, xp = cx0 + W3, xm = cx0 + 3 * W3, xl = cx0 + 5 * W3;
    rr(cx0, yv - 6, cw, 12, 6, 'rgba(240,96,93,.2)', C.sangue, 1.2); mtx('sangue', cx0 + 6, yv - 14, { s: 11, a: 'left', c: C.dim });
    for (let i = 0; i < 12; i++) circ(cx0 + fr(t * .06 + i / 12) * cw, yv, 3, GLC);
    ell(xp, yo, 36, 14, 0, 'rgba(229,165,107,.2)', '#E5A56B', 1.5); [-18, -4, 10, 22].forEach((d, i) => circ(xp + d, yo + (i % 2 ? 3 : -3), 3.6, i % 2 ? LIL : AMB, GUT, 1));
    mtx('pâncreas', xp, yo + 28, { s: fs(), c: C.txt }); mtx('ilhotas: beta (âmbar), alfa (lilás)', xp, yo + 42, { s: 10, c: C.dim });
    const open = ins ? 1 : .12, mw = NAR ? 100 : 128, mh = 44;
    rr(xm - mw / 2, yo - mh / 2, mw, mh, 8, 'rgba(229,100,107,.18)', '#E5646B', 1.5); mtx('músculo', xm, yo + mh / 2 + 14, { s: fs(), c: C.txt });
    [-.3, 0, .3].forEach(k => { const dx = xm + k * mw, gw = 3 + 9 * open; line(dx - gw / 2, yo - mh / 2, dx + gw / 2, yo - mh / 2, GUT, 4); });
    ell(xl, yo, 44, 22, 0, 'rgba(155,107,70,.3)', '#C08A5A', 1.5); for (let i = 0; i < 7; i++) circ(xl - 24 + (i % 4) * 16, yo - 6 + Math.floor(i / 4) * 12, 2.4, rgba(GLC, .5 + .4 * (1 - (glu ? fr(t * .3 + i / 7) : 0))));
    mtx('fígado (glicogênio)', xl, yo + 34, { s: fs(), c: C.txt });
    for (let i = 0; i < 6; i++) {
      const p = fr(t * .35 + i / 6);
      if (ins) { circ(lerp(xp + 36, xm - mw / 2 + 4, p), yo + Math.sin(p * 6 + i) * 4, 3.4, AMB, null); const gx = xm + ((i % 3) - 1) * .3 * mw; circ(gx, lerp(yv, yo - mh / 2 + 8, p), 3, GLC); }
      if (glu) { const x = lerp(xp + 20, xl - 30, p), y = yo + 24 * Math.sin(p * PI) + 6; circ(x, y, 3.4, LIL, null); circ(xl - 20 + (i % 4) * 14, lerp(yo - 10, yv, p), 3, GLC); }
    }
    mtx(ins ? 'insulina (âmbar): as portas se abrem e a glicose entra' : glu ? 'glucagon (lilás): o fígado solta glicose' : 'glicemia dentro da faixa: os dois hormônios em equilíbrio', A.cx, A.y1 - 4, { s: fs(), c: ins ? AMB : glu ? LIL : C.dim });
    cap(S.msg || 'Toque no gráfico para escolher a hora. Acima da média, a insulina baixa a glicemia; abaixo (jejum, exercício), o glucagon a sobe.');
  }
  const PS = [{ h: .2, tau: .1, ih: .5, it: .11, open: 1 }, { h: .5, tau: .42, ih: .03, it: .11, open: 1 }, { h: .34, tau: .22, ih: .8, it: .18, open: .35 }];
  const LIM = .62;
  function pars(S) {
    const p = Object.assign({}, PS[S.p]);
    if (S.p === 1 && S.ap) Object.assign(p, { h: .22, tau: .12, ih: .5, it: .11 });
    if (S.p === 2) { if (S.cam) { p.h -= .07; p.tau -= .05; p.open = .65; } if (S.mai) { p.h -= .08; p.tau -= .03; } }
    return p;
  }
  const Gf = (p, u) => .32 + p.h * bump(u - .12, p.tau), If = (p, u) => .08 + p.ih * bump(u - .14, p.it);
  function drawPes(t, S, A) {
    const p = pars(S), u = cl((t - S.t0) / 10, 0, 1), wide = !NAR, tabH = 34, bh = 36;
    ['sem diabetes', 'tipo 1', 'tipo 2'].forEach((s, i) => btn(A.x0 + i * (A.w / 3), A.y0, A.w / 3 - 6, tabH, s, AZ, 't' + i, { on: S.p === i }));
    const acts = [['m', 'dar a refeição'], ...(S.p === 1 ? [['a', 'aplicar insulina']] : []), ...(S.p === 2 ? [['k', 'caminhada'], ['s', 'menos açúcar']] : []), ['u', 'glicose na urina']];
    const nb = acts.length, bw = (A.w - (nb - 1) * 6) / nb, by = A.y1 - bh;
    acts.forEach(([k, s], i) => btn(A.x0 + i * (bw + 6), by, bw, bh, s, k === 'm' ? C.ok : AMB, 'a' + k, { on: k === 'a' ? S.ap : k === 'k' ? S.cam : k === 's' ? S.mai : k === 'u' ? S.ur : false }));
    const top = A.y0 + tabH + 10, hh = by - top - 8, cw = wide ? A.w * .6 : A.w, chh = wide ? hh : hh * .55;
    panel(A.x0, top, cw, chh); const gx = A.x0 + 10, gw = cw - 20, gy = top + 14, gh = chh - 36, y = v => gy + gh * (1 - v);
    rr(gx, y(.5), gw, y(.3) - y(.5), 3, rgba(C.ok, .12)); mtx('faixa normal', gx + 4, y(.4), { s: 10, a: 'left', c: C.ok });
    line(gx, y(LIM), gx + gw, y(LIM), rgba(C.erro, .7), 1.2, [5, 4]); mtx('limite do rim', gx + gw - 2, y(LIM) - 7, { s: 10, a: 'right', c: C.erro });
    const cur = f => { const q = []; for (let i = 0; i <= 100; i++) q.push([gx + i / 100 * gw, y(f(i / 100))]); return q; };
    const cg = cur(v => Gf(p, v)), ci = cur(v => If(p, v));
    poly(cg, rgba(GLC, .28), 2); poly(ci, rgba(AMB, .28), 2); poly(cg.filter((q, i) => i / 100 <= u), GLC, 2.8); poly(ci.filter((q, i) => i / 100 <= u), AMB, 2.8);
    circ(gx + u * gw, y(Gf(p, u)), 4, GLC, '#fff', 1.2); circ(gx + u * gw, y(If(p, u)), 4, AMB, '#fff', 1.2);
    mtx('glicose', gx + 4, gy + 4, { s: 11, a: 'left', c: GLC }); mtx('insulina', gx + 60, gy + 4, { s: 11, a: 'left', c: AMB }); mtx('tempo depois da refeição', gx + gw, y(0) + 11, { s: 10, a: 'right', c: C.dim });
    // célula com portas
    const qx = wide ? A.x0 + cw + 12 : A.x0, qy = wide ? top : top + chh + 8, qw = wide ? A.w - cw - 12 : A.w, qh = hh - (wide ? 0 : chh + 8);
    panel(qx, qy, qw, qh); const op = p.open * cl((If(p, u) - .08) / .4, 0, 1), cwid = Math.min(qw * .5, 150), ccx = qx + qw - cwid / 2 - 14, cyy = qy + qh * .5 - (S.ur ? 0 : 0);
    const ch2 = Math.min(qh - 40, 64); rr(ccx - cwid / 2, cyy - ch2 / 2, cwid, ch2, 10, 'rgba(229,100,107,.18)', '#E5646B', 1.5); mtx('célula do músculo', ccx, cyy - ch2 / 2 - 8, { s: 10, c: C.dim });
    [-.3, .3].forEach(k => line(ccx - cwid / 2, cyy + k * ch2, ccx - cwid / 2, cyy + k * ch2 + 3 + 11 * (1 - op) * 0, rgba(GUT, 1), 5));
    [-.3, .3].forEach(k => { const gw2 = 3 + 14 * op; line(ccx - cwid / 2, cyy + k * ch2 - gw2 / 2, ccx - cwid / 2, cyy + k * ch2 + gw2 / 2, GUT, 5); });
    const G = Gf(p, u), nb2 = Math.round(4 + (G - .3) * 24);
    for (let i = 0; i < nb2; i++) { const f = fr(t * .3 + i * .137), k = (i % 2 ? .3 : -.3) * ch2, x0 = qx + 12 + (i * 37 % 40), ent = i % 4 < Math.round(op * 4); circ(ent ? lerp(ccx - cwid / 2 - 40 + x0 - qx - 12, ccx, f) : x0 + Math.min(1, f) * (ccx - cwid / 2 - 16 - x0) * .9, cyy + k * (ent ? 1 : (f - .5)), 3, GLC); }
    mtx(op < .3 ? 'portas quase fechadas' : op < .8 ? 'portas abrem pouco' : 'portas abertas', ccx - cwid / 2 - 4, cyy + ch2 / 2 + 14, { s: 11, a: 'left', c: op < .3 ? C.erro : C.ok });
    if (S.ur) {
      const over = Gf(p, u) > LIM || (Gf(p, 1) > LIM && u > .1 && Gf(p, Math.min(1, u)) > LIM - .02), ky = qy + 14;
      ell(qx + 40, qy + qh - 30, 26, 14, .3, 'rgba(229,100,107,.18)', '#E5646B', 1.4); mtx('rim', qx + 40, qy + qh - 30, { s: 11, c: C.dim });
      if (over) for (let i = 0; i < 4; i++) circ(qx + 72 + fr(t * .4 + i / 4) * 50, qy + qh - 30 + 6, 3, GLC);
      mtx(over ? 'glicose na urina: passou do limite' : 'sem glicose na urina', qx + 74, qy + qh - 50, { s: 11, a: 'left', c: over ? C.erro : C.ok });
    }
    const m = [['Sem diabetes: a insulina sobe junto, as portas abrem e a glicemia volta à faixa.', 'Tipo 1: quase não há insulina. A glicose fica alta e demora a cair. A insulina injetada traz a curva de volta.', 'Tipo 2: a insulina sobe até mais que o normal, mas as células respondem mal. Caminhada e menos açúcar aproximam a curva da faixa.'][S.p]];
    cap(m + '<br>' + EDU);
  }
  def('endocrino', 'glicemia', {
    t: 'Insulina, glucagon e diabetes', s: 'dois hormônios opostos seguram o açúcar do sangue', c: '#C58BE8',
    loc: S => S.modo === 'pes' ? 'Três pessoas, uma refeição' : 'A glicemia ao longo do dia', locNota: S => S.modo === 'pes' ? EDU : NOTA, still: 4,
    alt: 'um dia de glicemia dentro de uma faixa, com insulina abrindo as portas do músculo e glucagon fazendo o fígado soltar glicose; e três abas (sem diabetes, tipo 1 e tipo 2) que mostram as curvas de glicose e de insulina depois de uma refeição.',
    extra: [modo('dia', 'Um dia de glicemia'), modo('pes', 'Três pessoas, uma refeição')], ctl: false,
    init(S) { S.modo = 'dia'; S.p = 0; S.ap = S.cam = S.mai = S.ur = false; S.t0 = 0; S.msg = null; S.cu = 0; S.cuT = 0; },
    d: TXT.E2.d + '<p>No gráfico do dia, toque numa hora. Em "Três pessoas, uma refeição", compare as curvas.</p>', enem: TXT.E2.enem,
    links: [['Relembre: proteínas (a insulina é uma proteína)', '../biomoleculas/index.html']],
    tap(x, y, S) {
      const h = hid(x, y); if (!h) return;
      if (h === 'ch') { const A = area(); S.cu = cl((x - A.x0 - 8) / (A.w - 16), 0, 1); S.cuT = performance.now(); }
      else if (h[0] === 't') { S.p = +h[1]; S.ap = S.cam = S.mai = false; S.t0 = S.ph; }
      else if (h === 'am') S.t0 = S.ph; else if (h === 'aa') { S.ap = !S.ap; S.t0 = S.ph; } else if (h === 'ak') { S.cam = !S.cam; S.t0 = S.ph; } else if (h === 'as') { S.mai = !S.mai; S.t0 = S.ph; } else if (h === 'au') S.ur = !S.ur;
    },
    draw(t, S) { const A = area(); if (S.modo === 'pes') drawPes(t, S, A); else drawDia(t, S, A); }
  });

  // ---------- N1: central, periférico e arco reflexo ----------
  const ENC = [
    { n: 'cérebro', d: 'pensamento, memória, linguagem, movimentos voluntários e interpretação dos sentidos, cada função numa região do córtex.' },
    { n: 'cerebelo', d: 'equilíbrio e coordenação dos movimentos (é dos primeiros a falhar com o álcool).' },
    { n: 'tronco encefálico', d: 'funções vitais, como a respiração e os batimentos (o bulbo faz parte dele).' }
  ];
  function drawSis(t, S, A) {
    const bh = NAR ? Math.min(A.h * .5, 230) : Math.min(A.h * .95, 400), u = bh / 10, bx = NAR ? A.x0 + A.w * .3 : A.x0 + Math.min(A.w * .22, 150) + 20, by = A.y0 + bh / 2 + 4;
    const cor = S.hl == null ? t > 1.5 : true, hc = k => S.hl == null || S.hl === k ? 1 : .22, CN = AZ, PN = AMB;
    corpo(bx, by, bh, '#9DA9C4', .8);
    const col = (k, base) => cor ? rgba(k === 'c' ? CN : PN, hc(k)) : rgba('#E8EDF7', .75);
    const sp = (x, y) => [bx + x * u, by + y * u];
    for (let k = 0; k < 7; k++) { const yy = -2.8 + k * .55, [x1, y1] = sp(0, yy); [-1, 1].forEach(sd => { const [x2, y2] = sp(sd * 1.15, yy + .15); line(x1, y1, x2, y2, col('p'), 1.4); }); }
    [-1, 1].forEach(sd => { const q = [sp(sd * 1.15, -2.6), sp(sd * 1.9, -1.2), sp(sd * 2.05, .6)]; poly(q, col('p'), 1.4); poly([sp(0, .5), sp(sd * .7, 1.8), sp(sd * .65, 4.8)], col('p'), 1.4); });
    line(...sp(0, -3.2), ...sp(0, .9), col('c'), 4.5); ell(bx, by - 4.15 * u, .62 * u, .55 * u, 0, cor ? rgba(CN, .55 * hc('c')) : 'rgba(232,237,247,.4)', col('c'), 1.6);
    mtx('encéfalo e medula espinal', bx + 3.3 * u, by - 3.4 * u, { s: 11, a: 'left', c: cor ? CN : C.dim }); line(bx + .7 * u, by - 4 * u, bx + 3.2 * u, by - 3.4 * u, rgba(CN, .5), 1);
    mtx('nervos e gânglios', bx + 3.3 * u, by + .1 * u, { s: 11, a: 'left', c: cor ? PN : C.dim }); line(bx + 2.05 * u, by - .3 * u, bx + 3.2 * u, by + .1 * u, rgba(PN, .5), 1);
    chip(S, 'k', 'c', 'Sistema nervoso central', A.x0, A.y1 - 34, NAR ? A.w / 2 - 4 : 190, 32, S.hl === 'c', CN); chip(S, 'k', 'p', 'Sistema nervoso periférico', A.x0 + (NAR ? A.w / 2 + 4 : 200), A.y1 - 34, NAR ? A.w / 2 - 4 : 200, 32, S.hl === 'p', PN);
    // encéfalo
    const px = NAR ? A.x0 : bx + 3.3 * u + 130, py = NAR ? by + bh / 2 + 4 : A.y0, pw = A.x1 - px, ph = A.y1 - 44 - py; if (pw < 140 || ph < 100) return;
    panel(px, py, pw, ph); const sel = S.pt != null ? S.pt : Math.floor(t / 3.5) % 3, R = Math.min(ph * (NAR ? .2 : .3), pw * .2, 56), ox = NAR ? px + pw / 2 - R * .4 : px + R * 1.7, oy = NAR ? py + ph - R * 1.5 - 2 : py + ph * .45, on = i => sel === i;
    ell(ox, oy - R * .15, R * 1.25, R * .85, 0, on(0) ? rgba(AMB, .25) : 'rgba(124,196,255,.14)', on(0) ? AMB : CN, on(0) ? 2.4 : 1.4);
    for (let i = 0; i < 3; i++) { X.beginPath(); X.ellipse(ox - R * .1 + (i - 1) * R * .5, oy - R * .3, R * .22, R * .32, 0, PI, TAU); X.strokeStyle = rgba(CN, .6); X.lineWidth = 1.2; X.stroke(); }
    ell(ox + R * .85, oy + R * .78, R * .5, R * .32, 0, on(1) ? rgba(AMB, .25) : 'rgba(124,196,255,.14)', on(1) ? AMB : CN, on(1) ? 2.4 : 1.4);
    rr(ox - R * .12, oy + R * .4, R * .3, R * .9, R * .1, on(2) ? rgba(AMB, .25) : 'rgba(124,196,255,.14)', on(2) ? AMB : CN, on(2) ? 2.4 : 1.4);
    hitC(ox, oy - R * .15, R, 'e0'); hitC(ox + R * .85, oy + R * .78, R * .45, 'e1'); hitC(ox, oy + R * .85, R * .4, 'e2');
    mtx(`<b>${ENC[sel].n}</b>`, NAR ? px + 10 : ox + R * 1.5 + 12, py + 18, { s: NAR ? 13 : 15, a: 'left', c: AMB });
    wrapTx(ENC[sel].d, NAR ? px + 10 : ox + R * 1.5 + 12, py + 40, NAR ? pw - 20 : pw - R * 3 - 40, { s: fs(), lh: fs() + 3, a: 'left', c: C.txt });
    cap('Toque em "central" ou "periférico" para separar as duas partes, e nas partes do encéfalo para ver a função.');
  }
  const PECAS = ['receptor', 'neurônio sensitivo', 'medula espinal', 'neurônio motor', 'músculo (efetor)'];
  const PRED = ['sente e chuta', 'sente, mas não chuta', 'chuta, mas não sente', 'nem sente nem chuta'];
  function place(S, i, h) {
    if (h == null || h[0] !== 's') return; const k = +h.slice(1); if (S.put[k]) return;
    if (k === i) { S.put[k] = true; S.sel = null; S.msg = '<b>Certo.</b> ' + PECAS[i] + ' no lugar.'; if (S.put.every(Boolean)) S.msg = '<b>Arco montado.</b> Aperte o martelinho. Receptor, neurônio sensitivo, medula, neurônio motor, efetor.'; }
    else { flash(S, 's', k); S.msg = '<b>Ainda não.</b> Pense no caminho: do receptor até a medula, e da medula até o músculo.'; }
  }
  const dragN1 = mkdrag('p', place);
  function drawArco(t, S, A) {
    const xs = [.09, .3, .5, .7, .91].map(f => A.x0 + A.w * f), ym = A.y0 + (NAR ? 120 : 130), all = S.put.every(Boolean), r = NAR ? 17 : 21;
    const tt = S.hm == null ? -1 : t - S.hm, les = S.les, run = tt >= 0;
    // cérebro e balão
    circ(xs[2], A.y0 + 28, 22, 'rgba(124,196,255,.15)', AZ, 1.6); mtx('cérebro', xs[2], A.y0 + 28, { s: 11, c: C.txt });
    // encaixes
    const sh = [[xs[0], r, 'c'], [xs[1], r, 'p'], [xs[2], r + 4, 'r'], [xs[3], r, 'p'], [xs[4], r + 2, 'r']];
    if (all) { poly([[xs[0], ym], [xs[1], ym], [xs[2], ym]], rgba(AZ, .9), 3); poly([[xs[2], ym], [xs[3], ym], [xs[4], ym]], rgba(AMB, .9), 3); poly([[xs[2], ym - r - 4], [xs[2], A.y0 + 50]], rgba(AZ, .5), 2, [4, 4]); }
    sh.forEach(([x, rr_, k], i) => {
      const ok = S.put[i], fl = isfl(S, 's', i), c = ok ? C.ok : fl ? C.erro : C.line;
      if (k === 'r') rr(x - rr_, ym - rr_, rr_ * 2, rr_ * 2, 8, ok ? rgba(C.ok, .2) : 'rgba(19,26,43,.6)', c, ok ? 2 : 1.4); else circ(x, ym, rr_, ok ? rgba(C.ok, .2) : 'rgba(19,26,43,.6)', c, ok ? 2 : 1.4);
      if (!ok) X.setLineDash([4, 4]); hitR(x - rr_ - 6, ym - rr_ - 6, rr_ * 2 + 12, rr_ * 2 + 12, 's' + i); X.setLineDash([]);
      mtx(ok ? ['receptor', 'sensitivo', 'medula', 'motor', 'músculo'][i] : '?', x, ym, { s: ok ? 11 : 13, w: 600, c: ok ? C.txt : C.dim });
    });
    // perna
    const kx = A.x1 - (NAR ? 70 : 110), ky = ym + (NAR ? 80 : 90), ang = run && !(les) ? Math.sin(PI * seg(tt, 1.4, 2.5)) * .9 : 0, th = 62 * (NAR ? .8 : 1);
    rr(kx - th, ky - 9, th, 18, 8, 'rgba(229,100,107,.2)', '#E5646B', 1.5); mtx('coxa', kx - th / 2, ky, { s: 10, c: C.dim });
    X.save(); X.translate(kx, ky); X.rotate(Math.PI / 2 - ang); rr(-8, -9, th * 1.15, 18, 8, 'rgba(155,168,196,.18)', '#9DA9C4', 1.5); X.restore(); circ(kx, ky, 5, '#9DA9C4', GUT, 1);
    if (all) { if (run) { const pp = tt < 1.4 ? (les === 1 ? Math.min(tt, .35) : tt) / 1.4 * 4 : 4; } }
    // pulsos
    const pt = f => { const i = Math.min(3, Math.floor(f)), q = f - i; return [lerp(xs[i], xs[i + 1], q), ym]; };
    if (run && all) {
      const lim = les === 1 ? 1.5 : les === 2 ? 3.5 : 4, f1 = Math.min(lim, tt / .35); if (tt < 1.9) { const [x, y] = pt(Math.min(f1, 4)); if (f1 < 4 || tt < 1.5) circ(x, y, 6, AZ, '#fff', 1.5); }
      if (les) { const [x, y] = pt(lim); mtx('x', x, y - 18, { s: 16, w: 700, c: C.erro }); }
      if (les !== 1 && tt > .7) { const f = cl((tt - .7) / 1.6, 0, 1); circ(xs[2], lerp(ym - r - 4, A.y0 + 50, f), 5, AZ, '#fff', 1); if (f >= 1 && tt < 4.5) { const bx = xs[2] + 36, by = A.y0 + 22, w = 110; rr(bx, by - 14, w, 28, 10, 'rgba(232,237,247,.95)', GUT, 1); mtx('senti a batida', bx + w / 2, by, { s: 12, w: 600, c: GUT, bg: false }); } }
    }
    mtx('o sinal sobe ao cérebro mais devagar e chega depois', xs[2], ym - r - 30, { s: 11, c: C.dim, bg: false });
    // linha de baixo
    const y2 = A.y1 - (NAR ? 40 : 44);
    if (!all) {
      const left = [0, 1, 2, 3, 4].filter(i => !S.put[i]), cols = NAR ? 3 : 5, cw = (A.w - (cols - 1) * 6) / cols;
      mtx('Toque numa peça e depois no encaixe certo (ou arraste)', A.x0, y2 - (NAR ? 46 : 8) - 2, { s: 12, a: 'left', c: C.dim });
      left.forEach((i, j) => { const pr = S.dr && S.dr.i === i, x = A.x0 + (j % cols) * (cw + 6), y = y2 + Math.floor(j / cols) * 38 - (NAR ? 30 : 0); rr(x, y, cw, 34, 8, S.sel === i ? rgba(AMB, .25) : 'rgba(19,26,43,.94)', S.sel === i ? AMB : C.line, S.sel === i ? 2.2 : 1.3); mtx(PECAS[i], x + cw / 2, y + 17, { s: fs(), w: 600, c: C.txt }); if (!pr) hitR(x, y, cw, 34, 'p' + i); });
    } else if (les && !S.rev) {
      mtx('Antes de ver: o que acontece com a lesão?', A.x0, y2 - 22, { s: 13, a: 'left', w: 700, c: AMB });
      PRED.forEach((s, i) => { const cw = (A.w - 18) / 4; chip(S, 'o', i, s, A.x0 + i * (cw + 6), y2 - 8, cw, 40, false, AMB); });
    } else {
      const bw = (A.w - 18) / 4; [['h', 'martelinho'], ['1', 'lesão no neurônio sensitivo'], ['2', 'lesão no neurônio motor'], ['z', 'refazer']].forEach(([k, s], i) => btn(A.x0 + i * (bw + 6), y2 - 4, bw, 38, s, k === 'h' ? C.ok : AMB, 'b' + k, { on: k === '1' ? les === 1 : k === '2' ? les === 2 : false, s: NAR ? 11 : 13 }));
    }
    if (S.dr) { rr(S.dr.x - 50, S.dr.y - 17, 100, 34, 8, rgba(AMB, .3), AMB, 2); mtx(PECAS[S.dr.i], S.dr.x, S.dr.y, { s: 12, w: 600, c: C.txt }); }
    cap(S.msg || 'Monte o arco reflexo: receptor, neurônio sensitivo, medula, neurônio motor e músculo.');
  }
  // sentidos: olho, orelha, pele
  function drawOlho(t, S, X0, Y0, w, h) {
    const L = Math.min(w * .42, 190), ecx = X0 + w * .62, ecy = Y0 + h * .42, ry = L * .42, rx = L / 2, retX = ecx + rx, lx = ecx - rx * .62;
    ell(ecx, ecy, rx, ry, 0, 'rgba(232,237,247,.06)', '#9DA9C4', 1.8); X.beginPath(); X.ellipse(ecx, ecy, rx, ry, 0, -1, 1); X.strokeStyle = LIL; X.lineWidth = 4; X.stroke();
    mtx('retina', retX + 4, ecy - ry * .45, { s: 11, a: 'left', c: LIL }); ell(lx, ecy, 5, 17, 0, 'rgba(124,196,255,.4)', AZ, 1.4); mtx('lente', lx, ecy - 26, { s: 11, c: C.dim });
    const tp = S.vt, dx = tp === 0 ? 0 : tp === 1 ? -30 : 36, cor = S.corr && tp !== 0, fx = retX + dx * (cor ? 0 : 1), xs = ecx - rx - 90, xc = ecx - rx - 34;
    if (cor) { if (tp === 1) { X.beginPath(); X.moveTo(xc - 4, ecy - 22); X.quadraticCurveTo(xc + 3, ecy, xc - 4, ecy + 22); X.moveTo(xc + 4, ecy - 22); X.quadraticCurveTo(xc - 3, ecy, xc + 4, ecy + 22); X.strokeStyle = C.ok; X.lineWidth = 2; X.stroke(); } else ell(xc, ecy, 5, 22, 0, 'rgba(107,203,119,.3)', C.ok, 1.6); mtx(tp === 1 ? 'lente divergente' : 'lente convergente', xc, ecy + 36, { s: 11, c: C.ok }); }
    [-15, 0, 15].forEach(yh => {
      const yl = cor ? yh * (tp === 1 ? 1.35 : .7) : yh, pts = [[xs, ecy + yh]]; if (cor) pts.push([xc, ecy + yh]); pts.push([lx, ecy + yl]);
      const tr = (retX - lx) / (fx - lx); pts.push([retX, ecy + yl * (1 - tr)]); poly(pts, AMB, 1.8);
      if (tr < 1) { poly([[retX, ecy + yl * (1 - tr)], [fx, ecy]], rgba(AMB, .45), 1.2, [3, 3]); }
    });
    circ(Math.min(fx, retX + 0), ecy, 3.5, C.txt); if (!cor && tp) mtx(tp === 1 ? 'foco antes da retina' : 'foco depois da retina', fx, ecy + ry + 16, { s: 12, c: C.erro });
    if (cor || !tp) mtx('foco na retina', retX, ecy + ry + 16, { s: 12, c: C.ok });
    ['normal', 'miopia', 'hipermetropia'].forEach((s, i) => btn(X0 + i * (w / 3.1), Y0 + h - 78, w / 3.1 - 6, 34, s, AZ, 'v' + i, { on: tp === i })); btn(X0, Y0 + h - 38, w, 34, S.corr ? 'tirar a lente corretora' : 'pôr a lente corretora', C.ok, 'vc', { on: S.corr });
    wrapTx('<b>Cones</b>: cores e detalhes com luz forte. <b>Bastonetes</b>: pouca luz, preto e branco; os dois usam pigmentos feitos com vitamina A, e a falta dela causa cegueira noturna.', X0, Y0 + 12, w * .45, { s: fs(), lh: fs() + 3, a: 'left', c: C.txt });
  }
  function drawOrelha(t, S, X0, Y0, w, h) {
    const cx = X0 + 20, cy = Y0 + h * .4, tw = w * .3;
    mtx('canal da orelha', cx + tw / 2, cy - 32, { s: 11, c: C.dim }); rr(cx, cy - 14, tw, 28, 4, 'rgba(232,237,247,.05)', '#9DA9C4', 1.4); line(cx + tw, cy - 18, cx + tw, cy + 18, AMB, 3); mtx('tímpano', cx + tw, cy + 32, { s: 11, c: AMB });
    for (let i = 0; i < 3; i++) { const f = fr(t * .5 - i * .12), a = Math.sin(f * PI); if (f < .85) { X.beginPath(); X.arc(cx + f * tw * 1.05, cy, 8 + i * 5, -.9, .9); X.strokeStyle = rgba(AZ, .8 * a); X.lineWidth = 2; X.stroke(); } }
    const ox = cx + tw + 30; [0, 1, 2].forEach(i => rr(ox + i * 14, cy - 5, 11, 10, 3, '#C9B38A', '#8A6A3B', 1)); mtx('ossículos', ox + 18, cy - 20, { s: 11, c: C.dim });
    const sx = ox + 66, sy = cy + 4, pts = []; for (let i = 0; i <= 60; i++) { const a = i / 60 * 5.2 + .3, r = 30 - i / 60 * 24; pts.push([sx + Math.cos(a) * r, sy + Math.sin(a) * r * .9]); }
    poly(pts, S.oc === 0 ? AMB : rgba(AZ, .9), 3.5); const pl = cl(fr(t * .35), 0, 1); circ(...pts[Math.floor(pl * 60)], 3.5, '#fff'); mtx('cóclea', sx, sy + 44, { s: 12, w: 600, c: S.oc === 0 ? AMB : C.txt }); hitC(sx, sy, 34, 'o0');
    const qx = sx + 90, qy = sy - 14; [[0, 0, 0], [14, 8, 1.2], [-6, 20, 2.3]].forEach(([dx, dy, rot], i) => ell(qx + dx, qy + dy, 18, 7, rot, 'rgba(111,177,232,.1)', S.oc === 1 ? AMB : '#6FB1E8', 2));
    mtx('canais semicirculares', qx + 8, qy + 56, { s: 12, w: 600, c: S.oc === 1 ? AMB : C.txt }); hitC(qx + 8, qy + 12, 32, 'o1');
    wrapTx(S.oc === 1 ? 'Os <b>canais semicirculares</b> informam a posição da cabeça: equilíbrio.' : 'A <b>cóclea</b> transforma a vibração do som em impulso nervoso: audição.', X0, Y0 + h - 42, w, { s: fs(), lh: fs() + 3, a: 'left', c: C.txt });
  }
  function drawPele(t, S, X0, Y0, w, h) {
    const sy = Y0 + 20, ep = 30, de = 70, hy = sy + ep + de, rw = w * .6;
    rr(X0, sy, rw, ep, 4, 'rgba(242,201,76,.28)', '#C9B38A', 1.2); rr(X0, sy + ep, rw, de, 0, 'rgba(229,100,107,.18)', '#C07B80', 1.2); rr(X0, hy, rw, 46, 0, 'rgba(255,230,160,.18)', '#C9B38A', 1.2);
    mtx('epiderme', X0 + rw + 8, sy + ep / 2, { s: 11, a: 'left', c: C.dim }); mtx('derme', X0 + rw + 8, sy + ep + de / 2, { s: 11, a: 'left', c: C.dim }); mtx('hipoderme', X0 + rw + 8, hy + 23, { s: 11, a: 'left', c: C.dim });
    const R = [['tato', .15, sy + ep + 10, 0], ['pressão', .38, hy - 10, 1], ['calor e frio', .62, sy + ep, 2], ['dor', .85, sy + 2, 3]];
    R.forEach(([n, f, y, k]) => {
      const x = X0 + f * rw, on = S.pe === k; line(x, sy - 2, x, y + 2, rgba('#F2F2F2', .7), 1.4);
      if (k === 0) ell(x, y + 4, 6, 9, 0, rgba(AZ, .7), GUT, 1); if (k === 1) { ell(x, y + 6, 13, 8, 0, null, AZ, 1.2); ell(x, y + 6, 8, 5, 0, null, AZ, 1.2); ell(x, y + 6, 3, 2, 0, AZ); }
      if (k === 2) { poly([[x, y - 4], [x - 5, y + 8], [x + 5, y + 14], [x, y + 24]], '#F28C3A', 1.6); } if (k === 3) { poly([[x, y + 2], [x - 6, y + 12], [x, y + 20]], C.erro, 1.6); poly([[x, y + 8], [x + 7, y + 16]], C.erro, 1.6); }
      circ(x, sy - 8, on ? 6 : 4, on ? AMB : '#fff', GUT, 1); mtx(n, x, sy - 22, { s: 11, w: on ? 700 : 400, c: on ? AMB : C.txt }); hitR(x - 30, sy - 30, 60, 90, 'q' + k);
    });
    wrapTx(['Receptor de <b>tato</b>: toque leve, na derme perto da superfície.', 'Receptor de <b>pressão</b>: mais fundo, responde a pressão e vibração.', 'Receptores de <b>calor e frio</b>: terminações na derme.', 'Terminações livres da <b>dor</b>: sobem até a epiderme.'][S.pe], X0, Y0 + h - 56, w, { s: fs(), lh: fs() + 3, a: 'left', c: C.txt });
  }
  function drawSen(t, S, A) {
    const nm = ['olho', 'orelha', 'pele'], tw = (A.w - 12) / 3;
    nm.forEach((s, i) => btn(A.x0 + i * (tw + 6), A.y0, tw, 34, s, AZ, 'n' + i, { on: S.sn === i }));
    const X0 = A.x0 + 6, Y0 = A.y0 + 44, w = A.w - 12, h = A.h - 46;
    if (S.sn === 0) drawOlho(t, S, X0, Y0, w, h); else if (S.sn === 1) drawOrelha(t, S, X0, Y0, w, h); else drawPele(t, S, X0, Y0, w, h);
    cap(['Escolha miopia ou hipermetropia e ponha a lente corretora para mover o foco até a retina.', 'Toque na cóclea e nos canais semicirculares.', 'Toque nos receptores para ver o que cada um sente.'][S.sn]);
  }
  def('nervoso', 'organizacao', {
    t: 'Central, periférico e o arco reflexo', s: 'o fio que leva, a central que decide e o atalho da medula', c: '#7FB2E5',
    loc: S => ({ sis: 'Central e periférico', arco: 'Monte o arco reflexo', sen: 'Os sentidos' })[S.modo] || '', locNota: () => NOTA, still: 4,
    alt: 'contorno esquemático do corpo com o sistema nervoso central e o periférico em duas cores e o encéfalo em detalhe; um arco reflexo que o aluno monta peça por peça e testa com o martelinho e lesões; e cartões dos sentidos (olho, orelha e pele).',
    extra: [modo('sis', 'Central e periférico'), modo('arco', 'Monte o arco reflexo'), modo('sen', 'Sentidos')], ctl: false,
    init(S) { S.modo = 'sis'; S.hl = null; S.pt = null; S.put = [0, 0, 0, 0, 0].map(() => false); S.sel = null; S.dr = null; S.hm = null; S.les = 0; S.rev = false; S.sn = 0; S.vt = 1; S.corr = false; S.oc = 0; S.pe = 0; S.msg = null; },
    d: TXT.N1.d + '<p>Veja o sistema, monte o arco reflexo e explore os sentidos.</p>', enem: TXT.N1.enem,
    links: [['Relembre na Histologia: o neurônio', '../histologia/index.html#nervoso/neuronio'], ['O impulso nervoso', '../histologia/index.html#nervoso/impulso'], ['A sinapse', '../histologia/index.html#nervoso/sinapse']],
    tap(x, y, S) {
      const h = hid(x, y); if (!h) return;
      if (S.modo === 'sis') { if (h[0] === 'k') S.hl = S.hl === h[1] ? null : h[1]; else if (h[0] === 'e') S.pt = +h[1]; return; }
      if (S.modo === 'sen') { if (h[0] === 'n') S.sn = +h[1]; else if (h[0] === 'v') S.vt = +h[1]; else if (h === 'vc') S.corr = !S.corr; else if (h[0] === 'o') S.oc = +h[1]; else if (h[0] === 'q') S.pe = +h[1]; return; }
      if (h[0] === 'p' && h.length === 2) S.sel = S.sel === +h[1] ? null : +h[1];
      else if (h[0] === 's') { if (S.sel != null) place(S, S.sel, h); }
      else if (h[0] === 'o' && h.length === 2) { S.rev = true; S.hm = S.ph; const ok = (S.les === 1 ? 3 : 1) === +h[1]; S.msg = (ok ? '<b>Certo.</b> ' : '<b>Quase.</b> ') + (S.les === 1 ? 'Sem o neurônio sensitivo, o sinal nem chega à medula: não há reflexo e nada é sentido.' : 'O sinal chega à medula e sobe ao cérebro: a pessoa sente, mas o neurônio motor cortado não leva a ordem ao músculo.'); }
      else if (h === 'bh') { S.hm = S.ph; S.msg = S.les ? null : 'A perna chuta antes de o cérebro "saber": o reflexo é feito na medula.'; if (S.les) S.rev = true; }
      else if (h === 'b1' || h === 'b2') { S.les = h === 'b1' ? 1 : 2; S.rev = false; S.hm = null; S.msg = 'Faça a previsão antes de ver.'; }
      else if (h === 'bz') { S.les = 0; S.rev = false; S.hm = null; S.msg = null; }
    },
    grab: (x, y, S) => S.modo === 'arco' ? dragN1.grab(x, y, S) : false, grabMove: (x, y, S) => dragN1.grabMove(x, y, S), grabEnd: (x, y, S) => dragN1.grabEnd(x, y, S),
    draw(t, S) { const A = area(); if (S.modo === 'arco') drawArco(t, S, A); else if (S.modo === 'sen') drawSen(t, S, A); else drawSis(t, S, A); }
  });

  // ---------- N2: autônomo e drogas ----------
  const ORG = [['pupila', 'contrai', 'dilata'], ['coração', 'desacelera', 'acelera'], ['brônquios', 'estreitam', 'dilatam'], ['estômago e intestino', 'digestão ativa', 'digestão freada'], ['bexiga', 'contrai', 'relaxa'], ['adrenais', 'repouso', 'soltam adrenalina']];
  function drawAut(t, S, A) {
    const v = S.v, bh = NAR ? Math.min(A.h * .68, 320) : Math.min(A.h * .86, 380), u = bh / 10, bx = A.cx, by = A.y0 + 32 + bh / 2, mix = rgba(v > .5 ? LAR : TEAL, 1);
    // alavanca
    const lw = Math.min(A.w * .8, 440), lx = A.cx - lw / 2, ly = A.y0 + 8; rr(lx, ly, lw, 12, 6, 'rgba(255,255,255,.06)', C.line, 1); for (let i = 0; i < 40; i++) rr(lx + i * lw / 40, ly, lw / 40 + 1, 12, 0, rgba(mixc(TEAL, LAR, i / 39), .85));
    circ(lx + v * lw, ly + 6, 9, '#fff', GUT, 2); mtx('repouso (parassimpático)', lx, ly + 26, { s: 11, a: 'left', c: TEAL }); mtx('susto (simpático)', lx + lw, ly + 26, { s: 11, a: 'right', c: LAR });
    corpo(bx, by + 12, bh, '#9DA9C4', .8); const sp = (x, y) => [bx + x * u, by + 12 + y * u], ic = NAR ? 15 : 19;
    const LL = NAR ? (A.w / 2 - 52) / u : 3.9, P = [sp(-LL, -3.6), sp(-LL, -.4), sp(-LL, 2.8), sp(LL, -.4), sp(LL, 2.8), sp(LL, -3.6)];
    const bxp = [sp(0, -4.1), sp(-.5, -2.4), sp(-.3, -1.8), sp(.1, -.2), sp(0, 1.3), sp(.85, -.95)];
    ORG.forEach((o, i) => {
      const [x, y] = P[i], [x2, y2] = bxp[i], sd = i < 3 ? 1 : -1; line(x + sd * ic * 1.1, y, x2, y2, rgba('#9DA9C4', .35), 1);
      if (i === 0) { circ(x, y, ic, rgba(AZ, .6), GUT, 1.4); circ(x, y, ic * lerp(.28, .72, v), GUT); }
      if (i === 1) { const k = 1 + .12 * Math.sin(t * TAU * lerp(1, 2.8, v)), s = ic * k; circ(x - s * .4, y - s * .2, s * .5, '#D7303B'); circ(x + s * .4, y - s * .2, s * .5, '#D7303B'); shape([[x - s * .9, y], [x + s * .9, y], [x, y + s * 1.05]], '#D7303B'); }
      if (i === 2) { const lw2 = lerp(2, 6, v); line(x, y - ic, x, y + ic * .2, '#9DD2E8', lw2); line(x, y, x - ic * .8, y + ic, '#9DD2E8', lw2); line(x, y, x + ic * .8, y + ic, '#9DD2E8', lw2); }
      if (i === 3) { const pp = []; for (let k = 0; k <= 20; k++) pp.push([x - ic + k * ic * .1, y + Math.sin(k * .9 - t * lerp(3, .6, v)) * lerp(7, 1.5, v)]); poly(pp, '#C9806B', 3); }
      if (i === 4) { const s = ic * lerp(.7, 1.1, v); circ(x, y, s, 'rgba(240,200,76,.3)', '#C9B38A', 1.6); }
      if (i === 5) { ell(x, y, ic * .8, ic * .5, 0, '#C9806B', '#8A4F3E', 1.4); if (v > .3) for (let k = 0; k < 4; k++) { const f = fr(t * .5 + k / 4); circ(lerp(x, x2 - 6, f), lerp(y, y2 + 20, f), 2.8, LAR, null); } }
      const side = sd; mtx(o[0], x, y - ic - 9, { s: 11, c: C.txt }); mtx(v > .5 ? o[2] : o[1], x, y + ic + 12, { s: 11, w: 700, c: v > .5 ? LAR : TEAL });
    });
    const gy = by + 12 + bh / 2 + 6; rr(A.cx - 60, gy, 120, 10, 5, 'rgba(255,255,255,.07)', C.line, 1); rr(A.cx - 60, gy, 120 * lerp(.3, .9, v), 10, 5, GLC); mtx('glicemia', A.cx - 66, gy + 5, { s: 11, a: 'right', c: C.dim });
    cap(v < .25 ? 'Em repouso o parassimpático domina: a digestão trabalha e o coração segue devagar. Mova a alavanca para o susto.' : v > .75 ? 'No susto, o simpático domina: pupilas e brônquios dilatam, o coração acelera, a digestão para e a glicemia sobe.' : 'Os dois trabalham o tempo todo; o equilíbrio entre eles ajusta o corpo a cada situação.');
  }
  const mixc = (a, b, f) => { const [r1, g1, b1] = hx(a), [r2, g2, b2] = hx(b), h2 = n => Math.round(n).toString(16).padStart(2, '0'); return '#' + h2(lerp(r1, r2, f)) + h2(lerp(g1, g2, f)) + h2(lerp(b1, b2, f)); };
  const DR = [['', 'sem droga'], ['e', 'estimulante que bloqueia a recaptação'], ['d', 'depressora'], ['c', 'curare (tampa os receptores)']];
  function dropSyn(S, i, h) { if (h === 'sy' || (h && h[0] === 'x')) S.drug = DR[i][0]; }
  const dragN2 = mkdrag('d', dropSyn);
  function drawSin(t, S, A) {
    const drug = S.drug, tol = sm(S, 'tol', S.rep && drug ? 1 : S.tol || 0, .35), nrec = 6 - Math.round(tol * 3), sw = Math.min(A.w * .7, 400), sx = A.cx - sw / 2, ty = A.y0 + 4, th = 58, gap = NAR ? 56 : 66, py = ty + th + gap, ph = 46;
    const slot = k => sx + sw * (.12 + k * .152), vx = j => sx + sw * (.18 + j * .27), trx = j => sx + sw * (.07 + j * .43);
    rr(sx, ty, sw, th, 26, 'rgba(111,177,232,.14)', '#6FB1E8', 1.6); mtx('neurônio de origem', sx + sw - 8, ty + 12, { s: 11, a: 'right', c: C.dim });
    [0, 1, 2].forEach(j => { circ(vx(j), ty + th - 17, 10, 'rgba(242,201,76,.2)', AMB, 1.2); for (let q = 0; q < 3; q++) circ(vx(j) - 3 + q * 3, ty + th - 17 + (q % 2) * 3 - 1, 1.8, AMB); });
    [0, 1, 2].forEach(j => rr(trx(j) - 6, ty + th - 6, 12, 8, 2, '#9DA9C4', GUT, 1)); mtx('recaptação', trx(0), ty + th + 18, { s: 10, c: C.dim });
    rr(sx, py, sw, ph, 18, 'rgba(111,177,232,.14)', '#6FB1E8', 1.6); mtx('neurônio seguinte', sx + 8, py + ph - 12, { s: 11, a: 'left', c: C.dim });
    for (let k = 0; k < 6; k++) { const has = k < nrec, x = slot(k); if (has) { rr(x - 8, py - 6, 16, 10, 3, drug === 'c' ? 'rgba(240,96,93,.35)' : GUT, drug === 'c' ? C.erro : '#9DA9C4', 1.4); if (drug === 'c') line(x - 9, py - 8, x + 9, py - 8, C.erro, 3); } else mtx('', x, py, {}); }
    hitR(sx, ty, sw, py + ph - ty, 'sy');
    // neurotransmissores
    const rel = drug === 'd' ? .4 : 1, N = Math.round(14 * rel), extra = drug === 'e' ? Math.round(6 + 4 * (1 - tol)) : 0, bound = new Set();
    for (let i = 0; i < N + extra; i++) {
      const lin = i >= N, p = lin ? .75 : fr(t * .22 + i / N), k = (i * 5 + 1) % 6, rx = slot(k), j = i % 3, y0 = ty + th - 17, y1 = py - 10; let x, y, a = 1;
      if (lin) { x = sx + sw * (.15 + ((i * 37) % 70) / 100) + Math.sin(t * 2 + i) * 5; y = ty + th + 8 + (i * 13 % (gap - 20)) + Math.cos(t * 1.7 + i) * 3; }
      else if (p < .35) { const q = ss(p / .35); x = lerp(vx(j), rx, q) + Math.sin(p * 20 + i) * 3; y = lerp(y0, y1, q); }
      else if (p < .65) { x = rx; y = y1; if (k < nrec && drug !== 'c') bound.add(k); }
      else if (drug === 'e') { x = rx + Math.sin(t * 3 + i) * 7; y = y1 - 10 - (i % 3) * 8; a = 1; }
      else { const q = ss((p - .65) / .35); x = lerp(rx, trx(j), q); y = lerp(y1, ty + th + 3, q); a = 1 - q * .8; }
      if (k >= nrec && p >= .35 && p < .65) { y = y1 - 6 - (i % 3) * 7; x = rx + Math.sin(t * 2.5 + i) * 6; }
      circ(x, y, 3.3, rgba(AMB, a), null);
    }
    for (let k = 0; k < nrec; k++) if (bound.has(k)) circ(slot(k), py - 1, 5, rgba(C.ok, .85), null);
    // disparos
    const f = drug === 'c' ? 0 : drug === 'd' ? .15 : drug === 'e' ? .5 + .45 * (1 - .6 * tol) : .5, fy = py + ph + 22; mtx('disparos do neurônio seguinte', sx, fy - 12, { s: 11, a: 'left', c: C.dim });
    line(sx, fy + 12, sx + sw, fy + 12, rgba('#9DA9C4', .4), 1); for (let i = 0; i < 40; i++) { const x = sx + sw - ((t * 60 + i * 10) % (sw)), sp = ((i * 7919) % 100) / 100 < f; if (sp) line(x, fy + 12, x, fy - 4, AZ, 2); }
    const by = fy + 34, cw = (A.w - 6) / 4, bw2 = NAR ? A.w / 2 - 3 : 200;
    DR.forEach(([k, s], i) => { const pr = S.dr && S.dr.i === i; const x = A.x0 + (i % (NAR ? 2 : 4)) * (NAR ? A.w / 2 + 1 : cw + 2), y = by + (NAR ? Math.floor(i / 2) * 44 : 0), w = NAR ? A.w / 2 - 4 : cw - 6; rr(x, y, w, 38, 8, drug === k ? rgba(AMB, .25) : 'rgba(19,26,43,.94)', drug === k ? AMB : C.line, drug === k ? 2.2 : 1.3); wrapTx(s, x + w / 2, y + 19 - (wrapTx(s, 0, 0, w - 8, { s: 11, w: 600, lh: 13, dry: true }) - 13) / 2, w - 8, { s: 11, w: 600, lh: 13, c: C.txt }); if (!pr) hitR(x, y, w, 38, 'x' + i); });
    btn(A.x0, by + (NAR ? 92 : 46), A.w, 34, S.rep ? 'uso repetido: ligado' : 'uso repetido', AMB, 'rep', { on: S.rep });
    if (S.dr) { rr(S.dr.x - 60, S.dr.y - 16, 120, 32, 8, rgba(AMB, .3), AMB, 2); mtx(DR[S.dr.i][1], S.dr.x, S.dr.y, { s: 11, w: 600, c: C.txt }); }
    cap((S.msg || (drug === 'e' ? 'Sem a recaptação, o neurotransmissor se acumula e o neurônio seguinte dispara sem parar.' : drug === 'd' ? 'Menos neurotransmissor liberado: menos disparos.' : drug === 'c' ? 'Os receptores tampados não recebem o sinal: o neurônio seguinte não dispara.' : 'Arraste um cartão de droga sobre a sinapse (ou toque nele).')) + (S.rep && drug ? ' Com o uso repetido, os receptores diminuem (tolerância): é preciso mais droga para o mesmo efeito.' : '') + '<br>' + EDU);
  }
  def('nervoso', 'autonomo', {
    t: 'Simpático, parassimpático e as drogas', s: 'o acelerador, o freio e quem mexe nas sinapses', c: '#7FB2E5',
    loc: S => S.modo === 'sin' ? 'Mexa na sinapse' : 'Repouso e susto', locNota: S => S.modo === 'sin' ? EDU : NOTA, still: 4,
    alt: 'contorno esquemático do corpo com pupila, coração, brônquios, intestino, bexiga e adrenais que respondem a uma alavanca do repouso ao susto; e uma sinapse em que o aluno aplica uma droga (estimulante, depressora ou curare) e vê neurotransmissores, receptores e disparos.',
    extra: [modo('aut', 'Repouso e susto'), modo('sin', 'Mexa na sinapse')],
    ctl: { l: 'Do repouso ao susto', min: 0, max: 1, step: .05, v: 0, f: v => v < .25 ? 'repouso' : v > .75 ? 'susto' : 'intermediário', rate: () => 1 }, ctlVis: S => S.modo === 'aut', stillV: .9, auto: .06,
    init(S) { S.modo = 'aut'; S.drug = ''; S.rep = false; S.tol = 0; S.dr = null; S.msg = null; },
    d: TXT.N2.d + '<p>Mova a alavanca e depois mexa na sinapse com os cartões de droga.</p>', enem: TXT.N2.enem,
    links: [['Relembre na Histologia: a sinapse', '../histologia/index.html#nervoso/sinapse']],
    tap(x, y, S) { const h = hid(x, y); if (!h) return; if (h[0] === 'x') S.drug = DR[+h.slice(1)][0]; else if (h === 'rep') S.rep = !S.rep; },
    grab: (x, y, S) => S.modo === 'sin' ? (() => { const h = hid(x, y); if (h && h[0] === 'x') { S.dr = { i: +h.slice(1), x, y }; return true; } return false; })() : false,
    grabMove: (x, y, S) => { if (S.dr) { S.dr.x = x; S.dr.y = y; } },
    grabEnd: (x, y, S) => { const d = S.dr; S.dr = null; if (d) { const h = hid(x, y); if (h === 'sy' || (h && h[0] === 'x')) S.drug = DR[d.i][0]; } },
    draw(t, S) { const A = area(); if (S.modo === 'sin') drawSin(t, S, A); else drawAut(t, S, A); }
  });
}
