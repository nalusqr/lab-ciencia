/* LAB, módulo Embriologia. Cenas: Gametas (resumo) e Ovos (tipos, vitelo e modo de vida).
   Código da equipe (Aurelius). Textos: roteiro B do Sapien (gametas) e roteiro do Taxon (ovos). */
'use strict';
{
  const EMB = '#E8A9A3';            // tecido do embrião (rosado neutro, fora das cores dos folhetos e dos anexos)
  const PIG = '#4A4E5A';            // polo animal pigmentado do ovo de anfíbio
  const PINTO = '#F4D77E', SAPO = '#7FA66A', NUTRI = '#FFE1A6';

  // espermatozoide: cabeça oval com núcleo e cauda ondulada
  function sperm(x, y, r, ang, t = 0) {
    X.save(); X.translate(x, y); X.rotate(ang);
    X.beginPath(); for (let i = 0; i <= 14; i++) { const d = r + i / 14 * r * 3.4, w = Math.sin(i * .9 - t * 8) * r * .35 * (i / 14); i ? X.lineTo(d, w) : X.moveTo(d, w); }
    X.strokeStyle = rgba(C.esperma, .9); X.lineWidth = 1.6; X.stroke();
    ell(0, 0, r, r * .68, 0, C.esperma, 'rgba(11,15,28,.6)', 1); ell(-r * .15, 0, r * .55, r * .4, 0, rgba(C.nucleo, .85));
    X.restore();
  }
  function link(x1, y1, x2, y2) { line(x1, y1, x2, y2, 'rgba(232,237,247,.4)', 1.5); }

  // =====================================================================================
  // GAMETAS
  // =====================================================================================
  def('gametas', 'resumo', {
    t: 'De onde vêm os gametas', s: 'espermatogênese e ovogênese em uma tabela', c: C.esperma, ctl: false, still: 0,
    loc: 'Testículos e ovários',
    alt: 'Duas árvores lado a lado: na espermatogênese, um espermatócito primário forma 4 espermatozoides; na ovogênese, um ovócito primário forma 1 ovócito grande e corpúsculos polares pequenos, e a meiose II só termina quando um espermatozoide entra e sai o segundo corpúsculo polar',
    d: `<p>Todo embrião começa com dois <b>gametas</b>: o <b>espermatozoide</b> e o <b>ovócito</b>. Eles são haploides (<b>n = 23</b> na espécie humana) e se formam por <b>meiose</b>, num processo chamado <b>gametogênese</b>: <b>espermatogênese</b> no homem e <b>ovogênese</b> (ou ovulogênese) na mulher. Nos dois sexos as etapas são as mesmas: <b>multiplicação</b> por mitoses, <b>crescimento</b> e <b>maturação</b> pela meiose. A diferença está no resultado. No testículo, cada espermatócito primário forma <b>4 espermatozoides</b> pequenos e móveis, de forma contínua a partir da puberdade. No ovário, cada ovócito primário forma <b>1 só gameta</b> grande, rico em citoplasma, e dois ou três <b>corpúsculos polares</b> que degeneram; a menina já nasce com todos os ovócitos que terá.</p>
<p>Atenção: a célula liberada na ovulação é o <b>ovócito secundário</b>, parado na metáfase II. A meiose só termina se um espermatozoide entrar nele, e é por isso que este módulo começa a história do embrião na fecundação (ver <a href="#humano/fecundacao">Fecundação</a>).</p>
<div class="tab"><table>
<thead><tr><th></th><th>Espermatogênese</th><th>Ovogênese</th></tr></thead>
<tbody>
<tr><th>Onde</th><td>túbulos seminíferos (testículos)</td><td>ovários</td></tr>
<tr><th>Começa</th><td>na puberdade</td><td>na vida fetal</td></tr>
<tr><th>Gametas por célula que entra em meiose</th><td>4</td><td>1 (+ corpúsculos polares)</td></tr>
<tr><th>Divisão do citoplasma</th><td>igual</td><td>desigual</td></tr>
<tr><th>Pausas</th><td>nenhuma</td><td>prófase I (até a puberdade) e metáfase II (até a fecundação)</td></tr>
<tr><th>Duração</th><td>cerca de 70 dias (Moore cita cerca de 2 meses)</td><td>de 12 a cerca de 50 anos, contando a pausa na prófase I</td></tr>
</tbody></table></div>`,
    enem: 'A comparação cai muito: <b>4 espermatozoides contra 1 óvulo</b> por célula, divisão <b>igual</b> contra <b>desigual</b>, produção <b>contínua</b> contra um estoque formado <b>antes do nascimento</b>. E a pegadinha: o que sai do ovário na ovulação é o <b>ovócito secundário</b>, não o óvulo pronto.',
    links: [LK.esperm, LK.ovog, ['Fecundação', '#humano/fecundacao']],
    draw(t) {
      const A = area(), gap = NAR ? 10 : 48, pw = (A.w - gap) / 2, lx = A.x0 + pw / 2, rx = A.x1 - pw / 2;
      const u = Math.min(pw * 1.1, A.h / 2.2), yH = A.y0 + 10, top = A.y0 + (NAR ? 40 : 46), rowH = (A.y1 - top) / 3;
      const ys = [0, 1, 2].map(i => top + rowH * (i + .36)), ls = NAR ? 12 : 13, lw = pw - 8;
      head('Espermatogênese', lx, yH, C.esperma); head('Ovogênese', rx, yH, C.ovo);
      tx(NAR ? 'testículo' : 'no testículo', lx, yH + (NAR ? 18 : 20), { s: 12, c: C.dim, bg: false });
      tx(NAR ? 'ovário' : 'no ovário', rx, yH + (NAR ? 18 : 20), { s: 12, c: C.dim, bg: false });
      if (!NAR) {
        line(A.cx, top, A.cx, A.y1, 'rgba(91,108,153,.35)', 1, [4, 6]);
        tx('meiose I', A.cx, (ys[0] + ys[1]) / 2, { s: 12, w: 600, c: C.dim }); tx('meiose II', A.cx, (ys[1] + ys[2]) / 2 - 8, { s: 12, w: 600, c: C.dim }); tx('(no ovócito, só se', A.cx, (ys[1] + ys[2]) / 2 + 9, { s: 12, c: C.dim }); tx('houver fecundação)', A.cx, (ys[1] + ys[2]) / 2 + 25, { s: 12, c: C.dim });
      }
      const sub = (s, x, y) => wrapTx(s, x, y, lw, { s: ls, c: C.txt, w: 600, lh: ls + 3 });
      // espermatogênese: 1 → 2 → 4, divisões iguais (rótulos primeiro: as linhas saem de baixo deles)
      const r0 = u * .1, r1 = u * .08, r2 = u * .045, sp1 = Math.min(pw * .28, u * .3), sp2 = Math.min(pw * .22, u * .2);
      const x1 = [lx - sp1, lx + sp1], x2 = [-1.5, -.5, .5, 1.5].map(k => lx + k * sp2);
      const b0 = ys[0] + r0 + 8 + sub('espermatócito primário (2n)', lx, ys[0] + r0 + 14);
      const b1 = ys[1] + r1 + 8 + sub('2 espermatócitos secundários (n)', lx, ys[1] + r1 + 14);
      sub('4 espermatozoides (n)', lx, ys[2] + r2 * 4.4 + 8);
      x1.forEach(x => link(lx, b0, x, ys[1] - r1)); x2.forEach((x, i) => link(x1[i < 2 ? 0 : 1], b1, x, ys[2] - r2 * 1.2));
      cell(lx, ys[0], r0, C.esperma, { n: .42 }); x1.forEach(x => cell(x, ys[1], r1, C.esperma, { n: .4 }));
      x2.forEach((x, i) => sperm(x - r2 * .6, ys[2], r2, PI / 2 + .25, t + i * .7));
      // ovogênese: 1 → 1 grande + 1 corpúsculo polar → 1 grande + corpúsculos polares (citoplasma desigual)
      const R = u * .17, rp = Math.max(5, u * .04), dx = R + rp + (NAR ? 8 : 14);
      const ox = rx - (NAR ? rp * 1.4 : 0);
      const c0 = ys[0] + R + 8 + sub('ovócito primário (2n)', rx, ys[0] + R + 14);
      const c1 = ys[1] + R + 8 + sub('ovócito secundário (n), parado na metáfase II, + 1º corpúsculo polar', rx, ys[1] + R + 14);
      sub(NAR ? 'só com fecundação: termina a meiose II e sai o 2º corpúsculo polar' : 'com a fecundação, o ovócito termina a meiose II e solta o 2º corpúsculo polar', rx, ys[2] + R + 14);
      link(ox, c0, ox, ys[1] - R); link(ox + dx, c0, ox + dx, ys[1] - rp);
      link(ox, c1, ox, ys[2] - R); link(ox + dx, c1, ox + dx, ys[2] - R * .55 - rp);
      cell(ox, ys[0], R, C.ovo, { n: .3 });
      cell(ox, ys[1], R, C.ovo, { n: .26 }); cell(ox + dx, ys[1], rp, C.polar);
      cell(ox, ys[2], R, C.ovo, { n: .26 });
      // espermatozoide entrando: só ele dispara o fim da meiose II
      sperm(ox - R * .74, ys[2] - R * .74, Math.max(5, u * .045), -PI * .75, t);
      // 1º corpúsculo polar (pode se dividir; contorno tracejado) e 2º corpúsculo polar, que sai do ovócito agora
      cell(ox + dx, ys[2] - R * .55, rp * .9, C.polar); X.setLineDash([3, 3]); circ(ox + dx + rp * 1.9, ys[2] - R * .55, rp * .8, null, rgba(C.polar, .9), 1.2); X.setLineDash([]);
      cell(ox + R * .78, ys[2] + R * .78, rp * .9, C.polar, { s: '#fff', lw: 1.5 });
      if (!NAR) {
        lab(ox + R * .7, ys[1] - R * .7, ox + R + 70, ys[1] - R - 10, 'liberado na ovulação');
        lab(ox - R * .9, ys[2] - R * .9, ox - R - 70, ys[2] - R * .2, 'espermatozoide');
        lab(ox + dx + rp, ys[2] - R * .55, ox + dx + 60, ys[2] - R * .55 - 8, '1º corpúsculo polar');
        lab(ox + R * .78 + rp, ys[2] + R * .78, ox + dx + 60, ys[2] + 14, '2º corpúsculo polar');
      }
      cap('Mesma meiose, resultado diferente: <b>4 espermatozoides</b> contra <b>1 gameta</b> e corpúsculos polares. A meiose II do ovócito só termina na <b>fecundação</b>');
    }
  });

  // =====================================================================================
  // OVOS: TIPOS
  // =====================================================================================
  const TIPOS = {
    oligo: { n: 'Oligolécito (isolécito)', v: 'pouco vitelo, espalhado por igual', ex: 'ouriço-do-mar, anfioxo, mamíferos placentários', sg: 'holoblástica igual', cur: 'ouriço-do-mar' },
    hetero: { n: 'Heterolécito', v: 'vitelo médio, no polo vegetativo', ex: 'anfíbios (sapo, rã)', sg: 'holoblástica desigual', cur: 'rã' },
    telo: { n: 'Telolécito', v: 'muito vitelo; citoplasma só na cicatrícula', ex: 'aves, répteis, maioria dos peixes, cefalópodes, monotremados', sg: 'meroblástica discoidal', cur: 'galinha' },
    centro: { n: 'Centrolécito', v: 'vitelo no centro, citoplasma em volta', ex: 'insetos e outros artrópodes', sg: 'meroblástica superficial', cur: 'inseto' }
  };
  const tipoDe = (v, cen) => cen ? 'centro' : v < 25 ? 'oligo' : v < 70 ? 'hetero' : 'telo';
  // ovo em corte; v = 0..100 de vitelo. Devolve pontos para rótulos
  function ovo(x, y, R, v, cen) {
    const out = {};
    if (cen) {
      const rx = R * 1.3, ry = R * .72, m = Math.max(5, R * .1);
      ell(x, y, rx, ry, 0, rgba(C.ovo, .5), C.ovo, 2);
      ell(x, y, rx - m, ry - m, 0, C.vitelo);
      X.save(); X.beginPath(); X.ellipse(x, y, rx - m, ry - m, 0, 0, TAU); X.clip(); grains(x - rx, y - ry, rx * 2, ry * 2, dark(C.vitelo, .3), .9, 11); X.restore();
      circ(x, y, R * .2, rgba(C.ovo, .85)); circ(x, y, R * .1, C.nucleo, 'rgba(11,15,28,.5)', 1);
      out.nuc = [x, y]; out.vit = [x + rx * .55, y + ry * .3]; out.cit = [x - rx * .5, y - Math.sqrt(1 - .25) * ry + m * .5]; return out;
    }
    const f = v < 25 ? 0 : lerp(.22, .9, ss((v - 25) / 75)), lvl = y + R - 2 * R * f;   // altura ocupada pelo vitelo, de baixo para cima
    circ(x, y, R, rgba(C.ovo, .5));
    X.save(); X.beginPath(); X.arc(x, y, R - 1, 0, TAU); X.clip();
    // pouco vitelo, espalhado (some quando o vitelo passa a se concentrar)
    const uni = v < 25 ? .25 + v / 25 * .6 : Math.max(0, 1 - (v - 25) / 15);
    if (uni > 0) { X.globalAlpha = uni; const Rg = rng(5); for (let i = 0; i < 70; i++) { const a = Rg() * TAU, d = Math.sqrt(Rg()) * R * .92; circ(x + Math.cos(a) * d, y + Math.sin(a) * d, Math.max(.6, R * (.012 + Rg() * .012)), C.vitelo); } X.globalAlpha = 1; }
    if (f > 0) {
      X.beginPath(); X.moveTo(x - R, lvl);
      for (let i = 0; i <= 20; i++) { const xx = x - R + i / 20 * 2 * R; X.lineTo(xx, lvl + Math.sin(i * 1.3) * 1.5); }
      X.lineTo(x + R, y + R); X.lineTo(x - R, y + R); X.closePath(); X.fillStyle = C.vitelo; X.fill();
      grains(x - R, lvl, 2 * R, y + R - lvl, dark(C.vitelo, .3), .9, 3);
    }
    X.restore();
    circ(x, y, R, null, C.ovo, 2);
    // núcleo no citoplasma livre, entre o topo do ovo e o vitelo
    const ny = f > 0 ? (y - R + lvl) / 2 : y, nr = R * lerp(.16, .06, ss((v - 25) / 75));
    circ(x, ny, nr, C.nucleo, 'rgba(11,15,28,.5)', 1);
    out.nuc = [x, ny]; out.vit = [x + R * .35, f > 0 ? (lvl + y + R) / 2 : y + R * .5]; out.lvl = lvl; out.f = f; return out;
  }

  def('ovos', 'tipos', {
    t: 'Tipos de ovo', s: 'quanto vitelo e onde ele fica', c: C.vitelo, loc: 'Célula-ovo em corte',
    alt: 'Ovo em corte com vitelo em âmbar e núcleo em violeta; a faixa aumenta o vitelo e o ovo passa de oligolécito a heterolécito e telolécito; um botão mostra o centrolécito',
    ctl: { l: 'Quantidade de vitelo', min: 0, max: 100, step: 1, v: 0, f: v => Math.round(v) + ' de 100', rate: () => 1 },
    auto: S => S.cen ? 0 : 9, stillV: 50, still: 0,
    extra: [{ t: 'Centrolécito (insetos)', on: S => { S.cen = !S.cen; S.vSeen = S.v; }, pressed: S => !!S.cen }],
    d: `<p>O <b>vitelo</b> é a reserva de nutrientes (proteínas e lipídios) que alimenta o embrião até ele conseguir se nutrir de outro jeito. A quantidade e a posição do vitelo dividem os ovos em quatro tipos. O <b>oligolécito</b>, ou <b>isolécito</b>, tem pouco vitelo, espalhado por igual: ouriço-do-mar, anfioxo e mamíferos placentários (o embrião logo passa a ser nutrido pela mãe). O <b>heterolécito</b> tem vitelo em quantidade média, concentrado num dos polos, o <b>polo vegetativo</b>; no outro, o <b>polo animal</b>, ficam o núcleo e a maior parte do citoplasma. É o ovo dos anfíbios. O <b>telolécito</b> tem tanto vitelo que o citoplasma e o núcleo ficam num pequeno disco no polo animal, a <b>cicatrícula</b> (disco germinativo): aves, répteis, a maioria dos peixes e os moluscos cefalópodes (polvo, lula). O <b>centrolécito</b> tem o vitelo no centro e o citoplasma em volta: é o ovo dos insetos e de outros artrópodes.</p>
<p>Na galinha, a "gema" é a célula-ovo, com cerca de 3 cm; a clara e a casca são camadas acrescentadas no caminho pelo oviduto (o que acontece com a gema durante o desenvolvimento está em <a href="#anexos/funcoes">Os quatro anexos</a>, vesícula vitelínica). O ovócito humano mede cerca de 0,1 mm, quase no limite do que se vê a olho nu. Quanto mais longo é o desenvolvimento sem ajuda da mãe, mais vitelo o ovo tem.</p>
<div class="tab"><table>
<thead><tr><th>Tipo</th><th>Vitelo</th><th>Distribuição</th><th>Exemplos</th><th>Segmentação</th></tr></thead>
<tbody>
<tr><th>Oligolécito (isolécito)</th><td>pouco</td><td>uniforme</td><td>ouriço-do-mar, anfioxo, mamíferos placentários</td><td>holoblástica igual</td></tr>
<tr><th>Heterolécito</th><td>médio</td><td>concentrado no polo vegetativo</td><td>anfíbios (sapo, rã)</td><td>holoblástica desigual</td></tr>
<tr><th>Telolécito</th><td>muito</td><td>quase todo o ovo; citoplasma na cicatrícula</td><td>aves, répteis, maioria dos peixes, cefalópodes, monotremados</td><td>meroblástica discoidal</td></tr>
<tr><th>Centrolécito</th><td>médio a muito</td><td>no centro</td><td>insetos e outros artrópodes</td><td>meroblástica superficial</td></tr>
</tbody></table></div>`,
    enem: 'A prova liga o tipo de ovo ao <b>modo de vida</b>: muito vitelo (telolécito) é típico de quem se desenvolve fora do corpo da mãe, por muito tempo, como aves e répteis. Pouco vitelo (oligolécito) aparece nos mamíferos placentários, que recebem nutrientes pela placenta. E lembre: quanto mais vitelo, mais difícil a segmentação, que pode nem dividir o ovo inteiro.',
    links: [['Segmentação', '#desenvolvimento/segmentacao'], ['Vitelo e modo de vida', '#ovos/vitelo']],
    draw(t, S) {
      // mexer na faixa volta para a sequência oligo → hetero → telo
      if (S.cen && S.vSeen != null && Math.abs(S.v - S.vSeen) > .5) { S.cen = false; const b = document.querySelector('#extra button'); if (b) b.setAttribute('aria-pressed', 'false'); }
      if (!S.cen) S.vSeen = S.v;
      const A = area(), k = tipoDe(S.v, S.cen), T = TIPOS[k];
      const thumbH = NAR ? 76 : 92, mainH = A.h - thumbH - (NAR ? 8 : 14);
      // ovo principal e ficha
      let ex, ey, R, cx0, cy0, cw;
      if (NAR) { R = Math.min(A.w * .28, mainH * .24); ex = A.cx; ey = A.y0 + 22 + R; cx0 = A.x0 + 6; cy0 = ey + R + 46; cw = A.w - 12; }
      else { R = Math.min(A.w * .17, mainH * .38); ex = A.x0 + A.w * .3; ey = A.y0 + mainH / 2 + 4; cx0 = A.x0 + A.w * .55; cy0 = A.y0 + mainH / 2 - 62; cw = A.w * .43; }
      const P = ovo(ex, ey, R, S.v, S.cen);
      if (!S.cen) {
        tx('polo animal', ex, ey - R - 12, { s: 12, w: 600, c: C.txt });
        tx('polo vegetativo', ex, ey + R + 12, { s: 12, w: 600, c: C.txt });
      }
      if (k === 'telo') {
        // a cicatrícula é o disco de citoplasma (com o núcleo), não o núcleo
        const qx = ex - R * .22, qy = (ey - Math.sqrt(R * R - (R * .22) ** 2) + P.lvl) / 2;
        lab(qx, qy, ex + (NAR ? R * .75 : -R * 1.2), NAR ? ey - R * .55 : qy - 10, NAR ? 'cicatrícula' : 'cicatrícula (citoplasma e núcleo)');
      } else lab(P.nuc[0], P.nuc[1], ex + (NAR ? R * 1.05 : -R * 1.2), P.nuc[1] - (NAR ? R * .45 : 10), 'núcleo');
      if (k === 'centro') lab(P.cit[0], P.cit[1], ex - R * (NAR ? .6 : 1.2), ey - R * (NAR ? .95 : 1.05), 'citoplasma (na periferia)');
      if (k !== 'oligo') lab(P.vit[0], P.vit[1], ex + (NAR ? -R * 1.05 : -R * 1.25), P.vit[1] + (NAR ? R * .3 : 24), 'vitelo');
      else lab(ex - R * .5, ey + R * .3, ex - R * 1.25, ey + R * .6, 'vitelo espalhado');
      // ficha do tipo
      const fs = NAR ? 13 : 14; let yy = cy0;
      tx(T.n, cx0, yy, { f: FH, s: NAR ? 16 : 20, w: 700, a: 'left', c: C.vitelo, bg: false }); yy += NAR ? 22 : 30;
      for (const [a, b] of [['Vitelo', T.v], ['Exemplos', T.ex], ['Segmentação', T.sg]]) {
        tx(a, cx0, yy, { s: 12, w: 600, a: 'left', c: C.dim, bg: false }); yy += NAR ? 15 : 17;
        yy += wrapTx(b, cx0, yy, cw, { s: fs, w: 600, a: 'left', c: C.txt, lh: fs + 4 }) + (NAR ? 4 : 8);
      }
      // miniaturas dos quatro tipos
      const ty = A.y1 - thumbH / 2 + (NAR ? 2 : 0), tr = Math.min(thumbH * .26, A.w / 4 * .22), keys = ['oligo', 'hetero', 'telo', 'centro'], vs = { oligo: 12, hetero: 45, telo: 92, centro: 0 };
      keys.forEach((kk, i) => {
        const x = A.x0 + A.w * (i + .5) / 4, on = kk === k;
        if (on) rr(x - A.w / 8 + 4, ty - thumbH / 2, A.w / 4 - 8, thumbH, 10, 'rgba(255,179,71,.08)', 'rgba(255,179,71,.55)', 1);
        X.save(); X.globalAlpha = on ? 1 : .6; ovo(x, ty - 10, tr, vs[kk], kk === 'centro'); X.restore();
        const nm = NAR ? { oligo: 'Oligo', hetero: 'Hetero', telo: 'Telo', centro: 'Centro' }[kk] : TIPOS[kk].n.replace(' (isolécito)', '');
        tx(nm, x, ty + thumbH / 2 - 12, { s: 12, w: 600, c: on ? C.txt : C.dim, bg: false });
      });
      cap(`<b>${T.n}</b>: ${T.v}. Exemplo: ${T.cur}`);
    }
  });

  // =====================================================================================
  // OVOS: VITELO E MODO DE VIDA
  // =====================================================================================
  function embriao(x, y, s, a = 1) { // embrião curvado (vírgula): cabeça e corpo
    X.save(); X.globalAlpha *= a;
    X.beginPath(); X.arc(x, y, s, PI * .15, PI * 1.35); X.strokeStyle = EMB; X.lineWidth = Math.max(2, s * .7); X.lineCap = 'round'; X.stroke(); X.lineCap = 'butt';
    circ(x + Math.cos(PI * .15) * s, y + Math.sin(PI * .15) * s, s * .6, EMB); circ(x + Math.cos(PI * .15) * s + s * .15, y + Math.sin(PI * .15) * s - s * .1, Math.max(1, s * .12), '#3A2A2A');
    X.restore();
  }
  function pintinho(x, y, s) {
    ell(x, y, s * .55, s * .45, 0, PINTO, 'rgba(11,15,28,.5)', 1); circ(x + s * .38, y - s * .42, s * .3, PINTO, 'rgba(11,15,28,.5)', 1);
    X.beginPath(); X.moveTo(x + s * .64, y - s * .46); X.lineTo(x + s * .84, y - s * .38); X.lineTo(x + s * .64, y - s * .3); X.closePath(); X.fillStyle = '#F2994A'; X.fill();
    circ(x + s * .44, y - s * .48, Math.max(1.2, s * .05), '#1A1A1A');
    line(x - s * .1, y + s * .42, x - s * .1, y + s * .62, '#F2994A', 2); line(x + s * .15, y + s * .42, x + s * .15, y + s * .62, '#F2994A', 2);
  }
  function girino(x, y, s, t, pernas, k) { // k: 0 girino, 1 sapo (metamorfose)
    const cauda = s * 1.6 * (1 - k);
    if (cauda > 1) { X.beginPath(); for (let i = 0; i <= 12; i++) { const d = s * .5 + i / 12 * cauda, w = Math.sin(i * .7 - t * 9) * s * .18 * (i / 12); i ? X.lineTo(x - d, y + w) : X.moveTo(x - d, y + w); } X.strokeStyle = SAPO; X.lineWidth = Math.max(2, s * .22 * (1 - k * .6)); X.lineCap = 'round'; X.stroke(); X.lineCap = 'butt'; }
    if (pernas > 0) { X.save(); X.globalAlpha = pernas; line(x - s * .25, y + s * .3, x - s * .7, y + s * .7, SAPO, Math.max(2, s * .16)); line(x - s * .7, y + s * .7, x - s * .25, y + s * .78, SAPO, Math.max(2, s * .14)); if (k > .3) { line(x + s * .3, y + s * .3, x + s * .55, y + s * .7, SAPO, Math.max(2, s * .13)); } X.restore(); }
    ell(x, y, s * lerp(.55, .7, k), s * lerp(.42, .48, k), 0, SAPO, 'rgba(11,15,28,.5)', 1);
    circ(x + s * .3, y - s * .3 - k * s * .1, Math.max(1.5, s * .12), '#E8EDF7'); circ(x + s * .32, y - s * .3 - k * s * .1, Math.max(1, s * .06), '#1A1A1A');
  }
  function meter(x, y, w, f, c, nome) {
    rr(x, y, w, 8, 4, 'rgba(91,108,153,.3)'); if (f > .01) rr(x, y, Math.max(6, w * cl(f, 0, 1)), 8, 4, c);
    tx(nome, x, y - 9, { s: 12, w: 600, a: 'left', c: C.dim, bg: false });
  }
  // uma trilha: caixa b, tipo k, tempo T de 0 a 1
  function trilha(b, k, T, t) {
    const row = b.w > b.h * 1.3, s = row ? Math.min(b.h - 8, b.w * .42) : Math.min(b.w * .9, b.h - 150);
    const dx = row ? b.x + s / 2 : b.x + b.w / 2, dy = row ? b.y + b.h / 2 : b.y + 34 + s / 2;
    const tw0 = row ? b.w - s - 24 : b.w - 16, tx0 = row ? b.x + s + 12 : b.x + 8;
    rr(row ? b.x : b.x, b.y, b.w, b.h, 12, 'rgba(19,26,43,.45)', 'rgba(91,108,153,.35)', 1);
    let titulo, fase, res, extra = null;
    if (k === 'ave') {
      titulo = 'Ave (ovo telolécito)'; const dia = Math.round(T * 21), sai = T >= .93;
      res = sai ? .08 : 1 - .9 * T;
      if (!sai) {
        ell(dx, dy, s * .3, s * .38, 0, rgba(C.clara, .16), C.casca, 2.5);
        const gr = s * .19 * Math.sqrt(res);
        circ(dx, dy + s * .04, gr, C.vitelo); X.save(); X.beginPath(); X.arc(dx, dy + s * .04, gr, 0, TAU); X.clip(); grains(dx - gr, dy - gr, gr * 2, gr * 2 + s * .08, dark(C.vitelo, .3), .9, 9); X.restore();
        embriao(dx - s * .02, dy + s * .04 - gr - s * .02 * (1 - T) + T * s * .1, s * (.025 + .14 * T));
        fase = `dia ${dia} de 21: o embrião cresce consumindo a gema`;
      } else {
        X.save(); X.translate(dx, dy); X.rotate(-.35); X.beginPath(); X.ellipse(0, s * .02, s * .3, s * .3, 0, 0, PI); X.strokeStyle = C.casca; X.lineWidth = 2.5; X.stroke(); X.restore();
        pintinho(dx + s * .02, dy - s * .06, s * .34);
        fase = 'o pintinho sai parecido com o adulto, já anda e bica: desenvolvimento direto';
      }
    } else if (k === 'anf') {
      titulo = 'Anfíbio (ovo heterolécito)'; res = .55 * Math.max(0, 1 - T / .3);
      rr(dx - s * .46, dy - s * .46, s * .92, s * .92, 10, rgba(C.agua, .12));
      if (T < .3) {
        const r = s * .14; circ(dx, dy, s * .21, rgba(C.agua, .22), rgba(C.agua, .5), 1);
        circ(dx, dy, r, C.vitelo); X.save(); X.beginPath(); X.arc(dx, dy, r, 0, TAU); X.clip(); X.fillStyle = PIG; X.fillRect(dx - r, dy - r, 2 * r, r * lerp(1, .7, T / .3)); X.restore(); circ(dx, dy, r, null, C.ovo, 1.5);
        if (!NAR) lab(dx + s * .15, dy - s * .15, dx + s * .3, dy - s * .36, 'cápsula gelatinosa');
        fase = 'o pouco vitelo acaba cedo: o embrião sai logo do ovo';
      } else {
        const g = seg(T, .3, .7), pe = seg(T, .55, .75), m = seg(T, .8, .97);
        girino(dx + s * .08, dy + Math.sin(t * 2) * s * .03, s * lerp(.14, .3, g), t, pe, m);
        fase = T < .8 ? 'sai uma larva, o girino, que come sozinha e cresce' : 'metamorfose: o girino vira sapo (desenvolvimento indireto)';
      }
    } else {
      titulo = 'Mamífero placentário (oligolécito)'; res = .04 * Math.max(0, 1 - T / .08);
      // útero em corte: parede rosa em volta de uma cavidade; o embrião se desenvolve DENTRO dela
      const cy = dy - s * .03, ang = -PI * .3, irx = s * .3, iry = s * .26;
      rr(dx - s * .07, cy + s * .3, s * .14, s * .13, 5, rgba(C.mae, .55), C.mae, 1.5);
      ell(dx, cy, s * .41, s * .37, 0, rgba(C.mae, .55), C.mae, 1.5);
      ell(dx, cy, irx, iry, 0, '#1B1424', dark(C.mae, .1), 1.5);
      tx('útero', dx - s * .3, cy + s * .3, { s: 12, w: 600, c: C.txt });
      const ppx = dx + Math.cos(ang) * irx, ppy = cy + Math.sin(ang) * iry;
      if (T < .15) {
        // ovócito (depois blastocisto) minúsculo chegando e se implantando na parede
        const k = ss(seg(T, 0, .08)), x0 = dx - s * .22, y0 = cy - s * .12;
        const bx = lerp(x0, ppx - s * .02, k), by = lerp(y0, ppy + s * .02, k), br = T < .08 ? 2.5 : 3.5;
        circ(bx, by, br, C.ovo, '#fff', 1);
        fase = T < .08 ? 'ovócito de cerca de 0,1 mm, quase sem vitelo' : 'o embrião, ainda minúsculo, se implanta na parede do útero';
      } else {
        const g = seg(T, .15, .95), er = s * lerp(.05, .19, g), pr = s * lerp(.05, .1, g);
        ell(ppx, ppy, pr, pr * .45, ang + PI / 2, dark(C.mae, .2), C.corion, 1.5);
        const ex = dx - s * .04, ey = cy + s * .03;
        circ(ex, ey, er, rgba(C.liquido, .7), C.amnio, 2);
        const fx = ex, fy = ey + er * .1, cx1 = fx + er * .3, cy1 = fy + er * .2, qx0 = (cx1 + ppx) / 2 + s * .04, qy0 = (cy1 + ppy) / 2 + s * .04;
        X.beginPath(); X.moveTo(cx1, cy1); X.quadraticCurveTo(qx0, qy0, ppx, ppy); X.strokeStyle = C.alant; X.lineWidth = 2.5; X.stroke();
        for (let i = 0; i < 4; i++) { const f = fr(t * .5 + i / 4), [qx, qy] = qpt(ppx, ppy, qx0, qy0, cx1, cy1, f); circ(qx, qy, 2.4, NUTRI); }
        embriao(fx - er * .05, fy, er * .5);
        fase = T < .95 ? 'a placenta, na parede do útero, traz nutrientes da mãe o tempo todo' : 'o filhote nasce, nutrido até o fim pela placenta';
        extra = 1;
      }
      extra = extra || 0;
    }
    // textos e medidores
    const fsz = NAR ? 12 : 13;
    let yy = row ? b.y + 14 : b.y + 16;
    const th = wrapTx(titulo, row ? tx0 : b.x + b.w / 2, yy, tw0, { f: FH, s: NAR ? 13 : 15, w: 600, a: row ? 'left' : 'center', c: C.txt, lh: NAR ? 16 : 19 });
    yy = row ? yy + th + 2 : dy + s / 2 + 14;
    wrapTx(fase, row ? tx0 : b.x + b.w / 2, yy, tw0, { s: fsz, w: 600, a: row ? 'left' : 'center', c: C.txt, lh: fsz + 3 });
    const my = b.y + b.h - (k === 'mam' ? 44 : 16);
    meter(tx0, my, tw0, res, C.vitelo, 'reserva de vitelo');
    if (k === 'mam') meter(tx0, my + 28, tw0, extra ? 1 : 0, C.mae, 'nutrientes pela placenta');
  }

  def('ovos', 'vitelo', {
    t: 'Vitelo e modo de vida', s: 'desenvolvimento direto e indireto', c: C.vitelo, loc: 'Ave, anfíbio e mamífero',
    alt: 'Três trilhas com a mesma régua de tempo: o pintinho cresce consumindo a gema e sai parecido com o adulto; o anfíbio sai cedo como girino e passa por metamorfose; o embrião de mamífero se implanta no útero e recebe nutrientes pela placenta',
    ctl: { l: 'Tempo', min: 0, max: 100, step: 1, v: 0, f: v => v < 1 ? 'fecundação' : v > 99 ? 'jovem' : Math.round(v) + '%', rate: () => 1 },
    auto: 7, stillV: 60, still: 0,
    d: `<p>A quantidade de vitelo diz quanto tempo o embrião consegue se desenvolver sozinho, sem comer. Com <b>muito vitelo</b> (telolécito), o embrião fica muito tempo dentro do ovo e sai já parecido com o adulto: é o <b>desenvolvimento direto</b> das aves e dos répteis. Um pintinho sai do ovo depois de 21 dias de incubação e já anda e bica. Com <b>vitelo médio</b> (heterolécito), as reservas acabam cedo, e o embrião sai do ovo como uma <b>larva</b>, que se alimenta sozinha e só depois vira adulto, por <b>metamorfose</b>: é o <b>desenvolvimento indireto</b> dos anfíbios (o girino vira sapo) e de muitos invertebrados, como o ouriço-do-mar, que tem ovo oligolécito e larva.</p>
<p>Os <b>mamíferos placentários</b> resolveram o problema de outro jeito: o ovo quase não tem vitelo, mas o embrião se implanta no útero e passa a receber nutrientes da mãe pela placenta. Por isso o ovócito humano é microscópico (cerca de 0,1 mm), enquanto a gema de uma ema ou de um avestruz chega a vários centímetros. Os monotremados, como o ornitorrinco, mamíferos que põem ovos, têm ovos telolécitos, como os dos répteis.</p>`,
    kv: [['Muito vitelo', 'desenvolvimento direto, sem larva (aves e répteis)'], ['Vitelo médio ou pouco', 'em geral, larva e metamorfose (anfíbios, ouriço-do-mar)'], ['Quase sem vitelo', 'nutrição pela placenta (mamíferos placentários)'], ['Incubação da galinha', '21 dias']],
    enem: 'Relacione a <b>quantidade de vitelo</b> ao <b>tipo de desenvolvimento</b>: muito vitelo leva a desenvolvimento <b>direto</b>, sem larva (aves e répteis); pouco ou médio vitelo leva, em geral, a desenvolvimento <b>indireto</b>, com larva e metamorfose (anfíbios e muitos invertebrados). Nos mamíferos placentários, a falta de vitelo é compensada pela <b>placenta</b>.',
    links: [['Tipos de ovo', '#ovos/tipos'], ['Placenta', '#humano/placenta'], ['O ovo amniótico', '#anexos/amniotico']],
    draw(t, S) {
      const A = area(), T = S.v / 100, g = NAR ? 8 : 16, ks = ['ave', 'anf', 'mam'];
      ks.forEach((k, i) => {
        const b = NAR ? { x: A.x0, y: A.y0 + i * (A.h + g) / 3, w: A.w, h: (A.h - 2 * g) / 3 } : { x: A.x0 + i * (A.w + g) / 3, y: A.y0, w: (A.w - 2 * g) / 3, h: A.h };
        trilha(b, k, T, t);
      });
      cap(T < .1 ? 'Mesma régua de tempo, da fecundação até o jovem: veja quanto vitelo cada ovo tem' : T < .8 ? 'O vitelo do anfíbio acaba cedo: sai uma <b>larva</b>. A ave segue gastando a gema; o mamífero recebe nutrientes da mãe' : '<b>Direto</b> na ave (sai parecido com o adulto), <b>indireto</b> no anfíbio (metamorfose), <b>placenta</b> no mamífero');
    }
  });
}
