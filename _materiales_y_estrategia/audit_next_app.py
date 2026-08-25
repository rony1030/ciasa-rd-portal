import os
import re

next_app_dir = r"C:\Users\Rony\Downloads\Telegram Desktop\ciasard_next_app_source"

print("=== AUDITORIA INTEGRAL PROYECTO NEXT.JS CIASARD ===")

# 1. Check home2 traces
home2_dir = os.path.join(next_app_dir, "src", "app", "home2")
print(f"1. Verificacion carpeta home2: {'NO EXISTE (Correcto)' if not os.path.exists(home2_dir) else 'EXISTE (Error)'}")

home2_references = []
for root, dirs, files in os.walk(os.path.join(next_app_dir, "src")):
    for f in files:
        if f.endswith((".tsx", ".ts", ".jsx", ".js")):
            p = os.path.join(root, f)
            with open(p, "r", encoding="utf-8", errors="ignore") as fp:
                c = fp.read()
                if "/home2" in c or "Ver. 02" in c:
                    home2_references.append(os.path.relpath(p, next_app_dir))

print(f"2. Referencias residuales a /home2 o Ver. 02: {len(home2_references)}")
for r in home2_references:
    print(f"   - Encontrado en: {r}")

# 2. Check video asset
video_file = os.path.join(next_app_dir, "public", "assets", "videos", "ciasard-intro.mp4")
if os.path.exists(video_file):
    print(f"3. Video MP4 en public/assets/videos: PRESENTE ({os.path.getsize(video_file):,} bytes)")
else:
    print("3. Video MP4 en public/assets/videos: FALTANTE")

# 3. Check documents
docs_dir = os.path.join(next_app_dir, "docs")
docs = os.listdir(docs_dir) if os.path.exists(docs_dir) else []
print(f"4. Documentos en docs/: {len(docs)} archivos:")
for d in docs:
    print(f"   - {d}")

# 4. Check routes in src/app
routes = []
for root, dirs, files in os.walk(os.path.join(next_app_dir, "src", "app")):
    for f in files:
        if f.startswith("page."):
            rel = os.path.relpath(root, os.path.join(next_app_dir, "src", "app"))
            routes.append("/" if rel == "." else f"/{rel}")

print(f"5. Rutas activas en Next App Router:")
for r in routes:
    print(f"   - {r}")

# 5. Check projects data
proj_file = os.path.join(next_app_dir, "src", "data", "projects.ts")
if os.path.exists(proj_file):
    with open(proj_file, "r", encoding="utf-8", errors="ignore") as f:
        proj_content = f.read()
    p_matches = re.findall(r'id:\s*["\']([^"\']+)["\']', proj_content)
    print(f"6. Catalogo en src/data/projects.ts: {len(p_matches)} proyectos cargados.")

print("=== FIN DE AUDITORIA NEXT.JS ===")
