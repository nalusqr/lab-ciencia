/* LAB, módulo Vírus. Cenas D (Íris): doenças (HIV e aids; gripe, covid-19 e sarampo; hepatites virais e HPV).
   Fonte científica: docs/revisao-biologia/virus-roteiro.md (Taxon, revisão do Sapien), tópicos D2, D3 e D4.
   Usa a API do motor.js (def, area, tx, mtx, tw, mtw, wrapTx, rr, circ, ell, line, poly, shape, hitR, hitAt, cap, C...).
   Código, textos e desenhos da equipe, em esquema próprio. Dados que mudam (vacinas) seguem só o roteiro: sem idades fixas. */
'use strict';
{
  // ---------------------------------------------------------------------------------
  // cores (paleta C do motor quando existir; a reserva segue a proposta do roteiro)
  // ---------------------------------------------------------------------------------
  const RES = {
    virus: '#B9C2D3', dna: '#9A6BFF', rna: '#FF8A6B', envelope: '#F06AAE', espicula: '#F7C13B', anticorpo: '#CFE0FF',
    vetor: '#9FD84A', resp: '#5AA9FF', sangue: '#F0605D', fecal: '#C08A5A',
    txt: '#E8EDF7', dim: '#9DA9C4', line: '#5B6C99', ok: '#6BCB77', erro: '#F0605D'
  };
  const K = n => (typeof C !== 'undefined' && C && C[n]) || RES[n];
  const CD4C = '#4FA8FF', CVC = '#F0605D', DOENTE = '#FF9A3C', SAUDE = '#C9D3F0', FIG = '#B4584C', ANTI = K('anticorpo');
  const FUNDO = 'rgba(19,26,43,.82)';
  const CAL = (typeof LK !== 'undefined' && LK.calendario) || ['Calendário de vacinação vigente', 'https://www.gov.br/saude/pt-br/vacinacao/calendario'];
  const fs = (a, b) => NAR ? a : b;

  // toques: o motor chama o.tap; cada quadro registra as áreas com hitR
  const tapDe = fn => ({ tap(x, y, S) { const id = hitAt(x, y); if (id != null) fn(id, S); } });
  // botão desenhado no canvas
  function botao(x, y, w, h, s, id, o = {}) {
    const c = o.c || K('espicula'), on = !!o.on;
    rr(x, y, w, h, 8, on ? rgba(c, .28) : FUNDO, on ? c : 'rgba(255,255,255,.28)', on ? 2 : 1);
    let sz = fs(12, 13); while (sz > 12 && mtw(s, sz, 700) > w - 12) sz--;
    mtx(s, x + w / 2, y + h / 2 + .5, { s: sz, w: 700, c: K('txt'), bg: false });
    hitR(x, y, w, h, id);
  }
  // texto que encolhe até caber
  function cabe(s, x, y, maxw, o = {}) { let sz = o.s || 13; const w = o.w || 400; while (sz > 12 && mtw(s, sz, w) > maxw) sz--; return mtx(s, x, y, Object.assign({}, o, { s: sz })); }
  // escreve na faixa do controle quando a própria cena muda S.v
  function poeV(o, S, v) {
    S.v = v; const r = document.getElementById('ctlR'), vv = document.getElementById('ctlV'), s = o.ctl.f(v);
    if (r) { r.value = v; r.setAttribute('aria-valuetext', s); } if (vv) vv.textContent = s;
  }
  const faixa = on => { const r = document.getElementById('ctlR'); if (r && r.parentNode) r.parentNode.hidden = !on; };

  // partícula viral esquemática: envelope (rosa), capsídeo (cinza-azulado), ácido nucleico, espículas (âmbar)
  function virion(x, y, r, o = {}) {
    const env = o.env !== false, na = o.na || K('rna');
    if (env) {
      const n = o.n || 12;
      for (let i = 0; i < n; i++) {
        const a = i / n * TAU + (o.rot || 0), c = Math.cos(a), s = Math.sin(a);
        line(x + c * r, y + s * r, x + c * r * 1.32, y + s * r * 1.32, K('espicula'), Math.max(1.2, r * .09));
        circ(x + c * r * 1.36, y + s * r * 1.36, Math.max(1.4, r * .13), K('espicula'));
      }
      circ(x, y, r, rgba(K('envelope'), .3), K('envelope'), Math.max(1.5, r * .12));
      ngon(x, y, r * .7, 6, (o.rot || 0) + PI / 6, rgba(K('virus'), .25), K('virus'), Math.max(1, r * .08));
    } else ngon(x, y, r, 6, (o.rot || 0) + PI / 6, rgba(K('virus'), .3), K('virus'), Math.max(1.2, r * .12));
    // ácido nucleico: fio enrolado
    X.beginPath(); const rr2 = r * (env ? .42 : .55);
    for (let i = 0; i <= 24; i++) { const a = i / 24 * TAU * 1.5, q = rr2 * (.35 + .65 * Math.abs(Math.sin(i * .7))); i ? X.lineTo(x + Math.cos(a) * q, y + Math.sin(a) * q) : X.moveTo(x + Math.cos(a) * q, y + Math.sin(a) * q); }
    X.strokeStyle = na; X.lineWidth = Math.max(1.2, r * .1); X.stroke();
  }
  // anticorpo em Y
  function anticorpo(x, y, s, ang, c, a = 1) {
    X.save(); X.globalAlpha *= a; X.translate(x, y); X.rotate(ang); X.lineCap = 'round';
    X.strokeStyle = c; X.lineWidth = Math.max(2, s * .16);
    X.beginPath(); X.moveTo(0, s * .55); X.lineTo(0, 0); X.lineTo(-s * .42, -s * .5); X.moveTo(0, 0); X.lineTo(s * .42, -s * .5); X.stroke();
    X.restore();
  }

  // ---------------------------------------------------------------------------------
  // cartões de pergunta ("Passa ou não passa?" e "Qual via?")
  // Q: [{ s, ok: [índices certos], r: 'rótulo da resposta', e: 'explicação', c: cor }]; ops: rótulos dos botões
  // ---------------------------------------------------------------------------------
  function quiz(S, A, Q, ops, titulo) {
    const q = S.q || (S.q = { i: 0, ans: null, ac: 0, n: 0 });
    const it = Q[q.i % Q.length], bw0 = Math.min(A.w, 600), x0 = A.cx - bw0 / 2, pad = fs(12, 18);
    const sz = fs(15, 18), lh = sz + 6, inner = bw0 - 2 * pad;
    const hS = wrapTx(it.s, 0, 0, inner, { s: sz, w: 700, lh, dry: true });
    // botões: em colunas que caibam
    const nb = ops.length, bh = 44, gap = 8;
    let cols = nb; while (cols > 1 && ops.some(s => mtw(s, 13, 700) + 20 > (inner - gap * (cols - 1)) / cols)) cols--;
    const rows = Math.ceil(nb / cols), bwid = (inner - gap * (cols - 1)) / cols;
    const hFb = q.ans == null ? 0 : wrapTx(it.e, 0, 0, inner - 20, { s: fs(13, 14), lh: fs(18, 20), dry: true }) + 34 + 52;
    const hTot = 30 + hS + 16 + rows * bh + (rows - 1) * gap + (q.ans == null ? 0 : 14 + hFb) + pad;
    const y0 = Math.max(A.y0 + 4, A.cy - hTot / 2 - 6);
    panel(x0, y0, bw0, hTot, { r: 14, f: 'rgba(19,26,43,.88)' });
    mtx(titulo, x0 + pad, y0 + 18, { s: 12, w: 700, c: K('dim'), a: 'left', bg: false });
    mtx(`situação ${q.i % Q.length + 1} de ${Q.length}`, x0 + bw0 - pad, y0 + 18, { s: 12, w: 600, c: K('dim'), a: 'right', bg: false });
    let y = y0 + 30 + lh / 2;
    wrapTx(it.s, x0 + pad, y, inner, { s: sz, w: 700, lh, a: 'left', c: K('txt') });
    y += hS + 16 - lh / 2;
    ops.forEach((s, i) => {
      const cx = x0 + pad + (i % cols) * (bwid + gap), cy = y + Math.floor(i / cols) * (bh + gap);
      let c = 'rgba(255,255,255,.28)', f = FUNDO, lw = 1;
      if (q.ans != null) { if (it.ok.includes(i)) { c = K('ok'); f = rgba(K('ok'), .22); lw = 2; } else if (i === q.ans) { c = K('erro'); f = rgba(K('erro'), .2); lw = 2; } }
      rr(cx, cy, bwid, bh, 8, f, c, lw);
      cabe(s, cx + bwid / 2, cy + bh / 2 + .5, bwid - 10, { s: 13, w: 700, c: K('txt'), bg: false });
      if (q.ans == null) hitR(cx, cy, bwid, bh, 'op' + i);
    });
    y += rows * bh + (rows - 1) * gap;
    if (q.ans != null) {
      y += 14; const certo = it.ok.includes(q.ans), cc = it.c || (certo ? K('ok') : K('erro'));
      rr(x0 + pad, y, inner, hFb - 52, 10, rgba(cc, .14), cc, 1.5);
      mtx((certo ? 'Certo. ' : 'Não é isso. ') + it.r, x0 + pad + 10, y + 16, { s: fs(13, 14), w: 700, a: 'left', c: K('txt'), bg: false });
      wrapTx(it.e, x0 + pad + 10, y + 36, inner - 20, { s: fs(13, 14), lh: fs(18, 20), a: 'left', c: '#D3DAEA' });
      const nw = Math.min(220, inner);
      botao(x0 + bw0 / 2 - nw / 2, y + hFb - 44, nw, 40, q.i % Q.length === Q.length - 1 ? 'Recomeçar' : 'Próxima situação', 'prox');
    }
    return q;
  }
  function quizTap(S, id, Q) {
    const q = S.q || (S.q = { i: 0, ans: null, ac: 0, n: 0 });
    if (id === 'prox') { if (q.i % Q.length === Q.length - 1) { q.ac = 0; q.n = 0; q.i = 0; } else q.i++; q.ans = null; return true; }
    if (typeof id === 'string' && id.startsWith('op') && q.ans == null) { q.ans = +id.slice(2); q.n++; if (Q[q.i % Q.length].ok.includes(q.ans)) q.ac++; return true; }
    return false;
  }

  // =================================================================================
  // D2: #doencas/hiv
  // =================================================================================
  {
    const TT = 4; // ano em que o tratamento começa (esquema)
    // curvas esquemáticas, sem tratamento: CD4 (células por mm³, escala até 1000) e carga viral (relativa, 0 a 1)
    const cd4s = y => y < .12 ? lerp(1000, 560, y / .12) : y < .6 ? lerp(560, 780, ss((y - .12) / .48)) : 780 - (y - .6) * 66;
    const cvs = y => y < .15 ? ss(y / .15) : y < .7 ? lerp(1, .26, ss((y - .15) / .55)) : y < 7 ? lerp(.26, .4, (y - .7) / 6.3) : lerp(.4, 1, ss((y - 7) / 3));
    const cd4t = y => y < TT ? cd4s(y) : lerp(cd4s(TT), 760, 1 - Math.exp(-(y - TT) / 1.6));
    const cvt = y => y < TT ? cvs(y) : cvs(TT) * Math.exp(-(y - TT) * 5);
    const cruza = (() => { for (let y = 1; y <= 10; y += .01) if (cd4s(y) < 200) return y; return 10; })();
    const OPO = ['tuberculose', 'pneumonia por <i>Pneumocystis</i>', 'candidíase', 'sarcoma de Kaposi'];
    const Q = [
      { s: 'Relação sexual sem preservativo', ok: [0], r: 'Transmite.', e: 'O HIV passa pelo sêmen e pela secreção vaginal. O preservativo previne.' },
      { s: 'Compartilhar seringa e agulha', ok: [0], r: 'Transmite.', e: 'O sangue com vírus fica na seringa e na agulha e entra direto na corrente sanguínea de quem usa depois.' },
      { s: 'Gestação de uma mulher vivendo com HIV, sem tratamento', ok: [0], r: 'Pode transmitir.', e: 'O vírus pode passar da mãe para o filho na gestação ou no parto. O tratamento da gestante reduz muito essa transmissão.' },
      { s: 'Amamentação por uma mãe vivendo com HIV', ok: [0], r: 'Pode transmitir.', e: 'O HIV pode estar no leite materno.' },
      { s: 'Abraço', ok: [1], r: 'Não transmite.', e: 'O HIV não passa pelo toque nem pelo suor.' },
      { s: 'Beijo no rosto', ok: [1], r: 'Não transmite.', e: 'Beijo no rosto, aperto de mão, suor e lágrimas não transmitem o HIV.' },
      { s: 'Usar o mesmo copo ou os mesmos talheres', ok: [1], r: 'Não transmite.', e: 'Copos, talheres e piscina não transmitem o HIV.' },
      { s: 'Picada de mosquito', ok: [1], r: 'Não transmite.', e: 'O HIV não se multiplica no mosquito, e o mosquito não injeta o sangue de uma pessoa na outra. Já o vírus da dengue se multiplica no mosquito e chega à saliva dele.' },
      { s: 'Relação sexual com parceiro em tratamento, com carga viral indetectável há mais de seis meses', ok: [1], r: 'Não transmite pela via sexual.', e: 'Indetectável = intransmissível: o tratamento antirretroviral mantém o vírus tão baixo que ele não passa pela relação sexual.' }
    ];

    def('doencas', 'hiv', Object.assign({
      t: 'HIV e aids', s: 'o vírus que ataca a defesa do corpo', c: K('sangue'), loc: 'Linfócitos T CD4 e carga viral ao longo dos anos', locNota: 'Gráfico esquemático',
      alt: 'Gráfico de dez anos de infecção pelo HIV sem tratamento: a linha azul dos linfócitos T CD4 cai devagar e a linha vermelha da carga viral sobe no começo, cai e volta a subir no fim. Ao cruzar 200 CD4 por milímetro cúbico, aparecem doenças oportunistas. Com tratamento, a carga viral cai até indetectável e os linfócitos se recuperam. Há também um jogo de cartões "Passa ou não passa?"',
      d: `<p>O <b>HIV</b> (vírus da imunodeficiência humana) é um <b>retrovírus</b> que infecta principalmente os <b>linfócitos T auxiliares</b>, que têm a proteína <b>CD4</b> na membrana. Esses linfócitos coordenam a resposta imune: sem eles, os outros glóbulos brancos não são "avisados" do perigo. Logo depois da infecção, pode haver febre e mal-estar parecidos com uma gripe; depois, a pessoa pode passar <b>anos sem sintomas</b>, enquanto o vírus destrói os linfócitos aos poucos.</p>
<p>Sem tratamento, quando a quantidade de linfócitos CD4 fica muito baixa (abaixo de <b>200 por mm³</b> de sangue), o corpo perde a defesa contra micróbios que normalmente não causariam doença: são as <b>doenças oportunistas</b>, como tuberculose, pneumonia por <i>Pneumocystis</i>, candidíase e o câncer chamado sarcoma de Kaposi. Essa fase é a <b>aids</b> (síndrome da imunodeficiência adquirida). Ter HIV não é o mesmo que ter aids.</p>
<p>O HIV é transmitido por <b>sangue</b>, <b>sêmen</b>, <b>secreção vaginal</b> e <b>leite materno</b>: por <b>relação sexual sem preservativo</b>, pelo <b>compartilhamento de seringas e agulhas</b> e <b>da mãe para o filho</b> na gestação, no parto ou na amamentação (a transmissão por transfusão ficou muito rara com a testagem do sangue doado). O HIV <b>não</b> passa por abraço, beijo no rosto, aperto de mão, talheres, piscina, suor, lágrimas nem <b>picada de mosquito</b>.</p>
<p>Não há vacina nem cura, mas há <b>tratamento</b>: o <b>tratamento antirretroviral</b>, gratuito no SUS desde <b>1996</b>, controla o vírus. A pessoa em tratamento que mantém a carga viral <b>indetectável</b> por pelo menos seis meses <b>não transmite o HIV por via sexual</b> ("indetectável = intransmissível") e tem expectativa de vida próxima à de quem não tem o vírus. A prevenção combina <b>preservativo</b>, <b>testagem</b> (teste rápido gratuito), <b>PrEP</b> (remédio tomado antes, por quem tem maior chance de exposição), <b>PEP</b> (remédio começado em até <b>72 horas</b> depois de uma exposição de risco) e o tratamento da gestante, que reduz muito a transmissão para o bebê.</p>
<p>Na animação, arraste a faixa <b>Tempo</b> ou deixe os anos passarem; o botão <b>Com tratamento</b> redesenha o gráfico. Em <b>Passa ou não passa?</b>, decida se cada situação transmite o HIV.</p>`,
      kv: [['Vírus', 'HIV, retrovírus (RNA)'], ['Célula atacada', 'linfócito T auxiliar (CD4)'], ['Aids', 'CD4 abaixo de 200 por mm³ e doenças oportunistas'], ['Prevenção', 'preservativo, testagem, PrEP, PEP, tratamento da gestante']],
      enem: 'Saiba: HIV é <b>retrovírus</b>, ataca <b>linfócitos T CD4</b>, e a aids é a fase em que a imunidade cai e surgem <b>doenças oportunistas</b>. As <b>vias de transmissão</b> (sexual, sangue, mãe para filho) e as que <b>não</b> transmitem são as mais cobradas, muitas vezes em questões que combatem o <b>preconceito</b>. O tratamento combina <b>vários antirretrovirais</b> por causa da mutação rápida. Pegadinha: <b>mosquito não transmite HIV</b>, mas transmite dengue; a diferença é que o vírus da dengue se multiplica no mosquito e chega à saliva dele.',
      links: [['Retrovírus e transcriptase reversa', '#replicacao/retrovirus'], ['Cada via, sua prevenção', '#prevencao/transmissao']],
      ctl: { l: 'Tempo', min: 0, max: 10, step: .1, v: 0, f: v => `${nbr(v, 1)} ${Math.abs(v - 1) < .05 ? 'ano' : 'anos'}`, rate: () => 1 },
      auto: S => S.modo === 2 ? 0 : 1.1, stillV: 10, still: 2.5,
      extra: [
        { t: 'Sem tratamento', pressed: S => S.modo === 0, on(S) { S.modo = 0; faixa(true); } },
        { t: 'Com tratamento', pressed: S => S.modo === 1, on(S) { S.modo = 1; faixa(true); } },
        { t: 'Passa ou não passa?', pressed: S => S.modo === 2, on(S) { S.modo = 2; faixa(false); } }
      ],
      init(S) { if (S.modo == null) S.modo = 0; faixa(S.modo !== 2); },
      draw(t, S) {
        const A = area();
        if (S.modo === 2) {
          const q = quiz(S, A, Q, ['Transmite', 'Não transmite'], 'PASSA OU NÃO PASSA?');
          cap(q.n ? `Acertos: <b>${q.ac} de ${q.n}</b>. O HIV passa por sangue, sêmen, secreção vaginal e leite materno.` : 'Toque em <b>Transmite</b> ou <b>Não transmite</b>. O tom é de informação, sem medo: conhecer as vias combate o preconceito.');
          return;
        }
        const trat = S.modo === 1, yr = cl(S.v, 0, 10);
        const fC = trat ? cd4t : cd4s, fV = trat ? cvt : cvs;
        // quadro do gráfico; embaixo, faixa das doenças oportunistas
        const strip = NAR ? 58 : 34, padL = NAR ? 40 : 58, padR = NAR ? 14 : 70;
        const P = { x0: A.x0 + padL, x1: A.x1 - padR, y0: A.y0 + (NAR ? 50 : 58), y1: A.y1 - strip - 30 };
        const px = y => lerp(P.x0, P.x1, y / 10), pyC = c => lerp(P.y1, P.y0, c / 1080), pyV = v => lerp(P.y1, P.y0, v * .92);
        // legenda
        let lx = A.x0 + 2; const ly = A.y0 + 12;
        lx += pill('linfócitos T CD4', lx, ly, CD4C) + 8; pill('carga viral', lx, ly, CVC);
        // eixos
        rr(P.x0, P.y0, P.x1 - P.x0, P.y1 - P.y0, 4, 'rgba(19,26,43,.45)', null);
        line(P.x0, P.y1, P.x1, P.y1, K('line'), 1.5); line(P.x0, P.y0, P.x0, P.y1, CD4C, 1.5); line(P.x1, P.y0, P.x1, P.y1, CVC, 1.5);
        for (let y = 0; y <= 10; y += 2) { line(px(y), P.y1, px(y), P.y1 + 5, K('line'), 1); tx(y === 10 ? '10 anos' : String(y), px(y), P.y1 + 16, { s: 12, c: K('dim'), a: y === 10 ? 'right' : 'center' }); if (y === 10) { /* rótulo alinhado à direita */ } }
        tx('0', P.x0 - 6, P.y1, { s: 12, c: CD4C, a: 'right' }); tx('200', P.x0 - 6, pyC(200), { s: 12, c: CD4C, a: 'right' });
        if (!NAR) { X.save(); X.translate(P.x0 - 40, (P.y0 + pyC(200)) / 2); X.rotate(-PI / 2); tx('CD4 por mm³ de sangue', 0, 0, { s: 12, c: CD4C }); X.restore();
          X.save(); X.translate(P.x1 + 16, (P.y0 + P.y1) / 2); X.rotate(PI / 2); tx('carga viral (sem escala)', 0, 0, { s: 12, c: CVC }); X.restore(); }
        // linha dos 200
        line(P.x0, pyC(200), P.x1, pyC(200), rgba(K('erro'), .8), 1.2, [6, 5]);
        X.save(); X.globalAlpha = .1; rr(P.x0, pyC(200), P.x1 - P.x0, P.y1 - pyC(200), 0, K('erro')); X.restore();
        mtx('abaixo de 200 CD4: aids', px(.8), pyC(200) + 12, { s: 12, w: 600, c: '#F59B98', a: 'left' });
        if (trat) {
          line(px(TT), P.y0, px(TT), P.y1, K('ok'), 1.5, [3, 4]);
          mtx('começa o tratamento', px(TT) + 6, P.y0 - 12, { s: 12, w: 700, c: K('ok'), a: 'left' });
          if (yr > TT + .6) { line(px(TT), pyV(.03), P.x1, pyV(.03), rgba(CVC, .6), 1, [2, 4]); mtx('indetectável', P.x1 - 6, pyV(.03) - 10, { s: 12, w: 600, c: '#F59B98', a: 'right' }); }
        } else {
          // fases
          const fy = P.y0 - 12;
          if (yr > cruza) { X.save(); X.globalAlpha = .08; rr(px(cruza), P.y0, px(10) - px(cruza), P.y1 - P.y0, 0, K('erro')); X.restore(); }
          if (yr > 1.2) mtx('anos sem sintomas', px(3.6), fy, { s: 12, w: 600, c: K('dim') });
          if (!NAR && yr > .1) mtx('infecção', px(.15) + 4, fy, { s: 12, w: 600, c: K('dim'), a: 'left' });
          if (yr > cruza) mtx('aids', px((cruza + 10) / 2), fy, { s: 13, w: 700, c: '#F59B98' });
        }
        // curvas até o ano atual
        const curva = (f, py, c) => { const p = []; for (let y = 0; y <= yr + 1e-6; y += .04) p.push([px(y), py(f(Math.min(y, yr)))]); p.push([px(yr), py(f(yr))]); X.lineCap = 'round'; poly(p, c, 3.2); circ(px(yr), py(f(yr)), 5, c, '#0B0F1C', 2); };
        curva(fV, pyV, CVC); curva(fC, pyC, CD4C);
        // faixa das doenças oportunistas
        const sy = P.y1 + 34;
        const aids = !trat && yr >= cruza;
        if (aids) {
          const k = ss((yr - cruza) / .8); X.save(); X.globalAlpha *= k;
          if (NAR) { const cw = (A.w - 6) / 2; OPO.forEach((s, i) => { const x = A.x0 + (i % 2) * (cw + 6), y = sy + 2 + Math.floor(i / 2) * 26; rr(x, y, cw, 22, 999, rgba(K('erro'), .18), K('erro'), 1); cabe(s, x + cw / 2, y + 11.5, cw - 10, { s: 12, w: 600, c: K('txt'), bg: false }); }); }
          else { let x = P.x0; const lab0 = 'doenças oportunistas:'; mtx(lab0, x, sy + 12, { s: 13, w: 700, c: '#F59B98', a: 'left' }); x += mtw(lab0, 13, 700) + 10;
            OPO.forEach(s => { const w = mtw(s, 12, 600) + 18; if (x + w > A.x1) return; rr(x, sy + 1, w, 22, 999, rgba(K('erro'), .18), K('erro'), 1); mtx(s, x + w / 2, sy + 12.5, { s: 12, w: 600, c: K('txt'), bg: false }); x += w + 8; }); }
          X.restore();
        } else if (trat && yr > TT + 1) {
          mtx('sistema imune se recupera; a pessoa não chega à aids', NAR ? A.cx : P.x0, sy + 12, { s: fs(12, 13), w: 700, c: K('ok'), a: NAR ? 'center' : 'left' });
        }
        // legenda HTML
        const c = Math.round(fC(yr));
        if (trat) cap(yr < TT ? `Ano ${nbr(yr, 1)}: diagnóstico pelo teste. No ano ${TT}, começa o <b>tratamento antirretroviral</b> (gratuito no SUS desde 1996).`
          : yr < TT + 1 ? 'Com o tratamento, a <b>carga viral despenca</b> e os linfócitos CD4 voltam a subir.'
            : 'Carga viral <b>indetectável</b> por pelo menos seis meses: a pessoa <b>não transmite o HIV por via sexual</b> e tem expectativa de vida próxima à de quem não tem o vírus.');
        else cap(yr < .7 ? 'Logo depois da infecção, a carga viral dispara; pode haver febre e mal-estar parecidos com uma gripe.'
          : yr < cruza ? `Ano ${nbr(yr, 1)}: anos sem sintomas, mas o vírus destrói os linfócitos T CD4 aos poucos (cerca de ${nbr(Math.round(c / 10) * 10)} por mm³ neste esquema).`
            : 'Abaixo de <b>200 CD4 por mm³</b>, o corpo perde a defesa e surgem as <b>doenças oportunistas</b>: é a fase de <b>aids</b>.');
      }
    }, tapDe((id, S) => quizTap(S, id, Q))));
  }

  // =================================================================================
  // D3: #doencas/respiratorias
  // =================================================================================
  {
    // média aproximada de colegas infectados por um doente, numa turma sem imunidade (ordem de grandeza)
    const DZ = [
      { n: 'Gripe', b: 2, r: 1.7, txt: 'cerca de 2', vir: 'vírus influenza' },
      { n: 'Covid-19', b: 3, r: 2.3, txt: 'cerca de 3', vir: 'SARS-CoV-2' },
      { n: 'Sarampo', b: 15, r: 9, txt: 'de 12 a 18', vir: 'vírus do sarampo' }
    ];
    const ord = (() => { // colegas em ordem de "chegada da nuvem": distância ao doente com um pouco de acaso
      const R = rng(7), L = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) { if (r === 1 && c === 3) continue; L.push({ r, c, d: Math.hypot(c - 3, (r - 1) * 1.1) + R() * .9 }); }
      return L.sort((a, b) => a.d - b.d);
    })();
    const nInf = S => { const z = DZ[S.dz]; let n = z.b; if (S.jan) n *= .5; if (S.masc) n *= .5; if (S.vac) n *= .1; return Math.min(20, Math.round(n)); };
    const reset = S => { S.c0 = S.ph; };

    // --- modo "Por que vacina todo ano?": deriva (pequenas mutações) e troca de segmentos ---
    const perfil = (u, s) => .5 + .26 * Math.sin(u * 7.5 + s * 2.1) + .2 * Math.sin(u * 13 - s * 1.3);
    const encaixe = S => cl(1 - Math.abs(S.sv - S.sa) / 1.0, 0, 1);
    function espHead(x, y, w, h, s, c, up) { // cabeça da espícula com a borda de cima no perfil s (up = desenha para cima)
      const p = []; for (let i = 0; i <= 16; i++) { const u = i / 16; p.push([x - w / 2 + u * w, y - (up ? 1 : -1) * h * perfil(u, s)]); }
      shape([[x - w / 2, y + (up ? h * .6 : -h * .6)], ...p, [x + w / 2, y + (up ? h * .6 : -h * .6)]], rgba(c, .35), c, 2);
    }

    def('doencas', 'respiratorias', Object.assign({
      t: 'Gripe, covid-19 e sarampo', s: 'vírus que viajam no ar', c: K('resp'), loc: 'Uma sala de aula vista de cima', locNota: 'Esquema; números são média aproximada',
      alt: 'Sala de aula vista de cima, com uma pessoa doente e 20 colegas. Nuvens de aerossol saem da pessoa doente; botões escolhem gripe, covid-19 ou sarampo e ligam janelas abertas, máscaras e turma vacinada, e um placar mostra quantos colegas se infectam em média. No modo "Por que vacina todo ano?", as espículas do vírus da gripe mudam de forma a cada ano e os anticorpos encaixam cada vez pior, até a vacina nova; a troca de segmentos gera um vírus novo, com risco de pandemia.',
      d: `<p>A <b>gripe</b> é causada pelo <b>vírus influenza</b>, um vírus de RNA com envelope e genoma em 8 pedaços. Passa por <b>gotículas</b> e <b>aerossóis</b> expelidos ao tossir, espirrar e falar, e por mãos e objetos contaminados. O vírus muda o tempo todo por <b>pequenas mutações</b> nas proteínas H e N; por isso a vacina é <b>atualizada todo ano</b>, com as cepas que mais circulam, e deve ser tomada <b>todo ano</b>. De vez em quando, dois vírus diferentes (um humano e um de ave ou de porco) infectam a mesma célula e <b>trocam segmentos</b> de RNA, gerando um vírus muito diferente, contra o qual quase ninguém tem defesa: é assim que nascem as <b>pandemias</b> de gripe, como a de 1918 (a "gripe espanhola") e a de 2009 (H1N1). Gripe não é o mesmo que resfriado, que é causado por outros vírus (como os rinovírus) e costuma ser mais leve.</p>
<p>A <b>covid-19</b> é causada pelo <b>SARS-CoV-2</b>, um <b>coronavírus</b> (de RNA, com envelope, cujas espículas lembram uma coroa). A OMS declarou a <b>pandemia</b> em <b>março de 2020</b> e encerrou a emergência internacional em <b>maio de 2023</b>. O vírus usa a proteína <b>S</b> para entrar nas células pela <b>ECA2</b> e passa por gotículas e <b>aerossóis</b>, sobretudo em lugares fechados e pouco ventilados. Por isso funcionaram <b>máscaras</b>, <b>ventilação</b>, distanciamento e <b>vacinas</b>. O vírus acumulou mutações e gerou <b>variantes</b> (como Gama, identificada em Manaus, Delta e Ômicron). As vacinas foram feitas por várias técnicas: <b>vírus inativado</b> (CoronaVac, Butantan), <b>vetor viral</b> (um adenovírus modificado que leva o gene da proteína S; AstraZeneca e Fiocruz) e <b>RNA mensageiro</b> (Pfizer), que ensina as células a produzir a proteína S por pouco tempo e <b>não altera o DNA</b> de quem é vacinado.</p>
<p>O <b>sarampo</b> é uma das doenças <b>mais contagiosas</b> que existem: uma pessoa doente pode infectar de 12 a 18 outras sem imunidade, pelo ar. Causa febre alta, tosse, olhos vermelhos e <b>manchas vermelhas</b> que começam no rosto e descem pelo corpo, e pode levar a pneumonia, encefalite e morte, sobretudo em crianças pequenas e desnutridas. A prevenção é a vacina <b>tríplice viral</b> (sarampo, caxumba e rubéola), em duas doses na infância; idades e doses estão no calendário vigente. O Brasil recebeu o certificado de país livre do sarampo em <b>2016</b>, <b>perdeu</b> em 2019 depois de surtos ligados à queda da vacinação, e <b>voltou a ser certificado</b> em 2024. A doença volta sempre que a cobertura vacinal cai.</p>
<p>Na animação, escolha a doença e ligue <b>janelas abertas</b>, <b>máscaras</b> e <b>turma vacinada</b>. Os números são uma <b>média aproximada</b>, para comparar a ordem de grandeza. Em <b>Por que vacina todo ano?</b>, passe os anos e veja os anticorpos encaixarem cada vez pior.</p>`,
      kv: [['Gripe', 'influenza, RNA em 8 pedaços; vacina anual'], ['Covid-19', 'SARS-CoV-2, coronavírus; proteína S e ECA2'], ['Sarampo', 'altíssima transmissão pelo ar; vacina tríplice viral']],
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
      init(S) { if (S.dz == null) { S.dz = 0; S.jan = S.masc = S.vac = false; S.c0 = 0; S.sv = 0; S.sa = 0; S.ano = 1; S.troca = null; S.novo = false; } },
      draw(t, S) {
        const A = area();
        if (S.drift) return this.deriva(t, S, A);
        const z = DZ[S.dz], n = nInf(S), ct = t - (S.c0 || 0), cyc = ct % 9;
        // disposição: sala à esquerda e placar à direita (no celular, placar embaixo)
        const pw = NAR ? A.w : Math.min(300, A.w * .34), ph = NAR ? 112 : 0;
        const R = NAR ? { x: A.x0, y: A.y0, w: A.w, h: A.h - ph - 10 } : { x: A.x0, y: A.y0, w: A.w - pw - 20, h: A.h };
        const cw = Math.min(R.w / 7.6, (R.h - 30) / 3.9), gw = cw * 7, gh = cw * 3.4;
        const gx = R.x + (R.w - gw) / 2, gy = R.y + 18 + (R.h - 18 - gh) / 2;
        // sala: piso, janelas à esquerda, quadro na frente
        rr(gx - 14, gy - 22, gw + 28, gh + 34, 10, 'rgba(19,26,43,.6)', K('line'), 1.5);
        line(gx + gw * .3, gy - 16, gx + gw * .7, gy - 16, '#7C8AA8', 5);
        mtx('quadro', gx + gw / 2, gy - 4, { s: 12, c: K('dim') });
        for (let i = 0; i < 3; i++) { const wy = gy + gh * (.12 + i * .3); line(gx - 14, wy, gx - 14, wy + gh * .18, S.jan ? '#9BD3FF' : '#5B6C99', S.jan ? 5 : 3); }
        if (!NAR) mtx(S.jan ? 'janelas abertas' : 'janelas fechadas', gx - 22, gy + gh / 2, { s: 12, c: S.jan ? '#9BD3FF' : K('dim'), a: 'right' });
        const pos = (r, c) => [gx + cw * (c + .5), gy + cw * .5 + r * cw * 1.15];
        const [sx, sy] = pos(1, 3);
        // nuvem de aerossol: partículas com idade; janelas puxam para a esquerda e encurtam a vida; máscaras seguram a saída
        const nP = S.masc ? 26 : 70, life = (S.jan ? 2.2 : 3.6) * (S.masc ? .7 : 1), reach = z.r * cw * (S.masc ? .55 : 1) * (S.jan ? .75 : 1);
        const Rg = rng(11 + S.dz);
        for (let i = 0; i < nP; i++) {
          const a0 = Rg() * TAU, sp = .45 + Rg() * .55, off = Rg() * life, age = ((t + off) % life) / life;
          let x = sx + Math.cos(a0) * reach * sp * Math.sqrt(age), y = sy + Math.sin(a0) * reach * sp * Math.sqrt(age) * .8;
          if (S.jan) x -= age * age * cw * 2.2;
          if (x < gx - 12 || x > gx + gw + 12 || y < gy - 18 || y > gy + gh + 10) continue;
          circ(x, y, 2 + age * 4, rgba(K('resp'), .5 * (1 - age)));
        }
        // colegas
        const infK = new Set(); const show = Math.min(n, Math.floor(Math.max(0, cyc - 1.2) / 4.2 * Math.max(n, 1) + (cyc > 1.2 ? 1 : 0)));
        for (let k = 0; k < (S.paused ? n : show); k++) infK.add(ord[k].r * 7 + ord[k].c);
        for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) {
          const [x, y] = pos(r, c), doente = r === 1 && c === 3, inf = infK.has(r * 7 + c), col = doente || inf ? DOENTE : SAUDE, s = cw * .2;
          rr(x - cw * .34, y + s * 1.1, cw * .68, cw * .2, 3, 'rgba(120,135,170,.35)', null);
          ell(x, y + s * .35, s * 1.45, s * .85, 0, rgba(col, .3), col, 1.5);
          circ(x, y - s * .2, s * .78, doente || inf ? rgba(DOENTE, .85) : 'rgba(201,211,240,.4)', col, 1.5);
          if (S.masc) rr(x - s * .55, y - s * .05, s * 1.1, s * .45, 2, '#E8EDF7', null);
          if (S.vac && !doente) circ(x, y - s * .2, s * 1.15, null, K('ok'), 2);
        }
        mtx('doente', sx, sy - cw * .48, { s: 12, w: 700, c: DOENTE });
        // placar
        const bx = NAR ? A.x0 : A.x1 - pw, by = NAR ? A.y1 - ph : A.cy - 120, bw = pw;
        panel(bx, by, bw, NAR ? ph : 240, { r: 12 });
        mtx(z.n, bx + 14, by + 20, { s: fs(15, 17), w: 700, f: FH, c: K('txt'), a: 'left', bg: false });
        cabe(z.vir, bx + bw - 14, by + 20, bw * .45, { s: 12, c: K('dim'), a: 'right', bg: false });
        const lab1 = 'colegas infectados (média aproximada)';
        cabe(lab1, bx + 14, by + 42, bw - 28, { s: 12, c: K('dim'), a: 'left', bg: false });
        // 20 quadradinhos
        const sq = NAR ? Math.min(14, (bw - 28 - 19 * 3) / 20) : Math.min(22, (bw - 28 - 9 * 4) / 10), cols = NAR ? 20 : 10;
        for (let i = 0; i < 20; i++) { const x = bx + 14 + (i % cols) * (sq + (NAR ? 3 : 4)), y = by + 56 + Math.floor(i / cols) * (sq + 4); rr(x, y, sq, sq, 3, i < n ? DOENTE : 'rgba(201,211,240,.18)', i < n ? null : 'rgba(201,211,240,.35)', 1); }
        const ny = by + 56 + (NAR ? sq + 22 : 2 * (sq + 4) + 24);
        mtx(`${n} de 20`, bx + 14, ny, { s: fs(16, 22), w: 700, f: FH, c: DOENTE, a: 'left', bg: false });
        if (!NAR) {
          wrapTx(`Sem medidas e sem imunidade: <b>${z.txt}</b> por doente.`, bx + 14, ny + 30, bw - 28, { s: 13, a: 'left', c: '#D3DAEA' });
          const leg = [[SAUDE, 'colega'], [DOENTE, 'doente ou infectado'], [K('ok'), 'vacinado (anel verde)']];
          let ly = by + 190; for (const [c, s] of leg) { circ(bx + 20, ly, 5, c === K('ok') ? null : c, c === K('ok') ? c : null, 2); mtx(s, bx + 32, ly, { s: 12, c: K('dim'), a: 'left', bg: false }); ly += 16; }
        } else mtx(`sem medidas: ${z.txt}`, bx + bw - 14, ny, { s: 12, c: K('dim'), a: 'right', bg: false });
        const med = [S.jan && 'janelas abertas', S.masc && 'máscaras', S.vac && 'turma vacinada'].filter(Boolean);
        const lista = med.length < 2 ? med.join('') : med.slice(0, -1).join(', ') + ' e ' + med[med.length - 1];
        cap(S.vac ? `Com a <b>turma vacinada</b>, a nuvem continua saindo, mas quase ninguém fica doente.${S.dz === 2 ? ' A vacina contra o sarampo é a <b>tríplice viral</b>.' : ''}`
          : med.length ? `Com ${lista}, menos aerossol chega aos colegas.${S.dz === 1 ? ' Ventilação e máscaras funcionaram contra a covid-19.' : ''}`
            : S.dz === 2 ? 'Sarampo sem vacina: quase a sala inteira adoece. Uma pessoa doente pode infectar <b>de 12 a 18</b> outras sem imunidade.'
              : `${z.n}: o vírus viaja em <b>gotículas e aerossóis</b> expelidos ao tossir, espirrar e falar.`);
      },
      deriva(t, S, A) {
        // demonstração enquanto ninguém mexe: um ano a cada 2,6 s; vacina nova a cada 4 anos
        if (!S.user && !S.paused && !S.troca) { S.dk = (S.dk || 0) + S.dt; if (S.dk > 2.6) { S.dk = 0; if (S.ano % 4 === 0 && !S.vacJa) { S.sa = S.sv; S.vacJa = true; } else { S.ano++; S.sv += .3; S.vacJa = false; } } }
        const f = encaixe(S), nb = Math.round(f * 8);
        // botões no canvas
        const bh = 40, g = 8, rows = NAR ? 2 : 1, by = A.y1 - rows * bh - (rows - 1) * g;
        const labs = [['Passa um ano', 'ano'], ['Vacina nova', 'vac'], ['Troca de segmentos', 'troca']];
        if (NAR) { const w2 = (A.w - g) / 2; botao(A.x0, by, w2, bh, labs[0][0], 'ano'); botao(A.x0 + w2 + g, by, w2, bh, labs[1][0], 'vac'); botao(A.x0, by + bh + g, A.w, bh, labs[2][0], 'troca', { on: !!S.troca }); }
        else { const w3 = Math.min(200, (A.w - 2 * g) / 3), x0 = A.cx - (3 * w3 + 2 * g) / 2; labs.forEach(([s, id], i) => botao(x0 + i * (w3 + g), by, w3, bh, s, id, { on: id === 'troca' && !!S.troca })); }
        const top = A.y0 + 6, bot = by - 12, hh = bot - top;
        if (S.troca) return this.troca(t, S, A, top, bot);
        // vírus à esquerda (no celular, em cima) e o "encaixe" ampliado ao lado
        const vr = Math.min(hh * (NAR ? .2 : .3), A.w * (NAR ? .2 : .14));
        const vx = NAR ? A.cx : A.x0 + A.w * .26, vy = NAR ? top + vr * 1.7 : top + hh / 2;
        // envelope, 8 segmentos de RNA, espículas H e N
        const ne = 14;
        for (let i = 0; i < ne; i++) {
          const a = i / ne * TAU + t * .05, c = Math.cos(a), s = Math.sin(a), x1 = vx + c * vr, y1 = vy + s * vr, x2 = vx + c * vr * 1.35, y2 = vy + s * vr * 1.35;
          line(x1, y1, x2, y2, K('espicula'), 2.5);
          X.save(); X.translate(x2, y2); X.rotate(a + PI / 2);
          if (i % 2) rr(-vr * .09, -vr * .1, vr * .18, vr * .14, 2, rgba(K('espicula'), .5), K('espicula'), 1.5); else espHead(0, 0, vr * .26, vr * .16, S.sv, K('espicula'), true);
          X.restore();
          // anticorpos presos (os que encaixam)
          if (i % 2 === 0 && i / 2 < nb) anticorpo(vx + c * vr * 1.75, vy + s * vr * 1.75, vr * .32, a - PI / 2, ANTI);
        }
        circ(vx, vy, vr, rgba(K('envelope'), .25), K('envelope'), 3);
        for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + .2, rx = vx + Math.cos(a) * vr * .5, ry = vy + Math.sin(a) * vr * .5; X.save(); X.translate(rx, ry); X.rotate(a); rr(-vr * .16, -vr * .04, vr * .32, vr * .08, 3, K('rna'), null); X.restore(); }
        // anticorpos soltos, que não encaixam, rondando
        for (let i = nb; i < 8; i++) { const a = i / 8 * TAU + t * .4, d = vr * (2.2 + .25 * Math.sin(t * 1.3 + i)); const x = vx + Math.cos(a) * d, y = vy + Math.sin(a) * d * (NAR ? .55 : .9); if (y > top && y < bot) anticorpo(x, y, vr * .3, a + PI / 2, ANTI, .55); }
        if (LB) { mtx('espícula H', vx, vy - vr * 2.05, { s: 12, w: 600, c: K('espicula') }); mtx('anticorpo (Y)', vx, vy + vr * 2.05 + (NAR ? -4 : 0), { s: 12, w: 600, c: ANTI }); }
        // encaixe ampliado
        const zw = NAR ? Math.min(A.w * .5, 170) : Math.min(A.w * .3, 230), zh = NAR ? Math.min(hh - vr * 3.6, 150) : Math.min(hh * .62, 230);
        const zx = NAR ? A.x0 : A.x0 + A.w * .52, zy = NAR ? vy + vr * 2.3 + 6 : vy - zh / 2;
        if (zh > 70) {
          panel(zx, zy, zw, zh, { r: 10 });
          mtx('ampliado', zx + 10, zy + 14, { s: 12, c: K('dim'), a: 'left', bg: false });
          const hx2 = zx + zw / 2, hw = zw * .62, eh = zh * .2;
          const yE = zy + zh * .7, gap = (1 - f) * zh * .18;
          // espícula de baixo para cima
          line(hx2, zy + zh - 8, hx2, yE + eh * .5, K('espicula'), 4); espHead(hx2, yE, hw, eh, S.sv, K('espicula'), true);
          // anticorpo: braço com a borda de baixo no perfil da sua "forma"
          const yA = yE - eh * 1.05 - gap, p = [];
          for (let i = 0; i <= 16; i++) { const u = i / 16; p.push([hx2 - hw / 2 + u * hw, yA + eh * (1.05 - perfil(u, S.sa))]); }
          shape([[hx2 - hw / 2, yA - eh * .9], ...p.map(q => [q[0], q[1] - eh * .05]), [hx2 + hw / 2, yA - eh * .9]], rgba(ANTI, .3), ANTI, 2);
          line(hx2, yA - eh * .9, hx2, zy + 26, ANTI, 4);
        }
        // placar
        const tx0 = NAR ? zx + zw + 10 : zx + zw + 18, tw0 = NAR ? A.x1 - tx0 : A.x1 - tx0;
        if (tw0 > 90) {
          const ty = NAR ? zy + 12 : zy + 10;
          mtx(`ano ${S.ano}`, tx0, ty, { s: fs(15, 18), w: 700, f: FH, c: K('txt'), a: 'left' });
          cabe('anticorpos que encaixam', tx0, ty + 24, tw0, { s: 12, c: K('dim'), a: 'left' });
          mtx(`${nb} de 8`, tx0, ty + 46, { s: fs(16, 20), w: 700, f: FH, c: f > .6 ? K('ok') : f > .25 ? K('espicula') : K('erro'), a: 'left' });
          rr(tx0, ty + 62, Math.min(tw0, 140), 8, 4, 'rgba(201,211,240,.18)', null); rr(tx0, ty + 62, Math.min(tw0, 140) * f, 8, 4, f > .6 ? K('ok') : f > .25 ? K('espicula') : K('erro'), null);
          if (S.novo && f < .05) wrapTx('vírus novo: risco de pandemia', tx0, ty + 86, tw0, { s: 12, w: 700, c: K('erro'), a: 'left' });
        }
        cap(S.novo && f < .05 ? 'Depois da <b>troca de segmentos</b>, nenhum anticorpo encaixa: quase ninguém tem defesa. É assim que nascem as <b>pandemias</b> de gripe.'
          : f > .95 ? 'A <b>vacina nova</b>, feita com as cepas que mais circulam, ajusta os anticorpos à forma atual das espículas.'
            : `A cada ano, <b>pequenas mutações</b> mudam um pouco as espículas H e N, e os anticorpos do ano anterior encaixam pior. Por isso a vacina da gripe é <b>anual</b>.`);
      },
      troca(t, S, A, top, bot) {
        const k = (performance.now() - S.troca) / 1000, hh = bot - top, cx = A.cx, cy = top + hh / 2;
        const rx = Math.min(A.w * .46, 300), ry = Math.min(hh * .42, 170);
        ell(cx, cy, rx, ry, 0, 'rgba(240,106,174,.08)', K('envelope'), 2);
        mtx('célula de porco', cx, cy - ry - 2 + 14, { s: 12, w: 600, c: K('envelope') });
        const vr = Math.min(rx, ry) * .2, CA = '#FFC2B5';
        const segs = (x, y, cores) => cores.forEach((c, i) => { const a = i / 8 * TAU + .2; X.save(); X.translate(x + Math.cos(a) * vr * .5, y + Math.sin(a) * vr * .5); X.rotate(a); rr(-vr * .16, -vr * .045, vr * .32, vr * .09, 3, c, null); X.restore(); });
        const vir = (x, y, cores, nm) => { for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; line(x + Math.cos(a) * vr, y + Math.sin(a) * vr, x + Math.cos(a) * vr * 1.3, y + Math.sin(a) * vr * 1.3, K('espicula'), 2); } circ(x, y, vr, rgba(K('envelope'), .25), K('envelope'), 2); segs(x, y, cores); if (nm) mtx(nm, x, y + vr * 1.3 + 12, { s: 12, w: 600, c: K('txt') }); };
        const H8 = Array(8).fill(K('rna')), A8 = Array(8).fill(CA), M8 = [K('rna'), CA, K('rna'), K('rna'), CA, K('rna'), CA, K('rna')];
        const e = ss(k / 1.4);
        if (k < 2.6) { vir(lerp(cx - rx - vr, cx - rx * .45, e), cy, A8, 'vírus de ave'); vir(lerp(cx + rx + vr, cx + rx * .45, e), cy, H8, 'vírus humano'); }
        if (k > 1.6) { const m = ss((k - 1.6) / 1.2), x = cx, y = lerp(cy, cy, m); X.save(); X.globalAlpha *= m; vir(x, y, M8, k > 2.6 ? 'vírus novo' : ''); X.restore(); }
        if (k > 2.6 && k < 4.6) { const m = ss((k - 2.6) / 1.2); mtx('segmentos de RNA misturados', cx, cy + ry - 18, { s: 12, w: 700, c: CA }); void m; }
        cap('Um vírus de ave e um humano infectam a <b>mesma célula</b> (aqui, de porco) e <b>trocam segmentos</b> de RNA: nasce um vírus muito diferente.');
        if (k > 4.8 && !S.paused) { S.troca = null; S.sv += 3; S.ano++; S.novo = true; }
      }
    }, tapDe((id, S) => {
      S.user = true;
      if (id === 'ano') { S.ano++; S.sv += .3; S.novo = false; }
      else if (id === 'vac') { S.sa = S.sv; S.novo = false; }
      else if (id === 'troca' && !S.troca) { S.troca = performance.now(); }
    })));
  }

  // =================================================================================
  // D4: #doencas/hepatites-hpv
  // =================================================================================
  {
    const VIAS = { fecal: () => K('fecal'), sangue: () => K('sangue') };
    const Q = [
      { s: 'Comer salada lavada com água contaminada por fezes', ok: [0], r: 'Hepatite A, via fecal-oral.', e: 'A hepatite A passa por água e alimentos contaminados com fezes. É mais comum onde falta saneamento básico.', via: 'fecal' },
      { s: 'Compartilhar alicate de unha', ok: [1, 2], r: 'Hepatites B e C, pelo sangue.', e: 'Objetos cortantes podem levar sangue de uma pessoa para outra. A hepatite C passa principalmente por sangue; a B também.', via: 'sangue' },
      { s: 'Nascer de mãe com hepatite B', ok: [1], r: 'Hepatite B, da mãe para o bebê.', e: 'Por isso a vacina contra a hepatite B é dada logo ao nascer.', via: 'sangue' },
      { s: 'Relação sexual sem preservativo', ok: [1, 3], r: 'HPV e hepatite B, por via sexual.', e: 'O HPV passa pelo contato de pele e mucosa; a hepatite B, por sangue e relação sexual. O preservativo reduz o risco do HPV, mas não o elimina.', via: 'sangue' },
      { s: 'Transfusão com sangue testado', ok: [4], r: 'Risco muito baixo.', e: 'Antes da testagem do sangue doado, a transfusão transmitia a hepatite C (e a B). Com o sangue testado, essa via ficou muito rara.', via: 'sangue' }
    ];
    const OPS = ['Hepatite A', 'Hepatite B', 'Hepatite C', 'HPV', 'Risco muito baixo'];

    // fígado esquemático em [-1, 1]; k: 0 saudável, 1 aguda (inchado, avermelhado), 2 cirrose (menor, nódulos)
    function figado(x, y, s, k) {
      const inch = k <= 1 ? 1 + .08 * k : 1.08 - .2 * (k - 1), sx = s * inch, sy = s * inch * (k > 1 ? 1 - .06 * (k - 1) : 1);
      const cor = k <= 1 ? mix(FIG, '#E0524A', k) : mix('#E0524A', '#8A6A4A', k - 1);
      const P = q => [x + q[0] * sx, y + q[1] * sy], G = new Path2D();
      const a = P([-1, -.15]); G.moveTo(a[0], a[1]);
      const cb = (c1, c2, e) => { const p1 = P(c1), p2 = P(c2), p3 = P(e); G.bezierCurveTo(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]); };
      cb([-.95, -.7], [-.2, -.7], [.25, -.5]); cb([.55, -.42], [.95, -.45], [1, -.3]); cb([.95, -.1], [.5, .05], [.1, .2]);
      cb([-.2, .45], [-.7, .7], [-.85, .45]); cb([-1.02, .25], [-1.02, .05], [-1, -.15]); G.closePath();
      X.fillStyle = cor; X.fill(G);
      X.save(); X.clip(G);
      const l1 = P([.12, -.55]), l2 = P([.02, .15]); line(l1[0], l1[1], l2[0], l2[1], rgba('#0B0F1C', .35), 2);
      if (k > 1.05) { const R = rng(5), m = cl(k - 1, 0, 1); for (let i = 0; i < 34; i++) { const q = P([-.95 + R() * 1.9, -.6 + R() * 1.1]); circ(q[0], q[1], s * .065 * m, rgba('#E9C9A0', .5), rgba('#3A2A1A', .5), 1); } }
      X.restore();
      X.strokeStyle = light(cor, .3); X.lineWidth = 2; X.stroke(G);
    }
    function hepB(t, S, A) {
      const yr = S.v, vac = !!S.vacB;
      const tl = { x0: A.x0 + (NAR ? 6 : 40), x1: A.x1 - (NAR ? 6 : 40) }, tly = A.y1 - (NAR ? 34 : 30);
      const s = Math.min(A.w * (NAR ? .36 : .22), (tly - A.y0 - 90) * .62);
      const fx = A.cx, fy = A.y0 + 20 + s * .9;
      // estado do fígado ao longo da hepatite B crônica (esquema)
      const k = vac ? 0 : yr < .4 ? ss(yr / .4) : yr < 4 ? lerp(1, .55, ss((yr - .4) / 3.6)) : yr < 18 ? .55 + .45 * (yr - 4) / 14 : 1 + ss((yr - 18) / 8);
      figado(fx, fy, s, k);
      const est = vac ? 'saudável' : yr < .15 ? 'saudável' : yr < 4 ? 'hepatite aguda' : yr < 18 ? 'hepatite crônica' : 'cirrose';
      tok(fx, fy - s * .7 - 4, est, vac || est === 'saudável' ? K('ok') : est === 'cirrose' ? '#C9A06A' : '#F59B98');
      // vírus da hepatite B (DNA, com envelope) chegando; com vacina, anticorpos barram
      const R = rng(3);
      for (let i = 0; i < 5; i++) {
        const ph = fr(t * .25 + i / 5), a0 = -PI * .9 + R() * PI * .5 + (i % 2) * PI * 1.1;
        const d0 = s * 1.9, d1 = vac ? s * 1.25 : s * .5, d = lerp(d0, d1, ss(ph * 1.3));
        const x = fx + Math.cos(a0) * d, y = fy + Math.sin(a0) * d * .6;
        if (!vac && yr < .1 && ph > .75) continue;
        X.save(); X.globalAlpha *= vac && ph > .8 ? (1 - ph) * 5 : 1; virion(x, y, s * .075, { na: K('dna'), n: 8, rot: t * .3 }); X.restore();
        if (vac) anticorpo(fx + Math.cos(a0) * s * 1.12, fy + Math.sin(a0) * s * 1.12 * .6, s * .12, a0 + PI / 2, ANTI);
      }
      if (vac) mtx('vacinada ao nascer: os anticorpos barram o vírus', fx, fy + s * .62 + 18, { s: fs(12, 13), w: 700, c: K('ok') });
      // linha do tempo (décadas)
      const xs = y2 => lerp(tl.x0, tl.x1, cl(y2 / 30, 0, 1));
      const fases = vac ? [[0, 30, K('ok'), 'protegida a vida toda']] : [[0, 4, '#F59B98', 'aguda'], [4, 18, '#E0524A', 'crônica, muitas vezes sem sintomas'], [18, 30, '#C9A06A', 'cirrose e risco de câncer']];
      for (const [a, b, c, l] of fases) { rr(xs(a) + 1, tly - 7, xs(b) - xs(a) - 2, 14, 4, rgba(c, xs(yr) >= xs(a) ? .7 : .2), null); }
      for (const [a, b, c, l] of fases) { const w = xs(b) - xs(a), sz = 12; if (mtw(l, sz, 600) < w - 6) mtx(l, (xs(a) + xs(b)) / 2, tly - 18, { s: sz, w: 600, c }); else if (mtw(l.split(' ')[0], sz, 600) < w + 20) mtx(l.split(',')[0].split(' e ')[0], (xs(a) + xs(b)) / 2, tly - 18, { s: sz, w: 600, c }); }
      for (const y2 of [0, 10, 20, 30]) tx(y2 ? `${y2} anos` : '0', xs(y2), tly + 18, { s: 12, c: K('dim'), a: y2 === 30 ? 'right' : y2 ? 'center' : 'left' });
      circ(xs(yr), tly, 7, '#E8EDF7', '#0B0F1C', 2);
      cap(vac ? 'A <b>vacina contra a hepatite B</b> é dada <b>logo ao nascer</b> e faz parte do calendário em várias doses: a infecção crônica não acontece.'
        : yr < 4 ? 'A <b>hepatite B</b> (vírus de DNA, com envelope) passa por sangue, relação sexual e da mãe para o bebê. O fígado inflama.'
          : yr < 18 ? 'A hepatite B pode virar uma infecção <b>crônica</b>. Muitas pessoas <b>não têm sintomas</b> por anos; por isso a testagem é importante.'
            : 'Depois de anos, a hepatite B crônica pode causar <b>cirrose</b> (fígado endurecido, com nódulos) e <b>câncer de fígado</b>.');
    }
    function hpv(t, S, A) {
      const yr = S.v, vac = !!S.vacH, exam = !!S.exam;
      // estágio (0 normal, 1 infecção persistente, 2 lesão, 3 lesão avançada, 4 câncer) ao longo de 10 a 20 anos (esquema)
      let g = vac ? 0 : yr < .5 ? 0 : yr < 3 ? 1 : yr < 8 ? 1 + (yr - 3) / 5 : yr < 14 ? 2 + (yr - 8) / 6 : yr < 18 ? 3 + (yr - 14) / 4 : 4;
      let achou = false;
      if (exam && !vac && yr >= 5) { achou = true; g = yr < 6 ? lerp(1.4, 0, ss(yr - 5)) : 0; }
      const tl = { x0: A.x0 + (NAR ? 6 : 40), x1: A.x1 - (NAR ? 6 : 40) }, tly = A.y1 - (NAR ? 34 : 30);
      const sx0 = A.x0 + (NAR ? 0 : A.w * .08), sw = NAR ? A.w : A.w * .84, sy0 = A.y0 + 44, sh = tly - 40 - sy0;
      const eh = sh * .5, bm = sy0 + eh; // epitélio em cima, membrana basal, tecido de baixo
      rr(sx0, sy0, sw, sh, 10, 'rgba(19,26,43,.5)', K('line'), 1);
      rr(sx0, bm, sw, sh - eh, 0, 'rgba(240,106,174,.08)', null);
      // vaso no tecido de baixo
      X.beginPath(); X.moveTo(sx0 + 8, bm + (sh - eh) * .65); X.bezierCurveTo(sx0 + sw * .3, bm + (sh - eh) * .4, sx0 + sw * .6, bm + (sh - eh) * .9, sx0 + sw - 8, bm + (sh - eh) * .6); X.strokeStyle = rgba('#F0605D', .5); X.lineWidth = 6; X.stroke();
      // células em fileiras
      const rows = 5, cols = Math.max(8, Math.round(sw / (NAR ? 30 : 38))), cwid = sw / cols, rh = eh / rows;
      const R = rng(9);
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const fromBase = (rows - 1 - r) / (rows - 1); // 0 na base
        const ab = g < 1 ? 0 : g < 2 ? (fromBase < .34 ? (g - 1) : 0) : g < 3 ? (fromBase < .34 + .66 * (g - 2) ? 1 : 0) : 1;
        const flat = 1 - fromBase * .55 * (1 - ab);
        const x = sx0 + (c + .5) * cwid + (r % 2) * cwid * .25, y = sy0 + (r + .5) * rh;
        if (x > sx0 + sw - 4) continue;
        const cc = mix('#C9D3F0', '#F0605D', ab * .8);
        ell(x, y, cwid * .44, rh * .44 * flat + rh * .02, 0, rgba(cc, .22), rgba(cc, .7), 1);
        circ(x, y, Math.min(cwid, rh) * (.12 + ab * .14 * (.7 + R() * .6)), rgba(ab > .3 ? '#9A6BFF' : '#7C8AA8', .85));
      }
      // câncer: células atravessam a membrana basal
      if (g > 3) { const m = cl(g - 3, 0, 1), R2 = rng(4); for (let i = 0; i < 14 * m; i++) { const x = sx0 + sw * (.3 + R2() * .4), y = bm + 6 + R2() * (sh - eh) * .55 * m; circ(x, y, rh * .3, rgba('#F0605D', .3), '#F0605D', 1); circ(x, y, rh * .13, '#9A6BFF'); } }
      line(sx0, bm, sx0 + sw, bm, g > 3 ? rgba(K('espicula'), .5) : K('espicula'), 2, g > 3 ? [5, 4] : null);
      if (LB) { mtx('membrana basal', sx0 + sw - 8, bm + 12, { s: 12, w: 600, c: K('espicula'), a: 'right' }); mtx('epitélio do colo do útero', sx0 + 8, sy0 - 10, { s: 12, w: 600, c: K('dim'), a: 'left' }); }
      // HPV (DNA, sem envelope) chegando à superfície; com vacina, anticorpos barram
      for (let i = 0; i < 4; i++) {
        const ph = fr(t * .2 + i / 4), x = sx0 + sw * (.18 + i * .2), y0 = sy0 - 6, d = vac ? ss(ph * 1.4) * 0 : 0;
        if (!vac && g > .6) continue;
        X.save(); X.globalAlpha *= vac ? 1 - ph : ph < .8 ? 1 : (1 - ph) * 5;
        virion(x + Math.sin(ph * 6 + i) * 4, y0 + (vac ? -ph * 10 : ph * rh * 1.2) + d, Math.max(6, rh * .28), { env: false, na: K('dna') }); X.restore();
        if (vac) anticorpo(x + 12, sy0 - 14, Math.max(10, rh * .45), PI, ANTI);
      }
      const nomes = ['células normais', 'infecção persistente', 'lesão', 'lesão avançada', 'câncer'];
      const est = achou && yr >= 5.5 ? 'lesão tratada' : nomes[Math.min(4, Math.floor(g + .001))];
      tok(sx0 + sw / 2, sy0 + 14, est, vac || est === 'células normais' || est === 'lesão tratada' ? K('ok') : g >= 4 ? '#F0605D' : '#F59B98');
      if (achou) { const lx = sx0 + sw * .7, ly = sy0 + eh * .6; circ(lx, ly, Math.min(28, rh * 1.4), rgba('#E8EDF7', .06), K('ok'), 3); line(lx + 18, ly + 18, lx + 34, ly + 34, K('ok'), 4); }
      // linha do tempo 0 a 30 anos, com as duas barreiras
      const xs = y2 => lerp(tl.x0, tl.x1, cl(y2 / 30, 0, 1));
      rr(tl.x0, tly - 5, tl.x1 - tl.x0, 10, 4, 'rgba(201,211,240,.15)', null);
      rr(tl.x0, tly - 5, xs(yr) - tl.x0, 10, 4, vac ? rgba(K('ok'), .6) : achou && yr >= 5 ? rgba(K('ok'), .6) : rgba('#F59B98', .55), null);
      for (const y2 of [0, 10, 20, 30]) tx(y2 ? `${y2} anos` : '0', xs(y2), tly + 18, { s: 12, c: K('dim'), a: y2 === 30 ? 'right' : y2 ? 'center' : 'left' });
      if (vac) mtx('vacina: barreira antes da infecção', tl.x0, tly - 18, { s: 12, w: 700, c: K('ok'), a: 'left' });
      if (exam && !vac) { line(xs(5), tly - 12, xs(5), tly + 8, K('ok'), 2.5); mtx('exame preventivo', xs(5) + (NAR ? -4 : 6), tly - 18, { s: 12, w: 700, c: K('ok'), a: NAR ? 'left' : 'left' }); }
      circ(xs(yr), tly, 7, '#E8EDF7', '#0B0F1C', 2);
      cap(vac ? 'A <b>vacina contra o HPV</b>, gratuita no SUS para meninas e meninos antes do início da vida sexual, impede a infecção pelos tipos que causam câncer.'
        : achou && yr >= 5 ? 'O <b>exame preventivo</b> (Papanicolau e teste de DNA do HPV) encontra a lesão no começo, e ela é tratada antes de virar câncer.'
          : g < 1 ? 'O <b>HPV</b> (vírus de DNA, sem envelope) chega pela relação sexual. A maioria das infecções <b>some sozinha</b>.'
            : g < 4 ? 'Quando a infecção por tipos como o <b>16</b> e o <b>18</b> persiste, as células mudam aos poucos, ao longo de 10 a 20 anos.'
              : 'Depois de anos de infecção persistente, as células atravessam a membrana basal: <b>câncer do colo do útero</b>.');
    }

    def('doencas', 'hepatites-hpv', Object.assign({
      t: 'Hepatites virais e HPV', s: 'fígado, câncer e as vacinas que os previnem', c: K('fecal'), loc: 'Fígado e colo do útero em esquema', locNota: 'Linha do tempo esquemática',
      alt: 'Três modos. Hepatite B: um fígado esquemático passa de saudável a inflamado, à hepatite crônica e à cirrose com nódulos ao longo de décadas; com a vacina ao nascer, anticorpos barram o vírus e o fígado continua saudável. HPV: corte do colo do útero em que as células mudam aos poucos, de lesão a câncer, ao longo de 10 a 20 anos, com as barreiras da vacina e do exame preventivo. Qual via?: cartões de situações para associar a hepatite A, B, C ou HPV.',
      d: `<p><b>Hepatite</b> é inflamação do <b>fígado</b>, e vários vírus diferentes podem causá-la. A <b>hepatite A</b> (vírus de RNA, <b>sem envelope</b>) passa pela via <b>fecal-oral</b>: água e alimentos contaminados com fezes. É mais comum onde falta <b>saneamento básico</b>, costuma ser aguda e curar sozinha, e tem vacina no calendário infantil. A <b>hepatite B</b> (vírus de <b>DNA</b>, com envelope) passa por <b>sangue</b>, <b>relação sexual</b> e <b>da mãe para o bebê</b>. Pode virar uma infecção <b>crônica</b> e, depois de anos, causar <b>cirrose</b> e <b>câncer de fígado</b>. A <b>vacina</b> contra a hepatite B é dada <b>logo ao nascer</b> e faz parte do calendário em várias doses. A <b>hepatite C</b> (vírus de RNA) passa principalmente por <b>sangue</b> (seringas compartilhadas, objetos cortantes, procedimentos sem material esterilizado; antes da testagem do sangue doado, também por transfusão). Não tem vacina, mas hoje tem <b>cura</b> com remédios antivirais em mais de 95% dos casos. Muitas pessoas com hepatite B ou C <b>não têm sintomas</b> por anos; por isso a testagem é importante. (Existem também as hepatites D, que só ocorre em quem tem a B, e E, fecal-oral.)</p>
<p>O <b>HPV</b> (papilomavírus humano) é um vírus de <b>DNA</b>, <b>sem envelope</b>, com mais de 200 tipos. É a <b>infecção sexualmente transmissível mais comum</b>: passa pelo contato de pele e mucosa nas relações sexuais, e o preservativo <b>reduz, mas não elimina</b> o risco, porque o vírus pode estar em regiões que ele não cobre. A maioria das infecções some sozinha. Alguns tipos (como o <b>6</b> e o <b>11</b>) causam <b>verrugas genitais</b>; outros (sobretudo o <b>16</b> e o <b>18</b>) podem, depois de anos de infecção persistente, causar <b>câncer do colo do útero</b>, além de câncer de ânus, pênis e garganta. A <b>vacina</b> contra o HPV, gratuita no SUS para <b>meninas e meninos</b> numa faixa de idade antes do início da vida sexual, protege contra esses tipos. É uma <b>vacina contra o câncer</b>. O exame <b>preventivo</b> (citopatológico, o "Papanicolau", e o teste de DNA do HPV) encontra lesões antes que virem câncer. Idades e doses das vacinas estão no calendário vigente do Ministério da Saúde.</p>
<table><thead><tr><th>Vírus</th><th>Material genético</th><th>Transmissão</th><th>Prevenção principal</th></tr></thead><tbody>
<tr><td>Hepatite A</td><td>RNA, sem envelope</td><td>fecal-oral (água e alimentos)</td><td>saneamento, higiene, vacina</td></tr>
<tr><td>Hepatite B</td><td>DNA, com envelope</td><td>sangue, sexual, mãe para filho</td><td>vacina (ao nascer), preservativo</td></tr>
<tr><td>Hepatite C</td><td>RNA, com envelope</td><td>sangue</td><td>não compartilhar seringas e objetos cortantes; testagem e tratamento (tem cura)</td></tr>
<tr><td>HPV</td><td>DNA, sem envelope</td><td>sexual (pele e mucosa)</td><td>vacina, preservativo, exame preventivo</td></tr>
</tbody></table>
<p>Fonte do quadro: Ministério da Saúde. Na animação, arraste a faixa <b>Tempo</b> e ligue as barreiras; em <b>Qual via?</b>, associe cada situação ao vírus.</p>`,
      enem: 'As hepatites se separam pela <b>via de transmissão</b>: a <b>A</b> é <b>fecal-oral</b> e está ligada a <b>saneamento</b>; a <b>B</b> e a <b>C</b> passam por <b>sangue</b> (a B também por via sexual e da mãe para o filho). A <b>B</b> tem vacina, a <b>C</b> tem cura. O <b>HPV</b> aparece ligado ao <b>câncer do colo do útero</b> e à vacinação de meninas <b>e meninos</b>. Pegadinha: vacinar meninos não é "à toa": eles transmitem o vírus e também podem ter câncer pelo HPV.',
      links: [CAL, ['Cada via, sua prevenção', '#prevencao/transmissao'], ['Vacina, soro e antivirais', '#prevencao/vacinas']],
      ctl: { l: 'Tempo', min: 0, max: 30, step: .5, v: 0, f: v => `${nbr(v, v % 1 ? 1 : 0)} ${v === 1 ? 'ano' : 'anos'}`, rate: () => 1 },
      auto: S => S.modo === 2 ? 0 : 3.2, stillV: 30, still: 2.5,
      extra: [
        { t: 'Hepatite B', pressed: S => S.modo === 0, on(S) { S.modo = 0; faixa(true); } },
        { t: 'Vacinada ao nascer', pressed: S => !!S.vacB, on(S) { S.vacB = !S.vacB; S.modo = 0; faixa(true); } },
        { t: 'HPV', pressed: S => S.modo === 1, on(S) { S.modo = 1; faixa(true); } },
        { t: 'Vacina contra o HPV', pressed: S => !!S.vacH, on(S) { S.vacH = !S.vacH; S.modo = 1; faixa(true); } },
        { t: 'Exame preventivo', pressed: S => !!S.exam, on(S) { S.exam = !S.exam; S.modo = 1; faixa(true); } },
        { t: 'Qual via?', pressed: S => S.modo === 2, on(S) { S.modo = 2; faixa(false); } }
      ],
      init(S) { if (S.modo == null) { S.modo = 0; S.vacB = S.vacH = S.exam = false; } faixa(S.modo !== 2); },
      draw(t, S) {
        const A = area();
        if (S.modo === 0) return hepB(t, S, A);
        if (S.modo === 1) return hpv(t, S, A);
        const q = quiz(S, A, Q, OPS, 'QUAL VIA?');
        const it = Q[q.i % Q.length];
        if (q.ans != null) { const c = VIAS[it.via](); cap(`Via: <b style="color:${c}">${it.via === 'fecal' ? 'fecal-oral' : 'sangue e sexual'}</b>. Acertos: <b>${q.ac} de ${q.n}</b>.`); }
        else cap('Toque no vírus que essa situação pode transmitir. Marrom: via <b>fecal-oral</b>. Vermelho: <b>sangue e sexual</b>.');
      }
    }, tapDe((id, S) => quizTap(S, id, Q))));
  }
}
