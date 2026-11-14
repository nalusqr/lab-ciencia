import json, math, random
import numpy as np
els=json.loads(open('/home/claude/site/tabela-periodica/dados.js').read()[len('window.ELEMENTOS='):-1])
EL={e['s']:e for e in els}
MASS=lambda s:float(EL[s]['m'])
HLEN={'C':1.09,'N':1.01,'O':0.96,'S':1.34}
R=math.radians
def unit(v):return v/np.linalg.norm(v)
def place(A,B,C,d,ang,dih):
    bc=unit(A-B);n=unit(np.cross(B-C,bc));m=np.cross(n,bc)
    return A+(-d*math.cos(R(ang)))*bc+(d*math.sin(R(ang))*math.cos(R(dih)))*m+(d*math.sin(R(ang))*math.sin(R(dih)))*n

class B:
    def __init__(s):s.n=[];s.sym=[];s.P=[];s.bonds=[];s.h={};s.fc={}
    def i(s,n):return s.n.index(n)
    def add(s,name,sym,a=None,d=None,b=None,ang=None,c=None,dih=None,o=1,h=None,pos=None):
        if pos is not None:p=np.array(pos,float)
        elif a is None:p=np.zeros(3)
        elif b is None:p=s.P[s.i(a)]+np.array([d,0,0])
        elif c is None:
            A,Bp=s.P[s.i(a)],s.P[s.i(b)];u=unit(Bp-A);v=np.array([0,1,0.]);v=unit(v-u*u.dot(v))
            p=A+d*(math.cos(R(ang))*u+math.sin(R(ang))*v)
        else:p=place(s.P[s.i(a)],s.P[s.i(b)],s.P[s.i(c)],d,ang,dih)
        s.n.append(name);s.sym.append(sym);s.P.append(p)
        if a is not None:s.bonds.append([s.i(a),len(s.n)-1,o])
        if h:s.h[name]=h
        return p
    def bond(s,a,b,o=1):s.bonds.append([s.i(a),s.i(b),o])
    def nb(s,k):return [b[1] if b[0]==k else b[0] for b in s.bonds if k in b[:2]]
    def addH(s):
        for name,(hyb,nh) in list(s.h.items()):
            k=s.i(name);X=s.P[k];heavy=[j for j in s.nb(k) if s.sym[j]!='H'];U=[unit(s.P[j]-X) for j in heavy];L=HLEN[s.sym[k]];dirs=[]
            if hyb==3:
                if len(U)==1:
                    u=U[0];nn=[j for j in s.nb(heavy[0]) if j!=k and s.sym[j]!='H']
                    ref=s.P[nn[0]]-s.P[heavy[0]] if nn else np.array([0,0,1.])
                    w0=unit(-(ref-u*u.dot(ref)));w1=np.cross(u,w0)
                    for t in range(3):
                        a=R(t*120);w=math.cos(a)*w0+math.sin(a)*w1;dirs.append(u*math.cos(R(109.5))+w*math.sin(R(109.5)))
                elif len(U)==2:
                    b=unit(-(U[0]+U[1]));n=unit(np.cross(U[0],U[1]))
                    dirs=[b*math.cos(R(54.75))+n*math.sin(R(54.75)),b*math.cos(R(54.75))-n*math.sin(R(54.75))]
                elif len(U)==3:dirs=[unit(-(U[0]+U[1]+U[2]))]
            else:
                if len(U)==2:dirs=[unit(-(U[0]+U[1]))]
                elif len(U)==1:
                    u=U[0];nn=[j for j in s.nb(heavy[0]) if j!=k and s.sym[j]!='H'];v=s.P[nn[0]]-s.P[heavy[0]];p=unit(v-u*u.dot(v))
                    dirs=[u*math.cos(R(120))+p*math.sin(R(120)),u*math.cos(R(120))-p*math.sin(R(120))]
            for t in range(nh):
                s.n.append(f'H{name}{t}');s.sym.append('H');s.P.append(X+L*dirs[t]);s.bonds.append([k,len(s.n)-1,1])
    def chiral_ok(s,center,a,b,c):
        X=s.P[s.i(center)];va,vb,vc=[s.P[s.i(x)]-X for x in (a,b,c)];return np.cross(va,vb).dot(vc)>0  # >0 => S with lowest priority away
    def formula(s):
        cnt={};[cnt.__setitem__(x,cnt.get(x,0)+1) for x in s.sym];sub=lambda n:'' if n==1 else ''.join('₀₁₂₃₄₅₆₇₈₉'[int(c)] for c in str(n))
        order=['C','H']+sorted(k for k in cnt if k not in('C','H'))
        return ''.join(f'{k}{sub(cnt[k])}' for k in order if k in cnt)
    def mm(s):return round(sum(MASS(x) for x in s.sym),2)
    def out(s,**kw):
        P=np.array(s.P);c=P.mean(axis=0);P=P-c
        # orient: principal axis along x for long molecules
        if kw.pop('orient',True):
            u,sv,vt=np.linalg.svd(P,full_matrices=False);P=P@vt.T
        at=[[sy]+[round(float(v),3) for v in p] for sy,p in zip(s.sym,P)]
        return dict(atoms=at,bonds=s.bonds,f=s.formula(),mm=s.mm(),fc={str(s.i(k)) if isinstance(k,str) else str(k):v for k,v in s.fc.items()},**kw)

# ---------------- AMINO ACIDS ----------------
def backbone(b,sgn=1,gly=False,pro=False):
    b.add('N','N',h=(3,2 if pro else 3));b.add('CA','C','N',1.47,h=(3,2 if gly else 1))
    b.add('C','C','CA',1.53,'N',111);b.add('O','O','C',1.25,'CA',117,'N',0,o=1.5);b.add('OXT','O','C',1.25,'CA',117,'N',180,o=1.5)
    b.fc['N']=1;b.fc['O']=-0.5;b.fc['OXT']=-0.5
    if not gly:b.add('CB','C','CA',1.53,'N',110.5,'C',sgn*122.5)
SC={
'ALA':lambda b,a:b.h.__setitem__('CB',(3,3)),
'SER':lambda b,a:(b.h.__setitem__('CB',(3,2)),b.add('OG','O','CB',1.42,'CA',111,'N',-60,h=(3,1))),
'CYS':lambda b,a:(b.h.__setitem__('CB',(3,2)),b.add('SG','S','CB',1.81,'CA',114,'N',-60,h=(3,1))),
'VAL':lambda b,a:(b.h.__setitem__('CB',(3,1)),b.add('CG1','C','CB',1.52,'CA',110.5,'N',180,h=(3,3)),b.add('CG2','C','CB',1.52,'CA',110.5,'N',-60,h=(3,3))),
'LEU':lambda b,a:(b.h.__setitem__('CB',(3,2)),b.add('CG','C','CB',1.53,'CA',116,'N',-60,h=(3,1)),b.add('CD1','C','CG',1.52,'CB',110.5,'CA',180,h=(3,3)),b.add('CD2','C','CG',1.52,'CB',110.5,'CA',60,h=(3,3))),
'ILE':lambda b,a:(b.h.__setitem__('CB',(3,1)),b.add('CG1','C','CB',1.53,'CA',110.4,'N',-60,h=(3,2)),b.add('CG2','C','CB',1.53,'CA',110.5,'N',a,h=(3,3)),b.add('CD1','C','CG1',1.52,'CB',113.8,'CA',180,h=(3,3))),
'THR':lambda b,a:(b.h.__setitem__('CB',(3,1)),b.add('OG1','O','CB',1.43,'CA',109.5,'N',-60,h=(3,1)),b.add('CG2','C','CB',1.52,'CA',110.5,'N',a,h=(3,3))),
'MET':lambda b,a:(b.h.__setitem__('CB',(3,2)),b.add('CG','C','CB',1.52,'CA',114,'N',-60,h=(3,2)),b.add('SD','S','CG',1.81,'CB',112.7,'CA',180),b.add('CE','C','SD',1.79,'CG',100.2,'CB',180,h=(3,3))),
'PRO':lambda b,a:(b.h.__setitem__('CB',(3,2)),b.add('CG','C','CB',1.50,'CA',104.5,'N',PRO_D[0],h=(3,2)),b.add('CD','C','CG',1.51,'CB',105,'CA',PRO_D[1],h=(3,2)),b.bond('CD','N')),
'PHE':lambda b,a:(b.h.__setitem__('CB',(3,2)),b.add('CG','C','CB',1.50,'CA',114,'N',-60),b.add('CD1','C','CG',1.39,'CB',120,'CA',90,o=1.5,h=(2,1)),b.add('CD2','C','CG',1.39,'CB',120,'CA',-90,o=1.5,h=(2,1)),
   b.add('CE1','C','CD1',1.39,'CG',120,'CB',180,o=1.5,h=(2,1)),b.add('CE2','C','CD2',1.39,'CG',120,'CB',180,o=1.5,h=(2,1)),b.add('CZ','C','CE1',1.39,'CD1',120,'CG',0,o=1.5,h=(2,1)),b.bond('CZ','CE2',1.5)),
'TYR':lambda b,a:(SC['PHE'](b,a),b.h.pop('CZ'),b.add('OH','O','CZ',1.36,'CE1',120,'CD1',180,h=(3,1))),
'TRP':lambda b,a:(b.h.__setitem__('CB',(3,2)),b.add('CG','C','CB',1.50,'CA',114,'N',-60),b.add('CD1','C','CG',1.37,'CB',127,'CA',90,o=2,h=(2,1)),b.add('CD2','C','CG',1.43,'CB',126.6,'CA',-90,o=1.5),
   b.add('NE1','N','CD1',1.38,'CG',110,'CB',180,h=(2,1)),b.add('CE2','C','CD2',1.41,'CG',107.3,'CB',180,o=1.5),b.add('CE3','C','CD2',1.40,'CG',133.9,'CB',0,o=1.5,h=(2,1)),
   b.add('CZ2','C','CE2',1.40,'CD2',122.3,'CG',180,o=1.5,h=(2,1)),b.add('CZ3','C','CE3',1.39,'CD2',118.8,'CG',180,o=1.5,h=(2,1)),b.add('CH2','C','CZ2',1.37,'CE2',117.5,'CD2',0,o=1.5,h=(2,1)),b.bond('NE1','CE2'),b.bond('CZ3','CH2',1.5)),
'HIS':lambda b,a:(b.h.__setitem__('CB',(3,2)),b.add('CG','C','CB',1.50,'CA',114,'N',-60),b.add('ND1','N','CG',1.38,'CB',122.7,'CA',90),b.add('CD2','C','CG',1.36,'CB',131,'CA',-90,o=2,h=(2,1)),
   b.add('CE1','C','ND1',1.32,'CG',109,'CB',180,o=2,h=(2,1)),b.add('NE2','N','CD2',1.37,'CG',107,'CB',180,h=(2,1)),b.bond('CE1','NE2')),
'ASP':lambda b,a:(b.h.__setitem__('CB',(3,2)),b.add('CG','C','CB',1.52,'CA',113,'N',-60),b.add('OD1','O','CG',1.25,'CB',119,'CA',0,o=1.5),b.add('OD2','O','CG',1.25,'CB',119,'CA',180,o=1.5),b.fc.update({'OD1':-.5,'OD2':-.5})),
'ASN':lambda b,a:(b.h.__setitem__('CB',(3,2)),b.add('CG','C','CB',1.52,'CA',113,'N',-60),b.add('OD1','O','CG',1.23,'CB',121,'CA',0,o=2),b.add('ND2','N','CG',1.33,'CB',116,'CA',180,h=(2,2))),
'GLU':lambda b,a:(b.h.__setitem__('CB',(3,2)),b.add('CG','C','CB',1.52,'CA',114,'N',-60,h=(3,2)),b.add('CD','C','CG',1.52,'CB',113,'CA',180),b.add('OE1','O','CD',1.25,'CG',119,'CB',0,o=1.5),b.add('OE2','O','CD',1.25,'CG',119,'CB',180,o=1.5),b.fc.update({'OE1':-.5,'OE2':-.5})),
'GLN':lambda b,a:(b.h.__setitem__('CB',(3,2)),b.add('CG','C','CB',1.52,'CA',114,'N',-60,h=(3,2)),b.add('CD','C','CG',1.52,'CB',113,'CA',180),b.add('OE1','O','CD',1.23,'CG',121,'CB',0,o=2),b.add('NE2','N','CD',1.33,'CG',116,'CB',180,h=(2,2))),
'LYS':lambda b,a:(b.h.__setitem__('CB',(3,2)),b.add('CG','C','CB',1.52,'CA',114,'N',-60,h=(3,2)),b.add('CD','C','CG',1.52,'CB',111,'CA',180,h=(3,2)),b.add('CE','C','CD',1.52,'CG',111,'CB',180,h=(3,2)),b.add('NZ','N','CE',1.49,'CD',112,'CG',180,h=(3,3)),b.fc.update({'NZ':1})),
'ARG':lambda b,a:(b.h.__setitem__('CB',(3,2)),b.add('CG','C','CB',1.52,'CA',114,'N',-60,h=(3,2)),b.add('CD','C','CG',1.52,'CB',111,'CA',180,h=(3,2)),b.add('NE','N','CD',1.46,'CG',112,'CB',180,h=(2,1)),
   b.add('CZ','C','NE',1.33,'CD',124,'CG',180,o=1.5),b.add('NH1','N','CZ',1.33,'NE',120,'CD',0,o=1.5,h=(2,2)),b.add('NH2','N','CZ',1.33,'NE',120,'CD',180,o=1.5,h=(2,2)),b.fc.update({'NH1':.5,'NH2':.5})),
}
PRO_D=[30,-35]
AA=[ # code, 3, 1, name, class, essential, fact
('GLY','Gly','G','Glicina','apolar',False,'O menor aminoácido: a cadeia lateral é só um hidrogênio, por isso é o único sem carbono quiral. Dá flexibilidade às proteínas e é 1 em cada 3 resíduos do colágeno.'),
('ALA','Ala','A','Alanina','apolar',False,'Cadeia lateral = um grupo metil. Pequena e hidrofóbica, aparece muito em α-hélices.'),
('VAL','Val','V','Valina','apolar',True,'Hidrofóbica e ramificada. É a valina que entra no lugar do glutamato na hemoglobina da anemia falciforme (Glu6Val).'),
('LEU','Leu','L','Leucina','apolar',True,'Um dos aminoácidos mais comuns nas proteínas. Cadeia ramificada e hidrofóbica, costuma ficar escondida no interior das proteínas.'),
('ILE','Ile','I','Isoleucina','apolar',True,'Tem dois carbonos quirais (Cα e Cβ). Mesma fórmula da leucina, outro arranjo.'),
('MET','Met','M','Metionina','apolar',True,'Contém enxofre. Seu códon AUG é o sinal de início: quase toda proteína começa sendo traduzida com uma metionina.'),
('PRO','Pro','P','Prolina','apolar',False,'A cadeia lateral se fecha de volta no nitrogênio, formando um anel rígido. Por isso quebra α-hélices e cria dobras.'),
('PHE','Phe','F','Fenilalanina','aromático',True,'Tem um anel benzênico. Na fenilcetonúria, falta a enzima que transforma fenilalanina em tirosina. A fenilalanina se acumula e prejudica o cérebro. O teste do pezinho detecta a doença logo após o nascimento, e uma dieta pobre em fenilalanina evita o dano. É por isso que refrigerantes diet avisam: "contém fenilalanina".'),
('TRP','Trp','W','Triptofano','aromático',True,'O maior aminoácido, com o anel duplo indol. É precursor da serotonina e da melatonina.'),
('TYR','Tyr','Y','Tirosina','aromático',False,'Fenilalanina com um –OH. Precursora da dopamina, da adrenalina e dos hormônios da tireoide.'),
('SER','Ser','S','Serina','polar',False,'O –OH da serina é onde muitas enzimas grudam fosfato para ligar e desligar proteínas (fosforilação).'),
('THR','Thr','T','Treonina','polar',True,'Polar, com –OH e dois carbonos quirais.'),
('CYS','Cys','C','Cisteína','polar',False,'O –SH de duas cisteínas pode se unir numa ponte dissulfeto (S–S), que "costura" proteínas como a insulina e a queratina do cabelo.'),
('ASN','Asn','N','Asparagina','polar',False,'Amida polar. Foi o primeiro aminoácido descoberto, isolado do aspargo em 1806.'),
('GLN','Gln','Q','Glutamina','polar',False,'O aminoácido livre mais abundante no sangue. Transporta nitrogênio pelo corpo.'),
('ASP','Asp','D','Aspartato (ácido aspártico)','ácido',False,'Em pH 7 perde o H do ácido e fica com carga −1. Também é neurotransmissor.'),
('GLU','Glu','E','Glutamato (ácido glutâmico)','ácido',False,'Carga −1 em pH 7. Principal neurotransmissor excitatório do cérebro e responsável pelo sabor umami.'),
('LYS','Lys','K','Lisina','básico',True,'O –NH₃⁺ da ponta dá carga +1. Nas histonas, ajuda a enrolar o DNA (que é negativo).'),
('ARG','Arg','R','Arginina','básico',False,'O grupo guanidínio tem carga +1 dividida entre 3 nitrogênios. O corpo produz óxido nítrico a partir dela.'),
('HIS','His','H','Histidina','básico',True,'O anel imidazol ganha ou perde H⁺ perto de pH 7, por isso é peça-chave em sítios ativos de enzimas e na hemoglobina.'),
]
# codons from the standard code
BASES='TCAG';AAS='FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG'
COD={}
for i,a in enumerate(AAS):COD.setdefault(a,[]).append((BASES[i//16]+BASES[i//4%4]+BASES[i%4]).replace('T','U'))
CLS={'apolar':'Apolar (hidrofóbico)','aromático':'Aromático','polar':'Polar sem carga','ácido':'Ácido (carga −1)','básico':'Básico (carga +1)'}
CLS_AA={'HIS':'Básico (carga 0 ou +1; pKa ≈ 6)'}  # His: cadeia lateral com pKa ≈ 6, em pH 7 a maioria está neutra (o modelo 3D é neutro)
DIETA_AA={'ARG':'Não essencial (condicional em crianças)','TYR':'Não essencial (condicional: feita a partir da fenilalanina)'}
bestp=None
for c1 in range(-45,46,1):
    for c2 in range(-50,51,1):
        PRO_D[:]=[c1,c2];b=B();backbone(b,1,pro=True);SC['PRO'](b,0)
        for sg in (1,-1):
            pass
        d=np.linalg.norm(b.P[b.i('CD')]-b.P[b.i('N')]);ang=None
        A=b.P[b.i('CG')]-b.P[b.i('CD')];Bv=b.P[b.i('N')]-b.P[b.i('CD')];an=math.degrees(math.acos(A.dot(Bv)/np.linalg.norm(A)/np.linalg.norm(Bv)))
        sc=abs(d-1.47)*10+abs(an-103)/20
        if bestp is None or sc<bestp[0]:bestp=(sc,c1,c2,d,an)
print('pro',bestp);PRO_D[:]=[bestp[1],bestp[2]]
MOLS=[]
for code,t3,t1,nome,cl,ess,fato in AA:
    built=None
    for sgn in (1,-1):
        for alt in (180,60):
            b=B();backbone(b,sgn,gly=code=='GLY',pro=code=='PRO');SC.get(code,lambda b,a:None)(b,alt)
            ok=True
            if code!='GLY':ok&=b.chiral_ok('CA','N','C','CB')  # L = same spatial arrangement for all
            if code=='THR':ok&=not b.chiral_ok('CB','OG1','CA','CG2')  # 3R
            if code=='ILE':ok&=b.chiral_ok('CB','CA','CG1','CG2')     # 3S
            if ok:built=b;break
        if built:break
    b=built
    if code=='HIS':b.h['NE2']=(2,1)
    b.addH()
    # sanity: closure distances
    for x,y in [('CD','N'),('CZ','CE2'),('NE1','CE2'),('CZ3','CH2'),('CE1','NE2')]:
        if x in b.n and y in b.n:print(code,x,y,round(float(np.linalg.norm(b.P[b.i(x)]-b.P[b.i(y)])),2))
    tag=DIETA_AA.get(code,('essencial' if ess else 'não essencial').capitalize());ccl=CLS_AA.get(code,CLS[cl])
    MOLS.append(b.out(id=t3.lower(),nome=nome,grupo='Aminoácidos',sub=f'{t3} · {t1}',geo=ccl,
        kv=[['Código',f'{t3} · {t1}'],['Classe',ccl],['Na dieta humana',tag],['Códons (mRNA)',' '.join(COD[t1])],['Carbono quiral',{'GLY':'nenhum','THR':'Cα e Cβ','ILE':'Cα e Cβ'}.get(code,'Cα (forma L)')]],
        fato=fato,cls=cl,orient=False))
# ---------------- LIPIDS ----------------
def chain(b,start,prev,prevprev,n,prefix,dbl={},first_dih=180,skew=120,k0=2):
    """grow n carbons after `start` (carbon number k0); dbl={k:'cis'|'trans'} = double bond between carbons k and k+1"""
    names=[prevprev,prev,start];k=k0
    for t in range(n):
        k+=1;nm=f'{prefix}{k}';a,bb,c=names[-1],names[-2],names[-3]
        o=2 if dbl.get(k-1) else 1
        ang=123 if (dbl.get(k-1) or dbl.get(k-2)) else 112
        if dbl.get(k-2): dih=0 if dbl[k-2]=='cis' else 180
        elif dbl.get(k-1) or dbl.get(k-3): dih=skew if dbl.get(k-3) else -skew
        else: dih=first_dih if t==0 else 180
        b.add(nm,'C',a,1.34 if o==2 else 1.53,bb,ang,c,dih,o=o)
        names.append(nm)
    for j,nm in enumerate(names[2:]):
        cn=j+k0
        if nm==start:continue
        sp2=dbl.get(cn) or dbl.get(cn-1)
        b.h[nm]=(2,1) if sp2 else (3,3 if nm==names[-1] else 2)
    return names[-1]
def fatty_acid(n,dbl={},skew=120):
    b=B();b.add('O2','O',h=(3,1));b.add('C1','C','O2',1.34);b.add('O1','O','C1',1.21,'O2',123,o=2)
    b.add('C2','C','C1',1.51,'O1',124,'O2',180,h=(3,2));chain(b,'C2','C1','O1',n-2,'C',dbl,skew=skew)
    b.n[b.i('C2')]='C2'
    return b
LIP=[]
b=fatty_acid(16);b.addH()
LIP.append(b.out(id='palmitico',nome='Ácido palmítico',grupo='Lipídios',sub='C16:0 · saturado',geo='Cadeia reta (zigue-zague)',
  kv=[['Tipo','Ácido graxo saturado'],['Notação','C16:0'],['Ligações duplas','nenhuma'],['Onde aparece','óleo de palma, manteiga, carnes']],
  fato='"Saturado" = só ligações simples, cheio de hidrogênios. A cadeia fica reta em zigue-zague e as moléculas se empilham bem juntinhas, por isso gorduras saturadas são sólidas em temperatura ambiente.'))
best=None
for sk in (120,-120,100,140):
    bb=fatty_acid(18,{9:'cis'},skew=sk);P=np.array(bb.P);d=np.linalg.norm(P[bb.i('C18')]-P[bb.i('C1')])
    if best is None or d>best[0]:best=(d,sk)
b=fatty_acid(18,{9:'cis'},skew=best[1]);b.addH()
LIP.append(b.out(id='oleico',nome='Ácido oleico',grupo='Lipídios',sub='C18:1 cis-9 · insaturado',geo='Dobrada na ligação dupla cis',
  kv=[['Tipo','Ácido graxo monoinsaturado'],['Notação','C18:1 cis-Δ9 (ômega-9)'],['Ligações duplas','1, no carbono 9 (cis)'],['Onde aparece','azeite de oliva (~70%), abacate']],
  fato='A ligação dupla cis cria uma "dobra" na cadeia. As moléculas não conseguem se empilhar bem, por isso o azeite é líquido. Compare com o elaídico ao lado: mesma fórmula, outra forma.'))
b=fatty_acid(18,{9:'trans'});b.addH()
LIP.append(b.out(id='elaidico',nome='Ácido elaídico (gordura trans)',grupo='Lipídios',sub='C18:1 trans-9',geo='Quase reta (dupla trans)',
  kv=[['Tipo','Ácido graxo insaturado trans'],['Notação','C18:1 trans-Δ9'],['Ligações duplas','1, no carbono 9 (trans)'],['Onde aparece','gordura vegetal parcialmente hidrogenada']],
  fato='Mesma fórmula do ácido oleico (C₁₈H₃₄O₂), mas a dupla é trans: a cadeia fica quase reta como a de uma gordura saturada. Por isso ela se empilha como uma gordura saturada e é sólida à temperatura ambiente. No corpo, é ainda mais prejudicial: aumenta o colesterol "ruim" (LDL) e diminui o "bom" (HDL). No Brasil, a Anvisa proibiu os óleos parcialmente hidrogenados, a principal fonte de gordura trans, a partir de 2023.'))
# triglyceride & phospholipid via search for a compact "tuning fork"
def tri(params):
    b=B();g1,g2,g3,e1,e2,e3=params
    b.add('C1g','C',h=(3,2));b.add('C2g','C','C1g',1.53,h=(3,1));b.add('C3g','C','C2g',1.53,'C1g',110,h=(3,2))
    b.add('O1g','O','C1g',1.44,'C2g',109,'C3g',g1);b.add('O2g','O','C2g',1.44,'C1g',109,'O1g',g2);b.add('O3g','O','C3g',1.44,'C2g',109,'C1g',g3)
    for k,(o,c,pp,e) in enumerate([('O1g','C1g','C2g',e1),('O2g','C2g','C1g',e2),('O3g','C3g','C2g',e3)]):
        b.add(f'Ca{k}','C',o,1.34,c,117,pp,e);b.add(f'Ob{k}','O',f'Ca{k}',1.21,o,123,c,0,o=2)
        b.add(f'K{k}_2','C',f'Ca{k}',1.51,o,111,c,180,h=(3,2));chain(b,f'K{k}_2',f'Ca{k}',o,14,f'K{k}_')
    return b
def score(b,tails):
    P=np.array(b.P);bonded=set();[bonded.update([(x,y),(y,x)]) for x,y,_ in b.bonds]
    heavy=[i for i,s in enumerate(b.sym) if s!='H'];hp=P[heavy];D=np.linalg.norm(hp[:,None]-hp[None],axis=2)
    # exclude 1-2 and 1-3
    nb={i:set() for i in range(len(P))};[ (nb[x].add(y),nb[y].add(x)) for x,y,_ in b.bonds]
    mind=9
    for a_,i in enumerate(heavy):
        close=nb[i]|{k for j in nb[i] for k in nb[j]}
        for b_,j in enumerate(heavy):
            if j<=i or j in close:continue
            mind=min(mind,D[a_,b_])
    vs=[unit(P[b.i(t1)]-P[b.i(t0)]) for t0,t1 in tails];al=sum(vs[i].dot(vs[j]) for i in range(len(vs)) for j in range(i+1,len(vs)))
    return min(mind,3.4)*10+al*8
random.seed(4)
best=None
for it in range(6000):
    p=[random.choice([60,180,-60]) for _ in range(3)]+[random.choice(list(range(-180,180,30))) for _ in range(3)]
    b=tri(p);sc=score(b,[('K0_2','K0_16'),('K1_2','K1_16'),('K2_2','K2_16')])
    if best is None or sc>best[0]:best=(sc,p)
print('tri',best)
b=tri(best[1]);b.addH()
LIP.append(b.out(id='triglicerideo',nome='Triglicerídeo (tripalmitina)',grupo='Lipídios',sub='glicerol + 3 ácidos graxos',geo='Formato de "garfo"',
  kv=[['Tipo','Triacilglicerol (gordura)'],['Montagem','1 glicerol + 3 ácidos palmíticos'],['Ligações','3 ésteres'],['Função','reserva de energia (~9 kcal/g)']],
  fato='É assim que o corpo guarda gordura: três ácidos graxos presos a um glicerol por ligações éster. Cada grama guarda cerca de 9 kcal, mais que o dobro de açúcares e proteínas (~4 kcal/g).'))
def popc(params):
    g1,g2,g3,e1,e2,h1,h2,h3=params;b=B()
    b.add('C1g','C',h=(3,2));b.add('C2g','C','C1g',1.53,h=(3,1));b.add('C3g','C','C2g',1.53,'C1g',110,h=(3,2))
    b.add('O1g','O','C1g',1.44,'C2g',109,'C3g',g1);b.add('O2g','O','C2g',1.44,'C1g',109,'O1g',g2);b.add('O3g','O','C3g',1.44,'C2g',109,'C1g',g3)
    b.add('P','P','O3g',1.60,'C3g',120,'C2g',h1);b.add('OP1','O','P',1.48,'O3g',108,'C3g',60,o=1.5);b.add('OP2','O','P',1.48,'O3g',108,'C3g',-60,o=1.5)
    b.add('O4','O','P',1.60,'O3g',103,'C3g',180);b.add('Cc1','C','O4',1.44,'P',120,'O3g',h2,h=(3,2));b.add('Cc2','C','Cc1',1.52,'O4',110,'P',h3,h=(3,2))
    b.add('Nc','N','Cc2',1.50,'Cc1',115,'O4',180);b.fc.update({'Nc':1,'OP1':-.5,'OP2':-.5})
    for k,(nm,d) in enumerate([('M1',180),('M2',60),('M3',-60)]):b.add(nm,'C','Nc',1.49,'Cc2',109.5,'Cc1',d,h=(3,3))
    b.add('Ca0','C','O1g',1.34,'C1g',117,'C2g',e1);b.add('Ob0','O','Ca0',1.21,'O1g',123,'C1g',0,o=2);b.add('K0_2','C','Ca0',1.51,'O1g',111,'C1g',180,h=(3,2));chain(b,'K0_2','Ca0','O1g',14,'K0_')
    b.add('Ca1','C','O2g',1.34,'C2g',117,'C1g',e2);b.add('Ob1','O','Ca1',1.21,'O2g',123,'C2g',0,o=2);b.add('K1_2','C','Ca1',1.51,'O2g',111,'C2g',180,h=(3,2));chain(b,'K1_2','Ca1','O2g',16,'K1_',{9:'cis'})
    return b
best=None
for it in range(12000):
    p=[random.choice([60,180,-60]) for _ in range(3)]+[random.choice(list(range(-180,180,15))) for _ in range(2)]+[random.choice([60,180,-60,90,-90]) for _ in range(3)]
    b=popc(p);sc=score(b,[('K0_2','K0_16'),('K1_2','K1_18')])
    # heads should point away from tails
    P=np.array(b.P);t=(P[b.i('K0_16')]+P[b.i('K1_18')])/2-P[b.i('C2g')];hd=P[b.i('Nc')]-P[b.i('C2g')];sc+= -unit(t).dot(unit(hd))*3-sum(abs(np.linalg.norm(P[b.i(f'K0_{k}')]-P[b.i(f'K1_{k}')])-5.0) for k in range(4,17,2))*0.35
    if best is None or sc>best[0]:best=(sc,p)
print('popc',best)
b=popc(best[1]);b.addH()
LIP.append(b.out(id='fosfolipidio',nome='Fosfolipídio (POPC)',grupo='Lipídios',sub='fosfatidilcolina',geo='Cabeça polar + 2 caudas apolares',
  kv=[['Tipo','Glicerofosfolipídio'],['Cabeça','fosfato (−) + colina (+)'],['Caudas','palmítica (16:0) + oleica (18:1 cis)'],['Onde aparece','membranas de todas as células']],
  fato='Uma ponta é hidrofílica (atrai a água): a cabeça, com um fosfato (−) e uma colina (+), é polar, mas tem carga total zero. A outra ponta é hidrofóbica (repele a água): duas caudas de hidrocarboneto. Na água, essas moléculas se organizam sozinhas em camadas duplas (bicamadas). É essa propriedade que faz a membrana das células ser estável. Na célula, os fosfolipídios novos são feitos no retículo endoplasmático liso e somados às membranas que já existem. Use o modo POLARIDADE para ver.'))
# bilayer schematic (heavy atoms only, idealised)
b=B();random.seed(7)
for leaf,sgn in ((0,1),(1,-1)):
    for ix in range(3):
        for iz in range(3):
            x=(ix-1)*8.0+random.uniform(-.6,.6)+(4 if leaf else 0);z=(iz-1)*8.0+random.uniform(-.6,.6)
            y0=sgn*20.0;pre=f'L{leaf}{ix}{iz}'
            b.add(pre+'N','N',pos=[x,y0+sgn*2.2,z]);b.add(pre+'P','P',pos=[x,y0,z]);b.bond(pre+'N',pre+'P')
            b.add(pre+'G','C',pos=[x,y0-sgn*2.0,z]);b.bond(pre+'P',pre+'G')
            for t,dx in enumerate((-1.25,1.25)):
                prev=pre+'G'
                for k in range(14):
                    nm=f'{pre}T{t}_{k}';b.add(nm,'C',pos=[x+dx+(0.42 if k%2 else -0.42),y0-sgn*(3.3+k*1.27),z+random.uniform(-.15,.15)]);b.bond(prev,nm);prev=nm
            b.fc[pre+'N']=1;b.fc[pre+'P']=-1
LIP.append(b.out(id='bicamada',nome='Bicamada lipídica (esquema)',grupo='Lipídios',sub='membrana celular',geo='Duas camadas, caudas para dentro',orient=False,schem=True,
  kv=[['Espessura','~4 nm (fosfato a fosfato)'],['Área por lipídio','~0,64 nm²'],['Interior','apolar (caudas)'],['Superfícies','polares (cabeças, em contato com a água)']],
  fato='Modelo esquemático: só os átomos pesados, caudas simplificadas. As cabeças polares ficam viradas para a água dos dois lados e as caudas se escondem no meio. Essa barreira oleosa de ~4 nm separa o dentro e o fora de cada célula.'))
# ---------------- PROTEINS ----------------
def peptide(seq,phi,psi,omega=180,cap=True):
    b=B();prev=None;names=[]
    for r,aa in enumerate(seq):
        p=f'r{r}'
        if r==0:
            b.add(p+'N','N',h=(3,3));b.fc[p+'N']=1;b.add(p+'CA','C',p+'N',1.458);b.add(p+'C','C',p+'CA',1.525,p+'N',111.2)
        else:
            q=f'r{r-1}'
            b.add(p+'N','N',q+'C',1.329,q+'CA',116.2,q+'N',psi[r-1],h=(2,1))
            b.add(p+'CA','C',p+'N',1.458,q+'C',121.7,q+'CA',omega)
            b.add(p+'C','C',p+'CA',1.525,p+'N',111.2,q+'C',phi[r])
            b.add(q+'O','O',q+'C',1.231,q+'CA',120.8,q+'N',psi[r-1]+180,o=2)
        names.append(p)
    q=f'r{len(seq)-1}'
    b.add(q+'O','O',q+'C',1.25,q+'CA',117,q+'N',psi[-1]+180,o=1.5);b.add(q+'OXT','O',q+'C',1.25,q+'CA',117,q+'N',psi[-1],o=1.5);b.fc[q+'O']=-.5;b.fc[q+'OXT']=-.5
    for r,aa in enumerate(seq):
        p=f'r{r}'
        if aa=='G':b.h[p+'CA']=(3,2);continue
        b.h[p+'CA']=(3,1)
        for sgn in (1,-1):
            b.add(p+'CB','C',p+'CA',1.53,p+'N',110.5,p+'C',sgn*122.5,h=(3,3))
            if b.chiral_ok(p+'CA',p+'N',p+'C',p+'CB'):break
            # undo
            b.n.pop();b.sym.pop();b.P.pop();b.bonds.pop();b.h.pop(p+'CB')
    return b
def hbonds(b,nres_names):
    out=[]
    Ns=[(i,n) for i,n in enumerate(b.n) if n.endswith('N') and n.startswith('r') or n.startswith('s')]
    return out
PROT=[]
# dipeptide Gly-Ala
b=peptide('GA',[0,-60],[150,150]);b.addH()
d=b.out(id='peptidica',nome='Ligação peptídica (Gly-Ala)',grupo='Proteínas',sub='dipeptídeo',geo='Ligação C–N plana',orient=True,
  kv=[['Formada por','Glicina + Alanina'],['Reação','condensação (sai 1 H₂O)'],['C–N peptídica','1,33 Å (entre simples 1,47 e dupla 1,27)'],['Ângulo ω','180° (trans, plana)']],
  fato='Quando dois aminoácidos se unem, o –COOH de um reage com o –NH₂ do outro e sai uma molécula de água. A ligação C–N formada é parcialmente dupla (ressonância), por isso não gira: os 6 átomos em volta dela ficam num mesmo plano. Essa rigidez é o que permite hélices e folhas.')
d['hl']=[b.i('r0C'),b.i('r1N')];PROT.append(d)
# alpha helix
n=13;b=peptide('A'*n,[-57]*n,[-47]*n);b.addH()
P=np.array(b.P);hb=[]
for r in range(n-4):
    o=b.i(f'r{r}O');N=b.i(f'r{r+4}N');hN=[j for j in b.nb(N) if b.sym[j]=='H']
    dist=float(np.linalg.norm(P[o]-P[N]))
    if hN:hb.append([hN[0],o,round(dist,2)])
print('helix O..N',[x[2] for x in hb])
d=b.out(id='helice',nome='α-hélice',grupo='Proteínas',sub='polialanina, 13 resíduos',geo='Hélice destra',orient=True,
  kv=[['Ângulos φ / ψ','−57° / −47°'],['Resíduos por volta','3,6'],['Subida por resíduo','1,5 Å (passo 5,4 Å)'],['Ligações de H','C=O do resíduo i → N–H do i+4']],
  fato='Proposta por Linus Pauling em 1951, antes de qualquer proteína ter sua estrutura vista. Cada C=O faz ligação de hidrogênio com o N–H quatro resíduos à frente (linhas amarelas), travando a espiral. É o elemento mais comum nas proteínas, inclusive nas hélices da hemoglobina (8 na cadeia β, 7 na cadeia α).')
d['ca']=[[b.i(f'r{r}CA') for r in range(n)]];d['hb']=hb;d['ss']='helix';PROT.append(d)
# antiparallel beta sheet: two strands, placement searched for best H-bonding
m=6;s1=peptide('A'*m,[-139]*m,[135]*m);s1.addH();P1=np.array(s1.P)
cas=np.array([P1[s1.i(f'r{r}CA')] for r in range(m)]);ax=unit(cas[-1]-cas[0])
def rotm(axis,ang):
    axis=unit(axis);a=math.cos(ang/2);b_,c,d_=-axis*math.sin(ang/2)
    return np.array([[a*a+b_*b_-c*c-d_*d_,2*(b_*c+a*d_),2*(b_*d_-a*c)],[2*(b_*c-a*d_),a*a+c*c-b_*b_-d_*d_,2*(c*d_+a*b_)],[2*(b_*d_+a*c),2*(c*d_-a*b_),a*a+d_*d_-b_*b_-c*c]])
cen=P1.mean(axis=0);Os=[s1.i(f'r{r}O') for r in range(m)];Nh=[(s1.i(f'r{r}N'),[j for j in s1.nb(s1.i(f'r{r}N')) if s1.sym[j]=='H']) for r in range(1,m)]
perp=unit(np.cross(ax,[0,0,1]) if abs(ax[2])<.9 else np.cross(ax,[1,0,0]))
best=None
heavy1=[i for i,s in enumerate(s1.sym) if s!='H']
for spin in range(0,360,10):
    Rm=rotm(ax,math.radians(spin));Pspin=(P1-cen)@Rm.T
    for flipdeg in range(0,360,20):
        side=rotm(ax,math.radians(flipdeg))@perp;F=rotm(np.cross(ax,side),math.pi)
        P2b=Pspin@F.T
        for sh in np.arange(4.2,5.6,0.2):
            for sl in np.arange(-3.5,3.6,0.5):
                P2=P2b+cen+side*sh+ax*sl
                # clash
                dmin=np.min(np.linalg.norm(P1[heavy1][:,None]-P2[heavy1][None],axis=2))
                if dmin<2.6:continue
                cnt=0
                for (Ni,H) in Nh:
                    if not H:continue
                    for o in Os:
                        d1=np.linalg.norm(P1[Ni]-P2[o]);d2=np.linalg.norm(P2[Ni]-P1[o])
                        for dd,hh,oo in ((d1,P1[H[0]],P2[o]),(d2,P2[H[0]],P1[o])):
                            if 2.7<dd<3.2:
                                cnt+=1
                sc=cnt+dmin*0.1
                if best is None or sc>best[0]:best=(sc,P2.copy(),cnt)
print('sheet hbonds',best[2])
b=B();b.n=[f's1{x}' for x in s1.n]+[f's2{x}' for x in s1.n];b.sym=s1.sym+s1.sym;b.P=list(P1)+list(best[1]);L=len(s1.n)
b.bonds=[x[:] for x in s1.bonds]+[[x[0]+L,x[1]+L,x[2]] for x in s1.bonds];b.fc={**{f's1{k}':v for k,v in s1.fc.items()},**{f's2{k}':v for k,v in s1.fc.items()}}
P=np.array(b.P);hb=[]
for (Ni,H) in Nh:
    if not H:continue
    for o in Os:
        for a_,b2 in ((0,L),(L,0)):
            dd=float(np.linalg.norm(P[Ni+a_]-P[o+b2]))
            if 2.7<dd<3.25:hb.append([H[0]+a_,o+b2,round(dd,2)])
d=b.out(id='folha',nome='Folha β antiparalela',grupo='Proteínas',sub='2 fitas de 6 resíduos',geo='Fitas lado a lado, sentidos opostos',orient=True,
  kv=[['Ângulos φ / ψ','≈ −139° / +135°'],['Distância entre fitas','~4,8 Å'],['Ligações de H','entre fitas vizinhas'],['Exemplo','fibroína da seda (rica em folhas β)']],
  fato='As fitas ficam esticadas e lado a lado; as ligações de hidrogênio unem o C=O de uma fita ao N–H da outra (linhas amarelas). Na representação em fita, cada uma vira uma seta que aponta do início (N) para o fim (C) da cadeia: aqui as setas apontam em sentidos opostos.')
d['ca']=[[b.i(f's1r{r}CA') for r in range(m)],[b.i(f's2r{r}CA') for r in range(m)]];d['hb']=hb;d['ss']='sheet';PROT.append(d)
ALL=MOLS+LIP+PROT
for x in ALL:print(x['id'],len(x['atoms']),x['f'],x['mm'])
open('/home/claude/site/biomoleculas/dados.js','w').write('window.BIOMOL='+json.dumps(ALL,ensure_ascii=False,separators=(',',':'))+';')
