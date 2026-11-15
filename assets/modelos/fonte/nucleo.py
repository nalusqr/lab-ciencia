# -*- coding: utf-8 -*-
"""
Núcleo 3D procedural, em corte (metade aberta), com um trecho de retículo endoplasmático.
LAB · Ciência em movimento, módulo 05 (Célula). Autora: Íris (artista e gerente de assets).

Tudo gerado por este script (e por comum.py), com semente fixa: nada de terceiros.

    python3 site/assets/modelos/fonte/nucleo.py               # gera tudo
    python3 site/assets/modelos/fonte/nucleo.py --sem-previa  # pula a renderização
    python3 site/assets/modelos/fonte/nucleo.py --amostras 32

Saídas em site/assets/modelos/: nucleo.glb, nucleo.blend, previa-nucleo.png.
Unidade: 1 µm. Corte no plano y = 0 do Blender (z = 0 no glTF, metade aberta para +Z).

Como a continuidade dos compartimentos é feita (é o ponto principal da Biologia aqui):
- o envelope é UM sólido de membrana: (esfera externa ∪ retículo) − (espaço perinuclear ∪
  lúmen do retículo) − (nucleoplasma) − (canais dos poros). Assim:
  * nos poros, a membrana externa e a interna são a mesma membrana dobrada (membrana do poro);
  * a membrana do retículo é a continuação da membrana nuclear externa;
  * o lúmen do retículo é a continuação do espaço perinuclear (mesma cor, mesmo material).
- Depois o sólido é separado em membrana_externa, membrana_interna e reticulo_endoplasmatico
  só para os rótulos clicáveis. A cor da membrana do retículo passa do rosa (membrana nuclear)
  para o azul (retículo) ao se afastar do núcleo, para não sugerir uma emenda.
"""

import math
import os
import random
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import comum as C  # noqa: E402
from comum import SCI, Vector, bpy, misturar_hex  # noqa: E402

SEMENTE = 2024
rng = random.Random(SEMENTE)

AQUI = os.path.dirname(os.path.abspath(__file__))
PASTA = os.path.dirname(AQUI)
ARQ_GLB = os.path.join(PASTA, "nucleo.glb")
ARQ_BLEND = os.path.join(PASTA, "nucleo.blend")
ARQ_PREVIA = os.path.join(PASTA, "previa-nucleo.png")

# Medidas (µm). Núcleo real: 5 a 10 µm. Espessuras exageradas ~4× (senão some na tela).
R1 = 3.00            # face de fora da membrana nuclear externa
E_MEMB = 0.03        # cada membrana (real: ~7 nm)
E_PERI = 0.05        # espaço perinuclear (real: 20 a 40 nm)
R2 = R1 - E_MEMB     # face de dentro da externa
R3 = R2 - E_PERI     # face de fora da interna
R4 = R3 - E_MEMB     # face de dentro da interna (lado do nucleoplasma)
R_MEIO = (R2 + R3) / 2
R_CANAL = 0.065      # raio do canal do poro (o complexo inteiro fica com ~0,25 µm; real ~0,12)
R_CANAL_LUMEN = 0.115  # o espaço perinuclear para antes do poro: ali as membranas se fundem
N_POROS = 26

# Retículo: uma cisterna (bolsa achatada) que sai da membrana externa e se dobra em duas lâminas
ER_TETA = math.radians(72)   # latitude da junção (ângulo a partir do polo +z)
ER_PHI = (-0.08, 0.75)       # faixa de longitude (começa antes do corte, que a apara)
ER_LUMEN = 0.05              # largura do lúmen (igual ao espaço perinuclear)

SEM_PREVIA, AMOSTRAS = C.args()


def polar(r, th):
    return (r * math.sin(th), r * math.cos(th))


def chaikin(pts, n=3, fixos=2):
    for _ in range(n):
        novo = list(pts[:fixos])
        for a, b in zip(pts[fixos - 1:-1], pts[fixos:]):
            novo.append((0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]))
            novo.append((0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]))
        novo.append(pts[-1])
        pts = novo
    return pts


def reamostrar(pts, passo):
    out = [pts[0]]
    acum = 0.0
    for a, b in zip(pts[:-1], pts[1:]):
        seg = math.dist(a, b)
        acum += seg
        if acum >= passo:
            out.append(b)
            acum = 0.0
    if out[-1] != pts[-1]:
        out.append(pts[-1])
    return out


def linha_central_re():
    """Linha central da cisterna no plano (rho, z): sai do núcleo em linha reta,
    sobe paralela ao envelope, faz a volta e desce de novo, mais por fora."""
    t = ER_TETA
    ctrl = [polar(R_MEIO, t), polar(R1 + 0.02, t), polar(3.2, t), polar(3.36, t - 0.04),
            polar(3.42, t - 0.13), polar(3.42, t - 0.32), polar(3.43, t - 0.45), polar(3.50, t - 0.52),
            polar(3.62, t - 0.52), polar(3.70, t - 0.45), polar(3.70, t - 0.25), polar(3.70, t - 0.06)]
    return reamostrar(chaikin(ctrl, 3, fixos=2), 0.1)


def poligono_faixa(linha, meia):
    """Polígono fechado de uma faixa de meia-largura `meia` em volta da linha, ponta redonda."""
    n = len(linha)
    normais = []
    for i in range(n):
        a, b = linha[max(i - 1, 0)], linha[min(i + 1, n - 1)]
        tx, tz = b[0] - a[0], b[1] - a[1]
        L = math.hypot(tx, tz)
        normais.append((-tz / L, tx / L))
    esq = [(p[0] + nn[0] * meia, p[1] + nn[1] * meia) for p, nn in zip(linha, normais)]
    dir_ = [(p[0] - nn[0] * meia, p[1] - nn[1] * meia) for p, nn in zip(linha, normais)]
    fim, nf = linha[-1], normais[-1]
    tf = (nf[1], -nf[0])   # tangente no fim
    ponta = []
    for k in range(1, 6):
        a = math.pi * k / 6
        ponta.append((fim[0] + (nf[0] * math.cos(a) + tf[0] * math.sin(a)) * meia,
                      fim[1] + (nf[1] * math.cos(a) + tf[1] * math.sin(a)) * meia))
    return esq + ponta + list(reversed(dir_)), esq, dir_, normais


def direcao(th, ph):
    return Vector((math.sin(th) * math.cos(ph), math.sin(th) * math.sin(ph), math.cos(th)))


def angulo(a, b):
    return math.acos(max(-1.0, min(1.0, a.normalized().dot(b.normalized()))))


def perto_do_re(d, margem):
    """True se a direção d cai sob a cisterna do retículo (para não pôr poro lá)."""
    th = math.acos(max(-1, min(1, d.z)))
    ph = math.atan2(d.y, d.x)
    return (ER_TETA - 0.6 - margem) < th < (ER_TETA + 0.1 + margem) and ph < ER_PHI[1] + margem


def escolher_poros():
    """Poros espalhados na metade que fica, dois deles exatamente no plano do corte
    (o aluno vê, na fatia, as duas membranas se juntando em volta do canal)."""
    eixos = [direcao(math.radians(38), math.pi), direcao(math.radians(128), math.pi)]
    tent = 0
    while len(eixos) < N_POROS and tent < 20000:
        tent += 1
        d = Vector((rng.uniform(-1, 1), rng.uniform(0.12, 1), rng.uniform(-1, 1)))
        if d.length > 1 or d.length < 0.2:
            continue
        d.normalize()
        if perto_do_re(d, 0.12):
            continue
        if any(angulo(d, e) < 0.17 for e in eixos):
            continue
        eixos.append(d)
    return eixos


def construir():
    cena = C.Cena("nucleo", "Núcleo")
    aux = cena.aux
    meio = cena.meio_espaco()
    deformar = C.deformacao(SEMENTE, R1, amp=0.02, freq=1.1, escala_xyz=(1.04, 1.0, 0.95))

    rosa = SCI["membrana"]
    mats = {
        "membrana": C.material("membrana_nuclear", rosa, 0.5),
        "espaco": C.material("espaco_perinuclear", misturar_hex(rosa, SCI["lamina"], 0.78), 0.9, usa_tom=False),
        "re": C.material("reticulo_endoplasmatico", SCI["sintese"], 0.55, cor_no_vertice=True),
        "poros": C.material("poros_nucleares", misturar_hex(rosa, SCI["branco"], 0.45), 0.55),
        "eucromatina": C.material("eucromatina", SCI["genetica"], 0.6, usa_tom=False),
        "heterocromatina": C.material("heterocromatina", misturar_hex(SCI["genetica"], SCI["genetica_densa"], 0.6), 0.7),
        "nucleolo": C.material("nucleolo", SCI["genetica_densa"], 0.75),
        "nucleoplasma": C.material("nucleoplasma", misturar_hex(SCI["genetica"], SCI["citoplasma"], 0.8), 0.85, usa_tom=False),
        "ribossomos": C.material("ribossomos", SCI["ribossomo"], 0.7, usa_tom=False),
    }

    def bola(r, nome):
        m = C.Montador()
        C.esfera_uv(m, (0, 0, 0), (r, r, r), seg=64, aneis=32)
        return m.objeto(nome, aux, solido=True)

    # ---- Poros: cilindros que furam o envelope -------------------------------------------
    eixos = escolher_poros()

    def cilindros(raio, nome):
        m = C.Montador()
        for d in eixos:
            C.tubo(m, [d * (R4 - 0.12), d * (R1 + 0.12)], raio, lados=12)
        return m.objeto(nome, aux, solido=True)

    canais = cilindros(R_CANAL, "canais")
    canais_lumen = cilindros(R_CANAL_LUMEN, "canais_lumen")

    # ---- Retículo: sólidos de revolução da cisterna ----------------------------------------
    linha = linha_central_re()
    meia_fora = ER_LUMEN / 2 + E_MEMB
    pol_fora, esq, dir_, normais = poligono_faixa(linha, meia_fora)
    pol_lumen = poligono_faixa(linha, ER_LUMEN / 2)[0]
    m = C.Montador()
    C.revolucao(m, pol_fora, ER_PHI[0], ER_PHI[1], 14)
    re_fora = m.objeto("re_fora", aux, solido=True)
    m = C.Montador()
    C.revolucao(m, pol_lumen, ER_PHI[0] + 0.01, ER_PHI[1] - 0.012, 14)
    re_lumen = m.objeto("re_lumen", aux, solido=True)

    # ---- Espaço perinuclear + lúmen do retículo: um compartimento só ------------------------
    lumen = bola(R2, "lumen")
    C.booleana(lumen, bola(R3, "b3"), "DIFFERENCE")
    C.booleana(lumen, canais_lumen, "DIFFERENCE")
    C.booleana(lumen, re_lumen, "UNION")

    # ---- Membrana (externa + interna + retículo, um sólido contínuo) -----------------------
    memb = bola(R1, "membrana")
    C.booleana(memb, re_fora, "UNION")
    C.booleana(memb, lumen, "DIFFERENCE")
    C.booleana(memb, bola(R4, "b4"), "DIFFERENCE")
    C.booleana(memb, canais, "DIFFERENCE")
    memb_cheio = C.copiar(memb, "membrana_cheia", aux)   # usada para aparar os poros cortados
    C.booleana(memb, meio, "INTERSECT")

    # separa para os rótulos
    b_meio = bola(R_MEIO, "b_meio")
    b_fora = bola(R1 + 0.002, "b_fora")
    interna = C.booleana(C.copiar(memb, "interna", aux), b_meio, "INTERSECT")
    externa = C.booleana(memb, b_meio, "DIFFERENCE")
    re = C.booleana(C.copiar(externa, "re", aux), b_fora, "DIFFERENCE")
    C.booleana(externa, b_fora, "INTERSECT")

    env = cena.grupo("envelope_nuclear", "Envelope nuclear")
    C.finalizar(cena, externa, "membrana_externa", mats["membrana"], "Membrana nuclear externa", deformar, pai=env)
    C.finalizar(cena, interna, "membrana_interna", mats["membrana"], "Membrana nuclear interna", deformar, pai=env)

    # espaço perinuclear e lúmen do retículo: só a fatia, um fio atrás do corte
    C.booleana(lumen, meio, "INTERSECT")
    lumen_re = C.booleana(C.copiar(lumen, "lumen_re", aux), b_fora, "DIFFERENCE")
    C.booleana(lumen, b_fora, "INTERSECT")
    for ob in (lumen, lumen_re):
        C.so_faces_do_corte(ob)
    C.finalizar(cena, lumen, "espaco_perinuclear", mats["espaco"], "Espaço perinuclear", deformar, usa_tom=False, pai=env)
    C.finalizar(cena, lumen_re, "lumen_do_reticulo", mats["espaco"], "Lúmen do retículo", deformar, usa_tom=False)

    # retículo: cor que passa do rosa (membrana nuclear) ao azul (retículo) longe do núcleo
    c_rosa, c_azul = C.cor_linear(rosa), C.cor_linear(SCI["sintese"])

    def cor_re(co):
        t = max(0.0, min(1.0, (co.length - R1) / 0.35))
        t = t * t * (3 - 2 * t)
        return tuple(a + (b - a) * t for a, b in zip(c_rosa, c_azul))

    C.finalizar(cena, re, "reticulo_endoplasmatico", mats["re"], "Retículo endoplasmático rugoso", deformar,
                cor_vertice=cor_re)

    # ---- Complexos de poro: anel citoplasmático, anel nuclear, cesta e filamentos ---------
    #    Só os dois poros que caem no plano do corte passam pela booleana (os outros não precisam).
    m_cortados, m_inteiros = C.Montador(), C.Montador()
    for idx, d in enumerate(eixos):
        m = m_cortados if idx < 2 else m_inteiros
        n, u, w = C.base_ortonormal(d)
        C.toro(m, d * (R1 + 0.012), d, R_CANAL + 0.035, 0.028, seg=8, lados=4)    # anel citoplasmático
        C.toro(m, d * (R4 - 0.012), d, R_CANAL + 0.035, 0.028, seg=8, lados=4)    # anel nuclear
        C.toro(m, d * (R4 - 0.17), d, 0.035, 0.012, seg=6, lados=3)               # anel da cesta
        for k in range(6):
            a = 2 * math.pi * k / 6
            r = u * math.cos(a) + w * math.sin(a)
            base_n = d * (R4 - 0.02) + r * (R_CANAL + 0.035)
            C.tubo(m, [base_n, d * (R4 - 0.17) + r * 0.035], 0.008, lados=3)          # cesta nuclear
            base_c = d * (R1 + 0.02) + r * (R_CANAL + 0.035)
            C.tubo(m, [base_c, base_c + d * 0.07 + r * 0.015], 0.008, lados=3)        # filamento citoplasmático
    poros = m_cortados.objeto("poros", aux, solido=True)
    C.booleana(poros, meio, "INTERSECT", auto_intersecao=True)
    C.booleana(poros, memb_cheio, "DIFFERENCE")   # sem fatia sobreposta à da membrana
    inteiros = m_inteiros.objeto("poros_inteiros", aux, solido=True)
    juntar(poros, inteiros)
    C.finalizar(cena, poros, "poros_nucleares", mats["poros"], "Poros nucleares", deformar, angulo_vivo=180)

    # ---- Ribossomos: no retículo rugoso e na membrana nuclear externa ----------------------
    m = C.Montador()
    centros = []

    def ribossomo(p, n):
        centros.append(p)
        d = Vector((rng.uniform(-1, 1), rng.uniform(-1, 1), rng.uniform(-1, 1))).normalized()
        C.esfera(m, p, 0.028, eixo=d, achatar=0.8)
        C.esfera(m, p + n * 0.026 + d * 0.006, 0.019, eixo=n, achatar=0.75, modelo=C.ICO20)

    cand = []
    for lado, pts, sinal in (("esq", esq, 1), ("dir", dir_, -1)):
        for p, nn in zip(pts, normais):
            if math.hypot(*p) < R1 + 0.12:
                continue
            cand.append((p, (nn[0] * sinal, nn[1] * sinal)))
    tent = 0
    while len(centros) < 40 and tent < 5000:
        tent += 1
        (rho, z), (nr, nz) = rng.choice(cand)
        ph = rng.uniform(0.03, ER_PHI[1] - 0.03)
        c, s = math.cos(ph), math.sin(ph)
        pos = Vector((rho * c, rho * s, z))
        n = Vector((nr * c, nr * s, nz))
        p = pos + n * 0.03
        if p.y < 0.04 or any((p - q).length < 0.1 for q in centros):
            continue
        ribossomo(p, n)
    tent = 0
    n_re = len(centros)
    while len(centros) < n_re + 16 and tent < 5000:
        tent += 1
        d = Vector((rng.uniform(-1, 1), rng.uniform(0.05, 1), rng.uniform(-1, 1)))
        if d.length > 1 or d.length < 0.2:
            continue
        d.normalize()
        if perto_do_re(d, 0.05) or any(angulo(d, e) < 0.1 for e in eixos):
            continue
        p = d * (R1 + 0.03)
        if p.y < 0.05 or any((p - q).length < 0.12 for q in centros):
            continue
        ribossomo(p, d)
    C.finalizar(cena, m.objeto("rib", aux), "ribossomos", mats["ribossomos"], "Ribossomos", deformar, usa_tom=False, angulo_vivo=180)

    # ---- Nucléolo: aglomerado irregular (metaball), cortado ao meio -----------------------
    centro_nl = Vector((-0.55, 0.12, 0.35))
    mb = bpy.data.metaballs.new("nl")
    mb.resolution = mb.render_resolution = 0.04
    mb.threshold = 0.6
    for _ in range(18):
        e = mb.elements.new()
        e.co = centro_nl + Vector((rng.uniform(-1, 1), rng.uniform(-1, 1), rng.uniform(-1, 1))).normalized() * rng.uniform(0.1, 0.45)
        e.radius = rng.uniform(0.3, 0.42)
    nl = metaball_para_malha(mb, aux)
    C.booleana(nl, meio, "INTERSECT")
    C.decimar(nl, 4000)

    # ---- Heterocromatina: densa, junto ao envelope (menos nos poros) e em volta do nucléolo --
    mb = bpy.data.metaballs.new("het")
    mb.resolution = mb.render_resolution = 0.055
    mb.threshold = 0.6
    pos_het = []
    tent = 0
    while len(pos_het) < 150 and tent < 40000:
        tent += 1
        d = Vector((rng.uniform(-1, 1), rng.uniform(-0.12, 1), rng.uniform(-1, 1)))
        if d.length > 1 or d.length < 0.2:
            continue
        d.normalize()
        if any(angulo(d, e) < 0.12 for e in eixos):      # perto dos poros a cromatina é frouxa
            continue
        if any(angulo(d, q) < 0.12 for q in pos_het):
            continue
        pos_het.append(d)
        e = mb.elements.new(type="ELLIPSOID")
        e.co = d * (R4 - 0.1)
        e.radius = rng.uniform(0.22, 0.3)
        e.size_x, e.size_y, e.size_z = rng.uniform(1.3, 1.9), rng.uniform(1.3, 1.9), 0.5
        e.rotation = d.to_track_quat("Z", "Y")
    for _ in range(9):
        d = Vector((rng.uniform(-1, 1), rng.uniform(-0.3, 1), rng.uniform(-1, 1))).normalized()
        e = mb.elements.new(type="ELLIPSOID")
        e.co = centro_nl + d * 0.82
        e.radius = 0.2
        e.size_x, e.size_y, e.size_z = 1.3, 1.3, 0.6
        e.rotation = d.to_track_quat("Z", "Y")
    het = metaball_para_malha(mb, aux)
    C.booleana(het, meio, "INTERSECT")
    C.decimar(het, 8500)

    # ---- Eucromatina: fibras frouxas espalhadas no nucleoplasma ----------------------------
    m = C.Montador()
    for _ in range(22):
        while True:
            p = Vector((rng.uniform(-2.3, 2.3), 0.06 + 1.6 * rng.random() ** 1.4, rng.uniform(-2.3, 2.3)))
            if p.length < R4 - 0.45 and (p - centro_nl).length > 1.05:
                break
        d = Vector((rng.uniform(-1, 1), rng.uniform(-1, 1), rng.uniform(-1, 1))).normalized()
        cam = [p.copy()]
        for _ in range(36):
            d = (d + Vector((rng.uniform(-1, 1), rng.uniform(-1, 1), rng.uniform(-1, 1))) * 0.45).normalized()
            q = p + d * 0.055
            if q.length > R4 - 0.3:
                r = q.normalized()
                d = (d - r * 2 * max(0.0, d.dot(r))).normalized()
            if (q - centro_nl).length < 0.95:
                r = (q - centro_nl).normalized()
                d = (d - r * 2 * min(0.0, d.dot(r))).normalized()
            p = p + d * 0.055
            if p.y < 0.04:
                p.y = 0.04
                d.y = abs(d.y)
            cam.append(p.copy())
        C.tubo(m, cam, 0.018, lados=4)
    euc = m.objeto("euc", aux)

    crom = cena.grupo("cromatina", "Cromatina")
    C.finalizar(cena, euc, "eucromatina", mats["eucromatina"], "Eucromatina", deformar, usa_tom=False, pai=crom, angulo_vivo=180)
    C.finalizar(cena, het, "heterocromatina", mats["heterocromatina"], "Heterocromatina", deformar, pai=crom, angulo_vivo=180)
    C.finalizar(cena, nl, "nucleolo", mats["nucleolo"], "Nucléolo", deformar, angulo_vivo=180)

    # ---- Nucleoplasma: o forro interno, logo abaixo da membrana interna --------------------
    m = C.Montador()
    meia_esfera_interna(m, R4 - 0.006, 32, 32)
    C.finalizar(cena, m.objeto("np", aux), "nucleoplasma", mats["nucleoplasma"], "Nucleoplasma", deformar, usa_tom=False)

    return cena


def juntar(alvo, outro):
    """Junta a malha de `outro` em `alvo` (sem booleana: as peças só ficam lado a lado)."""
    import bmesh
    bm = bmesh.new()
    bm.from_mesh(alvo.data)
    bm.from_mesh(outro.data)
    bm.to_mesh(alvo.data)
    bm.free()
    C.remover(outro)


def metaball_para_malha(mb, col):
    ob = bpy.data.objects.new(mb.name, mb)
    col.objects.link(ob)
    bpy.context.view_layer.update()
    dg = bpy.context.evaluated_depsgraph_get()
    me = bpy.data.meshes.new_from_object(ob.evaluated_get(dg))
    novo = bpy.data.objects.new(mb.name + "_malha", me)
    col.objects.link(novo)
    bpy.data.objects.remove(ob)
    return novo


def meia_esfera_interna(mont, r, n_th, n_ph):
    """Meia esfera (y >= 0) com normais para o centro."""
    pts = [(0, 0, r)]
    for k in range(1, n_th):
        th = math.pi * k / n_th
        for i in range(n_ph + 1):
            ph = math.pi * i / n_ph
            pts.append((r * math.sin(th) * math.cos(ph), r * math.sin(th) * math.sin(ph), r * math.cos(th)))
    pts.append((0, 0, -r))
    base = mont.vertices(pts)
    ng = n_ph + 1
    faces = []
    for i in range(n_ph):
        faces.append((base, base + 1 + i, base + 2 + i))
        for k in range(n_th - 2):
            a = base + 1 + k * ng + i
            faces.append((a, a + ng, a + ng + 1, a + 1))
        u = base + 1 + (n_th - 2) * ng + i
        faces.append((u, base + 1 + (n_th - 1) * ng, u + 1))
    certas = []
    for f in faces:
        cf = sum((Vector(mont.v[k]) for k in f), Vector()) / len(f)
        certas += C.orientar(mont.v, [f], 0, tuple(-cf))
    mont.faces(certas)


def main():
    cena = construir()
    C.exportar(cena, ARQ_GLB)
    C.relatorio(cena, ARQ_GLB)
    C.preparar_previa(dist=15.5, alvo=(0.35, 0.4, 0.05), amostras=AMOSTRAS)
    C.salvar_blend(ARQ_BLEND)
    if not SEM_PREVIA:
        C.renderizar_previa(ARQ_PREVIA)
        print("  prévia:", ARQ_PREVIA)


if __name__ == "__main__":
    main()
