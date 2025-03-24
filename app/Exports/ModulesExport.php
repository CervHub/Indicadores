<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Route;

class ModulesExport implements FromCollection, WithHeadings, WithColumnWidths
{
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        // Modify the data to include hyperlinks
        $modifiedData = array_map(function ($item) {
            $url = route('company.reportability.download', ['reportability_id' => $item->ID]);
            $itemArray = (array) $item;
            $itemArray['ID'] = '=HYPERLINK("' . $url . '", "' . $item->ID . '")';
            return $itemArray;
        }, $this->data);

        return new Collection($modifiedData);
    }
    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'ID',
            'GERENCIA',
            'TIPO_REPORTE',
            'FECHA_EVENTO',
            'GENERADO_POR',
            'EMPRESA_GENERADOR',
            'EMPRESA_REPORTADA',
            'LUGAR',
            'DESCRIPCION_EVENTO',
            'NIVEL_RIESGO',
            'ACCION_CORRECTIVA',
            'CAUSAS'
        ];
    }

    /**
     * @return array
     */
    public function columnWidths(): array
    {
        return [
            'A' => 10,
            'B' => 40,
            'C' => 50,
            'D' => 25,
            'E' => 40,
            'F' => 40,
            'G' => 40,
            'H' => 50,
            'I' => 60,
            'J' => 15,
            'K' => 60,
            'L' => 30
        ];
    }
}
