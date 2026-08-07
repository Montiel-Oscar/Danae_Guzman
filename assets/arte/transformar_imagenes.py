import os
from PIL import Image

# Ruta a la carpeta de arte dentro de tu proyecto
ruta_origen = 'assets/arte'

# Iterar sobre todos los archivos de la carpeta
for archivo in os.listdir(ruta_origen):
    if archivo.lower().endswith(('.jpeg', '.jpg', '.png')):
        ruta_completa = os.path.join(ruta_origen, archivo)
        
        # Abrir la imagen
        img = Image.open(ruta_completa)
        
        # Generar el nuevo nombre de archivo con extensión .webp
        nombre_sin_ext = os.path.splitext(archivo)[0]
        nueva_ruta = os.path.join(ruta_origen, f"{nombre_sin_ext}.webp")
        
        # Guardar la imagen en formato WebP con buena compresión (quality=85)
        img.save(nueva_ruta, 'webp', optimize=True, quality=85)
        print(f"Transformada con éxito: {archivo} -> {nombre_sin_ext}.webp")

print("¡Todas las imágenes han sido convertidas!")