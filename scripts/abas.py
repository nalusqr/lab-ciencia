#!/usr/bin/env python3
"""Barra de abas e trilha de etapas do LAB, a partir de uma lista única (scripts/modulos.json).

O que faz:
  - Reescreve a barra de abas (<nav class="tabs">) em todas as páginas de módulo, com a aba da página atual
    marcada como ativa (class="on" e aria-current="page").
  - Na página da Biologia (site/biologia/index.html, desenhada à mão pelo dono dela), preenche só o que está entre os
    marcadores que a página tiver: a trilha do curso (os módulos sem "apoio", como etapas numeradas 1, 2, 3...
    na ordem do campo "ordem"); e, se houver os marcadores, a faixa "Para consultar" (os módulos com
    "apoio": true) e o botão "Começar pela etapa N". Cada etapa mostra "card" (título), "resumo" (até 20 palavras) e "temas"
    (3 a 5 etiquetas); a faixa de apoio mostra "card" e "resumo".
  - Abas, etapas e apoio seguem o campo "ordem" (a ordem do curso). O rótulo "Módulo NN" do cabeçalho de cada
    página segue "numeracao" no JSON: "pasta" (número histórico) ou "ordem" (posição no curso; os módulos de
    apoio mostram "rotulo_apoio").
  - Entra só módulo com "pronto": true no JSON e cuja pasta existe em site/. Os outros ficam de fora das abas e
    do apoio, e as páginas deles não são tocadas. Na trilha, a etapa que não está pronta aparece como
    "Em breve", sem link (a trilha mostra sempre o curso inteiro).
  - A Célula é montada: o script edita site/celula/fonte/head.html e depois roda o build.sh.
  - Se uma página não tiver o ícone de algum módulo no sprite embutido, o símbolo vai junto, dentro do trecho
    gerado (vem de site/assets/icons/sprite.svg ou, se não estiver lá, da própria página do módulo).
  - As fichas de site/tabela-periodica/elementos/ não têm barra de abas e não são tocadas.

Marcadores: o script troca só o que está entre <!-- abas:inicio ... --> e <!-- abas:fim --> (e, na página
da Biologia, entre trilha:inicio/fim e, se existirem, apoio:inicio/fim e comecar:inicio/fim; esses marcadores
quem põe é o dono da página, e o script não os cria). Na primeira vez, encontra o trecho e põe os marcadores.
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
TRILHA = os.path.join(SITE, 'biologia', 'index.html')   # página da Biologia (trilha); site/index.html é a roda de matérias e não é tocada
INICIO = '../biologia/index.html'                        # aba "Início" das páginas de módulo
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
    return sorted((m for m in mods if m.get('pronto') and os.path.isfile(pagina(m))), key=lambda m: m['ordem'])


CFG = {}   # numeracao e rotulo_apoio, lidos do JSON em main()


def rotulo(m):
    """O que o card e o cabeçalho da página mostram: "Módulo N" (número histórico ou ordem do curso) ou o rótulo de apoio."""
    if CFG.get('numeracao') == 'ordem':
        if m.get('apoio') and CFG.get('rotulo_apoio'):
            return CFG['rotulo_apoio']
        return f'Módulo {m["ordem"]}'
    return f'Módulo {m["numero"]}'


def cabecalho(t, m):
    """Atualiza "Módulo N" no cabeçalho da página (<div class="k">) e na descrição ("Módulo N do LAB")."""
    r = esc(rotulo(m))
    ant = r'Módulo \d+' + (('|' + re.escape(esc(CFG['rotulo_apoio']))) if CFG.get('rotulo_apoio') else '')
    t = re.sub(r'(<div class="k">)(?:%s)(?= <span class="badge">)' % ant, lambda x: x.group(1) + r, t, count=1)
    return re.sub(r'(content="(?:%s))(?= do LAB)' % ant, lambda x: 'content="' + r, t, count=1)


def simbolos(mods):
    """Símbolos dos ícones de módulo: do sprite da equipe e, na falta, da página do próprio módulo."""
    s = {}
    fontes = [SPRITE] + [pagina(m) for m in mods if os.path.isfile(pagina(m))]
    for f in fontes:
        for mt in SIMB.finditer(ler(f)):
            s.setdefault(mt.group(1), re.sub(r'<title>.*?</title>', '', mt.group(0), flags=re.S))
    return s


def _aba(m, atual, cls=''):
    if m.get('curta_pc') and m.get('aba_curta'):
        cls = (cls + ' cp').strip()   # nome curto também no computador largo, para a barra caber
    on = ' class="on" aria-current="page"' if atual and m['id'] == atual['id'] else ''
    if cls:
        on = f' class="{cls}{" on" if on else ""}"' + (' aria-current="page"' if on else '')
    nome = (f'<span class="nm-l">{esc(m["aba"])}</span><span class="nm-s">{esc(m["aba_curta"])}</span>'
            if m.get('aba_curta') else f'<span>{esc(m["aba"])}</span>')
    return f'<a href="../{m["pasta"]}/index.html"{on}><svg class="ico" aria-hidden="true"><use href="#{m["icone"]}"/></svg>{nome}</a>'


# Fecha o menu "Apoio" com Esc e com clique ou foco fora dele. É só conforto: sem este script (ou com JS
# desligado) o menu abre e fecha pelo próprio <details>, com mouse, toque ou teclado.
JS_APOIO = ('<script>(()=>{const d=document.querySelector(".tabs details.apoio");if(!d)return;const s=d.querySelector("summary");'
            'const x=()=>s.setAttribute("aria-expanded",d.open);x();d.addEventListener("toggle",x);'
            'document.addEventListener("keydown",e=>{if(e.key==="Escape"&&d.open){d.open=false;s.focus()}});'
            'document.addEventListener("click",e=>{if(d.open&&!d.contains(e.target))d.open=false});'
            'd.addEventListener("focusout",e=>{if(d.open&&e.relatedTarget&&!d.contains(e.relatedTarget))d.open=false})})();</script>')


def nav(lista, atual, abre='<nav class="tabs" aria-label="Módulos">'):
    """Abas do curso; os módulos de apoio aparecem duas vezes: como abas comuns (class="ap", visíveis só quando a
    barra rola, no celular e em telas médias) e dentro do menu "Apoio" (visível só no computador largo)."""
    curso = [m for m in lista if not m.get('apoio')]
    apoio = [m for m in lista if m.get('apoio')]
    a = [abre + f'<a href="{INICIO}"><span>Início</span></a>']
    a += [_aba(m, atual, '') for m in curso]
    a += [_aba(m, atual, 'ap') for m in apoio]
    if apoio:
        dentro = atual is not None and atual.get('apoio')
        itens = ''.join(f'<a href="../{m["pasta"]}/index.html"' + (' class="on" aria-current="page"' if atual and m['id'] == atual['id'] else '') +
                        f'><svg class="ico" aria-hidden="true"><use href="#{m["icone"]}"/></svg><span>{esc(m["aba"])}</span></a>' for m in apoio)
        a.append(f'<details class="apoio{" on" if dentro else ""}"><summary>Apoio</summary><div class="menu">{itens}</div></details>')
    return ''.join(a) + '</nav>' + (JS_APOIO if apoio else '')


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
    return cabecalho(trocar(t, 'abas', novo, NAV), m)


def palavras(t):
    return len(t.split())


def conferir_textos(curso, apoio):
    """Avisos (não erros) para os textos da página inicial: resumo de até 20 palavras e 3 a 5 temas por etapa."""
    for m in curso + apoio:
        r = m.get('resumo') or ''
        if not r:
            print(f'  aviso: {m["id"]} está sem "resumo" (usa o começo de "frase")', file=sys.stderr)
        elif palavras(r) > 20:
            print(f'  aviso: o resumo de {m["id"]} tem {palavras(r)} palavras (máximo 20)', file=sys.stderr)
    for m in curso:
        n = len(m.get('temas', []))
        if not 3 <= n <= 5:
            print(f'  aviso: {m["id"]} tem {n} temas (o combinado é de 3 a 5)', file=sys.stderr)


def resumo(m):
    if m.get('resumo'):
        return m['resumo']
    p = m['frase'].split()
    return ' '.join(p[:20]) + ('…' if len(p) > 20 else '')


def etapa(m, n, pronto):
    """Uma etapa da trilha: com link se o módulo está pronto; senão, "Em breve", sem link."""
    selos = (' <span class="badge new">Novo</span>' if pronto and m.get('novo') else '') + \
            ('' if pronto else ' <span class="badge breve">Em breve</span>')
    temas = ''.join(f'<li>{esc(t)}</li>' for t in m.get('temas', []))
    tag, attr = ('a', f' href="../{m["pasta"]}/index.html"') if pronto else ('div', '')
    return (f'    <li class="etapa {"pronta" if pronto else "breve"}">\n'
            f'      <span class="no" aria-hidden="true">{n}</span>\n'
            f'      <{tag} class="passo"{attr}>\n'
            f'        <div class="meta"><svg class="ico" aria-hidden="true"><use href="#{m["icone"]}"/></svg><span>Etapa {n}</span>{selos}</div>\n'
            f'        <h3>{esc(m["card"])}</h3>\n'
            f'        <p>{esc(resumo(m))}</p>\n'
            + (f'        <ul class="temas" aria-label="Temas">{temas}</ul>\n' if temas else '') +
            f'      </{tag}>\n'
            f'    </li>\n')


def consulta(m):
    return (f'    <a class="ref" href="../{m["pasta"]}/index.html"><svg class="ico" aria-hidden="true"><use href="#{m["icone"]}"/></svg>'
            f'<span><b>{esc(m["card"])}</b><small>{esc(resumo(m))}</small></span></a>\n')


def pagina_inicial(mods, lista, simb):
    """Preenche, em site/biologia/index.html (a página da Biologia), só os trechos cujos marcadores a página já tem (quem desenha a página
    inicial põe os marcadores e o CSS; o script não cria marcador nem mexe no resto):
      trilha:inicio/fim   as etapas do curso (<li class="etapa ...">), para ficar dentro de um <ol>
      apoio:inicio/fim    (opcional) os links da faixa "Para consultar"
      comecar:inicio/fim  (opcional) o botão "Começar pela etapa N", que leva à primeira etapa pronta
    Sem o arquivo ou sem o marcador da trilha, a página fica como está (com um aviso)."""
    p = TRILHA
    if not os.path.isfile(p):
        print(f'  aviso: {os.path.relpath(p, RAIZ)} ainda não existe; trilha não gerada', file=sys.stderr)
        return None
    t = ler(p)
    tem = lambda nome: re.search(r'<!-- %s:inicio[^>]*-->.*?<!-- %s:fim -->' % (nome, nome), t, re.S)
    if not tem('trilha'):
        print(f'  aviso: {os.path.relpath(p, RAIZ)} ainda não tem os marcadores <!-- trilha:inicio --> e <!-- trilha:fim -->; página inicial não tocada', file=sys.stderr)
        return p, t
    curso = sorted((m for m in mods if not m.get('apoio')), key=lambda m: m['ordem'])   # a trilha inteira, pronta ou não
    apoio = [m for m in lista if m.get('apoio')]
    prontos = {m['id'] for m in lista}
    conferir_textos(curso, apoio)
    trilha = ''.join(etapa(m, n, m['id'] in prontos) for n, m in enumerate(curso, 1))
    fora = FORA(FORA(FORA(t, 'trilha'), 'apoio'), 'comecar')
    ic = icones_faltando(fora, curso + (apoio if tem('apoio') else []), simb)
    if ic:   # símbolos que faltam na página: num <li> escondido no FIM do <ol> (o <ol> continua válido, e o
        # :nth-of-type / :nth-child das etapas 1 a N não muda)
        trilha += f'    <li class="icones" hidden>{ic}</li>\n'
    t = trocar(t, 'trilha', '\n' + trilha + '  ', None)
    if tem('apoio'):
        t = trocar(t, 'apoio', '\n' + ''.join(consulta(m) for m in apoio) + '  ', None)
    if tem('comecar'):
        ini = next(((n, m) for n, m in enumerate(curso, 1) if m['id'] in prontos), None)
        t = trocar(t, 'comecar', f'<a class="btn primary" href="../{ini[1]["pasta"]}/index.html">Começar pela etapa {ini[0]}</a>' if ini else '', None, curto=True)
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
    ap = argparse.ArgumentParser(description='Barra de abas e trilha de etapas do LAB.')
    ap.add_argument('--verificar', action='store_true', help='não grava; sai com 1 se algo ficaria diferente')
    ap.add_argument('--pular', default='', help='pastas separadas por vírgula cujas páginas não devem ser gravadas agora (o módulo continua nas abas)')
    ap.add_argument('--incluir', default='', help='ids separados por vírgula: marca como prontos no JSON antes de aplicar')
    a = ap.parse_args()
    if a.incluir:
        if a.verificar:
            raise SystemExit('ERRO: --incluir e --verificar não combinam')
        incluir([x.strip() for x in a.incluir.split(',') if x.strip()])
    dados = json.loads(ler(JSON))
    CFG.update(numeracao=dados.get('numeracao', 'pasta'), rotulo_apoio=dados.get('rotulo_apoio', ''))
    if CFG['numeracao'] not in ('pasta', 'ordem'):
        raise SystemExit('ERRO: numeracao deve ser "pasta" ou "ordem"')
    mods = dados['modulos']
    lista = ativos(mods)
    for m in mods:
        if m.get('pronto') and m not in lista:
            print(f'  aviso: {m["id"]} está marcado como pronto, mas {os.path.relpath(pagina(m), RAIZ)} não existe; fica de fora', file=sys.stderr)
    simb = simbolos(mods)
    sprite_ids = set(SIMB_ID.findall(ler(SPRITE)))
    pular = {x.strip() for x in a.pular.split(',') if x.strip()}
    saidas = [(pagina(m), pagina_modulo(m, lista, simb, sprite_ids)) for m in lista if m['pasta'] not in pular] + [x for x in [pagina_inicial(mods, lista, simb)] if x]
    for x in sorted(pular):
        print(f'  pulado (não gravado): site/{x}/')
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
