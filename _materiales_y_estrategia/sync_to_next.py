import os
import re

target_dir = r"C:\Users\Rony\Downloads\Telegram Desktop\ciasard_next_app_source"

# 1. Update Navbar.tsx
navbar_path = os.path.join(target_dir, "src", "components", "Navbar.tsx")
if os.path.exists(navbar_path):
    with open(navbar_path, "r", encoding="utf-8", errors="ignore") as f:
        nav = f.read()

    # Remove the desktop Ver. 02 link
    nav = re.sub(r'<Link\s+href="/home2"[^>]*>.*?</Link>', '', nav, flags=re.DOTALL)
    # Write back clean Navbar
    with open(navbar_path, "w", encoding="utf-8") as f:
        f.write(nav)
    print("1. Navbar.tsx: Enlaces a /home2 eliminados correctamente.")

# 2. Update page.tsx with HTML5 native autoloop video
page_path = os.path.join(target_dir, "src", "app", "page.tsx")
if os.path.exists(page_path):
    with open(page_path, "r", encoding="utf-8", errors="ignore") as f:
        page_content = f.read()

    # Replace iframe with video
    iframe_pattern = r'<iframe\b[^>]*src="https://www\.youtube-nocookie\.com/embed/IdX8tokE_dE"[^>]*></iframe>'
    video_replacement = (
        '<video\n'
        '                src="/assets/videos/ciasard-intro.mp4"\n'
        '                autoPlay\n'
        '                loop\n'
        '                muted\n'
        '                playsInline\n'
        '                preload="auto"\n'
        '                poster="/assets/images/hero-dr.jpg"\n'
        '                className="absolute inset-0 w-full h-full object-cover"\n'
        '              />'
    )
    if re.search(iframe_pattern, page_content):
        page_content = re.sub(iframe_pattern, video_replacement, page_content)
        with open(page_path, "w", encoding="utf-8") as f:
            f.write(page_content)
        print("2. page.tsx: Video de YouTube reemplazado por video nativo con autoloop.")
    else:
        print("2. [AVISO] Patrón de iframe no encontrado en page.tsx.")

print("=== SINCRONIZACIÓN COMPLETADA CON ÉXITO ===")
