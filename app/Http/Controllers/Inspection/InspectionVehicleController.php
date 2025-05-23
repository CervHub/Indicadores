<?php

namespace App\Http\Controllers\Inspection;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Module;
use App\Models\Vehicle;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\User;
use PDF;

class InspectionVehicleController extends Controller
{
    protected $userId;
    protected $companyId;

    public function __construct()
    {
        $this->userId = auth()->id();
        $this->companyId = auth()->user() ? auth()->user()->company_id : null;
    }

    public function index()
    {
        // Consulta base
        $query = "
            SELECT
                m.id,
                m.fecha_evento,
                m.fecha_reporte,
                m.estado,
                u.nombres AS nombre_usuario,
                c.nombre AS nombre_empresa,
                CASE
                    WHEN m.tipo_inspeccion = 'pre-use' THEN 'Inspección Diaria Pre-Uso'
                    WHEN m.tipo_inspeccion = 'trimestral' THEN 'Inspección Trimestral'
                    WHEN m.tipo_inspeccion = 'anual' THEN 'Inspección Anual'
                    WHEN m.tipo_inspeccion = 'semestral' THEN 'Inspección Semestral'
                    ELSE 'Tipo no definido'
                END AS tipo_inspeccion_descripcion
            FROM modules AS m
            INNER JOIN users AS u ON u.id = m.user_id
            INNER JOIN companies AS c ON c.id = m.company_id
            WHERE m.tipo_reporte = 'vehicular'
        ";

        $params = [];
        if ($this->companyId != 1) {
            $query .= " AND m.company_id = ?";
            $params[] = $this->companyId;
        }

        $inspectionVehicles = collect(DB::select($query, $params));

        return Inertia::render('inspection/index', [
            'inspectionVehicles' => $inspectionVehicles,
        ]);
    }

    public function detalle($reportability_id)
    {
        $isSecurityEngineer = auth()->user()->isSecurityEngineer();
        $user = User::find($this->userId);
        $reportability = Module::find($reportability_id);
        $companyNombre = Company::find($reportability->company_id)->nombre ?? 'Empresa no encontrada';

        if ($isSecurityEngineer && $this->companyId === '1') {
            $reportability->vehicle_status = 'Revisado';
            $reportability->estado = 'Revisado';
            $reportability->save();
        }

        return Inertia::render('inspection/detalle', [
            'reportability' => $reportability,
            'reportability_id' => $reportability_id,
            'isSecurityEngineer' => $user->isSecurityEngineer(),
            'companyNombre' => $companyNombre,
        ]);
    }

    public function download($reportability_id)
    {
        // Verifica autenticación
        if (!auth()->check()) {
            abort(403, 'No autenticado');
        }

        $module = Module::find($reportability_id);

        // Si no existe el reporte
        if (!$module) {
            abort(403, 'Reporte no encontrado');
        }

        // Solo valida la empresa si no es admin (company_id != 1)
        if ($this->companyId != 1 && $module->company_id != $this->companyId) {
            abort(403, 'No autorizado para descargar este reporte');
        }

        // Procesar toda la data necesaria
        $data = $this->processModuleData($module);
        // dd($data);
        // Generar y retornar el PDF
        return $this->streamInspectionPdf($data);
    }

    /**
     * Procesa el módulo y retorna toda la data necesaria para el PDF.
     */
    protected function processModuleData(Module $module)
    {
        // Decodificar details
        $details = [];
        $causas = [];
        $vehicle = null;

        // Obtener el nombre del usuario que hizo el módulo
        $usuario_nombre = null;
        if ($module->user_id) {
            $usuario_nombre = \DB::table('users')->where('id', $module->user_id)->value('nombres');
        }

        // Obtener el nombre de la empresa del módulo
        $empresa_nombre = null;
        if ($module->company_id) {
            $empresa_nombre = \DB::table('companies')->where('id', $module->company_id)->value('nombre');
        }

        if (!empty($module->details)) {
            $decoded = json_decode($module->details, true) ?: [];

            // Procesar causas
            if (isset($decoded['causas'])) {
                $causasRaw = json_decode($decoded['causas'], true);
                if (is_array($causasRaw)) {
                    $ids = array_column($causasRaw, 'id');
                    $categories = \DB::table('category_companies as cc')
                        ->leftJoin('groups as cg', 'cc.group_id', '=', 'cg.id')
                        ->whereIn('cc.id', $ids)
                        ->get([
                            'cc.id',
                            'cc.nombre as nombre_categoria',
                            'cc.group_id',
                            'cg.name as nombre_grupo'
                        ])
                        ->keyBy('id');

                    foreach ($causasRaw as $causa) {
                        $cat = $categories[$causa['id']] ?? null;
                        $extraForm = isset($causa['extraForm']) && is_array($causa['extraForm']) && !empty($causa['extraForm'])
                            ? array_map(function ($item) {
                                return [
                                    'id' => $item['id'] ?? null,
                                    'value' => $item['value'] ?? null,
                                    'name' => $item['name'] ?? null,
                                ];
                            }, $causa['extraForm'])
                            : null;

                        $causas[] = [
                            'nombre_categoria' => $cat->nombre_categoria ?? null,
                            'state' => $causa['state'] ?? null,
                            'observation' => $causa['observation'] ?? null,
                            'nombre_grupo' => $cat->nombre_grupo ?? null,
                            'extraForm' => $extraForm,
                        ];
                    }
                }
                unset($decoded['causas']);
            }


            // Buscar el vehículo por plate si existe
            if (isset($decoded['plate'])) {
                $vehicle = Vehicle::where('license_plate', $decoded['plate'])->first();
            }

            // El resto de detalles (sin causas)
            $details = $decoded;
        }

        // Imágenes del módulo
        $images = [];
        if (!empty($module->images)) {
            $images = is_array($module->images)
                ? $module->images
                : (json_decode($module->images, true) ?: []);
        }

        // Tipo de inspección legible
        $tipo_inspeccion_descripcion = match ($module->tipo_inspeccion) {
            'pre-use'    => 'Inspección Diaria Pre-Uso',
            'trimestral' => 'Inspección Trimestral',
            'anual'      => 'Inspección Anual',
            'semestral'  => 'Inspección Semestral',
            default      => 'Tipo no definido',
        };

        return [
            'tipo_inspeccion' => $module->tipo_inspeccion,
            'date' => $module->created_at->format('d/m/Y H:i:s'),
            'causas' => $causas,
            'vehicle' => $vehicle,
            'images' => $images,
            'details' => $details,
            'tipo_inspeccion_descripcion' => $tipo_inspeccion_descripcion,
            'usuario_nombre' => $usuario_nombre,
            'empresa_nombre' => $empresa_nombre,
        ];
    }

    /**
     * Genera y retorna un PDF en stream.
     */
    protected function streamInspectionPdf($data)
    {
        if ($data['tipo_inspeccion'] !== 'pre-use') {
            $view = 'reports.vehicular';
        } else {
            $view = 'reports.pre-use'; // Cambiar según el tipo de inspección
        }

        $pdf = PDF::loadView($view, $data)->setPaper('a4');

        $filename = 'Inspeccion_' . ($data['module']->id ?? 'reporte') . '.pdf';
        return $pdf->stream($filename);
    }
}
