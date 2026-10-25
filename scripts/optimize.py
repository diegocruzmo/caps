from pathlib import Path
from PIL import Image, ImageOps
import json

root = Path(__file__).resolve().parents[1]
out = root / 'assets' / 'products'
out.mkdir(parents=True, exist_ok=True)
products, report = [], []
for folder in sorted(root.iterdir()):
    if not folder.is_dir() or not folder.name.isdigit():
        continue
    for i, source in enumerate(sorted(folder.glob('*.jpeg')), 1):
        # These groups reflect the supplied photos; no brand authenticity is implied.
        category = 'sombreros' if folder.name == '24000' else 'billeteras' if folder.name == '28000' else 'gorras'
        if folder.name == '24000' and i > 8:
            category = 'gorras'
        label = {'gorras':'Gorra', 'sombreros':'Sombrero', 'billeteras':'Billetera'}[category]
        slug = f'{category}-{folder.name}-{i:02}'
        target = out / f'{slug}.webp'
        with Image.open(source) as original:
            im = ImageOps.exif_transpose(original).convert('RGB')
            im.thumbnail((1000, 1200))
            im.save(target, 'WEBP', quality=80, method=6)
        products.append(dict(id=slug, name=f'{label} {folder.name}-{i:02}', price=int(folder.name), category=category, images=[f'assets/products/{slug}.webp'], description='Modelo de la fotografía. Confirma materiales, medidas y disponibilidad con nuestro equipo por WhatsApp.', available=True, featured=False, variants=['Modelo fotografiado']))
        report.append(dict(original=str(source.relative_to(root)), optimized=str(target.relative_to(root)), before=source.stat().st_size, after=target.stat().st_size))
(root/'js'/'data').mkdir(parents=True, exist_ok=True)
(root/'js'/'data'/'products.js').write_text('export const products = '+json.dumps(products,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
(root/'assets'/'image-manifest.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
before, after = sum(x['before'] for x in report), sum(x['after'] for x in report)
print(f'{len(products)} images; {before:,} -> {after:,} bytes; reduction {100*(1-after/before):.1f}%')
