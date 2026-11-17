/* LAB Morfofisiologia: "Célula eucarionte" (tipos/euc) mostra a célula animal 3D do módulo Célula, num iframe (?moldura=1).
   Dá para girar, aproximar, tocar nas organelas e ver algumas por dentro. Os botões Nomes e Pausar daqui comandam o iframe
   (postMessage) e a organela tocada aparece num cartão. A cena 2D antiga fica por baixo até o 3D desenhar (e é o plano B). */
'use strict';
(function () {
  (window.MORFO_CENAS = window.MORFO_CENAS || []).push(API => {
    const old = API.SC['tipos/euc']; if (!old) return;
    let fr = null, info = null, pronta = false, ult = '', selK = null, ouvindo = false;
    const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const enviar = d => { try { if (fr && fr.contentWindow) fr.contentWindow.postMessage(Object.assign({ lab: 'celula-cmd' }, d), '*'); } catch (e) { } };
    function aoMsg(e) {
      const d = e.data; if (!fr || !d || e.source !== fr.contentWindow) return;
      if (d.lab === 'celula-pronta') { pronta = true; fr.classList.add('on'); ult = ''; }
      if (d.lab === 'celula-sel') mostrar(d);
    }
    function mostrar(d) {
      if (!info) return; selK = d.k;
      if (!d.k) { info.classList.remove('on'); return; }
      const btn = d.dentro ? `<button class="btn ver" type="button">Ver por dentro, em 3D</button>` : '';
      info.innerHTML = `<div class="h"><i style="background:${esc(d.cor || '#CFE0FF')}"></i>${esc(d.t)}</div><small>${d.vista ? 'em corte; arraste para girar' : d.dentro ? 'toque de novo para ver por dentro' : 'arraste para girar'}</small><p>${esc(d.sub || '')}</p>${btn}<button class="x" type="button" aria-label="Fechar">×</button>`;
      info.classList.add('on');
    }
    const spec = Object.assign({}, old, {
      tip: 'Arraste para girar, use os botões para aproximar e toque numa organela para ver o nome e o que ela faz.',
      init(S) {
        const v = document.getElementById('view'); if (!v) return;
        if (fr) { fr.style.display = ''; if (info) info.style.display = ''; if (!ouvindo) { addEventListener('message', aoMsg); ouvindo = true; } ult = ''; return; }
        fr = document.createElement('iframe'); fr.className = 'cel-fr'; fr.title = 'Célula animal em 3D: arraste para girar e toque nas organelas';
        fr.src = '../celula/index.html?moldura=1#animal'; fr.setAttribute('loading', 'eager');
        const cv = document.getElementById('cv'); (cv && cv.parentNode === v) ? cv.after(fr) : v.prepend(fr);
        info = document.createElement('div'); info.className = 'cel-info'; info.setAttribute('aria-live', 'polite'); v.appendChild(info);
        info.addEventListener('click', e => { if (e.target.closest('.x')) { info.classList.remove('on'); enviar({ limpar: 1 }); } else if (e.target.closest('.ver') && selK) enviar({ abrir: selK }); });
        if (!ouvindo) { addEventListener('message', aoMsg); ouvindo = true; }
        pronta = false; ult = '';
      },
      sair() {
        // o iframe fica carregado (escondido e pausado): voltar à cena é instantâneo e nada é cortado no meio do carregamento
        if (fr) { enviar({ paused: true }); fr.style.display = 'none'; } if (info) { info.classList.remove('on'); info.style.display = 'none'; }
        ult = '';
      },
      draw(t, S) {
        if (!fr || fr.style.display === 'none') spec.init(S);
        const X = API.X, W = API.W, H = API.H;
        if (pronta) { X.clearRect(0, 0, W, H); }
        else old.draw.call(old, t, S);   // a célula 2D fica até o 3D chegar
        const est = (window.LB ? 1 : 0) + ':' + (S.paused ? 1 : 0);
        if (pronta && est !== ult) { ult = est; enviar({ labels: !!window.LB, paused: !!S.paused }); }
      }
    });
    API.SC['tipos/euc'] = spec;
  });
})();
