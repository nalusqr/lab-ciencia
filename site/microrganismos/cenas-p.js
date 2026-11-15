/* LAB, módulo Microrganismos e fungos. Cenas do Protoctista: P1 (protozoários e algas) e P2 (protozooses).
   Código da equipe (Prometeu). Textos: roteiro do Taxon revisado pelo Sapien (docs/revisao-biologia/seres-vivos-roteiro.md).
   Os parágrafos do aluno e os cartões "No ENEM" entre as marcas TXT vêm do roteiro. */
'use strict';
{
  const PRO = C.proto;
  const passo = S => S.paused ? .12 : Math.min(.05, S.dt || .016);
  const modo = (id, t) => ({ t, on: S => { S.modo = id; S.msg = null; }, pressed: S => S.modo === id });
  const toque = S => { const now = performance.now(), ok = now - (S.tapT || 0) > 200; S.tapT = now; return ok; };
  const NB = ' ';
  const dAng = (a, c) => { let d = (a - c) % TAU; if (d > PI) d -= TAU; if (d < -PI) d += TAU; return d; };
  const G = (a, c, w) => Math.exp(-((dAng(a, c) / w) ** 2));
  const NOTA = 'Desenho esquemático, fora de escala';
  const TXT = {};
  //TXT-INICIO
  TXT.P1 = { d: "<p>O reino <b>Protoctista</b> junta os eucariontes que não são fungos, plantas nem animais. É um grupo de <b>conveniência</b>: seus membros não têm um ancestral comum exclusivo (o grupo não é monofilético). Na escola, ele se divide em dois conjuntos: os <b>protozoários</b>, unicelulares e heterótrofos, e as <b>algas</b>, autótrofas, de uma ou muitas células, sem raiz, caule, folha nem embrião.</p>\n<p>Os <b>protozoários</b> são separados, nos livros, pelo jeito de se mover. Os <b>sarcodíneos</b> (ou rizópodes) se movem por <b>pseudópodes</b>, expansões do citoplasma que também englobam o alimento (fagocitose): é o caso da <b>ameba</b>; os foraminíferos e os radiolários, marinhos, têm carapaças que se acumulam no fundo do mar e ajudam geólogos a localizar petróleo. Os <b>flagelados</b> se movem com <b>flagelos</b>: muitos são parasitas, como os causadores da doença de Chagas, das leishmanioses e da giardíase, e outros vivem no intestino dos <b>cupins</b>, onde digerem a celulose da madeira (mutualismo). Os <b>ciliados</b>, como o <b>paramécio</b>, têm o corpo coberto de <b>cílios</b> e dois tipos de núcleo (macronúcleo e micronúcleo). Os <b>esporozoários</b> (ou apicomplexos) <b>não têm estrutura de locomoção</b> e são <b>todos parasitas</b>, como o <i>Plasmodium</i> (malária) e o <i>Toxoplasma</i> (toxoplasmose). Os protozoários de <b>água doce</b> têm um <b>vacúolo contrátil</b>, que bombeia para fora a água que entra sem parar por osmose; sem ele, a célula estouraria. Os marinhos, num meio com concentração parecida com a do citoplasma, em geral não têm.</p>\n<p>As <b>algas</b> vivem na água ou em lugares úmidos. As <b>euglenas</b>, unicelulares de água doce, fazem fotossíntese na luz e comem matéria orgânica no escuro. As <b>diatomáceas</b> têm uma carapaça de <b>sílica</b>, como uma caixinha de vidro. Os <b>dinoflagelados</b> têm dois flagelos; alguns, quando se multiplicam demais, formam a <b>maré vermelha</b> e liberam toxinas que se acumulam em mariscos e intoxicam quem os come; outros, as <b>zooxantelas</b>, vivem dentro dos <b>corais</b> e lhes dão alimento e cor. As <b>algas verdes</b> têm os mesmos pigmentos e a mesma reserva (amido) das plantas e são o grupo de onde elas vieram (ver V1). As <b>algas pardas</b> incluem os grandes <i>kelps</i>, que formam florestas submarinas, e as <b>algas vermelhas</b> fornecem o <b>ágar</b> e a <b>carragenana</b>, usados em laboratório e na indústria de alimentos. Unicelulares ou não, as algas que flutuam formam o <b>fitoplâncton</b>, base das cadeias alimentares do mar e responsável por <b>cerca de metade da fotossíntese</b> do planeta e boa parte do gás oxigênio produzido. A Amazônia, por sua vez, faz muita fotossíntese, mas <b>consome quase todo o oxigênio que produz</b>, na respiração das próprias plantas e dos decompositores; chamá-la de \"pulmão do mundo\" é um erro. Ela importa, e muito, para a chuva, o clima e a biodiversidade.</p>", enem: "As perguntas mais comuns: o <b>vacúolo contrátil</b> e a <b>osmose</b> em protozoários de água doce; o <b>fitoplâncton</b> como grande produtor de oxigênio e base da cadeia marinha (e a Amazônia que <b>não</b> é \"pulmão do mundo\"); a <b>maré vermelha</b> e a intoxicação por mariscos; as <b>zooxantelas</b> e o branqueamento dos corais (ver A2). Pela locomoção, lembre: pseudópode (ameba), flagelo (tripanossomo), cílio (paramécio), nenhum (plasmódio)." };
  TXT.P2 = { d: "<p><b>Malária.</b> Causada por protozoários do gênero <i>Plasmodium</i> (no Brasil, sobretudo <i>P. vivax</i> e <i>P. falciparum</i>). Passa pela picada da <b>fêmea</b> do mosquito <b><i>Anopheles</i></b> (o mosquito-prego), que pica ao entardecer e à noite. Mais de <b>99% dos casos do Brasil</b> ocorrem na <b>Amazônia Legal</b>. O ciclo tem duas fases. <b>No ser humano</b>, o parasita vai primeiro ao <b>fígado</b>, onde se multiplica, e depois invade as <b>hemácias</b>; a cada ciclo, as hemácias se rompem juntas e liberam parasitas, o que causa <b>febre alta com calafrios em intervalos regulares</b> (cerca de 48 horas no <i>P. vivax</i> e no <i>P. falciparum</i>). <b>No mosquito</b>, que suga sangue com as formas sexuadas, acontece a <b>reprodução sexuada</b>. Por isso o <b>mosquito é o hospedeiro definitivo</b>, e o ser humano, o <b>intermediário</b>. Prevenção: mosquiteiros e telas, repelente, roupas compridas ao anoitecer e diagnóstico e tratamento rápidos, que também cortam a transmissão.</p>\n<p><b>Doença de Chagas.</b> Descrita por <b>Carlos Chagas</b> em <b>1909</b>, num feito raro na história da ciência: ele descobriu o agente (o <i>Trypanosoma cruzi</i>), o vetor e a doença. O vetor é o <b>barbeiro</b> (inseto do grupo dos triatomíneos), que vivia nas frestas das <b>casas de pau a pique</b> e pica à noite. O protozoário <b>não está na saliva</b>: o barbeiro <b>defeca</b> enquanto suga, e as fezes contaminadas entram pela ferida da picada ou pelas mucosas quando a pessoa coça. Hoje, a maior parte dos casos novos no Brasil vem da <b>transmissão oral</b>, por alimentos contaminados com barbeiros ou suas fezes, como <b>açaí</b> e caldo de cana mal higienizados, sobretudo na Região Norte. Também passa por transfusão e da mãe para o bebê. A fase crônica pode afetar o <b>coração</b> (que aumenta de tamanho) e o tubo digestório. Prevenção: casas de alvenaria com reboco, controle do barbeiro, higiene no preparo do açaí e triagem do sangue doado.</p>\n<p><b>Leishmanioses.</b> Causadas por protozoários do gênero <i>Leishmania</i>, transmitidos pela picada do <b>mosquito-palha</b> (ou birigui, os flebotomíneos), que se cria em matéria orgânica úmida no chão, não em água parada. A <b>tegumentar</b> forma feridas na pele e nas mucosas (nariz e boca). A <b>visceral</b> (calazar) ataca fígado, baço e medula óssea e pode matar; o <b>cão</b> é o principal reservatório nas cidades. Prevenção: limpar quintais, recolher folhas e fezes de animais, telas e repelentes; coleira repelente nos cães.</p>\n<p><b>Pela água, pelo alimento e pelo sexo.</b> A <b>amebíase</b> (<i>Entamoeba histolytica</i>) e a <b>giardíase</b> (<i>Giardia</i>) passam por <b>cistos</b> na água e nos alimentos contaminados com fezes e causam diarreia; prevenção: água tratada ou fervida, lavar as mãos e os alimentos, saneamento básico. A <b>toxoplasmose</b> (<i>Toxoplasma gondii</i>) tem o <b>gato</b> como hospedeiro definitivo; as pessoas se infectam comendo <b>carne crua ou malpassada</b> com cistos, ou ingerindo oocistos das fezes de gato presentes na terra, em verduras mal lavadas e na água. Em geral é leve, mas, na <b>gestante</b> que se infecta pela primeira vez, o parasita pode passar ao feto e lesar olhos e cérebro. A <b>tricomoníase</b> (<i>Trichomonas vaginalis</i>) é uma infecção sexualmente transmissível, prevenida com preservativo.</p>", enem: "Três detalhes caem sempre. Na <b>malária</b>, o mosquito é o <b>hospedeiro definitivo</b> (reprodução sexuada nele) e a febre periódica vem da <b>ruptura sincronizada das hemácias</b>. Na <b>doença de Chagas</b>, o parasita está nas <b>fezes</b> do barbeiro, não na saliva, e a <b>casa de pau a pique</b> favorece o vetor; a transmissão <b>oral</b> pelo açaí é o tema mais recente. Não confunda vetores: <i>Anopheles</i> (malária), barbeiro (Chagas), mosquito-palha (leishmanioses) e <i>Aedes</i> (dengue, que é vírus). Amebíase e giardíase pedem <b>saneamento</b>, não combate a mosquitos." };
  //TXT-FIM
  const LKT = ['Relembre na Taxonomia: Protoctista não é um clado', '../taxonomia/index.html#cladistica/grupos'];

  // grade de botões de resposta; devolve a altura usada. S.flash = { i, t } pisca o botão errado.
  function chips(S, list, x, y, w, cols, h, pre, o = {}) {
    const g = 8, cw = (w - (cols - 1) * g) / cols, fs = NAR ? 12 : 13;
    list.forEach((s, i) => {
      const cx = x + (i % cols) * (cw + g), cy = y + Math.floor(i / cols) * (h + g), fl = S.flash && S.flash.i === i && performance.now() - S.flash.t < 700;
      const ox = fl ? Math.sin((performance.now() - S.flash.t) / 25) * 4 : 0;
      rr(cx + ox, cy, cw, h, 8, 'rgba(19,26,43,.94)', fl ? C.erro : (o.cor || PRO), fl ? 2.2 : 1.3);
      const th = wrapTx(s, 0, 0, cw - 10, { s: fs, w: 600, lh: fs + 3, dry: true });
      wrapTx(s, cx + ox + cw / 2, cy + h / 2 - th / 2 + (fs + 3) / 2, cw - 10, { s: fs, w: 600, lh: fs + 3, c: C.txt });
      hitR(cx, cy, cw, h, pre + i);
    });
    return Math.ceil(list.length / cols) * (h + g) - g;
  }

  // =====================================================================================
  // P1 PROTOZOÁRIOS E ALGAS
  // =====================================================================================
  const DIAT = '#8FD6E8', DINO = '#F0A04B', EUG = '#7FD16B', VERDE = '#4CC25D', PARDA = '#B8863F', VERM = '#E0525F';
  function ameba(x, y, r, t) {
    const T = t % 9, ext = ss(seg(T, .3, 3)), eng = ss(seg(T, 3, 5.4)), dig = ss(seg(T, 5.6, 8.6)), pts = [];
    for (let i = 0; i < 56; i++) {
      const a = i / 56 * TAU;
      const k = .78 + .06 * Math.sin(3 * a + t * 1.4) + .04 * Math.sin(5 * a - t * 1.1) + ext * (1 - .8 * eng) * (.7 * G(a, 0, .3) + .38 * G(a, .95, .24) + .32 * G(a, -1, .24));
      pts.push([x + Math.cos(a) * r * k, y + Math.sin(a) * r * k * .92]);
    }
    shape(pts, rgba(PRO, .26), PRO, 1.8);
    circ(x - r * .22, y + r * .12, r * .2, rgba('#5B3C8E', .75), rgba('#E8D9FF', .5), 1);
    const ax = x + r * lerp(1.7, .2, eng);
    if (dig < 1) { circ(ax, y - r * .02, r * .2 * (1 - dig * .6), rgba(VERDE, 1 - dig * .85), '#1E6B33', 1); if (eng > .9) circ(ax, y - r * .02, r * .3, null, 'rgba(255,255,255,.45)', 1); }
  }
  function flagelado(x, y, r, t) {
    X.save(); X.translate(x + Math.sin(t * .7) * r * .2, y); X.rotate(Math.sin(t * .7 + 1) * .15);
    X.beginPath(); for (let i = 0; i <= 30; i++) { const u = i / 30, px = -r * .5 - u * r * 1.05, py = Math.sin(u * 9 - t * 9) * r * .14 * (.3 + u); i ? X.lineTo(px, py) : X.moveTo(px, py); }
    X.strokeStyle = PRO; X.lineWidth = 1.8; X.stroke();
    ell(0, 0, r * .55, r * .3, 0, rgba(PRO, .28), PRO, 1.8); circ(r * .1, 0, r * .12, rgba('#5B3C8E', .8)); X.restore();
  }
  // paramécio: o.v1 e o.v2 (0 a 1) são o enchimento dos dois vacúolos contráteis; o.sc aumenta a célula; o.estica pinta o contorno
  function paramecio(x, y, r, t, o = {}) {
    X.save(); X.translate(x, y); X.rotate(o.rot == null ? -.2 : o.rot); const sc = o.sc || 1; X.scale(sc, sc);
    const rx = r, ry = r * .45, N = 38;
    for (let i = 0; i < N; i++) {
      const a = i / N * TAU, px = Math.cos(a) * rx, py = Math.sin(a) * ry, nx = Math.cos(a) * ry, ny = Math.sin(a) * rx, nl = Math.hypot(nx, ny) || 1, b = Math.sin(a * 5 - t * 7) * .7, L = r * .15;
      const ux = (nx * Math.cos(b) - ny * Math.sin(b)) / nl, uy = (nx * Math.sin(b) + ny * Math.cos(b)) / nl;
      line(px, py, px + ux * L, py + uy * L, rgba(PRO, .85), 1.1);
    }
    ell(0, 0, rx, ry, 0, rgba(PRO, .22), o.estica ? C.erro : PRO, o.estica ? 2.6 : 1.8);
    ell(r * .05, 0, rx * .22, ry * .42, 0, rgba('#5B3C8E', .8), rgba('#E8D9FF', .4), 1); circ(r * .05 + rx * .3, -ry * .1, ry * .1, '#E8D9FF');
    [[-.56, o.v1], [.56, o.v2]].forEach(([u, v]) => {
      if (v == null) return; const vr = ry * (.1 + .36 * v);
      if (v > .25) for (let k = 0; k < 6; k++) { const g = k / 6 * TAU; line(u * rx + Math.cos(g) * vr, Math.sin(g) * vr, u * rx + Math.cos(g) * vr * 1.9, Math.sin(g) * vr * 1.9, 'rgba(207,224,255,.45)', 1); }
      circ(u * rx, 0, vr, 'rgba(207,224,255,.5)', '#CFE0FF', 1.4);
    });
    X.restore();
  }
  function hemacia(x, y, r, t, par) {
    circ(x, y, r, rgba(C.hemacia, .82), '#8E1F27', 1.4); ell(x, y, r * .5, r * .4, 0, 'rgba(240,120,128,.4)');
    if (par) { const k = 1 + .05 * Math.sin(t * 2); circ(x + r * .08, y - r * .04, r * .32 * k, null, '#E8D9FF', 2.2); circ(x + r * .27, y - r * .04, r * .1, '#E8D9FF'); }
  }
  function algaIc(id, x, y, s, t) {
    X.save(); X.translate(x, y);
    if (id === 'diat') { rr(-s * .45, -s * .27, s * .9, s * .54, s * .08, rgba(DIAT, .2), DIAT, 2); rr(-s * .37, -s * .19, s * .74, s * .38, s * .05, null, rgba(DIAT, .7), 1); line(0, -s * .27, 0, s * .27, DIAT, 1.4); for (let i = -3; i <= 3; i++) if (i) line(i * s * .1, -s * .14, i * s * .1, s * .14, rgba(DIAT, .6), 1); }
    else if (id === 'dino') { ell(0, 0, s * .26, s * .3, 0, rgba(DINO, .3), DINO, 2); X.beginPath(); X.ellipse(0, 0, s * .26, s * .08, 0, 0, PI); X.strokeStyle = DINO; X.lineWidth = 1.6; X.stroke(); X.beginPath(); for (let i = 0; i <= 20; i++) { const u = i / 20, px = s * .1 + Math.sin(u * 8 - t * 8) * s * .05, py = s * .3 + u * s * .3; i ? X.lineTo(px, py) : X.moveTo(px, py); } X.stroke(); X.beginPath(); X.ellipse(0, 0, s * .34, s * .1, 0, 0, PI); X.strokeStyle = rgba(DINO, .7); X.lineWidth = 1.3; X.stroke(); }
    else if (id === 'eugl') { X.rotate(-.5); ell(0, 0, s * .36, s * .15, 0, rgba(EUG, .3), EUG, 2); circ(-s * .22, -s * .02, s * .045, C.erro); X.beginPath(); for (let i = 0; i <= 20; i++) { const u = i / 20, px = s * .36 + u * s * .3, py = Math.sin(u * 8 - t * 8) * s * .05; i ? X.lineTo(px, py) : X.moveTo(px, py); } X.strokeStyle = EUG; X.lineWidth = 1.6; X.stroke(); for (let i = -1; i <= 1; i++) circ(i * s * .12 + s * .03, s * .01, s * .035, rgba(EUG, .9)); }
    else if (id === 'verde') { [[-.28, .05], [0, -.07], [.27, .06]].forEach(([u, v]) => { circ(u * s, v * s, s * .17, rgba(VERDE, .3), VERDE, 2); circ(u * s, v * s, s * .06, rgba(VERDE, .85)); }); }
    else if (id === 'parda') { const sw = Math.sin(t * 1.2) * s * .05; X.beginPath(); X.moveTo(0, s * .45); X.quadraticCurveTo(sw, 0, sw * 1.4, -s * .3); X.strokeStyle = PARDA; X.lineWidth = 2.4; X.stroke(); [[.2, -1], [.02, 1], [-.14, -1]].forEach(([u, sd]) => { const by = s * u; ell(sw * (.6 - u) + sd * s * .2, by - s * .04, s * .2, s * .06, sd * -.4, rgba(PARDA, .4), PARDA, 1.4); circ(sw * (.6 - u) + sd * s * .02, by + s * .02, s * .035, rgba('#E6C27A', .9)); }); }
    else { const br = (px, py, a, l, d) => { const qx = px + Math.cos(a) * l, qy = py + Math.sin(a) * l; line(px, py, qx, qy, VERM, 2 - d * .5); if (d < 2) { br(qx, qy, a - .5, l * .62, d + 1); br(qx, qy, a + .5, l * .62, d + 1); } }; br(0, s * .45, -PI / 2 + Math.sin(t) * .05, s * .34, 0); }
    X.restore();
  }
  const ALG = [['diat', 'diatomácea', 'carapaça de sílica', 'carapaça de sílica'], ['dino', 'dinoflagelado', 'maré vermelha', 'maré vermelha'], ['eugl', 'euglena', 'fotossíntese ou alimento', 'faz os dois'], ['verde', 'alga verde', 'ancestral das plantas', 'origem das plantas'], ['parda', 'alga parda', 'florestas de <i>kelp</i>', 'floresta de <i>kelp</i>'], ['verm', 'alga vermelha', 'ágar e carragenana', 'ágar']];
  function drawProtos(t, A, y0, h) {
    const cols = NAR ? 2 : 4, rows = NAR ? 2 : 1, gw = A.w / cols, gh = h / rows, R = Math.min(gw / 2 - 6, (gh - 22) / 2);
    const NM = ['ameba: pseudópodes', 'flagelado: flagelo', 'paramécio: cílios', '<i>Plasmodium</i>: sem locomoção'];
    for (let i = 0; i < 4; i++) {
      const cx = A.x0 + gw * (i % cols + .5), cy = y0 + gh * Math.floor(i / cols) + (gh - 22) / 2 + 2;
      circ(cx, cy, R, 'rgba(120,180,255,.07)', 'rgba(124,196,255,.45)', 1.4);
      X.save(); X.beginPath(); X.arc(cx, cy, R - 1, 0, TAU); X.clip();
      if (i === 0) ameba(cx, cy, R * .42, t); else if (i === 1) flagelado(cx, cy, R * .55, t); else if (i === 2) paramecio(cx, cy, R * .66, t); else hemacia(cx, cy, R * .5, t, true);
      X.restore();
      mtx(NM[i], cx, cy + R + 12, { s: NAR ? 12 : 13, w: 600, c: C.txt });
    }
  }
  function drawAlgas(t, A, y0, h) {
    const cols = NAR ? 3 : 6, rows = NAR ? 2 : 1, cw = A.w / cols, rh = h / rows;
    ALG.forEach((a, i) => {
      const cx = A.x0 + cw * (i % cols + .5), ry = y0 + rh * Math.floor(i / cols), s = Math.min(cw * .62, (rh - 40) * .95);
      panel(cx - cw / 2 + 3, ry + 2, cw - 6, rh - 4, { f: 'rgba(19,26,43,.5)' });
      algaIc(a[0], cx, ry + 6 + s / 2 + (rh - 40 - s) / 2, s, t);
      mtx(a[1], cx, ry + rh - 26, { s: NAR ? 12 : 13, w: 700, c: C.txt }); mtx(NAR ? a[3] : a[2], cx, ry + rh - 11, { s: 12, w: 500, c: C.dim });
    });
  }
  function drawAnimP1(t, S, A) {
    if (S.modo === 'algas') { drawAlgas(t, A, A.y0, A.h); return; }
    if (NAR) { drawProtos(t, A, A.y0, A.h); return; }
    const hA = A.h * .36; drawProtos(t, A, A.y0, A.h - hA - 6); drawAlgas(t, A, A.y0 + A.h - hA, hA);
  }
  const salF = v => v < .12 ? 'água doce' : v > .88 ? 'água do mar' : nbr(v * 100, 0) + '%' + NB + 'do mar';
  const taxa = S => S.trava ? 0 : 14 * cl(1 - S.v * 1.15, 0, 1);
  function drawVac(t, S, A) {
    const sal = S.v, rate = taxa(S), dt = passo(S);
    S.vph = (S.vph || 0) + dt * rate / 60;
    const frozen = S.trava, doce = 1 - sal;
    S.inch = cl((S.inch || 0) + (frozen ? doce * dt / 9 : -dt / 3), 0, 1);
    const bx = A.x0, by = A.y0, bw = A.w, bh = A.h;
    rr(bx, by, bw, bh, 12, rgba(mix('#2B4C8C', '#1D6F73', sal), .22), 'rgba(124,196,255,.35)', 1);
    const R0 = rng(5); for (let i = 0; i < 46; i++) { const px = bx + 10 + R0() * (bw - 20), py = by + 10 + R0() * (bh - 20); if (R0() > sal) continue; circ(px, py, 2.2, 'rgba(255,255,255,.75)'); }
    const cx = A.cx, cy = A.cy + (NAR ? 8 : 4), r = Math.min(A.w * .34, A.h * .5), sc = 1 + .32 * S.inch;
    const ciclo = x => { const f = fr(x); return f < .85 ? f / .85 : 1 - (f - .85) / .15; };
    const v1 = frozen ? .97 : rate > 0 ? ciclo(S.vph) : .05, v2 = frozen ? .97 : rate > 0 ? ciclo(S.vph + .5) : .05;
    const na = Math.round(doce * 10);
    for (let i = 0; i < na; i++) {
      const g = i / Math.max(1, na) * TAU + .3, e = fr(t * .5 + i * .37);
      circ(cx + Math.cos(g) * (r * 1.12 * sc + 40 * (1 - e)), cy + Math.sin(g) * (r * .62 * sc + 34 * (1 - e)), 3.4 * (1 - e * .5), rgba('#7CC4FF', .9 - e * .5));
    }
    paramecio(cx, cy, r, t, { v1, v2, sc, estica: S.inch > .96 });
    panel(A.x0 + 8, A.y0 + 8, NAR ? 190 : 250, 46, { f: 'rgba(19,26,43,.85)' });
    tx(nbr(rate, 0), A.x0 + 22, A.y0 + 31, { f: FD, s: 24, w: 700, a: 'left', c: C.amber, bg: false });
    mtx('pulsações do vacúolo' + (NAR ? '' : ' por minuto'), A.x0 + 62, A.y0 + 24, { s: 12, w: 600, a: 'left', c: C.txt, bg: false }); mtx(NAR ? 'por minuto' : salF(sal), A.x0 + 62, A.y0 + 40, { s: 12, a: 'left', c: C.dim, bg: false });
    if (LB) { tx(S.v < .35 ? 'a água entra por osmose' : 'quase sem entrada de água', cx, cy + r * .62 * sc + 28, { s: 13, w: 600, c: '#9ED2FF' }); if (sal > .55) tx('sais', A.x1 - 40, A.y0 + 22, { s: 12, c: C.dim }); }
    cap(S.trava ? (doce > .5 ? (S.inch > .96 ? 'No limite: sem o vacúolo contrátil, <b>a água entra por osmose sem parar</b> e a célula não aguenta.' : 'Vacúolo travado em água doce: <b>a água entra por osmose sem parar</b> e a célula incha.') : 'Vacúolo travado, mas aqui a água do meio é parecida com a do citoplasma: quase não entra água, e a célula não incha.') : (sal < .15 ? 'Em <b>água doce</b>, o meio é mais diluído que o citoplasma: a água entra sem parar e o vacúolo contrátil a bombeia para fora. Mova a salinidade.' : sal > .85 ? 'Na <b>água do mar</b>, o meio tem concentração parecida com a do citoplasma: pouca água entra, e os marinhos em geral não têm vacúolo contrátil.' : 'Quanto mais sal na água, menos água entra por osmose e mais devagar o vacúolo pulsa.'));
  }
  const QUEM = baralho({
    nome: 'quem',
    alvos: [{ t: 'pseudópode', c: '#C58BE8' }, { t: 'flagelo', c: '#7FB2E5' }, { t: 'cílio', c: '#6BCB77' }, { t: 'sem locomoção', c: '#F0605D' }, { t: 'alga', c: '#4CC25D' }],
    cartas: [
      { t: 'ameba', k: 0, x: 'os sarcodíneos se movem por pseudópodes, que também englobam o alimento (fagocitose).' },
      { t: '<i>Trypanosoma</i>', k: 1, x: 'os flagelados se movem com flagelos; este é o agente da doença de Chagas.' },
      { t: 'paramécio', k: 2, x: 'os ciliados têm o corpo coberto de cílios e dois tipos de núcleo.' },
      { t: '<i>Plasmodium</i>', k: 3, x: 'os esporozoários não têm estrutura de locomoção e são todos parasitas.' },
      { t: 'diatomácea', k: 4, x: 'é uma alga unicelular de carapaça de sílica, com fotossíntese.' },
      { t: 'dinoflagelado', k: 4, x: 'faz fotossíntese, então entra com as algas (e tem dois flagelos); na maré vermelha libera toxinas.' }
    ],
    certo: c => '<b>Certo.</b> ' + c.x.charAt(0).toUpperCase() + c.x.slice(1),
    errado: (c, a) => `<b>Ainda não.</b> ${semTag(c.t)} não vai em "${a.t}". Pense em como ele se move ou se faz fotossíntese.`,
    fim: () => '<b>Pronto.</b> Pseudópode (ameba), flagelo (tripanossomo), cílio (paramécio), nenhum (<i>Plasmodium</i>): é a lista que o vestibular cobra.',
    dica: 'Toque num cartão e depois no jeito de se mover (ou em "alga").'
  });
  function drawQuem(S, A) {
    const cols = NAR ? 2 : 3, ch = NAR ? 36 : 42, g = NAR ? 6 : 8, rows = Math.ceil(6 / cols), ay0 = A.y0 + rows * (ch + g) + 4;
    QUEM.draw(S, { x0: A.x0, y0: A.y0, x1: A.x1, y1: A.y1 }, {
      cols, cartaH: ch, slotH: NAR ? 30 : 34,
      alvoRect: k => { const c2 = NAR ? 3 : 5, n2 = Math.ceil(5 / c2), rw = (A.w - (c2 - 1) * 10) / c2, rh = (A.y1 - ay0 - (n2 - 1) * 10) / n2; return { x: A.x0 + (k % c2) * (rw + 10), y: ay0 + Math.floor(k / c2) * (rh + 10), w: rw, h: rh }; }
    });
    cap(QUEM.msg(S) || 'Quem é quem? Leve cada cartão ao jeito de se mover (ou a "alga").');
  }

  def('protoctista', 'grupos', {
    t: 'Protozoários e algas', s: 'eucariontes simples que nadam, rastejam ou fazem fotossíntese', c: PRO,
    loc: S => ({ proto: 'Quatro protozoários' + (NAR ? '' : ' e as algas'), algas: 'As algas e seus usos', vac: 'Vacúolo contrátil', quem: 'Quem é quem?' })[S.modo] || '',
    locNota: S => S.modo === 'quem' ? '' : NOTA,
    alt: 'quatro protozoários em gotas de água (ameba com pseudópodes, flagelado, paramécio com cílios e Plasmodium dentro de uma hemácia), seis algas com seus usos, um paramécio cujo vacúolo contrátil pulsa conforme a salinidade da água e um jogo de arrastar cartões para o jeito de se mover',
    still: 4, stillV: 0,
    ctl: { l: 'Salinidade da água', min: 0, max: 1, step: .05, v: 0, f: salF, rate: () => 1 },
    ctlVis: S => S.modo === 'vac',
    extra: [modo('proto', 'Protozoários'), modo('algas', 'Algas'), modo('vac', 'Vacúolo contrátil'), { t: 'Travar o vacúolo', on: S => { S.modo = 'vac'; S.trava = !S.trava; }, pressed: S => !!S.trava }, modo('quem', 'Quem é quem?')],
    init(S) { S.modo = 'proto'; S.trava = false; S.inch = 0; S.vph = 0; QUEM.zera(S); },
    d: TXT.P1.d + '<p>Em "Protozoários" e "Algas", veja como cada um se move e para que serve. Em "Vacúolo contrátil", mude a salinidade e experimente travar o vacúolo. Em "Quem é quem?", leve cada cartão ao jeito de se mover.</p>',
    enem: TXT.P1.enem,
    links: [LKT, ['Endossimbiose na Morfofisiologia', '../morfofisiologia/index.html'], ['Fotossíntese na Bioenergética', '../bioenergetica/index.html']],
    tap(x, y, S) { if (S.modo === 'quem') QUEM.tap(x, y, S); },
    grab(x, y, S) { return S.modo === 'quem' && QUEM.grab(x, y, S); },
    grabMove(x, y, S) { QUEM.grabMove(x, y, S); }, grabEnd(x, y, S) { QUEM.grabEnd(x, y, S); },
    draw(t, S) {
      const A = area();
      if (S.modo === 'vac') drawVac(t, S, A); else if (S.modo === 'quem') drawQuem(S, A);
      else { drawAnimP1(t, S, A); cap(S.modo === 'algas' ? 'As algas fazem fotossíntese: o fitoplâncton responde por <b>cerca de metade</b> da fotossíntese do planeta. A Amazônia consome quase todo o oxigênio que produz: "pulmão do mundo" é um erro.' : 'Quatro jeitos de viver: a ameba engole o alimento com pseudópodes, o flagelado nada com o flagelo, o paramécio desliza com cílios e o <i>Plasmodium</i>, parasita, fica parado dentro da hemácia.'); }
    }
  });

  // =====================================================================================
  // P2 PROTOZOOSES
  // =====================================================================================
  function humano(x, y, h, o = {}) {
    const w = h * .36, c = o.c || C.dim;
    circ(x, y - h * .38, h * .1, rgba(c, .22), c, 1.6);
    rr(x - w / 2, y - h * .26, w, h * .5, w * .32, rgba(c, .18), c, 1.6);
    rr(x - w * .45, y + h * .22, w * .38, h * .26, 5, rgba(c, .14), c, 1.4); rr(x + w * .07, y + h * .22, w * .38, h * .26, 5, rgba(c, .14), c, 1.4);
  }
  function figado(x, y, w, k) { ell(x, y, w, w * .55, .15, rgba('#B5651D', .55 + .35 * k), k > .05 ? C.amber : '#7A4416', 1.4 + k); }
  function mosq(x, y, s, o = {}) {
    const t = o.t || 0; X.save(); X.translate(x, y);
    const c = o.c || '#C9CFDD';
    for (let i = -1; i <= 1; i++) line(-s * .02 + i * s * .09, s * .05, -s * .08 + i * s * .13, s * .3, c, 1.2);
    ell(s * .26, 0, s * .26, s * .085, -.1, rgba(c, .3), c, 1.5); circ(0, -s * .005, s * .1, rgba(c, .35), c, 1.5); circ(-s * .13, -s * .02, s * .055, rgba(c, .5), c, 1.4);
    line(-s * .17, -s * .01, -s * .4, s * .02 + (o.pica ? s * .04 : 0), c, 1.5);
    ell(s * .05, -s * .2 + Math.sin(t * 40) * s * .01, s * .22, s * .06, -.5, 'rgba(207,224,255,.2)', 'rgba(207,224,255,.6)', 1.1);
    if (o.gl) circ(-s * .02, s * .06, s * .06, rgba('#C58BE8', .9)); if (o.gut) circ(s * .26, 0, s * .06, rgba('#C58BE8', .9), '#E8D9FF', 1);
    X.restore();
  }
  function barbeiro(x, y, s, o = {}) {
    const ch = 1 + (o.inch || 0) * .35; X.save(); X.translate(x, y);
    for (let i = 0; i < 3; i++) { line(-s * .05 + i * s * .15, s * .1, -s * .1 + i * s * .15, s * .3, '#8A6F5A', 1.4); line(-s * .05 + i * s * .15, -s * .1, -s * .1 + i * s * .15, -s * .3, '#8A6F5A', 1.4); }
    ell(s * .1, 0, s * .4 * ch, s * .19 * ch, 0, '#4B3A2D', '#C9783A', 2.2);
    for (let i = 0; i < 5; i++) { const px = s * (-.12 + i * .13); line(px, -s * .19 * ch, px, -s * .12 * ch, '#E39A52', 2.6); line(px, s * .19 * ch, px, s * .12 * ch, '#E39A52', 2.6); }
    ell(-s * .38, 0, s * .12, s * .09, 0, '#4B3A2D', '#C9783A', 1.8); line(-s * .48, s * .02, -s * .62, s * .08, '#C9783A', 1.6);
    X.restore();
  }
  function tcruzi(x, y, s, a) { X.save(); X.translate(x, y); X.rotate(a); X.beginPath(); X.moveTo(-s * .5, 0); X.quadraticCurveTo(-s * .2, -s * .22, s * .1, -s * .05); X.quadraticCurveTo(s * .3, s * .08, s * .55, -s * .15); X.strokeStyle = '#E8D9FF'; X.lineWidth = Math.max(1.4, s * .12); X.lineCap = 'round'; X.stroke(); circ(-s * .08, -s * .1, s * .08, '#9A6BFF'); X.restore(); }
  const CICLO = [
    ['picada', '1. A fêmea de <i>Anopheles</i> infectada pica e injeta o parasita no sangue.'],
    ['fígado', '2. No ser humano, o parasita vai primeiro ao <b>fígado</b>, onde se multiplica.'],
    ['hemácias', '3. Depois invade as <b>hemácias</b>; a cada ciclo elas se rompem juntas e causam <b>febre alta com calafrios em intervalos regulares</b> (cerca de 48 horas no <i>P. vivax</i> e no <i>P. falciparum</i>).'],
    ['formas sexuadas', '4. Algumas formas viram células sexuadas e ficam no sangue.'],
    ['mosquito suga', '5. Outra fêmea de <i>Anopheles</i> pica e suga o sangue com essas formas sexuadas.'],
    ['intestino do mosquito', '6. No intestino do mosquito acontece a <b>reprodução sexuada</b>: por isso o mosquito é o <b>hospedeiro definitivo</b>, e o ser humano, o intermediário.'],
    ['glândulas salivares', '7. Os novos parasitas migram para as glândulas salivares, prontos para a próxima picada.']
  ];
  const SLOT = 2.6, PER = SLOT * 7;
  function drawCiclo(t, S, A) {
    const tt = t % PER, idx = Math.floor(tt / SLOT), u = (tt - idx * SLOT) / SLOT;
    const R = Math.min(A.h * (NAR ? .3 : .35), A.w * (NAR ? .3 : .3)), cx = A.cx, cy = A.y0 + A.h * (NAR ? .45 : .46);
    const an = i => -PI / 2 - i * TAU / 7;
    X.beginPath(); X.arc(cx, cy, R * 1.02, PI / 2, 3 * PI / 2); X.closePath(); X.fillStyle = rgba(C.sangue, .09); X.fill();
    X.beginPath(); X.arc(cx, cy, R * 1.02, -PI / 2, PI / 2); X.closePath(); X.fillStyle = rgba(C.vetor, .09); X.fill();
    line(cx, cy - R * 1.02, cx, cy + R * 1.02, 'rgba(157,169,196,.3)', 1, [4, 5]);
    for (let i = 0; i < 7; i++) { const a0 = an(i) - .22, a1 = an(i + 1) + .22; X.beginPath(); X.arc(cx, cy, R, a0, a1, true); X.strokeStyle = i === idx ? C.amber : 'rgba(157,169,196,.55)'; X.lineWidth = i === idx ? 2.4 : 1.5; X.stroke(); arrowHead(cx + Math.cos(a1) * R, cy + Math.sin(a1) * R, Math.atan2(-Math.cos(a1), Math.sin(a1)), i === idx ? C.amber : 'rgba(157,169,196,.8)', 7); }
    const t0 = k => 2 * SLOT + SLOT * (.15 + k * .3);
    const onda = k => tt >= t0(k) ? Math.exp(-(tt - t0(k)) / 1.1) : 0;
    const febre = cl(Math.max(onda(0) * .45, onda(1) * .75, onda(2)), 0, 1);
    const rupt = Math.max(0, ...[0, 1, 2].map(k => { const d = tt - t0(k); return d >= 0 && d < .6 ? 1 - d / .6 : 0; }));
    const hh = R * .95, hx = cx - R * .5, mx = cx + R * .52, picando = idx === 0 || idx === 4;
    humano(hx, cy, hh); figado(hx + hh * .08, cy - hh * .08, hh * .13, idx === 1 ? 1 : 0);
    const gx = hx, gy = cy + hh * .66 + (NAR ? 2 : 4), gr = R * .24;
    circ(gx, gy, gr, 'rgba(11,15,28,.7)', rgba(C.sangue, .8), 1.4);
    [[-.4, -.25], [.38, -.2], [-.1, .42]].forEach(([a, b], i) => { const bx = gx + a * gr * 1.2, by = gy + b * gr * 1.2, w = i === 0 ? rupt : 0; hemacia(bx, by, gr * .36 * (1 + w * .4), t, idx >= 2 && idx <= 3 && !w); if (w) for (let k = 0; k < 6; k++) { const g = k / 6 * TAU; circ(bx + Math.cos(g) * gr * (.35 + (1 - w) * .6), by + Math.sin(g) * gr * (.35 + (1 - w) * .6), 2, '#E8D9FF'); } });
    mosq(mx, cy - R * .05, R * 1.0, { t, pica: picando, gl: idx === 6 || idx === 0, gut: idx === 5 });
    const tx0 = cx, tw = 9, th = R * .85, ty0 = cy - th / 2 - R * .22;
    rr(tx0 - tw / 2, ty0, tw, th, 4, 'rgba(11,15,28,.7)', C.dim, 1.2); rr(tx0 - tw / 2 + 1.5, ty0 + th * (1 - febre) + 1, tw - 3, Math.max(2, th * febre - 2), 3, febre > .3 ? C.erro : '#E8B3A8');
    circ(tx0, ty0 + th + 5, 7, febre > .3 ? C.erro : '#E8B3A8', C.dim, 1.2);
    if (LB) tx('febre', tx0, ty0 - 9, { s: 12, c: C.dim });
    for (let i = 0; i < 7; i++) {
      const px = cx + Math.cos(an(i)) * R, py = cy + Math.sin(an(i)) * R, on = i === idx;
      circ(px, py, on ? 13 : 11, on ? C.amber : 'rgba(19,26,43,.95)', on ? '#fff' : C.dim, on ? 2 : 1.3); tx(String(i + 1), px, py + .5, { s: 12, w: 700, c: on ? '#0B0F1C' : C.txt, bg: false }); hitC(px, py, 15, 'n' + i);
      if (!NAR && LB) { const co = Math.cos(an(i)), lx = px + co * 22, ly = py + Math.sin(an(i)) * 20 - (i === 0 ? 4 : 0); mtx(CICLO[i][0], lx, ly, { s: 12, w: on ? 700 : 500, a: co < -.2 ? 'right' : co > .2 ? 'left' : 'center', c: on ? C.amber : C.dim }); }
    }
    const k = ss(seg(u, 0, .3)), pa = lerp(an(idx - 1), an(idx), k);
    circ(cx + Math.cos(pa) * R, cy + Math.sin(pa) * R, 5, '#E8D9FF', '#9A6BFF', 2);
    const yy = cy + R * 1.02 + (NAR ? 20 : 24);
    mtx('ser humano', cx - 8, yy, { s: NAR ? 12 : 13, w: 700, a: 'right', c: C.sangue }); mtx('hospedeiro intermediário', cx - 8, yy + 16, { s: 12, a: 'right', c: C.dim });
    mtx('fêmea de <i>Anopheles</i>', cx + 8, yy, { s: NAR ? 12 : 13, w: 700, a: 'left', c: C.vetor }); mtx('hospedeiro definitivo', cx + 8, yy + 16, { s: 12, a: 'left', c: C.amber, w: 600 });
    cap(CICLO[idx][1]);
  }
  function drawBarb(t, S, A) {
    const T = t % 14, st = T < 3 ? 0 : T < 6 ? 1 : T < 9 ? 2 : 3;
    const two = !NAR, pw = two ? (A.w - 12) / 2 : A.w, ph = two ? A.h : (A.h - 8) / 2;
    const p1 = { x: A.x0, y: A.y0, w: pw, h: ph }, p2 = two ? { x: A.x0 + pw + 12, y: A.y0, w: pw, h: ph } : { x: A.x0, y: A.y0 + ph + 8, w: pw, h: ph };
    panel(p1.x, p1.y, p1.w, p1.h); panel(p2.x, p2.y, p2.w, p2.h);
    mtx('Pela picada: nas <b>fezes</b>, não na saliva', p1.x + p1.w / 2, p1.y + 16, { s: NAR ? 12 : 14, w: 600, f: FH, c: C.txt });
    mtx('Pela boca: <b>transmissão oral</b>', p2.x + p2.w / 2, p2.y + 16, { s: NAR ? 12 : 14, w: 600, f: FH, c: C.txt });
    const sy = p1.y + p1.h * .7, sx0 = p1.x + 14, sx1 = p1.x + p1.w - 14, bite = p1.x + p1.w * .42;
    rr(sx0, sy, sx1 - sx0, p1.h * .2, 10, 'rgba(157,169,196,.2)', C.dim, 1.2); if (LB) tx('pele (silhueta)', sx0 + 8, sy + p1.h * .1, { s: 12, a: 'left', c: C.dim, bg: false });
    const bs = Math.min(p1.w * .3, p1.h * .36), appr = ss(seg(T, 0, 1.6)), bxx = lerp(p1.x - bs, bite - bs * .5, appr), inch = ss(seg(T, 1.6, 3));
    barbeiro(bxx + bs * .5, sy - bs * .17, bs, { inch: st >= 1 ? inch : inch * .5 });
    circ(bite - bs * .75, sy + 1, 2.4, C.dim);
    const fe = ss(seg(T, 3, 4.2));
    if (fe > 0) ell(bite + bs * .18, sy - 3, 7 * fe, 4.5 * fe, 0, '#7A5230', '#C9783A', 1.2);
    if (st === 3) { const q = ss(seg(T, 9, 13)), fx = bite + bs * .18, bx0 = bite - bs * .75; arrow(fx - 6, sy - 3, lerp(fx - 6, bx0 + 5, q), sy - 3, C.amber, 1.8); if (LB && !NAR) tx('coçar leva as fezes à picada', (fx + bx0) / 2, sy - 22, { s: 12, c: C.amber }); }
    if (st >= 2) { const zr = Math.min(p1.w * .2, p1.h * .22), zx = p1.x + p1.w - zr - 16, zy = p1.y + 34 + zr; circ(zx, zy, zr, 'rgba(11,15,28,.85)', C.amber, 1.6); for (let i = 0; i < 5; i++) tcruzi(zx + Math.cos(i * 1.7 + t * .3) * zr * .45, zy + Math.sin(i * 2.3 + t * .4) * zr * .45, zr * .42, i + t * .6); line(bite + bs * .18 + 6, sy - 6, zx - zr * .6, zy + zr * .7, rgba(C.amber, .6), 1, [3, 3]); if (LB) mtx('<i>T. cruzi</i> nas fezes', zx, zy + zr + 11, { s: 12, c: C.txt }); }
    if (LB) { mtx('barbeiro', bxx + bs * .5, sy - bs * .5, { s: 12, w: 600, c: C.txt }); if (st >= 1) mtx('fezes', bite + bs * .18, sy + p1.h * .26 - 4, { s: 12, c: '#C9A27A' }); }
    const hy = p2.y + p2.h * .55, hr = Math.min(p2.w * .12, p2.h * .18), hx = p2.x + p2.w * .74, ax = p2.x + p2.w * .26, ar = Math.min(p2.w * .15, p2.h * .2);
    circ(hx, hy, hr, 'rgba(157,169,196,.2)', C.dim, 1.4); rr(hx - hr * .9, hy + hr * .95, hr * 1.8, hr * 1.4, hr * .5, 'rgba(157,169,196,.16)', C.dim, 1.3); line(hx - hr * .5, hy + hr * .35, hx - hr * .05, hy + hr * .38, C.dim, 1.6);
    X.beginPath(); X.arc(ax, hy - ar * .1, ar, 0, PI); X.closePath(); X.fillStyle = '#4A2A6E'; X.fill(); X.strokeStyle = '#8B5CC0'; X.lineWidth = 1.6; X.stroke();
    for (let i = 0; i < 5; i++) circ(ax + (i - 2) * ar * .32, hy - ar * .18 + (i % 2) * 3, 2.6, '#8B5CC0');
    const m = ss(seg(T, 3, 8));
    for (let i = 0; i < 3; i++) tcruzi(ax - ar * .4 + i * ar * .4, hy + ar * .25, ar * .24, i * .8);
    arrow(ax + ar * 1.1, hy - ar * .3, lerp(ax + ar * 1.1, hx - hr * 1.5, m), hy - ar * .3, C.fecal, 1.8);
    if (LB) { mtx('açaí mal higienizado', ax, hy + ar * .7 + 14, { s: 12, w: 600, c: C.txt }); mtx('pessoa', hx, hy + hr * 2.6, { s: 12, c: C.dim }); }
    cap(['O barbeiro suga o sangue à noite.', 'Enquanto suga, o barbeiro <b>defeca ao lado da picada</b>. A saliva <b>não</b> tem o <i>T. cruzi</i>: ele está nas <b>fezes</b>.', 'Ampliado: o <i>Trypanosoma cruzi</i> vive nas fezes do barbeiro.', 'Ao coçar, a pessoa leva as fezes à ferida da picada ou às mucosas. Hoje, a maior parte dos casos novos vem da via oral (açaí e caldo de cana sem higiene).'][st]);
  }

  // ---- investigação de surto ----
  const DOEN = ['Malária', 'Doença de Chagas', 'Leishmaniose visceral', 'Amebíase e giardíase', 'Toxoplasmose', 'Tricomoníase'];
  const AGE = ['<i>Plasmodium</i>', '<i>Trypanosoma cruzi</i>', '<i>Leishmania</i>', '<i>Entamoeba histolytica</i> e <i>Giardia</i>', '<i>Toxoplasma gondii</i>', '<i>Trichomonas vaginalis</i>'];
  const TRA = ['picada da fêmea do <i>Anopheles</i>', 'fezes do barbeiro ou alimento contaminado', 'picada do mosquito-palha', 'cistos na água e nos alimentos', 'carne crua ou fezes de gato, sem vetor', 'contato sexual', 'picada do <i>Aedes aegypti</i>'];
  const MED = ['mosquiteiro, tela e tratamento rápido', 'casa de alvenaria e higiene no preparo do açaí', 'limpar quintais, telas e coleira repelente no cão', 'água tratada, saneamento e lavar as mãos', 'carne bem cozida e verduras lavadas', 'preservativo'];
  const PASSOS = [['Qual é a doença?', DOEN], ['Qual é o agente?', AGE], ['Como foi a transmissão?', TRA], ['Qual é a principal medida de prevenção?', MED]];
  const CASOS = [
    { t: '<b>Local:</b> garimpo em Rondônia. <b>Sintomas:</b> febre alta com calafrios a cada dois dias. <b>Hábitos:</b> dorme em barraca sem tela e trabalha perto do rio ao entardecer.', r: [0, 0, 0, 0],
      h: ['Febre com calafrios em intervalos regulares, na Amazônia Legal.', 'O agente da malária é do gênero <i>Plasmodium</i>.', 'Quem pica ao entardecer e à noite é a fêmea do <i>Anopheles</i>. O <i>Aedes</i> transmite vírus, não protozoários.', 'Para o vetor: mosquiteiro, tela e tratamento rápido, que também corta a transmissão.'] },
    { t: '<b>Local:</b> comunidade no Pará. <b>Sintomas:</b> febre e, meses depois, coração aumentado. <b>Hábitos:</b> a família tomou açaí de feira, sem higiene no preparo.', r: [1, 1, 1, 1],
      h: ['Coração aumentado depois de açaí mal higienizado: pense em barbeiro.', 'O agente é um tripanossomo, descrito por Carlos Chagas em 1909.', 'Nem a saliva nem a picada: as fezes do barbeiro, ou alimento contaminado com ele.', 'Casa de alvenaria com reboco e higiene no preparo do açaí.'] },
    { t: '<b>Local:</b> cidade do interior. <b>Sintomas:</b> criança com febre longa e barriga inchada. <b>Hábitos:</b> o cachorro da casa está doente e o quintal acumula folhas úmidas.', r: [2, 2, 2, 2],
      h: ['Fígado e baço aumentados e o cão doente: o cão é o reservatório urbano.', 'O agente é do gênero <i>Leishmania</i>.', 'O vetor é o mosquito-palha, que se cria em matéria orgânica úmida, não em água parada.', 'Limpar quintais, usar telas e coleira repelente no cão.'] },
    { t: '<b>Local:</b> unidade de saúde. <b>Situação:</b> gestante, exame positivo no pré-natal. <b>Hábitos:</b> come carne malpassada e tem um gato em casa.', r: [4, 4, 4, 4],
      h: ['O gato e a carne malpassada apontam para um parasita com gato como hospedeiro definitivo.', 'O agente é o <i>Toxoplasma gondii</i>.', 'Não há vetor: é carne crua com cistos ou oocistos das fezes de gato.', 'Carne bem cozida, verduras lavadas e cuidados na gestação.'] }
  ];
  const QUADRO = [['Malária', '<i>Plasmodium</i>', 'picada da fêmea do <i>Anopheles</i>', 'mosquiteiro, tela, repelente, tratamento rápido'], ['Doença de Chagas', '<i>Trypanosoma cruzi</i>', 'fezes do barbeiro na picada; alimentos contaminados', 'casa de alvenaria, higiene no preparo do açaí'], ['Leishmanioses', '<i>Leishmania</i>', 'picada do mosquito-palha', 'limpar quintais, telas, coleira repelente no cão'], ['Amebíase e giardíase', '<i>Entamoeba histolytica</i>, <i>Giardia</i>', 'cistos na água e alimentos (fecal-oral)', 'saneamento, água tratada, lavar mãos e alimentos'], ['Toxoplasmose', '<i>Toxoplasma gondii</i>', 'carne crua; oocistos de fezes de gato', 'carne bem cozida, lavar verduras, cuidado na gestação'], ['Tricomoníase', '<i>Trichomonas vaginalis</i>', 'sexual', 'preservativo']];
  const DOEN_Q = QUADRO.map(r => r[0]), LINHA_CASO = [0, 1, 2, 4];
  const tudo = S => S.ok.every(Boolean);
  function responde(S, i) {
    const c = CASOS[S.f], p = S.st[S.f]; if (p >= 4) return;
    if (i === c.r[p]) {
      S.st[S.f] = p + 1; S.res[S.f][p] = PASSOS[p][1][i]; S.msg = '<b>Certo.</b> ' + (p === 3 ? 'Caso resolvido: a linha do quadro-resumo foi preenchida.' : 'Agora o próximo passo.'); S.flash = null;
      if (p === 3) { S.ok[S.f] = true; if (tudo(S)) { S.modo = 'quadro'; S.msg = '<b>Os quatro casos foram resolvidos.</b> O quadro-resumo está completo, com as duas doenças que faltavam.'; } }
    } else { S.flash = { i, t: performance.now() }; S.msg = '<b>Ainda não.</b> Dica: ' + c.h[p]; }
  }
  function drawSurto(S, A) {
    const gap = 8, tabH = 28, tw = (A.w - 3 * gap) / 4;
    CASOS.forEach((c, i) => { const x = A.x0 + i * (tw + gap), on = S.f === i; rr(x, A.y0, tw, tabH, 8, on ? 'rgba(197,139,232,.2)' : 'rgba(19,26,43,.9)', S.ok[i] ? C.ok : on ? C.amber : C.dim, on ? 2 : 1.2); mtx('Caso ' + (i + 1), x + tw / 2, A.y0 + tabH / 2 + .5, { s: NAR ? 12 : 13, w: 600, c: S.ok[i] ? C.ok : C.txt, bg: false }); hitR(x, A.y0, tw, tabH, 'f' + i); });
    const y1 = A.y0 + tabH + 10, lw = NAR ? A.w : A.w * .42 - 6, rx = NAR ? A.x0 : A.x0 + lw + 14, rw = NAR ? A.w : A.w - lw - 14, c = CASOS[S.f], p = S.st[S.f];
    const fs = NAR ? 12 : 13, th = wrapTx(c.t, 0, 0, lw - 20, { s: fs, lh: fs + 4, dry: true }), fh = th + 30;
    panel(A.x0, y1, lw, fh, { s: C.amber }); tx('Caso fictício ' + (S.f + 1), A.x0 + 10, y1 + 12, { s: 12, w: 700, a: 'left', c: C.amber, bg: false });
    wrapTx(c.t, A.x0 + 10, y1 + 30, lw - 20, { s: fs, lh: fs + 4, a: 'left', c: C.txt });
    let yy = y1 + fh + 8;
    S.res[S.f].forEach((s, i) => { const txt = '<b>' + ['Doença', 'Agente', 'Transmissão', 'Prevenção'][i] + ':</b> ' + s, hh = wrapTx(txt, 0, 0, lw - 4, { s: 12, lh: 15, dry: true }); wrapTx(txt, A.x0 + 2, yy + 8, lw - 4, { s: 12, lh: 15, a: 'left', c: C.ok }); yy += hh + 2; });
    const ty = NAR ? yy + 4 : y1;
    if (p < 4) {
      const [q, opts] = PASSOS[p]; mtx('Passo ' + (p + 1) + ' de 4: ' + q, rx, ty + 8, { s: NAR ? 13 : 14, w: 600, f: FH, a: 'left', c: C.txt });
      chips(S, opts, rx, ty + 24, rw, 2, NAR ? 36 : 40, 'o', { cor: PRO });
    } else { mtx('Caso resolvido.', rx, ty + 8, { s: 14, w: 600, f: FH, a: 'left', c: C.ok }); if (!tudo(S)) mtx('Toque em outro caso para continuar.', rx, ty + 30, { s: 13, a: 'left', c: C.dim }); }
    cap(S.msg || 'Escolha um caso, leia a ficha e responda aos quatro passos: doença, agente, transmissão e prevenção.');
  }
  function drawQuadro(S, A) {
    const lin = k => tudo(S) || (LINHA_CASO.indexOf(k) >= 0 && S.ok[LINHA_CASO.indexOf(k)]);
    if (!NAR) {
      const cw = [.19, .21, .27, .33].map(f => f * A.w), hh = 26, rh = (A.h - hh - 4) / 6; let x = A.x0;
      ['Doença', 'Agente', 'Transmissão', 'Prevenção principal'].forEach((s, j) => { tx(s, x + 6, A.y0 + hh / 2, { s: 13, w: 700, a: 'left', c: PRO, bg: false }); x += cw[j]; });
      line(A.x0, A.y0 + hh, A.x1, A.y0 + hh, PRO, 1.4);
      QUADRO.forEach((row, k) => {
        const y = A.y0 + hh + 4 + k * rh, ok = lin(k); rr(A.x0, y, A.w, rh - 4, 6, ok ? 'rgba(19,26,43,.7)' : 'rgba(19,26,43,.35)', ok ? 'rgba(197,139,232,.5)' : C.line, 1); let xx = A.x0;
        row.forEach((s, j) => { const txt = j === 0 ? '<b>' + s + '</b>' : ok ? s : 'a descobrir', h2 = wrapTx(txt, 0, 0, cw[j] - 12, { s: 12, lh: 15, dry: true }); wrapTx(txt, xx + 6, y + (rh - 4) / 2 - h2 / 2 + 7.5, cw[j] - 12, { s: 12, lh: 15, a: 'left', c: ok || j === 0 ? C.txt : C.dim }); xx += cw[j]; });
      });
    } else {
      const ch = 30;
      DOEN_Q.forEach((s, k) => { const w = (A.w - 8) / 2, x = A.x0 + (k % 2) * (w + 8), y = A.y0 + Math.floor(k / 2) * (ch + 6); rr(x, y, w, ch, 8, S.q === k ? 'rgba(197,139,232,.2)' : 'rgba(19,26,43,.9)', S.q === k ? C.amber : lin(k) ? C.ok : C.dim, S.q === k ? 2 : 1.2); mtx(s, x + w / 2, y + ch / 2 + .5, { s: 12, w: 600, c: C.txt, bg: false }); hitR(x, y, w, ch, 'm' + k); });
      const y0 = A.y0 + 3 * (ch + 6) + 6, row = QUADRO[S.q], ok = lin(S.q); panel(A.x0, y0, A.w, A.y1 - y0 - 2, { s: PRO });
      let yy = y0 + 18; mtx('<b>' + row[0] + '</b>', A.x0 + 12, yy, { s: 14, f: FH, a: 'left', c: C.txt }); yy += 14;
      ['Agente', 'Transmissão', 'Prevenção principal'].forEach((l, j) => { tx(l, A.x0 + 12, yy + 8, { s: 12, w: 700, a: 'left', c: PRO, bg: false }); yy += 18; yy += wrapTx(ok ? row[j + 1] : 'a descobrir', A.x0 + 12, yy + 4, A.w - 24, { s: 13, lh: 16, a: 'left', c: ok ? C.txt : C.dim }) + 6; });
    }
    cap(S.msg && tudo(S) ? S.msg : 'Quadro-resumo: cada linha se preenche quando o caso correspondente é resolvido. As linhas de amebíase, giardíase e tricomoníase aparecem ao final.');
  }

  def('protoctista', 'protozooses', {
    t: 'Protozooses', s: 'malária, doença de Chagas, leishmanioses e as que vêm da água e do alimento', c: PRO,
    loc: S => ({ ciclo: 'Ciclo da malária', barb: 'Doença de Chagas', surto: 'Investigação de surto', quadro: 'Quadro-resumo' })[S.modo] || '',
    locNota: S => S.modo === 'surto' || S.modo === 'quadro' ? 'Casos fictícios, para estudo' : 'Desenho esquemático, só silhuetas',
    ctlVis: S => S.modo === 'ciclo' || S.modo === 'barb',
    alt: 'a roda do ciclo da malária, com o ser humano como hospedeiro intermediário e o mosquito Anopheles como hospedeiro definitivo, e um termômetro que sobe a cada ruptura das hemácias; o barbeiro que defeca ao lado da picada e a transmissão oral pelo açaí; quatro fichas de casos fictícios para investigar e o quadro-resumo das protozooses',
    still: 7.4, stillV: 1,
    extra: [modo('ciclo', 'Ciclo da malária'), modo('barb', 'Barbeiro e Chagas'), modo('surto', 'Investigação de surto'), modo('quadro', 'Quadro-resumo')],
    init(S) { S.modo = 'ciclo'; S.f = 0; S.st = [0, 0, 0, 0]; S.res = [[], [], [], []]; S.ok = [false, false, false, false]; S.msg = null; S.q = 0; },
    d: TXT.P2.d + '<p>Em "Ciclo da malária", toque nos números para ver cada passo; em "Investigação de surto", resolva os quatro casos fictícios e o quadro-resumo se completa. A falta de saneamento básico e de moradia adequada é responsabilidade do poder público, não de quem adoece.</p>',
    enem: TXT.P2.enem,
    kv: [['Malária', '<i>Plasmodium</i>; picada da fêmea do <i>Anopheles</i>; mosquiteiro, tela, repelente, tratamento rápido'], ['Doença de Chagas', '<i>Trypanosoma cruzi</i>; fezes do barbeiro na picada ou alimentos contaminados; casa de alvenaria, higiene no preparo do açaí'], ['Leishmanioses', '<i>Leishmania</i>; picada do mosquito-palha; limpar quintais, telas, coleira repelente no cão'], ['Amebíase e giardíase', '<i>Entamoeba histolytica</i> e <i>Giardia</i>; cistos na água e alimentos; saneamento, água tratada, lavar mãos e alimentos'], ['Toxoplasmose', '<i>Toxoplasma gondii</i>; carne crua ou oocistos de fezes de gato; carne bem cozida, lavar verduras, cuidado na gestação'], ['Tricomoníase', '<i>Trichomonas vaginalis</i>; sexual; preservativo']],
    links: [['Vírus: arboviroses (dengue é vírus)', '../virus/index.html#doencas/arboviroses'], ['Relações ecológicas na Ecologia', '../ecologia/index.html']],
    tap(x, y, S) {
      if (!toque(S)) return; const h = hitAt(x, y); if (typeof h !== 'string') return;
      if (S.modo === 'ciclo' && h[0] === 'n') S.ph = Math.floor(S.ph / PER) * PER + +h.slice(1) * SLOT + .35;
      else if (S.modo === 'surto') { if (h[0] === 'f') { S.f = +h.slice(1); S.msg = null; S.flash = null; } else if (h[0] === 'o') responde(S, +h.slice(1)); }
      else if (S.modo === 'quadro' && h[0] === 'm') S.q = +h.slice(1);
    },
    draw(t, S) {
      const A = area();
      if (S.modo === 'ciclo') drawCiclo(t, S, A); else if (S.modo === 'barb') drawBarb(t, S, A); else if (S.modo === 'surto') drawSurto(S, A); else drawQuadro(S, A);
    }
  });
}
