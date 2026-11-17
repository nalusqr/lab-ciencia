/* LAB Histologia: 11 cenas com figura de IA interativa (Prometeu), usando figura-ia.js v2 (Biologia molecular).
   A figura aparece por padrão; o botão "Ver em 3D" abre a cena 3D do Martin (histo3d.js) e "Ver figura" volta.
   Sem WebGL, o botão leva ao desenho 2D antigo (plano B). O .js de cada imagem só entra quando a cena abre.
   Cada cena troca só o visual (draw) da rota que os cenas-*.js já registram: lição, cards ENEM, rota e ordem ficam. */
'use strict';
(function () {
  if (typeof SC === 'undefined' || !window.LAB_FIGIA) return;
  const MODULO = 'histologia';
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
    const F = LAB_FIGIA({ nome, mask: extra && extra.mask !== undefined ? extra.mask : MASK, vistas: vistas.map(v => Object.assign({ id: v[0], img: pre + v[0], nome: v[1] }, v[3] ? { recorte: v[3] } : {})), hs });
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

  // ================= TECIDOS EM GERAL =================
  cena('tecidos/visao', 'Corte de tecidos corado em HE', [
    ['a', 'Quatro tecidos', 'Um corte corado em HE mostra os quatro tecidos básicos lado a lado.'],
    ['b', 'Lupa sobre o corte', 'A lupa aproxima as glândulas, as fibras e os vasos do conjuntivo.']
  ], [
    ['a', 'epit', '#2FC6C0', 'Tecido epitelial', 'Células coladas umas às outras, em várias camadas, quase sem matriz e sem vasos. Reveste a superfície do corpo.', 40, 22, 2.6],
    ['a', 'conj', '#F2A93B', 'Tecido conjuntivo', 'Células afastadas em muita matriz, com fibras e vasos sanguíneos com hemácias. É de lá que o epitélio recebe nutrientes.', 50, 41, 2.4],
    ['a', 'musc', '#E8647A', 'Tecido muscular', 'Fibras longas e estriadas, com os núcleos na periferia. Contraem e movem o órgão.', 22, 72, 2.2],
    ['a', 'nerv', '#B58CFF', 'Tecido nervoso', 'Corpos de neurônios grandes, de núcleo claro, cercados por células de apoio da glia.', 78, 70, 2.8],
    ['b', 'glan', '#2FC6C0', 'Epitélio glandular', 'Células altas formam tubos de glândula em volta de um espaço central, o lúmen.', 38, 30, 2.4],
    ['b', 'fibr', '#F2A93B', 'Fibras do conjuntivo', 'Feixes rosados de colágeno sustentam as glândulas e ligam um tecido ao outro.', 68, 30, 2.4],
    ['b', 'vaso', '#FF6B6B', 'Vasos com hemácias', 'Pequenos vasos no conjuntivo levam sangue às glândulas, que não têm vasos próprios no epitélio.', 62, 52, 2.8]
  ]);

  // ================= EPITELIAL =================
  cena('epitelial/revestimento', 'Epitélios de revestimento', [
    ['a', 'Simples e estratificado', 'Uma camada de células de um lado, várias camadas do outro, sobre a membrana basal.'],
    ['b', 'Pseudoestratificado ciliado', 'Células de alturas diferentes, com cílios e células caliciformes produtoras de muco.']
  ], [
    ['a', 'simp', '#2FC6C0', 'Epitélio simples', 'Uma só camada de células cúbicas. Favorece trocas e secreção.', 36, 47, 2.8],
    ['a', 'estr', '#2FC6C0', 'Epitélio estratificado', 'Várias camadas de células. Protege contra o atrito e a perda de água.', 82, 38, 2.6],
    ['a', 'mbas', '#FFE1A6', 'Membrana basal', 'Faixa fina de matriz que sustenta o epitélio e o separa do conjuntivo.', 22, 53, 3],
    ['a', 'capi', '#FF6B6B', 'Capilar no conjuntivo', 'O epitélio não tem vasos. Nutrientes e gases chegam a ele por difusão, vindos dos capilares do conjuntivo.', 40, 63, 3],
    ['b', 'cili', '#8FD8FF', 'Cílios', 'Projeções móveis que empurram o muco e as partículas presas nele para fora das vias respiratórias.', 30, 20, 3],
    ['b', 'cali', '#F5F0FF', 'Célula caliciforme', 'Célula em forma de cálice, cheia de gotas de muco, que lubrifica e protege a superfície.', 51, 33, 2.8],
    ['b', 'nuc', '#2FC6C0', 'Núcleos em alturas diferentes', 'Parece ter várias camadas, mas todas as células tocam a membrana basal: por isso é pseudoestratificado.', 40, 58, 2.8],
    ['b', 'mbas2', '#FFE1A6', 'Membrana basal', 'Separa o epitélio do conjuntivo logo abaixo.', 50, 67, 3]
  ]);

  cena('epitelial/glandular', 'Glândulas exócrina e endócrina', [
    ['a', 'Glândula exócrina', 'A secreção sai por um ducto até a superfície.'],
    ['b', 'Glândula endócrina', 'Sem ducto: o hormônio passa direto para os capilares.']
  ], [
    ['a', 'acin', '#F2A93B', 'Ácino secretor', 'Células secretoras ficam em volta de uma cavidade e enchem-se de grânulos de secreção.', 22, 40, 2.4],
    ['a', 'duct', '#8FD8FF', 'Ducto', 'Canal que leva a secreção até a superfície do epitélio. É a marca da glândula exócrina.', 49, 30, 2.6],
    ['a', 'epi', '#2FC6C0', 'Epitélio de revestimento', 'A glândula nasce do epitélio, que afunda no conjuntivo e se transforma em células secretoras.', 25, 14, 2.6],
    ['a', 'conj', '#F2A93B', 'Conjuntivo de sustentação', 'Envolve cada ácino com fibras e vasos.', 88, 50, 2.4],
    ['b', 'foli', '#FF8FB7', 'Folículo com coloide', 'Cavidade cheia de coloide rosado, onde o hormônio da tireoide fica guardado.', 70, 40, 2.4],
    ['b', 'cfol', '#2FC6C0', 'Células foliculares', 'Células achatadas ou cúbicas formam a parede do folículo e produzem o hormônio.', 62, 60, 3],
    ['b', 'capi', '#FF6B6B', 'Capilares', 'Sem ducto, o hormônio entra direto no sangue por esses capilares, que ficam colados às células.', 48, 36, 3]
  ], (R, X, t) => {
    if (R.k < .6) return;
    if (R.vista === 'a') fluxo(R, X, [[36, 46], [47, 38], [48, 24], [50, 10]], '#FFE08A', 6, t, .22, .5);
    else fluxo(R, X, [[66, 42], [58, 44], [52, 42]], '#FF8FB7', 5, t, .25, .5);
  });

  // ================= CONJUNTIVO =================
  cena('conjuntivo/propriamente', 'Tecido conjuntivo propriamente dito', [
    ['a', 'Conjuntivo frouxo', 'Muita substância entre as células, fibras finas e células variadas.'],
    ['b', 'Conjuntivo denso', 'Feixes grossos de colágeno em uma só direção, com poucas células.']
  ], [
    ['a', 'fibro', '#F2A93B', 'Fibroblasto', 'Célula alongada, de núcleo fino, que produz as fibras e a matriz do conjuntivo.', 33, 22, 3],
    ['a', 'mast', '#B58CFF', 'Mastócito', 'Célula cheia de grânulos escuros com histamina, que ajuda a iniciar a inflamação e as alergias.', 63, 37, 3],
    ['a', 'macro', '#FF8FB7', 'Macrófago', 'Célula grande que engole microrganismos e restos de células. Faz parte da defesa.', 27, 52, 3],
    ['a', 'elas', '#8FD8FF', 'Fibra elástica', 'Fios finos e ondulados que deixam o tecido esticar e voltar ao normal.', 53, 31, 3],
    ['a', 'cola', '#FFE1A6', 'Fibra de colágeno', 'Fibras rosadas, resistentes à tração, entrelaçadas em várias direções.', 45, 62, 2.6],
    ['b', 'cola2', '#FFE1A6', 'Feixes de colágeno', 'No conjuntivo denso, os feixes correm paralelos e dão grande resistência, como nos tendões.', 40, 60, 2.2],
    ['b', 'fibro2', '#F2A93B', 'Fibroblastos alinhados', 'Os núcleos achatados ficam entre os feixes, na mesma direção das fibras.', 67, 32, 3]
  ]);

  cena('conjuntivo/adiposo', 'Tecido adiposo', [
    ['a', 'Células de gordura', 'No corte, cada adipócito é uma grande célula quase vazia, porque a gordura foi dissolvida no preparo.'],
    ['b', 'Tecido adiposo', 'Visto a olho nu, o tecido adiposo forma lóbulos amarelos separados por finas lâminas de conjuntivo.']
  ], [
    ['a', 'adip', '#F5D98A', 'Adipócito', 'Uma grande gota de gordura ocupa quase toda a célula, reserva de energia.', 50, 28, 2.4],
    ['a', 'nuc', '#B58CFF', 'Núcleo na periferia', 'A gota empurra o núcleo e o citoplasma para a borda, e o núcleo fica achatado.', 61, 46, 3.2],
    ['a', 'capi', '#FF6B6B', 'Capilar', 'Vasos finos correm entre os adipócitos e levam e trazem a gordura.', 42, 9, 3.2],
    ['a', 'capi2', '#FF6B6B', 'Vaso entre as células', 'Cada adipócito fica encostado em pelo menos um capilar.', 27, 82, 3.2],
    ['b', 'lobu', '#F5D98A', 'Lóbulos de gordura', 'Reserva de energia, isolante térmico e amortecedor de choques.', 25, 28, 2.2],
    ['b', 'vasos', '#FF6B6B', 'Vasos finos', 'O tecido adiposo é bem irrigado.', 40, 42, 2.6],
    ['b', 'septo', '#FFE1A6', 'Septos de conjuntivo', 'Lâminas brancas de conjuntivo dividem a gordura em lóbulos e levam os vasos.', 62, 48, 2.6]
  ]);

  cena('conjuntivo/cartilagem', 'Cartilagem hialina', [
    ['a', 'Corte em HE', 'A cartilagem hialina tem células em lacunas dentro de uma matriz de aspecto vítreo.'],
    ['b', 'Anéis da traqueia', 'Anéis de cartilagem hialina mantêm a traqueia aberta.']
  ], [
    ['a', 'peri', '#F2A93B', 'Pericôndrio', 'Capa de conjuntivo que envolve a cartilagem. Leva os nutrientes, porque a cartilagem não tem vasos.', 50, 17, 2.6],
    ['a', 'cond', '#8FB8DE', 'Condrócito na lacuna', 'Célula da cartilagem, dentro de um espaço chamado lacuna.', 17, 24, 3.4],
    ['a', 'isog', '#B58CFF', 'Grupo isógeno', 'Células-filhas da mesma divisão, ainda juntas. Cada uma logo produz matriz e se afasta.', 52, 58, 3.4],
    ['a', 'matr', '#C9B8F0', 'Matriz', 'Rica em colágeno e proteoglicanos. É firme, mas flexível e lisa.', 62, 74, 2.6],
    ['b', 'anel', '#8FB8DE', 'Anéis de cartilagem', 'Mantêm a traqueia aberta para o ar passar, e permitem que o tubo se dobre um pouco.', 74, 28, 2.4],
    ['b', 'lume', '#FFB3A7', 'Luz da traqueia', 'O ar passa pelo centro, revestido por epitélio com cílios e muco.', 36, 53, 2.2],
    ['b', 'muco', '#FF8FB7', 'Mucosa', 'Camada interna com epitélio e conjuntivo, logo dentro dos anéis.', 17, 70, 2.6]
  ]);

  cena('conjuntivo/osso', 'Osso longo e ósteon', [
    ['a', 'Osso longo', 'Do osso inteiro até um pedaço de osso compacto.'],
    ['b', 'Ósteon em detalhe', 'Um ósteon, com as células que constroem e desfazem o osso.']
  ], [
    ['a', 'medu', '#F5D98A', 'Canal medular', 'Cavidade no interior da diáfise, ocupada por medula óssea amarela, rica em gordura.', 27, 45, 2.6],
    ['a', 'espo', '#EDE3D1', 'Osso esponjoso', 'Nas extremidades, trabéculas formam uma rede leve e resistente, com medula vermelha nos espaços.', 24, 88, 2.8],
    ['a', 'oste', '#EDE3D1', 'Ósteons no osso compacto', 'Cilindros de lamelas concêntricas em volta de um canal central.', 68, 36, 2.6],
    ['a', 'volk', '#FF6B6B', 'Canal de Volkmann', 'Canal transversal que liga os canais centrais entre si e à superfície do osso.', 57, 60, 3],
    ['b', 'havers', '#FF6B6B', 'Canal central', 'Passam por ele vasos e nervos, que nutrem as células do ósteon.', 42, 40, 2.8],
    ['b', 'lame', '#EDE3D1', 'Lamelas', 'Camadas concêntricas de matriz mineralizada, com colágeno e cristais de fosfato de cálcio.', 50, 25, 2.4],
    ['b', 'osteo', '#B58CFF', 'Osteócito', 'Célula madura presa em uma lacuna, que mantém a matriz.', 17, 33, 3.4],
    ['b', 'clas', '#FF8FB7', 'Osteoclasto', 'Célula grande, com vários núcleos, que dissolve a matriz e libera cálcio.', 63, 14, 3],
    ['b', 'blas', '#8FA8FF', 'Osteoblastos', 'Fileira de células que produzem matriz nova e depois viram osteócitos.', 87, 31, 3]
  ], (R, X, t) => {
    if (R.vista !== 'b' || R.k < .6) return;
    const f = RED ? .5 : (t * .22) % 1, ciclo = f < .5;
    if (ciclo) anel(R, X, 63, 14, '#FF8FB7', f * 2, 6); else anel(R, X, 87, 31, '#8FA8FF', (f - .5) * 2, 6);
  });

  // ================= SANGUE =================
  cena('sangue/elementos', 'Esfregaço de sangue', [
    ['a', 'Esfregaço', 'Hemácias em grande número, com leucócitos e plaquetas entre elas.'],
    ['b', 'Células de perto', 'As células do sangue ampliadas.']
  ], [
    ['a', 'hema', '#FF6B6B', 'Hemácia', 'Disco bicôncavo sem núcleo, cheio de hemoglobina. Transporta oxigênio.', 28, 71, 3],
    ['a', 'neut', '#B58CFF', 'Neutrófilo', 'Núcleo com vários lobos e grânulos finos. É o leucócito mais comum e engole bactérias.', 34, 43, 2.8],
    ['a', 'linf', '#8FA8FF', 'Linfócito', 'Núcleo grande e redondo, com pouco citoplasma. Atua na defesa específica.', 66, 65, 3],
    ['a', 'plaq', '#E8B5FF', 'Plaquetas', 'Fragmentos de células, sem núcleo. Participam da coagulação.', 62, 22, 5],
    ['b', 'hema2', '#FF6B6B', 'Hemácia vista de perto', 'O centro mais fino do disco aumenta a superfície para as trocas de gases.', 26, 79, 2.6],
    ['b', 'neut2', '#B58CFF', 'Neutrófilo', 'Núcleo lobulado e superfície cheia de projeções, para se mover e capturar bactérias.', 30, 28, 2.6],
    ['b', 'mono', '#8FA8FF', 'Monócito', 'Maior leucócito, com núcleo em forma de rim. Nos tecidos, vira macrófago.', 76, 64, 2.4],
    ['b', 'plaq2', '#E8B5FF', 'Plaqueta', 'Pequeno fragmento que se gruda na lesão e ajuda a fechar o vaso.', 90, 32, 5]
  ]);

  // ================= MUSCULAR =================
  cena('muscular/tipos', 'Os três tipos de tecido muscular', [
    ['a', 'Os três lado a lado', 'Estriado esquelético à esquerda, cardíaco no centro e liso à direita.'],
    ['b', 'Corte transversal', 'Músculo estriado esquelético cortado de través.']
  ], [
    ['a', 'esq', '#E8647A', 'Estriado esquelético', 'Fibras longas, com estrias e muitos núcleos na periferia. Contração rápida e voluntária.', 14, 50, 2.4],
    ['a', 'card', '#FF8FB7', 'Estriado cardíaco', 'Fibras ramificadas, com estrias e um núcleo central. Contração involuntária.', 46, 40, 2.4],
    ['a', 'disc', '#C9B8F0', 'Disco intercalar', 'Linha escura entre duas células do coração, que as une e passa o sinal da contração.', 36, 39, 3.6],
    ['a', 'liso', '#C77DFF', 'Músculo liso', 'Células fusiformes, sem estrias, com um núcleo central. Contração lenta e involuntária.', 82, 50, 2.4],
    ['b', 'fib', '#E8647A', 'Fibra muscular', 'Cada fibra é uma célula muito comprida. No corte transversal aparece como um polígono.', 46, 22, 2.4],
    ['b', 'nuc', '#B58CFF', 'Núcleos periféricos', 'Os muitos núcleos ficam encostados na membrana da fibra.', 61, 32, 3.4],
    ['b', 'endo', '#FFE1A6', 'Endomísio', 'Conjuntivo finíssimo em volta de cada fibra.', 76, 41, 3.2],
    ['b', 'peri', '#F2A93B', 'Perimísio', 'Conjuntivo mais grosso, que envolve grupos de fibras, os fascículos.', 35, 38, 2.8],
    ['b', 'vaso', '#FF6B6B', 'Vaso no conjuntivo', 'Os vasos correm no conjuntivo e levam oxigênio e glicose às fibras.', 56, 53, 3.2]
  ]);

  // ================= NERVOSO =================
  cena('nervoso/glia', 'Células da glia', [
    ['a', 'Glia em volta do capilar', 'Astrócito, oligodendrócito e micróglia junto de um neurônio e de um capilar.'],
    ['b', 'Astrócito e capilar', 'Os prolongamentos do astrócito terminam sobre a parede do capilar.']
  ], [
    ['a', 'astr', '#B58CFF', 'Astrócito', 'Célula em forma de estrela, que sustenta os neurônios e regula o meio químico em volta deles.', 20, 40, 2.4],
    ['a', 'pes', '#FFE1A6', 'Pés vasculares', 'Terminações do astrócito que envolvem o capilar e ajudam a formar a barreira hematoencefálica.', 27, 64, 2.6],
    ['a', 'olig', '#E8F1FF', 'Oligodendrócito', 'Envolve os axônios do sistema nervoso central com bainha de mielina.', 62, 57, 2.8],
    ['a', 'micr', '#F2D45C', 'Micróglia', 'Célula pequena e ramificada, que faz a defesa e a limpeza do sistema nervoso central.', 40, 22, 3.4],
    ['a', 'neur', '#F2A93B', 'Neurônio', 'Célula que conduz o impulso nervoso. A glia o apoia, protege e nutre.', 78, 22, 2.4],
    ['b', 'astr2', '#B58CFF', 'Corpo do astrócito', 'O núcleo fica no centro, e os prolongamentos saem em todas as direções.', 33, 37, 2.4],
    ['b', 'pes2', '#FFE1A6', 'Pés vasculares', 'Cada pé encosta na parede do capilar e controla o que passa do sangue para o tecido nervoso.', 72, 56, 2.6],
    ['b', 'capi', '#FF6B6B', 'Capilar', 'Vaso fino com hemácias, que leva oxigênio e glicose.', 80, 70, 2.6]
  ]);

  cena('nervoso/sinapse', 'Sinapse química', [
    ['a', 'Sinapse ampliada', 'O terminal do axônio libera neurotransmissor na fenda e a célula seguinte o recebe.'],
    ['b', 'Dois neurônios', 'O axônio de um neurônio faz sinapses com os dendritos do seguinte.']
  ], [
    ['a', 'vesi', '#FFD23F', 'Vesículas sinápticas', 'Bolsas cheias de neurotransmissor. Ao chegar o impulso, elas se fundem à membrana e despejam o conteúdo.', 33, 38, 3],
    ['a', 'mito', '#FF9F43', 'Mitocôndria', 'Fornece a energia (ATP) para produzir e reciclar o neurotransmissor.', 33, 22, 3],
    ['a', 'fend', '#8FD8FF', 'Fenda sináptica', 'Espaço bem estreito entre as duas células. O neurotransmissor atravessa por difusão.', 45, 62, 3],
    ['a', 'rece', '#C77DFF', 'Receptores', 'Proteínas na membrana da célula seguinte. Ao se ligar a eles, o neurotransmissor gera um novo sinal.', 36, 73, 3.2],
    ['b', 'pre', '#F2A93B', 'Neurônio pré-sináptico', 'Envia o sinal. O impulso corre pelo axônio até o terminal.', 18, 22, 2.4],
    ['b', 'miel', '#F5F0C8', 'Bainha de mielina', 'Faz o impulso saltar e correr mais rápido pelo axônio.', 36, 47, 3],
    ['b', 'term', '#FFD23F', 'Terminais do axônio', 'As pontas do axônio fazem contato com a célula seguinte.', 80, 42, 3],
    ['b', 'pos', '#B58CFF', 'Neurônio pós-sináptico', 'Recebe o sinal pelos dendritos, cobertos de pequenas projeções.', 92, 72, 2.4]
  ], (R, X, t) => {
    if (R.vista !== 'a' || R.k < .6) return;
    fluxo(R, X, [[47, 54], [47, 62], [46, 70]], '#FFD23F', 6, t, .35, .45);
  });
  // ================= V3: ossificação endocondral (Íris e Prometeu) =================
  // Osso longo em corte: o disco epifisário mantém a cartilagem se multiplicando de um lado e virando osso do outro.
  cena('conjuntivo/ossificacao', 'Ossificação endocondral em osso longo', [
    ['a', 'Osso longo em crescimento', 'Osso longo de criança em corte: cartilagem azul nas pontas e nos discos epifisários, osso esponjoso e osso compacto em creme']
  ], [
    ['a', 'cap', '#8FB8DE', 'Cartilagem articular', 'Capa de cartilagem hialina na ponta do osso. Reveste a articulação e permanece a vida toda.', 7, 36, 2.8],
    ['a', 'epi', '#EDE3D1', 'Osso esponjoso da epífise', 'Rede de trabéculas no centro da ponta do osso, com medula vermelha nos espaços. Foi cartilagem antes de virar osso.', 13.5, 47, 2.8],
    ['a', 'pla', '#8FB8DE', 'Disco epifisário', 'Faixa de cartilagem de crescimento. As células se multiplicam em colunas de um lado e são trocadas por osso do outro, e o osso se alonga.', 21.7, 54.7, 3],
    ['a', 'pl2', '#8FB8DE', 'Disco epifisário', 'Existe um em cada ponta. Quando a cartilagem acaba de virar osso, no fim da puberdade, o crescimento em altura para.', 79.5, 54.7, 3],
    ['a', 'com', '#EDE3D1', 'Osso compacto', 'Parede densa e dura da diáfise, feita de ósteons. É a parte que dá resistência ao osso.', 51, 41.7, 2.6],
    ['a', 'med', '#F5D98A', 'Canal medular', 'Cavidade da diáfise, aberta quando osteoclastos reabsorvem o osso do centro. Na criança guarda medula vermelha; no adulto, sobretudo medula amarela.', 51, 50, 2.4],
    ['a', 'per', '#FFB3A7', 'Periósteo', 'Membrana de tecido conjuntivo que envolve o osso por fora. Nutre o osso e acrescenta osso novo em espessura.', 40.7, 39, 3.2]
  ], (R, X, t) => {
    if (R.k < .6 || R.z > 1.5) return;
    // no disco epifisário, células deixam a cartilagem (azul) e viram osso (creme): do lado da epífise para o lado da diáfise
    const lados = [[19.2, 24.6], [82, 77.2]], ys = [43, 49, 55, 61, 66];
    lados.forEach(([x0, x1], li) => ys.forEach((y, i) => {
      const f = RED ? .5 : (t * .16 + i * .21 + li * .13) % 1, [px, py] = R.pt(x0 + (x1 - x0) * f, y);
      X.save(); X.globalAlpha = RED ? .85 : Math.sin(f * Math.PI) * .95; X.fillStyle = f < .5 ? '#BFE0FF' : '#FFF1CF'; X.shadowColor = X.fillStyle; X.shadowBlur = 8;
      X.beginPath(); X.arc(px, py, R.s * .65, 0, TAU); X.fill(); X.restore();
    }));
    const k = RED ? .5 : (t * .6) % 1;
    [[21.7, 54.7], [79.5, 54.7]].forEach(([x, y]) => anel(R, X, x, y, '#8FD8FF', k, 3));
  }, { mask: { miolo: .94, borda: 1 } });
})();
