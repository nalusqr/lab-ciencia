/* LAB, módulo Taxonomia. Cenas E: cladistica/homologia e chave/dicotomica.
   Roteiro: docs/revisao-biologia/taxonomia-roteiro.md (Taxon, revisão Sapien), tópicos K3 e Ch1.
   Desenhos esquemáticos próprios em canvas 2D (Íris). Tudo fica dentro de um bloco para não colidir com as outras cenas. */
'use strict';
{
  // ---------- cores (paleta comum do motor quando existir; os tons extras são só deste arquivo) ----------
  const hexOk = c => typeof c === 'string' && /^#[0-9a-fA-F]{6}$/.test(c);
  const pc = (n, f) => (typeof C === 'object' && C && hexOk(C[n]) ? C[n] : f);
  const P = {
    txt: pc('txt', '#E8EDF7'), dim: pc('dim', '#9DA9C4'), line: pc('line', '#5B6C99'),
    amber: pc('amber', '#FFB347'), ok: pc('ok', '#7FD49A'), erro: pc('erro', '#FF6B7D'),
    // ossos homólogos (roteiro K3): úmero âmbar, rádio e ulna azul, punho e dedos verde
    umero: pc('umero', '#F2B33D'), radio: pc('radio', '#6FA8FF'), mao: pc('dedos', '#6CCB7A'),
    carne: '#3B4766', carneB: '#56648C', pena: '#2E3A5C', penaB: '#7C8BB3', membrana: '#6E5F8F', borb: '#D99A5B',
    tubarao: '#7D8FA8', golfinho: '#8FA3BF', painel: 'rgba(19,26,43,.72)', painelB: 'rgba(255,255,255,.12)'
  };
  const CORK = { u: P.umero, r: P.radio, m: P.mao };

  // ---------- utilidades locais ----------
  // texto com trechos em itálico (nomes científicos): segs = [[texto, itálico], ...]
  function fnt(sz, w, it) { return `${it ? 'italic ' : ''}${w || 400} ${Math.max(12, sz)}px ${FT}`; }
  function mw(segs, sz, w) { let s = 0; for (const [t, it] of segs) { X.font = fnt(sz, w, it); s += X.measureText(t).width; } return s; }
  function mtx(segs, x, y, o = {}) {
    const sz = o.s || 13, w = o.w || 400, tot = mw(segs, sz, w), a = o.a || 'center';
    let cx = a === 'left' ? x : a === 'right' ? x - tot : x - tot / 2;
    X.textAlign = 'left'; X.textBaseline = 'middle';
    for (const [t, it] of segs) {
      X.font = fnt(sz, w, it);
      if (o.bg !== false) { X.lineWidth = 4; X.lineJoin = 'round'; X.strokeStyle = 'rgba(11,15,28,.9)'; X.strokeText(t, cx, y); }
      X.fillStyle = o.c || P.txt; X.fillText(t, cx, y); cx += X.measureText(t).width;
    }
    return tot;
  }
  // quebra um texto em linhas que cabem em maxw
  function linhas(s, maxw, sz = 13, w = 400) {
    const out = []; let cur = '';
    for (const p of s.split(' ')) { const t = cur ? cur + ' ' + p : p; if (cur && tw(t, sz, w) > maxw) { out.push(cur); cur = p; } else cur = t; }
    if (cur) out.push(cur); return out;
  }
  function bloco(s, x, y, maxw, o = {}) {
    const sz = o.s || 13, lh = o.lh || sz + 5, L = linhas(s, maxw, sz, o.w || 400);
    L.forEach((l, i) => tx(l, x, y + i * lh, { s: sz, w: o.w || 400, c: o.c || P.txt, a: o.a || 'left', b: 'top', bg: false }));
    return L.length * lh;
  }
  // toque: cada área registrada fica em S.hits e também no motor (hitR), que mostra a mãozinha e chama o.tap
  function hit(S, x, y, w, h, f) { S.hits.push({ x, y, w, h, f }); if (typeof hitR === 'function') hitR(x, y, w, h, S.hits.length - 1); }
  function toca(x, y, S) {
    let id = typeof hitAt === 'function' ? hitAt(x, y) : null;
    if (id == null) { const i = (S.hits || []).findIndex(b => x >= b.x - 3 && x <= b.x + b.w + 3 && y >= b.y - 3 && y <= b.y + b.h + 3); id = i < 0 ? null : i; }
    const h = id != null && S.hits && S.hits[id]; if (h) { try { h.f(); } catch (err) { console.error(err); } }
  }
  // botão desenhado no canvas (área de toque de pelo menos 44 px de altura)
  function botao(S, x, y, w, s, f, o = {}) {
    const sz = o.s || 14, L = linhas(s, w - (o.letra ? 52 : 24), sz, 600), lh = sz + 5, h = Math.max(44, L.length * lh + 18);
    const on = !!o.on;
    rr(x, y, w, h, 8, on ? 'rgba(255,179,71,.12)' : 'rgba(27,36,64,.92)', on ? P.amber : 'rgba(141,156,199,.55)', on ? 2 : 1.2);
    let tx0 = x + 12;
    if (o.letra) { circ(x + 24, y + h / 2, 13, 'rgba(11,15,28,.7)', on ? P.amber : P.dim, 1.5); tx(o.letra, x + 24, y + h / 2 + .5, { s: 13, w: 700, f: FD, c: on ? P.amber : P.txt, bg: false }); tx0 = x + 46; }
    const ty = y + h / 2 - (L.length - 1) * lh / 2;
    L.forEach((l, i) => tx(l, o.letra ? tx0 : x + w / 2, ty + i * lh, { s: sz, w: 600, a: o.letra ? 'left' : 'center', c: P.txt, bg: false }));
    if (S) hit(S, x, y, w, h, f);
    return h;
  }
  function syncExtra(o, S) { const el = $('extra'); if (!el || !o.extra) return; [...el.children].forEach((b, i) => { const y = o.extra[i]; if (y) b.setAttribute('aria-pressed', y.pressed ? !!y.pressed(S) : false); }); }
  function chip(x, y, c, s, on, sz = 13) {
    const w = tw(s, sz, 600) + 34, h = 26;
    rr(x, y - h / 2, w, h, 999, on ? 'rgba(27,36,64,.95)' : 'rgba(11,15,28,.7)', on ? P.amber : 'rgba(255,255,255,.14)', on ? 1.6 : 1);
    circ(x + 14, y, 5.5, c); tx(s, x + 24, y + .5, { s: sz, w: 600, a: 'left', c: on ? P.txt : P.dim, bg: false });
    return w;
  }

  // =====================================================================================
  // MEMBROS ANTERIORES (K3): ossos em coordenadas locais, ombro em (0, 0), y para baixo
  // osso: [x1, y1, x2, y2, largura, tipo]  tipo: u = úmero, r = rádio ou ulna, m = punho e dedos
  // =====================================================================================
  function dedo(b, x, y, ang, lens, w, curva = 0) {
    let cx = x, cy = y, a = ang; const g = .01;
    lens.forEach((L, i) => {
      const sx = Math.sin(a), cy0 = Math.cos(a);
      b.push([cx + sx * g / 2, cy + cy0 * g / 2, cx + sx * (L - g / 2), cy + cy0 * (L - g / 2), w * (1 - i * .1), 'm']);
      cx += sx * L; cy += cy0 * L; a += curva;
    });
    return [cx, cy];
  }
  function mHumano() {
    const b = [[0, 0, 0, .40, .075, 'u'], [-.036, .43, -.046, .76, .04, 'r'], [.036, .43, .046, .76, .04, 'r']];
    const c = [[-.046, .795, .021], [0, .79, .021], [.046, .795, .021], [-.024, .835, .02], [.024, .835, .02]];
    dedo(b, -.062, .86, -.6, [.07, .05, .04], .026);
    [[-.034, -.16], [-.01, -.05], [.016, .06], [.042, .18]].forEach(([x, a]) => dedo(b, x, .87, a, [.09, .055, .04, .03], .024));
    return { b, c };
  }
  function mBaleia() {
    const b = [[0, 0, 0, .18, .11, 'u'], [-.046, .21, -.055, .36, .07, 'r'], [.046, .21, .055, .36, .07, 'r']];
    const c = [[-.06, .40, .028], [0, .40, .028], [.06, .40, .028], [-.03, .446, .026], [.03, .446, .026]];
    [[-.07, -.12, [.07, .06, .05]], [-.035, -.05, [.08, .07, .065, .06, .05, .045]], [0, 0, [.08, .075, .07, .065, .06, .055, .05, .04]],
      [.035, .05, [.08, .07, .065, .06, .05, .045]], [.07, .11, [.07, .06, .05, .04]]].forEach(([x, a, L]) => dedo(b, x, .49, a, L, .03));
    const pele = [[-.085, -.03], [.085, -.03], [.13, .2], [.155, .45], [.14, .72], [.08, 1.0], [.01, 1.1], [-.05, 1.02], [-.12, .74], [-.15, .46], [-.13, .2]];
    return { b, c, pele };
  }
  function mMorcego() {
    const b = [[0, 0, 0, .28, .06, 'u'], [-.01, .31, -.03, .66, .042, 'r'], [.034, .31, .04, .43, .022, 'r']];
    const c = [[-.05, .69, .021], [-.01, .69, .021], [-.03, .723, .019]];
    dedo(b, -.06, .71, -.95, [.04, .035], .022);
    const tips = [[-.55, [.22, .13, .09]], [-.2, [.24, .15, .1]], [.2, [.21, .12, .08]], [.6, [.18, .1, .07]]].map(([a, L]) => dedo(b, -.03, .745, a, L, .018));
    return { b, c, membrana: { pulso: [-.03, .74], tips, corpo: [[.36, .48], [.2, .14], [.02, .05]] } };
  }
  function mAve() {
    const b = [[0, 0, 0, .30, .065, 'u'], [-.03, .33, -.036, .62, .032, 'r'], [.03, .33, .036, .62, .05, 'r'],
      [-.012, .69, -.012, .84, .04, 'm'], [.03, .70, .03, .82, .022, 'm']];
    const c = [[-.03, .655, .021], [.03, .655, .021]];
    dedo(b, -.045, .69, -.45, [.05], .022); dedo(b, -.012, .86, 0, [.07, .045], .026); dedo(b, .032, .84, .15, [.035], .018);
    const penas = [];
    for (let i = 0; i < 6; i++) { const y = .70 + i * .05; penas.push([.0, y, .55 - i * .03, .9 - i * .1]); }       // primárias, saem da mão
    for (let i = 0; i < 6; i++) { const y = .36 + i * .05; penas.push([.03, y, .34, 1.45 - i * .04]); }              // secundárias, saem do antebraço
    return { b, c, penas };
  }
  function mCao() {
    const b = [[0, 0, .07, .32, .075, 'u'], [.052, .35, .046, .70, .038, 'r'], [.098, .35, .094, .70, .038, 'r']];
    const c = [[.048, .735, .021], [.094, .735, .021], [.071, .77, .02]];
    [.03, .058, .086, .114].forEach(x => dedo(b, x, .80, .02, [.13, .045, .035], .022, -.55));
    dedo(b, .01, .79, -.35, [.04, .025], .016);
    return { b, c };
  }
  const MEMB = { hum: mHumano(), bal: mBaleia(), mor: mMorcego(), ave: mAve(), cao: mCao() };
  // caixa que envolve cada desenho, para caber na célula
  function caixa(m) {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; const add = (x, y, r = 0) => { x0 = Math.min(x0, x - r); y0 = Math.min(y0, y - r); x1 = Math.max(x1, x + r); y1 = Math.max(y1, y + r); };
    for (const o of m.b) { add(o[0], o[1], o[4]); add(o[2], o[3], o[4]); }
    for (const q of m.c || []) add(q[0], q[1], q[2]);
    for (const q of m.pele || []) add(q[0], q[1]);
    if (m.membrana) { for (const q of m.membrana.tips) add(q[0], q[1]); for (const q of m.membrana.corpo) add(q[0], q[1]); }
    for (const p of m.penas || []) { add(p[0] + Math.sin(p[3]) * p[2], p[1] + Math.cos(p[3]) * p[2], .04); }
    return { x0, y0, x1, y1 };
  }
  for (const k in MEMB) MEMB[k].bb = caixa(MEMB[k]);
  const BORB = { bb: { x0: -.12, y0: -.05, x1: 1.05, y1: 1.15 } };

  // desenha um membro: hl = tipo em destaque (u, r, m) ou null para todos
  function desenhaMembro(m, k, hl) {
    const ink = 'rgba(11,15,28,.75)';
    X.lineCap = 'round'; X.lineJoin = 'round';
    // partes moles: penas, membrana, pele da nadadeira e a "carne" em volta dos ossos
    if (m.penas) for (const p of m.penas) {
      const ex = p[0] + Math.sin(p[3]) * p[2], ey = p[1] + Math.cos(p[3]) * p[2];
      X.beginPath(); X.moveTo(p[0], p[1]); X.lineTo(ex, ey); X.strokeStyle = P.penaB; X.lineWidth = .075; X.stroke();
      X.beginPath(); X.moveTo(p[0], p[1]); X.lineTo(ex, ey); X.strokeStyle = P.pena; X.lineWidth = .06; X.stroke();
      line(p[0], p[1], ex, ey, rgba(P.penaB, .9), .006);
    }
    if (m.membrana) {
      const M = m.membrana, t = M.tips; X.beginPath(); X.moveTo(M.pulso[0], M.pulso[1]); X.lineTo(t[0][0], t[0][1]);
      for (let i = 1; i < t.length; i++) { const mx = (t[i - 1][0] + t[i][0]) / 2, my = (t[i - 1][1] + t[i][1]) / 2; X.quadraticCurveTo(lerp(mx, M.pulso[0], .3), lerp(my, M.pulso[1], .3), t[i][0], t[i][1]); }
      const L = t[t.length - 1], c0 = M.corpo[0]; X.quadraticCurveTo((L[0] + c0[0]) / 2 - .02, (L[1] + c0[1]) / 2 - .06, c0[0], c0[1]);
      for (let i = 1; i < M.corpo.length; i++) X.lineTo(M.corpo[i][0], M.corpo[i][1]);
      X.closePath(); X.fillStyle = rgba(P.membrana, .55); X.fill(); X.strokeStyle = rgba(P.membrana, .95); X.lineWidth = .008; X.stroke();
    }
    if (m.pele) { X.beginPath(); m.pele.forEach((q, i) => i ? X.lineTo(q[0], q[1]) : X.moveTo(q[0], q[1])); X.closePath(); X.fillStyle = P.carne; X.fill(); X.strokeStyle = P.carneB; X.lineWidth = .01; X.stroke(); }
    else {
      for (const o of m.b) { X.beginPath(); X.moveTo(o[0], o[1]); X.lineTo(o[2], o[3]); X.strokeStyle = P.carneB; X.lineWidth = o[4] + .075; X.stroke(); }
      for (const o of m.b) { X.beginPath(); X.moveTo(o[0], o[1]); X.lineTo(o[2], o[3]); X.strokeStyle = P.carne; X.lineWidth = o[4] + .06; X.stroke(); }
    }
    // ossos: contorno escuro e depois a cor
    const al = t => (hl == null || hl === t ? 1 : .28);
    for (const o of m.b) { X.globalAlpha = al(o[5]); X.beginPath(); X.moveTo(o[0], o[1]); X.lineTo(o[2], o[3]); X.strokeStyle = ink; X.lineWidth = o[4] + .014; X.stroke(); }
    for (const q of m.c || []) { X.globalAlpha = al('m'); disco(q[0], q[1], q[2] + .007, ink); }
    for (const o of m.b) { X.globalAlpha = al(o[5]); X.beginPath(); X.moveTo(o[0], o[1]); X.lineTo(o[2], o[3]); X.strokeStyle = CORK[o[5]]; X.lineWidth = o[4]; X.stroke(); }
    for (const q of m.c || []) { X.globalAlpha = al('m'); disco(q[0], q[1], q[2], CORK.m); }
    X.globalAlpha = 1; X.lineCap = 'butt';
  }
  // asa de borboleta: dobra da parede do corpo, com nervuras e sem ossos
  function desenhaBorb() {
    X.lineJoin = 'round';
    X.beginPath(); X.moveTo(0, 0); X.bezierCurveTo(.3, -.08, .95, -.05, 1.02, .15); X.bezierCurveTo(1.05, .38, .6, .5, .02, .42); X.closePath();
    X.fillStyle = rgba(P.borb, .5); X.fill(); X.strokeStyle = P.borb; X.lineWidth = .012; X.stroke();
    X.beginPath(); X.moveTo(.02, .44); X.bezierCurveTo(.5, .5, .78, .78, .64, 1.02); X.bezierCurveTo(.48, 1.18, .12, 1.0, 0, .7); X.closePath();
    X.fillStyle = rgba(P.borb, .38); X.fill(); X.strokeStyle = P.borb; X.lineWidth = .012; X.stroke();
    for (const [x, y] of [[.95, .1], [.85, .3], [.6, .38], [.35, .4]]) qline(0, .05, x * .5, y * .4, x, y);
    for (const [x, y] of [[.62, .8], [.45, .98], [.2, .92]]) qline(0, .48, x * .4, y * .7, x, y);
    X.lineCap = 'round'; X.beginPath(); X.moveTo(-.05, -.04); X.lineTo(-.05, 1.08); X.strokeStyle = '#5A4A3A'; X.lineWidth = .06; X.stroke(); X.lineCap = 'butt';
    function qline(x1, y1, qx, qy, x2, y2) { X.beginPath(); X.moveTo(x1, y1); X.quadraticCurveTo(qx, qy, x2, y2); X.strokeStyle = 'rgba(70,45,25,.75)'; X.lineWidth = .008; X.stroke(); }
  }
  // círculo em coordenadas de desenho pequenas (o circ do motor tem raio mínimo de 0,1)
  function disco(x, y, r, f) { X.beginPath(); X.arc(x, y, r, 0, TAU); X.fillStyle = f; X.fill(); }
  // coloca um desenho de caixa bb dentro do retângulo (x, y, w, h); devolve a escala
  function encaixa(bb, x, y, w, h, fn) {
    const bw = bb.x1 - bb.x0, bh = bb.y1 - bb.y0, s = Math.min(w / bw, h / bh);
    X.save(); X.translate(x + w / 2 - (bb.x0 + bw / 2) * s, y + h / 2 - (bb.y0 + bh / 2) * s); X.scale(s, s);
    try { fn(); } catch (err) { console.error(err); }
    X.restore(); return s;
  }
  // silhuetas de corpo inteiro (vista lateral, cabeça à direita, comprimento 2)
  function tubarao(dest) {
    X.lineJoin = 'round';
    X.beginPath(); X.moveTo(1, .02); X.quadraticCurveTo(.6, -.22, 0, -.2); X.quadraticCurveTo(-.5, -.15, -.78, -.05); X.lineTo(-1, -.42); X.lineTo(-.9, -.02); X.lineTo(-.98, .2); X.lineTo(-.76, .06); X.quadraticCurveTo(0, .24, .7, .14); X.closePath();
    X.fillStyle = rgba(P.tubarao, .55); X.fill(); X.strokeStyle = P.tubarao; X.lineWidth = .02; X.stroke();
    X.beginPath(); X.moveTo(.12, -.19); X.lineTo(-.06, -.5); X.lineTo(-.22, -.17); X.closePath(); X.fillStyle = rgba(P.tubarao, .55); X.fill(); X.stroke();
    for (let i = 0; i < 4; i++) line(.52 - i * .05, -.06, .5 - i * .05, .08, 'rgba(11,15,28,.6)', .012);
    disco(.78, -.04, .025, '#0B0F1C');
    // nadadeira peitoral: raios de cartilagem, sem os ossos coloridos
    X.beginPath(); X.moveTo(.36, .14); X.lineTo(.1, .5); X.lineTo(.2, .14); X.closePath(); X.fillStyle = dest ? rgba(P.amber, .35) : rgba(P.tubarao, .7); X.fill(); X.strokeStyle = dest ? P.amber : P.tubarao; X.lineWidth = .02; X.stroke();
    for (let i = 0; i < 4; i++) line(.28 - i * .02, .16, .15 + i * .015, .42 - i * .04, 'rgba(11,15,28,.45)', .01);
  }
  function golfinho(dest) {
    X.lineJoin = 'round';
    X.beginPath(); X.moveTo(1, .04); X.lineTo(.84, .0); X.quadraticCurveTo(.78, -.18, .55, -.2); X.quadraticCurveTo(0, -.24, -.72, -.05); X.lineTo(-.86, -.01); X.lineTo(-1, -.18); X.lineTo(-.94, .01); X.lineTo(-1, .2); X.lineTo(-.86, .03); X.lineTo(-.72, .05); X.quadraticCurveTo(0, .24, .7, .1); X.closePath();
    X.fillStyle = rgba(P.golfinho, .5); X.fill(); X.strokeStyle = P.golfinho; X.lineWidth = .02; X.stroke();
    X.beginPath(); X.moveTo(0, -.21); X.quadraticCurveTo(-.12, -.32, -.2, -.48); X.quadraticCurveTo(-.22, -.3, -.32, -.18); X.closePath(); X.fillStyle = rgba(P.golfinho, .5); X.fill(); X.stroke();
    disco(.66, -.05, .025, '#0B0F1C');
    // nadadeira peitoral com os mesmos ossos da baleia, em miniatura
    X.save(); X.translate(.44, .08); X.rotate(.75); X.scale(.46, .46);
    if (dest) { X.beginPath(); X.ellipse(0, .55, .26, .66, 0, 0, TAU); X.fillStyle = rgba(P.amber, .2); X.fill(); }
    desenhaMembro(MEMB.bal, 'bal', null); X.restore();
  }

  // baleia (jubarte) de corpo inteiro, com a nadadeira peitoral longa mostrando os ossos
  function baleiaCorpo(dest) {
    X.lineJoin = 'round';
    X.beginPath(); X.moveTo(1, .02); X.quadraticCurveTo(.95, -.2, .6, -.22); X.quadraticCurveTo(0, -.26, -.7, -.06); X.lineTo(-.84, -.02); X.lineTo(-1, -.2); X.lineTo(-.93, .01); X.lineTo(-1, .22); X.lineTo(-.84, .04); X.lineTo(-.7, .07); X.quadraticCurveTo(0, .3, .7, .2); X.quadraticCurveTo(.95, .14, 1, .02); X.closePath();
    X.fillStyle = rgba(P.golfinho, .42); X.fill(); X.strokeStyle = P.golfinho; X.lineWidth = .02; X.stroke();
    X.beginPath(); X.moveTo(-.25, -.2); X.lineTo(-.33, -.3); X.lineTo(-.4, -.17); X.closePath(); X.fillStyle = rgba(P.golfinho, .42); X.fill(); X.stroke();
    for (let i = 0; i < 4; i++) line(.82 - i * .1, .12 + i * .012, .5 - i * .1, .2 + i * .01, 'rgba(11,15,28,.35)', .012);
    disco(.78, -.04, .025, '#0B0F1C');
    X.save(); X.translate(.42, .12); X.rotate(.55); X.scale(.62, .62);
    if (dest) { X.beginPath(); X.ellipse(0, .55, .24, .66, 0, 0, TAU); X.fillStyle = rgba(P.amber, .16); X.fill(); }
    desenhaMembro(MEMB.bal, 'bal', null); X.restore();
  }
  // ---------- dados de K3 ----------
  const NOME = {
    hum: ['ser humano', 'braço'], bal: ['baleia', 'nadadeira'], mor: ['morcego', 'asa'], ave: ['ave', 'asa'], cao: ['cão', 'pata'],
    bor: ['borboleta', 'asa, sem ossos'], balc: ['baleia', 'nadadeira (mamífero)'], tub: ['tubarão', 'nadadeira (peixe)'], gol: ['golfinho', 'nadadeira (mamífero)']
  };
  const SILH = { balc: { bb: { x0: -1.02, y0: -.4, x1: 1.02, y1: .78 }, f: d => baleiaCorpo(d) }, tub: { bb: { x0: -1.02, y0: -.52, x1: 1.02, y1: .52 }, f: d => tubarao(d) }, gol: { bb: { x0: -1.02, y0: -.52, x1: 1.02, y1: .52 }, f: d => golfinho(d) } };
  function figura(k, x, y, w, h, hl, dest) {
    if (MEMB[k]) return encaixa(MEMB[k].bb, x, y, w, h, () => desenhaMembro(MEMB[k], k, hl));
    if (k === 'bor') return encaixa(BORB.bb, x, y, w, h, desenhaBorb);
    if (SILH[k]) return encaixa(SILH[k].bb, x, y, w, h, () => SILH[k].f(dest));
  }
  function rotulo(k, x, y, maxw) {
    const [a, b] = NOME[k]; tx(a, x, y, { s: NAR ? 13 : 14, w: 700, c: P.txt, bg: false });
    const bl = linhas(b, maxw, 12); bl.forEach((l, i) => tx(l, x, y + 16 + i * 15, { s: 12, c: P.dim, bg: false }));
    return 16 + bl.length * 15;
  }
  const FASES = [
    ['u', '<b>Úmero</b>: um único osso no braço, nos cinco membros.'],
    ['r', '<b>Rádio e ulna</b>: dois ossos no antebraço, na mesma posição em todos.'],
    ['m', '<b>Punho e dedos</b>: muitos ossos pequenos, que mudam de tamanho e de número, mas estão sempre lá.'],
    [null, 'Mesmos ossos, na mesma ordem, funções diferentes: são <b>estruturas homólogas</b> (divergência).']
  ];
  const QUIZ = [
    { a: 'hum', b: 'bal', t: 'Braço humano e nadadeira da baleia', r: 0, e: 'Homólogas: os mesmos ossos na mesma ordem. A origem é a mesma; a função mudou (divergência).' },
    { a: 'ave', b: 'bor', t: 'Asa da ave e asa da borboleta', r: 1, e: 'Análogas: as duas servem para voar, mas a da borboleta não tem ossos. Origens diferentes, mesma função (convergência).' },
    { a: 'tub', b: 'gol', t: 'Nadadeira do tubarão e do golfinho', r: 1, e: 'Análogas: o tubarão é peixe e o golfinho é mamífero. A nadadeira do golfinho tem úmero, rádio, ulna e dedos; a do tubarão, não.' },
    { a: 'ave', b: 'mor', t: 'Asa da ave e asa do morcego', r: 2, e: 'As duas coisas: homólogas como membros anteriores (os mesmos ossos) e análogas como asas, porque o voo surgiu separadamente (penas na ave, pele entre os dedos no morcego).' }
  ];
  const RESP = ['homólogas', 'análogas', 'as duas coisas'];

  function k3Origem(t, S, A) {
    const ks = ['hum', 'bal', 'mor', 'ave', 'cao'].concat(S.bor ? ['bor'] : []);
    const nf = FASES.length + (S.bor ? 1 : 0), fi = Math.floor(t / 2.8) % nf, hl = fi < FASES.length ? FASES[fi][0] : null;
    // legenda das cores no alto
    const nomes = [['u', P.umero, 'úmero'], ['r', P.radio, 'rádio e ulna'], ['m', P.mao, 'punho e dedos']], csz = NAR ? 12 : 13;
    const ws = nomes.map(n => tw(n[2], csz, 600) + 34), tot = ws.reduce((a, b) => a + b, 0) + 16;
    let yc = A.y0 + 14;
    if (tot <= A.w) { let x = A.cx - tot / 2; nomes.forEach((n, i) => { chip(x, yc, n[1], n[2], hl === n[0], csz); x += ws[i] + 8; }); }
    else { let x = A.cx - (ws[0] + ws[1] + 8) / 2; chip(x, yc, nomes[0][1], nomes[0][2], hl === 'u', csz); chip(x + ws[0] + 8, yc, nomes[1][1], nomes[1][2], hl === 'r', csz); yc += 32; chip(A.cx - ws[2] / 2, yc, nomes[2][1], nomes[2][2], hl === 'm', csz); }
    const top = yc + 24, foot = 22, nomeH = 40;
    const cols = NAR ? 3 : ks.length, rows = Math.ceil(ks.length / cols);
    const cw = A.w / cols, ch = (A.y1 - foot - top) / rows;
    ks.forEach((k, i) => {
      const r = Math.floor(i / cols), cI = i % cols, nInRow = Math.min(cols, ks.length - r * cols);
      const x = A.x0 + (A.w - nInRow * cw) / 2 + cI * cw, y = top + r * ch;
      const pad = NAR ? 6 : 14, fh = ch - nomeH - 6;
      const dest = k === 'bor' && fi === FASES.length;
      if (dest) rr(x + 2, y - 2, cw - 4, ch - 2, 10, 'rgba(255,179,71,.06)', rgba(P.amber, .7), 1.5);
      figura(k, x + pad, y + 4, cw - 2 * pad, fh, k === 'bor' ? null : hl);
      rotulo(k, x + cw / 2, y + fh + 16, cw - 8);
    });
    tx('desenho esquemático; cores indicam ossos homólogos', A.cx, A.y1 - 8, { s: 12, c: P.dim, bg: false });
    cap(fi < FASES.length ? FASES[fi][1] : 'A asa da borboleta não tem nenhum desses ossos: é uma dobra da parede do corpo. Ela é <b>análoga</b> à asa da ave (convergência).');
  }

  function k3Funcao(t, S, A) {
    const G = [
      { t: 'voar', ks: ['ave', 'mor', 'bor'], p: ['ave e morcego: homólogas como membros, análogas como asas', 'ave e borboleta: análogas (convergência)'] },
      { t: 'nadar', ks: ['balc', 'tub', 'gol'], p: ['tubarão e golfinho: análogas (convergência)', 'golfinho e baleia: homólogas (mesmos ossos; os dois são cetáceos)'] }
    ];
    const gap = 16, gw = NAR ? A.w : (A.w - gap) / 2, gh = NAR ? (A.y1 - A.y0 - gap - 22) / 2 : A.h - 22;
    G.forEach((g, gi) => {
      const x = NAR ? A.x0 : A.x0 + gi * (gw + gap), y = NAR ? A.y0 + gi * (gh + gap) : A.y0;
      rr(x, y, gw, gh, 12, P.painel, P.painelB, 1);
      tx('para ' + g.t, x + 14, y + 18, { s: NAR ? 14 : 16, w: 600, f: FH, a: 'left', c: P.txt, bg: false });
      // quanto texto vem embaixo: mede antes de desenhar as figuras
      const tw0 = gw - 28, ls = g.p.map(s => linhas(s, tw0 - 16, 12, 400)), th = ls.reduce((a, L) => a + L.length * 16 + 6, 0);
      const fy = y + 34, nomeH = 36, fh = gh - 34 - nomeH - th - 14, cw = gw / 3;
      g.ks.forEach((k, i) => {
        const cx = x + i * cw, sil = !!SILH[k];
        const hh = sil ? Math.min(fh, cw * .55) : fh;
        figura(k, cx + 8, fy + (fh - hh) / 2, cw - 16, hh, null, true);
        tx(NOME[k][0], cx + cw / 2, fy + fh + 14, { s: 13, w: 700, c: P.txt, bg: false });
      });
      let yy = y + gh - th - 8;
      ls.forEach((L, i) => {
        const hom = /homólog/.test(g.p[i]);
        circ(x + 20, yy + 8, 4.5, hom ? P.mao : P.borb);
        L.forEach((l, j) => tx(l, x + 30, yy + 8 + j * 16, { s: 12, a: 'left', c: P.txt, bg: false }));
        yy += L.length * 16 + 6;
      });
    });
    tx('desenho esquemático; cores indicam ossos homólogos', A.cx, A.y1 - 8, { s: 12, c: P.dim, bg: false });
    cap('Agrupadas pela <b>função</b>, estruturas de origens diferentes ficam juntas: isso é <b>analogia</b>. Só a homologia indica parentesco.');
  }

  function k3Quiz(t, S, A) {
    const q = QUIZ[S.qi || 0], resp = S.qr;
    tx(`par ${(S.qi || 0) + 1} de ${QUIZ.length}`, A.x0 + 4, A.y0 + 12, { s: 12, f: FD, w: 500, a: 'left', c: P.dim, bg: false });
    tx(`acertos: ${S.qok || 0}`, A.x1 - 4, A.y0 + 12, { s: 12, f: FD, w: 500, a: 'right', c: P.dim, bg: false });
    const hT = bloco(q.t, A.cx, A.y0 + 28, A.w - 20, { s: NAR ? 15 : 17, w: 700, a: 'center' });
    // área dos botões ou da resposta embaixo
    const bw = NAR ? A.w : Math.min(640, A.w), bx = A.cx - bw / 2;
    const fbL = resp == null ? [] : linhas(q.e, bw - 24, 13);
    const baixo = resp == null ? (NAR ? 3 * 52 : 56) : fbL.length * 18 + 30 + 52;
    const fy = A.y0 + 34 + hT, fh = A.y1 - baixo - 14 - fy - 34;
    const cw = Math.min(A.w / 2, 360), sil = !!SILH[q.a];
    [q.a, q.b].forEach((k, i) => {
      const x = A.cx - cw + i * cw, hh = sil ? Math.min(fh, cw * .55) : fh;
      figura(k, x + 10, fy + (fh - hh) / 2, cw - 20, hh, null, true);
      tx(NOME[k][0], x + cw / 2, fy + fh + 16, { s: 13, w: 700, c: P.txt, bg: false });
    });
    tx('×', A.cx, fy + fh / 2, { s: 22, w: 700, c: P.dim, bg: false });
    let y = A.y1 - baixo;
    if (resp == null) {
      cap('As duas estruturas têm a mesma <b>origem</b> (homólogas), só a mesma <b>função</b> (análogas), ou as duas coisas?');
      if (NAR) RESP.forEach((s, i) => { botao(S, bx, y + i * 52, bw, s, () => responde(S, i)); });
      else { const w3 = (bw - 16) / 3; RESP.forEach((s, i) => botao(S, bx + i * (w3 + 8), y, w3, s, () => responde(S, i))); }
    } else {
      const ok = resp === q.r;
      tx(ok ? 'Isso mesmo.' : `Ainda não: a resposta é "${RESP[q.r]}".`, bx + 12, y + 10, { s: 14, w: 700, a: 'left', c: ok ? P.ok : P.erro, bg: false });
      fbL.forEach((l, i) => tx(l, bx + 12, y + 30 + i * 18, { s: 13, a: 'left', c: P.txt, bg: false }));
      const last = (S.qi || 0) >= QUIZ.length - 1;
      botao(S, bx + bw - Math.min(220, bw), y + 30 + fbL.length * 18 + 6, Math.min(220, bw), last ? 'recomeçar os pares' : 'próximo par', () => {
        if (last) { S.qi = 0; S.qok = 0; } else S.qi = (S.qi || 0) + 1; S.qr = null;
      });
      cap(ok ? 'Acertou. Veja a explicação e passe para o próximo par.' : 'Leia a explicação: a pergunta é sobre a origem e sobre a função.');
    }
  }
  function responde(S, i) { if (S.qr != null) return; S.qr = i; if (i === QUIZ[S.qi || 0].r) S.qok = (S.qok || 0) + 1; }

  const oK3 = {
    t: 'Homologia e analogia', s: 'mesma origem ou mesma função', loc: 'Membros anteriores de vertebrados', still: 8.5,
    alt: 'Os membros anteriores de ser humano, baleia, morcego, ave e cão lado a lado, com os ossos nas mesmas cores: úmero em âmbar, rádio e ulna em azul, punho e dedos em verde. Botões mostram a asa da borboleta, sem nenhum desses ossos, agrupam as estruturas pela função (voar, nadar) e abrem um teste de homólogo ou análogo',
    extra: [
      { t: 'Comparar com a borboleta', on: S => { S.bor = !S.bor; if (S.bor) S.modo = 'origem'; }, pressed: S => !!S.bor && S.modo !== 'funcao' && S.modo !== 'quiz' },
      { t: 'Agrupar pela função', on: S => { S.modo = S.modo === 'funcao' ? 'origem' : 'funcao'; }, pressed: S => S.modo === 'funcao' },
      { t: 'Homólogo ou análogo?', on: S => { S.modo = S.modo === 'quiz' ? 'origem' : 'quiz'; S.qr = null; }, pressed: S => S.modo === 'quiz' }
    ],
    d: `<p>Estruturas <b>homólogas</b> têm a <b>mesma origem</b> evolutiva e embrionária, mesmo que hoje tenham funções diferentes. O braço humano, a nadadeira da baleia, a asa do morcego, a asa da ave e a pata do cão têm os mesmos ossos na mesma ordem (<b>úmero</b>, <b>rádio e ulna</b>, ossos do punho e dos dedos), porque vêm do membro anterior de um ancestral comum. Cada linhagem adaptou esse membro a um modo de vida: é a <b>divergência</b> (ou <b>irradiação adaptativa</b>). Só as homologias revelam parentesco e entram na construção do cladograma.</p>
<p>Estruturas <b>análogas</b> têm a <b>mesma função</b>, mas <b>origens diferentes</b>. A asa de uma borboleta (uma dobra da parede do corpo, sem ossos) e a asa de uma ave (um membro com ossos) servem para voar, mas surgiram de forma independente. O formato hidrodinâmico do tubarão (peixe), do golfinho (mamífero) e do extinto ictiossauro (réptil) também é análogo. É a <b>convergência evolutiva</b>: ambientes parecidos selecionam soluções parecidas em linhagens que não são próximas. Atenção: a asa da ave e a asa do morcego são <b>homólogas como membros anteriores</b> (os mesmos ossos), mas <b>análogas como asas</b>, porque o voo surgiu separadamente nas duas linhagens (na ave, a asa é sustentada por penas; no morcego, por uma pele esticada entre os dedos).</p>
<p>Use os botões para comparar com a asa da borboleta, agrupar as estruturas pela função e testar os pares no "Homólogo ou análogo?". Desenho esquemático; cores indicam ossos homólogos.</p>`,
    enem: '<b>Homologia</b> = mesma <b>origem</b>, função pode mudar (braço, nadadeira da baleia, asa do morcego): indica <b>ancestral comum</b> e <b>divergência</b>. <b>Analogia</b> = mesma <b>função</b>, origens diferentes (asa de inseto e de ave; corpo do tubarão e do golfinho): indica <b>convergência</b>, e <b>não</b> indica parentesco. A prova costuma mostrar o desenho dos ossos do membro e perguntar qual conceito ele ilustra.',
    links: [['Lendo um cladograma', '#cladistica/cladograma'], ['Monofilético, parafilético, polifilético', '#cladistica/grupos']],
    init(S) { if (!S.modo) S.modo = 'origem'; S.hits = []; },
    tap(x, y, S) { toca(x, y, S); },
    draw(t, S) {
      const A = area(); S.hits = [];
      if (S.modo === 'funcao') k3Funcao(t, S, A); else if (S.modo === 'quiz') k3Quiz(t, S, A); else k3Origem(t, S, A);
      syncExtra(this, S);
    }
  };

  // =====================================================================================
  // CHAVE DICOTÔMICA (Ch1): oito animais do Brasil
  // =====================================================================================
  const AN = [
    { k: 'tucano', n: 'tucano-toco', sci: [['Ramphastos toco', 1]] },
    { k: 'onca', n: 'onça-pintada', sci: [['Panthera onca', 1]] },
    { k: 'jacare', n: 'jacaré-de-papo-amarelo', sci: [['Caiman latirostris', 1]] },
    { k: 'sapo', n: 'sapo-cururu', sci: [['Rhinella', 1], [' sp.', 0]] },
    { k: 'aranha', n: 'aranha-caranguejeira', sci: [['família Theraphosidae', 0]] },
    { k: 'abelha', n: 'abelha', sci: [['Apis mellifera', 1]] },
    { k: 'minhoca', n: 'minhoca', sci: [['filo Annelida', 0]] },
    { k: 'estrela', n: 'estrela-do-mar', sci: [['classe Asteroidea', 0]] }
  ];
  // passos da chave: A e B levam a outro passo (número) ou a um animal ('L' + índice)
  const PASSO = {
    1: { a: 'Tem coluna vertebral', b: 'Não tem coluna vertebral', A: 2, B: 5, ra: 'tem coluna vertebral', rb: 'não tem coluna vertebral', q: 'a coluna vertebral' },
    2: { a: 'Corpo coberto de penas', b: 'Sem penas', A: 'L0', B: 3, ra: 'com penas', rb: 'sem penas', q: 'as penas' },
    3: { a: 'Corpo coberto de pelos', b: 'Sem pelos', A: 'L1', B: 4, ra: 'com pelos', rb: 'sem pelos', q: 'os pelos' },
    4: { a: 'Pele com escamas secas', b: 'Pele lisa, úmida e sem escamas', A: 'L2', B: 'L3', ra: 'pele com escamas secas', rb: 'pele lisa e úmida', q: 'a pele' },
    5: { a: 'Pernas articuladas', b: 'Sem pernas articuladas', A: 6, B: 7, ra: 'com pernas articuladas', rb: 'sem pernas articuladas', q: 'as pernas' },
    6: { a: 'Oito pernas', b: 'Seis pernas', A: 'L4', B: 'L5', ra: 'oito pernas', rb: 'seis pernas', q: 'quantas pernas ele tem' },
    7: { a: 'Corpo mole, dividido em anéis', b: 'Corpo em forma de estrela, em geral com cinco braços, e espinhos na pele', A: 'L6', B: 'L7', ra: 'corpo mole, em anéis', rb: 'forma de estrela, com espinhos', q: 'a forma do corpo' }
  };
  const ehFolha = n => typeof n === 'string';
  const folha = n => +n.slice(1);
  // caminho correto até o animal i: [{ p: passo, ch: 'A' | 'B' }, ...]
  function caminho(i) {
    const busca = (n, acc) => { if (ehFolha(n)) return folha(n) === i ? acc : null; const P0 = PASSO[n]; return busca(P0.A, acc.concat([{ p: n, ch: 'A' }])) || busca(P0.B, acc.concat([{ p: n, ch: 'B' }])); };
    return busca(1, []);
  }
  const CAM = AN.map((_, i) => caminho(i));
  const leitura = (path, i) => path.map(s => s.ch === 'A' ? PASSO[s.p].ra : PASSO[s.p].rb).join(', ') + (i == null ? '' : ': ' + AN[i].n);

  // ---------- ícones dos animais (traço próprio, coordenadas de -1 a 1) ----------
  function icone(k, x, y, s, o = {}) {
    X.save(); X.translate(x, y); X.scale(s, s);
    const lw = Math.max(1.3, s * .055) / s, ink = o.c || P.txt;
    X.lineWidth = lw; X.lineCap = 'round'; X.lineJoin = 'round'; X.strokeStyle = ink;
    const st = () => X.stroke(), fl = c => { X.fillStyle = c; X.fill(); };
    const E = (cx, cy, rx, ry, r, f) => { X.beginPath(); X.ellipse(cx, cy, rx, ry, r || 0, 0, TAU); if (f) fl(f); st(); };
    const L = (pts, f, close) => { X.beginPath(); pts.forEach((q, i) => i ? X.lineTo(q[0], q[1]) : X.moveTo(q[0], q[1])); if (close) X.closePath(); if (f) fl(f); st(); };
    const dot = (cx, cy, r, c) => { X.beginPath(); X.arc(cx, cy, r, 0, TAU); X.fillStyle = c; X.fill(); };
    try {
      if (k === 'tucano') {
        L([[-.95, .55], [.5, .55]]);                                   // galho
        L([[-.35, .2], [-.78, .78], [-.55, .82], [-.2, .35]], '#2A3148', true);                   // cauda
        E(-.12, .1, .42, .3, -.55, '#2A3148');                         // corpo
        X.beginPath(); X.arc(.28, -.28, .24, 0, TAU); fl('#2A3148'); st();
        X.beginPath(); X.arc(.28, -.22, .15, .2, PI + .6); fl('#E8EDF7');        // papo branco
        X.beginPath(); X.moveTo(.44, -.42); X.quadraticCurveTo(.85, -.5, 1.0, -.22); X.quadraticCurveTo(.8, -.2, .46, -.16); X.closePath(); fl('#F29A38'); st();
        dot(.97, -.25, .05, '#1B1B1B'); dot(.25, -.33, .045, '#0B0F1C');
        for (let i = 0; i < 3; i++) { X.beginPath(); X.arc(-.15 - i * .1, .08 + i * .06, .22, -.3, .9); st(); }    // penas da asa
        L([[-.05, .38], [-.05, .55]]); L([[.08, .36], [.1, .55]]);
      } else if (k === 'onca') {
        L([[-.55, .05], [-.85, -.15], [-.92, -.42]]);                  // cauda
        E(-.05, .05, .58, .26, 0, '#C9913F');
        for (const [lx, ly] of [[-.45, .22], [-.25, .26], [.25, .26], [.42, .22]]) L([[lx, ly], [lx + .02, .62]]);
        X.beginPath(); X.arc(.62, -.18, .22, 0, TAU); fl('#C9913F'); st();
        L([[.5, -.34], [.53, -.48], [.62, -.38]], '#C9913F'); L([[.68, -.38], [.76, -.47], [.78, -.33]], '#C9913F');
        dot(.7, -.2, .035, '#0B0F1C');
        for (const [sx, sy] of [[-.4, -.02], [-.18, .12], [0, -.06], [.2, .1], [-.3, .16], [.3, -.05], [.06, .16]]) { X.beginPath(); X.arc(sx, sy, .06, 0, TAU); X.lineWidth = lw * .9; X.strokeStyle = '#2A1A0A'; X.stroke(); dot(sx, sy, .022, '#2A1A0A'); }
        X.strokeStyle = ink; X.lineWidth = lw;
      } else if (k === 'jacare') {
        L([[-1, .05], [-.4, -.12], [.3, -.12], [.62, -.08], [1, -.02], [1, .06], [.62, .1], [.3, .14], [-.4, .14]], '#6F8A4E', true);
        for (const [lx, d] of [[-.25, -.1], [.32, .1]]) { L([[lx, .12], [lx + d - .1, .38], [lx + d - .2, .4]]); L([[lx + .12, .12], [lx + .12 + d, .36]]); }
        for (let i = 0; i < 9; i++) { const xx = -.6 + i * .12; L([[xx, -.1], [xx + .05, -.18], [xx + .1, -.1]]); }    // escamas do dorso
        for (let i = 0; i < 6; i++) { const xx = -.45 + i * .13; L([[xx, -.06], [xx, .1]]); }
        dot(.62, -.13, .045, '#0B0F1C'); L([[.66, .02], [1, .02]]);
      } else if (k === 'sapo') {
        E(0, .18, .62, .4, 0, '#A07F55');
        X.beginPath(); X.arc(-.28, -.18, .17, 0, TAU); fl('#A07F55'); st(); X.beginPath(); X.arc(.28, -.18, .17, 0, TAU); fl('#A07F55'); st();
        dot(-.28, -.18, .07, '#0B0F1C'); dot(.28, -.18, .07, '#0B0F1C');
        X.beginPath(); X.arc(0, .02, .3, .25, PI - .25); st();       // boca
        L([[-.55, .35], [-.9, .55], [-.6, .62], [-.35, .55]]); L([[.55, .35], [.9, .55], [.6, .62], [.35, .55]]);
        L([[-.22, .55], [-.3, .72]]); L([[.22, .55], [.3, .72]]);
      } else if (k === 'aranha') {
        for (const sg of [-1, 1]) for (let i = 0; i < 4; i++) { const a = -.55 + i * .38; L([[sg * .12, -.12 + i * .06], [sg * (.5 + .05 * i), -.35 + i * .25 + Math.sin(a) * .05], [sg * (.82 - .02 * i), -.1 + i * .3]]); }
        X.beginPath(); X.arc(0, -.12, .2, 0, TAU); fl('#7A5A45'); st();
        E(0, .35, .3, .36, 0, '#7A5A45');
        dot(-.07, -.22, .03, '#E8EDF7'); dot(.07, -.22, .03, '#E8EDF7');
      } else if (k === 'abelha') {
        for (const sg of [-1, 1]) for (let i = 0; i < 3; i++) L([[sg * .1, -.18 + i * .12], [sg * .4, -.28 + i * .2], [sg * .52, -.12 + i * .26]]);
        E(-.32, -.12, .3, .16, .5, 'rgba(200,220,255,.25)'); E(.32, -.12, .3, .16, -.5, 'rgba(200,220,255,.25)');
        X.beginPath(); X.arc(0, -.52, .13, 0, TAU); fl('#3A3020'); st();
        X.beginPath(); X.arc(0, -.22, .17, 0, TAU); fl('#C9A040'); st();
        E(0, .32, .22, .38, 0, '#F2C84B');
        for (const yy of [.18, .34, .5]) { X.beginPath(); X.ellipse(0, yy, .2, .045, 0, 0, TAU); fl('#2A2010'); }
        L([[-.05, -.62], [-.15, -.82]]); L([[.05, -.62], [.15, -.82]]);
      } else if (k === 'minhoca') {
        const pts = []; for (let i = 0; i <= 30; i++) { const u = -.9 + i / 30 * 1.8; pts.push([u, Math.sin(u * 3.2) * .25]); }
        X.beginPath(); pts.forEach((q, i) => i ? X.lineTo(q[0], q[1]) : X.moveTo(q[0], q[1])); X.lineWidth = .26; X.strokeStyle = ink; X.stroke(); X.lineWidth = .26 - 2 * lw; X.strokeStyle = '#C98484'; X.stroke();
        X.lineWidth = lw * .8; X.strokeStyle = 'rgba(60,20,20,.8)';
        for (let i = 2; i < 29; i += 2) { const [px, py] = pts[i], [qx, qy] = pts[i + 1], a = Math.atan2(qy - py, qx - px) + PI / 2; X.beginPath(); X.moveTo(px - Math.cos(a) * .11, py - Math.sin(a) * .11); X.lineTo(px + Math.cos(a) * .11, py + Math.sin(a) * .11); X.stroke(); }
        X.lineWidth = .1; X.strokeStyle = '#E0A0A0'; X.beginPath(); for (let i = 9; i <= 12; i++) i === 9 ? X.moveTo(pts[i][0], pts[i][1]) : X.lineTo(pts[i][0], pts[i][1]); X.stroke();
      } else if (k === 'estrela') {
        X.beginPath(); for (let i = 0; i < 10; i++) { const a = -PI / 2 + i * PI / 5, r = i % 2 ? .36 : .95; i ? X.lineTo(Math.cos(a) * r, Math.sin(a) * r) : X.moveTo(Math.cos(a) * r, Math.sin(a) * r); } X.closePath(); fl('#D9774A'); st();
        for (let i = 0; i < 5; i++) { const a = -PI / 2 + i * TAU / 5; for (const r of [.2, .4, .6, .76]) dot(Math.cos(a) * r, Math.sin(a) * r, .045, '#F5D0B0'); }
      }
    } catch (err) { console.error(err); }
    X.restore();
  }

  // ---------- árvore da chave ----------
  const NIVEL = { 1: 0, 2: 1, 5: 1, 3: 2, 6: 2, 7: 2, 4: 3, L0: 2, L1: 3, L2: 4, L3: 4, L4: 3, L5: 3, L6: 3, L7: 3 };
  function layoutArvore(T) {
    const pos = {}, nf = AN.length, ry = (T.h - (NAR ? 20 : 44)) / 4;
    for (let i = 0; i < nf; i++) pos['L' + i] = [T.x + (i + .5) / nf * T.w, T.y + NIVEL['L' + i] * ry];
    const px = n => { if (pos[n]) return pos[n][0]; const p = PASSO[n], x = (px(p.A) + px(p.B)) / 2; pos[n] = [x, T.y + NIVEL[n] * ry]; return x; };
    px(1); return pos;
  }
  function arvore(S, T, path, alvoFim, modo, prog) {
    const pos = layoutArvore(T), rN = NAR ? 11 : 14, rL = NAR ? 15 : 20;
    // passos e escolhas já feitos
    const feitos = {}; path.forEach(s => { feitos[s.p] = s.ch; });
    const at = path.length ? (PASSO[path[path.length - 1].p][path[path.length - 1].ch]) : 1;
    // arestas
    for (const n in PASSO) {
      const p = PASSO[n], [x0, y0] = pos[n];
      for (const ch of ['A', 'B']) {
        const m = p[ch], [x1, y1] = pos[m], on = feitos[n] === ch;
        line(x0, y0, x1, y1, on ? P.amber : 'rgba(141,156,199,.45)', on ? 3.5 : 1.5);
        if (!NAR) { const f = .32, lx = lerp(x0, x1, f) + (ch === 'A' ? -9 : 9), ly = lerp(y0, y1, f) - 4; tx(ch, lx, ly, { s: 12, w: 700, f: FD, c: on ? P.amber : P.dim }); }
      }
    }
    // nós (passos)
    for (const n in PASSO) {
      const [x, y] = pos[n], foi = n in feitos, agora = !ehFolha(at) && +n === at && modo === 'id';
      if (agora) circ(x, y, rN + 5 + Math.sin((S.tnow || 0) * 3.3) * 1.5, rgba(P.amber, .2));
      circ(x, y, rN, foi || agora ? 'rgba(42,32,14,.95)' : 'rgba(27,36,64,.95)', foi || agora ? P.amber : 'rgba(141,156,199,.7)', foi || agora ? 2 : 1.2);
      tx(String(n), x, y + .5, { s: 12, w: 700, f: FD, c: foi || agora ? P.amber : P.txt, bg: false });
    }
    // folhas (animais)
    for (let i = 0; i < AN.length; i++) {
      const [x, y] = pos['L' + i], fim = alvoFim === i;
      const cor = fim ? (modo === 'id' && S.fimOk === false ? P.erro : modo === 'id' ? P.ok : P.amber) : 'rgba(141,156,199,.55)';
      circ(x, y, rL, fim ? 'rgba(27,36,64,1)' : 'rgba(19,26,43,.95)', cor, fim ? 2.5 : 1.2);
      const oculta = modo === 'id' && alvoFim !== i;
      if (oculta) tx('?', x, y + .5, { s: NAR ? 14 : 16, w: 700, c: P.dim, bg: false }); else icone(AN[i].k, x, y, rL * .72);
      if (!NAR && !oculta) { const nm = AN[i].n.length > 14 ? AN[i].n.split('-')[0] : AN[i].n; tx(nm, x, y + rL + 12, { s: 12, w: fim ? 700 : 400, c: fim ? P.txt : P.dim }); }
      if (modo === 'rev') hit(S, x - rL - 4, y - rL - 4, 2 * rL + 8, 2 * rL + 8, () => { S.rsel = i; S.ru = true; S.rt = S.tnow; });
    }
    return pos;
  }

  function escolhe(S, ch) {
    if (S.modo !== 'id' || S.fim != null) return;
    const n = S.path.length ? PASSO[S.path[S.path.length - 1].p][S.path[S.path.length - 1].ch] : 1;
    if (ehFolha(n)) return;
    S.path.push({ p: n, ch });
    const m = PASSO[n][ch];
    if (ehFolha(m)) { S.fim = folha(m); S.fimOk = S.fim === S.alvo; }
  }
  function novoAlvo(S) { let i; do { i = Math.floor(Math.random() * AN.length); } while (AN.length > 1 && i === S.alvo); S.alvo = i; S.path = []; S.fim = null; S.fimOk = null; }
  function voltaAte(S, k) { S.path = S.path.slice(0, k); S.fim = null; S.fimOk = null; }

  // painel de perguntas e respostas (modo Identifique)
  function painelId(S, Pn) {
    const x = Pn.x, w = Pn.w; let y = Pn.y;
    const cardH = NAR ? 104 : Math.min(210, Pn.h * .42);
    rr(x, y, w, cardH, 12, P.painel, P.painelB, 1);
    const fimOk = S.fim != null && S.fimOk, fimErr = S.fim != null && !S.fimOk;
    if (NAR) {
      const ib = cardH - 16; rr(x + 8, y + 8, ib, ib, 10, 'rgba(11,15,28,.55)', fimOk ? P.ok : 'rgba(255,255,255,.1)', fimOk ? 2 : 1);
      icone(AN[S.alvo].k, x + 8 + ib / 2, y + 8 + ib / 2, ib * .4);
      const tx0 = x + ib + 20, tw0 = w - ib - 30;
      tx(fimOk ? AN[S.alvo].n : 'Animal misterioso', tx0, y + 18, { s: 14, w: 700, a: 'left', c: P.txt, bg: false });
      if (fimOk) mtx(AN[S.alvo].sci, tx0, y + 38, { s: 13, a: 'left', c: P.txt, bg: false });
      else {
        const L = linhas(S.path.length ? 'Caminho: ' + leitura(S.path) : 'Olhe o desenho e responda à chave, passo a passo.', tw0, 12).slice(-4);
        L.forEach((l, i) => tx(l, tx0, y + 40 + i * 16, { s: 12, a: 'left', c: P.dim, bg: false }));
      }
    } else {
      tx(fimOk ? 'Identificado' : 'Animal misterioso', x + 16, y + 20, { s: 14, w: 700, a: 'left', c: fimOk ? P.ok : P.dim, bg: false });
      icone(AN[S.alvo].k, x + w / 2, y + cardH / 2 + 8, Math.min(cardH * .34, w * .2));
    }
    y += cardH + (NAR ? 10 : 16);
    if (S.fim == null) {
      const n = S.path.length ? PASSO[S.path[S.path.length - 1].p][S.path[S.path.length - 1].ch] : 1, p = PASSO[n];
      if (!NAR) { tx(`Passo ${n}`, x, y + 8, { s: 16, w: 600, f: FH, a: 'left', c: P.txt, bg: false }); tx('escolha a alternativa que combina com o desenho', x + 80, y + 9, { s: 12, a: 'left', c: P.dim, bg: false }); y += 26; }
      else { tx(`Passo ${n}: qual combina com o desenho?`, x, y + 8, { s: 13, w: 700, a: 'left', c: P.txt, bg: false }); y += 22; }
      y += botao(S, x, y, w, p.a, () => escolhe(S, 'A'), { letra: 'A', s: NAR ? 13 : 14 }) + 8;
      y += botao(S, x, y, w, p.b, () => escolhe(S, 'B'), { letra: 'B', s: NAR ? 13 : 14 }) + 10;
      if (!NAR && S.path.length) y += bloco('Caminho até aqui: ' + leitura(S.path), x, y + 4, w, { s: 13, c: P.dim }) + 6;
      cap(S.path.length ? `Passo ${n}: leia as duas alternativas antes de escolher.` : 'Um animal misterioso: responda à chave tocando em A ou B. O caminho acende na árvore.');
    } else if (fimOk) {
      if (!NAR) {
        tx(AN[S.fim].n, x, y + 10, { s: 18, w: 700, f: FH, a: 'left', c: P.txt, bg: false });
        mtx(AN[S.fim].sci, x, y + 34, { s: 15, a: 'left', c: P.txt, bg: false }); y += 54;
      }
      tx('Confere com o desenho.', x, y + 8, { s: 14, w: 700, a: 'left', c: P.ok, bg: false }); y += 24;
      y += bloco(leitura(CAM[S.fim], S.fim), x, y, w, { s: 13, c: P.dim }) + 10;
      y += botao(S, x, y, Math.min(w, 220), 'Outro animal', () => novoAlvo(S));
      cap('Chegou ao nome seguindo os passos em ordem. Toque em <b>Outro animal</b> para tentar de novo.');
    } else {
      const div = S.path.findIndex((s, i) => { const c = CAM[S.alvo][i]; return !c || c.p !== s.p || c.ch !== s.ch; });
      const k = div < 0 ? 0 : div, passo = S.path[k].p;
      mtx([[AN[S.fim].n + ' (', 0]].concat(AN[S.fim].sci, [[')', 0]]), x, y + 10, { s: NAR ? 13 : 15, w: 600, a: 'left', c: P.txt, bg: false }); y += 30;
      tx('Não confere com o desenho.', x, y, { s: 14, w: 700, a: 'left', c: P.erro, bg: false }); y += 14;
      y += bloco(`Volte ao passo ${passo} e olhe de novo ${PASSO[passo].q}.`, x, y, w, { s: 13, c: P.txt }) + 10;
      const bw = NAR ? (w - 8) / 2 : Math.min((w - 8) / 2, 200);
      const h1 = botao(S, x, y, bw, `Voltar ao passo ${passo}`, () => voltaAte(S, k));
      y += Math.max(h1, botao(S, x + bw + 8, y, bw, 'Recomeçar', () => voltaAte(S, 0)));
      cap(`A chave chegou a um nome que não bate com o desenho. Volte ao <b>passo ${passo}</b> e olhe de novo a característica.`);
    }
    return y;
  }

  // painel do modo Ao contrário: mostra o caminho inteiro de um animal
  function painelRev(S, Pn, t) {
    const x = Pn.x, w = Pn.w; let y = Pn.y;
    if (!S.ru && t - (S.rt || 0) > 7) { S.rsel = ((S.rsel || 0) + 1) % AN.length; S.rt = t; }
    const i = S.rsel || 0, cam = CAM[i], n = cam.length, prog = Math.min(n, Math.floor((t - (S.rt || 0)) / .9) + 1);
    const cardH = NAR ? 84 : 110;
    rr(x, y, w, cardH, 12, P.painel, P.painelB, 1);
    const ib = cardH - 16; rr(x + 8, y + 8, ib, ib, 10, 'rgba(11,15,28,.55)', 'rgba(255,255,255,.1)', 1);
    icone(AN[i].k, x + 8 + ib / 2, y + 8 + ib / 2, ib * .4);
    tx(AN[i].n, x + ib + 20, y + cardH / 2 - 10, { s: NAR ? 14 : 17, w: 700, f: NAR ? FT : FH, a: 'left', c: P.txt, bg: false });
    mtx(AN[i].sci, x + ib + 20, y + cardH / 2 + 12, { s: 13, a: 'left', c: P.txt, bg: false });
    y += cardH + 12;
    tx('O caminho na chave:', x, y + 6, { s: 13, w: 700, a: 'left', c: P.dim, bg: false }); y += 22;
    if (NAR) {
      const s = leitura(cam.slice(0, prog), prog >= n ? i : null);
      y += bloco(s, x, y, w, { s: 13, c: P.txt }) + 6;
    } else {
      cam.forEach((st, j) => {
        if (j >= prog) return;
        const txt = st.ch === 'A' ? PASSO[st.p].a : PASSO[st.p].b;
        circ(x + 12, y + 10, 10, 'rgba(42,32,14,.95)', P.amber, 1.5); tx(String(st.p), x + 12, y + 10.5, { s: 12, w: 700, f: FD, c: P.amber, bg: false });
        y += Math.max(22, bloco(`${st.ch}: ${txt}`, x + 30, y + 2, w - 30, { s: 13, c: P.txt })) + 6;
      });
      if (prog >= n) { tx('chega a: ' + AN[i].n, x, y + 8, { s: 14, w: 700, a: 'left', c: P.amber, bg: false }); y += 26; }
    }
    y += bloco('Toque num animal da árvore para ver o caminho dele.', x, y + 4, w, { s: 12, c: P.dim }) + 6;
    cap(`<b>Ao contrário</b>: ${leitura(cam, i)}.`);
    return { y, path: cam.slice(0, prog), fim: prog >= n ? i : null };
  }

  const oCh1 = {
    t: 'Chave dicotômica', s: 'duas opções por vez, até o nome', loc: 'Oito animais do Brasil', still: 1, ctl: false,
    alt: 'Uma chave dicotômica de oito animais do Brasil desenhada como árvore de decisão que cresce para baixo. Um animal misterioso aparece em desenho; o aluno responde a cada passo tocando em A ou B, e o caminho acende na árvore até o nome. No modo Ao contrário, a tela mostra o caminho inteiro de cada animal',
    extra: [
      { t: 'Outro animal', on: S => { if (S.modo === 'rev') { S.rsel = ((S.rsel || 0) + 1) % AN.length; S.ru = true; S.rt = S.tnow; } else novoAlvo(S); }, pressed: () => false },
      { t: 'Ao contrário', on: S => { S.modo = S.modo === 'rev' ? 'id' : 'rev'; S.rt = S.tnow; S.ru = false; }, pressed: S => S.modo === 'rev' }
    ],
    d: `<p>Uma <b>chave dicotômica</b> é uma ferramenta para <b>identificar</b> um ser vivo. Ela funciona como uma sequência de perguntas com <b>duas alternativas</b> que se excluem ("tem penas" ou "não tem penas"). Cada escolha leva a uma nova pergunta ou ao nome do ser. Os biólogos usam chaves em campo e em museus para identificar plantas, insetos, peixes; os guias de aves e de árvores são cheios delas.</p>
<p>Uma boa chave usa características <b>fáceis de observar</b> e que não dependem de opinião (contar pernas é melhor que "é bonito" ou "é grande"). A chave não precisa seguir a ordem do parentesco: ela serve para chegar ao nome, não para contar a história evolutiva. E pode terminar em níveis diferentes: numa ponta, a espécie (<i>Panthera onca</i>); noutra, só o gênero (<i>Rhinella</i> sp.) ou um grupo maior, quando não é possível ir além só olhando.</p>
<div class="tab"><table><thead><tr><th>Passo</th><th>Alternativa A</th><th>Alternativa B</th></tr></thead><tbody>
<tr><td>1</td><td>Tem coluna vertebral: vá ao passo 2</td><td>Não tem coluna vertebral: vá ao passo 5</td></tr>
<tr><td>2</td><td>Corpo coberto de penas: <b>tucano-toco</b> (<i>Ramphastos toco</i>)</td><td>Sem penas: vá ao passo 3</td></tr>
<tr><td>3</td><td>Corpo coberto de pelos: <b>onça-pintada</b> (<i>Panthera onca</i>)</td><td>Sem pelos: vá ao passo 4</td></tr>
<tr><td>4</td><td>Pele com escamas secas: <b>jacaré-de-papo-amarelo</b> (<i>Caiman latirostris</i>)</td><td>Pele lisa, úmida e sem escamas: <b>sapo-cururu</b> (<i>Rhinella</i> sp.)</td></tr>
<tr><td>5</td><td>Pernas articuladas: vá ao passo 6</td><td>Sem pernas articuladas: vá ao passo 7</td></tr>
<tr><td>6</td><td>Oito pernas: <b>aranha-caranguejeira</b> (família Theraphosidae)</td><td>Seis pernas: <b>abelha</b> (<i>Apis mellifera</i>)</td></tr>
<tr><td>7</td><td>Corpo mole, dividido em anéis: <b>minhoca</b> (filo Annelida)</td><td>Corpo em forma de estrela, em geral com cinco braços, e espinhos na pele: <b>estrela-do-mar</b> (classe Asteroidea)</td></tr>
</tbody></table></div>
<p>Na animação, identifique o animal misterioso tocando em A ou B (no teclado, as letras A e B também respondem). No modo <b>Ao contrário</b>, escolha um animal na árvore e veja o caminho inteiro dele na chave.</p>`,
    enem: 'Questões com <b>chave dicotômica</b> dão a chave pronta e um ser vivo (ou uma descrição dele) e pedem o nome ou o grupo. O segredo é <b>seguir os passos em ordem</b>, sem pular, e ler as duas alternativas antes de escolher. Lembre que a chave serve para <b>identificar</b>, não para mostrar parentesco: dois seres vizinhos na chave não são, por isso, parentes próximos.',
    links: [['Nomenclatura binomial', '#nomes/binomial'], ['Lendo um cladograma', '#cladistica/cladograma']],
    init(S) { if (!S.modo) S.modo = 'id'; if (S.alvo == null) novoAlvo(S); S.hits = []; S.tnow = S.ph || 0; },
    tap(x, y, S) { toca(x, y, S); },
    draw(t, S) {
      const A = area(); S.hits = []; S.tnow = t; if (S.alvo == null) novoAlvo(S);
      let Pn, T;
      if (NAR) Pn = { x: A.x0, y: A.y0, w: A.w, h: A.h };
      else { const pw = Math.min(420, A.w * .38); Pn = { x: A.x0, y: A.y0, w: pw, h: A.h }; T = { x: A.x0 + pw + 36, y: A.y0 + 22, w: A.w - pw - 36, h: A.h - 26 }; }
      if (S.modo === 'rev') {
        const r = painelRev(S, Pn, t);
        if (NAR) T = { x: A.x0 + 6, y: r.y + 22, w: A.w - 12, h: A.y1 - r.y - 30 };
        arvore(S, T, r.path, r.fim, 'rev');
      } else {
        const yb = painelId(S, Pn);
        if (NAR) T = { x: A.x0 + 6, y: yb + 22, w: A.w - 12, h: A.y1 - yb - 30 };
        arvore(S, T, S.path, S.fim, 'id');
      }
      if (!NAR) { const sep = A.x0 + Math.min(420, A.w * .38) + 18; line(sep, A.y0 + 4, sep, A.y1 - 4, 'rgba(91,108,153,.35)', 1); }
      syncExtra(this, S);
    }
  };
  // teclado: A e B respondem à chave quando ela está aberta
  addEventListener('keydown', e => {
    if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || e.altKey || e.ctrlKey || e.metaKey) return;
    const k = e.key.toLowerCase(); if (k !== 'a' && k !== 'b') return;
    let h = ''; try { h = decodeURIComponent(location.hash.slice(1)); } catch (err) { h = ''; }
    if (h !== 'chave/dicotomica') return;
    if (oCh1._S) escolhe(oCh1._S, k.toUpperCase());
  });
  // guarda a referência do estado atual da chave para o teclado
  const drawCh1 = oCh1.draw; oCh1.draw = function (t, S) { this._S = S; return drawCh1.call(this, t, S); };

  def('cladistica', 'homologia', oK3);
  def('chave', 'dicotomica', oCh1);
}
