// Shared helpers for the periodic table and element pages
window.CATS={
  alcalino:{n:'Metal alcalino',c:'#ff6b6b'},
  alcalinoterroso:{n:'Metal alcalinoterroso',c:'#ffa94d'},
  transicao:{n:'Metal de transição',c:'#ffd43b'},
  postransicao:{n:'Metal pós-transição',c:'#8ce99a'},
  semimetal:{n:'Semimetal',c:'#63e6be'},
  naometal:{n:'Não metal',c:'#4dabf7'},
  halogenio:{n:'Halogênio',c:'#74c0fc'},
  nobre:{n:'Gás nobre',c:'#b197fc'},
  lantanideo:{n:'Lantanídeo',c:'#f783ac'},
  actinideo:{n:'Actinídeo',c:'#e599f7'},
  desconhecido:{n:'Propriedades desconhecidas',c:'#868e96'}
};
window.FASE={solid:'Sólido',liquid:'Líquido',gas:'Gasoso',unknown:'Desconhecido'};
window.ORIGEM={primordial:'Primordial (existe desde a formação da Terra)','from decay':'Formado por decaimento radioativo',synthetic:'Sintético (criado em laboratório)'};
window.ORIGEM_CURTA={primordial:'Primordial','from decay':'Decaimento',synthetic:'Sintético'};
// first number in a value like "(2400)", ">4000", "1.87 (2+) / 2.33 (4+)", "(8.91–8.95)"
window.num=v=>{if(!v||v==='-')return null;const m=String(v).match(/-?\d+(\.\d+)?/);return m?parseFloat(m[0]):null};
window.isPred=v=>/^\(/.test(String(v||''));
window.br=v=>String(v).replace(/(\d)\.(\d)/g,'$1,$2');
window.fmtK=v=>{if(!v||v==='-')return '—';const n=num(v);const p=isPred(v);const c=n==null?'':` · ${br((n-273.15).toFixed(n<100?2:0))} °C`;return `${br(String(v).replace(/[()]/g,''))} K${c}${p?' <span class="pred">previsto</span>':''}`};
window.ELS=window.ELEMENTOS;
window.pos=e=>{ // grid position: col 1..18, row 1..7 main, 9..10 f-block
  if(e.g)return{c:e.g,r:e.p};
  const base=e.p===6?57:89;return{c:3+(e.z-base),r:e.p===6?9:10};
};
window.lerp=(a,b,t)=>a+(b-a)*t;
window.ramp=t=>{ // dark blue -> cyan -> amber -> red
  const st=[[24,40,90],[40,170,230],[255,190,80],[255,70,90]];t=Math.max(0,Math.min(1,t));
  const s=t*(st.length-1),i=Math.min(st.length-2,Math.floor(s)),f=s-i;
  const c=st[i].map((v,k)=>Math.round(lerp(v,st[i+1][k],f)));return `rgb(${c})`;
};
