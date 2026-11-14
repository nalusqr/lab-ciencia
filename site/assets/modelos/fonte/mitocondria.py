# -*- coding: utf-8 -*-
"""
Mitocôndria 3D procedural, em corte longitudinal.
LAB · Ciência em movimento, módulo 05 (Célula). Autora: Íris (artista e gerente de assets).

Tudo aqui é gerado por este script: nenhum modelo, textura, HDRI ou código de terceiros.
A semente é fixa, então rodar de novo produz os mesmos arquivos.

Como rodar (o módulo `bpy` do Blender 5.3 precisa estar instalado no python3):

    python3 site/assets/modelos/fonte/mitocondria.py             # gera tudo
    python3 site/assets/modelos/fonte/mitocondria.py --sem-previa  # pula a renderização (rápido)
    python3 site/assets/modelos/fonte/mitocondria.py --amostras 32 # menos amostras no Cycles

Saídas (em site/assets/modelos/):
    mitocondria.glb            modelo para o three.js (sem Draco)
    mitocondria.blend          a mesma cena, com câmera e luzes, para abrir no Blender
    previa-mitocondria.png     renderização 1200 × 800 sobre o fundo do palco do guia

Unidade: 1 unidade do Blender = 1 µm. Eixo maior da organela no eixo X.
O corte é o plano y = 0 do Blender; fica só a metade y >= 0. No glTF (Y para cima),
isso vira o plano z = 0, e a face aberta olha para +Z, onde a câmera do three.js fica
por padrão.
"""

import math
import os
import random
import sys
import tempfile

import bpy  # precisa vir antes de bmesh e mathutils quando o Blender é usado como módulo
import bmesh
from mathutils import Vector, noise

# ---------------------------------------------------------------------------
# Parâmetros gerais
# ---------------------------------------------------------------------------

SEMENTE = 1959                 # semente fixa: mesmo resultado a cada execução
ORCAMENTO_TRIS = 62000         # pedido: "cerca de 60 mil" triângulos
ORCAMENTO_BYTES = 1.5 * 1024 * 1024  # pedido: até 1,5 MB

AQUI = os.path.dirname(os.path.abspath(__file__))
PASTA_MODELOS = os.path.dirname(AQUI)
ARQ_GLB = os.path.join(PASTA_MODELOS, "mitocondria.glb")
ARQ_BLEND = os.path.join(PASTA_MODELOS, "mitocondria.blend")
ARQ_PREVIA = os.path.join(PASTA_MODELOS, "previa-mitocondria.png")

# Medidas (µm). Valores reais entre parênteses. As espessuras estão exageradas
# cerca de 2,5 vezes, senão as membranas somem na tela do celular.
R_EXT = 0.42           # raio externo (diâmetro real: 0,5 a 1 µm)
MEIO_CILINDRO = 0.68   # metade do trecho reto; comprimento total = 2 × (0,68 + 0,42) = 2,2 µm
E_MEMBRANA_EXT = 0.018  # membrana externa (real: ~7 nm)
E_INTERMEMBRANAS = 0.030  # espaço intermembranas (real: ~10 a 20 nm)
E_MEMBRANA_INT = 0.018  # membrana interna (real: ~7 nm)

R_EXT_DENTRO = R_EXT - E_MEMBRANA_EXT          # face de dentro da membrana externa
R_INT_FORA = R_EXT_DENTRO - E_INTERMEMBRANAS   # face de fora da membrana interna
R_INT_DENTRO = R_INT_FORA - E_MEMBRANA_INT     # face da membrana interna voltada à matriz
R_MATRIZ = R_INT_DENTRO - 0.004                # "forro" da matriz, logo abaixo

# Resolução das superfícies em cápsula
N_TAMPA = 12    # divisões em cada ponta arredondada
N_RETO = 24     # divisões no trecho reto
N_GIRO = 40     # divisões no meio giro (a metade que fica)

# Cristas
CRISTA_H = 0.024        # meia espessura da crista (dobra com duas membranas)
CRISTA_T = 0.015        # espessura de cada membrana da crista
CRISTA_EMBUTE = 0.008   # quanto a crista entra na membrana interna (esconde a emenda)

# Tons de corte (fator multiplicado na cor base, em espaço linear, como o `corte()` do materials.js)
TOM_CORTE = 0.62
TOM_LUMEN = 0.48        # interior da crista (espaço intracristas), mais escuro

# Cores da paleta científica do guia (seção 2.3), em sRGB
SCI = {
    "energia": "#F25C3B",     # mitocôndria, cristas, ATP sintase
    "genetica": "#9A6BFF",    # DNA dentro da célula
    "ribossomo": "#FFE1A6",   # ribossomos e grânulos
    "citoplasma": "#2A1E3D",  # ameixa escuro
    "lamina": "#131A2B",      # --panel
    "branco": "#FFFFFF",
}

ARGS = sys.argv[1:]
SEM_PREVIA = "--sem-previa" in ARGS
AMOSTRAS = int(ARGS[ARGS.index("--amostras") + 1]) if "--amostras" in ARGS else 64

rng = random.Random(SEMENTE)
noise.seed_set(SEMENTE)


# ---------------------------------------------------------------------------
# Utilidades de cor
# ---------------------------------------------------------------------------

def hex_para_srgb(h):
    h = h.lstrip("#")
    return [int(h[i:i + 2], 16) / 255.0 for i in (0, 2, 4)]


def srgb_para_linear(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def cor_linear(h):
    """Hex sRGB do guia -> RGB linear (o que o Blender e o glTF esperam)."""
    return tuple(srgb_para_linear(c) for c in hex_para_srgb(h))


def misturar_hex(a, b, t):
    """Mistura dois hex em sRGB (t = 0 dá a, t = 1 dá b). Usado para tons da mesma família."""
    ca, cb = hex_para_srgb(a), hex_para_srgb(b)
    return "#" + "".join("%02X" % round((x + (y - x) * t) * 255) for x, y in zip(ca, cb))


# ---------------------------------------------------------------------------
# Forma geral: cápsula + deformação suave (deixa a organela levemente irregular)
# ---------------------------------------------------------------------------

def raio_capsula(x, r):
    """Raio da seção transversal de uma cápsula de raio r na posição axial x."""
    ax = abs(x)
    if ax <= MEIO_CILINDRO:
        return r
    d = ax - MEIO_CILINDRO
    return math.sqrt(max(r * r - d * d, 0.0))


_DESLOC = [Vector((rng.uniform(-50, 50), rng.uniform(-50, 50), rng.uniform(-50, 50))) for _ in range(3)]


def deformar(p):
    """Deformação suave aplicada a TODAS as peças, para que continuem encaixadas.
    - curvatura leve em "feijão";
    - uma ponta um pouco mais grossa que a outra;
    - ondulação de baixa frequência (ruído Perlin com a semente fixa).
    O deslocamento em y é proporcional a y, então o plano do corte (y = 0) continua plano."""
    x, y, z = p
    u = x / (MEIO_CILINDRO + R_EXT)
    v = Vector((x, y, z))
    escala = 1.0 + 0.045 * u
    dx = 0.022 * noise.noise(v * 1.4 + _DESLOC[0])
    dz = 0.028 * noise.noise(v * 1.2 + _DESLOC[1])
    sy = 1.0 + 0.06 * noise.noise(v * 1.1 + _DESLOC[2])
    curva = 0.07 * (u * u - 0.33)
    return (x + dx, y * escala * sy, z * escala + dz + curva)


# ---------------------------------------------------------------------------
# Construção de malhas
# ---------------------------------------------------------------------------

COLECAO = None
RAIZ = None


def normal_face(verts, f):
    """Normal de um polígono pelo método de Newell (funciona com n-gonos)."""
    n = Vector((0.0, 0.0, 0.0))
    for i in range(len(f)):
        a = Vector(verts[f[i]])
        b = Vector(verts[f[(i + 1) % len(f)]])
        n.x += (a.y - b.y) * (a.z + b.z)
        n.y += (a.z - b.z) * (a.x + b.x)
        n.z += (a.x - b.x) * (a.y + b.y)
    return n


def orientar(verts, faces, ref, esperado):
    """Garante que as faces apontem para o lado certo: confere a face `ref`
    contra a direção esperada e inverte o grupo inteiro se precisar."""
    if normal_face(verts, faces[ref]).dot(Vector(esperado)) < 0:
        return [tuple(reversed(f)) for f in faces]
    return faces


class Montador:
    """Acumula vértices, faces, tom (cor de vértice) e suavização de uma peça."""

    def __init__(self):
        self.v, self.f, self.tom, self.suave = [], [], [], []

    def vertices(self, pts, tom=1.0):
        base = len(self.v)
        self.v.extend(pts)
        self.tom.extend([tom] * len(pts))
        return base

    def faces(self, faces, suave=True):
        self.f.extend(faces)
        self.suave.extend([suave] * len(faces))


def criar_objeto(nome, mont, material, rotulo, usa_tom=False):
    """Cria o objeto no Blender, já deformado, com material, suavização e cor de vértice."""
    me = bpy.data.meshes.new(nome)
    me.from_pydata([deformar(p) for p in mont.v], [], mont.f)
    me.validate(clean_customdata=False)
    me.polygons.foreach_set("use_smooth", mont.suave[:len(me.polygons)])
    if usa_tom:
        # Cor de vértice "Color": 1 na superfície, 0,62 na face do corte, 0,48 no lúmen da crista.
        # O glTF multiplica baseColorFactor × COLOR_0, então o three.js mostra o mesmo escurecimento.
        at = me.color_attributes.new("Color", "FLOAT_COLOR", "POINT")
        dados = []
        for t in mont.tom:
            dados.extend((t, t, t, 1.0))
        at.data.foreach_set("color", dados)
    me.materials.append(material)
    ob = bpy.data.objects.new(nome, me)
    COLECAO.objects.link(ob)
    ob.parent = RAIZ
    ob["rotulo"] = rotulo          # vai para o glTF em "extras": nome bonito, com acento
    return ob


def perfil_capsula(r):
    """Perfil (x, rho) de uma cápsula de raio r, de uma ponta à outra, sem os polos.
    Todas as camadas usam os mesmos ângulos, então ficam paralelas."""
    pts = []
    for k in range(1, N_TAMPA + 1):
        th = (math.pi / 2) * k / N_TAMPA
        pts.append((-MEIO_CILINDRO - r * math.cos(th), r * math.sin(th)))
    for j in range(1, N_RETO):
        pts.append((-MEIO_CILINDRO + 2 * MEIO_CILINDRO * j / N_RETO, r))
    for k in range(N_TAMPA, 0, -1):
        th = (math.pi / 2) * k / N_TAMPA
        pts.append((MEIO_CILINDRO + r * math.cos(th), r * math.sin(th)))
    return pts


def superficie_meia_capsula(mont, r, para_fora, tom=1.0):
    """Meia cápsula (a metade y >= 0). para_fora=True: normais para fora; senão para o eixo."""
    perfil = perfil_capsula(r)
    pts = []
    for x, rho in perfil:
        for i in range(N_GIRO + 1):
            phi = -math.pi / 2 + math.pi * i / N_GIRO
            pts.append((x, rho * math.cos(phi), rho * math.sin(phi)))
    polo_a = (-MEIO_CILINDRO - r, 0.0, 0.0)
    polo_b = (MEIO_CILINDRO + r, 0.0, 0.0)
    pts += [polo_a, polo_b]
    base = mont.vertices(pts, tom)
    nl, ng = len(perfil), N_GIRO + 1
    ia, ib = base + nl * ng, base + nl * ng + 1
    faces = []
    for k in range(nl - 1):
        for i in range(N_GIRO):
            a = base + k * ng + i
            faces.append((a, a + ng, a + ng + 1, a + 1))
    for i in range(N_GIRO):
        faces.append((ia, base + i, base + i + 1))
        u = base + (nl - 1) * ng
        faces.append((u + i, ib, u + i + 1))
    # face de referência: meio do trecho reto, no fundo (phi = 0, y > 0)
    ref = (nl // 2) * N_GIRO + N_GIRO // 2
    esperado = (0, 1, 0) if para_fora else (0, -1, 0)
    todos = mont.v
    faces = orientar(todos, faces, ref, esperado)
    mont.faces(faces, suave=True)


def faixa_corte(mont, r_fora, r_dentro, y=0.0, tom=TOM_CORTE):
    """Faixa plana no plano do corte entre dois raios (a "fatia" de uma membrana).
    Normais para -y, olhando para quem vê o corte."""
    for sinal in (1, -1):
        cad_f = [(-MEIO_CILINDRO - r_fora, 0.0)] + perfil_capsula(r_fora) + [(MEIO_CILINDRO + r_fora, 0.0)]
        cad_d = [(-MEIO_CILINDRO - r_dentro, 0.0)] + perfil_capsula(r_dentro) + [(MEIO_CILINDRO + r_dentro, 0.0)]
        pts = [(x, y, sinal * rho) for x, rho in cad_f] + [(x, y, sinal * rho) for x, rho in cad_d]
        base = mont.vertices(pts, tom)
        n = len(cad_f)
        faces = []
        for k in range(n - 1):
            faces.append((base + k, base + k + 1, base + n + k + 1, base + n + k))
        faces = orientar(mont.v, faces, n // 2, (0, -1, 0))
        mont.faces(faces, suave=False)


# ---------------------------------------------------------------------------
# Cristas
# ---------------------------------------------------------------------------

class Crista:
    """Uma crista lamelar: dobra da membrana interna para dentro da matriz.
    Em corte ela aparece como um "U" fino: duas membranas que se encontram na ponta,
    com o espaço intracristas (lúmen) no meio. Fica presa à parede de um lado
    (s = +1 em cima, s = -1 embaixo) e alterna com a vizinha, como nas micrografias."""

    NY, NP, NA = 10, 4, 6   # passos ao longo da profundidade, nas placas e na ponta curva

    def __init__(self, xi, s, frac, fase, amp):
        self.xi, self.s, self.frac, self.fase, self.amp = xi, s, frac, fase, amp
        h = CRISTA_H
        self.ric = min(raio_capsula(xi - h, R_INT_DENTRO), raio_capsula(xi + h, R_INT_DENTRO))
        z_fim = (2 * h + 0.03) / frac
        self.psi_e = math.acos(min(1.0, z_fim / self.ric))
        self.y_e = self.ric * math.sin(self.psi_e)

    def onda(self, y, zf):
        """Ondulação suave da lâmina (cristas reais não são placas perfeitas)."""
        return self.amp * math.sin(9.0 * zf + self.fase) + 0.6 * self.amp * math.sin(7.0 * y + 1.7 * self.fase)

    def z_parede(self, y):
        return math.sqrt(max(self.ric ** 2 - y * y, 0.0))

    def z_ponta(self, y):
        """Altura da ponta livre (no referencial do lado preso). A profundidade é
        proporcional à altura da parede, para a crista nunca encostar no outro lado."""
        return self.z_parede(y) * (1.0 - self.frac)

    def perfil(self, a, y):
        """Pontos do "U" (raio a) na profundidade y, já em coordenadas do mundo."""
        h = CRISTA_H
        zc = self.z_ponta(y) + h
        loc = []
        for m in range(self.NP):
            r_top = raio_capsula(self.xi - a, R_INT_DENTRO + CRISTA_EMBUTE)
            zt = math.sqrt(max(r_top ** 2 - y * y, 0.0))
            loc.append((-a, zt + (zc - zt) * m / self.NP))
        for k in range(self.NA + 1):
            al = -math.pi / 2 + math.pi * k / self.NA
            loc.append((a * math.sin(al), zc - a * math.cos(al)))
        for m in range(1, self.NP + 1):
            r_top = raio_capsula(self.xi + a, R_INT_DENTRO + CRISTA_EMBUTE)
            zt = math.sqrt(max(r_top ** 2 - y * y, 0.0))
            loc.append((a, zc + (zt - zc) * m / self.NP))
        return [(self.xi + dx + self.onda(y, zf), y, self.s * zf) for dx, zf in loc]

    def ys(self):
        return [self.ric * math.sin(self.psi_e * j / self.NY) for j in range(self.NY + 1)]

    def montar(self, mont):
        h, t = CRISTA_H, CRISTA_T
        ys = self.ys()
        npf = 2 * self.NP + self.NA + 1
        meio = self.NP + self.NA // 2
        grades = {}
        for nome, a, tom, esperado in (("fora", h, 1.0, (0, 0, -self.s)), ("lumen", h - t, TOM_LUMEN, (0, 0, self.s))):
            pts = []
            for y in ys:
                pts += self.perfil(a, y)
            base = mont.vertices(pts, tom)
            faces = []
            for j in range(self.NY):
                for p in range(npf - 1):
                    a0 = base + j * npf + p
                    faces.append((a0, a0 + npf, a0 + npf + 1, a0 + 1))
            faces = orientar(mont.v, faces, (self.NY // 2) * (npf - 1) + meio, esperado)
            mont.faces(faces, suave=True)
            grades[nome] = base
        # Face do corte (y = 0): o "U" escuro que o aluno vê na fatia
        pf, pd = self.perfil(h, ys[0]), self.perfil(h - t, ys[0])
        base = mont.vertices(pf + pd, TOM_CORTE)
        faces = [(base + p, base + p + 1, base + npf + p + 1, base + npf + p) for p in range(npf - 1)]
        mont.faces(orientar(mont.v, faces, meio, (0, -1, 0)), suave=False)
        # Fundo da crista (lá atrás, perto da parede): fecha a casca e o lúmen
        pf, pd = self.perfil(h, ys[-1]), self.perfil(h - t, ys[-1])
        bf = mont.vertices(pf, 1.0)
        bd = mont.vertices(pd, TOM_LUMEN)
        f1 = orientar(mont.v, [tuple(range(bf, bf + npf))], 0, (0, 1, 0))
        f2 = orientar(mont.v, [tuple(range(bd, bd + npf))], 0, (0, -1, 0))
        mont.faces(f1 + f2, suave=False)

    def bloqueia(self, p, margem):
        """True se o ponto p cai na lâmina desta crista (com margem). Usado para
        espalhar ribossomos sem atravessar as cristas."""
        x, y, z = p
        if y > self.y_e + margem:
            return False
        zf = self.s * z
        if zf < self.z_ponta(y) - margem:
            return False
        xc = self.xi + self.onda(y, zf)
        return abs(x - xc) < CRISTA_H + margem


# ---------------------------------------------------------------------------
# Peças pequenas: esfera base, haste, tubo
# ---------------------------------------------------------------------------

def icosfera(sub):
    bm = bmesh.new()
    bmesh.ops.create_icosphere(bm, subdivisions=sub, radius=1.0)
    v = [tuple(x.co) for x in bm.verts]
    f = [tuple(x.index for x in face.verts) for face in bm.faces]
    bm.free()
    return v, f


ICO1 = icosfera(2)   # 42 vértices, 80 triângulos (no Blender 5, subdivisions=1 é o icosaedro puro)
ICO0 = icosfera(1)   # 12 vértices, 20 triângulos


def base_ortonormal(n):
    n = Vector(n).normalized()
    aux = Vector((0, 0, 1)) if abs(n.z) < 0.9 else Vector((1, 0, 0))
    u = n.cross(aux).normalized()
    return n, u, n.cross(u)


def esfera(mont, centro, raio, eixo=None, achatar=1.0, modelo=ICO1):
    """Esfera (icosfera) com achatamento opcional ao longo de `eixo`."""
    c = Vector(centro)
    pts = []
    for v in modelo[0]:
        p = Vector(v) * raio
        if eixo is not None and achatar != 1.0:
            e = Vector(eixo).normalized()
            p = p + e * (p.dot(e) * (achatar - 1.0))
        pts.append(tuple(c + p))
    base = mont.vertices(pts)
    mont.faces([tuple(base + i for i in f) for f in modelo[1]], suave=True)


def haste(mont, a, b, raio, lados=6):
    """Cilindro aberto de a até b (as pontas ficam escondidas na membrana e na cabeça)."""
    a, b = Vector(a), Vector(b)
    n, u, w = base_ortonormal(b - a)
    pts = []
    for c in (a, b):
        for i in range(lados):
            ang = 2 * math.pi * i / lados
            pts.append(tuple(c + (u * math.cos(ang) + w * math.sin(ang)) * raio))
    base = mont.vertices(pts)
    faces = [(base + i, base + (i + 1) % lados, base + lados + (i + 1) % lados, base + lados + i) for i in range(lados)]
    ref_c = (a + b) * 0.5
    f0 = faces[0]
    centro_face = sum((Vector(mont.v[k]) for k in f0), Vector()) / 4
    mont.faces(orientar(mont.v, faces, 0, tuple(centro_face - ref_c)), suave=True)


def tubo_fechado(mont, caminho, raio, lados=5):
    """Tubo ao longo de um caminho fechado (lista de pontos)."""
    m = len(caminho)
    pts = []
    centros = [Vector(p) for p in caminho]
    for i in range(m):
        tg = (centros[(i + 1) % m] - centros[i - 1]).normalized()
        aux = Vector((0, 1, 0)) if abs(tg.y) < 0.9 else Vector((1, 0, 0))
        u = tg.cross(aux).normalized()
        w = tg.cross(u)
        for k in range(lados):
            ang = 2 * math.pi * k / lados
            pts.append(tuple(centros[i] + (u * math.cos(ang) + w * math.sin(ang)) * raio))
    base = mont.vertices(pts)
    faces = []
    for i in range(m):
        i2 = (i + 1) % m
        for k in range(lados):
            k2 = (k + 1) % lados
            faces.append((base + i * lados + k, base + i2 * lados + k, base + i2 * lados + k2, base + i * lados + k2))
    f0 = faces[0]
    cf = sum((Vector(mont.v[k]) for k in f0), Vector()) / 4
    mont.faces(orientar(mont.v, faces, 0, tuple(cf - centros[0])), suave=True)


# ---------------------------------------------------------------------------
# Materiais (PBR simples, metalness 0, cores da paleta convertidas para linear)
# ---------------------------------------------------------------------------

def material(nome, hex_cor, rugosidade, alfa=1.0, usa_tom=False):
    m = bpy.data.materials.new(nome)
    if hasattr(m, "use_nodes") and not m.use_nodes:
        m.use_nodes = True
    nt = m.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    base = (*cor_linear(hex_cor), 1.0)
    bsdf.inputs["Base Color"].default_value = base
    bsdf.inputs["Metallic"].default_value = 0.0      # nada de metal (guia, seção 5)
    bsdf.inputs["Roughness"].default_value = rugosidade
    if alfa < 1.0:
        bsdf.inputs["Alpha"].default_value = alfa  # vira alphaMode BLEND no glTF
        m.surface_render_method = "BLENDED"
    if usa_tom:
        # cor base × cor de vértice (o exportador transforma em baseColorFactor + COLOR_0)
        attr = nt.nodes.new("ShaderNodeVertexColor")
        attr.layer_name = "Color"
        mix = nt.nodes.new("ShaderNodeMix")
        mix.data_type = "RGBA"
        mix.blend_type = "MULTIPLY"
        mix.inputs[0].default_value = 1.0
        mix.inputs[6].default_value = base
        nt.links.new(attr.outputs["Color"], mix.inputs[7])
        nt.links.new(mix.outputs[2], bsdf.inputs["Base Color"])
        attr.location, mix.location = (-500, 200), (-250, 250)
    m.use_backface_culling = True   # glTF doubleSided = false
    m.diffuse_color = base
    return m


# ---------------------------------------------------------------------------
# Cena
# ---------------------------------------------------------------------------

def limpar_cena():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    global COLECAO, RAIZ
    COLECAO = bpy.data.collections.new("mitocondria")
    bpy.context.scene.collection.children.link(COLECAO)
    RAIZ = bpy.data.objects.new("mitocondria", None)   # nó-pai de todas as peças
    RAIZ.empty_display_size = 0.3
    COLECAO.objects.link(RAIZ)
    RAIZ["rotulo"] = "Mitocôndria"


def posicoes_cristas():
    """Posições ao longo do eixo. Espaçamento normal de 0,13 µm, e três vãos maiores
    (0,20 µm) onde ficam os anéis de DNA, como os nucleoides entre as cristas."""
    vaos = [0.13, 0.13, 0.20, 0.13, 0.13, 0.13, 0.20, 0.13, 0.13, 0.20, 0.13]
    x = -sum(vaos) / 2
    xs = [x]
    for v in vaos:
        x += v
        xs.append(x)
    xs = [xi + rng.uniform(-0.008, 0.008) for xi in xs]
    meios = []
    for i, v in enumerate(vaos):
        if v > 0.15:
            meios.append((xs[i] + xs[i + 1]) / 2)
    return xs, meios


def construir():
    limpar_cena()
    cor = SCI["energia"]
    mats = {
        "membrana_externa": material("membrana_externa", cor, 0.45, alfa=0.5, usa_tom=True),
        "membrana_interna": material("membrana_interna", cor, 0.6, usa_tom=True),
        "cristas": material("cristas", cor, 0.6, usa_tom=True),
        # matriz: tom escuro da família energia puxado para o ameixa do citoplasma
        "matriz": material("matriz", misturar_hex(cor, SCI["citoplasma"], 0.72), 0.85),
        # espaço intermembranas: faixa escura e plana, só aparece na fatia
        "espaco_intermembranas": material("espaco_intermembranas", misturar_hex(cor, SCI["lamina"], 0.78), 0.9),
        "dna_mitocondrial": material("dna_mitocondrial", SCI["genetica"], 0.5),
        "ribossomos": material("ribossomos", SCI["ribossomo"], 0.7),
        # ATP sintase: a cor da família energia, clareada para se separar da crista
        "atp_sintase": material("atp_sintase", misturar_hex(cor, SCI["branco"], 0.32), 0.55),
    }
    objs = {}

    # 1. Membrana externa: lisa, translúcida, com a fatia escurecida
    m = Montador()
    superficie_meia_capsula(m, R_EXT, para_fora=True)
    superficie_meia_capsula(m, R_EXT_DENTRO, para_fora=False)
    faixa_corte(m, R_EXT, R_EXT_DENTRO)
    objs["membrana_externa"] = criar_objeto("membrana_externa", m, mats["membrana_externa"], "Membrana externa", usa_tom=True)

    # 2. Espaço intermembranas: a fatia entre as duas membranas, um fio atrás do plano do corte
    m = Montador()
    faixa_corte(m, R_EXT_DENTRO, R_INT_FORA, y=0.0015, tom=1.0)
    objs["espaco_intermembranas"] = criar_objeto("espaco_intermembranas", m, mats["espaco_intermembranas"], "Espaço intermembranas")

    # 3. Membrana interna (a parte junto à parede; as dobras ficam em "cristas")
    m = Montador()
    superficie_meia_capsula(m, R_INT_FORA, para_fora=True)
    superficie_meia_capsula(m, R_INT_DENTRO, para_fora=False)
    faixa_corte(m, R_INT_FORA, R_INT_DENTRO)
    objs["membrana_interna"] = criar_objeto("membrana_interna", m, mats["membrana_interna"], "Membrana interna", usa_tom=True)

    # 4. Cristas lamelares, alternando em cima e embaixo
    xs, meios_dna = posicoes_cristas()
    cristas = []
    for i, xi in enumerate(xs):
        s = 1 if i % 2 == 0 else -1
        cristas.append(Crista(xi, s, frac=rng.uniform(1.12, 1.3), fase=rng.uniform(0, 6.28), amp=rng.uniform(0.006, 0.012)))
    m = Montador()
    for c in cristas:
        c.montar(m)
    objs["cristas"] = criar_objeto("cristas", m, mats["cristas"], "Cristas", usa_tom=True)

    # 5. Matriz: o "forro" interno, logo abaixo da membrana interna. Fica atrás de tudo,
    #    então clicar no fundo do interior escolhe a matriz sem tapar cristas e grânulos.
    m = Montador()
    superficie_meia_capsula(m, R_MATRIZ, para_fora=False)
    objs["matriz"] = criar_objeto("matriz", m, mats["matriz"], "Matriz mitocondrial")

    # 6. DNA mitocondrial: 3 anéis pequenos (cromossomo circular), cada um com duas
    #    fitas enroladas, nos vãos largos entre cristas, perto do corte para aparecer.
    m = Montador()
    centros_dna = []
    for k, xd in enumerate(meios_dna):
        yd = rng.uniform(0.06, 0.08)
        zd = rng.uniform(-0.12, 0.12)
        r = rng.uniform(0.04, 0.044)
        f1, f2 = rng.uniform(0, 6.28), rng.uniform(0, 6.28)
        centros_dna.append(Vector((xd, yd, zd)))
        nseg, voltas, rh = 96, 16, 0.0055
        eixo = []
        for i in range(nseg):
            t = 2 * math.pi * i / nseg
            rr = r * (1 + 0.07 * math.sin(2 * t + f1) + 0.03 * math.sin(5 * t + f2))  # anel irregular, não um círculo de compasso
            eixo.append(Vector((xd + rr * math.cos(t), yd + 0.008 * math.sin(2 * t + f2), zd + rr * math.sin(t))))
        for fita in (0, 1):
            cam = []
            for i in range(nseg):
                tg = (eixo[(i + 1) % nseg] - eixo[i - 1]).normalized()
                radial = (eixo[i] - Vector((xd, yd, zd)))
                radial = (radial - tg * radial.dot(tg)).normalized()
                bi = tg.cross(radial)
                ang = voltas * 2 * math.pi * i / nseg + fita * math.pi
                cam.append(tuple(eixo[i] + (radial * math.cos(ang) + bi * math.sin(ang)) * rh))
            tubo_fechado(m, cam, 0.0034, lados=5)
    objs["dna_mitocondrial"] = criar_objeto("dna_mitocondrial", m, mats["dna_mitocondrial"], "DNA mitocondrial")

    # 7. ATP sintase: "pirulitos" na face da crista voltada para a matriz.
    #    Ficam em fileiras de dímeros ao longo da borda da crista (onde a curvatura é maior),
    #    as duas cabeças abertas em ~86°, como na criomicroscopia eletrônica.
    m = Montador()
    cabecas = []
    for c in cristas:
        y = 0.022
        while y < min(0.27, c.y_e - 0.03):
            zc = c.z_ponta(y) + CRISTA_H
            for al in (-0.75, 0.75):
                al += rng.uniform(-0.06, 0.06)
                dx, zf = CRISTA_H * math.sin(al), zc - CRISTA_H * math.cos(al)
                ancora = Vector((c.xi + dx + c.onda(y, zf), y, c.s * zf))
                n = Vector((math.sin(al), 0.0, -c.s * math.cos(al))).normalized()
                haste(m, ancora - n * 0.006, ancora + n * 0.02, 0.0034)       # Fo + haste central
                cab = ancora + n * 0.029
                esfera(m, cab, 0.011, eixo=n, achatar=0.9)                   # cabeça F1
                cabecas.append(cab)
            y += 0.034 + rng.uniform(-0.003, 0.003)
    objs["atp_sintase"] = criar_objeto("atp_sintase", m, mats["atp_sintase"], "ATP sintase")

    # 8. Ribossomos mitocondriais: grânulos de duas subunidades, espalhados na matriz,
    #    sem atravessar cristas, DNA, ATP sintases nem uns aos outros.
    m = Montador()
    ribos = []
    tentativas = 0
    while len(ribos) < 80 and tentativas < 60000:
        tentativas += 1
        x = rng.uniform(-(MEIO_CILINDRO + 0.26), MEIO_CILINDRO + 0.26)
        rmax = raio_capsula(x, R_MATRIZ) - 0.035
        if rmax < 0.06:
            continue
        y = 0.032 + (rmax - 0.032) * rng.random() ** 1.6   # mais perto do corte, onde se vê
        zlim = math.sqrt(max(rmax * rmax - y * y, 0.0))
        z = rng.uniform(-zlim, zlim)
        p = Vector((x, y, z))
        if any(c.bloqueia(p, 0.05) for c in cristas):
            continue
        if any((p - d).length < 0.08 for d in centros_dna):
            continue
        if any((p - h).length < 0.045 for h in cabecas):
            continue
        if any((p - q).length < 0.06 for q in ribos):
            continue
        ribos.append(p)
        d = Vector((rng.uniform(-1, 1), rng.uniform(-1, 1), rng.uniform(-1, 1))).normalized()
        esfera(m, p, 0.02, eixo=d, achatar=0.8)                         # subunidade maior
        esfera(m, p + d * 0.019, 0.0135, eixo=d, achatar=0.75, modelo=ICO0)  # subunidade menor
    objs["ribossomos"] = criar_objeto("ribossomos", m, mats["ribossomos"], "Ribossomos")

    return objs


def contar_triangulos(ob):
    me = ob.evaluated_get(bpy.context.evaluated_depsgraph_get()).to_mesh()
    me.calc_loop_triangles()
    n = len(me.loop_triangles)
    ob.to_mesh_clear()
    return n


def caber_no_orcamento(objs):
    """Se passar do orçamento, aplica Decimate nas peças maiores (o exportador aplica
    os modificadores). Com a resolução atual, cabe sem precisar."""
    total = sum(contar_triangulos(o) for o in objs.values())
    if total <= ORCAMENTO_TRIS:
        return total
    grandes = sorted(objs.values(), key=contar_triangulos, reverse=True)[:3]
    excesso = total - ORCAMENTO_TRIS
    soma = sum(contar_triangulos(o) for o in grandes)
    for o in grandes:
        mod = o.modifiers.new("Decimate", "DECIMATE")
        mod.ratio = max(0.3, 1.0 - excesso / soma)
    return sum(contar_triangulos(o) for o in objs.values())


def exportar(objs):
    for o in bpy.context.scene.objects:
        o.select_set(False)
    RAIZ.select_set(True)
    for o in objs.values():
        o.select_set(True)
    bpy.context.view_layer.objects.active = RAIZ
    bpy.ops.export_scene.gltf(
        filepath=ARQ_GLB,
        export_format="GLB",
        use_selection=True,
        export_apply=True,                          # aplica modificadores (Decimate, se houver)
        export_draco_mesh_compression_enable=False,  # sem Draco: compatibilidade simples
        export_texcoords=False,                     # não há texturas: sem UV, arquivo menor
        export_normals=True,
        export_vertex_color="MATERIAL",            # COLOR_0 só onde o material usa (o corte)
        export_extras=True,                         # leva o "rotulo" com acento
        export_cameras=False,
        export_lights=False,
        export_yup=True,
    )


# ---------------------------------------------------------------------------
# Prévia: câmera, luzes do guia (seção 5) e fundo do palco
# ---------------------------------------------------------------------------

def luz_area(nome, hex_cor, energia, pos, tamanho, col):
    dado = bpy.data.lights.new(nome, "AREA")
    dado.energy = energia
    dado.color = cor_linear(hex_cor)
    dado.size = tamanho
    ob = bpy.data.objects.new(nome, dado)
    col.objects.link(ob)
    ob.location = pos
    ob.rotation_euler = (Vector((0, 0, 0)) - Vector(pos)).to_track_quat("-Z", "Y").to_euler()
    return ob


def preparar_cena_previa():
    cena = bpy.context.scene
    col = bpy.data.collections.new("cena_previa")
    cena.collection.children.link(col)

    # Câmera em três quartos, ~22° acima, campo de visão de 32° (guia, seção 5)
    cam_d = bpy.data.cameras.new("camera")
    cam_d.sensor_fit = "HORIZONTAL"
    cam_d.angle = math.radians(32)
    cam = bpy.data.objects.new("camera", cam_d)
    col.objects.link(cam)
    az, el, dist = math.radians(28), math.radians(22), 4.6
    pos = Vector((dist * math.sin(az) * math.cos(el), -dist * math.cos(az) * math.cos(el), dist * math.sin(el)))
    alvo = Vector((0.0, 0.12, -0.02))
    cam.location = pos
    cam.rotation_euler = (alvo - pos).to_track_quat("-Z", "Y").to_euler()
    cena.camera = cam

    # Luzes: principal morna de cima/esquerda, preenchimento frio da direita a 30%, contorno por trás
    luz_area("luz_principal", "#FFF4E6", 420, (-3.0, -3.2, 3.6), 2.5, col)
    luz_area("luz_preenchimento", "#CFE0FF", 126, (3.8, -1.6, 0.6), 2.5, col)
    luz_area("luz_contorno", "#FFFFFF", 380, (0.6, 3.6, 2.4), 2.0, col)

    # Ambiente: cor do palco, fraquinho (dá reflexo sem espelhar)
    mundo = bpy.data.worlds.new("palco")
    cena.world = mundo
    if hasattr(mundo, "use_nodes") and not mundo.use_nodes:
        mundo.use_nodes = True
    fundo = mundo.node_tree.nodes["Background"]
    fundo.inputs["Color"].default_value = (*cor_linear("#3A4566"), 1.0)
    fundo.inputs["Strength"].default_value = 0.35
    mundo.color = cor_linear("#0B0F1C")

    r = cena.render
    r.engine = "CYCLES"
    cena.cycles.device = "CPU"
    cena.cycles.samples = AMOSTRAS
    cena.cycles.use_denoising = True
    cena.cycles.transparent_max_bounces = 16
    cena.cycles.max_bounces = 6
    r.resolution_x, r.resolution_y, r.resolution_percentage = 1200, 800, 100
    r.film_transparent = True            # o degradê do palco entra depois
    r.image_settings.file_format = "PNG"
    r.image_settings.color_mode = "RGBA"
    cena.view_settings.view_transform = "AgX"   # guia: ACES ou AgX, exposição perto de 1
    cena.view_settings.exposure = 0.0


def renderizar_previa():
    tmp = os.path.join(tempfile.mkdtemp(prefix="mitocondria-"), "render.png")
    bpy.context.scene.render.filepath = tmp
    bpy.ops.render.render(write_still=True)
    # Fundo do palco: degradê radial de #161D33 no centro para #0B0F1C nas bordas, com vinheta leve
    from PIL import Image
    import numpy as np
    w, h = 1200, 800
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    d = np.sqrt(((xx - w / 2) / (w * 0.62)) ** 2 + ((yy - h / 2) / (h * 0.75)) ** 2)
    t = np.clip(d, 0, 1) ** 1.3
    c0 = np.array(hex_para_srgb("#161D33"), np.float32) * 255
    c1 = np.array(hex_para_srgb("#0B0F1C"), np.float32) * 255
    fundo = c0[None, None, :] * (1 - t[..., None]) + c1[None, None, :] * t[..., None]
    fundo_img = Image.fromarray(np.clip(fundo + 0.5, 0, 255).astype(np.uint8), "RGB").convert("RGBA")
    frente = Image.open(tmp).convert("RGBA")
    Image.alpha_composite(fundo_img, frente).convert("RGB").save(ARQ_PREVIA, optimize=True)
    os.remove(tmp)


def main():
    objs = construir()
    total = caber_no_orcamento(objs)
    exportar(objs)
    tamanho = os.path.getsize(ARQ_GLB)
    print("\n== mitocondria.glb ==")
    for nome, o in objs.items():
        print("  %-24s %6d triângulos" % (nome, contar_triangulos(o)))
    print("  total: %d triângulos | %.1f KB (orçamento %.0f KB)" % (total, tamanho / 1024, ORCAMENTO_BYTES / 1024))
    if tamanho > ORCAMENTO_BYTES:
        print("  ATENÇÃO: passou do orçamento de 1,5 MB")
    preparar_cena_previa()
    bpy.context.preferences.filepaths.save_version = 0   # sem cópia .blend1 ao lado
    bpy.ops.wm.save_as_mainfile(filepath=ARQ_BLEND, compress=True)
    print("  salvo:", ARQ_BLEND)
    if not SEM_PREVIA:
        renderizar_previa()
        print("  prévia:", ARQ_PREVIA)


if __name__ == "__main__":
    main()
