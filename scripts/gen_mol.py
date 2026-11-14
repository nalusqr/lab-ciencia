import json, math
import numpy as np
els=json.loads(open('/home/claude/site/tabela-periodica/dados.js').read()[len('window.ELEMENTOS='):-1])
EL={e['s']:e for e in els}
mass=lambda s:float(EL[s]['m'])
def zmat(rows):
    P=[]
    for r in rows:
        if len(P)==0:P.append(np.zeros(3));continue
        a,d=r[1],r[2]
        if len(P)==1:P.append(np.array([d,0,0]));continue
        b,ang=r[3],math.radians(r[4])
        if len(P)==2:
            A,B=P[a],P[b];u=(B-A)/np.linalg.norm(B-A);v=np.array([0,1,0.0]);v=v-u*u.dot(v);v/=np.linalg.norm(v)
            P.append(A+d*(math.cos(ang)*u+math.sin(ang)*v));continue
        c,dih=r[5],math.radians(r[6]);A,B,Cc=P[a],P[b],P[c]
        bc=(A-B)/np.linalg.norm(A-B);n=np.cross(B-Cc,bc);n/=np.linalg.norm(n);m=np.cross(n,bc)
        dvec=np.array([-d*math.cos(ang),d*math.sin(ang)*math.cos(dih),d*math.sin(ang)*math.sin(dih)])
        P.append(A+dvec[0]*bc+dvec[1]*m+dvec[2]*n)
    return P
M=[]
def add(id,nome,formula,atoms,bonds,**kw):
    c=np.mean([np.array(a[1:]) for a in atoms],axis=0)
    at=[[a[0]]+[round(float(x-cc),4) for x,cc in zip(a[1:],c)] for a in atoms]
    mm=sum(mass(a[0]) for a in atoms)
    M.append(dict(id=id,nome=nome,f=formula,atoms=at,bonds=bonds,mm=round(mm,3),**kw))
# diatomics
add('hidrogenio','Hidrogênio','H₂',[['H',0,0,0],['H',0.7414,0,0]],[[0,1,1]],geo='Linear',ang=None,dip=0,est='gás',
    lig=['H–H 0,741 Å'],vib=[['estiramento',4161,'dia']],fato='A molécula mais leve que existe. O elemento hidrogênio é o combustível das estrelas: no núcleo delas, núcleos de hidrogênio (prótons) se fundem em hélio.',grupo='Substâncias simples')
add('nitrogenio','Nitrogênio','N₂',[['N',0,0,0],['N',1.0977,0,0]],[[0,1,3]],geo='Linear',ang=None,dip=0,est='gás',
    lig=['N≡N 1,098 Å (tripla)'],vib=[['estiramento',2331,'dia']],fato='78% do ar que respiramos. A ligação tripla é uma das mais fortes da química (945 kJ/mol), por isso o N₂ quase não reage.',grupo='Substâncias simples')
add('oxigenio','Oxigênio','O₂',[['O',0,0,0],['O',1.2075,0,0]],[[0,1,2]],geo='Linear',ang=None,dip=0,est='gás',
    lig=['O=O 1,208 Å (dupla)'],vib=[['estiramento',1556,'dia']],fato='21% do ar. Tem 2 elétrons desemparelhados (é paramagnético): oxigênio líquido gruda num ímã. O desenho com ligação dupla (modelo de Lewis) não mostra esses elétrons desemparelhados; quem explica é a teoria dos orbitais moleculares.',grupo='Substâncias simples')
add('ozonio','Ozônio','O₃',[['O',0,0.0,0],['O',1.278*math.sin(math.radians(58.4)),-1.278*math.cos(math.radians(58.4)),0],['O',-1.278*math.sin(math.radians(58.4)),-1.278*math.cos(math.radians(58.4)),0]],[[0,1,1.5],[0,2,1.5]],
    geo='Angular',ang='116,8°',dip=0.53,est='gás',lig=['O–O 1,278 Å (×2, ressonância)'],vib=[],fato='Na estratosfera, a camada de ozônio absorve quase toda a radiação UV-C e a maior parte da UV-B do Sol, as mais perigosas para o DNA. A UV-A passa quase toda, e por isso o protetor solar continua necessário. As duas ligações são iguais, meio caminho entre simples e dupla. O₂ e O₃ são alótropos do oxigênio.',grupo='Substâncias simples',lp=[[0,[0,1,0]]])
add('cloridrico','Cloreto de hidrogênio','HCl',[['H',0,0,0],['Cl',1.2746,0,0]],[[0,1,1]],geo='Linear',ang=None,dip=1.08,est='gás',
    lig=['H–Cl 1,275 Å'],vib=[['estiramento',2886,'dia']],fato='Dissolvido em água forma o ácido clorídrico, presente no suco gástrico do estômago.',grupo='Inorgânicas')
# water
a=math.radians(104.52/2);d=0.9572
add('agua','Água','H₂O',[['O',0,0,0],['H',d*math.sin(a),-d*math.cos(a),0],['H',-d*math.sin(a),-d*math.cos(a),0]],[[0,1,1],[0,2,1]],
    geo='Angular',ang='104,5°',dip=1.85,est='líquido',lig=['O–H 0,957 Å (×2)'],vib=[['estiramento simétrico',3657,'h2o_s'],['dobramento',1595,'h2o_b'],['estiramento assimétrico',3756,'h2o_a']],
    fato='O ângulo é 104,5° e não 109,5° porque os 2 pares de elétrons livres do oxigênio empurram as ligações. É essa polaridade que faz a água dissolver tanta coisa e formar ligações de hidrogênio.',grupo='Inorgânicas',lp=[[0,[0,0.55,0.83]],[0,[0,0.55,-0.83]]])
add('co2','Dióxido de carbono','CO₂',[['C',0,0,0],['O',1.160,0,0],['O',-1.160,0,0]],[[0,1,2],[0,2,2]],geo='Linear',ang='180°',dip=0,est='gás',
    lig=['C=O 1,160 Å (×2)'],vib=[['estiramento simétrico',1333,'co2_s'],['dobramento',667,'co2_b'],['estiramento assimétrico',2349,'co2_a']],
    fato='Cada ligação C=O é polar, mas como a molécula é reta os dois efeitos se cancelam: o CO₂ é apolar. Quando a molécula se dobra (667 cm⁻¹) ou estica de forma assimétrica (2349 cm⁻¹), aparece um dipolo momentâneo, e é isso que permite absorver infravermelho. O estiramento simétrico não cria dipolo e não absorve. A absorção do dobramento, na faixa em que a Terra emite calor, é o que faz do CO₂ um gás de efeito estufa.',grupo='Inorgânicas')
# ammonia
d=1.012;th=math.radians(106.67);h=d*math.sqrt((1+2*math.cos(th))/3);r=math.sqrt(d*d-h*h)
add('amonia','Amônia','NH₃',[['N',0,0,0]]+[['H',r*math.cos(k*2*math.pi/3),-h,r*math.sin(k*2*math.pi/3)] for k in range(3)],[[0,1,1],[0,2,1],[0,3,1]],
    geo='Piramidal (pirâmide trigonal)',ang='106,7°',dip=1.47,est='gás',lig=['N–H 1,012 Å (×3)'],vib=[],fato='O par de elétrons livre do nitrogênio fica no topo da pirâmide. A amônia é a base de quase todos os fertilizantes nitrogenados do mundo.',grupo='Inorgânicas',lp=[[0,[0,1,0]]])
add('nacl','Cloreto de sódio (cristal)','NaCl',[['Na' if (i+j+k)%2==0 else 'Cl',i*2.82,j*2.82,k*2.82] for i in range(3) for j in range(3) for k in range(3)],
    [[a,b,'i'] for a in range(27) for b in range(a+1,27) if abs(sum((x-y)**2 for x,y in zip([a//9,a//3%3,a%3],[b//9,b//3%3,b%3]))-1)<1e-9],
    geo='Cúbica (sal-gema)',ang='90°',dip=0,est='sólido',lig=['Na⁺···Cl⁻ 2,82 Å','aresta da célula 5,64 Å'],vib=[],
    fato='Não existe "molécula" de NaCl no sal: é um cristal de íons. Cada Na⁺ fica cercado por 6 Cl⁻ e vice-versa. Aqui aparece um pedaço de 3×3×3 íons.',grupo='Inorgânicas',ionic=True)
# organics
d=1.087/math.sqrt(3)
add('metano','Metano','CH₄',[['C',0,0,0],['H',d,d,d],['H',-d,-d,d],['H',-d,d,-d],['H',d,-d,-d]],[[0,i,1] for i in range(1,5)],
    geo='Tetraédrica',ang='109,5°',dip=0,est='gás',lig=['C–H 1,087 Å (×4)'],vib=[],fato='Principal componente do gás natural. Os 4 hidrogênios ficam o mais longe possível entre si, nos vértices de um tetraedro.',grupo='Orgânicas')
c=1.339/2;hc=math.radians(121.3);dch=1.087
add('etileno','Eteno (etileno)','C₂H₄',[['C',c,0,0],['C',-c,0,0],['H',c-dch*math.cos(hc),dch*math.sin(hc),0],['H',c-dch*math.cos(hc),-dch*math.sin(hc),0],['H',-c+dch*math.cos(hc),dch*math.sin(hc),0],['H',-c+dch*math.cos(hc),-dch*math.sin(hc),0]],
    [[0,1,2],[0,2,1],[0,3,1],[1,4,1],[1,5,1]],geo='Trigonal plana',ang='H–C–H 117,4°',dip=0,est='gás',lig=['C=C 1,339 Å','C–H 1,087 Å'],vib=[],
    fato='A ligação dupla impede a rotação, então a molécula inteira é plana. As plantas usam o etileno como hormônio para amadurecer frutas.',grupo='Orgânicas')
c=1.203/2
add('acetileno','Etino (acetileno)','C₂H₂',[['H',-c-1.063,0,0],['C',-c,0,0],['C',c,0,0],['H',c+1.063,0,0]],[[0,1,1],[1,2,3],[2,3,1]],geo='Linear',ang='180°',dip=0,est='gás',
    lig=['C≡C 1,203 Å','C–H 1,063 Å'],vib=[],fato='A ligação tripla é mais curta que a dupla, que é mais curta que a simples. A chama de acetileno com oxigênio passa de 3000 °C, usada em solda.',grupo='Orgânicas')
B=[]
at=[]
for k in range(6):
    t=k*math.pi/3;at.append(['C',1.397*math.cos(t),1.397*math.sin(t),0])
for k in range(6):
    t=k*math.pi/3;at.append(['H',2.481*math.cos(t),2.481*math.sin(t),0])
add('benzeno','Benzeno','C₆H₆',at,[[k,(k+1)%6,1.5] for k in range(6)]+[[k,k+6,1] for k in range(6)],geo='Hexágono plano',ang='120°',dip=0,est='líquido',
    lig=['C–C 1,397 Å (×6, todas iguais)','C–H 1,084 Å'],vib=[],fato='As 6 ligações C–C têm o mesmo tamanho, entre a simples (1,54 Å) e a dupla (1,34 Å): os elétrons ficam espalhados pelo anel inteiro (aromaticidade).',grupo='Orgânicas')
P=zmat([['C'],['C',0,1.512],['O',1,1.431,0,107.8],['H',2,0.971,1,108.5,0,180],
        ['H',0,1.09,1,110.5,2,180],['H',0,1.09,1,110.5,2,60],['H',0,1.09,1,110.5,2,-60],
        ['H',1,1.09,0,110.0,2,120],['H',1,1.09,0,110.0,2,-120]])
sy=['C','C','O','H','H','H','H','H','H']
add('etanol','Etanol','C₂H₅OH',[[s]+list(p) for s,p in zip(sy,P)],[[0,1,1],[1,2,1],[2,3,1],[0,4,1],[0,5,1],[0,6,1],[1,7,1],[1,8,1]],
    geo='Tetraédrica em cada C',ang='C–C–O ≈ 108°',dip=1.69,est='líquido',lig=['C–C 1,512 Å','C–O 1,431 Å','O–H 0,971 Å'],vib=[],
    fato='O grupo –OH faz ligações de hidrogênio com a água, por isso álcool e água se misturam em qualquer proporção. No Brasil, o etanol da cana é usado como combustível puro ou misturado à gasolina.',grupo='Orgânicas',aprox=True,lp=[[2,[-0.3,0.4,0.85]],[2,[-0.3,0.4,-0.85]]])
# diamond cell
a=3.567;base=[(0,0,0),(0,.5,.5),(.5,0,.5),(.5,.5,0)];pts=set()
for bx in base:
    for off in [(0,0,0),(.25,.25,.25)]:
        for i in (-1,0,1):
            for j in (-1,0,1):
                for k in (-1,0,1):
                    p=tuple(round(x+o+s,4) for x,o,s in zip(bx,off,(i,j,k)))
                    if all(-1e-6<=v<=1+1e-6 for v in p):pts.add(p)
pts=sorted(pts);at=[['C']+[v*a for v in p] for p in pts]
bd=[[i,j,1] for i in range(len(at)) for j in range(i+1,len(at)) if abs(math.dist(at[i][1:],at[j][1:])-1.5446)<0.01]
# drop atoms with no bonds
used={x for b in bd for x in b[:2]};keep=[i for i in range(len(at)) if i in used];idx={o:n for n,o in enumerate(keep)}
add('diamante','Diamante (célula unitária)','C (cristal)',[at[i] for i in keep],[[idx[b[0]],idx[b[1]],1] for b in bd],geo='Rede tetraédrica',ang='109,5°',dip=0,est='sólido',
    lig=['C–C 1,545 Å','aresta da célula 3,567 Å'],vib=[],fato='Cada carbono se liga a outros 4 em tetraedro, formando uma rede 3D contínua: é o material natural mais duro. Diamante e grafite são alótropos: substâncias simples diferentes formadas pelo mesmo elemento, o carbono.',grupo='Substâncias simples')
for m in M:
    if m['id']=='nacl':m['mm']=58.44;m['mmu']='por NaCl'
    if m['id']=='diamante':m['mm']=12.011;m['mmu']='por átomo de C'
for m in M:print(m['id'],len(m['atoms']),len(m['bonds']),m['mm'])
open('/home/claude/site/moleculas/dados.js','w').write('window.MOLECULAS='+json.dumps(M,ensure_ascii=False,separators=(',',':'))+';')
