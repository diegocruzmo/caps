from pathlib import Path
from PIL import Image, ImageOps
import json

root = Path(__file__).resolve().parents[1]
out = root / 'assets' / 'products'
out.mkdir(parents=True, exist_ok=True)
products, report = [], []
metadata = {x['original'].replace('\\', '/'): x for x in json.loads((root/'assets'/'image-metadata.json').read_text(encoding='utf-8'))}
catalog_path = root/'js'/'data'/'products.js'
existing = {p['id']: p for p in json.loads(catalog_path.read_text(encoding='utf-8').split('=', 1)[1].strip().rstrip(';'))} if catalog_path.exists() else {}
for folder in sorted(root.iterdir()):
    if not folder.is_dir() or not folder.name.isdigit():
        continue
    for i, source in enumerate(sorted(folder.glob('*.jpeg')), 1):
        # Classify from reviewed metadata, never from a price folder.
        meta = metadata.get(source.relative_to(root).as_posix())
        if not meta:
            raise ValueError(f'Agrega nombre y categoría a assets/image-metadata.json: {source.name}')
        category, slug = meta['category'], meta['id']
        target = out / meta['filename']
        with Image.open(source) as original:
            im = ImageOps.exif_transpose(original).convert('RGB')
            im.thumbnail((1000, 1200))
            im.save(target, 'WEBP', quality=80, method=6)
        product = existing.get(slug, dict(id=slug, price=int(folder.name), description='Modelo de la fotografía. Confirma materiales, medidas y disponibilidad con nuestro equipo por WhatsApp.', available=True, featured=False, variants=['Modelo fotografiado']))
        product.update(name=meta['name'], category=category, images=[target.relative_to(root).as_posix()])
        products.append(product)
        report.append(dict(original=str(source.relative_to(root)), optimized=str(target.relative_to(root)), before=source.stat().st_size, after=target.stat().st_size))
(root/'js'/'data').mkdir(parents=True, exist_ok=True)
(root/'js'/'data'/'products.js').write_text('export const products = '+json.dumps(products,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
(root/'assets'/'image-manifest.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
before, after = sum(x['before'] for x in report), sum(x['after'] for x in report)
print(f'{len(products)} images; {before:,} -> {after:,} bytes; reduction {100*(1-after/before):.1f}%')
