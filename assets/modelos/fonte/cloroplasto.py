# -*- coding: utf-8 -*-
"""
Cloroplasto 3D procedural, em corte longitudinal (metade aberta).
LAB · Ciência em movimento, módulo 05 (Célula). Autora: Íris (artista e gerente de assets).

Tudo gerado por este script (e por comum.py), com semente fixa: nada de terceiros.

    python3 site/assets/modelos/fonte/cloroplasto.py               # gera tudo
    python3 site/assets/modelos/fonte/cloroplasto.py --sem-previa  # pula a renderização
    python3 site/assets/modelos/fonte/cloroplasto.py --amostras 32

Saídas em site/assets/modelos/: cloroplasto.glb, cloroplasto.blend, previa-cloroplasto.png.
Unidade: 1 µm. Eixo maior em X. Corte no plano y = 0 do Blender (z = 0 no glTF, metade aberta para +Z).

Continuidade (o ponto principal da Biologia aqui): os tilacoides dos grana e as lamelas
estromais formam UMA rede de membrana só, e o lúmen do tilacoide é um compartimento só.
- membrana dos tilacoides = (discos ∪ lamelas) − (lúmen dos discos ∪ lúmen das lamelas);
- o lúmen das lamelas entra no lúmen dos discos: na fatia, o lúmen é uma mancha contínua;
- depois a membrana é separada em `tilacoides` (dentro dos grana) e `lamelas_estromais`
  (entre eles) só para os rótulos.
"""

import math
import os
import random
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import comum as C  # noqa: E402
from comum import SCI, Vector, misturar_hex  # noqa: E402

SEMENTE = 1905
rng = random.Random(SEMENTE)

AQUI = os.path.dirname(os.path.abspath(__file__))
PASTA = os.path.dirname(AQUI)
ARQ_GLB = os.path.join(PASTA, "cloroplasto.glb")
ARQ_BLEND = os.path.join(PASTA, "cloroplasto.blend")
ARQ_PREVIA = os.path.join(PASTA, "previa-cloroplasto.png")

# Medidas (µm). Cloroplasto real: 5 a 10 µm de comprimento, 2 a 4 µm de espessura.
EIXOS = (2.6, 1.5, 1.2)   # semieixos x (comprimento), y (largura), z (espessura)
E_MEMB = 0.02             # cada membrana do envoltório (real: ~7 nm; exagerada ~3×)
E_EIM = 0.025             # espaço intermembranas
# Tilacoide: duas membranas e o lúmen. Exagero de ~2× para aparecer na tela.
T_MEMB = 0.016            # membrana do tilacoide
T_LUMEN = 0.026           # lúmen
T_MEIA = T_MEMB + T_LUMEN / 2   # meia espessura do disco (0,029)
T_PASSO = 2 * T_MEIA + 0.012    # distância entre discos empilhados (partição ~12 nm)

SEM_PREVIA, AMOSTRAS = C.args()


def eixos_menos(d):
    return tuple(a - d for a in EIXOS)


def dentro(p, margem):
    """True se o ponto p está dentro do estroma com folga `margem` (aproximado)."""
    a, b, c = eixos_menos(2 * E_MEMB + E_EIM + margem)
    return (p.x / a) ** 2 + (p.y / b) ** 2 + (p.z / c) ** 2 < 1.0


def construir():
    cena = C.Cena("cloroplasto", "Cloroplasto")
    aux = cena.aux
    meio = cena.meio_espaco()
    deformar = C.deformacao(SEMENTE, EIXOS[0], amp=0.025, freq=1.0)

    verde = SCI["fotossintese"]
    mats = {
        "externa": C.material("membrana_externa", verde, 0.45, alfa=0.5),
        "interna": C.material("membrana_interna", verde, 0.55),
        "eim": C.material("espaco_intermembranas", misturar_hex(verde, SCI["lamina"], 0.8), 0.9, usa_tom=False),
        "estroma": C.material("estroma", misturar_hex(verde, SCI["citoplasma"], 0.75), 0.85, usa_tom=False),
        "tilacoides": C.material("tilacoides", SCI["grana"], 0.6),
        "lamelas": C.material("lamelas_estromais", verde, 0.6),
        "lumen": C.material("lumen_do_tilacoide", misturar_hex(verde, SCI["lamina"], 0.55), 0.85, usa_tom=False),
        "dna": C.material("dna_do_cloroplasto", SCI["genetica"], 0.5, usa_tom=False),
        "ribossomos": C.material("ribossomos", SCI["ribossomo"], 0.7, usa_tom=False),
        "amido": C.material("graos_de_amido", misturar_hex(SCI["ribossomo"], SCI["branco"], 0.55), 0.8),
        "plastoglobulos": C.material("plastoglobulos", misturar_hex(SCI["empacotamento"], SCI["ribossomo"], 0.25), 0.45, usa_tom=False),
    }

    def elipsoide(d, nome, seg=80, aneis=40):
        m = C.Montador()
        C.esfera_uv(m, (0, 0, 0), eixos_menos(d), seg=seg, aneis=aneis)
        return m.objeto(nome, aux, solido=True)

    # ---- Envoltório: duas membranas e o espaço entre elas ---------------------------------
    d1, d2, d3 = E_MEMB, E_MEMB + E_EIM, 2 * E_MEMB + E_EIM
    ext = C.booleana(elipsoide(0, "e0"), elipsoide(d1, "e1"), "DIFFERENCE")
    C.booleana(ext, meio, "INTERSECT")
    C.finalizar(cena, ext, "membrana_externa", mats["externa"], "Membrana externa", deformar)
    eim = C.booleana(elipsoide(d1, "e1b", 48, 24), elipsoide(d2, "e2", 48, 24), "DIFFERENCE")
    C.booleana(eim, meio, "INTERSECT")
    C.so_faces_do_corte(eim)
    C.finalizar(cena, eim, "espaco_intermembranas", mats["eim"], "Espaço intermembranas", deformar, usa_tom=False)
    inn = C.booleana(elipsoide(d2, "e2b"), elipsoide(d3, "e3"), "DIFFERENCE")
    C.booleana(inn, meio, "INTERSECT")
    C.finalizar(cena, inn, "membrana_interna", mats["interna"], "Membrana interna", deformar)

    # ---- Estroma: forro interno, logo abaixo da membrana interna --------------------------
    m = C.Montador()
    C.meia_elipsoide_interna(m, eixos_menos(d3 + 0.006), 40, 28)
    C.finalizar(cena, m.objeto("estroma", aux), "estroma", mats["estroma"], "Estroma", deformar, usa_tom=False)

    # ---- Grana: pilhas de discos. Uma fileira cortada ao meio (centro em y = 0) e outra atrás
    grana = []
    xs_frente = [-1.62, -0.97, -0.32, 0.33, 0.98, 1.63]
    for x in xs_frente:
        grana.append(dict(c=Vector((x + rng.uniform(-0.03, 0.03), 0.0, rng.uniform(-0.08, 0.08))),
                          r=rng.uniform(0.25, 0.29), n=rng.choice([8, 9, 10, 11])))
    for x in (-1.3, -0.65, 0.0, 0.65, 1.3):
        grana.append(dict(c=Vector((x + rng.uniform(-0.04, 0.04), 0.76, rng.uniform(-0.06, 0.06))),
                          r=rng.uniform(0.24, 0.27), n=rng.choice([7, 8, 9])))
    for g in grana:
        g["z"] = [g["c"].z + (k - (g["n"] - 1) / 2) * T_PASSO for k in range(g["n"])]

    m_out, m_lum, m_cil = C.Montador(), C.Montador(), C.Montador()
    for g in grana:
        for z in g["z"]:
            C.disco(m_out, (g["c"].x, g["c"].y, z), g["r"], T_MEIA)
            if g["c"].y < g["r"]:   # só os discos que o corte atravessa precisam do lúmen
                C.disco(m_lum, (g["c"].x, g["c"].y, z), g["r"] - T_MEMB, T_MEIA - T_MEMB)
        alt = (g["n"] * T_PASSO) / 2 + 0.03
        C.tubo(m_cil, [g["c"] - Vector((0, 0, alt)), g["c"] + Vector((0, 0, alt))], g["r"] + 0.012, lados=16)

    # ---- Lamelas estromais: ligam um disco de um granum a um disco do vizinho -------------
    #    Começam e terminam na horizontal, no nível exato do disco, e sobem ou descem no meio.
    def ligar(ga, ka, gb, kb, y, larg):
        xa = ga["c"].x + ga["r"] - 0.06
        xb = gb["c"].x - gb["r"] + 0.06
        za, zb = ga["z"][ka], gb["z"][kb]
        cam = [Vector((xa, y, za)), Vector((xa + 0.11, y, za)), Vector((xb - 0.11, y, zb)), Vector((xb, y, zb))]
        # um pouco mais fina que o disco, para não ter faces coplanares na união
        C.lamina(m_out, cam, T_MEIA * 0.92, larg)
        if abs(y) < larg:
            cl = [cam[0] - Vector((0.05, 0, 0))] + cam[1:3] + [cam[3] + Vector((0.05, 0, 0))]
            C.lamina(m_lum, cl, (T_MEIA - T_MEMB) * 0.9, larg - T_MEMB)
        return cam

    lamelas = []
    frente, tras = grana[:6], grana[6:]
    for fila, y, larg in ((frente, 0.0, 0.2), (tras, 0.76, 0.18)):
        for a, b in zip(fila[:-1], fila[1:]):
            ka1 = rng.randrange(1, a["n"] // 2)
            kb1 = rng.randrange(0, b["n"] // 2)
            ka2 = rng.randrange(a["n"] // 2 + 1, a["n"])
            kb2 = rng.randrange(b["n"] // 2 + 1, b["n"] - 1)
            lamelas.append(ligar(a, ka1, b, kb1, y + rng.uniform(-0.03, 0.03), larg))
            lamelas.append(ligar(a, ka2, b, kb2, y + rng.uniform(-0.03, 0.03), larg))

    tilac = m_out.objeto("tilacoides_brutos", aux, solido=True)
    lumen = m_lum.objeto("lumen_bruto", aux, solido=True)
    cilindros = m_cil.objeto("cilindros_grana", aux, solido=True)
    # une o lúmen (lamelas entram nos discos) e já corta ao meio
    C.booleana(lumen, meio, "INTERSECT", auto_intersecao=True)
    # une a membrana, tira o lúmen e corta
    C.booleana(tilac, meio, "INTERSECT", auto_intersecao=True)
    C.booleana(tilac, lumen, "DIFFERENCE")
    lam = C.booleana(C.copiar(tilac, "lamelas", aux), cilindros, "DIFFERENCE")
    C.booleana(tilac, cilindros, "INTERSECT")
    C.finalizar(cena, tilac, "tilacoides", mats["tilacoides"], "Tilacoides (granum)", deformar)
    C.finalizar(cena, lam, "lamelas_estromais", mats["lamelas"], "Lamelas estromais", deformar)
    C.so_faces_do_corte(lumen)
    C.finalizar(cena, lumen, "lumen_do_tilacoide", mats["lumen"], "Lúmen do tilacoide", deformar, usa_tom=False)

    # ---- Obstáculos para espalhar as peças soltas no estroma -------------------------------
    def livre(p, r):
        if not dentro(p, r + 0.03) or p.y < r + 0.02:
            return False
        for g in grana:
            alt = (g["n"] * T_PASSO) / 2 + 0.03
            dxy = math.hypot(p.x - g["c"].x, p.y - g["c"].y)
            if dxy < g["r"] + r + 0.03 and abs(p.z - g["c"].z) < alt + r + 0.03:
                return False
        for cam in lamelas:
            for a, b in zip(cam[:-1], cam[1:]):
                for t in (0.0, 0.25, 0.5, 0.75, 1.0):
                    q = a.lerp(b, t)
                    if abs(p.y - q.y) < 0.22 + r and math.hypot(p.x - q.x, p.z - q.z) < T_MEIA + r + 0.04:
                        return False
        return all((p - q).length > r + rq + 0.02 for q, rq in ocupados)

    ocupados = []

    # ---- Grãos de amido: elipsoides no estroma, um deles cortado ---------------------------
    m = C.Montador()
    for c, s in ((Vector((-2.2, 0.04, 0.02)), (0.24, 0.22, 0.17)),
                 (Vector((2.1, 0.22, -0.05)), (0.28, 0.22, 0.18)),
                 (Vector((0.0, 0.3, -0.72)), (0.36, 0.24, 0.17))):
        C.esfera_uv(m, c, s, seg=24, aneis=12)
        ocupados.append((c, max(s)))
    amido = m.objeto("amido", aux, solido=True)
    C.booleana(amido, meio, "INTERSECT")
    C.finalizar(cena, amido, "graos_de_amido", mats["amido"], "Grãos de amido", deformar, angulo_vivo=180)

    # ---- DNA do cloroplasto: anéis (cromossomo circular) acima e abaixo dos grana -----------
    m = C.Montador()
    for c in (Vector((-1.25, 0.09, 0.62)), Vector((0.65, 0.09, 0.66)), Vector((1.35, 0.09, -0.6))):
        r = rng.uniform(0.075, 0.085)
        f1, f2 = rng.uniform(0, 6.28), rng.uniform(0, 6.28)
        nseg, voltas, rh = 96, 18, 0.008
        eixo = []
        for i in range(nseg):
            t = 2 * math.pi * i / nseg
            rr = r * (1 + 0.07 * math.sin(2 * t + f1) + 0.03 * math.sin(5 * t + f2))
            eixo.append(Vector((c.x + rr * math.cos(t), c.y + 0.01 * math.sin(2 * t + f2), c.z + rr * math.sin(t))))
        for fita in (0, 1):
            cam = []
            for i in range(nseg):
                tg = (eixo[(i + 1) % nseg] - eixo[i - 1]).normalized()
                radial = eixo[i] - c
                radial = (radial - tg * radial.dot(tg)).normalized()
                bi = tg.cross(radial)
                a = voltas * 2 * math.pi * i / nseg + fita * math.pi
                cam.append(eixo[i] + (radial * math.cos(a) + bi * math.sin(a)) * rh)
            C.tubo(m, cam, 0.005, lados=5, fechado=True)
        ocupados.append((c, r + 0.03))
    C.finalizar(cena, m.objeto("dna", aux), "dna_do_cloroplasto", mats["dna"], "DNA do cloroplasto", deformar,
                usa_tom=False, angulo_vivo=180)

    # ---- Plastoglóbulos: gotículas de lipídio, perto das lamelas ----------------------------
    m = C.Montador()
    n = 0
    tent = 0
    while n < 8 and tent < 20000:
        tent += 1
        cam = rng.choice(lamelas)
        q = cam[1].lerp(cam[2], rng.random())
        r = rng.uniform(0.045, 0.065)
        p = q + Vector((0, rng.uniform(0.25, 0.4), rng.choice([-1, 1]) * rng.uniform(0.05, 0.12)))
        if livre(p, r):
            C.esfera(m, p, r)
            ocupados.append((p, r))
            n += 1
    C.finalizar(cena, m.objeto("pg", aux), "plastoglobulos", mats["plastoglobulos"], "Plastoglóbulos", deformar,
                usa_tom=False, angulo_vivo=180)

    # ---- Ribossomos (70S, do tipo bacteriano): soltos no estroma ----------------------------
    m = C.Montador()
    n = 0
    tent = 0
    while n < 70 and tent < 60000:
        tent += 1
        a, b, c = eixos_menos(d3 + 0.08)
        p = Vector((rng.uniform(-a, a), 0.04 + (b - 0.04) * rng.random() ** 1.5, rng.uniform(-c, c)))
        if not livre(p, 0.022):
            continue
        ocupados.append((p, 0.022))
        d = Vector((rng.uniform(-1, 1), rng.uniform(-1, 1), rng.uniform(-1, 1))).normalized()
        C.esfera(m, p, 0.02, eixo=d, achatar=0.8)
        C.esfera(m, p + d * 0.018, 0.0135, eixo=d, achatar=0.75, modelo=C.ICO20)
        n += 1
    C.finalizar(cena, m.objeto("rib", aux), "ribossomos", mats["ribossomos"], "Ribossomos", deformar,
                usa_tom=False, angulo_vivo=180)
    return cena


def main():
    cena = construir()
    C.exportar(cena, ARQ_GLB)
    C.relatorio(cena, ARQ_GLB)
    C.preparar_previa(dist=10.6, alvo=(0.0, 0.25, -0.05), amostras=AMOSTRAS)
    C.salvar_blend(ARQ_BLEND)
    if not SEM_PREVIA:
        C.renderizar_previa(ARQ_PREVIA)
        print("  prévia:", ARQ_PREVIA)


if __name__ == "__main__":
    main()
