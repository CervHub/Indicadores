#!/bin/bash

# Obtener la fecha y hora actual en el formato deseado
current_date=$(date +"%Y-%m-%d_%H-%M-%S")

# Crear la carpeta de destino con el nombre dinámico dentro de la carpeta principal "Production"
destination_folder="Production/SouthernToquepalaGestionSST_$current_date"
mkdir -p "$destination_folder"

# Encontrar y copiar los archivos modificados y agregados desde el 8 de abril de 2025 hasta la fecha actual
# Manteniendo la estructura de directorios, ignorando "resources/js"
git fetch origin
git diff --name-only --diff-filter=MA "2025-04-08" HEAD | grep -v '^resources/js/' | xargs -I % cp --parents % "$destination_folder/"

# Copiar siempre el contenido de la carpeta public/build
cp -r public/build "$destination_folder/public/build"

# Mostrar el estado de los archivos
git status

# Comenzando a realizar cambios en la carpeta de destino 08/04/2025
