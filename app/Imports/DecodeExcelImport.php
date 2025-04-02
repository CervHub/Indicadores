<?php

namespace App\Imports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use PhpOffice\PhpSpreadsheet\IOFactory;

class DecodeExcelImport implements WithMultipleSheets
{
    private $filePath;
    private $data;
    private $keywordPositions;

    public function __construct($filePath)
    {
        $this->filePath = $filePath;
        $this->data = [];
        $this->keywordPositions = [];
    }

    /**
     * Método requerido por WithMultipleSheets.
     *
     * @return array
     */
    public function sheets(): array
    {
        // Si no necesitas manejar múltiples hojas con esta interfaz, devuelve un arreglo vacío
        return [];
    }

    /**
     * Procesa el archivo Excel y recorre las hojas.
     *
     * @return array
     */
    public function process(): array
    {
        try {
            $spreadsheet = IOFactory::load($this->filePath);

            // Validar todas las hojas antes de procesarlas
            $this->validateAllSheets($spreadsheet);

            $sheetNames = $spreadsheet->getSheetNames();

            foreach ($sheetNames as $sheetName) {
                $sheet = $spreadsheet->getSheetByName($sheetName);
                $sheetData = $sheet->toArray();

                // Procesar los datos de la hoja según su nombre
                switch ($sheetName) {
                    case 'ANEXO 24':
                        $this->processAnexo24($sheetData);
                        break;
                    case 'ANEXO 25':
                        $this->processAnexo25($sheetData);
                        break;
                    case 'ANEXO 26':
                        $this->processAnexo26($sheetData);
                        break;
                    case 'ANEXO 27':
                        $this->processAnexo27($sheetData);
                        break;
                    case 'ANEXO 28':
                        $this->processAnexo28($sheetData);
                        break;
                    case 'ANEXO 30':
                        $this->processAnexo30($sheetData);
                        break;
                    case 'PLANTILLA MINEM 1':
                        $this->processPlantillaMinem1($sheetData);
                        break;
                    case 'PLANTILLA MINEM 2':
                        $this->processPlantillaMinem2($sheetData);
                        break;
                    default:
                        break;
                }
            }

            return $this->data;
        } catch (\Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }

    /**
     * Valida todas las hojas del archivo Excel.
     *
     * @param \PhpOffice\PhpSpreadsheet\Spreadsheet $spreadsheet
     * @throws \Exception
     */
    private function validateAllSheets($spreadsheet): void
    {
        $sheetNames = $spreadsheet->getSheetNames();
        $errors = [];

        foreach ($sheetNames as $sheetName) {
            $sheet = $spreadsheet->getSheetByName($sheetName);
            $sheetData = $sheet->toArray();

            $keywords = $this->getKeywordsForSheet($sheetName);
            foreach ($keywords as $keyword) {
                $found = false;
                foreach ($sheetData as $rowIndex => $row) {
                    if ($keyword === 'TOTAL') {
                        // Check only column A for 'TOTAL'
                        if (isset($row[0]) && $row[0] === 'TOTAL') {
                            $found = true;
                            $this->keywordPositions[$sheetName][$keyword] = $rowIndex;
                            break;
                        }
                    } else {
                        if (in_array($keyword, $row)) {
                            $found = true;
                            $this->keywordPositions[$sheetName][$keyword] = $rowIndex;
                            break;
                        }
                    }
                }
                if (!$found) {
                    $errors[] = $sheetName;
                    break;
                }
            }
        }

        if (!empty($errors)) {
            throw new \Exception('Errores en las hojas: ' . implode(", ", $errors));
        }
    }

    /**
     * Obtiene las claves (keywords) para una hoja específica.
     *
     * @param string $sheetName
     * @return array
     */
    private function getKeywordsForSheet(string $sheetName): array
    {
        switch ($sheetName) {
            case 'ANEXO 24':
            case 'ANEXO 25':
            case 'ANEXO 26':
            case 'ANEXO 27':
                return ['EMPL.', 'EMPRESA CONTRATISTA MINERO', 'EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS', 'TOTAL'];
            case 'ANEXO 28':
                return ['INCAP.', 'EMPRESA CONTRATISTA MINERO', 'EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS', 'TOTAL'];
            case 'ANEXO 30':
                return ['Día (F)', 'EMPRESA CONTRATISTA MINERO', 'EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS', 'Nota:'];
            case 'PLANTILLA MINEM 1':
            case 'PLANTILLA MINEM 2':
                return ['RUC'];
            default:
                return [];
        }
    }

    private function processAnexo24(array $sheetData)
    {
        $limits = $this->keywordPositions['ANEXO 24'];
        $titularL = [$limits['EMPL.'], $limits['EMPRESA CONTRATISTA MINERO']];
        $contrataL = [$limits['EMPRESA CONTRATISTA MINERO'], $limits['EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS']];
        $conexaL = [$limits['EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS'], $limits['TOTAL']];

        $titular = $this->extractData($sheetData, $titularL[0] + 1, $titularL[1] - 1, 27);
        $contrata = $this->extractData($sheetData, $contrataL[0] + 1, $contrataL[1] - 1, 27);
        $conexa = $this->extractData($sheetData, $conexaL[0] + 1, $conexaL[1] - 1, 27);

        foreach ($titular as $key => $value) {
            $value[0] = trim($value[0]);
            $this->data['titular'][$value[0]]['ANEXO 24'] = $value;
        }

        foreach ($contrata as $key => $value) {
            $value[0] = trim($value[0]);
            $this->data['contrata'][$value[0]]['ANEXO 24'] = $value;
        }

        foreach ($conexa as $key => $value) {
            $value[0] = trim($value[0]);
            $this->data['conexa'][$value[0]]['ANEXO 24'] = $value;
        }
    }

    private function processAnexo25(array $sheetData)
    {
        $limits = $this->keywordPositions['ANEXO 25'];
        $titularL = [$limits['EMPL.'], $limits['EMPRESA CONTRATISTA MINERO']];
        $contrataL = [$limits['EMPRESA CONTRATISTA MINERO'], $limits['EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS']];
        $conexaL = [$limits['EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS'], $limits['TOTAL']];

        $titular = $this->extractData($sheetData, $titularL[0] + 1, $titularL[1] - 1, 27);
        $contrata = $this->extractData($sheetData, $contrataL[0] + 1, $contrataL[1] - 1, 27);
        $conexa = $this->extractData($sheetData, $conexaL[0] + 1, $conexaL[1] - 1, 27);

        foreach ($titular as $key => $value) {
            $value[0] = trim($value[0]);
            $this->data['titular'][$value[0]]['ANEXO 25'] = $value;
        }

        foreach ($contrata as $key => $value) {
            $value[0] = trim($value[0]);
            $this->data['contrata'][$value[0]]['ANEXO 25'] = $value;
        }

        foreach ($conexa as $key => $value) {
            $value[0] = trim($value[0]);
            $this->data['conexa'][$value[0]]['ANEXO 25'] = $value;
        }
    }

    private function processAnexo26(array $sheetData)
    {
        $limits = $this->keywordPositions['ANEXO 26'];
        $titularL = [$limits['EMPL.'], $limits['EMPRESA CONTRATISTA MINERO']];
        $contrataL = [$limits['EMPRESA CONTRATISTA MINERO'], $limits['EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS']];
        $conexaL = [$limits['EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS'], $limits['TOTAL']];

        $titular = $this->extractData($sheetData, $titularL[0] + 1, $titularL[1] - 1, 27);
        $contrata = $this->extractData($sheetData, $contrataL[0] + 1, $contrataL[1] - 1, 27);
        $conexa = $this->extractData($sheetData, $conexaL[0] + 1, $conexaL[1] - 1, 27);

        foreach ($titular as $key => $value) {
            $value[0] = trim($value[0]);
            $this->data['titular'][$value[0]]['ANEXO 26'] = $value;
        }

        foreach ($contrata as $key => $value) {
            $value[0] = trim($value[0]);
            $this->data['contrata'][$value[0]]['ANEXO 26'] = $value;
        }

        foreach ($conexa as $key => $value) {
            $value[0] = trim($value[0]);
            $this->data['conexa'][$value[0]]['ANEXO 26'] = $value;
        }
    }

    private function processAnexo27(array $sheetData)
    {
        $limits = $this->keywordPositions['ANEXO 27'];
        $titularL = [$limits['EMPL.'], $limits['EMPRESA CONTRATISTA MINERO']];
        $contrataL = [$limits['EMPRESA CONTRATISTA MINERO'], $limits['EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS']];
        $conexaL = [$limits['EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS'], $limits['TOTAL']];

        $titular = $this->extractData($sheetData, $titularL[0] + 1, $titularL[1] - 1, 27);
        $contrata = $this->extractData($sheetData, $contrataL[0] + 1, $contrataL[1] - 1, 27);
        $conexa = $this->extractData($sheetData, $conexaL[0] + 1, $conexaL[1] - 1, 27);

        foreach ($titular as $key => $value) {
            $value[0] = trim($value[0]);
            $this->data['titular'][$value[0]]['ANEXO 27'] = $value;
        }

        foreach ($contrata as $key => $value) {
            $value[0] = trim($value[0]);
            $this->data['contrata'][$value[0]]['ANEXO 27'] = $value;
        }

        foreach ($conexa as $key => $value) {
            $value[0] = trim($value[0]);
            $this->data['conexa'][$value[0]]['ANEXO 27'] = $value;
        }
    }

    private function processAnexo28(array $sheetData)
    {
        $limits = $this->keywordPositions['ANEXO 28'];
        $titularL = [$limits['INCAP.'], $limits['EMPRESA CONTRATISTA MINERO']];
        $contrataL = [$limits['EMPRESA CONTRATISTA MINERO'], $limits['EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS']];
        $conexaL = [$limits['EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS'], $limits['TOTAL']];

        $titular = $this->extractData($sheetData, $titularL[0] + 2, $titularL[1] - 1, 28);
        $contrata = $this->extractData($sheetData, $contrataL[0] + 1, $contrataL[1] - 1, 28);
        $conexa = $this->extractData($sheetData, $conexaL[0] + 1, $conexaL[1] - 1, 28);

        foreach ($titular as $key => $value) {
            $value[0] = trim($value[0]);
            $this->data['titular'][$value[0]]['ANEXO 28'] = $value;
        }

        foreach ($contrata as $key => $value) {
            $value[0] = trim($value[0]);
            $this->data['contrata'][$value[0]]['ANEXO 28'] = $value;
        }

        foreach ($conexa as $key => $value) {
            $value[0] = trim($value[0]);
            $this->data['conexa'][$value[0]]['ANEXO 28'] = $value;
        }
    }

    private function processAnexo30(array $sheetData)
    {
        $limits = $this->keywordPositions['ANEXO 30'];
        $titularL = [$limits['Día (F)'], $limits['EMPRESA CONTRATISTA MINERO']];
        $contrataL = [$limits['EMPRESA CONTRATISTA MINERO'], $limits['EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS']];
        $conexaL = [$limits['EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS'], $limits['Nota:']];

        $titular = $this->extractData($sheetData, $titularL[0] + 3, $titularL[1] - 1, 17);
        $contrata = $this->extractData($sheetData, $contrataL[0] + 1, $contrataL[1] - 1, 17);
        $conexa = $this->extractData($sheetData, $conexaL[0] + 1, $conexaL[1] - 1, 17);

        foreach ($titular as $key => $value) {
            $value[0] = trim($value[0]);
            $this->data['titular'][$value[0]]['ANEXO 30'] = $value;
        }

        foreach ($contrata as $key => $value) {
            $value[0] = trim($value[0]);
            $this->data['contrata'][$value[0]]['ANEXO 30'] = $value;
        }

        foreach ($conexa as $key => $value) {
            $value[0] = trim($value[0]);
            $this->data['conexa'][$value[0]]['ANEXO 30'] = $value;
        }
    }

    private function processPlantillaMinem1(array $sheetData)
    {
        $limits = $this->keywordPositions['PLANTILLA MINEM 1'];
        $count = count($sheetData);
        $rucL = [$limits['RUC'], $limits['RUC']];
        $ruc = $this->extractData($sheetData, $rucL[0] + 1, $count - 1, 24);
        foreach ($ruc as $item) {
            // Verificar si los índices 3 y 4 existen antes de acceder a ellos
            if (isset($item[3], $item[4])) {
                $item[4] = trim($item[4]); // Trim spaces for item 4
                if ($item[3] === 'T') {
                    $this->data['titular'][$item[4]]['PLANTILLA MINEM 1'] = $item;
                } elseif ($item[3] === 'E') {
                    $this->data['contrata'][$item[4]]['PLANTILLA MINEM 1'] = $item;
                } elseif ($item[3] === 'O') {
                    $this->data['conexa'][$item[4]]['PLANTILLA MINEM 1'] = $item;
                }
            }
        }
    }

    private function processPlantillaMinem2(array $sheetData)
    {
        $limits = $this->keywordPositions['PLANTILLA MINEM 1'];
        $count = count($sheetData);
        $rucL = [$limits['RUC'], $limits['RUC']];
        $ruc = $this->extractData($sheetData, $rucL[0] + 1, $count - 1, 13);

        foreach ($ruc as $item) {
            // Verificar si los índices 3 y 4 existen antes de acceder a ellos
            if (isset($item[3], $item[4])) {
                $item[4] = trim($item[4]); // Trim spaces for item 4
                if ($item[3] === 'T') {
                    $this->data['titular'][$item[4]]['PLANTILLA MINEM 2'] = $item;
                } elseif ($item[3] === 'E') {
                    $this->data['contrata'][$item[4]]['PLANTILLA MINEM 2'] = $item;
                } elseif ($item[3] === 'O') {
                    $this->data['conexa'][$item[4]]['PLANTILLA MINEM 2'] = $item;
                }
            }
        }
    }

    private function extractData(array $data, int $startRow, int $endRow, int $columnCount)
    {
        $filteredData = array_filter(array_slice($data, $startRow, $endRow - $startRow + 1), function ($row) {
            return array_filter($row); // Ignore rows where all columns are empty
        });

        $filteredRows = [];

        foreach ($filteredData as $key => &$row) {
            if (strtoupper($row[0]) === 'TOTAL') {
                unset($filteredData[$key]);
                continue;
            }
            $row = array_slice($row, 0, $columnCount); // Columns A to specified column count
            $filteredRows[] = $row;
        }

        return array_values($filteredRows); // Reindex array to avoid gaps
    }
}
