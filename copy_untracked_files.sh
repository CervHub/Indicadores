#!/bin/bash

# Obtener la fecha y hora actual en el formato deseado
current_date=$(date +"%Y-%m-%d_%H-%M-%S")

# Crear la carpeta de destino con el nombre dinámico dentro de la carpeta principal "Production"
destination_folder="Production/SouthernToquepalaGestionSST_$current_date"
mkdir -p "$destination_folder"

# Obtener la lista de archivos modificados y agregados desde el 8 de abril de 2025 hasta la fecha actual
echo "Buscando archivos modificados desde el 8 de abril de 2025 hasta la fecha actual..."
files_to_copy=$(git log --name-only --since="2025-04-17" --pretty=format: | sort | uniq | grep -v '^resources/js/')

# Verificar si hay archivos para copiar
if [ -z "$files_to_copy" ]; then
    echo "No se encontraron archivos modificados o agregados desde el 8 de abril de 2025."
else
    echo "Archivos encontrados:"
    echo "$files_to_copy"

    # Copiar los archivos encontrados manteniendo la estructura de directorios
    echo "$files_to_copy" | xargs -I % cp --parents % "$destination_folder/"
fi

# Copiar siempre el contenido de la carpeta public/build, evitando recursividad
echo "Copiando la carpeta public/build..."
mkdir -p "$destination_folder/public"
cp -r public/build "$destination_folder/public/"

# Mostrar el estado de los archivos
echo "Estado del repositorio:"
git status

echo "Proceso completado. Archivos copiados a: $destination_folder"
