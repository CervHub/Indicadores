<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use PhpOffice\PhpSpreadsheet\IOFactory;

class DecodeExcelExport
{
    use Exportable;

    protected $data;
    protected $tipo;

    public function __construct(array $data, string $tipo)
    {
        $this->data = $data;
        $this->tipo = $tipo;
    }

    public function export(string $filePath)
    {
        // Ruta del archivo base
        $path = public_path('formats/Format.xlsx');

        // Cargar el archivo Excel existente
        $spreadsheet = IOFactory::load($path);

        // Modificar las hojas según los datos
        foreach ($spreadsheet->getSheetNames() as $sheetName) {
            $sheet = $spreadsheet->getSheetByName($sheetName);
            if (!$sheet) {
                continue;
            }

            // Llamar a una función para modificar la hoja
            $this->modifySheet($sheet, $sheetName);
        }

        // Guardar el archivo modificado en la ubicación especificada
        $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
        $writer->save($filePath);
    }

    protected function modifySheet($sheet, $sheetName)
    {
        $data = $this->data[$sheetName] ?? [];
        $rowOffsets = [
            'ANEXO 24' => 13,
            'ANEXO 25' => 13,
            'ANEXO 26' => 13,
            'ANEXO 27' => 14,
            'ANEXO 28' => 14,
            'PLANTILLA MINEM 1' => 5,
            'PLANTILLA MINEM 2' => 5,
        ];

        $baseRow = $rowOffsets[$sheetName] ?? null;
        if ($baseRow !== null) {
            $this->modifySheetData($sheet, $data, $baseRow);
        }
    }

    protected function modifySheetData($sheet, array $data, int $baseRow)
    {
        // Ajustar la fila según el tipo, excepto si es "minem"
        if (str_contains($sheet->getTitle(), 'MINEM')) {
            $baseRow = 5; // Siempre comienza en 5 para MINEM
        } else {
            if ($this->tipo == 'contrata') {
                $baseRow += 2;
            } elseif ($this->tipo == 'conexa') {
                $baseRow += 4;
            }
        }

        // Generar columnas (A-Z, AA-ZZ)
        $columns = range('A', 'Z');
        $columns = array_merge($columns, array_map(fn($col) => 'A' . $col, range('A', 'Z')));

        // Rellenar datos en las celdas
        foreach ($data as $index => $value) {
            $column = $columns[$index] ?? null;
            if ($column) {
                $sheet->setCellValue($column . $baseRow, $value);
            }
        }
    }
}
