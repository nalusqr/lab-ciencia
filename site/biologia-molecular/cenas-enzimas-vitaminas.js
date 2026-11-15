/* LAB · Módulo Biologia Molecular. Cenas das seções ENZIMAS ('enz') e VITAMINAS ('vit'). Dono: Prometeu.
   Usa a API do motor.js (Apolo): def(seção, id, {t, s, c, loc, alt, d, kv, enem, links, ctl, still, drag, draw(t, S)}),
   escolha(), area(), graph(), cap() e as primitivas de desenho. Tudo o que é meu fica dentro do IIFE abaixo;
   no nível de topo só há chamadas a def(). Sem dependências; abre por file://.
   Nunca escrever "<" seguido de "/script" neste arquivo (pode ser embutido inline numa prévia). */
'use strict';
(() => {
  // ---------- cores próprias (as de classe vêm do motor: C.enz, C.vit) ----------
  const SUB = '#F7C13B', PRO = '#F06AAE', INI = '#FF6B7D', ALO = '#4FB8E6', OK = '#7FE0A2', AMB = '#FFB347';
  const ENZ = C.enz, VITC = C.vit;
  const pct = v => Math.round(v) + '%';

  // ---------- desenhos próprios ----------
  // enzima: corpo arredondado com o sítio ativo em cima (centro do sítio em (cx, cy - s*.95)).
  // o.shape: 'tri' (fenda em V), 'u' (fenda arredondada que fecha com o.k), 'sq'; o.den: desnatura (0..1);
  // o.alo: inibidor no sítio alostérico deforma o sítio ativo (0..1); o.aloSite: desenha o sítio alostérico
  function enz_corpo(cx, cy, s, o = {}) {
    const k = o.k || 0, den = o.den || 0, alo = o.alo || 0, sh = o.shape || 'tri', t = o.t || 0;
    const R = s, sw = R * .42, sd = R * .5, n = 72;
    const site = x0 => {
      const x = x0 - sw * .3 * alo, u = Math.abs(x) / (sw * (1 - .5 * alo)); if (u >= 1) return 0;
      if (sh === 'tri') return sd * (1 - u);
      if (sh === 'sq') return sd * (u < .75 ? 1 : (1 - u) / .25);
      return sd * Math.pow(1 - u * u, .6) * ((1 - k) * .5 + .5);
    };
    X.save(); X.translate(cx, cy); X.beginPath();
    for (let i = 0; i <= n * 2; i++) {
      const a = PI + i / n * PI; let x = Math.cos(a) * R * 1.15, y = Math.sin(a) * R * .95;
      if (y < 0) y += site(x) * (Math.abs(y) / (R * .95)) ** 3;
      if (den) { y += Math.sin(x * .15 + t * 3 + i * .7) * R * .12 * den; x += Math.cos(y * .13 + i) * R * .1 * den; }
      i ? X.lineTo(x, y) : X.moveTo(x, y);
    }
    X.closePath();
    const g = X.createLinearGradient(0, -R, 0, R); g.addColorStop(0, rgba(ENZ, .95 - .4 * den)); g.addColorStop(1, rgba(ENZ, .5 - .2 * den));
    X.fillStyle = g; X.fill(); X.strokeStyle = light(ENZ, .5); X.lineWidth = 1.5; X.stroke();
    if (o.aloSite) { X.beginPath(); X.arc(R * .62, R * .55, R * .2, 0, TAU); X.fillStyle = 'rgba(11,15,28,.5)'; X.fill(); }
    X.restore();
  }
  // substrato (ou inibidor) com a forma do sítio; desenhado com o topo em (x, y)
  function enz_peca(x, y, s, sh, c, rot) {
    X.save(); X.translate(x, y); X.rotate(rot || 0); const sw = s * .42, sd = s * .5; X.beginPath();
    if (sh === 'tri') { X.moveTo(-sw, -sd * .2); X.lineTo(sw, -sd * .2); X.lineTo(0, sd * .8); X.closePath(); }
    else if (sh === 'sq') X.rect(-sw * .75, -sd * .2, sw * 1.5, sd);
    else if (sh === 'ini') { X.moveTo(-sw, -sd * .2); X.lineTo(-sw * .3, -sd * .2); X.arc(0, -sd * .2, sw * .3, PI, 0); X.lineTo(sw, -sd * .2); X.lineTo(0, sd * .8); X.closePath(); }
    else X.ellipse(0, sd * .3, sw * .92, sd * .62, 0, 0, TAU);
    X.fillStyle = c; X.fill(); X.strokeStyle = 'rgba(11,15,28,.6)'; X.lineWidth = 1.2; X.stroke(); X.restore();
  }
  // pastilha de texto (com fundo escuro), alinhável
  function enz_pill(s, x, y, c, a) {
    const w = tw(s, 13, 600) + 16, x0 = a === 'left' ? x : a === 'right' ? x - w : x - w / 2;
    rr(x0, y - 12, w, 24, 999, 'rgba(11,15,28,.86)', rgba(c || C.txt, .55), 1); tx(s, x0 + w / 2, y + .5, { s: 13, w: 600, c: c || C.txt, bg: false });
  }
  // seta de medida com duas pontas (vertical)
  function enz_medida(x, y1, y2, c) { line(x, y1, x, y2, c, 1.5); for (const [y, d] of [[y1, 1], [y2, -1]]) { X.beginPath(); X.moveTo(x, y); X.lineTo(x - 5, y + d * 8); X.lineTo(x + 5, y + d * 8); X.closePath(); X.fillStyle = c; X.fill(); } }
  // caixa de gráfico dentro da área útil, com margem para os eixos; fr = fração da largura usada
  function enz_caixa(fr, dy) { const A = area(), x0 = A.x0 + (NAR ? 34 : 44), y0 = A.y0 + (dy || 8), x1 = A.x0 + (A.w) * (fr || 1) - 8, y1 = A.y1 - 40; return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 }; }
  // área sob a curva
  function enz_area(g, f, a, b, y0, c) { X.beginPath(); X.moveTo(g.fx(a), g.fy(y0)); for (let i = 0; i <= 100; i++) { const v = lerp(a, b, i / 100); X.lineTo(g.fx(v), g.fy(f(v))); } X.lineTo(g.fx(b), g.fy(y0)); X.closePath(); X.fillStyle = c; X.fill(); }

  // ================= ENZIMAS =================
  const L_PROT = ['Desnaturação (Proteínas)', '#prot/desnaturacao'], L_ENZ = ['Encaixe enzima-substrato', '#enz/encaixe'];

  def('enz', 'encaixe', {
    t: 'Chave-fechadura e encaixe induzido', s: 'como a enzima reconhece o substrato', c: ENZ, loc: 'enzima e substrato · ~5 nm',
    alt: 'Um substrato entra no sítio ativo da enzima, é transformado e sai como dois produtos; a enzima termina igual',
    d: `<p><b>Enzimas</b> são catalisadores biológicos: aceleram reações químicas sem serem consumidas. Quase todas são <b>proteínas</b>. A reação acontece no <b>sítio ativo</b>, uma região da enzima onde a molécula que vai reagir, o <b>substrato</b>, se encaixa.</p><p>No modelo <b>chave-fechadura</b> (Emil Fischer, 1894), o sítio ativo já tem a forma exata do substrato. No modelo do <b>encaixe induzido</b> (Daniel Koshland, 1958), mais aceito hoje, o sítio é parecido com o substrato e <b>muda de forma</b> ao recebê-lo, envolvendo-o. Nos dois casos a enzima é <b>específica</b> e sai da reação intacta, pronta para outra.</p>`,
    kv: [['Natureza', 'quase sempre proteína'], ['Onde age', 'sítio ativo'], ['Ao fim da reação', 'enzima intacta'], ['Nome', 'costuma terminar em -ase']],
    enem: `A banca cobra três ideias: a enzima é <b>específica</b> (por causa da forma do sítio ativo), <b>não é consumida</b> (pode ser reutilizada muitas vezes) e depende da sua <b>forma tridimensional</b>, que vem da sequência de aminoácidos. Se a forma muda (calor, pH), a enzima para de funcionar.`,
    links: [L_PROT, LK.amino, LK.helice],
    ctl: escolha('Modelo', ['chave-fechadura', 'encaixe induzido'], 9),
    draw(t, S) {
      const A = area(), ind = Math.round(S.v) === 1, s = Math.min(A.w * .16, A.h * .26, 80), cx = A.cx, cy = A.y0 + A.h * .66;
      const cyc = 6, u = (t % cyc) / cyc, inn = ss(seg(u, .05, .35)), re = seg(u, .4, .55), out = ss(seg(u, .62, .92));
      const sh = ind ? 'u' : 'tri', top = cy - s * .95;
      enz_corpo(cx, cy, s, { shape: sh, k: ind ? ss(seg(u, .28, .4)) * (1 - ss(seg(u, .62, .75))) : 0 });
      if (u < .55) { const x = lerp(cx - A.w * .36, cx, inn), y = lerp(top - s * .9, top + s * .06, inn); enz_peca(x, y, s, sh, re < .5 ? SUB : PRO); }
      else for (const d of [-1, 1]) { X.save(); X.translate(cx + d * out * A.w * .3, top - out * s * .9); X.scale(.55, .55); enz_peca(0, 0, s, sh, PRO, d * .4); X.restore(); }
      enz_pill('enzima', cx + s * 1.25, cy + s * .45, light(ENZ, .3), 'left');
      if (u < .3) enz_pill('substrato', lerp(cx - A.w * .36, cx, inn), lerp(top - s * .9, top, inn) - s * .7, SUB);
      if (u >= .3 && u < .6) enz_pill('sítio ativo', cx - s * 1.3, top + s * .15, C.txt, 'right');
      if (u >= .62) enz_pill('produtos', cx, top - s * 1.25 - out * s * .3, PRO);
      cap(u < .3 ? '<b>1.</b> O substrato se aproxima do sítio ativo.' : u < .6 ? (ind ? '<b>2.</b> O sítio ativo <b>muda de forma</b> e envolve o substrato (encaixe induzido).' : '<b>2.</b> O substrato se encaixa no sítio ativo, que já tinha a forma certa (chave-fechadura).') : '<b>3.</b> Os produtos saem e a enzima volta à forma inicial, pronta para outra reação.');
    }
  });

  def('enz', 'ativacao', {
    t: 'Energia de ativação', s: 'o "morro" que a enzima rebaixa', c: ENZ, loc: 'gráfico de energia',
    alt: 'Gráfico de energia ao longo da reação: a curva com enzima tem um pico mais baixo; reagentes e produtos ficam no mesmo nível nas duas curvas',
    d: `<p>Mesmo uma reação que libera energia precisa de um empurrão para começar: a <b>energia de ativação</b>. É como empurrar uma pedra morro acima antes que ela role para baixo.</p><p>A enzima oferece um <b>caminho diferente</b> para a reação, com um morro mais baixo. Assim, muito mais moléculas conseguem reagir a 37 °C, e a reação fica milhões de vezes mais rápida, ou mais. A enzima <b>não muda</b> a energia dos reagentes nem a dos produtos: a energia liberada pela reação (<span class="q">ΔG</span>) continua a mesma.</p>`,
    kv: [['Energia de ativação', 'diminui'], ['Energia de reagentes e produtos', 'não muda'], ['ΔG da reação', 'não muda'], ['Velocidade', 'aumenta muito']],
    enem: `Em gráficos de energia × caminho da reação, a curva <b>com enzima</b> é a de pico mais <b>baixo</b>; o começo e o fim das duas curvas são <b>iguais</b>. Pegadinhas comuns: "a enzima fornece energia à reação" (errado) e "a enzima torna a reação mais exotérmica" (errado). Ela só <b>diminui a energia de ativação</b>.`,
    links: [LK.bioen, L_ENZ],
    ctl: Object.assign(escolha('Mostrar', ['sem enzima', 'com enzima', 'as duas']), { v: 2 }),
    draw(t, S) {
      const m = Math.round(S.v), G = enz_caixa(1, 18), Er = 3.6, Ep = 1.6;
      const pico = h => v => lerp(Er, Ep, ss(seg(v, 3.6, 6.4))) + h * Math.exp(-(((v - 5) / 1.25) ** 2));
      const sem = pico(5.4), com = pico(2.2), show = k => m === k || m === 2;
      const curves = []; if (show(0)) curves.push({ f: sem, c: '#C9D2E6', lw: 2.5 }); if (show(1)) curves.push({ f: com, c: ENZ, lw: 3 });
      const g = graph(G, { x0: 0, x1: 10, y0: 0, y1: 10, xl: 'caminho da reação →', yl: 'energia', xt: [], curves });
      line(g.fx(.2), g.fy(Er), g.fx(2.8), g.fy(Er), 'rgba(232,237,247,.4)', 1, [4, 4]); line(g.fx(7.2), g.fy(Ep), g.fx(9.8), g.fy(Ep), 'rgba(232,237,247,.4)', 1, [4, 4]);
      tx('reagentes', g.fx(1.4), g.fy(Er) + 15, { s: 12, c: C.dim }); tx('produtos', g.fx(8.4), g.fy(Ep) + 15, { s: 12, c: C.dim });
      const xm = g.fx(5), sp = m === 2 ? 14 : 0;
      if (show(0)) { enz_medida(xm - sp, g.fy(Er), g.fy(sem(5)), '#C9D2E6'); tx('Ea sem enzima', xm - sp - 10, g.fy(sem(5)) + 4, { s: 13, w: 600, c: '#C9D2E6', a: 'right' }); }
      if (show(1)) { enz_medida(xm + sp, g.fy(Er), g.fy(com(5)), ENZ); tx('Ea com enzima', xm + sp + 10, g.fy(com(5)) + (m === 2 ? -2 : 4), { s: 13, w: 600, c: light(ENZ, .4), a: 'left' }); }
      const xd = g.fx(9.3); enz_medida(xd, g.fy(Er), g.fy(Ep), AMB); tx('ΔG', xd - 8, g.fy((Er + Ep) / 2), { s: 13, w: 700, c: AMB, a: 'right' });
      // uma "pedra" (molécula) sobe e desce o morro
      const f = m === 0 ? sem : com, v = .3 + 9.4 * ((t * .16) % 1); circ(g.fx(v), g.fy(f(v)) - 8, 6, SUB, 'rgba(11,15,28,.6)', 1.2);
      cap(m === 0 ? 'Sem enzima, poucas moléculas têm energia para vencer o morro: a reação é <b>lenta</b>.' : m === 1 ? 'Com enzima, o morro é mais baixo e a reação fica <b>muito mais rápida</b>, na mesma temperatura.' : 'O pico com enzima é <b>mais baixo</b>, mas reagentes e produtos ficam <b>no mesmo nível</b>: o ΔG não muda.');
    }
  });

  // temperatura: duas enzimas (humana e de bactéria de fonte termal) no mesmo gráfico
  const TEMP = [{ n: 'enzima humana', o: 37, w: 19, d: 8.5, c: ENZ }, { n: 'enzima de bactéria termófila', o: 72, w: 20, d: 7, c: AMB }];
  const tAct = (e, x) => 100 * Math.exp(-(((x - e.o) / (x <= e.o ? e.w : e.d)) ** 2) * (x <= e.o ? 1.2 : 1.3));
  def('enz', 'temperatura', {
    t: 'Temperatura', s: 'temperatura ótima e desnaturação', c: ENZ, loc: 'atividade × temperatura',
    alt: 'Gráfico da atividade de duas enzimas conforme a temperatura: cada curva sobe até um pico e depois cai de repente',
    d: `<p>Aquecer acelera as reações: as moléculas se movem mais e se encontram mais vezes. Por isso a atividade da enzima <b>sobe</b> com a temperatura até um ponto, a <b>temperatura ótima</b> (perto de <span class="q">37 °C</span> para a maioria das enzimas humanas).</p><p>Acima dela a atividade <b>despenca</b>: o calor rompe as ligações fracas que mantêm a forma da proteína, e o sítio ativo se deforma. É a <b>desnaturação</b>, em geral <b>irreversível</b>, como a clara do ovo que endurece. No frio é diferente: a enzima fica <b>lenta</b>, mas não se desfaz, e volta a funcionar quando a temperatura sobe.</p>`,
    kv: [['Ótima (humanas)', '~37 °C'], ['Ótima (Taq polimerase)', '~72 °C'], ['Frio', 'reação lenta, reversível'], ['Calor excessivo', 'desnaturação']],
    enem: `Leia o gráfico em forma de "morro assimétrico": sobe devagar e cai de repente. Frio <b>inibe</b> (reversível; por isso a geladeira conserva alimentos); calor excessivo <b>desnatura</b> (irreversível; por isso febre muito alta é perigosa). Bactérias de fontes termais, como <i>Thermus aquaticus</i>, têm enzimas que funcionam perto de 70 °C: uma delas, a Taq polimerase, é usada no PCR.`,
    links: [L_PROT, LK.dna],
    ctl: { l: 'Temperatura', min: 0, max: 100, step: 1, v: 37, f: v => v + ' °C', rate: () => 1 },
    still: 1,
    drag(x, y, S) { return S.inv ? S.inv(x) : null; },
    draw(t, S) {
      const T0 = S.v, side = !NAR, G = enz_caixa(side ? .7 : 1, 8);
      const g = graph(G, { x0: 0, x1: 100, y0: 0, y1: 115, xl: 'temperatura (°C)', yl: 'atividade', xt: [[0, '0'], [20, '20'], [40, '40'], [60, '60'], [80, '80'], [100, '100']], curves: TEMP.map(e => ({ f: x => tAct(e, x), c: e.c, lw: 3 })) });
      S.inv = g.inv;
      TEMP.forEach((e, i) => { enz_area(g, x => tAct(e, x), 0, 100, 0, rgba(e.c, .08)); tx(i ? 'termófila' : 'humana', g.fx(e.o), g.fy(100) - 12, { s: 13, w: 600, c: e.c }); });
      line(g.fx(T0), g.fy(0), g.fx(T0), g.fy(112), C.txt, 1.5, [5, 4]);
      TEMP.forEach(e => marker(g.fx(T0), g.fy(tAct(e, T0)), e.c));
      // a enzima humana na temperatura escolhida
      const e = TEMP[0], den = T0 > e.o + 4 ? ss((T0 - e.o - 4) / 14) : 0, a = tAct(e, T0) / 100;
      if (side) {
        const A = area(), ex = A.x0 + A.w * .86, ey = A.cy + 20, s = Math.min(A.w * .07, 54);
        enz_corpo(ex, ey, s, { shape: 'tri', den, t });
        if (den < .6) { const j = .5 + 2.5 * a; enz_peca(ex + Math.sin(t * j * 2) * s * .9 * (1 - den), ey - s * 2 + Math.cos(t * j * 1.6) * s * .2, s * .9, 'tri', SUB); }
        tx('enzima humana', ex, ey - s * 2.8, { s: 13, w: 600, c: ENZ });
        tx(den > .5 ? 'desnaturada' : T0 < e.o - 15 ? 'lenta (frio)' : Math.abs(T0 - e.o) <= 4 ? 'no ótimo' : 'ativa', ex, ey + s * 1.4, { s: 14, w: 700, f: FH, c: den > .5 ? INI : C.txt });
      }
      const h = Math.round(tAct(TEMP[0], T0)), b = Math.round(tAct(TEMP[1], T0));
      cap(`<b>${T0} °C</b>: enzima humana com <b>${h}%</b> da atividade máxima; termófila com <b>${b}%</b>. ${T0 >= 80 ? 'As duas estão desnaturando.' : T0 > 45 ? (b >= 80 ? 'A humana já <b>desnaturou</b>; a termófila está perto do seu ótimo.' : 'A humana já <b>desnaturou</b>; a termófila ainda está abaixo do seu ótimo.') : T0 < 25 ? 'Frio: as reações ficam <b>lentas</b>, mas as enzimas continuam inteiras.' : ''} Arraste no gráfico.`);
    }
  });

  const PH = [{ n: 'pepsina', o: 2, w: 1.1, c: '#FF8A5C', l: 'estômago' }, { n: 'amilase salivar', o: 6.8, w: 1.1, c: SUB, l: 'boca' }, { n: 'tripsina', o: 8, w: 1.15, c: ALO, l: 'intestino delgado' }];
  const pAct = (e, p) => 100 * Math.exp(-(((p - e.o) / e.w) ** 2));
  def('enz', 'ph', {
    t: 'pH', s: 'cada enzima tem o seu pH ótimo', c: ENZ, loc: 'atividade × pH',
    alt: 'Gráfico da atividade de três enzimas digestivas conforme o pH: pepsina com pico em pH 2, amilase salivar perto de 7 e tripsina perto de 8',
    d: `<p>O <b>pH</b> (acidez do meio) também mexe com a forma da enzima: muda as cargas elétricas dos aminoácidos do sítio ativo e das ligações que mantêm a proteína dobrada. Cada enzima tem um <b>pH ótimo</b>, que combina com o lugar onde ela trabalha.</p><p>A <b>pepsina</b> digere proteínas no estômago, muito ácido (pH perto de <span class="q">2</span>). A <b>amilase salivar</b> começa a digestão do amido na boca (pH perto de <span class="q">7</span>). A <b>tripsina</b> age no intestino delgado, levemente básico (pH perto de <span class="q">8</span>).</p>`,
    kv: [['Pepsina', 'pH ~2 · estômago'], ['Amilase salivar', 'pH ~6,8 · boca'], ['Tripsina', 'pH ~8 · intestino'], ['Fora do ótimo', 'atividade cai']],
    enem: `A amilase salivar quase para de agir quando chega ao estômago, por causa da acidez; a pepsina, por sua vez, não funciona no intestino. Gráficos com três "sinos" em posições diferentes do eixo do pH costumam pedir para associar cada curva ao órgão do sistema digestório.`,
    links: [L_PROT, LK.biom],
    ctl: { l: 'pH do meio', min: 0, max: 14, step: .1, v: 2, f: v => nbr(v, 1), rate: () => 1 },
    still: 1,
    drag(x, y, S) { return S.inv ? S.inv(x) : null; },
    draw(t, S) {
      const p = S.v, G = enz_caixa(1, 22);
      const g = graph(G, { x0: 0, x1: 14, y0: 0, y1: 118, xl: 'pH', yl: 'atividade', xt: [0, 2, 4, 6, 8, 10, 12, 14].map(v => [v, String(v)]), curves: PH.map(e => ({ f: x => pAct(e, x), c: e.c, lw: 3 })) });
      S.inv = g.inv;
      const gr = X.createLinearGradient(G.x0, 0, G.x1, 0); gr.addColorStop(0, 'rgba(255,107,125,.45)'); gr.addColorStop(.5, 'rgba(127,224,162,.3)'); gr.addColorStop(1, 'rgba(154,107,255,.45)');
      X.fillStyle = gr; X.fillRect(G.x0 + 1, G.y1 - 6, G.w - 2, 5);
      tx('ácido', G.x0 + 8, G.y1 - 16, { s: 12, c: C.dim, a: 'left' }); tx('básico', G.x1 - 8, G.y1 - 16, { s: 12, c: C.dim, a: 'right' });
      PH.forEach((e, i) => tx(e.n, g.fx(e.o) + (i === 1 ? -14 : i === 2 ? 22 : 0), g.fy(100) - 12 - (i === 2 ? 14 : i === 1 && NAR ? 30 : 0), { s: NAR ? 12 : 13, w: 600, c: e.c, a: i === 1 ? 'right' : i === 2 ? 'left' : 'center' }));
      line(g.fx(p), g.fy(0), g.fx(p), g.fy(115), C.txt, 1.5, [5, 4]);
      PH.forEach(e => marker(g.fx(p), g.fy(pAct(e, p)), e.c));
      const r = PH.map(e => [e, Math.round(pAct(e, p))]), b = r.reduce((a, x) => x[1] > a[1] ? x : a);
      cap(`<b>pH ${nbr(p, 1)}</b>: ${r.map(([e, a]) => `${e.n} <b>${a}%</b>`).join(' · ')}. ${b[1] > 50 ? 'Quem mais trabalha aqui é a <b>' + b[0].n + '</b> (' + b[0].l + ').' : 'Nenhuma das três funciona bem nesse pH.'}`);
    }
  });

  def('enz', 'inibicao', {
    t: 'Inibição competitiva e não competitiva', s: 'quando outra molécula atrapalha', c: ENZ, loc: 'velocidade × substrato',
    alt: 'Gráfico da velocidade da reação conforme a quantidade de substrato, sem inibidor, com inibidor competitivo e com inibidor não competitivo, ao lado da enzima com o inibidor ligado',
    d: `<p><b>Inibidores</b> são moléculas que diminuem a atividade de uma enzima. O <b>inibidor competitivo</b> se parece com o substrato e ocupa o <b>sítio ativo</b>: os dois disputam o mesmo lugar. Aumentando a quantidade de substrato, ele ganha a disputa, e a reação volta a atingir a velocidade máxima.</p><p>O <b>inibidor não competitivo</b> se liga a <b>outro ponto</b> da enzima e altera a forma do sítio ativo. Aí não adianta pôr mais substrato: a velocidade máxima fica <b>menor</b>. Muitos remédios e venenos agem como inibidores de enzimas.</p>`,
    kv: [['Competitivo', 'disputa o sítio ativo'], ['Mais substrato', 'vence o competitivo'], ['Não competitivo', 'liga-se a outro sítio'], ['Velocidade máxima', 'cai só no não competitivo']],
    enem: `Exemplo clássico: as <b>sulfas</b> (sulfonamidas) se parecem com o PABA, que as bactérias usam para fazer ácido fólico, e competem pelo sítio ativo da enzima bacteriana: <b>inibição competitiva</b>. Nós não fabricamos ácido fólico (ele vem da dieta), por isso a sulfa atinge a bactéria e não as nossas células. Metais pesados, como mercúrio e chumbo, se ligam a grupos –SH (enxofre) fora do sítio ativo e mudam a forma da enzima: agem como inibidores <b>não competitivos</b> e, muitas vezes, <b>irreversíveis</b>. Pista no gráfico: se a curva com inibidor <b>alcança</b> a mesma velocidade máxima com muito substrato, é competitivo.`,
    links: [L_ENZ, LK.amino],
    ctl: escolha('Inibidor', ['nenhum', 'competitivo', 'não competitivo'], 7),
    draw(t, S) {
      const m = Math.round(S.v), V = 100, K = 1.2;
      const vel = (i, s) => i === 0 ? V * s / (K + s) : i === 1 ? V * s / (K * 5 + s) : V * .45 * s / (K + s);
      const side = !NAR, A = area();
      const G = side ? enz_caixa(.62, 8) : { x0: A.x0 + 34, y0: A.y0 + A.h * .42, x1: A.x1 - 8, y1: A.y1 - 40 }; G.w = G.x1 - G.x0; G.h = G.y1 - G.y0;
      const curves = [{ f: s => vel(0, s), c: '#C9D2E6', lw: 2, dash: m ? [6, 4] : null }]; if (m) curves.push({ f: s => vel(m, s), c: m === 1 ? INI : ALO, lw: 3 });
      const g = graph(G, { x0: 0, x1: 20, y0: 0, y1: 112, xl: 'quantidade de substrato', yl: 'velocidade', xt: [[0, '0'], [10, '10'], [20, '20']], curves });
      line(G.x0, g.fy(V), G.x1, g.fy(V), 'rgba(232,237,247,.35)', 1, [3, 4]); tx('velocidade máxima', G.x1 - 6, g.fy(V) - 11, { s: 12, c: C.dim, a: 'right' });
      if (m) tx('tracejada: sem inibidor', G.x1 - 6, g.fy(V * (m === 1 ? .55 : .25)) + (m === 1 ? 26 : -40), { s: 12, c: C.dim, a: 'right' });
      // ponto que percorre a curva: mais e mais substrato
      const sv = 20 * ((t * .07) % 1); marker(g.fx(sv), g.fy(vel(m, sv)), m === 0 ? '#C9D2E6' : m === 1 ? INI : ALO);
      // a enzima
      const s = side ? Math.min(A.w * .07, 56) : Math.min(A.h * .15, 34), ex = side ? A.x0 + A.w * .84 : A.cx, ey = side ? A.cy + 10 : A.y0 + s * 2.4, top = ey - s * .95;
      enz_corpo(ex, ey, s, { shape: 'tri', alo: m === 2 ? 1 : 0, aloSite: true });
      const ganha = m === 1 && ((t * .5) % 2) > 1.2;   // de vez em quando o substrato vence a disputa
      if (m === 1 && !ganha) { enz_peca(ex, top + s * .06, s, 'ini', INI); enz_peca(ex - s * 1.8, top - s * .5 + Math.sin(t * 2) * 4, s * .8, 'tri', SUB); }
      else {
        enz_peca(ex + (m === 2 ? s * .1 : 0), top + s * .06 + (m === 2 ? -s * .3 : 0), s, 'tri', SUB, m === 2 ? .3 : 0);
        if (m === 1) enz_peca(ex + s * 1.8, top - s * .4 + Math.cos(t * 2) * 4, s * .8, 'ini', INI);
      }
      if (m === 2) { circ(ex + s * .62, ey + s * .55, s * .19, ALO, 'rgba(11,15,28,.6)', 1); }
      if (m === 1) enz_pill(side ? 'inibidor no sítio ativo' : 'inibidor competitivo', ex, ey + s * 1.45, INI);
      if (m === 2) enz_pill(side ? 'inibidor em outro sítio' : 'inibidor em outro sítio', ex, ey + s * 1.45, ALO);
      if (m !== 1 || ganha) enz_pill('substrato', ex - s * 1.4, top - s * .9, SUB, 'right');
      cap(m === 0 ? 'Sem inibidor: mais substrato, mais velocidade, até a enzima trabalhar no máximo.' : m === 1 ? '<b>Competitivo</b> (vermelho): com muito substrato a curva <b>alcança</b> a velocidade máxima, porque o substrato vence a disputa pelo sítio ativo.' : '<b>Não competitivo</b> (azul): o inibidor deforma o sítio ativo a partir de outro ponto; mesmo com muito substrato a curva <b>não alcança</b> a máxima.');
    }
  });

  // ================= VITAMINAS =================
  const VIT = {
    A: { n: 'A', q: 'retinol', sol: 'lipo', f: 'visão com pouca luz (forma o pigmento da retina), pele e mucosas, defesa do corpo', fa: 'cegueira noturna e olho seco (xeroftalmia)', fo: 'fígado, gema de ovo, leite; betacaroteno (que o corpo transforma em vitamina A) na cenoura, abóbora, manga e folhas verde-escuras', c: '#FF9A3C' },
    D: { n: 'D', q: 'calciferol', sol: 'lipo', f: 'absorção de cálcio e fósforo no intestino: ossos e dentes', fa: 'raquitismo em crianças; osteomalácia em adultos', fo: 'produzida na própria pele exposta ao sol; peixes gordurosos (sardinha, salmão), gema de ovo, fígado', c: '#F7C13B' },
    E: { n: 'E', q: 'tocoferol', sol: 'lipo', f: 'antioxidante: protege as membranas das células', fa: 'rara; problemas nos nervos e músculos', fo: 'óleos vegetais, castanhas, sementes', c: '#C8E07A' },
    K: { n: 'K', q: 'filoquinona', sol: 'lipo', f: 'coagulação do sangue', fa: 'sangramentos e manchas roxas com facilidade', fo: 'folhas verde-escuras (couve, espinafre, brócolis); bactérias do intestino também produzem', c: '#3FBF6A' },
    C: { n: 'C', q: 'ácido ascórbico', sol: 'hidro', f: 'formação do colágeno (pele, gengiva, vasos, cicatrização); antioxidante; ajuda a absorver ferro', fa: 'escorbuto', fo: 'acerola, goiaba, caju, laranja, limão, pimentão, couve', c: '#FF6B7D' },
    B1: { n: 'B1', q: 'tiamina', sol: 'hidro', f: 'aproveitamento da energia dos carboidratos; nervos e coração', fa: 'beribéri', fo: 'cereais integrais (a película do arroz), feijão e outras leguminosas, carne de porco', c: '#9DB8FF' },
    B9: { n: 'B9', q: 'ácido fólico', sol: 'hidro', f: 'divisão celular e formação do DNA; muito importante no início da gestação', fa: 'anemia; na gestação, falhas no fechamento do tubo neural do bebê', fo: 'folhas verde-escuras, feijão, lentilha, fígado', c: '#4FB8E6' },
    B12: { n: 'B12', q: 'cobalamina', sol: 'hidro', f: 'formação das hemácias e do DNA; sistema nervoso', fa: 'anemia perniciosa', fo: 'só alimentos de origem animal: carnes, fígado, peixes, ovos, leite', c: '#C77DFF' }
  };
  const VK = ['A', 'D', 'E', 'K', 'C', 'B1', 'B9', 'B12'];
  // ícones de alimentos desenhados aqui (sem imagens externas)
  function vit_alimento(k, x, y, r, t) {
    X.save(); X.translate(x, y); const L = c => { X.fillStyle = c; X.fill(); X.strokeStyle = 'rgba(11,15,28,.55)'; X.lineWidth = 1; X.stroke(); };
    switch (k) {
      case 'laranja': X.beginPath(); X.arc(0, 0, r, 0, TAU); L('#FF9A3C'); circ(r * .1, -r, r * .16, '#3FBF6A'); break;
      case 'acerola': for (const [a, b] of [[-.45, .15], [.42, .22], [0, -.35]]) { X.beginPath(); X.arc(a * r, b * r, r * .5, 0, TAU); L('#E0364A'); } break;
      case 'peixe': X.beginPath(); X.ellipse(-r * .15, 0, r * .85, r * .45, 0, 0, TAU); L('#9DB8FF'); X.beginPath(); X.moveTo(r * .55, 0); X.lineTo(r * 1.05, -r * .42); X.lineTo(r * 1.05, r * .42); X.closePath(); L('#9DB8FF'); circ(-r * .62, -r * .08, r * .08, '#0B0F1C'); break;
      case 'ovo': X.beginPath(); X.ellipse(0, 0, r, r * .8, 0, 0, TAU); L('#F3EFE6'); X.beginPath(); X.arc(r * .05, 0, r * .4, 0, TAU); L('#F7C13B'); break;
      case 'sol': circ(0, 0, r * .5, '#FFC53D'); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + t * .3; line(Math.cos(a) * r * .66, Math.sin(a) * r * .66, Math.cos(a) * r, Math.sin(a) * r, '#FFC53D', 2.5); } break;
      case 'cenoura': X.beginPath(); X.moveTo(-r * .38, -r * .55); X.lineTo(r * .38, -r * .55); X.lineTo(0, r); X.closePath(); L('#FF8A2A'); for (const a of [-.45, 0, .45]) line(0, -r * .55, Math.sin(a) * r * .5, -r * 1.05, '#3FBF6A', 3); break;
      case 'figado': X.beginPath(); X.ellipse(0, 0, r, r * .6, -.2, 0, TAU); L('#8E2F3B'); break;
      case 'folha': X.beginPath(); X.ellipse(0, 0, r * .5, r, .5, 0, TAU); L('#2A9450'); line(-r * .4, r * .7, r * .4, -r * .7, '#7FE0A2', 1.2); break;
      case 'arroz': X.beginPath(); X.arc(0, r * .05, r * .95, 0, PI); X.closePath(); L('#5B6C99'); for (let i = 0; i < 9; i++) { X.beginPath(); X.ellipse(-r * .55 + (i % 5) * r * .27, -r * .05 - (i > 4 ? r * .2 : 0), r * .1, r * .2, .6, 0, TAU); L('#C9A86A'); } break;
      case 'feijao': for (let i = 0; i < 5; i++) { X.beginPath(); X.ellipse((i - 2) * r * .38, Math.sin(i * 2) * r * .22, r * .22, r * .32, .3 * i, 0, TAU); L('#7A3424'); } break;
      case 'carne': X.beginPath(); X.ellipse(0, 0, r, r * .68, .2, 0, TAU); L('#D7303B'); X.beginPath(); X.ellipse(r * .35, -r * .1, r * .26, r * .18, 0, 0, TAU); L('#F3EFE6'); break;
      case 'leite': rr(-r * .5, -r * .85, r, r * 1.7, 4, '#F3EFE6', 'rgba(11,15,28,.55)', 1); rr(-r * .5, -r * .2, r, r * .5, 0, '#4B7BFF'); break;
    }
    X.restore();
  }
  const FOOD = { A: ['figado', 'cenoura', 'ovo'], D: ['sol', 'peixe', 'ovo'], C: ['acerola', 'laranja', 'folha'], B1: ['arroz', 'feijao', 'carne'], B12: ['carne', 'peixe', 'leite'] };
  const FN = { laranja: 'laranja', acerola: 'acerola', peixe: 'peixe', ovo: 'ovo', sol: 'sol na pele', cenoura: 'cenoura', figado: 'fígado', folha: 'couve', arroz: 'arroz integral', feijao: 'feijão', carne: 'carne', leite: 'leite' };

  def('vit', 'tipos', {
    t: 'Hidrossolúveis e lipossolúveis', s: 'onde cada vitamina se dissolve', c: VITC, loc: 'vitaminas · água e óleo',
    alt: 'Dois recipientes, um com água e outro com óleo; as vitaminas C e do complexo B ficam na água e as vitaminas A, D, E e K ficam no óleo',
    d: `<p><b>Vitaminas</b> são substâncias orgânicas de que o corpo precisa em <b>quantidades pequenas</b> e que, em geral, não consegue fabricar: vêm da alimentação. Elas não fornecem energia nem constroem tecidos; muitas funcionam como <b>coenzimas</b>, ajudantes das enzimas.</p><p>As <b>lipossolúveis</b> (A, D, E e K) se dissolvem em gordura: são absorvidas junto com ela e ficam <b>armazenadas</b> no fígado e no tecido adiposo, por isso o excesso pode se acumular e intoxicar (hipervitaminose). As <b>hidrossolúveis</b> (C e as do complexo B) se dissolvem em água: o excesso sai pela <b>urina</b> e é preciso consumi-las com frequência. A B12 é a exceção: o fígado guarda reserva para anos.</p>`,
    kv: [['Lipossolúveis', 'A, D, E, K'], ['Hidrossolúveis', 'C e complexo B'], ['Excesso de lipossolúvel', 'acumula'], ['Excesso de hidrossolúvel', 'sai na urina']],
    enem: `Decore o "<b>ADEK</b>": as quatro lipossolúveis. Questões ligam isso a dietas sem gordura nenhuma (atrapalham a absorção de A, D, E e K) e ao risco de tomar vitamina A ou D por conta própria. Lembre também que a vitamina D é a única que o corpo produz em boa quantidade, na pele, com a luz do sol.`,
    links: [['Enzimas', '#enz/encaixe'], LK.tri],
    ctl: escolha('Vitamina', VK.map(k => 'vitamina ' + VIT[k].n), 4),
    draw(t, S) {
      const A = area(), v = VIT[VK[Math.round(S.v)]], key = VK[Math.round(S.v)];
      const bw = NAR ? (A.w - 16) / 2 : Math.min(A.w * .32, 320), bh = Math.min(A.h - 60, NAR ? 250 : 340), y0 = A.y0 + (NAR ? 40 : 22);
      const xa = NAR ? A.x0 : A.cx - bw - 24, xb = NAR ? A.x0 + bw + 16 : A.cx + 24;
      [[xa, 'água', '#2A9FC9', 'hidrossolúveis', 'hidro'], [xb, 'óleo', '#F2D24B', 'lipossolúveis', 'lipo']].forEach(([x, nome, cor, cat, sol]) => {
        rr(x, y0, bw, bh, 12, null, 'rgba(232,237,247,.5)', 1.5); const lv = y0 + bh * .2;
        rr(x + 2, lv, bw - 4, y0 + bh - lv - 2, 10, rgba(cor, .24));
        tx(nome, x + bw / 2, y0 + 12, { s: 13, c: C.dim });
        tx(cat, x + bw / 2, y0 + bh + 16, { s: 13, w: 700, c: sol === 'lipo' ? '#F2D24B' : '#7FD4F0' });
        const ks = VK.filter(k => VIT[k].sol === sol), cols = 2, r = NAR ? 18 : 26;
        ks.forEach((k, j) => {
          const on = k === key, px = x + bw * ((j % cols) + .5) / cols, py = lv + (y0 + bh - lv) * (Math.floor(j / cols) + .5) / Math.ceil(ks.length / cols), wob = on ? Math.sin(t * 3) * 3 : Math.sin(t + j) * 1.5;
          circ(px, py + wob, r + (on ? 3 : 0), on ? VIT[k].c : rgba(VIT[k].c, .4), on ? '#fff' : 'rgba(11,15,28,.5)', on ? 2.5 : 1);
          tx(VIT[k].n, px, py + wob + .5, { s: NAR ? 13 : 16, w: 700, c: '#0B0F1C', bg: false });
        });
      });
      cap(`<b>Vitamina ${v.n}</b> (${v.q}), <b>${v.sol === 'lipo' ? 'lipossolúvel' : 'hidrossolúvel'}</b>: ${v.f}. ${v.sol === 'lipo' ? 'Fica guardada no fígado e na gordura.' : key === 'B12' ? 'O excesso sai na urina, mas o fígado guarda reserva.' : 'O excesso sai na urina.'}`);
    }
  });

  // avitaminoses: sintoma desenhado → vitamina que falta → fontes. A resposta aparece depois de uma pausa,
  // para o aluno tentar lembrar antes (prática de recuperação).
  const DOE = [['Escorbuto', 'C', 'gengivas que sangram, dentes moles, feridas que demoram a fechar'], ['Raquitismo', 'D', 'ossos fracos e deformados; nas crianças, pernas arqueadas'], ['Cegueira noturna', 'A', 'dificuldade de enxergar com pouca luz'], ['Beribéri', 'B1', 'fraqueza, formigamento, problemas nos nervos e no coração'], ['Anemia perniciosa', 'B12', 'poucas hemácias, grandes e imaturas; cansaço e formigamento']];
  function vit_sintoma(i, x, y, s, t) {
    X.save(); X.translate(x, y);
    if (i === 0) { X.beginPath(); X.arc(0, -s * .1, s * .8, PI * .05, PI * .95); X.lineTo(-s * .8, -s * .1); X.closePath(); X.fillStyle = '#F58FB0'; X.fill(); for (let j = 0; j < 6; j++) rr(-s * .66 + j * s * .22, -s * .14, s * .18, s * .44, 4, '#F3EFE6', 'rgba(11,15,28,.5)', 1); for (let j = 0; j < 5; j++) circ(-s * .45 + j * s * .22, s * .32 + fr(t * .4 + j * .21) * s * .45, s * .05, '#D7303B'); }
    else if (i === 1) { const b = .25 + Math.sin(t) * .04; for (const d of [-1, 1]) { X.beginPath(); X.moveTo(d * s * .2, -s * .8); X.quadraticCurveTo(d * s * (.2 + b * 2.2), 0, d * s * .2, s * .8); X.strokeStyle = '#F3EFE6'; X.lineWidth = s * .16; X.lineCap = 'round'; X.stroke(); circ(d * s * .2, -s * .8, s * .12, '#F3EFE6'); circ(d * s * .2, s * .8, s * .12, '#F3EFE6'); } }
    else if (i === 2) { ell(0, 0, s * .9, s * .5, 0, '#F3EFE6'); circ(0, 0, s * .35, '#4B7BFF'); circ(0, 0, s * .17, '#0B0F1C'); X.fillStyle = 'rgba(11,15,28,.6)'; X.fillRect(-s, -s, s * 2, s * 2); X.beginPath(); X.arc(s * .7, -s * .7, s * .28, PI * .55, PI * 1.6); X.arc(s * .8, -s * .78, s * .22, PI * 1.5, PI * .6, true); X.fillStyle = '#FFE1A6'; X.fill(); }
    else if (i === 3) { circ(0, -s * .55, s * .22, '#C9D2E6'); X.strokeStyle = '#C9D2E6'; X.lineWidth = s * .12; X.lineCap = 'round'; X.beginPath(); X.moveTo(0, -s * .3); X.lineTo(0, s * .3); X.moveTo(0, -s * .15); X.lineTo(-s * .4, s * .15); X.moveTo(0, -s * .15); X.lineTo(s * .42, s * .1 + Math.sin(t * 8) * s * .05); X.moveTo(0, s * .3); X.lineTo(-s * .25, s * .85); X.moveTo(0, s * .3); X.lineTo(s * .25, s * .85); X.stroke(); for (let j = 0; j < 4; j++) circ(s * .55 + Math.sin(t * 9 + j) * s * .06, s * .02 + j * s * .09, s * .035, AMB); }
    else { for (let j = 0; j < 7; j++) { const a = j / 7 * TAU + t * .2, d = s * (.25 + .45 * ((j * 37) % 7) / 7), big = j % 2 === 0; circ(Math.cos(a) * d, Math.sin(a) * d, s * (big ? .25 : .16), big ? '#B02A3A' : '#D7303B', 'rgba(11,15,28,.5)', 1); circ(Math.cos(a) * d, Math.sin(a) * d, s * (big ? .09 : .06), 'rgba(11,15,28,.25)'); } }
    X.restore();
  }
  def('vit', 'avitaminoses', {
    t: 'Avitaminoses', s: 'a doença, a vitamina que falta e onde encontrá-la', c: VITC, loc: 'carência de vitaminas',
    alt: 'Desenho do sinal de cada doença por falta de vitamina, a vitamina que falta e três alimentos que a contêm',
    d: `<p><b>Avitaminose</b> é a doença causada pela falta de uma vitamina. Várias foram descobertas por observação: marinheiros em longas viagens tinham <b>escorbuto</b> até levarem frutas cítricas a bordo; o <b>beribéri</b> se espalhou na Ásia quando o arroz passou a ser comido polido, sem a película rica em vitamina B1.</p><p>Na <b>anemia perniciosa</b>, a B12 até chega pela comida, mas não é absorvida: o estômago deixa de produzir o <b>fator intrínseco</b>, proteína necessária para absorver a vitamina B12 no intestino (em geral por uma doença autoimune). A falta de B12 na dieta causa uma anemia parecida. Por isso, quem não come nenhum alimento de origem animal precisa de B12 suplementada: as plantas não a fornecem.</p>`,
    kv: [['Escorbuto', 'vitamina C'], ['Raquitismo', 'vitamina D'], ['Cegueira noturna', 'vitamina A'], ['Beribéri', 'vitamina B1'], ['Anemia perniciosa', 'vitamina B12']],
    enem: `A associação que mais cai: <b>escorbuto → C</b>, <b>raquitismo → D</b>, <b>cegueira noturna → A</b>, <b>beribéri → B1</b>, <b>anemia perniciosa → B12</b>. O raquitismo aparece ligado à falta de <b>sol</b> (crianças sem exposição à luz solar) e o escorbuto, à falta de alimentos frescos. Antes de a resposta aparecer, tente lembrar qual vitamina falta.`,
    links: [['Hidro e lipossolúveis', '#vit/tipos'], LK.biom],
    ctl: escolha('Doença', DOE.map(d => d[0]), 8),
    still: 4,
    init(S) { S.vEnt = null; },
    draw(t, S) {
      const i = Math.round(S.v), d = DOE[i], v = VIT[d[1]], A = area();
      if (S.vEnt !== i) { S.vEnt = i; S.t0 = t; }   // a resposta aparece 2,5 s depois de trocar de doença
      const rev = ss(seg(t - S.t0, 2.5, 3.2)) || (S.paused ? 1 : 0);
      const s = NAR ? Math.min(34, A.h * .13) : Math.min(A.h * .18, 66), cx = NAR ? A.cx : A.x0 + A.w * .26, cy = NAR ? A.y0 + s * 1.55 : A.cy - 10;
      circ(cx, cy, s * 1.35, 'rgba(255,255,255,.04)', 'rgba(232,237,247,.2)', 1); vit_sintoma(i, cx, cy, s, t);
      tx(d[0], cx, cy + s * 1.35 + 18, { s: NAR ? 15 : 17, w: 700, f: FH, c: C.txt });
      const bx = NAR ? A.cx : A.x0 + A.w * .68, by = NAR ? cy + s * 1.35 + 66 : A.cy - 60, br = NAR ? 22 : 28;
      if (!NAR) arrow(cx + s * 1.55, cy, bx - br - 12, by + 4, 'rgba(232,237,247,.4)', 1.5);
      if (rev < .02) { circ(bx, by, br, 'rgba(255,255,255,.06)', 'rgba(232,237,247,.45)', 2); tx('?', bx, by + 1, { s: NAR ? 18 : 22, w: 700, c: AMB, bg: false }); tx('qual vitamina falta?', bx, by + br + 16, { s: 13, c: C.dim }); }
      else {
        X.save(); X.globalAlpha = rev; circ(bx, by, br, v.c, '#fff', 2); tx(v.n, bx, by + .5, { s: NAR ? 15 : 19, w: 700, c: '#0B0F1C', bg: false });
        tx('falta de vitamina ' + v.n, bx, by + br + 16, { s: NAR ? 13 : 14, w: 600, c: v.c });
        const fs = FOOD[d[1]], fr0 = NAR ? 15 : 20, fy = by + br + (NAR ? 58 : 72), gap = NAR ? Math.min(92, A.w / 3) : 100;
        fs.forEach((f, j) => { const fx = bx + (j - 1) * gap; vit_alimento(f, fx, fy, fr0, t); tx(FN[f], fx, fy + fr0 + 15, { s: 12, c: C.dim }); });
        X.restore();
      }
      cap(rev < .02 ? `<b>${d[0]}</b>: ${d[2]}. Qual vitamina está faltando? Pense antes de a resposta aparecer.` : `<b>${d[0]}</b> (${d[2]}): falta de <b>vitamina ${v.n}</b> (${v.q}). Fontes: ${v.fo}.`);
    }
  });
})();
