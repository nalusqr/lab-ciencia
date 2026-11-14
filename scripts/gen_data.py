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
# Número de massa do isótopo natural mais abundante (IUPAC/CIAAW, abundâncias isotópicas).
# Tabela explícita: arredondar a massa atômica NÃO dá o isótopo mais comum (Cu 63,55 -> 64, mas o cobre é Cu-63 e Cu-65).
# Só para elementos com massa atômica padrão (composição natural conhecida); Bi, Th, Pa e U entram aqui, mas são radioativos (RADIO).
AMAX={1:1,2:4,3:7,4:9,5:11,6:12,7:14,8:16,9:19,10:20,11:23,12:24,13:27,14:28,15:31,16:32,17:35,18:40,19:39,20:40,
 21:45,22:48,23:51,24:52,25:55,26:56,27:59,28:58,29:63,30:64,31:69,32:74,33:75,34:80,35:79,36:84,37:85,38:88,39:89,40:90,
 41:93,42:98,44:102,45:103,46:106,47:107,48:114,49:115,50:120,51:121,52:130,53:127,54:132,55:133,56:138,57:139,58:140,59:141,60:142,
 62:152,63:153,64:158,65:159,66:164,67:165,68:166,69:169,70:174,71:175,72:180,73:181,74:184,75:187,76:192,77:193,78:195,79:197,80:202,
 81:205,82:208,83:209,90:232,91:231,92:238}
# Têm massa atômica padrão (ocorrem na natureza), mas nenhum isótopo estável.
RADIO_NAT={83,90,91,92}
# Notas sobre as propriedades físicas a 1 atm.
NOTA={6:'a 1 atm o grafite não funde: sublima (passa direto de sólido a gás) por volta de 3900 K; só funde sob pressão alta',
 33:'a 1 atm o arsênio não funde: sublima a 887 K; os 1090 K de fusão só valem sob pressão (dezenas de atm)'}
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
    e=els[-1]
    if stable: e['amax']=AMAX[z]
    e['radio']=(not stable) or z in RADIO_NAT
    if z in NOTA: e['nota']=NOTA[z]
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
