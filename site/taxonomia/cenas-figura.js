/* LAB Taxonomia: 7 cenas com figura de IA interativa (Prometeu), usando figura-ia.js v2 (Biologia molecular).
   A figura aparece por padrão; o botão "Ver em 3D" mostra a cena com as peças 3D do Martin (taxo3d.js e cenas3d.js)
   e "Ver figura" volta. Sem WebGL, o botão leva ao desenho 2D antigo (plano B). O .js de cada imagem só entra quando
   a cena abre. Cada cena troca só o visual (draw) da rota que os cenas-*.js já registram: lição, cards ENEM e rota ficam. */
'use strict';
(function () {
  if (typeof SC === 'undefined' || !window.LAB_FIGIA) return;
  const MODULO = 'taxonomia';
  // ---------- infraestrutura comum: figura de IA por padrão, botão para alternar com o 3D ----------
  const TAU = Math.PI * 2;
  const RED = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const MASK = { miolo: .78, borda: .99 };
  const DICA = 'Toque nos pontos da figura para ver o que cada parte faz. Use + e - (ou a roda) para aproximar e os botões para trocar de vista.';
  const WEBGL = (() => { try { return !!document.createElement('canvas').getContext('webgl'); } catch (e) { return false; } })();
  const ICO3D = '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4 7.5v9L12 21l8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/></g></svg>';
  const ICOFIG = '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="M3.5 15l4.5-4 3.5 3 3-2.5 6 4.5"/></g></svg>';
  let btn = null, ativa = null, ultimo = 0;
  function estilo() {
    if (document.getElementById('fg-css')) return;
    const s = document.createElement('style'); s.id = 'fg-css';
    s.textContent = `.fg-modo{position:absolute;top:12px;right:12px;z-index:6;display:flex;align-items:center;gap:8px;min-height:44px;padding:0 16px;border-radius:999px;border:1px solid var(--amber,#FFB347);background:var(--pill,rgba(11,15,28,.88));color:var(--txt,#E8EDF7);font:600 14px/1 var(--f-title,inherit);cursor:pointer;-webkit-tap-highlight-color:transparent}
.fg-modo svg{width:20px;height:20px;flex:none}.fg-modo:hover{background:var(--panel-2,#1a2138)}.fg-modo:focus-visible{outline:2px solid var(--focus,#8FD8FF);outline-offset:2px}
.fg-modo[hidden]{display:none}
.tela.fg-fig .onde{display:none}.tela.fg-3d .onde{top:68px}
@media(max-width:699px){.fg-modo{top:8px;right:8px;min-height:44px;padding:0 14px;font-size:13px}.tela.fg-fig .tag,.tela.fg-3d .tag{max-width:calc(100% - 150px)}}`;
    document.head.appendChild(s);
  }
  function botao() {
    if (btn) return btn;
    estilo();
    btn = document.createElement('button'); btn.type = 'button'; btn.className = 'fg-modo'; btn.hidden = true;
    document.getElementById('cv').parentNode.appendChild(btn);
    btn.addEventListener('click', () => { if (ativa) ativa.alternar(); });
    // some sozinho quando a cena deixa de ser a atual (troca de tópico) ou deixa de chamar o desenho
    const cur = () => { const m = window.LAB_HISTO || window.LAB_TAXO; try { return m && m.estado().cur; } catch (e) { return null; } };
    setInterval(() => { if (btn.hidden) return; if ((ativa && cur() !== ativa.chave) || performance.now() - ultimo > 2500) { btn.hidden = true; btn.parentNode.classList.remove('fg-fig', 'fg-3d'); const ex = document.getElementById('extra'); if (ex) ex.style.display = ''; } }, 120);
    return btn;
  }
  // registra uma cena: chave da rota, nome para leitores de tela, vistas [id, nome, legenda], pontos [vista, id, cor, titulo, texto, x, y, zoom] e motion opcional
  function cena(chave, nome, vistas, pts, sobre, extra) {
    const o = SC[chave]; if (!o || !window.LAB_FIGIA) return;
    const pre = MODULO + '-' + chave.replace('/', '-') + '-';
    const hs = [];
    pts.forEach(p => { let h = hs.find(q => q.id === p[1]); if (!h) { h = { id: p[1], c: p[2], t: p[3], d: p[4], em: {}, z: p[7] || 2.4 }; hs.push(h); } h.em[p[0]] = [p[5], p[6]]; });
    const F = LAB_FIGIA({ nome, mask: MASK, vistas: vistas.map(v => Object.assign({ id: v[0], img: pre + v[0], nome: v[1] }, v[3] ? { recorte: v[3] } : {})), hs });
    const legenda = {}; vistas.forEach(v => { legenda[v[0]] = v[2]; });
    const orig = { draw: o.draw, init: o.init, sair: o.sair || o.sai };
    let modo = 'fig';
    const tl = () => document.getElementById('cv').parentNode;
    const quadro = () => {
      const b = botao(), t = tl(); ultimo = performance.now(); ativa = ctl; b.hidden = false;
      const rot = modo === 'fig' ? (WEBGL ? 'Ver em 3D' : 'Ver o desenho') : 'Ver figura';
      if (b.dataset.m !== modo) {
        b.dataset.m = modo; b.innerHTML = (modo === 'fig' ? ICO3D : ICOFIG) + '<span>' + rot + '</span>';
        b.setAttribute('aria-label', modo === 'fig' ? (WEBGL ? 'Ver esta cena em 3D' : 'Ver o desenho desta cena') : 'Voltar para a figura de IA');
      }
      t.classList.toggle('fg-fig', modo === 'fig'); t.classList.toggle('fg-3d', modo !== 'fig');
      const cw = document.getElementById('ctlR'), ex = document.getElementById('extra');
      if (cw && cw.parentNode) cw.parentNode.hidden = modo === 'fig' || !!o.noCtl;
      if (ex) ex.style.display = modo === 'fig' ? 'none' : '';
    };
    const ctl = {
      chave,
      alternar() {
        if (modo === 'fig') { modo = '3d'; F.fechar && F.fechar(); } else { modo = 'fig'; if (orig.sair) try { orig.sair.call(o); } catch (e) { console.error(e); } }
        btn.dataset.m = '';
      }
    };
    o.tip = DICA;
    o.init = function (S) { modo = 'fig'; if (btn) btn.dataset.m = ''; if (orig.init) return orig.init.call(this, S); };
    o.sair = function () { const ex = document.getElementById('extra'); if (ex) ex.style.display = ''; const r = orig.sair ? orig.sair.apply(this, arguments) : undefined; return r; };
    o.draw = function (t, S) {
      quadro();
      if (modo !== 'fig') return orig.draw.call(this, t, S);
      const nar = W < 600, x0 = nar ? 6 : 24, y0 = nar ? 54 : 60;
      const box = { x: x0, y: y0, w: W - 2 * x0, h: H - y0 - (nar ? 56 : 52) };
      const R = F.desenhar(X, box, { sobre: sobre ? R => sobre(R, X, t) : null });
      if (!R || !R.pronto) {   // enquanto a imagem carrega (ou se falhar), um aviso no palco
        const sz = nar ? 14 : 16; X.save(); X.font = `600 ${sz}px var(--f-title,'Space Grotesk',sans-serif)`; X.textAlign = 'center'; X.textBaseline = 'middle';
        X.fillStyle = 'rgba(232,237,247,.75)'; X.fillText('Carregando a figura', box.x + box.w / 2, box.y + box.h / 2); X.restore();
      }
      const L = legenda[F.vistaAtual]; cap(typeof L === 'function' ? L(t) : (L || ''));
    };
  }
  // ---------- ajudantes de motion ----------
  // pontos que andam por uma linha poligonal (em % da imagem), com brilho que sobe e desce; sem movimento, ficam parados
  function fluxo(R, X, pts, cor, n, t, vel, raio) {
    const P = pts.map(p => R.pt(p[0], p[1])); let L = 0; const seg = [];
    for (let i = 1; i < P.length; i++) { const d = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); seg.push(d); L += d; }
    X.save();
    for (let i = 0; i < n; i++) {
      const f = RED ? (i + .5) / n : (t * vel + i / n) % 1; let d = f * L, j = 0; while (j < seg.length - 1 && d > seg[j]) { d -= seg[j]; j++; }
      const u = seg[j] ? d / seg[j] : 0, x = P[j][0] + (P[j + 1][0] - P[j][0]) * u, y = P[j][1] + (P[j + 1][1] - P[j][1]) * u;
      X.globalAlpha = RED ? .85 : Math.sin(f * Math.PI) * .95; X.fillStyle = cor;
      X.shadowColor = cor; X.shadowBlur = 8; X.beginPath(); X.arc(x, y, raio * R.s, 0, TAU); X.fill();
    }
    X.restore();
  }
  // anel que pulsa em volta de um ponto (cor, fase de 0 a 1)
  function anel(R, X, x, y, cor, f, raio) {
    const p = R.pt(x, y); X.save(); X.strokeStyle = cor; X.lineWidth = 2.5; X.globalAlpha = RED ? .8 : (1 - f) * .9;
    X.beginPath(); X.arc(p[0], p[1], raio * R.s * (RED ? 1.4 : .7 + .9 * f), 0, TAU); X.stroke(); X.restore();
  }

  // retângulo arredondado em px (sem depender de roundRect)
  function rrect(X, x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); X.moveTo(x + r, y); X.arcTo(x + w, y, x + w, y + h, r); X.arcTo(x + w, y + h, x, y + h, r); X.arcTo(x, y + h, x, y, r); X.arcTo(x, y, x + w, y, r); X.closePath(); }
  // retângulo com cantos arredondados em coordenadas de % da imagem
  function caixa(R, X, b, r) {
    const p = R.pt(b[0], b[1]), q = R.pt(b[2], b[3]), rr = Math.min(r * R.s, (q[0] - p[0]) / 2, (q[1] - p[1]) / 2);
    X.beginPath(); X.moveTo(p[0] + rr, p[1]); X.arcTo(q[0], p[1], q[0], q[1], rr); X.arcTo(q[0], q[1], p[0], q[1], rr); X.arcTo(p[0], q[1], p[0], p[1], rr); X.arcTo(p[0], p[1], q[0], p[1], rr); X.closePath();
  }

  // ================= HISTÓRIA =================
  cena('historia/aristoteles', 'Os animais de Aristóteles', [
    ['a', 'Animais com e sem sangue', 'Aristóteles separou os animais com sangue dos animais sem sangue.'],
    ['b', 'Polvo e caramujo', 'Aristóteles os separou, a classificação atual os une.']
  ], [
    ['a', 'cav', '#F2B33D', 'Cavalo', 'Animal com sangue e com pelos, que dá à luz filhotes. Hoje o cavalo é um mamífero.', 52, 28, 2.2],
    ['a', 'ave', '#FF9F43', 'Ave', 'Animal com sangue que bota ovos. Aristóteles já via que as aves formam um grupo natural.', 20, 37, 2.8],
    ['a', 'pol', '#C9806A', 'Polvo', 'Para Aristóteles, animal sem sangue e de corpo mole. Hoje é um molusco, da classe dos cefalópodes.', 18, 80, 2.4],
    ['a', 'car', '#C9A06A', 'Caramujo', 'Animal sem sangue, de casca dura. Também é um molusco, da classe dos gastrópodes.', 52, 82, 2.8],
    ['a', 'abe', '#F2D45C', 'Abelha', 'Animal sem sangue, com pernas articuladas e asas. Hoje é um inseto, grupo dos artrópodes.', 84, 82, 3],
    ['b', 'pol2', '#C9806A', 'Polvo: animal "mole"', 'Tem corpo mole e nenhuma casca externa. O critério era a aparência e o modo de vida.', 26, 46, 2.4],
    ['b', 'car2', '#C9A06A', 'Caramujo: animal "de casca"', 'Tem concha dura. Aristóteles o pôs em outro grupo, embora polvo e caramujo sejam moluscos.', 72, 58, 2.4],
    ['b', 'ten', '#FFE1A6', 'Tentáculos e pé', 'O polvo anda com braços e o caramujo com um pé musculoso, partes do mesmo plano corporal dos moluscos.', 38, 72, 2.8]
  ]);

  cena('historia/lineu', 'Livro de Lineu e planta herborizada', [
    ['a', 'Livro e herbário', 'Um livro antigo de história natural e uma planta prensada de herbário.'],
    ['b', 'Exsicata de perto', 'A planta prensada e seca, fixada no papel.']
  ], [
    ['a', 'liv', '#D9B45A', 'Systema Naturae', 'Lineu publicou o Systema Naturae em 1735 e depois o reeditou. Reuniu animais, plantas e minerais em grupos dentro de grupos, de reino até espécie.', 25, 50, 2],
    ['a', 'exs', '#8FBF6A', 'Exsicata', 'Planta prensada, seca e colada em papel. Guardada em herbário com etiqueta, vira referência para reconhecer a espécie.', 72, 55, 2.2],
    ['b', 'flo', '#FFE1E6', 'Flor', 'Lineu agrupava as plantas pelo número e pela posição dos estames e do pistilo, as partes reprodutivas da flor.', 53, 11, 3],
    ['b', 'est', '#F2D45C', 'Estames', 'Os órgãos masculinos da flor produzem o pólen. Contar estames era a base do sistema de Lineu para as plantas.', 65, 40, 4],
    ['b', 'fol', '#8FBF6A', 'Folhas', 'Folhas compostas, com vários folíolos. Ajudam a reconhecer a espécie, mas Lineu preferia a flor.', 25, 42, 2.8],
    ['b', 'cau', '#C9A06A', 'Caule e papel', 'A planta é seca sob peso e presa ao papel por tiras. Assim dura séculos nas coleções.', 46, 62, 2.4]
  ]);

  // ================= CATEGORIAS =================
  // animais da imagem A, em % da imagem: caixa de cada um e a quais níveis pertence
  const BIC = {
    mar: [3, 16, 21, 37], tru: [2, 38, 21, 53], coe: [19, 18, 31, 56], cao: [34, 10, 53, 37], cav: [50, 2, 80, 45],
    lea: [8, 33, 50, 82], tig: [50, 27, 85, 82], gat: [29, 57, 58, 96], sap: [72, 36, 84, 52], bes: [83, 42, 97, 56]
  };
  const nivel = t => RED ? 5 : (Math.abs(Math.floor(t / 2.4)) || 0) % NIV.length;
  const NOMEA = { coe: 'coelho', cao: 'cão', cav: 'cavalo', lea: 'leão', tig: 'tigre', gat: 'gato' };
  const NIV = [
    ['Reino Animalia', 'todos os dez são animais', ['mar', 'tru', 'coe', 'cao', 'cav', 'lea', 'tig', 'gat', 'sap', 'bes'], '#8FD8FF'],
    ['Filo Chordata', 'o besouro sai, porque é um artrópode', ['mar', 'tru', 'coe', 'cao', 'cav', 'lea', 'tig', 'gat', 'sap'], '#6CCB7A'],
    ['Classe Mammalia', 'ave, peixe e sapo saem: só os mamíferos têm pelos e mamas', ['coe', 'cao', 'cav', 'lea', 'tig', 'gat'], '#F2D45C'],
    ['Ordem Carnivora', 'coelho e cavalo saem: são de outras ordens', ['cao', 'lea', 'tig', 'gat'], '#FF9F43'],
    ['Família Felidae', 'o cão sai: é da família dos canídeos', ['lea', 'tig', 'gat'], '#FF6B6B'],
    ['Gênero Felis, espécie Felis catus', 'só o gato doméstico fica', ['gat'], '#C77DFF']
  ];
  cena('categorias/hierarquia', 'Hierarquia taxonômica até Felis catus', [
    ['a', 'Dez animais', t => { const i = nivel(t); return '<b>' + NIV[i][0] + '</b>: ' + NIV[i][1] + '.'; }],
    ['b', 'Felis catus', 'O gato doméstico é a espécie Felis catus, do gênero Felis.']
  ], [
    ['a', 'bes', '#FF9F43', 'Besouro', 'É um animal, mas de outro filo: Arthropoda. Sai da hierarquia já no nível do filo.', 90, 49, 3],
    ['a', 'cav', '#F2B33D', 'Cavalo', 'Mamífero, mas da ordem Perissodactyla. Sai no nível da ordem.', 66, 14, 2.4],
    ['a', 'cao', '#E8C48A', 'Cão', 'Carnívoro como o gato, mas de outra família: Canidae. Sai no nível da família.', 44, 22, 2.8],
    ['a', 'lea', '#FF6B6B', 'Leão', 'Mesma família do gato (Felidae), mas outro gênero: Panthera (Panthera leo). Sai no nível do gênero.', 27, 52, 2.4],
    ['a', 'gat', '#C77DFF', 'Gato doméstico', 'Gênero Felis, espécie Felis catus. É o menor grupo da hierarquia.', 44, 77, 2.8],
    ['b', 'cab', '#C77DFF', 'Felis catus', 'Felis é o gênero, escrito com inicial maiúscula. catus é o epíteto da espécie, em minúscula. Os dois juntos são o nome da espécie.', 36, 18, 2.6],
    ['b', 'pel', '#F2D45C', 'Pelos', 'Pelos e glândulas mamárias são características da classe Mammalia.', 47, 55, 2.4],
    ['b', 'gar', '#FF6B6B', 'Patas com garras', 'Garras retráteis e dentes de carnívoro marcam a família Felidae.', 36, 92, 2.6],
    ['b', 'big', '#8FD8FF', 'Bigodes', 'Pelos longos e sensíveis ao toque. Ajudam o gato a se orientar no escuro.', 24, 30, 3]
  ], (R, X, t) => {
    if (R.vista !== 'a') return;
    const i = nivel(t), n = NIV[i], f = RED ? 1 : Math.min(1, (Math.abs(t) % 2.4) / .35);
    X.save(); X.lineJoin = 'round';
    const todos = n[2].length === Object.keys(BIC).length;
    if (todos) { caixa(R, X, [.5, .5, 99.5, 99.5], 1.6); X.globalAlpha = .08 * f; X.fillStyle = n[3]; X.fill(); X.globalAlpha = .95 * f; X.lineWidth = Math.max(2, R.s * .3); X.strokeStyle = n[3]; X.stroke(); }
    else Object.keys(BIC).forEach(k => {
      if (n[2].indexOf(k) < 0) return;
      caixa(R, X, BIC[k], 1.4); X.globalAlpha = .13 * f; X.fillStyle = n[3]; X.fill();
      X.globalAlpha = .95 * f; X.lineWidth = Math.max(2, R.s * .3); X.strokeStyle = n[3]; X.stroke();
      if (n[2].length <= 6 && NOMEA[k]) {   // nome do animal no canto da caixa
        const q = R.pt(BIC[k][0], BIC[k][1]), s2 = Math.max(12, Math.min(16, R.s * 1.5));
        X.font = `700 ${s2}px var(--f-title,'Space Grotesk',sans-serif)`; X.textBaseline = 'middle'; X.textAlign = 'left';
        const w2 = X.measureText(NOMEA[k]).width + 12; X.globalAlpha = .92 * f; X.fillStyle = 'rgba(11,15,28,.9)'; X.beginPath(); rrect(X, q[0] + 2, q[1] + 2, w2, s2 * 1.7, s2); X.fill();
        X.fillStyle = '#E8EDF7'; X.fillText(NOMEA[k], q[0] + 8, q[1] + 2 + s2 * .85);
      }
    });
    // etiqueta do nível, no canto da figura
    const fs = Math.max(14, Math.min(22, R.s * 2.2)), q = R.pt(2, 3);
    X.font = `700 ${fs}px var(--f-title,'Space Grotesk',sans-serif)`; X.textBaseline = 'middle'; X.textAlign = 'left';
    const w = X.measureText(n[0]).width + 24;
    X.globalAlpha = f; X.fillStyle = 'rgba(11,15,28,.92)'; X.beginPath(); rrect(X, q[0], q[1], w, fs * 1.9, fs); X.fill();
    X.lineWidth = 2; X.strokeStyle = n[3]; X.stroke(); X.fillStyle = '#E8EDF7'; X.fillText(n[0], q[0] + 12, q[1] + fs * .95);
    X.restore();
  });

  // ================= ESPÉCIE =================
  cena('especie/conceito', 'Égua, jumento e mula', [
    ['a', 'Égua, mula e jumento', 'Égua e jumento são espécies diferentes. O cruzamento gera a mula, quase sempre estéril.'],
    ['b', 'Rostos de perto', 'A mula tem traços dos dois pais.']
  ], [
    ['a', 'eg', '#C9804A', 'Égua', 'Equus caballus, com 64 cromossomos. É uma espécie biológica: seus indivíduos se cruzam entre si e têm filhotes férteis.', 16, 48, 2.2],
    ['a', 'mu', '#B08968', 'Mula', 'Híbrida de égua e jumento, com 63 cromossomos. Os cromossomos não formam pares na meiose, e por isso ela quase sempre é estéril.', 50, 52, 2.2],
    ['a', 'ju', '#9A9AA5', 'Jumento', 'Equus asinus, com 62 cromossomos. Cruza com a égua, mas o filhote não forma uma população que se reproduz.', 82, 52, 2.4],
    ['b', 'eg2', '#C9804A', 'Égua', 'Crina longa e orelhas curtas.', 20, 45, 2.4],
    ['b', 'ju2', '#9A9AA5', 'Jumento', 'Orelhas bem longas e pelagem cinza.', 55, 52, 2.4],
    ['b', 'mu2', '#B08968', 'Mula', 'Orelhas de tamanho intermediário: herdou traços da mãe e do pai.', 86, 45, 2.4]
  ]);

  // ================= NOMES =================
  const NOMES = [['Macaxeira', 'no Nordeste e no Norte'], ['Aipim', 'no Rio de Janeiro e na Bahia'], ['Mandioca', 'em boa parte do país']];
  cena('nomes/binomial', 'Mandioca e o nome científico', [
    ['a', 'Planta inteira', 'Muitos nomes populares, um só nome científico.'],
    ['b', 'Raiz e folhas', 'A raiz tuberosa é a parte que se come.']
  ], [
    ['a', 'fol', '#6CCB7A', 'Folha palmada', 'Folha dividida em cinco a sete lobos que saem do mesmo ponto, como dedos de uma mão.', 30, 25, 2.4],
    ['a', 'rai', '#C9A06A', 'Raízes tuberosas', 'Raízes engrossadas, que guardam amido. É a parte comestível.', 30, 77, 2.4],
    ['a', 'cau', '#B08968', 'Caule', 'Caule lenhoso e ereto. Pedaços dele plantados dão novas plantas.', 49, 52, 2.6],
    ['b', 'cor', '#FFE1A6', 'Raiz cortada', 'A polpa branca é rica em amido. Vira farinha, tapioca e polvilho.', 49, 66, 2.6],
    ['b', 'rai2', '#C9A06A', 'Casca marrom', 'A casca é grossa e escura, e é retirada antes de comer.', 55, 24, 2.4],
    ['b', 'fol2', '#6CCB7A', 'Folhas', 'Folhas palmadas, com lobos estreitos e pontudos.', 28, 70, 2.6]
  ], (R, X, t) => {
    if (R.vista !== 'a') return;
    const ciclo = 7, tt = RED ? 99 : t % ciclo, fs = Math.max(13, Math.min(20, R.s * 1.9));
    X.save(); X.textBaseline = 'middle'; X.textAlign = 'left';
    NOMES.forEach((n, i) => {
      const a = RED ? 1 : Math.max(0, Math.min(1, (tt - i * 1.2) / .5)); if (a <= 0) return;
      const p = R.pt(62, 12 + i * 13);
      X.font = `700 ${fs}px var(--f-title,'Space Grotesk',sans-serif)`; const w1 = X.measureText(n[0]).width;
      X.font = `500 ${Math.max(12, fs * .85)}px var(--f-title,'Space Grotesk',sans-serif)`; const w2 = X.measureText(' ' + n[1]).width;
      p[0] = Math.min(p[0], W - w1 - w2 - 24);
      X.globalAlpha = a; X.fillStyle = 'rgba(11,15,28,.88)'; X.beginPath(); rrect(X, p[0] - 8, p[1] - fs, w1 + w2 + 18, fs * 2, fs); X.fill();
      X.strokeStyle = '#FFB347'; X.lineWidth = 1.5; X.stroke();
      X.fillStyle = '#E8EDF7'; X.font = `700 ${fs}px var(--f-title,'Space Grotesk',sans-serif)`; X.fillText(n[0], p[0], p[1]);
      X.font = `500 ${Math.max(12, fs * .85)}px var(--f-title,'Space Grotesk',sans-serif)`; X.fillStyle = '#B8C2D9'; X.fillText(' ' + n[1], p[0] + w1, p[1]);
    });
    const a = RED ? 1 : Math.max(0, Math.min(1, (tt - 3.8) / .6));
    if (a > 0) {
      const p = R.pt(62, 12 + 3 * 13), tx = 'Manihot esculenta';
      X.font = `italic 700 ${fs * 1.1}px var(--f-title,'Space Grotesk',sans-serif)`; const w = X.measureText(tx).width;
      p[0] = Math.min(p[0], W - w - 24);
      X.globalAlpha = a; X.fillStyle = 'rgba(11,15,28,.92)'; X.beginPath(); rrect(X, p[0] - 8, p[1] - fs * 1.1, w + 16, fs * 2.2, fs); X.fill();
      X.strokeStyle = '#6CCB7A'; X.lineWidth = 2; X.stroke(); X.fillStyle = '#E8EDF7'; X.fillText(tx, p[0], p[1]);
    }
    X.restore();
  });

  // ================= CLADÍSTICA =================
  cena('cladistica/homologia', 'Ossos dos membros anteriores', [
    ['a', 'Cinco membros', 'Do braço humano à asa da ave, os mesmos ossos na mesma ordem.'],
    ['b', 'Humano e morcego', 'Cada osso tem a mesma cor no braço e na asa.']
  ], [
    ['a', 'hum', '#F2B33D', 'Braço humano', 'Úmero, rádio e ulna, ossos do punho e cinco dedos curtos, bons para agarrar e manipular.', 12, 30, 2.4],
    ['a', 'pat', '#6FA8FF', 'Pata de mamífero andador', 'Os mesmos ossos, com dedos curtos e garras. Serve para apoiar e correr, como no cão e no gato.', 26, 45, 2.4],
    ['a', 'mor', '#6CCB7A', 'Asa de morcego', 'Quatro dedos muito alongados sustentam a membrana da asa.', 45, 65, 2.2],
    ['a', 'bal', '#8FD8FF', 'Nadadeira de baleia', 'Os mesmos ossos do braço humano: úmero, rádio, ulna e falanges, adaptados para nadar. É uma estrutura homóloga.', 70, 55, 2.4],
    ['a', 'ave', '#FF9F43', 'Asa de ave', 'Alguns ossos do punho e da mão se fundiram para sustentar as penas.', 91, 45, 2.6],
    ['b', 'u1', '#F2B33D', 'Úmero do braço', 'O osso do braço é o úmero, o mesmo na asa do morcego.', 31, 12, 3],
    ['b', 'r1', '#6FA8FF', 'Rádio e ulna', 'No antebraço há dois ossos paralelos: rádio e ulna.', 22, 48, 2.6],
    ['b', 'd1', '#6CCB7A', 'Punho e dedos', 'Ossos pequenos do punho e cinco dedos.', 17, 78, 2.8],
    ['b', 'u2', '#F2B33D', 'Úmero da asa', 'O úmero também sustenta a asa do morcego, mas é mais fino.', 53, 14, 3],
    ['b', 'd2', '#6CCB7A', 'Dedos alongados', 'Os dedos foram muito alongados para sustentar a membrana da asa: mesma origem, outra função.', 82, 50, 2.6]
  ], (R, X) => {
    if (R.vista !== 'a' || R.k < .6) return;
    // nomes fixos embaixo de cada membro, porque os ossos são parecidos demais para distinguir de longe
    const fs = Math.max(13, Math.min(18, R.s * 1.7));
    X.save(); X.font = `700 ${fs}px var(--f-title,'Space Grotesk',sans-serif)`; X.textBaseline = 'middle'; X.textAlign = 'center';
    [['Humano', 11], ['Cão', 26], ['Morcego', 47], ['Baleia', 72], ['Ave', 91]].forEach(([n, x]) => {
      const p = R.pt(x, 96), w = X.measureText(n).width + 18;
      X.fillStyle = 'rgba(11,15,28,.9)'; X.beginPath(); rrect(X, p[0] - w / 2, p[1] - fs, w, fs * 1.9, fs); X.fill();
      X.strokeStyle = 'rgba(255,255,255,.35)'; X.lineWidth = 1; X.stroke(); X.fillStyle = '#E8EDF7'; X.fillText(n, p[0], p[1] - fs * .05);
    });
    X.restore();
  });

  // ================= CHAVE =================
  cena('chave/dicotomica', 'Insetos e a chave dicotômica', [
    ['a', 'Cinco insetos', 'Todos têm seis pernas: o que muda são as asas e o corpo.', [0, .2, 1, .58]],
    ['b', 'Abelha de perto', 'Cabeça, tórax e abdômen, seis pernas e dois pares de asas.']
  ], [
    ['a', 'abe', '#F2D45C', 'Abelha', 'Apis mellifera: seis pernas, dois pares de asas transparentes e corpo peludo.', 11, 52, 3],
    ['a', 'ves', '#FF9F43', 'Vespa', 'Seis pernas e dois pares de asas, mas corpo quase sem pelos e abdômen fino.', 29, 48, 3],
    ['a', 'mos', '#8FD8FF', 'Mosca', 'Só um par de asas funcionais. O outro par virou pequenos balancins.', 46, 48, 3],
    ['a', 'bor', '#FF8A3D', 'Borboleta', 'Dois pares de asas cobertos de escamas coloridas.', 67, 46, 2.6],
    ['a', 'bes', '#6CCB7A', 'Besouro', 'O par de asas da frente é duro, o élitro, e protege as asas de voo.', 89, 50, 3],
    ['b', 'olh', '#8FD8FF', 'Olho composto', 'Formado por muitas lentes pequenas. É comum nos insetos e em outros artrópodes.', 33, 50, 3],
    ['b', 'ant', '#F2D45C', 'Antenas', 'Percebem cheiros e movimentos. Os insetos têm um par.', 11, 62, 3],
    ['b', 'asa', '#C9B8F0', 'Dois pares de asas', 'As asas ficam no tórax. A abelha tem dois pares, ligados entre si no voo.', 76, 20, 2.4],
    ['b', 'pol', '#FFB347', 'Pólen na pata', 'A pata traseira leva o pólen em uma cesta, a corbícula.', 72, 65, 3.4],
    ['b', 'per', '#E8C48A', 'Seis pernas', 'Três pares de pernas articuladas. É o critério que, na chave, leva ao grupo dos insetos.', 45, 85, 2.4]
  ]);
})();
