/* LAB · Módulo Embriologia. Cenas D: anexos embrionários (os quatro anexos e o ovo amniótico),
   fecundação e nidação. Roteiro: docs/revisao-biologia/embriologia-roteiro-b.md (Sapien).
   Código, textos e desenhos da equipe (Leo). Embrião humano e pintinho são esquemas próprios. */
'use strict';
{
  // ---------------------------------------------------------------------------------
  // utilidades locais
  // ---------------------------------------------------------------------------------
  const PELE = '#E7B4A4', PENA = '#E6CB92', MCI = '#E8A9A3'; // massa celular interna (mesma cor do Apolo)
  const ANX = [
    { k: 'vit', n: 'Vesícula vitelínica', c: () => C.vitelo },
    { k: 'amn', n: 'Âmnio', c: () => C.amnio },
    { k: 'cor', n: 'Córion', c: () => C.corion },
    { k: 'ala', n: 'Alantoide', c: () => C.alant }
  ];
  // avança o controle sozinho enquanto a pessoa não mexe na faixa (pausa e volta ao começo)
  let curS = null;
  const rngEl = () => document.getElementById('ctlR');
  if (rngEl()) rngEl().addEventListener('input', () => { if (curS) curS.user = true; });
  function syncCtl(o, S) {
    const r = rngEl(); if (!r) return; const s = o.ctl.f(S.v);
    if (S._lastF !== s) { S._lastF = s; r.value = S.v; const v = document.getElementById('ctlV'); if (v) v.textContent = s; r.setAttribute('aria-valuetext', s); }
  }
  function auto(o, S, vel, max, hold = 2.5) {
    curS = S; const c = o.ctl; max = max == null ? c.max : max;
    if (!S.paused && !S.user) {
      if (S.hold > 0) { S.hold -= S.dt; if (S.hold <= 0) S.v = c.min; }
      else { S.v += S.dt * vel; if (S.v >= max) { S.v = max; S.hold = hold; } }
    }
    syncCtl(o, S);
  }
  // toque no palco: o motor chama drag() no pointerdown e no pointermove; só o primeiro conta
  function toque(S, x, y) { const now = performance.now(), ok = now - (S.tapT || 0) > 260; S.tapT = now; return ok; }
  // pastilha clicável desenhada no palco; devolve o retângulo
  function pill(x, y, s, c, on, o = {}) {
    X.font = `600 13px ${FT}`; const w = X.measureText(s).width + (c ? 34 : 20), h = 30;
    const xx = o.a === 'right' ? x - w : x;
    rr(xx, y, w, h, 999, on ? 'rgba(27,36,64,.95)' : 'rgba(11,15,28,.78)', on ? '#FFB347' : 'rgba(255,255,255,.18)', on ? 2 : 1);
    if (c) circ(xx + 15, y + h / 2, 6, c, 'rgba(11,15,28,.6)', 1);
    X.fillStyle = on ? C.txt : (o.dim ? C.dim : C.txt); X.textAlign = 'left'; X.textBaseline = 'middle'; X.fillText(s, xx + (c ? 27 : 10), y + h / 2 + .5);
    return [xx, y, w, h];
  }
  const inR = (r, x, y) => r && x >= r[0] && x <= r[0] + r[2] && y >= r[1] && y <= r[1] + r[3];
  const inE = (x, y, cx, cy, rx, ry) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;
  function eggPath(cx, cy, rx, ry) { X.beginPath(); X.ellipse(cx, cy, rx, ry, 0, 0, TAU); }
  const ordinal = n => n + 'º';

  // embrião esquemático em "C" (vale para pintinho jovem e embrião humano); s = meio comprimento
  function embC(x, y, s, cor, rot = 0) {
    X.save(); X.translate(x, y); X.rotate(rot);
    X.beginPath(); X.arc(0, 0, s * .62, -PI * .75, PI * .62); X.strokeStyle = cor; X.lineWidth = Math.max(3, s * .5); X.lineCap = 'round'; X.stroke(); X.lineCap = 'butt';
    circ(Math.cos(-PI * .75) * s * .62 + s * .05, Math.sin(-PI * .75) * s * .62 - s * .02, s * .42, cor, 'rgba(11,15,28,.45)', 1);
    circ(Math.cos(-PI * .75) * s * .62 + s * .02, Math.sin(-PI * .75) * s * .62 + s * .02, Math.max(1.2, s * .07), 'rgba(11,15,28,.6)');
    X.restore();
  }
  // feto humano esquemático: cabeça grande, tronco curvado, braço e perna
  function feto(x, y, s, cor) {
    ell(x + s * .1, y + s * .25, s * .55, s * .7, -.35, cor, 'rgba(11,15,28,.45)', 1);
    circ(x - s * .25, y - s * .55, s * .5, cor, 'rgba(11,15,28,.45)', 1);
    circ(x - s * .45, y - s * .55, Math.max(1.5, s * .06), 'rgba(11,15,28,.6)');
    X.lineCap = 'round';
    line(x - s * .1, y, x - s * .55, y + s * .2, cor, Math.max(3, s * .18));
    line(x + s * .3, y + s * .7, x - s * .2, y + s * .85, cor, Math.max(3, s * .22));
    X.lineCap = 'butt';
  }
  // pintinho quase pronto
  function pinto(x, y, s, t, bica) {
    ell(x + s * .15, y + s * .1, s * .85, s * .68, .1, PENA, 'rgba(11,15,28,.45)', 1);
    const hx_ = x - s * .55, hy = y - s * .42; circ(hx_, hy, s * .38, PENA, 'rgba(11,15,28,.45)', 1);
    const k = bica ? Math.max(0, Math.sin(t * 9)) * s * .08 : 0;
    X.beginPath(); X.moveTo(hx_ - s * .3 - k, hy - s * .02); X.lineTo(hx_ - s * .62 - k, hy + s * .06); X.lineTo(hx_ - s * .3 - k, hy + s * .14); X.closePath(); X.fillStyle = '#F2A33A'; X.fill();
    circ(hx_ - s * .1, hy - s * .08, Math.max(1.5, s * .06), '#1A1206');
  }
  // vasos que se espalham a partir de um ponto (desenhados dentro de um recorte)
  function vasos(x, y, R, f, cor, seed, n = 9) {
    const r = rng(seed); X.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU + r() * .4, L = R * f * (.75 + r() * .4); let px = x, py = y, aa = a;
      X.beginPath(); X.moveTo(px, py);
      for (let j = 1; j <= 6; j++) { aa += (r() - .5) * .5; px += Math.cos(aa) * L / 6; py += Math.sin(aa) * L / 6; X.lineTo(px, py); }
      X.strokeStyle = cor; X.lineWidth = 1.6; X.stroke();
      if (f > .5) { const bx = x + Math.cos(a) * L * .5, by = y + Math.sin(a) * L * .5; line(bx, by, bx + Math.cos(a + .7) * L * .3, by + Math.sin(a + .7) * L * .3, cor, 1.1); }
    }
    X.lineCap = 'butt';
  }

  // ---------------------------------------------------------------------------------
  // OVO DE AVE EM INCUBAÇÃO (dia 0 a 21); o = { sel, hits, mini, lb }
  // ---------------------------------------------------------------------------------
  function ovoAve(cx, cy, rx, ry, d, t, o = {}) {
    const al = k => (o.sel && o.sel !== k ? .22 : 1), hi = k => o.sel === k, mini = !!o.mini;
    const ex = cx + rx * .12, ey = cy - ry * lerp(.2, .02, ss(d / 21)), es = ry * lerp(.08, .46, ss(d / 20));
    const yk = d < 4 ? 1 : d < 19 ? lerp(1, .42, (d - 4) / 15) : lerp(.42, 0, seg(d, 19, 20.6));
    const yr = ry * .5 * Math.sqrt(yk), yx = ex, yy = ey + es * .55 + yr * .92;
    const ar = es * 1.3 + ry * .07, af = seg(d, 2.5, 5), cf = seg(d, 1.5, 6), gf = seg(d, 4, 12);
    const crx = rx * .9, cry = ry * .86;
    // casca e interior
    eggPath(cx, cy, rx, ry); X.fillStyle = '#121828'; X.fill();
    X.save(); eggPath(cx, cy, rx - 2, ry - 2); X.clip();
    const clara = 1 - seg(d, 10, 18);
    if (clara > 0) { X.save(); X.globalAlpha = clara; ell(cx, cy, rx, ry, 0, rgba(C.clara, .2)); X.restore(); }
    const ac = rx * (.08 + .14 * d / 21); ell(cx - rx, cy, ac * 1.6, ry * .95, 0, '#0B0F1C', 'rgba(237,227,209,.5)', 1.2);
    // vesícula vitelínica (gema) com vasos
    if (yr > 1) {
      X.save(); X.globalAlpha = al('vit');
      const g = X.createRadialGradient(yx - yr * .3, yy - yr * .3, yr * .1, yx, yy, yr); g.addColorStop(0, light(C.vitelo, .2)); g.addColorStop(1, dark(C.vitelo, .15));
      circ(yx, yy, yr, g, hi('vit') ? '#fff' : rgba(C.vitelo, .9), hi('vit') ? 2.5 : 1.2);
      X.save(); X.beginPath(); X.arc(yx, yy, yr - 1, 0, TAU); X.clip(); vasos(ex, ey + es * .4, yr * 1.9, seg(d, 1.5, 4.5), C.sangueF, 11); X.restore();
      X.restore();
    }
    // alantoide: brota do intestino e cresce até encostar no córion
    if (gf > 0) {
      const bx = lerp(ex + es * .7, cx + rx * .02, ss(gf)), by = lerp(ey + es * .35, cy - ry * .5, ss(gf));
      const brx = lerp(es * .25 + 3, rx * .86, ss(gf)), bry = lerp(es * .25 + 3, ry * .52, ss(gf));
      X.save(); X.globalAlpha = al('ala'); eggPath(cx, cy, crx, cry); X.clip();
      ell(bx, by, brx, bry, 0, rgba(C.alant, .3), hi('ala') ? '#fff' : C.alant, hi('ala') ? 2.5 : 1.8);
      const n = Math.floor(seg(d, 6, 18) * 16), r = rng(5);
      for (let i = 0; i < n; i++) { const a = r() * TAU, k = Math.sqrt(r()) * .8, px = bx + Math.cos(a) * brx * k, py = by + Math.sin(a) * bry * k; if (!inE(px, py, cx, cy, crx * .97, cry * .97) || Math.hypot(px - ex, py - ey) < ar + 3) continue; ngon(px, py, mini ? 2 : 3, 4, 0, '#F4F6FA', 'rgba(11,15,28,.4)', .8); }
      X.restore();
      X.save(); X.globalAlpha = al('ala'); line(ex + es * .4, ey + es * .3, lerp(ex + es * .7, bx, .5), lerp(ey + es * .35, by + bry * .7, .3), C.alant, 3); X.restore();
      if (o.hits) o.hits.push({ k: 'ala', f: (x, y) => inE(x, y, bx, by, brx, bry) && inE(x, y, cx, cy, crx, cry) });
      o.ala = [bx, by - bry * .6];
    }
    // âmnio: se fecha em volta do embrião
    if (af > 0) {
      X.save(); X.globalAlpha = al('amn');
      if (af >= .99) circ(ex, ey, ar, rgba(C.amnio, .22));
      X.beginPath(); X.arc(ex, ey, ar, PI / 2 - af * PI, PI / 2 + af * PI); X.strokeStyle = hi('amn') ? '#fff' : C.amnio; X.lineWidth = hi('amn') ? 3 : 2; X.stroke();
      X.restore();
      if (o.hits) o.hits.push({ k: 'amn', f: (x, y) => Math.hypot(x - ex, y - ey) < ar });
    }
    // embrião
    if (d < 15) embC(ex, ey, es, PELE, .3);
    else if (d < 17) { X.save(); X.globalAlpha = 1 - seg(d, 15, 17); embC(ex, ey, es, PELE, .3); X.globalAlpha = seg(d, 15, 17); pinto(ex, ey, es * .9, t, false); X.restore(); }
    else pinto(ex, ey, es * .9, t, d >= 20);
    // córion: anexo mais externo, sob as membranas da casca
    if (cf > 0) {
      X.save(); X.globalAlpha = al('cor'); X.beginPath(); X.ellipse(cx, cy, crx, cry, 0, -PI / 2 - cf * PI, -PI / 2 + cf * PI);
      X.strokeStyle = hi('cor') ? '#fff' : C.corion; X.lineWidth = hi('cor') ? 3.5 : 2.5; X.stroke(); X.restore();
      if (o.hits) o.hits.push({ k: 'cor', f: (x, y) => inE(x, y, cx, cy, rx * .97, ry * .97) && !inE(x, y, cx, cy, rx * .8, ry * .76) });
    }
    X.restore();
    // casca com poros
    eggPath(cx, cy, rx, ry); X.strokeStyle = C.casca; X.lineWidth = mini ? 3.5 : 6; X.stroke();
    ell(cx, cy, rx - (mini ? 3 : 5), ry - (mini ? 3 : 5), 0, null, 'rgba(237,227,209,.45)', 1);
    const np = mini ? 18 : 34; for (let i = 0; i < np; i++) { const a = i / np * TAU; circ(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, mini ? 1 : 1.4, '#6E6250'); }
    if (d >= 20.2) { const px = cx - rx * .72, py = cy - ry * .62; const qa = -2.4, qx = cx + Math.cos(qa) * rx, qy = cy + Math.sin(qa) * ry; poly([[qx - 7, qy - 2], [qx - 1, qy + 3], [qx - 4, qy + 8], [qx + 3, qy + 13]], '#7A5A2E', 2.5); void px; void py; }
    // trocas gasosas pelos poros (membrana corioalantoide)
    if (!mini && d >= 7 && d < 20.5) {
      for (let i = 0; i < 3; i++) {
        const f = fr(t * .35 + i / 3), a = -PI / 2 + (i - 1) * .45, px = cx + Math.cos(a) * rx, py = cy + Math.sin(a) * ry;
        const nx = Math.cos(a) / rx, ny = Math.sin(a) / ry, L = Math.hypot(nx, ny), ux = nx / L, uy = ny / L;
        const ent = i % 2 === 0, k = ent ? lerp(26, -18, f) : lerp(-18, 26, f);
        X.save(); X.globalAlpha = Math.sin(f * PI); tok(px + ux * k, py + uy * k, ent ? 'O₂' : 'CO₂', ent ? C.o : C.c); X.restore();
      }
    }
    // pontos de rótulo
    return { ex, ey, es, yx, yy, yr, ar, ac, cx, cy, rx, ry };
  }

  // ---------------------------------------------------------------------------------
  // ÚTERO HUMANO (semana 2 a 12 após a fecundação); o = { sel, hits, mini }
  // ---------------------------------------------------------------------------------
  function uteroHum(cx, cy, R, w, t, o = {}) {
    const al = k => (o.sel && o.sel !== k ? .22 : 1), hi = k => o.sel === k, mini = !!o.mini;
    const g = ss((w - 2) / 10);
    // parede do útero e endométrio
    ell(cx, cy, R * 1.12, R, 0, rgba(C.mae, .28), rgba(C.mae, .8), 2);
    X.save(); ell(cx, cy, R * 1.12, R, 0); X.clip(); grains(cx - R * 1.12, cy - R, R * 2.24, R * 2, C.mae, .25, 3); X.restore();
    const Rc = R * lerp(.42, .76, g), ccx = cx, ccy = cy + R * .04;
    // placenta: as vilosidades do córion se concentram de um lado a partir da 8ª semana
    const pf = seg(w, 6, 10), pa = -PI / 2;
    if (pf > 0) {
      X.save(); X.globalAlpha = al('cor');
      X.beginPath(); X.ellipse(ccx, ccy, Rc + R * .16 * pf, Rc + R * .16 * pf, 0, pa - 1.1, pa + 1.1); X.ellipse(ccx, ccy, Rc, Rc, 0, pa + 1.1, pa - 1.1, true); X.closePath();
      X.fillStyle = rgba(C.sangue, .55 * pf); X.fill();
      X.restore();
    }
    // córion (lilás) com vilosidades
    X.save(); X.globalAlpha = al('cor');
    circ(ccx, ccy, Rc, rgba(C.liquido, .35), hi('cor') ? '#fff' : C.corion, hi('cor') ? 3.5 : 2.5);
    const nv = mini ? 22 : 40;
    for (let i = 0; i < nv; i++) {
      const a = i / nv * TAU, dd = Math.abs(Math.atan2(Math.sin(a - pa), Math.cos(a - pa))), front = dd < 1.1;
      const L = R * (front ? lerp(.07, .07 + .12 * pf, 1) : .07 * (1 - pf * .9)); if (L < 1) continue;
      const x0 = ccx + Math.cos(a) * Rc, y0 = ccy + Math.sin(a) * Rc, x1 = ccx + Math.cos(a) * (Rc + L), y1 = ccy + Math.sin(a) * (Rc + L);
      line(x0, y0, x1, y1, C.corion, front && pf > .3 ? 3 : 2);
      if (front && pf > .3) { line(x1, y1, x1 + Math.cos(a + .6) * L * .4, y1 + Math.sin(a + .6) * L * .4, C.corion, 2); line(x1, y1, x1 + Math.cos(a - .6) * L * .4, y1 + Math.sin(a - .6) * L * .4, C.corion, 2); }
    }
    X.restore();
    if (o.hits) o.hits.push({ k: 'cor', f: (x, y) => { const r = Math.hypot(x - ccx, y - ccy); return r > Rc - 6 && r < Rc + R * .25; } });
    // âmnio cresce até encher o córion
    const Ra = Rc * lerp(.34, .93, g), acx = ccx + (Rc - Ra) * .25, acy = ccy + (Rc - Ra) * .35;
    // vesícula vitelínica: bolinha âmbar entre o âmnio e o córion, ligada ao embrião
    const vr = Math.max(4, R * lerp(.11, .07, g)), va = PI * .78;
    const vd = Math.min(Rc - vr - 3, Math.max(Ra + vr + 2, (Ra + Rc) / 2)), vx = ccx + Math.cos(va) * vd, vy = ccy + Math.sin(va) * vd;
    // embrião / feto
    const es = w < 3.5 ? Ra * .4 : Ra * lerp(.38, .5, seg(w, 4, 12));
    const ex = acx + Ra * .05, ey = acy + Ra * .05;
    // cordão: do embrião até a placenta (no alto), com a alantoide dentro
    const top = [ccx, ccy - Rc];
    X.save(); X.globalAlpha = al('amn');
    circ(acx, acy, Ra, rgba(C.amnio, .22), hi('amn') ? '#fff' : C.amnio, hi('amn') ? 3 : 2);
    X.restore();
    if (o.hits) o.hits.push({ k: 'amn', f: (x, y) => Math.hypot(x - acx, y - acy) < Ra - 4 });
    if (w >= 3.5) {
      const qx = lerp(ex, top[0], .5) + Ra * .3, qy = lerp(ey, top[1], .5);
      X.beginPath(); X.moveTo(ex + es * .2, ey); X.quadraticCurveTo(qx, qy, top[0], top[1]); X.strokeStyle = 'rgba(232,237,247,.55)'; X.lineWidth = Math.max(5, R * .05); X.stroke();
      X.save(); X.globalAlpha = al('ala');
      X.beginPath(); X.moveTo(ex + es * .2, ey); X.quadraticCurveTo(qx, qy, lerp(ex, top[0], .62), lerp(ey, top[1], .62)); X.strokeStyle = hi('ala') ? '#fff' : C.alant; X.lineWidth = hi('ala') ? 3 : 2; X.stroke();
      X.restore();
      o.ala = qpt(ex + es * .2, ey, qx, qy, top[0], top[1], .45);
      if (o.hits) { const A = o.ala; o.hits.unshift({ k: 'ala', f: (x, y) => Math.hypot(x - A[0], y - A[1]) < Math.max(14, R * .12) }); }
    } else {
      // 2ª semana: disco embrionário com pedículo de conexão (alantoide brota dele)
      X.save(); X.globalAlpha = al('ala'); line(ex, ey - es * .2, ex + es * .2, acy - Ra - 4, C.alant, 2); X.restore();
      o.ala = [ex + es * .1, acy - Ra];
      if (o.hits) { const A = o.ala; o.hits.unshift({ k: 'ala', f: (x, y) => Math.hypot(x - A[0], y - A[1]) < 14 }); }
    }
    // pedículo vitelínico e vesícula
    X.save(); X.globalAlpha = al('vit');
    line(ex - es * .2, ey + es * .2, vx, vy, rgba(C.vitelo, .8), 2);
    circ(vx, vy, vr, C.vitelo, hi('vit') ? '#fff' : 'rgba(11,15,28,.55)', hi('vit') ? 2.5 : 1);
    X.restore();
    if (o.hits) o.hits.unshift({ k: 'vit', f: (x, y) => Math.hypot(x - vx, y - vy) < vr + 8 });
    if (w < 3.5) { rr(ex - es, ey - es * .18, es * 2, es * .36, es * .18, C.ecto); rr(ex - es, ey + es * .02, es * 2, es * .2, es * .1, C.endo); }
    else if (w < 8.5) embC(ex, ey, es, PELE, .5);
    else feto(ex, ey, es * .9, PELE);
    return { ex, ey, es, vx, vy, vr, acx, acy, Ra, ccx, ccy, Rc, top };
  }

  // =================================================================================
  // TÓPICO · #anexos/funcoes
  // =================================================================================
  {
    const isAve = S => S.modo !== 'hum';
    const dia = v => v / 100 * 21, sem = v => 2 + v / 100 * 10;
    let modoF = 'ave';
    const nomeCtl = () => (modoF === 'ave' ? 'Dia de incubação' : 'Semana');
    const fmt = v => (modoF === 'ave' ? `dia ${Math.round(dia(v))} de 21` : semK(Math.round(sem(v))));
    function trocaModo(S, m) {
      S.modo = m; modoF = m; S._lastF = null; S.hold = 0; S.v = m === 'ave' ? 48 : 40;
      const l = document.getElementById('ctlL'); if (l) l.textContent = nomeCtl();
      const r = rngEl(); if (r) { r.value = S.v; }
    }
    const KV = {
      vit: ['Vesícula vitelínica', '<b>nutrição</b> (vitelo). Peixes, répteis, aves e mamíferos. No ser humano: pequena e sem vitelo; forma as primeiras células do sangue e as células germinativas primordiais'],
      amn: ['Âmnio', '<b>proteção</b> contra dessecação e choques (líquido amniótico). Répteis, aves e mamíferos. No ser humano: a "bolsa d\'água", cerca de 1&nbsp;L no fim da gestação'],
      cor: ['Córion', 'envolve todos os outros; <b>trocas gasosas</b> (com a alantoide). Répteis, aves e mamíferos. No ser humano: vilosidades coriônicas, a parte fetal da placenta; produz hCG'],
      ala: ['Alantoide', 'guarda <b>excretas</b> (ácido úrico) e faz trocas gasosas. Répteis, aves e mamíferos. No ser humano: reduzida; seus vasos formam os vasos umbilicais']
    };
    function marcaKV(sel) {
      const kv = document.getElementById('kv'); if (!kv) return; const ch = kv.children, ks = ['vit', 'amn', 'cor', 'ala'];
      for (let i = 0; i < ch.length; i++) { const k = ks[i >> 1], on = sel === k; ch[i].style.background = on ? 'rgba(255,179,71,.14)' : ''; ch[i].style.fontWeight = on && !(i & 1) ? '700' : ''; }
    }
    const caps = {
      ave: d => d < 1.5 ? 'Dia 0 a 1: o embrião é um disco sobre a gema; a clara e a gema ainda estão inteiras'
        : d < 4.5 ? 'Dias 2 a 4: vasos sanguíneos saem do embrião e se espalham sobre a gema. É a <b>vesícula vitelínica</b> levando alimento'
          : d < 6 ? 'Dias 3 a 5: o <b>âmnio</b> se fecha, e o embrião passa a flutuar no líquido amniótico'
            : d < 11 ? 'Dias 4 a 10: a <b>alantoide</b> cresce como um balão até encostar no <b>córion</b>, sob a casca; O₂ entra e CO₂ sai pelos poros'
              : d < 19 ? 'A alantoide acumula <b>ácido úrico</b> (cristais brancos); a clara é consumida e a gema diminui'
                : 'Dias 19 a 21: o resto da gema entra no abdome do pintinho, a clara acabou e ele bica a casca',
      hum: w => w < 3.5 ? `${semC(Math.round(w))}: disco embrionário entre o <b>âmnio</b> e a <b>vesícula vitelínica</b>, tudo dentro do <b>córion</b>`
        : w < 8 ? `${semC(Math.round(w))}: o âmnio cresce; a vesícula vitelínica, sem vitelo, fica fora dele; a alantoide é um tubinho no pedículo`
          : `${semC(Math.round(w))}: o córion vira a parte fetal da <b>placenta</b>; o âmnio enche o córion e os vasos da alantoide viram os vasos umbilicais`
    };
    def('anexos', 'funcoes', {
      t: 'Os quatro anexos', s: 'vesícula vitelínica, âmnio, córion e alantoide', c: C.amnio, loc: 'Ovo de galinha em incubação, em corte', still: 3,
      ctl: { l: 'Dia de incubação', min: 0, max: 100, step: 1, v: 48, f: fmt, rate: () => 1 },
      extra: [
        { t: 'Ave', on: S => trocaModo(S, 'ave'), pressed: S => isAve(S) },
        { t: 'Humano', on: S => trocaModo(S, 'hum'), pressed: S => !isAve(S) }
      ],
      init(S) { S.modo = S.modo || 'ave'; modoF = S.modo; },
      alt: 'Corte de um ovo de galinha em incubação com casca, câmara de ar, clara, gema e embrião; com os dias aparecem a vesícula vitelínica com vasos sobre a gema, o âmnio em volta do embrião, a alantoide crescendo sob a casca e o córion por fora. O botão Humano mostra o mesmo esquema no útero. Tocar em um anexo destaca só ele',
      d: `<p>Os <b>anexos embrionários</b> são bolsas e membranas que o próprio embrião forma, mas que ficam <b>fora do corpo</b> dele e são descartadas no nascimento ou na eclosão. São quatro. A <b>vesícula vitelínica</b> guarda o <b>vitelo</b> e o leva ao embrião por vasos sanguíneos: é a <b>nutrição</b>. Ela existe em <b>peixes, répteis, aves e mamíferos</b>; no ovo de galinha é enorme (a gema), e nos mamíferos placentários é pequena e quase sem vitelo, mas é nela que surgem as <b>primeiras células do sangue</b> (da 3ª à 6ª semana após a fecundação, ou da 5ª à 8ª pela DUM) e as <b>células germinativas primordiais</b>, que darão os gametas. O <b>âmnio</b> forma uma bolsa fechada cheia de <b>líquido amniótico</b> em volta do embrião: protege contra <b>desidratação</b> e <b>choques</b>, mantém a temperatura e deixa o embrião se mexer. No ser humano é a "bolsa d'água", com cerca de <b>1 litro</b> de líquido perto do fim da gestação.</p>
<p>O <b>córion</b> é o anexo <b>mais externo</b> e envolve todos os outros. Nos <b>répteis e aves</b> fica sob a casca e se junta à <b>alantoide</b>, formando a <b>membrana corioalantoide</b>, cheia de vasos, que faz as <b>trocas gasosas</b> pelos poros da casca. A alantoide, uma bolsa que brota do intestino, também <b>guarda as excretas</b> (o <b>ácido úrico</b>, pouco tóxico e quase insolúvel) e retira cálcio da casca para o esqueleto do pintinho. Nos <b>mamíferos placentários</b>, o córion forma as <b>vilosidades coriônicas</b>, a parte do embrião na placenta, e produz o <b>hCG</b>; a alantoide fica pequena, mas os vasos dela viram os <b>vasos do cordão umbilical</b> (ver <a href="#humano/placenta">Placenta e cordão umbilical</a>). Âmnio, córion e alantoide existem só em <b>répteis, aves e mamíferos</b> (ver <a href="#anexos/amniotico">O ovo amniótico</a>).</p>
<p>Use os botões <b>Ave</b> e <b>Humano</b> para trocar o esquema e a faixa para passar os dias (ave, 0 a 21) ou as semanas (humano, 2 a 12). Toque em um anexo, no desenho ou na lista, para destacar só ele. A incubação da galinha dura <b>21 dias</b>; a gema é o próprio ovócito, uma célula gigante; a clara não faz parte da célula (é água e proteínas secretadas pelo oviduto); a casca de carbonato de cálcio tem milhares de poros.</p>`,
      kv: [KV.vit, KV.amn, KV.cor, KV.ala],
      enem: 'Associe cada anexo a uma palavra: vesícula vitelínica, <b>nutrição</b>; âmnio, <b>proteção</b> (contra dessecação e choques); córion, <b>trocas gasosas</b> e <b>placenta</b>; alantoide, <b>excretas</b> (ácido úrico) e <b>respiração</b>. Duas pegadinhas: o <b>mamífero tem vesícula vitelínica</b>, mesmo quase sem vitelo; e no ovo fechado a excreta guardada é <b>ácido úrico</b>, não ureia nem amônia. A <b>biópsia de vilo corial</b> colhe células do córion, que são do embrião, para fazer o cariótipo do bebê.',
      links: [['O ovo amniótico', '#anexos/amniotico'], ['Placenta e cordão', '#humano/placenta'], ['Tipos de ovo', '#ovos/tipos']],
      drag(x, y, S) {
        if (!toque(S, x, y)) return null;
        for (const p of S.pills || []) if (inR(p.r, x, y)) { S.sel = S.sel === p.k ? null : p.k; return null; }
        for (const h of S.hits || []) if (h.f(x, y)) { S.sel = S.sel === h.k ? null : h.k; return null; }
        S.sel = null; return null;
      },
      draw(t, S) {
        const A = area(), o = this; modoF = S.modo || 'ave';
        auto(o, S, S.modo === 'hum' ? 7 : 6.5, 100, 3);
        const lw = NAR ? 0 : Math.min(230, A.w * .27);
        // lista de anexos (também é botão de destaque)
        S.pills = []; let py = A.y0 + 4;
        const cols = NAR ? 2 : 1;
        ANX.forEach((a, i) => {
          let x, y;
          if (NAR) { x = A.x0 + (i % 2) * (A.w / 2); y = A.y0 + 28 + Math.floor(i / 2) * 36; } else { x = A.x0; y = py + i * 40; }
          const r = pill(x, y, a.n, a.c(), S.sel === a.k, { dim: S.sel && S.sel !== a.k }); S.pills.push({ k: a.k, r });
        });
        if (!NAR) tx(S.sel ? 'toque de novo para ver todos' : 'toque em um anexo para destacar', A.x0, A.y0 + 4 + 4 * 40 + 8, { a: 'left', s: 12, c: C.dim, bg: false });
        const bx0 = A.x0 + lw, bw = A.w - lw, bcx = bx0 + bw / 2;
        const top = A.y0 + (NAR ? 102 : 34), bot = A.y1 - 6, bh = bot - top, bcy = top + bh / 2;
        if (S._locM !== S.modo) { S._locM = S.modo; const ov = document.getElementById('ondeV'); if (ov) ov.textContent = S.modo === 'hum' ? 'Útero humano, em corte' : o.loc; }
        S.hits = [];
        let G, cp, rot;
        if (S.modo !== 'hum') {
          const d = dia(S.v), ry = Math.min(bh * .46, bw * (NAR ? .35 : .32)), rx = ry * 1.33;
          head(`Dia ${Math.round(d)} de incubação`, NAR ? A.x0 : bx0 + 4, A.y0 + 12, C.txt, 'left');
          const oo = { sel: S.sel, hits: S.hits };
          G = ovoAve(bcx, bcy, rx, ry, d, t, oo);
          rot = [
            ['vit', G.yx + G.yr * .5, G.yy + G.yr * .55, G.yx + G.yr + 30, G.yy + G.yr * .7, 'vesícula vitelínica (gema)', G.yr > 2],
            ['amn', G.ex - G.ar * .7, G.ey - G.ar * .7, G.ex - G.ar - 40, G.ey - G.ar - 20, 'âmnio', d >= 3],
            ['cor', G.cx + G.rx * .62, G.cy + G.ry * .62, G.cx + G.rx + 20, G.cy + G.ry * .7, 'córion', d >= 2],
            ['ala', oo.ala && oo.ala[0], oo.ala && oo.ala[1], G.cx + G.rx * .5, G.cy - G.ry - 18, 'alantoide', d >= 5]
          ];
          if (!S.sel) { lab(G.cx - G.rx * .9, G.cy, G.cx - G.rx - 24, G.cy + G.ry * .5, 'câmara de ar'); }
          cp = caps.ave(d);
        } else {
          const w = sem(S.v), R = Math.min(bh * .47, bw * (NAR ? .42 : .4));
          head(semC(Math.round(w)), NAR ? A.x0 : bx0 + 4, A.y0 + 12, C.txt, 'left');
          const oo = { sel: S.sel, hits: S.hits };
          G = uteroHum(bcx, bcy, R, w, t, oo);
          rot = [
            ['vit', G.vx, G.vy, G.vx - G.vr - 40, G.vy + 30, 'vesícula vitelínica', true],
            ['amn', G.acx + G.Ra * .7, G.acy + G.Ra * .7, G.acx + G.Ra + 40, G.acy + G.Ra, 'âmnio', true],
            ['cor', G.ccx + G.Rc * .97, G.ccy - G.Rc * .25, G.ccx + G.Rc + 30, G.ccy - G.Rc * .3, w >= 8 ? 'córion (placenta)' : 'córion', true],
            ['ala', oo.ala[0], oo.ala[1], oo.ala[0] - 50, oo.ala[1] - 30, 'alantoide', true]
          ];
          S._endo = [bcx - R * 1.05, bcy + R * .3, bcx - R * 1.2 - 20, bcy + R * .75];
          cp = caps.hum(w);
        }
        for (const r of rot) if (r[6] && r[1] != null && (!S.sel || S.sel === r[0])) lab(r[1], r[2], r[3], r[4], r[5]);
        if (S.modo === 'hum' && !S.sel && !NAR && S._endo) lab(...S._endo, 'endométrio');
        if (S._selK !== S.sel) { S._selK = S.sel; marcaKV(S.sel); }
        cap(S.sel ? `<b>${KV[S.sel][0]}</b>: ${KV[S.sel][1].split('. ')[0]}` : cp);
      }
    });
    // destaque também pela lista do painel (teclado): clicar numa linha da tabela kv
    document.addEventListener('click', e => {
      const kv = document.getElementById('kv'); if (!kv || !curS || location.hash !== '#anexos/funcoes') return;
      const el = e.target.closest && e.target.closest('#kv > div'); if (!el) return;
      const i = [...kv.children].indexOf(el); const k = ['vit', 'amn', 'cor', 'ala'][i >> 1]; if (k) curS.sel = curS.sel === k ? null : k;
    });
  }

  // =================================================================================
  // TÓPICO · #anexos/amniotico
  // =================================================================================
  {
    const GR = [
      { n: 'Peixe', l: 'Peixes', tem: [1, 0, 0, 0, 0], agua: true },
      { n: 'Anfíbio', l: 'Anfíbios', tem: [0, 0, 0, 0, 0], agua: true },
      { n: 'Réptil e ave', l: 'Répteis e aves', tem: [1, 1, 1, 1, 0], agua: false },
      { n: 'Mamífero', l: 'Mamíferos placentários', tem: [1, 1, 1, 1, 1], agua: false }
    ];
    const NOMES = ['vesícula vitelínica', 'âmnio', 'córion', 'alantoide', 'placenta'];
    const CORES = () => [C.vitelo, C.amnio, C.corion, C.alant, C.sangue];
    const gi = v => Math.min(3, Math.max(0, Math.floor(v + 1e-6)));
    function peixe(x, y, r, t) {
      circ(x, y, r, rgba(C.clara, .12), rgba(C.clara, .6), 1.5);
      circ(x + r * .1, y + r * .25, r * .5, C.vitelo, 'rgba(11,15,28,.5)', 1);
      X.save(); X.beginPath(); X.arc(x + r * .1, y + r * .25, r * .5, 0, TAU); X.clip(); vasos(x + r * .1, y - r * .2, r * .9, 1, C.sangueF, 3, 7); X.restore();
      embC(x + r * .05, y - r * .3, r * .32, PELE, 1.3);
    }
    function anfibio(x, y, r, seca) {
      const k = 1 - seca * .45;
      circ(x, y, r * k, rgba(C.agua, .14 * (1 - seca) + .04), rgba(C.clara, .5), 1.5);
      const er = r * .52 * (1 - seca * .3);
      circ(x, y, er, seca > .5 ? '#6B5A4A' : '#3A3550', 'rgba(11,15,28,.5)', 1);
      X.save(); X.beginPath(); X.arc(x, y, er, 0, TAU); X.clip();
      const R = rng(9); for (let i = 0; i < 26; i++) { const a = R() * TAU, d = Math.sqrt(R()) * er; const py = y + Math.sin(a) * d; circ(x + Math.cos(a) * d, py, er * .12, py > y ? rgba(C.vitelo, .8) : 'rgba(201,207,220,.5)'); }
      X.restore();
    }
    function mamifero(x, y, r, t) { uteroHum(x, y, r * .9, 9, t, { mini: true }); }
    def('anexos', 'amniotico', {
      t: 'O ovo amniótico', s: 'como os vertebrados saíram da água', c: C.casca, loc: 'Ovos de vertebrados, em corte', still: 2.5,
      ctl: { l: 'Grupo', min: 0, max: 3, step: 1, v: 0, f: v => GR[gi(v)].l, rate: () => 1 },
      alt: 'Quatro ovos em corte lado a lado: peixe, anfíbio, réptil e ave, mamífero no útero. Cada um mostra só os anexos que o grupo tem. Sob o sol, o ovo de anfíbio murcha e o de réptil fica inteiro. Abaixo, uma linha do tempo de 400 a 300 milhões de anos',
      d: `<p>Os anfíbios ainda dependem da água para se reproduzir: o ovo não tem casca nem âmnio e seca em poucas horas fora d'água, e por isso a maioria dos sapos e rãs volta à lagoa para desovar, e o girino vive na água. Há cerca de <b>310 a 320 milhões de anos</b>, no período Carbonífero, os ancestrais dos répteis passaram a pôr um ovo novo, o <b>ovo amniótico</b>: com <b>casca</b> porosa e resistente, <b>âmnio</b> com líquido, <b>córion</b> e <b>alantoide</b> para respirar e guardar excretas, e <b>vesícula vitelínica</b> grande com alimento. Esse ovo é como um "lago portátil": o embrião se desenvolve em terra firme, sem fase larval na água.</p>
<p>O ovo amniótico veio junto com a <b>fecundação interna</b> (o espermatozoide precisa chegar ao ovócito antes da casca ser feita), com a pele impermeável e com a excreção de ácido úrico. Os <b>répteis e aves</b> mantêm o ovo com casca; os <b>mamíferos placentários</b> perderam a casca e o vitelo, mas guardaram os mesmos anexos, que no útero formam a placenta e o cordão. É por isso que répteis, aves e mamíferos formam o grupo dos <b>amniotas</b>, e peixes e anfíbios, o dos <b>anamniotas</b>. A função de cada anexo está em <a href="#anexos/funcoes">Os quatro anexos</a>.</p>
<div class="tab"><table><thead><tr><th>Grupo</th><th>Vesícula vitelínica</th><th>Âmnio</th><th>Córion</th><th>Alantoide</th><th>Placenta</th></tr></thead><tbody>
<tr><td>Peixes</td><td>sim</td><td>não</td><td>não</td><td>não</td><td>não*</td></tr>
<tr><td>Anfíbios</td><td>não**</td><td>não</td><td>não</td><td>não</td><td>não</td></tr>
<tr><td>Répteis e aves</td><td>sim, grande</td><td>sim</td><td>sim</td><td>sim, grande</td><td>não</td></tr>
<tr><td>Mamíferos placentários</td><td>sim, pequena e sem vitelo</td><td>sim</td><td>sim</td><td>sim, reduzida</td><td>sim</td></tr>
</tbody></table></div>
<p><small>* Alguns tubarões vivíparos têm uma "placenta" formada pela vesícula vitelínica; é exceção.<br>** Nos anfíbios o vitelo fica <b>dentro das células</b> do polo vegetativo e do endoderma, e não forma uma bolsa separada. Alguns livros dizem que "peixes e anfíbios têm só vesícula vitelínica"; o padrão dos livros do ensino médio mais usados, e das bancas, é o da tabela: anfíbios sem anexos. Se uma questão disser o contrário, ela segue o outro livro, não um erro de biologia.</small></p>`,
      kv: [['Amniotas', 'répteis, aves e mamíferos'], ['Anamniotas', 'peixes e anfíbios'], ['Primeiro ovo amniótico', 'cerca de 312 milhões de anos (<i>Hylonomus</i>)'], ['Veio junto com', 'fecundação interna, pele impermeável, ácido úrico']],
      enem: 'É um dos temas que mais caem em embriologia, quase sempre ligado à evolução: o <b>ovo amniótico</b> (casca + âmnio + córion + alantoide) e a <b>fecundação interna</b> libertaram répteis, aves e mamíferos da água para se reproduzir. Os <b>anfíbios</b> continuam dependentes da água porque o ovo deles não tem âmnio nem casca. Se a pergunta for "qual anexo protege contra a dessecação?", a resposta é o <b>âmnio</b>.',
      links: [['Os quatro anexos', '#anexos/funcoes'], ['Tipos de ovo', '#ovos/tipos']],
      drag(x, y, S) { if (!toque(S, x, y)) return null; const i = (S.boxes || []).findIndex(b => inR(b, x, y)); if (i >= 0) { S.user = true; S.v = i; return i; } return null; },
      draw(t, S) {
        const A = area(), o = this; auto(o, S, .3, 3.999, 2.5);
        const g = gi(S.v), sol = .5 - .5 * Math.cos(t * 1.1);
        // linha do tempo embaixo
        const tlH = NAR ? 40 : 58, tl = { x0: A.x0 + (NAR ? 8 : 40), x1: A.x1 - (NAR ? 8 : 40), y: A.y1 - tlH + 24 };
        // tabela de chips do grupo atual
        const chipY = tl.y - (NAR ? 90 : 56);
        // ovos
        const n = 4, colW = A.w / (NAR ? 2 : 4), rows = NAR ? 2 : 1, top = A.y0 + 34, bot = chipY - 30;
        const rowH = (bot - top) / rows, r = Math.min(colW * .32, rowH * .32);
        // sol
        const sx = NAR ? A.x1 - 26 : A.x0 + colW * 2, sy = A.y0 + 14;
        circ(sx, sy, 11, '#FFD36B'); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + t * .2; line(sx + Math.cos(a) * 15, sy + Math.sin(a) * 15, sx + Math.cos(a) * 20, sy + Math.sin(a) * 20, '#FFD36B', 2); }
        head(GR[g].l, A.x0, A.y0 + 12, C.txt, 'left');
        S.boxes = [];
        for (let i = 0; i < n; i++) {
          const cx = A.x0 + colW * ((NAR ? i % 2 : i) + .5), cy = top + rowH * ((NAR ? Math.floor(i / 2) : 0) + .45), on = i === g;
          S.boxes.push([cx - colW / 2 + 2, cy - rowH * .45, colW - 4, rowH]);
          rr(cx - colW / 2 + 4, cy - rowH * .45 + 2, colW - 8, rowH - 4, 10, on ? 'rgba(27,36,64,.6)' : 'rgba(19,26,43,.3)', on ? '#FFB347' : 'rgba(91,108,153,.35)', on ? 2 : 1);
          X.save(); X.globalAlpha = on ? 1 : .55;
          if (i === 0) peixe(cx, cy, r, t);
          else if (i === 1) anfibio(cx, cy, r, sol);
          else if (i === 2) ovoAve(cx, cy, r * 1.25, r * .94, 12, t, { mini: true });
          else mamifero(cx, cy, r, t);
          X.restore();
          tx(GR[i].n, cx, cy + rowH * .55 - 14, { s: 13, w: 600, c: on ? C.txt : C.dim });
        }
        // estado do ovo de anfíbio sob o sol
        // chips de anexos do grupo
        const cs = CORES(), tem = GR[g].tem;
        X.font = `600 12px ${FT}`; const ws = NOMES.map(s => X.measureText(s).width + 30), tot = ws.reduce((a, b) => a + b, 0) + 8 * 4;
        let cx = NAR ? A.x0 : A.cx - tot / 2, cy = chipY;
        NOMES.forEach((s, i) => {
          if (NAR && cx + ws[i] > A.x1) { cx = A.x0; cy += 32; }
          rr(cx, cy, ws[i], 26, 999, tem[i] ? 'rgba(27,36,64,.9)' : 'rgba(11,15,28,.5)', tem[i] ? cs[i] : 'rgba(91,108,153,.4)', tem[i] ? 2 : 1);
          if (tem[i]) circ(cx + 13, cy + 13, 5, cs[i]); else line(cx + 9, cy + 13, cx + 17, cy + 13, C.dim, 2);
          X.fillStyle = tem[i] ? C.txt : C.dim; X.textAlign = 'left'; X.textBaseline = 'middle'; X.fillText(s, cx + 24, cy + 13.5); cx += ws[i] + 8;
        });
        // linha do tempo 400 a 300 milhões de anos
        const fx = m => lerp(tl.x0, tl.x1, (400 - m) / 100);
        line(tl.x0, tl.y, tl.x1, tl.y, C.line, 2);
        for (const m of [400, 375, 350, 325, 300]) { line(fx(m), tl.y - 4, fx(m), tl.y + 4, C.line, 1.5); if (!NAR || m % 50 === 0) tx(m + (m === 300 ? ' Ma' : ''), fx(m), tl.y + 15, { s: 12, f: FD, c: C.dim, bg: false }); }
        marker(fx(370), tl.y, C.agua); marker(fx(312), tl.y, C.casca);
        if (NAR) { tx('saída da água (~370 Ma)', A.x0, tl.y - 16, { s: 12, c: C.txt, a: 'left' }); tx('1º ovo amniótico (~312 Ma)', A.x1, tl.y - 16, { s: 12, c: C.txt, a: 'right' }); }
        else { tx('vertebrados saem da água (anfíbios, ~370 Ma)', fx(370) - 8, tl.y - 16, { s: 12, c: C.txt, a: 'left' }); tx('primeiro ovo amniótico (~312 Ma, Hylonomus)', fx(312), tl.y + 33, { s: 12, c: C.txt }); }
        cap(`<b>${GR[g].l}</b>: depende da água para se reproduzir: <b>${GR[g].agua ? 'sim' : 'não'}</b>${NAR ? '' : '. ' + (g === 1 ? 'Sob o sol, o ovo sem casca e sem âmnio murcha' : g === 0 ? 'Só a vesícula vitelínica; o ovo é posto na água' : g === 2 ? 'Um "lago portátil" em terra firme' : 'Sem casca, mas com os mesmos anexos')}`);
      }
    });
  }

  // =================================================================================
  // MAPA: sistema genital feminino em corte frontal (fecundação e nidação)
  // =================================================================================
  function mapa(x, y, w, h, o = {}) {
    const P = (u, v) => [x + w / 2 + u * w / 2, y + v * h];
    const lw = Math.max(5, w * .035);
    // tubas uterinas (direita e esquerda)
    const tubaD = [P(.27, .34), P(.45, .27), P(.62, .2), P(.76, .17), P(.86, .22)], tubaE = tubaD.map(([a, b]) => [2 * (x + w / 2) - a, b]);
    for (const tb of [tubaD, tubaE]) {
      poly(tb, rgba(C.mae, .9), lw); poly(tb.slice(2), rgba(C.mae, .9), lw * 1.7); poly(tb, '#2A1B26', lw * .35);
      const f = tb[4], sgn = f[0] > x + w / 2 ? 1 : -1;
      for (let i = 0; i < 5; i++) { const a = (sgn > 0 ? .1 : PI - .1) + sgn * (i - 2) * .32; line(f[0], f[1], f[0] + Math.cos(a + sgn * .9) * lw * 1.6, f[1] + Math.sin(a + sgn * .9) * lw * 1.6, rgba(C.mae, .9), 2.2); }
    }
    // ovários
    for (const s of [1, -1]) {
      const [ox, oy] = P(s * .76, .42); ell(ox, oy, w * .085, h * .07, s * .3, '#D7A3B2', 'rgba(11,15,28,.5)', 1.2);
      if (o.lut != null && s === 1) { const k = o.lut; circ(ox + w * .02, oy, Math.max(2, w * .03 * k), rgba('#F5D547', .3 + .6 * k), 'rgba(11,15,28,.4)', 1); }
      else { circ(ox - s * w * .02, oy - h * .01, w * .016, 'rgba(255,255,255,.55)'); }
    }
    // útero
    X.beginPath(); const a = P(-.3, .33), b = P(.3, .33), c = P(.13, .82), d = P(-.13, .82);
    X.moveTo(a[0], a[1]); X.quadraticCurveTo(x + w / 2, y + h * .18, b[0], b[1]); X.quadraticCurveTo(x + w / 2 + w * .3, y + h * .62, c[0], c[1]);
    X.lineTo(...P(.08, .98)); X.lineTo(...P(-.08, .98)); X.lineTo(d[0], d[1]); X.quadraticCurveTo(x + w / 2 - w * .3, y + h * .62, a[0], a[1]); X.closePath();
    X.fillStyle = rgba(C.mae, .55); X.fill(); X.strokeStyle = rgba(C.mae, 1); X.lineWidth = 2; X.stroke();
    // cavidade com endométrio
    const th = o.endo == null ? 1 : o.endo;
    X.beginPath(); X.moveTo(...P(-.2, .38)); X.quadraticCurveTo(x + w / 2, y + h * .33, ...P(.2, .38)); X.lineTo(...P(.03, .8)); X.lineTo(...P(-.03, .8)); X.closePath();
    X.fillStyle = '#2A1B26'; X.fill(); X.strokeStyle = rgba('#E58BA5', .4 + .5 * th); X.lineWidth = 2 + 5 * th; X.stroke();
    return { P, tubaD, ampola: P(.76, .17), corno: P(.25, .37), colo: P(0, .97), implante: P(.07, .4), istmo: P(.5, .26) };
  }

  // ovócito com zona pelúcida e corona radiata
  function ovocito(x, y, r, o = {}) {
    const R = rng(21);
    if (o.corona !== 0) for (let i = 0; i < 26; i++) { const a = i / 26 * TAU + R() * .2, d = r * (1.42 + R() * .14); X.save(); X.globalAlpha = o.corona == null ? 1 : o.corona; cell(x + Math.cos(a) * d, y + Math.sin(a) * d, r * .14, '#D9B48C'); X.restore(); }
    circ(x, y, r * 1.22, o.dura ? rgba('#B9C6FF', .55) : rgba(C.clara, .22), o.dura ? '#DDE4FF' : rgba(C.clara, .6), o.dura ? 2.5 : 1.5);
    const g = X.createRadialGradient(x - r * .3, y - r * .3, r * .1, x, y, r); g.addColorStop(0, light(C.ovo, .25)); g.addColorStop(1, dark(C.ovo, .2));
    circ(x, y, r, g, 'rgba(11,15,28,.6)', 1.5);
  }
  // espermatozoide: cabeça oval com acrossomo, peça intermediária e cauda ondulando
  function esperm(x, y, ang, s, t, o = {}) {
    X.save(); X.translate(x, y); X.rotate(ang);
    X.beginPath(); for (let i = 0; i <= 16; i++) { const u = i / 16, px = -s * .5 - u * s * 3, py = Math.sin(u * 9 - t * 14) * s * .25 * u; i ? X.lineTo(px, py) : X.moveTo(px, py); }
    X.strokeStyle = C.esperma; X.lineWidth = Math.max(1.2, s * .12); X.stroke();
    ell(0, 0, s * .55, s * .36, 0, C.esperma, 'rgba(11,15,28,.55)', 1);
    if (o.acro !== false) { X.beginPath(); X.ellipse(s * .12, 0, s * .4, s * .3, 0, -PI / 2, PI / 2); X.fillStyle = rgba('#7FD1A8', .9); X.fill(); }
    X.restore();
    if (o.l) tx(o.l, x, y - s * 1.6, { s: 12, w: 700, c: C.txt });
  }

  // =================================================================================
  // TÓPICO · #humano/fecundacao
  // =================================================================================
  {
    const CONT = [[0, '≈ 300 milhões'], [1.2, '≈ 30 milhões'], [2.4, '≈ 1 milhão'], [3.6, '≈ 10 mil'], [4.8, '≈ 1.000'], [6, '≈ 200']];
    const contagem = h => { let s = CONT[0][1]; for (const c of CONT) if (h >= c[0]) s = c[1]; return s; };
    const fase = h => h < 6 ? 0 : h < 8 ? 1 : h < 10 ? 2 : h < 14 ? 3 : h < 21 ? 4 : 5;
    const FN = ['subida pela tuba e capacitação', 'reação acrossômica', 'bloqueio da polispermia', 'fim da meiose II', 'pronúcleos se aproximam', 'zigoto'];
    def('humano', 'fecundacao', {
      t: 'Fecundação', s: 'o encontro, na tuba uterina', c: C.esperma, loc: 'Tuba uterina, na ampola', still: 4,
      ctl: { l: 'Tempo', min: 0, max: 24, step: .5, v: 0, f: v => `${nbr(Math.round(v * 2) / 2, v % 1 ? 1 : 0)} h` + (NAR ? '' : `: ${FN[fase(v)]}`), rate: () => 1 },
      extra: [{ t: 'Sortear espermatozoide', on: S => { S.cromo = Math.random() < .5 ? 'X' : 'Y'; }, pressed: () => false }],
      init(S) { if (!S.cromo) S.cromo = Math.random() < .5 ? 'X' : 'Y'; },
      alt: 'À esquerda, o mapa do útero, das tubas e dos ovários com espermatozoides subindo até a ampola, e um contador que cai de 300 milhões para cerca de 200. À direita, o ovócito com a zona pelúcida e a corona radiata: um espermatozoide atravessa, a zona endurece e barra os outros, sai o segundo corpúsculo polar e os pronúcleos se fundem no zigoto',
      d: `<p>A <b>fecundação</b> acontece na <b>tuba uterina</b>, em geral na <b>ampola</b>, a parte mais larga, perto do ovário, e não no útero. Numa ejaculação há de <b>200 a 600 milhões</b> de espermatozoides, mas só cerca de <b>200</b> chegam à ampola. No caminho eles passam pela <b>capacitação</b>: perdem moléculas da superfície e ficam aptos a fecundar, o que leva cerca de 7 horas. O ovócito secundário resiste só <b>cerca de 24 horas</b> depois da ovulação; os espermatozoides, em geral 2 a 3 dias, alguns até cerca de 5 dias. Por isso a gravidez depende de relações nos dias perto da ovulação.</p>
<p>Ao tocar o ovócito, o espermatozoide atravessa a <b>corona radiata</b> e a <b>zona pelúcida</b> com as enzimas do <b>acrossomo</b> (a <b>reação acrossômica</b>). Quando a membrana dos dois se funde, a zona pelúcida muda e <b>bloqueia a entrada de outros espermatozoides</b> (bloqueio da polispermia). Só então o ovócito <b>termina a meiose II</b> e solta o segundo corpúsculo polar. Os dois núcleos haploides (os pronúcleos) se aproximam, os cromossomos se juntam, e surge o <b>zigoto</b>, com 46 cromossomos. O sexo genético já está definido nesse momento: depende de o espermatozoide trazer um cromossomo <b>X</b> (46,XX, sexo genético feminino) ou <b>Y</b> (46,XY, sexo genético masculino). Depois, o zigoto começa a <a href="#desenvolvimento/segmentacao">segmentação</a> enquanto desce até o útero (ver <a href="#humano/nidacao">Nidação e hCG</a>).</p>
<p>A faixa mostra o tempo de forma esquemática, em horas, e o botão <b>Sortear espermatozoide</b> troca o cromossomo sexual de quem fecunda.</p>`,
      kv: [['Onde', 'ampola da tuba uterina'], ['Espermatozoides', '200 a 600 milhões na ejaculação; ≈ 200 chegam à ampola'], ['Capacitação', 'cerca de 7 horas'], ['Ovócito vive', 'cerca de 24 horas após a ovulação'], ['Espermatozoide vive', '2 a 3 dias (até ≈ 5)'], ['Zigoto', '2n = 46; sexo genético já definido']],
      enem: 'Três fatos que caem: a fecundação ocorre na <b>tuba uterina</b>, não no útero; quem define o sexo genético é o <b>espermatozoide</b> (X ou Y), porque todo ovócito leva X; e a <b>meiose II do ovócito só termina depois que o espermatozoide entra</b>. Questões sobre <b>laqueadura</b> e <b>vasectomia</b> usam isso: cortar as tubas impede o encontro dos gametas; cortar os ductos deferentes impede a saída dos espermatozoides.',
      links: [['Nidação e hCG', '#humano/nidacao'], ['Segmentação', '#desenvolvimento/segmentacao'], ['Gametas', '#gametas/resumo'], LK.ovog],
      draw(t, S) {
        const A = area(), o = this; auto(o, S, 1.4, 24, 3);
        const h = S.v, F = fase(h);
        // layout: mapa à esquerda (em cima no celular), zoom à direita (embaixo)
        let M, Z;
        if (NAR) { const mh = A.h * .36; M = { x: A.x0 + A.w * .12, y: A.y0 + 44, w: A.w * .76, h: mh - 22 }; Z = { cx: A.cx, cy: A.y0 + 22 + mh + (A.h - mh - 22) / 2 + 4, r: Math.min(A.w * .2, (A.h - mh - 22) * .27) }; }
        else { M = { x: A.x0, y: A.y0 + 24, w: A.w * .42, h: A.h - 30 }; Z = { cx: A.x0 + A.w * .72, cy: A.cy + 6, r: Math.min(A.w * .13, A.h * .25) }; }
        const m = mapa(M.x, M.y, M.w, M.h);
        // espermatozoides subindo: colo, útero, tuba direita até a ampola
        const path = [m.colo, m.P(0, .6), m.corno, ...m.tubaD.slice(1, 4)];
        const nEsp = Math.round(lerp(26, 4, seg(h, 0, 6)));
        for (let i = 0; i < nEsp; i++) {
          const f = cl(seg(h, 0, 6) * .85 + (i / 26) * .25 + fr(t * .08 + i * .37) * .06, 0, 1), p = pth(path, f), q = pth(path, Math.min(1, f + .02));
          circ(p[0] + Math.sin(i * 7) * 3, p[1] + Math.cos(i * 5) * 3, 2.2, C.esperma);
          void q;
        }
        const amp = m.ampola; circ(amp[0], amp[1], 5, C.ovo, '#fff', 1.5);
        head(contagem(h), NAR ? A.x0 : M.x + 4, NAR ? A.y0 + 12 : M.y - 6, C.txt, 'left');
        tx('espermatozoides no caminho', NAR ? A.x0 + tw(contagem(h), 14, 600, FH) + 10 : M.x + 4, NAR ? A.y0 + 12 : M.y + 13, { a: 'left', s: 12, c: C.dim, bg: false });
        lab(amp[0], amp[1], amp[0] - 10, amp[1] + (NAR ? 34 : -36), 'ampola');
        if (!NAR) { lab(m.P(.76, .42)[0], m.P(.76, .42)[1] + 6, m.P(.76, .42)[0] + 10, m.P(.76, .42)[1] + 46, 'ovário'); lab(m.P(0, .55)[0], m.P(0, .55)[1], m.P(0, .55)[0] + M.w * .18, m.P(0, .7)[1], 'útero'); lab(m.istmo[0], m.istmo[1], m.istmo[0] - 6, m.istmo[1] - 44, 'tuba uterina'); }
        // linha de zoom
        if (!NAR) line(amp[0] + 8, amp[1], Z.cx - Z.r * 1.8, Z.cy - Z.r, 'rgba(255,255,255,.25)', 1, [4, 4]);
        // zoom: ovócito
        const r = Z.r, x = Z.cx, y = Z.cy;
        ovocito(x, y, r, { dura: F >= 2, corona: 1 - seg(h, 8, 20) * .7 });
        // espermatozoides em volta
        const sz = Math.max(5, r * .13);
        for (let i = 0; i < 7; i++) {
          const a = -PI * .9 + i * .42 + (i > 3 ? .6 : 0), cheg = seg(h, 3 + i * .3, 7 + i * .2);
          const bate = F >= 2 ? Math.abs(Math.sin(t * 3 + i)) * r * .06 : 0;
          const d = lerp(r * 2.1, r * 1.3 + sz * .6 + bate, cheg);
          if (i === 3 || cheg <= 0) continue;
          X.save(); X.globalAlpha = seg(cheg, 0, .25); esperm(x + Math.cos(a) * d, y + Math.sin(a) * d, a + PI, sz, t + i, { acro: true }); X.restore();
        }
        // vencedor
        const aw = -PI * .9 + 3 * .42, pen = seg(h, 6, 8.5);
        if (h >= 2.5 && h < 9.5) {
          const d = lerp(r * 2.1, r * 1.0, seg(h, 2.5, 6) * .5 + pen * .5);
          if (F === 1 || (h > 5.5 && h < 8.5)) { X.save(); X.globalAlpha = .5 * Math.sin(seg(h, 5.5, 8.5) * PI); circ(x + Math.cos(aw) * d, y + Math.sin(aw) * d, sz * 1.8, '#7FD1A8'); X.restore(); }
          esperm(x + Math.cos(aw) * d, y + Math.sin(aw) * d, aw + PI, sz * 1.05, t, { acro: h < 6.5, l: S.cromo });
        }
        // 2º corpúsculo polar
        if (h >= 10) { const k = seg(h, 10, 13), pa = -PI * .2; circ(x + Math.cos(pa) * r * lerp(.8, 1.1, k), y + Math.sin(pa) * r * lerp(.8, 1.1, k), r * .17 * k + .5, C.polar, 'rgba(11,15,28,.5)', 1); }
        // pronúcleos
        if (h >= 9) {
          const k = ss(seg(h, 14, 21)), pr = r * .2;
          const fem = [lerp(x + r * .45, x + pr * .5, k), lerp(y - r * .2, y, k)], mas = [lerp(x + Math.cos(aw) * r * .55, x - pr * .5, k), lerp(y + Math.sin(aw) * r * .55, y, k)];
          if (h < 21.5) { circ(fem[0], fem[1], pr, rgba(C.nucleo, .55), C.nucleo, 1.5); circ(mas[0], mas[1], pr, rgba(C.esperma, .45), C.esperma, 1.5); }
          else { circ(x, y, pr * 1.35, rgba(C.nucleo, .7), C.nucleo, 2); }
          if (h >= 12 && h < 21.5 && !NAR) { lab(fem[0], fem[1], x + r * 1.7, y - r * .9, 'pronúcleo do ovócito (n)'); lab(mas[0], mas[1], x - r * 1.9, y + r * 1.1, 'pronúcleo do espermatozoide (n)'); }
        }
        if (F <= 1 && !NAR) { lab(x + r * .9, y - r * .9, x + r * 1.7, y - r * 1.5, 'zona pelúcida'); lab(x + r * 1.45, y + r * .5, x + r * 1.9, y + r * .9, 'corona radiata'); }
        if (F === 2) lab(x + r * .9, y - r * .9, x + r * 1.6, y - r * 1.5, 'zona pelúcida endurecida');
        if (F === 3 && h > 11) lab(x + Math.cos(-PI * .2) * r * 1.1, y + Math.sin(-PI * .2) * r * 1.1, x + r * 1.8, y - r * .4, '2º corpúsculo polar');
        // selo final
        if (h >= 21.5) {
          const s1 = 'zigoto, 2n = 46', s2 = S.cromo === 'X' ? 'espermatozoide X: 46,XX (sexo genético feminino)' : 'espermatozoide Y: 46,XY (sexo genético masculino)';
          head(s1, x, y - r * 1.85, C.txt);
          X.font = `600 13px ${FT}`; const ww = Math.min(A.w - 8, X.measureText(s2).width + 20), yy = y + r * 1.75;
          rr(x - ww / 2, yy - 13, ww, 26, 999, 'rgba(11,15,28,.85)', '#FFB347', 1.5);
          tx(s2, x, yy, { s: NAR ? 12 : 13, w: 600, c: C.txt, bg: false });
        }
        cap([
          `Os espermatozoides sobem pelo útero e pela tuba e passam pela <b>capacitação</b>. De centenas de milhões, só cerca de <b>200</b> chegam à ampola`,
          `<b>Reação acrossômica</b>: as enzimas do acrossomo abrem caminho pela corona radiata e pela zona pelúcida`,
          `As membranas se fundem e a zona pelúcida muda: os outros espermatozoides <b>não entram</b> (bloqueio da polispermia)`,
          `Só agora o ovócito <b>termina a meiose II</b> e solta o 2º corpúsculo polar`,
          `Os <b>pronúcleos</b> (n = 23 cada) se aproximam`,
          `<b>Zigoto</b>, 2n = 46. O espermatozoide trouxe um cromossomo <b>${S.cromo}</b>: sexo genético ${S.cromo === 'X' ? 'feminino (46,XX)' : 'masculino (46,XY)'}`][F]);
      }
    });
  }

  // =================================================================================
  // TÓPICO · #humano/nidacao
  // =================================================================================
  {
    const hcg = (d, k = 1) => d < 6.5 ? 0 : Math.max(1, 1.6 * k * Math.pow(2, (d - 6.5) / 1.9));
    const cels = d => d < 1.25 ? 1 : d < 2 ? 2 : d < 2.5 ? 4 : d < 3 ? 8 : 16;
    // embrião jovem: zigoto, 2, 4, 8 células, mórula, blastocisto
    function embJovem(x, y, r, d, t) {
      const zona = d < 5 ? 1 : 1 - seg(d, 5, 5.8);
      if (d < 4) {
        const n = cels(d), R = rng(4);
        if (n === 1) cell(x, y, r * .85, C.ovo, { n: .25 });
        else if (n <= 8) { const pos = n === 2 ? [[-.4, 0], [.4, 0]] : n === 4 ? [[-.38, -.38], [.38, -.38], [-.38, .38], [.38, .38]] : [[-.45, -.45], [.45, -.45], [-.45, .45], [.45, .45], [0, -.15], [-.15, .2], [.2, .1], [0, .5]]; const cr = n === 2 ? .45 : n === 4 ? .4 : .32; pos.forEach(p => cell(x + p[0] * r, y + p[1] * r, r * cr, C.ovo, { n: .3 })); }
        else for (let i = 0; i < 16; i++) { const a = i * 2.4, dd = Math.sqrt((i + .5) / 16) * r * .62; cell(x + Math.cos(a) * dd, y + Math.sin(a) * dd, r * .24, C.ovo, { n: .3 }); void R; }
      } else {
        // blastocisto: trofoblasto em anel, blastocele e embrioblasto num polo
        const br = r * lerp(.9, 1.05, seg(d, 4, 5.5));
        circ(x, y, br, rgba(C.liquido, .7));
        const n = 18; for (let i = 0; i < n; i++) { const a = i / n * TAU; cell(x + Math.cos(a) * br * .9, y + Math.sin(a) * br * .9, br * .16, C.corion); }
        for (let i = 0; i < 6; i++) cell(x - br * .35 + (i % 3) * br * .22, y - br * .55 + Math.floor(i / 3) * br * .2, br * .15, MCI, { n: .3 });
      }
      if (zona > 0) { X.save(); X.globalAlpha = zona; X.beginPath(); X.arc(x, y, r * 1.18, d >= 5 ? .5 : 0, d >= 5 ? TAU - .5 : TAU); X.strokeStyle = rgba(C.clara, .7); X.lineWidth = 3; X.stroke(); X.restore(); }
    }
    // corte do endométrio com o blastocisto implantando (dia 6 a 10)
    function endometrio(Z, d, t, o) {
      const { x, y, w, h } = Z, top = y + h * .38;
      // lúmen do útero em cima, endométrio embaixo
      rr(x, y, w, h, 10, 'rgba(19,26,43,.55)', C.line, 1);
      X.save(); X.beginPath(); X.roundRect(x, y, w, h, 10); X.clip();
      const desc = o.desc || 0;
      const g = X.createLinearGradient(0, top, 0, y + h); g.addColorStop(0, rgba(C.mae, .85 - desc * .4)); g.addColorStop(1, rgba(C.mae, .45)); X.fillStyle = g; X.fillRect(x, top + desc * h * .25, w, h);
      // glândulas e vasos maternos
      for (let i = 0; i < 5; i++) { const gx = x + w * (.12 + i * .19); X.beginPath(); X.moveTo(gx, top + 4 + desc * h * .25); X.quadraticCurveTo(gx + 8, top + h * .3, gx - 4, y + h - 8); X.strokeStyle = 'rgba(11,15,28,.35)'; X.lineWidth = 3; X.stroke(); }
      const vas = [];
      for (let i = 0; i < 4; i++) { const vx = x + w * (.2 + i * .2), vy = top + h * (.28 + (i % 2) * .12); ell(vx, vy, w * .05, h * .06, 0, C.sangue, 'rgba(11,15,28,.5)', 1); vas.push([vx, vy]); }
      if (desc > 0) { const R = rng(8); for (let i = 0; i < 10; i++) { const px = x + R() * w, py = lerp(top, y + 10, fr(R() + t * .25)); circ(px, py, 3, rgba(C.sangue, desc)); } }
      // blastocisto
      if (o.emb) {
        const k = ss(seg(d, 6, 10)), br = Math.min(w, h) * .14, bx = x + w * .5, by = lerp(top - br * 1.1, top + br * 1.3, k);
        circ(bx, by, br, rgba(C.liquido, .8), C.corion, 2);
        for (let i = 0; i < 4; i++) cell(bx - br * .3 + (i % 2) * br * .3, by + br * .45 + Math.floor(i / 2) * br * .22 - br * .2, br * .17, MCI);
        // sinciciotrofoblasto invadindo
        if (k > .1) { X.save(); X.globalAlpha = k; X.beginPath(); X.ellipse(bx, by + br * .2, br * (1.35 + k * .4), br * (1.1 + k * .3), 0, -.1, PI + .1); X.strokeStyle = dark(C.corion, .15); X.lineWidth = 6 * k + 2; X.stroke(); X.restore(); }
        // epitélio se fecha por cima
        const cov = seg(d, 8.5, 10); X.beginPath(); X.moveTo(x, top); X.lineTo(bx - br * (1.4 - cov * 1.4), top); X.moveTo(bx + br * (1.4 - cov * 1.4), top); X.lineTo(x + w, top); X.strokeStyle = '#E58BA5'; X.lineWidth = 3; X.stroke();
        if (cov > 0) { X.beginPath(); X.moveTo(bx - br * 1.4, top); X.quadraticCurveTo(bx, top - br * .4 * (1 - cov), bx + br * 1.4, top); X.globalAlpha = cov; X.stroke(); X.globalAlpha = 1; }
        // hCG indo para os vasos da mãe
        if (d >= 7) for (let i = 0; i < 8; i++) { const v = vas[i % 4], f = fr(t * .4 + i / 8); circ(lerp(bx, v[0], f), lerp(by + br * .6, v[1], f), 2.6, '#F5D547', 'rgba(11,15,28,.5)', .8); }
        o.pos = { bx, by, br, top };
      } else { X.beginPath(); X.moveTo(x, top + desc * h * .25); X.lineTo(x + w, top + desc * h * .25); X.strokeStyle = '#E58BA5'; X.lineWidth = 3; X.stroke(); }
      X.restore();
      return vas;
    }
    def('humano', 'nidacao', {
      t: 'Nidação e hCG', s: 'da tuba ao útero, e o sinal que o teste de gravidez lê', c: C.mae, loc: 'Tuba uterina, útero e ovário', still: 3,
      ctl: { l: 'Dias após a fecundação', min: 0, max: 28, step: .5, v: 0, f: v => `dia ${nbr(Math.round(v * 2) / 2, v % 1 ? 1 : 0)}`, rate: () => 1 },
      extra: [
        { t: 'Sem gravidez', on: S => { S.cen = S.cen === 'sem' ? null : 'sem'; }, pressed: S => S.cen === 'sem' },
        { t: 'Gravidez ectópica', on: S => { S.cen = S.cen === 'ect' ? null : 'ect'; }, pressed: S => S.cen === 'ect' }
      ],
      alt: 'Mapa do útero, das tubas e do ovário com um marcador que desce da ampola ao útero enquanto o embrião se divide até mórula e blastocisto; depois, um corte do endométrio em que o blastocisto se implanta e libera hCG para os vasos maternos; ao lado, o corpo-lúteo no ovário, a curva de hCG e uma fita de teste de gravidez',
      d: `<p>Enquanto desce pela tuba, o zigoto se divide por mitoses (<b>segmentação</b>, ver <a href="#desenvolvimento/segmentacao">Segmentação</a>): 2 células por volta de 30 horas e uma <b>mórula</b> de 12 a 32 células por volta do <b>3º dia</b>, quando chega ao útero. No <b>4º dia</b> ela vira o <b>blastocisto</b> (a blástula dos mamíferos, ver <a href="#desenvolvimento/blastula">Blástula</a>), com o <b>embrioblasto</b>, que formará o embrião, e o <b>trofoblasto</b>, que formará a parte fetal da placenta. No 5º dia ele sai da zona pelúcida e, por volta do <b>6º ao 7º dia</b>, gruda no <b>endométrio</b> e começa a se enterrar nele: é a <b>nidação</b> (implantação), completa por volta do <b>10º dia</b>. Se o blastocisto se implantar fora do útero, temos uma <b>gravidez ectópica</b>, em cerca de 95% dos casos na tuba, que pode romper e sangrar muito.</p>
<p>Já na nidação, a camada externa do trofoblasto (o <b>sinciciotrofoblasto</b>, que depois faz parte do córion) começa a produzir a <b>gonadotrofina coriônica humana</b>, a <b>hCG</b>. Ela mantém vivo o <b>corpo-lúteo</b> do ovário, que continua produzindo <b>progesterona</b>; a progesterona mantém o endométrio, e a <b>menstruação não vem</b>. Sem gravidez, o corpo-lúteo degenera depois de cerca de 14 dias, a progesterona cai e o endométrio descama. A hCG passa para o sangue e a urina, e é ela que o <b>teste de gravidez</b> detecta, com anticorpos: no sangue, a partir do <b>fim da 2ª semana após a fecundação</b> (≈ 4ª semana pela DUM); na urina, nos testes de farmácia, de forma confiável a partir do <b>dia do atraso menstrual</b>. A concentração dobra a cada 2 a 3 dias, chega ao pico entre a <b>8ª e a 11ª semana de gestação, pela DUM</b> (6ª a 9ª após a fecundação) e cai; por volta da 8ª a 10ª semana de gestação (6ª a 8ª após a fecundação), a própria placenta já produz progesterona suficiente.</p>
<p>A faixa conta os <b>dias após a fecundação</b> (0 a 28). A menstruação esperada cairia perto do 14º dia após a fecundação (o 28º dia do ciclo, contado pela DUM). Os botões mostram o que muda <b>sem gravidez</b> e numa <b>gravidez ectópica</b>.</p>`,
      kv: [['Mórula', '3º dia: chega ao útero'], ['Blastocisto', '4º e 5º dia: embrioblasto e trofoblasto'], ['Nidação', 'começa no 6º ao 7º dia; completa por volta do 10º'], ['hCG', 'produzida pelo sinciciotrofoblasto; mantém o corpo-lúteo'], ['Teste no sangue', 'fim da 2ª semana após a fecundação (≈ 4ª pela DUM)'], ['Teste de farmácia', 'confiável a partir do atraso menstrual']],
      enem: 'Sequência para não errar: <b>zigoto → mórula (3º dia, chega ao útero) → blastocisto (4º-5º dia) → nidação (6º-7º dia)</b>; a fecundação foi na <b>tuba</b>, a nidação é no <b>endométrio</b>. E a pergunta clássica: <b>por que não há menstruação na gravidez?</b> Porque a <b>hCG</b> do embrião mantém o <b>corpo-lúteo</b>, que segue produzindo <b>progesterona</b>. O <b>teste de gravidez detecta hCG</b>; não confunda com <b>LH</b> e <b>FSH</b>, que vêm da hipófise.'
        // contracepção: a Nalu decidiu manter, como no roteiro (mesmo parágrafo)
        + ' Questões sobre <b>métodos contraceptivos</b> usam essa sequência: a <b>pílula do dia seguinte</b> age sobretudo adiando a ovulação, e o <b>DIU de cobre</b> dificulta a fecundação.',
      links: [['Fecundação', '#humano/fecundacao'], ['Placenta e cordão', '#humano/placenta'], ['Blástula', '#desenvolvimento/blastula']],
      draw(t, S) {
        const A = area(), o = this; auto(o, S, 1.6, 28, 3);
        const d = S.v, cen = S.cen, sem = cen === 'sem', ect = cen === 'ect';
        // layout
        let M, Z, P;
        if (NAR) {
          const hh = A.h * .52;
          M = { x: A.x0, y: A.y0 + 30, w: A.w * .5, h: hh - 30 };
          Z = { x: A.x0 + A.w * .53, y: A.y0 + 30, w: A.w * .47, h: hh - 34 };
          P = { x: A.x0, y: A.y0 + hh + 8, w: A.w, h: A.h - hh - 8 };
        } else {
          M = { x: A.x0, y: A.y0 + 30, w: A.w * .3, h: A.h * .62 };
          Z = { x: A.x0 + A.w * .33, y: A.y0 + 30, w: A.w * .3, h: A.h * .62 };
          P = { x: A.x0 + A.w * .66, y: A.y0 + 4, w: A.w * .34, h: A.h - 4 };
        }
        // corpo-lúteo e progesterona
        const lut = sem ? (d < 12 ? 1 : 1 - seg(d, 12, 15)) : 1;
        const descama = sem ? seg(d, 14, 17) : 0;
        head(`Dia ${Math.floor(d)}`, A.x0, A.y0 + 12, C.txt, 'left');
        if (!sem && d < 4.5) tx(`${cels(d) === 16 ? 'mórula, ≈ 16' : cels(d)} ${cels(d) === 1 ? 'célula (zigoto)' : 'células'}`, A.x0 + tw(`Dia ${Math.floor(d)}`, NAR ? 14 : 16, 600, FH) + 12, A.y0 + 12, { a: 'left', s: 13, c: C.dim, bg: false });
        else if (!sem && d < 6) tx('blastocisto', A.x0 + tw(`Dia ${Math.floor(d)}`, NAR ? 14 : 16, 600, FH) + 12, A.y0 + 12, { a: 'left', s: 13, c: C.dim, bg: false });
        const m = mapa(M.x, M.y + 8, M.w, M.h - 8, { lut, endo: 1 - descama * .8 });
        // marcador do embrião no mapa
        if (!sem) {
          const caminho = [m.ampola, m.tubaD[2], m.tubaD[1], m.corno, m.implante];
          const f = ect ? Math.min(seg(d, 0, 3) * .45, .45) : seg(d, 0, 3) * .78 + seg(d, 3, 6) * .22;
          const p = pth(caminho, f); marker(p[0], p[1], ect && d >= 6 ? '#FF6B7D' : C.ovo);
          if (!NAR) lab(m.ampola[0], m.ampola[1], m.ampola[0] + 6, m.ampola[1] - 30, 'ampola');
        }
        // zoom
        if (sem) {
          endometrio(Z, d, t, { emb: false, desc: descama });
          tx('sem embrião: sem hCG', Z.x + Z.w / 2, Z.y + 16, { s: 12, c: C.dim });
          if (descama > 0) tx('endométrio descama', Z.x + Z.w / 2, Z.y + Z.h - 14, { s: 12, c: C.txt });
        } else if (ect && d >= 6) {
          rr(Z.x, Z.y, Z.w, Z.h, 10, 'rgba(19,26,43,.55)', '#FF6B7D', 1.5);
          const cy = Z.y + Z.h / 2; rr(Z.x + 8, cy - Z.h * .2, Z.w - 16, Z.h * .4, Z.h * .2, rgba(C.mae, .7)); rr(Z.x + 8, cy - Z.h * .06, Z.w - 16, Z.h * .12, Z.h * .06, '#2A1B26');
          embJovem(Z.x + Z.w / 2, cy - Z.h * .06, Math.min(Z.w, Z.h) * .12, 5.9, t);
          wrapTx('implantação na tuba: gravidez ectópica', Z.x + Z.w / 2, Z.y + 18, Z.w - 16, { s: 12, w: 600, c: '#FF6B7D' });
          wrapTx('pode romper a tuba e sangrar; precisa de atendimento médico', Z.x + Z.w / 2, Z.y + Z.h - 32, Z.w - 16, { s: 12, c: C.txt });
        } else if (d < 6) {
          rr(Z.x, Z.y, Z.w, Z.h, 10, 'rgba(19,26,43,.55)', C.line, 1);
          const r = Math.min(Z.w, Z.h) * .24; embJovem(Z.x + Z.w / 2, Z.y + Z.h / 2 + 6, r, d, t);
          tx(d < 3 ? 'descendo pela tuba' : 'no útero', Z.x + Z.w / 2, Z.y + 16, { s: 12, c: C.dim });
          if (d >= 4 && !NAR) { lab(Z.x + Z.w / 2 - r * .3, Z.y + Z.h / 2 + 6 - r * .5, Z.x + Z.w * .15, Z.y + Z.h - 20, 'embrioblasto'); lab(Z.x + Z.w / 2 + r * .9, Z.y + Z.h / 2 + 6 + r * .3, Z.x + Z.w * .9, Z.y + Z.h - 46, 'trofoblasto'); }
          else if (d >= 4) lab(Z.x + Z.w / 2 - r * .3, Z.y + Z.h / 2 + 6 - r * .5, Z.x + Z.w * .1, Z.y + Z.h - 18, 'embrioblasto');
          if (d >= 5 && d < 6) tx('saindo da zona pelúcida', Z.x + Z.w / 2, Z.y + Z.h - 14, { s: 12, c: C.txt });
        } else {
          const oo = { emb: true }; endometrio(Z, d, t, oo);
          tx(d < 10 ? 'nidação no endométrio' : 'nidação completa', Z.x + Z.w / 2, Z.y + 16, { s: 12, c: C.txt });
          if (d >= 7) lab(oo.pos.bx + oo.pos.br * .8, oo.pos.by + oo.pos.br * .6, Z.x + Z.w - 6, Z.y + Z.h - 18, 'hCG');
          if (!NAR) lab(Z.x + 10, oo.pos.top + 20, Z.x + 4, Z.y + Z.h - 18, 'endométrio');
        }
        // painel de hormônios: curva de hCG, limiar do teste, fita
        const stripW = NAR ? 54 : 64;
        const G = NAR ? { x0: P.x + 46, y0: P.y + 14, w: P.w - 46 - stripW - 18, h: P.h - 64 } : { x0: P.x + 44, y0: P.y + 40, w: P.w - 52, h: P.h * .42 };
        G.x1 = G.x0 + G.w; G.y1 = G.y0 + G.h;
        const k = ect ? .6 : 1, L = v => Math.log10(Math.max(1, v));
        const gr = graph(G, { x0: 0, x1: 28, y0: 0, y1: 4, xl: '', yl: NAR ? 'hCG' : 'hCG (escala log)', xt: [[0, '0'], [7, '7'], [14, '14'], [21, '21'], [28, '28 d']],
          curves: sem ? [] : [{ f: v => L(hcg(Math.min(v, d), k)) * (v <= d ? 1 : NaN), c: '#F5D547', lw: 3 }] });
        const ty = gr.fy(L(25)); line(G.x0, ty, G.x1, ty, 'rgba(232,237,247,.6)', 1, [5, 4]);
        tx('limiar do teste ≈ 25 mUI/mL', G.x0 + 6, ty - 10, { a: 'left', s: 12, c: C.dim });
        const mx = gr.fx(14); line(mx, G.y0, mx, G.y1, rgba('#FF6B7D', .6), 1.5, [3, 3]);
        tx('menstruação esperada', cl(mx, G.x0 + 70, G.x1 - 70), G.y0 + 12, { s: 12, c: '#FF9AA8' });
        if (!sem) marker(gr.fx(d), gr.fy(L(hcg(d, k))), '#F5D547');
        // fita de teste
        const pos = !sem && hcg(d, k) >= 25;
        const sx = NAR ? G.x1 + 18 : P.x + 44, sy = NAR ? G.y0 : G.y1 + 48, sw = NAR ? stripW : Math.min(P.w - 52, 150), sh = NAR ? G.h : 40;
        rr(sx, sy, sw, sh, 6, '#ECEFF5', 'rgba(11,15,28,.6)', 1);
        if (NAR) { line(sx + 8, sy + sh * .3, sx + sw - 8, sy + sh * .3, '#C2185B', 4); if (pos) line(sx + 8, sy + sh * .62, sx + sw - 8, sy + sh * .62, '#C2185B', 4); tx('C', sx + sw / 2, sy + sh * .3 - 12, { s: 12, w: 700, c: '#1A1206', bg: false }); tx('T', sx + sw / 2, sy + sh * .62 - 12, { s: 12, w: 700, c: '#1A1206', bg: false }); }
        else { line(sx + sw * .55, sy + 8, sx + sw * .55, sy + sh - 8, '#C2185B', 4); if (pos) line(sx + sw * .78, sy + 8, sx + sw * .78, sy + sh - 8, '#C2185B', 4); tx('C', sx + sw * .55, sy + sh + 12, { s: 12, w: 700, c: C.dim, bg: false }); tx('T', sx + sw * .78, sy + sh + 12, { s: 12, w: 700, c: C.dim, bg: false }); tx('teste', sx + 8, sy + sh / 2, { a: 'left', s: 12, w: 600, c: '#1A1206', bg: false }); }
        tx(NAR ? (pos ? 'positivo' : 'negativo') : pos ? 'teste positivo' : 'teste negativo', NAR ? sx + sw / 2 : sx + sw + 10, NAR ? sy + sh + 14 : sy + sh / 2, { a: NAR ? 'center' : 'left', s: 12, w: 600, c: pos ? C.txt : C.dim, bg: false });
        if (!NAR) {
          // corpo-lúteo e progesterona
          const by = sy + sh + 50;
          hbar(P.x + 44, by, P.w - 52, 12, lut, '#F5D547', 'Corpo-lúteo (progesterona)', lut > .5 ? 'ativo' : lut > .05 ? 'regredindo' : 'degenerado');
        }
        cap(sem ? (d < 12 ? 'Sem gravidez: não há embrião nem hCG; o corpo-lúteo funciona só por cerca de 14 dias' : d < 14 ? 'Sem hCG, o <b>corpo-lúteo</b> começa a degenerar e a <b>progesterona</b> cai' : 'Progesterona baixa: o <b>endométrio descama</b> e vem a menstruação. O teste dá negativo')
          : ect && d >= 6 ? 'O blastocisto parou na tuba e se implantou ali: <b>gravidez ectópica</b> (≈ 95% dos casos ectópicos são na tuba). A hCG é produzida mesmo assim'
            : d < 3 ? `O zigoto desce pela tuba e se divide: ${cels(d)} ${cels(d) === 1 ? 'célula' : 'células'}`
              : d < 4 ? '3º dia: a <b>mórula</b> chega ao útero'
                : d < 5 ? '4º dia: a mórula ganha uma cavidade e vira <b>blastocisto</b>, com embrioblasto e trofoblasto'
                  : d < 6 ? '5º dia: o blastocisto sai da zona pelúcida'
                    : d < 10 ? '6º ao 10º dia: o blastocisto gruda pelo lado do embrioblasto e se enterra no endométrio. O trofoblasto começa a soltar <b>hCG</b>'
                      : d < 14 ? 'Nidação completa. A <b>hCG</b> mantém o corpo-lúteo, que segue produzindo progesterona; no sangue, ela já pode ser detectada no fim da 2ª semana'
                        : 'A hCG passou do limiar dos testes de farmácia perto do dia do atraso menstrual: o <b>teste dá positivo</b> e a menstruação não vem');
      }
    });
  }
}
