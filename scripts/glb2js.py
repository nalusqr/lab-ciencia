#!/usr/bin/env python3
"""glb2js: embute modelos .glb em arquivos .glb.js para o site abrir por duplo clique (file://).

Por que existe: aberto como file://, o navegador bloqueia fetch/XHR de um .glb. Um <script src> comum,
porém, carrega normalmente. Então cada X.glb vira X.glb.js com o binário em base64:

    window.LAB_MODELOS = window.LAB_MODELOS||{}; LAB_MODELOS['X'] = '<base64>';

Quem lê isso é site/celula/fonte/src/e_modelos.js (carregarModelo('X')), que injeta o .glb.js só quando precisa.
Junto, o script (re)gera site/assets/modelos/indice.js com a lista dos modelos existentes:
    window.LAB_MODELOS_INDICE=["mitocondria", ...];
Assim o carregador não pede arquivo que não existe (o que daria erro de console).

Uso (na raiz do repositório):
    python3 scripts/glb2js.py                      # converte todo site/assets/modelos/*.glb
    python3 scripts/glb2js.py caminho/a.glb ...    # converte só estes (saída ao lado de cada um)
    python3 scripts/glb2js.py --verificar          # só confere se os .glb.js estão em dia (sai com 1 se não)

A saída é determinística (mesmo .glb gera o mesmo .glb.js, byte a byte), então dá para versionar e comparar.
Só usa a biblioteca padrão do Python 3.
"""
import base64, glob, json, os, re, struct, sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PASTA_PADRAO = os.path.join(RAIZ, 'site', 'assets', 'modelos')
# extensões que o GLTFLoader do bundle não decodifica sozinho em file:// (precisariam de decodificador wasm/js extra)
NAO_SUPORTADAS = {'KHR_draco_mesh_compression', 'EXT_meshopt_compression', 'KHR_texture_basisu'}
AVISO_TAMANHO = 8 * 1024 * 1024  # acima disso o .glb.js pesa na abertura da página


def validar(caminho, dados):
    """Confere o cabeçalho GLB 2.0 e as extensões exigidas. Devolve o JSON do glTF."""
    if len(dados) < 20:
        raise ValueError('arquivo curto demais para ser um .glb')
    magic, versao, total = struct.unpack('<4sII', dados[:12])
    if magic != b'glTF':
        raise ValueError('não é um .glb binário (cabeçalho "glTF" ausente); exporte do Blender como glTF Binary (.glb)')
    if versao != 2:
        raise ValueError('glTF versão %d; o carregador espera a versão 2' % versao)
    if total != len(dados):
        raise ValueError('tamanho declarado (%d) diferente do arquivo (%d): exportação incompleta?' % (total, len(dados)))
    tam, tipo = struct.unpack('<I4s', dados[12:20])
    if tipo != b'JSON':
        raise ValueError('primeiro bloco não é JSON')
    gltf = json.loads(dados[20:20 + tam].decode('utf-8'))
    exig = set(gltf.get('extensionsRequired', [])) & NAO_SUPORTADAS
    if exig:
        raise ValueError('usa %s, que o site não decodifica em file://. Exporte sem compressão (no Blender: '
                         'desmarcar "Compression" na exportação glTF).' % ', '.join(sorted(exig)))
    return gltf


def nome_do_modelo(caminho):
    nome = os.path.basename(caminho)[:-len('.glb')]
    if not re.fullmatch(r'[a-z0-9_\-]+', nome):
        raise ValueError('nome "%s" inválido: use só letras minúsculas, números, _ e -' % nome)
    return nome


def gerar_js(nome, dados):
    b64 = base64.b64encode(dados).decode('ascii')
    return ("// Gerado por scripts/glb2js.py a partir de %s.glb (%d bytes). Não edite à mão: rode o script de novo.\n"
            "window.LAB_MODELOS=window.LAB_MODELOS||{};LAB_MODELOS[%s]='%s';\n"
            % (nome, len(dados), json.dumps(nome), b64))


def converter(caminho, verificar=False):
    nome = nome_do_modelo(caminho)
    dados = open(caminho, 'rb').read()
    gltf = validar(caminho, dados)
    saida = caminho + '.js'
    novo = gerar_js(nome, dados)
    nos = [n.get('name') for n in gltf.get('nodes', []) if 'mesh' in n]
    if verificar:
        atual = open(saida, encoding='utf-8').read() if os.path.exists(saida) else None
        ok = atual == novo
        print('%s %s' % ('em dia ' if ok else 'DESATUALIZADO', os.path.relpath(saida, RAIZ)))
        return ok
    with open(saida, 'w', encoding='utf-8', newline='\n') as f:
        f.write(novo)
    print('%s -> %s (%d KB -> %d KB); malhas: %s' % (os.path.relpath(caminho, RAIZ), os.path.relpath(saida, RAIZ),
          len(dados) // 1024, len(novo) // 1024, ', '.join(nos)))
    if len(dados) > AVISO_TAMANHO:
        print('  aviso: modelo grande; considere decimar no Blender', file=sys.stderr)
    return True


def gerar_indice(pasta):
    nomes = sorted(os.path.basename(p)[:-len('.glb.js')] for p in glob.glob(os.path.join(pasta, '*.glb.js')))
    return ('// Gerado por scripts/glb2js.py: modelos .glb.js disponíveis nesta pasta. Não edite à mão.\n'
            'window.LAB_MODELOS_INDICE=%s;\n' % json.dumps(nomes)), nomes


def indice(pasta, verificar):
    novo, nomes = gerar_indice(pasta)
    saida = os.path.join(pasta, 'indice.js')
    if verificar:
        ok = os.path.exists(saida) and open(saida, encoding='utf-8').read() == novo
        print('%s %s' % ('em dia ' if ok else 'DESATUALIZADO', os.path.relpath(saida, RAIZ)))
        return ok
    with open(saida, 'w', encoding='utf-8', newline='\n') as f:
        f.write(novo)
    print('%s: %s' % (os.path.relpath(saida, RAIZ), ', '.join(nomes) or '(vazio)'))
    return True


def main(args):
    verificar = '--verificar' in args
    arquivos = [a for a in args if not a.startswith('--')] or sorted(glob.glob(os.path.join(PASTA_PADRAO, '*.glb')))
    if not arquivos:
        print('nenhum .glb em %s' % os.path.relpath(PASTA_PADRAO, RAIZ))
        return 0
    falhou = False
    for a in arquivos:
        try:
            if not converter(a, verificar):
                falhou = True
        except (OSError, ValueError) as e:
            print('ERRO %s: %s' % (a, e), file=sys.stderr)
            falhou = True
    for pasta in sorted({os.path.dirname(os.path.abspath(a)) for a in arquivos}):
        if not indice(pasta, verificar):
            falhou = True
    return 1 if falhou else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
