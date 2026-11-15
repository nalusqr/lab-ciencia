/* LAB, módulo Vírus. Cenas D (Íris): doenças (HIV e aids; gripe, covid-19 e sarampo; hepatites virais e HPV).
   Fonte científica: docs/revisao-biologia/virus-roteiro.md (Taxon, revisão do Sapien), tópicos D2, D3 e D4.
   Usa a API do motor.js (/tmp/claude-0/vir/api.md): def, area, textos, baralho, virion, envelope, espicula, novelo,
   anticorpo, celula, fita, bicho, LK. Código, textos e desenhos da equipe, em esquema próprio.
   Dados que mudam (vacinas) seguem só o roteiro: sem idades fixas, com link para o calendário vigente. */
'use strict';
{
  // ---------------------------------------------------------------------------------
  // cores (paleta C do motor; a reserva só vale se faltar alguma)
  // ---------------------------------------------------------------------------------
  const RES = {
    virus: '#B9C2D3', dna: '#9A6BFF', rna: '#FF8A6B', envelope: '#F06AAE', espicula: '#F7C13B', anticorpo: '#CFE0FF', receptor: '#7CC4FF',
    resp: '#5AA9FF', sangue: '#F0605D', fecal: '#C08A5A', txt: '#E8EDF7', dim: '#9DA9C4', line: '#5B6C99', ok: '#6BCB77', erro: '#F0605D'
  };
  const K = n => (typeof C !== 'undefined' && C && C[n]) || RES[n];
  const CD4C = K('receptor'), CVC = '#F0605D', ROSA = '#F59B98', DOENTE = '#FF9A3C', SAUDE = '#C9D3F0', FIG = '#B4584C';
  const FUNDO = 'rgba(19,26,43,.82)';
  const CAL = (typeof LK !== 'undefined' && LK.calendario) || ['Calendário de vacinação vigente', 'https://www.gov.br/saude/pt-br/vacinacao/calendario'];
  const fs = (a, b) => NAR ? a : b;
  const $id = id => document.getElementById(id);
  const anos = v => { const n = Math.floor(v + 1e-6); return n === 1 ? '1 ano' : `${n} anos`; };

  // pastilha de cima à direita (o que está na tela) muda com o modo do tópico
  function onde(loc, nota) {
    const a = $id('ondeV'), b = $id('ondeS');
    if (a && a.textContent !== loc) a.textContent = loc;
    if (b && b.textContent !== nota) { b.textContent = nota; b.hidden = !nota; }
  }
  // mostra ou esconde a faixa do controle (some nos cartões)
  function faixa(on) { const r = $id('ctlR'); if (r && r.parentNode && r.parentNode.hidden === on) r.parentNode.hidden = !on; }
  // texto que encolhe até caber
  function cabe(s, x, y, maxw, o = {}) { let sz = o.s || 13; const w = o.w || 400; while (sz > 12 && mtw(s, sz, w) > maxw) sz--; return mtx(s, x, y, Object.assign({}, o, { s: sz })); }
  // botão desenhado no canvas
  function botao(x, y, w, h, s, id, o = {}) {
    const c = o.c || K('espicula'), on = !!o.on;
    rr(x, y, w, h, 8, on ? rgba(c, .28) : FUNDO, on ? c : 'rgba(255,255,255,.28)', on ? 2 : 1);
    cabe(s, x + w / 2, y + h / 2 + .5, w - 12, { s: 13, w: 700, c: K('txt'), bg: false });
    hitR(x, y, w, h, id);
  }
  // texto girado 90° (rótulo ao longo de uma parede ou de um eixo)
  function txV(s, x, y, o, ang = -PI / 2) { X.save(); X.translate(x, y); X.rotate(ang); tx(s, 0, 0, o); X.restore(); }

  // baralho com mais de uma resposta certa por cartão (c.ok = alvos aceitos): antes de soltar, o cartão adota o alvo escolhido
  function multi(B, nome) {
    const hook = (x, y, S) => {
      const b = S[nome], h = hitAt(x, y);
      if (!b || typeof h !== 'string' || !h.startsWith(nome + ':a=')) return;
      const i = b.drag ? b.drag.i : b.sel; if (i == null) return;
      const c = B.cartas[i], k = +h.split('=')[1]; if (c.ok && c.ok.includes(k)) c.k = k;
    };
    return { tap(x, y, S) { hook(x, y, S); return B.tap(x, y, S); }, grabEnd(x, y, S) { hook(x, y, S); B.grabEnd(x, y, S); } };
  }

  // =================================================================================
  // D2: #doencas/hiv
  // =================================================================================
  {
    const TT = 4; // ano em que o tratamento começa (esquema)
    // curvas esquemáticas sem tratamento: CD4 (células por mm³) e carga viral (relativa, 0 a 1)
    const cd4s = y => y < .12 ? lerp(1000, 560, y / .12) : y < .6 ? lerp(560, 780, ss((y - .12) / .48)) : 780 - (y - .6) * 66;
    const cvs = y => y < .15 ? ss(y / .15) : y < .7 ? lerp(1, .26, ss((y - .15) / .55)) : y < 7 ? lerp(.26, .4, (y - .7) / 6.3) : lerp(.4, 1, ss((y - 7) / 3));
    // com tratamento a partir do ano TT: a carga viral despenca e os CD4 se recuperam
    const cd4t = y => y < TT ? cd4s(y) : lerp(cd4s(TT), 760, 1 - Math.exp(-(y - TT) / 1.6));
    const cvt = y => y < TT ? cvs(y) : cvs(TT) * Math.exp(-(y - TT) * 5);
    const cruza = (() => { for (let y = 1; y <= 10; y += .01) if (cd4s(y) < 200) return y; return 10; })();
    const OPO = ['tuberculose', 'pneumonia por <i>Pneumocystis</i>', 'candidíase', 'sarcoma de Kaposi'];

    // "Passa ou não passa?": cartões do roteiro
    const BH = baralho({
      nome: 'hiv',
      cartas: [
        { t: 'Relação sexual sem preservativo', k: 0, m: '<b>Transmite.</b> O HIV passa pelo sêmen e pela secreção vaginal; o preservativo previne.' },
        { t: 'Compartilhar seringa e agulha', k: 0, m: '<b>Transmite.</b> O sangue com vírus fica na seringa e na agulha.' },
        { t: 'Gestante vivendo com HIV, sem tratamento', k: 0, m: '<b>Pode transmitir</b>, na gestação ou no parto. O tratamento da gestante reduz muito a transmissão para o bebê.' },
        { t: 'Amamentação por mãe vivendo com HIV', k: 0, m: '<b>Pode transmitir:</b> o HIV pode estar no leite materno.' },
        { t: 'Abraço', k: 1, m: '<b>Não transmite.</b> O HIV não passa pelo toque nem pelo suor.' },
        { t: 'Beijo no rosto', k: 1, m: '<b>Não transmite.</b> Beijo no rosto, aperto de mão e lágrimas não passam o HIV.' },
        { t: 'Usar o mesmo copo', k: 1, m: '<b>Não transmite.</b> Copos, talheres e piscina não passam o HIV.' },
        { t: 'Picada de mosquito', k: 1, m: '<b>Não transmite.</b> O HIV não se multiplica no mosquito, e o mosquito não injeta o sangue de uma pessoa na outra.' },
        { t: 'Parceiro indetectável há mais de seis meses', k: 1, m: '<b>Não transmite pela via sexual.</b> Com o tratamento, a carga viral fica indetectável: indetectável = intransmissível.' }
      ],
      alvos: [{ t: 'Transmite', c: K('sangue') }, { t: 'Não transmite', c: K('ok') }],
      certo: c => c.m,
      errado: c => `Não é isso. ${c.m}`,
      fim: S => `Pronto${S.hiv && S.hiv.erros ? '' : ', sem erros'}. O HIV passa por <b>sangue, sêmen, secreção vaginal e leite materno</b>; abraço, beijo no rosto, copo e mosquito não transmitem.`,
      dica: 'Primeiro toque numa situação; depois, em <b>Transmite</b> ou <b>Não transmite</b>.'
    });

    def('doencas', 'hiv', {
      t: 'HIV e aids', s: 'o vírus que ataca a defesa do corpo', c: K('sangue'), loc: 'Linfócitos T CD4 e carga viral', locNota: 'Gráfico esquemático',
      alt: 'Gráfico de dez anos de infecção pelo HIV sem tratamento: a linha azul dos linfócitos T CD4 cai devagar e a linha vermelha da carga viral sobe no começo, cai e volta a subir no fim. Ao cruzar 200 CD4 por milímetro cúbico, aparecem doenças oportunistas. Com tratamento, a carga viral cai até indetectável e os linfócitos se recuperam. No jogo "Passa ou não passa?", situações do dia a dia vão para "transmite" ou "não transmite"',
      d: `<p>O <b>HIV</b> (vírus da imunodeficiência humana) é um <b>retrovírus</b> que infecta principalmente os <b>linfócitos T auxiliares</b>, que têm a proteína <b>CD4</b> na membrana. Esses linfócitos coordenam a resposta imune: sem eles, os outros glóbulos brancos não são "avisados" do perigo. Logo depois da infecção, pode haver febre e mal-estar parecidos com uma gripe; depois, a pessoa pode passar <b>anos sem sintomas</b>, enquanto o vírus destrói os linfócitos aos poucos.</p>
<p>Sem tratamento, quando a quantidade de linfócitos CD4 fica muito baixa (abaixo de <b>200 por mm³</b> de sangue), o corpo perde a defesa contra micróbios que normalmente não causariam doença: são as <b>doenças oportunistas</b>, como tuberculose, pneumonia por <i>Pneumocystis</i>, candidíase e o câncer chamado sarcoma de Kaposi. Essa fase é a <b>aids</b> (síndrome da imunodeficiência adquirida). Ter HIV não é o mesmo que ter aids.</p>
<p>O HIV é transmitido por <b>sangue</b>, <b>sêmen</b>, <b>secreção vaginal</b> e <b>leite materno</b>: por <b>relação sexual sem preservativo</b>, pelo <b>compartilhamento de seringas e agulhas</b> e <b>da mãe para o filho</b> na gestação, no parto ou na amamentação (a transmissão por transfusão ficou muito rara com a testagem do sangue doado). O HIV <b>não</b> passa por abraço, beijo no rosto, aperto de mão, talheres, piscina, suor, lágrimas nem <b>picada de mosquito</b>.</p>
<p>Não há vacina nem cura, mas há <b>tratamento</b>: o <b>tratamento antirretroviral</b>, gratuito no SUS desde <b>1996</b>, controla o vírus. A pessoa em tratamento que mantém a carga viral <b>indetectável</b> por pelo menos seis meses <b>não transmite o HIV por via sexual</b> ("indetectável = intransmissível") e tem expectativa de vida próxima à de quem não tem o vírus. A prevenção combina <b>preservativo</b>, <b>testagem</b> (teste rápido gratuito), <b>PrEP</b> (remédio tomado antes, por quem tem maior chance de exposição), <b>PEP</b> (remédio começado em até <b>72 horas</b> depois de uma exposição de risco) e o tratamento da gestante, que reduz muito a transmissão para o bebê.</p>
<p>Na animação, arraste a faixa <b>Tempo</b> ou deixe os anos passarem; o botão <b>Com tratamento</b> redesenha o gráfico. Em <b>Passa ou não passa?</b>, leve cada situação para o lugar certo.</p>`,
      kv: [['Vírus', 'HIV, um retrovírus (RNA)'], ['Célula atacada', 'linfócito T auxiliar (CD4)'], ['Aids', 'CD4 abaixo de 200 por mm³ e doenças oportunistas'], ['Prevenção', 'preservativo, testagem, PrEP, PEP e tratamento da gestante']],
      enem: 'Saiba: HIV é <b>retrovírus</b>, ataca <b>linfócitos T CD4</b>, e a aids é a fase em que a imunidade cai e surgem <b>doenças oportunistas</b>. As <b>vias de transmissão</b> (sexual, sangue, mãe para filho) e as que <b>não</b> transmitem são as mais cobradas, muitas vezes em questões que combatem o <b>preconceito</b>. O tratamento combina <b>vários antirretrovirais</b> por causa da mutação rápida. Pegadinha: <b>mosquito não transmite HIV</b>, mas transmite dengue; a diferença é que o vírus da dengue se multiplica no mosquito e chega à saliva dele.',
      links: [['Retrovírus e transcriptase reversa', '#replicacao/retrovirus'], ['Cada via, sua prevenção', '#prevencao/transmissao']],
      ctl: { l: 'Tempo', min: 0, max: 10, step: .1, v: 0, f: anos, rate: () => 1 },
      auto: S => S.modo === 2 ? 0 : 1.1, stillV: 10, still: 2.5,
      extra: [
        { t: 'Sem tratamento', pressed: S => S.modo === 0, on(S) { S.modo = 0; } },
        { t: 'Com tratamento', pressed: S => S.modo === 1, on(S) { S.modo = 1; } },
        { t: 'Passa ou não passa?', pressed: S => S.modo === 2, on(S) { S.modo = 2; } }
      ],
      init(S) { if (S.modo == null) { S.modo = 0; BH.zera(S); } },
      tap(x, y, S) { if (S.modo === 2) BH.tap(x, y, S); },
      grab(x, y, S) { return S.modo === 2 && BH.grab(x, y, S); }, grabMove: BH.grabMove, grabEnd: BH.grabEnd,
      draw(t, S) {
        const A = area();
        faixa(S.modo !== 2);
        if (S.modo === 2) {
          onde('Situações do dia a dia', 'Cartões para classificar');
          BH.draw(S, { x0: A.x0, y0: A.y0, x1: A.x1, y1: A.y1 }, { cols: NAR ? 2 : 5, cartaH: NAR ? 44 : 46 });
          cap(BH.msg(S) || 'Toque numa situação e depois em <b>Transmite</b> ou <b>Não transmite</b> (com o mouse, também dá para arrastar).');
          return;
        }
        onde('Linfócitos T CD4 e carga viral', 'Gráfico esquemático');
        const trat = S.modo === 1, yr = cl(S.v, 0, 10), fC = trat ? cd4t : cd4s, fV = trat ? cvt : cvs;
        // quadro do gráfico; embaixo dele, a faixa das doenças oportunistas
        const strip = NAR ? 62 : 34, padL = NAR ? 34 : 58, padR = NAR ? 12 : 70;
        const P = { x0: A.x0 + padL, x1: A.x1 - padR, y0: A.y0 + (NAR ? 52 : 58), y1: A.y1 - strip - 30 };
        const px = y => lerp(P.x0, P.x1, y / 10), pyC = c => lerp(P.y1, P.y0, c / 1080), pyV = v => lerp(P.y1, P.y0, v * .92);
        // legenda das linhas
        let lx = A.x0; const ly = A.y0 + 12;
        lx += pill('linfócitos T CD4', lx, ly, CD4C) + 8; pill('carga viral', lx, ly, CVC);
        // fundo, faixa da aids e eixos
        rr(P.x0, P.y0, P.x1 - P.x0, P.y1 - P.y0, 4, 'rgba(19,26,43,.45)', null);
        if (!trat && yr > cruza) { X.save(); X.globalAlpha = .1; rr(px(cruza), P.y0, px(10) - px(cruza), P.y1 - P.y0, 0, K('erro')); X.restore(); }
        X.save(); X.globalAlpha = .1; rr(P.x0, pyC(200), P.x1 - P.x0, P.y1 - pyC(200), 0, K('erro')); X.restore();
        line(P.x0, P.y1, P.x1, P.y1, K('line'), 1.5); line(P.x0, P.y0, P.x0, P.y1, CD4C, 1.5); line(P.x1, P.y0, P.x1, P.y1, CVC, 1.5);
        for (const y of NAR ? [0, 5, 10] : [0, 2, 4, 6, 8, 10]) { line(px(y), P.y1, px(y), P.y1 + 5, K('line'), 1); tx(y === 10 ? '10 anos' : String(y), px(y), P.y1 + 16, { s: 12, c: K('dim'), a: y === 10 ? 'right' : 'center' }); }
        tx('0', P.x0 - 6, P.y1, { s: 12, c: CD4C, a: 'right' }); tx('200', P.x0 - 6, pyC(200), { s: 12, c: CD4C, a: 'right' });
        if (!NAR) { txV('CD4 por mm³ de sangue', P.x0 - 40, (P.y0 + pyC(200)) / 2, { s: 12, c: CD4C }); txV('carga viral (sem escala)', P.x1 + 16, (P.y0 + P.y1) / 2, { s: 12, c: CVC }, PI / 2); }
        line(P.x0, pyC(200), P.x1, pyC(200), rgba(K('erro'), .8), 1.2, [6, 5]);
        mtx(NAR ? '200: aids' : 'abaixo de 200 CD4 por mm³: aids', px(.8), pyC(200) + 12, { s: 12, w: 600, c: ROSA, a: 'left' });
        // fases e marcas (na linha de cima do quadro)
        const fy = P.y0 - 12;
        if (trat) {
          line(px(TT), P.y0, px(TT), P.y1, K('ok'), 1.5, [3, 4]);
          mtx('começa o tratamento', px(TT) + 6, fy, { s: 12, w: 700, c: K('ok'), a: 'left' });
          if (yr > TT + .6) { line(px(TT), pyV(.03), P.x1, pyV(.03), rgba(CVC, .6), 1, [2, 4]); mtx('indetectável', P.x1 - 6, pyV(.03) - 10, { s: 12, w: 600, c: ROSA, a: 'right' }); }
        } else {
          if (yr > 1.2) mtx('anos sem sintomas', px(3.6), fy, { s: 12, w: 600, c: K('dim') });
          if (!NAR && yr > .1) mtx('infecção', px(.15) + 4, fy, { s: 12, w: 600, c: K('dim'), a: 'left' });
          if (yr > cruza) mtx('aids', px((cruza + 10) / 2), fy, { s: 13, w: 700, c: ROSA });
        }
        // curvas até o ano atual
        const curva = (f, py, c) => { const p = []; for (let y = 0; y < yr; y += .04) p.push([px(y), py(f(y))]); p.push([px(yr), py(f(yr))]); X.lineCap = 'round'; if (p.length > 1) poly(p, c, 3.2); circ(px(yr), py(f(yr)), 5, c, '#0B0F1C', 2); X.lineCap = 'butt'; };
        curva(fV, pyV, CVC); curva(fC, pyC, CD4C);
        // doenças oportunistas (pastilhas que quebram a linha quando não cabem)
        const sy = P.y1 + 30;
        if (!trat && yr >= cruza) {
          X.save(); X.globalAlpha *= ss((yr - cruza) / .8);
          let x0 = A.x0, x = x0, y = sy;
          if (!NAR) { const l0 = 'doenças oportunistas:'; mtx(l0, P.x0, sy + 12, { s: 13, w: 700, c: ROSA, a: 'left' }); x0 = x = P.x0 + mtw(l0, 13, 700) + 10; }
          for (const s of OPO) {
            const w = mtw(s, 12, 600) + 18; if (x > x0 && x + w > A.x1) { x = x0; y += 26; }
            rr(x, y + 1, w, 22, 999, rgba(K('erro'), .18), K('erro'), 1); mtx(s, x + w / 2, y + 12.5, { s: 12, w: 600, c: K('txt'), bg: false }); x += w + 8;
          }
          X.restore();
        } else if (trat && yr > TT + 1) mtx('os linfócitos CD4 se recuperam', NAR ? A.cx : P.x0, sy + 12, { s: fs(12, 13), w: 700, c: K('ok'), a: NAR ? 'center' : 'left' });
        // legenda do passo
        if (trat) cap(yr < TT ? 'O teste rápido, gratuito, descobre a infecção. Neste esquema, o <b>tratamento antirretroviral</b> começa no ano 4.'
          : yr < TT + 1 ? 'Com o tratamento, a <b>carga viral despenca</b> e os linfócitos CD4 voltam a subir.'
            : 'Carga viral <b>indetectável</b> por pelo menos seis meses: a pessoa <b>não transmite o HIV por via sexual</b> e tem expectativa de vida próxima à de quem não tem o vírus.');
        else cap(yr < .7 ? 'Logo depois da infecção, a carga viral dispara; pode haver febre e mal-estar parecidos com uma gripe.'
          : yr < cruza ? 'Anos sem sintomas, mas o vírus destrói os <b>linfócitos T CD4</b> aos poucos.'
            : 'Abaixo de <b>200 CD4 por mm³</b>, o corpo perde a defesa e surgem as <b>doenças oportunistas</b>: é a fase de <b>aids</b>.');
      }
    });
  }

  // =================================================================================
  // D3: #doencas/respiratorias
  // =================================================================================
  {
    // média aproximada de colegas infectados por um doente, numa turma sem imunidade (ordem de grandeza); r = alcance da nuvem em carteiras
    const DZ = [
      { n: 'Gripe', b: 2, r: 1.7, txt: 'cerca de 2', vir: 'vírus influenza' },
      { n: 'Covid-19', b: 3, r: 2.3, txt: 'cerca de 3', vir: 'SARS-CoV-2' },
      { n: 'Sarampo', b: 15, r: 9, txt: 'de 12 a 18', vir: 'vírus do sarampo' }
    ];
    // colegas em ordem de chegada da nuvem: distância ao doente, com um pouco de acaso
    const ORDEM = (() => {
      const R = rng(7), L = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) { if (r === 1 && c === 3) continue; L.push({ r, c, d: Math.hypot(c - 3, (r - 1) * 1.1) + R() * .9 }); }
      return L.sort((a, b) => a.d - b.d);
    })();
    const nInf = S => { let n = DZ[S.dz].b; if (S.jan) n *= .5; if (S.masc) n *= .5; if (S.vac) n *= .1; return Math.min(20, Math.round(n)); };
    const reset = S => { S.c0 = S.ph; };

    // "Por que vacina todo ano?": forma da ponta da espícula H (perfil) e encaixe do anticorpo
    const perfil = (u, s) => .5 + .26 * Math.sin(u * 7.5 + s * 2.1) + .2 * Math.sin(u * 13 - s * 1.3);
    const encaixe = S => cl(1 - Math.abs(S.sv - S.sa), 0, 1);
    // espícula H com a ponta no perfil s (eixo +x, como a espicula() do motor)
    function espH(x, y, ang, len, s) {
      const c = K('espicula'), w = len * .5, x0 = len * .45, p = [[x0, -w / 2]];
      for (let i = 0; i <= 12; i++) { const u = i / 12; p.push([len * (.78 + .22 * perfil(u, s)), -w / 2 + u * w]); }
      p.push([x0, w / 2]);
      X.save(); X.translate(x, y); X.rotate(ang); line(0, 0, len * .5, 0, c, Math.max(1.2, len * .1)); shape(p, c, dark(c, .45), 1); X.restore();
    }

    const D3 = {
      t: 'Gripe, covid-19 e sarampo', s: 'vírus que viajam no ar', c: K('resp'), loc: 'Uma sala de aula vista de cima', locNota: 'Esquema; números são média aproximada',
      alt: 'Sala de aula vista de cima, com uma pessoa doente e 20 colegas. Nuvens de aerossol saem da pessoa doente; botões escolhem gripe, covid-19 ou sarampo e ligam janelas abertas, máscaras e turma vacinada, e um placar mostra quantos colegas se infectam em média. No modo "Por que vacina todo ano?", as espículas H do vírus da gripe mudam de forma a cada ano e os anticorpos encaixam cada vez pior, até a vacina nova; a troca de segmentos numa célula de porco gera um vírus novo, com risco de pandemia',
      d: `<p>A <b>gripe</b> é causada pelo <b>vírus influenza</b>, um vírus de RNA com envelope e genoma em 8 pedaços. Passa por <b>gotículas</b> e <b>aerossóis</b> expelidos ao tossir, espirrar e falar, e por mãos e objetos contaminados. O vírus muda o tempo todo por <b>pequenas mutações</b> nas proteínas H e N; por isso a vacina é <b>atualizada todo ano</b>, com as cepas que mais circulam, e deve ser tomada <b>todo ano</b>. De vez em quando, dois vírus diferentes (um humano e um de ave ou de porco) infectam a mesma célula e <b>trocam segmentos</b> de RNA, gerando um vírus muito diferente, contra o qual quase ninguém tem defesa: é assim que nascem as <b>pandemias</b> de gripe, como a de 1918 (a "gripe espanhola") e a de 2009 (H1N1). Gripe não é o mesmo que resfriado, que é causado por outros vírus (como os rinovírus) e costuma ser mais leve.</p>
<p>A <b>covid-19</b> é causada pelo <b>SARS-CoV-2</b>, um <b>coronavírus</b> (de RNA, com envelope, cujas espículas lembram uma coroa). A OMS declarou a <b>pandemia</b> em <b>março de 2020</b> e encerrou a emergência internacional em <b>maio de 2023</b>. O vírus usa a proteína <b>S</b> para entrar nas células pela <b>ECA2</b> e passa por gotículas e <b>aerossóis</b>, sobretudo em lugares fechados e pouco ventilados. Por isso funcionaram <b>máscaras</b>, <b>ventilação</b>, distanciamento e <b>vacinas</b>. O vírus acumulou mutações e gerou <b>variantes</b> (como Gama, identificada em Manaus, Delta e Ômicron). As vacinas foram feitas por várias técnicas: <b>vírus inativado</b> (CoronaVac, Butantan), <b>vetor viral</b> (um adenovírus modificado que leva o gene da proteína S; AstraZeneca e Fiocruz) e <b>RNA mensageiro</b> (Pfizer), que ensina as células a produzir a proteína S por pouco tempo e <b>não altera o DNA</b> de quem é vacinado.</p>
<p>O <b>sarampo</b> é uma das doenças <b>mais contagiosas</b> que existem: uma pessoa doente pode infectar de 12 a 18 outras sem imunidade, pelo ar. Causa febre alta, tosse, olhos vermelhos e <b>manchas vermelhas</b> que começam no rosto e descem pelo corpo, e pode levar a pneumonia, encefalite e morte, sobretudo em crianças pequenas e desnutridas. A prevenção é a vacina <b>tríplice viral</b> (sarampo, caxumba e rubéola), em duas doses na infância; as idades estão no calendário vigente. O Brasil recebeu o certificado de país livre do sarampo em <b>2016</b>, <b>perdeu</b> em 2019 depois de surtos ligados à queda da vacinação, e <b>voltou a ser certificado</b> em 2024. A doença volta sempre que a cobertura vacinal cai.</p>
<p>Na animação, escolha a doença e ligue <b>janelas abertas</b>, <b>máscaras</b> e <b>turma vacinada</b>. Os números são uma <b>média aproximada</b>, para comparar a ordem de grandeza. Em <b>Por que vacina todo ano?</b>, passe os anos e veja os anticorpos encaixarem cada vez pior.</p>`,
      kv: [['Gripe', 'influenza, RNA em 8 pedaços; vacina anual'], ['Covid-19', 'SARS-CoV-2, um coronavírus; proteína S e ECA2'], ['Sarampo', 'altíssima transmissão pelo ar; vacina tríplice viral']],
      enem: '<b>Gripe:</b> vírus de RNA que muda muito, por isso a <b>vacina é anual</b>; pandemias surgem quando vírus diferentes trocam pedaços de RNA. <b>Covid-19:</b> transmissão por <b>aerossóis</b>; as vacinas de <b>RNAm</b> não mudam o DNA; as <b>variantes</b> são exemplo de mutação e seleção natural acontecendo na nossa frente. <b>Sarampo:</b> altíssima transmissão pelo ar, prevenido pela <b>tríplice viral</b>; a volta da doença está ligada à <b>queda da cobertura vacinal</b>. As questões costumam usar gráficos de casos e de vacinação.',
      links: [['Vacina, soro e antivirais', '#prevencao/vacinas'], ['Cada via, sua prevenção', '#prevencao/transmissao'], CAL],
      still: 6,
      extra: [
        ...DZ.map((z, i) => ({ t: z.n, pressed: S => !S.drift && S.dz === i, on(S) { S.drift = false; S.dz = i; reset(S); } })),
        { t: 'Janelas abertas', pressed: S => !S.drift && !!S.jan, on(S) { S.drift = false; S.jan = !S.jan; reset(S); } },
        { t: 'Máscaras', pressed: S => !S.drift && !!S.masc, on(S) { S.drift = false; S.masc = !S.masc; reset(S); } },
        { t: 'Turma vacinada', pressed: S => !S.drift && !!S.vac, on(S) { S.drift = false; S.vac = !S.vac; reset(S); } },
        { t: 'Por que vacina todo ano?', pressed: S => !!S.drift, on(S) { S.drift = !S.drift; S.user = false; S.dk = 0; } }
      ],
      init(S) { if (S.dz == null) { S.dz = 0; S.jan = S.masc = S.vac = false; S.c0 = 0; S.sv = 0; S.sa = 0; S.ano = 1; S.vacAno = 1; S.troca = null; S.novo = false; } },
      tap(x, y, S) {
        if (!S.drift) return; const id = hitAt(x, y); if (id == null) return;
        S.user = true;
        if (id === 'ano' && S.troca == null) { S.ano++; S.sv += .3; }
        else if (id === 'vac' && S.troca == null) { S.sa = S.sv; S.vacAno = S.ano; S.novo = false; }
        else if (id === 'troca' && S.troca == null) S.troca = S.ph;
      },
      draw(t, S) {
        const A = area();
        if (S.drift) { onde('Vírus da gripe e anticorpos', 'Desenho esquemático, fora de escala'); return this.deriva(t, S, A); }
        onde('Uma sala de aula vista de cima', 'Esquema; números são média aproximada');
        const z = DZ[S.dz], n = nInf(S), cyc = (t - (S.c0 || 0)) % 9;
        // sala (com espaço à esquerda para o rótulo das janelas) e placar ao lado (no celular, embaixo)
        const pw = NAR ? A.w : Math.min(300, A.w * .3), ph = NAR ? 124 : 0, padW = 26, top = 36;
        const RW = NAR ? A.w : A.w - pw - 24, RH = NAR ? A.h - ph - 12 : A.h;
        const cw = Math.min((RW - padW - 10) / 7.3, (RH - top - 14) / 3.75, 86), rp = cw * (NAR ? 1.7 : 1.25), gw = cw * 7, gh = rp * 3;
        const roomH = gh + top + 6, offY = NAR ? (A.h - (roomH + 12 + ph)) / 2 : (A.h - roomH) / 2;
        const gx = A.x0 + padW + (RW - padW - gw) / 2, rx0 = gx - 10, ry0 = A.y0 + Math.max(0, offY), gy = ry0 + top;
        rr(rx0, ry0, gw + 20, roomH, 10, 'rgba(19,26,43,.6)', K('line'), 1.5);
        line(gx + gw * .3, ry0 + 9, gx + gw * .7, ry0 + 9, '#7C8AA8', 5);
        mtx('quadro', gx + gw / 2, ry0 + 23, { s: 12, c: K('dim') });
        for (let i = 0; i < 3; i++) { const wy = gy + gh * (.08 + i * .32); line(rx0, wy, rx0, wy + gh * .2, S.jan ? '#9BD3FF' : '#5B6C99', S.jan ? 5 : 3); }
        txV(S.jan ? 'janelas abertas' : 'janelas fechadas', rx0 - 12, gy + gh / 2, { s: 12, c: S.jan ? '#9BD3FF' : K('dim') });
        const pos = (r, c) => [gx + cw * (c + .5), gy + rp * (r + .5)], [sx, sy] = pos(1, 3);
        // nuvem de aerossol: janelas puxam para a esquerda e encurtam a vida das gotinhas; máscaras seguram a saída
        const nP = S.masc ? 26 : 70, life = (S.jan ? 2.2 : 3.6) * (S.masc ? .7 : 1), reach = z.r * cw * (S.masc ? .55 : 1) * (S.jan ? .75 : 1);
        const Rg = rng(11 + S.dz);
        for (let i = 0; i < nP; i++) {
          const a0 = Rg() * TAU, sp = .45 + Rg() * .55, off = Rg() * life, age = ((t + off) % life) / life;
          let x = sx + Math.cos(a0) * reach * sp * Math.sqrt(age); const y = sy + Math.sin(a0) * reach * sp * Math.sqrt(age) * .8;
          if (S.jan) x -= age * age * cw * 2.2;
          if (x < rx0 + 2 || x > gx + gw + 8 || y < ry0 + 30 || y > ry0 + roomH - 2) continue;
          circ(x, y, 2 + age * 4, rgba(K('resp'), .5 * (1 - age)));
        }
        // colegas (de frente para o quadro: carteira em cima, cabeça e ombros)
        const show = S.paused ? n : Math.min(n, cyc < 1.2 ? 0 : 1 + Math.floor((cyc - 1.2) / 4.2 * n));
        const inf = new Set(ORDEM.slice(0, show).map(q => q.r * 7 + q.c));
        for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) {
          const [x, y] = pos(r, c), doente = r === 1 && c === 3, ii = inf.has(r * 7 + c), col = doente || ii ? DOENTE : SAUDE;
          rr(x - cw * .36, y - cw * .5, cw * .72, cw * .16, 3, 'rgba(120,135,170,.35)', null);
          ell(x, y + cw * .12, cw * .28, cw * .14, 0, rgba(col, .3), col, 1.5);
          circ(x, y - cw * .05, cw * .15, doente || ii ? rgba(DOENTE, .85) : 'rgba(201,211,240,.4)', col, 1.5);
          if (S.masc) rr(x - cw * .1, y - cw * .22, cw * .2, cw * .08, 2, '#E8EDF7', null);
          if (S.vac && !doente) circ(x, y - cw * .02, cw * .36, null, K('ok'), 2);
        }
        mtx('doente', sx, sy + cw * .5, { s: 12, w: 700, c: DOENTE });
        // placar
        if (NAR) {
          const bx = A.x0, by = ry0 + roomH + 12, bw = A.w;
          panel(bx, by, bw, ph, { r: 12 });
          mtx(z.n, bx + 12, by + 18, { s: 15, w: 700, f: FH, c: K('txt'), a: 'left', bg: false });
          cabe(z.vir, bx + bw - 12, by + 18, bw * .45, { s: 12, c: K('dim'), a: 'right', bg: false });
          cabe('colegas infectados (média aproximada)', bx + 12, by + 38, bw - 24, { s: 12, c: K('dim'), a: 'left', bg: false });
          const sq = Math.min(14, (bw - 24 - 19 * 3) / 20);
          for (let i = 0; i < 20; i++) rr(bx + 12 + i * (sq + 3), by + 50, sq, sq, 3, i < n ? DOENTE : 'rgba(201,211,240,.18)', i < n ? null : 'rgba(201,211,240,.35)', 1);
          mtx(`${n} de 20`, bx + 12, by + 84, { s: 18, w: 700, f: FH, c: DOENTE, a: 'left', bg: false });
          cabe(`sem medidas: ${z.txt}`, bx + bw - 12, by + 84, bw * .5, { s: 12, c: K('dim'), a: 'right', bg: false });
          cabe('laranja: doente ou infectado; anel verde: vacinado', bx + 12, by + 108, bw - 24, { s: 12, c: K('dim'), a: 'left', bg: false });
        } else {
          const bx = A.x1 - pw, bw = pw, bh = 262, by = A.cy - bh / 2;
          panel(bx, by, bw, bh, { r: 12 });
          mtx(z.n, bx + 14, by + 22, { s: 17, w: 700, f: FH, c: K('txt'), a: 'left', bg: false });
          cabe(z.vir, bx + bw - 14, by + 22, bw * .45, { s: 12, c: K('dim'), a: 'right', bg: false });
          cabe('colegas infectados (média aproximada)', bx + 14, by + 46, bw - 28, { s: 12, c: K('dim'), a: 'left', bg: false });
          const sq = Math.min(22, (bw - 28 - 9 * 4) / 10);
          for (let i = 0; i < 20; i++) rr(bx + 14 + (i % 10) * (sq + 4), by + 60 + Math.floor(i / 10) * (sq + 4), sq, sq, 3, i < n ? DOENTE : 'rgba(201,211,240,.18)', i < n ? null : 'rgba(201,211,240,.35)', 1);
          const ny = by + 60 + 2 * (sq + 4) + 24;
          mtx(`${n} de 20`, bx + 14, ny, { s: 22, w: 700, f: FH, c: DOENTE, a: 'left', bg: false });
          wrapTx(`Sem medidas e sem imunidade: <b>${z.txt}</b> por doente.`, bx + 14, ny + 30, bw - 28, { s: 13, a: 'left', c: '#D3DAEA' });
          let ly = by + bh - 50;
          for (const [c, s, anel] of [[SAUDE, 'colega', false], [DOENTE, 'doente ou infectado', false], [K('ok'), 'vacinado (anel verde)', true]]) { circ(bx + 20, ly, 5, anel ? null : c, anel ? c : null, 2); mtx(s, bx + 32, ly, { s: 12, c: K('dim'), a: 'left', bg: false }); ly += 16; }
        }
        const lista = [S.jan && 'janelas abertas', S.masc && 'máscaras', S.vac && 'turma vacinada'].filter(Boolean);
        const med = lista.length < 2 ? lista.join('') : lista.slice(0, -1).join(', ') + ' e ' + lista[lista.length - 1];
        cap(S.vac ? `Com a <b>turma vacinada</b>, a nuvem continua saindo, mas quase ninguém fica doente.${S.dz === 2 ? ' Contra o sarampo, a vacina é a <b>tríplice viral</b>.' : ''}`
          : lista.length ? `Com ${med}, menos aerossol chega aos colegas.${S.dz === 1 ? ' Ventilação e máscaras funcionaram contra a covid-19.' : ''}`
            : S.dz === 2 ? 'Sarampo sem vacina: quase a sala inteira adoece. Uma pessoa doente pode infectar <b>de 12 a 18</b> outras sem imunidade.'
              : `${z.n}: o vírus viaja em <b>gotículas e aerossóis</b> expelidos ao tossir, espirrar e falar.`);
      },
      deriva(t, S, A) {
        // demonstração enquanto ninguém mexe: um ano a cada 2,6 s; vacina nova a cada 4 anos
        if (!S.user && !S.paused && S.troca == null) {
          S.dk = (S.dk || 0) + S.dt;
          if (S.dk > 2.6) { S.dk = 0; if (S.ano % 4 === 0 && S.vacAno !== S.ano) { S.sa = S.sv; S.vacAno = S.ano; S.novo = false; } else { S.ano++; S.sv += .3; } }
        }
        const f = encaixe(S), nb = Math.round(f * 8);
        // botões no canvas
        const bh = 40, g = 8, rows = NAR ? 2 : 1, by = A.y1 - rows * bh - (rows - 1) * g, tr = S.troca != null;
        if (NAR) { const w2 = (A.w - g) / 2; botao(A.x0, by, w2, bh, 'Passa um ano', 'ano'); botao(A.x0 + w2 + g, by, w2, bh, 'Vacina nova', 'vac'); botao(A.x0, by + bh + g, A.w, bh, 'Troca de segmentos', 'troca', { on: tr }); }
        else { const w3 = Math.min(200, (A.w - 2 * g) / 3), x0 = A.cx - (3 * w3 + 2 * g) / 2; [['Passa um ano', 'ano'], ['Vacina nova', 'vac'], ['Troca de segmentos', 'troca']].forEach(([s, id], i) => botao(x0 + i * (w3 + g), by, w3, bh, s, id, { on: id === 'troca' && tr })); }
        const top = A.y0 + 4, bot = by - 10, hh = bot - top;
        if (tr) return this.troca(t, S, A, top, bot);
        // disposição: vírus; quadro ampliado; placar
        let vx, vy, vr; const I = {}, P = {};
        if (NAR) {
          const vh = hh * .56; vr = Math.min(vh / 2 / 2.35, A.w / 2 / 2.5); vx = A.cx; vy = top + vh / 2;
          I.x = A.x0; I.y = top + vh + 6; I.w = Math.min(170, A.w * .5); I.h = Math.min(bot - I.y, 170);
          P.x = I.x + I.w + 12; P.y = I.y + 14; P.w = A.x1 - P.x;
        } else {
          vr = Math.min(hh / 2 / 2.35, A.w * .1); vx = A.x0 + A.w * .27; vy = top + hh / 2;
          I.w = Math.min(240, A.w * .22); I.h = Math.min(hh * .8, 260); I.x = A.x0 + A.w * .52; I.y = vy - I.h / 2;
          P.x = I.x + I.w + 22; P.y = I.y + 14; P.w = A.x1 - P.x;
        }
        // espículas H (a forma muda) e N, alternadas; anticorpos presos nas H em que ainda encaixam
        const ne = 16, len = vr * .42, sA = vr * .36, rot = t * .04;
        let ancH = null, ancN = null, ancA = null;
        for (let i = 0; i < ne; i++) {
          const a = rot + i / ne * TAU, c = Math.cos(a), s = Math.sin(a), am = a % TAU;
          if (i % 2 === 0) {
            espH(vx + c * vr, vy + s * vr, a, len, S.sv);
            if (i / 2 < nb) { const d = vr + len + 1 + sA; anticorpo(vx + c * d, vy + s * d, a + PI, sA); if (!ancA || c > ancA[2]) ancA = [vx + c * (d - sA * .3), vy + s * (d - sA * .3), c]; }
            if (!ancH || Math.abs(am - 3.9) < ancH[2]) ancH = [vx + c * (vr + len * .9), vy + s * (vr + len * .9), Math.abs(am - 3.9)];
          } else {
            espicula(vx + c * vr, vy + s * vr, a, len * .85, { tipo: 'N' });
            if (!ancN || Math.abs(am - 2.4) < ancN[2]) ancN = [vx + c * (vr + len * .75), vy + s * (vr + len * .75), Math.abs(am - 2.4)];
          }
        }
        envelope(vx, vy, vr, { f: '#1E1830' });
        novelo(vx, vy, vr * .62, { tipo: 'rna', seg: 8, ph: t * .4 });
        // anticorpos soltos, que já não encaixam, rondando
        for (let i = nb; i < 8; i++) {
          const a = i / 8 * TAU + t * .35, d = vr * (2.05 + .15 * Math.sin(t * 1.3 + i)), x = vx + Math.cos(a) * d, y = vy + Math.sin(a) * d * .92;
          anticorpo(x, y, a + PI + .9 * Math.sin(t + i), sA, { a: .6 });
          if (!ancA) ancA = [x, y, -2];
        }
        if (LB) {
          if (ancH) lab(ancH[0], ancH[1], vx - vr * 2.3, vy - vr * 1.55, 'espícula H');
          if (ancN) lab(ancN[0], ancN[1], vx - vr * 2.3, vy + vr * 1.55, 'espícula N');
          if (ancA) lab(ancA[0], ancA[1], vx + vr * 2.35, vy - vr * 1.8, 'anticorpo');
          lab(vx + vr * .3, vy + vr * .25, vx + vr * 2.3, vy + vr * 2.05, '8 pedaços de RNA');
        }
        // quadro ampliado: a ponta da espícula H e a ponta do anticorpo, como chave e fechadura
        if (I.h > 90) {
          panel(I.x, I.y, I.w, I.h, { r: 10 });
          mtx(NAR ? 'ampliado' : 'ampliado: espícula H e anticorpo', I.x + 10, I.y + 14, { s: 12, c: K('dim'), a: 'left', bg: false });
          const hx = I.x + I.w / 2, hw = I.w * .6, eh = I.h * .14, yE = I.y + I.h * .66;
          const topH = u => yE - eh * perfil(u, S.sv), botA = u => yE - eh * perfil(u, S.sa);
          let dmax = -1e9; for (let i = 0; i <= 24; i++) { const u = i / 24; dmax = Math.max(dmax, botA(u) - topH(u)); }
          const gap = dmax + (f > .98 ? 0 : 3), ph0 = [], ph1 = [];
          for (let i = 0; i <= 24; i++) { const u = i / 24, x = hx - hw / 2 + u * hw; ph0.push([x, topH(u)]); ph1.push([x, botA(u) - gap]); }
          line(hx, I.y + I.h - 8, hx, yE + eh * .5, K('espicula'), 5);
          shape([[hx - hw / 2, yE + eh * .6], ...ph0, [hx + hw / 2, yE + eh * .6]], K('espicula'), dark(K('espicula'), .45), 1.5);
          const yT = Math.min(...ph1.map(q => q[1])) - eh * .5, ac = K('anticorpo');
          shape([[hx - hw / 2, yT], ...ph1, [hx + hw / 2, yT]], rgba(ac, .35), ac, 2);
          const yF = yT - eh * 1.1; X.lineCap = 'round';
          line(hx, yF, hx - hw * .32, yT, ac, 5); line(hx, yF, hx + hw * .32, yT, ac, 5); line(hx, yF, hx, Math.min(yF, I.y + 28), ac, 5); X.lineCap = 'butt';
        }
        // placar
        if (P.w > 90) {
          const c3 = f > .6 ? K('ok') : f > .25 ? K('espicula') : K('erro');
          mtx(`ano ${S.ano}`, P.x, P.y, { s: fs(15, 18), w: 700, f: FH, c: K('txt'), a: 'left' });
          cabe(`vacina feita no ano ${S.vacAno}`, P.x, P.y + 22, P.w, { s: 12, c: K('dim'), a: 'left' });
          cabe('anticorpos que encaixam', P.x, P.y + 44, P.w, { s: 12, c: K('dim'), a: 'left' });
          mtx(`${nb} de 8`, P.x, P.y + 66, { s: fs(16, 20), w: 700, f: FH, c: c3, a: 'left' });
          const bw = Math.min(P.w, 150); rr(P.x, P.y + 84, bw, 8, 4, 'rgba(201,211,240,.18)', null); if (f > .01) rr(P.x, P.y + 84, bw * f, 8, 4, c3, null);
          if (S.novo && f < .05) wrapTx('vírus novo: risco de pandemia', P.x, P.y + 110, P.w, { s: 12, w: 700, c: K('erro'), a: 'left' });
        }
        cap(S.novo && f < .05 ? 'Depois da <b>troca de segmentos</b>, nenhum anticorpo encaixa: quase ninguém tem defesa. É assim que nascem as <b>pandemias</b> de gripe.'
          : f > .95 ? 'A <b>vacina nova</b>, feita com as cepas que mais circulam, deixa os anticorpos com a forma atual das espículas.'
            : 'A cada ano, <b>pequenas mutações</b> mudam um pouco as espículas H e N, e os anticorpos do ano anterior encaixam pior. Por isso a vacina da gripe é <b>anual</b>.');
      },
      troca(t, S, A, top, bot) {
        const k = S.ph - S.troca, hh = bot - top, cx = A.cx, cy = top + hh / 2 + 10;
        const rx = Math.min(A.w * .46, 300), ry = Math.min(hh * .36, 160), vr = Math.min(rx, ry) * .3, CA = '#FFC2B5';
        celula(cx, cy, rx, ry, { nuc: false, ribo: 12, seed: 4 });
        const ly = cy - ry - 16; bicho('porco', cx - mtw('célula de porco', 12, 600) / 2 - 18, ly, 22, { c: K('envelope') }); mtx('célula de porco', cx, ly, { s: 12, w: 600, c: K('envelope') });
        // vírus com 8 pedaços de RNA coloridos pela origem (coral: humano; claro: ave)
        const vir = (x, y, cores, a = 1) => {
          envelope(x, y, vr, { esp: 10, espTipo: i => i % 2 ? 'N' : 'H', espLen: vr * .4, f: '#1E1830', a });
          cores.forEach((c, i) => { const g2 = i / 8 * TAU + .3, mx = x + Math.cos(g2) * vr * .45, my = y + Math.sin(g2) * vr * .45, d = g2 + PI / 2; fita([[mx - Math.cos(d) * vr * .22, my - Math.sin(d) * vr * .22], [mx + Math.cos(d) * vr * .22, my + Math.sin(d) * vr * .22]], { c, amp: 1.5, ond: 8, lw: 2.2, a }); });
        };
        const nome = (s, x, ic, a) => { X.save(); X.globalAlpha *= a; mtx(s, x, cy + vr * 1.5 + 12, { s: 12, w: 700, c: K('txt') }); if (ic) bicho(ic, x, cy - vr * 1.45 - 16, 24, { c: SAUDE }); X.restore(); };
        const H8 = Array(8).fill(K('rna')), A8 = Array(8).fill(CA), M8 = [K('rna'), CA, K('rna'), K('rna'), CA, K('rna'), CA, K('rna')];
        const e = ss(k / 1.4), fora = 1 - ss((k - 2.2) / .6);
        if (fora > .02) {
          const xa = lerp(cx - rx - vr * 2, cx - rx * .45, e), xh = lerp(cx + rx + vr * 2, cx + rx * .45, e);
          vir(xa, cy, A8, fora); vir(xh, cy, H8, fora);
          nome('vírus de ave', xa, 'ave', fora); nome('vírus humano', xh, 'humano', fora);
        }
        if (k > 1.8) {
          vir(cx, cy, M8, ss((k - 1.8) / 1));
          if (k > 2.8) { nome('vírus novo', cx, null, ss((k - 2.8) / .5)); wrapTx('segmentos de RNA misturados: os claros vieram do vírus de ave', cx, cy + ry + 18, A.w - 20, { s: 12, w: 700, lh: 16, c: CA, a: 'center' }); }
        }
        cap(k < 1.6 ? 'Um vírus de ave e um vírus humano infectam a <b>mesma célula</b> (aqui, de porco).'
          : 'Dentro da célula, os dois <b>trocam segmentos</b> de RNA: nasce um vírus muito diferente, com espículas novas.');
        if (k > 5 && !S.paused) { S.troca = null; S.sv += 3; S.ano++; S.novo = true; }
      }
    };
    def('doencas', 'respiratorias', D3);
  }

  // =================================================================================
  // D4: #doencas/hepatites-hpv
  // =================================================================================
  {
    // "Qual via?": cada cartão aceita os vírus que o roteiro admite (ok); a cor do alvo é a cor da via
    const DICA = ['Pense em água e alimentos.', 'Objeto cortante leva sangue de uma pessoa para outra.', 'Qual hepatite tem vacina logo ao nascer?', 'Pense na infecção sexualmente transmissível mais comum.', 'O sangue doado é testado.'];
    const BV = baralho({
      nome: 'via',
      cartas: [
        { t: 'Comer salada lavada com água contaminada', k: 0, ok: [0], m: () => '<b>Hepatite A</b>, via <b>fecal-oral</b>: água e alimentos contaminados com fezes. É mais comum onde falta saneamento básico.' },
        { t: 'Compartilhar alicate de unha', k: 2, ok: [1, 2], m: k => `<b>Hepatite ${k === 1 ? 'B' : 'C'}</b>, pelo <b>sangue</b> que fica no objeto cortante. A hepatite ${k === 1 ? 'C' : 'B'} também passa assim.` },
        { t: 'Nascer de mãe com hepatite B', k: 1, ok: [1], m: () => '<b>Hepatite B</b>, da mãe para o bebê. Por isso a vacina contra a hepatite B é dada logo ao nascer.' },
        { t: 'Relação sexual sem preservativo', k: 3, ok: [1, 3], m: k => k === 3 ? '<b>HPV</b>, pelo contato de pele e mucosa: é a infecção sexualmente transmissível mais comum. A hepatite B também passa por via sexual.' : '<b>Hepatite B</b>, por via sexual. O HPV também passa assim, e o preservativo reduz o risco dele, mas não o elimina.' },
        { t: 'Transfusão com sangue testado', k: 4, ok: [4], m: () => '<b>Risco muito baixo.</b> Antes da testagem do sangue doado, a transfusão transmitia a hepatite C. Hoje essa via ficou muito rara.' }
      ],
      alvos: [{ t: 'Hepatite A', c: K('fecal') }, { t: 'Hepatite B', c: K('sangue') }, { t: 'Hepatite C', c: K('sangue') }, { t: 'HPV', c: K('sangue') }, { t: 'Risco muito baixo', c: K('dim') }],
      certo: c => `Certo. ${c.m(c.k)}`,
      errado: c => `Ainda não. ${DICA[c.i]}`,
      fim: () => 'Pronto. Marrom: via <b>fecal-oral</b> (hepatite A, ligada ao saneamento). Vermelho: <b>sangue e sexual</b> (hepatites B e C, HPV).',
      dica: 'Primeiro toque numa situação; depois, no vírus.'
    });
    const MV = multi(BV, 'via');

    // fígado esquemático; k: 0 saudável, 1 inflamado (inchado, avermelhado), 2 cirrose (menor, endurecido, com nódulos)
    function figado(x, y, s, k) {
      const inch = k <= 1 ? 1 + .08 * k : 1.08 - .16 * (k - 1), sx = s * inch, sy = s * inch * (k > 1 ? 1 - .06 * (k - 1) : 1);
      const cor = k <= 1 ? mix(FIG, '#E0524A', k) : mix('#E0524A', '#8A6A4A', k - 1);
      const P = q => [x + q[0] * sx, y + q[1] * sy], G = new Path2D();
      const a = P([-1, -.15]); G.moveTo(a[0], a[1]);
      const cb = (c1, c2, e) => { const p1 = P(c1), p2 = P(c2), p3 = P(e); G.bezierCurveTo(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]); };
      cb([-.95, -.7], [-.2, -.7], [.25, -.5]); cb([.55, -.42], [.95, -.45], [1, -.3]); cb([.95, -.1], [.5, .05], [.1, .2]);
      cb([-.2, .45], [-.7, .7], [-.85, .45]); cb([-1.02, .25], [-1.02, .05], [-1, -.15]); G.closePath();
      X.fillStyle = cor; X.fill(G);
      X.save(); X.clip(G);
      const l1 = P([.12, -.55]), l2 = P([.02, .15]); line(l1[0], l1[1], l2[0], l2[1], 'rgba(11,15,28,.35)', 2);
      if (k > 1.02) { const R = rng(5), m = cl((k - 1) * 1.5, 0, 1); for (let i = 0; i < 70; i++) { const q = P([-1 + R() * 2, -.62 + R() * 1.15]); circ(q[0], q[1], s * (.03 + R() * .025) * m, rgba('#E9C9A0', .45), rgba('#3A2A1A', .5), 1); } }
      X.restore();
      X.strokeStyle = light(cor, .3); X.lineWidth = 2; X.stroke(G);
    }
    // linha do tempo de 0 a 30 anos; fases = [[de, até, cor, rótulo]]; marcas(xs, y) desenha extras
    function linhaTempo(A, yr, fases, marcas) {
      const x0 = A.x0 + (NAR ? 4 : 40), x1 = A.x1 - (NAR ? 4 : 40), y = A.y1 - (NAR ? 30 : 28), xs = v => lerp(x0, x1, cl(v / 30, 0, 1));
      rr(x0, y - 7, x1 - x0, 14, 4, 'rgba(201,211,240,.12)', null);
      for (const [a, b, c] of fases) rr(xs(a) + 1, y - 7, Math.max(2, xs(b) - xs(a) - 2), 14, 4, rgba(c, yr >= a ? .75 : .22), null);
      // rótulos da esquerda para a direita, sem encostar um no outro (se o longo não couber, vai o curto)
      const usado = [], livre = (p, q) => usado.every(([u, v]) => q + 6 < u || p > v + 6);
      for (const [a, b, c, l] of fases) {
        if (!l) continue; const w = xs(b) - xs(a), cx = (xs(a) + xs(b)) / 2, curto = l.split(',')[0].split(' e ')[0];
        const op = [[l, cx, 'center', mtw(l, 12, 600) < w - 8], [curto, cx, 'center', mtw(curto, 12, 600) < w + 10], [curto, x0, 'left', a === 0]];
        for (const [s, px, al, ok] of op) {
          const tw0 = mtw(s, 12, 600), p0 = al === 'left' ? px : px - tw0 / 2;
          if (ok && livre(p0, p0 + tw0)) { usado.push([p0, p0 + tw0]); mtx(s, px, y - 19, { s: 12, w: 600, c, a: al }); break; }
        }
      }
      if (marcas) marcas(xs, y);
      for (const v of [0, 10, 20, 30]) tx(v ? `${v} anos` : '0', xs(v), y + 19, { s: 12, c: K('dim'), a: v === 30 ? 'right' : v ? 'center' : 'left' });
      circ(xs(yr), y, 7, '#E8EDF7', '#0B0F1C', 2);
    }
    function hepB(t, S, A) {
      const yr = S.v, vac = !!S.vacB, tly = A.y1 - (NAR ? 30 : 28);
      const avail = tly - 50 - A.y0, s = Math.min(NAR ? A.w * .36 : A.w * .2, 160, (avail - 40) / 2.05);
      const fx = A.cx, fy = A.y0 + 1.2 * s + Math.max(0, (avail - 2.05 * s - 40) / 2);
      // inflamação ao longo de uma hepatite B que vira crônica (esquema)
      const k = vac ? 0 : yr < .25 ? ss(yr / .25) : yr < .5 ? lerp(1, .7, ss((yr - .25) / .25)) : yr < 12 ? .7 : yr < 20 ? lerp(.7, 1, (yr - 12) / 8) : 1 + ss((yr - 20) / 6);
      // vírus da hepatite B (DNA, com envelope) chegando por cima; com a vacina, os anticorpos barram
      for (let i = 0; i < 5; i++) {
        const ph = fr(t * .22 + i / 5), a0 = -PI + .3 + i / 4 * (PI - .6), d = lerp(1.9 * s, vac ? 1.3 * s : .62 * s, ss(Math.min(1, ph * 1.4)));
        const x = fx + Math.cos(a0) * d, y = fy + Math.sin(a0) * d * .62, al = ph > .8 ? (1 - ph) * 5 : ph < .1 ? ph * 10 : 1;
        if (!vac && yr < .02) continue;
        virion(x, y, s * .075, { tipo: 'herpes', rot: t * .3 + i, ph: t, a: al });
        if (vac) anticorpo(fx + Math.cos(a0) * 1.08 * s, fy + Math.sin(a0) * 1.08 * s * .62, a0, s * .14);
      }
      figado(fx, fy, s, k);
      const est = vac || yr < .02 ? 'saudável' : yr < .5 ? 'hepatite aguda' : yr < 20 ? 'hepatite crônica' : 'cirrose';
      tok(fx, fy + s * .78 + 12, est, est === 'saudável' ? K('ok') : est === 'cirrose' ? '#C9A06A' : ROSA, { s: 13 });
      if (vac) mtx('vacinada ao nascer: os anticorpos barram o vírus', fx, fy + s * .78 + 38, { s: fs(12, 13), w: 700, c: K('ok') });
      linhaTempo(A, yr, vac ? [[0, 30, K('ok'), 'protegida a vida toda']] : [[0, .5, ROSA, 'aguda'], [.5, 20, '#E0524A', 'crônica, muitas vezes sem sintomas'], [20, 30, '#C9A06A', 'cirrose e risco de câncer']]);
      cap(vac ? 'A <b>vacina contra a hepatite B</b> é dada <b>logo ao nascer</b> e faz parte do calendário em várias doses: o vírus não se instala.'
        : yr < .5 ? 'A <b>hepatite B</b> (vírus de DNA, com envelope) passa por sangue, relação sexual e da mãe para o bebê. O fígado inflama.'
          : yr < 20 ? 'A hepatite B pode virar uma infecção <b>crônica</b>. Muitas pessoas <b>não têm sintomas</b> por anos; por isso a testagem é importante.'
            : 'Depois de anos, a hepatite B crônica pode causar <b>cirrose</b> (fígado endurecido, com nódulos) e <b>câncer de fígado</b>.');
    }
    function hpv(t, S, A) {
      const yr = S.v, vac = !!S.vacH, exam = !!S.exam && !vac;
      // estágio: 0 normal, 1 infecção persistente, 2 lesão, 3 lesão avançada, 4 câncer, ao longo de 10 a 20 anos (esquema)
      let g = vac ? 0 : yr < .5 ? 0 : yr < 3 ? 1 : yr < 8 ? 1 + (yr - 3) / 5 : yr < 14 ? 2 + (yr - 8) / 6 : yr < 18 ? 3 + (yr - 14) / 4 : 4;
      const achou = exam && yr >= 5;
      if (achou) g = yr < 6 ? lerp(1.4, 0, ss(yr - 5)) : 0;
      const tly = A.y1 - (NAR ? 30 : 28);
      const sx0 = A.x0 + (NAR ? 0 : A.w * .06), sw = NAR ? A.w : A.w * .88, sy0 = A.y0 + 56, sh = tly - 44 - sy0;
      const eh = sh * .52, bm = sy0 + eh;
      // cabeçalho: o que é o corte e em que estágio está
      mtx(NAR ? 'colo do útero (corte)' : 'epitélio do colo do útero, em corte', sx0, A.y0 + 10, { s: 12, w: 600, c: K('dim'), a: 'left' });
      const nomes = ['células normais', 'infecção persistente', 'lesão', 'lesão avançada', 'câncer'];
      const est = vac ? 'protegida pela vacina' : achou && yr >= 5.5 ? 'lesão tratada' : nomes[Math.min(4, Math.floor(g + .001))];
      const tc = est === 'câncer' ? '#F0605D' : ['células normais', 'lesão tratada', 'protegida pela vacina'].includes(est) ? K('ok') : ROSA;
      tok(sx0 + sw - mtw(est, 13, 700) / 2 - 8, A.y0 + 10, est, tc, { s: 13 });
      // corte: epitélio, membrana basal, tecido de baixo com um vaso
      rr(sx0, sy0, sw, sh, 10, 'rgba(19,26,43,.5)', K('line'), 1);
      X.save(); X.beginPath(); X.roundRect(sx0, sy0, sw, sh, 10); X.clip();
      rr(sx0, bm, sw, sh - eh, 0, 'rgba(240,106,174,.08)', null);
      X.beginPath(); X.moveTo(sx0, bm + (sh - eh) * .65); X.bezierCurveTo(sx0 + sw * .3, bm + (sh - eh) * .4, sx0 + sw * .6, bm + (sh - eh) * .9, sx0 + sw, bm + (sh - eh) * .6); X.strokeStyle = 'rgba(240,96,93,.45)'; X.lineWidth = 6; X.stroke();
      const rows = 5, cols = Math.max(8, Math.round(sw / (NAR ? 30 : 38))), cwid = sw / cols, rh = eh / rows, R = rng(9);
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const base = (rows - 1 - r) / (rows - 1); // 0 na camada de baixo
        const ab = g < 1 ? 0 : g < 2 ? (base < .3 ? g - 1 : 0) : g < 3 ? (base < .3 + .7 * (g - 2) ? 1 : 0) : 1;
        const flat = 1 - base * .55 * (1 - ab), x = sx0 + (c + .5) * cwid + (r % 2) * cwid * .25, y = sy0 + (r + .5) * rh;
        const cc = mix('#C9D3F0', '#F0605D', ab * .8), rn = .7 + R() * .6;
        if (x > sx0 + sw - cwid * .3) continue;
        ell(x, y, cwid * .44, rh * .44 * flat + rh * .02, 0, rgba(cc, .22), rgba(cc, .7), 1);
        circ(x, y, Math.min(cwid, rh) * (.12 + ab * .14 * rn), ab > .3 ? 'rgba(154,107,255,.9)' : 'rgba(124,138,168,.85)');
      }
      // câncer: células atravessam a membrana basal
      if (g > 3) { const m = cl(g - 3, 0, 1), R2 = rng(4); for (let i = 0; i < 14 * m; i++) { const x = sx0 + sw * (.3 + R2() * .4), y = bm + 6 + R2() * (sh - eh) * .55 * m; circ(x, y, rh * .3, 'rgba(240,96,93,.3)', '#F0605D', 1); circ(x, y, rh * .13, K('dna')); } }
      X.restore();
      line(sx0, bm, sx0 + sw, bm, g > 3 ? rgba(K('espicula'), .5) : K('espicula'), 2, g > 3 ? [5, 4] : null);
      if (LB) mtx('membrana basal', sx0 + sw - 8, bm + 12, { s: 12, w: 600, c: K('espicula'), a: 'right' });
      // HPV (DNA, sem envelope) chegando à superfície; com a vacina, os anticorpos barram
      for (let i = 0; i < 3; i++) {
        const ph = fr(t * .2 + i / 3), x = sx0 + sw * (.42 + i * .14), r0 = Math.max(6, rh * .3);
        if (vac) { virion(x + 4, sy0 - 18 - ph * 6, r0, { tipo: 'nu', rot: t * .3 + i, a: 1 - ph }); anticorpo(x - 8, sy0 - 2, -PI / 2 - .3, Math.max(12, rh * .5)); }
        else if (!achou && yr < 1.5) virion(x, lerp(A.y0 + 34, sy0 + rh * .6, ss(ph)), r0, { tipo: 'nu', rot: t * .3 + i, a: ph > .85 ? (1 - ph) * 6 : 1 });
      }
      if (achou) { const lx = sx0 + sw * .72, ly = sy0 + eh * .7, lr = Math.min(30, rh * 1.5); circ(lx, ly, lr, 'rgba(232,237,247,.06)', K('ok'), 3); line(lx + lr * .7, ly + lr * .7, lx + lr * 1.3, ly + lr * 1.3, K('ok'), 4); }
      const fases = vac ? [[0, 30, K('ok'), 'vacina: barreira antes da infecção']] : exam ? [[0, 5, ROSA, ''], [5, 30, K('ok'), achou ? 'lesão tratada a tempo' : '']] : [[0, 3, ROSA, 'infecção'], [3, 14, '#E0524A', 'lesões'], [14, 30, '#F0605D', 'câncer']];
      linhaTempo(A, yr, fases, (xs, y) => { if (exam) { line(xs(5), y - 12, xs(5), y + 9, K('ok'), 2.5); if (!achou) mtx('exame preventivo', xs(5) + 6, y - 19, { s: 12, w: 700, c: K('ok'), a: 'left' }); } });
      cap(vac ? 'A <b>vacina contra o HPV</b>, gratuita no SUS para <b>meninas e meninos</b> antes do início da vida sexual, protege contra os tipos que causam câncer.'
        : achou ? 'O <b>exame preventivo</b> (Papanicolau e teste de DNA do HPV) encontra a lesão no começo, e ela é tratada antes de virar câncer.'
          : g < 1 ? 'O <b>HPV</b> (vírus de DNA, sem envelope) passa nas relações sexuais. A maioria das infecções <b>some sozinha</b>; aqui, o caso em que ela persiste.'
            : g < 4 ? 'Quando a infecção por tipos como o <b>16</b> e o <b>18</b> persiste, as células mudam aos poucos, ao longo de 10 a 20 anos.'
              : 'Depois de anos de infecção persistente, as células atravessam a membrana basal: <b>câncer do colo do útero</b>.');
    }

    def('doencas', 'hepatites-hpv', {
      t: 'Hepatites virais e HPV', s: 'fígado, câncer e as vacinas que os previnem', c: K('fecal'), loc: 'Fígado em esquema (hepatite B)', locNota: 'Linha do tempo esquemática',
      alt: 'Três modos. Hepatite B: um fígado esquemático passa de saudável a inflamado, à hepatite crônica e à cirrose com nódulos ao longo de décadas; com a vacina ao nascer, anticorpos barram o vírus e o fígado continua saudável. HPV: corte do colo do útero em que as células mudam aos poucos, de lesão a câncer, ao longo de 10 a 20 anos, com as barreiras da vacina e do exame preventivo. Qual via?: cartões de situações para levar à hepatite A, B, C, ao HPV ou ao risco muito baixo, com a cor da via de transmissão',
      d: `<p><b>Hepatite</b> é inflamação do <b>fígado</b>, e vários vírus diferentes podem causá-la. A <b>hepatite A</b> (vírus de RNA, <b>sem envelope</b>) passa pela via <b>fecal-oral</b>: água e alimentos contaminados com fezes. É mais comum onde falta <b>saneamento básico</b>, costuma ser aguda e curar sozinha, e tem vacina no calendário infantil. A <b>hepatite B</b> (vírus de <b>DNA</b>, com envelope) passa por <b>sangue</b>, <b>relação sexual</b> e <b>da mãe para o bebê</b>. Pode virar uma infecção <b>crônica</b> e, depois de anos, causar <b>cirrose</b> e <b>câncer de fígado</b>. A <b>vacina</b> contra a hepatite B é dada <b>logo ao nascer</b> e faz parte do calendário em várias doses. A <b>hepatite C</b> (vírus de RNA) passa principalmente por <b>sangue</b> (seringas compartilhadas, objetos cortantes, procedimentos sem material esterilizado; antes da testagem do sangue doado, também por transfusão). Não tem vacina, mas hoje tem <b>cura</b> com remédios antivirais em mais de 95% dos casos. Muitas pessoas com hepatite B ou C <b>não têm sintomas</b> por anos; por isso a testagem é importante. (Existem também as hepatites D, que só ocorre em quem tem a B, e E, fecal-oral.)</p>
<p>O <b>HPV</b> (papilomavírus humano) é um vírus de <b>DNA</b>, <b>sem envelope</b>, com mais de 200 tipos. É a <b>infecção sexualmente transmissível mais comum</b>: passa pelo contato de pele e mucosa nas relações sexuais, e o preservativo <b>reduz, mas não elimina</b> o risco, porque o vírus pode estar em regiões que ele não cobre. A maioria das infecções some sozinha. Alguns tipos (como o <b>6</b> e o <b>11</b>) causam <b>verrugas genitais</b>; outros (sobretudo o <b>16</b> e o <b>18</b>) podem, depois de anos de infecção persistente, causar <b>câncer do colo do útero</b>, além de câncer de ânus, pênis e garganta. A <b>vacina</b> contra o HPV, gratuita no SUS para <b>meninas e meninos</b> numa faixa de idade antes do início da vida sexual, protege contra esses tipos. É uma <b>vacina contra o câncer</b>. O exame <b>preventivo</b> (citopatológico, o "Papanicolau", e o teste de DNA do HPV) encontra lesões antes que virem câncer.</p>
<p>Idades, doses e público de cada vacina mudam: confira o <b>calendário vigente</b> do Ministério da Saúde (link abaixo).</p>
<table><thead><tr><th>Vírus</th><th>Material genético</th><th>Transmissão</th><th>Prevenção principal</th></tr></thead><tbody>
<tr><td>Hepatite A</td><td>RNA, sem envelope</td><td>fecal-oral (água e alimentos)</td><td>saneamento, higiene, vacina</td></tr>
<tr><td>Hepatite B</td><td>DNA, com envelope</td><td>sangue, sexual, mãe para filho</td><td>vacina (ao nascer), preservativo</td></tr>
<tr><td>Hepatite C</td><td>RNA, com envelope</td><td>sangue</td><td>não compartilhar seringas e objetos cortantes; testagem e tratamento (tem cura)</td></tr>
<tr><td>HPV</td><td>DNA, sem envelope</td><td>sexual (pele e mucosa)</td><td>vacina, preservativo, exame preventivo</td></tr>
</tbody></table>
<p>Quadro: Ministério da Saúde. Na animação, arraste a faixa <b>Tempo</b> e ligue as barreiras; em <b>Qual via?</b>, leve cada situação ao vírus certo.</p>`,
      enem: 'As hepatites se separam pela <b>via de transmissão</b>: a <b>A</b> é <b>fecal-oral</b> e está ligada a <b>saneamento</b>; a <b>B</b> e a <b>C</b> passam por <b>sangue</b> (a B também por via sexual e da mãe para o filho). A <b>B</b> tem vacina, a <b>C</b> tem cura. O <b>HPV</b> aparece ligado ao <b>câncer do colo do útero</b> e à vacinação de meninas <b>e meninos</b>. Pegadinha: vacinar meninos não é "à toa": eles transmitem o vírus e também podem ter câncer pelo HPV.',
      links: [CAL, ['Cada via, sua prevenção', '#prevencao/transmissao'], ['Vacina, soro e antivirais', '#prevencao/vacinas']],
      ctl: { l: 'Tempo', min: 0, max: 30, step: .25, v: 0, f: anos, rate: () => 1 },
      auto: S => S.modo === 2 ? 0 : S.v < 1 ? .7 : 3.2, stillV: 30, still: 2.5,
      extra: [
        { t: 'Hepatite B', pressed: S => S.modo === 0, on(S) { S.modo = 0; } },
        { t: 'Vacinada ao nascer', pressed: S => !!S.vacB, on(S) { S.vacB = !S.vacB; S.modo = 0; } },
        { t: 'HPV', pressed: S => S.modo === 1, on(S) { S.modo = 1; } },
        { t: 'Vacina contra o HPV', pressed: S => !!S.vacH, on(S) { S.vacH = !S.vacH; S.modo = 1; } },
        { t: 'Exame preventivo', pressed: S => !!S.exam, on(S) { S.exam = !S.exam; S.modo = 1; } },
        { t: 'Qual via?', pressed: S => S.modo === 2, on(S) { S.modo = 2; } }
      ],
      init(S) { if (S.modo == null) { S.modo = 0; S.vacB = S.vacH = S.exam = false; BV.zera(S); } },
      tap(x, y, S) { if (S.modo === 2) MV.tap(x, y, S); },
      grab(x, y, S) { return S.modo === 2 && BV.grab(x, y, S); }, grabMove: BV.grabMove, grabEnd: MV.grabEnd,
      draw(t, S) {
        const A = area();
        faixa(S.modo !== 2);
        if (S.modo === 0) { onde('Fígado em esquema (hepatite B)', 'Linha do tempo esquemática'); return hepB(t, S, A); }
        if (S.modo === 1) { onde('Colo do útero em corte (HPV)', 'Linha do tempo esquemática'); return hpv(t, S, A); }
        onde('Situações do dia a dia', 'Cartões para classificar');
        BV.draw(S, { x0: A.x0, y0: A.y0, x1: A.x1, y1: A.y1 }, { cols: NAR ? 2 : 5, cartaH: NAR ? 44 : 46 });
        cap(BV.msg(S) || 'Toque numa situação e depois no vírus que ela pode transmitir. Marrom: via <b>fecal-oral</b>. Vermelho: <b>sangue e sexual</b>.');
      }
    });
  }
}
