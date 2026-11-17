/* LAB, módulo Anatomia e fisiologia. Cenas da parte 1 (Digestório e Respiratório): D1, D2, R1 e R2.
   Código da equipe (Aurelius). Textos: roteiro do Taxon (docs/revisao-biologia/anatomia-roteiro-parte1.md). */
'use strict';
{
  const NOTA = 'Desenho esquemático, fora de escala';
  const ART = '#E5484D', VEN = '#7C6FD6', O2C = '#6EC8E8', CO2C = '#8C96A8', CARB = '#F2D04A', PROT = '#E58AB0', LIP = '#F28C3A', AM = C.amber, QUI = '#9BE0B8';
  const dtv = S => S.paused ? 0 : Math.min(.05, S.dt || .016);
  const NO = Object.assign({}, RITMO, { no: true });
  const MD = {};
  // modos de cada tópico: cada modo tem a sua faixa (CT); a faixa do tópico acompanha o modo ativo
  function mk(key, CT, ini) {
    MD[key] = Object.keys(CT)[0];
    return {
      ctl: () => CT[MD[key]],
      vis: S => !(CT[S.modo] || {}).no,
      extra: (id, t) => ({ t, on: S => { S.modo = id; MD[key] = id; S.v = CT[id].v; S.ph = 0; S.touch = 0; ini && ini(S, id); }, pressed: S => S.modo === id }),
      init(S) { const id = Object.keys(CT)[0]; S.modo = id; MD[key] = id; S.v = CT[id].v; ini && ini(S, id); }
    };
  }
  const etiq = (s, x, y, c, a = 1) => { X.save(); X.globalAlpha *= a; const sz = NAR ? 12 : 13, w = mtw(s, sz, 600) + 24; rr(x, y - 11, w, 22, 999, 'rgba(11,15,28,.84)', rgba(c, .8), 1); circ(x + 11, y, 4.5, c); mtx(s, x + 20, y + .5, { s: sz, w: 600, a: 'left', c: C.txt, bg: false }); X.restore(); return w; };
  function fila(x, y, w, h, its, c) { const n = its.length, g = 6, bw = (w - (n - 1) * g) / n; its.forEach((it, i) => btn(x + i * (bw + g), y, bw, h, it[0], it[3] || c, it[1], { on: it[2], s: NAR ? 12 : 13 })); }
  function phReg(x, y, w, v, mn, mx, nome) {
    const g = X.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, '#D9534F'); g.addColorStop(.5, '#5FB36A'); g.addColorStop(1, '#4F86D9');
    rr(x, y - 5, w, 10, 5, g, 'rgba(11,15,28,.7)', 1);
    const px = x + w * seg(v, mn, mx); X.beginPath(); X.moveTo(px, y + 7); X.lineTo(px - 6, y + 17); X.lineTo(px + 6, y + 17); X.closePath(); X.fillStyle = C.txt; X.fill();
    tx(String(mn), x, y - 16, { s: 12, f: FD, c: C.dim }); tx(String(mx), x + w, y - 16, { s: 12, f: FD, c: C.dim });
    mtx((nome || 'pH') + ' ' + nbr(v, v % 1 ? 1 : 0), px, y + 29, { s: 13, w: 700, f: FD });
  }
  function cadeia(x, y, n, r, c, q, t, seed) {
    const R = rng(seed), P = [];
    for (let k = 0; k < n; k++) { const a0 = (k - (n - 1) / 2) * r * 2.1, an = R() * TAU, d = q * (10 + R() * 16); P.push([x + a0 * (1 - q * .5) + Math.cos(an + t * .8 * q) * d, y + Math.sin(k * 1.7) * r * .8 * (1 - q) + Math.sin(an + t * .8 * q) * d]); }
    if (q < .5) poly(P, rgba(c, .8), 2);
    P.forEach(p => circ(p[0], p[1], r, c, 'rgba(11,15,28,.7)', 1));
  }
  const TXT = {};
  TXT.D1 = {"t": "Enzimas e pH ao longo do tubo", "s": "cada trecho tem sua enzima, e cada enzima tem seu pH", "d": "<p>Digerir é quebrar moléculas grandes (amido, proteínas, gorduras) em moléculas pequenas que atravessam a parede do intestino (glicose, aminoácidos, ácidos graxos e glicerol). Uma parte é <b>mecânica</b>: mastigar, misturar e empurrar. O empurrão é o <b>peristaltismo</b>, ondas de contração do <b>músculo liso</b> da parede, que levam o alimento mesmo de cabeça para baixo. A outra parte é <b>química</b>, feita por <b>enzimas</b>, que funcionam melhor numa faixa de <b>pH</b> e perto de 37 °C (ver Biomoléculas).</p><p>Na <b>boca</b>, a saliva tem pH perto do neutro (cerca de 7) e a <b>amilase salivar</b> (ptialina) começa a quebrar o amido em maltose. Por isso o pão fica docinho depois de mastigado. No <b>estômago</b>, o <b>suco gástrico</b> tem <b>ácido clorídrico</b> (HCl) e o pH cai para cerca de <b>2</b>. O ácido mata muitos microrganismos, desnatura proteínas e ativa o <b>pepsinogênio</b>, que vira <b>pepsina</b> e começa a quebrar proteínas. A amilase salivar, que chega junto com o bolo, para de agir nesse ácido. O estômago não se digere porque é coberto por uma camada de <b>muco</b> e porque a pepsina é liberada inativa. O alimento sai do estômago como <b>quimo</b>, uma pasta ácida.</p><p>No <b>duodeno</b>, o começo do intestino delgado, o <b>pâncreas</b> lança <b>bicarbonato</b>, que neutraliza o ácido e deixa o pH perto de <b>8</b>. Ali agem as enzimas do <b>suco pancreático</b>: <b>amilase pancreática</b> (amido), <b>tripsina</b> e <b>quimotripsina</b> (proteínas), <b>lipase</b> (gorduras) e <b>nucleases</b> (DNA e RNA). O <b>fígado</b> manda a <b>bile</b>, guardada na <b>vesícula biliar</b>: ela <b>não tem enzimas</b>, mas tem sais que <b>emulsionam</b> a gordura, quebrando gotas grandes em gotinhas, como o detergente faz na louça, e assim a lipase alcança mais superfície. Por fim, as enzimas presas na parede do intestino (do <b>suco entérico</b>: maltase, sacarase, <b>lactase</b>, peptidases) terminam o trabalho. Quem produz pouca lactase depois da infância tem <b>intolerância à lactose</b>: a lactose não digerida chega ao intestino grosso e é fermentada por bactérias, com gases e diarreia.</p>", "enem": "Caem muito as questões de <b>experimento com tubos de ensaio</b>: dada uma enzima, um substrato e um pH, em qual tubo houve digestão. Lembre: <b>amilase</b> em pH neutro, <b>pepsina</b> em pH ácido, <b>enzimas pancreáticas</b> em pH levemente básico; enzima <b>fervida não funciona</b>. Outra pegadinha clássica: a <b>bile não é enzima</b>, ela <b>emulsiona</b> gorduras. Também aparecem intolerância à lactose e o uso de antiácidos."};
  TXT.D2 = {"t": "Absorção, fígado e pâncreas", "s": "dobras sobre dobras multiplicam a superfície de absorção", "d": "<p>Quase toda a <b>absorção</b> acontece no <b>intestino delgado</b>, que tem cerca de <b>6 a 7 metros</b> no adulto. A parede é cheia de dobras; as dobras têm <b>vilosidades</b> (projeções como dedos de luva) e cada célula das vilosidades tem <b>microvilosidades</b> (ver Histologia, epitélio de revestimento). Tudo isso multiplica a superfície, que chega a cerca de 30 metros quadrados segundo as medidas mais recentes (livros antigos falam em uma quadra de tênis). Dentro de cada vilosidade há <b>capilares sanguíneos</b> e um <b>vaso linfático</b> central, o <b>quilífero</b>. Glicose e aminoácidos entram nas células por <b>transporte ativo</b> e difusão facilitada e seguem para o sangue. Os lipídios são remontados dentro das células, embalados em partículas e vão pela <b>linfa</b>, que só depois cai no sangue (veja Circulatório, sangue e linfa).</p><p>O sangue que sai do intestino não vai direto para o coração: segue pela <b>veia porta hepática</b> até o <b>fígado</b>, que funciona como uma alfândega. O fígado guarda glicose como <b>glicogênio</b> e a devolve quando falta, guarda ferro e vitaminas (A, D, B12), fabrica proteínas do plasma (albumina e fatores da coagulação), produz a <b>bile</b>, desativa remédios, álcool e outras toxinas e transforma a <b>amônia</b>, tóxica, que vem da quebra dos aminoácidos, em <b>ureia</b>, que o rim elimina (veja Excretor, néfron). O consumo exagerado de álcool por anos pode levar a <b>gordura no fígado</b> e a <b>cirrose</b>, em que o tecido vira cicatriz.</p><p>O <b>pâncreas</b> é uma glândula <b>mista</b> (anfícrina): a parte <b>exócrina</b> faz o suco pancreático, que sai por um ducto até o duodeno; a parte <b>endócrina</b>, as ilhotas, lança <b>insulina</b> e <b>glucagon</b> no sangue (veja Endócrino, glicemia). A digestão é coordenada por hormônios do próprio tubo: a <b>gastrina</b> estimula o suco gástrico; a <b>secretina</b> manda o pâncreas soltar bicarbonato; a <b>colecistocinina</b> (CCK) contrai a vesícula biliar e estimula as enzimas pancreáticas. No <b>intestino grosso</b>, a principal tarefa é <b>absorver água</b> e sais; ali vivem trilhões de bactérias, a <b>microbiota</b>, que fermentam as fibras e produzem vitamina K. As <b>fibras</b> não são digeridas, mas dão volume às fezes e ajudam o trânsito. Se a água é pouco absorvida (infecção), há diarreia e risco de <b>desidratação</b>; o <b>soro de reidratação oral</b> repõe água e sais.</p>", "enem": "Cobram a relação <b>forma e função</b>: vilosidades e microvilosidades <b>aumentam a superfície de absorção</b>; doenças ou cirurgias que reduzem essa área causam desnutrição. Caem também as funções do <b>fígado</b> (glicogênio, bile, desintoxicação, <b>ureia</b>), o efeito do <b>álcool</b> no fígado, o pâncreas como glândula <b>mista</b>, as <b>fibras</b> e a <b>reidratação oral</b> na diarreia."};
  TXT.R1 = {"t": "Das narinas aos alvéolos: a hematose", "s": "o ar entra por pressão, o gás passa por difusão", "d": "<p>O ar entra pelas <b>fossas nasais</b>, onde é <b>filtrado</b> por pelos e muco, <b>aquecido</b> e <b>umedecido</b>. Passa pela <b>faringe</b> (que o ar divide com o alimento), pela <b>laringe</b> (onde ficam as pregas vocais; a <b>epiglote</b> fecha a passagem quando engolimos) e pela <b>traqueia</b>, um tubo com anéis de cartilagem que não deixam o tubo fechar. A traqueia e os <b>brônquios</b> são forrados por epitélio com <b>cílios</b> e células que fazem <b>muco</b>: o muco prende poeira e microrganismos e os cílios o varrem para cima. A fumaça do cigarro paralisa os cílios, e o muco acumula: é a tosse do fumante. Os brônquios se ramificam em <b>bronquíolos</b>, que terminam em cachos de <b>alvéolos</b>, cerca de 300 milhões em cada adulto, segundo a estimativa mais citada.</p><p>Os pulmões não têm músculo para se encher. Quem faz o trabalho é o <b>diafragma</b>, um músculo em forma de cúpula embaixo deles, ajudado pelos <b>músculos intercostais</b>. Na <b>inspiração</b>, o diafragma se contrai e desce, as costelas sobem, o volume da caixa torácica aumenta e a pressão dentro dos pulmões fica <b>menor</b> que a do ar de fora: o ar entra. Na <b>expiração</b> em repouso, o diafragma relaxa e sobe, o volume diminui, a pressão fica <b>maior</b> que a de fora e o ar sai.</p><p>Nos alvéolos acontece a <b>hematose</b>: a troca de gases entre o ar e o sangue, por <b>difusão</b>, sempre do lugar com mais gás para o lugar com menos. O ar do alvéolo tem mais O₂ que o sangue que chega do corpo, então o O₂ passa para o sangue; o sangue tem mais CO₂, então o CO₂ passa para o alvéolo. A parede do alvéolo e a do capilar têm, cada uma, uma só camada de células achatadas, cobertas por uma película de <b>surfactante</b>, que impede os alvéolos de colabarem. No sangue, quase todo o O₂ viaja preso à <b>hemoglobina</b> das hemácias. O <b>monóxido de carbono</b> (CO), da fumaça de motores, fogões mal regulados e cigarro, gruda na hemoglobina com força muito maior que o O₂ e toma o lugar dele: por isso é tão perigoso em lugar fechado. No <b>enfisema</b>, comum em fumantes, as paredes dos alvéolos se rompem, a superfície de troca diminui e falta ar.</p>", "enem": "Cobram que a troca de gases é por <b>difusão</b> (diferença de concentração, sem gasto de energia), o papel do <b>diafragma</b> e da diferença de pressão na ventilação, a defesa por <b>muco e cílios</b> e os efeitos do <b>cigarro</b>. O <b>monóxido de carbono</b> ligado à hemoglobina aparece muito, em questões sobre aquecedores a gás, queimadas e poluição urbana. Ligação com a Bioenergética: o O₂ é o aceptor final de elétrons da cadeia respiratória."};
  TXT.R2 = {"t": "Quem manda respirar: CO₂ e pH", "s": "o que dispara a respiração é o excesso de gás carbônico, não a falta de oxigênio", "d": "<p>A respiração é controlada por um centro no <b>bulbo</b>, a parte mais baixa do encéfalo (veja Nervoso, organização). Dá para prender a respiração por um tempo, mas não para sempre: o bulbo assume. O que ele mede principalmente não é o O₂, e sim o <b>CO₂</b> e o <b>pH</b> do sangue e do líquido em volta do encéfalo. O CO₂ reage com a água e forma <b>ácido carbônico</b>, que se separa em <b>bicarbonato</b> e íons <b>H⁺</b>: CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻. Quanto mais CO₂, mais H⁺ e <b>menor o pH</b> (sangue mais ácido). A reação no sangue é acelerada pela enzima <b>anidrase carbônica</b>, nas hemácias; é assim, como <b>bicarbonato</b>, que a maior parte do CO₂ viaja até o pulmão.</p><p>No <b>exercício</b>, os músculos fazem mais respiração celular e soltam mais CO₂; o pH do sangue tende a cair; o bulbo percebe e aumenta a <b>frequência e a profundidade</b> da respiração, que joga fora o CO₂ e devolve o pH ao normal, perto de <b>7,4</b>. Se o esforço é muito intenso, os músculos também fazem <b>fermentação lática</b> e o ácido lático ajuda a baixar o pH (ver Bioenergética). Ao contrário, quem <b>respira rápido demais</b> (ansiedade, por exemplo) perde CO₂ demais, e o pH sobe: pode sentir tontura e formigamento. Quem prende a respiração acumula CO₂ e sente uma vontade cada vez mais forte de respirar.</p><p>Também há sensores de <b>O₂</b> em artérias do pescoço e do tórax, que pesam mais em situações extremas. Na <b>altitude</b>, o ar tem a mesma porcentagem de O₂, mas a <b>pressão</b> é menor, então entra menos O₂ a cada respiração. Primeiro, a pessoa respira mais rápido e o coração acelera; em alguns dias a semanas, o rim libera mais <b>eritropoietina</b>, a medula produz <b>mais hemácias</b> e o sangue passa a carregar mais O₂. É a base do treino de atletas em altitude. Pessoas com doenças pulmonares crônicas podem precisar de <b>oxigênio suplementar</b>, sempre com indicação médica.</p>", "enem": "O ponto central: o principal estímulo da respiração é o <b>aumento de CO₂</b> (e a queda do pH), percebido pelo <b>bulbo</b>. Caem questões sobre <b>exercício físico</b> (por que a respiração acelera), <b>altitude</b> (adaptação com mais hemácias, eritropoietina, atletas) e a equação do <b>ácido carbônico</b> ligando CO₂ ao pH."};
  // ===== D1: enzimas e pH ao longo do tubo =====
  const CTD1 = { viagem: RITMO, tubo: NO, cartoes: NO };
  const M1 = mk('d1', CTD1, S => { S.e = 0; S.s = 0; S.pht = 7; S.bile = false; S.fe = false; S.tm = 0; S.run = false; BD1.zera(S); });
  const BD1 = baralho({
    nome: 'd1', alvos: [{ t: 'boca', c: CARB }, { t: 'estômago', c: PROT }, { t: 'duodeno', c: LIP }],
    cartas: [{ t: 'amido', k: 0, t2: 'amido: amilase salivar, vira maltose' }, { t: 'proteínas', k: 1, t2: 'proteínas: pepsina, viram peptídeos' }, { t: 'gorduras', k: 2, t2: 'gorduras: lipase, viram ácidos graxos e glicerol' }, { t: 'ácido clorídrico (HCl)', k: 1, t2: 'HCl: pH cerca de 2, ativa a pepsina' }, { t: 'bile (não é enzima)', k: 2, t2: 'bile: emulsiona a gordura' }, { t: 'bicarbonato do pâncreas', k: 2, t2: 'bicarbonato: neutraliza o ácido' }],
    certo: c => '<b>Certo.</b> ' + c.t2.charAt(0).toUpperCase() + c.t2.slice(1) + '.',
    errado: c => `<b>Ainda não.</b> ${c.t.charAt(0).toUpperCase() + c.t.slice(1)} não começa aí. Lembre: amido na boca, proteínas no estômago e gorduras no duodeno.`,
    fim: () => '<b>Pronto.</b> Cada nutriente tem seu trecho, sua enzima e seu pH.', dica: 'Toque num cartão e depois no lugar certo.'
  });
  const EP = [7, 2, 8], ENZ = ['amilase salivar', 'pepsina', 'lipase pancreática'], SUB = ['amido', 'clara de ovo', 'óleo'], SUBC = [CARB, PROT, LIP];
  const CAPD1 = ['Na <b>boca</b>: pH perto de 7, a <b>amilase salivar</b> começa a quebrar o amido.', 'No <b>estômago</b>: HCl, pH cerca de 2; a pepsina quebra proteínas e a amilase da saliva para.', 'No <b>duodeno</b>: o bicarbonato leva o pH a cerca de 8; a <b>bile</b> (sem enzima) emulsiona a gordura e a lipase age.', 'No <b>delgado</b>: sobram moléculas pequenas, prontas para atravessar a parede.'];
  function viagem(t, S, A) {
    const p = cl((t * .04) % 1.15, 0, 1), ST = [0, .2, .5, .7, 1], nm = ['boca', 'estômago', 'duodeno', NAR ? 'delgado' : 'intestino delgado'], phn = [7, 2, 8, 8];
    const ch = NAR ? 66 : 88, ty = A.y0 + 4, cy = ty + ch / 2, st = p < .2 ? 0 : p < .5 ? 1 : p < .7 ? 2 : 3;
    for (let i = 0; i < 4; i++) { const x = A.x0 + A.w * ST[i], w = A.w * (ST[i + 1] - ST[i]), col = phn[i] < 4 ? '#D9534F' : phn[i] < 7.5 ? '#5FB36A' : '#4F86D9'; rr(x + 1, ty, w - 2, ch, 10, rgba(col, .14), rgba(col, .7), 1.5); title(nm[i], x + w / 2, ty + 12, w - 8, { s: 12, c: C.dim }); }
    const bx = A.x0 + A.w * p, q1 = seg(p, .04, .17), q2 = seg(p, .26, .44), q3 = seg(p, .58, .68), rl = lerp(8, 4, seg(p, .52, .6)), r0 = NAR ? 4 : 5;
    cadeia(bx, cy - 17, 5, r0, CARB, q1, t, 3); cadeia(bx, cy + 2, 4, r0, PROT, q2, t, 5); cadeia(bx, cy + 21, 3, rl * (NAR ? .8 : 1), LIP, q3, t, 8);
    if (p < 1) for (let k = 0; k < 3; k++) { const x = bx - 22 - k * 10; line(x, cy - 10, x + 6, cy, rgba(C.amber, .8 - k * .2), 2); line(x + 6, cy, x, cy + 10, rgba(C.amber, .8 - k * .2), 2); }
    const phv = p < .2 ? 7 : p < .25 ? lerp(7, 2, (p - .2) / .05) : p < .5 ? 2 : p < .55 ? lerp(2, 8, (p - .5) / .05) : 8;
    const ry = ty + ch + 40, rw = NAR ? A.w : A.w * .4; phReg(A.x0 + (NAR ? 0 : 6), ry, rw - (NAR ? 0 : 12), phv, 0, 14, 'pH aqui:');
    const EN = [['amilase salivar: amido (boca)', CARB, .04, .2], ['pepsina e HCl: proteínas (estômago)', PROT, .2, .5], ['bile emulsiona, lipase corta: gorduras (duodeno)', LIP, .5, .7], ['suco entérico: acabamento (delgado)', '#B8C27A', .7, 1]];
    EN.forEach((e, i) => { const on = p >= e[2] && p <= e[3]; etiq(e[0], NAR ? A.x0 : A.x0 + A.w * .46, ry + (NAR ? 52 : -18) + i * 28, e[1], on ? 1 : .35); });
    if (LB) { etiq('peristaltismo (músculo liso)', A.x0, A.y1 - 6, C.amber, .9); }
    cap(CAPD1[st]);
  }
  function tubo(t, S, A) {
    const dt = dtv(S), casa = S.e === S.s, phok = EP[S.e] === S.pht, k = S.fe ? 0 : casa && phok ? .5 * (S.bile && S.e === 2 ? 1.8 : 1) : 0;
    if (S.run) S.tm = Math.min(10, S.tm + dt * S.rt);
    const cw = NAR ? A.w : A.w * .5, bh = NAR ? 36 : 36, lw = NAR ? 62 : 80, g = 6;
    const R = [['Enzima', ENZ.map((n, i) => [n, 'e' + i, S.e === i])], ['Substrato', SUB.map((n, i) => [n, 's' + i, S.s === i, SUBC[i]])], ['pH', [2, 7, 8].map(n => ['pH ' + n, 'p' + n, S.pht === n])]];
    R.forEach((r, i) => { const y = A.y0 + i * (bh + g); mtx(r[0], A.x0, y + bh / 2, { s: 12, a: 'left', c: C.dim }); fila(A.x0 + lw, y, cw - lw, bh, r[1], AM); });
    fila(A.x0, A.y0 + 3 * (bh + g), cw, bh, [['adicionar bile', 'bile', S.bile], ['ferver a enzima', 'ferv', S.fe], ['ligar o relógio', 'go', S.run]], AM);
    const cx = NAR ? A.x0 : A.x0 + A.w * .54, cy = NAR ? A.y0 + 4 * (bh + g) + 4 : A.y0, cwd = NAR ? A.w : A.w * .46, chh = NAR ? A.y1 - cy : A.h;
    panel(cx, cy, cwd, chh); const gx = cx + 46, gy = cy + 24, gw = cwd - 64, gh = chh - 62;
    tx('substrato restante (%)', cx + cwd / 2, cy + 12, { s: 12, c: C.dim });
    line(gx, gy, gx, gy + gh, C.line, 1.5); line(gx, gy + gh, gx + gw, gy + gh, C.line, 1.5); tx('100', gx - 16, gy, { s: 12, f: FD, c: C.dim }); tx('0', gx - 12, gy + gh, { s: 12, f: FD, c: C.dim }); tx('tempo', gx + gw / 2, gy + gh + 16, { s: 12, c: C.dim });
    const col = SUBC[S.s]; X.beginPath(); for (let i = 0; i <= 40; i++) { const u = i / 40 * S.tm, y = gy + gh * (1 - Math.exp(-k * u)); i ? X.lineTo(gx + gw * u / 10, y) : X.moveTo(gx + gw * u / 10, y); } X.strokeStyle = col; X.lineWidth = 3; X.stroke();
    const rem = Math.exp(-k * S.tm); circ(gx + gw * S.tm / 10, gy + gh * (1 - rem), 5, col, '#0B0F1C', 1.5);
    const tx0 = cx + 14; rr(tx0 - 6, gy, 12, gh, 4, 'rgba(11,15,28,.6)', C.line, 1.2); rr(tx0 - 6, gy + gh * (1 - rem), 12, gh * rem, 4, rgba(col, .8));
    mtx(S.run || S.tm > 0 ? 'restam cerca de ' + Math.round(rem * 100) + '%' : 'ligue o relógio', gx + gw / 2, gy + gh * .4, { s: 14, w: 700, c: C.txt });
    cap(S.fe ? 'A enzima <b>fervida</b> desnatura e não funciona, mesmo no substrato e no pH certos.' : !casa ? 'Essa enzima <b>não corta esse substrato</b>: cada enzima tem o seu substrato.' : !phok ? `A enzima encaixa, mas <b>pH ${S.pht} não é o ótimo</b> dela: quase nada acontece.` : S.bile && S.e === 2 ? 'Com <b>bile</b> a gordura vira gotinhas e a lipase acha mais superfície: a digestão fica mais rápida.' : 'Substrato, enzima e pH combinam: a digestão acontece.');
  }
  def('digestorio', 'enzimas', {
    t: TXT.D1.t, s: TXT.D1.s, c: '#F2A65A', loc: S => ({ viagem: 'Viagem do sanduíche', tubo: 'Tubo de ensaio', cartoes: 'Onde cada coisa começa' })[S.modo] || '', locNota: NOTA,
    alt: 'um bolo alimentar desce pelo tubo com o pH de cada trecho, uma bancada de tubos de ensaio e cartões de classificação', still: 14,
    get ctl() { return M1.ctl(); }, ctlVis: M1.vis, extra: [M1.extra('viagem', 'Viagem do sanduíche'), M1.extra('tubo', 'Tubo de ensaio'), M1.extra('cartoes', 'Onde cada coisa começa')],
    init: M1.init, d: TXT.D1.d + '<p>Em "Viagem do sanduíche", acompanhe o pH e as enzimas de cada trecho. Em "Tubo de ensaio", escolha enzima, substrato e pH. Em "Onde cada coisa começa", arraste os cartões.</p>',
    enem: TXT.D1.enem, kv: [['Boca', 'pH cerca de 7, amilase salivar'], ['Estômago', 'pH cerca de 2, pepsina'], ['Duodeno', 'pH cerca de 8, enzimas do pâncreas'], ['Temperatura', 'cerca de 37 °C']], links: [LK.biomol, LK.revestimento, LK.folhetos],
    tap(x, y, S) {
      if (S.modo === 'cartoes') { BD1.tap(x, y, S); return; } if (S.modo !== 'tubo' || !toque(S)) return; const h = hitAt(x, y); if (typeof h !== 'string') return;
      const a = h[0], n = +h.slice(1);
      if (a === 'e') S.e = n; else if (a === 's') S.s = n; else if (a === 'p') S.pht = n; else if (h === 'bile') S.bile = !S.bile; else if (h === 'ferv') S.fe = !S.fe; else if (h === 'go') { S.run = true; S.tm = 0; S.rt = 1; return; }
      S.tm = 0; S.run = false;
    },
    grab(x, y, S) { return S.modo === 'cartoes' && BD1.grab(x, y, S); }, grabMove(x, y, S) { BD1.grabMove(x, y, S); }, grabEnd(x, y, S) { BD1.grabEnd(x, y, S); },
    draw(t, S) { const A = area(); if (S.modo === 'viagem') viagem(t, S, A); else if (S.modo === 'tubo') { S.rt = S.rt || 1; tubo(t, S, A); } else { BD1.draw(S, { x0: A.x0, y0: A.y0, x1: A.x1, y1: A.y1 }, { cols: NAR ? 2 : 3, cartaH: NAR ? 38 : 42 }); cap(BD1.msg(S) || 'Seis cartões: encaixe cada um no trecho onde ele aparece.'); } }
  });

  // ===== D2: absorção, fígado e pâncreas =====
  const ZN = ['Tubo com dobras', 'Uma vilosidade', 'Célula com microvilosidades'];
  const CTD2 = { zoom: { l: 'Zoom', min: 0, max: 2, step: 1, v: 0, f: v => ZN[v], rate: () => 1 }, alf: NO, hor: NO };
  const M2 = mk('d2', CTD2, S => { BD2.zera(S); S.est = null; S.hor = null; S.rs = 0; });
  const BD2 = baralho({
    nome: 'd2', alvos: [{ t: 'guardar como glicogênio', c: CARB }, { t: 'virar ureia', c: '#C9A227' }, { t: 'desativar', c: '#C58BE8' }, { t: 'fazer proteínas do plasma', c: PROT }, { t: 'guardar (reserva)', c: LIP }],
    cartas: [{ t: 'glicose em excesso', k: 0, ic: null }, { t: 'amônia (tóxica)', k: 1 }, { t: 'álcool', k: 2 }, { t: 'aminoácidos', k: 3 }, { t: 'ferro e vitaminas', k: 4 }],
    certo: c => c.k === 1 ? '<b>Certo.</b> O fígado transforma a amônia em <b>ureia</b>, que o sangue leva ao rim (veja o tópico do néfron).' : '<b>Certo.</b> É função do fígado.', errado: c => `<b>Ainda não.</b> Pense no que o fígado faz com ${c.t}.`,
    fim: () => '<b>Pronto.</b> O fígado é a alfândega: tudo o que vem do intestino passa por ele antes do coração.', dica: 'Toque num passageiro e depois na porta certa.'
  });
  const AREA = [['liso', 'cerca de 0,3 m²', .3], ['com dobras', 'cerca de 1 m²', 1], ['com vilosidades', 'cerca de 10 m²', 10], ['com microvilosidades', 'cerca de 200 m², uma quadra de tênis', 200]];
  function zoomV(t, S, A) {
    const z = S.v, wide = !NAR, r = wide ? { x: A.x0, y: A.y0, w: A.w * .6, h: A.h } : { x: A.x0, y: A.y0, w: A.w, h: A.h * .66 }, cx = r.x + r.w / 2;
    rr(r.x, r.y, r.w, r.h, 12, 'rgba(19,26,43,.5)', C.line, 1);
    const flow = (n, f) => { for (let i = 0; i < n; i++) f(fr(t * .18 + i / n), i); }, cor = i => i % 3 === 0 ? CARB : i % 3 === 1 ? PROT : LIP;
    if (z === 0) {
      const wh = r.h * .17, ly = r.y + 8 + wh, hy = r.y + r.h - 8 - wh;
      rr(r.x + 8, r.y + 8, r.w - 16, wh, 8, rgba(PROT, .22), PROT, 1.5); rr(r.x + 8, r.y + r.h - 8 - wh, r.w - 16, wh, 8, rgba(PROT, .22), PROT, 1.5);
      for (let i = 0; i < 7; i++) { const x = r.x + 26 + i * (r.w - 52) / 6; ell(x, ly, 16, r.h * .1, 0, rgba(PROT, .22), PROT, 1.5); ell(x, hy, 16, r.h * .1, 0, rgba(PROT, .22), PROT, 1.5); }
      flow(16, (u, i) => circ(r.x + 16 + u * (r.w - 32), r.y + r.h / 2 + Math.sin(u * 9 + i) * r.h * .1, 4.5, cor(i), 'rgba(11,15,28,.6)', 1)); mtx('luz do intestino', cx, r.y + r.h / 2 + r.h * .22, { s: 12, c: C.dim });
      lab(r.x + 26 + 3 * (r.w - 52) / 6, ly + r.h * .1, r.x + r.w * .35, r.y + r.h * .5 + 4, 'dobra');
    } else if (z === 1) {
      const vw = r.w * .3, vx = cx - vw / 2, vt = r.y + r.h * .12, vh = r.h * .76;
      rr(vx, vt, vw, vh, vw / 2, rgba(PROT, .16), PROT, 2.5);
      line(cx - vw * .22, vt + vh - 6, cx - vw * .22, vt + vw * .45, ART, 5); line(cx + vw * .22, vt + vh - 6, cx + vw * .22, vt + vw * .45, ART, 5); qarrow(cx - vw * .22, vt + vw * .45, cx, vt + vw * .1, cx + vw * .22, vt + vw * .45, ART, 5);
      line(cx, vt + vh - 6, cx, vt + vw * .4, QUI, 6);
      flow(14, (u, i) => { const L = i % 3 === 2, sx = r.x + 20, ex = L ? cx : cx - vw * .22, y = vt + vh * (.2 + (i * 37 % 60) / 100) ; circ(lerp(sx, ex, seg(u, 0, .8)), y + Math.sin(u * 7 + i) * 3, 4.5, cor(i), 'rgba(11,15,28,.6)', 1); });
      lab(vx + vw, vt + vh * .3, vx + vw + 40, vt + vh * .22, 'vilosidade'); lab(cx + vw * .22, vt + vh * .55, cx + vw * .7, vt + vh * .5, 'capilar sanguíneo'); lab(cx, vt + vh * .8, cx + vw * .7, vt + vh * .78, 'quilífero (vaso linfático)');
    } else {
      const w = r.w * .26, x0 = cx - w / 2, y0 = r.y + r.h * .24, h = r.h * .46;
      for (let i = 0; i < 12; i++) line(x0 + 6 + i * (w - 12) / 11, y0, x0 + 6 + i * (w - 12) / 11, y0 - 14, PROT, 3);
      rr(x0, y0, w, h, 10, rgba(PROT, .16), PROT, 2); ell(cx, y0 + h * .62, w * .22, h * .16, 0, rgba('#9A6BFF', .5), '#9A6BFF', 1.5);
      rr(r.x + 14, r.y + r.h * .84, r.w - 28, 14, 7, rgba(ART, .25), ART, 1.5); for (let i = 0; i < 5; i++) circ(r.x + 30 + fr(t * .1 + i / 5) * (r.w - 60), r.y + r.h * .84 + 7, 4, ART);
      flow(12, (u, i) => { const x = x0 + 12 + (i * 29 % 100) / 100 * (w - 24); circ(x, r.y + r.h * .12 + u * (r.y + r.h * .84 - r.y - r.h * .12), 4.5, cor(i), 'rgba(11,15,28,.6)', 1); });
      lab(cx + w / 2 - 6, y0 - 8, cx + w, y0 - 36, 'microvilosidades'); lab(x0 + w, y0 + h * .6, x0 + w + 40, y0 + h * .55, 'célula da vilosidade'); lab(r.x + r.w * .8, r.y + r.h * .84, r.x + r.w * .8, r.y + r.h * .74, 'capilar');
    }
    const px = wide ? r.x + r.w + 12 : A.x0, py = wide ? A.y0 : r.y + r.h + 8, pw = wide ? A.w - r.w - 12 : A.w, ph = wide ? A.h : A.y1 - py;
    panel(px, py, pw, ph); head('Superfície de absorção', px + 12, py + 18, AM);
    AREA.forEach((a, i) => { const on = i <= z + 1 && !(i === 0 && false), y = py + 44 + i * ((ph - 56) / 4), bw = (pw - 24) * (Math.log10(a[2] * 4) / Math.log10(800)); rr(px + 12, y + 6, Math.max(8, bw), 8, 4, rgba(i === 3 ? AM : CARB, on ? .85 : .2)); mtx(a[0] + ': ' + a[1], px + 12, y - 4, { s: 12, w: on ? 600 : 400, a: 'left', c: on ? C.txt : C.dim }); });
    cap(['A parede do delgado tem <b>dobras</b>: o primeiro passo para ganhar superfície.', 'Cada dobra tem <b>vilosidades</b>: capilares levam glicose e aminoácidos; o <b>quilífero</b> leva os lipídios pela linfa.', 'Cada célula tem <b>microvilosidades</b>: a superfície total chega perto de uma quadra de tênis.'][z]);
  }
  const HOR = { comida: ['chega comida ao estômago', 'gastrina'], acido: ['chega quimo ácido ao duodeno', 'secretina'], gordura: ['chega gordura ao duodeno', 'cck'] }, HN = { gastrina: 'gastrina', secretina: 'secretina', cck: 'colecistocinina (CCK)' };
  function horm(t, S, A) {
    const dt = dtv(S); if (S.hor && HOR[S.est] && HOR[S.est][1] === S.hor) S.rs = Math.min(1, S.rs + dt * .5);
    const ok = S.est && S.hor && HOR[S.est][1] === S.hor, cw = (A.w - 3 * 8) / 4, oh = NAR ? 44 : 64, O = [['estômago', 'gastrina', 'suco gástrico'], ['duodeno', null, ''], ['pâncreas', 'secretina', 'bicarbonato e enzimas'], ['vesícula biliar', 'cck', 'bile']];
    const rows = NAR ? 2 : 1, ow = NAR ? (A.w - 8) / 2 : cw;
    O.forEach((o, i) => { const x = A.x0 + (NAR ? (i % 2) * (ow + 8) : i * (cw + 8)), y = A.y0 + (NAR ? Math.floor(i / 2) * (oh + 8) : 0); const on = ok && ((S.hor === 'gastrina' && i === 0) || (S.hor === 'secretina' && i === 2) || (S.hor === 'cck' && (i === 3 || i === 2)));
      rr(x, y, ow, oh, 10, rgba(on ? AM : '#9DA9C4', on ? .2 : .08), on ? AM : C.line, on ? 2.5 : 1.3); tx(o[0], x + ow / 2, y + oh * .35, { s: NAR ? 13 : 15, w: 700, c: C.txt }); if (on) { tx(o[2], x + ow / 2, y + oh * .72, { s: 12, c: AM }); for (let k = 0; k < 4; k++) circ(x + ow * (.2 + k * .2), y + oh - 6 + Math.sin(t * 5 + k) * 2, 2.5, AM); } });
    const y1 = A.y0 + rows * (oh + 8) + 8, bh = NAR ? 40 : 38; mtx('1. O que chega ao tubo?', A.x0, y1 + 4, { s: 13, w: 700, a: 'left', c: C.dim });
    fila(A.x0, y1 + 16, A.w, bh, Object.keys(HOR).map(k => [HOR[k][0], 'z:' + k, S.est === k]), CARB);
    const y2 = y1 + 16 + bh + 12; mtx('2. Qual hormônio é liberado?', A.x0, y2 + 4, { s: 13, w: 700, a: 'left', c: C.dim });
    fila(A.x0, y2 + 16, A.w, bh, Object.keys(HN).map(k => [HN[k], 'h:' + k, S.hor === k]), PROT);
    cap(!S.est ? 'Escolha o que chega ao tubo.' : !S.hor ? 'Agora escolha o hormônio que o tubo libera no sangue.' : ok ? ({ gastrina: '<b>Gastrina</b> estimula o estômago a fazer suco gástrico.', secretina: '<b>Secretina</b> manda o pâncreas soltar bicarbonato, que neutraliza o ácido.', cck: '<b>Colecistocinina</b> contrai a vesícula biliar (bile) e estimula as enzimas do pâncreas.' })[S.hor] : '<b>Ainda não.</b> Esse hormônio não responde a esse estímulo; tente outro.');
  }
  def('digestorio', 'absorcao', {
    t: TXT.D2.t, s: TXT.D2.s, c: '#F2A65A', loc: S => ({ zoom: 'Zoom na vilosidade', alf: 'A alfândega', hor: 'Quem chama quem' })[S.modo] || '', locNota: NOTA,
    alt: 'três níveis de zoom no intestino delgado, o fígado como alfândega e os hormônios do tubo', still: 14,
    get ctl() { return M2.ctl(); }, ctlVis: M2.vis, extra: [M2.extra('zoom', 'Zoom na vilosidade'), M2.extra('alf', 'A alfândega'), M2.extra('hor', 'Quem chama quem')],
    init: M2.init, d: TXT.D2.d + '<p class="nota">Conteúdo educativo, não substitui orientação médica.</p>', enem: TXT.D2.enem,
    kv: [['Intestino delgado', 'cerca de 6 a 7 m no adulto'], ['Superfície', 'perto de uma quadra de tênis'], ['Fígado', 'glicogênio, bile, ureia, desintoxicação']], links: [LK.revestimento, LK.glandular, LK.comparar],
    tap(x, y, S) {
      if (S.modo === 'alf') { BD2.tap(x, y, S); return; } if (S.modo !== 'hor' || !toque(S)) return; const h = hitAt(x, y); if (typeof h !== 'string') return;
      if (h[0] === 'z') { S.est = h.slice(2); S.hor = null; S.rs = 0; } else if (h[0] === 'h') S.hor = h.slice(2);
    },
    grab(x, y, S) { return S.modo === 'alf' && BD2.grab(x, y, S); }, grabMove(x, y, S) { BD2.grabMove(x, y, S); }, grabEnd(x, y, S) { BD2.grabEnd(x, y, S); },
    draw(t, S) {
      const A = area(); if (S.modo === 'zoom') zoomV(t, S, A); else if (S.modo === 'hor') horm(t, S, A);
      else { mtx('Veia porta: o sangue do intestino chega ao fígado com cinco passageiros', A.x0, A.y0 + 8, { s: NAR ? 12 : 14, w: 600, a: 'left', c: C.dim }); BD2.draw(S, { x0: A.x0, y0: A.y0 + 26, x1: A.x1, y1: A.y1 }, { cols: NAR ? 2 : 5, cartaH: NAR ? 38 : 42 }); cap(BD2.msg(S) || 'Leve cada passageiro até a porta certa do fígado.'); }
    }
  });

  // ===== R1: hematose =====
  const COL = ['nenhum', 'pouco', 'médio', 'muito', 'altíssimo'];
  const CTR1 = { fole: { l: 'Diafragma', min: 0, max: 1, step: .05, v: 0, f: v => v < .1 ? 'relaxado' : v > .9 ? 'contraído' : nbr(v * 100) + '%', rate: () => 1 }, alv: RITMO, co: { l: 'CO no ar', min: 0, max: 4, step: 1, v: 0, f: v => COL[v], rate: () => 1 } };
  const M3 = mk('r1', CTR1, S => { S.vs = 0; S.fl = 0; });
  function fole(t, S, A) {
    const dt = Math.max(dtv(S), .016), pv = S.vs || 0; if (!S.paused) S.vs = pv + (S.v - pv) * (1 - Math.exp(-6 * dt)); const dv = (S.vs - pv) / dt; S.fl = lerp(S.fl || 0, cl(dv * 1.5, -1, 1), .2);
    const jw = Math.min(NAR ? A.w * .52 : A.w * .3, 240), jx = A.x0 + (NAR ? 6 : A.w * .08), jt = A.y0 + 40, jh = A.h - 78, jb = jt + jh, mx = jx + jw / 2, vs = S.vs;
    rr(jx, jt, jw, jh, 14, 'rgba(110,200,232,.06)', 'rgba(223,230,245,.55)', 2); rr(mx - 7, A.y0 + 2, 14, jt - A.y0 + 22, 4, 'rgba(19,26,43,.9)', '#C9D4EA', 1.5);
    const by = jt + jh * .4, rx = jw * (.2 + .1 * vs), ry = jh * (.2 + .13 * vs); line(mx, jt + 10, mx, by - ry, '#C9D4EA', 3); ell(mx, by, rx, ry, 0, rgba(PROT, .35), PROT, 2.5);
    X.beginPath(); X.moveTo(jx, jb); X.quadraticCurveTo(mx, jb + 6 + 30 * vs, jx + jw, jb); X.strokeStyle = '#C9A227'; X.lineWidth = 5; X.stroke(); const kp = qpt(jx, jb, mx, jb + 6 + 30 * vs, jx + jw, jb, .5); line(kp[0], kp[1], kp[0], kp[1] + 14, '#C9A227', 3); circ(kp[0], kp[1] + 20, 7, '#C9A227', '#0B0F1C', 1.5);
    if (Math.abs(S.fl) > .12) for (let i = 0; i < 6; i++) { const u = fr(t * .9 + i / 6), y = lerp(A.y0 - 6, by - ry, S.fl > 0 ? u : 1 - u); circ(mx + Math.sin(i * 2 + t * 3) * 3, y, 3.2, rgba('#DDE6F7', Math.abs(S.fl)), null); }
    lab(mx + 7, A.y0 + 10, mx + jw * .8, A.y0 + 22, 'traqueia'); lab(mx + rx * .7, by, mx + jw * .9, by - 20, 'pulmão (balão)'); lab(kp[0] + 22, jb + 8 + 15 * vs, mx + jw * .8, jb + 20, 'diafragma'); lab(jx + jw, jt + jh * .8, jx + jw + 30, jt + jh * .74, 'caixa torácica');
    const gx = NAR ? jx + jw + 14 : jx + jw + 60, gw = Math.min(A.x1 - gx, 340), gy = A.y0 + A.h * .32; if (gw > 90) {
      panel(gx - 8, gy - 38, gw + 16, 150); mtx('pressão no pulmão em relação à de fora', gx + gw / 2, gy - 22, { s: 12, c: C.dim }); rr(gx, gy, gw, 14, 7, 'rgba(11,15,28,.7)', C.line, 1.2); line(gx + gw / 2, gy - 4, gx + gw / 2, gy + 18, C.txt, 1.5);
      const pp = -cl(S.fl, -1, 1); rr(pp < 0 ? gx + gw / 2 + pp * gw / 2 : gx + gw / 2, gy + 2, Math.abs(pp) * gw / 2, 10, 4, pp < 0 ? O2C : AM); tx('menor', gx + 22, gy + 30, { s: 12, c: C.dim }); tx('maior', gx + gw - 22, gy + 30, { s: 12, c: C.dim });
      mtx(S.fl > .12 ? '<b>inspiração</b>: volume sobe, pressão cai' : S.fl < -.12 ? '<b>expiração</b>: volume cai, pressão sobe' : 'ar parado', gx + gw / 2, gy + 56, { s: 13, c: C.txt }); mtx(NAR ? 'o ar vai da pressão maior para a menor' : 'o ar sempre vai do lugar de maior pressão para o de menor', gx + gw / 2, gy + 84, { s: 12, c: C.dim });
    }
    cap(S.fl > .12 ? '<b>Inspiração</b>: o diafragma desce, o volume aumenta, a pressão interna fica menor que a de fora e o ar entra.' : S.fl < -.12 ? '<b>Expiração</b>: o diafragma sobe, o volume diminui, a pressão fica maior que a de fora e o ar sai.' : 'Mova a faixa do diafragma: puxe para baixo (contraído) e solte.');
  }
  function alveolo(t, S, A) {
    const R = Math.min(A.h * .34, A.w * (NAR ? .36 : .22)), cx = NAR ? A.cx : A.x0 + A.w * .4, cy = A.y0 + R + 6, by = cy + R + 40, x0 = A.x0 + 6, x1 = A.x1 - 6;
    ell(cx, cy, R * 1.3, R, 0, 'rgba(110,200,232,.08)', 'rgba(223,230,245,.6)', 2.5); rr(x0, by - 17, x1 - x0, 34, 17, 'rgba(229,72,77,.08)', 'rgba(229,72,77,.5)', 1.5);
    for (let i = 0; i < 7; i++) { const u = fr(t * .06 + i / 7), x = lerp(x0 + 14, x1 - 14, u), c = mix(VEN, ART, seg(u, .15, .7)); ell(x, by, 11, 8, 0, c, 'rgba(11,15,28,.6)', 1); }
    for (let i = 0; i < 10; i++) { const u = fr(t * .3 + i * .1), ex = lerp(x0 + 14, x1 - 14, fr(t * .06 + (i % 7) / 7)); circ(lerp(cx + Math.cos(i * 2.3) * R, ex, u), lerp(cy + Math.sin(i * 2.3) * R * .6, by - 4, u), 3.6, O2C, 'rgba(11,15,28,.6)', .8); }
    for (let i = 0; i < 8; i++) { const u = fr(t * .3 + i * .125 + .3), sx = lerp(x0 + 14, x1 - 14, fr(t * .06 + (i % 7) / 7)); circ(lerp(sx, cx + Math.cos(i * 1.7) * R * .8, u), lerp(by + 4, cy + Math.sin(i * 1.7) * R * .5, u), 3.6, CO2C, 'rgba(11,15,28,.6)', .8); }
    etiq('O₂', x0, A.y1 - 16, O2C); etiq('CO₂', x0 + 64, A.y1 - 16, CO2C); etiq('venoso', x0 + 140, by + 38, VEN); etiq('arterial', x1 - 100, by + 38, ART);
    lab(cx - R * 1.1, cy - R * .2, x0 + 50, cy - R * .5, 'alvéolo (ar)'); lab(cx, cy + R, cx + R * 1.6, cy + R + 20, 'parede de uma só camada'); lab(x0 + 40, by, x0 + 30, by - 38, 'capilar');
    cap('Na <b>hematose</b>, o O₂ passa do ar para o sangue e o CO₂ do sangue para o ar, por <b>difusão</b>: do lugar com mais gás para o lugar com menos. O sangue entra venoso e sai arterial.');
  }
  function monox(t, S, A) {
    const f = S.v / 4 * .85, nH = 3, hw = Math.min(150, (A.w - 40) / 3), hy = A.y0 + A.h * .3;
    for (let h = 0; h < nH; h++) { const x = A.x0 + A.w / 2 + (h - 1) * (hw + 14), r = hw * .44; circ(x, hy, r, rgba(ART, .2), ART, 2);
      for (let k = 0; k < 4; k++) { const a = k / 4 * TAU + .8, sx = x + Math.cos(a) * r * .55, sy = hy + Math.sin(a) * r * .55, co = (k + h * 4) / 12 < f; circ(sx, sy, r * .2, co ? '#2E3342' : O2C, co ? '#9DA9C4' : 'rgba(11,15,28,.6)', co ? 2 : 1); tx(co ? 'CO' : 'O₂', sx, sy, { s: 12, w: 700, c: co ? '#E8EDF7' : '#0B0F1C', bg: false }); }
      mtx('hemácia', x, hy + r + 12, { s: 12, c: C.dim }); }
    for (let i = 0; i < S.v * 6; i++) { const u = fr(t * .2 + i * .17), x = A.x0 + A.w * ((i * .37) % 1); circ(x, A.y0 + 8 + u * A.h * .12, 4, '#2E3342', '#9DA9C4', 1.5); }
    const ent = 1 - f, my = A.y0 + A.h * .66, mw = Math.min(A.w - 20, 420), mxx = A.cx - mw / 2; mtx('O₂ entregue aos tecidos (valor ilustrativo)', A.cx, my - 14, { s: 13, w: 600, c: C.txt }); rr(mxx, my, mw, 18, 9, 'rgba(11,15,28,.7)', C.line, 1.2); rr(mxx, my, mw * ent, 18, 9, ent > .6 ? O2C : ent > .35 ? AM : '#D9534F');
    mtx('cerca de ' + Math.round(ent * 100) + '% do normal', A.cx, my + 34, { s: 14, w: 700, f: FD });
    cap(S.v === 0 ? 'Sem CO, a hemoglobina leva O₂. Aumente o CO no ar.' : '<b>O CO gruda na hemoglobina com força muito maior que o O₂</b> e não solta: sobra menos lugar para o O₂. Em lugar fechado, isso é perigoso.');
  }
  def('respiratorio', 'hematose', {
    t: TXT.R1.t, s: TXT.R1.s, c: '#6EC8E8', loc: S => ({ fole: 'Fole: o diafragma', alv: 'Um alvéolo', co: 'Monóxido de carbono' })[S.modo] || '', locNota: NOTA,
    alt: 'um frasco com balão e diafragma, um alvéolo com capilar e as hemácias com monóxido de carbono', still: 6,
    get ctl() { return M3.ctl(); }, get auto() { return MD.r1 === 'fole' ? .25 : 0; }, ctlVis: M3.vis, extra: [M3.extra('fole', 'Fole'), M3.extra('alv', 'Um alvéolo'), M3.extra('co', 'Monóxido')],
    init: M3.init, d: TXT.R1.d + '<p>Em "Fole", mova o diafragma. Em "Monóxido", aumente o CO no ar e veja a hemoglobina.</p>', enem: TXT.R1.enem,
    kv: [['Alvéolos', 'cerca de 300 milhões por adulto'], ['Troca de gases', 'difusão, sem gasto de energia'], ['Gás que sufoca', 'monóxido de carbono (CO)']], links: [LK.respcel, LK.sangue, LK.comparar],
    draw(t, S) { const A = area(); if (S.modo === 'fole') fole(t, S, A); else if (S.modo === 'alv') alveolo(t, S, A); else monox(t, S, A); }
  });

  // ===== R2: CO2 e pH =====
  const ALT = v => nbr(v) + ' m';
  const CTR2 = { bal: { l: 'CO₂ no sangue', min: 0, max: 4, step: 1, v: 2, f: v => ['muito baixo', 'baixo', 'normal', 'alto', 'muito alto'][v], rate: () => 1 }, est: { l: 'Esforço', min: 0, max: 3, step: 1, v: 0, f: v => ['repouso', 'caminhada', 'corrida', 'tiro'][v], rate: () => 1 }, mon: { l: 'Altitude', min: 0, max: 5000, step: 500, v: 0, f: ALT, rate: () => 1 } };
  const M4 = mk('r2', CTR2, S => { S.co2 = 40; S.fr = 12; S.fc = 70; S.hold = false; S.fast = false; S.H = { co2: [], ph: [], fr: [], fc: [] }; S.tt = 0; S.dias = 0; });
  function balanca(t, S, A) {
    const v = S.v, a = (v - 2) * .08, cx = A.cx, cy = A.y0 + A.h * .45, d = Math.min(A.w * .42, 300);
    mtx('CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻', cx, A.y0 + 12, { s: NAR ? 14 : 17, w: 700, f: FD });
    const L = [cx - d * Math.cos(a), cy - d * Math.sin(a)], Rr = [cx + d * Math.cos(a), cy + d * Math.sin(a)];
    X.beginPath(); X.moveTo(cx, cy); X.lineTo(cx - 14, cy + 40); X.lineTo(cx + 14, cy + 40); X.closePath(); X.fillStyle = '#4A5878'; X.fill(); line(L[0], L[1], Rr[0], Rr[1], '#C9D4EA', 6);
    const nL = 6 - v, nR = 1 + v; for (let i = 0; i < nL; i++) circ(L[0] + 14 + (i % 3) * 16 + Math.sin(t * 2 + i) * 2, L[1] - 12 - Math.floor(i / 3) * 16, 6, CO2C, '#0B0F1C', 1);
    for (let i = 0; i < nR; i++) { const x = Rr[0] - 50 + (i % 4) * 16, y = Rr[1] - 12 - Math.floor(i / 4) * 16; circ(x, y, 5.5, AM, '#0B0F1C', 1); tx('+', x, y, { s: 12, w: 700, c: '#0B0F1C', bg: false }); }
    etiq('CO₂', L[0] - 4, L[1] + 18, CO2C); etiq('H⁺ (ácido)', Rr[0] - 80, Rr[1] + 18, AM); if (!NAR) etiq('anidrase carbônica: acelera a reação na hemácia', cx - 160, cy + 62, '#9A6BFF');
    phReg(A.cx - Math.min(A.w * .4, 260), A.y1 - 34, Math.min(A.w * .8, 520), 7.6 - .1 * v, 6.8, 7.8, 'pH do sangue');
    cap(v === 2 ? 'Com CO₂ normal, o pH do sangue fica perto de <b>7,4</b>.' : v > 2 ? 'Mais <b>CO₂</b> forma mais H⁺: o pH <b>cai</b> (sangue mais ácido) e o bulbo manda respirar mais.' : 'Menos CO₂, menos H⁺: o pH <b>sobe</b>. É o que acontece quem respira rápido demais.');
  }
  function graf(x, y, w, h, nome, arr, mn, mx, col, val) {
    panel(x, y, w, h, { r: 8 }); mtx(nome, x + 8, y + 10, { s: 12, w: 600, a: 'left', c: col }); mtx(val, x + w - 8, y + 10, { s: 12, w: 700, a: 'right', c: C.txt, f: FD });
    X.beginPath(); arr.forEach((q, i) => { const px = x + 6 + i / 119 * (w - 12), py = y + h - 6 - seg(q, mn, mx) * (h - 28); i ? X.lineTo(px, py) : X.moveTo(px, py); }); X.strokeStyle = col; X.lineWidth = 2.2; X.stroke();
  }
  function esteira(t, S, A) {
    const dt = dtv(S), e = S.v, c2T = S.fast ? 26 : [40, 43, 48, 55][e], fcT = [70, 100, 150, 180][e] + (S.fast ? 15 : 0);
    if (dt > 0) {
      if (S.hold) { S.co2 += dt * 2.2; S.fr = lerp(S.fr, 0, .2); if (S.co2 >= 56) { S.hold = false; S.fr = 34; } } else { S.co2 += (c2T - S.co2) * (1 - Math.exp(-dt / 5)); const frT = S.fast ? 42 : cl(12 + (S.co2 - 40) * 2.4, 12, 48); S.fr += (frT - S.fr) * (1 - Math.exp(-dt / 1.5)); }
      S.fc += (fcT - S.fc) * (1 - Math.exp(-dt / 3)); S.tt += dt; if (S.tt > .15) { S.tt = 0; const ph = 7.4 - (S.co2 - 40) * .012; ['co2', 'ph', 'fr', 'fc'].forEach((k, i) => { S.H[k].push([S.co2, ph, S.fr, S.fc][i]); if (S.H[k].length > 120) S.H[k].shift(); }); }
    }
    const ph = 7.4 - (S.co2 - 40) * .012, wide = !NAR, gw = wide ? (A.w * .62 - 8) / 2 : A.w, gh = wide ? (A.h - 8) / 2 : (A.h - 150 - 18) / 4, gx = wide ? A.x0 + A.w * .38 : A.x0, gy = wide ? A.y0 : A.y0 + 150 + 6;
    const G = [['CO₂ no sangue', S.H.co2, 20, 65, CO2C, 'cerca de ' + Math.round(S.co2) + ' mmHg'], ['pH', S.H.ph, 7.1, 7.7, AM, nbr(ph, 2)], ['respirações por minuto', S.H.fr, 0, 50, O2C, Math.round(S.fr)], ['batimentos por minuto', S.H.fc, 50, 200, ART, Math.round(S.fc)]];
    G.forEach((g, i) => graf(wide ? gx + (i % 2) * (gw + 8) : gx, wide ? gy + Math.floor(i / 2) * (gh + 8) : gy + i * (gh + 6), gw, gh, g[0], g[1], g[2], g[3], g[4], g[5]));
    const sx = wide ? A.x0 + A.w * .16 : A.cx, sh = wide ? A.h * .62 : 100, sy = wide ? A.y0 + A.h * .4 : A.y0 + 62; silhueta(sx, sy, sh, '#C9D4EA'); const br = Math.sin(t * Math.max(.4, S.fr / 60 * TAU)) * .5 + .5; circ(sx, sy - sh * .12, sh * .06 + br * 4, rgba(O2C, .4), O2C, 1.5); circ(sx + sh * .05, sy - sh * .02, sh * .03 + (Math.sin(t * S.fc / 60 * TAU) * .5 + .5) * 3, ART);
    const by = sy + sh * .5 + 6; rr(sx - sh * .4, by, sh * .8, 8, 4, '#33405E'); for (let i = 0; i < 8; i++) line(sx - sh * .4 + fr(t * .3 * (e + 1) * .5 + i / 8) * sh * .8, by + 1, sx - sh * .4 + fr(t * .3 * (e + 1) * .5 + i / 8) * sh * .8, by + 7, '#9DA9C4', 1.5);
    cap(S.hold ? '<b>Prender a respiração</b>: o CO₂ sobe e, quando passa de um limite, o bulbo assume e o corpo respira sozinho.' : S.fast ? '<b>Respirar rápido demais</b> joga fora CO₂: o pH sobe, e dá tontura e formigamento.' : e === 0 ? 'Em repouso o CO₂ está estável. Aumente o esforço: o CO₂ sobe primeiro e a respiração responde logo depois.' : 'Mais esforço, mais respiração celular, mais CO₂: o bulbo percebe e aumenta a frequência da respiração.');
  }
  function montanha(t, S, A) {
    const dt = dtv(S), alt = S.v, p = Math.exp(-alt / 8000), acl = seg(S.dias, 0, 25) * seg(alt, 1000, 4500); if (alt > 0) S.dias = Math.min(30, S.dias + dt * 2); else S.dias = Math.max(0, S.dias - dt * 4);
    const wide = !NAR, mw = wide ? A.w * .4 : A.w, mh = wide ? A.h : A.h * .36; const bx = A.x0, by = A.y0 + mh;
    X.beginPath(); X.moveTo(bx, by); X.lineTo(bx + mw * .5, A.y0 + 6); X.lineTo(bx + mw, by); X.closePath(); X.fillStyle = 'rgba(90,110,150,.25)'; X.fill(); X.strokeStyle = C.line; X.lineWidth = 1.5; X.stroke();
    const f = alt / 5000; circ(bx + mw * (.05 + .45 * f), by - (by - A.y0 - 6) * f - 6, 7, AM, '#0B0F1C', 1.5); mtx(ALT(alt), bx + mw * .5, by + 12, { s: 13, w: 700, f: FD });
    const px = wide ? bx + mw + 20 : A.x0, py = wide ? A.y0 : by + 28, pw = wide ? A.w - mw - 20 : A.w;
    [['pressão do ar', p], ['O₂ por respiração', p]].forEach((b, i) => { const y = py + i * 40; mtx(b[0] + ': cerca de ' + Math.round(b[1] * 100) + '% do nível do mar', px, y + 6, { s: 13, w: 600, a: 'left', c: C.txt }); rr(px, y + 18, pw, 10, 5, 'rgba(11,15,28,.7)', C.line, 1); rr(px, y + 18, pw * b[1], 10, 5, O2C); });
    const dy = py + 92; mtx('dias na altitude: ' + Math.floor(S.dias), px, dy, { s: 13, w: 700, a: 'left', c: C.txt }); rr(px, dy + 10, pw, 8, 4, 'rgba(11,15,28,.7)', C.line, 1); rr(px, dy + 10, pw * S.dias / 30, 8, 4, AM);
    const gr = Math.min(wide ? A.h * .22 : 42, 64), gx0 = px + gr + 4, gy0 = dy + 40 + gr; circ(gx0, gy0, gr, rgba(ART, .12), ART, 1.5); const R = rng(11), n = Math.round(14 + 12 * acl);
    for (let i = 0; i < n; i++) { const a = R() * TAU, d = Math.sqrt(R()) * (gr - 6); ell(gx0 + Math.cos(a) * d, gy0 + Math.sin(a) * d, 4.5, 3.2, a, ART, '#0B0F1C', .8); }
    mtx('hemácias: cerca de ' + nbr(5 + 1.4 * acl, 1) + ' milhões por µL', gx0 + gr + 12, gy0 - 6, { s: 13, w: 600, a: 'left', c: C.txt }); mtx('(valor ilustrativo)', gx0 + gr + 12, gy0 + 12, { s: 12, a: 'left', c: C.dim });
    cap(alt === 0 ? 'Ao nível do mar. Suba o controle de altitude.' : S.dias < 8 ? 'No ar rarefeito entra menos O₂ a cada respiração: o corpo respira mais rápido e o coração acelera.' : '<b>Aclimatação</b>: o rim solta mais <b>eritropoietina</b>, a medula faz mais hemácias e o sangue carrega mais O₂. É a base do treino de atletas em altitude.');
  }
  def('respiratorio', 'controle', {
    t: TXT.R2.t, s: TXT.R2.s, c: '#6EC8E8', loc: S => ({ bal: 'Balança do pH', est: 'Esteira', mon: 'Subir a montanha' })[S.modo] || '', locNota: NOTA,
    alt: 'a reação do CO₂ com a água como gangorra, gráficos de uma esteira e o efeito da altitude nas hemácias', still: 8,
    get ctl() { return M4.ctl(); }, ctlVis: M4.vis, extra: [M4.extra('bal', 'Balança do pH'), M4.extra('est', 'Esteira'), M4.extra('mon', 'Subir a montanha'), { t: 'Prender a respiração', vis: S => S.modo === 'est', on: S => { if (S.modo === 'est') { S.hold = !S.hold; S.fast = false; } }, pressed: S => !!S.hold }, { t: 'Respirar rápido demais', vis: S => S.modo === 'est', on: S => { if (S.modo === 'est') { S.fast = !S.fast; S.hold = false; } }, pressed: S => !!S.fast }],
    init: M4.init, d: TXT.R2.d + '<p class="nota">Conteúdo educativo, não substitui orientação médica.</p>', enem: TXT.R2.enem,
    kv: [['Centro respiratório', 'bulbo'], ['pH do sangue', 'perto de 7,4'], ['Estímulo principal', 'aumento de CO₂, não falta de O₂']], links: [LK.lactica, LK.respcel, LK.sangue],
    draw(t, S) { const A = area(); if (S.modo === 'bal') balanca(t, S, A); else if (S.modo === 'est') esteira(t, S, A); else montanha(t, S, A); }
  });
}
