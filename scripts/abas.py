#!/usr/bin/env python3
"""Barra de abas e cards de módulos do LAB, a partir de uma lista única (scripts/modulos.json).

O que faz:
  - Reescreve a barra de abas (<nav class="tabs">) em todas as páginas de módulo, com a aba da página atual
    marcada como ativa (class="on" e aria-current="page").
  - Gera os cards "Módulo NN" e o contador de módulos em site/index.html.
  - Entra só módulo com "pronto": true no JSON e cuja pasta existe em site/. Os outros ficam de fora das abas e
    dos cards, e as páginas deles não são tocadas.
  - A Célula é montada: o script edita site/celula/fonte/head.html e depois roda o build.sh.
  - Se uma página não tiver o ícone de algum módulo no sprite embutido, o símbolo vai junto, dentro do trecho
    gerado (vem de site/assets/icons/sprite.svg ou, se não estiver lá, da própria página do módulo).
  - As fichas de site/tabela-periodica/elementos/ não têm barra de abas e não são tocadas.

Marcadores: o script troca só o que está entre <!-- abas:inicio ... --> e <!-- abas:fim --> (e, na página
inicial, entre cards:inicio/fim e modulos:inicio/fim). Na primeira vez, encontra o trecho e põe os marcadores.
É idempotente: rodar de novo sem mudar o JSON não altera nenhum arquivo.

Uso (na raiz do repositório):
  python3 scripts/abas.py                      aplica em tudo
  python3 scripts/abas.py --verificar          só confere; sai com 1 se algum arquivo ficaria diferente
  python3 scripts/abas.py --incluir genetica,ecologia
                                               marca esses módulos como prontos no JSON e aplica
"""
import argparse, html, json, os, re, subprocess, sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(RAIZ, 'site')
JSON = os.path.join(RAIZ, 'scripts', 'modulos.json')
SPRITE = os.path.join(SITE, 'assets', 'icons', 'sprite.svg')
AVISO = 'gerado por scripts/abas.py a partir de scripts/modulos.json; não edite à mão'
SVG0 = '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">'
SIMB = re.compile(r'<symbol id="(mod-[a-z0-9-]+)"[^>]*>.*?</symbol>', re.S)
esc = lambda s: html.escape(s, quote=False)


def ler(p):
    with open(p, encoding='utf-8') as f:
        return f.read()


def pagina(m):
    """Arquivo que carrega a barra de abas do módulo (a Célula é montada a partir da fonte)."""
    if m['pasta'] == 'celula':
        return os.path.join(SITE, 'celula', 'fonte', 'head.html')
    return os.path.join(SITE, m['pasta'], 'index.html')


def ativos(mods):
    return sorted((m for m in mods if m.get('pronto') and os.path.isfile(pagina(m))), key=lambda m: m['numero'])


def simbolos(mods):
    """Símbolos dos ícones de módulo: do sprite da equipe e, na falta, da página do próprio módulo."""
    s = {}
    fontes = [SPRITE] + [pagina(m) for m in mods if os.path.isfile(pagina(m))]
    for f in fontes:
        for mt in SIMB.finditer(ler(f)):
            s.setdefault(mt.group(1), re.sub(r'<title>.*?</title>', '', mt.group(0), flags=re.S))
    return s


def nav(lista, atual, abre='<nav class="tabs" aria-label="Módulos">'):
    a = [abre + '<a href="../index.html"><span>Início</span></a>']
    for m in lista:
        on = ' class="on" aria-current="page"' if atual and m['id'] == atual['id'] else ''
        nome = (f'<span class="nm-l">{esc(m["aba"])}</span><span class="nm-s">{esc(m["aba_curta"])}</span>'
                if m.get('aba_curta') else f'<span>{esc(m["aba"])}</span>')
        a.append(f'<a href="../{m["pasta"]}/index.html"{on}><svg class="ico" aria-hidden="true"><use href="#{m["icone"]}"/></svg>{nome}</a>')
    return ''.join(a) + '</nav>'


def icones_faltando(texto_fora, lista, simb, ja_tem=()):
    """Bloco com os símbolos que a página usa nas abas mas não define em outro lugar."""
    falta = []
    for m in lista:
        i = m['icone']
        if f'id="{i}"' in texto_fora or i in ja_tem:
            continue
        if i not in simb:
            print(f'  aviso: ícone {i} não encontrado no sprite nem na página do módulo', file=sys.stderr)
            continue
        falta.append(simb[i])
    return SVG0 + ''.join(falta) + '</svg>' if falta else ''


def trocar(texto, nome, novo, primeira_vez, curto=False):
    """Troca o trecho entre os marcadores; se ainda não há marcadores, troca o que primeira_vez encontrar."""
    ini = f'<!-- {nome}:inicio -->' if curto else f'<!-- {nome}:inicio ({AVISO}) -->'
    bloco = ini + novo + f'<!-- {nome}:fim -->'
    pat = re.compile(r'<!-- %s:inicio[^>]*-->.*?<!-- %s:fim -->' % (nome, nome), re.S)
    if pat.search(texto):
        return pat.sub(lambda _: bloco, texto, count=1)
    mt = primeira_vez.search(texto)
    if not mt:
        raise SystemExit(f'ERRO: não achei onde pôr o trecho "{nome}"')
    return texto[:mt.start()] + bloco + texto[mt.end():]


NAV = re.compile(r'<nav class="tabs"[^>]*>.*?</nav>', re.S)
FORA = lambda t, nome: re.sub(r'<!-- %s:inicio[^>]*-->.*?<!-- %s:fim -->' % (nome, nome), '', t, flags=re.S)


def pagina_modulo(m, lista, simb, sprite_ids):
    t = ler(pagina(m))
    ja = sprite_ids if m['pasta'] == 'celula' else ()   # o build da Célula embute o sprite inteiro
    # mantém a tag de abertura da página (algumas têm id="tabs" usado pelo próprio script delas)
    ab = re.search(r'<nav class="tabs"[^>]*>', t)
    novo = nav(lista, m, ab.group(0) if ab else '<nav class="tabs" aria-label="Módulos">') + icones_faltando(FORA(t, 'abas'), lista, simb, ja)
    return trocar(t, 'abas', novo, NAV)


def card(m):
    selos = (['<span class="badge new">Novo</span>'] if m.get('novo') else []) + \
            [f'<span class="badge">{esc(x)}</span>' for x in [m['area']] + m.get('selos', [])]
    arte = (f'<canvas id="{m["canvas"]}" aria-hidden="true"></canvas>' if m.get('canvas') else
            f'<div class="art" aria-hidden="true"><svg class="ico"><use href="#{m["icone"]}"/></svg></div>')
    return (f'    <a class="card{" feat" if m.get("destaque") else ""}" href="{m["pasta"]}/index.html">\n'
            f'      {arte}\n'
            f'      <div class="body">\n'
            f'        <div class="meta"><svg class="ico" aria-hidden="true"><use href="#{m["icone"]}"/></svg>Módulo {m["numero"]} {" ".join(selos)}</div>\n'
            f'        <h3>{esc(m["card"])}</h3>\n'
            f'        <p>{esc(m["frase"])}</p>\n'
            f'      </div>\n'
            f'    </a>\n')


CSS_ARTE = ('    <style>.card .art{display:flex;align-items:center;justify-content:center;height:180px;'
            'background:radial-gradient(70% 70% at 50% 48%,var(--stage-in),var(--bg) 78%);border-bottom:1px solid var(--line)}'
            '.card.feat .art{flex:1;min-height:260px;height:auto}.card .art .ico{width:72px;height:72px;color:var(--dim)}</style>\n')


def pagina_inicial(lista, simb):
    p = os.path.join(SITE, 'index.html')
    t = ler(p)
    ordem = sorted(lista, key=lambda m: (not m.get('destaque'), m['numero']))
    corpo = ''.join(card(m) for m in ordem)
    if any(not m.get('canvas') for m in lista):
        corpo = CSS_ARTE + corpo
    ic = icones_faltando(FORA(t, 'cards'), lista, simb)
    if ic:
        corpo = '    ' + ic + '\n' + corpo
    t = trocar(t, 'cards', '\n' + corpo + '    ', re.compile(r'(?<=<div class="cards">)\n.*?\n    </a>\n  (?=</div>)', re.S))
    t = trocar(t, 'modulos', str(len(lista)), re.compile(r'(?<=<div class="k">Módulos</div><b>)\d+(?=</b>)'), curto=True)
    return p, t


def incluir(ids):
    """Marca módulos como prontos no JSON, mexendo só na linha de cada um (mantém o resto do arquivo)."""
    linhas = ler(JSON).split('\n')
    for i in ids:
        achou = False
        for n, l in enumerate(linhas):
            if f'"id": "{i}"' in l:
                linhas[n] = l.replace('"pronto": false', '"pronto": true')
                achou = True
        if not achou:
            raise SystemExit(f'ERRO: módulo "{i}" não está em {JSON}')
    with open(JSON, 'w', encoding='utf-8') as f:
        f.write('\n'.join(linhas))


def main():
    ap = argparse.ArgumentParser(description='Barra de abas e cards de módulos do LAB.')
    ap.add_argument('--verificar', action='store_true', help='não grava; sai com 1 se algo ficaria diferente')
    ap.add_argument('--incluir', default='', help='ids separados por vírgula: marca como prontos no JSON antes de aplicar')
    a = ap.parse_args()
    if a.incluir:
        if a.verificar:
            raise SystemExit('ERRO: --incluir e --verificar não combinam')
        incluir([x.strip() for x in a.incluir.split(',') if x.strip()])
    mods = json.loads(ler(JSON))['modulos']
    lista = ativos(mods)
    for m in mods:
        if m.get('pronto') and m not in lista:
            print(f'  aviso: {m["id"]} está marcado como pronto, mas {os.path.relpath(pagina(m), RAIZ)} não existe; fica de fora', file=sys.stderr)
    simb = simbolos(mods)
    sprite_ids = set(SIMB_ID.findall(ler(SPRITE)))
    saidas = [(pagina(m), pagina_modulo(m, lista, simb, sprite_ids)) for m in lista] + [pagina_inicial(lista, simb)]
    mudou = [p for p, t in saidas if ler(p) != t]
    print(f'módulos nas abas: {", ".join(m["id"] for m in lista)} ({len(lista)})')
    if a.verificar:
        for p in mudou:
            print('  ficaria diferente:', os.path.relpath(p, RAIZ))
        print('tudo em dia' if not mudou else f'{len(mudou)} arquivo(s) desatualizado(s)')
        sys.exit(1 if mudou else 0)
    for p, t in saidas:
        if p in mudou:
            with open(p, 'w', encoding='utf-8') as f:
                f.write(t)
            print('  atualizado:', os.path.relpath(p, RAIZ))
    if not mudou:
        print('  nada mudou')
    cel = os.path.join(SITE, 'celula', 'fonte', 'head.html')
    if cel in mudou:
        print('  montando a Célula (site/celula/fonte/build.sh)')
        subprocess.run(['bash', os.path.join(SITE, 'celula', 'fonte', 'build.sh')], check=True, stdout=subprocess.DEVNULL)


SIMB_ID = re.compile(r'<symbol id="(mod-[a-z0-9-]+)"')

if __name__ == '__main__':
    main()
