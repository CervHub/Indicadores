<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Module;
use App\Models\User;
use App\Models\SecurityEngineer;
use PDF;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\AbortException;

class ReportabilityController extends Controller
{


    public function index()
    {
        // Define the raw SQL query
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
        ORDER BY
            m.fecha_evento DESC;
        ";

        // Execute the query
        $reportabilities = DB::select($query);

        // Pass the results to the view
        return view('company.reportability.index', compact('reportabilities'));
    }


    public function detalle($reportability_id)
    {
        $engineers = User::where('company_id', auth()->user()->company_id)
            ->where('cargo', 'Ingeniero de Seguridad')
            ->where('estado', 1)
            ->get();
        $reportability = Module::find($reportability_id);


        if ($reportability->tipo_reporte == 'inspeccion') {
            return view('company.reportability.detalle_inspeccion', compact('reportability', 'engineers'));
        } else {
            return view('company.reportability.detalle', compact('reportability', 'engineers'));
        }
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
