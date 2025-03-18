<?php

namespace App\Http\Controllers\Contrata;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Company;
use App\Models\Level;
use App\Models\Entity;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class ContrataController extends Controller
{
    private function getEntities($entities, $levels)
    {
        $levels_map = $levels->mapWithKeys(function ($level) {
            return [$level->nombre => $level->orden];
        });

        $grouped_entities = [];

        foreach ($levels_map as $level_name => $level_order) {
            $filtered_entities = $entities->filter(function ($entity) use ($level_order) {
                return $entity->nivel == $level_order;
            });

            $grouped_entities[] = [
                'nombre' => $level_name,
                'orden' => $level_order,
                'items' => $filtered_entities->map(function ($entity) {
                    return [
                        'parent_id' => $entity->parent_id,
                        'id' => $entity->id,
                        'nombre' => $entity->nombre,
                        'nivel' => $entity->nivel
                    ];
                })->values()->toArray()
            ];
        }

        return $grouped_entities;
    }

    public function index(Request $request)
    {
        $company_id = auth()->user()->company;

        return view('contrata.analysis.index', compact('company_id'));
    }


    public function category(Request $request)
    {
        $levels = Level::orderBy('orden', 'asc')->get();
        $entities = Entity::all();
        $grouped_entities = $this->getEntities($entities, $levels);
        $companies = Company::all();

        $company_id = $request->has('company_id') ? $request->get('company_id') : 'all';
        $startDate = $request->has('startDate') ? $request->get('startDate') : Carbon::now()->subDays(30)->format('Y-m-d');
        $endDate = $request->has('endDate') ? $request->get('endDate') : Carbon::now()->format('Y-m-d');
        $estado = $request->has('estado') ? $request->get('estado') : 'all';
        $gerencia = $request->has('GERENCIAS') ? $request->get('GERENCIAS') : 'all';
        $superintendencia = $request->has('SUPERINTENDENCIA') ? $request->get('SUPERINTENDENCIA') : 'all';
        $taller_seccion = $request->has('TALLER_/_DEPARTAMENTO') ? $request->get('TALLER_/_DEPARTAMENTO') : 'all';

        if ($company_id == 'all') {
            $data = [];
            foreach ($companies as $company) {
                $companyData = $company->getChartData($startDate, $endDate, $estado, $gerencia, $superintendencia, $taller_seccion);
                foreach ($companyData as $datum) {
                    if (isset($data[$datum['name']])) {
                        $data[$datum['name']]['y'] += $datum['y'];
                    } else {
                        $data[$datum['name']] = $datum;
                    }
                }
            }
            $data = array_values($data);
        } else {
            $company = Company::find($company_id);
            $data = $company->getChartData($startDate, $endDate, $estado, $gerencia, $superintendencia, $taller_seccion);
        }

        return view('contrata.analysis.reportview.index', compact('companies', 'company_id', 'data', 'startDate', 'endDate', 'grouped_entities', 'estado', 'gerencia', 'superintendencia', 'taller_seccion'));
    }


    public function categoryDetail(Request $request, $category_name)
    {
        $levels = Level::orderBy('orden', 'asc')->get();
        $entities = Entity::all();
        $grouped_entities = $this->getEntities($entities, $levels);
        $startDate = $request->has('startDate') ? $request->get('startDate') : Carbon::now()->subDays(30)->format('Y-m-d');
        $endDate = $request->has('endDate') ? $request->get('endDate') : Carbon::now()->format('Y-m-d');
        $estado = $request->has('estado') ? $request->get('estado') : 'all';
        $gerencia = $request->has('GERENCIAS') ? $request->get('GERENCIAS') : 'all';
        $superintendencia = $request->has('SUPERINTENDENCIA') ? $request->get('SUPERINTENDENCIA') : 'all';
        $taller_seccion = $request->has('TALLER_/_DEPARTAMENTO') ? $request->get('TALLER_/_DEPARTAMENTO') : 'all';

        $company_id = Auth::user()->company->id;

        $company = Company::find($company_id);
        $data = $company->getChartDataCategory($category_name, $startDate, $endDate, $estado, $gerencia, $superintendencia, $taller_seccion, $category_name);


        return view('contrata.analysis.reportview.toquepala.category', compact('data', 'category_name', 'grouped_entities', 'startDate', 'endDate', 'estado', 'gerencia', 'superintendencia', 'taller_seccion'));
    }

    public function categoryYear(Request $request)
    {
        $startYear = $request->has('startYear') ? $request->get('startYear') : date('Y');
        $tipo_reporte = $request->has('tipo_reporte') ? $request->get('tipo_reporte') : 'all';
        $otro_select = $request->has('otro_select') ? $request->get('otro_select') : 'all';
        $levels = Level::orderBy('orden', 'asc')->get();
        $entities = Entity::all();
        $grouped_entities = $this->getEntities($entities, $levels);
        $estado = $request->has('estado') ? $request->get('estado') : 'all';
        $gerencia = $request->has('GERENCIAS') ? $request->get('GERENCIAS') : 'all';
        $superintendencia = $request->has('SUPERINTENDENCIA') ? $request->get('SUPERINTENDENCIA') : 'all';
        $taller_seccion = $request->has('TALLER_/_DEPARTAMENTO') ? $request->get('TALLER_/_DEPARTAMENTO') : 'all';
        $company_id = Auth::user()->company->id;

        $company = Company::find($company_id);
        $data = $company->getChartDataYear($startYear, $tipo_reporte, $otro_select, $gerencia, $superintendencia, $taller_seccion);


        return view('contrata.analysis.reportview.toqcurvatendencia.index', compact('data', 'otro_select', 'tipo_reporte', 'startYear', 'grouped_entities', 'estado', 'gerencia', 'superintendencia', 'taller_seccion'));
    }

    public function inspeccion(Request $request)
    {
        $levels = Level::orderBy('orden', 'asc')->get();
        $entities = Entity::all();
        $grouped_entities = $this->getEntities($entities, $levels);
        $companies = Company::all();

        $startDate = $request->has('startDate') ? $request->get('startDate') : Carbon::now()->subDays(30)->format('Y-m-d');
        $endDate = $request->has('endDate') ? $request->get('endDate') : Carbon::now()->format('Y-m-d');
        $estado = $request->has('estado') ? $request->get('estado') : 'all';
        $gerencia = $request->has('GERENCIAS') ? $request->get('GERENCIAS') : 'all';
        $superintendencia = $request->has('SUPERINTENDENCIA') ? $request->get('SUPERINTENDENCIA') : 'all';
        $taller_seccion = $request->has('TALLER_/_DEPARTAMENTO') ? $request->get('TALLER_/_DEPARTAMENTO') : 'all';

        $company_id = Auth::user()->company->id;

        $company = Company::find($company_id);
        $data = $company->getChartDataInspeccion($startDate, $endDate, $estado, $gerencia, $superintendencia, $taller_seccion);


        return view('contrata.analysis.reportview.inspeccion.index', compact('companies', 'company_id', 'data', 'startDate', 'endDate', 'grouped_entities', 'estado', 'gerencia', 'superintendencia', 'taller_seccion'));
    }

    public function inspeccionDetail(Request $request)
    {
        $category_name = 'Inspección';
        $levels = Level::orderBy('orden', 'asc')->get();
        $entities = Entity::all();
        $grouped_entities = $this->getEntities($entities, $levels);
        $startDate = $request->has('startDate') ? $request->get('startDate') : Carbon::now()->subDays(30)->format('Y-m-d');
        $endDate = $request->has('endDate') ? $request->get('endDate') : Carbon::now()->format('Y-m-d');
        $estado = $request->has('estado') ? $request->get('estado') : 'all';
        $gerencia = $request->has('GERENCIAS') ? $request->get('GERENCIAS') : 'all';
        $superintendencia = $request->has('SUPERINTENDENCIA') ? $request->get('SUPERINTENDENCIA') : 'all';
        $taller_seccion = $request->has('TALLER_/_DEPARTAMENTO') ? $request->get('TALLER_/_DEPARTAMENTO') : 'all';

        $companies = Company::all();
        $data = [];

        $company_id = Auth::user()->company->id;
        $company = Company::find($company_id);
        $data = $company->getChartDataCategoryInspeccion($category_name, $startDate, $endDate, $estado, $gerencia, $superintendencia, $taller_seccion, $category_name);


        return view('contrata.analysis.reportview.inspecciondetalle.index', compact('companies', 'company_id', 'data', 'category_name', 'grouped_entities', 'startDate', 'endDate', 'estado', 'gerencia', 'superintendencia', 'taller_seccion'));
    }
    public function inspeccionYear(Request $request)
    {
        $startYear = $request->has('startYear') ? $request->get('startYear') : date('Y');
        $tipo_reporte = $request->has('tipo_reporte') ? $request->get('tipo_reporte') : 'all';
        $otro_select = $request->has('otro_select') ? $request->get('otro_select') : 'all';
        $levels = Level::orderBy('orden', 'asc')->get();
        $entities = Entity::all();
        $grouped_entities = $this->getEntities($entities, $levels);
        $estado = $request->has('estado') ? $request->get('estado') : 'all';
        $gerencia = $request->has('GERENCIAS') ? $request->get('GERENCIAS') : 'all';
        $superintendencia = $request->has('SUPERINTENDENCIA') ? $request->get('SUPERINTENDENCIA') : 'all';
        $taller_seccion = $request->has('TALLER_/_DEPARTAMENTO') ? $request->get('TALLER_/_DEPARTAMENTO') : 'all';
        $company_id = $request->has('company_id') ? $request->get('company_id') : 'all';
        $companies = Company::all();
        $data = [];

        $company_id = Auth::user()->company->id;

        $company = Company::find($company_id);
        $data = $company->getChartDataYearInspeccion($startYear, $tipo_reporte, $otro_select, $gerencia, $superintendencia, $taller_seccion);


        return view('contrata.analysis.reportview.inspeccioncurvadetendencia.index', compact('companies', 'company_id', 'data', 'otro_select', 'tipo_reporte', 'startYear', 'grouped_entities', 'estado', 'gerencia', 'superintendencia', 'taller_seccion'));
    }
}
