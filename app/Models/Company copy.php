<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class Company extends Model
{
    protected $table = 'companies';
    protected $fillable = ['nombre', 'ruc', 'descripcion', 'email'];
    public $timestamps = true;
    use HasFactory;

    public function setting()
    {
        return $this->hasOne(Setting::class);
    }

    public function modules()
    {
        return $this->hasMany(Module::class);
    }

    public function uea()
    {
        return $this->hasMany(UeaCompany::class);
    }

    public function categoryFilter($tipo_reporte, $startDate, $endDate, $estado = 'all', $gerencia = 'all', $superintendencia = 'all', $taller_seccion = 'all')
    {
        $tipo_reporte = strtolower($tipo_reporte);
        $startDate = Carbon::parse($startDate)->startOfDay()->format('Y-m-d');
        $endDate = Carbon::parse($endDate)->endOfDay()->format('Y-m-d');

        $query = $this->modules()
            ->whereRaw("LOWER(tipo_reporte) = ?", [$tipo_reporte])
            ->whereBetween(DB::raw('CONVERT(DATE, fecha_evento)'), [$startDate, $endDate]);

        if ($estado !== 'all') {
            $query->where('estado', $estado);
        }

        // POstgres
        // if ($gerencia != 'all') {
        //     $query->whereRaw("levels->>'gerencia' = ?", [$gerencia]);
        // }

        // if ($superintendencia != 'all') {
        //     $query->whereRaw("levels->>'superintendencia' = ?", [$superintendencia]);
        // }

        // if ($taller_seccion != 'all') {
        //     $query->whereRaw("levels->>'taller_seccion' = ?", [$taller_seccion]);
        // }
        if ($gerencia != 'all') {
            $query->whereRaw("JSON_VALUE(levels, '$.gerencia') = ?", [$gerencia]);
        }

        if ($superintendencia != 'all') {
            $query->whereRaw("JSON_VALUE(levels, '$.superintendencia') = ?", [$superintendencia]);
        }

        if ($taller_seccion != 'all') {
            $query->whereRaw("JSON_VALUE(levels, '$.taller_seccion') = ?", [$taller_seccion]);
        }
        return $query->count();
    }

    public function categoryFilterInspeccion($tipo_inspeccion, $tipo_reporte, $startDate, $endDate, $estado = 'all', $gerencia = 'all', $superintendencia = 'all', $taller_seccion = 'all')
    {
        $tipo_reporte = strtolower($tipo_reporte);
        $startDate = Carbon::parse($startDate)->startOfDay()->format('Y-m-d');
        $endDate = Carbon::parse($endDate)->endOfDay()->format('Y-m-d');

        $query = $this->modules()
            ->whereRaw("LOWER(tipo_reporte) = ?", [$tipo_reporte])
            ->whereRaw("LOWER(tipo_inspeccion) = ?", [$tipo_inspeccion])
            ->whereBetween(DB::raw('CONVERT(DATE, fecha_evento)'), [$startDate, $endDate]);

        if ($estado !== 'all') {
            $query->where('estado', $estado);
        }

        if ($gerencia != 'all') {
            $query->whereRaw("JSON_VALUE(levels, '$.gerencia') = ?", [$gerencia]);
        }

        if ($superintendencia != 'all') {
            $query->whereRaw("JSON_VALUE(levels, '$.superintendencia') = ?", [$superintendencia]);
        }

        if ($taller_seccion != 'all') {
            $query->whereRaw("JSON_VALUE(levels, '$.taller_seccion') = ?", [$taller_seccion]);
        }
        return $query->count();
    }
    public function getChartData($startDate, $endDate, $estado = 'all', $gerencia = 'all', $superintendencia = 'all', $taller_seccion = 'all')
    {
        $categories = ['Actos', 'Condiciones', 'Incidentes'];
        $data = [];

        foreach ($categories as $category) {
            $count = $this->categoryFilter($category, $startDate, $endDate, $estado, $gerencia, $superintendencia, $taller_seccion);
            $data[] = ['name' => $category, 'y' => $count];
        }

        return $data;
    }

    public function getChartDataInspeccion($startDate, $endDate, $estado = 'all', $gerencia = 'all', $superintendencia = 'all', $taller_seccion = 'all')
    {
        $inspecciones = ['OTROS', 'COMITES', 'PLANEADA', 'NO PLANEADA'];
        $data = [];

        foreach ($inspecciones as $inspeccion) {
            $count = $this->categoryFilterInspeccion($inspeccion, 'inspeccion', $startDate, $endDate, $estado, $gerencia, $superintendencia, $taller_seccion);
            $data[] = ['name' => $inspeccion, 'y' => $count];
        }
        return $data;
    }

    public function categoryCompanysFilter($category_company_id, $startDate, $endDate, $estado = 'all', $gerencia = 'all', $superintendencia = 'all', $taller_seccion = 'all')
    {

        $startDate = Carbon::parse($startDate)->startOfDay();
        $endDate = Carbon::parse($endDate)->endOfDay();

        // $query = $this->modules()
        //     ->where('category_company_id', $category_company_id)
        //     ->whereRaw("DATE(fecha_evento) BETWEEN ? AND ?", [$startDate, $endDate]);
        $query = $this->modules()
            ->where('category_company_id', $category_company_id)
            ->whereRaw("CONVERT(DATE, fecha_evento) BETWEEN ? AND ?", [$startDate, $endDate]);


        if ($estado !== 'all') {
            $query->where('estado', $estado);
        }

        if ($gerencia != 'all') {
            $query->whereRaw("JSON_VALUE(levels, '$.gerencia') = ?", [$gerencia]);
        }

        return $query->count();
    }

    public function categoryCompanysFilterInspeccion($category_company_id, $startDate, $endDate, $estado = 'all', $gerencia = 'all', $superintendencia = 'all', $taller_seccion = 'all')
    {

        $startDate = Carbon::parse($startDate)->startOfDay();
        $endDate = Carbon::parse($endDate)->endOfDay();

        $query = $this->modules()
            ->whereNull('category_company_id')
            ->whereRaw("CONVERT(DATE, fecha_evento) BETWEEN ? AND ?", [$startDate, $endDate])
            ->whereNotNull('details');

        if ($estado !== 'all') {
            $query->where('estado', $estado);
        }

        if ($gerencia != 'all') {
            $query->whereRaw("JSON_VALUE(levels, '$.gerencia') = ?", [$gerencia]);
        }

        if ($superintendencia != 'all') {
            $query->whereRaw("JSON_VALUE(levels, '$.superintendencia') = ?", [$superintendencia]);
        }

        if ($taller_seccion != 'all') {
            $query->whereRaw("JSON_VALUE(levels, '$.taller_seccion') = ?", [$taller_seccion]);
        }

        $results = $query->get(); // Ejecuta la consulta y obtiene los resultados

        $totalConteoEspecifico = 0; // Inicializar el total de conteo específico

        foreach ($results as $result) {
            $detailsArray = json_decode($result->details, true); // Decodifica el JSON a un array PHP

            $idDetalles = array_map(function ($detalle) {
                return $detalle['id_detalle'];
            }, $detailsArray);

            $conteoValores = array_count_values($idDetalles);

            if (isset($conteoValores[$category_company_id])) {
                $totalConteoEspecifico += $conteoValores[$category_company_id];
            }
        }

        return $totalConteoEspecifico;
    }

    public function  categories()
    {
        return $this->hasMany(CategoryCompany::class);
    }

    public static function getAllCategories()
    {
        $companies = self::all();
        $allCategories = collect();

        foreach ($companies as $company) {
            $categories = $company->categories;
            foreach ($categories as $category) {
                $allCategories->push($category);
            }
        }

        return $allCategories;
    }
    public function getChartDataCategory($category_name, $startDate, $endDate, $estado = 'all', $gerencia = 'all', $superintendencia = 'all', $taller_seccion = 'all')
    {
        $categories = ['Actos', 'Condiciones', 'Incidentes', 'Inspección'];
        $nombre = null;
        $data = [];
        foreach ($categories as $category) {
            if (strpos($category_name, $category) !== false) {
                // $category está en la cadena $category_name
                $nombre = $category;
                break;
            }
        }

        if ($nombre) {
            $category = Category::where('nombre', $nombre)->first();
            $categories = $this->getAllCategories()->where('category_id', $category->id);
            foreach ($categories as $category) {
                $count = $this->categoryCompanysFilter($category->id, $startDate, $endDate, $estado, $gerencia, $superintendencia, $taller_seccion);
                $data[] = ['name' => $category->nombre, 'y' => $count];
            }
        }
        return $data;
    }

    public function getChartDataCategoryInspeccion($category_name, $startDate, $endDate, $estado = 'all', $gerencia = 'all', $superintendencia = 'all', $taller_seccion = 'all')
    {
        $nombre = 'Inspección';
        $category = Category::where('nombre', $nombre)->first();
        $categories = $this->getAllCategories()->where('category_id', $category->id);
        foreach ($categories as $category) {
            $count = $this->categoryCompanysFilterInspeccion($category->id, $startDate, $endDate, $estado, $gerencia, $superintendencia, $taller_seccion);
            $data[] = ['name' => $category->nombre, 'y' => $count];
        }

        return $data;
    }
    public function getChartDataYear($startYear, $tipo_reporte, $otro_select, $gerencia, $superintendencia, $taller_seccion)
    {
        $categories = ['Actos', 'Condiciones', 'Incidentes'];
        //Traemos a todos los reportes en el año  para esta empresa
        // $query = $this->modules()
        //     ->where('company_id', $this->id) // Añadir la condición de company_id
        //     ->whereRaw("EXTRACT(YEAR FROM fecha_evento) = ?", [$startYear]); // Extraer el año de fecha_evento y verificar el año
        $query = $this->modules()
            ->where('company_id', $this->id) // Add the condition for company_id
            ->whereRaw("YEAR(fecha_evento) = ?", [$startYear]); // Extract the year from fecha_evento and check the year

        // if ($gerencia != 'all') {
        //     $query->whereRaw("levels->>'gerencia' = ?", [$gerencia]);
        // }

        // if ($superintendencia != 'all') {
        //     $query->whereRaw("levels->>'superintendencia' = ?", [$superintendencia]);
        // }

        // if ($taller_seccion != 'all') {
        //     $query->whereRaw("levels->>'taller_seccion' = ?", [$taller_seccion]);
        // }

        if ($gerencia != 'all') {
            $query->whereRaw("JSON_VALUE(levels, '$.gerencia') = ?", [$gerencia]);
        }

        if ($otro_select != 'all') {
            $query->where('category_company_id', $otro_select);
        }

        $modules = $query->get();

        // Configurar el idioma de Carbon a español
        Carbon::setLocale('es');

        // Agrupar los datos por mes y categoría
        $grouped = $modules->groupBy(function ($item) {
            return Carbon::parse($item->fecha_evento)->format('n'); // 'n' da el mes sin ceros iniciales
        })->map(function ($items) {
            return $items->groupBy('tipo_reporte');
        });

        // Inicializar los datos con ceros
        $data = [];
        $months = range(1, 12);
        $categories = ['actos', 'condiciones', 'incidentes'];
        foreach ($months as $month) {
            $monthName = Carbon::createFromDate(null, $month, null)->monthName; // Obtener el nombre del mes en español
            $data[$monthName] = [];
            foreach ($categories as $category) {
                $categoryName = ucfirst($category); // Primera letra en mayúscula
                $data[$monthName][$categoryName] = $grouped->get($month, collect())->get($category, collect())->count();
            }
        }

        // Agregar el modo
        $data['mode'] = $tipo_reporte;


        return $data;
    }

    public function getChartDataYearInspeccion($startYear, $tipo_reporte, $otro_select, $gerencia, $superintendencia, $taller_seccion)
    {

        $categories = ['OTROS', 'COMITES', 'PLANEADA', 'NO PLANEADA'];
        // $data = [];

        // foreach ($inspecciones as $inspeccion) {
        //     $count = $this->categoryFilterInspeccion($inspeccion, 'inspeccion', $startDate, $endDate, $estado, $gerencia, $superintendencia, $taller_seccion);
        //     $data[] = ['name' => $inspeccion, 'y' => $count];
        // }
        // return $data;

        $query = $this->modules()
            ->where('tipo_reporte', 'inspeccion')
            ->whereNotNull('details')
            ->whereNotNull('tipo_inspeccion')
            ->where('company_id', $this->id) // Add the condition for company_id
            ->whereRaw("YEAR(fecha_evento) = ?", [$startYear]); // Extract the year from fecha_evento and check the year


        if ($gerencia != 'all') {
            $query->whereRaw("JSON_VALUE(levels, '$.gerencia') = ?", [$gerencia]);
        }

        if ($otro_select != 'all') {
            $query->where('category_company_id', $otro_select);
        }

        $modules = $query->get();


        // Configurar el idioma de Carbon a español
        Carbon::setLocale('es');

        // Agrupar los datos por mes y categoría
        $grouped = $modules->groupBy(function ($item) {
            return Carbon::parse($item->fecha_evento)->format('n'); // 'n' da el mes sin ceros iniciales
        })->map(function ($items) {
            return $items->groupBy('tipo_inspeccion');
        });


        // Inicializar los datos con ceros
        $data = [];
        $months = range(1, 12);
        foreach ($months as $month) {
            $monthName = Carbon::createFromDate(null, $month, null)->monthName; // Obtener el nombre del mes en español
            $data[$monthName] = [];
            foreach ($categories as $category) {
                $categoryName = ucfirst($category); // Primera letra en mayúscula
                $data[$monthName][$categoryName] = $grouped->get($month, collect())->get($category, collect())->count();
            }
        }

        // Agregar el modo
        $data['mode'] = $tipo_reporte;


        return $data;
    }
}
