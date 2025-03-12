<?php

namespace App\Services;

class UtilService
{
    // Guarda un archivo en la carpeta especificada dentro de 'public'
    public function saveFile($file, $folder)
    {
        $publicPath = public_path($folder);

        // Verifica si la carpeta existe, si no, la crea
        if (!file_exists($publicPath)) {
            mkdir($publicPath, 0777, true);
        }

        // Genera un nombre de archivo único sin usar el nombre original
        $uniqueFileName = uniqid() . '.' . $file->getClientOriginalExtension();
        $filePath = $publicPath . '/' . $uniqueFileName;
        file_put_contents($filePath, file_get_contents($file->getRealPath()));

        // Retorna la ruta relativa
        return $folder . '/' . $uniqueFileName;
    }

    // Elimina un archivo de la carpeta especificada dentro de 'public'
    public function deleteFile($filePath)
    {
        $publicPath = public_path($filePath);
        return unlink($publicPath);
    }
}
