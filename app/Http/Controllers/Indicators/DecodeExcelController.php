<?php

namespace App\Http\Controllers\Indicators;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Imports\DecodeExcelImport;
use App\Exports\DecodeExcelExport;
use Illuminate\Support\Facades\Log;

class DecodeExcelController extends Controller
{
    public function index()
    {
        return Inertia::render('decodeExcel/index');
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx',
        ]);

        try {
            $file = $request->file('file');

            // Procesar el archivo con DecodeExcelImport
            $data = (new DecodeExcelImport($file->getRealPath()))->process();
            // Obtener la fecha de hoy en formato YYYY-MM-DD
            $today = now()->format('Y-m-d_H-i-s');

            // Ruta base para guardar los archivos en la carpeta public
            $basePath = public_path("exportExcel/{$today}");

            // Iterar sobre los tipos (titular, contrata, conexa)
            foreach ($data as $tipo => $empresas) {
                foreach ($empresas as $nombreEmpresa => $empresaData) {
                    // Crear la ruta específica para el tipo
                    $folderPath = "{$basePath}/{$tipo}";

                    // Asegurarse de que la carpeta exista
                    if (!file_exists($folderPath)) {
                        mkdir($folderPath, 0777, true);
                    }

                    // Validar que la empresa tenga datos en 'PLANTILLA MINEM 1'
                    if (!isset($empresaData['PLANTILLA MINEM 1']) || empty($empresaData['PLANTILLA MINEM 1'])) {
                        Log::warning("La empresa '{$nombreEmpresa}' no tiene datos válidos en 'PLANTILLA MINEM 1'.");
                        continue;
                    }

                    // Obtener el RUC del primer ítem de la empresa
                    $ruc = $empresaData['PLANTILLA MINEM 1'][0][0] ?? 'sin_ruc';

                    // Sanitizar el nombre de la empresa y el RUC para evitar caracteres no válidos
                    $sanitizedNombreEmpresa = preg_replace('/[^A-Za-z0-9 _-]/', '', $nombreEmpresa);
                    $sanitizedRuc = preg_replace('/[^A-Za-z0-9]/', '', $ruc);

                    // Generar un nombre único para el archivo
                    $fileName = "{$sanitizedNombreEmpresa}_{$sanitizedRuc}_{$tipo}.xlsx";

                    // Ruta completa del archivo
                    $filePath = "{$folderPath}/{$fileName}";

                    // Registrar el archivo que se va a generar
                    Log::info("Generando archivo: {$filePath}");

                    try {
                        // Exportar el archivo
                        $exporter = new DecodeExcelExport($empresaData, $tipo);
                        $exporter->export($filePath);
                    } catch (\Exception $e) {
                        Log::error("Error al generar el archivo '{$filePath}': " . $e->getMessage());
                    }
                }
            }

            return redirect()->back()->with('success', 'Archivos generados con éxito.');
        } catch (\Exception $e) {
            // Manejar errores y redirigir con un mensaje de error
            Log::error("Error al procesar el archivo: " . $e->getMessage());
            return redirect()->back()->with('error', 'Ocurrió un error al procesar el archivo: ' . $e->getMessage());
        }
    }
}
