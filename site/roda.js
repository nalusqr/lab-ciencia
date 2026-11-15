/* LAB, roda de matérias (página inicial; dono: Leo). Sem dependências e sem fetch: abre por file://.
   O conteúdo (matérias, descrições, módulos) está no HTML; este arquivo só dá o comportamento.
   - Estado: "pos", contínuo, em unidades de matéria. A matéria escolhida é round(pos) no círculo de 9.
   - Computador e tablet: anel. Arrastar gira pelo ângulo em volta do centro.
   - Celular (até 699 px): arco. Arrastar de lado gira; a página continua rolando na vertical.
   - Roda do mouse e setas (padrão de abas: Setas, Home e End) trocam a matéria. Clique numa matéria leva até ela.
   - Movimento reduzido: sem giro animado e sem entrada; a troca é imediata. */
(function () {
  'use strict';
  var doc = document.documentElement;
  var reduz = matchMedia('(prefers-reduced-motion: reduce)');
  var celular = matchMedia('(max-width: 699px)');
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var roda = $('#roda'), lista = $('#itens'), itens = $$('.item', lista), N = itens.length;
  var segs = $('#segs'), ret = $('#reticulo'), centro = $('#painel');
  var mNome = $('#m-nome'), mDesc = $('#m-desc'), mBtn = $('#m-btn'), mPos = $('#m-pos');
  var fTit = $('#f-titulo'), fSub = $('#f-sub'), fCorpo = $('#f-corpo');
  if (!roda || !N) return;
  var PASSO = 2 * Math.PI / N;          // anel: 360/N graus por matéria
  var NS = 'http://www.w3.org/2000/svg';

  /* ---------- anel em SVG (segmentos e retículo) ---------- */
  var arco = function (r1, r2, a0, a1) {
    var p = function (r, a) { return (r * Math.sin(a)).toFixed(1) + ' ' + (-r * Math.cos(a)).toFixed(1); };
    return 'M' + p(r2, a0) + 'A' + r2 + ' ' + r2 + ' 0 0 1 ' + p(r2, a1) + 'L' + p(r1, a1) + 'A' + r1 + ' ' + r1 + ' 0 0 0 ' + p(r1, a0) + 'Z';
  };
  var gSeg = [];
  itens.forEach(function (it, i) {
    var p = document.createElementNS(NS, 'path'), fol = 0.012;
    p.setAttribute('d', arco(214, 344, i * PASSO - PASSO / 2 + fol, i * PASSO + PASSO / 2 - fol));
    segs.appendChild(p); gSeg.push(p);
    it.addEventListener('mouseenter', function () { p.classList.add('hv'); });
    it.addEventListener('mouseleave', function () { p.classList.remove('hv'); });
  });
  (function () {   // retículo fixo: marcas a cada 5 graus, maiores a cada 40, e um círculo interno
    var c = document.createElementNS(NS, 'circle'); c.setAttribute('r', 204); ret.appendChild(c);
    for (var g = 0; g < 360; g += 5) {
      var a = g * Math.PI / 180, m = false, r0 = 350, r1 = m ? 360 : 355, l = document.createElementNS(NS, 'line');
      l.setAttribute('x1', (r0 * Math.sin(a)).toFixed(1)); l.setAttribute('y1', (-r0 * Math.cos(a)).toFixed(1));
      l.setAttribute('x2', (r1 * Math.sin(a)).toFixed(1)); l.setAttribute('y2', (-r1 * Math.cos(a)).toFixed(1));
      if (m) l.setAttribute('class', 'm');
      ret.appendChild(l);
    }
    for (var k = 0; k < N; k++) {   // marcas maiores no centro de cada matéria
      var ak = k * PASSO, lk = document.createElementNS(NS, 'line');
      lk.setAttribute('x1', (350 * Math.sin(ak)).toFixed(1)); lk.setAttribute('y1', (-350 * Math.cos(ak)).toFixed(1));
      lk.setAttribute('x2', (360 * Math.sin(ak)).toFixed(1)); lk.setAttribute('y2', (-360 * Math.cos(ak)).toFixed(1));
      lk.setAttribute('class', 'm'); ret.appendChild(lk);
    }
  })();

  /* ---------- estado e desenho ---------- */
  var mod = function (n) { return ((n % N) + N) % N; };
  var difs = function (i, p) { var d = mod(i - p); return d > N / 2 ? d - N : d; };   // em [-N/2, N/2)
  var ini = itens.findIndex ? itens.findIndex(function (it) { return it.getAttribute('aria-selected') === 'true'; }) : 1;
  var hashId = (location.hash || '').slice(1);
  itens.forEach(function (it, i) { if (it.dataset.id === hashId) ini = i; });
  if (ini < 0) ini = 0;
  var pos = ini, alvo = ini, atual = -1, geo = {};

  function medir() {
    var r = roda.getBoundingClientRect(), li = lista.getBoundingClientRect();
    geo.arco = celular.matches;
    geo.w = r.width; geo.lw = li.width;
    geo.R = r.width * 279 / 720;                      // raio da linha dos itens no anel (o SVG tem 720 de lado)
    geo.RA = 450; geo.passoA = 122 / 450;             // arco do celular: raio e passo (cerca de 122 px entre itens)
    var dica = document.getElementById('dica');
    if (dica) dica.textContent = geo.arco ? 'Arraste o arco para o lado ou toque numa matéria.' : 'Arraste a roda, use a roda do mouse ou as setas do teclado.';
  }
  function desenhar() {
    for (var i = 0; i < N; i++) {
      var d = difs(i, pos), it = itens[i], x, y, op = 1;
      if (geo.arco) {
        var a = d * geo.passoA;
        x = geo.lw / 2 + geo.RA * Math.sin(a) - 52;          // 52 = metade da largura do item
        y = 60 + geo.RA * (1 - Math.cos(a)) - 48;            // centro do diorama (80 px) sobre a linha do arco, a 60 px do topo
        op = Math.max(0, Math.min(1, 1.9 - Math.abs(d) * 0.55));
        it.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      } else {
        var b = d * PASSO;
        x = geo.R * Math.sin(b); y = -geo.R * Math.cos(b);
        it.style.transform = 'translate(calc(-50% + ' + x.toFixed(1) + 'px), calc(-50% + ' + y.toFixed(1) + 'px))';
      }
      it.style.opacity = op < 1 ? op.toFixed(2) : '';
      it.style.pointerEvents = op <= 0 ? 'none' : '';   // sem visibility:hidden, para o foco nunca se perder no meio do giro
    }
    segs.setAttribute('transform', 'rotate(' + (-pos * 360 / N).toFixed(2) + ')');
    var sel = mod(Math.round(pos));
    if (sel !== atual) escolher(sel);
  }

  /* ---------- painel: cartão do centro e faixa de módulos ---------- */
  function escolher(i) {
    var prim = atual === -1;
    atual = i;
    itens.forEach(function (it, k) {
      var on = k === i;
      it.classList.toggle('on', on);
      it.setAttribute('aria-selected', on ? 'true' : 'false');
      it.tabIndex = on ? 0 : -1;
      gSeg[k].classList.toggle('on', on);
    });
    var it = itens[i], nome = $('.nm', it).textContent, id = it.dataset.id;
    centro.setAttribute('aria-labelledby', it.id);
    mPos.textContent = 'Matéria ' + (i + 1) + ' de ' + N;
    mNome.textContent = nome;
    mDesc.textContent = it.dataset.desc;
    mBtn.textContent = 'Estudar ' + nome;
    mBtn.setAttribute('href', it.dataset.href);
    fTit.textContent = 'Módulos de ' + nome;
    var tpl = $('#mods-' + id);
    fCorpo.innerHTML = '';
    if (tpl) {
      fCorpo.appendChild(tpl.content.cloneNode(true));
      fSub.textContent = id === 'biologia'
        ? 'As etapas seguem a ordem da ementa. Os módulos de apoio servem para consultar a qualquer momento.'
        : 'Os módulos de ' + nome + ' já abertos para você estudar.';
    } else {
      fSub.textContent = 'A equipe está preparando os módulos de ' + nome + '.';
      var box = document.createElement('div');
      box.className = 'preparo';
      box.innerHTML = '<p>Os módulos de ' + nome + ' estão sendo preparados, com 3D e animações como os de Biologia. ' +
        'Enquanto isso, você pode estudar Biologia e Química.</p><div class="acoes-p">' +
        '<button type="button" class="btn" data-ir="biologia">Ver Biologia</button>' +
        '<button type="button" class="btn" data-ir="quimica">Ver Química</button></div>';
      fCorpo.appendChild(box);
    }
    if (!prim && !reduz.matches) {
      [centro, fCorpo].forEach(function (el) { el.classList.remove('troca'); void el.offsetWidth; el.classList.add('troca'); });
    }
    try { history.replaceState(null, '', '#' + id); } catch (e) {}
  }
  fCorpo.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-ir]');
    if (!b) return;
    var i = itens.findIndex(function (it) { return it.dataset.id === b.getAttribute('data-ir'); });
    if (i < 0) return;
    ir(i);
    roda.scrollIntoView({ behavior: reduz.matches ? 'auto' : 'smooth', block: 'center' });
    itens[i].focus({ preventScroll: true });
  });
  // "Estudar X" sem página própria: leva à faixa de módulos
  mBtn.addEventListener('click', function (ev) {
    if (mBtn.getAttribute('href') !== '#modulos') return;
    ev.preventDefault();
    $('#modulos').scrollIntoView({ behavior: reduz.matches ? 'auto' : 'smooth', block: 'start' });
  });

  /* ---------- animação ---------- */
  var raf = 0, tAnt = 0;
  function animar(t) {
    var dt = Math.min(64, t - (tAnt || t)); tAnt = t;
    var k = 1 - Math.exp(-dt / 90);            // aproximação exponencial: cerca de 400 ms até parar
    pos += (alvo - pos) * k;
    if (Math.abs(alvo - pos) < 0.002) { pos = alvo; raf = 0; tAnt = 0; desenhar(); return; }
    desenhar();
    raf = requestAnimationFrame(animar);
  }
  function irPara(p) {
    alvo = p;
    // foco e seleção sempre na mesma matéria: se o foco está na roda, ele vai junto para o destino
    var f = document.activeElement;
    if (f && f.classList && f.classList.contains('item')) {
      var d = itens[mod(Math.round(alvo))];
      if (d !== f) d.focus({ preventScroll: true });
    }
    if (reduz.matches) { pos = alvo; desenhar(); return; }
    if (!raf) raf = requestAnimationFrame(animar);
  }
  function ir(i) { irPara(Math.round(pos) + difs(i, Math.round(pos))); }   // pelo caminho mais curto
  function passo(n) { irPara(Math.round(alvo) + n); }

  /* ---------- arrastar (mouse e toque) ---------- */
  var arr = null, LIMIAR = 6;
  var angulo = function (e) {
    var r = roda.getBoundingClientRect();
    return Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2)));
  };
  roda.addEventListener('pointerdown', function (e) {
    if (e.button !== 0 || e.target.closest('.centro')) return;
    arr = { x: e.clientX, y: e.clientY, a: angulo(e), p0: pos, mov: false, id: e.pointerId, hist: [[performance.now(), pos]] };
  });
  roda.addEventListener('pointermove', function (e) {
    if (!arr || e.pointerId !== arr.id) return;
    var dx = e.clientX - arr.x, dy = e.clientY - arr.y;
    if (!arr.mov) {
      if (Math.hypot(dx, dy) < LIMIAR) return;
      if (geo.arco && Math.abs(dy) > Math.abs(dx)) { arr = null; return; }   // no celular, gesto vertical é rolagem
      arr.mov = true;
      try { roda.setPointerCapture(e.pointerId); } catch (er) {}
      roda.classList.add('arrastando');
      if (raf) { cancelAnimationFrame(raf); raf = 0; tAnt = 0; }
    }
    if (geo.arco) {
      pos = arr.p0 - dx / (geo.RA * geo.passoA);
    } else {
      var da = angulo(e) - arr.a;
      if (da > Math.PI) da -= 2 * Math.PI; else if (da < -Math.PI) da += 2 * Math.PI;
      if (Math.abs(da) > Math.PI / 2) { arr.a = angulo(e); arr.p0 = pos; da = 0; }   // volta inteira: reancora
      pos = arr.p0 - da / PASSO;
    }
    alvo = pos;
    arr.hist.push([performance.now(), pos]); if (arr.hist.length > 6) arr.hist.shift();
    desenhar();
  });
  var soltar = function (e) {
    if (!arr || e.pointerId !== arr.id) return;
    var foi = arr.mov, h = arr.hist; arr = null;
    roda.classList.remove('arrastando');
    if (!foi) return;   // foi um clique: o "click" do item cuida
    var v = 0;          // velocidade (matérias por ms) dos últimos movimentos, para o giro continuar um pouco
    if (h.length > 1) { var a = h[0], b = h[h.length - 1]; if (b[0] > a[0]) v = (b[1] - a[1]) / (b[0] - a[0]); }
    var ext = Math.max(-2, Math.min(2, v * 180));
    irPara(Math.round(pos + ext));
    ignorarClique = true; setTimeout(function () { ignorarClique = false; }, 0);
  };
  var ignorarClique = false;
  roda.addEventListener('pointerup', soltar);
  roda.addEventListener('pointercancel', soltar);

  itens.forEach(function (it, i) {
    it.addEventListener('click', function (e) {
      if (ignorarClique) { e.preventDefault(); return; }
      ir(i);
    });
  });

  /* ---------- roda do mouse ---------- */
  var acum = 0, ultimo = 0;
  roda.addEventListener('wheel', function (e) {
    if (e.target.closest('.centro') || e.ctrlKey) return;
    var d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (geo.arco && Math.abs(e.deltaY) >= Math.abs(e.deltaX)) return;   // no celular, a rolagem vertical é da página
    e.preventDefault();
    acum += d * (e.deltaMode === 1 ? 32 : 1);
    var agora = performance.now();
    if (Math.abs(acum) >= 48 && agora - ultimo > 140) { passo(acum > 0 ? 1 : -1); acum = 0; ultimo = agora; }
  }, { passive: false });

  /* ---------- teclado (padrão de abas) ---------- */
  lista.addEventListener('keydown', function (e) {
    var n = null, cur = mod(Math.round(alvo));   // pelo destino, não pelo que está no meio do giro
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = mod(cur + 1);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = mod(cur - 1);
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = N - 1;
    if (n === null) return;
    e.preventDefault();
    if (e.key === 'Home' || e.key === 'End') ir(n); else passo(n === mod(cur + 1) ? 1 : -1);
    itens[n].focus({ preventScroll: true });
  });

  /* ---------- tamanho, entrada e barra ---------- */
  medir(); desenhar();
  addEventListener('resize', function () { medir(); desenhar(); });
  if (celular.addEventListener) celular.addEventListener('change', function () { medir(); desenhar(); });
  addEventListener('hashchange', function () {
    var id = location.hash.slice(1);
    itens.forEach(function (it, i) { if (it.dataset.id === id && i !== atual) ir(i); });
  });
  // Entrada: uma vez por sessão, a roda dá um giro curto até a matéria inicial (mostra que ela gira)
  if (!doc.classList.contains('sem-entrada')) {
    pos = ini - 2.5; desenhar();
    setTimeout(function () { irPara(ini); }, 150);
    try { sessionStorage.setItem('lab-roda', '1'); } catch (e) {}
  }

  var barra = $('#barra');
  if (barra) {
    var rolar = function () { barra.classList.toggle('rolou', scrollY > 8); };
    addEventListener('scroll', rolar, { passive: true }); rolar();
  }
})();
