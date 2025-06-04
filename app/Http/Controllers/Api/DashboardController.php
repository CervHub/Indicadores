<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $query = DB::table('modules as m')
            ->select([
                'm.fecha_reporte as fechaReporte',
                'm.fecha_evento as fechaEvento',
                'm.descripcion as descripcionEvento',
                'm.gravedad as nivelGravedad',
                'm.estado as estadoReporte',
                'm.category_company_id as idCausa',
                'm.tipo_reporte as tipoReporte',
                'm.user_id as idUsuarioReporta',
                'm.company_id as idEmpresaReporta',
                'm.company_report_id as idEmpresaReportada',
                'm.area as areaInvolucrada',
                'm.user_report_id as idUsuarioCierre',
                'm.reassigned_user_id as idUsuarioReasignado',
                'm.reassignment_reason as motivoReasignacion',
                'm.deleted_at as eliminadoEn',
                'm.entity_id as idGerencia',
                DB::raw("CONCAT(u.nombres, ' ', u.apellidos) as nombreUsuarioReporta"),
                DB::raw("CONCAT(ur.nombres, ' ', ur.apellidos) as nombreUsuarioCierre"),
                DB::raw("CONCAT(ru.nombres, ' ', ru.apellidos) as nombreUsuarioReasignado"),
                'ec.nombre as nombreEmpresaReporta',
                'er.nombre as nombreEmpresaReportada',
                'cc.nombre as causaReporte',
                'e.nombre as nombreGerencia'
            ])
            ->leftJoin('users as u', 'u.id', '=', 'm.user_id')
            ->leftJoin('users as ur', 'ur.id', '=', 'm.user_report_id')
            ->leftJoin('users as ru', 'ru.id', '=', 'm.reassigned_user_id')
            ->leftJoin('companies as ec', 'ec.id', '=', 'm.company_id')
            ->leftJoin('companies as er', 'er.id', '=', 'm.company_report_id')
            ->leftJoin('category_companies as cc', 'cc.id', '=', 'm.category_company_id')
            ->leftJoin('entities as e', 'e.id', '=', 'm.entity_id')
            ->where('m.tipo_reporte', '!=', 'inspeccion');

        // Apply filters
        if ($request->has('fecha_inicio')) {
            $query->whereDate('m.fecha_evento', '>=', $request->fecha_inicio);
        }

        if ($request->has('fecha_fin')) {
            $query->whereDate('m.fecha_evento', '<=', $request->fecha_fin);
        }

        if ($request->has('idCausa')) {
            $query->where('m.category_company_id', $request->idCausa);
        }

        if ($request->has('idUsuarioReporta')) {
            $query->where('m.user_id', $request->idUsuarioReporta);
        }

        if ($request->has('idEmpresaReporta')) {
            $query->where('m.company_id', $request->idEmpresaReporta);
        }

        if ($request->has('idEmpresaReportada')) {
            $query->where('m.company_report_id', $request->idEmpresaReportada);
        }

        if ($request->has('idUsuarioCierre')) {
            $query->where('m.user_report_id', $request->idUsuarioCierre);
        }

        if ($request->has('idUsuarioReasignado')) {
            $query->where('m.reassigned_user_id', $request->idUsuarioReasignado);
        }

        if ($request->has('idGerencia')) {
            $query->where('m.entity_id', $request->idGerencia);
        }

        $data = $query->get();

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }
}
