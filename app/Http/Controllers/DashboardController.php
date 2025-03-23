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
        return Inertia::render('dashboard');
    }

    public function type($type)
    {
        $titles = [
            'actos' => 'Actos subestandar',
            'condiciones' => 'Condiciones subestandar',
            'incidentes' => 'Incidentes subestandar'
        ];

        $companies = Company::all();
        $entities = Entity::all();

        return Inertia::render('dashboardType', [
            'type' => $type,
            'title' => $titles[$type] ?? 'Dashboard',
            'companies' => $companies,
            'titles' => $titles,
            'entities' => $entities
        ]);
    }
}
