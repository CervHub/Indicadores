<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Module;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Exports\PersonalExport;
use PDF;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\PersonalImport;
use Illuminate\Support\Facades\DB;

class ReportabilityController extends Controller
{
    public function index()
    {
        // Define the company_report_id variable
        $companyReportId = auth()->user()->company_id;

        // Define the raw SQL query with a filter for company_report_id
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
    WHERE
        m.company_report_id = ?
    ORDER BY
        m.fecha_evento DESC;
    ";

        // Execute the query with the company_report_id parameter
        $reportabilities = DB::select($query, [$companyReportId]);

        // Pass the results to the view
        return view('user.reportability.index', compact('reportabilities'));
    }

    public function detalle($reportability_id)
    {
        $engineers = User::where('cargo', 'Ingeniero de Seguridad')
            ->get();

        $reportability = Module::find($reportability_id);

        if ($reportability->tipo_reporte == 'inspeccion') {
            return view('user.reportability.detalle_inspeccion', compact('reportability', 'engineers'));
        } else {
            return view('user.reportability.detalle', compact('reportability', 'engineers'));
        }
    }
}
