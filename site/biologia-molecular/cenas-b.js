/* LAB · Biologia Molecular. Cenas: lipídios, proteínas, ácidos nucleicos. Código e textos da equipe (Apolo). */
'use strict';
const BASE = { A: '#39E58C', T: '#FF4F6D', G: '#FFC53D', C: '#3FA9FF', U: '#C77DFF' };
const PUR = { A: 1, G: 1 };

// cadeia em zigue-zague (hidrocarboneto); kink: índice onde há dupla cis (dobra) ou trans (sem dobra)
function zz(x, y, n, ang, sg, o = {}) {
  const pts = [[x, y]]; let a = ang, px = x, py = y;
  for (let i = 1; i <= n; i++) { if (o.cis && i === o.cis) a += .55; const z = (i % 2 ? 1 : -1) * .5; px += Math.cos(a + z) * sg; py += Math.sin(a + z) * sg; pts.push([px, py]); }
  poly(pts, o.c || 'rgba(232,237,247,.8)', o.lw || 2);
  if (o.dupla) { const k = o.dupla, [ax, ay] = pts[k - 1], [bx, by] = pts[k], nx = -(by - ay), ny = bx - ax, L = Math.hypot(nx, ny) || 1; line(ax + nx / L * 3.5, ay + ny / L * 3.5, bx + nx / L * 3.5, by + ny / L * 3.5, C.s, 2); }
  return pts;
}


// =====================================================================================
// KIT 3D por matriz Z (distância em Å, ângulo e diedro em graus): gera as posições dos átomos para o MOL3D.cena
// =====================================================================================
const vv = {
  s: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], d: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], k: (a, k) => [a[0] * k, a[1] * k, a[2] * k],
  x: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], p: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  n: a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }, m: (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t],
  rz: (a, q) => [a[0] * Math.cos(q) - a[1] * Math.sin(q), a[0] * Math.sin(q) + a[1] * Math.cos(q), a[2]], ry: (a, q) => [a[0] * Math.cos(q) + a[2] * Math.sin(q), a[1], -a[0] * Math.sin(q) + a[2] * Math.cos(q)],
  rx: (a, q) => [a[0], a[1] * Math.cos(q) - a[2] * Math.sin(q), a[1] * Math.sin(q) + a[2] * Math.cos(q)]
};
const gr = d => d * PI / 180;
// transformação: gira (x, depois y, depois z, em graus) e move para o ponto at
const mover = (at, rx = 0, ry = 0, rz = 0) => p => vv.s(at, vv.rz(vv.ry(vv.rx(p, gr(rx)), gr(ry)), gr(rz)));
// transformação por base: o ponto local (x, y, z) vira o + ex x + ey y + ez z
const baseT = (o, ex, ey) => { const ez = vv.x(ex, ey); return p => vv.s(o, vv.s(vv.k(ex, p[0]), vv.s(vv.k(ey, p[1]), vv.k(ez, p[2])))); };
function zmat() {
  const Z = { P: {}, E: {}, ids: [], L: [] };
  // refs: [a, b, c]; liga a. distância a-novo, ângulo novo-a-b, diedro novo-a-b-c
  Z.add = (id, el, refs, d, ang, dih, o = {}) => {
    const P = Z.P; let p;
    if (!refs.length) p = [0, 0, 0];
    else if (refs.length === 1) p = vv.s(P[refs[0]], [d, 0, 0]);
    else if (refs.length === 2) { const a = P[refs[0]], u = vv.n(vv.d(P[refs[1]], a)), w = vv.n(vv.x([0, 0, 1], u)); p = vv.s(a, vv.k(vv.s(vv.k(u, Math.cos(gr(ang))), vv.k(w, Math.sin(gr(ang)))), d)); }
    else {
      const a = P[refs[0]], b = P[refs[1]], c = P[refs[2]], bc = vv.n(vv.d(a, b)), n = vv.n(vv.x(vv.d(b, c), bc)), m = vv.x(n, bc), th = gr(ang), ph = gr(dih);
      p = vv.s(a, vv.k(vv.s(vv.k(bc, -Math.cos(th)), vv.s(vv.k(m, Math.sin(th) * Math.cos(ph)), vv.k(n, Math.sin(th) * Math.sin(ph)))), d));
    }
    P[id] = p; Z.E[id] = { el, o }; Z.ids.push(id);
    if (refs.length && !o.sem) Z.L.push([refs[0], id, o.ordem || 1]);
    return id;
  };
  Z.lig = (a, b, ordem = 1, extra) => Z.L.push([a, b, ordem, extra]);
  // cria os átomos e as ligações no modelo; T leva as coordenadas locais ao palco; devolve {id: índice}
  Z.emit = (M, T, base = {}) => {
    const I = {};
    Z.ids.forEach(id => { const a = Z.E[id]; if (a.o.virt) return; I[id] = M.atomo(a.el, T(Z.P[id]), Object.assign({}, base, a.o)); });
    Z.L.forEach(([a, b, ordem, extra]) => { if (I[a] != null && I[b] != null) M.ligacao(I[a], I[b], Object.assign({ ordem }, extra)); });
    return I;
  };
  Z.w = (id, T) => T(Z.P[id]);
  return Z;
}
// ponto sem volume que acompanha um nó: serve de ponta de uma ligação que nasce ou some (a ligação some quando .esc vai a 0)
const fantasma = (M, p, o) => M.atomo('X', p, Object.assign({ r: [0, 0] }, o));

// ---------- grafo: átomos com coordenadas e ligações; hid() completa os hidrogênios pela valência ----------
function cone(u0, ang, k, n, off = 0) { // direção a "ang" graus de u0, k-ésima de n em volta
  const w = Math.abs(u0[1]) < .9 ? [0, 1, 0] : [1, 0, 0], p1 = vv.n(vv.x(u0, w)), p2 = vv.x(u0, p1), f = off + k * 2 * PI / n;
  return vv.s(vv.k(u0, Math.cos(gr(ang))), vv.k(vv.s(vv.k(p1, Math.cos(f)), vv.k(p2, Math.sin(f))), Math.sin(gr(ang))));
}
function grafo() {
  const G = { a: [], b: [] };
  G.at = (el, p, o = {}) => (G.a.push({ el, p, o }), G.a.length - 1);
  G.lig = (i, j, ordem = 1, extra) => G.b.push([i, j, ordem, extra]);
  G.hid = () => {
    const val = { C: 4, N: 3, O: 2 }, len = { C: 1.09, N: 1.01, O: .96 }, n0 = G.a.length, viz = G.a.map(() => []), soma = G.a.map(() => 0);
    G.b.forEach(([i, j, o]) => { viz[i].push(j); viz[j].push(i); soma[i] += o; soma[j] += o; });
    for (let i = 0; i < n0; i++) {
      const a = G.a[i], v = val[a.el]; if (!v || a.o.semH) continue;
      const nh = v - soma[i]; if (nh <= 0 || !viz[i].length) continue;
      const u = viz[i].map(j => vv.n(vv.d(G.a[j].p, a.p))); let dirs = [];
      if (u.length === 1) for (let k = 0; k < nh; k++) dirs.push(cone(u[0], 109.5, k, nh));
      else if (u.length === 2 && nh === 1) dirs.push(vv.k(vv.n(vv.s(u[0], u[1])), -1));
      else if (u.length === 2) { const b = vv.k(vv.n(vv.s(u[0], u[1])), -1), nn = vv.n(vv.x(u[0], u[1])); dirs.push(vv.s(vv.k(b, .577), vv.k(nn, .816)), vv.s(vv.k(b, .577), vv.k(nn, -.816))); }
      else dirs.push(vv.k(vv.n(vv.s(vv.s(u[0], u[1]), u[2])), -1));
      dirs.forEach(d => { const h = G.at('H', vv.s(a.p, vv.k(d, len[a.el])), { no: a.o.no, grupo: a.o.grupo, pai: i }); G.lig(i, h, 1); });
    }
    return G;
  };
  G.emit = (M, T, base = {}) => {
    const I = G.a.map(a => M.atomo(a.el, T(a.p), Object.assign({}, base, a.o)));
    G.b.forEach(([i, j, ordem, extra]) => { if (!(extra && extra.sem)) M.ligacao(I[i], I[j], Object.assign({ ordem }, extra)); });
    return I;
  };
  return G;
}

// ---------- lip/glicerideos em 3D: glicerol + 3 ácidos graxos (12 carbonos, sem os ganchos longos) ----------
const GL3 = { k: [] };
// ácido graxo: Oe (virtual) é o O do glicerol; c1 é a carbonila; dupla entre c(dup) e c(dup+1), cis ou trans
function aciloZ(n, dup, cis, real) {
  const Z = zmat(), nm = j => (j <= 0 ? 'Oe' : 'c' + j);
  Z.add('Oe', 'O', [], 0, 0, 0, real ? {} : { virt: true }); Z.add('c1', 'C', ['Oe'], 1.34, 0, 0); Z.add('od', 'O', ['c1', 'Oe'], 1.21, 123, 0, { ordem: 2 });
  Z.add('c2', 'C', ['c1', 'Oe', 'od'], 1.51, 111, 180);
  for (let i = 3; i <= n; i++) {
    const r = [nm(i - 1), nm(i - 2), nm(i - 3)];
    if (dup && i === dup + 1) Z.add('c' + i, 'C', r, 1.34, 124, 180, { ordem: 2 });
    else if (dup && i === dup + 2) Z.add('c' + i, 'C', r, 1.5, 124, cis ? 0 : 180);
    else Z.add('c' + i, 'C', r, 1.53, 112, 180);
  }
  for (let i = 2; i <= n; i++) {
    const a = 'c' + i, p = nm(i - 1), s = 'c' + (i + 1);
    if (i === n) [180, 60, -60].forEach((d, k) => Z.add(`h${i}_${k}`, 'H', [a, p, nm(i - 2)], 1.09, 109.5, d));
    else if (dup && (i === dup || i === dup + 1)) Z.add('h' + i, 'H', [a, p, s], 1.08, 118, 180);
    else { Z.add(`h${i}a`, 'H', [a, p, s], 1.09, 109.5, 121); Z.add(`h${i}b`, 'H', [a, p, s], 1.09, 109.5, -121); }
  }
  if (!real) Z.add('hoa', 'H', ['Oe', 'c1', 'od'], .96, 108, 180, { virt: true });
  return Z;
}
function glicerolZ() {
  const Z = zmat();
  Z.add('g2', 'C', [], 0, 0, 0); Z.add('g1', 'C', ['g2'], 1.52, 0, 0); Z.add('g3', 'C', ['g2', 'g1'], 1.52, 112, 0);
  Z.add('o1', 'O', ['g1', 'g2', 'g3'], 1.43, 109.5, 180); Z.add('o3', 'O', ['g3', 'g2', 'g1'], 1.43, 109.5, 180); Z.add('o2', 'O', ['g2', 'g1', 'g3'], 1.43, 109.5, 120);
  Z.add('h2', 'H', ['g2', 'g1', 'g3'], 1.09, 109.5, -120);
  Z.add('h1a', 'H', ['g1', 'g2', 'o1'], 1.09, 109.5, 120); Z.add('h1b', 'H', ['g1', 'g2', 'o1'], 1.09, 109.5, -120);
  Z.add('h3a', 'H', ['g3', 'g2', 'o3'], 1.09, 109.5, 120); Z.add('h3b', 'H', ['g3', 'g2', 'o3'], 1.09, 109.5, -120);
  Z.add('ho1', 'H', ['o1', 'g1', 'g2'], .96, 108, 180, { virt: true }); Z.add('ho2', 'H', ['o2', 'g2', 'g1'], .96, 108, 180, { virt: true }); Z.add('ho3', 'H', ['o3', 'g3', 'g2'], .96, 108, 180, { virt: true });
  return Z;
}
function glic3dMontar(M) {
  const COR = C.creme, TIPO = [
    { id: 'sat', nome: 'Ácido graxo saturado', frase: 'Só ligações simples entre os carbonos: a cadeia é reta e as moléculas se empilham bem.', dup: 0 },
    { id: 'cis', nome: 'Ácido graxo insaturado (cis)', frase: 'A dupla ligação cis dobra a cadeia; as moléculas se empilham mal e a gordura fica líquida.', dup: 6, cis: true },
    { id: 'trans', nome: 'Ácido graxo trans', frase: 'A dupla ligação trans deixa a cadeia quase reta, como a de um ácido saturado; por isso a gordura trans é sólida.', dup: 6, cis: false }];
  GL3.k = [];
  const Zg = glicerolZ(), dirs = [1, 2, 3].map(k => vv.d(Zg.P['o' + k], Zg.P['g' + k])), m = dirs.reduce((s, d) => vv.s(s, d), [0, 0, 0]), rot = -Math.atan2(m[1], m[0]);
  const Tg = p => vv.rz(p, rot);
  M.grupo('gl', { nome: 'Glicerol', cor: COR, frase: 'Álcool de 3 carbonos com 3 grupos hidroxila (–OH), onde se ligam os ácidos graxos.' });
  M.grupo('agua', { nome: 'Água', cor: '#8FD8FF', frase: 'Sai uma molécula de água a cada ligação éster: o –OH do ácido e um H do glicerol.' });
  const Ig = Zg.emit(M, Tg, { grupo: 'gl' });
  const ids = [];
  [1, 2, 3].forEach(k => {
    const t = TIPO[k - 1], og = Tg(Zg.P['o' + k]), Za = aciloZ(12, t.dup, t.cis), id = 'ac' + k;
    // o eixo do trecho reto da cadeia (c2 a c6) é virado para a direção ex de cada ácido, para abrir um leque legível
    const ex = vv.n([[1, .3, 0], [1, 0, .35], [1, -.3, 0]][k - 1]), nref = [[0, 0, 1], [0, 1, 0], [0, 0, 1]][k - 1], ey = vv.n(vv.x(vv.n(vv.d(nref, vv.k(ex, vv.p(nref, ex)))), ex)), ez = vv.x(ex, ey);
    const la = vv.n(vv.d(Za.P.c6, Za.P.c2)), lb = vv.x([0, 0, 1], la), Rl = baseT([0, 0, 0], ex, ey), Ta = p => vv.s(og, Rl([vv.p(p, la), vv.p(p, lb), p[2]]));
    M.grupo(id, { nome: t.nome, cor: COR, frase: t.frase }); M.no(id, { origem: og, eixo: [0, 0, 1] });
    const Ia = Za.emit(M, Ta, { no: id, grupo: id });
    // ligação éster que nasce: fantasma na posição da carbonila, ligado ao O do glicerol
    const d1 = fantasma(M, Ta(Za.P.c1), { no: id, grupo: id, cor: M.atomos[Ia.c1].cor }); M.ligacao(Ig['o' + k], d1);
    // –OH do ácido que sai: fantasma na posição do O do –OH, ligado à carbonila
    const d2 = fantasma(M, og, { no: id, grupo: id, cor: '#FF4D4D' }); M.ligacao(Ia.c1, d2);
    // água formada: O e H do ácido no nó oh, H do glicerol no nó gh; longe da cadeia, perpendicular ao plano dela
    const Wc = vv.s(og, vv.s(vv.k(ex, 2.2), vv.k(ez, (vv.p(ez, [0, 1, .6]) >= 0 ? 1 : -1) * 4.2))), Zw = zmat();
    Zw.add('O', 'O', [], 0, 0, 0, { no: 'oh' + k, grupo: 'agua' }); Zw.add('H1', 'H', ['O'], .96, 0, 0, { no: 'oh' + k, grupo: 'agua' }); Zw.add('H2', 'H', ['O', 'H1'], .96, 104.5, 0, { no: 'gh' + k, grupo: 'agua', sem: true });
    Zw.L.push(['O', 'H1', 1]);
    M.no('oh' + k); M.no('gh' + k);
    const Tw = baseT(Wc, ex, ey), Iw = Zw.emit(M, Tw);
    const d3 = fantasma(M, Tw(Zw.P.O), { no: 'oh' + k, grupo: 'agua', cor: '#FF4D4D' }); M.ligacao(d3, Iw.H2);
    const d4 = fantasma(M, Tg(Zg.P['ho' + k]), { grupo: 'gl', cor: '#FF4D4D' }); // O-H do glicerol que se desfaz
    const hb = Tg(Zg.P['ho' + k]); M.ligacao(Ig['o' + k], d4);
    GL3.k.push({ id, ex, ey, ez, og, Wc, hFim: Tw(Zw.P.H2), hBase: hb, d1: M.atomos[d1], d2: M.atomos[d2], d3: M.atomos[d3], d4: M.atomos[d4], ang: [.3, 0, -.3][k - 1] });
    ids.push({ Ia, Za, Ta, t });
  });
  M.rotulo(Ig.g2, 'glicerol', 0); M.rotulo(Ig.o2, 'ligação éster', 1);
  M.rotulo(ids[1].Ia['c' + 7], 'dupla cis', 2); M.rotulo(ids[2].Ia['c' + 7], 'dupla trans', 3); M.rotulo(ids[0].Ia.c9, 'só ligações simples', 4);
  M.vista = { th: -.35, fi: .28, zoom: 1.15 };
}
function glic3dAnimar(M, P) {
  GL3.k.forEach((a, i) => {
    const d = i * .3, e = P.passo === 0 ? 0 : P.passo === 1 ? P.entre(d, d + 2.4) : 1, f = P.passo === 0 ? 0 : P.passo === 1 ? P.entre(d + .5, d + 2) : 1;
    const flut = P.passo === 0 ? Math.sin(P.t * 1.3 + i * 2) * .35 : 0, sh = vv.s(vv.k(a.ex, 4.8 * (1 - e)), vv.k(a.ey, flut));
    const no = M.nos[a.id]; no.pos = sh;
    const leque = P.passo === 2 ? P.entre(0, 1.4) : 0; no.ang = a.ang * leque;
    M.nos['oh' + (i + 1)].pos = vv.k(vv.d(vv.s(a.og, sh), a.Wc), 1 - f);
    M.nos['gh' + (i + 1)].pos = vv.k(vv.d(a.hBase, a.hFim), 1 - f);
    a.d1.esc = P.passo === 0 ? 0 : cl((e - .75) * 4, 0, 1); a.d2.esc = cl(1 - f * 8, 0, 1); a.d3.esc = f; a.d4.esc = cl(1 - f * 8, 0, 1);
  });
}

// ---------- prot/aminoacidos em 3D: o esqueleto fica; o grupo R troca (esc 0 e 1) conforme o controle ----------
const AA3 = { cur: -1, prev: -1 };
function aminoZ() {
  const Z = zmat(), A = [];
  Z.add('ca', 'C', [], 0, 0, 0, { grupo: 'ca' });
  Z.add('n', 'N', ['ca'], 1.46, 0, 0, { grupo: 'am' }); Z.add('c', 'C', ['ca', 'n'], 1.52, 110.5, 0, { grupo: 'cx' });
  Z.add('h', 'H', ['ca', 'n', 'c'], 1.09, 109.5, 120, { grupo: 'ca' });
  Z.add('hn1', 'H', ['n', 'ca', 'c'], 1.01, 115, 60, { grupo: 'am' }); Z.add('hn2', 'H', ['n', 'ca', 'c'], 1.01, 115, -60, { grupo: 'am' });
  Z.add('o', 'O', ['c', 'ca', 'n'], 1.21, 121, 0, { ordem: 2, grupo: 'cx' }); Z.add('ox', 'O', ['c', 'ca', 'o'], 1.34, 112, 180, { grupo: 'cx' }); Z.add('hox', 'H', ['ox', 'c', 'ca'], .97, 107, 180, { grupo: 'cx' });
  const ch3 = (id, c, p, n, g) => [60, 180, -60].forEach((d, k) => Z.add(`${id}${k}`, 'H', [c, p, n], 1.09, 109.5, d, g));
  const ch2 = (id, c, p, n, g) => { Z.add(id + 'a', 'H', [c, p, n], 1.09, 109.5, 121, g); Z.add(id + 'b', 'H', [c, p, n], 1.09, 109.5, -121, g); };
  // R0 glicina: H
  const g0 = { no: 'R0', grupo: 'R0' }; Z.add('r0', 'H', ['ca', 'n', 'c'], 1.09, 109.5, -120, g0);
  // R1 alanina: CH3
  const g1 = { no: 'R1', grupo: 'R1' }; Z.add('b1', 'C', ['ca', 'n', 'c'], 1.53, 110, -120, g1); ch3('hb1_', 'b1', 'ca', 'n', g1);
  // R2 serina: CH2OH
  const g2 = { no: 'R2', grupo: 'R2' }; Z.add('b2', 'C', ['ca', 'n', 'c'], 1.53, 110, -120, g2); Z.add('og2', 'O', ['b2', 'ca', 'n'], 1.43, 109.5, 180, g2); Z.add('hg2', 'H', ['og2', 'b2', 'ca'], .96, 108, 60, g2);
  Z.add('hb2a', 'H', ['b2', 'ca', 'n'], 1.09, 109.5, 60, g2); Z.add('hb2b', 'H', ['b2', 'ca', 'n'], 1.09, 109.5, -60, g2);
  // R3 fenilalanina: CH2 + anel benzênico
  const g3 = { no: 'R3', grupo: 'R3' }; Z.add('b3', 'C', ['ca', 'n', 'c'], 1.53, 110, -120, g3); ch2('hb3', 'b3', 'ca', 'n', g3);
  Z.add('cg', 'C', ['b3', 'ca', 'n'], 1.51, 112, 180, g3); Z.add('cd1', 'C', ['cg', 'b3', 'ca'], 1.39, 120, 90, Object.assign({ ordem: 2 }, g3)); Z.add('ce1', 'C', ['cd1', 'cg', 'b3'], 1.39, 120, 180, g3);
  Z.add('cz', 'C', ['ce1', 'cd1', 'cg'], 1.39, 120, 0, Object.assign({ ordem: 2 }, g3)); Z.add('ce2', 'C', ['cz', 'ce1', 'cd1'], 1.39, 120, 0, g3); Z.add('cd2', 'C', ['ce2', 'cz', 'ce1'], 1.39, 120, 0, Object.assign({ ordem: 2 }, g3));
  Z.lig('cd2', 'cg', 1);
  [['cd1', 'cg', 'ce1'], ['ce1', 'cd1', 'cz'], ['cz', 'ce1', 'ce2'], ['ce2', 'cz', 'cd2'], ['cd2', 'ce2', 'cg']].forEach(([c, p, n]) => Z.add('h' + c, 'H', [c, p, n], 1.08, 120, 180, g3));
  // R4 lisina: (CH2)4 NH2
  const g4 = { no: 'R4', grupo: 'R4' }; Z.add('b4', 'C', ['ca', 'n', 'c'], 1.53, 110, -120, g4); Z.add('g4', 'C', ['b4', 'ca', 'n'], 1.53, 110, 180, g4); Z.add('d4', 'C', ['g4', 'b4', 'ca'], 1.53, 110, 180, g4);
  Z.add('e4', 'C', ['d4', 'g4', 'b4'], 1.53, 110, 180, g4); Z.add('z4', 'N', ['e4', 'd4', 'g4'], 1.47, 110, 180, g4);
  ch2('hb4', 'b4', 'ca', 'g4', g4); ch2('hg4', 'g4', 'b4', 'd4', g4); ch2('hd4', 'd4', 'g4', 'e4', g4); ch2('he4', 'e4', 'd4', 'z4', g4);
  Z.add('hz4a', 'H', ['z4', 'e4', 'd4'], 1.01, 109.5, 60, g4); Z.add('hz4b', 'H', ['z4', 'e4', 'd4'], 1.01, 109.5, -60, g4);
  return Z;
}
function amino3dMontar(M) {
  const Z = aminoZ(), T = mover([0, 0, 0], 0, 0, 0);
  const R = [['Grupo R: H (glicina)', 'O menor grupo R: um único hidrogênio. A glicina é o único aminoácido sem carbono assimétrico. Não essencial.'], ['Grupo R: CH₃ (alanina)', 'Grupo metila, pequeno e hidrofóbico. Não essencial.'], ['Grupo R: CH₂OH (serina)', 'Tem uma hidroxila (–OH): polar, faz ligações de hidrogênio com a água. Não essencial.'], ['Grupo R: CH₂ e anel (fenilalanina)', 'Anel benzênico hidrofóbico e volumoso. Aminoácido essencial: vem da dieta, e a fenilcetonúria é a falha em usá-lo.'], ['Grupo R: (CH₂)₄NH₂ (lisina)', 'Cadeia longa terminada em um grupo amino que pode ganhar carga positiva. Aminoácido essencial: o feijão é rica fonte.']];
  M.grupo('ca', { nome: 'Carbono alfa', cor: C.creme, frase: 'Carbono central: liga o grupo amino, a carboxila, um hidrogênio e o grupo R.' });
  M.grupo('am', { nome: 'Grupo amino (–NH₂)', cor: '#4D7DFF', frase: 'Parte básica do aminoácido; forma a ligação peptídica com a carboxila do vizinho.' });
  M.grupo('cx', { nome: 'Grupo carboxila (–COOH)', cor: '#FF4D4D', frase: 'Parte ácida do aminoácido; perde o OH na ligação peptídica.' });
  R.forEach((r, i) => { M.grupo('R' + i, { nome: r[0], cor: C.prot, frase: r[1] }); M.no('R' + i, { origem: T(Z.P[i === 0 ? 'r0' : 'b' + i]) }); });
  const I = Z.emit(M, T);
  M.rotulo(I.n, 'grupo amino', 1); M.rotulo(I.c, 'grupo carboxila', 2); M.rotulo(I.ca, 'carbono alfa', 0);
  [I.r0, I.b1, I.b2, I.b3, I.b4].forEach((a, i) => M.rotulo(a, 'grupo R', 3));
  AA3.cur = -1; AA3.prev = -1;
  M.vista = { th: -.5, fi: .3, zoom: 1.05 };
}
function amino3dAnimar(M, P) {
  if (P.passo !== AA3.cur) { AA3.prev = AA3.cur; AA3.cur = P.passo; }
  for (let i = 0; i < 5; i++) {
    const no = M.nos['R' + i];
    no.esc = i === AA3.cur ? P.entre(AA3.prev < 0 ? 0 : .35, AA3.prev < 0 ? .01 : 1.1) : i === AA3.prev ? 1 - P.entre(0, .4) : 0;
  }
  M.enquadrar([.72, .76, .86, .92, .9][Math.min(4, P.passo)]); // aproxima conforme o tamanho do grupo R da vez
  M.corSuja = true; // nós escondidos encolhem as ligações a zero e mudam a ordem das instâncias: recolore todo quadro
}

// ---------- prot/peptidica em 3D: glicina + alanina; a carboxila perde o OH, o amino perde um H, sai água e nasce a ligação C-N ----------
const PEP3 = {};
function dipepZ() {
  const Z = zmat(), g = { no: null }, G = { grupo: 'gly' }, A = { no: 'ala', grupo: 'ala' }, PG = { grupo: 'pep' }, PA = { no: 'ala', grupo: 'pep' };
  Z.add('n1', 'N', [], 0, 0, 0, G); Z.add('ca1', 'C', ['n1'], 1.46, 0, 0, G); Z.add('c1', 'C', ['ca1', 'n1'], 1.52, 110.5, 0, PG);
  Z.add('hn1a', 'H', ['n1', 'ca1', 'c1'], 1.01, 115, 60, G); Z.add('hn1b', 'H', ['n1', 'ca1', 'c1'], 1.01, 115, -60, G);
  Z.add('ha1a', 'H', ['ca1', 'n1', 'c1'], 1.09, 109.5, 120, G); Z.add('ha1b', 'H', ['ca1', 'n1', 'c1'], 1.09, 109.5, -120, G);
  Z.add('o1', 'O', ['c1', 'ca1', 'n1'], 1.23, 121, -30, Object.assign({ ordem: 2 }, PG));
  Z.add('n2', 'N', ['c1', 'ca1', 'n1'], 1.33, 116, 150, Object.assign({ sem: true }, PA)); // a ligação C-N vem de um fantasma
  Z.add('hn2', 'H', ['n2', 'c1', 'o1'], .99, 119, 180, PA);
  Z.add('hg', 'H', ['n2', 'c1', 'o1'], 1.01, 109, 0, Object.assign({ virt: true }));   // posição de partida do H que sai (virtual)
  Z.add('ca2', 'C', ['n2', 'c1', 'ca1'], 1.46, 122, 180, A); Z.add('c2', 'C', ['ca2', 'n2', 'c1'], 1.52, 110.5, -140, A);
  Z.add('ha2', 'H', ['ca2', 'n2', 'c2'], 1.09, 109.5, 120, A); Z.add('cb2', 'C', ['ca2', 'n2', 'c2'], 1.53, 110, -120, A);
  [60, 180, -60].forEach((d, k) => Z.add('hb2_' + k, 'H', ['cb2', 'ca2', 'n2'], 1.09, 109.5, d, A));
  Z.add('o2', 'O', ['c2', 'ca2', 'n2'], 1.21, 121, 0, Object.assign({ ordem: 2 }, A)); Z.add('ox2', 'O', ['c2', 'ca2', 'o2'], 1.34, 112, 180, A); Z.add('hox2', 'H', ['ox2', 'c2', 'ca2'], .97, 107, 180, A);
  Z.add('ow', 'O', ['c1', 'ca1', 'n1'], 1.33, 116, 150, { virt: true }); Z.add('how', 'H', ['ow', 'c1', 'o1'], .97, 107, 180, { virt: true });
  return Z;
}
function pep3dMontar(M) {
  const Z = dipepZ(), T = mover([0, 0, 0], 0, 0, 0), P = k => T(Z.P[k]);
  M.grupo('gly', { nome: 'Glicina', cor: C.prot, frase: 'O aminoácido mais simples: o grupo R é um H. Perde o OH da carboxila na ligação.' });
  M.grupo('ala', { nome: 'Alanina', cor: C.prot, frase: 'Grupo R é um CH₃. Perde um H do grupo amino na ligação.' });
  M.grupo('pep', { nome: 'Ligação peptídica', cor: '#FFC53D', frase: 'Ligação C–N entre a carboxila de um aminoácido e o amino do seguinte. É plana e rígida, e liga os dois aminoácidos em dipeptídeo.' });
  M.grupo('agua', { nome: 'Água', cor: '#8FD8FF', frase: 'Sai uma molécula de água a cada ligação peptídica (síntese por desidratação).' });
  M.no('ala', { origem: P('n2') }); M.no('oh'); M.no('gh');
  const I = Z.emit(M, T);
  const c1 = P('c1'), n2 = P('n2'), d = vv.n(vv.d(n2, c1)), ez = vv.n(vv.x(d, vv.d(P('o1'), c1))), sg = vv.p(ez, [0, 1, .6]) >= 0 ? 1 : -1, Wc = vv.s(n2, vv.s(vv.k(ez, 4.4 * sg), vv.k(d, .6)));
  // fantasmas: ligação C-N que nasce, C-OH que se desfaz, N-H que se desfaz, e a água
  const d1 = fantasma(M, n2, { no: 'ala', grupo: 'pep', cor: '#4D7DFF' }); M.ligacao(I.c1, d1);
  const d2 = fantasma(M, n2, { grupo: 'pep', cor: '#FF4D4D' }); M.ligacao(I.c1, d2);
  const Zw = zmat(); Zw.add('O', 'O', [], 0, 0, 0, { no: 'oh', grupo: 'agua' }); Zw.add('H1', 'H', ['O'], .96, 0, 0, { no: 'oh', grupo: 'agua' }); Zw.add('H2', 'H', ['O', 'H1'], .96, 104.5, 0, { no: 'gh', grupo: 'agua', sem: true }); Zw.L.push(['O', 'H1', 1]);
  const Tw = baseT(Wc, d, ez), Iw = Zw.emit(M, Tw);
  const d3 = fantasma(M, Wc, { no: 'oh', grupo: 'agua', cor: '#FF4D4D' }); M.ligacao(d3, Iw.H2);
  const d4 = fantasma(M, n2, { no: 'ala', grupo: 'ala', cor: '#4D7DFF' }); M.ligacao(d4, Iw.H2);
  // plano da ligação peptídica
  const ctr = vv.m(c1, n2, .5), pa = fantasma(M, vv.s(ctr, vv.k(d, -1.6)), { grupo: 'pep', cor: '#9A8548' }), pb = fantasma(M, vv.s(ctr, vv.k(d, 1.6)), { grupo: 'pep', cor: '#9A8548' });
  M.ligacao(pa, pb, { forma: 'placa', cor: '#9A8548', larg: [3, 3], esp: [.1, .1], cima: ez });
  Object.assign(PEP3, { d, ez, n2, c1, Wc, hFim: Tw(Zw.P.H2), hBase: P('hg'), oBase: n2, d1: M.atomos[d1], d2: M.atomos[d2], d3: M.atomos[d3], d4: M.atomos[d4], pa: M.atomos[pa], pb: M.atomos[pb] });
  M.rotulo(I.n1, 'ponta amino (N)', 1); M.rotulo(I.ox2, 'ponta carboxila (C)', 2);
  // passo 1: a ligação ainda não existe, o rótulo marca o C da carboxila; depois, o N que se ligou a ele
  const f0 = fantasma(M, c1, { grupo: 'pep', cor: '#FFC53D' }); PEP3.f0 = M.atomos[f0];
  M.rotulo(f0, 'onde vai se formar a ligação peptídica', 0); M.rotulo(d1, 'ligação peptídica', 0);
  M.vista = { th: -.4, fi: .3, zoom: 1.05 };
}
function pep3dAnimar(M, P) {
  const p = PEP3, gap = 4.5, e = P.passo === 0 ? 0 : P.passo === 1 ? P.entre(.2, 2.6) : 1, f = P.passo === 0 ? 0 : P.passo === 1 ? P.entre(.4, 1.7) : 1;
  const flut = P.passo === 0 ? Math.sin(P.t * 1.3) * .3 : 0, sh = vv.s(vv.k(p.d, gap * (1 - e)), vv.k(p.ez, flut));
  M.nos.ala.pos = sh;
  M.nos.oh.pos = vv.k(vv.d(p.oBase, p.Wc), 1 - f);
  M.nos.gh.pos = vv.k(vv.d(vv.s(p.hBase, sh), p.hFim), 1 - f);
  p.d1.esc = P.passo === 0 ? 0 : cl((e - .7) * 4, 0, 1); p.d2.esc = cl(1 - f * 8, 0, 1); p.d3.esc = f; p.d4.esc = cl(1 - f * 8, 0, 1);
  const pl = P.passo === 2 ? P.entre(.2, 1) : 0; p.pa.esc = pl; p.pb.esc = pl; p.f0.esc = P.passo === 0 ? 1 : 0;
}

// ---------- prot/niveis em 3D: uma cadeia de 27 aminoácidos (esferas no carbono alfa) que se transforma; no quarto nível entram mais três cadeias e os grupos heme ----------
const NV3 = { cur: -1, de: null, pos: null, T: [], cor: null };
function nvPosicoes() {
  const N = 27, hel = k => [k * 1.5, 2.3 * Math.cos(gr(100 * k)), 2.3 * Math.sin(gr(100 * k))];
  const fita = (j, volta) => volta ? [(5 - j) * 3.3, j % 2 ? .9 : -.9, 4.8] : [j * 3.3, j % 2 ? -.9 : .9, 0];
  const bez = (a, b, c, t) => vv.s(vv.s(vv.k(a, (1 - t) * (1 - t)), vv.k(b, 2 * (1 - t) * t)), vv.k(c, t * t));
  const rz = (p, g) => vv.rz(p, gr(g)), ry = (p, g) => vv.ry(p, gr(g));
  const monta = (hT, fT, ctrl) => { // hT e fT transformam hélice e hairpin; ctrl é o desvio da alça
    const P = [];
    for (let k = 0; k < 12; k++) P.push(hT(hel(k)));
    const a = P[11], b = fT(fita(0, false)), m = vv.s(vv.m(a, b, .5), ctrl);
    for (let q = 1; q <= 3; q++) P.push(bez(a, m, b, q / 4));
    for (let j = 0; j < 6; j++) P.push(fT(fita(j, false)));
    for (let j = 0; j < 6; j++) P.push(fT(fita(j, true)));
    return P;
  };
  const T = [];
  T[0] = Array.from({ length: N }, (_, i) => [(i - 13) * 2.3, 3.2 * Math.sin(i * .85), 1.8 * Math.cos(i * .85)]);
  T[1] = monta(p => vv.s(p, [-19, 8, 0]), p => vv.s(p, [3, -9, -2.4]), [0, 0, 7]);
  const h2 = p => vv.s(rz(p, 90), [-3, -9, 0]), f2 = p => vv.s(rz(p, -90), [3, 7.5, -2.4]);
  T[2] = monta(h2, f2, [0, 4, 3]);
  const c = [0, 0, 0]; T[2].forEach(p => { c[0] += p[0] / N; c[1] += p[1] / N; c[2] += p[2] / N; });
  const quat = [[-15, 10, 0], [15, 10, 180], [15, -10, 0], [-15, -10, 180]]; // x, z, giro em y
  NV3.quat = quat.map(([x, z, g]) => T[2].map(p => vv.s(ry(vv.d(p, c), g), [x, 0, z])));
  T[3] = NV3.quat[0]; NV3.cen = c;
  return T;
}
function niv3dMontar(M) {
  const T = nvPosicoes(), N = 27, pal = ['#FFB3E6', '#E07AD8', '#9C7BFF', '#7FD6FF', '#FFD27A', '#8CE8B0'], COR_A = '#E07AD8', COR_B = '#B66FD9';
  NV3.T = T; NV3.cur = -1; NV3.pos = T[0].map(p => p.slice()); NV3.de = null;
  M.grupo('cA', { nome: 'Cadeia polipeptídica', cor: COR_A, frase: 'Cada esfera é um aminoácido (no carbono alfa); os aminoácidos se unem por ligações peptídicas.' });
  M.grupo('cB', { nome: 'Cadeia beta', cor: COR_B, frase: 'Na hemoglobina, duas cadeias alfa e duas beta formam a proteína completa.' });
  M.grupo('heme', { nome: 'Grupo heme', cor: '#C9303B', frase: 'Anel que prende um átomo de ferro (Fe), onde o oxigênio se liga. Cada cadeia da hemoglobina leva um.' });
  const cadeia = (ci, grupo, cor0) => {
    const I = [];
    for (let i = 0; i < N; i++) { const S = i === 9 || i === 25; I.push(M.atomo(S ? 'S' : 'X', ci ? NV3.quat[ci][i] : T[0][i], { grupo, cor: S ? '#F2D24B' : cor0(i), r: [.9, 1.6], nome: S ? 'Cisteína' : 'Aminoácido ' + (i + 1), frase: S ? 'Aminoácido com enxofre: duas cisteínas formam uma ponte dissulfeto que firma a dobra.' : 'Um aminoácido da cadeia, ligado ao vizinho por ligação peptídica.' })); }
    for (let i = 0; i < N - 1; i++) M.ligacao(I[i], I[i + 1], { raio: .24, cor: '#C9D3E6' });
    return I;
  };
  NV3.A = cadeia(0, 'cA', i => pal[i % 6]);
  NV3.O = [1, 2, 3].map(c => cadeia(c, c === 2 ? 'cA' : 'cB', () => (c === 2 ? COR_A : COR_B)));
  // ligações de hidrogênio da cadeia A: hélice (i e i+4) e hairpin (fita 1 com fita 2)
  NV3.pH = []; for (let i = 0; i < 8; i++) NV3.pH.push(M.ponteH(NV3.A[i + 4], NV3.A[i], { k: 0 }));
  for (let j = 0; j < 6; j++) NV3.pH.push(M.ponteH(NV3.A[15 + j], NV3.A[26 - j], { k: 0 }));
  // pontas, âncoras de rótulo e ponte dissulfeto
  const anc = o => fantasma(M, [0, 0, 0], o);
  NV3.anc = { hel: anc({ grupo: 'cA' }), fita: anc({ grupo: 'cA' }), ss: anc({ grupo: 'cA', cor: '#F2D24B' }), ss2: anc({ grupo: 'cA', cor: '#F2D24B' }), pep: anc({ grupo: 'cA' }), alfa: anc({ grupo: 'cA' }), beta: anc({ grupo: 'cB' }) };
  M.ligacao(NV3.anc.ss, NV3.anc.ss2, { raio: .2, cor: '#F2D24B' });
  M.rotulo(NV3.A[0], 'ponta amino (N)', 1); M.rotulo(NV3.A[26], 'ponta carboxila (C)', 2); M.rotulo(NV3.anc.pep, 'ligação peptídica', 3);
  M.rotulo(NV3.anc.hel, 'alfa-hélice', 0); M.rotulo(NV3.anc.fita, 'folha beta', 4); M.rotulo(NV3.anc.ss, 'ponte dissulfeto', 5); M.rotulo(NV3.anc.alfa, 'cadeia alfa', 6); M.rotulo(NV3.anc.beta, 'cadeia beta', 7);
  // heme: ferro com uma placa vermelha em cada cadeia
  NV3.heme = [0, 1, 2, 3].map(c => { const p = vv.s(NV3.quat[c][13], [0, 0, 0]), f = M.atomo('Fe', p, { grupo: 'heme', nome: 'Ferro do heme', frase: 'O átomo de ferro prende uma molécula de O₂ no sangue.' }), a = fantasma(M, vv.s(p, [-3, 0, 0]), { grupo: 'heme', cor: '#C9303B' }), b = fantasma(M, vv.s(p, [3, 0, 0]), { grupo: 'heme', cor: '#C9303B' }); M.ligacao(a, b, { forma: 'placa', cor: '#C9303B', larg: [4.2, 4.2], esp: [.5, .5], cima: [0, 0, 1] }); return [f, a, b]; });
  M.rotulo(NV3.heme[0][0], 'grupo heme', 8);
  M.vista = { th: -.4, fi: .3, zoom: 1 };
}
function niv3dAnimar(M, P) {
  const N = 27, T = NV3.T, A = NV3.A, ps = P.passo, cs = i => (i < 12 ? '#E07AD8' : i < 15 ? '#E8EDF7' : '#8E8CFF'), pal = ['#FFB3E6', '#E07AD8', '#9C7BFF', '#7FD6FF', '#FFD27A', '#8CE8B0'];
  if (ps !== NV3.cur) {
    NV3.de = NV3.cur < 0 ? T[ps].map(p => p.slice()) : NV3.pos.map(p => p.slice()); NV3.cur = ps;
    A.forEach((a, i) => { if (i === 9 || i === 25) return; M.atomos[a].cor = ps === 0 ? pal[i % 6] : ps === 3 ? '#E07AD8' : cs(i); }); M.corSuja = true;
  }
  const alvo = ps === 3 ? NV3.quat[0] : T[ps];
  for (let i = 0; i < N; i++) {
    const u = ss(cl((P.tp - i * .035) / 1.5, 0, 1)); NV3.pos[i] = vv.m(NV3.de[i], alvo[i], u);
    M.atomos[A[i]].p = NV3.pos[i];
  }
  const set = (id, p, e) => { const a = M.atomos[id]; a.p = p; a.esc = e; };
  const A_ = NV3.anc, pp = NV3.pos, sec = ps >= 1 ? 1 : 0;
  set(A_.hel, vv.s(pp[5], [0, 2.4, 0]), sec); set(A_.fita, vv.s(pp[18], [0, 2.4, 0]), sec); set(A_.pep, vv.m(pp[9], pp[10], .5), ps === 0 ? 1 : 0);
  set(A_.ss, pp[9], ps >= 2 ? P.entre(.6, 1.2) : 0); set(A_.ss2, pp[25], ps >= 2 ? P.entre(.6, 1.2) : 0);
  set(A_.alfa, vv.s(NV3.quat[0][12], [0, 9, 0]), ps === 3 ? 1 : 0); set(A_.beta, vv.s(NV3.quat[1][12], [0, 9, 0]), ps === 3 ? 1 : 0);
  NV3.pH.forEach((p, i) => { p.k = ps >= 1 ? P.linear(.9 + (i % 8) * .06, 1.3 + (i % 8) * .06) : 0; });
  NV3.O.forEach((I, c) => I.forEach((a, i) => { M.atomos[a].esc = ps === 3 ? P.entre(.3 + c * .35 + i * .008, .9 + c * .35 + i * .008) : 0; }));
  NV3.heme.forEach(([f, a, b], c) => { const e = ps === 3 ? P.entre(1.6 + c * .1, 2.4 + c * .1) : 0; M.atomos[f].esc = e; M.atomos[a].esc = e; M.atomos[b].esc = e; if (c === 0) { [f, a, b].forEach((id, q) => { M.atomos[id].p = vv.s(pp[13], [[0, 0, 0], [-2.1, 0, 0], [2.1, 0, 0]][q]); }); } });
  M.enquadrar([1, .72, .6, .95][ps]);
}

// ---------- na/nucleotideo em 3D: pentose plana no plano xy, base em pé na face de cima, fosfato no carbono 5 ----------
const NU3 = {};
function baseG(G, tipo, N, e1, e2, no) {
  const pt = (x, y) => vv.s(N, vv.s(vv.k(e1, x), vv.k(e2, y))), gB = 'base', A = (el, x, y, o = {}) => G.at(el, pt(x, y), Object.assign({ grupo: gB, no }, o)), I = {};
  const dirOut = (c, x, y, d, L) => { const v = vv.n(vv.d(c, d)); return vv.s(c, vv.k(v, L)); };
  if (tipo === 'A') {
    const R5 = 1.165, c5 = [R5, 0], P5 = a => [c5[0] + R5 * Math.cos(gr(a)), c5[1] + R5 * Math.sin(gr(a))];
    const n9 = [0, 0], c8 = P5(108), n7 = P5(36), c5a = P5(-36), c4 = P5(-108), M = [(c4[0] + c5a[0]) / 2, (c4[1] + c5a[1]) / 2], nn = vv.n([M[0] - c5[0], M[1] - c5[1], 0]), hc = [M[0] + nn[0] * 1.204, M[1] + nn[1] * 1.204];
    const ang = p => Math.atan2(p[1] - hc[1], p[0] - hc[0]), a4 = ang(c4), a5 = ang(c5a); let s = Math.sin(a5 - a4 - gr(60)) < Math.sin(a5 - a4 + gr(60)) ? 1 : -1;
    const hv = k => [hc[0] + 1.39 * Math.cos(a4 + s * gr(60 * k)), hc[1] + 1.39 * Math.sin(a4 + s * gr(60 * k))], n3 = hv(1), c2 = hv(2), n1 = hv(3), c6 = hv(4);
    I.n = A('N', ...n9); I.c8 = A('C', ...c8); I.n7 = A('N', ...n7); I.c5 = A('C', ...c5a); I.c4 = A('C', ...c4); I.n3 = A('N', ...n3); I.c2 = A('C', ...c2); I.n1 = A('N', ...n1); I.c6 = A('C', ...c6);
    const n6 = [c6[0] + (c6[0] - hc[0]) / 1.39 * 1.34, c6[1] + (c6[1] - hc[1]) / 1.39 * 1.34]; I.n6 = A('N', ...n6);
    [[I.n, I.c8, 1], [I.c8, I.n7, 2], [I.n7, I.c5, 1], [I.c5, I.c4, 2], [I.c4, I.n, 1], [I.c4, I.n3, 1], [I.n3, I.c2, 2], [I.c2, I.n1, 1], [I.n1, I.c6, 2], [I.c6, I.c5, 1], [I.c6, I.n6, 1]].forEach(b => G.lig(...b));
    I.pontaN = [I.n6, I.n1]; I.hc = pt(...hc);
  } else { // pirimidina: N1 na origem, anel com centro em (1,4, 0)
    const hc = [1.4, 0], v = a => [hc[0] + 1.4 * Math.cos(gr(a)), hc[1] + 1.4 * Math.sin(gr(a))], f = (p, L) => { const d = [p[0] - hc[0], p[1] - hc[1]], l = Math.hypot(...d); return [p[0] + d[0] / l * L, p[1] + d[1] / l * L]; };
    const c2 = v(120), n3 = v(60), c4 = v(0), c5 = v(-60), c6 = v(-120);
    I.n = A('N', 0, 0); I.c2 = A('C', ...c2); I.n3 = A('N', ...n3); I.c4 = A('C', ...c4); I.c5 = A('C', ...c5); I.c6 = A('C', ...c6);
    I.o2 = A('O', ...f(c2, 1.22)); const l = [[I.n, I.c2, 1], [I.c2, I.n3, tipo === 'C' ? 1 : 1], [I.n3, I.c4, tipo === 'C' ? 2 : 1], [I.c4, I.c5, 1], [I.c5, I.c6, 2], [I.c6, I.n, 1], [I.c2, I.o2, 2]];
    if (tipo === 'C') { I.n4 = A('N', ...f(c4, 1.34)); l.push([I.c4, I.n4, 1]); I.pontaN = [I.n4, I.n3]; }
    else { I.o4 = A('O', ...f(c4, 1.22)); l.push([I.c4, I.o4, 2]); I.pontaN = [I.o4, I.n3]; }
    if (tipo === 'T') { const p5 = f(c5, 1.5); I.met = A('C', ...p5, { no: no + 'met' }); l.push([I.c5, I.met, 1]); I.p5 = p5; I.c5xy = c5; }
    l.forEach(b => G.lig(...b)); I.hc = pt(...hc);
  }
  return I;
}
// um nucleotídeo completo; T leva ao palco; nos: prefixo dos nós
function nucleotidoG(tipo, no, rna) {
  const G = grafo(), Rr = 1.276, ang = [90, 18, -54, -126, 162], rad = a => [Math.cos(gr(a)), Math.sin(gr(a)), 0], at = a => vv.k(rad(a), Rr), Z = [0, 0, 1];
  const S = (a, dz, L) => vv.s(vv.s(at(a), vv.k(rad(a), .55 * L)), vv.k(Z, dz * .83 * L));
  const gS = 'acucar', gF = 'fosfato', I = {};
  I.o4 = G.at('O', at(ang[0]), { grupo: gS, no }); I.c1 = G.at('C', at(ang[1]), { grupo: gS, no }); I.c2 = G.at('C', at(ang[2]), { grupo: gS, no }); I.c3 = G.at('C', at(ang[3]), { grupo: gS, no }); I.c4 = G.at('C', at(ang[4]), { grupo: gS, no });
  [[I.o4, I.c1], [I.c1, I.c2], [I.c2, I.c3], [I.c3, I.c4], [I.c4, I.o4]].forEach(b => G.lig(...b));
  I.o3 = G.at('O', S(ang[3], -1, 1.43), { grupo: gS, no }); G.lig(I.c3, I.o3);
  I.o2 = G.at('O', S(ang[2], -1, 1.43), { grupo: gS, no: no + 'oh' }); G.lig(I.c2, I.o2);
  I.c5 = G.at('C', S(ang[4], 1, 1.52), { grupo: gS, no }); G.lig(I.c4, I.c5);
  const c5 = G.a[I.c5].p, o5 = vv.s(c5, vv.k(vv.n([-.8, .25, .55]), 1.43)); I.o5 = G.at('O', o5, { grupo: gF, no }); G.lig(I.c5, I.o5);
  const pP = vv.s(o5, vv.k(vv.n([-.8, .35, .45]), 1.6)); I.p = G.at('P', pP, { grupo: gF, no }); G.lig(I.o5, I.p);
  const u0 = vv.n(vv.d(o5, pP)); I.op1 = G.at('O', vv.s(pP, vv.k(cone(u0, 109.5, 0, 3), 1.48)), { grupo: gF, no }); G.lig(I.p, I.op1, 2);
  I.op2 = G.at('O', vv.s(pP, vv.k(cone(u0, 109.5, 1, 3), 1.55)), { grupo: gF, no }); G.lig(I.p, I.op2);
  I.op3 = G.at('O', vv.s(pP, vv.k(cone(u0, 109.5, 2, 3), 1.55)), { grupo: gF, no: no + 'w' }); G.lig(I.p, I.op3, 1, no === 'b' ? { sem: true } : undefined); // só o b perde esse OH (a ligação dele é a fantasma dW)
  // base
  const rc = rad(ang[1]), e1 = vv.n(vv.s(vv.k(rc, .55), vv.k(Z, .83))), e2 = [-Math.sin(gr(18)), Math.cos(gr(18)), 0], N = vv.s(at(ang[1]), vv.k(vv.n(vv.s(vv.k(rc, .55), vv.k(Z, .83))), 1.47));
  const B = baseG(G, tipo, N, e1, e2, no); G.lig(I.c1, B.n); I.B = B;
  // H5 da uracila (aparece quando a timina vira uracila)
  if (tipo === 'T') { const c5p = G.a[B.c5].p, d = vv.n(vv.d(G.a[B.met].p, c5p)); I.h5 = G.at('H', vv.s(c5p, vv.k(d, 1.08)), { grupo: 'base', no: no + 'h5', semH: true }); G.lig(B.c5, I.h5); }
  G.hid(); // antes do hd: assim o C2' ganha o seu H automático (CH2 no DNA, CH com OH no RNA)
  // H do 2' do DNA (no lugar do OH)
  const d2 = vv.n(vv.d(G.a[I.o2].p, G.a[I.c2].p)); I.hd = G.at('H', vv.s(G.a[I.c2].p, vv.k(d2, 1.09)), { grupo: gS, no: no + 'hd', semH: true }); G.lig(I.c2, I.hd);
  I.hO3 = G.a.findIndex(h => h.el === 'H' && h.o.pai === I.o3); G.a[I.hO3].o.no = no + 'x'; G.b.forEach(b => { if (b[0] === I.o3 && b[1] === I.hO3) b[3] = { sem: true }; });
  return { G, I };
}
function nuc3dMontar(M) {
  const gr0 = { nome: 'Fosfato', cor: C.p, frase: 'Grupo com fósforo e oxigênios; une um nucleotídeo ao seguinte e dá carga negativa ao DNA e ao RNA.' };
  M.grupo('fosfato', gr0); M.grupo('acucar', { nome: 'Pentose', cor: C.creme, frase: 'Açúcar de cinco carbonos. No DNA é a desoxirribose; no RNA, a ribose, com um OH a mais no carbono 2.' }); M.grupo('base', { nome: 'Base nitrogenada', cor: BASE.T, frase: 'Parte que carrega a informação: A, G (purinas, dois anéis) ou C, T, U (pirimidinas, um anel).' });
  const T1 = mover([0, 0, 0], -20, 75, -10), n1 = nucleotidoG('T', 'a'), n2 = nucleotidoG('A', 'b');
  // o segundo nucleotídeo: o P dele fica a 1,6 A do O3' do primeiro, para baixo e para o lado
  const o3 = n1.G.a[n1.I.o3].p, pL = n2.G.a[n2.I.p].p, alvoP = vv.s(o3, vv.k(vv.n([.4, -.7, -.5]), 1.6)), V = vv.d(alvoP, pL), T2 = p => T1(vv.s(p, V)), rot = d => vv.d(T1(d), T1([0, 0, 0]));
  M.no('a'); ['ahd', 'ah5', 'amet', 'aoh', 'aw', 'ax'].forEach(id => M.no(id)); M.no('b'); ['bhd', 'boh', 'bw', 'bx'].forEach(id => M.no(id, { pai: 'b' }));
  NU3.n1 = n1; NU3.n2 = n2; NU3.V = V;
  const I1 = n1.G.emit(M, T1), I2 = n2.G.emit(M, T2);
  NU3.I1 = I1; NU3.I2 = I2;
  // ligação fosfodiéster: fantasma no P do 2.o, ligado ao O3' do primeiro
  const dP = fantasma(M, T2(pL), { no: 'b', grupo: 'fosfato', cor: C.p }); M.ligacao(I1[n1.I.o3], dP);
  const dW = fantasma(M, T2(n2.G.a[n2.I.op3].p), { no: 'b', grupo: 'fosfato', cor: '#FF4D4D' }); M.ligacao(I2[n2.I.p], dW);
  const dH = fantasma(M, T1(n1.G.a[n1.I.hO3].p), { no: 'a', grupo: 'acucar', cor: '#F2F4F8' }); M.ligacao(I1[n1.I.o3], dH);
  NU3.dP = M.atomos[dP]; NU3.dW = M.atomos[dW]; NU3.dH = M.atomos[dH]; NU3.out = rot(vv.n([-.7, -.2, .7])); NU3.ent = rot(vv.n(V));
  M.rotulo(I1[n1.I.p], 'fosfato', 1); M.rotulo(I1[n1.I.c3], 'pentose', 2); M.rotulo(I1[n1.I.B.c4], 'base', 3);
  M.vista = { th: -.6, fi: .35, zoom: .8 };
}
function nuc3dAnimar(M, P) {
  const ps = P.passo, N = NU3, gr1 = ps >= 1 ? P.entre(0, 1.2) : 0, e2 = ps === 2 ? P.entre(0, 2) : 0;
  M.nos.aoh.esc = gr1; M.nos.ahd.esc = 1 - gr1; M.nos.boh.esc = 1; M.nos.bhd.esc = 0; // o b entra já como ribonucleotídeo, igual ao a M.nos.amet.esc = 1 - gr1; M.nos.ah5.esc = gr1;
  const sl = ps === 2 ? 1 - e2 : 0, fw = ps === 2 ? P.entre(2.2, 3.4) : 0; // o segundo nucleotídeo entra; depois sai a água
  M.nos.b.esc = ps === 2 ? P.entre(0, .6) : 0; M.nos.b.pos = vv.k(N.ent, 7 * sl);
  M.nos.bw.pos = vv.k(N.out, 3.4 * fw); M.nos.bw.esc = 1 - fw; M.nos.ax.pos = vv.k(N.out, 3.4 * fw); M.nos.ax.esc = 1 - fw;
  M.corSuja = true;
  N.dP.esc = ps === 2 ? cl((P.tp - 2) * 4, 0, 1) : 0; N.dW.esc = 1 - cl(fw * 8, 0, 1); N.dH.esc = 1 - cl(fw * 8, 0, 1);
}

// ---------- lip/classes em 3D: bicamada de fosfolipídios, colesterol e cera (três modelos no mesmo palco; o controle escolhe qual aparece) ----------
const CL3 = { cur: -1, prev: -1 };
function fosfolipidio(M, T, no, R, cis) {
  const L = [], at = (el, p, o = {}) => { const i = M.atomo(el, T(p), Object.assign({ no, grupo: 'cab' }, o)); L.push(i); return i; };
  const lig = (a, b, o) => M.ligacao(a, b, o);
  const N = at('N', [0, 11.2, 0]), c1 = at('C', [.2, 10, .8]), c2 = at('C', [-.3, 8.9, -.3]), o0 = at('O', [0, 7.8, .3]), P = at('P', [0, 6.6, 0]), o1 = at('O', [1.3, 6.9, .6]), o2 = at('O', [-1.2, 6.7, .9]), o3 = at('O', [0, 5.5, -.9]);
  const g1 = at('C', [.1, 4.4, -.4], { grupo: 'gli' }), g2 = at('C', [.8, 3.3, .5], { grupo: 'gli' }), g3 = at('C', [-.7, 3.2, -.7], { grupo: 'gli' });
  [[N, c1], [c1, c2], [c2, o0], [o0, P], [P, o1], [P, o2], [P, o3], [o3, g1], [g1, g2], [g1, g3]].forEach(([a, b]) => lig(a, b));
  const cauda = (x0, z0, ox, oz, kink) => { // éster + 12 carbonos zigue-zague para baixo
    const cE = at('C', [x0, 2.2, z0], { grupo: 'cau' }), oE = at('O', [x0 + ox, 2.7, z0 + oz], { grupo: 'gli' }); lig(cE, oE, { ordem: 2 });
    let prev = cE, x = x0, z = z0, y = 2.2, dx = 0;
    for (let i = 1; i <= 9; i++) { y -= 1.2; x += (i % 2 ? .5 : -.5) + (kink && i > kink ? .45 : 0); const c = at('C', [x, y, z + (i % 2 ? .3 : -.3)], { grupo: 'cau', cor: '#F2B36B', r: [.34, .8] }); lig(prev, c, { raio: .11 }); prev = c; }
    return cE;
  };
  const a = cauda(.9, .6, 1.1, .4, 0), b = cauda(-1.1, -.8, -1.1, -.4, cis ? 5 : 0); lig(g2, a); lig(g3, b);
  return L;
}
function aguaRand(M, p, no) { const o = M.atomo('O', p, { no, grupo: 'h2o' }), u = vv.n([Math.random() - .5, Math.random() - .5, Math.random() - .5]), w = vv.n(vv.x(u, [0, 1, .3])); const h1 = M.atomo('H', vv.s(p, vv.k(u, .96)), { no, grupo: 'h2o' }), h2 = M.atomo('H', vv.s(p, vv.k(vv.s(vv.k(u, Math.cos(gr(104.5))), vv.k(w, Math.sin(gr(104.5)))), .96)), { no, grupo: 'h2o' }); M.ligacao(o, h1); M.ligacao(o, h2); return o; }
function classes3dMontar(M) {
  const rand = rng(33), Mt = (a, b, c) => 0;
  M.no('bi'); M.no('es'); M.no('ce');
  M.grupo('cab', { nome: 'Cabeça hidrofílica', cor: C.p, frase: 'Fosfato e colina: parte polar, que atrai a água e fica voltada para fora da bicamada.' });
  M.grupo('gli', { nome: 'Glicerol e ésteres', cor: C.creme, frase: 'O glicerol liga a cabeça às duas caudas por ligações éster.' });
  M.grupo('cau', { nome: 'Caudas hidrofóbicas', cor: '#F2B36B', frase: 'Cadeias de ácidos graxos: repelem a água e ficam voltadas para dentro da bicamada.' });
  M.grupo('h2o', { nome: 'Água', cor: '#8FD8FF', frase: 'A água fica dos dois lados da bicamada, em contato com as cabeças.' });
  // ----- bicamada: 6 x 6 fosfolipídios em cada camada -----
  const nx = 5, nz = 3, sp = 8.2, rotulos = [];
  for (let camada = 0; camada < 2; camada++) for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) {
    const x = (i - (nx - 1) / 2) * sp + (rand() - .5) * 1.2, z = (j - (nz - 1) / 2) * sp + (rand() - .5) * 1.2, dy = (rand() - .5) * 1.6, g = rand() * 360, tx = (rand() - .5) * 12, tz = (rand() - .5) * 12;
    const flip = camada ? 180 : 0, y0 = camada ? -9.6 : 9.6;
    const T = p => { let q = vv.ry(p, gr(g)); q = vv.rx(q, gr(tx)); q = vv.rz(q, gr(tz)); q = vv.rx(q, gr(flip)); return vv.s(q, [x, y0 + dy * (camada ? -1 : 1), camada ? -z : z]); };
    const L = fosfolipidio(M, T, 'bi', rand, rand() < .5);
    if (camada === 0 && i === 1 && j === 1) { rotulos.push([L[4], 'cabeça hidrofílica', 0]); rotulos.push([L[L.length - 6], 'caudas hidrofóbicas', 1]); }
  }
  for (let k = 0; k < 10; k++) { const up = k % 2 ? 1 : -1; const o = aguaRand(M, [(rand() - .5) * 28, up * (18 + rand() * 6), (rand() - .5) * 22], 'bi'); if (k === 3) rotulos.push([o, 'água', 2]); }
  rotulos.forEach(r => M.rotulo(r[0], r[1], r[2]));
  // ----- colesterol -----
  const b = 1.54, s3 = Math.sqrt(3), G = grafo(), key = p => Math.round(p[0] * 20) + ',' + Math.round(p[1] * 20), mapa = {};
  const hexV = (cx, cy) => [0, 1, 2, 3, 4, 5].map(k => [cx + b * Math.cos(gr(90 + 60 * k)), cy + b * Math.sin(gr(90 + 60 * k))]);
  const vert = (p, o = {}) => { const k = key(p); if (mapa[k] == null) mapa[k] = G.at('C', [p[0], p[1], .35 * Math.sin(2.1 * p[0] + 1.3 * p[1])], Object.assign({ grupo: 'ane', no: 'es' }, o)); return mapa[k]; };
  const A = hexV(0, 0), B = hexV(s3 * b, 0), Cc = hexV(1.5 * s3 * b, 1.5 * b);
  const rings = [A, B, Cc].map(r => r.map(p => vert(p)));
  rings.forEach(r => r.forEach((v, k) => { const w = r[(k + 1) % 6], dup = false; if (!G.b.some(x => (x[0] === v && x[1] === w) || (x[0] === w && x[1] === v))) G.lig(v, w); }));
  const e1 = Cc[5], e2 = Cc[4]; // vertices a 30 e -30 graus do anel C (indices: 0=90, 1=150, 2=210, 3=270, 4=330, 5=30)
  const mid = [(e1[0] + e2[0]) / 2, (e1[1] + e2[1]) / 2], pc = [mid[0] + 1.06, mid[1]], R5 = b / (2 * Math.sin(gr(36))), P5 = a => [pc[0] + R5 * Math.cos(gr(a)), pc[1] + R5 * Math.sin(gr(a))];
  const c13 = vert(e1), c14 = vert(e2), c17 = vert(P5(72)), c16 = vert(P5(0)), c15 = vert(P5(-72));
  [[c13, c17], [c17, c16], [c16, c15], [c15, c14], [c14, c13]].forEach(x => { if (!G.b.some(y => (y[0] === x[0] && y[1] === x[1]) || (y[0] === x[1] && y[1] === x[0]))) G.lig(...x); });
  const c3 = mapa[key(A[2])], c10 = mapa[key(A[5])], c5 = mapa[key(A[4])], c6 = mapa[key(B[3])];
  G.b.forEach(x => { if ((x[0] === c5 && x[1] === c6) || (x[0] === c6 && x[1] === c5)) x[2] = 2; });
  const out = (i, d, L, o) => { const p = G.a[i].p, c = [0, 0]; return G.at(o.el || 'C', vv.s(p, vv.k(vv.n(d), L)), o); };
  const o3 = G.at('O', vv.s(G.a[c3].p, vv.k(vv.n([-1, -.55, -.3]), 1.43)), { grupo: 'oh', no: 'es' }); G.lig(c3, o3);
  const m19 = G.at('C', vv.s(G.a[c10].p, [0, .2, 1.54]), { grupo: 'ane', no: 'es' }); G.lig(c10, m19); const m18 = G.at('C', vv.s(G.a[c13].p, [0, .2, 1.54]), { grupo: 'ane', no: 'es' }); G.lig(c13, m18);
  let pv = c17, ph = gr(78); const cad = [];
  for (let i = 0; i < 6; i++) { ph += (i % 2 ? 1 : -1) * gr(34); const p = vv.s(G.a[pv].p, [1.53 * Math.cos(ph) * .96, 1.53 * Math.sin(ph) * .96, (i % 2 ? .5 : -.4)]); const c = G.at('C', p, { grupo: 'cad', no: 'es' }); G.lig(pv, c); cad.push(c); pv = c; }
  const last = cad[5], prv = cad[4]; [0, 1].forEach(k => { const c = G.at('C', vv.s(G.a[last].p, vv.k(cone(vv.n(vv.d(G.a[prv].p, G.a[last].p)), 109.5, k, 2, .5), 1.53)), { grupo: 'cad', no: 'es' }); G.lig(last, c); });
  const m21 = G.at('C', vv.s(G.a[cad[0]].p, vv.k(cone(vv.n(vv.d(G.a[c17].p, G.a[cad[0]].p)), 109.5, 0, 1, 1), 1.53)), { grupo: 'cad', no: 'es' }); G.lig(cad[0], m21);
  G.hid();
  const cen = G.a.reduce((s, a) => vv.s(s, vv.k(a.p, 1 / G.a.length)), [0, 0, 0]), Tc = mover([0, 0, 0], -25, 0, -20), Tcc = p => Tc(vv.d(p, cen));
  M.grupo('ane', { nome: 'Quatro anéis unidos', cor: C.lip, frase: 'Esqueleto dos esteroides: três anéis de seis carbonos e um de cinco, unidos. Dele saem os hormônios sexuais, o cortisol, a vitamina D e os sais biliares.' });
  M.grupo('oh', { nome: 'Hidroxila (–OH)', cor: '#FF4D4D', frase: 'Parte polar do colesterol: fica perto das cabeças dos fosfolipídios, na superfície da membrana.' });
  M.grupo('cad', { nome: 'Cadeia lateral', cor: C.creme, frase: 'Cauda hidrocarbonada, hidrofóbica: fica entre as caudas dos fosfolipídios.' });
  const Ic = G.emit(M, Tcc);
  M.rotulo(Ic[o3], 'hidroxila', 1); M.rotulo(Ic[c13], 'quatro anéis', 0); M.rotulo(Ic[cad[3]], 'cadeia lateral', 2);
  // ----- cera: ácido graxo de 14 carbonos ligado a um álcool de 14 carbonos -----
  const Zw = aciloZ(14, 0, false, true); CL3.zw = Zw;
  const nm = j => (j <= 0 ? 'c1' : 'a' + j);
  Zw.add('a1', 'C', ['Oe', 'c1', 'od'], 1.43, 117, 180, { grupo: 'alc' });
  Zw.add('a2', 'C', ['a1', 'Oe', 'c1'], 1.53, 109.5, 180, { grupo: 'alc' });
  for (let i = 3; i <= 14; i++) Zw.add('a' + i, 'C', ['a' + (i - 1), 'a' + (i - 2), i === 3 ? 'Oe' : 'a' + (i - 3)], 1.53, 112, 180, { grupo: 'alc' });
  for (let i = 1; i <= 14; i++) { const p = i === 1 ? 'Oe' : 'a' + (i - 1), nx = 'a' + (i + 1), pp = i === 1 ? 'c1' : i === 2 ? 'Oe' : 'a' + (i - 2);
    if (i === 14) [180, 60, -60].forEach((d, k) => Zw.add(`ha14_${k}`, 'H', ['a14', 'a13', 'a12'], 1.09, 109.5, d, { grupo: 'alc' }));
    else { Zw.add(`ha${i}a`, 'H', ['a' + i, p, nx], 1.09, 109.5, 121, { grupo: 'alc' }); Zw.add(`ha${i}b`, 'H', ['a' + i, p, nx], 1.09, 109.5, -121, { grupo: 'alc' }); } }
  M.grupo('ac', { nome: 'Ácido graxo', cor: C.lip, frase: 'Cadeia longa de ácido graxo, ligada ao álcool por uma ligação éster.' });
  M.grupo('alc', { nome: 'Álcool de cadeia longa', cor: C.creme, frase: 'Cadeia hidrocarbonada com uma hidroxila na ponta; ao reagir com o ácido graxo, forma a cera.' });
  const pa = Zw.P, ctr = vv.m(pa.c1, pa.a14, .5), Tw0 = p => vv.d(p, ctr);
  const Iw = Zw.emit(M, p => mover([0, 0, 0], 0, 0, -12)(Tw0(p)), { no: 'ce', grupo: 'ac' });
  M.rotulo(Iw.od, 'ligação éster', 0); M.rotulo(Iw.c14, 'ácido graxo', 1); M.rotulo(Iw.a14, 'álcool', 2);
  M.vista = { th: -.4, fi: .25, zoom: .95 };
}
function classes3dAnimar(M, P) {
  if (P.passo !== CL3.cur) { CL3.prev = CL3.cur; CL3.cur = P.passo; }
  ['bi', 'es', 'ce'].forEach((id, i) => { const no = M.nos[id]; no.esc = i === CL3.cur ? (CL3.prev < 0 ? 1 : P.entre(.3, 1.2)) : i === CL3.prev ? 1 - P.entre(0, .4) : 0; if (i === CL3.cur && P.passo === 1) no.ang = 0; });
  M.corSuja = true;
  M.enquadrar([1, .36, .4][P.passo]);
}

// ---------- na/pareamento em 3D: dupla hélice de 10 pares; cada degrau tem um par A-T e um par G-C, e o controle decide qual aparece (esc 1 e 0) ----------
const PA3 = { n: 10, v: [], ord: [] };
function pa3dMontar(M) {
  const ang = d => d * PI / 180, at = (x0, r, a, y) => [x0 + r * Math.cos(a), y, -r * Math.sin(a)], n = PA3.n, R = rng(5);
  const nt = (el, p, o, info) => M.atomo(el, p, Object.assign({ r: el === 'P' ? [1, 2.3] : [1.05, 2.2], cor: el === 'P' ? C.p : C.creme, nome: info.nome, frase: info.frase }, o));
  const fita = { cor: C.creme, raio: .42 }, Y0 = -(n - 1) * 3.38 / 2, rS = 6.4, rP = 8.9, sep = ang(140), S1 = [], P1 = [], S2 = [], P2 = [];
  M.no('dna', { origem: [0, 0, 0] });
  M.grupo('d1', { nome: 'Fita do DNA', cor: C.creme, frase: 'Esqueleto de desoxirribose e fosfato; as bases ficam para dentro da hélice.' });
  M.grupo('d2', { nome: 'Fita complementar do DNA', cor: C.creme, frase: 'Corre no sentido oposto ao da outra fita (antiparalela) e tem as bases complementares.' });
  PA3.v = []; PA3.ord = [...Array(n).keys()].sort(() => R() - .5); PA3.t0 = null; PA3.last = performance.now();
  for (let i = 0; i < n; i++) {
    const a1 = i * ang(36), a2 = a1 + sep, y = Y0 + i * 3.38, s1 = at(0, rS, a1, y), s2 = at(0, rS, a2, y), mid = v3.k(v3.s(s1, s2), .5), flip = R() < .5;
    P1.push(nt('P', at(0, rP, a1 - ang(17), y - 1.5), { no: 'dna', grupo: 'd1' }, NA3.fosfato)); S1.push(nt('X', s1, { no: 'dna', grupo: 'd1' }, NA3.desoxi));
    P2.push(nt('P', at(0, rP, a2 + ang(17), y + 1.5), { no: 'dna', grupo: 'd2' }, NA3.fosfato)); S2.push(nt('X', s2, { no: 'dna', grupo: 'd2' }, NA3.desoxi));
    const u = v3.n([s2[0] - s1[0], 0, s2[2] - s1[2]]), L = Math.hypot(s2[0] - s1[0], s2[2] - s1[2]) - 2.6;
    [['a', flip ? 'A' : 'T'], ['g', flip ? 'G' : 'C']].forEach(([tipo, b1]) => {
      const b2 = NA3.par[b1], id = 'v' + i + tipo, f = purina(b1) ? .56 : .44;
      M.no(id, { pai: 'dna', origem: mid });
      const e1 = v3.s(s1, v3.k(u, L * f)), e2 = v3.s(s2, v3.k(u, -L * (1 - f)));
      const t1 = base3d(M, b1, s1, e1, { no: id, grupo: id + '1', s: S1[i] }), t2 = base3d(M, b2, s2, e2, { no: id, grupo: id + '2', s: S2[i] });
      const pts = t1.map((a, k) => M.ponteH(a, t2[k], { k: 0 }));
      PA3.v.push({ i, tipo, no: M.nos[id], pts, cur: 0 });
      if (i === 3 && tipo === 'a') M.rotulo(pts[1], 'par A–T', 2); if (i === 6 && tipo === 'g') M.rotulo(pts[1], 'par G–C', 3);
    });
  }
  for (let i = 0; i < n; i++) { M.ligacao(P1[i], S1[i], fita); if (i < n - 1) M.ligacao(S1[i], P1[i + 1], fita); M.ligacao(P2[i], S2[i], fita); if (i > 0) M.ligacao(S2[i], P2[i - 1], fita); }
  M.rotulo(P1[7], 'fosfato', 5); M.rotulo(S1[2], 'desoxirribose', 6); M.rotulo(P2[n - 1], 'fita DNA', 4);
  M.vista = { th: -.7, fi: .22, zoom: 1.05 };
}
function pa3dAnimar(M, P) {
  const now = performance.now(), dt = Math.min(.1, (now - PA3.last) / 1000); PA3.last = now; if (PA3.t0 == null) PA3.t0 = now;
  const t = (now - PA3.t0) / 1000, n = PA3.n, a = Math.round(P.S.v), nat = Math.round(n * 2 * a / 100), rank = i => PA3.ord.indexOf(i), reduz = MOL3D.reduz;
  PA3.v.forEach(v => {
    const alvo = (rank(v.i) < nat) === (v.tipo === 'a') ? 1 : 0;
    v.cur = reduz ? alvo : v.cur + (alvo - v.cur) * Math.min(1, dt * 7); if (Math.abs(v.cur - alvo) < .01) v.cur = alvo;
    v.no.esc = v.cur;
    const k = reduz ? 1 : cl((t - 1 - v.i * .14) / .7, 0, 1);
    v.pts.forEach(p => { p.k = v.cur > .9 ? k : 0; });
  });
  M.corSuja = true;
}

// =====================================================================================
// LIPÍDIOS
// =====================================================================================
def('lip', 'glicerideos', MOL3D.cena({
  t: 'Glicerídeos: gorduras e óleos', s: 'saturados, insaturados e trans', c: C.lip, loc: 'Triglicerídeos', still: 6,
  montar: glic3dMontar, animar: glic3dAnimar, legenda: P => ['Um glicerol e três ácidos graxos, cada um com um grupo carboxila (–COOH) na ponta', 'A carboxila de cada ácido reage com uma hidroxila do glicerol: forma-se a ligação éster e sai uma molécula de água', 'No triglicerídeo, a cadeia saturada é reta, a cis dobra na dupla ligação e a trans fica quase reta'][P.passo],
  ctl: escolha('Passo', ['separados', 'ligação éster', 'três tipos de cadeia'], 7),
  alt: 'Um glicerol se une a três ácidos graxos com saída de três moléculas de água; ao lado, cadeias retas se empilham bem e cadeias dobradas ficam soltas',
  d: `<p><b>Lipídios são moléculas que não se dissolvem em água (são hidrofóbicas), mas se dissolvem em solventes como o álcool e o éter.</b> Os mais comuns na dieta são os <b>glicerídeos</b>: um <b>glicerol</b> unido a ácidos graxos. Com três ácidos graxos, forma-se um <b>triglicerídeo</b>, e saem três moléculas de água.</p>
<p>Os triglicerídeos são a principal <b>reserva de energia</b> dos animais (no tecido adiposo, que também isola o calor e amortece impactos) e das sementes. Rendem cerca de 9&nbsp;kcal por grama, mais que o dobro dos carboidratos.</p>
<p>Nos ácidos graxos <b>saturados</b>, só há ligações simples entre os carbonos: a cadeia é reta, as moléculas se empilham bem, e a gordura é sólida à temperatura ambiente (manteiga, banha). Nos <b>insaturados</b>, uma dupla ligação do tipo cis dobra a cadeia; as moléculas ficam soltas, e o óleo é líquido (azeite, óleo de soja). Na gordura <b>trans</b>, a dupla não dobra a cadeia. Por isso ela se empilha como uma gordura saturada e é sólida à temperatura ambiente. No corpo, é ainda mais prejudicial: aumenta o colesterol "ruim" (LDL) e diminui o "bom" (HDL). No Brasil, a Anvisa proibiu os óleos parcialmente hidrogenados, a principal fonte de gordura trans, a partir de 2023.</p>`,
  kv: [['Triglicerídeo', '1 glicerol + 3 ácidos graxos'], ['Energia', 'cerca de 9 kcal por grama'], ['Saturada', 'só ligações simples; sólida (gordura)'], ['Insaturada cis', 'dupla que dobra a cadeia; líquida (óleo)'], ['Trans', 'dupla sem dobra; sólida; aumenta o LDL']],
  enem: 'A hidrogenação de óleos e a gordura trans são cobradas com a estrutura: a cadeia trans é quase reta, por isso as moléculas se empilham e a gordura fica sólida. Também cai a função de reserva e isolamento térmico do tecido adiposo, e a produção de sabão a partir de gorduras (saponificação).',
  links: [LK.tri, LK.oleico],
  plano(t, S) {
    const A = area(), tipo = Math.round(S.v), p = fr(t * .08), sg = NAR ? 9 : 13;
    const L = NAR ? { x0: A.x0, y0: A.y0, w: A.w, h: A.h * .52 } : { x0: A.x0, y0: A.y0, w: A.w * .56, h: A.h };
    const gx = L.x0 + (NAR ? 26 : 50), gy = L.y0 + L.h / 2, gs = NAR ? 30 : 46, j = ss((p - .1) / .35) * (p < .85 ? 1 : 1 - ss((p - .85) / .1));
    for (let k = 0; k < 3; k++) { const y = gy + (k - 1) * gs; circ(gx, y, NAR ? 8 : 10, C.c, 'rgba(11,15,28,.6)', 1); if (k) line(gx, y - gs + 10, gx, y - 10, 'rgba(232,237,247,.6)', 2); circ(gx + (NAR ? 16 : 22), y, NAR ? 6 : 8, C.o, 'rgba(11,15,28,.6)', 1); }
    tx('glicerol', gx, gy + gs * 1.5 + 6, { s: 12, w: 600 });
    for (let k = 0; k < 3; k++) {
      const y = gy + (k - 1) * gs, x0 = lerp(L.x0 + L.w * .52, gx + (NAR ? 30 : 42), j);
      rr(x0 - 4, y - 6, 10, 12, 3, C.lip); zz(x0 + 6, y, NAR ? 12 : 15, 0, sg, { cis: tipo === 1 ? 7 : 0, dupla: tipo ? 7 : 0, c: light(C.lip, .3) });
      const fH = seg(p, .38 + k * .04, .62 + k * .04); if (fH > 0 && fH < 1) { const hx2 = gx + 28 + fH * 30, hy2 = y - 6 - fH * (NAR ? 18 : 28); h2o(hx2, hy2, 7, -PI / 2, { a: Math.sin(fH * PI) * 1.6 }); }
    }
    if (j > .9) tx('triglicerídeo + 3 H₂O', L.x0 + L.w * .5, L.y0 + 12, { w: 600, c: C.lip }); else tx('glicerol + 3 ácidos graxos', L.x0 + L.w * .5, L.y0 + 12, { w: 600 });
    // empacotamento
    const P = NAR ? { x0: A.x0, y0: A.y0 + A.h * .56, w: A.w, h: A.h * .44 } : { x0: A.x0 + A.w * .6, y0: A.y0, w: A.w * .4, h: A.h };
    rr(P.x0, P.y0, P.w, P.h, 12, 'rgba(19,26,43,.6)', C.line, 1);
    const n = NAR ? 5 : 7, sp = (P.h - 70) / n, sg2 = Math.min(NAR ? 11 : 17, P.w / (NAR ? 15 : 24)), nseg = NAR ? 12 : 20;
    for (let k = 0; k < n; k++) { const wob = tipo === 1 ? Math.sin(t * 1.5 + k) * 4 : Math.sin(t * 1.5 + k) * 1; zz(P.x0 + 16 + (tipo === 1 ? (k % 2) * 14 : 0) + wob, P.y0 + 34 + k * sp * (tipo === 1 ? 1.06 : .78) + (tipo === 1 ? 0 : sp * .6), nseg, 0, sg2, { cis: tipo === 1 ? 6 : 0, dupla: tipo ? 6 : 0, c: light(C.lip, .25) }); }
    tx(tipo === 1 ? 'cadeias dobradas: ficam soltas' : 'cadeias retas: empilham bem', P.x0 + P.w / 2, P.y0 + 14, { s: 13, w: 600 });
    tok(P.x0 + P.w / 2, P.y1 - 18, tipo === 1 ? 'líquida: óleo' : 'sólida: gordura', tipo === 1 ? '#F2D06A' : '#EDE6D6');
    if (tipo) lab(P.x0 + 16 + 5.5 * sg2, P.y0 + 34 + (tipo === 1 ? 0 : sp * .6), P.x0 + P.w * .55, P.y0 + 36, tipo === 1 ? 'dupla cis' : 'dupla trans');
    cap(['Saturado: só ligações simples; cadeias retas e gordura sólida', 'Insaturado cis: a dupla dobra a cadeia; o óleo fica líquido', 'Trans: a dupla não dobra a cadeia; empilha como a saturada e aumenta o LDL'][tipo]);
  }
}));

def('lip', 'classes', MOL3D.cena({
  t: 'Fosfolipídios, esteroides e ceras', s: 'membranas, hormônios e proteção', c: C.lip, loc: 'Outras classes de lipídios', still: 0,
  montar: classes3dMontar, animar: classes3dAnimar, legenda: P => ['Fosfolipídios: cabeça hidrofílica para fora, caudas hidrofóbicas para dentro (bicamada)', 'Esteroides: quatro anéis; o colesterol origina hormônios, vitamina D e sais biliares', 'Ceras: muito hidrofóbicas; impermeabilizam folhas, penas e pelos'][P.passo],
  ctl: escolha('Classe', ['fosfolipídios', 'esteroides', 'ceras'], 7),
  alt: 'Fosfolipídios formando uma bicamada, o esqueleto de quatro anéis dos esteroides e gotas de água sobre a cera de uma folha',
  d: `<p><b>Fosfolipídios</b> formam as membranas. Cada um tem uma cabeça <b>hidrofílica</b> (atrai a água), com um fosfato (−) e, em geral, um grupo com carga + como a colina; ela é polar, mas tem carga total zero. Tem também duas caudas <b>hidrofóbicas</b> (repelem a água). Na água, essas moléculas se organizam sozinhas em camadas duplas (bicamadas). É essa propriedade que faz a membrana das células ser estável. Na célula, os fosfolipídios novos são feitos no retículo endoplasmático liso e somados às membranas que já existem.</p>
<p><b>Esteroides</b> têm um esqueleto de quatro anéis unidos. O <b>colesterol</b> dá estabilidade à membrana das células animais e é a matéria-prima dos hormônios sexuais (testosterona, estrógeno e progesterona), do cortisol, da vitamina D e dos sais biliares, que ajudam a digerir gorduras.</p>
<p><b>Ceras</b> (cerídeos) unem um ácido graxo a um álcool de cadeia longa. São muito hidrofóbicas: impermeabilizam folhas (a cutícula reduz a perda de água), penas e pelos, e formam os favos das abelhas.</p>`,
  kv: [['Fosfolipídios', 'membranas (bicamada)'], ['Esteroides', 'colesterol, hormônios sexuais, cortisol, vitamina D'], ['Ceras', 'cutícula das folhas, penas, favos'], ['Hidrofílico × hidrofóbico', 'atrai × repele a água']],
  enem: 'Relacione estrutura e função: a bicamada de fosfolipídios explica por que substâncias polares atravessam a membrana com dificuldade. Hormônios esteroides são lipídios e atravessam a membrana sozinhos. Plantas de ambiente seco têm cutícula grossa (cera) para perder menos água.',
  links: [LK.fosfo, LK.bicamada],
  plano(t, S) {
    const A = area(), i = Math.round(S.v), cx = A.cx, cy = A.cy;
    if (i === 0) {
      const s = NAR ? 9 : 13, sp = s * 2.2, n = Math.floor(A.w / sp) - 1, yT = cy - s * 3.2, yB = cy + s * 3.2;
      rr(A.x0, A.y0, A.w, yT - s - A.y0, 10, rgba(C.aguaM, .12)); rr(A.x0, yB + s, A.w, A.y1 - yB - s, 10, rgba(C.aguaM, .12));
      for (let k = 0; k < n; k++) for (const [y, d] of [[yT, 1], [yB, -1]]) { const x = A.x0 + sp * .8 + k * sp + Math.sin(t + k) * 1.5; for (const o of [-.25, .25]) { X.beginPath(); X.moveTo(x + o * s, y + d * s * .6); for (let q = 1; q <= 5; q++) X.lineTo(x + o * s + Math.sin(t * 2 + k + q) * 1.5, y + d * (s * .6 + q * s * .5)); X.strokeStyle = 'rgba(255,205,228,.7)'; X.lineWidth = 2; X.stroke(); } circ(x, y, s * .55, C.memb); }
      tx('água', A.x0 + 12, A.y0 + 14, { a: 'left', c: C.aguaM, w: 600 }); tx('água', A.x0 + 12, A.y1 - 14, { a: 'left', c: C.aguaM, w: 600 });
      lab(A.x0 + sp * .8 + sp * 3, yT, A.x0 + sp * 5, A.y0 + 30, 'cabeça hidrofílica'); lab(A.x0 + sp * .8 + sp * 6, cy - s, A.x0 + sp * 9, cy - s * 1.2, 'caudas hidrofóbicas');
    } else if (i === 1) {
      const r = Math.min(A.w * (NAR ? .1 : .07), A.h * .13), h = r * Math.sqrt(3) / 2, x0 = cx - r * 2.6, y0 = cy + r * .4;
      const rings = [[x0, y0, 6], [x0 + 2 * h * Math.cos(PI / 6) * 1.0, y0 - r * .0 - h * 0, 6]];
      // quatro anéis: três de seis lados e um de cinco
      const pos = [[x0, y0], [x0 + h * 2 * .866 * 1.15, y0 - r * .5 * 1.0], [x0 + h * 2 * .866 * 2.3, y0], [x0 + h * 2 * .866 * 3.35, y0 - r * .55]];
      pos.forEach(([x, y], k) => ngon(x, y, k === 3 ? r * .88 : r, k === 3 ? 5 : 6, k === 3 ? PI : PI / 6, rgba(C.lip, .25), C.lip, 2.5));
      line(pos[0][0] - r * .87, pos[0][1] + r * .5, pos[0][0] - r * 1.6, pos[0][1] + r * 1.0, 'rgba(232,237,247,.7)', 2); circ(pos[0][0] - r * 1.75, pos[0][1] + r * 1.1, r * .26, C.o); tx('OH', pos[0][0] - r * 1.75, pos[0][1] + r * 1.75, { s: 12, w: 700, c: light(C.o, .4) });
      zz(pos[3][0] + r * .8, pos[3][1] - r * .3, 6, -.3, r * .55, { c: 'rgba(232,237,247,.8)' });
      tx('colesterol: quatro anéis unidos', cx, A.y0 + 14, { w: 600, c: C.lip });
      const der = ['hormônios sexuais', 'cortisol', 'vitamina D', 'sais biliares']; der.forEach((d, k) => tok(NAR ? A.x0 + A.w * (.27 + (k % 2) * .46) : A.x0 + A.w * (.14 + k * .24), A.y1 - (NAR ? 46 - Math.floor(k / 2) * 26 : 20), d, C.lip));
      tx('derivados do colesterol', cx, A.y1 - (NAR ? 66 : 44), { s: 12, c: C.dim });
    } else {
      // folha com cutícula e gotas que rolam
      const lw = A.w * .8, ly = cy + A.h * .1; X.save(); X.translate(cx, ly); X.rotate(-.08); rr(-lw / 2, 0, lw, A.h * .14, 10, C.cloro); rr(-lw / 2, -6, lw, 8, 4, '#F2E6B8'); X.restore();
      tx('cutícula (cera)', cx + lw * .3, ly - 30, { s: 13, w: 600, c: '#F2E6B8' });
      for (let k = 0; k < 3; k++) { const f = fr(t * .12 + k / 3), x = cx - lw / 2 + f * lw, y = ly - 14 - (x - cx) * .08 - 4; X.save(); X.globalAlpha = Math.min(1, Math.sin(f * PI) * 3); ell(x, y, 12, 9, 0, rgba(C.aguaM, .7), light(C.aguaM, .4), 1.5); circ(x - 4, y - 3, 2.5, 'rgba(255,255,255,.7)'); X.restore(); }
      for (let k = 0; k < (NAR ? 5 : 9); k++) ngon(A.x0 + 30 + k * 30 + (Math.floor(k / 1) % 2) * 0, A.y0 + 40 + (k % 2) * 26, 16, 6, 0, 'rgba(242,193,78,.3)', '#F2C14E', 2);
      tx('favo de cera das abelhas', A.x0 + 30, A.y0 + 90, { a: 'left', s: 12, c: C.dim });
      tx('a água não molha a cera e escorre', cx, A.y1 - 14, { s: 13, c: C.txt });
    }
    cap(['Fosfolipídios: cabeça hidrofílica para fora, caudas hidrofóbicas para dentro (bicamada)', 'Esteroides: quatro anéis; o colesterol origina hormônios, vitamina D e sais biliares', 'Ceras: muito hidrofóbicas; impermeabilizam folhas, penas e pelos'][i]);
  }
}));

// figuras de IA (figura-ia.js): artéria em corte transversal (A) e longitudinal (B); sobre elas correm LDL e HDL
const COL_FIG = window.LAB_FIGIA ? LAB_FIGIA({
  nome: 'Artéria com placa de gordura, em corte transversal e longitudinal', mask: { miolo: .74, borda: 1 },
  vistas: [{ id: 'a', img: 'biologia-molecular-lip-colesterol-a', nome: 'Corte transversal' }, { id: 'b', img: 'biologia-molecular-lip-colesterol-b', nome: 'Corte longitudinal', recorte: [0, .1, 1, .8] }],
  hs: [
    { id: 'placa', c: '#F2D06A', em: { a: [46, 62], b: [71, 43] }, t: 'Placa de ateroma', d: 'Colesterol, células e restos se acumulam na parede e formam a placa, que estreita a artéria e pode causar infarto e AVC.', z: 2.4 },
    { id: 'luz', c: '#FF9AA6', em: { a: [36, 44], b: [26, 50] }, t: 'Luz da artéria', d: 'É o espaço por onde o sangue passa. Com a placa crescendo, ele fica cada vez mais estreito.', z: 2.2 },
    { id: 'parede', c: '#C97B86', em: { a: [18, 30], b: [40, 29] }, t: 'Parede da artéria', d: 'Camadas de músculo liso e tecido elástico. A placa se forma por dentro, onde o LDL se deposita.', z: 2.2 },
    { id: 'ldl', c: '#F2A65A', em: { a: [24, 53], b: [14, 44] }, t: 'LDL', d: 'Leva colesterol do fígado aos tecidos. Em excesso, deixa colesterol na parede da artéria e alimenta a placa.', z: 3 },
    { id: 'estreito', c: '#FFB347', em: { b: [62, 50] }, t: 'Estreitamento', d: 'Onde a placa cresce, a luz fica fina e o sangue passa com dificuldade.', z: 2.6 }
  ]
}) : null;
def('lip', 'colesterol', {
  t: 'Colesterol, HDL e LDL', s: 'lipoproteínas e placas nas artérias', c: C.lip, loc: 'Corte de uma artéria', still: 6,
  ctl: { l: 'Gordura saturada e trans', min: 0, max: 100, step: 5, v: 30, f: v => v < 35 ? 'pouca' : v < 70 ? 'média' : 'muita', rate: () => 1 },
  alt: 'No sangue de uma artéria, partículas de LDL deixam colesterol na parede e formam uma placa; partículas de HDL recolhem colesterol e o levam ao fígado',
  d: `<p><b>O colesterol é indispensável:</b> faz parte da membrana das células animais e é a matéria-prima de hormônios, da vitamina D e dos sais biliares. Cerca de dois terços dele são produzidos pelo próprio fígado; o resto vem de alimentos de origem animal. Plantas praticamente não têm colesterol.</p>
<p>Como é hidrofóbico, o colesterol viaja no sangue dentro de <b>lipoproteínas</b>, partículas com uma casca de proteínas e fosfolipídios. O <b>LDL</b> leva colesterol do fígado aos tecidos; em excesso, deixa colesterol na parede das artérias e ajuda a formar <b>placas de ateroma</b> (aterosclerose). O <b>HDL</b> recolhe o colesterol que sobra e o leva de volta ao fígado. Por isso se diz, de forma simplificada, que o LDL é o colesterol "ruim" e o HDL, o "bom". Mas HDL e LDL não são tipos de colesterol: são os veículos que o transportam.</p>
<p>Dietas ricas em gordura saturada e trans, o sedentarismo e o fumo elevam o LDL; atividade física regular ajuda a elevar o HDL. Mude a dieta no controle e acompanhe a placa.</p>`,
  kv: [['Produção própria', 'cerca de dois terços, no fígado'], ['LDL', 'leva colesterol aos tecidos; em excesso, forma placas'], ['HDL', 'devolve o colesterol ao fígado'], ['Placa de ateroma', 'estreita a artéria; pode causar infarto e AVC']],
  enem: 'A prova cobra a leitura de exames e de rótulos: LDL alto e HDL baixo aumentam o risco de infarto e de AVC. Lembre que alimentos de origem vegetal não têm colesterol, mesmo quando o rótulo destaca "zero colesterol" num óleo.',
  links: [['Glicerídeos e gordura trans', '#lip/glicerideos'], ['Esteroides', '#lip/classes']],
  init(S) { S.pl = .15; },
  draw(t, S) {
    const A = area(), d = S.v / 100; S.pl += ((.1 + d * .85) - S.pl) * Math.min(1, (S.dt || 0) * .35); const pl = S.pl, speed = 1 - pl * .45, extra = Math.max(0, pl - .35) / .6;
    const nL = Math.round(4 + d * 10), nH = Math.round(9 - d * 6);
    if (COL_FIG) COL_FIG.desenhar(X, { x: A.x0, y: A.y0, w: A.w, h: A.h }, {
      sobre(R) {
        const rl = Math.max(4.5, R.s * 1.05), rh = Math.max(3.5, R.s * .8), RN = rng(6), pa = S.paused ? 0 : t;
        const ldl = (x, y, a, i) => { X.save(); X.globalAlpha *= a; circ(x, y, rl, '#F2A65A', '#0B0F1C', 1); if (rl >= 9 && i < 2) tx('LDL', x, y + .5, { s: 12, w: 700, c: '#0B0F1C', bg: false }); X.restore(); };
        const hdl = (x, y, f) => { circ(x, y, rh, '#9FE3C0', '#0B0F1C', 1); if (f < .5) circ(x + rh * .7, y - rh * .7, Math.max(2, rh * .35), '#F2D06A', '#0B0F1C', 1); };
        if (R.vista === 'a') {
          // corte transversal: o sangue sobe pela luz; parte do LDL entra na parede junto da placa, e o HDL desce levando colesterol de volta
          const P0 = [17, 56], P1 = [58, 33], nx = .47, ny = .88;
          const at = (f, cross) => R.pt(lerp(P0[0], P1[0], f) + nx * cross, lerp(P0[1], P1[1], f) + ny * cross);
          if (extra > .02) { const [px, py] = R.pt(46, 57); ell(px, py, R.s * (6 + 10 * extra), R.s * (2.5 + 5 * extra), -.45, rgba('#F2D06A', .45 * extra)); }
          for (let i = 0; i < nL; i++) { const f = fr(pa * .045 * speed + RN()), c0 = (RN() - .5) * 7, dep = i % 2 === 0 ? ss(seg(f, .4, .85)) : 0, [x, y] = at(f, c0 + dep * 9); ldl(x, y, 1 - seg(f, .85, .98) * (i % 2 === 0 ? 1 : 0), i); }
          for (let i = 0; i < nH; i++) { const f = 1 - fr(pa * .05 * speed + RN()), [x, y] = at(f, (RN() - .5) * 7 - 2); hdl(x, y, f); }
        } else {
          // corte longitudinal: LDL vai para a direita e, perto da placa, entra na parede; HDL volta para a esquerda
          const hw = x => x < 50 ? 8 : x < 62 ? lerp(8, 2.2, seg(x, 50, 62)) : x < 84 ? 2.2 : lerp(2.2, 8, seg(x, 84, 92)), k = 1 - .35 * extra;
          [[71, 45.5, 1], [68, 54.5, -1]].forEach(([x, y, s]) => { if (extra > .02) { const [px, py] = R.pt(x, y + s * -extra * 1.2); ell(px, py, R.s * 9, R.s * (1.4 + 2.4 * extra), 0, rgba('#F2D06A', .5 * extra)); } });
          for (let i = 0; i < nL; i++) { const f = fr(pa * .04 * speed + RN()), x = 6 + f * 84, c0 = RN() * 2 - 1, dep = i % 2 === 0 ? ss(seg(x, 56, 78)) : 0, yy = 50 + c0 * hw(x) * k * .8 + Math.sign(c0 || 1) * dep * 2.4, [px, py] = R.pt(x, yy); ldl(px, py, 1 - dep * .85 * seg(x, 74, 80), i); }
          for (let i = 0; i < nH; i++) { const f = 1 - fr(pa * .05 * speed + RN()), x = 6 + f * 84, [px, py] = R.pt(x, 50 + (RN() * 2 - 1) * hw(x) * k * .8); hdl(px, py, f); }
        }
        const yl = R.vista === 'b' ? 76 : 87, [ax, ay] = R.pt(20, yl), [bx, by] = R.pt(32, yl), [lx, ly] = R.pt(66, yl);
        tok(ax, ay, 'LDL', '#F2A65A'); tok(bx, by, 'HDL', '#9FE3C0'); tx(`luz da artéria: ${Math.round(100 - pl * 55)} %`, lx, ly, { s: 13, f: FD, w: 500, c: C.txt });
      }
    });
    cap(d < .35 ? 'Pouca gordura saturada e trans: menos LDL, mais HDL, placa pequena' : d < .7 ? 'Mais LDL circulando: o colesterol começa a se acumular na parede' : 'Muito LDL e pouco HDL: a placa cresce e estreita a artéria');
  }
});

// =====================================================================================
// PROTEÍNAS
// =====================================================================================
{
  const RS = [['glicina', 'H', 'Gly'], ['alanina', 'CH₃', 'Ala'], ['serina', 'CH₂OH', 'Ser'], ['fenilalanina', 'CH₂–anel', 'Phe'], ['lisina', '(CH₂)₄–NH₂', 'Lys']];
  const AA = ['Gly', 'Ala', 'Val', 'Leu', 'Ile', 'Met', 'Pro', 'Phe', 'Trp', 'Tyr', 'Ser', 'Thr', 'Cys', 'Asn', 'Gln', 'Asp', 'Glu', 'Lys', 'Arg', 'His'], ESS = ['His', 'Ile', 'Leu', 'Lys', 'Met', 'Phe', 'Thr', 'Trp', 'Val'];
  def('prot', 'aminoacidos', MOL3D.cena({
    t: 'Aminoácidos', s: 'as 20 peças das proteínas', c: C.prot, loc: 'Estrutura geral', still: 0,
    montar: amino3dMontar, animar: amino3dAnimar, legenda: P => `Todo aminoácido tem amino, carboxila, H e um grupo R; na ${RS[P.passo][0]}, R = ${RS[P.passo][1]}`,
    ctl: escolha('Grupo R', RS.map(r => r[0]), 5),
    alt: 'Estrutura geral de um aminoácido: um carbono central ligado a um grupo amino, um grupo carboxila, um hidrogênio e um grupo R que muda de um aminoácido para outro',
    d: `<p><b>Proteínas são cadeias de aminoácidos.</b> Todo aminoácido tem um carbono central (carbono alfa) ligado a quatro grupos: um <b>grupo amino</b> (–NH₂), um <b>grupo carboxila</b> (–COOH), um hidrogênio e um <b>grupo R</b>, a cadeia lateral. O grupo R é o que muda de um aminoácido para outro e define se ele é polar, apolar, ácido ou básico.</p>
<p>Os seres vivos usam 20 aminoácidos para montar proteínas. Nossas células fabricam 11 deles (<b>não essenciais</b>). Os outros 9 são <b>essenciais</b>: precisam vir da dieta. São histidina, isoleucina, leucina, lisina, metionina, fenilalanina, treonina, triptofano e valina. Em crianças e em algumas situações, como crescimento e trauma, a arginina também precisa vir da dieta.</p>
<p>Na fenilcetonúria, falta a enzima que transforma fenilalanina em tirosina (a fenilalanina-hidroxilase). A fenilalanina se acumula e prejudica o cérebro. O teste do pezinho detecta a doença logo após o nascimento, e uma dieta pobre em fenilalanina evita o dano. É por isso que refrigerantes diet avisam: "contém fenilalanina".</p>`,
    kv: [['Aminoácidos nas proteínas', '20'], ['Essenciais (adulto)', '9: His, Ile, Leu, Lys, Met, Phe, Thr, Trp, Val'], ['Grupos comuns', 'amino, carboxila, H e o grupo R'], ['Elementos', 'C, H, O, N (e S na metionina e na cisteína)']],
    enem: 'Dieta e aminoácidos essenciais: arroz e feijão se complementam (o feijão tem lisina; o arroz, metionina). A fenilcetonúria, o teste do pezinho e o aviso "contém fenilalanina" nos produtos com aspartame já apareceram na prova.',
    links: [LK.amino],
    plano(t, S) {
      const A = area(), i = Math.round(S.v), r = RS[i], u = NAR ? 34 : 54, cx = NAR ? A.cx : A.x0 + A.w * .28, cy = NAR ? A.y0 + A.h * .3 : A.cy;
      const G = [[-1, 0, 'H₂N', C.n, 'grupo amino'], [1, 0, 'COOH', C.o, 'grupo carboxila'], [0, -1, 'H', C.h, ''], [0, 1, r[1], C.prot, 'grupo R (cadeia lateral)']];
      G.forEach(([dx, dy, s, c, n]) => { const x = cx + dx * u * 1.6, y = cy + dy * u * 1.25; line(cx, cy, x, y, 'rgba(232,237,247,.7)', 2.5); const w = Math.max(u * .8, tw(s, 15, 700) + 18); rr(x - w / 2, y - u * .32, w, u * .64, 10, rgba(c, .9), 'rgba(11,15,28,.5)', 1.5); tx(s, x, y + .5, { s: NAR ? 13 : 15, w: 700, c: '#0B0F1C', bg: false }); if (n) lab(x + (dx || .3) * w * .5, y + dy * u * .32, x + (dx || .5) * u * .6 + (dx ? 0 : u * 1.2), y + (dy || -.6) * u * .9, n); });
      circ(cx, cy, u * .34, C.c, '#0B0F1C', 1.5); tx('C', cx, cy + .5, { s: 15, w: 700, c: '#0B0F1C', bg: false });
      head(r[0] + ' (' + r[2] + ')', cx, NAR ? A.y0 + 10 : A.y0 + 16, C.prot);
      // grade dos 20
      const gx = NAR ? A.x0 + 4 : A.x0 + A.w * .56, gy = NAR ? A.y0 + A.h * .64 : A.y0 + 40, cols = 5, cw2 = (NAR ? A.w - 8 : A.w * .42) / cols, ch2 = NAR ? 28 : 40;
      if (!NAR) tx('os 20 aminoácidos das proteínas', gx, A.y0 + 16, { a: 'left', s: 13, w: 600, c: C.dim, bg: false });
      AA.forEach((a, k) => { const x = gx + (k % cols) * cw2, y = gy + Math.floor(k / cols) * (ch2 + 6), e = ESS.includes(a), on = a === r[2]; rr(x + 2, y, cw2 - 4, ch2, 6, on ? rgba(C.prot, .6) : 'rgba(19,26,43,.8)', e ? C.prot : C.line, e ? 2 : 1); tx(a, x + cw2 / 2, y + ch2 / 2 + .5, { s: 13, f: FD, w: 500, c: C.txt, bg: false }); });
      const ly = gy + 4 * (ch2 + 6) + 10; rr(gx + 2, ly, 16, 12, 3, null, C.prot, 2); tx('contorno forte: essencial (9)', gx + 26, ly + 6, { a: 'left', s: 12, c: C.dim, bg: false });
      cap(`Todo aminoácido tem amino, carboxila, H e um grupo R; na ${r[0]}, R = ${r[1]}`);
    }
  }));
}

def('prot', 'peptidica', MOL3D.cena({
  t: 'Ligação peptídica', s: 'aminoácidos formam cadeias', c: C.prot, loc: 'Síntese de uma proteína', still: 4,
  montar: pep3dMontar, animar: pep3dAnimar, legenda: P => ['A carboxila de um aminoácido e o grupo amino de outro vão reagir', 'A carboxila perde o OH e o amino perde um H: sai uma molécula de água e nasce a ligação peptídica (C–N)', 'No dipeptídeo, a ligação peptídica é plana; sobram uma ponta amino livre e uma ponta carboxila livre'][P.passo],
  ctl: escolha('Passo', ['dois aminoácidos', 'ligação peptídica', 'dipeptídeo'], 7),
  alt: 'Dois aminoácidos se unem pela ligação peptídica, com saída de água; a cadeia cresce e forma um polipeptídeo',
  d: `<p><b>A ligação peptídica une o grupo carboxila de um aminoácido ao grupo amino do seguinte, com a saída de uma molécula de água</b> (síntese por desidratação). Dois aminoácidos formam um dipeptídeo; muitos formam um <b>polipeptídeo</b>. Uma proteína tem um ou mais polipeptídeos, com dezenas a milhares de aminoácidos.</p>
<p>A cadeia tem duas pontas diferentes: a <b>ponta amino</b> (N-terminal), onde a síntese começa, e a <b>ponta carboxila</b> (C-terminal). Na célula, quem faz as ligações peptídicas é o <b>ribossomo</b>, seguindo a ordem de códons do RNA mensageiro.</p>
<p>Na digestão acontece o inverso: enzimas como a pepsina, no estômago, e a tripsina, no intestino, fazem a <b>hidrólise</b> das ligações peptídicas e liberam aminoácidos, que o corpo absorve e usa para montar as próprias proteínas.</p>`,
  kv: [['Une', 'carboxila (–COOH) + amino (–NH₂)'], ['Sai', '1 molécula de água por ligação'], ['n aminoácidos', 'n − 1 ligações peptídicas'], ['Quem faz na célula', 'o ribossomo (tradução)']],
  enem: 'Cálculos simples aparecem: uma cadeia com n aminoácidos tem n − 1 ligações peptídicas e libera n − 1 moléculas de água ao ser formada. A ligação com a tradução (códon, RNA mensageiro, ribossomo) e com a digestão de proteínas também é comum.',
  links: [LK.pept, ['Tradução (DNA)', '../dna/index.html']],
  plano(t) {
    const A = area(), p = fr(t * .07), n = NAR ? 6 : 9, u = Math.min((A.w - 40) / (n + .5), NAR ? 52 : 92), cy = A.cy, x0 = A.cx - (n - 1) * u / 2, seq = ['Met', 'Val', 'His', 'Leu', 'Thr', 'Pro', 'Glu', 'Glu', 'Lys'];
    const k = p * (n + .3);
    for (let i = 0; i < n; i++) {
      const arr = cl(k - i, 0, 1), x = lerp(A.x1 + 40, x0 + i * u, ss(arr)), y = cy + (i % 2 ? 12 : -12) * ss(arr);
      if (arr <= 0) continue;
      if (i > 0 && arr > .8) { line(x0 + (i - 1) * u + u * .3, cy + ((i - 1) % 2 ? 12 : -12), x - u * .3, y, 'rgba(232,237,247,.8)', 2.5); circ((x0 + (i - 1) * u + x) / 2, (cy + ((i - 1) % 2 ? 12 : -12) + y) / 2, 5, C.n); }
      rr(x - u * .34, y - u * .26, u * .68, u * .52, 10, rgba(C.prot, .85), 'rgba(11,15,28,.5)', 1.5); tx(seq[i], x, y + .5, { s: NAR ? 12 : 14, f: FD, w: 500, c: '#0B0F1C', bg: false });
      const fh = seg(k - i, .55, 1.4); if (i > 0 && fh > 0 && fh < 1) h2o(x - u * .5, y - u * .4 - fh * 40, 8, -PI / 2, { a: Math.sin(fh * PI) * 1.5 });
    }
    const m = Math.min(n, Math.floor(k + .2));
    tx('ponta amino (N)', x0 - u * .3, cy + u * .7, { a: 'left', s: 12, c: C.dim }); if (m >= n) tx('ponta carboxila (C)', x0 + (n - 1) * u + u * .3, cy + u * .7, { a: 'right', s: 12, c: C.dim });
    if (m >= 2) lab(x0 + u * .5, cy, x0 + u * .9, cy - u * 1.1 - 10, 'ligação peptídica');
    tx(`${Math.max(0, m)} aminoácidos, ${Math.max(0, m - 1)} ligações e ${Math.max(0, m - 1)} H₂O`, A.cx, A.y0 + 14, { f: FD, s: 13, w: 500, c: C.txt });
    cap(m < 2 ? 'A cadeia começa pela ponta amino' : 'Cada nova ligação peptídica libera uma molécula de água');
  }
}));

def('prot', 'niveis', MOL3D.cena({
  t: 'Níveis de estrutura', s: 'primária, secundária, terciária e quaternária', c: C.prot, loc: 'Dobramento de uma proteína', still: 0,
  montar: niv3dMontar, animar: niv3dAnimar, legenda: P => ['Primária: a ordem dos aminoácidos, ditada pelo gene', 'Secundária: alfa-hélice e folha beta, mantidas por ligações de hidrogênio', 'Terciária: a forma 3D da cadeia, mantida pelas interações entre grupos R', 'Quaternária: várias cadeias juntas, como na hemoglobina'][P.passo],
  ctl: escolha('Nível', ['primária', 'secundária', 'terciária', 'quaternária'], 6),
  alt: 'A sequência de aminoácidos, a alfa-hélice e a folha beta, a cadeia dobrada em forma tridimensional e quatro cadeias unidas como na hemoglobina',
  d: `<p><b>A função de uma proteína depende da sua forma, e a forma depende da sequência de aminoácidos.</b> Os biólogos descrevem essa forma em quatro níveis.</p>
<p><b>Primária:</b> a sequência de aminoácidos, unidos por ligações peptídicas; é determinada pelo gene. <b>Secundária:</b> dobras regulares mantidas por ligações de hidrogênio entre partes próximas da cadeia, como a <b>alfa-hélice</b> e a <b>folha beta</b>. <b>Terciária:</b> o dobramento da cadeia inteira em três dimensões, mantido por interações entre os grupos R (ligações de hidrogênio, atrações entre cargas, pontes de dissulfeto e o agrupamento das partes hidrofóbicas longe da água).</p>
<p><b>Quaternária:</b> a união de duas ou mais cadeias. A hemoglobina tem quatro (duas alfa e duas beta). Na anemia falciforme, a troca de um único aminoácido na cadeia beta (valina no lugar de ácido glutâmico) muda a forma da proteína, e a hemácia se deforma.</p>`,
  kv: [['Primária', 'sequência de aminoácidos'], ['Secundária', 'alfa-hélice e folha beta (ligações de hidrogênio)'], ['Terciária', 'forma 3D de uma cadeia'], ['Quaternária', 'várias cadeias (ex.: hemoglobina)']],
  enem: 'A ideia central: a sequência define a forma, e a forma define a função. A anemia falciforme é o exemplo clássico: uma mutação muda um aminoácido, a forma da hemoglobina e o formato da hemácia. Relaciona-se com mutação e seleção natural (traço falciforme e malária).',
  links: [LK.helice, LK.folha, ['Hemoglobina e anemia falciforme (DNA)', '../dna/index.html']],
  plano(t, S) {
    const A = area(), i = Math.round(S.v), cx = A.cx, cy = A.cy, R = Math.min(A.w, A.h) * .32, bead = NAR ? 7 : 9;
    if (i === 0) { const seq = 'MVHLTPEEKSAVTALWGKV', n = NAR ? 10 : 19, sp = Math.min((A.w - 20) / n, 52); for (let k = 0; k < n; k++) { const x = cx - (n - 1) * sp / 2 + k * sp, y = cy + Math.sin(k * .6 + t) * 6; if (k) line(x - sp, cy + Math.sin((k - 1) * .6 + t) * 6, x, y, 'rgba(232,237,247,.6)', 2); circ(x, y, sp * .38, rgba(C.prot, .85), 'rgba(11,15,28,.5)', 1); tx(seq[k], x, y + .5, { s: 12, f: FD, w: 500, c: '#0B0F1C', bg: false }); } tx('cada letra é um aminoácido', cx, cy + 50, { s: 13, c: C.dim }); }
    else if (i === 1) { const hx = NAR ? cx : A.x0 + A.w * .28, hl = Math.min(A.h * .7, 300); X.beginPath(); for (let k = 0; k <= 160; k++) { const f = k / 160, y = cy - hl / 2 + f * hl, x = hx + Math.sin(f * TAU * 4.5 + t) * (NAR ? 30 : 44); k ? X.lineTo(x, y) : X.moveTo(x, y); } X.strokeStyle = C.prot; X.lineWidth = 6; X.lineCap = 'round'; X.stroke(); tx('alfa-hélice', hx, cy + hl / 2 + 16, { w: 600 });
      if (!NAR) { const fx = A.x0 + A.w * .66; for (let k = 0; k < 4; k++) { const x = fx + (k - 1.5) * 50; const p0 = [x, cy - hl / 2], pts = []; for (let q = 0; q <= 8; q++) pts.push([x + (q % 2 ? 6 : -6), cy - hl / 2 + q * hl / 8]); poly(pts, C.prot, 5); arrowHead(pts[8][0], pts[8][1] + 6, k % 2 ? -PI / 2 : PI / 2, C.prot, 12); if (k < 3) for (let q = 1; q < 8; q += 2) line(x + 6, cy - hl / 2 + q * hl / 8, x + 44, cy - hl / 2 + q * hl / 8, 'rgba(143,216,255,.6)', 1.5, [2, 3]); } tx('folha beta', fx, cy + hl / 2 + 16, { w: 600 }); lab(fx - 50, cy - hl / 2 + 3 * hl / 8, fx - 30, cy - hl / 2 - 6, 'ligações de hidrogênio'); } }
    else if (i === 2) { const pts = []; for (let k = 0; k <= 220; k++) { const f = k / 220, a = f * TAU * 2.2 + t * .1, rr2 = R * (.35 + .5 * Math.abs(Math.sin(f * 7.3))) ; pts.push([cx + Math.cos(a) * rr2 + Math.sin(f * 40) * 6, cy + Math.sin(a) * rr2 * .8 + Math.cos(f * 40) * 6]); } poly(pts, C.prot, 5); circ(pts[60][0], pts[60][1], 6, C.s); circ(pts[150][0], pts[150][1], 6, C.s); line(pts[60][0], pts[60][1], pts[150][0], pts[150][1], C.s, 2, [3, 3]); lab(pts[60][0], pts[60][1], cx + R * 1.1, cy - R * .9, 'ponte de dissulfeto (S–S)'); tx('uma cadeia dobrada em 3D', cx, A.y1 - 10, { s: 13, c: C.dim }); }
    else { const cs = [['α', -1, -1, '#E07AD8'], ['β', 1, -1, '#B66FD9'], ['β', -1, 1, '#B66FD9'], ['α', 1, 1, '#E07AD8']]; cs.forEach(([n, dx, dy, c], k) => { const x = cx + dx * R * .48, y = cy + dy * R * .42 + Math.sin(t + k) * 2; X.beginPath(); for (let q = 0; q <= 40; q++) { const a = q / 40 * TAU, rr2 = R * .45 * (1 + .08 * Math.sin(a * 5 + k)); q ? X.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2 * .85) : X.moveTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2 * .85); } X.closePath(); X.fillStyle = rgba(c, .55); X.fill(); X.strokeStyle = c; X.lineWidth = 2; X.stroke(); X.save(); X.translate(x + R * .15, y - R * .1); X.rotate(.6); rr(-7, -7, 14, 14, 3, '#C9303B'); X.restore(); tx(n, x - R * .12, y + R * .12, { f: FH, s: 18, w: 700, c: C.txt }); }); lab(cx + R * .63, cy - R * .52, cx + R * 1.1, cy - R * 1.05, 'grupo heme (com ferro)'); tx('hemoglobina: 2 cadeias α + 2 cadeias β', cx, A.y1 - 10, { s: 13, c: C.dim }); }
    cap(['Primária: a ordem dos aminoácidos, ditada pelo gene', 'Secundária: alfa-hélice e folha beta, mantidas por ligações de hidrogênio', 'Terciária: a forma 3D da cadeia, mantida pelas interações entre grupos R', 'Quaternária: várias cadeias juntas, como na hemoglobina'][i]);
  }
}));

{
  const NB = 40, R0 = rng(21), fold = [], open = [];
  for (let i = 0; i < NB; i++) { const a = i / NB * TAU * 2.4, r = .35 + .55 * Math.abs(Math.sin(i * .9)); fold.push([Math.cos(a) * r * .8, Math.sin(a) * r * .7]); open.push([-1.6 + i / (NB - 1) * 3.2, Math.sin(i * .7) * .35 + (R0() - .5) * .3]); }
  def('prot', 'desnaturacao', {
    t: 'Desnaturação', s: 'calor e pH desfazem a forma', c: C.prot, loc: 'Uma proteína aquecida', still: 2,
    ctl: { l: 'Temperatura', min: 20, max: 100, step: 1, v: 37, f: v => v + ' °C', rate: () => 1 },
    alt: 'Uma proteína dobrada se desenrola quando a temperatura sobe; ao lado, a clara do ovo fica branca',
    d: `<p><b>Desnaturação é a perda da forma tridimensional de uma proteína.</b> Calor intenso, pH muito ácido ou muito básico, sais em excesso e alguns solventes rompem as interações fracas que mantêm a estrutura secundária, terciária e quaternária. A proteína se desenrola e perde a função.</p>
<p>As <b>ligações peptídicas não se rompem</b>: a sequência de aminoácidos (estrutura primária) continua a mesma. É por isso que a carne cozida ainda é uma boa fonte de aminoácidos.</p>
<p>O exemplo do dia a dia é a clara do ovo: a albumina, transparente, fica branca e firme quando aquece, e não volta ao estado anterior ao esfriar. Febres muito altas são perigosas em parte porque começam a desnaturar proteínas do corpo, inclusive enzimas. Aumente a temperatura no controle.</p>`,
    kv: [['Causas', 'calor, pH extremo, excesso de sais, solventes'], ['O que se perde', 'estrutura secundária, terciária e quaternária'], ['O que se mantém', 'a estrutura primária (ligações peptídicas)'], ['Consequência', 'perda da função']],
    enem: 'Liga-se a enzimas (temperatura e pH ótimos), febre, cozimento de alimentos, pasteurização e conservação. Distinga desnaturação (perde a forma, mantém a sequência) de hidrólise (a digestão rompe as ligações peptídicas).',
    links: [['Enzimas e temperatura', '#enz'], LK.helice],
    init(S) { S.k = 0; },
    draw(t, S) {
      const A = area(), T = S.v, alvo = ss((T - 52) / 22); S.k += (alvo - S.k) * Math.min(1, (S.dt || 0) * 1.5 + (S.paused ? 1 : 0)); const k = S.k;
      const cx = NAR ? A.cx : A.x0 + A.w * .38, cy = NAR ? A.y0 + A.h * .32 : A.cy, sc = Math.min(NAR ? A.w * .4 : A.w * .2, A.h * .36);
      const P = fold.map((f, i) => { const o = open[i]; const j = Math.sin(t * 2 + i) * (1 + k * 4) * (T / 60); return [cx + lerp(f[0], o[0], k) * sc + j, cy + lerp(f[1], o[1], k) * sc + Math.cos(t * 1.7 + i) * (1 + k * 3) * (T / 60)]; });
      poly(P, 'rgba(232,237,247,.6)', 2); P.forEach((p, i) => circ(p[0], p[1], NAR ? 5 : 7, i % 5 === 0 ? '#B66FD9' : C.prot, 'rgba(11,15,28,.5)', 1));
      if (k < .4) for (let q = 0; q < 6; q++) { const a = P[q * 6], b = P[(q * 6 + 13) % NB]; if (Math.hypot(a[0] - b[0], a[1] - b[1]) < sc * .5) line(a[0], a[1], b[0], b[1], `rgba(143,216,255,${.6 * (1 - k * 2.5)})`, 1.5, [2, 3]); }
      tx(k < .5 ? 'forma ativa (dobrada)' : 'desnaturada (desenrolada)', cx, NAR ? A.y0 + 8 : A.y0 + 16, { w: 600, c: k < .5 ? C.prot : C.txt });
      // ovo
      const ex = NAR ? A.cx : A.x0 + A.w * .82, ey = NAR ? A.y0 + A.h * .78 : A.cy, er = NAR ? Math.min(A.w * .22, A.h * .16) : Math.min(A.w * .12, A.h * .3);
      ell(ex, ey, er * 1.25, er, 0, `rgba(${lerp(200, 245, k) | 0},${lerp(225, 245, k) | 0},${lerp(235, 245, k) | 0},${lerp(.25, .95, k)})`, 'rgba(255,255,255,.4)', 1.5); circ(ex + er * .15, ey, er * .42, '#F2B33D', 'rgba(11,15,28,.4)', 1);
      tx('clara do ovo', ex, ey + er + 18, { s: 13, w: 600 });
      hbar(NAR ? A.x0 + 6 : A.x0 + 10, NAR ? A.y0 + A.h * .58 : A.y1 - 20, NAR ? A.w - 12 : A.w * .5, 12, 1 - k, C.prot, 'função', Math.round((1 - k) * 100) + ' %');
      cap(T < 45 ? 'Temperatura do corpo: a proteína mantém a forma e funciona' : k < .5 ? 'O calor agita a cadeia; as ligações fracas começam a se romper' : 'Desnaturada: perdeu a forma e a função, mas a sequência de aminoácidos é a mesma');
    }
  });
}

// =====================================================================================
// ÁCIDOS NUCLEICOS
// =====================================================================================
function nucleo(x, y, u, base, rna, o = {}) {
  // fosfato (esquerda), pentose (centro), base (direita)
  const px = x - u * 1.2, bx = x + u * 1.3;
  line(px, y, x - u * .4, y, 'rgba(232,237,247,.7)', 2.5); line(x + u * .4, y, bx - u * .5, y, 'rgba(232,237,247,.7)', 2.5);
  circ(px, y, u * .34, C.p, 'rgba(11,15,28,.5)', 1.5); tx('P', px, y + .5, { s: Math.max(12, u * .32), w: 700, c: '#0B0F1C', bg: false });
  ngon(x, y, u * .45, 5, -PI / 2, rgba(C.creme, .35), C.creme, 2);
  const c2x = x + Math.cos(-PI / 2 + 2 * TAU / 5) * u * .45, c2y = y + Math.sin(-PI / 2 + 2 * TAU / 5) * u * .45;
  line(c2x, c2y, c2x, c2y + u * .45, 'rgba(232,237,247,.6)', 1.5); tx(rna ? 'OH' : 'H', c2x, c2y + u * .62, { s: 12, w: 700, c: rna ? light(C.o, .3) : C.h });
  const c = BASE[base]; if (PUR[base]) { ngon(bx - u * .1, y, u * .42, 6, 0, rgba(c, .85), 'rgba(11,15,28,.5)', 1.5); ngon(bx + u * .58, y, u * .36, 5, 0, rgba(c, .85), 'rgba(11,15,28,.5)', 1.5); } else ngon(bx, y, u * .45, 6, 0, rgba(c, .85), 'rgba(11,15,28,.5)', 1.5);
  tx(base, bx + (PUR[base] ? u * .2 : 0), y + .5, { s: Math.max(13, u * .4), w: 700, c: '#0B0F1C', bg: false });
  return { px, bx };
}

def('na', 'nucleotideo', MOL3D.cena({
  t: 'Nucleotídeos', s: 'fosfato, pentose e base nitrogenada', c: C.na, loc: 'As peças do DNA e do RNA', still: 0,
  montar: nuc3dMontar, animar: nuc3dAnimar, legenda: P => ['Nucleotídeo de DNA: fosfato, desoxirribose (sem o OH no carbono 2) e a base timina (T)', 'Nucleotídeo de RNA: ribose (com OH no carbono 2) e a base uracila (U) no lugar da timina', 'Os nucleotídeos se unem por ligação fosfodiéster: o fosfato de um se liga ao açúcar do outro e sai água'][P.passo],
  ctl: escolha('Passo', ['DNA', 'RNA', 'cadeia (fosfodiéster)'], 7),
  alt: 'Um nucleotídeo com fosfato, açúcar de cinco carbonos e base nitrogenada; o açúcar do RNA tem um OH a mais que o do DNA',
  d: `<p><b>Ácidos nucleicos (DNA e RNA) são cadeias de nucleotídeos.</b> Cada nucleotídeo tem três partes: um <b>fosfato</b>, uma <b>pentose</b> (açúcar de cinco carbonos) e uma <b>base nitrogenada</b>.</p>
<p>No DNA, a pentose é a <b>desoxirribose</b>; no RNA, é a <b>ribose</b>, que tem um grupo OH a mais no carbono 2 (o nome "desoxi" quer dizer "sem um oxigênio"). As bases são de dois tipos: as <b>purinas</b>, com dois anéis (adenina e guanina), e as <b>pirimidinas</b>, com um anel (citosina, timina e uracila). A timina só aparece no DNA, e a uracila, só no RNA.</p>
<p>Os nucleotídeos se unem por <b>ligações fosfodiéster</b>: o fosfato de um se liga ao açúcar do seguinte, formando um "corrimão" de açúcar e fosfato, com as bases voltadas para o lado. O ATP também é um nucleotídeo, com três fosfatos.</p>`,
  kv: [['Partes', 'fosfato + pentose + base nitrogenada'], ['Pentose do DNA', 'desoxirribose'], ['Pentose do RNA', 'ribose (um OH a mais)'], ['Purinas (2 anéis)', 'adenina (A) e guanina (G)'], ['Pirimidinas (1 anel)', 'citosina (C), timina (T) e uracila (U)']],
  enem: 'Cai muito a comparação DNA × RNA: açúcar (desoxirribose × ribose), bases (T × U) e número de fitas. Lembre que o fosfato é a fonte de fósforo das moléculas da hereditariedade e do ATP.',
  links: [LK.dna, LK.bioen],
  plano(t, S) {
    const A = area(), rna = Math.round(S.v) === 1, u = NAR ? 24 : 40, bases = rna ? ['A', 'U', 'G', 'C'] : ['A', 'T', 'G', 'C'];
    const cx = NAR ? A.cx - u * .1 : A.x0 + A.w * .3, cy = NAR ? A.y0 + A.h * .2 : A.cy - u * .4, b = bases[Math.floor(t / 2.2) % 4];
    const N = nucleo(cx, cy, u * (NAR ? 1.2 : 1.4), b, rna);
    lab(N.px, cy - u * .5, N.px - 10, cy - u * 2.2, 'fosfato'); lab(cx, cy - u * .6, cx + 10, cy - u * 2.4, rna ? 'ribose' : 'desoxirribose'); lab(N.bx, cy - u * .6, N.bx + 20, cy - u * 2.2, 'base nitrogenada');
    head(rna ? 'nucleotídeo de RNA' : 'nucleotídeo de DNA', cx, A.y0 + 10, C.na);
    // cadeia
    const ch = NAR ? { x: A.x0 + 10, y: A.y0 + A.h * .48 } : { x: A.x0 + A.w * .62, y: A.y0 + 30 }, n = 4, gap = NAR ? u * 1.5 : u * 1.9, cu = u * .7;
    for (let i = 0; i < n; i++) { const y = ch.y + i * gap + 20; nucleo(ch.x + cu * 1.6, y, cu, bases[(i + 1) % 4], rna); if (i) line(ch.x + cu * .4, y - gap + 4, ch.x + cu * 1.6 - cu * .3, y - cu * .2 , 'rgba(232,237,247,.5)', 2); }
    if (!NAR) { tx('ligações fosfodiéster formam a cadeia', ch.x + cu * 2.2, ch.y + n * gap + 26, { s: 12, c: C.dim }); }
    const ty = NAR ? A.y1 - 30 : A.y1 - 40, tx0 = NAR ? A.x0 + 6 : A.x0 + 10;
    tx('purinas (2 anéis): A, G', tx0, ty, { a: 'left', s: 13, w: 600, c: C.txt, bg: false }); tx(rna ? 'pirimidinas (1 anel): C, U' : 'pirimidinas (1 anel): C, T', tx0, ty + 20, { a: 'left', s: 13, w: 600, c: C.txt, bg: false });
    cap(rna ? 'RNA: ribose (com OH no carbono 2) e uracila (U) no lugar da timina' : 'DNA: desoxirribose (sem o OH no carbono 2) e timina (T)');
  }
}));

def('na', 'pareamento', MOL3D.cena({
  t: 'Pareamento de bases', s: 'A com T, G com C', c: C.na, loc: 'Dez pares mostrados, de um trecho de 100', still: 2,
  montar: pa3dMontar, animar: pa3dAnimar, legenda: P => { const a = Math.round(P.S.v), g = 50 - a, pAT = 2 * a, pGC = 100 - pAT; return `A = T = ${a}% e G = C = ${g}%; em 100 pares (aqui, dez são mostrados), ${pAT * 2 + pGC * 3} ligações de hidrogênio`; },
  ctl: { l: 'Adenina no DNA', min: 10, max: 40, step: 1, v: 30, f: v => v + ' %', rate: () => 1 },
  alt: 'Escada de DNA com pares de bases: adenina com timina por duas ligações de hidrogênio e guanina com citosina por três; o cálculo das porcentagens muda com o controle',
  d: `<p><b>No DNA, as duas fitas se unem pelas bases: adenina sempre com timina (A–T) e guanina sempre com citosina (G–C).</b> Uma purina sempre pareia com uma pirimidina, e por isso a largura da dupla hélice é constante.</p>
<p>Como as bases pareiam assim, num DNA de fita dupla a quantidade de A é igual à de T, e a de G é igual à de C (<b>regras de Chargaff</b>). Sabendo a porcentagem de uma base, dá para calcular as outras: se A = 30%, então T = 30%, e G + C = 40%, ou seja, G = C = 20%. Mude a porcentagem de adenina no controle.</p>
<p>A–T faz 2 ligações de hidrogênio e G–C faz 3. Mais GC deixa o DNA mais estável: em parte por essas ligações, mas principalmente porque os pares G–C se empilham com mais força. As fitas são <b>antiparalelas</b>: uma corre no sentido de 5' para 3' e a outra, de 3' para 5'.</p>`,
  kv: [['Pares', 'A–T (2 ligações de H) e G–C (3 ligações de H)'], ['Chargaff', 'A = T e G = C; A + G = T + C = 50%'], ['Fitas', 'antiparalelas (uma de 5\' para 3\', a outra de 3\' para 5\')'], ['No RNA', 'fita simples; A pareia com U quando há pareamento']],
  enem: 'Questão clássica: dada a porcentagem de uma base, calcule as outras. Também cai o número de ligações de hidrogênio de um trecho. Exemplo: 100 pares com 30% de A têm 60 pares A–T e 40 pares G–C, logo 60 × 2 + 40 × 3 = 240 ligações de hidrogênio.',
  links: [LK.dna],
  plano(t, S) {
    const A = area(), a = S.v, g = 50 - a, pAT = 2 * a, pGC = 100 - pAT, hb = pAT * 2 + pGC * 3, n = 10, R = rng(5); // dez pares, como diz o subtítulo
    const pairs = []; let nat = Math.round(n * pAT / 100); const idx = [...Array(n).keys()].sort(() => R() - .5).slice(0, nat);
    for (let i = 0; i < n; i++) { const at = idx.includes(i), flip = R() < .5; pairs.push(at ? (flip ? ['A', 'T'] : ['T', 'A']) : (flip ? ['G', 'C'] : ['C', 'G'])); }
    const L = NAR ? { x: A.cx, y0: A.y0 + 6, h: A.h * .58 } : { x: A.x0 + A.w * .28, y0: A.y0 + 8, h: A.h - 16 }, hw = NAR ? A.w * .32 : Math.min(A.w * .2, 150), sp = L.h / n;
    for (let i = 0; i < n; i++) {
      const y = L.y0 + sp * (i + .5), tw2 = Math.cos(t * .5 + i * .45), w = hw * (.55 + .45 * Math.abs(tw2)), xl = L.x - w, xr = L.x + w, [b1, b2] = pairs[i];
      if (i) { line(L.x - hw * (.55 + .45 * Math.abs(Math.cos(t * .5 + (i - 1) * .45))), y - sp, xl, y, rgba(C.creme, .7), 3); line(L.x + hw * (.55 + .45 * Math.abs(Math.cos(t * .5 + (i - 1) * .45))), y - sp, xr, y, rgba(C.creme, .7), 3); }
      circ(xl, y, 5, C.p); circ(xr, y, 5, C.p);
      rr(xl + 6, y - sp * .28, L.x - xl - 10, sp * .56, 4, BASE[b1]); rr(L.x + 4, y - sp * .28, xr - L.x - 10, sp * .56, 4, BASE[b2]);
      const nb = b1 === 'A' || b1 === 'T' ? 2 : 3; for (let k = 0; k < nb; k++) line(L.x - 3, y + (k - (nb - 1) / 2) * 4, L.x + 3, y + (k - (nb - 1) / 2) * 4, '#0B0F1C', 1.2);
      if (w > hw * .5) { tx(b1, (xl + L.x) / 2 + 2, y + .5, { s: 12, w: 700, c: '#0B0F1C', bg: false }); tx(b2, (xr + L.x) / 2 - 2, y + .5, { s: 12, w: 700, c: '#0B0F1C', bg: false }); }
    }
    if (!NAR) { tx("5'", L.x - hw - 14, L.y0 + 8, { s: 12, f: FD, w: 500, c: C.dim }); tx("3'", L.x + hw + 14, L.y0 + 8, { s: 12, f: FD, w: 500, c: C.dim }); }
    // cálculo
    const qx = NAR ? A.x0 + 6 : A.x0 + A.w * .56, qy = NAR ? A.y0 + A.h * .64 : A.y0 + 30, bw = NAR ? A.w - 70 : A.w * .3;
    [['A', a], ['T', a], ['G', g], ['C', g]].forEach(([b, v], k) => { const y = qy + k * (NAR ? 22 : 34); rr(qx, y - 8, 24, 18, 4, BASE[b]); tx(b, qx + 12, y + 1, { s: 12, w: 700, c: '#0B0F1C', bg: false }); rr(qx + 32, y - 5, bw, 12, 3, 'rgba(91,108,153,.2)'); rr(qx + 32, y - 5, bw * v / 50, 12, 3, BASE[b]); tx(v + ' %', qx + 40 + bw, y + 1, { a: 'left', f: FD, s: 13, w: 500, c: C.txt, bg: false }); });
    if (!NAR) { const y = qy + 4 * 34 + 16; tl([`em 100 pares: ${pAT} A–T e ${pGC} G–C`, `ligações de H: ${pAT} × 2 + ${pGC} × 3 = ${hb}`], qx + bw / 2, y, { c: C.txt }); }
    cap(`A = T = ${a}% e G = C = ${g}%; em 100 pares (aqui, dez são mostrados), ${hb} ligações de hidrogênio`);
  }
}));

// ---------- DNA e RNA em 3D (mol3d.js): modelo simplificado com uma conta por fosfato e por açúcar e uma placa por base ----------
// As pontas das bases trazem os átomos (N e O) que fazem as ligações de hidrogênio: 2 no par A–T ou A–U e 3 no par G–C.
const NA3 = {
  nome: { A: 'Adenina (A)', T: 'Timina (T)', G: 'Guanina (G)', C: 'Citosina (C)', U: 'Uracila (U)' },
  frase: { A: 'Base púrica, de dois anéis. Pareia com a timina no DNA e com a uracila no RNA, por 2 ligações de hidrogênio.', T: 'Base pirimídica, de um anel, que só existe no DNA. Pareia com a adenina por 2 ligações de hidrogênio.', G: 'Base púrica, de dois anéis. Pareia com a citosina por 3 ligações de hidrogênio.', C: 'Base pirimídica, de um anel. Pareia com a guanina por 3 ligações de hidrogênio.', U: 'Base pirimídica do RNA, no lugar da timina. Pareia com a adenina por 2 ligações de hidrogênio.' },
  pontas: { A: ['N', 'N'], T: ['O', 'N'], U: ['O', 'N'], G: ['O', 'N', 'N'], C: ['N', 'N', 'O'] },
  par: { A: 'T', T: 'A', G: 'C', C: 'G' }, parR: { A: 'U', U: 'A', G: 'C', C: 'G' },
  fosfato: { nome: 'Fosfato', frase: 'Une o açúcar de um nucleotídeo ao do seguinte (ligação fosfodiéster) e forma o esqueleto da fita com os açúcares.' },
  desoxi: { nome: 'Desoxirribose', frase: 'Açúcar de 5 carbonos do DNA; tem um oxigênio a menos no carbono 2 do que a ribose (daí o nome "desoxi").' },
  ribose: { nome: 'Ribose', frase: 'Açúcar de 5 carbonos do RNA; o grupo OH a mais no carbono 2 deixa o RNA menos estável do que o DNA.' },
  ponta: { N: 'Nitrogênio da base', O: 'Oxigênio da base' }, frasePonta: 'Fica na borda da base e faz ligação de hidrogênio com a base da outra fita.',
  dna: [], rna: { pontes: [] }
};
const purina = b => b === 'A' || b === 'G';
// base: placa do açúcar s até a ponta e, com os átomos de pareamento; devolve os índices das pontas
function base3d(M, b, s, e, op) {
  const u = v3.n([e[0] - s[0], e[1] - s[1], e[2] - s[2]]), w = v3.n(v3.x(u, [0, 1, 0])), n = NA3.pontas[b].length;
  M.grupo(op.grupo, { nome: NA3.nome[b], frase: NA3.frase[b], cor: BASE[b] });
  const fim = M.atomo('X', e, { no: op.no, grupo: op.grupo, r: [0, 0], cor: BASE[b] });
  M.ligacao(op.s, fim, { forma: 'placa', cor: BASE[b], larg: [2.3, 3.4], esp: [.9, 3.1] });
  return NA3.pontas[b].map((el, k) => M.atomo(el, v3.s(v3.s(e, v3.k(u, -.25)), v3.k(w, (k - (n - 1) / 2) * .95)), { no: op.no, grupo: op.grupo, r: [.42, .9], nome: NA3.ponta[el], frase: NA3.frasePonta }));
}
function na3dMontar(M) {
  const ang = d => d * PI / 180, at = (x0, r, a, y) => [x0 + r * Math.cos(a), y, -r * Math.sin(a)]; // hélice destra
  const nt = (M2, el, p, o, info) => M2.atomo(el, p, Object.assign({ r: el === 'P' ? [1, 2.3] : [1.05, 2.2], cor: el === 'P' ? C.p : C.creme, nome: info.nome, frase: info.frase }, o));
  const fita = { cor: C.creme, raio: .42 };
  // ----- DNA: 12 pares de bases, forma B (10 pares por volta, 3,4 Å por par) -----
  const seq = 'GCATGCGTACGA', n = seq.length, X0 = -13, Y0 = -(n - 1) * 3.38 / 2, rS = 6.4, rP = 8.9, sep = ang(140);
  M.no('dna', { origem: [X0, 0, 0] });
  M.grupo('d1', { nome: 'Fita do DNA', cor: C.creme, frase: 'Esqueleto de desoxirribose e fosfato; as bases ficam para dentro da hélice.' });
  M.grupo('d2', { nome: 'Fita complementar do DNA', cor: C.creme, frase: 'Corre no sentido oposto ao da outra fita (antiparalela) e tem as bases complementares.' });
  NA3.dna = []; const P1 = [], S1 = [], P2 = [], S2 = [];
  for (let i = 0; i < n; i++) {
    const a1 = i * ang(36), a2 = a1 + sep, y = Y0 + i * 3.38, b1 = seq[i], b2 = NA3.par[b1], no2 = 'n2-' + i;
    const s1 = at(X0, rS, a1, y), s2 = at(X0, rS, a2, y), out = [Math.cos(a2), 0, -Math.sin(a2)];
    M.no(no2, { pai: 'dna', origem: s2 });
    P1.push(nt(M, 'P', at(X0, rP, a1 - ang(17), y - 1.5), { no: 'dna', grupo: 'd1' }, NA3.fosfato)); S1.push(nt(M, 'X', s1, { no: 'dna', grupo: 'd1' }, NA3.desoxi));
    P2.push(nt(M, 'P', at(X0, rP, a2 + ang(17), y + 1.5), { no: no2, grupo: 'd2' }, NA3.fosfato)); S2.push(nt(M, 'X', s2, { no: no2, grupo: 'd2' }, NA3.desoxi));
    const u = v3.n([s2[0] - s1[0], 0, s2[2] - s1[2]]), L = Math.hypot(s2[0] - s1[0], s2[2] - s1[2]) - 2.6, f = purina(b1) ? .56 : .44;
    const e1 = v3.s(s1, v3.k(u, L * f)), e2 = v3.s(s2, v3.k(u, -L * (1 - f)));
    const t1 = base3d(M, b1, s1, e1, { no: 'dna', grupo: 'b1-' + i, s: S1[i] }), t2 = base3d(M, b2, s2, e2, { no: no2, grupo: 'b2-' + i, s: S2[i] });
    const pts = t1.map((a, k) => M.ponteH(a, t2[k]));
    if (i === 5) M.rotulo(pts[1], b1 + b2 === 'GC' || b1 + b2 === 'CG' ? 'par G–C' : 'par A–T', 2);
    if (i === 3) M.rotulo(pts[0], 'par A–T', 3);
    NA3.dna.push({ no: M.nos[no2], out, pts });
  }
  for (let i = 0; i < n; i++) {
    M.ligacao(P1[i], S1[i], fita); if (i < n - 1) M.ligacao(S1[i], P1[i + 1], fita);
    M.ligacao(P2[i], S2[i], fita); if (i > 0) M.ligacao(S2[i], P2[i - 1], fita);
  }
  M.rotulo(P2[n - 1], 'DNA', 0); M.rotulo(P1[8], 'fosfato', 5); M.rotulo(S1[2], 'desoxirribose', 6);
  // ----- RNA: grampo com haste de 4 pares e alça de 4 bases (5' GGAC UUCG GUCC 3') -----
  const sr = 'GGACUUCGGUCC', XR = 14, YR = -10, rr = 6.8, rp = 9.2, sepR = ang(150), sg = [], tipo = [], noDe = i => (i >= 6 ? 'rB' : 'rna');
  M.grupo('r1', { nome: 'Fita do RNA', cor: C.creme, frase: 'Uma fita só, de ribose e fosfato; ela dobra sobre si mesma e pareia trechos complementares.' });
  for (let i = 0; i < 4; i++) { const a = i * ang(33); sg[i] = at(XR, rr, a, YR + i * 2.9); sg[11 - i] = at(XR, rr, a + sepR, YR + i * 2.9); }
  const ua = v3.n([sg[8][0] - sg[3][0], 0, sg[8][2] - sg[3][2]]), R = Math.hypot(sg[8][0] - sg[3][0], sg[8][2] - sg[3][2]) / 2, cen = [(sg[3][0] + sg[8][0]) / 2, sg[3][1] + 2.2, (sg[3][2] + sg[8][2]) / 2];
  for (let k = 1; k <= 4; k++) { const a = PI - k * PI / 5; sg[3 + k] = v3.s(v3.s(cen, v3.k(ua, R * Math.cos(a))), [0, R * 1.05 * Math.sin(a), 0]); }
  const apice = v3.s(cen, [0, R * 1.05 + .4, 0]);
  M.no('rna', { origem: [XR, 0, 0] }); M.no('rB', { pai: 'rna', origem: apice, eixo: v3.x(ua, [0, 1, 0]) });
  const Sr = [], Pr = [], pontas = [];
  for (let i = 0; i < 12; i++) {
    const prev = i ? sg[i - 1] : v3.s(sg[0], [0, -3, 0]), mid = v3.k(v3.s(prev, sg[i]), .5), alca = i >= 4 && i <= 8;
    const ref = alca ? cen : [XR, mid[1], 0], o = v3.n([mid[0] - ref[0], 0, mid[2] - ref[2]]);
    Pr.push(nt(M, 'P', v3.s(mid, v3.k(o, alca ? 1.4 : 2.4)), { no: noDe(i), grupo: 'r1' }, NA3.fosfato));
    Sr.push(nt(M, 'X', sg[i], { no: noDe(i), grupo: 'r1' }, NA3.ribose));
  }
  for (let i = 0; i < 12; i++) {
    const b = sr[i], s = sg[i];
    let e;
    if (i >= 4 && i <= 7) { const u = v3.n([s[0] - cen[0], s[1] - cen[1], s[2] - cen[2]]); e = v3.s(s, v3.k(u, 3.2)); } // bases da alça, sem par, viradas para fora
    else { const j = i < 4 ? 11 - i : 11 - i, o = sg[j], u = v3.n([o[0] - s[0], 0, o[2] - s[2]]), L = Math.hypot(o[0] - s[0], o[2] - s[2]) - 2.6; e = v3.s(s, v3.k(u, L * (purina(b) ? .56 : .44))); }
    pontas[i] = base3d(M, b, s, e, { no: noDe(i), grupo: 'r' + i, s: Sr[i] });
    if (i >= 4 && i <= 7) pontas[i] = null;
  }
  NA3.rna.pontes = [];
  for (let j = 0; j < 4; j++) { const a = 3 - j, b = 8 + j; NA3.rna.pontes.push(pontas[a].map((x, k) => M.ponteH(x, pontas[b][k]))); }
  for (let i = 0; i < 12; i++) { M.ligacao(Pr[i], Sr[i], fita); if (i < 11) M.ligacao(Sr[i], Pr[i + 1], fita); }
  NA3.rna.no = M.nos.rB;
  M.rotulo(Pr[5], 'RNA', 1); M.rotulo(pontas[9][0], 'uracila', 4); M.rotulo(Sr[1], 'ribose', 7);
  M.vista = { th: -.32, fi: .18, zoom: 1 };
}
function na3dAnimar(M, P) {
  NA3.dna.forEach((d, i) => {
    const e = P.passo === 1 ? P.entre(i * .16, i * .16 + .8) : 1, k = P.passo === 1 ? P.linear(i * .16 + .6, i * .16 + 1) : 1;
    d.no.pos = v3.k(d.out, 7 * (1 - e)); d.pts.forEach(p => { p.k = k; });
  });
  const f = P.passo === 2 ? P.entre(0, 1.4) : 1;
  NA3.rna.no.ang = 2.3 * (1 - f);
  NA3.rna.pontes.forEach((ps, j) => { const k = P.passo === 2 ? P.linear(1.1 + j * .22, 1.5 + j * .22) : 1; ps.forEach(p => { p.k = k; }); });
}

def('na', 'dna-rna', MOL3D.cena({
  t: 'DNA × RNA', s: 'duas fitas ou uma; T ou U', c: C.na, loc: 'Modelo 3D simplificado', still: 3,
  ctl: escolha('Passo', ['as duas', 'DNA pareia', 'RNA dobra'], 7),
  montar: na3dMontar, animar: na3dAnimar,
  legenda: P => ['DNA: duas fitas em dupla hélice, com timina. RNA: uma fita, com uracila, que dobra sobre si mesma', 'As fitas do DNA se unem pelas bases: A com T por 2 ligações de hidrogênio, G com C por 3', 'A fita do RNA dobra e pareia trechos dela mesma: A com U e G com C'][P.passo],
  alt: 'À esquerda, o DNA em dupla hélice; à direita, o RNA em fita simples dobrada sobre si mesma',
  d: `<p><b>O DNA guarda a informação genética; o RNA a usa para fabricar proteínas.</b> O DNA tem duas fitas enroladas em dupla hélice, com desoxirribose e as bases A, T, G e C. Fica no núcleo dos eucariontes (e também nas mitocôndrias e nos cloroplastos) e se duplica antes de a célula se dividir.</p>
<p>O RNA tem uma fita só, com ribose e as bases A, U, G e C. É feito a partir de um trecho do DNA (<b>transcrição</b>) e tem vários tipos: o <b>RNA mensageiro</b> leva a receita da proteína ao ribossomo; o <b>RNA transportador</b> leva os aminoácidos; o <b>RNA ribossômico</b> forma o ribossomo junto com proteínas. A fita do RNA pode dobrar sobre si mesma e parear trechos, como no RNA transportador.</p>
<p>Num ser vivo, todas as células têm o mesmo DNA (com poucas exceções, como as hemácias dos mamíferos, que não têm núcleo, e os gametas, que têm metade do DNA), mas cada tipo de célula produz RNAs diferentes, conforme os genes que estão ativos.</p>`,
  kv: [['Fitas', 'DNA: duas; RNA: uma'], ['Pentose', 'DNA: desoxirribose; RNA: ribose'], ['Bases exclusivas', 'DNA: timina; RNA: uracila'], ['Função', 'DNA: guardar e transmitir; RNA: produzir proteínas'], ['Onde', 'DNA: núcleo, mitocôndria, cloroplasto; RNA: núcleo, citoplasma (ribossomos), mitocôndria e cloroplasto']],
  enem: 'Além da tabela de diferenças, a prova cobra o fluxo da informação: do DNA para o RNA e do RNA para a proteína. Vírus de RNA (como o da gripe e o da covid-19) e as vacinas de RNA mensageiro também aparecem; lembre que o RNA da vacina não entra no núcleo nem altera o nosso DNA.',
  links: [LK.dna, ['Nucleotídeos', '#na/nucleotideo']],
  // desenho plano antigo: só aparece se o 3D não abrir neste navegador
  plano(t) {
    const A = area(), half = NAR ? A.h / 2 : A.w / 2, R = rng(8), seqD = 'ATGGTGCACCTGACTCCTGAGGAG', seqR = 'GCGGAUUUAGCUCAGUUGGGAGAGC';
    // DNA
    const D = NAR ? { x0: A.x0, y0: A.y0, w: A.w, h: half - 8 } : { x0: A.x0, y0: A.y0, w: half - 12, h: A.h };
    rr(D.x0, D.y0, D.w, D.h, 12, 'rgba(19,26,43,.5)', C.line, 1); tx('DNA: dupla hélice', D.x0 + D.w / 2, D.y0 + 16, { w: 600, c: C.na });
    const n = NAR ? 16 : 18, x0 = D.x0 + 20, sp = (D.w - 40) / (n - 1), cy = D.y0 + D.h * .55, amp = Math.min(D.h * .25, 60);
    for (let i = 0; i < n; i++) { const x = x0 + i * sp, ph = i * .55 + t * .6, y1 = cy + Math.sin(ph) * amp, y2 = cy - Math.sin(ph) * amp, b = seqD[i % seqD.length], c2 = { A: 'T', T: 'A', G: 'C', C: 'G' }[b]; line(x, y1, x, (y1 + y2) / 2, BASE[b], 3); line(x, (y1 + y2) / 2, x, y2, BASE[c2], 3); const front = Math.cos(ph) > 0; circ(x, y1, 4, front ? C.creme : rgba(C.creme, .45)); circ(x, y2, 4, front ? rgba(C.creme, .45) : C.creme); }
    tx('A–T e G–C', D.x0 + D.w / 2, D.y1 - 14, { s: 12, c: C.dim });
    // RNA (grampo)
    const Rr = NAR ? { x0: A.x0, y0: A.y0 + half + 8, w: A.w, h: half - 8 } : { x0: A.x0 + half + 12, y0: A.y0, w: half - 12, h: A.h };
    rr(Rr.x0, Rr.y0, Rr.w, Rr.h, 12, 'rgba(19,26,43,.5)', C.line, 1); tx('RNA: fita simples', Rr.x0 + Rr.w / 2, Rr.y0 + 16, { w: 600, c: C.na });
    const m = 12, s2 = Math.min((Rr.h - 70) / (m / 2 + 1), 26), cx = Rr.x0 + Rr.w / 2, top = Rr.y0 + 40;
    const pts = []; for (let i = 0; i < m; i++) { const side = i < m / 2 ? -1 : 1, k = i < m / 2 ? i : m - 1 - i; pts.push([cx + side * s2 * .9 + Math.sin(t + i) * 1.5, top + (m / 2 - k) * s2]); }
    for (let i = 0; i < m / 2 - 1; i++) { const a = seqR[i], b = { A: 'U', U: 'A', G: 'C', C: 'G' }[a]; line(pts[i][0], pts[i][1], pts[m - 1 - i][0], pts[m - 1 - i][1], 'rgba(143,216,255,.5)', 1.5, [2, 3]); }
    poly(pts, rgba(C.creme, .7), 3); pts.forEach((p, i) => { const b = i < m / 2 - 1 ? seqR[i] : i > m / 2 ? { A: 'U', U: 'A', G: 'C', C: 'G' }[seqR[m - 1 - i]] : 'A'; circ(p[0], p[1], 9, BASE[b], 'rgba(11,15,28,.5)', 1); tx(b, p[0], p[1] + .5, { s: 12, w: 700, c: '#0B0F1C', bg: false }); });
    tx('dobra sobre si mesma; U no lugar de T', cx, Rr.y1 - 14, { s: 12, c: C.dim });
    cap('DNA: duas fitas, desoxirribose e timina. RNA: uma fita, ribose e uracila');
  }
}));
