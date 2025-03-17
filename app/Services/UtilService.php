<?php

namespace App\Services;

use ZipArchive;

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

    // Comprime archivos en un archivo ZIP
    public function compressFiles(array $filePaths)
    {
        $zipFilePath = storage_path('app/public/consolidated_files.zip');
        $zip = new ZipArchive;

        if ($zip->open($zipFilePath, ZipArchive::CREATE | ZipArchive::OVERWRITE) === TRUE) {
            foreach ($filePaths as $file) {
                $zip->addFile(public_path($file), basename($file));
            }
            $zip->close();
        } else {
            throw new \Exception('No se pudo crear el archivo ZIP.');
        }

        return $zipFilePath;
    }
}
