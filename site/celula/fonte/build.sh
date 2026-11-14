# Monta site/celula/index.html a partir das fontes desta pasta.
# O bundle vendor/r3f.js (React, Three, R3F, drei, htm) é gerado à parte, a partir de entry.js:
#   npm install && npx esbuild entry.js --bundle --minify --format=iife --outfile=../vendor/r3f.js
set -e
F="$(cd "$(dirname "$0")" && pwd)"; D="$(dirname "$F")"
SP="$(dirname "$D")/assets/icons/sprite.svg"
if grep -l "</script" "$F/data.js" "$F"/src/*.js; then echo "ERRO: a sequência </script aparece numa fonte concatenada (quebra a página)"; exit 1; fi
{ python3 - "$F/head.html" "$SP" <<'PY'
import sys,re
h=open(sys.argv[1]).read();sp=open(sys.argv[2]).read()
sym=''.join(re.findall(r'<symbol[\s\S]*?</symbol>',sp))
sym=re.sub(r'\s*<title>[^<]*</title>','',sym);sym=re.sub(r'>\s+<','><',sym)
sys.stdout.write(h.replace('<!--SPRITE-->','<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><!-- ícones da equipe: site/assets/icons/sprite.svg -->'+sym+'</svg>'))
PY
  echo '<script src="../assets/materials.js"></script>'; echo '<script src="vendor/r3f.js"></script>'; echo '<script>'; echo '(()=>{'; cat "$F/data.js" "$F"/src/a_util.js "$F"/src/b_cells.js "$F"/src/c_details.js "$F"/src/d_app.js "$F"/src/e_modelos.js; echo '})();'; echo '</script>'; echo '</body>'; echo '</html>'; } > "$D/index.html"
# prévia com tudo embutido (opcional): PREVIA=/caminho/arquivo.html bash build.sh
PREVIA="${PREVIA:-/tmp/claude-0/-home-user/3971ec28-5be7-5fd9-9c6c-a4175a2fe9a2/scratchpad/celula-lab.html}"
if [ -d "$(dirname "$PREVIA")" ]; then python3 - "$D" "$PREVIA" <<'PY'
import sys,os
d,out=sys.argv[1],sys.argv[2]
s=open(os.path.join(d,'index.html')).read()
css=open(os.path.join(d,'..','base.css')).read()
v=open(os.path.join(d,'vendor','r3f.js')).read().replace('</script','<\\/script')
s=s.replace('<link rel="stylesheet" href="../base.css">','<style>'+css+'</style>')
# modelos 3D: no site vêm sob demanda (e_modelos.js); na prévia não há arquivo externo, então vai tudo inline
import glob
md=os.path.join(d,'..','assets','modelos')
fs=[os.path.join(md,'indice.js')]+sorted(glob.glob(os.path.join(md,'*.glb.js')))
mods=''.join('<script>'+open(f).read().replace('</script','<\\/script')+'</script>' for f in fs if os.path.exists(f))
s=s.replace('<script src="vendor/r3f.js">',mods+'<script src="vendor/r3f.js">',1)
s=s.replace('<script src="vendor/r3f.js"></script>','<script>'+v+'</script>')
m=open(os.path.join(d,'..','assets','materials.js')).read().replace('</script','<\\/script')
s=s.replace('<script src="../assets/materials.js"></script>','<script>'+m+'</script>')
open(out,'w').write(s)
PY
fi
ls -la "$D/index.html" "$D/vendor/r3f.js"
