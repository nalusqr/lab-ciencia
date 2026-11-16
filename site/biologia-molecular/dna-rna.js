/* LAB - Biologia molecular · rota na/dna-rna. Ilustração animada de DNA e RNA, no nível da cadeia respiratória (bioenergetica/cadeia.js).
   Canvas 2D sobre o #cv do motor: a dupla hélice e o grampo de RNA são calculados em 3D e projetados a cada quadro,
   com blocos sombreados, gradientes, brilhos e partículas. Hotspots em HTML por cima (fosfato, açúcares, bases, pontes).
   Carregue DEPOIS de cenas-b.js: este def() substitui o antigo (que usava o mol3d). Textos, kv e card ENEM vêm da cena original.
   Usa o motor (motor.js): X, W, H, NAR, area, cl, lerp, ss, fr, rng, hx, cap, $, cv, def, escolha, SC, ORDER, LB. */
'use strict';
const DRNA = (() => {
  const reduzir = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const N = 18, DY = .4, TW = .62, DEL = 2.35, RSUG = .2, GAP = .22, BH = .32, BD = .17, PI2 = Math.PI * 2;
  const SEQ = 'GCATGCGTACGATCGCAT', PAR = { A: 'T', T: 'A', G: 'C', C: 'G' }, PUR = { A: 1, G: 1 };
  const SRNA = 'ACGCGAUGAAAAUCGCAA';
  const BG = [11, 15, 28];
  const COR = { A: hx('#39E58C'), T: hx('#FF4F6D'), G: hx('#FFC53D'), C: hx('#3FA9FF'), U: hx('#C77DFF'), f1: hx('#8EA2F5'), f2: hx('#6FC7D9'), rna: hx('#E6A07E'), fos: hx('#FF9A3C'), ac: hx('#F0D9A8') };
  const HOME = { th: -1.05, tilt: .2 };
  const DICA = [
    { id: 'fosfato', n: 'Fosfato', c: 'No esqueleto das duas fitas', t: 'Liga um açúcar ao seguinte e forma o esqueleto da fita junto com os açúcares.', d: 'Cada fosfato une o carbono 3 de um açúcar ao carbono 5 do próximo, numa ligação chamada fosfodiéster. Os fosfatos têm carga negativa, por isso o esqueleto fica na parte de fora da hélice, em contato com a água.' },
    { id: 'desoxirribose', n: 'Desoxirribose', c: 'Açúcar do DNA', t: 'Açúcar de 5 carbonos do DNA, sem o oxigênio do carbono 2.', d: 'Tem um hidrogênio no carbono 2, no lugar do grupo OH da ribose. Cada desoxirribose prende uma base nitrogenada, que fica voltada para dentro da hélice.' },
    { id: 'A', n: 'Adenina (A)', c: 'Base púrica, com dois anéis', t: 'Pareia com a timina por 2 ligações de hidrogênio.', d: 'No RNA, a adenina pareia com a uracila, também por 2 ligações. No DNA de dupla fita, o total de A é igual ao total de T.' },
    { id: 'T', n: 'Timina (T)', c: 'Base pirimídica, só no DNA', t: 'Base de um anel, exclusiva do DNA. Pareia com a adenina.', d: 'A timina é parecida com a uracila, mas tem um grupo metil (CH₃) a mais. Ela só existe no DNA.' },
    { id: 'G', n: 'Guanina (G)', c: 'Base púrica, com dois anéis', t: 'Pareia com a citosina por 3 ligações de hidrogênio.', d: 'Os pares G e C, com 3 ligações, são mais difíceis de separar do que os pares A e T, com 2.' },
    { id: 'C', n: 'Citosina (C)', c: 'Base pirimídica, com um anel', t: 'Pareia com a guanina por 3 ligações de hidrogênio.', d: 'A citosina aparece no DNA e no RNA. Cada par junta uma purina a uma pirimidina, e por isso a largura da hélice não muda.' },
    { id: 'pAT', n: 'Pontes A e T', c: 'Ligações de hidrogênio', t: 'Duas ligações de hidrogênio mantêm A e T juntas.', d: 'Cada ligação é fraca, mas somadas ao longo da molécula elas seguram as fitas unidas. Podem ser desfeitas sem quebrar o esqueleto, o que permite abrir a hélice para copiar ou ler o DNA.' },
    { id: 'pGC', n: 'Pontes G e C', c: 'Ligações de hidrogênio', t: 'Três ligações de hidrogênio mantêm G e C juntas.', d: 'Com uma ligação a mais, o par G e C é mais firme do que o par A e T. Trechos ricos em G e C resistem mais ao calor antes de as fitas se separarem.' },
    { id: 'ribose', n: 'Ribose', c: 'Açúcar do RNA', t: 'Açúcar de 5 carbonos do RNA, com um grupo OH a mais no carbono 2.', d: 'Esse OH a mais deixa o RNA menos estável do que o DNA. Por isso o RNA serve bem como cópia temporária da informação.', rna: 1 },
    { id: 'U', n: 'Uracila (U)', c: 'Base pirimídica, só no RNA', t: 'Base do RNA, no lugar da timina. Pareia com a adenina por 2 ligações.', d: 'Na dobra do grampo, a uracila pareia com a adenina, como a timina faria no DNA.', rna: 1 },
    { id: 'grampo', n: 'Grampo do RNA', c: 'Haste e alça', t: 'A fita dobra e pareia trechos dela mesma, formando uma haste e uma alça.', d: 'Na haste, bases complementares se unem: A com U e G com C. A alça fica sem par. Dobras assim dão forma ao RNA transportador e ao RNA ribossômico.', rna: 1 }
  ];
  const PASSOS = ['hélice', 'bases', 'RNA', 'diferenças'];
  const LEG = ['DNA: duas fitas de açúcar e fosfato em dupla hélice, com um sulco maior e um sulco menor', 'As fitas do DNA se unem pelas bases: A com T por 2 ligações de hidrogênio, G com C por 3', 'RNA: uma fita só, com uracila no lugar da timina, que dobra sobre si mesma e pareia trechos: A com U e G com C', 'DNA: desoxirribose e timina. RNA: ribose, com um OH a mais, e uracila'];

  // ---------- vetores ----------
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], vlen = a => Math.hypot(a[0], a[1], a[2]);
  const nrm = a => { const l = vlen(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const hel = (a, r, y) => [r * Math.cos(a), y, -r * Math.sin(a)];
  const yj = j => (j - (N - 1) / 2) * DY;
  const wrap = a => { a = (a + Math.PI) % PI2; if (a < 0) a += PI2; return a - Math.PI; };
  const mixc = (c, f, df) => [BG[0] + (c[0] * f - BG[0]) * df, BG[1] + (c[1] * f - BG[1]) * df, BG[2] + (c[2] * f - BG[2]) * df];
  const rg = (c, a = 1) => `rgba(${cl(c[0], 0, 255) | 0},${cl(c[1], 0, 255) | 0},${cl(c[2], 0, 255) | 0},${a})`;
  const lit = (c, k) => [c[0] + (255 - c[0]) * k, c[1] + (255 - c[1]) * k, c[2] + (255 - c[2]) * k];
  const dep = z => cl(.6 + .4 * (z + 1.3) / 2.6, .5, 1);

  // ---------- geometria do DNA (forma B, simplificada: 18 pares, cerca de 10 por volta) ----------
  const D = { par: [], tub: [[], []] };
  for (let j = 0; j < N; j++) {
    const y = yj(j), aA = j * TW, aB = aA + DEL, bA = SEQ[j], bB = PAR[bA], SA = hel(aA, 1, y), SB = hel(aB, 1, y);
    const d = sub(SB, SA), c = vlen(d), e1 = nrm(d), e3 = nrm(cross(e1, [0, 1, 0])), us = c - 2 * RSUG - GAP, lA = us * (PUR[bA] ? .575 : .425), lB = us - lA;
    const mid = mul(add(SA, SB), .5);
    D.par.push({ j, bA, bB, SA, SB, e1, e3, lA, lB, mid, am: Math.atan2(-mid[2], mid[0]), pA: hel(aA - TW / 2, 1.1, y - DY / 2), pB: hel(aB + TW / 2, 1.1, y + DY / 2), tipo: PUR[bA] ? (bA === 'A' ? 'AT' : 'GC') : (bA === 'T' ? 'AT' : 'GC') });
  }
  { // esqueleto: nós de fosfato e açúcar, subdivididos para a curva ficar lisa
    const nodes = [[], []];
    for (let j = 0; j < N; j++) {
      nodes[0].push([j * TW - TW / 2, yj(j) - DY / 2, 1.1, j - .5, 'p'], [j * TW, yj(j), 1, j, 's']);
      nodes[1].push([j * TW + DEL, yj(j), 1, j, 's'], [j * TW + DEL + TW / 2, yj(j) + DY / 2, 1.1, j + .5, 'p']);
    }
    for (let s = 0; s < 2; s++) for (let i = 0; i < nodes[s].length - 1; i++) for (let k = 0; k < 3; k++) {
      const u = k / 3, a = nodes[s][i], b = nodes[s][i + 1];
      D.tub[s].push({ p: hel(lerp(a[0], b[0], u), lerp(a[2], b[2], u), lerp(a[1], b[1], u)), jf: lerp(a[3], b[3], u) });
    }
    for (let s = 0; s < 2; s++) { const l = nodes[s][nodes[s].length - 1]; D.tub[s].push({ p: hel(l[0], l[2], l[1]), jf: l[3] }); }
  }
  const baseMid = (q, lado) => lado ? sub(q.SB, mul(q.e1, RSUG + q.lB / 2)) : add(q.SA, mul(q.e1, RSUG + q.lA / 2));
  const gapMid = q => add(q.SA, mul(q.e1, RSUG + q.lA + GAP / 2));

  // candidatos de cada hotspot do DNA: o botão acompanha o melhor candidato (o da frente, perto da faixa alvo)
  const CAND = {};
  { const alvo = { fosfato: 15.6, desoxirribose: 2.4, G: .8, pGC: 4.6, T: 6.8, pAT: 8.9, C: 10.8, A: 13.2 };
    for (const id in alvo) CAND[id] = [];
    for (const q of D.par) {
      CAND.fosfato.push({ p: q.pA, jf: q.j - .5, g: alvo.fosfato, am: Math.atan2(-q.pA[2], q.pA[0]) }, { p: q.pB, jf: q.j + .5, g: alvo.fosfato, am: Math.atan2(-q.pB[2], q.pB[0]) });
      CAND.desoxirribose.push({ p: q.SA, jf: q.j, g: alvo.desoxirribose, am: Math.atan2(-q.SA[2], q.SA[0]) }, { p: q.SB, jf: q.j, g: alvo.desoxirribose, am: Math.atan2(-q.SB[2], q.SB[0]) });
      CAND[q.bA].push({ p: baseMid(q, 0), jf: q.j, g: alvo[q.bA], am: q.am }); CAND[q.bB].push({ p: baseMid(q, 1), jf: q.j, g: alvo[q.bB], am: q.am });
      CAND['p' + q.tipo].push({ p: gapMid(q), jf: q.j, g: alvo['p' + q.tipo], am: q.am });
    }
  }

  // ---------- geometria do RNA: grampo de 18 nucleotídeos (cauda, haste de 5 pares, alça GAAA, cauda) ----------
  const RN = 18, SP = .52, YS = -1.29, LOOP = [152, 112, 68, 28], LR = 1.08, LC = -.1;
  const R_UNF = [], R_FLD = [];
  for (let i = 0; i < RN; i++) { R_UNF.push({ p: [.28 * Math.sin(i * .8), -2.55 + i * (5.1 / 17), .12 * Math.cos(i * .6)], d: [i % 2 ? -1 : 1, 0, 0] }); R_FLD.push(null); }
  for (let k = 0; k < 5; k++) { const y = YS + k * SP; R_FLD[2 + k] = { p: [-.95, y, 0], d: [1, 0, 0] }; R_FLD[15 - k] = { p: [.95, y, 0], d: [-1, 0, 0] }; }
  LOOP.forEach((g, k) => { const a = g * Math.PI / 180, c = Math.cos(a), s = Math.sin(a); R_FLD[7 + k] = { p: [LR * c, YS + 4 * SP + LC + LR * s, 0], d: [c, s, 0] }; });
  R_FLD[1] = { p: [-1.05, YS - SP, 0], d: [-1, 0, 0] }; R_FLD[0] = { p: [-1.3, YS - 2 * SP, 0], d: [-1, 0, 0] };
  R_FLD[16] = { p: [1.05, YS - SP, 0], d: [1, 0, 0] }; R_FLD[17] = { p: [1.3, YS - 2 * SP, 0], d: [1, 0, 0] };
  const RPARES = [[2, 15], [3, 14], [4, 13], [5, 12], [6, 11]];
  function rnaPose(F) {
    const out = [];
    for (let i = 0; i < RN; i++) { const f = ss(F * 1.5 - i / 17 * .5), a = R_UNF[i], b = R_FLD[i]; out.push({ f, p: [lerp(a.p[0], b.p[0], f), lerp(a.p[1], b.p[1], f), lerp(a.p[2], b.p[2], f)], d: nrm([lerp(a.d[0], b.d[0], f), lerp(a.d[1], b.d[1], f), lerp(a.d[2], b.d[2], f)]), b: SRNA[i] }); }
    return out;
  }
  const catmull = (p0, p1, p2, p3, t) => { const t2 = t * t, t3 = t2 * t; return [0, 1, 2].map(k => .5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)); };

  // ---------- estado, câmera e interface ----------
  let cur = null, ui = null, ativo = false;
  const L = nrm([-.4, .62, .68]);
  const mkXf = (th, tilt, ori) => { const c = Math.cos(th), s = Math.sin(th), ct = Math.cos(tilt), st = Math.sin(tilt); return v => { const x = v[0] * c + v[2] * s, z = -v[0] * s + v[2] * c, y2 = v[1] * ct - z * st, z2 = v[1] * st + z * ct; return ori ? [y2, -x, z2] : [x, y2, z2]; }; };
  const SVGI = { menos: '<path d="M5 12h14"/>', mais: '<path d="M12 5v14M5 12h14"/>', inicio: '<path d="M4 12a8 8 0 1 0 2.4-5.7L4 8.5"/><path d="M4 4v4.5h4.5"/>', girar: '<ellipse cx="12" cy="12" rx="9" ry="4"/><path d="M15.2 4.4l3.2.3-.9 3"/><circle cx="12" cy="12" r="1.2"/>', fechar: '<path d="M6 6l12 12M18 6L6 18"/>' };
  const svg = k => `<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${SVGI[k]}</g></svg>`;
  const CSS = `
.dr-hs-host{position:absolute;inset:0;pointer-events:none;z-index:2;overflow:hidden}
.dr-hs-host[hidden]{display:none}
.dr-hs{position:absolute;left:0;top:0;padding:0;margin:0;border:0;background:transparent;border-radius:50%;cursor:pointer;pointer-events:auto;opacity:0;will-change:transform}
.dr-hs i{position:absolute;left:50%;top:50%;width:11px;height:11px;margin:-5.5px 0 0 -5.5px;border-radius:50%;background:rgba(255,255,255,.92);border:1.5px solid rgba(11,15,28,.6);transition:background .09s,transform .09s}
.dr-hs i::before{content:"";position:absolute;inset:-1.5px;border-radius:50%;border:1px solid rgba(255,255,255,.75);opacity:0}
.dr-hs-host.on .dr-hs i::before{animation:drp 1.2s cubic-bezier(.16,1,.3,1) 2 .6s}
.dr-hs-host.conv .dr-hs i::before{animation:drp 1.2s cubic-bezier(.16,1,.3,1) 1}
@keyframes drp{from{transform:scale(1);opacity:.7}to{transform:scale(2.6);opacity:0}}
.dr-hs:hover i,.dr-hs.ativo i{background:#FFB347;transform:scale(1.25)}
.dr-hs:focus-visible{outline:2px solid var(--focus,#8FD8FF);outline-offset:-2px}
.dr-tip{position:absolute;left:0;top:0;padding:8px 12px;border-radius:12px;background:var(--pill,rgba(11,15,28,.82));border:1px solid var(--float-line,rgba(255,255,255,.08));box-shadow:var(--float-shadow,0 8px 24px rgba(0,0,0,.45));color:var(--txt,#E8EDF7);font-size:14px;line-height:1.4;pointer-events:none;opacity:0;transform:translateY(4px);transition:opacity .16s cubic-bezier(.16,1,.3,1),transform .16s cubic-bezier(.16,1,.3,1)}
.dr-tip.on{opacity:1;transform:none}
.dr-tip b{display:block;font-family:var(--f-title,inherit);font-size:15px;margin-bottom:2px;color:#fff}
.dr-tip span{display:block;color:#D3DAEA;font-size:13px}
.dr-tip::after{content:"";position:absolute;left:var(--ax,50%);width:1px;height:14px;background:rgba(255,255,255,.6);top:100%}
.dr-tip.abaixo::after{top:auto;bottom:100%}
.dr-info{position:absolute;left:16px;bottom:76px;width:min(340px,calc(100% - 32px));padding:12px 14px;border-radius:12px;background:var(--float,rgba(19,26,43,.92));border:1px solid var(--float-line,rgba(255,255,255,.08));box-shadow:var(--float-shadow,0 8px 24px rgba(0,0,0,.45));backdrop-filter:blur(8px);color:var(--txt,#E8EDF7);opacity:0;transform:translateY(8px);pointer-events:none;transition:opacity 160ms cubic-bezier(.7,0,.84,0),transform 160ms cubic-bezier(.7,0,.84,0);z-index:3}
.dr-info.on{opacity:1;transform:none;pointer-events:auto;transition-duration:280ms;transition-timing-function:cubic-bezier(.16,1,.3,1)}
.dr-info .h{display:flex;align-items:center;gap:8px;padding-right:40px;font:600 16px/1.25 var(--f-title,system-ui)}
.dr-info .h i{width:10px;height:10px;border-radius:50%;flex:none}
.dr-info small{display:block;color:var(--dim,#9DA9C4);font-size:13px;margin:4px 0 0 18px}
.dr-info p{font-size:14px;line-height:1.45;margin:8px 0 10px;color:#D3DAEA}
.dr-info .x{position:absolute;top:4px;right:4px;width:44px;height:44px;display:grid;place-items:center;border:0;border-radius:8px;background:none;color:var(--dim,#9DA9C4);cursor:pointer}
.dr-info .x:hover{color:var(--txt,#E8EDF7);background:var(--panel-2,#1B2440)}
.dr-info svg{width:20px;height:20px}
.dr-info .z{font:inherit;font-size:14px;font-weight:600;display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 12px;border-radius:8px;border:1px solid var(--line-strong,#5B6C99);background:var(--panel,#131A2B);color:var(--txt,#E8EDF7);cursor:pointer}
.dr-info .z:hover{background:var(--panel-2,#1B2440)}
.dr-info button:focus-visible{outline:2px solid var(--focus,#8FD8FF);outline-offset:2px}
.dr-barra[hidden]{display:none}
.dr-barra .grp{display:flex;gap:4px;flex:none}
.dr-barra .dica{font-size:13px;color:var(--dim,#9DA9C4);margin-left:8px}
@media(max-width:699px){.dr-info{left:8px;right:8px;width:auto;top:48px;bottom:auto}.dr-barra .dica{display:none}.dr-tip{font-size:13px;padding:6px 10px}.dr-tip b{font-size:14px}}
@media(prefers-reduced-motion:reduce){.dr-hs-host.on .dr-hs i::before,.dr-hs-host.conv .dr-hs i::before{animation:none}.dr-hs i::before{opacity:.7;inset:-2px}.dr-tip,.dr-info{transition:opacity .15s linear;transform:none}}`;

  function montar() {
    if (ui) return ui;
    const st = document.createElement('style'); st.id = 'dr-css'; st.textContent = CSS; document.head.appendChild(st);
    const tela = cv.parentElement, palco = tela.parentElement;
    const host = document.createElement('div'); host.className = 'dr-hs-host'; host.hidden = true; tela.appendChild(host);
    const tip = document.createElement('div'); tip.className = 'dr-tip'; tip.setAttribute('aria-hidden', 'true'); tip.hidden = true; tip.innerHTML = '<b></b><span></span>'; host.appendChild(tip);
    const info = document.createElement('div'); info.className = 'dr-info'; info.setAttribute('role', 'region'); info.setAttribute('aria-live', 'polite'); info.setAttribute('aria-label', 'Detalhe da peça');
    info.innerHTML = `<div class="h"><i></i><span></span></div><small></small><p></p><button type="button" class="z">${svg('inicio')}Vista inicial</button><button type="button" class="x" aria-label="Fechar o detalhe" title="Fechar">${svg('fechar')}</button>`;
    tela.appendChild(info);
    const barra = document.createElement('div'); barra.className = 'barra dr-barra'; barra.setAttribute('role', 'toolbar'); barra.setAttribute('aria-label', 'Controles da vista'); barra.hidden = true;
    const bt = (id, k, tx, tit, sq) => `<button type="button" data-a="${id}" title="${tit}" aria-label="${tit}"${sq ? ' class="sq"' : ''}>${svg(k)}${tx ? `<span class="tx">${tx}</span>` : ''}</button>`;
    barra.innerHTML = `<div class="grp">${bt('menos', 'menos', '', 'Afastar', 1)}${bt('mais', 'mais', '', 'Aproximar', 1)}${bt('inicio', 'inicio', 'Vista inicial', 'Voltar à vista inicial')}</div><button type="button" data-a="girar" aria-pressed="false" title="Girar sozinho"><svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${SVGI.girar}</g></svg><span class="tx">Girar</span></button><span class="dica">Arraste para girar, use a roda ou a pinça para aproximar e toque num ponto</span>`;
    palco.insertBefore(barra, tela.nextSibling);
    ui = { host, tip, info, barra, btn: {}, shown: false, t0: 0, chips: null };
    DICA.forEach((d, i) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'dr-hs'; b.dataset.id = d.id; b.setAttribute('aria-label', `${d.n}: ${d.t}`); b.setAttribute('aria-pressed', 'false'); b.innerHTML = '<i></i>';
      b.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse' && cur) { cur.e.hov = d.id; parar(); mostrar(); } });
      b.addEventListener('pointerleave', () => { if (cur) { cur.e.hov = null; mostrar(); } });
      b.addEventListener('focus', () => { if (!cur) return; cur.e.foc = d.id; parar(); trazer(d.id); mostrar(); });
      b.addEventListener('blur', () => { if (cur) { cur.e.foc = null; mostrar(); } });
      b.addEventListener('click', e => { e.stopPropagation(); if (!cur) return; cur.e.pin === d.id ? fechar() : fixar(d.id); });
      host.appendChild(b); ui.btn[d.id] = b;
    });
    host.addEventListener('keydown', e => { if (e.key === 'Escape' && cur) { fechar(); e.stopPropagation(); } });
    info.addEventListener('keydown', e => { if (e.key === 'Escape' && cur) { fechar(); e.stopPropagation(); } });
    info.querySelector('.x').onclick = () => fechar();
    info.querySelector('.z').onclick = () => vistaInicial();
    barra.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b || !cur) return; const a = b.dataset.a, E = cur.e;
      if (a === 'mais') { parar(); zoomPor(1.35); } else if (a === 'menos') { parar(); zoomPor(1 / 1.35); } else if (a === 'inicio') vistaInicial();
      else if (a === 'girar') { E.auto = !E.auto; if (E.auto) { E.vth = 0; E.seek = null; } atualizarBarra(); }
    });
    // arrastar, pinça, roda e teclado no próprio canvas
    const pts = new Map(); let arr = null, pinca = 0, pc = null;
    const dist = () => { const a = [...pts.values()]; return Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y); };
    const cen = () => { const a = [...pts.values()], r = cv.getBoundingClientRect(); return [(a[0].x + a[1].x) / 2 - r.left, (a[0].y + a[1].y) / 2 - r.top]; };
    cv.addEventListener('pointerdown', e => {
      if (!ativo || !cur) return; pts.set(e.pointerId, { x: e.clientX, y: e.clientY }); try { cv.setPointerCapture(e.pointerId); } catch (err) { /* sem captura */ }
      parar(); cur.e.vth = 0; cur.e.seek = null;
      if (pts.size === 1) arr = { mov: 0, t: performance.now() }; else if (pts.size === 2) { pinca = dist(); pc = cen(); arr = null; }
    });
    cv.addEventListener('pointermove', e => {
      if (!ativo || !cur || !pts.has(e.pointerId)) return; const E = cur.e, o = pts.get(e.pointerId), dx = e.clientX - o.x, dy = e.clientY - o.y; pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size >= 2) { const d = dist(), c = cen(); if (pinca > 0) zoomPor(d / pinca, c[0], c[1]); panPx(c[0] - pc[0], c[1] - pc[1]); pinca = d; pc = c; return; }
      if (!arr) return; arr.mov += Math.abs(dx) + Math.abs(dy); if (arr.mov < 4) return; cv.classList.add('arr');
      const k = 3.2 / Math.max(300, Math.min(W, H)), hz = !NAR, rot = (hz ? dy : dx) * k, tl = (hz ? dx : dy) * k * .7;
      const now = performance.now(), dt = Math.max(8, now - (arr.t || now)); arr.t = now; E.th += rot; E.vth = rot / dt * 1000 * .8 + E.vth * .2; E.ttilt = cl(E.ttilt + tl, -.55, .75); E.fx0 = null;
    });
    const solta = e => {
      if (!pts.has(e.pointerId)) return; pts.delete(e.pointerId); cv.classList.remove('arr'); if (pts.size < 2) pinca = 0;
      if (pts.size === 0 && arr && arr.mov < 6 && e.type === 'pointerup' && cur && cur.e.pin) fechar();
      if (pts.size === 0) { arr = null; if (reduzir() && cur) cur.e.vth = 0; }
    };
    cv.addEventListener('pointerup', solta); cv.addEventListener('pointercancel', solta);
    cv.addEventListener('wheel', e => { if (!ativo || !cur) return; e.preventDefault(); parar(); const r = cv.getBoundingClientRect(); zoomPor(Math.exp(-e.deltaY * (e.deltaMode ? .05 : .0016)), e.clientX - r.left, e.clientY - r.top); }, { passive: false });
    cv.addEventListener('keydown', e => {
      if (!ativo || !cur || e.altKey || e.ctrlKey || e.metaKey) return; const E = cur.e; let ok = true;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { parar(); E.seek = null; E.th += (e.key === 'ArrowLeft' ? -1 : 1) * .12; }
      else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { parar(); E.ttilt = cl(E.ttilt + (e.key === 'ArrowUp' ? -1 : 1) * .06, -.55, .75); }
      else if (e.key === '+' || e.key === '=') { parar(); zoomPor(1.25); } else if (e.key === '-' || e.key === '_') { parar(); zoomPor(.8); }
      else if (e.key === '0') vistaInicial(); else if (e.key === 'Escape') { if (E.pin) fechar(); else ok = false; } else ok = false;
      if (ok) e.preventDefault();
    });
    return ui;
  }
  function parar() { if (!cur) return; const E = cur.e; E.last = performance.now(); E.idle = performance.now(); if (E.auto) { E.auto = false; atualizarBarra(); } }
  function atualizarBarra() { if (!ui || !cur) return; const b = ui.barra.querySelector('[data-a=girar]'); b.setAttribute('aria-pressed', !!cur.e.auto); b.disabled = reduzir(); b.style.opacity = reduzir() ? .5 : ''; }
  function limitar() { const E = cur.e; E.tz = cl(E.tz, .6, 4.2); const m = NAR ? 4.6 : 8.2; E.tfx = cl(E.tfx, -m, m); E.tfy = cl(E.tfy, -m * .6, m * .6); }
  function zoomPor(k, px, py) { // aproxima ou afasta; com px e py, em torno do ponto sob o dedo ou o cursor
    const E = cur.e, g = layout(), z0 = E.tz, z1 = cl(z0 * k, .6, 4.2), hz = E.hz;
    if (px != null && !E.pin) { const wx = E.tfx + (px - g.cx) / (g.S0 * hz * z0), wy = E.tfy - (py - g.cy) / (g.S0 * hz * z0); E.tfx = wx - (px - g.cx) / (g.S0 * hz * z1); E.tfy = wy + (py - g.cy) / (g.S0 * hz * z1); }
    E.tz = z1; if (E.pin && E.tz < 1.4) E.tz = 1.4; if (!E.pin && z1 <= 1.001) { E.tfx = E.tfy = 0; } limitar();
  }
  function panPx(dx, dy) { const E = cur.e; if (E.pin || E.tz < 1.02) return; const g = layout(); E.tfx -= dx / (g.S0 * E.hz * E.tz); E.tfy += dy / (g.S0 * E.hz * E.tz); limitar(); }
  function vistaInicial() { const E = cur.e; E.pin = null; E.tz = 1; E.tfx = E.tfy = 0; E.ttilt = HOME.tilt; E.seek = E.th + wrap(HOME.th - E.th); E.vth = 0; mostrar(); }
  function fixar(id) {
    const E = cur.e; if (DICA.find(d => d.id === id).rna && E.rv < .5) return; E.pin = id; parar(); trazer(id, true); E.tz = NAR ? 2.1 : 2.7; mostrar();
  }
  function fechar() { const E = cur.e; E.pin = null; E.tz = 1; E.tfx = E.tfy = 0; E.hov = E.foc = null; mostrar(); }
  function trazer(id, travar) { // gira o DNA até o ponto ficar de frente
    const E = cur.e, c = E.cs[id]; if (!c || c.rna) return; if (travar) E.pinC = c.c; const am = c.c ? c.c.am : null; if (am == null) return;
    E.seek = E.th + wrap(-Math.PI / 2 - am - E.th); E.vth = 0;
  }
  function mostrar() {
    if (!ui || !cur) return; const E = cur.e, id = E.pin || E.hov || E.foc, tip = ui.tip, info = ui.info; E.act = id;
    for (const d of DICA) { ui.btn[d.id].classList.toggle('ativo', d.id === id); ui.btn[d.id].setAttribute('aria-pressed', d.id === E.pin); }
    const dd = id ? DICA.find(q => q.id === id) : null;
    if (E.pin && dd) { info.querySelector('.h span').textContent = dd.n; info.querySelector('.h i').style.background = dotCor(dd.id); info.querySelector('small').textContent = dd.c; info.querySelector('p').textContent = dd.t + ' ' + dd.d; info.classList.add('on'); }
    else info.classList.remove('on');
    if (!dd || E.pin) { tip.hidden = true; tip.classList.remove('on'); return; }
    tip.querySelector('b').textContent = dd.n; tip.querySelector('span').textContent = dd.t; tip.hidden = false; E.tipOn = true; posTip();
  }
  function posTip() {
    const E = cur && cur.e; if (!E || !E.tipOn) return; const id = E.hov || E.foc, c = id && E.cs[id]; if (!c || !c.s) return; const tip = ui.tip, a = c.s;
    const w = Math.min(NAR ? 220 : 280, W - 16); tip.style.width = w + 'px'; const h = tip.offsetHeight || 70, abaixo = a[1] < 150 || a[1] - h - 30 < 52;
    const x = cl(a[0] - w / 2, 8, W - w - 8); let y = abaixo ? a[1] + 22 : a[1] - h - 22; y = cl(y, NAR ? 44 : 56, H - h - 96);
    tip.style.transform = `translate(${x}px,${y}px)`; tip.style.left = '0'; tip.style.top = '0'; tip.style.setProperty('--ax', (a[0] - x) + 'px'); tip.classList.toggle('abaixo', abaixo); tip.classList.add('on');
  }
  function dotCor(id) { return ({ fosfato: '#FF9A3C', desoxirribose: '#FFE1A6', ribose: '#FFE1A6', A: '#39E58C', T: '#FF4F6D', G: '#FFC53D', C: '#3FA9FF', U: '#C77DFF', pAT: '#FFFFFF', pGC: '#FFFFFF', grampo: '#E6A07E' })[id]; }

  // ---------- layout e projeção ----------
  function layout() {
    const A = area(), hz = !NAR; let S0, gD, gR;
    if (hz) { S0 = Math.min(A.w / 15, A.h / 3.15); gD = [-3, 0]; gR = [4.5, 0]; } else { S0 = Math.min(A.h / 9.1, (A.w / 2) / 3.75); gD = [-1.95, 0]; gR = [1.95, 0]; }
    return { A, hz, S0, cx: A.cx, cy: A.cy, gD, gR };
  }

  // ---------- cena ----------
  function init(S) {
    const u = montar(); cur = S; ativo = true; const rd = reduzir();
    S.e = { th: HOME.th, tilt: HOME.tilt, ttilt: HOME.tilt, vth: 0, seek: null, z: 1, tz: 1, fx: 0, fy: 0, tfx: 0, tfy: 0, auto: !rd, pin: null, hov: null, foc: null, act: null, actw: 0, pinC: null, hz: 1, hf: 0, lbw: 1,
      te: S.ph > .01 || rd ? 9 : 0, st: -1, sw: [1, 0, 0, 0], rv: 0, fold: 0, last: performance.now(), idle: 0, pk: {}, cs: {}, hs: {}, tipOn: false, oy: 0, mot: null };
    for (const d of DICA) S.e.hs[d.id] = { o: 0, c: null }; S.e.st = Math.max(0, Math.min(3, Math.round(S.v))); S.e.sw = [0, 0, 0, 0].map((_, i) => i === S.e.st ? 1 : 0);
    if (S.e.st >= 2) { S.e.rv = 1; S.e.fold = 1; } else { const g0 = layout(); S.e.hz = Math.max(1, !NAR ? Math.min(g0.A.w * .95 / 8.9, g0.A.h * .96 / 3.0) / g0.S0 : Math.min(g0.A.w * .9 / 3.3, g0.A.h * .98 / 8.9) / g0.S0); S.e.hf = g0.gD[0]; }
    u.host.hidden = false; u.barra.hidden = false; u.host.classList.remove('on', 'conv'); u.shown = false; u.t0 = 0; if (S.e.te >= 9) { u.host.classList.add('on'); u.shown = true; u.t0 = performance.now(); }
    u.info.classList.remove('on'); u.tip.hidden = true; u.tip.classList.remove('on');
    cv.style.touchAction = 'none'; cv.tabIndex = 0; cv.setAttribute('role', 'application'); cv.style.cursor = 'grab';
    cv.setAttribute('aria-label', 'Animação: DNA e RNA. Arraste para girar a hélice, use a roda ou os botões para aproximar, as setas giram, mais e menos aproximam, zero volta à vista inicial e Esc fecha o detalhe.');
    atualizarBarra(); mostrar();
  }
  function sair() {
    ativo = false; cur = null; if (!ui) return; ui.host.hidden = true; ui.barra.hidden = true; ui.info.classList.remove('on'); ui.tip.hidden = true;
    cv.style.touchAction = ''; cv.style.cursor = ''; cv.removeAttribute('tabindex'); cv.setAttribute('role', 'img'); cv.classList.remove('arr');
  }

  function draw(t, S) {
    const E = S.e; if (!E) return; cur = S; const rd = reduzir(), g = layout(), { A, hz } = g;
    const now = performance.now(), rdt = Math.min(.05, Math.max(0, (now - E.last) / 1000)); E.last = now; const kc = rd ? 1 : 1 - Math.exp(-rdt * 6);
    // passo atual e pesos suaves de cada etapa
    const st = cl(Math.round(S.v), 0, 3); if (st !== E.st) { E.st = st; if (st < 2 && E.pin && DICA.find(d => d.id === E.pin).rna) fechar(); }
    const ks = rd ? 1 : 1 - Math.exp(-rdt * 4.5); for (let i = 0; i < 4; i++) E.sw[i] += ((i === st ? 1 : 0) - E.sw[i]) * ks;
    const sw = E.sw, T = t, tp = S.dt > 0 || !S.paused;
    E.te += S.dt;
    if (st >= 2) { E.rv += (1 - E.rv) * (rd ? 1 : 1 - Math.exp(-rdt * 3)); if (E.rv > .3) E.fold = rd ? 1 : Math.min(1, E.fold + rdt / 2.4); } else { E.rv += (0 - E.rv) * (rd ? 1 : 1 - Math.exp(-rdt * 3.5)); if (E.rv < .03) { E.rv = 0; E.fold = 0; } else if (E.fold > 0) E.fold = Math.max(0, E.fold - rdt / 1.2); }
    E.lbw += ((E.pin ? 0 : 1) - E.lbw) * (rd ? 1 : 1 - Math.exp(-rdt * 8));
    E.actw += ((E.act ? 1 : 0) - E.actw) * (rd ? 1 : 1 - Math.exp(-rdt * 8));
    // câmera: rotação (arrasto, inércia, autorrotação, busca de ângulo), inclinação, zoom e foco
    if (E.seek != null) { const d = E.seek - E.th; E.th += d * kc; if (Math.abs(d) < .003) { E.th = E.seek; E.seek = null; } }
    else if (Math.abs(E.vth) > .01 && !rd) { E.th += E.vth * rdt; E.vth *= Math.exp(-rdt * 3.2); } else E.vth = 0;
    if (E.auto && !rd && S.dt > 0 && E.seek == null) E.th += .2 * S.dt;
    E.tilt += (E.ttilt - E.tilt) * kc; E.z += (E.tz - E.z) * kc;
    if (E.pin) { const c = E.cs[E.pin]; if (c && c.L) { E.tfx = c.L[0]; E.tfy = c.L[1]; } }
    const fitD = hz ? Math.min(A.w * .95 / 8.9, A.h * .96 / 3.0) / g.S0 : Math.min(A.w * .9 / 3.3, A.h * .98 / 8.9) / g.S0, hzT = E.pin ? 1 : (st < 2 ? Math.max(1, fitD) : 1), hfT = E.pin ? 0 : (st < 2 ? g.gD[0] : 0);
    E.hz += (hzT - E.hz) * kc; E.hf += (hfT - E.hf) * kc;
    E.fx += (E.tfx - E.fx) * kc; E.fy += (E.tfy - E.fy) * kc; E.oy += (((NAR && E.pin) ? 70 : 0) - E.oy) * kc;
    const S1 = g.S0 * E.z * E.hz, cx = g.cx, cy = g.cy + E.oy, FX = E.fx + E.hf;
    const xfD = mkXf(E.th, E.tilt, hz), yaw = .5 * Math.sin(E.th), xfR = mkXf(yaw, E.tilt, hz);
    const gD = { xf: xfD, ox: g.gD[0], oy: g.gD[1] }, gR = { xf: xfR, ox: g.gR[0], oy: g.gR[1] };
    const proj = G => p => { const r = G.xf(p), sc = 1 + r[2] * .04; return [cx + (r[0] + G.ox - FX) * S1 * sc, cy - (r[1] + G.oy - E.fy) * S1 * sc, r[2], sc]; };
    const pD = proj(gD), pR = proj(gR), lay = G => p => { const r = G.xf(p); return [r[0] + G.ox, r[1] + G.oy, r[2]]; };
    const lD = lay(gD), lR = lay(gR);
    const rev = jf => E.te >= 8 ? 1 : ss((E.te - .25 - jf * .05) / .55), ent = ss(E.te / .9);
    const act = E.act, aw = E.actw, T4 = T * 5;
    const hl = (tag, rna) => { if (!act) return [1, 0]; const m = act === tag || (act === 'grampo' && rna); return [lerp(1, m ? 1 : .42, aw), m ? aw * (.7 + .3 * Math.sin(T4)) : 0]; };
    const emDT = sw[0] + sw[1] * .55 + sw[2] * .6 + sw[3] * .9, emBond = sw[0] * .45 + sw[1] + sw[2] * .4 + sw[3] * .55;
    const emDB = b => sw[0] * .92 + sw[1] + sw[2] * .55 + sw[3] * (b === 'T' ? 1 : .55), emRB = b => sw[0] + sw[1] + sw[2] + sw[3] * (b === 'U' ? 1 : .6);

    // ---------- fundo: brilhos, partículas ----------
    X.save();
    { const R = Math.max(W, H);
      let q = X.createRadialGradient(cx + (g.gD[0] - FX) * S1, cy, 10, cx + (g.gD[0] - FX) * S1, cy, R * .42); q.addColorStop(0, `rgba(112,124,255,${.16 * ent})`); q.addColorStop(1, 'rgba(112,124,255,0)'); X.fillStyle = q; X.fillRect(0, 0, W, H);
      q = X.createRadialGradient(cx + (g.gR[0] - FX) * S1, cy, 10, cx + (g.gR[0] - FX) * S1, cy, R * .3); q.addColorStop(0, `rgba(255,150,120,${.13 * E.rv})`); q.addColorStop(1, 'rgba(255,150,120,0)'); X.fillStyle = q; X.fillRect(0, 0, W, H); }
    { const Rn = rng(5), n = NAR ? 34 : 64; for (let i = 0; i < n; i++) { const u = Rn(), v = Rn(), sp = .2 + Rn() * .8, r = .6 + Rn() * 1.3, ph = Rn() * 6.3, drift = rd ? 0 : T * .012 * sp; const x = (u + Math.sin(T * .15 * sp + ph) * .01) * W, y = ((v - drift) % 1 + 1) % 1 * H; const al = (.08 + .22 * (.5 + .5 * Math.sin(T * .9 * sp + ph))) * ent; X.beginPath(); X.arc(x - FX * 6 * sp, y + E.fy * 6 * sp, r, 0, 7); X.fillStyle = `rgba(200,215,255,${al})`; X.fill(); } }

    // ---------- itens ordenados por profundidade ----------
    const it = [];
    // DNA: esqueleto (tubos), fosfatos, açúcares, bases e pontes
    const dnaAt = rev;
    for (let s = 0; s < 2; s++) {
      const tb = D.tub[s], col = s ? COR.f2 : COR.f1, pr = tb.map(q => pD(q.p));
      for (let i = 0; i < tb.length - 1; i++) {
        const a = pr[i], b = pr[i + 1], z = (a[2] + b[2]) / 2, rv = dnaAt(tb[i].jf); if (rv < .02) continue;
        const [m, gl] = hl('fosfato', 0); const al = rv * (emDT * (act ? lerp(1, .55, aw) : 1)); const w = .14 * S1 * (a[3] + b[3]) / 2;
        it.push({ z, f: () => tubo(a, b, w, col, al, z) });
      }
    }
    for (const q of D.par) {
      const rv = dnaAt(q.j); if (rv < .02) continue;
      const SA = pD(q.SA), SB = pD(q.SB), PA = pD(q.pA), PB = pD(q.pB);
      const [mP, gP] = hl('fosfato', 0), [mS, gS] = hl('desoxirribose', 0), al = rv * emDT;
      it.push({ z: PA[2] + .02, f: () => esfera(PA, .13 * S1 * PA[3], COR.fos, al * mP, gP) }, { z: PB[2] + .02, f: () => esfera(PB, .13 * S1 * PB[3], COR.fos, al * mP, gP) });
      it.push({ z: SA[2] + .03, f: () => pent(SA, .17 * S1 * SA[3], COR.ac, al * mS, gS, 0, null) }, { z: SB[2] + .03, f: () => pent(SB, .17 * S1 * SB[3], COR.ac, al * mS, gS, 0, null) });
      // blocos das bases e pontes de hidrogênio
      const eA = dnaAt(q.j) * 1, up = [0, 1, 0];
      const oA = add(q.SA, mul(q.e1, RSUG)), oB = sub(q.SB, mul(q.e1, RSUG + q.lB));
      const bA = bloco(oA, q.e1, up, q.e3, q.lA, q.bA, pD, xfD, eA * emDB(q.bA), hl(q.bA, 0)), bB = bloco(oB, q.e1, up, q.e3, q.lB, q.bB, pD, xfD, eA * emDB(q.bB), hl(q.bB, 0));
      it.push(bA, bB);
      const nb = q.tipo === 'AT' ? 2 : 3, ys = nb === 2 ? [-.075, .075] : [-.1, 0, .1], pa = add(q.SA, mul(q.e1, RSUG + q.lA)), pb = sub(q.SB, mul(q.e1, RSUG + q.lB)), [mB, gB] = hl('p' + q.tipo, 0);
      const bonds = ys.map(y => [pD(add(pa, [0, y, 0])), pD(add(pb, [0, y, 0]))]);
      it.push({ z: (bonds[0][0][2] + bonds[0][1][2]) / 2 + .01, f: () => pontes(bonds, T, q.j, eA * emBond * mB, gB, q.tipo) });
    }
    // RNA
    if (E.rv > .01) {
      const pose = rnaPose(rd ? 1 : E.fold), pos = pose.map(q => pR(q.p)), ra = E.rv;
      const sug = pose.map((q, i) => ({ q, i })), path = [];
      const P = pose.map((q, i) => i ? add(mul(add(pose[i - 1].p, q.p), .5), mul(add(pose[i - 1].d, q.d), -.07)) : null);
      const pts = []; for (let i = 0; i < RN; i++) { if (i) pts.push(P[i]); pts.push(pose[i].p); }
      for (let i = 0; i < pts.length - 1; i++) for (let k = 0; k < 4; k++) path.push(catmull(pts[Math.max(0, i - 1)], pts[i], pts[i + 1], pts[Math.min(pts.length - 1, i + 2)], k / 4));
      path.push(pts[pts.length - 1]);
      const pr = path.map(p => pR(p)), [mT, gT] = hl('tubo', 1);
      for (let i = 0; i < pr.length - 1; i++) { const a = pr[i], b = pr[i + 1], z = (a[2] + b[2]) / 2, w = .14 * S1 * (a[3] + b[3]) / 2; it.push({ z, f: () => tubo(a, b, w, COR.rna, ra * (act === 'grampo' ? 1 : act ? lerp(1, .55, aw) : 1), z, act === 'grampo' ? aw : 0) }); }
      const [mP, gP] = hl('fosfato', 1), [mS, gS] = hl('ribose', 1);
      for (let i = 1; i < RN; i++) { const p = pR(P[i]); it.push({ z: p[2] + .02, f: () => esfera(p, .15 * S1 * p[3], COR.fos, ra * mP * (act === 'fosfato' ? 1 : 1), gP) }); }
      const pul = sw[3] * (.6 + .4 * Math.sin(T * 3.2)), ohA = Math.max(sw[3], act === 'ribose' ? aw : 0, .0);
      for (let i = 0; i < RN; i++) { const p = pos[i], d = pose[i].d, oh = pR(add(pose[i].p, mul(d, -.34))); it.push({ z: p[2] + .03, f: () => pent(p, .22 * S1 * p[3], COR.ac, ra * mS, Math.max(gS, pul * .9), 1, ohA > .05 ? oh : null, ohA) }); }
      for (let i = 0; i < RN; i++) {
        const q = pose[i], b = q.b, up = Math.abs(q.d[1]) > .9 ? [1, 0, 0] : [0, 1, 0], e3 = nrm(cross(q.d, up)), lb = (PUR[b] ? .74 : .55) * (.6 + .4 * q.f), [mB, gB] = hl(b, 1);
        const gU = (act === 'grampo' && i >= 7 && i <= 10) ? aw : 0;
        it.push(bloco(add(q.p, mul(q.d, RSUG)), q.d, up, e3, lb, b, pR, xfR, ra * emRB(b), [mB, Math.max(gB, gU * .6)]));
      }
      const fb = ss((E.fold - .72) / .28);
      if (fb > .02) for (const [i, j] of RPARES) {
        const a = pose[i], b = pose[j], tipo = (a.b === 'G' || a.b === 'C') ? 'GC' : 'AU', nb = tipo === 'GC' ? 3 : 2, ys = nb === 2 ? [-.075, .075] : [-.1, 0, .1], la = (PUR[a.b] ? .74 : .55), lb = (PUR[b.b] ? .74 : .55), [mB, gB] = hl('p' + (tipo === 'GC' ? 'GC' : 'AT'), 1);
        const pa = add(a.p, mul(a.d, RSUG + la)), pb = add(b.p, mul(b.d, RSUG + lb)), bonds = ys.map(y => [pR(add(pa, [0, y, 0])), pR(add(pb, [0, y, 0]))]);
        it.push({ z: (bonds[0][0][2] + bonds[0][1][2]) / 2 + .01, f: () => pontes(bonds, T, i, ra * fb * (.6 + .4 * (sw[2] + sw[3])) * mB, gB, tipo) });
      }
      E.rpose = pose;
    }
    it.sort((a, b) => a.z - b.z);
    for (const o of it) { X.save(); o.f(); X.restore(); }
    X.globalAlpha = 1;

    // ---------- rótulos com linha-guia ----------
    const nome = (a, dx, dy, ln, s, al) => {
      al *= E.lbw; if (!LB || al <= .03) return; const ax = a[0], ay = a[1]; let bx = ax + dx * ln, by = ay + dy * ln; X.save(); X.globalAlpha *= al * ent;
      const w = tw(s, 13, 600) + 4; bx = cl(bx, 12 + (Math.abs(dx) > .5 && dx < 0 ? w + 5 : 0), W - 12 - (Math.abs(dx) > .5 && dx > 0 ? w + 5 : Math.abs(dx) > .5 ? 0 : w / 2)); by = cl(by, NAR ? 60 : 84, H - 92);
      X.strokeStyle = 'rgba(232,237,247,.5)'; X.lineWidth = 1; X.beginPath(); X.moveTo(ax, ay); X.lineTo(bx, by); X.stroke(); X.beginPath(); X.arc(ax, ay, 2.6, 0, 7); X.fillStyle = 'rgba(11,15,28,.7)'; X.fill(); X.strokeStyle = '#E8EDF7'; X.stroke();
      const al2 = Math.abs(dx) > .5 ? (dx > 0 ? 'left' : 'right') : 'center'; tx(s, bx + (al2 === 'left' ? 5 : al2 === 'right' ? -5 : 0), by + (Math.abs(dx) > .5 ? 0 : dy > 0 ? 9 : -9), { a: al2, w: 600, s: 13, c: '#E8EDF7' }); X.restore();
    };
    const gcD = cx + (g.gD[0] - FX) * S1, gcR = cx + (g.gR[0] - FX) * S1, radD = 1.62 * S1 + 12, radR = 2.05 * S1 + 12;
    const nm = (a, side, gc, rad, s, al) => { const ex = hz ? a[0] : gc + side * rad, ey = hz ? cy + side * rad : a[1], d = Math.hypot(ex - a[0], ey - a[1]) || 1; nome(a, (ex - a[0]) / d, (ey - a[1]) / d, d, s, al); };
    const pick = (slot, list, G) => { // melhor candidato: de frente e perto da faixa alvo, com histerese
      const sc = c => G(c.p)[2] - .08 * Math.abs(c.jf - c.g); let best = null, bs = -9; for (const c of list) { const s = sc(c); if (s > bs) { bs = s; best = c; } }
      const cc = E.pk[slot]; if (cc && list.includes(cc) && sc(cc) > bs - .3 && G(cc.p)[2] > .05) return cc; E.pk[slot] = best; return best;
    };
    const vis = a => ss((a[2] + .05) * 2.4);
    // etapa 1: sulcos maior e menor
    if (sw[0] > .03 && E.te > 1.2) {
      const sul = (off, alvo, s, side) => { for (let m = -2; m <= 2; m++) { const j = (-Math.PI / 2 - E.th - off + PI2 * m) / TW; if (j < 1.5 || j > N - 2.5) continue; const w = cl(1 - Math.abs(j - alvo) / 4, 0, 1); if (w <= .05) continue; nm(pD(hel(j * TW + off, 1.04, yj(j))), side, gcD, radD, s, sw[0] * ss(w * 1.4)); } };
      sul(DEL / 2, 12.5, 'sulco menor', -1); sul(DEL / 2 + Math.PI, 4.5, 'sulco maior', 1);
    }
    // etapa 2: pontes de hidrogênio
    if (sw[1] > .03) {
      for (const [tipo, s, side] of [['AT', NAR ? 'A com T: 2 pontes' : 'A com T: 2 pontes de hidrogênio', -1], ['GC', NAR ? 'G com C: 3 pontes' : 'G com C: 3 pontes de hidrogênio', 1]]) {
        const lst = []; for (const q of D.par) if (q.tipo === tipo) lst.push({ p: gapMid(q), jf: q.j, g: tipo === 'AT' ? 12 : 5 });
        const sel = pick('l' + tipo, lst, xfD), a = pD(sel.p); nm(a, side, gcD, radD, s, sw[1] * vis(a) * rev(sel.jf));
      }
    }
    // etapa 3: RNA
    if (sw[2] > .03 && E.rpose && E.fold > .5 && hz) {
      const f = ss((E.fold - .5) * 2), ps = E.rpose;
      nm(pR(ps[6].p), -1, gcR, radR, 'uracila (U)', sw[2] * f); nm(pR(ps[13].p), 1, gcR, radR, 'haste: A com U e G com C', sw[2] * f);
      const a = pR(ps[10].p); nome(a, .4, .92, 66, 'alça do grampo', sw[2] * f);
    }
    // etapa 4: açúcar e base
    if (sw[3] > .03 && hz) {
      const sd = pick('sd', CAND.desoxirribose, xfD), td = pick('tt', CAND.T, xfD), a1 = pD(sd.p), a2 = pD(td.p);
      nm(a1, -1, gcD, radD, 'desoxirribose', sw[3] * vis(a1)); nm(a2, 1, gcD, radD, 'timina (T)', sw[3] * vis(a2));
      if (E.rpose) { const ps = E.rpose; nm(pR(ps[3].p), -1, gcR, radR, 'ribose: OH a mais', sw[3] * E.rv); nm(pR(ps[13].p), 1, gcR, radR, 'uracila (U)', sw[3] * E.rv); }
    }
    // extremidades 5' e 3' do DNA (só na etapa da hélice)
    if (sw[0] > .05 && LB && E.te > 1.4 && E.lbw > .05) { const ends = [[hel(-TW / 2, 1.1, yj(0) - DY / 2), '5′'], [hel((N - 1) * TW, 1, yj(N - 1)), '3′'], [hel(DEL + TW / 2 + (N - 1) * TW, 1.1, yj(N - 1) + DY / 2), '5′'], [hel(DEL, 1, yj(0)), '3′']]; for (const [p, s] of ends) { const a = pD(p); if (a[2] > -.2) { X.save(); X.globalAlpha = sw[0] * .8 * ss((a[2] + .2) * 2) * ent; tx(s, a[0] + (hz ? 0 : 0), a[1] + (hz ? -12 : 0) + (hz ? 0 : (p[1] < 0 ? 13 : -13)), { s: 13, w: 700, c: '#CFD8EE' }); X.restore(); } } }
    X.restore();

    // ---------- hotspots HTML ----------
    atualizarHs(S, g, pD, lD, pR, lR, xfD, ent, S1, cx, cy);
    cap(LEG[st]);
  }

  function atualizarHs(S, g, pD, lD, pR, lR, xfD, ent, S1, cx, cy) {
    const E = S.e, u = ui; if (!u) return; const hs = NAR ? 36 : 44, rd = reduzir();
    if (E.te >= 1.4 && !u.shown) { u.shown = true; u.host.classList.add('on'); u.t0 = performance.now(); }
    const now = performance.now(); if (u.shown && !rd && now - Math.max(E.idle || 0, u.t0) > 9000 && now - (E.conv || 0) > 9000) { E.conv = now; u.host.classList.remove('conv'); void u.host.offsetWidth; u.host.classList.add('conv'); }
    const pk2 = (id, c) => { const sc = q => xfD(q.p)[2] - .22 * Math.abs(q.jf - q.g); return sc(c); };
    for (const d of DICA) {
      const b = u.btn[d.id], h = E.hs[d.id]; let c = null, pp = null, ll = null, z = 1;
      if (d.rna) {
        const ps = E.rpose; if (!ps || E.rv < .5) { b.hidden = true; E.cs[d.id] = { rna: 1, s: null, L: null }; continue; } b.hidden = false;
        let p; if (d.id === 'ribose') p = ps[3].p; else if (d.id === 'U') p = add(ps[6].p, mul(ps[6].d, RSUG + .27)); else p = [0, YS + 4 * SP + LC + LR + .2, 0];
        pp = pR(p); ll = lR(p); z = 1; E.cs[d.id] = { rna: 1, s: pp, L: ll };
      } else {
        const list = CAND[d.id]; let best = null, bs = -9; for (const q of list) { const s = pk2(d.id, q); if (s > bs) { bs = s; best = q; } }
        let cc = (E.pin === d.id && E.pinC) ? E.pinC : h.c; const ok = cc && xfD(cc.p)[2] > .12;
        if (!ok || !cc) { if (E.pin !== d.id) { if (h.c !== best) { h.o = 0; } cc = best; } }
        h.c = cc; c = cc; pp = pD(c.p); ll = lD(c.p); z = pp[2]; E.cs[d.id] = { c, s: pp, L: ll };
        b.hidden = false;
      }
      const want = (E.te >= 1.4 ? 1 : 0) * (z > .08 ? 1 : 0) * (d.rna ? E.rv : 1), pin = E.pin;
      h.o += (want - h.o) * (reduzir() ? 1 : .18);
      const o = pin && pin !== d.id ? h.o * .55 : h.o;
      b.style.width = b.style.height = hs + 'px'; b.style.marginLeft = b.style.marginTop = (-hs / 2) + 'px'; b.style.transform = `translate(${pp[0].toFixed(1)}px,${pp[1].toFixed(1)}px)`;
      b.style.opacity = o.toFixed(2); b.style.pointerEvents = h.o > .35 ? 'auto' : 'none';
    }
    posTip();
  }

  // ---------- peças desenhadas ----------
  function tubo(a, b, w, col, al, z, gl) {
    if (al <= .01) return; const df = dep(z), c = mixc(col, 1, df); X.globalAlpha = Math.min(1, al); X.lineCap = 'round';
    X.strokeStyle = rg(mixc(col, .62, df)); X.lineWidth = w + 1.4; X.beginPath(); X.moveTo(a[0], a[1]); X.lineTo(b[0], b[1]); X.stroke();
    X.strokeStyle = rg(c); X.lineWidth = w; X.stroke();
    const ox = -.2 * w, oy = -.26 * w;
    X.strokeStyle = rg(lit(c, .55), .5); X.lineWidth = w * .3; X.lineCap = 'round'; X.beginPath(); X.moveTo(a[0] + ox, a[1] + oy); X.lineTo(b[0] + ox, b[1] + oy); X.stroke();
    if (gl > .02) { X.strokeStyle = `rgba(255,205,120,${.55 * gl})`; X.lineWidth = w + 6; X.globalCompositeOperation = 'lighter'; X.beginPath(); X.moveTo(a[0], a[1]); X.lineTo(b[0], b[1]); X.stroke(); }
  }
  function esfera(p, r, col, al, gl) {
    if (al <= .01) return; const df = dep(p[2]), x = p[0], y = p[1]; X.globalAlpha = Math.min(1, al);
    if (gl > .02) { const q = X.createRadialGradient(x, y, r * .5, x, y, r * 3); q.addColorStop(0, `rgba(255,205,120,${.5 * gl})`); q.addColorStop(1, 'rgba(255,205,120,0)'); X.fillStyle = q; X.fillRect(x - r * 3, y - r * 3, r * 6, r * 6); }
    const q = X.createRadialGradient(x - r * .35, y - r * .4, r * .08, x, y, r); q.addColorStop(0, rg(lit(mixc(col, 1, df), .65))); q.addColorStop(.45, rg(mixc(col, 1, df))); q.addColorStop(1, rg(mixc(col, .45, df)));
    X.beginPath(); X.arc(x, y, r, 0, 7); X.fillStyle = q; X.fill(); X.lineWidth = 1; X.strokeStyle = rg(mixc(col, .3, df), .7); X.stroke();
  }
  function pent(p, r, col, al, gl, ribose, oh, oa) {
    if (al <= .01) return; const df = dep(p[2]), x = p[0], y = p[1]; X.globalAlpha = Math.min(1, al);
    if (gl > .02) { const q = X.createRadialGradient(x, y, r * .6, x, y, r * 2.6); q.addColorStop(0, `rgba(255,215,140,${.42 * gl})`); q.addColorStop(1, 'rgba(255,215,140,0)'); X.fillStyle = q; X.fillRect(x - r * 2.6, y - r * 2.6, r * 5.2, r * 5.2); }
    X.beginPath(); for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * PI2 / 5; i ? X.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r) : X.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } X.closePath();
    const q = X.createRadialGradient(x - r * .3, y - r * .4, r * .1, x, y, r * 1.1); q.addColorStop(0, rg(lit(mixc(col, 1, df), .55))); q.addColorStop(.6, rg(mixc(col, 1, df))); q.addColorStop(1, rg(mixc(col, .55, df)));
    X.fillStyle = q; X.fill(); X.lineJoin = 'round'; X.lineWidth = Math.max(1, r * .16); X.strokeStyle = rg(mixc(col, .4, df), .85); X.stroke();
    if (ribose) { X.beginPath(); X.arc(x, y, r * 1.35, 0, 7); X.lineWidth = 1.2; X.strokeStyle = `rgba(255,236,190,${.35 + .4 * gl})`; X.stroke(); }
    if (ribose && oh) { X.globalAlpha = Math.min(1, al * oa); const rr2 = r * .3, ox = oh[0], oy = oh[1]; X.beginPath(); X.moveTo(x, y); X.lineTo(ox, oy); X.strokeStyle = 'rgba(255,255,255,.7)'; X.lineWidth = Math.max(1, r * .12); X.stroke();
      X.beginPath(); X.arc(ox, oy, rr2, 0, 7); X.fillStyle = '#FF5A5A'; X.fill(); X.strokeStyle = 'rgba(11,15,28,.5)'; X.lineWidth = 1; X.stroke();
      const hx2 = ox + (ox - x) * .55 + 0, hy2 = oy + (oy - y) * .55; X.beginPath(); X.arc(hx2, hy2, rr2 * .62, 0, 7); X.fillStyle = '#F4F7FF'; X.fill(); X.stroke(); }
  }
  // bloco arredondado e sombreado de uma base: caixa de 6 faces com cor por base, brilho e letra
  const FACES = [[0, 1, 3, 2], [4, 5, 7, 6], [0, 1, 5, 4], [2, 3, 7, 6], [0, 2, 6, 4], [1, 3, 7, 5]];
  function bloco(O, e1, up0, e3, Lb, b, proj, xf, al, hlv) {
    let up = up0; if (Math.abs(dot(e1, up)) > .95) up = [1, 0, 0]; const e3b = nrm(cross(e1, up)); up = cross(e3b, e1); e3 = e3b;
    const cs = []; for (let i = 0; i < 8; i++) { const sx = i >> 2 & 1, sy = i >> 1 & 1, sz = i & 1; cs.push(proj(add(add(add(O, mul(e1, sx * Lb)), mul(up, (sy - .5) * BH)), mul(e3, (sz - .5) * BD)))); }
    const z = cs.reduce((s, c) => s + c[2], 0) / 8, ns = [mul(e1, -1), e1, mul(up, -1), up, mul(e3, -1), e3].map(n => xf(n)), col = COR[b];
    return { z, f: () => {
      if (al <= .01) return; const [mm, gl] = hlv; X.globalAlpha = Math.min(1, al * mm); X.lineJoin = 'round'; const df = dep(z), lw = Math.max(1.5, .045 * cs[0][3] * Math.hypot(cs[0][0] - cs[7][0], 0) * 0 + 2.4);
      const vis = []; for (let f = 0; f < 6; f++) if (ns[f][2] > .01) vis.push(f); vis.sort((a, c) => ns[a][2] - ns[c][2]);
      if (gl > .02) { const mx = (cs[0][0] + cs[7][0]) / 2, my = (cs[0][1] + cs[7][1]) / 2, rr3 = Math.max(Math.hypot(cs[0][0] - cs[7][0], cs[0][1] - cs[7][1]) * .75, 12), q = X.createRadialGradient(mx, my, 2, mx, my, rr3); q.addColorStop(0, rg(lit(col, .3), .45 * gl)); q.addColorStop(1, rg(col, 0)); X.fillStyle = q; X.fillRect(mx - rr3, my - rr3, rr3 * 2, rr3 * 2); }
      for (const f of vis) {
        const n = ns[f], k = Math.max(0, dot(n, L)), fac = .42 + .78 * k, pts = FACES[f].map(i => cs[i]), c0 = mixc(col, fac * 1.1, df), c1 = mixc(col, fac * .86, df);
        let y0 = 1e9, y1 = -1e9; for (const p of pts) { y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
        const gr = X.createLinearGradient(0, y0, 0, y1 + .01); gr.addColorStop(0, rg(c0)); gr.addColorStop(1, rg(c1));
        X.beginPath(); pts.forEach((p, i) => i ? X.lineTo(p[0], p[1]) : X.moveTo(p[0], p[1])); X.closePath(); X.fillStyle = gr; X.fill(); X.strokeStyle = rg(mixc(col, fac * .8, df)); X.lineWidth = lw; X.stroke();
        if (f === 5 || f === 4) { const c = pts.reduce((s, p) => [s[0] + p[0] / 4, s[1] + p[1] / 4], [0, 0]), hgt = Math.hypot(pts[0][0] - pts[3][0], pts[0][1] - pts[3][1]), wid = Math.hypot(pts[0][0] - pts[1][0], pts[0][1] - pts[1][1]), sz = Math.min(hgt * .78, 18);
          if (n[2] > .5 && sz >= 9 && Math.hypot(pts[0][0] - pts[2][0], pts[0][1] - pts[2][1]) > sz * 1.4) { X.font = `700 ${sz.toFixed(1)}px ${FT}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = `rgba(11,15,28,${.55 * n[2]})`; X.fillText(b, c[0], c[1] + .5); } }
        if (k > .55 && f === 3) { X.strokeStyle = `rgba(255,255,255,${.28 * k})`; X.lineWidth = 1; X.beginPath(); X.moveTo(pts[0][0], pts[0][1]); X.lineTo(pts[1][0], pts[1][1]); X.stroke(); }
      }
      if (gl > .02) { X.strokeStyle = `rgba(255,214,140,${.85 * gl})`; X.lineWidth = 2; for (const f of vis) { const pts = FACES[f].map(i => cs[i]); X.beginPath(); pts.forEach((p, i) => i ? X.lineTo(p[0], p[1]) : X.moveTo(p[0], p[1])); X.closePath(); X.stroke(); } }
    } };
  }
  // pontes de hidrogênio luminosas: 2 no par A e T (ou A e U), 3 no par G e C
  function pontes(bonds, T, seed, a, gl, tipo) {
    if (a <= .02) return; X.lineCap = 'round';
    for (let k = 0; k < bonds.length; k++) {
      const [p, q] = bonds[k]; X.globalAlpha = Math.min(1, a);
      X.globalCompositeOperation = 'lighter'; X.strokeStyle = `rgba(150,215,255,${.2 + .3 * gl})`; X.lineWidth = 5 + 4 * gl; X.beginPath(); X.moveTo(p[0], p[1]); X.lineTo(q[0], q[1]); X.stroke();
      X.globalCompositeOperation = 'source-over'; X.strokeStyle = 'rgba(236,248,255,.95)'; X.lineWidth = 1.7; X.setLineDash([3.2, 2.6]); X.lineDashOffset = -T * 6; X.beginPath(); X.moveTo(p[0], p[1]); X.lineTo(q[0], q[1]); X.stroke(); X.setLineDash([]);
      for (const e of [p, q]) { X.beginPath(); X.arc(e[0], e[1], 2.1, 0, 7); X.fillStyle = '#EAF6FF'; X.fill(); }
      const u = fr(T * .6 + seed * .37 + k * .23), sx = lerp(p[0], q[0], u), sy = lerp(p[1], q[1], u), sa = Math.sin(u * Math.PI);
      X.globalCompositeOperation = 'lighter'; X.beginPath(); X.arc(sx, sy, 3.2, 0, 7); X.fillStyle = `rgba(190,235,255,${.7 * sa * (.4 + .6 * a)})`; X.fill(); X.globalCompositeOperation = 'source-over';
    }
  }

  const FT = "'Atkinson Hyperlegible Next', system-ui, sans-serif";
  const tw = (s, size, w) => { X.font = `${w || 400} ${Math.max(12, size)}px ${FT}`; return X.measureText(s).width; };
  return { init, draw, sair, DICA, PASSOS, LEG, mkXf, rnaPose, est: () => cur && cur.e };
})();

// ---------- registro: substitui o def('na', 'dna-rna') de cenas-b.js (carregue este arquivo depois dele) ----------
(() => {
  const k = 'na/dna-rna', old = SC[k] || {};
  def('na', 'dna-rna', {
    t: old.t || 'DNA × RNA', s: old.s || 'duas fitas ou uma; T ou U', c: old.c || C.na, loc: old.loc || 'Modelo 3D simplificado', still: 3,
    ctl: escolha('Passo', DRNA.PASSOS, 7),
    alt: 'À esquerda, o DNA em dupla hélice com bases coloridas e pontes de hidrogênio; à direita, o RNA em fita simples, com um grampo. Dá para girar, aproximar e tocar nos pontos para ver os detalhes',
    d: old.d, kv: old.kv, enem: old.enem, links: old.links,
    init: DRNA.init, sair: DRNA.sair, draw: DRNA.draw
  });
  // def() acrescenta a chave de novo em ORDER: tira a repetida para o tópico não aparecer duas vezes
  ORDER.na = ORDER.na.filter((x, i, a) => a.indexOf(x) === i);
})();
