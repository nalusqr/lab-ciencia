/* LAB, roda de matérias: detalhes do cartão do centro e da faixa de módulos (página inicial; dono: Leo).
   Sem dependências e sem fetch: abre por file://. Não mexe no roda.js: acompanha o que ele escreve no HTML
   (MutationObserver no cartão #painel e na faixa #f-corpo) e completa. Carrega ANTES do roda.js (ver index.html),
   para o observador já existir quando o roda.js escolhe a primeira matéria.
   1. Selo do cartão: número de módulos da matéria, contado nos links do <template id="mods-<matéria>"> (um módulo
      ainda não publicado é cartão sem link e não conta). O selo vem com hidden no HTML e só aparece já contado.
      Matéria sem template: selo "Em breve" e o botão deixa de ser o principal (leva à nota "em preparo").
   2. "Você parou aqui": ao abrir um módulo pela faixa ou pelo botão do cartão (na Matemática ele abre o primeiro
      módulo), o endereço fica em localStorage ("lab-ultimo"). Na hora do clique só grava: Ctrl+clique e clique do
      meio abrem outra aba e deixam o aluno aqui, e a grade não pode pular. A marca (selo e contorno) aparece quando a
      página carrega, na volta pelo histórico (pageshow) e quando a faixa troca de matéria.
   3. Entrada dos cartões: quando a faixa aparece na tela, eles chegam em sequência, uma vez por sessão,
      nunca com prefers-reduced-motion. Na impressão eles aparecem sempre (roda.css). */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var painel = $('#painel'), selo = $('#m-selo'), mBtn = $('#m-btn'), mNome = $('#m-nome'), corpo = $('#f-corpo');
  if (!painel || !corpo) return;
  var ler = function (k, ss) { try { return (ss ? sessionStorage : localStorage).getItem(k); } catch (e) { return null; } };
  var gravar = function (k, v, ss) { try { (ss ? sessionStorage : localStorage).setItem(k, v); } catch (e) {} };

  /* ---------- 1. selo do cartão do centro ---------- */
  function cartao() {
    var id = (painel.getAttribute('aria-labelledby') || '').replace(/^tab-/, '');
    var tpl = document.getElementById('mods-' + id);
    var n = tpl && tpl.content ? tpl.content.querySelectorAll('a.ref').length : 0;
    if (selo) {
      selo.textContent = n ? n + (n === 1 ? ' módulo' : ' módulos') : 'Em breve';
      selo.classList.toggle('breve', !n);
      selo.hidden = false;
    }
    if (mBtn) {
      // Na abertura (o cartão ainda sem .troca) o botão já nasce no estado certo, sem os 150 ms de transição do âmbar
      // para o escuro; nas trocas feitas pelo aluno o roda.js põe .troca e a transição continua. Só força o layout
      // quando a classe muda de fato.
      if (mBtn.classList.contains('primary') !== !!n) {
        var sem = !painel.classList.contains('troca');
        if (sem) mBtn.style.transition = 'none';
        mBtn.classList.toggle('primary', !!n);
        if (sem) { void mBtn.offsetWidth; mBtn.style.transition = ''; }
      }
      if (!n) mBtn.textContent = 'Ver o que está em preparo';
      else if (mNome) mBtn.textContent = 'Estudar ' + mNome.textContent;
    }
  }

  /* ---------- 2. "Você parou aqui" ---------- */
  var CHAVE = 'lab-ultimo';
  function marcar() {
    var ult = ler(CHAVE);
    Array.prototype.forEach.call(corpo.querySelectorAll('a.ref'), function (a) {
      var on = !!ult && a.getAttribute('href') === ult, li = a.parentNode, s = $('.parou', a);
      li.classList.toggle('aqui', on);
      if (on && !s) {
        s = document.createElement('span'); s.className = 'parou'; s.textContent = 'Você parou aqui';
        var txt = $(':scope > span', a) || a;   // no texto do cartão, acima da etapa e do nome
        txt.insertBefore(s, txt.firstChild);
      } else if (!on && s) s.parentNode.removeChild(s);
    });
  }
  var naFaixa = function (h) {
    return Array.prototype.some.call(corpo.querySelectorAll('a.ref'), function (a) { return a.getAttribute('href') === h; });
  };
  var guardar = function (h) { if (h && h.charAt(0) !== '#') gravar(CHAVE, h); };   // só grava; ver o item 2 acima
  var outroBotao = function (ev) { return ev.type === 'auxclick' && ev.button !== 1; };   // auxclick que não é o do meio
  var daFaixa = function (ev) {
    var a = !outroBotao(ev) && ev.target.closest && ev.target.closest('a.ref');
    if (a) guardar(a.getAttribute('href'));
  };
  var doBotao = function (ev) {
    var h = mBtn.getAttribute('href');
    if (!outroBotao(ev) && naFaixa(h)) guardar(h);
  };
  corpo.addEventListener('click', daFaixa);
  corpo.addEventListener('auxclick', daFaixa);
  if (mBtn) { mBtn.addEventListener('click', doBotao); mBtn.addEventListener('auxclick', doBotao); }
  addEventListener('pageshow', function (e) { if (e.persisted) marcar(); });   // volta pelo histórico (bfcache)

  /* ---------- 3. entrada dos cartões, uma vez ---------- */
  var reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var entra = !reduz && !ler('lab-cartoes', true) && 'IntersectionObserver' in window;
  function numerar() {
    Array.prototype.forEach.call(corpo.querySelectorAll('.mods>li'), function (li, k) { li.style.setProperty('--k', Math.min(k, 12)); });
  }
  if (entra) {
    corpo.classList.add('esperando');
    var io = new IntersectionObserver(function (es) {
      if (!es.some(function (e) { return e.isIntersecting; })) return;
      io.disconnect();
      gravar('lab-cartoes', '1', true);
      numerar();
      void corpo.offsetWidth;
      corpo.classList.remove('esperando'); corpo.classList.add('entrando');
      setTimeout(function () { corpo.classList.remove('entrando'); }, 1400);
    }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });
    io.observe(corpo);
  }

  new MutationObserver(cartao).observe(painel, { attributes: true, attributeFilter: ['aria-labelledby'] });
  new MutationObserver(function () { marcar(); if (corpo.classList.contains('entrando')) numerar(); }).observe(corpo, { childList: true });
  cartao(); marcar();
})();
