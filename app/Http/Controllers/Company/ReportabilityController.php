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
            COALESCE(cc.nombre, '-') AS CAUSAS
        FROM
            modules AS m
        INNER JOIN
            users AS u ON u.id = m.user_id
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
        $user = auth()->user();
        $companyId = $user->company_id;
        // Obtiene el company_id de la solicitud
        $companyReportId = $companyId;

        $isSecurityEngineer = $user->isSecurityEngineer();

        // Define la consulta base
        $query = "
        SELECT
            m.id,
            u.nombres,
            u.apellidos,
            m.fecha_evento,
            m.estado,
            CASE
                WHEN m.tipo_reporte = 'actos' THEN 'Reporte de actos subestándar'
                WHEN m.tipo_reporte = 'inspeccion' THEN 'Reporte de inspección'
                WHEN m.tipo_reporte = 'incidentes' THEN 'Reporte de incidentes'
                WHEN m.tipo_reporte = 'condiciones' THEN 'Reporte de condiciones subestándar'
                ELSE m.tipo_reporte
            END AS tipo_reporte,
            COALESCE(e.nombre, 'No existe') AS gerencia_name,
            c.id AS company_id,
            c.nombre AS company_name,
            m.company_report_id,
            cr.nombre AS company_report_name
        FROM
            modules AS m
        INNER JOIN
            users AS u ON u.id = m.user_id
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
        LEFT JOIN
            companies AS c ON c.id = u.company_id
        LEFT JOIN
            companies AS cr ON cr.id = m.company_report_id
    ";

        // Agrega condiciones según el valor de company_id
        if (!empty($companyId)) {
            $query .= " WHERE c.id = ? AND m.company_report_id = ? ";
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
        if ($user->isSecurityEngineer()) {
            $reportability = Module::findOrFail($reportability_id);
            if ($reportability->estado !== 'Finalizado') {
                $reportability->estado = 'Revisado';
                $reportability->save();
            }
        }

        $query = "
        SELECT
            m.estado,
            CASE
                WHEN m.tipo_reporte = 'actos' THEN 'Reporte de actos subestándar'
                WHEN m.tipo_reporte = 'inspeccion' THEN 'Reporte de inspección'
                WHEN m.tipo_reporte = 'incidentes' THEN 'Reporte de incidentes'
                WHEN m.tipo_reporte = 'condiciones' THEN 'Reporte de condiciones subestándar'
                ELSE m.tipo_reporte
            END AS tipo_reporte,
            m.company_id,
            c.nombre AS company_name,
            m.company_report_id,
            cr.nombre AS company_report_name,
            m.fecha_reporte,
            m.fecha_evento
        FROM
            modules AS m
        INNER JOIN
            companies AS c ON c.id = m.company_id
        LEFT JOIN
            companies AS cr ON cr.id = m.company_report_id
        WHERE
            m.id = ?
        ";

        $reportability = DB::selectOne($query, [$reportability_id]);

        return Inertia::render('reportability/detalle', [
            'reportability' => $reportability,
            'reportability_id' => $reportability_id,
            'isSecurityEngineer' => $user->isSecurityEngineer(),
        ]);
    }

    public function download($reportability_id)
    {
        // Verificar si el usuario está autenticado
        if (!auth()->check()) {
            abort(401, 'Debe iniciar sesión para acceder a esta función.');
        }

        $user = auth()->user();

        // Verificar si el usuario tiene el role_id 2 y está autorizado
        if ($user->role_id == 2) {
            $authorized = SecurityEngineer::where('user_id', $user->id)->exists();
            if (!$authorized) {
                abort(403, 'Usted no está habilitado para esto.');
            }
        }

        $reportability = Module::findOrFail($reportability_id);

        // Verificar si el usuario tiene el role_id diferente de 1 y si el reporte le pertenece
        if ($user->role_id != 1 && $user->company_id != $reportability->company_id) {
            abort(403, 'Usted no está habilitado para ver este reporte.');
        }

        $name = "Reporte de reportabilidad {$reportability->fecha_reporte}.pdf";

        $view = $reportability->tipo_reporte == 'inspeccion'
            ? 'reports.detallado_inspeccionPDF'
            : 'reports.detalladoPDF';

        return $this->generatePDF($view, [
            'reportability' => $reportability,
            'logo' => public_path('logos/grupomexico.png'),
            'url' => public_path('/'),
        ], $name);
    }

    private function generatePDF($view, $data, $name)
    {
        $pdf = PDF::loadView($view, $data)->setPaper('a4');
        return $pdf->stream($name);
    }
}
