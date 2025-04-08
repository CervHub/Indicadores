#!/bin/bash

# Obtener la fecha y hora actual en el formato deseado
current_date=$(date +"%Y-%m-%d_%H-%M-%S")

# Crear la carpeta de destino con el nombre dinámico dentro de la carpeta principal "Production"
destination_folder="Production/SouthernCuajoneGestionSST_$current_date"
mkdir -p "$destination_folder"

# Encontrar y copiar los archivos modificados y agregados en el remoto en los últimos 15 días
# Manteniendo la estructura de directorios, ignorando "resources/js"
git fetch origin
git diff --name-only --diff-filter=MA "@{1 days ago}" HEAD | grep -v '^resources/js/' | xargs -I % cp --parents % "$destination_folder/"

# Mostrar el estado de los archivos
git status

# Comenzando a realizar cambios en la carpeta de destino 08/04/2025
