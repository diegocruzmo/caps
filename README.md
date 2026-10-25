# Distrito Caps

Tienda estática modular en HTML, CSS y JavaScript, sin dependencias de ejecución ni backend. Marca provisional. El WhatsApp y las redes están pendientes de configurar; el checkout bloquea la salida hasta tener un número válido.

## Ejecutar

Instala Node.js y ejecuta `npm start` en esta carpeta. Abre http://127.0.0.1:5173. No abras index.html con doble clic: los módulos requieren un servidor HTTP. Ejecuta `npm test` para comprobar catálogo, imágenes, carrito y resumen.

## Editar

- `js/config.js`: marca, WhatsApp (código de país y número, solo dígitos), moneda, redes y envíos. Si cambias la marca, actualiza también el encabezado, pie y metadatos de `index.html` y los textos de `js/views.js`.
- `js/data/products.js`: arreglo de 119 referencias. Los precios se tomaron provisionalmente de los nombres de las carpetas y se expresan en COP. Confírmalos antes de vender. Las fotos de conjuntos se incluyen como referencias y necesitan revisión para definir si representan un artículo o un lote.
- Cada foto es una referencia independiente; revisa duplicados y agrupa fotos o variantes si representan el mismo artículo. Los nombres son referencias neutrales y no certifican marcas ni materiales. Disponibilidad inicial de demostración: confirmar con el negocio.
- `js/views.js`: contenido de las vistas; las opiniones están identificadas como ficticias. Completa políticas de cambios y envíos antes de publicar.
- `css/styles.css`: colores, tipografía y diseño responsive.
- `js/cart.js`: bolsa y persistencia en localStorage (solo artículos, sin datos personales).
- `js/checkout.js`: validación y mensaje de WhatsApp. Abrir WhatsApp no envía ni confirma el pedido; la bolsa permanece intacta.
- `js/app.js`: navegación por hash, filtros, búsqueda, orden y detalle accesible con dialog nativo.

## Imágenes

Se conservaron intactas las carpetas originales. Las copias renombradas WebP están en `assets/products`. `assets/image-manifest.json` relaciona cada original con su copia e incluye pesos para auditoría. Se redujeron a un máximo de 1000 × 1200, respetando proporciones y orientación EXIF, calidad 80. Peso: 13.68 MB → 9.20 MB (32.7% menos).

Para regenerar: instala Pillow y ejecuta `python scripts/optimize.py`. La clasificación y los nombres revisados se guardan en `assets/image-metadata.json`, asociados a los originales. El optimizador utiliza esos datos y conserva precios, descripciones y demás campos de las referencias existentes; no deduce categorías de las carpetas de precios. Para cambiar un nombre o categoría y mantenerlo al regenerar, actualiza también ese archivo. Los identificadores internos se mantienen estables para conservar compatibilidad con el carrito. Para añadir productos manualmente basta copiar la imagen WebP y agregar un objeto al arreglo, usando un identificador único y variantes válidas. Las categorías actuales se configuran en `js/views.js` y `js/app.js`.

## Vistas

Inicio `#/`, colección `#/catalogo`, categorías `#/categorias`, información `#/nosotros`, opiniones `#/opiniones`, redes `#/contacto`, preguntas `#/ayuda`, bolsa `#/carrito` y checkout `#/checkout`. Cada vista reemplaza el contenido central; la portada solo presenta el hero y una selección breve.

## Publicar

Sube `index.html`, `css/`, `js/` y `assets/` a cualquier alojamiento estático con HTTPS. No necesitas subir las carpetas originales, scripts o tests. La navegación hash no requiere reglas de redirección. Completa datos reales y comprueba un pedido desde móvil antes de compartir el sitio. Sin backend, el precio y el mensaje son editables por el visitante y deben verificarse al confirmar el pedido.

## Revisión visual del catálogo

Las 119 fotos fueron revisadas: 83 referencias de gorras (incluidas 6 fotos de conjuntos), 8 sombreros y 28 billeteras. La carpeta original `28000` contiene gorras y `30000` billeteras. Los nombres WebP describen color y detalles visibles; el sufijo numérico evita colisiones. Los originales permanecen intactos y el manifiesto conserva la correspondencia. Las seis fotos de conjuntos no identifican una variante única: el cliente debe confirmar el modelo con la tienda.
