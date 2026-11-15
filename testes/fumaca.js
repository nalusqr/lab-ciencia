// Teste de fumaça do LAB (dono: Prometeu). Abre cada página por file://, como a usuária abre (duplo clique),
// e falha se aparecer erro de console ou exceção na página. Na Célula, percorre as 8 células e os 12 detalhes
// pelo hash e confere que o canvas 3D e os pontos/rótulos aparecem. Também valida a página de teste de modelos.
// Na Embriologia, na Histologia, na Taxonomia e nos Vírus (canvas 2D), percorre todas as rotas por window.LAB_EMBRIO / LAB_HISTO / LAB_TAXO / LAB_VIRUS e confere que cada uma desenha sem erro.
// Uso: ver testes/LEIA-ME.md.   node testes/fumaca.js [filtro]   (filtro: parte do nome da página, ex.: celula)
const path = require('path');
const { pathToFileURL } = require('url');

const EDGE = process.env.LAB_NAVEGADOR === 'msedge';
// No container: o Playwright já instalado. No PC da usuária (Windows): playwright-core + o Edge do sistema.
const { chromium } = EDGE ? require('playwright-core') : require('playwright');

const RAIZ = path.resolve(__dirname, '..');
const url = (rel, hash = '') => pathToFileURL(path.join(RAIZ, rel)).href + hash;
const LENTO = 90000;          // WebGL no container é SwiftShader (CPU): tudo é lento
const FILTRO = process.argv[2] || '';

const PAGINAS = [
  ['início', 'site/index.html'],
  ['biologia', 'site/biologia/index.html'],   // página da Biologia, com a trilha (a página inicial virou a roda de matérias)
  ['dna', 'site/dna/index.html'],
  ['tabela-periodica', 'site/tabela-periodica/index.html'],
  ['moleculas', 'site/moleculas/index.html'],
  ['biomoleculas', 'site/biomoleculas/index.html'],
  ['celula', 'site/celula/index.html'],
  ['morfofisiologia', 'site/morfofisiologia/index.html'],
  ['embriologia', 'site/embriologia/index.html'],   // canvas 2D; percorre todas as rotas por window.LAB_EMBRIO
  ['histologia', 'site/histologia/index.html'],     // canvas 2D, mesmo motor; percorre todas as rotas por window.LAB_HISTO
  ['taxonomia', 'site/taxonomia/index.html'],       // canvas 2D, mesmo motor; percorre todas as rotas por window.LAB_TAXO
  ['virus', 'site/virus/index.html'],               // canvas 2D, mesmo motor; percorre todas as rotas por window.LAB_VIRUS
  ['microrganismos', 'site/microrganismos/index.html'],   // canvas 2D, mesmo motor; window.LAB_MICRO
  ['plantas-animais', 'site/plantas-animais/index.html'],
  ['anatomia', 'site/anatomia/index.html'],   // canvas 2D, mesmo motor; window.LAB_ANATOMIA
  ['evolucao', 'site/evolucao/index.html'],   // canvas 2D, mesmo motor; window.LAB_EVOLUCAO
  ['ecologia', 'site/ecologia/index.html'],
];
// módulos novos: entram sozinhos quando estiverem marcados como prontos em scripts/modulos.json (ver scripts/abas.py)
try {
  for (const m of JSON.parse(require('fs').readFileSync(path.join(RAIZ, 'scripts', 'modulos.json'), 'utf8')).modulos)
    if (m.pronto && !PAGINAS.some(p => p[0] === m.id) && require('fs').existsSync(path.join(RAIZ, 'site', m.pasta, 'index.html')))
      PAGINAS.push([m.id, `site/${m.pasta}/index.html`]);
} catch (e) { console.log('AVISO  não li scripts/modulos.json: ' + e.message); }
const CELULAS = ['animal', 'vegetal', 'bacteria', 'neuronio', 'esperma', 'levedura', 'sangue', 'fago'];
const DETALHES = ['nucleo', 'mitocondria', 'cloroplasto', 're', 'golgi', 'lisossomo', 'ribossomo', 'membrana',
  'citoesqueleto', 'centriolo', 'peroxissomo', 'vacuolo'];

const resultados = [];
function registrar(nome, ok, detalhe, ms) {
  resultados.push({ nome, ok, detalhe, ms });
  console.log(`${ok === null ? 'AVISO' : ok ? 'ok   ' : 'FALHA'}  ${nome}${ms != null ? `  (${(ms / 1000).toFixed(1)} s)` : ''}${detalhe ? '  ' + detalhe : ''}`);
}

// abre uma aba que anota todo erro de console, exceção não tratada e arquivo que não carregou
// o Chromium com SwiftShader às vezes cai no container; se cair, abre outro e segue (a página em curso conta como falha)
let navegador = null;
const lancar = async () => (navegador = EDGE ? await chromium.launch({ channel: 'msedge' }) : await chromium.launch());
async function abrir() {
  if (!navegador || !navegador.isConnected()) { if (navegador) console.log('       (o navegador caiu; abrindo de novo)'); await lancar(); }
  const ctx = await navegador.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  page.erros = [];
  page.on('console', m => { if (m.type() === 'error') page.erros.push('console: ' + m.text()); });
  page.on('pageerror', e => page.erros.push('pageerror: ' + (e.stack || e.message || e).toString().split('\n').slice(0, 3).join(' | ')));
  page.on('requestfailed', r => page.erros.push('arquivo não carregou: ' + r.url().replace(pathToFileURL(RAIZ).href, '') + ' (' + (r.failure() || {}).errorText + ')'));
  page.setDefaultTimeout(LENTO);
  return { ctx, page };
}
const errosNovos = (page, desde) => page.erros.slice(desde);
const quadros = (page, n = 3) => page.evaluate(n => new Promise(r => { let i = 0; const f = () => (++i >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);

async function paginaSimples(nome, rel) {
  const t0 = Date.now(); const { ctx, page } = await abrir();
  try {
    await page.goto(url(rel), { waitUntil: 'commit', timeout: LENTO });
    await page.waitForLoadState('load', { timeout: LENTO });
    await page.waitForTimeout(2500);   // deixa scripts iniciais e o primeiro desenho rodarem
    const e = page.erros;
    registrar(nome, e.length === 0, e.slice(0, 5).join(' || '), Date.now() - t0);
  } catch (err) { registrar(nome, false, 'não abriu: ' + err.message.split('\n')[0] + (page.erros.length ? ' || ' + page.erros.slice(0, 3).join(' || ') : ''), Date.now() - t0); }
  await ctx.close();
}

// módulos de canvas 2D com rotas por hash (motor da Bioenergética): abre e percorre cada rota pela API da página
// (window[api].rotas e .ir), conferindo que não surgiu erro e que o canvas desenhou algo em cada uma
const ROTAS_2D = { embriologia: 'LAB_EMBRIO', histologia: 'LAB_HISTO', taxonomia: 'LAB_TAXO', virus: 'LAB_VIRUS', microrganismos: 'LAB_MICRO', 'plantas-animais': 'LAB_PLANTAS', anatomia: 'LAB_ANATOMIA', evolucao: 'LAB_EVOLUCAO' };
async function paginaRotas(nome, rel, api) {
  const t0 = Date.now(); const { ctx, page } = await abrir();
  let rotas = [];
  try {
    await page.goto(url(rel), { waitUntil: 'commit', timeout: LENTO });
    await page.waitForFunction(a => window[a] && window[a].rotas && window[a].rotas.length, api, { timeout: LENTO });
    await page.waitForLoadState('load', { timeout: LENTO });
    rotas = await page.evaluate(a => window[a].rotas.slice(), api);
    registrar(`${nome}: abre (${rotas.length} rotas)`, page.erros.length === 0, page.erros.slice(0, 5).join(' || '), Date.now() - t0);
  } catch (err) {
    registrar(`${nome}: abre`, false, err.message.split('\n')[0] + ' || ' + page.erros.slice(0, 5).join(' || '), Date.now() - t0);
    await ctx.close(); return;
  }
  for (const r of rotas) {
    const t = Date.now(), desde = page.erros.length;
    try {
      await page.evaluate(([a, k]) => window[a].ir(k), [api, r]);
      await quadros(page, 4);
      const pintou = await page.evaluate(() => {
        const c = document.getElementById('cv'); if (!c || !c.width || !c.height) return false;
        const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
        for (let i = 3; i < d.length; i += 4 * 97) if (d[i]) return true; return false;
      });
      const e = errosNovos(page, desde);
      registrar(`${nome} #${r}`, e.length === 0 && pintou, (pintou ? '' : 'canvas vazio ') + e.slice(0, 5).join(' || '), Date.now() - t);
    } catch (err) { registrar(`${nome} #${r}`, false, err.message.split('\n')[0] + ' || ' + errosNovos(page, desde).slice(0, 5).join(' || '), Date.now() - t); }
  }
  await ctx.close();
}

async function celula(rel) {
  const t0 = Date.now(); const { ctx, page } = await abrir();
  try {
    await page.goto(url(rel, '#animal'), { waitUntil: 'commit', timeout: LENTO });
    await page.waitForSelector('#stage canvas', { state: 'attached', timeout: LENTO });
    registrar('celula: abre e cria o canvas', page.erros.length === 0, page.erros.slice(0, 5).join(' || '), Date.now() - t0);
  } catch (err) {
    registrar('celula: abre e cria o canvas', false, err.message.split('\n')[0] + ' || ' + page.erros.slice(0, 5).join(' || '), Date.now() - t0);
    await ctx.close(); return;
  }
  let antes = await page.textContent('#iT');
  const passo = async (hash, detalhe) => {
    const t = Date.now(), desde = page.erros.length;
    try {
      const mesmo = await page.evaluate(h => { if (location.hash === '#' + h) return true; location.hash = h; return false; }, hash);
      // o painel muda de título quando a cena troca (se a página já abriu nesse hash, não há troca a esperar)
      if (!mesmo) await page.waitForFunction(a => { const e = document.getElementById('iT'); return e && e.textContent && e.textContent !== a; }, antes, { timeout: LENTO });
      antes = await page.textContent('#iT');
      // pontos clicáveis (.hs) na célula inteira; rótulos (.dl) e botão Voltar no detalhe: sinal de que a cena 3D montou
      await page.waitForFunction(d => {
        const c = document.querySelector('#stage canvas'); if (!c || !c.width || !c.height) return false;
        if (d) { const b = document.getElementById('back'); return b && getComputedStyle(b).display !== 'none' && document.querySelectorAll('#stage .dl').length > 0; }
        return document.querySelectorAll('#stage .hs').length > 0;
      }, detalhe, { timeout: LENTO });
      await quadros(page);
      const e = errosNovos(page, desde);
      registrar(`celula #${hash} (${antes.trim()})`, e.length === 0, e.slice(0, 5).join(' || '), Date.now() - t);
    } catch (err) {
      registrar(`celula #${hash}`, false, err.message.split('\n')[0] + ' || ' + errosNovos(page, desde).slice(0, 5).join(' || '), Date.now() - t);
    }
  };
  for (const c of CELULAS) await passo(c, false);
  for (const d of DETALHES) await passo(d, true);
  await ctx.close();
}

async function testeModelo() {
  // 1) o modelo real, carregado sob demanda (a página não traz o .glb.js; carregarModelo injeta a tag)
  {
    const t0 = Date.now(); const { ctx, page } = await abrir();
    const nome = 'celula: teste-modelo.html (mitocôndria do Blender, sob demanda)';
    try {
      await page.goto(url('site/celula/fonte/teste-modelo.html'), { waitUntil: 'commit', timeout: LENTO });
      await page.waitForFunction(() => document.body && document.body.dataset.status !== 'carregando', null, { timeout: LENTO });
      const r = await page.evaluate(() => window.TESTE_MODELO || { status: document.body.dataset.status });
      if (r.status === 'sem-modelo') registrar(nome, null, 'sem .glb.js: o site fica com a versão procedural', Date.now() - t0);
      else registrar(nome, r.status === 'ok' && r.sobDemanda === true && page.erros.length === 0,
        `${r.status}; sob demanda: ${r.sobDemanda}; peças: ${(r.pecas || []).join(', ')}; ${r.ms} ms` + (page.erros.length ? ' || ' + page.erros.slice(0, 5).join(' || ') : ''), Date.now() - t0);
    } catch (err) { registrar(nome, false, err.message.split('\n')[0] + ' || ' + page.erros.slice(0, 5).join(' || '), Date.now() - t0); }
    await ctx.close();
  }
  // 2) modelo que não existe: deve cair na versão procedural sem pedir arquivo (o índice evita o erro de console)
  {
    const t0 = Date.now(); const { ctx, page } = await abrir();
    const nome = 'celula: teste-modelo.html?modelo=inexistente (volta ao procedural, sem erro)';
    try {
      await page.goto(url('site/celula/fonte/teste-modelo.html', '?modelo=inexistente'), { waitUntil: 'commit', timeout: LENTO });
      await page.waitForFunction(() => document.body && document.body.dataset.status !== 'carregando', null, { timeout: LENTO });
      const r = await page.evaluate(() => window.TESTE_MODELO || { status: document.body.dataset.status });
      registrar(nome, r.status === 'sem-modelo' && !r.injetado && page.erros.length === 0,
        `${r.status}; injetou .glb.js: ${!!r.injetado}` + (page.erros.length ? ' || ' + page.erros.slice(0, 5).join(' || ') : ''), Date.now() - t0);
    } catch (err) { registrar(nome, false, err.message.split('\n')[0] + ' || ' + page.erros.slice(0, 5).join(' || '), Date.now() - t0); }
    await ctx.close();
  }
}

(async () => {
  const t0 = Date.now();
  const browser = await lancar();
  console.log(`Navegador: ${EDGE ? 'Edge (msedge)' : 'Chromium do Playwright'} ${browser.version()}\n`);
  try {
    for (const [nome, rel] of PAGINAS) {
      if (FILTRO && !nome.includes(FILTRO)) continue;
      if (nome === 'celula') { await celula(rel); await testeModelo(); }
      else if (ROTAS_2D[nome]) await paginaRotas(nome, rel, ROTAS_2D[nome]);
      else await paginaSimples(nome, rel);
    }
  } finally { if (navegador) await navegador.close().catch(() => {}); }
  const falhas = resultados.filter(r => r.ok === false), avisos = resultados.filter(r => r.ok === null);
  console.log(`\n${resultados.length - falhas.length - avisos.length} ok, ${falhas.length} falha(s), ${avisos.length} aviso(s) em ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  process.exit(falhas.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
