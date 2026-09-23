import os, re
from PIL import Image

html = open('index.html', encoding='utf-8').read()
imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', html)
print('Found image paths in HTML:', imgs)

all_ok = True
for src in imgs:
    clean_path = src.lstrip('./').replace('/', os.sep)
    if not os.path.exists(clean_path):
        print(f'ERROR: File not found for src="{src}" -> looking at {clean_path}')
        all_ok = False
    else:
        parent = os.path.dirname(clean_path) or '.'
        base = os.path.basename(clean_path)
        actual_files = os.listdir(parent)
        if base not in actual_files:
            print(f'CASE MISMATCH: requested "{base}" but files are {actual_files}')
            all_ok = False
        else:
            img = Image.open(clean_path)
            print(f'OK: "{src}" exists ({img.format}, size={img.size}, mode={img.mode})')

if all_ok:
    print('>>> ALL IMAGES VERIFIED PERFECTLY! <<<')
