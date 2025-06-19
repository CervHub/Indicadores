<?php

namespace App\Exports;

use App\Models\Consolidated;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithColumnWidths;

class ConsolidatedCompanyExport implements FromCollection, WithHeadings, WithMapping, WithColumnWidths
{
    protected $consolidatedId;

    public function __construct($consolidatedId)
    {
        $this->consolidatedId = $consolidatedId;
    }

    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        $consolidated = Consolidated::find($this->consolidatedId);
        
        // Usar la misma lógica del controlador
        $companyConsolidatedData = \DB::table('company_consolidateds as cc')
            ->leftJoin('companies as c', 'c.id', '=', 'cc.company_id')
            ->leftJoin('file_statuses as fs', function($join) use ($consolidated) {
                $join->on('fs.contractor_company_id', '=', 'c.id')
                    ->where('fs.year', '=', $consolidated->year)
                    ->where('fs.month', '=', $consolidated->month)
                    ->where('fs.is_old', '=', false);
            })
            ->leftJoin('ueas as u', 'u.id', '=', 'fs.uea_id')
            ->leftJoin('contractor_company_types as cct', 'cct.id', '=', 'fs.contractor_company_type_id')
            ->where('cc.consolidated_id', $this->consolidatedId)
            ->select(
                'c.nombre as company_name',
                'c.ruc as company_ruc',
                'u.name as uea_name',
                'cct.name as contractor_type_name',
                'cct.abbreviation as contractor_type_abbreviation',
                'fs.updated_at as file_status_updated_at'
            )
            ->get();

        // Transformar los datos igual que en el frontend
        $grouped = [];
        
        foreach ($companyConsolidatedData as $item) {
            $key = $item->company_ruc;
            if (!isset($grouped[$key])) {
                $grouped[$key] = [
                    'nombre' => $item->company_name,
                    'ruc' => $item->company_ruc,
                    'anexos' => [],
                ];
            }
            if ($item->uea_name || $item->contractor_type_name || $item->file_status_updated_at) {
                $grouped[$key]['anexos'][] = [
                    'uea' => $item->uea_name,
                    'tipo' => $item->contractor_type_name,
                    'fecha' => $item->file_status_updated_at,
                ];
            }
        }

        // Crear la estructura final
        $transformedCompanies = collect();
        foreach ($grouped as $company) {
            $transformedCompanies->push((object)[
                'nombre' => $company['nombre'],
                'ruc' => $company['ruc'],
                'estado' => count($company['anexos']) > 0 ? 'Subió' : 'No subió nada',
                'anexos' => $company['anexos'],
            ]);
        }

        return $transformedCompanies;
    }

    public function headings(): array
    {
        return [
            'Nombre',
            'RUC',
            'Estado',
            'UEAs y Tipos',
            'Fechas de Subida'
        ];
    }

    public function map($company): array
    {
        // Formatear UEAs y tipos
        $ueaTypes = collect($company->anexos)->map(function ($anexo) {
            $uea = $anexo['uea'] ?? 'N/A';
            $tipo = $anexo['tipo'] ?? 'N/A';
            return "({$uea} - {$tipo})";
        })->implode(', ');

        // Formatear fechas
        $fechas = collect($company->anexos)->map(function ($anexo) {
            return $anexo['fecha'] ? \Carbon\Carbon::parse($anexo['fecha'])->format('Y-m-d H:i:s') : 'N/A';
        })->unique()->implode(', ');

        return [
            $company->nombre,
            $company->ruc,
            $company->estado,
            $ueaTypes ?: 'Sin datos',
            $fechas ?: 'Sin fechas'
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 50, // Nombre
            'B' => 15, // RUC
            'C' => 15, // Estado
            'D' => 150, // UEAs y Tipos
            'E' => 30, // Fechas
        ];
    }
}
