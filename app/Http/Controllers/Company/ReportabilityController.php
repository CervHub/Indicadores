<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Module;
use App\Models\User;
use App\Models\SecurityEngineer;
use PDF;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Monolog\Handler\IFTTTHandler;
use Symfony\Component\HttpKernel\Exception\AbortException;
use App\Exports\ModulesExport;
use Maatwebsite\Excel\Facades\Excel;

class ReportabilityController extends Controller
{

    private function genDataReport($start_date, $end_date)
    {
        $query = "
        SELECT
            m.id AS ID,
            COALESCE(e.nombre, '-') AS GERENCIA,
            CASE
                WHEN m.tipo_reporte = 'actos' THEN 'Reporte de actos subestándar'
                WHEN m.tipo_reporte = 'inspeccion' THEN 'Reporte de inspección'
                WHEN m.tipo_reporte = 'incidentes' THEN 'Reporte de incidentes'
                WHEN m.tipo_reporte = 'condiciones' THEN 'Reporte de condiciones subestándar'
                WHEN m.tipo_reporte = 'vehicular' THEN CONCAT('Inspección Vehicular - ', m.tipo_inspeccion)
                ELSE m.tipo_reporte
            END AS TIPO_REPORTE,
            m.fecha_evento AS FECHA_EVENTO,
            CONCAT(u.nombres, ' ', u.apellidos) AS GENERADO_POR,
            COALESCE(c.nombre, '-') AS EMPRESA_GENERADOR,
            COALESCE(cr.nombre, '-') AS EMPRESA_REPORTADA,
            COALESCE(m.lugar, '-') AS LUGAR,
            COALESCE(m.descripcion, '-') AS DESCRIPCION_EVENTO,
            COALESCE(m.gravedad, '-') AS NIVEL_RIESGO,
            COALESCE(m.correctiva, '-') AS ACCION_CORRECTIVA,
            COALESCE(cc.nombre, '-') AS CAUSAS,
            m.user_report_id,
            COALESCE(CONCAT(ur.nombres, ' ', ur.apellidos), '-') AS ENCARGADO_CIERRE
        FROM
            modules AS m
        INNER JOIN
            users AS u ON u.id = m.user_id
        LEFT JOIN
            users AS ur ON ur.id = m.user_report_id
        LEFT JOIN
            companies AS c ON c.id = m.company_id
        LEFT JOIN
            companies AS cr ON cr.id = m.company_report_id
        LEFT JOIN
            category_companies AS cc ON cc.id = m.category_company_id
        LEFT JOIN
            entities AS e ON e.id =
                CASE
                    WHEN CHARINDEX('\"gerencia\":', m.levels) > 0 THEN
                        CAST(
                            LTRIM(RTRIM(
                                SUBSTRING(
                                    m.levels,
                                    CHARINDEX('\"gerencia\":', m.levels) + LEN('\"gerencia\":'),
                                    CASE
                                        WHEN CHARINDEX(',', m.levels + ',', CHARINDEX('\"gerencia\":', m.levels) + LEN('\"gerencia\":')) > 0 THEN
                                            CHARINDEX(',', m.levels + ',', CHARINDEX('\"gerencia\":', m.levels) + LEN('\"gerencia\":')) - (CHARINDEX('\"gerencia\":', m.levels) + LEN('\"gerencia\":'))
                                        ELSE
                                            LEN(m.levels) - (CHARINDEX('\"gerencia\":', m.levels) + LEN('\"gerencia\":'))
                                    END
                                )
                            )) AS INT
                        )
                    ELSE
                        NULL
                END
        WHERE
            m.fecha_evento BETWEEN ? AND ?
        ORDER BY
            m.fecha_evento DESC
        ";

        $reportabilities = DB::select($query, [$start_date, $end_date]);
        return $reportabilities;
    }
    public function downloadRange($start_date, $end_date)
    {
        $data = $this->genDataReport($start_date, $end_date);

        $uniqueId = uniqid();
        $fileName = "Reporte_General_{$start_date}_{$end_date}_{$uniqueId}.xlsx";

        return Excel::download(new ModulesExport($data), $fileName);
    }

    public function index(Request $request)
    {
        $user = auth()->user() ?? null;
        $companyId = $user->company_id ?? null;
        // Obtiene el company_id de la solicitud
        $companyReportId = $companyId;

        $isSecurityEngineer = false;
        if ($companyId === '1') {
            $isSecurityEngineer = $user ? $user->isSecurityEngineer() : false;
            $companyId = null;
        }

        // Define la consulta base
        $query = "
        SELECT
            m.id,
            CONCAT(u.nombres, ' ', u.apellidos) AS generado_por,
            m.fecha_evento,
            CASE
            WHEN m.estado IN ('Generado', 'Abierto') THEN 'Abierto'
            WHEN m.estado IN ('Visualizado', 'Revisado') THEN 'Revisado'
            WHEN m.estado IN ('Finalizado', 'Cerrado') THEN 'Cerrado'
            ELSE m.estado
            END AS estado,
            m.report_closed_at,
            m.deleted_at,
            CASE
            WHEN m.tipo_reporte = 'actos' THEN 'Reporte de actos subestándar'
            WHEN m.tipo_reporte = 'inspeccion' THEN 'Reporte de inspección'
            WHEN m.tipo_reporte = 'incidentes' THEN 'Reporte de incidentes'
            WHEN m.tipo_reporte = 'condiciones' THEN 'Reporte de condiciones subestándar'
            WHEN m.tipo_reporte = 'vehicular' THEN CONCAT('Inspección Vehicular - ', m.tipo_inspeccion)
            ELSE m.tipo_reporte
            END AS tipo_reporte,
            COALESCE(e.nombre, 'No existe') AS gerencia_name,
            c.id AS company_id,
            c.nombre AS company_name,
            m.company_report_id,
            cr.nombre AS company_report_name,
            m.user_report_id,
            COALESCE(CONCAT(ur.nombres, ' ', ur.apellidos), 'No asignado') AS encargado_cierre
        FROM
            modules AS m
        INNER JOIN
            users AS u ON u.id = m.user_id
        LEFT JOIN
            users AS ur ON ur.id = m.user_report_id
        LEFT JOIN
            entities AS e ON e.id =
            CASE
                WHEN CHARINDEX('\"gerencia\":', m.levels) > 0 THEN
                CAST(
                    LTRIM(RTRIM(
                    SUBSTRING(
                        m.levels,
                        CHARINDEX('\"gerencia\":', m.levels) + LEN('\"gerencia\":'),
                        CASE
                        WHEN CHARINDEX(',', m.levels + ',', CHARINDEX('\"gerencia\":', m.levels) + LEN('\"gerencia\":')) > 0 THEN
                            CHARINDEX(',', m.levels + ',', CHARINDEX('\"gerencia\":', m.levels) + LEN('\"gerencia\":')) - (CHARINDEX('\"gerencia\":', m.levels) + LEN('\"gerencia\":'))
                        ELSE
                            LEN(m.levels) - (CHARINDEX('\"gerencia\":', m.levels) + LEN('\"gerencia\":'))
                        END
                    )
                    )) AS INT
                )
                ELSE
                NULL
            END
        INNER JOIN
            companies AS c ON c.id = m.company_id
        INNER JOIN
            companies AS cr ON cr.id = m.company_report_id
        ";

        // Agrega condiciones según el valor de company_id
        if (!empty($companyId)) {
            $query .= " WHERE c.id = ? OR m.company_report_id = ? ";
            $bindings = [$companyId, $companyReportId];
        } else {
            $bindings = [];
        }

        $query .= " ORDER BY m.fecha_evento DESC;";

        // Ejecuta la consulta con los parámetros
        $reportabilities = DB::select($query, $bindings);
        // Retorna la vista con los datos
        return Inertia::render('reportability/index', [
            'reportabilities' => $reportabilities,
            'isSecurityEngineer' => $isSecurityEngineer,
        ]);
    }


    public function detalle($reportability_id)
    {
        $user = auth()->user();
        $module = Module::findOrFail($reportability_id);

        $canCloseReport = false; // Variable para determinar si el usuario puede cerrar el reporte

        // Regla: El usuario debe ser ingeniero de seguridad y la empresa debe coincidir
        $isSecurityEngineer = $user->isSecurityEngineer();
        $belongsToCompany = $module->company_id == $user->company_id || $module->company_report_id == $user->company_id;

        if ($module->estado !== 'Cerrado' && $isSecurityEngineer && $belongsToCompany) {
            $module->estado = 'Revisado';
            $module->save();
            $canCloseReport = true;
        }

        $query = "
        SELECT
            m.estado,
            CASE
                WHEN m.tipo_reporte = 'actos' THEN 'Reporte de actos subestándar'
                WHEN m.tipo_reporte = 'inspeccion' THEN 'Reporte de inspección'
                WHEN m.tipo_reporte = 'incidentes' THEN 'Reporte de incidentes'
                WHEN m.tipo_reporte = 'condiciones' THEN 'Reporte de condiciones subestándar'
                WHEN m.tipo_reporte = 'vehicular' THEN CONCAT('Inspección Vehicular - ', m.tipo_inspeccion)
                ELSE m.tipo_reporte
            END AS tipo_reporte,
            m.company_id,
            c.nombre AS company_name,
            m.company_report_id,
            COALESCE(cr.nombre, 'No especificado') AS company_report_name,
            m.fecha_reporte,
            m.fecha_evento,
            m.user_report_id,
            m.report_closed_at,
            COALESCE(CONCAT(ur.nombres, ' ', ur.apellidos), 'No asignado') AS encargado_cierre
        FROM
            modules AS m
        INNER JOIN
            companies AS c ON c.id = m.company_id
        LEFT JOIN
            companies AS cr ON cr.id = m.company_report_id
        LEFT JOIN
            users AS ur ON ur.id = m.user_report_id
        WHERE
            m.id = ?
        ";

        $reportability = DB::selectOne($query, [$reportability_id]);

        return Inertia::render('reportability/detalle', [
            'reportability' => $reportability,
            'reportability_id' => $reportability_id,
            'isSecurityEngineer' => $isSecurityEngineer,
            'canCloseReport' => $canCloseReport,
        ]);
    }

    public function download($reportability_id)
    {

        $reportability = Module::findOrFail($reportability_id);

        $name = "Reporte de reportabilidad {$reportability->fecha_reporte}.pdf";

        $view = match ($reportability->tipo_reporte) {
            'inspeccion' => 'reports.detallado_inspeccionPDF',
            'vehicular' => match ($reportability->tipo_inspeccion) {
                'pre-use' => 'reports.detallado_vehicular_preusePDF',
                default => 'reports.detallado_vehicularPDF',
            },
            default => 'reports.detalladoPDF',
        };

        // Convertir el logo a base64
        $logoPath = public_path('logos/logo-souther-grupomexico.png');
        $logoBase64 = base64_encode(file_get_contents($logoPath));
        $logo = "data:image/png;base64,{$logoBase64}";

        return $this->generatePDF($view, [
            'reportability' => $reportability,
            'dni' => $reportability->user->doi ?? '',
            'logo' => $logo,
            'url' => public_path('/'),
        ], $name);
    }

    private function generatePDF($view, $data, $name)
    {
        $pdf = PDF::loadView($view, $data)->setPaper('a4');
        return $pdf->stream($name);
    }

    public function destroy(Request $request, $reportability_id)
    {
        $module = Module::findOrFail($reportability_id);
        $module->delete_reason = $request->input('motivo');
        $module->save();
        $module->delete();
        return redirect()->back()->with('success', 'Reporte eliminado correctamente.');
    }
}
