# Monta site/celula/index.html a partir das fontes desta pasta.
# O bundle vendor/r3f.js (React, Three, R3F, drei, htm) é gerado à parte, a partir de entry.js:
#   npm install && npx esbuild entry.js --bundle --minify --format=iife --outfile=../vendor/r3f.js
set -e
F="$(cd "$(dirname "$0")" && pwd)"; D="$(dirname "$F")"
{ cat "$F/head.html"; echo '<script src="vendor/r3f.js"></script>'; echo '<script>'; echo '(()=>{'; cat "$F/data.js" "$F"/src/a_util.js "$F"/src/b_cells.js "$F"/src/c_details.js "$F"/src/d_app.js; echo '})();'; echo '</script>'; echo '</body>'; echo '</html>'; } > "$D/index.html"
# prévia com tudo embutido (opcional): PREVIA=/caminho/arquivo.html bash build.sh
PREVIA="${PREVIA:-/tmp/claude-0/-home-user/3971ec28-5be7-5fd9-9c6c-a4175a2fe9a2/scratchpad/celula-lab.html}"
if [ -d "$(dirname "$PREVIA")" ]; then python3 - "$D" "$PREVIA" <<'PY'
import sys,os
d,out=sys.argv[1],sys.argv[2]
s=open(os.path.join(d,'index.html')).read()
css=open(os.path.join(d,'..','base.css')).read()
v=open(os.path.join(d,'vendor','r3f.js')).read().replace('</script','<\\/script')
s=s.replace('<link rel="stylesheet" href="../base.css">','<style>'+css+'</style>')
s=s.replace('<script src="vendor/r3f.js"></script>','<script>'+v+'</script>')
open(out,'w').write(s)
PY
fi
ls -la "$D/index.html" "$D/vendor/r3f.js"
