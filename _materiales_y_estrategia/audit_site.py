import os
import re
from html.parser import HTMLParser

site_dir = r"c:\Users\Rony\Documents\GitHub\CIASARD-entrega-completa-backup\sitio-web"

html_files = []
for root, dirs, files in os.walk(site_dir):
    for f in files:
        if f.endswith(".html"):
            html_files.append(os.path.join(root, f))

print(f"=== AUDITORÍA TÉCNICA SITIO WEB CIASA RD ===")
print(f"Total de páginas HTML auditadas: {len(html_files)}")

missing_assets = []
forms_found = []
external_links_without_rel = []
inline_scripts_with_warnings = []


class AssetParser(HTMLParser):
    """Collect real element sources without matching JavaScript template text."""

    def __init__(self):
        super().__init__()
        self.sources = []

    def handle_starttag(self, tag, attrs):
        if tag not in {"script", "img", "video", "source", "iframe"}:
            return
        values = dict(attrs)
        source = values.get("src") or values.get("data-src")
        if source:
            self.sources.append(source)

for hf in html_files:
    rel_path = os.path.relpath(hf, site_dir)
    with open(hf, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    # 1. Check src references
    parser = AssetParser()
    parser.feed(content)
    srcs = parser.sources
    for src in srcs:
        if src.startswith("http://") or src.startswith("https://") or src.startswith("//") or src.startswith("data:"):
            continue
        clean_src = src.split("?")[0].split("#")[0]
        if not clean_src:
            continue
        if clean_src.startswith("/"):
            target = os.path.join(site_dir, clean_src.lstrip("/"))
        else:
            target = os.path.normpath(os.path.join(os.path.dirname(hf), clean_src))
        if not os.path.exists(target):
            missing_assets.append((rel_path, src))

    # 2. Check forms
    form_matches = re.findall(r'<form\b[^>]*id=["\']([^"\']+)["\']', content)
    for fm in form_matches:
        forms_found.append((rel_path, fm))

    # 3. Check external links target="_blank"
    a_tags = re.findall(r'<a\b[^>]*target=["\']_blank["\'][^>]*>', content)
    for a in a_tags:
        if 'rel=' not in a or 'noopener' not in a:
            external_links_without_rel.append((rel_path, a))

print(f"1. Formularios activos encontrados: {len(forms_found)}")
print(f"2. Archivos/Assets faltantes (imagenes, scripts): {len(missing_assets)}")
if missing_assets:
    for f, src in missing_assets:
        print(f"   [AVISO] Faltante en {f}: {src}")
else:
    print("   [OK] Cero assets rotos detectados en HTML estatico.")

print(f"3. Enlaces externos inseguros (sin rel='noopener'): {len(external_links_without_rel)}")
if external_links_without_rel:
    for f, a in external_links_without_rel:
        print(f"   [AVISO] En {f}: {a}")
else:
    print("   [OK] Todos los enlaces externos cuentan con proteccion anti-tabnabbing.")

# Check projects data
projects_data_file = os.path.join(site_dir, "js", "projects-data.js")
if os.path.exists(projects_data_file):
    with open(projects_data_file, "r", encoding="utf-8", errors="ignore") as f:
        p_content = f.read()
    project_ids = re.findall(r'id:\s*["\']([^"\']+)["\']', p_content)
    print(f"4. Catalogo de proyectos en js/projects-data.js: {len(project_ids)} proyectos registrados.")

print("=== FIN DE AUDITORIA ===")
