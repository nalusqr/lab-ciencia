/* LAB: figura de IA por padrão e botão para alternar com a cena 3D (Aurelius).
   Usa o visor figura-ia.js v2. Para cada rota que já tem cena 3D (Martin), embrulha o draw: o aluno abre na figura
   (vistas A e B, pontos, zoom) e escolhe "Ver em 3D" ou "Ver figura" numa barrinha logo abaixo do palco.
   O 3D e o plano B 2D seguem como estavam: só entram quando o aluno pede (o pacote do 3D não carrega antes disso).
   Uso: LAB_FIGALT.cena({ SC, X, W, H, tela, t(args), cap, esconder, esconderFig }, 'sec/id', { nome, vistas, hs, mask, caixa, sobre, manter }).
   - SC: tabela de cenas do módulo; X(), W(), H(): contexto e tamanho do canvas; tela: elemento do palco
   - t(args): tempo em segundos a partir dos argumentos do draw (cada motor passa coisas diferentes)
   - plano(o3, args): desenha o 2D antigo da cena (usado só nas cenas com "manter")
   - rot3d / dica3d (opcionais): rótulo do botão da cena antiga (padrão 'Ver em 3D') e a dica ao lado (padrão 'Arraste para girar o modelo'); rotas sem 3D usam 'Ver esquema'
   - esconder: seletores escondidos enquanto a figura está na tela (controles que só valem para o 3D)
   - manter(W, H, nar): retângulo da figura quando a cena antiga continua desenhada em volta (barras, linha do tempo, gráfico)
   Texto na tela: sem "!", sem setas ou pontos como separador. */
'use strict';
(function () {
  if (window.LAB_FIGALT) return;
  const RED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ICO = {
    fig: '<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="9" cy="10" r="1.8"/><path d="m4 17 5-4.5 3.5 3L16 12l4 4.5"/>',
    d3: '<path d="M12 3 4 7.5v9L12 21l8-4.5v-9z"/><path d="M4 7.5 12 12l8-4.5M12 12v9"/>'
  };
  const svg = k => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${ICO[k]}</svg>`;

  let barra = null, ativa = null, marca = false, falta = 0, estiloOk = false;
  function estilo() {
    if (estiloOk) return; estiloOk = true;
    const st = document.createElement('style'); st.id = 'fa-css';
    st.textContent = `.fa-barra{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8px;padding:6px;border:1px solid var(--line,rgba(255,255,255,.1));border-bottom:0;background:var(--panel,#131A2B)}
.fa-barra[hidden]{display:none}
.fa-barra .seg2{display:inline-flex;gap:4px;padding:3px;border-radius:12px;border:1px solid var(--line-strong,rgba(255,255,255,.18));background:var(--panel-2,#1A2238)}
.fa-barra button{font:inherit;font-size:14px;font-weight:600;display:inline-flex;align-items:center;justify-content:center;gap:8px;height:40px;min-width:44px;padding:0 16px;border-radius:9px;border:1px solid transparent;background:transparent;color:var(--txt-dim,var(--txt,#C8D1E6));cursor:pointer;transition:background 160ms,color 160ms,border-color 160ms}
.fa-barra button svg{width:20px;height:20px;flex:none}
.fa-barra button:hover{color:var(--txt,#fff)}
.fa-barra button[aria-pressed="true"]{color:var(--amber,#FFB347);border-color:var(--amber,#FFB347);background:var(--panel,#131A2B)}
.fa-barra button:focus-visible{outline:2px solid var(--amber,#FFB347);outline-offset:2px}
.fa-barra .dica{font-size:13px;color:var(--txt-dim,#9DA9C4)}
@media(max-width:699px){.fa-barra .dica{display:none}.fa-barra button{padding:0 12px}}
@media(prefers-reduced-motion:reduce){.fa-barra button{transition:none}}`;
    document.head.appendChild(st);
  }
  function montar(tela, amb) {
    estilo();
    barra = document.createElement('div'); barra.className = 'fa-barra'; barra.hidden = true; barra.setAttribute('role', 'group'); barra.setAttribute('aria-label', 'Modo de visualização');
    barra.innerHTML = `<div class="seg2"><button type="button" data-m="fig" aria-pressed="true">${svg('fig')}<span>Ver figura</span></button><button type="button" data-m="d3" aria-pressed="false">${svg('d3')}<span>${(amb && amb.rot3d) || 'Ver em 3D'}</span></button></div><span class="dica" aria-live="polite"></span>`;
    barra.addEventListener('click', e => { const b = e.target.closest('button[data-m]'); if (b && ativa) ativa.modo(b.dataset.m); });
    tela.after(barra);
  }
  // some a barra e devolve os controles quando nenhuma cena com figura desenha por 3 quadros
  function vigia() {
    if (ativa) { if (marca) { marca = false; falta = 0; } else if (++falta >= 3) { ativa.sair(); } }
    requestAnimationFrame(vigia);
  }
  requestAnimationFrame(vigia);

  function esconder(sels, on) {
    (sels || []).forEach(s => document.querySelectorAll(s).forEach(el => { if (on) { if (el._fa == null) el._fa = el.style.display; el.style.display = 'none'; } else if (el._fa != null) { el.style.display = el._fa; el._fa = null; } }));
  }

  function cena(amb, chave, cfg) {
    const o3 = amb.SC[chave]; if (!o3 || !window.LAB_FIGIA) return;
    const draw3 = o3.draw, sair3 = o3.sair, init3 = o3.init;
    let modo = 'fig', ultimo = null, aberta3d = false;
    const FIG = LAB_FIGIA({
      nome: cfg.nome, mask: cfg.mask === undefined ? { miolo: .78, borda: .99 } : cfg.mask,
      vistas: cfg.vistas.map(v => v[4] ? { id: v[0], img: cfg.pref + '-' + v[1], nome: v[2], recorte: v[4] } : { id: v[0], img: cfg.pref + '-' + v[1], nome: v[2] }), hs: cfg.hs
    });
    const legenda = {}; cfg.vistas.forEach(v => { legenda[v[0]] = v[3]; });
    const ctl = {
      sair() { // a cena deixou de desenhar (outra rota): volta tudo ao normal
        if (barra) barra.hidden = true; esconder(amb.esconder, false); esconder(amb.esconderFig, false);
        ativa = null;
      },
      modo(m) {
        if (m === modo) return;
        modo = m;
        barra.querySelectorAll('button[data-m]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.m === m)));
        if (m === 'd3') {
          FIG.fechar(); FIG.desligar();
          if (amb.ao3d) amb.ao3d();
          if (init3 && ultimo && !aberta3d) init3.call(o3, ultimo);
          aberta3d = true;
        } else {
          if (sair3) { try { sair3.call(o3); } catch (e) { console.error(e); } }
          aberta3d = false;
        }
        barra.querySelector('.dica').textContent = m === 'd3' ? (amb.dica3d != null ? amb.dica3d : 'Arraste para girar o modelo') : '';
      }
    };
    const desenhaFigura = function (args) {
      const X = amb.X(), W = amb.W(), H = amb.H(), nar = amb.nar ? amb.nar() : W < 600, t = amb.t(args);
      let box;
      if (cfg.oculto) { X.save(); X.beginPath(); X.rect(0, 0, 0, 0); X.clip(); try { amb.plano(o3, args); } catch (e) { console.error(e); } X.restore(); }   // roda a cena antiga sem pintar: mantém o relógio e a legenda dela
      if (cfg.manter) { try { amb.plano(o3, args); } catch (e) { console.error(e); } box = cfg.manter(W, H, nar); X.clearRect(box.x, box.y, box.w, box.h); }
      else { const x0 = nar ? 6 : 24, y0 = nar ? 46 : 60, bx = cfg.reserva ? cfg.reserva(nar) : (amb.baixo ? amb.baixo(nar) : (nar ? 56 : 52)); box = { x: x0, y: y0, w: W - 2 * x0, h: H - y0 - bx }; }
      X.save();
      const R = FIG.desenhar(X, box, { vista: undefined, sobre: cfg.sobre ? R => cfg.sobre(R, X, t, { W, H, nar, args, S: args[1] }) : null });
      X.restore();
      if (cfg.fora) { X.save(); try { cfg.fora(X, t, { W, H, nar, args, S: args[1] }); } catch (e) { console.error(e); } X.restore(); }
      if (!cfg.manter && !cfg.oculto && amb.cap) amb.cap(legenda[FIG.vistaAtual] || '');
      return R;
    };
    o3.draw = function (...args) {
      if (!barra) montar(amb.tela, amb);
      if (ativa !== ctl) { if (ativa) ativa.sair(); ativa = ctl; barra.querySelectorAll('button[data-m]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.m === modo))); barra.querySelector('.dica').textContent = modo === 'd3' ? (amb.dica3d != null ? amb.dica3d : 'Arraste para girar o modelo') : ''; }
      marca = true; barra.hidden = false; ultimo = args[1] && typeof args[1] === 'object' ? args[1] : ultimo;
      if (amb.tela.nextSibling !== barra) amb.tela.after(barra);
      if (modo === 'd3') { esconder(amb.esconder, false); esconder(amb.esconderFig, false); return draw3.apply(this, args); }
      esconder(amb.esconder, true); if (!cfg.manter && !cfg.ctl) esconder(amb.esconderFig, true);
      desenhaFigura(args);
    };
    o3.init = function (S) { ultimo = S; if (modo === 'd3' && init3) init3.call(this, S); };
    o3.sair = function () { ctl.sair(); if (modo === 'd3' || aberta3d) { if (sair3) { try { sair3.call(this); } catch (e) { console.error(e); } } } modo = 'fig'; aberta3d = false; FIG.desligar(); };
    o3.figura = FIG;
  }
  window.LAB_FIGALT = { cena, RED };
})();
