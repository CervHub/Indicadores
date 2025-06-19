<?php

namespace App\Exports;

use App\Models\Company;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithColumnWidths;

class CompanyExport implements FromCollection, WithHeadings, WithMapping, WithColumnWidths
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return Company::with(['ueaCompanies.uea', 'ueaCompanies.activity'])->get();
    }

    public function headings(): array
    {
        return [
            'Nombre',
            'RUC',
            'Email',
            'Estado',
            'Fecha',
            'UEAs'
        ];
    }

    public function map($company): array
    {
        // Crear los pares UEA - Actividad en el formato solicitado
        $ueaActivityPairs = $company->ueaCompanies->map(function ($ueaCompany) {
            $ueaName = $ueaCompany->uea->name ?? 'N/A';
            $activityName = $ueaCompany->activity->name ?? 'N/A';
            return "({$ueaName} - {$activityName})";
        })->implode(', ');

        return [
            $company->nombre,
            $company->ruc,
            $company->email,
            $company->estado == 1 ? 'Activo' : 'Inactivo',
            $company->created_at->format('Y-m-d H:i:s'),
            $ueaActivityPairs ?: 'Sin UEAs y Actividades'
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 50, // Nombre
            'B' => 15, // RUC
            'C' => 30, // Email
            'D' => 10, // Estado
            'E' => 20, // Fecha
            'F' => 150, // UEAs
        ];
    }
}
