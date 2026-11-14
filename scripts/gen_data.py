import json, re, unicodedata
names="""Hidrogênio Hélio Lítio Berílio Boro Carbono Nitrogênio Oxigênio Flúor Neônio Sódio Magnésio Alumínio Silício Fósforo Enxofre Cloro Argônio Potássio Cálcio Escândio Titânio Vanádio Cromo Manganês Ferro Cobalto Níquel Cobre Zinco Gálio Germânio Arsênio Selênio Bromo Criptônio Rubídio Estrôncio Ítrio Zircônio Nióbio Molibdênio Tecnécio Rutênio Ródio Paládio Prata Cádmio Índio Estanho Antimônio Telúrio Iodo Xenônio Césio Bário Lantânio Cério Praseodímio Neodímio Promécio Samário Európio Gadolínio Térbio Disprósio Hólmio Érbio Túlio Itérbio Lutécio Háfnio Tântalo Tungstênio Rênio Ósmio Irídio Platina Ouro Mercúrio Tálio Chumbo Bismuto Polônio Astato Radônio Frâncio Rádio Actínio Tório Protactínio Urânio Netúnio Plutônio Amerício Cúrio Berquélio Califórnio Einstênio Férmio Mendelévio Nobélio Laurêncio Rutherfórdio Dúbnio Seabórgio Bóhrio Hássio Meitnério Darmstádtio Roentgênio Copernício Nihônio Fleróvio Moscóvio Livermório Tennesso Oganessônio""".split()
assert len(names)==118
def cat(z):
    if z in (3,11,19,37,55,87): return 'alcalino'
    if z in (4,12,20,38,56,88): return 'alcalinoterroso'
    if 57<=z<=71: return 'lantanideo'
    if 89<=z<=103: return 'actinideo'
    if z>=109: return 'desconhecido'
    if z in (2,10,18,36,54,86): return 'nobre'
    if z in (9,17,35,53,85): return 'halogenio'
    if z in (5,14,32,33,51,52): return 'semimetal'
    if z in (1,6,7,8,15,16,34): return 'naometal'
    if z in (13,31,49,50,81,82,83,84): return 'postransicao'
    return 'transicao'
ORDER="1s 2s 2p 3s 3p 4s 3d 4p 5s 4d 5p 6s 4f 5d 6p 7s 5f 6d 7p".split()
CAP={'s':2,'p':6,'d':10,'f':14}
EXC={24:{'3d':5,'4s':1},29:{'3d':10,'4s':1},41:{'4d':4,'5s':1},42:{'4d':5,'5s':1},44:{'4d':7,'5s':1},45:{'4d':8,'5s':1},
 46:{'4d':10,'5s':0},47:{'4d':10,'5s':1},57:{'4f':0,'5d':1},58:{'4f':1,'5d':1},64:{'4f':7,'5d':1},78:{'5d':9,'6s':1},79:{'5d':10,'6s':1},
 89:{'5f':0,'6d':1},90:{'5f':0,'6d':2},91:{'5f':2,'6d':1},92:{'5f':3,'6d':1},93:{'5f':4,'6d':1},96:{'5f':7,'6d':1},103:{'6d':0,'7p':1}}
def config(z):
    occ={};left=z
    for o in ORDER:
        if left<=0:break
        n=min(CAP[o[1]],left);occ[o]=n;left-=n
    for k,v in EXC.get(z,{}).items(): occ[k]=v
    occ={k:v for k,v in occ.items() if v>0}
    assert sum(occ.values())==z,(z,occ)
    return occ
L='spdf'
def key(o): return (int(o[0]),L.index(o[1]))
rows=[l.strip().split('|') for l in open('/home/claude/data/wiki.txt')]
els=[]
for r in rows:
    z=int(r[0]);sym=r[1];grp=r[2];per=int(r[3]);blk=r[4]
    m=r[5];stable=not m.startswith('[')
    occ=config(z)
    sub=sorted(occ,key=key)
    shells=[0]*7
    for o,v in occ.items(): shells[int(o[0])-1]+=v
    while shells and shells[-1]==0: shells.pop()
    slug=unicodedata.normalize('NFD',names[z-1]).encode('ascii','ignore').decode().lower()
    els.append(dict(z=z,s=sym,n=names[z-1],slug=slug,g=None if grp=='f' else int(grp),p=per,b=blk,
      m=m.strip('[]'),est=stable,d=r[6],mp=r[7],bp=r[8],en=r[9],o=r[10],ph=r[11],c=cat(z),
      cfg=[[o,occ[o]] for o in sub],sh=shells,prev=z>=104))
# noble gas core short form
NG=[2,10,18,36,54,86]
for e in els:
    core=max([g for g in NG if g<e['z']],default=None)
    if core:
        cc=dict(map(tuple,els[core-1]['cfg']))
        rest=[x for x in e['cfg'] if cc.get(x[0])!=x[1]]
        e['core']=els[core-1]['s'];e['val']=rest
    else: e['core']=None;e['val']=e['cfg']
for z in (24,29,46,57,64,79,92,103,26,8,118):
    e=els[z-1];print(z,e['s'],e['core'],' '.join(f"{a}{b}" for a,b in e['val']),e['sh'])
open('/home/claude/site/tabela-periodica/dados.js','w').write('window.ELEMENTOS='+json.dumps(els,ensure_ascii=False,separators=(',',':'))+';')
print(len(els))
