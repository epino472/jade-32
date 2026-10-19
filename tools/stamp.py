"""Agrega ?v=VERSION a los imports y al HTML para saltar el caché del celular.
Uso: python3 tools/stamp.py 20261018b   (correr antes de cada publicación)"""
import re
import sys
from pathlib import Path

if len(sys.argv) != 2:
    raise SystemExit("Uso: python3 tools/stamp.py VERSION")
version = sys.argv[1]
root = Path(__file__).resolve().parent.parent

for path in sorted((root / "src").glob("*.js")):
    text = path.read_text(encoding="utf-8")
    new = re.sub(r"(from '\./[\w-]+\.js)(\?v=[\w.-]+)?'", rf"\1?v={version}'", text)
    if new != text:
        path.write_text(new, encoding="utf-8")
        print("sello", path.name)

html = root / "index.html"
text = html.read_text(encoding="utf-8")
text = re.sub(r'href="style\.css(\?v=[\w.-]+)?"', f'href="style.css?v={version}"', text)
text = re.sub(r'src="src/app\.js(\?v=[\w.-]+)?"', f'src="src/app.js?v={version}"', text)
html.write_text(text, encoding="utf-8")
print("sello index.html ->", version)
