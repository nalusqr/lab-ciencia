# Gera os ícones do LAB: arquivos SVG soltos, sprite e página de conferência.
import os, html

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'icons')
os.makedirs(OUT, exist_ok=True)

# Paleta científica (guia, seção 2.3)
NUC, NUC2 = '#9A6BFF', '#6A45D8'
MEM = '#F06AAE'
WALL = '#A9C54A'
MITO = '#F25C3B'
CLORO = '#3FBF6A'
GOLGI = '#F7C13B'
RIBO = '#FFE1A6'
LISO = '#2FCFBF'
AGUA = '#2A9FC9'
GELO = '#CFE0FF'
HEMA, HEMA2 = '#D7303B', '#8E1A24'
CAPS = '#B9C2D3'

# (id, título, grupo, conteúdo, cores)
ICONS = []
def add(i, t, g, body, cores=''):
    ICONS.append((i, t, g, body.strip(), cores))

# ---------- tipos de célula (coloridos) ----------
add('cel-vegetal', 'Célula vegetal', 'cel', f'''
<rect x="3" y="3.5" width="18" height="17" rx="2.5" fill="{WALL}" fill-opacity=".1" stroke="{WALL}"/>
<rect x="10" y="7" width="8" height="10" rx="3" fill="{AGUA}" fill-opacity=".45" stroke="{AGUA}" stroke-width="1.25"/>
<circle cx="6.9" cy="8.6" r="2" fill="{NUC}"/>
<rect x="5" y="14.2" width="4" height="2.4" rx="1.2" fill="{CLORO}"/>
''', 'parede #A9C54A, vacúolo #2A9FC9, núcleo #9A6BFF, cloroplasto #3FBF6A')

add('cel-animal', 'Célula animal', 'cel', f'''
<path d="M12.2 3.2c4.9 0 8.6 3.4 8.6 8.1 0 5-3.8 9.3-8.9 9.3-4.9 0-8.7-3.6-8.7-8.4 0-5 4-9 9-9z" fill="{MEM}" fill-opacity=".1" stroke="{MEM}"/>
<circle cx="10.6" cy="11.4" r="3.3" fill="{NUC}"/>
<circle cx="11.3" cy="10.7" r="1.1" fill="{NUC2}"/>
<rect x="14" y="15.3" width="4.6" height="2.3" rx="1.15" transform="rotate(-28 16.3 16.45)" fill="{MITO}"/>
<circle cx="16.4" cy="7.6" r="1.1" fill="{LISO}"/>
''', 'membrana #F06AAE, núcleo #9A6BFF/#6A45D8, mitocôndria #F25C3B, lisossomo #2FCFBF')

add('cel-bacteria', 'Bactéria', 'cel', f'''
<rect x="2.9" y="6.5" width="14.8" height="11" rx="5.5" fill="{WALL}" fill-opacity=".1" stroke="{WALL}"/>
<path d="M6.4 12c.8-1.7 1.7-1.7 2.5 0s1.7 1.7 2.5 0 1.7-1.7 2.5 0" stroke="{NUC}" stroke-width="1.5"/>
<circle cx="7.4" cy="9.3" r=".8" fill="{RIBO}"/>
<circle cx="12.6" cy="15" r=".8" fill="{RIBO}"/>
<path d="M17.7 12c.6-1.6 1.5-1.6 2.1 0s1.4 1.6 2.1 0" stroke="{GELO}" stroke-width="1.25"/>
''', 'parede (peptidoglicano) #A9C54A, nucleoide #9A6BFF, flagelo #CFE0FF')

add('cel-neuronio', 'Neurônio', 'cel', f'''
<path d="M4.4 9.3 2.6 7.2M4.2 14.6 2.6 16.8M7 8.4V5.4m0 0-1.4-1.6M7 5.4l1.4-1.6" stroke="{MEM}" stroke-width="1.5"/>
<circle cx="7" cy="12" r="3.4" fill="{MEM}" fill-opacity=".14" stroke="{MEM}"/>
<circle cx="7" cy="12" r="1.4" fill="{NUC}"/>
<path d="M10.4 12h9.4m0 0 1.6-1.7m-1.6 1.7 1.6 1.7" stroke="{MEM}" stroke-width="1.25"/>
<rect x="11.9" y="10.6" width="3" height="2.8" rx="1.4" fill="{MEM}"/>
<rect x="16" y="10.6" width="3" height="2.8" rx="1.4" fill="{MEM}"/>
''', 'membrana e mielina #F06AAE, núcleo #9A6BFF')

add('cel-esperma', 'Espermatozoide', 'cel', f'''
<g transform="rotate(-35 12 12)">
<ellipse cx="6.4" cy="12" rx="4.4" ry="3.5" fill="{MEM}" fill-opacity=".14" stroke="{MEM}"/>
<ellipse cx="7" cy="12" rx="2.5" ry="1.9" fill="{NUC}"/>
<path d="M3.3 10a4 4 0 0 0 0 4" stroke="{GOLGI}" stroke-width="1.25"/>
<rect x="10.8" y="10.9" width="3.6" height="2.2" rx="1.1" fill="{MITO}"/>
<path d="M14.4 12c1.2 0 1.6-2.6 2.9-2.6s1.6 5.2 2.9 5.2c1 0 1.3-1.3 2-1.9" stroke="{GELO}" stroke-width="1.25"/>
</g>
''', 'membrana #F06AAE, núcleo #9A6BFF, acrossomo #F7C13B, peça intermediária #F25C3B, cauda #CFE0FF')

add('cel-levedura', 'Levedura', 'cel', f'''
<ellipse cx="10" cy="13.6" rx="7" ry="6.4" fill="{WALL}" fill-opacity=".1" stroke="{WALL}"/>
<circle cx="18" cy="6.5" r="3" fill="{WALL}" fill-opacity=".1" stroke="{WALL}"/>
<circle cx="11.6" cy="14.6" r="2.6" fill="{AGUA}" fill-opacity=".45" stroke="{AGUA}" stroke-width="1.25"/>
<circle cx="7.3" cy="11.6" r="1.6" fill="{NUC}"/>
''', 'parede #A9C54A, vacúolo #2A9FC9, núcleo #9A6BFF')

add('cel-sangue', 'Células do sangue', 'cel', f'''
<circle cx="9" cy="9.2" r="6.1" fill="{HEMA}"/>
<circle cx="9" cy="9.2" r="2.5" fill="{HEMA2}"/>
<circle cx="17.1" cy="16.7" r="4.1" fill="{MEM}" fill-opacity=".14" stroke="{MEM}"/>
<path d="M15.4 17.6c-.3-1.2.5-2.2 1.5-2.1.6-.9 2.1-.7 2.3.5.4 1.1-.6 1.9-1.4 1.6-.6.8-2 .9-2.4 0z" fill="{NUC}"/>
<ellipse cx="5.2" cy="18.8" rx="1.9" ry="1.1" fill="{RIBO}"/>
''', 'hemácia #D7303B (cor real), leucócito: membrana #F06AAE e núcleo #9A6BFF, plaqueta #FFE1A6')

add('cel-fago', 'Bacteriófago', 'cel', f'''
<path d="M12 2.8 15.3 4.7v3.8L12 10.4 8.7 8.5V4.7z" fill="{CAPS}" fill-opacity=".14" stroke="{CAPS}"/>
<path d="M10.6 6.9c.5-.9 1-.9 1.4 0s.9.9 1.4 0" stroke="{NUC}" stroke-width="1.25"/>
<rect x="10.75" y="10.4" width="2.5" height="6.6" rx=".6" stroke="{CAPS}" stroke-width="1.5"/>
<path d="M9 17.6h6M10 17.6 7.4 19.4 6.2 21.4M14 17.6l2.6 1.8 1.2 2M11.1 17.6l-.8 3.8M12.9 17.6l.8 3.8" stroke="{CAPS}" stroke-width="1.25"/>
''', 'capsídeo e cauda #B9C2D3 (vírus, não é célula), DNA #9A6BFF')

# ---------- módulos (currentColor) ----------
add('mod-dna', 'DNA', 'mod', '''
<path d="M7 2.5c0 5 10 5 10 9.5s-10 4.5-10 9.5M17 2.5c0 5-10 5-10 9.5s10 4.5 10 9.5"/>
<path d="M8.6 4.6h6.8M8 12h8M8.6 19.4h6.8"/>
''')
add('mod-tabela-periodica', 'Tabela periódica', 'mod', '''
<path d="M3 3h3v3h3v3h3V6h6V3h3v12H3z"/>
<path d="M3 9h18M6 6v9"/>
<rect x="7.5" y="17.5" width="10.5" height="3.5" rx=".5"/>
<rect x="12.6" y="10.6" width="3" height="3" rx=".5" fill="currentColor" stroke="none"/>
''')
add('mod-moleculas', 'Moléculas', 'mod', '''
<circle cx="12" cy="13.5" r="3.6"/>
<circle cx="5.2" cy="7.3" r="2.4"/>
<circle cx="18.8" cy="7.3" r="2.4"/>
<path d="M9.3 11.1 7 9M14.7 11.1 17 9"/>
''')
add('mod-biomoleculas', 'Biomoléculas', 'mod', '''
<g transform="rotate(-35 12 12)">
<path d="M1.4 12l2-3.46h4l2 3.46-2 3.46h-4zM14.6 12l2-3.46h4l2 3.46-2 3.46h-4z"/>
<path d="M9.4 12h5.2"/>
<circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/>
</g>
''')
add('mod-celula', 'Célula', 'mod', '''
<circle cx="12" cy="12" r="9"/>
<circle cx="10.4" cy="10.8" r="3.4"/>
<circle cx="10.4" cy="10.8" r="1.1" fill="currentColor" stroke="none"/>
<path d="M14.6 17.1l2.6-1.6"/>
<circle cx="16.6" cy="8" r="1" fill="currentColor" stroke="none"/>
''')
add('mod-morfofisiologia', 'Morfofisiologia celular', 'mod', '''
<path d="M3 9.5h6v5H3M21 9.5h-6v5h6"/>
<path d="M12 3.5v16m-3-3 3 3 3-3"/>
''')

# ---------- ferramentas (currentColor) ----------
add('ui-rotulos', 'Mostrar nomes', 'ui', '''
<rect x="3" y="3.5" width="18" height="8" rx="4"/>
<circle cx="7.2" cy="7.5" r="1.4" fill="currentColor" stroke="none"/>
<path d="M10.6 7.5h6.6M7.2 11.5v5.2"/>
<circle cx="7.2" cy="19.2" r="1.9" fill="currentColor" stroke="none"/>
''')
add('ui-aproximar', 'Aproximar', 'ui', '''
<circle cx="10.5" cy="10.5" r="6.75"/>
<path d="m15.5 15.5 5 5M10.5 7.8v5.4M7.8 10.5h5.4"/>
''')
add('ui-afastar', 'Afastar', 'ui', '''
<circle cx="10.5" cy="10.5" r="6.75"/>
<path d="m15.5 15.5 5 5M7.8 10.5h5.4"/>
''')
add('ui-reiniciar', 'Voltar à vista inicial', 'ui', '''
<path d="M4.5 12A7.5 7.5 0 1 0 12 4.5"/>
<path d="M14.8 2 12 4.5l2.8 2.6"/>
<circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/>
''')
add('ui-pausar', 'Pausar', 'ui', '''
<rect x="6" y="5" width="4" height="14" rx="1.2"/>
<rect x="14" y="5" width="4" height="14" rx="1.2"/>
''')
add('ui-continuar', 'Continuar', 'ui', '''
<path d="M8 5.3v13.4a.9.9 0 0 0 1.4.75l10.2-6.7a.9.9 0 0 0 0-1.5L9.4 4.55A.9.9 0 0 0 8 5.3z"/>
''')
add('ui-tour', 'Começar o passeio', 'ui', '''
<circle cx="5" cy="18" r="2.4" fill="currentColor"/>
<circle cx="10.5" cy="6.5" r="2.4"/>
<circle cx="19" cy="13.5" r="2.4"/>
<path d="M6 15.8 9.4 8.8M12.6 7.9l4.6 3.8"/>
''')
add('ui-voltar', 'Voltar', 'ui', '''
<path d="M14.5 5.5 8 12l6.5 6.5"/>
''')
# extras pedidos no guia (seção 6)
add('ui-fechar', 'Fechar', 'ui', '''
<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>
''')
add('ui-informacao', 'Informação', 'ui', '''
<circle cx="12" cy="12" r="9"/>
<path d="M12 11v5.5"/>
<circle cx="12" cy="7.8" r="1.15" fill="currentColor" stroke="none"/>
''')
add('ui-enem', 'No ENEM', 'ui', '''
<rect x="4.5" y="3" width="15" height="18" rx="2"/>
<path d="m8.3 9.6 2 2 4.4-4.4M8.3 15.5h7.4"/>
''')

ROOT_UI = 'fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"'
ROOT_CEL = 'fill="none" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"'

def indent(s, n):
    return '\n'.join(' ' * n + l for l in s.splitlines())

for i, t, g, body, _ in ICONS:
    root = ROOT_CEL if g == 'cel' else ROOT_UI
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {root} role="img">\n'
           f'  <title>{html.escape(t)}</title>\n{indent(body, 2)}\n</svg>\n')
    open(os.path.join(OUT, i + '.svg'), 'w').write(svg)

sym = []
for i, t, g, body, _ in ICONS:
    root = ROOT_CEL if g == 'cel' else ROOT_UI
    sym.append(f'  <symbol id="{i}" viewBox="0 0 24 24">\n    <title>{html.escape(t)}</title>\n'
               f'    <g {root}>\n{indent(body, 6)}\n    </g>\n  </symbol>')
sprite = ('<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n'
          '  <!-- LAB · Ciência em movimento. Ícones desenhados pela equipe. Gerado a partir dos SVGs soltos desta pasta. -->\n'
          + '\n'.join(sym) + '\n</svg>\n')
open(os.path.join(OUT, 'sprite.svg'), 'w').write(sprite)

# ---------- página de conferência ----------
GRUPOS = [('cel', 'Tipos de célula', 'Cores da paleta científica. Ficam sempre sobre fundo escuro.'),
          ('mod', 'Módulos', 'Traço em currentColor: herdam a cor do texto.'),
          ('ui', 'Ferramentas da barra', 'Traço em currentColor. Fechar, Informação e No ENEM vêm da lista do guia.')]
secs = []
for g, nome, nota in GRUPOS:
    cards = []
    for i, t, gg, _, _ in ICONS:
        if gg != g: continue
        u = f'<use href="#{i}"/>'
        sizes = ''.join(f'<svg class="s{s}" aria-hidden="true">{u}</svg>' for s in (16, 20, 24, 48))
        estados = ''
        if g != 'cel':
            estados = ('<div class="states">'
                       f'<span class="btn dim"><svg aria-hidden="true">{u}</svg></span>'
                       f'<span class="btn"><svg aria-hidden="true">{u}</svg></span>'
                       f'<span class="btn on"><svg aria-hidden="true">{u}</svg></span>'
                       f'<span class="btn light"><svg aria-hidden="true">{u}</svg></span></div>')
        else:
            estados = (f'<div class="states"><span class="chip"><svg aria-hidden="true">{u}</svg>{html.escape(t)}</span></div>')
        cards.append(f'<figure><div class="sizes">{sizes}</div>{estados}'
                     f'<figcaption><b>{html.escape(t)}</b><code>{i}</code></figcaption></figure>')
    secs.append(f'<section><h2>{nome}</h2><p class="nota">{nota}</p><div class="grid">{"".join(cards)}</div></section>')

page = f'''<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ícones do LAB</title>
<style>
:root{{--bg:#0B0F1C;--panel:#131A2B;--panel-2:#1B2440;--line:#2C3757;--line-strong:#5B6C99;--txt:#E8EDF7;--dim:#9DA9C4;--amber:#FFB347;--focus:#8FD8FF}}
*{{box-sizing:border-box}}
body{{margin:0;background:radial-gradient(ellipse at 50% 0,#161D33,var(--bg) 70%) fixed,var(--bg);color:var(--txt);
  font:15px/1.5 "Atkinson Hyperlegible Next","Atkinson Hyperlegible",system-ui,sans-serif;padding:32px 16px}}
main{{max-width:1100px;margin:0 auto}}
h1{{font:600 28px/1.2 "Space Grotesk",system-ui,sans-serif;margin:0 0 8px}}
h2{{font:600 20px/1.2 "Space Grotesk",system-ui,sans-serif;margin:0 0 4px}}
.lead,.nota{{color:var(--dim);margin:0 0 16px}}
section{{margin-top:32px}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(232px,1fr));gap:12px}}
figure{{margin:0;background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:12px}}
.sizes{{display:flex;align-items:flex-end;gap:16px;color:var(--txt)}}
.sizes svg{{flex:none}}
.s16{{width:16px;height:16px}}.s20{{width:20px;height:20px}}.s24{{width:24px;height:24px}}
.s48{{width:48px;height:48px;margin-left:auto;background:repeating-linear-gradient(0deg,transparent 0 1.75px,rgba(255,255,255,.035) 1.75px 2px),repeating-linear-gradient(90deg,transparent 0 1.75px,rgba(255,255,255,.035) 1.75px 2px);outline:1px dashed var(--line);outline-offset:0}}
.states{{display:flex;gap:8px;flex-wrap:wrap}}
.btn{{width:44px;height:44px;display:grid;place-items:center;border-radius:8px;border:1px solid var(--line-strong);background:rgba(19,26,43,.78);color:var(--txt)}}
.btn svg,.chip svg{{width:20px;height:20px}}
.btn.dim{{color:var(--dim);border-color:var(--line)}}
.btn.on{{background:var(--amber);border-color:var(--amber);color:#1A1206}}
.btn.light{{background:#F6F7FA;border-color:#8792AE;color:#141A2B}}
.chip{{display:inline-flex;align-items:center;gap:8px;height:36px;padding:0 12px 0 8px;border-radius:8px;border:1px solid var(--line-strong);background:var(--panel-2);font-size:14px}}
figcaption{{display:flex;justify-content:space-between;align-items:baseline;gap:8px;font-size:14px}}
code{{font:12px "JetBrains Mono",ui-monospace,monospace;color:var(--dim)}}
.legend{{color:var(--dim);font-size:13px;margin-top:8px}}
</style>
</head>
<body>
{sprite}<main>
<h1>Ícones do LAB</h1>
<p class="lead">Grade de 24 × 24 px, traço de 1,75 px. Cada cartão mostra o ícone em 16, 20, 24 e 48 px (com a grade de 2 px).</p>
<p class="legend">Botões das ferramentas, da esquerda para a direita: inativo, normal, escolhido (âmbar) e versão clara.</p>
{"".join(secs)}
</main>
</body>
</html>
'''
open(os.path.join(OUT, 'preview.html'), 'w').write(page)
print(len(ICONS), 'ícones')
