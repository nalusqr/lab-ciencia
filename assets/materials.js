/*
 * LAB · Ciência em movimento — biblioteca de materiais 3D (three.js)
 * Feita pela equipe (artista), seguindo o guia de estilo, seções 2.3, 5 e 6.
 *
 * Uso:
 *   <script src="../assets/materials.js"></script>
 *   const MAT = window.LAB_MATERIALS(THREE);
 *   const m = MAT.organela(MAT.CORES.mitocondria);
 *
 * Testado com three.js 0.187 (o do vendor/r3f.js). Não depende de nada além de THREE.
 *
 * Regras que esta biblioteca garante:
 * - A cor vem sempre por parâmetro (a cor da família), nunca fixa dentro do material.
 * - Nada brilha sozinho: emissive começa em 0 e só sobe na seleção (selecionar()).
 * - Organela é fosca (cera/argila), membrana é translúcida com brilho de borda.
 * - Cada material guarda a cor original em userData.cor0, para dessaturar e voltar.
 */
window.LAB_MATERIALS = THREE => {
  'use strict';

  // ---------- paleta científica (guia 2.3) ----------
  const CORES = {
    nucleo: '#9A6BFF', nucleolo: '#6A45D8',          // informação genética
    membrana: '#F06AAE',                              // membranas, envelope nuclear, mielina
    parede: '#A9C54A',                                // celulose, peptidoglicano, parede de levedura
    mitocondria: '#F25C3B',                           // energia
    cloroplasto: '#3FBF6A', grana: '#2A9450',         // fotossíntese
    reticulo: '#4B7BFF',                              // síntese de proteínas
    golgi: '#F7C13B',                                 // empacotamento
    ribossomo: '#FFE1A6',                             // ribossomos, grânulos
    lisossomo: '#2FCFBF',                             // digestão e defesa química
    vacuolo: '#2A9FC9',                               // água e reserva (sempre translúcido)
    citoesqueleto: '#CFE0FF',                         // citoesqueleto, flagelo, cílios, pili
    citoplasma: '#2A1E3D',                            // recheio (translúcido)
    hemacia: '#D7303B',                               // cor real (hemoglobina)
    capsideo: '#B9C2D3',                              // vírus: cinza-prata, para não parecer célula
    cpk: { C: '#9AA3B2', H: '#F2F4F8', O: '#FF4D4D', N: '#4D7DFF', S: '#F2D24B', P: '#FF9A3C' },
    bases: { A: '#39E58C', T: '#FF4F6D', G: '#FFC53D', C: '#3FA9FF', U: '#C77DFF' }
  };

  const cor = c => (c && c.isColor) ? c.clone() : new THREE.Color(c);
  const branco = new THREE.Color('#ffffff');

  // Guarda a cor de partida e a família, para selecionar()/dessaturar() funcionarem.
  function marca(m, familia) {
    m.userData.cor0 = m.color.clone();
    m.userData.familia = familia;
    return m;
  }

  // ---------- relevo sutil (mapa de normal feito por nós, por ruído) ----------
  // Gerado uma vez e reaproveitado por todas as organelas. 128 px, repetível (tile).
  let _relevo = null;
  function relevo() {
    if (_relevo) return _relevo;
    const N = 128, alt = new Float32Array(N * N);
    // ruído de valor em 3 oitavas, com grade periódica para não aparecer emenda
    const hash = (x, y, p) => { const s = Math.sin(((x % p + p) % p) * 127.1 + ((y % p + p) % p) * 311.7) * 43758.5453; return s - Math.floor(s); };
    const suave = t => t * t * (3 - 2 * t);
    function ruido(x, y, p) {
      const xi = Math.floor(x), yi = Math.floor(y), fx = suave(x - xi), fy = suave(y - yi);
      const a = hash(xi, yi, p), b = hash(xi + 1, yi, p), c = hash(xi, yi + 1, p), d = hash(xi + 1, yi + 1, p);
      return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
    }
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      let h = 0, amp = 1, f = 8;
      for (let o = 0; o < 3; o++) { h += amp * ruido(x * f / N, y * f / N, f); amp *= .5; f *= 2; }
      alt[y * N + x] = h;
    }
    const px = new Uint8Array(N * N * 4), forca = 2.2;
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const h = (i, j) => alt[((j + N) % N) * N + ((i + N) % N)];
      const dx = (h(x + 1, y) - h(x - 1, y)) * forca, dy = (h(x, y + 1) - h(x, y - 1)) * forca;
      const l = Math.hypot(dx, dy, 1), i = (y * N + x) * 4;
      px[i] = (-dx / l * .5 + .5) * 255; px[i + 1] = (-dy / l * .5 + .5) * 255; px[i + 2] = (1 / l * .5 + .5) * 255; px[i + 3] = 255;
    }
    const t = new THREE.DataTexture(px, N, N, THREE.RGBAFormat);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.colorSpace = THREE.NoColorSpace;   // mapa de normal é dado, não cor
    t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter;
    t.needsUpdate = true;
    return (_relevo = t);
  }

  // =====================================================================
  // FÁBRICAS
  // =====================================================================

  /**
   * Membrana: translúcida, deixa ver o interior. Use junto com borda(cor) na
   * mesma geometria para o brilho de borda (é ele que faz parecer membrana).
   * op.modo: 'vidro' (transmission, mais bonito, mais caro) ou 'leve' (opacidade,
   * para celular ou quando há muitas camadas). Padrão: 'leve' se op.leve.
   */
  function membrana(c = CORES.membrana, op = {}) {
    const k = cor(c), leve = op.leve || op.modo === 'leve';
    const m = new THREE.MeshPhysicalMaterial(Object.assign({
      color: k,
      roughness: leve ? .45 : .3, // guia: 0,45. No modo vidro fica em 0,3: acima disso a transmissão borra o interior
      metalness: 0,              // material biológico nunca é metal
      sheen: .5,                 // "veludo" na borda: reforça a silhueta sem brilho de plástico
      sheenRoughness: .5,
      sheenColor: k.clone().lerp(branco, .35),
      clearcoat: .25,            // fina película úmida
      clearcoatRoughness: .4,
      side: THREE.DoubleSide,    // vê-se a membrana por fora e por dentro (no corte)
      depthWrite: false,         // não esconde o que está dentro
      emissive: k.clone(), emissiveIntensity: 0
    }, leve ? {
      transparent: true,
      opacity: .45                // guia: 0,35 a 0,55
    } : {
      transmission: .6,          // guia: 0,3 a 0,6 (no máximo: menos que isso a cor cobre o interior)
      thickness: .35,            // membrana fina: pouca refração
      ior: 1.4,                  // perto do índice de uma bicamada lipídica
      attenuationColor: k.clone(), attenuationDistance: 1.5,
      transparent: true, opacity: 1
    }, op.extra));
    return marca(m, 'membrana');
  }

  /**
   * Organela: fosca, aparência de cera ou argila, relevo sutil.
   * op.relevo: força do mapa de normal (0 desliga). op.repetir: repetição do relevo.
   */
  function organela(c, op = {}) {
    const k = cor(c), rel = op.relevo ?? .22;
    const m = new THREE.MeshPhysicalMaterial(Object.assign({
      color: k,
      roughness: .65,            // guia: 0,55 a 0,75. Fosco
      metalness: 0,
      sheen: .35,                // aspecto de cera: brilho suave e colorido na borda
      sheenRoughness: .7,
      sheenColor: k.clone().lerp(branco, .25),
      clearcoat: 0,              // nada de plástico brilhante
      specularIntensity: .6,     // reflexo especular contido
      emissive: k.clone(), emissiveIntensity: 0
    }, op.extra));
    if (rel > 0) {
      m.normalMap = relevo();
      m.normalScale = new THREE.Vector2(rel, rel);
      const r = op.repetir || 2; m.normalMap.repeat.set(r, r);
    }
    return marca(m, 'organela');
  }

  /**
   * Vidro: capsídeo de vírus, vacúolo, vesícula cheia de líquido.
   * Transparência real com tom na espessura. Para o vacúolo use CORES.vacuolo.
   */
  function vidro(tom = CORES.vacuolo, op = {}) {
    const k = cor(tom);
    const m = new THREE.MeshPhysicalMaterial(Object.assign({
      color: branco.clone(),
      transmission: 1,           // passa luz de verdade
      thickness: .8,
      roughness: .18,            // levemente fosco: lembra gel, não cristal
      ior: 1.33,                 // água
      attenuationColor: k, attenuationDistance: 2.4,   // o tom aparece mais onde é mais grosso
      clearcoat: 1, clearcoatRoughness: .15,
      specularIntensity: .9,
      metalness: 0,
      side: THREE.FrontSide,
      emissive: k.clone(), emissiveIntensity: 0
    }, op.extra));
    m.userData.tom = k.clone();
    return marca(m, 'vidro');
  }

  /**
   * Película: estrutura translúcida dentro de outra membrana (envelope nuclear,
   * vesículas pequenas, citoplasma). Barata: só opacidade.
   */
  function pelicula(c, opacidade = .35, op = {}) {
    const k = cor(c);
    const m = new THREE.MeshPhysicalMaterial(Object.assign({
      color: k, transparent: true, opacity: opacidade,
      roughness: .4, metalness: 0,
      clearcoat: .4, clearcoatRoughness: .3,
      side: THREE.DoubleSide, depthWrite: false,
      emissive: k.clone(), emissiveIntensity: 0
    }, op.extra));
    return marca(m, 'pelicula');
  }

  /** Citoplasma: ameixa escuro translúcido, quase invisível, só dá "volume". */
  function citoplasma(op = {}) {
    return pelicula(CORES.citoplasma, op.opacidade ?? .28, { extra: Object.assign({ roughness: .8, clearcoat: 0 }, op.extra) });
  }

  /**
   * Corte: a face cortada de uma estrutura. Um tom mais escuro e plano,
   * para o aluno entender que é um corte (guia 5, "Interior em corte").
   */
  function corte(c, op = {}) {
    const k = cor(c).multiplyScalar(op.escurecer ?? .62);
    const m = new THREE.MeshStandardMaterial(Object.assign({
      color: k,
      roughness: .9,             // plano, sem reflexo
      metalness: 0,
      side: THREE.DoubleSide,
      polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1, // evita tremido com a casca
      emissive: k.clone(), emissiveIntensity: 0
    }, op.extra));
    return marca(m, 'corte');
  }

  /** Átomo (moléculas, convenção CPK): liso e um pouco mais brilhante que organela. */
  function atomo(elemento, op = {}) {
    const c = CORES.cpk[elemento] || elemento;
    return organela(c, { relevo: 0, extra: Object.assign({ roughness: .4, sheen: .2, clearcoat: .3, clearcoatRoughness: .4 }, op.extra) });
  }

  /** Base do DNA (cores do módulo 01). A letra continua escrita no rótulo HTML. */
  function base(letra, op = {}) {
    return organela(CORES.bases[letra] || letra, Object.assign({ relevo: .12 }, op));
  }

  // ---------- brilho de borda (Fresnel), shader próprio ----------
  const VERT = `
    varying vec3 vN; varying vec3 vV;
    #include <common>
    #include <clipping_planes_pars_vertex>
    void main(){
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      #ifdef USE_INSTANCING
        mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
      #endif
      vN = normalize(normalMatrix * normal);
      vV = normalize(-mvPosition.xyz);
      gl_Position = projectionMatrix * mvPosition;
      #include <clipping_planes_vertex>
    }`;
  const FRAG = `
    uniform vec3 uCor; uniform float uInt; uniform float uPot;
    varying vec3 vN; varying vec3 vV;
    #include <clipping_planes_pars_fragment>
    void main(){
      #include <clipping_planes_fragment>
      float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), uPot);
      gl_FragColor = vec4(uCor * f * uInt, f * uInt);
      #include <colorspace_fragment>
    }`;

  /**
   * Borda: brilho de borda aditivo na cor da família. Aplique numa cópia da
   * malha (mesma geometria, escala 1,0 a 1,01) por cima da membrana.
   * intensidade 0,6 a 1,2; potencia 2 (borda larga) a 4 (borda fina).
   */
  function borda(c = CORES.membrana, intensidade = .9, potencia = 2.6) {
    const m = new THREE.ShaderMaterial({
      uniforms: { uCor: { value: cor(c) }, uInt: { value: intensidade }, uPot: { value: potencia } },
      vertexShader: VERT, fragmentShader: FRAG,
      transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
      clipping: true             // respeita os planos de corte do renderer
    });
    m.userData.cor0 = cor(c); m.userData.familia = 'borda';
    return m;
  }

  /**
   * Halo de seleção: brilho de borda branco e suave, mais largo.
   * Use numa cópia da malha com escala 1,04, ligada só quando a peça está selecionada.
   */
  function halo(c = '#ffffff', intensidade = 1.1) {
    const m = borda(c, intensidade, 1.8);
    m.side = THREE.BackSide;     // por trás: forma um contorno em volta da peça
    m.userData.familia = 'halo';
    return m;
  }

  // =====================================================================
  // ESTADOS (seleção e dessaturação, guia 5 "Brilho")
  // =====================================================================

  /** Liga ou desliga o realce de seleção (um leve emissivo na própria cor). */
  function selecionar(m, ligado = true) {
    if (!m || !('emissiveIntensity' in m)) return m;
    m.emissiveIntensity = ligado ? .18 : 0;
    return m;
  }

  /**
   * Tira saturação da cor (padrão 40%, como pede o guia) enquanto outra peça
   * está selecionada. quanto = 0 volta à cor original.
   */
  const _hsl = {};
  function dessaturar(m, quanto = .4) {
    if (!m) return m;
    const alvo = m.isShaderMaterial ? m.uniforms.uCor.value : m.color;
    const c0 = m.userData.cor0; if (!alvo || !c0) return m;
    alvo.copy(c0);
    if (quanto > 0) { alvo.getHSL(_hsl); alvo.setHSL(_hsl.h, _hsl.s * (1 - quanto), _hsl.l); }
    if (m.attenuationColor && m.userData.tom) {
      m.attenuationColor.copy(m.userData.tom);
      if (quanto > 0) { m.attenuationColor.getHSL(_hsl); m.attenuationColor.setHSL(_hsl.h, _hsl.s * (1 - quanto), _hsl.l); }
    }
    return m;
  }
  const restaurar = m => dessaturar(m, 0);

  // =====================================================================
  // LUZ DO "LABORATÓRIO" (guia 5, "Luz") — a mesma em todos os módulos
  // =====================================================================

  /**
   * Devolve um THREE.Group com as três luzes do guia. Para o ambiente, use
   * RoomEnvironment com PMREMGenerator e scene.environmentIntensity perto de 0,4.
   * escala: multiplica todas as intensidades (ajuste fino por módulo).
   */
  function luzes(escala = 1) {
    const g = new THREE.Group(); g.name = 'luzes-lab';
    const principal = new THREE.DirectionalLight('#FFF4E6', 2.2 * escala);  // morna, de cima e da esquerda, 45°
    principal.position.set(-5, 5, 5);
    const preenche = new THREE.DirectionalLight('#CFE0FF', .66 * escala);   // fria, da direita, 30% da principal
    preenche.position.set(6, 1, 3);
    const contorno = new THREE.DirectionalLight('#FFFFFF', 1.4 * escala);   // por trás: desenha a borda
    contorno.position.set(0, 3, -6);
    const amb = new THREE.HemisphereLight('#CFE0FF', '#161D33', .25 * escala); // sobra suave nas sombras
    g.add(principal, preenche, contorno, amb);
    return g;
  }

  /**
   * Fundo do palco como malha (degradê radial #161D33 no centro para #0B0F1C
   * nas bordas, guia 2.1). Por que malha e não scene.background: o passe de
   * transmissão do three.js só "vê" objetos, não o scene.background. Sem isto,
   * um vidro solto na frente do fundo (capsídeo do fago) fica preto.
   * fov: o campo de visão vertical da câmera, em graus (guia: 30 a 35).
   */
  function fundoPalco(fov = 32, raio = 80) {
    const m = new THREE.ShaderMaterial({
      uniforms: {
        uCentro: { value: new THREE.Color('#161D33') },
        uBorda: { value: new THREE.Color('#0B0F1C') },
        uMeia: { value: THREE.MathUtils.degToRad(fov) * .5 }
      },
      vertexShader: `varying vec3 vD;
        void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vD = mv.xyz; gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `uniform vec3 uCentro; uniform vec3 uBorda; uniform float uMeia; varying vec3 vD;
        void main(){
          float a = acos(clamp(-normalize(vD).z, -1.0, 1.0)) / uMeia;   // 0 no centro da tela, 1 na borda de cima
          float t = smoothstep(0.0, 1.5, a);                            // 1,5: chega à cor da borda nos cantos
          gl_FragColor = vec4(mix(uCentro, uBorda, t), 1.0);
          #include <colorspace_fragment>
        }`,
      side: THREE.BackSide, depthWrite: false, fog: false, toneMapped: false
    });
    const o = new THREE.Mesh(new THREE.SphereGeometry(raio, 32, 16), m);
    o.name = 'fundo-palco'; o.renderOrder = -1; o.frustumCulled = false;
    o.raycast = () => {};                    // não atrapalha o clique nas organelas
    o.onBeforeRender = (r, s, cam) => { o.position.copy(cam.position); };   // sempre centrado na câmera
    return o;
  }

  /** Ajustes do renderer pedidos pelo guia (tone mapping, saída sRGB). */
  function configurarRenderer(gl) {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    return gl;
  }

  /** Libera o mapa de relevo compartilhado (ao sair do módulo). */
  function liberar() { if (_relevo) { _relevo.dispose(); _relevo = null; } }

  return {
    CORES,
    membrana, organela, vidro, pelicula, citoplasma, corte, atomo, base,
    borda, halo,
    selecionar, dessaturar, restaurar,
    luzes, fundoPalco, configurarRenderer, relevo, liberar
  };
};
