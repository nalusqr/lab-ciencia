/* LAB, página inicial (dono: Leo). Sem dependências e sem fetch: abre por duplo clique (file://).
   1. Entrada da capa: uma vez por sessão, nunca com prefers-reduced-motion (a decisão é tomada no <head>).
   2. Vitrine 3D: a imagem fica até a Célula (?embed=1) avisar por postMessage que desenhou.
   3. Trilha e "Para consultar": o trilho se desenha e os cartões entram quando a seção aparece, uma vez só.
   4. Barra do topo: vidro ao rolar e o atalho da seção visível marcado.
   5. Marca a etapa para onde aponta o botão "Começar" e conta etapas e módulos de apoio. */
(function () {
  'use strict';
  var doc = document.documentElement;
  var semEntrada = doc.classList.contains('sem-entrada');
  var reduz = matchMedia('(prefers-reduced-motion: reduce)');
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* 1. Entrada da capa */
  if (!semEntrada) {
    requestAnimationFrame(function () { requestAnimationFrame(function () { doc.classList.add('entrou'); }); });
    try { sessionStorage.setItem('lab-entrada', '1'); } catch (e) {}
  }

  /* 2. Vitrine 3D */
  var palco = $('#palco'), estado = $('#palco-estado'), quadro = null;
  var temWebGL = function () {
    try { var c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); }
    catch (e) { return false; }
  };
  if (palco && temWebGL()) {
    quadro = document.createElement('iframe');
    quadro.className = 'vitrine';
    quadro.title = 'Célula animal em 3D, girando devagar';
    quadro.tabIndex = -1;
    quadro.setAttribute('aria-hidden', 'true');
    quadro.src = 'celula/index.html?embed=1';
    palco.insertBefore(quadro, $('.palco-link', palco));
  } else if (estado) {
    estado.textContent = 'Célula animal, cerca de 20\u00a0µm';
  }
  if (palco && quadro) {
    var pronta = function () {
      if (palco.classList.contains('pronta')) return;
      palco.classList.add('pronta');
      estado.textContent = 'Célula animal, cerca de 20 µm';
    };
    addEventListener('message', function (ev) {
      if (ev.source === quadro.contentWindow && ev.data && ev.data.lab === 'celula-pronta') pronta();
    });
    // Se o 3D não abrir (sem WebGL, por exemplo), a imagem continua; só a legenda deixa de dizer "Carregando".
    setTimeout(function () {
      if (!palco.classList.contains('pronta')) estado.textContent = 'Célula animal, cerca de 20 µm';
    }, 9000);
  }

  /* 5. Etapa inicial e contagens */
  var comecar = $('.acoes .btn.primary');
  if (comecar) {
    var alvo = comecar.getAttribute('href');
    $$('.trilha a.passo').forEach(function (a) {
      if (a.getAttribute('href') !== alvo) return;
      a.closest('.etapa').classList.add('inicio');
      var meta = $('.meta', a), selo = document.createElement('span');
      selo.className = 'badge comece';
      selo.textContent = 'Comece aqui';
      meta.appendChild(document.createTextNode(' '));
      meta.appendChild(selo);
    });
  }
  /* 6. Dioramas 3D nos cards da trilha (piloto: Biologia molecular). A imagem vem da Íris em
     site/assets/dioramas/<id>.webp (e .png, para navegador sem WebP). O card é achado pelo ícone que abas.py
     escreve (#mod-<id>). Se o arquivo não existir, a imagem sai e o card fica como era, só com o ícone.
     Para ligar outro card: acrescente o id nesta lista. */
  var DIORAMAS = ['biologia-molecular'];
  DIORAMAS.forEach(function (id) {
    var use = $('.trilha .passo .meta use[href="#mod-' + id + '"]');
    if (!use) return;
    var passo = use.closest('.passo'), base = 'assets/dioramas/' + id;
    var fig = document.createElement('picture');
    fig.className = 'diorama';
    fig.innerHTML = '<source srcset="' + base + '.webp" type="image/webp">' +
      '<img src="' + base + '.png" alt="" width="640" height="480" decoding="async">';
    var img = fig.querySelector('img');
    img.addEventListener('error', function () { fig.remove(); passo.classList.remove('com-diorama'); });
    img.addEventListener('load', function () { fig.classList.add('carregou'); });
    passo.insertBefore(fig, passo.firstChild);
    passo.classList.add('com-diorama');
  });

  var nEt = $('#n-etapas'), nAp = $('#n-apoio');
  if (nEt) nEt.textContent = $$('.trilha > .etapa').length;
  if (nAp) nAp.textContent = $$('.apoio > .ref').length;

  /* 3. Trilha e apoio entram quando aparecem */
  var listas = $$('.trilha, .apoio');
  listas.forEach(function (l) {
    $$(':scope > .etapa, :scope > .ref', l).forEach(function (el, k) { el.style.setProperty('--k', k); });
  });
  var mostrar = function (l) {
    if (l.classList.contains('vista')) return;
    l.classList.add('vista');
    // depois da entrada, o atraso em cascata sai, para o hover responder na hora
    setTimeout(function () { $$(':scope > *', l).forEach(function (el) { el.classList.add('pronto-ja'); }); }, 1200);
  };
  if (semEntrada || reduz.matches || !('IntersectionObserver' in window)) {
    listas.forEach(mostrar);
  } else {
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { mostrar(en.target); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.01 });
    listas.forEach(function (l) { io.observe(l); });
  }

  /* 4. Barra do topo */
  var barra = $('#barra');
  var rolar = function () { barra.classList.toggle('rolou', scrollY > 8); };
  addEventListener('scroll', rolar, { passive: true });
  rolar();
  if ('IntersectionObserver' in window) {
    var atalhos = $$('.atalhos a');
    var secoes = atalhos.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);
    var vis = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        var a = $('.atalhos a[href="#' + en.target.id + '"]');
        if (!a) return;
        a.classList.toggle('on', en.isIntersecting);
        if (en.isIntersecting) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    secoes.forEach(function (s) { vis.observe(s); });
  }
})();
