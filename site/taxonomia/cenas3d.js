/* LAB Taxonomia: peças de cena em 3D (Martin), sobre o kit taxo3d.js. Cada peça entra no desenho 2D da cena no lugar
   do desenho plano, na mesma posição e na mesma ordem de pintura; sem WebGL, a cena desenha o 2D antigo (plano B).
   Peças: o livro Systema Naturae (capa inventada, sóbria, sem copiar nenhuma capa real), a exsicata de herbário com um
   ramo de tomateiro prensado, o mapa do Brasil em relevo com as zonas dos nomes populares e os ossos dos membros
   anteriores (homologia), com cor fixa por osso: úmero, rádio e ulna, punho e dedos. */
'use strict';
(function () {
  const K3 = window.TAXO3D; if (!K3) return;
  const TAU = Math.PI * 2, cl = (v, a, b) => (v < a ? a : v > b ? b : v);
  const FTH = () => (typeof FH === 'string' ? FH : 'sans-serif'), FTT = () => (typeof FT === 'string' ? FT : 'sans-serif');
  function tela(w, h, fn) { const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), w, h); return c; }
  function textura(T, c) { const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4; return t; }
  function grao(x, w, h, k, sem) { let s = sem || 7; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; for (let i = 0; i < w * h / 60; i++) { x.fillStyle = `rgba(${r() < .5 ? '0,0,0' : '255,255,255'},${r() * k})`; x.fillRect(r() * w, r() * h, 1 + r() * 2, 1 + r() * 2); } }

  // ---------- livro: Systema Naturae, capa de couro com filete dourado (desenho próprio) ----------
  K3.PROP.livro = {
    nome: 'Livro de Lineu (capa de desenho próprio)', marg: 1.22, viva: .8,
    chave: o => (o.ano || '') + ':' + (o.tit || []).join('') + ':' + Math.round((o.asp || .69) * 100),
    pose: () => ({ yaw: .38, pitch: .1 }),
    montar(b, o, T, mat) {
      const a = o.asp || .69, H = 1.72, Wd = H * a, E = .2, ano = String(o.ano || 1735);
      const ouro = '#D9B45A', couro = '#5B2E22';
      const capa = tela(512, Math.round(512 / a), (x, w, h) => {
        const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#6B3628'); g.addColorStop(1, '#4A2219'); x.fillStyle = g; x.fillRect(0, 0, w, h); grao(x, w, h, .08, 11);
        x.strokeStyle = ouro; x.lineWidth = 6; x.strokeRect(26, 26, w - 52, h - 52); x.lineWidth = 2; x.strokeRect(42, 42, w - 84, h - 84);
        x.fillStyle = ouro; x.textAlign = 'center'; x.textBaseline = 'middle';
        x.font = `600 ${Math.round(w * .055)}px ${FTH()}`; x.fillText('CAROLI LINNAEI', w / 2, h * .17);
        const tit = o.tit || ['SYSTEMA', 'NATURAE']; x.font = `700 100px ${FTH()}`;
        const fs = Math.min(w * .115, 100 * w * .74 / Math.max(...tit.map(l => x.measureText(l).width)));
        x.font = `700 ${Math.round(fs)}px ${FTH()}`; x.fillText(tit[0], w / 2, h * .33); x.fillText(tit[1], w / 2, h * .33 + fs * 1.22);
        x.lineWidth = 2; for (let i = 0; i < 3; i++) { x.beginPath(); x.moveTo(w * .32, h * .58 + i * 12); x.lineTo(w * .68, h * .58 + i * 12); x.stroke(); }
        // ornamento: um ramo simples com folhas, traço próprio
        x.lineWidth = 3; x.beginPath(); x.moveTo(w * .5, h * .8); x.lineTo(w * .5, h * .68); x.stroke();
        for (let i = 0; i < 3; i++) for (const s of [-1, 1]) { x.beginPath(); x.ellipse(w * .5 + s * w * .04, h * (.705 + i * .03), w * .035, w * .014, s * .5, 0, TAU); x.fill(); }
        x.font = `500 ${Math.round(w * .07)}px ${FTH()}`; x.fillText(ano, w / 2, h * .89);
      });
      const tCapa = textura(T, capa), Mc = mat(couro, { r: .55, cc: .45, sh: .25 });
      const Mf = new T.MeshPhysicalMaterial({ map: tCapa, roughness: .5, clearcoat: .45, clearcoatRoughness: .4, sheen: .2, envMapIntensity: .6 });
      const cx = new T.BoxGeometry(Wd, H, .035);
      const frente = new T.Mesh(cx, [Mc, Mc, Mc, Mc, Mf, Mc]); frente.position.z = E / 2; b.raiz.add(frente);
      const tras = new T.Mesh(cx, Mc); tras.position.z = -E / 2; b.raiz.add(tras);
      const pag = new T.Mesh(new T.BoxGeometry(Wd - .05, H - .07, E - .02), mat('#EFE4C6', { r: .8, cc: 0, listras: { cor: '#C9B88E', n: 160, eixo: 'z', k: .35, lim: .7, onda: .001 } })); pag.position.x = .02; b.raiz.add(pag);
      const lomb = new T.Mesh(new T.CylinderGeometry(E / 2 + .02, E / 2 + .02, H, 20, 1, false, Math.PI, Math.PI), Mc); lomb.position.x = -Wd / 2; b.raiz.add(lomb);
      const Mo = mat(ouro, { r: .3, cc: .8, env: 1 });
      [-.62, -.48, .48, .62].forEach(y => { const f = new T.Mesh(new T.CylinderGeometry(E / 2 + .026, E / 2 + .026, .018, 20, 1, false, Math.PI, Math.PI), Mo); f.position.set(-Wd / 2, y * H / 1.72, 0); b.raiz.add(f); });
      return { anima: (t, A) => { A.corpo.position.y = K3.reduz ? 0 : Math.sin(t * .8) * .012; } };
    }
  };

  // ---------- exsicata: folha de herbário com um ramo de tomateiro prensado e a etiqueta ----------
  K3.PROP.herbario = {
    nome: 'Exsicata de herbário: ramo de tomateiro prensado', marg: 1.15, viva: .6,
    chave: o => Math.round((o.asp || 1) * 50),
    pose: () => ({ yaw: -.12, pitch: .22 }),
    montar(b, o, T, mat) {
      const a = o.asp || 1, H = 1.8, Wd = H * a;
      const papel = tela(Math.round(400 * a), 400, (x, w, h) => {
        x.fillStyle = '#EFE6D0'; x.fillRect(0, 0, w, h); grao(x, w, h, .05, 5);
        // etiqueta grande: a folha é pequena na tela (cerca de 150 px), então o texto precisa de 34 px na textura para ficar legível
        const ew = Math.min(w * .54, 262), eh = 168, ex = w - ew - 12, ey = h - eh - 12;
        x.fillStyle = '#FBF7EC'; x.fillRect(ex, ey, ew, eh); x.strokeStyle = '#8A7A5A'; x.lineWidth = 3; x.strokeRect(ex, ey, ew, eh);
        x.fillStyle = '#3A2E1F'; x.textAlign = 'left'; x.textBaseline = 'middle';
        x.font = `700 28px ${FTT()}`; x.fillText('Herbário', ex + 14, ey + 28);
        x.font = `italic 700 32px ${FTT()}`; x.fillText('Solanum', ex + 14, ey + 68); x.fillText('lycopersicum', ex + 14, ey + 106);
        x.font = `600 28px ${FTT()}`; x.fillText('tomateiro', ex + 14, ey + 144);
      });
      const Mp = new T.MeshPhysicalMaterial({ map: textura(T, papel), roughness: .85, clearcoat: 0, envMapIntensity: .5 });
      const folha = new T.Mesh(new T.BoxGeometry(Wd, H, .02), [mat('#E2D7BC', { r: .9 }), mat('#E2D7BC', { r: .9 }), mat('#E2D7BC', { r: .9 }), mat('#E2D7BC', { r: .9 }), Mp, mat('#E2D7BC', { r: .9 })]); b.raiz.add(folha);
      // ramo prensado: tudo achatado contra o papel
      const pl = b.grupo([-Wd * .24, -.05, .03]); pl.scale.set(Math.min(1, a * .95), 1, .25);
      const Mh = mat('#6E8A3E', { r: .7 }), Mv = mat('#5E8F3E', { lados: 1, r: .65, cc: .15 }), Mfl = mat('#E8C23A', { r: .5 });
      b.tubo(Mh, [[-.1, -.82, 0], [0, -.3, 0], [.05, .2, 0], [-.05, .7, 0]], f => .03 * (1 - f * .5), pl, { seg: 20 });
      [[-.55, .9], [-.25, -.85], [.05, .95], [.35, -.9], [.55, .7]].forEach(([y, s], i) => {
        const fg = b.grupo([0, y, 0], pl, [0, 0, s > 0 ? .5 : Math.PI - .5]), L = .5 - i * .04;
        b.tubo(Mh, [[0, 0, 0], [L, 0, 0]], .012, fg, { seg: 4, rad: 6 });
        for (let j = 0; j < 3; j++) { const xx = L * (.35 + j * .3); b.folha(Mv, .2 - j * .02, .07, .05, .04, [xx, 0, 0], [0, 0, .9], fg, { forma: 'oval' }); b.folha(Mv, .2 - j * .02, .07, .05, .04, [xx, 0, 0], [0, 0, -.9], fg, { forma: 'oval' }); }
        b.folha(Mv, .22, .08, .05, .04, [L, 0, 0], [0, 0, 0], fg, { forma: 'oval' });
      });
      [[.18, .82], [-.2, .74], [.0, .9]].forEach(([x, y]) => { const fg = b.grupo([x, y, .02], pl); for (let k = 0; k < 5; k++) b.folha(Mfl, .09, .035, 0, 0, [0, 0, 0], [0, 0, k * TAU / 5], fg, { forma: 'oval' }); b.sph(mat('#D9A02A', {}), [0, 0, .01], .02, null, fg); });
      b.sph(mat('#7FAE4A', { r: .35, cc: .8 }), [.22, .48, .02], .07, null, pl);
      return {};
    }
  };

  // ---------- mapa do Brasil em relevo (contorno esquemático da equipe) com as zonas dos nomes populares ----------
  K3.PROP.mapa = {
    nome: 'Mapa esquemático do Brasil', marg: 1.04, viva: .25, toque: false,
    chave: () => 'br',
    pose: () => ({ yaw: 0, pitch: -.24 }),
    montar(b, o, T, mat) {
      const pj = (lo, la) => [((lo + 75) / 42) * 2 - 1, -(((6 - la) / 42) * 2 - 1)];
      const sh = new T.Shape(); o.br.forEach((p, i) => { const q = pj(p[0], p[1]); if (i) sh.lineTo(q[0], q[1]); else sh.moveTo(q[0], q[1]); });
      const geo = new T.ExtrudeGeometry(sh, { depth: .07, bevelEnabled: true, bevelThickness: .02, bevelSize: .015, bevelSegments: 3, curveSegments: 4 }); geo.translate(0, 0, -.07);
      const topo = tela(512, 512, (x, w, h) => {
        x.fillStyle = '#1F2A47'; x.fillRect(0, 0, w, h); grao(x, w, h, .04, 3);
        (o.zon || []).forEach(z => { const q = pj(z.lo, z.la), px = (q[0] + 1) / 2 * w, py = (1 - (q[1] + 1) / 2) * h, r = z.r / 42 * w * 1.3, g = x.createRadialGradient(px, py, 0, px, py, r); g.addColorStop(0, z.c + 'B8'); g.addColorStop(.55, z.c + '55'); g.addColorStop(1, z.c + '00'); x.fillStyle = g; x.fillRect(px - r, py - r, 2 * r, 2 * r); });
      });
      const tx = textura(T, topo); tx.repeat.set(.5, .5); tx.offset.set(.5, .5);
      const Mt = new T.MeshPhysicalMaterial({ map: tx, roughness: .82, clearcoat: .12, clearcoatRoughness: .6, envMapIntensity: .22 }), Ml = mat('#1B2440', { r: .6, cc: .3 });
      const m = new T.Mesh(geo, [Mt, Ml]); b.raiz.add(m);
      b.raiz.scale.y = 1 / Math.cos(.24);
      return {};
    }
  };

  // ---------- ossos dos membros anteriores (homologia): cada osso com as duas cabeças, cor fixa por osso ----------
  const OSSOG = {};
  function geoOsso(T, L, r) {
    const k = (L * 100 | 0) + ':' + (r * 1000 | 0); if (OSSOG[k]) return OSSOG[k];
    const e = Math.min(r * 1.1, L * .22), P = [[0, -L / 2], [r * 1.05, -L / 2 + e * .25], [r * 1.32, -L / 2 + e * .8], [r * 1.08, -L / 2 + e * 1.7], [r * .86, -L * .12], [r * .84, 0], [r * .86, L * .12], [r * 1.08, L / 2 - e * 1.7], [r * 1.32, L / 2 - e * .8], [r * 1.05, L / 2 - e * .25], [0, L / 2]];
    return (OSSOG[k] = new T.LatheGeometry(P.map(p => new T.Vector2(Math.max(1e-4, p[0]), p[1])), 16));
  }
  K3.PROP.membro = {
    nome: 'Ossos do membro anterior', marg: 1.08, viva: .55, toque: false,
    chave: o => o.k,
    pose: () => ({ yaw: 0, pitch: .05 }),
    montar(b, o, T, mat) {
      const m = o.m, bb = m.bb, cx = (bb.x0 + bb.x1) / 2, cy = (bb.y0 + bb.y1) / 2, k = 2 / (bb.y1 - bb.y0), P = (x, y) => new T.Vector3((x - cx) * k, -(y - cy) * k, 0);
      const C = o.cores || { u: '#F2B33D', r: '#6FA8FF', m: '#6CCB7A' }, M = {}, Md = {};
      for (const t of ['u', 'r', 'm']) { M[t] = mat(C[t], { r: .42, cc: .55, sh: .15 }); Md[t] = mat(C[t], { r: .5, cc: .3, op: .26 }); }
      const ossos = [], Y = new T.Vector3(0, 1, 0);
      m.b.forEach(([x1, y1, x2, y2, w, t]) => {
        const a = P(x1, y1), c = P(x2, y2), d = c.clone().sub(a), L = d.length(); if (L < 1e-4) return;
        const me = new T.Mesh(geoOsso(T, L, w / 2 * k * .92), M[t]); me.position.copy(a).add(c).multiplyScalar(.5); me.quaternion.setFromUnitVectors(Y, d.normalize()); me.scale.z = .85;
        b.raiz.add(me); ossos.push([me, t]);
      });
      (m.c || []).forEach(([x, y, r]) => { const me = new T.Mesh(new T.SphereGeometry(1, 16, 12), M.m); me.position.copy(P(x, y)); me.scale.set(r * k, r * k * .92, r * k * .75); b.raiz.add(me); ossos.push([me, 'm']); });
      return { anima: (t, A, oo) => { const hl = oo.hl; ossos.forEach(([me, ty]) => { me.material = hl == null || hl === ty ? M[ty] : Md[ty]; me.renderOrder = hl == null || hl === ty ? 1 : 0; }); } };
    }
  };
})();
