import os
import re

footer_path = r"C:\Users\Rony\Downloads\Telegram Desktop\ciasard_next_app_source\src\components\Footer.tsx"
if os.path.exists(footer_path):
    with open(footer_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    content = re.sub(r'<Link\s+href="/home2"[^>]*>.*?</Link>', '', content, flags=re.DOTALL)

    with open(footer_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Footer.tsx: Enlace a Home 2 eliminado con éxito.")
