# -*- coding: utf-8 -*-
"""
Diorama piloto do card "Biologia molecular" da página inicial (estilo Campo escuro).

Plataforma redonda flutuante, low poly, vista em câmera isométrica, com 4 elementos:
  1. poça de água com 3 moléculas de H2O (O vermelho CPK, H branco);
  2. pequena hélice de DNA (fitas violeta --sci-nucleo, pares de bases nas cores do módulo 01);
  3. cristal de sal: retículo cúbico 3x3x3 de NaCl (Cl- maior, Na+ menor);
  4. anel de glicose (5 C cinza CPK + 1 O vermelho CPK), flutuando inclinado.

Tudo procedural, feito do zero pela equipe: nenhum modelo, textura, HDRI ou imagem de terceiros.
Materiais foscos tipo argila, luz suave, sombras macias, emissão discreta (sem neon).
Fundo transparente: o card já tem o fundo --bg (#0B0F1C).

Uso:  python3 diorama_bio_molecular.py [--amostras 64] [--sem-previa]
Saídas:
  site/assets/dioramas/biologia-molecular.png   (800x800, RGBA, EEVEE)
  site/assets/dioramas/biologia-molecular.webp  (< 120 KB, Pillow)
  /mnt/project-files/prints/home/diorama-biologia-molecular.png (prévia sobre --bg; só se a pasta existir)

Observação: no container sem GPU o EEVEE roda via Mesa (llvmpipe), precisa de libegl1 + libegl-mesa0.
"""

import math
import os
import random
import sys
import tempfile

import bpy
from mathutils import Vector, Matrix

AQUI = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.normpath(os.path.join(AQUI, "..", ".."))
SAIDA_DIR = os.path.join(ASSETS, "dioramas")
SAIDA_PNG = os.path.join(SAIDA_DIR, "biologia-molecular.png")
SAIDA_WEBP = os.path.join(SAIDA_DIR, "biologia-molecular.webp")
PREVIA_DIR = "/mnt/project-files/prints/home"
PREVIA_PNG = os.path.join(PREVIA_DIR, "diorama-biologia-molecular.png")
LADO = 800
WEBP_MAX = 120 * 1024

# Cores do guia (site/base.css). Plataforma: tons da interface, escuros e discretos.
COR = {
    "bg": "#0B0F1C",            # --bg
    "stage_in": "#161D33",      # --stage-in
    "plat_topo": "#232C47",     # entre --panel-2 e --line
    "plat_borda": "#1E2742",    # perto de --panel-2
    "plat_rocha": "#1B2440",    # --panel-2
    "agua": "#2A9FC9",          # --sci-vacuolo (água e reserva)
    "dna": "#9A6BFF",           # --sci-nucleo (informação genética)
    "base_a": "#39E58C", "base_t": "#FF4F6D", "base_g": "#FFC53D", "base_c": "#3FA9FF",
    "cpk_o": "#FF4D4D", "cpk_h": "#F2F4F8", "cpk_c": "#9AA3B2",
    # Na e Cl não estão no guia: CPK (Jmol) suavizado. Na clareado para não competir com o violeta do DNA.
    "cl": "#5FD36E", "na": "#CBBDF5",
    "ligacao": "#CFE0FF",       # --sci-citoesqueleto (linhas finas)
    "brilho": "#FFE1A6",        # --sci-ribossomo (pontos pequenos)
}


def lin(h):
    h = h.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255.0 for i in (0, 2, 4)]
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c)


def srgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


# ---------------------------------------------------------------------------
# Materiais (foscos, tipo argila / plástico)
# ---------------------------------------------------------------------------
_MATS = {}


def mat(nome, hex_cor, rug=0.78, emis=0.0, hex_emis=None):
    chave = (nome, hex_cor, rug, emis)
    if chave in _MATS:
        return _MATS[chave]
    m = bpy.data.materials.new(nome)
    if hasattr(m, "use_nodes") and not m.node_tree:
        m.use_nodes = True
    p = m.node_tree.nodes.get("Principled BSDF")
    p.inputs["Base Color"].default_value = (*lin(hex_cor), 1.0)
    p.inputs["Roughness"].default_value = rug
    if "Specular IOR Level" in p.inputs:
        p.inputs["Specular IOR Level"].default_value = 0.25
    if "Coat Weight" in p.inputs:
        p.inputs["Coat Weight"].default_value = 0.0
    if emis > 0:
        p.inputs["Emission Color"].default_value = (*lin(hex_emis or hex_cor), 1.0)
        p.inputs["Emission Strength"].default_value = emis
    _MATS[chave] = m
    return m


def aplicar(ob, m, liso=True):
    ob.data.materials.clear()
    ob.data.materials.append(m)
    for pol in ob.data.polygons:
        pol.use_smooth = liso
    return ob


# ---------------------------------------------------------------------------
# Primitivas
# ---------------------------------------------------------------------------

def esfera(c, r, m, sub=3):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=sub, radius=r, location=c)
    return aplicar(bpy.context.object, m)


def cilindro_entre(a, b, r, m, lados=12):
    a, b = Vector(a), Vector(b)
    d = b - a
    bpy.ops.mesh.primitive_cylinder_add(vertices=lados, radius=r, depth=d.length, location=(a + b) / 2)
    ob = bpy.context.object
    ob.rotation_euler = d.to_track_quat("Z", "Y").to_euler()
    return aplicar(ob, m)


def chanfro(ob, largura, segs=3):
    md = ob.modifiers.new("chanfro", "BEVEL")
    md.width = largura
    md.segments = segs
    md.limit_method = "ANGLE"
    return ob


# Eixos da tela na câmera isométrica: D = direita, F = para frente (em direção ao observador)
D = Vector((1, 1, 0)).normalized()
F = Vector((1, -1, 0)).normalized()


def pos(a, b, z=0.0):
    return a * D + b * F + Vector((0, 0, z))


# ---------------------------------------------------------------------------
# Peças
# ---------------------------------------------------------------------------

def plataforma():
    # tampo: disco low poly com borda chanfrada (o topo fica em z = 0)
    bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=2.0, depth=0.34, location=(0, 0, -0.17))
    tampo = bpy.context.object
    tampo.name = "plataforma_tampo"
    chanfro(tampo, 0.07, 2)
    aplicar(tampo, mat("plataforma", COR["plat_topo"], 0.9), liso=False)
    # "rocha" de baixo: cone irregular facetado, mais escuro
    # (alta o bastante para a ponta aparecer abaixo da borda na vista isométrica)
    bpy.ops.mesh.primitive_cone_add(vertices=12, radius1=1.85, radius2=0.12, depth=2.5,
                                    location=(0, 0, -0.3 - 1.25), rotation=(math.pi, 0, 0))
    rocha = bpy.context.object
    rocha.name = "plataforma_rocha"
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.subdivide(number_cuts=2)
    bpy.ops.object.mode_set(mode="OBJECT")
    rnd = random.Random(7)
    for v in rocha.data.vertices:
        if v.co.z < 1.2:  # o anel de cima (encostado no tampo) fica fixo
            k = 0.16
            v.co.x += rnd.uniform(-k, k)
            v.co.y += rnd.uniform(-k, k)
            v.co.z += rnd.uniform(-0.1, 0.1)
    aplicar(rocha, mat("rocha", COR["plat_rocha"], 0.95), liso=False)
    # faixa da borda, um tom abaixo do tampo
    bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=1.985, depth=0.12, location=(0, 0, -0.30))
    aplicar(bpy.context.object, mat("borda", COR["plat_borda"], 0.9), liso=False)


def molecula_agua(o, giro, incl):
    """H2O space-filling: ângulo H-O-H de 104,5 graus."""
    m_o = mat("cpk_O", COR["cpk_o"], 0.6)
    m_h = mat("cpk_H", COR["cpk_h"], 0.6)
    o = Vector(o)
    esfera(o, 0.17, m_o)
    meia = math.radians(104.5 / 2)
    rot = Matrix.Rotation(giro, 3, "Z") @ Matrix.Rotation(incl, 3, "X")
    for s in (-1, 1):
        dirc = rot @ Vector((math.sin(meia) * s, 0, math.cos(meia)))
        esfera(o + dirc * 0.19, 0.105, m_h)


def poca():
    c = pos(-1.0, -0.05)
    # margem levemente elevada
    bpy.ops.mesh.primitive_torus_add(major_radius=0.8, minor_radius=0.07, major_segments=24, minor_segments=8,
                                     location=c + Vector((0, 0, 0.01)))
    aplicar(bpy.context.object, mat("margem", "#2C3757", 0.9))
    # superfície da água (opaca, com emissão bem suave)
    bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=0.8, depth=0.04, location=c + Vector((0, 0, 0.0)))
    aplicar(bpy.context.object, mat("agua", COR["agua"], 0.3, emis=0.35), liso=False)
    # 3 moléculas boiando, meio afundadas
    for (a, b, g, i) in ((-0.28, -0.22, 0.4, 0.5), (0.3, -0.05, 2.2, -0.3), (-0.02, 0.36, 4.1, 0.9)):
        molecula_agua(c + a * D + b * F + Vector((0, 0, 0.07)), g, i)


def dna():
    base = pos(-0.15, -0.95)
    altura, raio, voltas, n = 1.75, 0.34, 1.4, 12
    z0 = 0.16
    m_fita = mat("dna_fita", COR["dna"], 0.6, emis=0.12)
    pares = ["AT", "GC", "TA", "CG", "AT", "GC", "GC", "TA", "AT", "CG", "TA", "GC"]
    m_base = {k: mat("base_" + k, COR["base_" + k.lower()], 0.65, emis=0.18) for k in "ATGC"}
    for fita, fase in ((0, 0.0), (1, math.radians(150))):
        pts = []
        for j in range(97):
            t = j / 96
            ang = t * voltas * 2 * math.pi + fase
            pts.append(base + Vector((raio * math.cos(ang), raio * math.sin(ang), z0 + t * altura)))
        cd = bpy.data.curves.new("fita%d" % fita, "CURVE")
        cd.dimensions = "3D"
        cd.bevel_depth = 0.055
        cd.bevel_resolution = 3
        cd.use_fill_caps = True
        sp = cd.splines.new("POLY")
        sp.points.add(len(pts) - 1)
        for p, q in zip(sp.points, pts):
            p.co = (*q, 1)
        ob = bpy.data.objects.new("dna_fita%d" % fita, cd)
        bpy.context.scene.collection.objects.link(ob)
        ob.data.materials.append(m_fita)
    for i in range(n):
        t = (i + 0.5) / n
        ang = t * voltas * 2 * math.pi
        z = z0 + t * altura
        p1 = base + Vector((raio * math.cos(ang), raio * math.sin(ang), z))
        p2 = base + Vector((raio * math.cos(ang + math.radians(150)), raio * math.sin(ang + math.radians(150)), z))
        meio = (p1 + p2) / 2
        cilindro_entre(p1, meio, 0.04, m_base[pares[i][0]], 10)
        cilindro_entre(meio, p2, 0.04, m_base[pares[i][1]], 10)
    # pé arredondado onde a hélice se apoia
    bpy.ops.mesh.primitive_cylinder_add(vertices=20, radius=0.46, depth=0.1, location=base + Vector((0, 0, 0.05)))
    ob = chanfro(bpy.context.object, 0.04, 3)
    aplicar(ob, mat("pe", "#2C3757", 0.9))


def sal():
    c = pos(1.0, -0.05)
    s = 0.28
    m_cl = mat("Cl", COR["cl"], 0.6)
    m_na = mat("Na", COR["na"], 0.6)
    m_l = mat("ligacao", COR["ligacao"], 0.55)
    def p(i, j, k):
        return c + Vector(((i - 1) * s, (j - 1) * s, 0.14 + k * s))
    for i in range(3):
        for j in range(3):
            for k in range(3):
                if (i + j + k) % 2 == 0:
                    esfera(p(i, j, k), 0.12, m_cl)
                else:
                    esfera(p(i, j, k), 0.08, m_na)
                # arestas do retículo: deixam o cubo legível em tamanho pequeno
                for (di, dj, dk) in ((1, 0, 0), (0, 1, 0), (0, 0, 1)):
                    if i + di < 3 and j + dj < 3 and k + dk < 3:
                        cilindro_entre(p(i, j, k), p(i + di, j + dj, k + dk), 0.022, m_l, 8)


def glicose():
    c = pos(0.3, 1.3, 0.5)
    m_c = mat("cpk_C", COR["cpk_c"], 0.6)
    m_o = mat("cpk_O", COR["cpk_o"], 0.6)
    m_l = mat("ligacao", COR["ligacao"], 0.55)
    # anel no plano local XY, inclinado para o observador
    rot = Matrix.Rotation(math.radians(45), 3, "Z") @ Matrix.Rotation(math.radians(-62), 3, "X") \
        @ Matrix.Rotation(math.radians(30), 3, "Z")
    R = 0.42
    pts = [c + rot @ Vector((R * math.cos(k * math.pi / 3), R * math.sin(k * math.pi / 3), 0)) for k in range(6)]
    for k in range(6):
        cilindro_entre(pts[k], pts[(k + 1) % 6], 0.05, m_l, 10)
    for k, p in enumerate(pts):
        esfera(p, 0.13 if k == 0 else 0.12, m_o if k == 0 else m_c)


def brilhos():
    m = mat("brilho", COR["brilho"], 0.5, emis=2.2)
    for p in (pos(-1.1, -0.6, 1.0), pos(1.1, 0.7, 1.25), pos(-1.55, 0.9, 0.5), pos(1.45, -1.2, 1.55)):
        esfera(p, 0.04, m, sub=2)


# ---------------------------------------------------------------------------
# Cena, luz, câmera, render
# ---------------------------------------------------------------------------

def cena_base(amostras):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    cena = bpy.context.scene
    r = cena.render
    r.engine = "BLENDER_EEVEE"
    r.resolution_x = r.resolution_y = LADO
    r.resolution_percentage = 100
    r.film_transparent = True
    r.image_settings.file_format = "PNG"
    r.image_settings.color_mode = "RGBA"
    ev = cena.eevee
    ev.taa_render_samples = amostras
    for nome, val in (("use_raytracing", True), ("use_shadows", True), ("shadow_ray_count", 2),
                      ("shadow_step_count", 8), ("use_gtao", True), ("gtao_distance", 0.6)):
        if hasattr(ev, nome):
            try:
                setattr(ev, nome, val)
            except Exception:
                pass
    cena.view_settings.view_transform = "AgX"
    cena.view_settings.exposure = 0.0
    mundo = bpy.data.worlds.new("palco")
    cena.world = mundo
    fundo = mundo.node_tree.nodes["Background"]
    fundo.inputs["Color"].default_value = (*lin("#3A4566"), 1.0)
    fundo.inputs["Strength"].default_value = 0.9
    return cena


def luz(tipo, nome, cor, energia, posicao, alvo=(0, 0, 0.3), tam=None, angulo=None):
    d = bpy.data.lights.new(nome, tipo)
    d.energy = energia
    d.color = lin(cor)
    if tam is not None:
        d.size = tam
    if angulo is not None:
        d.angle = angulo
    ob = bpy.data.objects.new(nome, d)
    bpy.context.scene.collection.objects.link(ob)
    ob.location = posicao
    ob.rotation_euler = (Vector(alvo) - Vector(posicao)).to_track_quat("-Z", "Y").to_euler()
    return ob


def luzes_e_camera():
    # sol principal largo (sombras macias), vindo do alto à esquerda do observador
    luz("SUN", "sol", "#FFF4E6", 3.2, (-2.0, -6.0, 8.0), angulo=math.radians(14))
    # preenchimento frio à direita, contorno por trás para soltar a peça do fundo escuro
    luz("AREA", "preenchimento", "#CFE0FF", 260, (6.0, 1.0, 3.0), tam=5.0)
    luz("AREA", "contorno", "#BFD4FF", 500, (-4.5, 4.5, 3.5), tam=4.0)
    # rebatida fria por baixo: só para a rocha facetada não sumir no fundo escuro
    luz("AREA", "rebatida", "#8FA6D9", 220, (3.0, -3.5, -3.2), alvo=(0, 0, -0.9), tam=4.0)
    cam_d = bpy.data.cameras.new("camera")
    cam_d.type = "ORTHO"
    cam_d.ortho_scale = 5.7
    cam_d.clip_end = 100
    cam = bpy.data.objects.new("camera", cam_d)
    bpy.context.scene.collection.objects.link(cam)
    # isométrica verdadeira: 54,736 graus em X, 45 graus em Z
    cam.rotation_euler = (math.radians(54.736), 0, math.radians(45))
    alvo = Vector((0, 0, 0.0))
    direcao = cam.rotation_euler.to_matrix() @ Vector((0, 0, 1))
    cam.location = alvo + direcao * 20
    bpy.context.scene.camera = cam


def renderizar(arq):
    tmp = os.path.join(tempfile.mkdtemp(prefix="lab-diorama-"), "r.png")
    bpy.context.scene.render.filepath = tmp
    bpy.ops.render.render(write_still=True)
    from PIL import Image
    im = Image.open(tmp).convert("RGBA")
    os.makedirs(os.path.dirname(arq), exist_ok=True)
    im.save(arq, optimize=True)
    os.remove(tmp)
    return im


def salvar_webp(im, arq):
    for q in (86, 80, 74, 68, 60, 50):
        im.save(arq, "WEBP", quality=q, method=6, alpha_quality=90)
        if os.path.getsize(arq) <= WEBP_MAX:
            return q
    return None


def previa(im, arq):
    """Prévia para a Nalu: o diorama grande sobre --bg e, ao lado, nos tamanhos de card (240 e 120 px)."""
    from PIL import Image
    import numpy as np
    W, H = 1280, 800
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    d = np.sqrt(((xx - W * 0.36) / (W * 0.6)) ** 2 + ((yy - H / 2) / (H * 0.8)) ** 2)
    t = np.clip(d, 0, 1) ** 1.3
    c0 = np.array(srgb(COR["stage_in"]), np.float32)
    c1 = np.array(srgb(COR["bg"]), np.float32)
    fundo = c0 * (1 - t[..., None]) + c1 * t[..., None]
    tela = Image.fromarray(np.clip(fundo + 0.5, 0, 255).astype(np.uint8), "RGB").convert("RGBA")
    tela.alpha_composite(im.resize((760, 760), Image.LANCZOS), (40, 20))
    # "cards" do tamanho real, fundo --bg chapado com contorno --line
    from PIL import ImageDraw
    dr = ImageDraw.Draw(tela)
    for (x, y, lado) in ((880, 120, 280), (950, 470, 140)):
        dr.rounded_rectangle((x - 12, y - 12, x + lado + 12, y + lado + 12), 16,
                             fill=srgb(COR["bg"]) + (255,), outline=srgb("#2C3757") + (255,), width=1)
        tela.alpha_composite(im.resize((lado, lado), Image.LANCZOS), (x, y))
    os.makedirs(os.path.dirname(arq), exist_ok=True)
    tela.convert("RGB").save(arq, optimize=True)


def main():
    a = sys.argv[1:]
    amostras = int(a[a.index("--amostras") + 1]) if "--amostras" in a else 64
    cena_base(amostras)
    plataforma()
    poca()
    dna()
    sal()
    glicose()
    brilhos()
    luzes_e_camera()
    im = renderizar(SAIDA_PNG)
    q = salvar_webp(im, SAIDA_WEBP)
    print("png:", SAIDA_PNG, os.path.getsize(SAIDA_PNG), "bytes")
    print("webp:", SAIDA_WEBP, os.path.getsize(SAIDA_WEBP), "bytes, qualidade", q)
    if "--sem-previa" not in a and os.path.isdir(os.path.dirname(PREVIA_DIR)):
        previa(im, PREVIA_PNG)
        print("prévia:", PREVIA_PNG)


if __name__ == "__main__":
    main()
