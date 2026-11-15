# -*- coding: utf-8 -*-
"""
Peças comuns dos geradores de modelos 3D do LAB (núcleo, cloroplasto e os próximos).
Tudo procedural, feito pela equipe: nenhum modelo, textura, HDRI ou código de terceiros.

Convenções (as mesmas da mitocôndria):
- 1 unidade do Blender = 1 µm;
- corte no plano y = 0 do Blender, fica a metade y >= 0. No glTF (Y para cima) o corte
  vira z = 0 e a face aberta olha para +Z;
- face do corte escurecida por cor de vértice (fator 0,62, como o `corte()` do materials.js);
- cores da paleta científica do guia (seção 2.3), convertidas de sRGB para linear;
- cada peça tem nome sem acento e `rotulo` com acento (vai para userData no three.js).

Este arquivo é importado por nucleo.py e cloroplasto.py; sozinho ele não gera nada.
"""

import math
import os
import random
import tempfile

import bpy  # precisa vir antes de bmesh e mathutils quando o Blender é usado como módulo
import bmesh
from mathutils import Matrix, Vector, noise

TOM_CORTE = 0.62
Y_ATRAS = 0.0015   # espaços (lúmen, intermembranas) ficam 1,5 nm atrás do plano do corte

# Paleta científica do guia (seção 2.3), em sRGB
SCI = {
    "genetica": "#9A6BFF",       # núcleo, cromatina, DNA
    "genetica_densa": "#6A45D8",  # nucléolo e partes densas
    "membrana": "#F06AAE",       # membrana plasmática, envelope nuclear
    "energia": "#F25C3B",        # mitocôndria
    "fotossintese": "#3FBF6A",   # cloroplasto, tilacoides
    "grana": "#2A9450",          # grana
    "sintese": "#4B7BFF",        # retículo endoplasmático
    "empacotamento": "#F7C13B",  # Golgi
    "ribossomo": "#FFE1A6",      # ribossomos e grânulos
    "citoplasma": "#2A1E3D",     # ameixa escuro
    "lamina": "#131A2B",         # --panel
    "branco": "#FFFFFF",
}


# ---------------------------------------------------------------------------
# Cor
# ---------------------------------------------------------------------------

def hex_para_srgb(h):
    h = h.lstrip("#")
    return [int(h[i:i + 2], 16) / 255.0 for i in (0, 2, 4)]


def srgb_para_linear(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def cor_linear(h):
    return tuple(srgb_para_linear(c) for c in hex_para_srgb(h))


def misturar_hex(a, b, t):
    """Mistura dois hex em sRGB (t = 0 dá a, t = 1 dá b): tons da mesma família."""
    ca, cb = hex_para_srgb(a), hex_para_srgb(b)
    return "#" + "".join("%02X" % round((x + (y - x) * t) * 255) for x, y in zip(ca, cb))


# ---------------------------------------------------------------------------
# Cena
# ---------------------------------------------------------------------------

class Cena:
    """Coleção, nó-pai e lista das peças exportadas."""

    def __init__(self, nome_raiz, rotulo):
        bpy.ops.wm.read_factory_settings(use_empty=True)
        self.col = bpy.data.collections.new(nome_raiz)
        bpy.context.scene.collection.children.link(self.col)
        self.aux = bpy.data.collections.new("auxiliares")   # cortadores e rascunhos (não exporta)
        bpy.context.scene.collection.children.link(self.aux)
        self.raiz = bpy.data.objects.new(nome_raiz, None)
        self.raiz.empty_display_size = 0.5
        self.col.objects.link(self.raiz)
        self.raiz["rotulo"] = rotulo
        self.pecas = {}
        self.grupos = []
        self._meio = None

    def grupo(self, nome, rotulo):
        """Nó intermediário (vira Group no three.js), para juntar peças de uma estrutura."""
        g = bpy.data.objects.new(nome, None)
        g.empty_display_size = 0.3
        self.col.objects.link(g)
        g.parent = self.raiz
        g["rotulo"] = rotulo
        self.grupos.append(g)
        return g

    def meio_espaco(self):
        """Caixa enorme com y >= 0: o que fica depois do corte."""
        if self._meio is None:
            m = Montador()
            caixa(m, (0, 25, 0), (0, 1, 0), (1, 0, 0), (25, 50, 50))
            self._meio = m.objeto("meio_espaco", self.aux, solido=True)
        return self._meio


# ---------------------------------------------------------------------------
# Montador de malhas
# ---------------------------------------------------------------------------

def normal_face(verts, f):
    n = Vector((0.0, 0.0, 0.0))
    for i in range(len(f)):
        a = Vector(verts[f[i]])
        b = Vector(verts[f[(i + 1) % len(f)]])
        n.x += (a.y - b.y) * (a.z + b.z)
        n.y += (a.z - b.z) * (a.x + b.x)
        n.z += (a.x - b.x) * (a.y + b.y)
    return n


def orientar(verts, faces, ref, esperado):
    """Confere a face `ref` contra a direção esperada e inverte o grupo se precisar."""
    if normal_face(verts, faces[ref]).dot(Vector(esperado)) < 0:
        return [tuple(reversed(f)) for f in faces]
    return faces


class Montador:
    def __init__(self):
        self.v, self.f = [], []

    def vertices(self, pts):
        base = len(self.v)
        self.v.extend(tuple(p) for p in pts)
        return base

    def faces(self, faces):
        self.f.extend(faces)

    def objeto(self, nome, col, solido=False):
        """Cria o objeto. solido=True recalcula as normais para fora (peças fechadas)."""
        me = bpy.data.meshes.new(nome)
        me.from_pydata(self.v, [], self.f)
        me.validate(clean_customdata=False)
        if solido:
            bm = bmesh.new()
            bm.from_mesh(me)
            bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
            bm.to_mesh(me)
            bm.free()
        ob = bpy.data.objects.new(nome, me)
        col.objects.link(ob)
        return ob


def base_ortonormal(n):
    n = Vector(n).normalized()
    aux = Vector((0, 0, 1)) if abs(n.z) < 0.9 else Vector((1, 0, 0))
    u = n.cross(aux).normalized()
    return n, u, n.cross(u)


def icosfera(sub):
    bm = bmesh.new()
    bmesh.ops.create_icosphere(bm, subdivisions=sub, radius=1.0)
    v = [tuple(x.co) for x in bm.verts]
    f = [tuple(x.index for x in face.verts) for face in bm.faces]
    bm.free()
    return v, f


ICO80 = icosfera(2)   # 42 vértices, 80 triângulos (no Blender 5, subdivisions=1 é o icosaedro)
ICO20 = icosfera(1)   # 12 vértices, 20 triângulos


def esfera(mont, centro, raio, eixo=None, achatar=1.0, modelo=ICO80, escala=None):
    """Icosfera; `achatar` ao longo de `eixo`, ou `escala` (sx, sy, sz) nos eixos do mundo."""
    c = Vector(centro)
    pts = []
    for v in modelo[0]:
        p = Vector(v) * raio
        if eixo is not None and achatar != 1.0:
            e = Vector(eixo).normalized()
            p = p + e * (p.dot(e) * (achatar - 1.0))
        if escala is not None:
            p = Vector((p.x * escala[0], p.y * escala[1], p.z * escala[2]))
        pts.append(c + p)
    base = mont.vertices(pts)
    mont.faces([tuple(base + i for i in f) for f in modelo[1]])


def caixa(mont, centro, n, u, meias):
    """Bloco orientado: n e u são eixos; meias = meias medidas em (n, u, n × u)."""
    n, u = Vector(n).normalized(), Vector(u).normalized()
    w = n.cross(u)
    c = Vector(centro)
    pts = [c + n * a * meias[0] + u * b * meias[1] + w * d * meias[2]
           for a in (-1, 1) for b in (-1, 1) for d in (-1, 1)]
    base = mont.vertices(pts)
    for q in ((0, 1, 3, 2), (4, 6, 7, 5), (0, 4, 5, 1), (2, 3, 7, 6), (0, 2, 6, 4), (1, 5, 7, 3)):
        f = tuple(base + i for i in q)
        cf = sum((Vector(mont.v[k]) for k in f), Vector()) / 4
        mont.faces(orientar(mont.v, [f], 0, tuple(cf - c)))


def tubo(mont, caminho, raio, lados=4, fechado=False, tampas=True):
    """Tubo ao longo de um caminho (aberto, com tampas, ou fechado em anel)."""
    m = len(caminho)
    cs = [Vector(p) for p in caminho]
    pts = []
    ref = None
    for i in range(m):
        if fechado:
            tg = (cs[(i + 1) % m] - cs[i - 1]).normalized()
        else:
            tg = (cs[min(i + 1, m - 1)] - cs[max(i - 1, 0)]).normalized()
        if ref is None:
            _, ref, _ = base_ortonormal(tg)
        u = (ref - tg * ref.dot(tg)).normalized()   # quadro que gira pouco (sem torção brusca)
        ref = u
        w = tg.cross(u)
        for k in range(lados):
            a = 2 * math.pi * k / lados
            pts.append(cs[i] + (u * math.cos(a) + w * math.sin(a)) * raio)
    base = mont.vertices(pts)
    faces = []
    for i in range(m if fechado else m - 1):
        i2 = (i + 1) % m
        for k in range(lados):
            k2 = (k + 1) % lados
            faces.append((base + i * lados + k, base + i2 * lados + k, base + i2 * lados + k2, base + i * lados + k2))
    cf = sum((Vector(mont.v[k]) for k in faces[0]), Vector()) / 4
    mont.faces(orientar(mont.v, faces, 0, tuple(cf - cs[0])))
    if tampas and not fechado:
        for i, sentido in ((0, -1), (m - 1, 1)):
            f = tuple(base + i * lados + k for k in range(lados))
            tg = (cs[min(i + 1, m - 1)] - cs[max(i - 1, 0)]).normalized() * sentido
            mont.faces(orientar(mont.v, [f], 0, tuple(tg)))


def toro(mont, centro, n, R, r, seg=10, lados=4):
    """Anel (toro) em volta do eixo n."""
    n, u, w = base_ortonormal(n)
    c = Vector(centro)
    pts = []
    for i in range(seg):
        a = 2 * math.pi * i / seg
        d = u * math.cos(a) + w * math.sin(a)
        for k in range(lados):
            b = 2 * math.pi * k / lados
            pts.append(c + d * (R + r * math.cos(b)) + n * (r * math.sin(b)))
    base = mont.vertices(pts)
    faces = []
    for i in range(seg):
        i2 = (i + 1) % seg
        for k in range(lados):
            k2 = (k + 1) % lados
            faces.append((base + i * lados + k, base + i2 * lados + k, base + i2 * lados + k2, base + i * lados + k2))
    d0 = u
    cf = sum((Vector(mont.v[k]) for k in faces[0]), Vector()) / 4
    mont.faces(orientar(mont.v, faces, 0, tuple(cf - (c + d0 * R))))


def revolucao(mont, perfil, phi0, phi1, n_phi, tampas=True):
    """Gira um polígono fechado do plano (rho, z) em volta do eixo z, de phi0 a phi1.
    x = rho cos(phi), y = rho sin(phi). Com tampas, o sólido fica fechado (manifold)."""
    npf = len(perfil)
    pts = []
    for j in range(n_phi + 1):
        ph = phi0 + (phi1 - phi0) * j / n_phi
        c, s = math.cos(ph), math.sin(ph)
        pts += [(r * c, r * s, z) for r, z in perfil]
    base = mont.vertices(pts)
    faces = []
    for j in range(n_phi):
        for p in range(npf):
            p2 = (p + 1) % npf
            faces.append((base + j * npf + p, base + (j + 1) * npf + p, base + (j + 1) * npf + p2, base + j * npf + p2))
    # orientação pela área com sinal do perfil (anti-horário em (rho, z) => normais para fora)
    area = sum(perfil[i][0] * perfil[(i + 1) % npf][1] - perfil[(i + 1) % npf][0] * perfil[i][1] for i in range(npf))
    if area < 0:
        faces = [tuple(reversed(f)) for f in faces]
    # confere com o sentido do giro: se phi1 < phi0, inverte
    if phi1 < phi0:
        faces = [tuple(reversed(f)) for f in faces]
    mont.faces(faces)
    if tampas:
        for j, ph, sentido in ((0, phi0, -1), (n_phi, phi1, 1)):
            f = tuple(base + j * npf + p for p in range(npf))
            t = Vector((-math.sin(ph), math.cos(ph), 0.0)) * sentido * (1 if phi1 > phi0 else -1)
            mont.faces(orientar(mont.v, [f], 0, tuple(t)))


def esfera_uv(mont, centro, raios, seg=48, aneis=24):
    """Esfera/elipsoide UV fechado (polos no eixo z)."""
    c = Vector(centro)
    a, b, cc = raios
    pts = [c + Vector((0, 0, cc))]
    for k in range(1, aneis):
        th = math.pi * k / aneis
        for i in range(seg):
            ph = 2 * math.pi * i / seg
            pts.append(c + Vector((a * math.sin(th) * math.cos(ph), b * math.sin(th) * math.sin(ph), cc * math.cos(th))))
    pts.append(c + Vector((0, 0, -cc)))
    base = mont.vertices(pts)
    norte, sul = base, base + 1 + (aneis - 1) * seg
    faces = []
    for i in range(seg):
        i2 = (i + 1) % seg
        faces.append((norte, base + 1 + i, base + 1 + i2))
        for k in range(aneis - 2):
            r0, r1 = base + 1 + k * seg, base + 1 + (k + 1) * seg
            faces.append((r0 + i, r1 + i, r1 + i2, r0 + i2))
        ru = base + 1 + (aneis - 2) * seg
        faces.append((ru + i, sul, ru + i2))
    # cada face para fora do centro
    certas = []
    for f in faces:
        cf = sum((Vector(mont.v[k]) for k in f), Vector()) / len(f)
        certas += orientar(mont.v, [f], 0, tuple(cf - c))
    mont.faces(certas)


# ---------------------------------------------------------------------------
# Booleanas e acabamento
# ---------------------------------------------------------------------------

def aplicar_modificadores(ob):
    dg = bpy.context.evaluated_depsgraph_get()
    novo = bpy.data.meshes.new_from_object(ob.evaluated_get(dg))
    velho = ob.data
    ob.modifiers.clear()
    ob.data = novo
    bpy.data.meshes.remove(velho)


def booleana(alvo, outro, operacao, auto_intersecao=False):
    """Booleana exata aplicada na hora. auto_intersecao=True une peças sobrepostas do próprio alvo."""
    mod = alvo.modifiers.new("booleana", "BOOLEAN")
    mod.operation = operacao
    mod.object = outro
    mod.solver = "EXACT"
    mod.use_self = auto_intersecao
    mod.use_hole_tolerant = True   # aguenta pequenas falhas de malha sem estragar o resultado
    aplicar_modificadores(alvo)
    return alvo


def copiar(ob, nome, col):
    novo = ob.copy()
    novo.data = ob.data.copy()
    novo.name = nome
    novo.data.name = nome
    col.objects.link(novo)
    return novo


def remover(ob):
    me = ob.data
    bpy.data.objects.remove(ob)
    if me is not None and me.users == 0 and isinstance(me, bpy.types.Mesh):
        bpy.data.meshes.remove(me)


def reparar_ngons_planos(me):
    """As booleanas devolvem a fatia como um n-gono com "ponte" ligando a borda de fora
    à de dentro (anel). A triangulação padrão às vezes tapa o buraco. Aqui a fatia é refeita
    com o preenchimento por varredura (scanfill), que respeita os buracos."""
    from collections import Counter
    bm = bmesh.new()
    bm.from_mesh(me)
    bm.normal_update()
    alvo = [f for f in bm.faces if len(f.verts) > 4 and abs(f.normal.y) > 0.99
            and max(v.co.y for v in f.verts) - min(v.co.y for v in f.verts) < 1e-5]
    for f in alvo:
        ny = 1.0 if f.normal.y > 0 else -1.0
        cont = Counter(l.edge for l in f.loops)
        borda = [e for e, c in cont.items() if c == 1]
        pontes = [e for e, c in cont.items() if c > 1]
        bmesh.ops.delete(bm, geom=[f], context="FACES_ONLY")
        pontes = [e for e in pontes if e.is_valid and not e.link_faces]
        if pontes:
            bmesh.ops.delete(bm, geom=pontes, context="EDGES")
        borda = [e for e in borda if e.is_valid]
        res = bmesh.ops.triangle_fill(bm, use_beauty=True, use_dissolve=False, edges=borda, normal=(0.0, ny, 0.0))
        for g in res["geom"]:
            if isinstance(g, bmesh.types.BMFace):
                g.normal_update()
                if g.normal.y * ny < 0:
                    g.normal_flip()
    bm.to_mesh(me)
    bm.free()


def eh_corte(ob, f, tol=1e-4):
    """Face no plano do corte (y = 0), virada para quem olha o corte (-y)."""
    return f.normal.y < -0.99 and all(abs(ob.data.vertices[i].co.y) < tol for i in f.vertices)


def so_faces_do_corte(ob, y_atras=Y_ATRAS):
    """Fica só com a fatia (faces em y = 0) e a empurra um fio para trás.
    Usado para os espaços (lúmen, intermembranas): eles só aparecem na fatia."""
    reparar_ngons_planos(ob.data)
    bm = bmesh.new()
    bm.from_mesh(ob.data)
    bm.normal_update()
    tirar = [f for f in bm.faces if not (f.normal.y < -0.99 and all(abs(v.co.y) < 1e-4 for v in f.verts))]
    bmesh.ops.delete(bm, geom=tirar, context="FACES")
    for v in bm.verts:
        v.co.y = y_atras
    bm.to_mesh(ob.data)
    bm.free()


def decimar(ob, alvo_tris):
    """Decimate (collapse) até perto de alvo_tris, aplicado na hora."""
    n = contar_triangulos(ob)
    if n <= alvo_tris:
        return
    mod = ob.modifiers.new("Decimate", "DECIMATE")
    mod.ratio = alvo_tris / n
    aplicar_modificadores(ob)


def finalizar(cena, ob, nome, material, rotulo, deformar=None, usa_tom=True, pai=None,
              angulo_vivo=40.0, cor_vertice=None):
    """Deforma, marca a fatia com cor de vértice, suaviza com arestas vivas por ângulo,
    põe material e pai. `cor_vertice(co)` dá uma cor (r, g, b) linear por vértice (opcional)."""
    ob.name = nome
    ob.data.name = nome
    me = ob.data
    reparar_ngons_planos(me)
    # triangula aqui (e não no exportador), para o .glb sair idêntico a cada execução
    bm = bmesh.new()
    bm.from_mesh(me)
    bmesh.ops.triangulate(bm, faces=[f for f in bm.faces if len(f.verts) > 3],
                          quad_method="FIXED", ngon_method="EAR_CLIP")
    bm.to_mesh(me)
    bm.free()
    me.update()
    corte = [eh_corte(ob, f) for f in me.polygons] if (usa_tom or cor_vertice) else None
    base_cor = None
    if cor_vertice is not None:
        base_cor = [cor_vertice(v.co.copy()) for v in me.vertices]
    if deformar is not None:
        for v in me.vertices:
            v.co = deformar(v.co.copy())
    me.update()
    if usa_tom or cor_vertice is not None:
        at = me.color_attributes.new("Color", "FLOAT_COLOR", "CORNER")
        dados = []
        for f in me.polygons:
            t = TOM_CORTE if corte[f.index] else 1.0
            for li in f.loop_indices:
                vi = me.loops[li].vertex_index
                c = base_cor[vi] if base_cor is not None else (1.0, 1.0, 1.0)
                dados.extend((c[0] * t, c[1] * t, c[2] * t, 1.0))
        at.data.foreach_set("color", dados)
    # suave, com arestas vivas acima do ângulo (o exportador separa as normais ali)
    bm = bmesh.new()
    bm.from_mesh(me)
    bm.normal_update()
    lim = math.radians(angulo_vivo)
    for f in bm.faces:
        f.smooth = True
    for e in bm.edges:
        lf = e.link_faces
        if len(lf) != 2 or e.calc_face_angle(0.0) > lim:
            e.smooth = False
        elif corte is not None and corte[lf[0].index] != corte[lf[1].index]:
            e.smooth = False   # a borda da fatia é sempre viva
    bm.to_mesh(me)
    bm.free()
    me.materials.clear()
    me.materials.append(material)
    if ob.name not in cena.col.objects:
        for c in list(ob.users_collection):
            c.objects.unlink(ob)
        cena.col.objects.link(ob)
    ob.parent = pai or cena.raiz
    ob["rotulo"] = rotulo
    cena.pecas[nome] = ob
    return ob


def material(nome, hex_cor, rugosidade, alfa=1.0, usa_tom=True, cor_no_vertice=False):
    """PBR simples, metalness 0. usa_tom: cor base × cor de vértice (vira baseColorFactor
    + COLOR_0 no glTF). cor_no_vertice: a cor mora toda no vértice (base branca)."""
    m = bpy.data.materials.new(nome)
    if hasattr(m, "use_nodes") and not m.use_nodes:
        m.use_nodes = True
    nt = m.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    base = (1.0, 1.0, 1.0, 1.0) if cor_no_vertice else (*cor_linear(hex_cor), 1.0)
    bsdf.inputs["Base Color"].default_value = base
    bsdf.inputs["Metallic"].default_value = 0.0
    bsdf.inputs["Roughness"].default_value = rugosidade
    if alfa < 1.0:
        bsdf.inputs["Alpha"].default_value = alfa
        m.surface_render_method = "BLENDED"
    if usa_tom or cor_no_vertice:
        attr = nt.nodes.new("ShaderNodeVertexColor")
        attr.layer_name = "Color"
        mix = nt.nodes.new("ShaderNodeMix")
        mix.data_type = "RGBA"
        mix.blend_type = "MULTIPLY"
        mix.inputs[0].default_value = 1.0
        mix.inputs[6].default_value = base
        nt.links.new(attr.outputs["Color"], mix.inputs[7])
        nt.links.new(mix.outputs[2], bsdf.inputs["Base Color"])
    m.use_backface_culling = True
    m.diffuse_color = (*cor_linear(hex_cor), 1.0)
    return m


def contar_triangulos(ob):
    me = ob.evaluated_get(bpy.context.evaluated_depsgraph_get()).to_mesh()
    me.calc_loop_triangles()
    n = len(me.loop_triangles)
    ob.to_mesh_clear()
    return n


# ---------------------------------------------------------------------------
# Exportação, .blend e prévia
# ---------------------------------------------------------------------------

def limpar_auxiliares(cena):
    """Apaga cortadores e rascunhos: nada disso vai para o .glb, o .blend ou a prévia."""
    for ob in list(cena.aux.objects):
        remover(ob)
    bpy.data.collections.remove(cena.aux)
    for me in list(bpy.data.meshes):
        if me.users == 0:
            bpy.data.meshes.remove(me)
    for mb in list(bpy.data.metaballs):
        if mb.users == 0:
            bpy.data.metaballs.remove(mb)


def exportar(cena, arq_glb):
    limpar_auxiliares(cena)
    for o in bpy.context.scene.objects:
        o.select_set(False)
    cena.raiz.select_set(True)
    for g in cena.grupos:
        g.select_set(True)
    for o in cena.pecas.values():
        o.select_set(True)
    bpy.context.view_layer.objects.active = cena.raiz
    bpy.ops.export_scene.gltf(
        filepath=arq_glb, export_format="GLB", use_selection=True,
        export_apply=True, export_draco_mesh_compression_enable=False,
        export_texcoords=False, export_normals=True, export_vertex_color="MATERIAL",
        export_extras=True, export_cameras=False, export_lights=False, export_yup=True,
    )


def relatorio(cena, arq_glb, orcamento_tris=62000, orcamento_bytes=1.5 * 1024 * 1024):
    total = 0
    print("\n== %s ==" % os.path.basename(arq_glb))
    for nome, o in cena.pecas.items():
        n = contar_triangulos(o)
        total += n
        print("  %-26s %6d triângulos" % (nome, n))
    tam = os.path.getsize(arq_glb)
    print("  total: %d triângulos | %.1f KB" % (total, tam / 1024))
    if total > orcamento_tris or tam > orcamento_bytes:
        print("  ATENÇÃO: passou do orçamento")
    return total, tam


def luz_area(nome, hex_cor, energia, pos, tamanho, col, alvo=(0, 0, 0)):
    dado = bpy.data.lights.new(nome, "AREA")
    dado.energy = energia
    dado.color = cor_linear(hex_cor)
    dado.size = tamanho
    ob = bpy.data.objects.new(nome, dado)
    col.objects.link(ob)
    ob.location = pos
    ob.rotation_euler = (Vector(alvo) - Vector(pos)).to_track_quat("-Z", "Y").to_euler()
    return ob


def preparar_previa(dist, alvo, amostras, az=28, el=22):
    """Câmera em três quartos (FOV 32°) e as três luzes do guia, escaladas pela distância."""
    cena = bpy.context.scene
    col = bpy.data.collections.new("cena_previa")
    cena.collection.children.link(col)
    cam_d = bpy.data.cameras.new("camera")
    cam_d.sensor_fit = "HORIZONTAL"
    cam_d.angle = math.radians(32)
    cam_d.clip_end = 200
    cam = bpy.data.objects.new("camera", cam_d)
    col.objects.link(cam)
    a, e = math.radians(az), math.radians(el)
    alvo = Vector(alvo)
    pos = alvo + Vector((dist * math.sin(a) * math.cos(e), -dist * math.cos(a) * math.cos(e), dist * math.sin(e)))
    cam.location = pos
    cam.rotation_euler = (alvo - pos).to_track_quat("-Z", "Y").to_euler()
    cena.camera = cam
    k = dist / 4.6           # a mitocôndria foi acertada com a câmera a 4,6
    luz_area("luz_principal", "#FFF4E6", 420 * k * k, alvo + Vector((-3.0, -3.2, 3.6)) * k, 2.5 * k, col, alvo)
    luz_area("luz_preenchimento", "#CFE0FF", 126 * k * k, alvo + Vector((3.8, -1.6, 0.6)) * k, 2.5 * k, col, alvo)
    luz_area("luz_contorno", "#FFFFFF", 380 * k * k, alvo + Vector((0.6, 3.6, 2.4)) * k, 2.0 * k, col, alvo)
    mundo = bpy.data.worlds.new("palco")
    cena.world = mundo
    fundo = mundo.node_tree.nodes["Background"]
    fundo.inputs["Color"].default_value = (*cor_linear("#3A4566"), 1.0)
    fundo.inputs["Strength"].default_value = 0.35
    mundo.color = cor_linear("#0B0F1C")
    r = cena.render
    r.engine = "CYCLES"
    cena.cycles.device = "CPU"
    cena.cycles.samples = amostras
    cena.cycles.use_denoising = True
    cena.cycles.transparent_max_bounces = 16
    cena.cycles.max_bounces = 6
    r.resolution_x, r.resolution_y, r.resolution_percentage = 1200, 800, 100
    r.film_transparent = True
    r.image_settings.file_format = "PNG"
    r.image_settings.color_mode = "RGBA"
    cena.view_settings.view_transform = "AgX"
    cena.view_settings.exposure = 0.0


def salvar_blend(arq):
    bpy.context.preferences.filepaths.save_version = 0
    bpy.ops.wm.save_as_mainfile(filepath=arq, compress=True)


def renderizar_previa(arq_png):
    """Renderiza com fundo transparente e põe o degradê do palco (#161D33 -> #0B0F1C)."""
    tmp = os.path.join(tempfile.mkdtemp(prefix="lab-previa-"), "render.png")
    bpy.context.scene.render.filepath = tmp
    bpy.ops.render.render(write_still=True)
    from PIL import Image
    import numpy as np
    w, h = 1200, 800
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    d = np.sqrt(((xx - w / 2) / (w * 0.62)) ** 2 + ((yy - h / 2) / (h * 0.75)) ** 2)
    t = np.clip(d, 0, 1) ** 1.3
    c0 = np.array(hex_para_srgb("#161D33"), np.float32) * 255
    c1 = np.array(hex_para_srgb("#0B0F1C"), np.float32) * 255
    fundo = c0[None, None, :] * (1 - t[..., None]) + c1[None, None, :] * t[..., None]
    img = Image.fromarray(np.clip(fundo + 0.5, 0, 255).astype(np.uint8), "RGB").convert("RGBA")
    Image.alpha_composite(img, Image.open(tmp).convert("RGBA")).convert("RGB").save(arq_png, optimize=True)
    os.remove(tmp)


def args():
    import sys
    a = sys.argv[1:]
    sem = "--sem-previa" in a
    am = int(a[a.index("--amostras") + 1]) if "--amostras" in a else 64
    return sem, am


def deformacao(semente, raio_ref, amp=0.03, freq=1.0, escala_xyz=(1.0, 1.0, 1.0)):
    """Deformação suave para tirar o ar de "sólido de compasso". O deslocamento em y é
    proporcional a y, então o plano do corte continua plano."""
    r = random.Random(semente)
    noise.seed_set(semente)
    off = [Vector((r.uniform(-50, 50), r.uniform(-50, 50), r.uniform(-50, 50))) for _ in range(3)]
    sx, sy, sz = escala_xyz

    def f(p):
        v = Vector(p)
        q = v * (freq / raio_ref)
        dx = amp * raio_ref * noise.noise(q + off[0])
        dz = amp * raio_ref * noise.noise(q + off[1])
        ky = 1.0 + 0.8 * amp * noise.noise(q + off[2])
        return Vector((v.x * sx + dx, v.y * sy * ky, v.z * sz + dz))
    return f


def meia_elipsoide_interna(mont, raios, n_th, n_ph, centro=(0, 0, 0)):
    """Metade y >= 0 de um elipsoide, com normais para dentro (forro de um compartimento)."""
    a, b, c = raios
    o = Vector(centro)
    pts = [o + Vector((0, 0, c))]
    for k in range(1, n_th):
        th = math.pi * k / n_th
        for i in range(n_ph + 1):
            ph = math.pi * i / n_ph
            pts.append(o + Vector((a * math.sin(th) * math.cos(ph), b * math.sin(th) * math.sin(ph), c * math.cos(th))))
    pts.append(o + Vector((0, 0, -c)))
    base = mont.vertices(pts)
    ng = n_ph + 1
    faces = []
    for i in range(n_ph):
        faces.append((base, base + 1 + i, base + 2 + i))
        for k in range(n_th - 2):
            q = base + 1 + k * ng + i
            faces.append((q, q + ng, q + ng + 1, q + 1))
        u = base + 1 + (n_th - 2) * ng + i
        faces.append((u, base + 1 + (n_th - 1) * ng, u + 1))
    certas = []
    for f in faces:
        cf = sum((Vector(mont.v[k]) for k in f), Vector()) / len(f)
        certas += orientar(mont.v, [f], 0, tuple(o - cf))
    mont.faces(certas)


def disco(mont, centro, r, h, seg=14, arco=3):
    """Disco achatado de borda arredondada (eixo z): a forma de um tilacoide do granum."""
    c = Vector(centro)
    pts = [c + Vector((0, 0, h))]
    for k in range(arco + 1):
        a = math.pi / 2 - math.pi * k / arco
        rho, z = (r - h) + h * math.cos(a), h * math.sin(a)
        for i in range(seg):
            ph = 2 * math.pi * i / seg
            pts.append(c + Vector((rho * math.cos(ph), rho * math.sin(ph), z)))
    pts.append(c + Vector((0, 0, -h)))
    base = mont.vertices(pts)
    topo, fundo = base, base + 1 + (arco + 1) * seg
    faces = []
    for i in range(seg):
        i2 = (i + 1) % seg
        faces.append((topo, base + 1 + i, base + 1 + i2))
        for k in range(arco):
            r0, r1 = base + 1 + k * seg, base + 1 + (k + 1) * seg
            faces.append((r0 + i, r1 + i, r1 + i2, r0 + i2))
        ru = base + 1 + arco * seg
        faces.append((ru + i, fundo, ru + i2))
    mont.faces(faces)   # normais acertadas depois (objeto sólido)


def lamina(mont, caminho, meia_esp, meia_larg, eixo_larg=(0, 1, 0)):
    """Placa (lâmina) dobrada ao longo de um caminho no plano xz, com largura no eixo y.
    Sólido fechado: serve para as lamelas estromais e seus lúmens."""
    L = Vector(eixo_larg).normalized()
    cs = [Vector(p) for p in caminho]
    m = len(cs)
    pts = []
    for i in range(m):
        tg = (cs[min(i + 1, m - 1)] - cs[max(i - 1, 0)]).normalized()
        n = L.cross(tg).normalized()
        for a, b in ((1, 1), (1, -1), (-1, -1), (-1, 1)):
            pts.append(cs[i] + n * a * meia_esp + L * b * meia_larg)
    base = mont.vertices(pts)
    faces = []
    for i in range(m - 1):
        for k in range(4):
            k2 = (k + 1) % 4
            faces.append((base + i * 4 + k, base + (i + 1) * 4 + k, base + (i + 1) * 4 + k2, base + i * 4 + k2))
    faces.append(tuple(base + k for k in range(4)))
    faces.append(tuple(base + (m - 1) * 4 + k for k in range(4)))
    mont.faces(faces)   # normais acertadas depois (objeto sólido)
