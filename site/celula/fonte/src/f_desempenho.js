// ================= DESEMPENHO: qualidade adaptativa para notebook fraco · dono: Prometeu =================
// Concatenado DEPOIS de e_modelos.js, dentro do mesmo IIFE. O único nome solto é DESEMPENHO (o resto fica
// fechado dentro da função abaixo). Só depende de window.R3F; funciona também fora do IIFE.
// ATENÇÃO: nunca escreva aqui "<" seguido de "/script", nem em comentário (fecha a tag inline do index.html).
//
// O que faz: mede os quadros por segundo (FPS) nos primeiros segundos de 3D. Se a média ficar abaixo de ~30,
// desce um nível de qualidade e mede de novo; no máximo três degraus. Só desce, nunca sobe (evita ficar oscilando).
// Depois de duas medições boas seguidas, para de medir (custo zero).
//
//   nível    dpr (resolução do canvas)   efeitos caros (sombras de contato, Sparkles)   materiais
//   alto     [1,2] (o de hoje)           ligados                                        completos
//   medio    1                           desligados                                     completos
//   baixo    0.75                        desligados                                     simplificados (ver simplificar)
//   minimo   0.5 (imagem mais borrada)   desligados                                     simplificados
//
// API
//   DESEMPENHO.nivel          'alto' | 'medio' | 'baixo' | 'minimo'
//   DESEMPENHO.dpr            valor pronto para a prop dpr do Canvas do R3F
//   DESEMPENHO.efeitos        true só no nível alto: use para montar ou não ContactShadows, Sparkles e afins
//   DESEMPENHO.fps            última média medida (null antes da primeira)
//   DESEMPENHO.aoMudar(fn)    chama fn(nivel) a cada mudança; devolve uma função que cancela a inscrição
//   DESEMPENHO.definir(nivel) força um nível e para de medir (botão de qualidade, testes)
//   DESEMPENHO.medir()        mede de novo (ex.: depois de abrir uma cena mais pesada)
//   DESEMPENHO.simplificar(mats)  nos níveis baixo e minimo, zera clearcoat e sheen (brilhos extras) dos materiais da lista;
//                             nos outros níveis, devolve os valores originais. Pode chamar a cada render: é barato.
//   Na URL, ?qualidade=alto|medio|baixo|minimo fixa o nível (não mede). O nível escolhido vale até fechar a aba
//   (sessionStorage), para a página não abrir pesada de novo a cada módulo.
//
// ---------------------------------------------------------------------------------------------------
// INTEGRAÇÃO (para o Aurelius; este arquivo não mexe em d_app.js nem em build.sh):
// 1) build.sh: concatenar "$F"/src/f_desempenho.js depois de e_modelos.js.
// 2) d_app.js, em App(): trocar  dpr=${[1,2]}  por  dpr=${DESEMPENHO.dpr}
//    (App já usa useS(); quando o nível muda, este arquivo avisa o store S/subs e App redesenha com o dpr novo).
// 3) d_app.js, em World(), logo depois de useS():  DESEMPENHO.simplificar(sc.mats);
// 4) Quando entrarem sombras de contato ou Sparkles:  ${DESEMPENHO.efeitos?html`...o efeito...`:null}
// App e World só rodam depois que o IIFE inteiro terminou (o React desenha de forma assíncrona), então
// DESEMPENHO já existe quando eles são chamados.
// ---------------------------------------------------------------------------------------------------
const DESEMPENHO=(()=>{
  const NIVEIS=['alto','medio','baixo','minimo'];
  const DPR={alto:[1,2],medio:1,baixo:.75,minimo:.5};
  const LIMITE=30;        // FPS mínimo aceitável
  const AQUECE=1500;      // ms ignorados no começo e depois de cada troca (compilação de shaders, montagem da cena)
  const JANELA=2000;      // ms de cada medição
  const CHAVE='lab-desempenho';
  const ouvintes=new Set();
  let nivel='alto',fps=null,medindo=false,fixo=false,raf=0,t0=0,tIni=0,n=0,boas=0;
  const ler=()=>{try{return sessionStorage.getItem(CHAVE)}catch(e){return null}};
  const gravar=v=>{try{sessionStorage.setItem(CHAVE,v)}catch(e){}};
  const avisar=()=>{ouvintes.forEach(f=>{try{f(nivel)}catch(e){console.warn('[desempenho]',e)}});
    // redesenha os componentes que usam o store de d_app.js (App lê DESEMPENHO.dpr)
    try{if(typeof S!=='undefined'&&typeof subs!=='undefined'){S.ver++;subs.forEach(f=>f())}}catch(e){}};
  function mudar(v,guardar){if(!NIVEIS.includes(v)||v===nivel)return;nivel=v;if(guardar)gravar(v);avisar()}
  function parar(){medindo=false;if(raf)cancelAnimationFrame(raf);raf=0}
  function reiniciar(agora){t0=agora;tIni=0;n=0}
  function quadro(agora){raf=0;if(!medindo)return;
    if(document.hidden||!document.querySelector('canvas')){reiniciar(agora)}   // sem 3D na tela ou aba escondida: não conta
    else if(agora-t0>=AQUECE){if(!tIni){tIni=agora;n=0}else n++;
      if(agora-tIni>=JANELA){fps=n*1000/(agora-tIni);
        if(fps<LIMITE){boas=0;const i=NIVEIS.indexOf(nivel);if(i<NIVEIS.length-1){mudar(NIVEIS[i+1],true);reiniciar(agora)}else{parar();return}}
        else if(++boas>=2){parar();return}
        else{tIni=agora;n=0}}}
    raf=requestAnimationFrame(quadro)}
  function medir(){if(fixo||medindo)return;medindo=true;boas=0;raf=requestAnimationFrame(t=>{reiniciar(t);quadro(t)})}
  addEventListener('visibilitychange',()=>{if(medindo)reiniciar(performance.now())});
  // materiais: guarda os valores originais em userData.des e zera o que custa caro no fragment shader
  const CAROS=['clearcoat','sheen'];   // transmissão fica de fora: zerá-la deixaria a peça opaca
  function simplificar(mats){const baixo=nivel==='baixo'||nivel==='minimo';if(!mats)return;
    for(const m of mats){if(!m||!m.isMeshPhysicalMaterial)continue;const g=m.userData.des;
      if(baixo&&!g){const o={};let mudou=false;for(const k of CAROS)if(m[k]>0){o[k]=m[k];m[k]=0;mudou=true}m.userData.des=o;if(mudou)m.needsUpdate=true}
      else if(!baixo&&g){let mudou=false;for(const k in g){m[k]=g[k];mudou=true}delete m.userData.des;if(mudou)m.needsUpdate=true}}}
  // início: ?qualidade= fixa; senão retoma o nível desta aba e mede
  let q=null;try{q=new URLSearchParams(location.search).get('qualidade')}catch(e){}
  if(NIVEIS.includes(q)){nivel=q;fixo=true}
  else{const g=ler();if(NIVEIS.includes(g))nivel=g;medir()}
  return{
    get nivel(){return nivel},get dpr(){return DPR[nivel]},get efeitos(){return nivel==='alto'},get fps(){return fps},get medindo(){return medindo},
    aoMudar(fn){ouvintes.add(fn);return()=>ouvintes.delete(fn)},
    definir(v){if(!NIVEIS.includes(v))return;fixo=true;parar();mudar(v,true)},
    medir(){fixo=false;medir()},
    simplificar};
})();
