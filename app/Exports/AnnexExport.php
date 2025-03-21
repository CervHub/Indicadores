<?php

namespace App\Exports;

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Carbon\Carbon;

class AnnexExport
{
    protected $data;

    protected $sheetNames = [
        'ANEXO 24',
        'ANEXO 25',
        'ANEXO 26',
        'ANEXO 27',
        'ANEXO 28',
        'ANEXO 30',
        'PLANTILLA MINEM 1',
        'PLANTILLA MINEM 2'
    ];

    protected $fileNames = [
        'SPCC - ACUMULACION TOQUEPALA 1',
        'SPCC - CONCENTRADORA TOQUEPALA',
        'SPCC - PLANTA LIXIVIAXION SX/EW TOQUEPALA'
    ];

    protected $months = [
        'January' => 'ENERO',
        'February' => 'FEBRERO',
        'March' => 'MARZO',
        'April' => 'ABRIL',
        'May' => 'MAYO',
        'June' => 'JUNIO',
        'July' => 'JULIO',
        'August' => 'AGOSTO',
        'September' => 'SEPTIEMBRE',
        'October' => 'OCTUBRE',
        'November' => 'NOVIEMBRE',
        'December' => 'DICIEMBRE'
    ];

    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Modifica las hojas especificadas y guarda los archivos modificados.
     */
    public function modifyAndSave()
    {
        $filePaths = [];
        $timestamp = Carbon::now()->format('Ymd_His');
        $monthName = $this->months[Carbon::now()->format('F')];

        $directoryPath = public_path("consolidateds/{$timestamp}");
        if (!file_exists($directoryPath)) {
            mkdir($directoryPath, 0777, true);
        }

        foreach ($this->fileNames as $index => $fileName) {
            $path = public_path('formats/Format.xlsx');
            $spreadsheet = IOFactory::load($path);
            $data = $this->data[$fileName] ?? [];
            foreach ($this->sheetNames as $sheetName) {
                // Buscar la hoja por nombre
                $sheet = $spreadsheet->getSheetByName($sheetName);
                if (!$sheet) {
                    continue; // Si la hoja no existe, continuar con la siguiente
                }

                // Llamar a la función específica para modificar la hoja
                $this->modifySheet($sheet, $sheetName, $index + 1, $data);

                // Ajustar el alto de las filas automáticamente
                foreach ($sheet->getRowIterator() as $row) {
                    $sheet->getRowDimension($row->getRowIndex())->setRowHeight(-1); // -1 para autoajustar
                }
            }

            // Guardar el nuevo archivo temporalmente
            $tempPath = storage_path("app/temp_{$index}.xlsx");
            $writer = new Xlsx($spreadsheet);
            $writer->save($tempPath);

            // Reemplazar caracteres no permitidos en el nombre del archivo
            $safeFileName = str_replace('/', '-', $fileName);

            // Definir la ruta y el nombre del archivo
            $filePath = "{$directoryPath}/{$safeFileName} - {$monthName}.xlsx";

            // Mover el archivo temporal a la carpeta 'public/consolidateds'
            rename($tempPath, $filePath);

            // Agregar la ruta al array de rutas
            $filePaths[] = "consolidateds/{$timestamp}/{$safeFileName} - {$monthName}.xlsx";
        }

        // Retornar el array de rutas
        return $filePaths;
    }

    /**
     * Modifica una hoja específica.
     */
    private function modifySheet($sheet, $sheetName, $fileIndex, $data)
    {
        switch ($sheetName) {
            case 'ANEXO 24':
                $this->modifyAnexo($sheet, $sheetName, $data['annex24'] ?? []);
                break;
            case 'ANEXO 25':
                $this->modifyAnexo($sheet, $sheetName, $data['annex25'] ?? []);
                break;
            case 'ANEXO 26':
                $this->modifyAnexo($sheet, $sheetName, $data['annex26'] ?? []);
                break;
            case 'ANEXO 27':
                $this->modifyAnexo($sheet, $sheetName, $data['annex27'] ?? []);
                break;
            case 'ANEXO 28':
                $this->modifyAnexo28($sheet, $sheetName, $data['annex28'] ?? []);
                break;
            case 'ANEXO 30':
                $this->modifyAnexo30($sheet, $sheetName, $data['annex30'] ?? []);
                break;
            case 'PLANTILLA MINEM 1':
                $this->modifyPlantillaMinem1($sheet, $sheetName, $data['minem1'] ?? []);
                break;
            case 'PLANTILLA MINEM 2':
                $this->modifyPlantillaMinem2($sheet, $sheetName, $data['minem2'] ?? []);
                break;
        }
    }

    private function modifyAnexo($sheet, $sheetName, $data)
    {
        $sections = [
            'Titular' => [
                'data' => $data['Titular'] ?? [],
                'row' => 13
            ],
            'Empresa Contratista Minero' => [
                'data' => $data['Empresa Contratista Minero'] ?? [],
                'row' => 15
            ],
            'Empresa Conexa' => [
                'data' => $data['Empresa Conexa'] ?? [],
                'row' => 17
            ]
        ];

        $totals = array_fill(0, 27, 0); // Initialize totals array for columns B to AA

        foreach (array_reverse($sections) as $sectionName => $section) {
            $currentRow = $sheetName === 'ANEXO 27' ? $section['row'] + 1 : $section['row'];


            if (count($section['data']) > 1) {
                $sheet->insertNewRowBefore($currentRow + 1, count($section['data']) - 1);
            }

            foreach ($section['data'] as $item) {
                $total = ($item->total_empl ?? 0) + ($item->total_obr ?? 0);
                $sheet->setCellValue("A{$currentRow}", $item->contractor_company_name ?? 'S/N');
                $sheet->setCellValue("B{$currentRow}", $item->total_empl ?? 'S/N');
                $sheet->setCellValue("C{$currentRow}", $item->total_obr ?? 'S/N');
                $sheet->setCellValue("D{$currentRow}", $total);

                $totals[1] += $item->total_empl ?? 0;
                $totals[2] += $item->total_obr ?? 0;
                $totals[3] += $total;

                for ($day = 1; $day <= 22; $day++) {
                    $value = $item->{"total_day{$day}"} ?? 0;
                    $sheet->setCellValueByColumnAndRow(4 + $day, $currentRow, $value);
                    $totals[3 + $day] += $value;
                }

                $sheet->setCellValue("AA{$currentRow}", $item->total_days ?? 0);
                $totals[26] += $item->total_days ?? 0;

                $currentRow++;
            }
        }

        // Find the cell with 'TOTAL' and add totals row below it
        $highestRow = $sheet->getHighestRow();
        for ($row = 1; $row <= $highestRow; $row++) {
            $cellValue = $sheet->getCell("A{$row}")->getValue();
            if ($cellValue === 'TOTAL') {
                $currentRow = $row + 1;
                break;
            }
        }

        for ($col = 1; $col <= 26; $col++) {
            $sheet->setCellValueByColumnAndRow($col + 1, $currentRow - 1, $totals[$col]);
        }
    }

    private function modifyAnexo28($sheet, $sheetName, $data)
    {
        $sections = [
            'Titular' => [
                'data' => $data['Titular'] ?? [],
                'row' => 14
            ],
            'Empresa Contratista Minero' => [
                'data' => $data['Empresa Contratista Minero'] ?? [],
                'row' => 16
            ],
            'Empresa Conexa' => [
                'data' => $data['Empresa Conexa'] ?? [],
                'row' => 18
            ]
        ];

        $totals = array_fill(0, 28, 0); // Initialize totals array for columns B to AB

        // Fill the rows with data
        foreach (array_reverse($sections) as $section) {
            $currentRow = $section['row'];
            if (count($section['data']) > 1) {
                $sheet->insertNewRowBefore($currentRow + 1, count($section['data']) - 1);
            }

            foreach ($section['data'] as $item) {
                $sheet->setCellValue("A{$currentRow}", $item->contractor_company_name ?? 'S/N');
                $sheet->setCellValue("B{$currentRow}", $item->contractor_company_type_name ?? 'S/N');
                $sheet->setCellValue("C{$currentRow}", $item->ruc_number ?? 'S/N');
                $sheet->setCellValue("D{$currentRow}", $item->total_employees ?? 0);
                $sheet->setCellValue("E{$currentRow}", $item->total_workers ?? 0);
                $sheet->setCellValue("F{$currentRow}", $item->total_personnel ?? 0);
                $sheet->setCellValue("G{$currentRow}", $item->total_incidents ?? 0);
                $sheet->setCellValue("H{$currentRow}", $item->accumulation_incidents ?? 0);
                $sheet->setCellValue("I{$currentRow}", $item->total_dangerous_incidents ?? 0);
                $sheet->setCellValue("J{$currentRow}", $item->accumulation_dangerous_incidents ?? 0);
                $sheet->setCellValue("K{$currentRow}", $item->total_minor_accidents ?? 0);
                $sheet->setCellValue("L{$currentRow}", $item->accumulation_minor_accidents ?? 0);
                $sheet->setCellValue("M{$currentRow}", $item->total_disability ?? 0);
                $sheet->setCellValue("N{$currentRow}", $item->total_mortality ?? 0);
                $sheet->setCellValue("O{$currentRow}", $item->total_mortality_disability ?? 0);
                $sheet->setCellValue("P{$currentRow}", $item->accumulation_disability ?? 0);
                $sheet->setCellValue("Q{$currentRow}", $item->accumulation_mortality ?? 0);
                $sheet->setCellValue("R{$currentRow}", $item->accumulation_mortality_disability ?? 0);
                $sheet->setCellValue("S{$currentRow}", $item->total_lost_days ?? 0);
                $sheet->setCellValue("T{$currentRow}", $item->accumulation_lost_days ?? 0);
                $sheet->setCellValue("U{$currentRow}", $item->total_man_hours_worked ?? 0);
                $sheet->setCellValue("V{$currentRow}", $item->accumulation_man_hours_worked ?? 0);
                $sheet->setCellValue("W{$currentRow}", $item->total_frequency_index ?? 0);
                $sheet->setCellValue("X{$currentRow}", $item->accumulation_frequency_index ?? 0);
                $sheet->setCellValue("Y{$currentRow}", $item->total_severity_index ?? 0);
                $sheet->setCellValue("Z{$currentRow}", $item ->accumulation_severity_index ?? 0);
                $sheet->setCellValue("AA{$currentRow}", $item->total_accident_rate ?? 0);
                $sheet->setCellValue("AB{$currentRow}", $item->accumulation_accident_rate ?? 0);

                // Set row height to 1 cm
                $sheet->getRowDimension($currentRow)->setRowHeight(10); // 1 cm = 10 points

                // Update totals
                $totals[3] += $item->total_employees ?? 0;
                $totals[4] += $item->total_workers ?? 0;
                $totals[5] += $item->total_personnel ?? 0;
                $totals[6] += $item->total_incidents ?? 0;
                $totals[7] += $item->accumulation_incidents ?? 0;
                $totals[8] += $item->total_dangerous_incidents ?? 0;
                $totals[9] += $item->accumulation_dangerous_incidents ?? 0;
                $totals[10] += $item->total_minor_accidents ?? 0;
                $totals[11] += $item->accumulation_minor_accidents ?? 0;
                $totals[12] += $item->total_disability ?? 0;
                $totals[13] += $item->total_mortality ?? 0;
                $totals[14] += $item->total_mortality_disability ?? 0;
                $totals[15] += $item->accumulation_disability ?? 0;
                $totals[16] += $item->accumulation_mortality ?? 0;
                $totals[17] += $item->accumulation_mortality_disability ?? 0;
                $totals[18] += $item->total_lost_days ?? 0;
                $totals[19] += $item->accumulation_lost_days ?? 0;
                $totals[20] += $item->total_man_hours_worked ?? 0;
                $totals[21] += $item->accumulation_man_hours_worked ?? 0;
                $totals[22] += $item->total_frequency_index ?? 0;
                $totals[23] += $item->accumulation_frequency_index ?? 0;
                $totals[24] += $item->total_severity_index ?? 0;
                $totals[25] += $item->accumulation_severity_index ?? 0;
                $totals[26] += $item->total_accident_rate ?? 0;
                $totals[27] += $item->accumulation_accident_rate ?? 0;

                $currentRow++;
            }

            $currentRow++; // Add an extra row between sections
        }

        // Find the cell with 'TOTAL' and add totals row below it
        $highestRow = $sheet->getHighestRow();
        for ($row = 1; $row <= $highestRow; $row++) {
            $cellValue = $sheet->getCell("A{$row}")->getValue();
            if ($cellValue === 'TOTAL') {
                $currentRow = $row + 1;
                break;
            }
        }

        for ($col = 3; $col <= 28; $col++) {
            $sheet->setCellValueByColumnAndRow($col, $currentRow - 1, $totals[$col - 1]);
        }
    }

    private function modifyAnexo30($sheet, $sheetName, $data)
    {
        $sections = [
            'Titular' => [
                'data' => $data['Titular'] ?? [],
                'row' => 15
            ],
            'Empresa Contratista Minero' => [
                'data' => $data['Empresa Contratista Minero'] ?? [],
                'row' => 17
            ],
            'Empresa Conexa' => [
                'data' => $data['Empresa Conexa'] ?? [],
                'row' => 19
            ]
        ];

        // Fill the rows with data
        foreach (array_reverse($sections) as $sectionName => $section) {
            $currentRow = $section['row'];
            if (count($section['data']) > 1) {
                $sheet->insertNewRowBefore($currentRow + 1, count($section['data']) - 1);
            }

            foreach ($section['data'] as $item) {
                $sheet->setCellValue("A{$currentRow}", $item->contractor_company_name ?? '');
                $sheet->setCellValue("B{$currentRow}", $item->accident_type ?? '');
                $sheet->setCellValue("C{$currentRow}", $item->injury_nature ?? '');
                $sheet->setCellValue("D{$currentRow}", $item->age ?? '');
                $sheet->setCellValue("E{$currentRow}", $item->marital_status ?? '');
                $sheet->setCellValue("F{$currentRow}", $item->education_level ?? '');
                $sheet->setCellValue("G{$currentRow}", $item->years_experience ?? '');
                $sheet->setCellValue("H{$currentRow}", $item->time ?? '');
                $sheet->setCellValue("I{$currentRow}", $item->day ?? 0);
                $sheet->setCellValue("J{$currentRow}", $item->month_name ?? '');
                $sheet->setCellValue("K{$currentRow}", $item->partial_temporary ?? '');
                $sheet->setCellValue("L{$currentRow}", $item->permanent_temporary ?? '');
                $sheet->setCellValue("M{$currentRow}", $item->partial_permanent ?? '');
                $sheet->setCellValue("N{$currentRow}", $item->total_permanent ?? '');
                $sheet->setCellValue("O{$currentRow}", $item->disability ?? '');
                $sheet->setCellValue("P{$currentRow}", $item->remuneration ?? '');
                $sheet->setCellValue("Q{$currentRow}", $item->occupation ?? '');

                $currentRow++;
            }
        }
    }

    private function modifyPlantillaMinem1($sheet, $fileIndex, $data)
    {
        $sections = [
            'Titular' => [
                'data' => $data['Titular'] ?? [],
            ],
            'Empresa Contratista Minero' => [
                'data' => $data['Empresa Contratista Minero'] ?? [],
            ],
            'Empresa Conexa' => [
                'data' => $data['Empresa Conexa'] ?? [],
            ]
        ];

        // Fill the rows with data
        $currentRow = 6;
        foreach ($sections as $sectionName => $section) {
            foreach ($section['data'] as $item) {
                $sheet->insertNewRowBefore($currentRow);
                $sheet->setCellValue("A{$currentRow}", $item->ruc_number ?? '');
                $sheet->setCellValue("B{$currentRow}", $item->concession_code ?? '');
                $sheet->setCellValue("C{$currentRow}", $item->uea_name ?? '');
                $sheet->setCellValue("D{$currentRow}", $item->abbreviation ?? '');
                $sheet->setCellValue("E{$currentRow}", $item->contractor_company_name ?? '');
                $sheet->setCellValue("F{$currentRow}", $item->total_local_male_workers ?? '');
                $sheet->setCellValue("G{$currentRow}", $item->total_regional_male_workers ?? '');
                $sheet->setCellValue("H{$currentRow}", $item->total_national_male_workers ?? '');
                $sheet->setCellValue("I{$currentRow}", $item->total_foreign_male_workers ?? 0);
                $sheet->setCellValue("J{$currentRow}", $item->total_local_female_workers ?? '');
                $sheet->setCellValue("K{$currentRow}", $item->total_regional_female_workers ?? '');
                $sheet->setCellValue("L{$currentRow}", $item->total_national_female_workers ?? '');
                $sheet->setCellValue("M{$currentRow}", $item->total_foreign_female_workers ?? '');
                $sheet->setCellValue("N{$currentRow}", $item->total_local_male_employees ?? '');
                $sheet->setCellValue("O{$currentRow}", $item->total_regional_male_employees ?? '');
                $sheet->setCellValue("P{$currentRow}", $item->total_national_male_employees ?? '');
                $sheet->setCellValue("Q{$currentRow}", $item->total_foreign_male_employees ?? '');
                $sheet->setCellValue("R{$currentRow}", $item->total_local_female_employees ?? '');
                $sheet->setCellValue("S{$currentRow}", $item->total_regional_female_employees ?? '');
                $sheet->setCellValue("T{$currentRow}", $item->total_national_female_employees ?? '');
                $sheet->setCellValue("U{$currentRow}", $item->total_foreign_female_employees ?? '');
                $sheet->setCellValue("V{$currentRow}", $item->total_employees ?? '');
                $sheet->setCellValue("W{$currentRow}", $item->total_hours_employees ?? '');
                $sheet->setCellValue("X{$currentRow}", $item->mining_activities ?? '');

                $currentRow++;
            }
        }

        //Eliminar la fila o row 5
        $sheet->removeRow(5);
    }

    private function modifyPlantillaMinem2($sheet, $fileIndex, $data)
    {
        $sections = [
            'Titular' => [
                'data' => $data['Titular'] ?? [],
            ],
            'Empresa Contratista Minero' => [
                'data' => $data['Empresa Contratista Minero'] ?? [],
            ],
            'Empresa Conexa' => [
                'data' => $data['Empresa Conexa'] ?? [],
            ]
        ];

        // Fill the rows with data
        $currentRow = 6;
        foreach ($sections as $sectionName => $section) {
            foreach ($section['data'] as $item) {
                $sheet->insertNewRowBefore($currentRow);
                $sheet->setCellValue("A{$currentRow}", $item->ruc_number ?? '');
                $sheet->setCellValue("B{$currentRow}", $item->concession_code ?? '');
                $sheet->setCellValue("C{$currentRow}", $item->uea_name ?? '');
                $sheet->setCellValue("D{$currentRow}", $item->abbreviation ?? '');
                $sheet->setCellValue("E{$currentRow}", $item->contractor_company_name ?? '');
                $sheet->setCellValue("F{$currentRow}", $item->total_male_managers ?? '');
                $sheet->setCellValue("G{$currentRow}", $item->total_male_administrative ?? '');
                $sheet->setCellValue("H{$currentRow}", $item->total_male_plant_staff ?? '');
                $sheet->setCellValue("I{$currentRow}", $item->total_male_general_operations ?? '');
                $sheet->setCellValue("J{$currentRow}", $item->total_female_managers ?? '');
                $sheet->setCellValue("K{$currentRow}", $item->total_female_administrative ?? '');
                $sheet->setCellValue("L{$currentRow}", $item->total_female_plant_staff ?? '');
                $sheet->setCellValue("M{$currentRow}", $item->total_female_general_operations ?? '');

                $currentRow++;
            }
        }

        $sheet->removeRow(5);
    }
}
