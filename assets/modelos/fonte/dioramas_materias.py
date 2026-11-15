# -*- coding: utf-8 -*-
"""
Dioramas das 9 matérias para a roda da página inicial (estilo Campo escuro).

Mesmo estilo e mesmo setup do piloto (diorama_bio_molecular.py, de onde vêm a plataforma, os
materiais, a luz, a câmera isométrica e o render EEVEE): ilha escura flutuante, no máximo 3 ou 4
elementos simples e legíveis em tamanho pequeno, cores --sci-*, CPK e --amber do site.
Tudo procedural, feito do zero: nenhum modelo, textura, imagem ou fonte de terceiros (os textos
usam a fonte embutida do próprio Blender). Sem bandeiras de países.

Uso:
  python3 dioramas_materias.py                      # gera os 9 na ordem (os mais simples primeiro)
  python3 dioramas_materias.py historia fisica      # só alguns
  python3 dioramas_materias.py --amostras 48 --saida /tmp/x --sem-folha
Saídas (cada uma gravada assim que fica pronta):
  site/assets/dioramas/materia-<id>.png   (800x800, RGBA, fundo transparente)
  site/assets/dioramas/materia-<id>.webp  (< 60 KB)
  /mnt/project-files/prints/roda/dioramas-materias.png   (folha de contato sobre --bg)
"""

import math
import os
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)

import bpy  # noqa: E402
from mathutils import Matrix, Vector  # noqa: E402

import diorama_bio_molecular as P  # noqa: E402  (piloto: plataforma, materiais, luz, câmera)
from diorama_bio_molecular import mat, esfera, cilindro_entre, chanfro, aplicar, pos, D, F  # noqa: E402

SAIDA_DIR = os.path.join(os.path.normpath(os.path.join(AQUI, "..", "..")), "dioramas")
FOLHA = "/mnt/project-files/prints/roda/dioramas-materias.png"
WEBP_MAX = 60 * 1024

# Cores (site/base.css)
C = {
    "amber": "#FFB347", "txt": "#E8EDF7", "bg": "#0B0F1C", "line": "#2C3757", "line_forte": "#5B6C99",
    "nucleo": "#9A6BFF", "nucleolo": "#6A45D8", "membrana": "#F06AAE", "energia": "#F25C3B",
    "verde": "#3FBF6A", "grana": "#2A9450", "azul": "#4B7BFF", "ouro": "#F7C13B", "creme": "#FFE1A6",
    "turquesa": "#2FCFBF", "agua": "#2A9FC9", "gelo": "#CFE0FF", "citoplasma": "#2A1E3D",
    "prata": "#B9C2D3", "cpk_c": "#9AA3B2", "cpk_o": "#FF4D4D", "cpk_h": "#F2F4F8",
}

NOMES = {
    "historia": "História", "fisica": "Física", "quimica": "Química", "geografia": "Geografia",
    "portugues": "Português", "literatura": "Literatura", "ingles": "Inglês", "espanhol": "Espanhol",
    "biologia": "Biologia",
}
ORDEM = ["historia", "fisica", "quimica", "geografia", "portugues", "literatura", "ingles", "espanhol", "biologia"]

R90 = math.radians(90)
VISTA = Vector((1, -1, 1)).normalized()   # direção da câmera isométrica


def de_frente(eixo):
    """Matriz que põe o Z local em `eixo` e o X local (a largura) de lado para a câmera."""
    z = eixo.normalized()
    x = z.cross(VISTA).normalized()
    y = z.cross(x)
    return Matrix((x, y, z)).transposed()
R45 = math.radians(45)


# ---------------------------------------------------------------------------
# Ajudantes
# ---------------------------------------------------------------------------

def grupo(nome, loc, rz=R45):
    """Empty que agrupa peças. Com rz = 45 graus, o -Y local olha para a câmera."""
    e = bpy.data.objects.new(nome, None)
    bpy.context.scene.collection.objects.link(e)
    e.location = loc
    e.rotation_euler = (0, 0, rz)
    return e


def em(g, ob):
    ob.parent = g
    return ob


def caixa(c, dims, m, bev=0.0, segs=3, liso=True):
    bpy.ops.mesh.primitive_cube_add(size=1, location=c)
    ob = bpy.context.object
    ob.data.transform(Matrix.Diagonal((*dims, 1)))
    if bev:
        chanfro(ob, bev, segs)
    return aplicar(ob, m, liso)


def cil(c, r, h, m, lados=24, bev=0.0, liso=True):
    bpy.ops.mesh.primitive_cylinder_add(vertices=lados, radius=r, depth=h, location=c)
    ob = bpy.context.object
    if bev:
        chanfro(ob, bev, 3)
    return aplicar(ob, m, liso)


def cone(c, r1, r2, h, m, lados=24, rot=(0, 0, 0), liso=True):
    bpy.ops.mesh.primitive_cone_add(vertices=lados, radius1=r1, radius2=r2, depth=h, location=c, rotation=rot)
    return aplicar(bpy.context.object, m, liso)


def toro(c, R, r, m, rot=(0, 0, 0), seg=48):
    bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=r, major_segments=seg, minor_segments=10,
                                     location=c, rotation=rot)
    return aplicar(bpy.context.object, m)


def elipsoide(c, esc, m, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=16, radius=1, location=c, rotation=rot)
    ob = bpy.context.object
    ob.data.transform(Matrix.Diagonal((*esc, 1)))
    return aplicar(ob, m)


def tubo(pts, r, m, nome="tubo"):
    cd = bpy.data.curves.new(nome, "CURVE")
    cd.dimensions = "3D"
    cd.bevel_depth = r
    cd.bevel_resolution = 3
    cd.use_fill_caps = True
    sp = cd.splines.new("POLY")
    sp.points.add(len(pts) - 1)
    for p, q in zip(sp.points, pts):
        p.co = (*q, 1)
    ob = bpy.data.objects.new(nome, cd)
    bpy.context.scene.collection.objects.link(ob)
    cd.materials.append(m)
    return ob


def texto(s, tam, m, ext=0.05):
    cd = bpy.data.curves.new("texto", "FONT")
    cd.body = s
    cd.size = tam
    cd.extrude = ext
    cd.bevel_depth = 0.012
    cd.bevel_resolution = 2
    cd.align_x = "CENTER"
    cd.align_y = "CENTER"
    ob = bpy.data.objects.new("texto", cd)
    bpy.context.scene.collection.objects.link(ob)
    cd.materials.append(m)
    ob.rotation_euler = (R90, 0, 0)   # passa a olhar para -Y local
    return ob


def vidro(nome, hex_cor, alfa=0.28):
    m = bpy.data.materials.new(nome)
    if not m.node_tree:
        m.use_nodes = True
    p = m.node_tree.nodes.get("Principled BSDF")
    p.inputs["Base Color"].default_value = (*P.lin(hex_cor), 1.0)
    p.inputs["Roughness"].default_value = 0.2
    p.inputs["Alpha"].default_value = alfa
    if hasattr(m, "surface_render_method"):
        m.surface_render_method = "BLENDED"
    else:
        m.blend_method = "BLEND"
    m.use_backface_culling = False
    return m


def balao(g, larg, cor, txt, cor_txt, tam):
    """Balão de fala de frente para a câmera, com rabinho embaixo à esquerda."""
    mb = mat("balao_" + cor, cor, 0.7, emis=0.25)
    em(g, caixa((0, 0, 0), (larg, 0.22, 0.82), mb, bev=0.2, segs=5))
    em(g, cone((-larg * 0.22, 0, -0.52), 0.15, 0.0, 0.32, mb, lados=12,
               rot=(math.pi, 0, 0)))
    t = em(g, texto(txt, tam, mat("txt_" + cor_txt, cor_txt, 0.6, emis=0.15), ext=0.04))
    t.location = (0, -0.13, 0.0)


# ---------------------------------------------------------------------------
# Matérias
# ---------------------------------------------------------------------------

def historia():
    pedra = mat("pedra", C["prata"], 0.85)
    # coluna grega (fuste facetado = caneluras low poly)
    c = pos(-0.45, -0.45)
    caixa(c + Vector((0, 0, 0.07)), (0.78, 0.78, 0.14), pedra, bev=0.03)
    cil(c + Vector((0, 0, 0.18)), 0.33, 0.08, pedra, 24, bev=0.02)
    cil(c + Vector((0, 0, 0.87)), 0.25, 1.3, pedra, 14, liso=False)
    cil(c + Vector((0, 0, 1.56)), 0.33, 0.08, pedra, 24, bev=0.02)
    caixa(c + Vector((0, 0, 1.67)), (0.8, 0.8, 0.14), pedra, bev=0.03)
    # tambor caído ao lado
    bpy.ops.mesh.primitive_cylinder_add(vertices=14, radius=0.25, depth=0.5, location=pos(-1.2, 0.55, 0.25),
                                        rotation=(R90, 0, math.radians(20)))
    aplicar(bpy.context.object, pedra, liso=False)
    # ampulheta: molduras douradas, vidro, areia âmbar
    h = pos(0.75, 0.45)
    ouro = mat("moldura", C["ouro"], 0.6)
    cil(h + Vector((0, 0, 0.05)), 0.42, 0.1, ouro, 24, bev=0.03)
    cil(h + Vector((0, 0, 1.25)), 0.42, 0.1, ouro, 24, bev=0.03)
    for k in range(3):
        a = k * 2 * math.pi / 3 + 0.3
        p = h + Vector((0.34 * math.cos(a), 0.34 * math.sin(a), 0))
        cilindro_entre(p + Vector((0, 0, 0.1)), p + Vector((0, 0, 1.2)), 0.035, ouro, 10)
    v = vidro("vidro_amp", C["gelo"])
    cone(h + Vector((0, 0, 0.37)), 0.3, 0.05, 0.55, v)
    cone(h + Vector((0, 0, 0.93)), 0.05, 0.3, 0.55, v)
    areia = mat("areia", C["amber"], 0.8, emis=0.25)
    cone(h + Vector((0, 0, 0.22)), 0.25, 0.02, 0.22, areia)
    cone(h + Vector((0, 0, 0.86)), 0.04, 0.2, 0.26, areia)
    cilindro_entre(h + Vector((0, 0, 0.3)), h + Vector((0, 0, 0.66)), 0.012, areia, 6)


def fisica():
    # átomo flutuando: núcleo (prótons e nêutrons), 3 órbitas, elétrons com brilho suave
    c = pos(-0.3, -0.25, 1.1)
    pr = mat("proton", C["energia"], 0.6)
    ne = mat("neutron", C["prata"], 0.6)
    viz = [(0, 0, 0), (0.12, 0.06, 0.05), (-0.1, 0.08, -0.06), (0.03, -0.12, 0.07), (-0.05, -0.04, 0.13),
           (0.08, 0.02, -0.12), (-0.11, -0.09, -0.03)]
    for k, v in enumerate(viz):
        esfera(c + Vector(v) * 1.15, 0.13, pr if k % 2 == 0 else ne)
    orb = mat("orbita", C["gelo"], 0.5, emis=0.35)
    ele = mat("eletron", C["azul"], 0.4, emis=1.6)
    vista = VISTA.to_track_quat("Z", "Y").to_matrix()   # plano de frente para a câmera
    for k in range(3):
        M = vista @ Matrix.Rotation(k * math.pi / 3, 3, "Z") @ Matrix.Rotation(math.radians(68), 3, "X")
        ob = toro(c, 0.8, 0.02, orb)
        ob.rotation_euler = M.to_euler()
        a = 0.6 + k * 2.3
        esfera(c + M @ Vector((0.8 * math.cos(a), 0.8 * math.sin(a), 0)), 0.08, ele)
    # pé discreto sob o átomo
    cil(pos(-0.3, -0.25, 0.04), 0.3, 0.08, mat("pe", C["line"], 0.9), 24, bev=0.03)
    # ímã em ferradura de pé, de frente para a câmera
    g = grupo("ima", pos(0.95, 0.55))
    arco = [Vector((-0.28, 0, 0.75)), Vector((-0.28, 0, 0.45))]
    for j in range(1, 16):
        a = math.pi + j * math.pi / 16
        arco.append(Vector((0.28 * math.cos(a), 0, 0.45 + 0.28 * math.sin(a))))
    arco += [Vector((0.28, 0, 0.45)), Vector((0.28, 0, 0.75))]
    em(g, tubo(arco, 0.12, mat("ima", C["energia"], 0.6)))
    for s in (-1, 1):
        em(g, cil((0.28 * s, 0, 0.88), 0.12, 0.26, mat("polo", C["prata"], 0.5), 20))


def quimica():
    # erlenmeyer de vidro com líquido turquesa aceso
    c = pos(-0.35, -0.2)
    v = vidro("vidro", C["gelo"], 0.26)
    cone(c + Vector((0, 0, 0.47)), 0.68, 0.2, 0.94, v, 40)
    cil(c + Vector((0, 0, 1.15)), 0.2, 0.44, v, 32)
    toro(c + Vector((0, 0, 1.37)), 0.2, 0.035, v, seg=32)
    liq = mat("liquido", C["turquesa"], 0.3, emis=1.1)
    cone(c + Vector((0, 0, 0.25)), 0.62, 0.42, 0.44, liq, 40)
    bol = mat("bolha", C["gelo"], 0.3, emis=0.8, hex_emis=C["turquesa"])
    for (dx, dy, z, r) in ((0.05, 0.0, 1.55, 0.06), (-0.06, 0.04, 1.75, 0.045), (0.08, -0.03, 1.92, 0.035)):
        esfera(c + Vector((dx, dy, z)), r, bol)
    # molécula de CO2 (O=C=O) flutuando ao lado
    m = pos(0.95, 0.35, 0.95)
    eixo = (D * 0.8 + Vector((0, 0, 0.35))).normalized()
    lig = mat("ligacao", C["gelo"], 0.55)
    lado = eixo.cross(Vector((0, 0, 1))).normalized() * 0.05
    for s in (-1, 1):
        for d in (-1, 1):
            cilindro_entre(m + lado * d, m + eixo * 0.36 * s + lado * d, 0.026, lig, 8)
    esfera(m, 0.15, mat("cpk_C", C["cpk_c"], 0.6))
    for s in (-1, 1):
        esfera(m + eixo * 0.4 * s, 0.17, mat("cpk_O", C["cpk_o"], 0.6))


def geografia():
    # globo num suporte, eixo inclinado 23,4 graus
    c = pos(-0.5, -0.45)
    base = mat("suporte", C["line_forte"], 0.8)
    cil(c + Vector((0, 0, 0.05)), 0.36, 0.1, base, 24, bev=0.03)
    cilindro_entre(c + Vector((0, 0, 0.1)), c + Vector((0, 0, 0.5)), 0.05, base, 12)
    centro = c + Vector((0, 0, 1.08))
    incl = Matrix.Rotation(math.radians(23.4), 3, "X") @ Matrix.Rotation(-R45, 3, "Z")
    oceano = mat("oceano", C["agua"], 0.55, emis=0.15)
    esfera(centro, 0.55, oceano, sub=4)
    terra = mat("terra", C["verde"], 0.8)
    for (th, ph, r) in ((0.9, 0.3, 0.26), (1.2, 1.6, 0.22), (2.1, 0.9, 0.2), (0.6, 2.6, 0.18), (1.9, 2.9, 0.24),
                        (2.4, 4.2, 0.2), (1.1, 4.6, 0.22), (1.6, 5.6, 0.17)):
        n = incl @ Vector((math.sin(th) * math.cos(ph), math.sin(th) * math.sin(ph), math.cos(th)))
        ob = esfera(centro + n * 0.52, r, terra, sub=3)
        ob.rotation_euler = n.to_track_quat("Z", "Y").to_euler()
        ob.scale = (1, 1, 0.22)
    anel = toro(centro, 0.66, 0.025, mat("meridiano", C["ouro"], 0.5), rot=(0, 0, 0))
    anel.rotation_euler = (incl @ Matrix.Rotation(R90, 3, "Y")).to_euler()
    # montanha low poly com neve
    mt = pos(0.75, -0.35)
    cone(mt + Vector((0, 0, 0.55)), 0.72, 0.0, 1.1, mat("rocha_mt", "#6E7FA8", 0.9), 7, liso=False)
    cone(mt + Vector((0, 0, 0.97)), 0.26, 0.0, 0.28, mat("neve", C["txt"], 0.8), 7, liso=False)
    cone(pos(1.25, 0.15, 0.32), 0.42, 0.0, 0.64, mat("rocha_mt2", "#58688F", 0.9), 6, liso=False)
    # rio saindo da montanha até a borda
    pts = []
    for j in range(40):
        t = j / 39
        a, b = 0.55 - 0.25 * t, 0.15 + 1.6 * t
        pts.append(pos(a + 0.22 * math.sin(t * 6.0), b, 0.0))
    rio = tubo(pts, 0.1, mat("rio", C["agua"], 0.3, emis=0.4))
    rio.scale = (1, 1, 0.22)
    rio.location.z = 0.012


def portugues():
    g = grupo("livro", pos(-0.15, 0.25))
    capa = mat("capa", C["azul"], 0.7)
    pag = mat("pagina", C["txt"], 0.85)
    for s in (-1, 1):
        ang = math.radians(9) * s
        cx = 0.42 * s
        ob = em(g, caixa((0, 0, 0), (0.84, 1.15, 0.05), capa, bev=0.02))
        ob.location = (cx, 0, 0.06 + 0.06)
        ob.rotation_euler = (0, -ang, 0)
        ob = em(g, caixa((0, 0, 0), (0.78, 1.07, 0.12), pag, bev=0.03))
        ob.location = (cx * 0.98, 0, 0.17 + 0.07)
        ob.rotation_euler = (0, -ang, 0)
        for k in range(4):  # linhas de texto (sem letras, só ritmo)
            ln = em(g, caixa((0, 0, 0), (0.5, 0.035, 0.01), mat("linha", C["line_forte"], 0.9)))
            ln.location = (cx * 0.98, -0.3 + k * 0.17, 0.3 + 0.075 * (0.42 - abs(cx)) + 0.01)
            ln.rotation_euler = (0, -ang, 0)
    t = em(g, texto("Aa", 0.95, mat("aa", C["amber"], 0.55, emis=0.35), ext=0.09))
    t.location = (0, 0.25, 1.15)
    # lápis deitado à frente
    p0, p1 = pos(0.55, 1.15, 0.08), pos(1.45, 0.55, 0.08)
    cilindro_entre(p0, p1, 0.075, mat("lapis", C["ouro"], 0.6), 6)
    d = (p1 - p0).normalized()
    ob = cone(p1 + d * 0.11, 0.075, 0.0, 0.22, mat("madeira", C["creme"], 0.8), 6)
    ob.rotation_euler = d.to_track_quat("Z", "Y").to_euler()
    ob = cone(p0 - d * 0.05, 0.075, 0.075, 0.1, mat("borracha", C["membrana"], 0.8), 12)
    ob.rotation_euler = d.to_track_quat("Z", "Y").to_euler()


def livro_pilha(c, dims, cor, rz):
    g = grupo("livro", c, rz)
    w, d, h = dims
    capa = mat("capa_" + cor, cor, 0.7)
    em(g, caixa((0.02, 0, 0), (w - 0.06, d - 0.05, h * 0.74), mat("paginas", C["txt"], 0.85)))
    for s in (-1, 1):
        em(g, caixa((0, 0, s * h * 0.43), (w, d, h * 0.14), capa, bev=0.015))
    em(g, caixa((-w / 2 + 0.02, 0, 0), (0.04, d, h), capa, bev=0.015))


def literatura():
    # pilha de 3 livros
    b = pos(-0.6, -0.3)
    for k, (dims, cor, rz) in enumerate((((1.05, 0.72, 0.2), C["nucleo"], 0.15),
                                         ((0.95, 0.66, 0.18), C["turquesa"], -0.12),
                                         ((0.88, 0.6, 0.2), C["membrana"], 0.3))):
        z = 0.1 + k * 0.2
        livro_pilha(b + Vector((0, 0, z)), dims, cor, rz + R45)
    # tinteiro
    t = pos(0.6, 0.45)
    vid = mat("tinteiro", C["citoplasma"], 0.35)
    cil(t + Vector((0, 0, 0.2)), 0.36, 0.4, vid, 8, bev=0.05, liso=False)
    cil(t + Vector((0, 0, 0.47)), 0.17, 0.16, vid, 16, bev=0.02)
    cil(t + Vector((0, 0, 0.555)), 0.13, 0.01, mat("tinta", C["nucleolo"], 0.3, emis=0.3), 16)
    # pena: haste + vane achatada, inclinada saindo do tinteiro
    base = t + Vector((0, 0, 0.45))
    dirc = (Vector((0, 0, 1)) - F * 0.25 - D * 0.35).normalized()
    topo = base + dirc * 1.5
    cilindro_entre(base, topo, 0.018, mat("haste", C["creme"], 0.6), 8)
    ob = elipsoide(base + dirc * 0.95, (0.2, 0.03, 0.62), mat("pena", C["cpk_h"], 0.75))
    ob.rotation_euler = de_frente(dirc).to_euler()


def big_ben(c):
    pedra = mat("torre", C["prata"], 0.85)
    caixa(c + Vector((0, 0, 0.6)), (0.5, 0.5, 1.2), pedra, bev=0.02)
    caixa(c + Vector((0, 0, 1.4)), (0.6, 0.6, 0.42), pedra, bev=0.03)
    face = mat("mostrador", C["creme"], 0.6, emis=0.45)
    pont = mat("ponteiro", C["bg"], 0.7)
    for n in (Vector((1, 0, 0)), Vector((0, -1, 0))):
        centro = c + Vector((0, 0, 1.4)) + n * 0.31
        ob = cil(centro, 0.17, 0.02, face, 24)
        ob.rotation_euler = n.to_track_quat("Z", "Y").to_euler()
        cilindro_entre(centro + n * 0.015, centro + n * 0.015 + Vector((0, 0, 0.12)), 0.014, pont, 6)
        lado = n.cross(Vector((0, 0, 1)))
        cilindro_entre(centro + n * 0.015, centro + n * 0.015 + lado * 0.09, 0.014, pont, 6)
    ob = cone(c + Vector((0, 0, 1.92)), 0.44, 0.0, 0.62, mat("telhado", C["line_forte"], 0.8), 4, liso=False)
    ob.rotation_euler = (0, 0, R45)
    cilindro_entre(c + Vector((0, 0, 2.2)), c + Vector((0, 0, 2.42)), 0.02, mat("ponta", C["ouro"], 0.5), 6)


def ingles():
    big_ben(pos(0.65, -0.55))
    g = grupo("balao", pos(-0.65, 0.35, 1.05))
    balao(g, 1.3, C["azul"], "Hi", C["cpk_h"], 0.62)


def leque(g, raio=0.85):
    """Leque aberto (150 graus) em gomos alternados, de pé no plano XZ local."""
    n = 14
    a0, a1 = math.radians(15), math.radians(165)
    for k in range(n):
        ta, tb = a0 + (a1 - a0) * k / n, a0 + (a1 - a0) * (k + 1) / n
        prof = 0.03 if k % 2 else -0.03
        verts = [(0, 0, 0), (raio * math.cos(ta), prof, raio * math.sin(ta)),
                 (raio * math.cos(tb), -prof, raio * math.sin(tb)),
                 (0.18 * math.cos(tb), 0, 0.18 * math.sin(tb)), (0.18 * math.cos(ta), 0, 0.18 * math.sin(ta))]
        me = bpy.data.meshes.new("gomo")
        me.from_pydata(verts, [], [(0, 1, 2)])
        me.update()
        ob = bpy.data.objects.new("gomo", me)
        bpy.context.scene.collection.objects.link(ob)
        cor = C["membrana"] if k % 2 == 0 else "#F7A3CE"
        md = ob.modifiers.new("esp", "SOLIDIFY")
        md.thickness = 0.02
        aplicar(ob, mat("gomo" + cor, cor, 0.75), liso=False)
        em(g, ob)
    ouro = mat("vareta", C["ouro"], 0.55)
    for a in (a0, a1):
        em(g, cilindro_entre((0, 0, 0), (raio * 1.02 * math.cos(a), 0, raio * 1.02 * math.sin(a)), 0.025, ouro, 8))
    ob = em(g, cil((0, 0, 0), 0.06, 0.12, ouro, 16))
    ob.rotation_euler = (R90, 0, 0)


def espanhol():
    g = grupo("balao", pos(-0.55, -0.35, 1.2))
    balao(g, 1.9, C["turquesa"], "¡Hola!", C["bg"], 0.5)
    f = grupo("leque", pos(0.55, 0.55, 0.12))
    f.rotation_euler = (math.radians(-12), 0, R45)
    leque(f, 0.95)


def biologia():
    # célula eucariótica (achatada) com núcleo violeta saliente e mitocôndrias
    c = pos(-0.45, -0.2)
    elipsoide(c + Vector((0, 0, 0.18)), (0.98, 0.9, 0.42), mat("membrana", C["membrana"], 0.7))
    elipsoide(c + Vector((0, 0, 0.24)), (0.9, 0.82, 0.4), mat("citoplasma_cl", "#F59AC6", 0.8))
    nuc = c + Vector((0.08, -0.05, 0.55))
    esfera(nuc, 0.36, mat("nucleo", C["nucleo"], 0.6, emis=0.12), sub=4)
    esfera(nuc + Vector((0.12, -0.12, 0.24)), 0.12, mat("nucleolo", C["nucleolo"], 0.6))
    mito = mat("mito", C["energia"], 0.65)
    for (dx, dy, rz) in ((0.55, 0.25, 0.4), (-0.5, -0.2, 1.3), (-0.2, 0.55, -0.6), (0.35, -0.5, 2.2)):
        p = c + Vector((dx, dy, 0.6 - 0.3 * (dx * dx + dy * dy)))
        elipsoide(p, (0.17, 0.07, 0.07), mito, rot=(0, -0.25, rz))
    # folha de pé, inclinada, com nervura
    fo = pos(0.95, 0.4)
    eixo = (Vector((0, 0, 1)) * 0.8 - F * 0.25 + D * 0.25).normalized()
    cilindro_entre(fo, fo + eixo * 0.35, 0.035, mat("caule", C["grana"], 0.7), 8)
    centro = fo + eixo * 1.0
    ob = elipsoide(centro, (0.36, 0.05, 0.68), mat("folha", C["verde"], 0.7))
    ob.rotation_euler = de_frente(eixo).to_euler()
    cilindro_entre(fo + eixo * 0.33, fo + eixo * 1.62, 0.022, mat("nervura", C["grana"], 0.7), 8)


CENAS = {
    "historia": historia, "fisica": fisica, "quimica": quimica, "geografia": geografia,
    "portugues": portugues, "literatura": literatura, "ingles": ingles, "espanhol": espanhol,
    "biologia": biologia,
}


# ---------------------------------------------------------------------------
# Render e folha de contato
# ---------------------------------------------------------------------------

def salvar_webp(im, arq):
    for q in (86, 80, 74, 68, 60, 50, 40):
        im.save(arq, "WEBP", quality=q, method=6, alpha_quality=85)
        if os.path.getsize(arq) <= WEBP_MAX:
            return q
    return None


def gerar(mid, amostras, saida):
    P.cena_base(amostras)
    P._MATS.clear()
    P.plataforma()
    CENAS[mid]()
    P.luzes_e_camera()
    png = os.path.join(saida, "materia-%s.png" % mid)
    im = P.renderizar(png)
    q = salvar_webp(im, png[:-4] + ".webp")
    print("ok %-10s png %6d B  webp %6d B (q %s)" % (mid, os.path.getsize(png), os.path.getsize(png[:-4] + ".webp"), q),
          flush=True)


def folha(saida, arq):
    from PIL import Image, ImageDraw, ImageFont
    import numpy as np
    cel, marg = 380, 24
    W = H = 3 * cel + 4 * marg
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    d = np.sqrt(((xx - W / 2) / (W * 0.7)) ** 2 + ((yy - H / 2) / (H * 0.7)) ** 2)
    t = np.clip(d, 0, 1) ** 1.3
    c0, c1 = np.array(P.srgb("#161D33"), np.float32), np.array(P.srgb(C["bg"]), np.float32)
    fundo = c0 * (1 - t[..., None]) + c1 * t[..., None]
    tela = Image.fromarray(np.clip(fundo + 0.5, 0, 255).astype(np.uint8), "RGB").convert("RGBA")
    dr = ImageDraw.Draw(tela)
    fonte = None
    for ttf in ("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
                "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"):
        if os.path.exists(ttf):
            fonte = ImageFont.truetype(ttf, 22)
            break
    if fonte is None:
        fonte = ImageFont.load_default()
    for k, mid in enumerate(ORDEM):
        x = marg + (k % 3) * (cel + marg)
        y = marg + (k // 3) * (cel + marg)
        dr.rounded_rectangle((x, y, x + cel, y + cel), 16, fill=P.srgb(C["bg"]) + (255,),
                             outline=P.srgb(C["line"]) + (255,), width=1)
        f = os.path.join(saida, "materia-%s.png" % mid)
        if os.path.exists(f):
            tela.alpha_composite(Image.open(f).convert("RGBA").resize((cel - 40, cel - 40), Image.LANCZOS),
                                 (x + 20, y + 4))
        dr.text((x + 16, y + cel - 34), NOMES[mid], font=fonte, fill=P.srgb(C["txt"]) + (255,))
    os.makedirs(os.path.dirname(arq), exist_ok=True)
    tela.convert("RGB").save(arq, optimize=True)
    print("folha:", arq)


def main():
    a = sys.argv[1:]
    amostras = int(a[a.index("--amostras") + 1]) if "--amostras" in a else 64
    saida = a[a.index("--saida") + 1] if "--saida" in a else SAIDA_DIR
    folha_arq = a[a.index("--folha") + 1] if "--folha" in a else FOLHA
    ids = [x for x in a if x in CENAS] or ORDEM
    os.makedirs(saida, exist_ok=True)
    for mid in ids:
        gerar(mid, amostras, saida)
    if "--sem-folha" not in a:
        folha(saida, folha_arq)


if __name__ == "__main__":
    main()
