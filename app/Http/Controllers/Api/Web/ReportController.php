<?php

namespace App\Http\Controllers\Api\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Module;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ReportController extends Controller
{
    /**
     * Guarda el reporte según el tipo especificado
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function saveReport(Request $request)
    {
        Log::info('Guardando reporte', [
            'request' => $request->all(),
        ]);
        try {
            if ($request->input('type_report') === 'vehicular') {
                $inspectionType = $request->input('type_inspection');
                if (in_array($inspectionType, ['Trimestral', 'Semestral', 'Anual'])) {
                    $this->createVehicleInspection($request);
                    return response()->json(['status' => 'success', 'message' => "Reporte $inspectionType guardado correctamente"], 200);
                }

                $this->createVehiclePreUse($request);
                return response()->json(['status' => 'success', 'message' => 'Reporte de preuso guardado correctamente'], 200);
            }

            return response()->json(['status' => 'error', 'message' => 'Tipo de reporte inválido'], 400);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Ocurrió un error: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Guarda imágenes base64 en disco y retorna las rutas relativas.
     *
     * @param array|string|null $images
     * @param int $companyId
     * @param int $userId
     * @param string $typeReport
     * @param string $prefix
     * @return array
     */
    private function saveBase64Images($images, $companyId, $userId, $typeReport, $prefix = 'img')
    {
        if (empty($images)) {
            return [];
        }

        $basePath = "photos/modules/{$companyId}/{$userId}/{$typeReport}";
        $savedPaths = [];

        if (!is_array($images)) {
            $images = [$images];
        }

        foreach ($images as $idx => $img) {
            if (preg_match('/^data:image\/(\w+);base64,/', $img, $type)) {
                $img = substr($img, strpos($img, ',') + 1);
                $img = base64_decode($img);
                $extension = strtolower($type[1]) === 'jpeg' ? 'jpg' : strtolower($type[1]);
            } else {
                continue; // skip invalid base64
            }
            $filename = $prefix . '_' . uniqid() . '_' . $idx . '.' . $extension;
            $relativePath = $basePath . '/' . $filename;
            Storage::disk('public')->put($relativePath, $img);
            $savedPaths[] = 'storage/' . $relativePath;
        }

        return $savedPaths;
    }

    /**
     * Crea un reporte de preuso vehicular
     *
     * @param Request $request
     * @throws \Exception
     */
    private function createVehiclePreUse(Request $request)
    {
        try {
            $data = $request->only([
                'userId',
                'companyId',
                'plate',
                'vehicleCode',
                'department',
                'shift',
                'driver',
                'mileage',
                'recordNumber',
                'images',
                'signature',
                'observation',
                'causas',
                'type_report',
                'type_inspection',
                'status',
                'area'
            ]);

            // Usar la fecha y hora actual para el reporte
            $fechaReporte = Carbon::now()->format('Y-m-d H:i:s');
            $data['companyId'] = $data['companyId'] ?? 1;

            // Guardar imágenes y firma en disco
            $imagesPaths = $this->saveBase64Images($data['images'] ?? [], $data['companyId'], $data['userId'], $data['type_report'] ?? 'unknown', 'img');
            $signaturePath = $this->saveBase64Images($data['signature'] ?? null, $data['companyId'], $data['userId'], $data['type_report'] ?? 'unknown', 'signature');

            $details = collect($data)->only([
                'plate',
                'vehicleCode',
                'department',
                'shift',
                'driver',
                'mileage',
                'recordNumber',
                'observation',
                'causas',
                'status'
            ])->toArray();

            $details['causas'] = is_array($details['causas']) ? json_encode($details['causas']) : $details['causas'];

            Module::create([
                'fecha_reporte' => $fechaReporte,
                'fecha_evento' => $fechaReporte,
                'firma' => is_array($signaturePath) ? $signaturePath[0] ?? null : $signaturePath,
                'images' => json_encode($imagesPaths),
                'tipo_reporte' => $data['type_report'] ?? 'unknown',
                'user_id' => $data['userId'],
                'company_id' => $data['companyId'],
                'details' => json_encode($details),
                'device' => 'unknown',
                'version' => '2.0.0',
                'tipo_inspeccion' => $data['type_inspection'],
                'estado' => 'Generado',
                'vehicle_plate' => $data['plate'] ?? null,
                'vehicle_status' => $data['status'] ?? 'unknown',
                'mileage' => $data['mileage'] ?? null,
                'area' => $data['area'] ?? null,
            ]);
        } catch (\Exception $e) {
            throw new \Exception('Error al crear el reporte de preuso vehicular: ' . $e->getMessage());
        }
    }

    /**
     * Crea un reporte de inspección vehicular (Trimestral, Semestral, Anual)
     *
     * @param Request $request
     * @throws \Exception
     */
    private function createVehicleInspection(Request $request)
    {
        try {
            $data = $request->only([
                'userId',
                'companyId',
                'plate',
                'type',
                'brand',
                'model',
                'engineNumber',
                'year',
                'company',
                'driver',
                'licenseNumber',
                'generalState',
                'autoGeneratedCode',
                'images',
                'signature',
                'result',
                'inspectionDate',
                'type_report',
                'type_inspection',
                'causas',
                'status',
                'mileage',
                'area'
            ]);

            $data['inspectionDate'] =  Carbon::now()->format('Y-m-d H:i:s');
            $data['companyId'] = $data['companyId'] ?? 1;

            // Guardar imágenes y firma en disco
            $imagesPaths = $this->saveBase64Images($data['images'] ?? [], $data['companyId'], $data['userId'], $data['type_report'] ?? 'unknown', 'img');
            $signaturePath = $this->saveBase64Images($data['signature'] ?? null, $data['companyId'], $data['userId'], $data['type_report'] ?? 'unknown', 'signature');

            $details = collect($data)->only([
                'plate',
                'type',
                'brand',
                'model',
                'engineNumber',
                'year',
                'company',
                'driver',
                'licenseNumber',
                'generalState',
                'autoGeneratedCode',
                'result',
                'causas',
                'status',
            ])->toArray();

            Module::create([
                'fecha_reporte' => $data['inspectionDate'],
                'fecha_evento' => $data['inspectionDate'],
                'firma' => is_array($signaturePath) ? $signaturePath[0] ?? null : $signaturePath,
                'images' => json_encode($imagesPaths),
                'tipo_reporte' => $data['type_report'] ?? 'unknown',
                'user_id' => $data['userId'],
                'company_id' => $data['companyId'],
                'details' => json_encode($details),
                'device' => 'unknown',
                'version' => '2.0.0',
                'tipo_inspeccion' => $data['type_inspection'],
                'estado' => 'Generado',
                'vehicle_plate' => $data['plate'] ?? null,
                'vehicle_status' => $data['status'] ?? 'unknown',
                'mileage' => $data['mileage'] ?? null,
                'area' => $data['area'] ?? null,
            ]);
        } catch (\Exception $e) {
            throw new \Exception('Error al crear el reporte de inspección vehicular: ' . $e->getMessage());
        }
    }
}

/*
No se requiere cambio de código, solo explicación:

Diferencias entre guardar archivos en "public" y "private" del storage en Laravel:

1. public (storage/app/public):
   - Los archivos son accesibles directamente desde el navegador usando una URL como /storage/archivo.jpg.
   - Necesitas ejecutar "php artisan storage:link" para crear el enlace simbólico.
   - Útil para archivos que pueden ser vistos por cualquier usuario sin restricción.
   - Ejemplo de acceso: asset('storage/archivo.jpg')

2. private (storage/app/private o cualquier carpeta fuera de public):
   - Los archivos NO son accesibles directamente desde el navegador.
   - Solo tu aplicación puede acceder a ellos usando Storage::get() o Storage::download().
   - Debes crear un controlador para servir estos archivos bajo lógica de permisos/autenticación.
   - Útil para archivos sensibles o que solo ciertos usuarios deben poder ver o descargar.

Resumen:
- Usa "public" para archivos públicos.
- Usa "private" para archivos protegidos y sirve los archivos solo bajo control de tu aplicación.
*/
