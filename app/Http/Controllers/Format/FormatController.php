<?php

namespace App\Http\Controllers\Format;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FormatController extends Controller
{
    public function index(Request $request)
    {
        $formats = [
            ['name' => 'Incidentes', 'report_action' => 'Generar reporte de incidentes', 'route' => '/reportes/incidentes'],
            ['name' => 'Actos Subestándar', 'report_action' => 'Generar reporte de actos subestándar', 'route' => '/reportes/actos-subestandar'],
            ['name' => 'Condiciones Subestándar', 'report_action' => 'Generar reporte de condiciones subestándar', 'route' => '/reportes/condiciones-subestandar'],
            ['name' => 'Inspección', 'report_action' => 'Generar reporte de inspección', 'route' => '/reportes/inspeccion'],
            ['name' => 'Inspección Vehicular Diaria', 'report_action' => 'Generar reporte de inspección vehicular diaria', 'route' => '/reportes/inspeccion-vehicular-diaria'],
            ['name' => 'Inspección Vehicular Trimestral', 'report_action' => 'Generar reporte de inspección vehicular trimestral', 'route' => '/reportes/inspeccion-vehicular-trimestral'],
        ];

        return Inertia::render('format/index', [
            'formats' => $formats,
        ]);
    }

    public function acts(Request $request)
    {
        return Inertia::render('format/formats/acts');
    }
    public function conditions(Request $request)
    {
        return Inertia::render('format/formats/conditions');
    }
    public function incidents(Request $request)
    {
        return Inertia::render('format/formats/incidents');
    }
    public function inspection(Request $request)
    {
        return Inertia::render('format/formats/inspection');
    }
    public function dailyVehicleInspection(Request $request)
    {
        return Inertia::render('format/formats/daily-vehicle-inspection');
    }
    public function quarterlyVehicleInspection(Request $request)
    {
        return Inertia::render('format/formats/quarterly-vehicle-inspection');
    }
    public function semiannualVehicleInspection(Request $request)
    {
        return Inertia::render('format/formats/semiannual-vehicle-inspection');
    }
    public function annualVehicleShutdownInspection(Request $request)
    {
        return Inertia::render('format/formats/annual-vehicle-shutdown-inspection');
    }

    public function store(Request $request)
    {
        dd($request->all());
    }
}
