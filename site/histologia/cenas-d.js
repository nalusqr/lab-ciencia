/* LAB, módulo Histologia. Cenas D: tecido muscular (o sarcômero, do nervo à contração, energia para o músculo).
   Roteiro: docs/revisao-biologia/histologia-roteiro-b.md (Sapien). Código, textos e desenhos da equipe (Leo).
   Todos os desenhos são esquemas próprios em canvas 2D, no estilo da coloração HE. */
'use strict';
{
  // ---------------------------------------------------------------------------------
  // utilidades locais
  // ---------------------------------------------------------------------------------
  const ACH = '#5FD38D', ATPc = '#FF9A3C', PCc = '#6FD0E0', LACc = '#FFE1A6', AERc = '#F25C3B', TM = '#D9B98C', TN = '#9FB0C8';
  const um = (v, d = 2) => nbr(Math.max(0, v), d) + ' µm';
  const livre = S => !S.paused && (!S.touch || performance.now() - S.touch > 4000);
  // mostra o valor da faixa quando a própria cena muda S.v
  function showV(o, S) {
    const r = document.getElementById('ctlR'); if (!r) return; const s = o.ctl.f(S.v);
    if (S._lf !== s) { S._lf = s; r.value = S.v; const v = document.getElementById('ctlV'); if (v) v.textContent = s; r.setAttribute('aria-valuetext', s); }
  }
  // chave horizontal de x1 a x2; dir = -1 abre para cima (ponta em cima), 1 para baixo
  function brace(x1, x2, y, dir, c, lw = 1.6) {
    const w = x2 - x1, h = 7 * dir, m = (x1 + x2) / 2;
    X.strokeStyle = c; X.lineWidth = lw; X.beginPath();
    if (w < 22) { X.moveTo(x1, y); X.lineTo(x1, y + h); X.lineTo(x2, y + h); X.lineTo(x2, y); X.moveTo(m, y + h); X.lineTo(m, y + h * 2); X.stroke(); return; }
    const q = Math.min(10, w / 4);
    X.moveTo(x1, y); X.quadraticCurveTo(x1, y + h, x1 + q, y + h); X.lineTo(m - 6, y + h); X.quadraticCurveTo(m, y + h, m, y + h * 2);
    X.quadraticCurveTo(m, y + h, m + 6, y + h); X.lineTo(x2 - q, y + h); X.quadraticCurveTo(x2, y + h, x2, y); X.stroke();
  }
  // fileira de legendas com bolinha de cor; quebra a linha se precisar; devolve a altura usada
  function chips(list, x, y, maxw, center) {
    X.font = `600 12px ${FT}`; const ws = list.map(([s]) => X.measureText(s).width + 28), rows = [[]]; let acc = 0;
    ws.forEach((w, i) => { if (acc && acc + w > maxw) { rows.push([]); acc = 0; } rows[rows.length - 1].push(i); acc += w + 8; });
    rows.forEach((r, j) => {
      const tot = r.reduce((a, i) => a + ws[i] + 8, -8); let cx = center ? x + (maxw - tot) / 2 : x; const cy = y + j * 30;
      r.forEach(i => { const [s, c] = list[i]; rr(cx, cy, ws[i], 24, 999, 'rgba(11,15,28,.78)', 'rgba(255,255,255,.14)', 1); circ(cx + 12, cy + 12, 5, c); X.fillStyle = C.txt; X.textAlign = 'left'; X.textBaseline = 'middle'; X.font = `600 12px ${FT}`; X.fillText(s, cx + 22, cy + 12.5); cx += ws[i] + 8; });
    });
    return rows.length * 30;
  }

  // =================================================================================
  // TÓPICO: #muscular/sarcomero
  // =================================================================================
  {
    // medidas (µm): banda A 1,6 (fixa); filamento fino 1,0 de cada lado da linha Z
    const Lof = v => 2.5 - .5 * v / 100;
    // painéis do zoom: músculo, feixe, fibra, miofibrila
    function pMusculo(b) {
      const cy = b.y + b.h / 2;
      line(b.x, cy, b.x + b.w * .12, cy, '#EDE7DA', 4); line(b.x + b.w * .88, cy, b.x + b.w, cy, '#EDE7DA', 4);
      X.beginPath(); X.moveTo(b.x + b.w * .1, cy); X.bezierCurveTo(b.x + b.w * .3, b.y + 2, b.x + b.w * .7, b.y + 2, b.x + b.w * .9, cy); X.bezierCurveTo(b.x + b.w * .7, b.y + b.h - 2, b.x + b.w * .3, b.y + b.h - 2, b.x + b.w * .1, cy);
      const g = X.createLinearGradient(0, b.y, 0, b.y + b.h); g.addColorStop(0, light(C.musc, .2)); g.addColorStop(1, dark(C.musc, .25)); X.fillStyle = g; X.fill(); X.strokeStyle = 'rgba(11,15,28,.5)'; X.lineWidth = 1; X.stroke();
      for (let i = 1; i < 4; i++) { const k = i / 4; X.beginPath(); X.moveTo(b.x + b.w * .14, cy); X.quadraticCurveTo(b.x + b.w * .5, b.y + b.h * k, b.x + b.w * .86, cy); X.strokeStyle = rgba(C.he_rosa, .55); X.lineWidth = 1; X.stroke(); }
    }
    function pFeixe(b) {
      const cx = b.x + b.w / 2, cy = b.y + b.h / 2, r = Math.min(b.w, b.h) * .47, rf = r / 4.2;
      circ(cx, cy, r, rgba(C.he_rosa, .25), C.he_rosa, 2);
      X.save(); X.beginPath(); X.arc(cx, cy, r - 2, 0, TAU); X.clip();
      for (let j = -5; j <= 5; j++) for (let i = -5; i <= 5; i++) {
        const x = cx + (i + (j & 1) * .5) * rf * 1.732, y = cy + j * rf * 1.5; if (Math.hypot(x - cx, y - cy) > r) continue;
        ngon(x, y, rf * .97, 6, PI / 6, C.musc, 'rgba(11,15,28,.35)', 1); nuc(x + rf * .62, y - rf * .3, rf * .24, rf * .16, .5);
      }
      X.restore();
    }
    function pFibra(b, t) {
      const cy = b.y + b.h / 2, hh = b.h * .5;
      capsule(b.x + b.w / 2, cy, b.w - 6, hh); X.fillStyle = C.musc; X.fill(); X.strokeStyle = 'rgba(11,15,28,.5)'; X.lineWidth = 1; X.stroke();
      X.save(); capsule(b.x + b.w / 2, cy, b.w - 6, hh); X.clip();
      for (let x = b.x + 6; x < b.x + b.w - 4; x += 4.5) line(x, cy - hh / 2, x, cy + hh / 2, rgba('#7A2E3A', .45), 1.6);
      X.restore();
      for (let i = 0; i < 3; i++) { nuc(b.x + b.w * (.22 + i * .28), cy - hh / 2 + 3, 6, 2.6, 0, { seed: i + 2 }); nuc(b.x + b.w * (.36 + i * .26), cy + hh / 2 - 3, 6, 2.6, 0, { seed: i + 7 }); }
      void t;
    }
    // miofibrila: faixas que acompanham a contração; devolve o retângulo do sarcômero central
    function pMiof(b, L) {
      const cy = b.y + b.h / 2, hh = Math.max(10, b.h * .34), s = (b.w - 8) / 3 * (L / 2.5), cx = b.x + b.w / 2;
      X.save(); rr(b.x + 2, cy - hh / 2, b.w - 4, hh, hh / 2); X.clip();
      X.fillStyle = rgba(C.he_rosa, .45); X.fillRect(b.x, cy - hh, b.w, hh * 2);
      for (let n = -3; n <= 3; n++) {
        const zc = cx + n * s, a = s * 1.6 / L, hz = s * Math.max(0, L - 2) / L;
        X.fillStyle = '#8E3A4E'; X.fillRect(zc - a / 2, cy - hh / 2, a, hh);
        if (hz > .5) { X.fillStyle = '#B85A6B'; X.fillRect(zc - hz / 2, cy - hh / 2, hz, hh); }
        line(zc + s / 2, cy - hh / 2, zc + s / 2, cy + hh / 2, '#3B1F3A', 1.5);
      }
      X.restore(); rr(b.x + 2, cy - hh / 2, b.w - 4, hh, hh / 2, null, 'rgba(11,15,28,.5)', 1);
      return [cx - s / 2, cy - hh / 2 - 3, s, hh + 6];
    }

    def('muscular', 'sarcomero', {
      t: 'O sarcômero', s: 'a unidade que se contrai', c: C.musc, loc: 'Músculo estriado, dentro de cada miofibrila', still: 3, stillV: 55,
      ctl: { l: 'Contração', min: 0, max: 100, step: 1, v: 0, f: v => `${Math.round(v)}% (${um(Lof(v))})`, rate: () => 1 },
      alt: 'No alto, quatro quadros de zoom: o músculo com os tendões, um feixe de fibras em corte, uma fibra com estrias e núcleos na periferia e uma miofibrila com faixas claras e escuras. Embaixo, um sarcômero em esquema, de uma linha Z até a outra, com a actina azul presa às linhas Z e a miosina vermelha no meio. Chaves medem o sarcômero, a banda A, a banda I e a zona H; na contração a actina desliza para o centro, a banda I e a zona H encolhem e a banda A fica do mesmo tamanho',
      d: `<p>Um músculo esquelético é feito de feixes de <b>fibras</b> (as células), envoltos por tecido conjuntivo (endomísio, perimísio e epimísio) que continua nos tendões (ver <a href="#conjuntivo/propriamente">conjuntivo propriamente dito</a>). Dentro de cada fibra há centenas de <b>miofibrilas</b>, cilindros paralelos que ocupam quase todo o citoplasma. Cada miofibrila é uma fileira de unidades repetidas, os <b>sarcômeros</b>, de cerca de <span class="q">2,5 µm</span> cada um. O sarcômero vai de uma <b>linha Z</b> até a seguinte. Presos às linhas Z ficam os filamentos finos, de <b>actina</b>; no meio, entre eles, ficam os filamentos grossos, de <b>miosina</b>.</p>
<p>As estrias que se veem ao microscópio vêm desse arranjo. A <b>banda A</b>, escura, é onde está a miosina (com a ponta da actina sobreposta). A <b>banda I</b>, clara, tem só actina e é cortada ao meio pela linha Z. No centro da banda A fica a <b>zona H</b>, onde só há miosina. Na contração, os filamentos <b>não encolhem</b>: a actina <b>desliza</b> sobre a miosina em direção ao centro. As linhas Z se aproximam, o sarcômero fica mais curto, a banda I e a zona H diminuem, e a <b>banda A não muda de tamanho</b>. Esse é o <b>modelo do deslizamento dos filamentos</b>, proposto em 1954 por Huxley e Hanson e por Huxley e Niedergerke.</p>
<p>A faixa contrai o sarcômero de 0% (relaxado, cerca de <span class="q">2,5 µm</span>) a 100% (contraído, cerca de <span class="q">2,0 µm</span>), com as medidas atualizadas ao vivo.</p>`,
      kv: [['Sarcômero', 'de uma linha Z à seguinte; ≈ 2,5 µm relaxado, ≈ 2,0 µm contraído'], ['Banda A', 'escura; miosina (com a ponta da actina); ≈ 1,6 µm, não muda'], ['Banda I', 'clara; só actina; cortada pela linha Z; encolhe'], ['Zona H', 'centro da banda A; só miosina; encolhe'], ['Filamento fino', 'actina, ≈ 1,0 µm de cada lado da linha Z'], ['Modelo', 'deslizamento dos filamentos (1954)']],
      enem: 'A pegadinha: na contração, <b>nenhum filamento encurta</b>. A actina <b>desliza</b> sobre a miosina, as linhas Z se aproximam, e a <b>banda I e a zona H diminuem</b>, mas a <b>banda A fica igual</b>. As estrias do músculo esquelético e do cardíaco existem porque a actina e a miosina estão alinhadas em sarcômeros; no liso elas não estão, e por isso ele não tem estrias.',
      links: [['Os três tipos de músculo', '#muscular/tipos'], ['Do nervo à contração', '#muscular/contracao'], ['Envoltórios de conjuntivo', '#conjuntivo/propriamente']],
      draw(t, S) {
        const A = area(), o = this;
        // a faixa oscila sozinha entre relaxado e contraído; depois de mexer, espera 4 s e continua de onde a pessoa deixou
        if (livre(S)) {
          if (!S.free) { S.free = true; S.ap = Math.acos(cl(1 - S.v / 50, -1, 1)); }
          S.ap += S.dt * .75; S.v = Math.round(50 - 50 * Math.cos(S.ap)); showV(o, S);
        } else if (!S.paused) S.free = false;
        const v = S.v, L = Lof(v), Ib = L - 1.6, Hz = Math.max(0, L - 2), vel = Math.abs(v - (S.pv == null ? v : S.pv)); S.pv = v;
        S.mov = lerp(S.mov || 0, vel > .01 ? 1 : 0, .08);
        // --- zoom em quatro quadros ---
        const sw = Math.min(A.w, 820), sx = A.cx - sw / 2, n = 4, gap = NAR ? 12 : 26, pw = (sw - gap * (n - 1)) / n, ph = NAR ? 50 : 62, py = A.y0 + 4;
        const nomes = ['músculo', 'feixe de fibras', 'fibra', 'miofibrila'], nomesN = ['músculo', 'feixe', 'fibra', 'miofibrila'];
        let mr = null;
        for (let i = 0; i < n; i++) {
          const b = { x: sx + i * (pw + gap), y: py, w: pw, h: ph };
          if (i === 0) pMusculo(b); else if (i === 1) pFeixe(b); else if (i === 2) pFibra(b, t); else mr = pMiof(b, L);
          tx((NAR ? nomesN : nomes)[i], b.x + pw / 2, py + ph + 12, { s: 12, w: 600, c: C.dim, bg: false });
          if (i < n - 1) { const ax = b.x + pw + gap / 2; X.beginPath(); X.moveTo(ax - 3, py + ph / 2 - 5); X.lineTo(ax + 3, py + ph / 2); X.lineTo(ax - 3, py + ph / 2 + 5); X.strokeStyle = C.dim; X.lineWidth = 1.6; X.stroke(); }
        }
        rr(mr[0], mr[1], mr[2], mr[3], 3, null, '#FFB347', 1.6);
        // --- sarcômero em esquema ---
        const W2 = Math.min(A.w * .49, 560), k = 2 * W2 / 3.9, xa = A.cx - W2, xb = A.cx + W2, cx = A.cx;
        const g = NAR ? cl((A.h - 300) / 12, 11, 16) : cl(k * .055, 10, 15), lblTop = py + ph + 24;
        const top = lblTop + 96 + g * 1.2 + (NAR ? 10 : 0), bot = top + 6 * g;
        const zl = cx - L / 2 * k, zr = cx + L / 2 * k;
        // linhas de zoom do quadro da miofibrila ao sarcômero
        line(mr[0], mr[1] + mr[3], zl, top - g * 1.2 - 60, 'rgba(255,179,71,.35)', 1, [4, 4]); line(mr[0] + mr[2], mr[1] + mr[3], zr, top - g * 1.2 - 60, 'rgba(255,179,71,.35)', 1, [4, 4]);
        X.save(); X.beginPath(); X.rect(xa, top - g * 1.2, xb - xa, bot - top + g * 2.4); X.clip();
        X.fillStyle = rgba(C.he_rosa, .34); X.fillRect(xa, top - g * 1.2, xb - xa, bot - top + g * 2.4);
        const wob = Math.sin(t * 14) * 2.2 * S.mov;
        for (let s = -1; s <= 1; s++) {
          const zc = cx + s * L * k;
          X.fillStyle = 'rgba(122,46,78,.85)'; X.fillRect(zc - .8 * k, top - g * 1.2, 1.6 * k, bot - top + g * 2.4);
          if (Hz > 0) { X.fillStyle = 'rgba(176,96,128,.55)'; X.fillRect(zc - Hz / 2 * k, top - g * 1.2, Hz * k, bot - top + g * 2.4); }
          // miosina com cabeças voltadas para as linhas Z
          for (let m = 0; m < 3; m++) {
            const ym = top + g * (1 + 2 * m), hs = Math.max(7, k * .07);
            for (let sd = -1; sd <= 1; sd += 2) for (let x = .12 * k; x <= .8 * k; x += hs) {
              const hx0 = zc + sd * x; for (const up of [-1, 1]) { line(hx0, ym, hx0 + sd * (hs * .55 + wob), ym + up * g * .72, light(C.miosina, .25), 1.5); circ(hx0 + sd * (hs * .55 + wob), ym + up * g * .72, 1.8, light(C.miosina, .25)); }
            }
            line(zc - .8 * k, ym, zc + .8 * k, ym, C.miosina, Math.max(5, g * .5));
          }
          // actina presa às linhas Z
          for (let j = 0; j < 4; j++) {
            const ya = top + j * 2 * g;
            for (const [z0, d] of [[zc - L / 2 * k, 1], [zc + L / 2 * k, -1]]) {
              line(z0, ya, z0 + d * k, ya, C.actina, 3);
              for (let q = 4; q < k; q += 6) circ(z0 + d * q, ya, 1.6, light(C.actina, .4));
            }
          }
          // linhas Z em zigue-zague e linha M
          for (const z of [zc - L / 2 * k, zc + L / 2 * k]) { const pts = []; for (let yy = top - g * .9, i = 0; yy <= bot + g * .9; yy += g * .6, i++) pts.push([z + (i & 1 ? 3 : -3), yy]); poly(pts, '#F2F4F8', 3); }
          line(zc, top + g * .4, zc, bot - g * .4, 'rgba(242,244,248,.5)', 1.2, [3, 3]);
        }
        X.restore();
        // esmaece as pontas (sarcômeros vizinhos)
        for (const [x0, d] of [[xa, 1], [xb, -1]]) { const gr = X.createLinearGradient(x0, 0, x0 + d * 46, 0); gr.addColorStop(0, 'rgba(11,15,28,1)'); gr.addColorStop(1, 'rgba(11,15,28,0)'); X.fillStyle = gr; X.fillRect(Math.min(x0, x0 + d * 46), top - g * 1.3, 46, bot - top + g * 2.6); }
        // chaves de medida
        const ys = top - g * 1.2 - 48, ya = top - g * 1.2 - 8;
        brace(zl, zr, ys, -1, C.txt); tx(`sarcômero: ${um(L)}`, cx, ys - 22, { s: 13, w: 700, c: C.txt });
        brace(cx - .8 * k, cx + .8 * k, ya, -1, '#FFB347', 2);
        const pis = .55 + .45 * Math.sin(t * 6) * S.mov;
        tx(`banda A: ${um(1.6)}`, cx - 4, ya - 22, { s: 13, w: 700, c: C.txt, a: 'right' });
        X.save(); X.globalAlpha = S.mov > .2 ? pis + .45 : 1; tx('não muda', cx + 4, ya - 22, { s: 13, w: 700, c: '#FFB347', a: 'left' }); X.restore();
        const yb = bot + g * 1.2 + 6;
        brace(zl - Ib / 2 * k, zl + Ib / 2 * k, yb, 1, C.actina, 2); tx('banda I', zl, yb + 24, { s: 13, w: 700, c: C.txt }); tx(um(Ib), zl, yb + 40, { s: 12, f: FD, c: C.dim });
        brace(cx - Hz / 2 * k, cx + Hz / 2 * k, yb, 1, light(C.miosina, .3), 2); tx('zona H', cx, yb + 24, { s: 13, w: 700, c: C.txt }); tx(um(Hz), cx, yb + 40, { s: 12, f: FD, c: C.dim });
        tx('linha Z', zr, yb + 24, { s: 13, w: 700, c: C.txt }); line(zr, bot + g, zr, yb + 12, 'rgba(242,244,248,.6)', 1);
        // legenda de cores
        chips([['actina (filamento fino)', C.actina], ['miosina (filamento grosso)', C.miosina], ['linha Z', '#F2F4F8']], A.x0, yb + 54, A.w, true);
        cap(v < 3 ? `Relaxado: sarcômero de ${um(L)}. Banda I de ${um(Ib)}, zona H de ${um(Hz)} e banda A de ${um(1.6)}`
          : `Contraindo: a actina desliza para o centro. Banda I (${um(Ib)}) e zona H (${um(Hz)}) diminuem; a banda A continua com ${um(1.6)}`);
      }
    });
  }

  // =================================================================================
  // TÓPICO: #muscular/contracao
  // =================================================================================
  {
    const PASSOS = ['impulso', 'acetilcolina', 'onda elétrica', 'cálcio', 'ponte cruzada', 'relaxamento'];
    const pIdx = v => Math.min(5, Math.floor(v));
    const CEN = [['normal', 'Normal'], ['curare', 'Curare'], ['botu', 'Toxina botulínica'], ['organo', 'Organofosforado'], ['sematp', 'Sem ATP']];
    // estado de cada etapa a partir da faixa (0 a 6) e do cenário
    function estado(v, cen) {
      const libera = cen !== 'botu', liga = libera && cen !== 'curare', e = { cen, liga, libera };
      e.imp = seg(v, 0, 1);
      e.rel = libera ? seg(v, 1, 1.5) : 0;
      e.achX = libera ? seg(v, 1.2, 1.9) : 0;
      e.achOff = cen === 'organo' || !liga ? 0 : seg(v, 2.4, 3.2);
      e.onda = liga ? (cen === 'organo' && v > 3 ? fr((v - 2) * .9) : seg(v, 2, 3)) : 0;
      e.ondaOn = liga && v >= 2 && (v < 3 || cen === 'organo');
      const solta = liga ? seg(v, 3, 3.8) : 0, volta = cen === 'normal' ? seg(v, 5, 5.9) : 0;
      e.ca = solta * (1 - volta);
      e.tm = liga ? seg(v, 3.7, 4) * (cen === 'normal' ? 1 - seg(v, 5.1, 5.5) : 1) : 0;
      // ciclos da cabeça de miosina
      if (!liga) { e.cyc = 0; e.cont = 0; }
      else if (cen === 'sematp') { e.cyc = Math.min(.5, Math.max(0, (v - 4) * 4)); e.cont = .25 * seg(v, 4, 4.125); }
      else if (cen === 'organo') { e.cyc = Math.max(0, (v - 4) * 4); e.cont = seg(v, 4, 5); }
      else { e.cyc = cl((v - 4) * 4, 0, 4); e.cont = seg(v, 4, 5) * (1 - seg(v, 5.3, 6)); }
      e.relaxa = cen === 'normal' ? seg(v, 5.3, 6) : 0;
      e.atpPonte = cen === 'sematp' || !liga ? 0 : Math.max(0, Math.floor(e.cyc + .4));
      if (cen === 'normal') e.atpPonte = Math.min(4, e.atpPonte);
      e.atpBomba = cen === 'normal' || cen === 'organo' ? Math.floor(seg(v, 5, 5.9) * 4 + 1e-6) : 0;
      if (!liga) e.atpBomba = 0;
      return e;
    }
    const CAPS = {
      normal: ['O <b>impulso nervoso</b> desce pelo axônio do neurônio motor até a junção neuromuscular',
        'O terminal do axônio libera <b>acetilcolina</b>, que atravessa a fenda e se liga aos receptores do sarcolema',
        'Nasce um <b>potencial de ação</b> na fibra: ele se espalha pelo sarcolema e desce pelos <b>túbulos T</b>. A acetilcolinesterase destrói a acetilcolina',
        'O <b>retículo sarcoplasmático</b> libera <b>Ca²⁺</b> no citoplasma',
        'O Ca²⁺ se liga à <b>troponina</b>, a tropomiosina sai da frente e a <b>cabeça da miosina</b> puxa a actina. Cada ciclo gasta 1 <b>ATP</b>',
        '<b>Relaxamento</b>: bombas devolvem o Ca²⁺ ao retículo gastando ATP, a tropomiosina volta a cobrir a actina e o sarcômero se alonga'],
      curare: 'O <b>curare</b> ocupa os receptores: a acetilcolina chega, mas não se liga. Sem potencial de ação, não sai Ca²⁺: <b>paralisia</b>',
      botu: 'A <b>toxina botulínica</b> impede as vesículas de liberar acetilcolina: a fibra não recebe a ordem e fica mole (<b>paralisia flácida</b>)',
      organo: 'O <b>organofosforado</b> bloqueia a acetilcolinesterase: a acetilcolina se acumula, a fibra é estimulada sem parar e se contrai <b>sem controle</b>',
      sematp: '<b>Sem ATP</b>, a cabeça da miosina puxa uma vez e não consegue se soltar da actina: o músculo fica <b>rígido</b>, como na rigidez cadavérica'
    };

    // painel da junção neuromuscular
    function jnm(P, v, e, t) {
      head('Junção neuromuscular', P.x, P.y + 8, C.txt, 'left');
      const fy0 = P.y + P.h * .56, fy1 = P.y + P.h - 2, jx = P.x + P.w * .5;
      // fibra com estrias que acompanham a contração
      rr(P.x, fy0, P.w, fy1 - fy0, 10, rgba(C.musc, .8), 'rgba(11,15,28,.5)', 1);
      X.save(); rr(P.x, fy0, P.w, fy1 - fy0, 10); X.clip();
      const sp = (P.w / 6.5) * (1 - .2 * e.cont);
      for (let n = -5; n <= 5; n++) { const zc = jx + n * sp; X.fillStyle = 'rgba(122,46,58,.42)'; X.fillRect(zc - sp * .32, fy0 + 6, sp * .64, fy1 - fy0 - 6); line(zc + sp / 2, fy0 + 6, zc + sp / 2, fy1, 'rgba(59,31,58,.7)', 1.2); }
      // núcleo periférico
      nuc(P.x + P.w * .16, fy0 + 9, 14, 4.5, 0, { seed: 3 }); nuc(P.x + P.w * .84, fy1 - 8, 14, 4.5, 0, { seed: 9 });
      // túbulos T e retículo sarcoplasmático
      const tts = [.2, .38, .62, .8].map(f => P.x + P.w * f), srY = [fy0 + (fy1 - fy0) * .42, fy0 + (fy1 - fy0) * .74];
      for (const x of tts) line(x, fy0, x, fy1 - 6, 'rgba(242,244,248,.55)', 2);
      for (const y of srY) { for (let i = 0; i < tts.length - 1; i++) { const a = tts[i] + 7, b = tts[i + 1] - 7; rr(a, y - 4, b - a, 8, 4, 'rgba(191,227,240,.22)', 'rgba(191,227,240,.7)', 1.2); } }
      // onda elétrica descendo os túbulos T
      if (e.ondaOn) for (const x of tts) { const d = Math.abs(x - jx) / (P.w / 2), f = seg(e.onda, d * .8, d * .8 + .25); if (f > 0) line(x, fy0, x, lerp(fy0, fy1 - 6, f), '#FFF0C8', 3); }
      // Ca²⁺: guardado no retículo, solto no citoplasma
      const R = rng(21);
      for (let i = 0; i < 18; i++) {
        const sy = srY[i % 2], sx0 = lerp(tts[0] + 12, tts[3] - 12, R()), fx = P.x + 10 + R() * (P.w - 20), fyy = fy0 + 10 + R() * (fy1 - fy0 - 16);
        const k = ss(e.ca), x = lerp(sx0, fx, k) + Math.sin(t * 2 + i) * 2 * k, y = lerp(sy, fyy, k) + Math.cos(t * 2.3 + i) * 2 * k;
        circ(x, y, 2.8, C.ca, 'rgba(11,15,28,.6)', 1);
      }
      X.restore();
      // axônio mielinizado descendo até o terminal
      const top = P.y + 30, bh = Math.max(22, (fy0 - top) * .32), by = fy0 - 5 - bh / 2, brx = Math.min(P.w * .13, 54);
      const path = [[P.x + P.w * .1, top], [P.x + P.w * .28, top + (by - top) * .25], [jx - brx * .3, by - bh * .4]];
      poly(path, C.neur, 5);
      for (let i = 0; i < 2; i++) { const p0 = pth(path, .05 + i * .32), p1 = pth(path, .3 + i * .32); line(p0[0], p0[1], p1[0], p1[1], C.mielina, 11); }
      ell(jx, by, brx, bh / 2, 0, rgba(C.neur, .85), 'rgba(11,15,28,.5)', 1.2);
      // impulso nervoso
      if (e.imp > 0 && e.imp < 1) { const p = pth(path, e.imp); circ(p[0], p[1], 9, 'rgba(255,240,200,.35)'); circ(p[0], p[1], 4.5, '#FFF0C8'); }
      if (v >= .95 && v < 1.3) { X.save(); X.globalAlpha = 1 - seg(v, 1.1, 1.3); ell(jx, by, brx, bh / 2, 0, 'rgba(255,240,200,.25)'); X.restore(); }
      // sarcolema com dobras sob o terminal e receptores
      X.beginPath(); for (let x = P.x + 6; x <= P.x + P.w - 6; x += 2) { const u = Math.abs(x - jx) < brx ? Math.sin((x - jx) * .35) * 2.2 : 0; x === P.x + 6 ? X.moveTo(x, fy0 + u) : X.lineTo(x, fy0 + u); }
      X.strokeStyle = light(C.musc, .45); X.lineWidth = 2; X.stroke();
      const recs = [-.7, -.35, 0, .35, .7].map(f => jx + f * brx);
      for (const x of recs) { rr(x - 3, fy0 - 3, 6, 5, 1.5, '#E8EDF7'); if (e.cen === 'curare' && v >= .5) rr(x - 4, fy0 - 7, 8, 5, 2, '#5A3F7A', '#C9A7FF', 1); }
      // onda elétrica no sarcolema
      if (e.ondaOn) { const d = e.onda * (P.w / 2); line(Math.max(P.x + 6, jx - d), fy0, Math.min(P.x + P.w - 6, jx + d), fy0, '#FFF0C8', 3.5); }
      // vesículas e acetilcolina
      for (let i = 0; i < 5; i++) {
        const vx = jx + (i - 2) * brx * .32, vy0 = by - bh * .1 + (i & 1) * 4, vy = lerp(vy0, by + bh / 2 - 6, e.rel);
        const vr = 5 * (1 - e.rel * .8);
        if (vr > 1.2) circ(vx, vy, vr, 'rgba(95,211,141,.25)', ACH, 1.2);
        if (e.rel <= .02) circ(vx, vy, 2, ACH);
        if (e.achX > 0) for (let j = 0; j < 2; j++) {
          const rx = recs[(i + j) % 5], ty = e.liga ? fy0 - 4 : fy0 - 9 - Math.abs(Math.sin(t * 3 + i + j)) * 3;
          const x = lerp(vx + (j - .5) * 4, rx, ss(e.achX)), y = lerp(by + bh / 2 - 4, ty, ss(e.achX));
          X.save(); X.globalAlpha = 1 - e.achOff; circ(x, y, 2.6, ACH, 'rgba(11,15,28,.6)', 1); X.restore();
        }
      }
      return { jx, by, bh, brx, fy0, fy1, tts, srY, path };
    }

    // painel do zoom no filamento
    function zoom(Z, v, e, t) {
      head(NAR ? 'Zoom no filamento' : 'Zoom no filamento: a ponte cruzada', Z.x, Z.y + 8, C.txt, 'left');
      const ay = Z.y + 44 + (Z.h - 110) * .28, my = ay + cl((Z.h - 110) * .45, 64, 110), base = Z.x + Z.w * .5;
      const nl = cl((my - ay) * .7, 40, 76), D = nl * .96, br = Math.max(5, Math.min(8, Z.w * .02));
      // fase da cabeça principal
      const cyc = e.cyc, p = e.tm < .99 ? 0 : fr(cyc), nS = Math.floor(cyc);
      let ang = -.5, att = false, strokeK = 0;
      if (e.tm >= .99 && cyc > 0) {
        if (e.cen === 'sematp' && cyc >= .42) { ang = .5; att = true; strokeK = 1; }
        else if (p < .12) { ang = -.5; att = p > .06; }
        else if (p < .42) { strokeK = ss((p - .12) / .3); ang = lerp(-.5, .5, strokeK); att = true; }
        else if (p < .66) { ang = .5; att = true; strokeK = 1; }
        else { ang = lerp(.5, -.5, ss((p - .66) / .34)); strokeK = 1; }
      }
      let off = (nS + strokeK) * D; if (e.cen === 'normal') off *= 1 - e.relaxa; if (e.cen === 'normal' && v >= 5) off = 4 * D * (1 - e.relaxa);
      if (cyc <= 0) off = 0;
      X.save(); X.beginPath(); X.rect(Z.x, Z.y + 22, Z.w, Z.h - 22); X.clip();
      // actina: duas fileiras de contas; sítios de ligação a cada D
      const bs = br * 1.9, o0 = ((off % bs) + bs) % bs;
      for (let x = Z.x - bs * 2 + o0; x < Z.x + Z.w + bs; x += bs) { circ(x, ay - br * .55, br, C.actina, 'rgba(11,15,28,.45)', 1); circ(x + bs / 2, ay + br * .55, br, C.actina, 'rgba(11,15,28,.45)', 1); }
      const s0 = base - nl * Math.sin(.5), oD = (((s0 + off - Z.x) % D) + D) % D;
      for (let x = Z.x + oD - D; x < Z.x + Z.w + D; x += D) circ(x, ay + br * 1.1, br * .45, dark(C.actina, .35));
      // tropomiosina (fita) e troponina
      const tmY = lerp(ay + br * 1.15, ay - br * 1.6, ss(e.tm)), oT = ((off % (D * 2)) + D * 2) % (D * 2);
      X.beginPath(); for (let x = Z.x; x <= Z.x + Z.w; x += 4) { const y = tmY + Math.sin((x - off) * .06) * 2; x === Z.x ? X.moveTo(x, y) : X.lineTo(x, y); } X.strokeStyle = TM; X.lineWidth = 3.5; X.stroke();
      for (let x = Z.x + oT - D * 2; x < Z.x + Z.w + D; x += D * 2) {
        circ(x, tmY, 5.5, TN, 'rgba(11,15,28,.5)', 1);
        if (e.ca > .5 || e.tm > .3) { X.save(); X.globalAlpha = Math.max(e.tm, seg(e.ca, .5, 1)); circ(x + 5, tmY - 6, 3.5, C.ca, 'rgba(11,15,28,.6)', 1); X.restore(); }
      }
      // íons cálcio descendo do retículo (antes de ligar)
      if (e.ca > 0 && e.tm < 1) for (let i = 0; i < 5; i++) { const f = seg(e.ca, i * .1, .6 + i * .08), x = Z.x + Z.w * (.15 + i * .18), y = lerp(Z.y + 26, tmY - 6, f); if (f < 1) circ(x, y, 3.5, C.ca, 'rgba(11,15,28,.6)', 1); }
      // miosina: bastão e cabeças
      line(Z.x, my, Z.x + Z.w, my, C.miosina, 12);
      for (const gx of [base - D * 1.7, base + D * 1.7]) { const tx_ = gx + Math.sin(-.5) * nl, ty = ay + br * 1.6 + 24; line(gx, my - 5, tx_, ty, rgba(C.miosina, .45), 4); ell(tx_, ty, 13, 8.5, -.5, rgba(C.miosina, .45)); }
      const hx_ = base + Math.sin(ang) * nl, hy = ay + br * 1.6 + (att ? 6 : 18);
      line(base, my - 5, hx_, hy + 6, light(C.miosina, .15), 5);
      ell(hx_, hy + 3, 13, 8.5, ang, light(C.miosina, .15), att ? '#fff' : 'rgba(11,15,28,.5)', att ? 1.6 : 1);
      // ATP, ADP e Pi na cabeça
      const live = e.tm >= .99 && cyc > 0 && e.cen !== 'sematp';
      if (e.tm < .99 || cyc <= 0 || (live && p >= .66) || (e.cen === 'normal' && v >= 5)) { if (!(e.cen === 'sematp' && cyc >= .42)) { tok(hx_ - 20, hy + 22, 'ADP', ATPc); tok(hx_ + 16, hy + 22, 'Pi', ATPc); } }
      if (live && p >= .12 && p < .42) { const f = (p - .12) / .3; tok(hx_ - 20 - f * 30, hy + 22 + f * 20, 'ADP', ATPc, { a: 1 - f }); tok(hx_ + 16 + f * 30, hy + 22 + f * 20, 'Pi', ATPc, { a: 1 - f }); }
      if (live && p >= .5 && p < .66) { const f = ss((p - .5) / .12); tok(lerp(Z.x + Z.w - 30, hx_ + 4, f), lerp(my + 26, hy + 20, f), 'ATP', ATPc); }
      if (e.cen === 'sematp' && cyc >= .42) { const x = hx_ - 52, y = hy + 30; tok(x, y, 'ATP', ATPc, { a: .75 }); line(x - 18, y - 9, x + 18, y + 9, '#FF6B6B', 2.5); }
      X.restore();
      // o sarcômero em miniatura
      const sy = my + 34, L = 2.5 - .5 * e.cont, sw = Math.min(Z.w * .5, 190) * L / 2.5, sx = Z.x + 8;
      line(sx, sy, sx + sw, sy, 'rgba(232,237,247,.4)', 2); line(sx, sy - 9, sx, sy + 9, '#F2F4F8', 3); line(sx + sw, sy - 9, sx + sw, sy + 9, '#F2F4F8', 3);
      tx(`sarcômero: ${um(L)}`, sx + Math.min(Z.w * .5, 190) + 12, sy, { s: 12, f: FD, c: C.txt, a: 'left' });
      // contador de ATP
      const tot = e.atpPonte + e.atpBomba;
      tx(`ATP gasto: ${tot}`, Z.x + 8, sy + 26, { s: 13, w: 700, c: ATPc, a: 'left' });
      tx(`ponte cruzada: ${e.atpPonte}; bombas de Ca²⁺: ${e.atpBomba}`, Z.x + 8, sy + 44, { s: 12, c: C.dim, a: 'left' });
      return { ay, my, hx: hx_, hy, tmY, base };
    }

    def('muscular', 'contracao', {
      t: 'Do nervo à contração', s: 'acetilcolina, cálcio e ATP', c: C.musc, loc: 'Junção neuromuscular e sarcômero', still: 3, stillV: 4.3,
      ctl: { l: 'Passo', min: 0, max: 6, step: .05, v: 0, f: v => NAR ? `${pIdx(v) + 1} de 6` : `${pIdx(v) + 1} de 6: ${PASSOS[pIdx(v)]}`, rate: () => 1 },
      auto: .3,
      extra: CEN.map(([k, n]) => ({ t: n, on: S => { S.cen = k; S.v = 0; S.touch = 0; S.hold = 0; }, pressed: S => (S.cen || 'normal') === k })),
      init(S) { if (!S.cen) S.cen = 'normal'; },
      alt: 'À esquerda, a junção neuromuscular: o axônio mielinizado do neurônio motor termina sobre a fibra muscular; vesículas soltam acetilcolina (pontos verdes) na fenda, uma onda elétrica corre pelo sarcolema e desce pelos túbulos T, e o retículo sarcoplasmático solta íons cálcio (pontos amarelos). À direita, o zoom no filamento: o cálcio se liga à troponina, a tropomiosina sai da frente, a cabeça da miosina se prende à actina, gira e puxa; o ATP chega, a cabeça solta e se rearma. Um contador soma o ATP gasto. Botões testam curare, toxina botulínica, organofosforado e falta de ATP',
      d: `<p>A fibra esquelética só se contrai quando recebe ordem de um <b>neurônio motor</b>. O ponto de contato entre os dois é a <b>junção neuromuscular</b> (ou placa motora), uma sinapse química (ver <a href="#nervoso/sinapse">sinapse</a>). O impulso nervoso chega ao terminal do axônio, que libera <b>acetilcolina</b>. Ela se liga a receptores no sarcolema e gera um potencial de ação na fibra, que se espalha pela membrana e entra por tubos que mergulham na célula (os <b>túbulos T</b>). Isso faz o <b>retículo sarcoplasmático</b> liberar <b>íons cálcio (Ca²⁺)</b>. O cálcio se liga a uma proteína do filamento fino (a <b>troponina</b>), que desloca outra (a <b>tropomiosina</b>) e descobre os pontos de ligação da actina. As <b>cabeças da miosina</b> se prendem à actina, giram e puxam o filamento para o centro do sarcômero. Para soltar e puxar de novo, cada cabeça precisa de uma molécula de <b>ATP</b>.</p>
<p>O relaxamento também gasta energia: o cálcio é bombeado de volta para o retículo por bombas que usam <b>ATP</b>, e a acetilcolina é destruída na fenda pela enzima <b>acetilcolinesterase</b>. Por isso, depois da morte, quando o ATP acaba, as cabeças da miosina ficam presas à actina e o corpo endurece: é a <b>rigidez cadavérica</b> (<i>rigor mortis</i>), que começa poucas horas depois da morte e se desfaz em 1 a 2 dias, quando as proteínas se degradam. Um neurônio motor e todas as fibras que ele comanda formam uma <b>unidade motora</b>: nos músculos dos olhos, que fazem movimentos finos, cada neurônio comanda poucas fibras; nos músculos grandes das pernas, centenas a milhares.</p>
<p>A faixa avança a sequência em seis passos. Os botões mostram o que acontece quando algo falha: o <b>curare</b> impede a acetilcolina de se ligar ao receptor; a <b>toxina botulínica</b> impede que ela seja liberada (é o princípio do uso estético e médico da toxina); o <b>organofosforado</b> bloqueia a acetilcolinesterase; e, <b>sem ATP</b>, as cabeças ficam presas.</p>`,
      kv: [['Mensageiro do nervo', 'acetilcolina'], ['Destrói a acetilcolina', 'acetilcolinesterase'], ['Libera a actina', 'Ca²⁺ do retículo sarcoplasmático, que se liga à troponina'], ['ATP na contração', 'solta a cabeça da miosina e a rearma'], ['ATP no relaxamento', 'bombas devolvem o Ca²⁺ ao retículo (2 Ca²⁺ por ATP)'], ['Unidade motora', 'um neurônio motor e as fibras que ele comanda']],
      enem: 'Três peças que a prova combina: <b>acetilcolina</b> (liga o nervo ao músculo), <b>Ca²⁺</b> (libera a actina para a miosina) e <b>ATP</b> (solta a miosina e devolve o Ca²⁺ ao retículo). Questões sobre <b>agrotóxicos organofosforados</b> e <b>gases de nervos</b> perguntam o efeito de bloquear a acetilcolinesterase: a acetilcolina se acumula e os músculos se contraem sem controle. O <b>curare</b> e a <b>toxina botulínica</b> fazem o contrário: paralisam. A <b>rigidez cadavérica</b> acontece por <b>falta de ATP</b>.',
      links: [['O sarcômero', '#muscular/sarcomero'], ['Sinapse', '#nervoso/sinapse'], ['Energia para o músculo', '#muscular/energia'], LK.neuronio],
      draw(t, S) {
        const A = area(), v = S.v, e = estado(v, S.cen || 'normal');
        let P, Zp;
        if (NAR) { const h1 = A.h * .47; P = { x: A.x0, y: A.y0 + 2, w: A.w, h: h1 }; Zp = { x: A.x0, y: A.y0 + h1 + 14, w: A.w, h: A.h - h1 - 14 }; }
        else { const w1 = A.w * .5; P = { x: A.x0, y: A.y0 + 2, w: w1, h: A.h - 4 }; Zp = { x: A.x0 + w1 + 32, y: A.y0 + 2, w: A.w - w1 - 32, h: A.h - 4 }; }
        const J = jnm(P, v, e, t), Q = zoom(Zp, v, e, t);
        if (!NAR) line(P.x + P.w + 16, A.y0 + 10, P.x + P.w + 16, A.y1 - 10, 'rgba(91,108,153,.4)', 1);
        // rótulos (no máximo 5 no celular)
        const p0 = pth(J.path, .2);
        lab(p0[0], p0[1], p0[0] + 40, p0[1] - 2, 'neurônio motor');
        if (v >= 1 && v < 3.2 && e.libera) lab(J.jx + J.brx * .4, J.fy0 - 8, J.jx + J.brx + 28, J.fy0 - 30, 'acetilcolina');
        else if (v >= 3) lab(J.tts[3], J.srY[0], J.tts[3] + 16, J.fy0 - 26, NAR ? 'retículo' : 'retículo sarcoplasmático');
        if (!NAR || v < 1 || v >= 3.2) lab(J.tts[0], J.fy1 - 10, J.tts[0] + 22, NAR ? J.fy1 - 22 : J.fy1 + 6, 'túbulo T');
        if (e.cen === 'curare' && v >= .5) lab(J.jx - J.brx * .7, J.fy0 - 6, J.jx - J.brx - 30, J.fy0 - 34, 'curare');
        lab(Q.base - 60, Q.ay, Q.base - 80, Q.ay - 28, 'actina');
        if (!NAR) { lab(Q.base + 90, Q.my, Q.base + 110, Q.my + 26, 'miosina'); lab(Q.base + 40, Q.tmY, Q.base + 60, Q.tmY - 30, 'tropomiosina'); }
        const i = pIdx(v), c = S.cen || 'normal';
        cap(c === 'normal' ? CAPS.normal[i] : (c === 'curare' || c === 'botu') ? (v < 1 ? CAPS.normal[0] : CAPS[c]) : (v < (c === 'organo' ? 2 : 4) ? CAPS.normal[i] : CAPS[c]));
      }
    });
  }

  // =================================================================================
  // TÓPICO: #muscular/energia
  // =================================================================================
  {
    // escala do tempo: 0 a 85 da faixa = 0 a 3 min (comprimida no começo); 85 a 100 = 3 min a 1 hora
    const tOf = v => v <= 85 ? 180 * (v / 85) ** 2 : 180 * 20 ** ((v - 85) / 15);
    const vOf = s => s <= 180 ? 85 * Math.sqrt(s / 180) : 85 + 15 * Math.log(s / 180) / Math.log(20);
    const fmtT = s => s < 59.5 ? `${Math.round(s)} s` : s < 180 ? `${Math.floor(s / 60)} min ${String(Math.round(s % 60)).padStart(2, '0')} s` : s >= 3599 ? '1 hora' : `${Math.round(s / 60)} min`;
    // participação de cada sistema (esquema baseado em Guyton, cap. 85)
    function partes(s) {
      const q = s ** 1.6, aer = q / (q + 75 ** 1.6), pc = (1 - aer) / (1 + (s / 11) ** 3);
      return [pc, Math.max(0, 1 - aer - pc), aer];
    }
    const SIS = [['ATP guardado e fosfocreatina', PCc], ['fermentação lática', LACc], ['respiração aeróbica', AERc]];
    function tanque(x, y, w, h, f, c, nome, val, enche) {
      rr(x, y, w, h, 8, 'rgba(19,26,43,.6)', 'rgba(232,237,247,.5)', 1.5);
      const fh = (h - 6) * cl(f, 0, 1); if (fh > 1) rr(x + 3, y + h - 3 - fh, w - 6, fh, 5, rgba(c, enche ? .8 : .85));
      tx(val, x + w / 2, y - 11, { s: 12, f: FD, c: C.txt, bg: false });
      const parts = nome.split('|'); parts.forEach((p, i) => tx(p, x + w / 2, y + h + 13 + i * 15, { s: 12, w: 600, c: C.txt, bg: false }));
    }
    // corte de músculo com fibras lentas (escuras) e rápidas (claras)
    function corte(cx, cy, r, pLenta, seed) {
      circ(cx, cy, r, rgba(C.he_rosa, .25), C.he_rosa, 2);
      X.save(); X.beginPath(); X.arc(cx, cy, r - 2, 0, TAU); X.clip();
      const R = rng(seed), rf = r / 5.5;
      for (let j = -7; j <= 7; j++) for (let i = -7; i <= 7; i++) {
        const x = cx + (i + (j & 1) * .5) * rf * 1.732, y = cy + j * rf * 1.5; if (Math.hypot(x - cx, y - cy) > r + rf) continue;
        const lenta = R() < pLenta;
        ngon(x, y, rf * .97, 6, PI / 6, lenta ? '#A63A4A' : '#F3D3D0', 'rgba(11,15,28,.4)', 1);
        if (lenta) for (let q = 0; q < 3; q++) circ(x + (R() - .5) * rf, y + (R() - .5) * rf, 1.3, 'rgba(242,92,59,.9)');
        if (lenta && R() < .7) circ(x + rf * .95, y + rf * .5, 2.2, C.hemacia, 'rgba(11,15,28,.5)', 1);
      }
      X.restore();
    }

    def('muscular', 'energia', {
      t: 'Energia para o músculo', s: 'ATP, fosfocreatina, fermentação e respiração', c: C.musc, loc: 'Fibra muscular esquelética: citoplasma e mitocôndrias', still: 3, stillV: 50,
      ctl: { l: 'Tempo de esforço', min: 0, max: 100, step: .5, v: 0, f: v => fmtT(tOf(v)), rate: () => 1 },
      auto: 5.5,
      extra: [{ t: 'Fibras lentas e rápidas', on: S => { S.fib = !S.fib; }, pressed: S => !!S.fib }],
      alt: 'Um gráfico mostra, ao longo do tempo de esforço máximo (de 0 a 3 minutos, com um salto até 1 hora), a participação de três sistemas no fornecimento de ATP: a fosfocreatina domina os primeiros segundos, a fermentação lática sobe e cai em 1 a 2 minutos e a respiração aeróbica sobe devagar e fica. Marcas indicam 100 m, 400 m e maratona. Ao lado, tanques de ATP, fosfocreatina e glicogênio esvaziam e um medidor de lactato sobe. Um botão troca os tanques por cortes de músculo de um maratonista e de um velocista, com fibras lentas escuras e fibras rápidas claras',
      d: `<p>O ATP guardado numa fibra muscular dura só <b>cerca de 3 segundos</b> de esforço máximo (Guyton). Para repor, o músculo usa três sistemas, um depois do outro. O primeiro é a <b>fosfocreatina</b>, que doa fosfato ao ADP e refaz ATP na hora; com o ATP que já havia, sustenta cerca de <b>8 a 10 segundos</b> de esforço máximo, como uma corrida de 100 metros. O segundo é a <b>glicólise com fermentação lática</b> (ver <a href="${LK.latica[1]}">fermentação lática</a>): a glicose do glicogênio vira lactato, sem oxigênio, rendendo só <b>2 ATP</b> por glicose, mas depressa; serve para esforços de cerca de <b>1 a 2 minutos</b>, como uma corrida de 400 metros. O terceiro é a <b>respiração aeróbica</b> nas mitocôndrias (ver <a href="${LK.cadeia[1]}">cadeia respiratória</a>), que rende muito mais ATP por glicose e também queima gordura; é mais lenta, mas sustenta esforços por horas, como uma maratona.</p>
<p>As fibras esqueléticas não são todas iguais. As <b>fibras lentas</b> (tipo I, "vermelhas") têm muita <b>mioglobina</b>, que guarda oxigênio, muitas mitocôndrias e muitos capilares: contraem com menos força, mas resistem à fadiga, e predominam em quem faz exercício de resistência. As <b>fibras rápidas</b> (tipo II, "brancas") têm menos mioglobina e mais enzimas da glicólise: contraem com força e rapidez, mas cansam logo. É por isso que a coxa do frango, que anda o dia todo, é escura, e o peito, usado em voos curtos e explosivos, é branco. Uma correção comum: a dor muscular do dia seguinte ao exercício <b>não</b> é causada por ácido lático acumulado; o lactato é removido do músculo em cerca de uma hora (é usado como combustível pelo coração e por outros músculos, ou vira glicose de novo no fígado). A dor tardia vem de microlesões nas fibras e da inflamação que as repara.</p>
<p>O gráfico é um esquema: a curva azul inclui o ATP já guardado na fibra; o eixo do tempo é comprimido no começo, e depois de 3 minutos ninguém mantém esforço máximo; o trecho até 1 hora mostra um ritmo moderado. No botão <b>Fibras lentas e rápidas</b>, as proporções são as médias citadas por Guyton: cerca de 82% de fibras lentas nas pernas de maratonistas e 37% nas de velocistas.</p>`,
      kv: [['ATP guardado', '≈ 3 s de esforço máximo'], ['ATP + fosfocreatina', '≈ 8 a 10 s (100 m)'], ['Fermentação lática', '2 ATP por glicose, sem O₂; ≈ 1 a 2 min (400 m)'], ['Respiração aeróbica', 'muito mais ATP por glicose; horas (maratona)'], ['Fibra lenta (tipo I)', 'vermelha: mioglobina, mitocôndrias, capilares; resiste à fadiga'], ['Fibra rápida (tipo II)', 'branca: glicólise; força e rapidez, cansa logo']],
      enem: 'O ENEM cobra a relação <b>tipo de exercício e via de energia</b>: esforços curtos e intensos usam <b>fosfocreatina e fermentação lática</b> (anaeróbicos); esforços longos usam <b>respiração aeróbica</b>. As fibras <b>vermelhas</b> têm mais <b>mioglobina e mitocôndrias</b> (resistência); as <b>brancas</b> dependem mais da glicólise (explosão). Cuidado com a ideia de que o ácido lático causa a dor do dia seguinte: ela vem de <b>microlesões</b>.',
      links: [['Do nervo à contração', '#muscular/contracao'], ['Os três tipos de músculo', '#muscular/tipos'], LK.latica, LK.cadeia],
      draw(t, S) {
        const A = area(), v = S.v, s = tOf(v), pr = partes(s), dom = pr.indexOf(Math.max(...pr));
        // layout
        let G, Pn;
        const legH = NAR ? 60 : 30;
        if (NAR) { const gh = A.h * .5; G = { x0: A.x0 + 26, y0: A.y0 + legH + 6, w: A.w - 30, h: gh - legH - 44 }; Pn = { x: A.x0, y: A.y0 + gh + 8, w: A.w, h: A.h - gh - 8 }; }
        else { const gw = A.w * .6; G = { x0: A.x0 + 34, y0: A.y0 + legH + 14, w: gw - 40, h: A.h - legH - 66 }; Pn = { x: A.x0 + gw + 30, y: A.y0, w: A.w - gw - 30, h: A.h }; }
        G.x1 = G.x0 + G.w; G.y1 = G.y0 + G.h;
        chips(SIS, NAR ? A.x0 : G.x0, A.y0 + 2, NAR ? A.w : G.w, NAR);
        const xt = [[0, '0'], [vOf(10), '10 s'], [vOf(60), '1 min'], [vOf(120), '2 min'], [85, '3 min'], [100, '1 h']];
        if (!NAR) xt.splice(2, 0, [vOf(30), '30 s']);
        const gr = graph(G, { x0: 0, x1: 100, y0: 0, y1: 100, xt, xl: 'tempo de esforço', yl: NAR ? 'ATP (%)' : 'parte do ATP (%)',
          curves: SIS.map(([, c], i) => ({ f: x => partes(tOf(x))[i] * 100, c, lw: 3 })) });
        // quebra do eixo depois de 3 min
        const bx = gr.fx(85);
        line(bx, G.y0, bx, G.y1, 'rgba(232,237,247,.35)', 1, [3, 4]);
        X.fillStyle = 'rgba(11,15,28,.9)'; X.fillRect(bx - 4, G.y1 - 6, 8, 12); line(bx - 6, G.y1 + 5, bx - 1, G.y1 - 5, C.dim, 1.5); line(bx + 1, G.y1 + 5, bx + 6, G.y1 - 5, C.dim, 1.5);
        // provas
        const prov = [[vOf(10), '100 m', 'center'], [vOf(50), '400 m', 'center'], [100, 'maratona (horas)', 'right']];
        for (const [pv, n, a] of prov) { const x = gr.fx(pv); line(x, G.y0 + 22, x, G.y0 + 30, C.dim, 1.5); tx(n, a === 'right' ? G.x1 - 4 : x, G.y0 + 13, { s: 12, w: 700, c: C.txt, a }); }
        // instante atual
        const cx = gr.fx(v); line(cx, G.y0, cx, G.y1, 'rgba(255,179,71,.8)', 1.5);
        pr.forEach((q, i) => marker(cx, gr.fy(q * 100), SIS[i][1]));
        // painel da direita (ou de baixo)
        const ttl = `Sistema principal: ${SIS[dom][0]}`;
        tx(ttl, Pn.x + (NAR ? Pn.w / 2 : 0), Pn.y + 10, { s: NAR ? 13 : 15, w: 700, c: SIS[dom][1], a: NAR ? 'center' : 'left', f: FH });
        if (!S.fib) {
          const atp = s <= 180 ? .7 + .3 * Math.exp(-s / 3) : .72, pc = s <= 180 ? .12 + .88 * Math.exp(-s / 9) : .5;
          const gli = s <= 180 ? 1 - .3 * s / 180 : lerp(.7, .35, (s - 180) / 3420), lac = s <= 180 ? .05 + .9 * (1 - Math.exp(-s / 45)) * (s > 60 ? 1 - .1 * (s - 60) / 120 : 1) : lerp(.84, .2, ss((s - 180) / 900));
          const nT = 4, tw_ = Math.min(64, (Pn.w - 20) / nT - 18), gap = (Pn.w - tw_ * nT) / (nT + (NAR ? 1 : 0)), ty = Pn.y + 46, th = Math.max(60, Pn.h - (NAR ? 100 : 130));
          const L = [[atp, ATPc, 'ATP', false], [pc, PCc, 'fosfo-|creatina', false], [gli, LACc, 'glicogênio', false], [lac, '#F06AAE', 'lactato no|sangue', true]];
          L.forEach(([f, c, n, en], i) => tanque(Pn.x + (NAR ? gap : 0) + i * (tw_ + gap), ty, tw_, th, f, c, n, `${Math.round(f * 100)}%`, en));
          if (!NAR) wrapTx(s < 12 ? 'A fosfocreatina refaz o ATP na hora; o nível de ATP quase não cai.' : s < 80 ? 'A glicólise acelera; sem O₂ suficiente, o piruvato vira lactato.' : s < 181 ? 'As mitocôndrias assumem: o lactato para de subir.' : 'Ritmo moderado: a respiração aeróbica queima glicose e gordura por horas; o lactato é removido.', Pn.x, ty + th + 50, Pn.w, { s: 13, c: C.dim, a: 'left' });
        } else {
          const r = Math.min(Pn.w * (NAR ? .19 : .22), (Pn.h - (NAR ? 160 : 170)) * .5), y = Pn.y + 40 + r;
          const c1 = Pn.x + Pn.w * .25, c2 = Pn.x + Pn.w * .75;
          corte(c1, y, r, .82, 4); corte(c2, y, r, .37, 9);
          tx('maratonista', c1, y + r + 14, { s: 13, w: 700, c: C.txt, bg: false }); tx('82% lentas', c1, y + r + 30, { s: 12, f: FD, c: C.dim, bg: false });
          tx('velocista', c2, y + r + 14, { s: 13, w: 700, c: C.txt, bg: false }); tx('37% lentas', c2, y + r + 30, { s: 12, f: FD, c: C.dim, bg: false });
          chips([['lenta (tipo I): mioglobina, mitocôndrias', '#A63A4A'], ['rápida (tipo II): glicólise', '#F3D3D0'], ['capilar', C.hemacia]], Pn.x, y + r + 44, Pn.w, true);
        }
        cap(S.fib ? 'Fibras <b>lentas</b> (vermelhas) resistem à fadiga; fibras <b>rápidas</b> (brancas) dão força e explosão. Coxa do frango escura, peito branco'
          : `${fmtT(s)}: o ATP vem principalmente ${['do <b>ATP guardado e da fosfocreatina</b>', 'da <b>fermentação lática</b>', 'da <b>respiração aeróbica</b>'][dom]}` + (NAR ? '' : ` (${Math.round(pr[0] * 100)}% ATP guardado e fosfocreatina, ${Math.round(pr[1] * 100)}% fermentação, ${Math.round(pr[2] * 100)}% aeróbica)`));
      }
    });
  }
}
