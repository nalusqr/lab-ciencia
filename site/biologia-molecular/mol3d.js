/* LAB · mol3d: visualizador 3D de moléculas e estruturas para os motores de canvas 2D (window.LABM e parentes).
   Código da equipe (Martin). Usa o THREE do bundle site/celula/vendor/r3f.js, carregado só quando uma cena 3D abre.
   Como usar: docs/visual/mol3d-uso.md. Resumo: def(sec, id, MOL3D.cena({ ...campos da cena, montar(M), animar(M, P), legenda(P), plano(t, S) })).
   O canvas 2D #cv continua por baixo, pintado com o fundo do palco; o WebGL fica numa camada transparente por cima. */
'use strict';
(function () {
  const SRC = (document.currentScript && document.currentScript.src) || '';
  const REDUZ = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), mix = (a, b, t) => a + (b - a) * t;
  // curvas do padrão de motion (docs/visual/padrao-motion.md)
  function bez(x1, y1, x2, y2) {
    const f = (t, a, b) => ((1 - 3 * b + 3 * a) * t + (3 * b - 6 * a)) * t * t + 3 * a * t;
    return x => { if (x <= 0) return 0; if (x >= 1) return 1; let lo = 0, hi = 1, t = x; for (let i = 0; i < 24; i++) { t = (lo + hi) / 2; if (f(t, x1, x2) < x) lo = t; else hi = t; } return f(t, y1, y2); };
  }
  const E = { out: bez(.16, 1, .3, 1), in: bez(.7, 0, .84, 0), move: bez(.65, 0, .35, 1) };
  const NARROW = () => window.innerWidth < 700;
  const dur = ms => (NARROW() ? ms * .8 : ms);

  // ---------- elementos: cor CPK (tokens do base.css), raio no modo bola e bastão e raio de van der Waals (Å) ----------
  const css = (n, f) => (getComputedStyle(document.documentElement).getPropertyValue(n).trim() || f);
  const EL = {
    H: ['Hidrogênio', css('--cpk-h', '#F2F4F8'), .3, 1.2, 'O menor átomo; faz uma ligação covalente e, ligado a O ou N, fica com carga parcial positiva.'],
    C: ['Carbono', css('--cpk-c', '#9AA3B2'), .42, 1.7, 'Faz quatro ligações e forma o esqueleto de todas as moléculas orgânicas.'],
    N: ['Nitrogênio', css('--cpk-n', '#4D7DFF'), .41, 1.55, 'Faz três ligações; aparece nos aminoácidos e nas bases nitrogenadas.'],
    O: ['Oxigênio', css('--cpk-o', '#FF4D4D'), .41, 1.52, 'Muito eletronegativo: puxa os elétrons das ligações e fica com carga parcial negativa.'],
    P: ['Fósforo', css('--cpk-p', '#FF9A3C'), .5, 1.8, 'Forma os grupos fosfato do DNA, do RNA, do ATP e dos fosfolipídios.'],
    S: ['Enxofre', css('--cpk-s', '#F2D24B'), .5, 1.8, 'Aparece na cisteína e na metionina; as pontes dissulfeto estabilizam proteínas.'],
    Na: ['Sódio', '#AB7CF2', .5, 2.27, 'Forma o íon Na⁺, importante no impulso nervoso e no equilíbrio da água.'],
    K: ['Potássio', '#8F6BD8', .55, 2.75, 'Forma o íon K⁺, o principal cátion dentro das células.'],
    Cl: ['Cloro', '#5CCB6E', .45, 1.75, 'Forma o íon Cl⁻, que acompanha o sódio nos líquidos do corpo.'],
    Ca: ['Cálcio', '#9FB4C7', .5, 2.31, 'Forma o íon Ca²⁺, dos ossos, da contração muscular e da coagulação.'],
    Mg: ['Magnésio', '#7FD49B', .45, 1.73, 'Fica no centro da clorofila e ajuda muitas enzimas a funcionar.'],
    Fe: ['Ferro', '#D07A4A', .45, 2.0, 'Fica no centro do grupo heme da hemoglobina e prende o oxigênio.'],
    X: ['Peça', '#C9D3E6', .5, 1.6, '']
  };
  const PONTE_COR = '#8FD8FF';

  // ---------- carga do THREE (uma vez, por <script>, que funciona por file://) ----------
  let carga = null;
  function carregar() {
    if (window.R3F && window.R3F.THREE) return Promise.resolve(window.R3F.THREE);
    if (carga) return carga;
    carga = new Promise((ok, falha) => {
      const s = document.createElement('script'), t0 = performance.now();
      s.src = new URL('../celula/vendor/r3f.js', SRC || location.href).href;
      s.onload = () => { MOL3D.cargaMs = Math.round(performance.now() - t0); window.R3F && window.R3F.THREE ? ok(window.R3F.THREE) : falha(new Error('r3f.js sem THREE')); };
      s.onerror = () => falha(new Error('não carregou ' + s.src));
      document.head.appendChild(s);
    });
    return carga;
  }

  // ---------- estilos das camadas HTML (rótulos, painel e barra de controles) ----------
  const ICO = {
    frente: '<path d="M12 3 20 7.5v9L12 21 4 16.5v-9z"/><path d="M12 12v9M12 12l8-4.5M12 12 4 7.5"/><path d="M4 7.5 12 12v9l-8-4.5z" fill="currentColor" fill-opacity=".45" stroke="none"/>',
    lado: '<path d="M12 3 20 7.5v9L12 21 4 16.5v-9z"/><path d="M12 12v9M12 12l8-4.5M12 12 4 7.5"/><path d="M20 7.5 12 12v9l8-4.5z" fill="currentColor" fill-opacity=".45" stroke="none"/>',
    cima: '<path d="M12 3 20 7.5v9L12 21 4 16.5v-9z"/><path d="M12 12v9M12 12l8-4.5M12 12 4 7.5"/><path d="M12 3 20 7.5 12 12 4 7.5z" fill="currentColor" fill-opacity=".45" stroke="none"/>',
    mais: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5M10.5 7.5v6M7.5 10.5h6"/>',
    menos: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5M7.5 10.5h6"/>',
    inicio: '<circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
    volume: '<circle cx="9" cy="10" r="5.5" fill="currentColor" fill-opacity=".3"/><circle cx="15.5" cy="14.5" r="5" fill="currentColor" fill-opacity=".3"/>',
    fechar: '<path d="M6 6l12 12M18 6 6 18"/>',
    zoom: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/><circle cx="10.5" cy="10.5" r="2" fill="currentColor" stroke="none"/>'
  };
  const svg = k => `<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${ICO[k]}</g></svg>`;
  function estilos() {
    if (document.getElementById('m3-css')) return;
    const st = document.createElement('style'); st.id = 'm3-css';
    st.textContent = `
.tela canvas.m3-cv{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none;cursor:grab;outline:none;opacity:0;transition:opacity 280ms cubic-bezier(.16,1,.3,1)}
.tela canvas.m3-cv.on{opacity:1}.tela canvas.m3-cv.arr{cursor:grabbing}.tela canvas.m3-cv.peca{cursor:pointer}
.tela canvas.m3-cv:focus-visible{box-shadow:inset 0 0 0 2px var(--focus,#8FD8FF)}
.m3-rot{position:absolute;inset:0;pointer-events:none;overflow:hidden}
.m3-r{position:absolute;left:0;top:0;pointer-events:auto;display:flex;align-items:center;gap:0;padding:0;margin:0;border:0;background:none;color:var(--txt,#E8EDF7);font:600 13px/1 var(--f-txt,system-ui);cursor:pointer;will-change:transform;transition:opacity 160ms}
.m3-r .p{width:10px;height:10px;margin:0 0 0 -5px;border-radius:50%;background:rgba(11,15,28,.55);border:2px solid #fff;flex:none;position:relative}
.m3-r .p::after{content:"";position:absolute;inset:-2px;border-radius:50%;border:1px solid #fff;opacity:0;animation:m3pulso 1.2s cubic-bezier(.16,1,.3,1) 2}
.m3-r .l{width:20px;height:1px;background:rgba(255,255,255,.6);flex:none}
.m3-r .t{padding:6px 10px;border-radius:999px;background:rgba(11,15,28,.84);border:1px solid rgba(255,255,255,.12);white-space:nowrap;display:flex;align-items:center;gap:6px}
.m3-r .t i{width:8px;height:8px;border-radius:50%;flex:none}
.m3-r.esq{flex-direction:row-reverse}.m3-r.esq .p{margin:0 -5px 0 0}
.m3-r.sem .l,.m3-r.sem .t{display:none}.m3-r.atras{opacity:.5}.m3-r.fora{opacity:0;pointer-events:none}
.m3-r.sel .p{background:#FFB347;border-color:#FFB347}
.m3-r:focus-visible{outline:none}.m3-r:focus-visible .p{box-shadow:0 0 0 3px var(--focus,#8FD8FF)}.m3-r:focus-visible .t{outline:2px solid var(--focus,#8FD8FF);outline-offset:1px}
@keyframes m3pulso{from{transform:scale(1);opacity:.6}to{transform:scale(2.2);opacity:0}}
.m3-info{position:absolute;left:16px;bottom:72px;width:min(340px,calc(100% - 32px));padding:12px 14px 12px;border-radius:12px;background:var(--float,rgba(19,26,43,.92));border:1px solid var(--float-line,rgba(255,255,255,.08));box-shadow:var(--float-shadow,0 8px 24px rgba(0,0,0,.45));backdrop-filter:blur(8px);color:var(--txt,#E8EDF7);opacity:0;transform:translateY(8px);pointer-events:none;transition:opacity 160ms cubic-bezier(.7,0,.84,0),transform 160ms cubic-bezier(.7,0,.84,0)}
.m3-info.on{opacity:1;transform:none;pointer-events:auto;transition-duration:280ms;transition-timing-function:cubic-bezier(.16,1,.3,1)}
.m3-info .h{display:flex;align-items:center;gap:8px;padding-right:40px;font:600 16px/1.25 var(--f-title,system-ui)}
.m3-info .h i{width:10px;height:10px;border-radius:50%;flex:none}
.m3-info small{display:block;color:var(--dim,#9DA9C4);font-size:13px;margin:4px 0 0 18px}
.m3-info p{font-size:14px;line-height:1.45;margin:8px 0 10px;color:#D3DAEA}
.m3-info .x{position:absolute;top:4px;right:4px;width:44px;height:44px;display:grid;place-items:center;border:0;border-radius:8px;background:none;color:var(--dim,#9DA9C4);cursor:pointer}
.m3-info .x:hover{color:var(--txt,#E8EDF7);background:var(--panel-2,#1B2440)}
.m3-info .x svg,.m3-info .z svg{width:20px;height:20px}
.m3-info .z{font:inherit;font-size:14px;font-weight:600;display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 12px;border-radius:8px;border:1px solid var(--line-strong,#5B6C99);background:var(--panel,#131A2B);color:var(--txt,#E8EDF7);cursor:pointer}
.m3-info .z:hover{background:var(--panel-2,#1B2440)}
.m3-info button:focus-visible{outline:2px solid var(--focus,#8FD8FF);outline-offset:2px}
.m3-barra[hidden]{display:none}
.m3-barra .grp{display:flex;gap:4px;flex:none}
.m3-barra .dica{font-size:13px;color:var(--dim,#9DA9C4);margin-left:8px}
@media(max-width:699px){.m3-info{left:8px;right:8px;width:auto;top:48px;bottom:auto}.m3-barra .dica{display:none}}
@media(prefers-reduced-motion:reduce){.m3-r .p::after{animation:none}.tela canvas.m3-cv,.m3-info,.m3-r{transition-duration:150ms!important}}`;
    document.head.appendChild(st);
  }

  // ---------- o visualizador (um só por página: um contexto WebGL reaproveitado entre as cenas) ----------
  let V = null;
  function criar(THREE) {
    estilos();
    const tela = document.getElementById('cv').parentElement, palco = tela.parentElement;
    const cvs = document.createElement('canvas'); cvs.className = 'm3-cv'; cvs.tabIndex = 0; cvs.setAttribute('role', 'application');
    tela.insertBefore(cvs, document.getElementById('cv').nextSibling);
    const rot = document.createElement('div'); rot.className = 'm3-rot'; tela.insertBefore(rot, cvs.nextSibling);
    const info = document.createElement('div'); info.className = 'm3-info'; info.setAttribute('role', 'region'); info.setAttribute('aria-live', 'polite'); info.setAttribute('aria-label', 'Detalhe da peça');
    info.innerHTML = `<div class="h"><i></i><span></span></div><small></small><p></p><button type="button" class="z">${svg('zoom')}Aproximar</button><button type="button" class="x" aria-label="Fechar o detalhe" title="Fechar">${svg('fechar')}</button>`;
    tela.appendChild(info);
    const barra = document.createElement('div'); barra.className = 'barra m3-barra'; barra.setAttribute('role', 'toolbar'); barra.setAttribute('aria-label', 'Controles do modelo 3D'); barra.hidden = true;
    const bt = (id, k, tx, tit) => `<button type="button" data-a="${id}" title="${tit}" aria-label="${tit}">${svg(k)}<span class="tx">${tx}</span></button>`;
    barra.innerHTML = `<div class="grp">${bt('frente', 'frente', 'Frente', 'Ver de frente')}${bt('lado', 'lado', 'Lado', 'Ver de lado')}${bt('cima', 'cima', 'Cima', 'Ver de cima')}</div>`
      + `<div class="grp">${bt('menos', 'menos', 'Afastar', 'Afastar').replace('<button', '<button class="sq"').replace(/<span class="tx">Afastar<\/span>/, '')}${bt('mais', 'mais', 'Aproximar', 'Aproximar').replace('<button', '<button class="sq"').replace(/<span class="tx">Aproximar<\/span>/, '')}${bt('inicio', 'inicio', 'Vista inicial', 'Voltar à vista inicial')}</div>`
      + `<button type="button" data-a="modo" aria-pressed="false" title="Mostrar o volume dos átomos (preenchimento espacial)">${svg('volume')}<span class="tx">Volume</span></button>`
      + `<span class="dica">Arraste para girar e toque numa peça</span>`;
    palco.insertBefore(barra, tela.nextSibling);

    const ren = new THREE.WebGLRenderer({ canvas: cvs, antialias: true, alpha: true, powerPreference: 'high-performance' });
    ren.setClearColor(0x000000, 0); ren.toneMapping = THREE.NeutralToneMapping || THREE.ACESFilmicToneMapping; ren.toneMappingExposure = .86;
    if ('outputColorSpace' in ren) ren.outputColorSpace = THREE.SRGBColorSpace;
    const cena = new THREE.Scene(), cam = new THREE.PerspectiveCamera(32, 1, .05, 2000);
    cena.add(cam);
    // luz de estúdio do Lab (guia, seção 5): chave morna de cima e da esquerda, preenchimento frio da direita, recorte frio por trás.
    // As luzes andam com a câmera, para o modelo ter a mesma luz das figuras de IA em qualquer ângulo.
    const L = (c, i, p) => { const l = new THREE.DirectionalLight(c, i); l.position.set(p[0], p[1], p[2]); cam.add(l); l.target = cam; return l; };
    const alvoLuz = new THREE.Object3D(); alvoLuz.position.set(0, 0, -10); cam.add(alvoLuz);
    [L('#FFF4E6', 1.6, [-6, 7, 4]), L('#CFE0FF', .5, [7, 1, 2]), L('#BFD8FF', 2.2, [5, 4, -12])].forEach(l => { l.target = alvoLuz; });
    cena.add(new THREE.HemisphereLight('#E8EEFF', '#1A2036', .18));
    try { const pm = new THREE.PMREMGenerator(ren); const RE = window.R3F.RoomEnvironment; if (RE) cena.environment = pm.fromScene(new RE(ren), .04).texture; } catch (e) { /* sem ambiente: só as luzes */ }
    const mat = new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: .42, metalness: 0, clearcoat: .35, clearcoatRoughness: .34, envMapIntensity: .35 });
    mat.onBeforeCompile = sh => {
      sh.vertexShader = 'varying float vVar;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n#ifdef USE_INSTANCING\n  vVar = fract(sin(dot(instanceMatrix[3].xyz, vec3(12.9898, 78.233, 37.719))) * 43758.5453);\n#else\n  vVar = 0.5;\n#endif');
      sh.fragmentShader = 'varying float vVar;\n' + sh.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>\n  diffuseColor.rgb *= 0.95 + 0.08 * vVar;')
        .replace('#include <opaque_fragment>', 'outgoingLight += vec3(0.07, 0.09, 0.13) * pow(1.0 - clamp(abs(dot(normal, normalize(vViewPosition))), 0.0, 1.0), 2.8);\n#include <opaque_fragment>');
    };
    mat.customProgramCacheKey = () => 'm3-mat';
    const matP = new THREE.MeshStandardMaterial({ color: PONTE_COR, roughness: .5, metalness: 0, emissive: '#1d4560', envMapIntensity: .3 });
    const matHalo = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: .22, side: THREE.BackSide, depthWrite: false });
    const geo = { esf: new THREE.SphereGeometry(1, 32, 20), cil: new THREE.CylinderGeometry(1, 1, 1, 18, 1), cx: new THREE.BoxGeometry(1, 1, 1), tr: new THREE.CylinderGeometry(1, 1, 1, 8, 1) };
    geo.cil.rotateZ(Math.PI / 2); geo.tr.rotateZ(Math.PI / 2); // eixo X = comprimento
    const raiz = new THREE.Group(); cena.add(raiz);

    const v = { THREE, ren, cena, cam, raiz, mat, matP, matHalo, geo, cvs, rot, info, barra, tela, spec: null, M: null, on: false,
      orb: { th: 0, fi: 0, d: 10, tx: 0, ty: 0, tz: 0 }, alvo: { th: 0, fi: 0, d: 10, tx: 0, ty: 0, tz: 0 }, tw: null, vel: 0, auto: true, mexeu: false,
      modo: 0, modoAlvo: 0, sel: null, last: performance.now(), w: 0, h: 0 };
    v.pos = montarPos(v);
    // ---- tamanho ----
    const tam = () => { const r = tela.getBoundingClientRect(); v.w = Math.max(200, r.width); v.h = Math.max(200, r.height); ren.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); ren.setSize(v.w, v.h, false); cam.aspect = v.w / v.h; cam.updateProjectionMatrix(); };
    if (window.ResizeObserver) new ResizeObserver(tam).observe(tela); addEventListener('resize', tam); tam(); v.tam = tam;
    // ---- gestos: arrastar gira, roda e pinça aproximam, toque escolhe ----
    const pts = new Map(); let ini = null, pinca = 0;
    const parar = () => { v.auto = false; v.tw = null; v.mexeu = true; v.tMexeu = performance.now(); };
    cvs.addEventListener('pointerdown', e => {
      cvs.focus({ preventScroll: true }); parar(); pts.set(e.pointerId, [e.clientX, e.clientY]);
      try { cvs.setPointerCapture(e.pointerId); } catch (er) { /* sem captura */ }
      if (pts.size === 1) ini = { x: e.clientX, y: e.clientY, t: performance.now(), mov: 0 };
      if (pts.size === 2) { const [a, b] = [...pts.values()]; pinca = Math.hypot(a[0] - b[0], a[1] - b[1]); ini = null; }
    });
    cvs.addEventListener('pointermove', e => {
      if (!pts.has(e.pointerId)) { if (e.pointerType === 'mouse') v.pairar = [e.clientX, e.clientY]; return; }
      const p = pts.get(e.pointerId), dx = e.clientX - p[0], dy = e.clientY - p[1]; pts.set(e.pointerId, [e.clientX, e.clientY]);
      if (pts.size === 2) { const [a, b] = [...pts.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]); if (pinca > 0) zoom(pinca / d); pinca = d; return; }
      if (ini) ini.mov += Math.abs(dx) + Math.abs(dy);
      if (!ini || ini.mov > 6) { cvs.classList.add('arr'); const k = 3.4 / Math.max(300, Math.min(v.w, v.h)); v.alvo.th -= dx * k; v.alvo.fi = clamp(v.alvo.fi + dy * k, -1.5, 1.5); v.ult = { dx: -dx * k, t: performance.now() }; }
    });
    const solta = e => {
      if (!pts.has(e.pointerId)) return; pts.delete(e.pointerId); cvs.classList.remove('arr'); if (pts.size < 2) pinca = 0;
      if (ini && ini.mov <= 6 && performance.now() - ini.t < 600 && e.type === 'pointerup') tocar(e.clientX, e.clientY);
      else if (v.ult && performance.now() - v.ult.t < 80 && !REDUZ) v.vel = v.ult.dx * 60;
      ini = null;
    };
    cvs.addEventListener('pointerup', solta); cvs.addEventListener('pointercancel', solta);
    cvs.addEventListener('wheel', e => { e.preventDefault(); parar(); zoom(Math.exp(e.deltaY * (e.deltaMode ? .05 : .0015))); }, { passive: false });
    cvs.addEventListener('keydown', e => {
      const k = e.key, st = .26; let ok = true;
      if (k === 'ArrowLeft') v.alvo.th += st; else if (k === 'ArrowRight') v.alvo.th -= st;
      else if (k === 'ArrowUp') v.alvo.fi = clamp(v.alvo.fi + st * .7, -1.5, 1.5); else if (k === 'ArrowDown') v.alvo.fi = clamp(v.alvo.fi - st * .7, -1.5, 1.5);
      else if (k === '+' || k === '=') zoom(.8); else if (k === '-' || k === '_') zoom(1.25);
      else if (k === '0' || k === 'Home') { vistaInicial(); if (v.M && v.M.cam) { e.preventDefault(); e.stopPropagation(); v.mexeu = false; return; } }
      else if (k === 'Enter' || k === ' ') proximoGrupo(e.shiftKey ? -1 : 1);
      else if (k === 'Escape') { if (v.sel) selecionar(null); else ok = false; }
      else ok = false;
      if (ok) { e.preventDefault(); e.stopPropagation(); parar(); }
    });
    barra.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return; parar(); const a = b.dataset.a;
      if (a === 'frente') ir({ th: 0, fi: 0 }); else if (a === 'lado') ir({ th: Math.PI / 2, fi: 0 }); else if (a === 'cima') ir({ th: 0, fi: 1.5 });
      else if (a === 'mais') zoom(.75); else if (a === 'menos') zoom(1.33); else if (a === 'inicio') { if (v.M && v.M.cam) v.mexeu = false; else vistaInicial(); }
      else if (a === 'modo') { v.modoAlvo = v.modoAlvo ? 0 : 1; b.setAttribute('aria-pressed', !!v.modoAlvo); if (REDUZ) v.modo = v.modoAlvo; }
    });
    info.querySelector('.x').onclick = () => { selecionar(null); cvs.focus({ preventScroll: true }); };
    info.querySelector('.z').onclick = () => { parar(); if (v.sel) focar(v.sel); };
    rot.addEventListener('click', e => { const b = e.target.closest('.m3-r'); if (!b || !v.M) return; parar(); const r = v.M.rotulos[+b.dataset.i]; selecionar(r.alvo.ponte != null ? { ponte: r.alvo.ponte } : { atomo: r.alvo.atomo }); });
    rot.addEventListener('keydown', e => { if (e.key === 'Escape' && v.sel) { selecionar(null); e.stopPropagation(); } });

    // ---- câmera ----
    function zoom(f) { const M = v.M; if (!M) return; v.tw = null; v.alvo.d = clamp(v.alvo.d * f, M.fit * .22, M.fit * 2.4); }
    function ir(o, ms) {
      const de = Object.assign({}, v.orb), para = Object.assign({}, v.alvo, o);
      // gira pelo caminho mais curto
      para.th = de.th + ((((para.th - de.th) % TAU) + TAU + Math.PI) % TAU - Math.PI);
      if (REDUZ) { Object.assign(v.alvo, para); Object.assign(v.orb, para); v.tw = null; return; }
      v.tw = { de, para, t0: performance.now(), ms: dur(ms || 700) }; Object.assign(v.alvo, para);
    }
    function vistaInicial() { const M = v.M; if (!M) return; ir({ th: M.vista.th, fi: M.vista.fi, d: M.fit * M.vista.zoom, tx: M.centro[0], ty: M.centro[1], tz: M.centro[2] }); }
    function focar(sel) { const M = v.M, c = centroGrupo(sel); if (!c) return; ir({ tx: c[0], ty: c[1], tz: c[2], d: clamp(c[3] / (.7 * Math.tan(cam.fov * Math.PI / 360) * Math.min(1, cam.aspect)) * 1.25, M.fit * .22, M.fit) }); }
    v.vistaInicial = vistaInicial; v.ir = ir; v.zoom = zoom;

    // ---- escolha de peças ----
    const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
    function raio(cx, cy) { const r = cvs.getBoundingClientRect(); ndc.set((cx - r.left) / r.width * 2 - 1, -(cy - r.top) / r.height * 2 + 1); ray.setFromCamera(ndc, cam); }
    function pegar(cx, cy) {
      const M = v.M; if (!M) return null; raio(cx, cy); let best = null;
      if (M.pegar) { const c = M.pegar(ray); if (c) return { custom: c }; }
      for (const [mesh, tipo] of [[M.mA, 'atomo'], [M.mPl, 'placa']]) { if (!mesh || !mesh.count) continue; mesh.boundingSphere = null; const h = ray.intersectObject(mesh, false)[0]; if (h && h.instanceId != null && (!best || h.distance < best.d)) best = { d: h.distance, tipo, i: h.instanceId }; }
      // pontes de hidrogênio: distância do raio ao segmento
      const o = ray.ray.origin, dir = ray.ray.direction, A = new THREE.Vector3(), B = new THREE.Vector3(), pr = new THREE.Vector3(), ps = new THREE.Vector3();
      M.pontes.forEach((p, i) => { if (p.k < .6 || !p.nome) return; A.copy(M.wp[p.a]); B.copy(M.wp[p.b]); const d2 = ray.ray.distanceSqToSegment(A, B, pr, ps); const tol = .35 + .004 * v.orb.d; if (d2 < tol * tol) { const d = pr.distanceTo(o); if (!best || d < best.d - .2) best = { d, tipo: 'ponte', i }; } });
      if (!best) return null;
      if (best.tipo === 'atomo') return { atomo: best.i };
      if (best.tipo === 'placa') return { atomo: M.ligs[M.plIdx[best.i]].a, placa: true };
      return { ponte: best.i };
    }
    function tocar(cx, cy) { const p = pegar(cx, cy); selecionar(p); }
    function selecionar(p) {
      const M = v.M; v.sel = p; if (!M) return;
      if (!p) { info.classList.remove('on'); M.corSuja = true; return; }
      let tit, sub = '', fr, cor;
      if (p.custom) { const c = p.custom; tit = c.nome; sub = c.sub || ''; fr = c.frase; cor = c.cor; p.grupo = null; }
      else if (p.ponte != null) { const q = M.pontes[p.ponte]; tit = q.nome; fr = q.frase; cor = PONTE_COR; }
      else {
        const a = M.atomos[p.atomo], g = a.grupo ? M.grupos[a.grupo] : null, el = EL[a.el] || EL.X;
        const pecaDoGrupo = p.placa || (!a.nome && g);
        tit = pecaDoGrupo && g ? g.nome : (a.nome || el[0]); sub = pecaDoGrupo || !g ? '' : g.nome;
        fr = pecaDoGrupo && g ? (g.frase || a.frase || el[4]) : (a.frase || (g && g.frase) || el[4]); cor = (g && g.cor) || a.cor || el[1];
        p.grupo = a.grupo || null;
      }
      info.querySelector('.h i').style.background = cor; info.querySelector('.h span').textContent = tit;
      info.querySelector('small').textContent = sub; info.querySelector('small').hidden = !sub; info.querySelector('p').textContent = fr || '';
      info.classList.add('on'); M.corSuja = true;
    }
    function proximoGrupo(d) {
      const M = v.M; if (!M) return;
      if (M.pecas) { const ps = M.pecas(); if (!ps.length) return; const at = v.sel && v.sel.custom ? ps.indexOf(v.sel.custom) : -1; selecionar({ custom: ps[(at + d + ps.length) % ps.length] }); return; }
      const ks = Object.keys(M.grupos).filter(k => M.grupos[k].nome && M.grupos[k].atomos.length); if (!ks.length) return;
      const at = v.sel && v.sel.grupo ? ks.indexOf(v.sel.grupo) : -1, k = ks[(at + d + ks.length) % ks.length];
      selecionar({ atomo: M.grupos[k].atomos[0], placa: true }); v.sel.grupo = k;
    }
    function centroGrupo(sel) {
      const M = v.M; if (!sel) return null; let ids;
      if (sel.custom) return sel.custom.centro ? sel.custom.centro() : null;
      if (sel.ponte != null) ids = [M.pontes[sel.ponte].a, M.pontes[sel.ponte].b]; else if (sel.grupo) ids = M.grupos[sel.grupo].atomos; else ids = [sel.atomo];
      const c = new THREE.Vector3(); ids.forEach(i => c.add(M.wp[i])); c.multiplyScalar(1 / ids.length); let r = 1.5; ids.forEach(i => { r = Math.max(r, M.wp[i].distanceTo(c) + 1.2); });
      return [c.x, c.y, c.z, r];
    }
    v.selecionar = selecionar; v.pegar = pegar;
    return v;
  }

  // ---------- construtor de modelos (o "M" que a cena recebe em montar e animar) ----------
  function construtor(THREE) {
    const M = { atomos: [], ligs: [], pontes: [], grupos: {}, nos: { raiz: null }, rotulos: [], vista: { th: -.6, fi: .38, zoom: 1 }, _nos: {} };
    const raiz = new THREE.Group(); M._nos.raiz = raiz;
    M.nos.raiz = { pos: [0, 0, 0], rot: [0, 0, 0], esc: 1, eixo: null, ang: 0, origem: [0, 0, 0], obj: raiz };
    M.no = (id, o = {}) => {
      const pai = M.nos[o.pai || 'raiz'], g = new THREE.Group(), org = o.origem || [0, 0, 0];
      pai.obj.add(g); const po = pai.origemAbs || [0, 0, 0];
      const h = { pos: [0, 0, 0], rot: [0, 0, 0], esc: 1, eixo: o.eixo || null, ang: 0, origem: org, origemAbs: org, rel: [org[0] - po[0], org[1] - po[1], org[2] - po[2]], obj: g };
      M.nos[id] = h; return h;
    };
    M.grupo = (id, o = {}) => (M.grupos[id] = Object.assign({ id, atomos: [] }, o));
    M.atomo = (el, p, o = {}) => {
      const e = EL[el] || EL.X, i = M.atomos.length, no = M.nos[o.no || 'raiz'], org = no.origemAbs || [0, 0, 0];
      M.atomos.push({ el, p: [p[0] - org[0], p[1] - org[1], p[2] - org[2]], no: o.no || 'raiz', grupo: o.grupo || null, nome: o.nome, frase: o.frase, cor: o.cor || e[1], r: o.r || [e[2], e[3]], esc: 1 });
      if (o.grupo) { if (!M.grupos[o.grupo]) M.grupo(o.grupo); M.grupos[o.grupo].atomos.push(i); }
      if (o.rotulo) M.rotulo(i, o.rotulo, o.prio);
      return i;
    };
    M.ligacao = (a, b, o = {}) => { M.ligs.push({ a, b, ordem: o.ordem || 1, cor: o.cor || null, raio: o.raio || .13, forma: o.forma || 'cil', larg: o.larg || [2, 3.4], esp: o.esp || [.8, 2.6], cima: o.cima || [0, 1, 0] }); return M.ligs.length - 1; };
    M.ponteH = (a, b, o = {}) => { const h = { a, b, k: o.k == null ? 1 : o.k, nome: o.nome === undefined ? 'Ligação de hidrogênio' : o.nome, frase: o.frase || 'Atração entre um hidrogênio com carga parcial positiva e um átomo vizinho com carga parcial negativa (O ou N). É mais fraca do que uma ligação covalente.' }; M.pontes.push(h); return h; };
    M.enquadrar = z => { M._zoom = z; };
    M.rotulo = (alvo, texto, prio) => { M.rotulos.push({ alvo: typeof alvo === 'number' ? { atomo: alvo } : { ponte: M.pontes.indexOf(alvo) }, texto, prio: prio || M.rotulos.length }); };
    return M;
  }

  // monta os InstancedMesh depois de montar(); calcula o tamanho para enquadrar
  function preparar(v, M) {
    const { THREE } = v, nA = M.atomos.length;
    M.wp = M.atomos.map(() => new THREE.Vector3());
    Object.values(M.nos).forEach(h => { if (h.rel) h.obj.position.set(h.rel[0], h.rel[1], h.rel[2]); });
    const cil = M.ligs.filter(l => l.forma !== 'placa'), pl = M.ligs.filter(l => l.forma === 'placa');
    M.plIdx = []; M.ligs.forEach((l, i) => { if (l.forma === 'placa') M.plIdx.push(i); });
    M.mA = new THREE.InstancedMesh(v.geo.esf, v.mat, Math.max(1, nA)); M.mA.count = nA;
    M.mL = new THREE.InstancedMesh(v.geo.cil, v.mat, Math.max(1, cil.reduce((s, l) => s + 2 * l.ordem, 0)));
    M.mPl = new THREE.InstancedMesh(v.geo.cx, v.mat, Math.max(1, pl.length));
    M.mH = new THREE.InstancedMesh(v.geo.esf, v.matHalo, Math.max(1, nA));
    atualizarMundo(v, M);
    M.pontes.forEach(p => { p.n = Math.max(3, Math.round(M.wp[p.a].distanceTo(M.wp[p.b]) / .34)); });
    M.mP = new THREE.InstancedMesh(v.geo.tr, v.matP, Math.max(1, M.pontes.reduce((s, p) => s + p.n, 0)));
    [M.mA, M.mL, M.mPl, M.mH, M.mP].forEach(m => { m.frustumCulled = false; m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); v.raiz.add(m); });
    // enquadramento: esfera que contém o modelo montado
    const bx = new THREE.Box3(); M.wp.forEach((p, i) => bx.expandByPoint(p)); const c = new THREE.Vector3(); bx.getCenter(c);
    let r = 1; M.wp.forEach((p, i) => { r = Math.max(r, p.distanceTo(c) + M.atomos[i].r[0]); });
    const sz = new THREE.Vector3(); bx.getSize(sz); M.meia = [sz.x / 2 + .5, sz.y / 2 + .5, sz.z / 2 + .5];
    M.raio = r; M.centro = M.vista.alvo || [c.x, c.y, c.z];
    M.corSuja = true;
  }
  function atualizarMundo(v, M) {
    const { THREE } = v, q = new THREE.Quaternion(), qa = new THREE.Quaternion(), e = new THREE.Euler(), ax = new THREE.Vector3();
    Object.values(M.nos).forEach(h => {
      const o = h.obj, r = h.rel || [0, 0, 0];
      o.position.set(r[0] + h.pos[0], r[1] + h.pos[1], r[2] + h.pos[2]); e.set(h.rot[0], h.rot[1], h.rot[2]); q.setFromEuler(e);
      if (h.eixo && h.ang) { ax.set(h.eixo[0], h.eixo[1], h.eixo[2]).normalize(); qa.setFromAxisAngle(ax, h.ang); q.premultiply(qa); }
      o.quaternion.copy(q); o.scale.setScalar(Math.max(1e-4, h.esc));
    });
    M._nos.raiz.updateMatrixWorld(true);
    M.atomos.forEach((a, i) => { M.wp[i].set(a.p[0], a.p[1], a.p[2]).applyMatrix4(M.nos[a.no].obj.matrixWorld); a.escW = escMundo(M, a.no); });
  }
  function escMundo(M, id) { let s = 1, o = M.nos[id].obj; while (o) { s *= o.scale.x; o = o.parent; } return s; }

  // ---------- imagem de cinema para todas as cenas: modelo nítido (superamostrado), fundo com bokeh desfocado, brilho só nos destaques ----------
  // O modelo vai numa camada própria e nunca é desfocado (sem halo); o fundo (partículas e moléculas ao longe) é outra camada, desfocada à parte.
  const POS_VS = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }';
  function montarPos(v) {
    const T = v.THREE, P = { ok: false, esc: 1, ema: 16, idade: 0, lento: 0, rapido: 0, w: 0, h: 0 };
    try {
      const tipo = T.HalfFloatType, rt = o => { const r = new T.WebGLRenderTarget(4, 4, Object.assign({ type: tipo, depthBuffer: false }, o || {})); r.texture.minFilter = r.texture.magFilter = T.LinearFilter; return r; };
      P.rtA = rt({ depthBuffer: true, samples: 4 }); P.rtF = rt({ depthBuffer: true }); P.rtF2 = rt(); P.rtQ1 = rt(); P.rtQ2 = rt();
      const quad = (fs, u) => new T.ShaderMaterial({ uniforms: u, vertexShader: POS_VS, fragmentShader: fs, depthTest: false, depthWrite: false });
      P.mBri = quad(`uniform sampler2D tH; uniform vec2 uTx; varying vec2 vUv;
        void main(){ vec3 c = texture2D(tH, vUv + uTx * vec2(-.5,-.5)).rgb + texture2D(tH, vUv + uTx * vec2(.5,-.5)).rgb + texture2D(tH, vUv + uTx * vec2(-.5,.5)).rgb + texture2D(tH, vUv + uTx * vec2(.5,.5)).rgb;
          c *= 0.25; float l = max(c.r, max(c.g, c.b)); gl_FragColor = vec4(c * smoothstep(2.4, 5.5, l), 1.0); }`, { tH: { value: null }, uTx: { value: new T.Vector2() } });
      P.mBlur = quad(`uniform sampler2D tH; uniform vec2 uDir; varying vec2 vUv;
        void main(){ vec4 c = texture2D(tH, vUv) * 0.227; c += (texture2D(tH, vUv + uDir * 1.385) + texture2D(tH, vUv - uDir * 1.385)) * 0.316; c += (texture2D(tH, vUv + uDir * 3.231) + texture2D(tH, vUv - uDir * 3.231)) * 0.07; gl_FragColor = c; }`, { tH: { value: null }, uDir: { value: new T.Vector2() } });
      P.mFin = quad(`uniform sampler2D tC, tF, tG; uniform vec2 uOp; uniform float uSS, uExp, uBl, uAsp, uT; uniform vec3 uIn, uOut; varying vec2 vUv;
        vec3 neutro(vec3 c){ float x = min(c.r, min(c.g, c.b)); float of = x < 0.08 ? x - 6.25 * x * x : 0.04; c -= of; float pk = max(c.r, max(c.g, c.b)); if (pk < 0.76) return c;
          float d = 0.24, np = 1.0 - d * d / (pk + d - 0.76); c *= np / pk; float g = 1.0 - 1.0 / (0.15 * (pk - np) + 1.0); return mix(c, vec3(np), g); }
        vec3 lin(vec3 c){ return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c)); }
        vec3 srgb(vec3 c){ return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }
        void main(){
          vec4 s = uSS > 0.5 ? (texture2D(tC, vUv + uOp * vec2(-.25,-.25)) + texture2D(tC, vUv + uOp * vec2(.25,-.25)) + texture2D(tC, vUv + uOp * vec2(-.25,.25)) + texture2D(tC, vUv + uOp * vec2(.25,.25))) * 0.25 : texture2D(tC, vUv);
          vec4 f = texture2D(tF, vUv);
          vec2 q = (vUv - vec2(0.5, 0.54)) * vec2(uAsp, 1.0); float t = clamp(length(q) / (0.62 * max(uAsp, 1.0)), 0.0, 1.0);
          vec3 base = lin(mix(uIn, uOut, t)) / uExp * (1.0 - f.a) + f.rgb;
          vec3 c = s.rgb + base * (1.0 - s.a) + texture2D(tG, vUv).rgb * uBl;
          c = neutro(max(c * uExp, 0.0));
          vec2 vq = (vUv - 0.5) * vec2(uAsp, 1.0); c *= 1.0 - 0.2 * smoothstep(0.45, 1.1, length(vq));
          c = srgb(clamp(c, 0.0, 1.0)) + (fract(sin(dot(gl_FragCoord.xy + uT, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;
          gl_FragColor = vec4(c, 1.0); }`,
        { tC: { value: null }, tF: { value: null }, tG: { value: null }, uOp: { value: new T.Vector2() }, uSS: { value: 0 }, uExp: { value: .86 }, uBl: { value: .07 }, uAsp: { value: 1 }, uT: { value: 0 },
          uIn: { value: new T.Color(css('--stage-in', '#161D33')) }, uOut: { value: new T.Color(css('--bg', '#0B0F1C')) } });
      // as cores do fundo (tokens em sRGB) vão ao shader como sRGB
      ['uIn', 'uOut'].forEach(k => { const t = { r: 0, g: 0, b: 0 }; new T.Color(k === 'uIn' ? '#212D4C' : '#0C1222').getRGB(t, T.SRGBColorSpace); P.mFin.uniforms[k].value = new T.Vector3(t.r, t.g, t.b); });
      P.quad = new T.Mesh(new T.PlaneGeometry(2, 2), P.mFin); P.quad.frustumCulled = false; P.qScene = new T.Scene(); P.qScene.add(P.quad); P.qCam = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      // camada do fundo: partículas (bokeh) e moléculas ao longe, sempre atrás do modelo (vira com a câmera, com um pouco de paralaxe)
      P.fundo = new T.Scene(); P.grupo = new T.Group(); P.fundo.add(P.grupo);
      const cel = Math.min(innerWidth, innerHeight) < 600, np = cel ? 120 : 260, R = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(97);
      const Pp = new Float32Array(np * 3), S = new Float32Array(np), A = new Float32Array(np), Cc = new Float32Array(np * 3), cP = [[.75, .85, 1], [.9, .95, 1], [1, .85, .7], [.7, .8, 1]];
      for (let i = 0; i < np; i++) { Pp.set([(R() - .5) * 11, (R() - .5) * 7, -2 - R() * 6], i * 3); S[i] = .03 + .1 * R() * R(); A[i] = .2 + .6 * R(); Cc.set(cP[i % 4], i * 3); }
      const gp = new T.BufferGeometry(); gp.setAttribute('position', new T.BufferAttribute(Pp, 3)); gp.setAttribute('aS', new T.BufferAttribute(S, 1)); gp.setAttribute('aA', new T.BufferAttribute(A, 1)); gp.setAttribute('aC', new T.BufferAttribute(Cc, 3));
      P.partU = { uPx: { value: 800 }, uEsc: { value: 1 }, uT: { value: 0 }, uMov: { value: REDUZ ? 0 : 1 } };
      P.part = new T.Points(gp, new T.ShaderMaterial({ uniforms: P.partU, transparent: true, depthWrite: false, depthTest: false, blending: T.AdditiveBlending,
        vertexShader: `attribute float aS; attribute float aA; attribute vec3 aC; uniform float uPx, uEsc, uT, uMov; varying float vA; varying vec3 vC;
          void main(){ vec3 p = position + uMov * vec3(sin(uT * .11 + position.y * 1.3), cos(uT * .09 + position.x * .9), 0.0) * .12;
            vec4 mv = modelViewMatrix * vec4(p, 1.0); float z = max(-mv.z, .1); gl_PointSize = clamp(aS * uEsc * uPx / z * 3.0, 1.5, 40.0);
            vA = aA; vC = aC; gl_Position = projectionMatrix * mv; }`,
        fragmentShader: `varying float vA; varying vec3 vC; void main(){ vec2 q = gl_PointCoord * 2.0 - 1.0; float d = length(q); if (d > 1.0) discard;
          float disc = smoothstep(1.0, 0.75, d), ring = smoothstep(0.6, 0.95, d) * disc; float a = (disc * 0.5 + ring * 0.2) * vA * 0.6; gl_FragColor = vec4(vC * a, a); }` }));
      P.part.frustumCulled = false; P.grupo.add(P.part);
      const mb = new T.MeshStandardMaterial({ roughness: .55, metalness: 0, envMapIntensity: .25, transparent: true, opacity: .55 }), gs = new T.SphereGeometry(1, 24, 16), nb = cel ? 7 : 14;
      P.bolas = new T.InstancedMesh(gs, mb, nb * 3); const m4 = new T.Matrix4(), cor = new T.Color(), cores = ['#5C7CC7', '#7A6BC4', '#4E6DB8', '#D98FB5', '#7FA0E0', '#9AA3B2'];
      let n = 0;
      for (let i = 0; i < nb; i++) {
        const c = [(R() - .5) * 12, (R() - .5) * 7, -4.5 - R() * 5], r = .1 + R() * .12, k = cores[i % cores.length];
        m4.makeScale(r, r, r).setPosition(c[0], c[1], c[2]); P.bolas.setMatrixAt(n, m4); P.bolas.setColorAt(n++, cor.set(k));
        for (let j = 0; j < 2; j++) { const d = [R() - .5, R() - .5, R() - .5], l = Math.hypot(...d) || 1, rs = r * .62; m4.makeScale(rs, rs, rs).setPosition(c[0] + d[0] / l * r * 1.1, c[1] + d[1] / l * r * 1.1, c[2] + d[2] / l * r * 1.1); P.bolas.setMatrixAt(n, m4); P.bolas.setColorAt(n++, cor.set(j ? '#F2F4F8' : '#E86A6A')); }
      }
      P.bolas.count = n; P.grupo.add(P.bolas);
      P.fundo.add(new T.HemisphereLight('#C9D8FF', '#1A2036', .9)); const dl = new T.DirectionalLight('#FFF4E6', 1.2); dl.position.set(-3, 4, 5); P.fundo.add(dl);
      P.ok = true;
    } catch (e) { console.warn('[mol3d] sem pós-processamento:', e.message); }
    return P;
  }
  function renderPos(v, M, dt) {
    const P = v.pos, ren = v.ren, cam = v.cam, T = v.THREE;
    if (!P || !P.ok) { ren.render(v.cena, cam); return; }
    // qualidade adaptativa (a mesma regra do DNA): ignora a carga, só reduz abaixo de cerca de 33 fps, volta a subir com folga
    P.ema = mix(P.ema, Math.min(dt, .1) * 1000, .05); P.idade += dt;
    if (P.idade < 3) { P.lento = 0; P.rapido = 0; }
    else if (P.ema > 30) { P.lento += dt; P.rapido = 0; if (P.lento > 2) { P.esc = Math.max(.75, P.esc * .9); P.lento = 0; } }
    else if (P.ema < 20) { P.rapido += dt; P.lento = 0; if (P.rapido > 1.5 && P.esc < 1) { P.esc = Math.min(1, P.esc * 1.12); P.rapido = 0; } }
    if (!P._dv) P._dv = new T.Vector2(); ren.getDrawingBufferSize(P._dv); const W = P._dv.x, H = P._dv.y;
    const cel = v.w < 700, maxPx = cel ? 2e6 : 5e6, dpr = Math.max(1, W / Math.max(1, v.w)), kMx = dpr < 1.5 ? 2 : 1;
    const k = Math.max(Math.min(1, 1.25 / dpr), Math.min(kMx, Math.sqrt(maxPx / Math.max(1, W * H))) * P.esc), w = Math.max(64, Math.round(W * k)), h = Math.max(64, Math.round(H * k));
    if (w !== P.w || h !== P.h || P.W !== W) { P.w = w; P.h = h; P.W = W; P.rtA.setSize(w, h); P.rtF.setSize(W >> 1, H >> 1); P.rtF2.setSize(W >> 1, H >> 1); P.rtQ1.setSize(w >> 2, h >> 2); P.rtQ2.setSize(w >> 2, h >> 2); }
    const pass = (m, alvo) => { P.quad.material = m; ren.setRenderTarget(alvo); ren.render(P.qScene, P.qCam); };
    const cc = ren.getClearColor(new T.Color()), ca = ren.getClearAlpha(); ren.setClearColor(0x000000, 0);
    // fundo: atrás do modelo, a cerca de 2 a 6 raios; gira com a câmera, com paralaxe leve
    const o = v.orb, R = Math.max(1, M.raio || 4);
    P.grupo.position.set(o.tx, o.ty, o.tz); P.grupo.quaternion.copy(cam.quaternion); P.grupo.rotateY(-o.th * .22); P.grupo.rotateX(o.fi * .15); P.grupo.scale.setScalar(R * 1.15);
    P.partU.uPx.value = (H >> 1) / (2 * Math.tan(cam.fov * Math.PI / 360)); P.partU.uEsc.value = R * 1.15; P.partU.uT.value = performance.now() / 1000;
    const far = cam.far; cam.far = Math.max(far, o.d + R * 12); cam.updateProjectionMatrix();
    P.part.visible = false; ren.setRenderTarget(P.rtF); ren.clear(); ren.render(P.fundo, cam);
    for (let i = 0; i < 2; i++) {
      P.mBlur.uniforms.tH.value = P.rtF.texture; P.mBlur.uniforms.uDir.value.set(1.7 / (W >> 1), 0); pass(P.mBlur, P.rtF2);
      P.mBlur.uniforms.tH.value = P.rtF2.texture; P.mBlur.uniforms.uDir.value.set(0, 1.7 / (H >> 1)); pass(P.mBlur, P.rtF);
    }
    // partículas por cima do fundo já desfocado (discos macios, sem blocos)
    P.part.visible = true; P.bolas.visible = false; const ac = ren.autoClear; ren.autoClear = false; ren.setRenderTarget(P.rtF); ren.render(P.fundo, cam); ren.autoClear = ac; P.bolas.visible = true;
    cam.far = far; cam.updateProjectionMatrix();
    // modelo nítido
    ren.setRenderTarget(P.rtA); ren.clear(); ren.render(v.cena, cam);
    // brilho só nos destaques
    P.mBri.uniforms.tH.value = P.rtA.texture; P.mBri.uniforms.uTx.value.set(2 / w, 2 / h); pass(P.mBri, P.rtQ1);
    P.mBlur.uniforms.tH.value = P.rtQ1.texture; P.mBlur.uniforms.uDir.value.set(4 / w, 0); pass(P.mBlur, P.rtQ2);
    P.mBlur.uniforms.tH.value = P.rtQ2.texture; P.mBlur.uniforms.uDir.value.set(0, 4 / h); pass(P.mBlur, P.rtQ1);
    const F = P.mFin.uniforms; F.tC.value = P.rtA.texture; F.tF.value = P.rtF.texture; F.tG.value = P.rtQ1.texture; F.uOp.value.set(1 / W, 1 / H); F.uSS.value = w > W * 1.2 ? 1 : 0; F.uAsp.value = W / H; F.uT.value = REDUZ ? 0 : performance.now() % 1000;
    pass(P.mFin, null);
    ren.setClearColor(cc, ca);
  }

  // ---------- desenho de um quadro ----------
  const tmp = {};
  function quadro(v, M) {
    const { THREE } = v; if (!tmp.m) Object.assign(tmp, { m: new THREE.Matrix4(), q: new THREE.Quaternion(), s: new THREE.Vector3(), p: new THREE.Vector3(), d: new THREE.Vector3(), x: new THREE.Vector3(1, 0, 0), y: new THREE.Vector3(), z: new THREE.Vector3(), c: new THREE.Color(), c2: new THREE.Color(), cam: new THREE.Vector3(), basis: new THREE.Matrix4() });
    const now = performance.now(), dt = Math.min(.05, (now - v.last) / 1000); v.last = now;
    // modo bola e bastão (0) ou volume (1)
    if (v.modo !== v.modoAlvo) { const s = dt / (dur(280) / 1000); v.modo = v.modoAlvo > v.modo ? Math.min(v.modoAlvo, v.modo + s) : Math.max(v.modoAlvo, v.modo - s); }
    const m = E.move(v.modo);
    // câmera: transição animada, inércia e autorrotação lenta
    const o = v.orb, a = v.alvo;
    if (v.tw) { const k = E.move(clamp((now - v.tw.t0) / v.tw.ms, 0, 1)); for (const n of ['th', 'fi', 'd', 'tx', 'ty', 'tz']) o[n] = mix(v.tw.de[n], v.tw.para[n], k); if (k >= 1) v.tw = null; }
    else {
      if (M.cam) {
        const livre = !v.mexeu || (!v.sel && now - (v.tMexeu || 0) > 12000);
        if (livre) {
          v.mexeu = false; const k = REDUZ || v.camSnap ? 1 : 1 - Math.exp(-dt * 2.6), c = M.cam;
          a.th += ((((c.th - a.th) % TAU) + TAU + Math.PI) % TAU - Math.PI) * k;
          for (const n of ['fi', 'd', 'tx', 'ty', 'tz']) a[n] = mix(a[n], c[n], k);
          if (v.camSnap) { Object.assign(o, a); v.camSnap = false; }
        }
      }
      if (!v.auto && v.girar && !M.cam && !v.sel && !v.tw && now - (v.tMexeu || 0) > 12000) v.auto = true;
      if (v.auto && !REDUZ && !v.pausado) a.th += dt * .16;
      if (M._zoom && !v.mexeu) a.d = REDUZ ? M.fit * M._zoom : mix(a.d, M.fit * M._zoom, 1 - Math.exp(-dt * 2.2));
      if (Math.abs(v.vel) > .002) { a.th += v.vel * dt; v.vel *= Math.exp(-dt * 4); } else v.vel = 0;
      const f = 1 - Math.exp(-dt * 16); for (const n of ['th', 'fi', 'd', 'tx', 'ty', 'tz']) o[n] = mix(o[n], a[n], f);
    }
    const viva = v.auto && !M.cam && !REDUZ && !v.pausado ? 1 : 0, cd = o.d * (1 + .025 * viva * Math.sin(now * .00042)), cf = o.fi + .035 * viva * Math.sin(now * .00027);
    v.cam.position.set(o.tx + cd * Math.cos(cf) * Math.sin(o.th), o.ty + cd * Math.sin(cf), o.tz + cd * Math.cos(cf) * Math.cos(o.th));
    v.cam.up.set(0, 1, 0); v.cam.lookAt(o.tx, o.ty, o.tz); v.cam.near = Math.max(.05, o.d * .02); v.cam.far = o.d + M.raio * 4 + 50; v.cam.updateProjectionMatrix(); v.cam.updateMatrixWorld();
    atualizarMundo(v, M);
    // grupo destacado: as outras peças perdem saturação e escurecem
    const sel = v.sel, gSel = sel && sel.grupo ? sel.grupo : null, aSel = sel && sel.atomo != null && !gSel ? sel.atomo : -1, pSel = sel && sel.ponte != null ? sel.ponte : -1;
    const on = i => (gSel ? M.atomos[i].grupo === gSel : aSel === i), algum = !!sel;
    const cor = (hex, ativo, out) => { out.set(hex); if (algum && !ativo) { const l = out.r * .3 + out.g * .59 + out.b * .11; out.setRGB(mix(out.r, l, .5) * .45, mix(out.g, l, .5) * .45, mix(out.b, l, .5) * .45); } return out; };
    // átomos e halos
    let nh = 0;
    M.atomos.forEach((at, i) => {
      const r = mix(at.r[0], at.r[1], m) * at.escW * at.esc; tmp.s.setScalar(Math.max(1e-4, r)); tmp.m.compose(M.wp[i], tmp.q.identity(), tmp.s); M.mA.setMatrixAt(i, tmp.m);
      if (M.corSuja) M.mA.setColorAt(i, cor(at.cor, on(i), tmp.c));
      if (algum && on(i) && r > .01) { tmp.s.setScalar(r + .14 + r * .08); tmp.m.compose(M.wp[i], tmp.q, tmp.s); M.mH.setMatrixAt(nh++, tmp.m); }
    });
    M.mH.count = nh; M.mA.instanceMatrix.needsUpdate = true; M.mH.instanceMatrix.needsUpdate = true; if (M.corSuja && M.mA.instanceColor) M.mA.instanceColor.needsUpdate = true;
    // ligações: cilindro dividido ao meio na cor de cada átomo; placas (bases) inteiras
    tmp.cam.copy(v.cam.position);
    let nl = 0, np = 0;
    M.ligs.forEach((l, li) => {
      const A = M.wp[l.a], B = M.wp[l.b], sa = M.atomos[l.a].escW * M.atomos[l.a].esc, sb = M.atomos[l.b].escW * M.atomos[l.b].esc, vis = Math.min(sa, sb);
      tmp.d.subVectors(B, A); const len = tmp.d.length();
      if (len < 1e-4) { // peça escondida: instância zerada no mesmo lugar, para não deslocar as cores das seguintes
        tmp.m.makeScale(0, 0, 0);
        if (l.forma === 'placa') { M.mPl.setMatrixAt(np, tmp.m); if (M.corSuja) M.mPl.setColorAt(np, cor(l.cor || M.atomos[l.a].cor, on(l.a), tmp.c)); np++; }
        else for (let k = 0; k < 2 * l.ordem; k++) { M.mL.setMatrixAt(nl, tmp.m); if (M.corSuja) M.mL.setColorAt(nl, cor(l.cor || M.atomos[k % 2 ? l.b : l.a].cor, on(l.a) || on(l.b), tmp.c)); nl++; }
        return;
      }
      tmp.d.multiplyScalar(1 / len);
      if (l.forma === 'placa') {
        tmp.y.set(l.cima[0], l.cima[1], l.cima[2]).transformDirection(M.nos[M.atomos[l.a].no].obj.matrixWorld);
        tmp.y.addScaledVector(tmp.d, -tmp.y.dot(tmp.d)).normalize(); tmp.z.crossVectors(tmp.d, tmp.y);
        tmp.basis.makeBasis(tmp.d, tmp.y, tmp.z); tmp.q.setFromRotationMatrix(tmp.basis);
        tmp.p.copy(A).addScaledVector(tmp.d, len / 2); tmp.s.set(len * (vis > .02 ? 1 : 1e-4), mix(l.esp[0], l.esp[1], m) * vis, mix(l.larg[0], l.larg[1], m) * vis);
        tmp.m.compose(tmp.p, tmp.q, tmp.s); M.mPl.setMatrixAt(np, tmp.m);
        if (M.corSuja) M.mPl.setColorAt(np, cor(l.cor || M.atomos[l.a].cor, on(l.a), tmp.c)); np++; return;
      }
      tmp.q.setFromUnitVectors(tmp.x, tmp.d);
      const rr = l.raio * (1 - m) * vis, n = l.ordem, off = new THREE.Vector3();
      if (n > 1) { off.crossVectors(tmp.d, tmp.p.subVectors(tmp.cam, A)).normalize(); }
      for (let k = 0; k < n; k++) {
        const sh = n > 1 ? (k - (n - 1) / 2) * l.raio * 2.6 : 0, rk = n > 1 ? rr * .72 : rr;
        for (let h = 0; h < 2; h++) {
          tmp.p.copy(A).addScaledVector(tmp.d, len * (h ? .75 : .25)).addScaledVector(off, sh); tmp.s.set(len / 2, Math.max(1e-4, rk), Math.max(1e-4, rk));
          tmp.m.compose(tmp.p, tmp.q, tmp.s); M.mL.setMatrixAt(nl, tmp.m);
          if (M.corSuja) M.mL.setColorAt(nl, cor(l.cor || M.atomos[h ? l.b : l.a].cor, on(l.a) || on(l.b), tmp.c)); nl++;
        }
      }
    });
    M.mL.count = nl; M.mPl.count = np; M.mL.instanceMatrix.needsUpdate = true; M.mPl.instanceMatrix.needsUpdate = true;
    if (M.corSuja) { if (M.mL.instanceColor) M.mL.instanceColor.needsUpdate = true; if (M.mPl.instanceColor) M.mPl.instanceColor.needsUpdate = true; }
    // pontes de hidrogênio: tracejado que se desenha do H para o vizinho conforme k vai de 0 a 1
    let nd = 0;
    M.pontes.forEach((p, i) => {
      const A = M.wp[p.a], B = M.wp[p.b], k = clamp(p.k, 0, 1) * Math.min(M.atomos[p.a].escW, M.atomos[p.b].escW); if (k <= .001) return;
      tmp.d.subVectors(B, A); const len = tmp.d.length(); if (len < 1e-3) return; tmp.d.multiplyScalar(1 / len); tmp.q.setFromUnitVectors(tmp.x, tmp.d);
      const ra = mix(M.atomos[p.a].r[0], M.atomos[p.a].r[1], m) * .85, rb = mix(M.atomos[p.b].r[0], M.atomos[p.b].r[1], m) * .85, ini = Math.min(ra, len * .4), fim = Math.max(len - rb, len * .6), L = fim - ini, sg = L / p.n;
      const vis = k * p.n, rad = (pSel === i ? .09 : .065) * (1 + .4 * m);
      for (let j = 0; j < p.n && j < vis; j++) {
        const f = Math.min(1, vis - j), ds = sg * .55 * f; tmp.p.copy(A).addScaledVector(tmp.d, ini + sg * j + sg * .225 + ds / 2);
        tmp.s.set(Math.max(1e-4, ds / 2), rad, rad); tmp.m.compose(tmp.p, tmp.q, tmp.s); M.mP.setMatrixAt(nd++, tmp.m);
      }
    });
    M.mP.count = nd; M.mP.instanceMatrix.needsUpdate = true;
    M.corSuja = false;
    if (M.render) M.render(v, dt); else renderPos(v, M, dt);
    rotulos(v, M);
    if (v.pairar) { const h = v.pegar(v.pairar[0], v.pairar[1]); v.cvs.classList.toggle('peca', !!h); v.pairar = null; }
  }

  // rótulos HTML: ponto tocável (hotspot) + pastilha com o nome; sem sobreposição; os de trás ficam esmaecidos
  function rotulos(v, M) {
    if (!M.rotEls) {
      v.rot.innerHTML = M.rotulos.map((r, i) => {
        const cor = r.alvo.ponte != null ? PONTE_COR : (M.atomos[r.alvo.atomo].grupo && M.grupos[M.atomos[r.alvo.atomo].grupo].cor) || M.atomos[r.alvo.atomo].cor;
        return `<button type="button" class="m3-r" data-i="${i}" aria-label="${r.texto}: ver detalhe"><span class="p"></span><span class="l"></span><span class="t"><i style="background:${cor}"></i>${r.texto}</span></button>`;
      }).join('');
      M.rotEls = [...v.rot.children];
    }
    const LBon = typeof LB === 'undefined' ? true : LB, max = NARROW() ? 5 : 8, ocup = [], p = tmp.p, cpos = v.cam.position, dAlvo = v.orb.d;
    const ordem = M.rotulos.map((r, i) => i).sort((a, b) => M.rotulos[a].prio - M.rotulos[b].prio);
    let usados = 0;
    ordem.forEach(i => {
      const r = M.rotulos[i], el = M.rotEls[i]; let vis;
      if (r.alvo.ponte != null) { const q = M.pontes[r.alvo.ponte]; p.addVectors(M.wp[q.a], M.wp[q.b]).multiplyScalar(.5); vis = q.k > .6; }
      else { const a = M.atomos[r.alvo.atomo]; p.copy(M.wp[r.alvo.atomo]); vis = a.escW * a.esc > .5; }
      const atras = p.distanceTo(cpos) > dAlvo + M.raio * .25;
      p.project(v.cam); const x = (p.x + 1) / 2 * v.w, y = (1 - p.y) / 2 * v.h;
      vis = vis && p.z < 1 && x > 8 && x < v.w - 8 && y > 8 && y < v.h - 8;
      el.classList.toggle('fora', !vis);
      if (!vis) return;
      let sem = !LBon || usados >= max, esq = false;
      const w = 34 + r.texto.length * 7.4, livre = q => q[0] > 4 && q[0] + q[2] < v.w - 4 && !ocup.some(o => q[0] < o[0] + o[2] + 4 && q[0] + q[2] + 4 > o[0] && q[1] < o[1] + o[3] + 3 && q[1] + q[3] + 3 > o[1]);
      if (!sem) {
        const dir = [x + 20, y - 14, w, 28], esqR = [x - 20 - w, y - 14, w, 28];
        if (livre(dir)) { ocup.push(dir); usados++; } else if (livre(esqR)) { ocup.push(esqR); usados++; esq = true; } else sem = true;
      }
      ocup.push([x - 7, y - 7, 14, 14]);
      const larg = sem ? 0 : el.offsetWidth || (w + 25);
      el.style.transform = `translate3d(${(esq ? x - larg + 5 : x).toFixed(1)}px,${y.toFixed(1)}px,0) translateY(-50%)`;
      el.classList.toggle('sem', sem); el.classList.toggle('esq', esq); el.classList.toggle('atras', atras);
      const s = v.sel, ativo = s && (r.alvo.ponte != null ? s.ponte === r.alvo.ponte : (s.grupo ? M.atomos[r.alvo.atomo].grupo === s.grupo : s.atomo === r.alvo.atomo));
      el.classList.toggle('sel', !!ativo);
    });
  }

  // limpa o modelo da cena anterior
  function descartar(v) {
    const M = v.M; if (!M) return;
    if (M.limpar) try { M.limpar(v); } catch (e) { console.error(e); }
    [M.mA, M.mL, M.mPl, M.mH, M.mP].forEach(m => { if (m) { v.raiz.remove(m); m.dispose && m.dispose(); } }); v.raiz.remove(M._nos.raiz);
    v.M = null; v.rot.innerHTML = ''; v.info.classList.remove('on'); v.sel = null;
  }

  // ---------- a cena: junta o motor 2D (fundo, legenda, controles) com o modelo 3D ----------
  function fundo() {
    const c = document.getElementById('cv'), x = c.getContext('2d'), r = c.getBoundingClientRect(), w = r.width, h = r.height;
    const g = x.createRadialGradient(w / 2, h * .46, 0, w / 2, h * .46, Math.max(w, h) * .62);
    g.addColorStop(0, css('--stage-in', '#161D33')); g.addColorStop(1, css('--bg', '#0B0F1C')); x.fillStyle = g; x.fillRect(0, 0, w, h);
    return { x, w, h };
  }
  function aviso(s) { const { x, w, h } = fundo(); x.font = `600 15px ${css('--f-txt', 'system-ui')}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#9DA9C4'; x.fillText(s, w / 2, h / 2); }

  function cena(o) {
    let estado = 'novo', erro = null; // novo, carregando, pronto, falhou
    const spec = Object.assign({}, o);
    const abrir = () => {
      if (estado === 'falhou') return;
      estado = estado === 'pronto' ? 'pronto' : 'carregando';
      carregar().then(THREE => {
        if (!V) V = criar(THREE);
        estado = 'pronto';
      }).catch(e => { estado = 'falhou'; erro = e; console.warn('[mol3d] sem 3D, usando o desenho plano:', e.message); });
    };
    spec.init = function (S) { if (o.init) o.init.call(this, S); S._p = null; S._t0 = 0; abrir(); };
    spec.sair = function () { if (o.sair) o.sair.call(this); if (V && V.spec === spec) { descartar(V); V.spec = null; V.cvs.classList.remove('on'); V.barra.hidden = true; } };
    spec.draw = function (t, S) {
      if (estado === 'novo') abrir();
      if (estado === 'falhou' || (estado === 'pronto' && !V)) { if (o.plano) return o.plano.call(this, t, S); aviso('O modelo 3D não abriu neste navegador.'); return; }
      if (estado !== 'pronto') { aviso('Carregando o modelo 3D'); return; }
      fundo();
      const v = V;
      if (v.spec !== spec || !v.M) {
        if (v.spec && v.spec.sair) v.spec.sair(); v.spec = spec;
        let M;
        try { M = construtor(v.THREE); o.montar(M); preparar(v, M); }
        catch (e) { console.error(e); estado = 'falhou'; return; }
        v.M = M; v.tam(); v.raiz.add(M._nos.raiz);
        const tg = Math.tan(v.cam.fov * Math.PI / 360), hor = Math.max(M.meia[0], M.meia[2]); M.fit = Math.max(M.meia[1] / (.78 * tg), hor / (.78 * tg * v.cam.aspect)) + hor;
        M.fit *= .84; // enquadramento de cinema: o modelo ocupa mais a tela
        if (M.fitFixo) M.fit = M.fitFixo; if (M.raioFixo) M.raio = M.raioFixo;
        v.barra.querySelector('[data-a=modo]').style.display = M.semVolume ? 'none' : ''; v.camSnap = true;
        const vi = { th: M.vista.th, fi: M.vista.fi, d: M.fit * M.vista.zoom, tx: M.centro[0], ty: M.centro[1], tz: M.centro[2] };
        Object.assign(v.orb, vi); Object.assign(v.alvo, vi); v.tw = null; v.vel = 0; v.auto = v.girar = o.girar !== false; v.mexeu = false; v.tMexeu = 0;
        v.modo = v.modoAlvo = o.modo === 'volume' ? 1 : 0; v.barra.querySelector('[data-a=modo]').setAttribute('aria-pressed', !!v.modoAlvo);
        v.cvs.setAttribute('aria-label', `Modelo 3D: ${o.t}. Arraste para girar; setas giram, mais e menos aproximam, zero volta à vista inicial, Enter percorre as peças e Esc fecha o detalhe.`);
        v.barra.hidden = false; requestAnimationFrame(() => v.cvs.classList.add('on'));
      }
      const M = v.M;
      // passo atual (controle do motor) e tempo dentro do passo
      if (S._p !== S.v) { S._p = S.v; S._t0 = t; }
      const tp = REDUZ && S.paused ? 1e9 : t - S._t0;
      const P = { t, S, passo: Math.round(S.v), tp, pausado: !!S.paused, entre: (a, b) => E.out(clamp((tp - a) / (b - a), 0, 1)), linear: (a, b) => clamp((tp - a) / (b - a), 0, 1), e: E };
      v.pausado = !!S.paused;
      if (o.animar) { try { o.animar(M, P); } catch (e) { console.error(e); } }
      quadro(v, M);
      if (o.legenda && typeof cap === 'function') cap(o.legenda(P));
    };
    return spec;
  }

  const MOL3D = { cena, carregar, EL, E, reduz: REDUZ, cargaMs: null, get visor() { return V; } };
  window.MOL3D = MOL3D;
})();
