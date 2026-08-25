#!/usr/bin/env python3
"""
TUS Chunked Upload to Hostinger using standard library urllib
"""

import os
import urllib.request
import urllib.error
import base64
import time

ZIP_PATH = r"c:\Users\Rony\Documents\GitHub\CIASARD-entrega-completa-backup\sitio-web_npi_prod.zip"
TUS_URL = "https://srv1920-files.hstgr.io/rest/c6647dc0b8efed41/api/tus/public_html"
AUTH_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTg2ODg3OTc3NCIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc4NzI5MDQ5NiwiaWF0IjoxNzg3MjY4ODk2fQ.bbFXarv49wZqBphkNfyDWdWJjbccQ7Ekl5aAWsyxY_o"

def upload_zip():
    file_size = os.path.getsize(ZIP_PATH)
    filename = "app.zip"
    encoded_name = base64.b64encode(filename.encode("utf-8")).decode("ascii")

    print(f"Iniciando subida TUS de {filename} ({file_size / (1024*1024):.2f} MB)...")

    # POST create upload
    headers_post = {
        "Tus-Resumable": "1.0.0",
        "Upload-Length": str(file_size),
        "Upload-Metadata": f"filename {encoded_name}",
        "x-auth": AUTH_KEY
    }

    req = urllib.request.Request(TUS_URL, headers=headers_post, method="POST")
    try:
        with urllib.request.urlopen(req) as resp:
            upload_location = resp.headers.get("Location")
    except urllib.error.HTTPError as e:
        print(f"Error en POST TUS: {e.code} - {e.read().decode('utf-8')}")
        return False

    if not upload_location:
        print("No Location header received.")
        return False

    if not upload_location.startswith("http"):
        base_host = "https://srv1920-files.hstgr.io"
        upload_location = base_host + upload_location

    print(f"Ubicación de subida: {upload_location}")

    # PATCH chunks (8MB chunks)
    chunk_size = 8 * 1024 * 1024
    offset = 0

    with open(ZIP_PATH, "rb") as f:
        while offset < file_size:
            chunk = f.read(chunk_size)
            patch_headers = {
                "Tus-Resumable": "1.0.0",
                "Upload-Offset": str(offset),
                "Content-Type": "application/offset+octet-stream",
                "x-auth": AUTH_KEY
            }

            req_patch = urllib.request.Request(upload_location, data=chunk, headers=patch_headers, method="PATCH")
            try:
                with urllib.request.urlopen(req_patch) as patch_resp:
                    offset = int(patch_resp.headers.get("Upload-Offset", offset + len(chunk)))
                    pct = (offset / file_size) * 100
                    print(f"Progreso: {pct:.1f}% ({offset / (1024*1024):.1f} MB / {file_size / (1024*1024):.1f} MB)")
            except urllib.error.HTTPError as e:
                print(f"Error en PATCH a offset {offset}: {e.code} - {e.read().decode('utf-8')}")
                return False

    print("¡Subida TUS completada con éxito!")
    return True

if __name__ == "__main__":
    upload_zip()
