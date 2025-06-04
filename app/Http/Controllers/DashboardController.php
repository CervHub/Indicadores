<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Company;
use App\Models\Entity;

class DashboardController extends Controller
{
    public function index()
    {
        $titles = [
            'actos' => 'Actos subestandar',
            'condiciones' => 'Condiciones subestandar',
            'incidentes' => 'Incidentes subestandar'
        ];

        $user = auth()->user();
        $userCompany = $user->company_id ?? null;

        // Si la empresa del usuario es 1 o null, enviar todas las empresas
        if ($userCompany == 1 || $userCompany == null) {
            $companies = Company::all();
        } else {
            // Caso contrario, solo su empresa
            $companies = Company::where('id', $userCompany)->get();
        }

        $entities = Entity::all();

        return Inertia::render('dashboard', [
            'companies' => $companies,
            'entities' => $entities,
            'titles' => $titles
        ]);
    }

    public function type($type)
    {
        $titles = [
            'actos' => 'Actos subestandar',
            'condiciones' => 'Condiciones subestandar',
            'incidentes' => 'Incidentes subestandar'
        ];

        return Inertia::render('dashboardType', [
            'type' => $type,
            'title' => $titles[$type] ?? 'Dashboard',
        ]);
    }
}
