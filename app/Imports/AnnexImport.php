<?php

namespace App\Imports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use PhpOffice\PhpSpreadsheet\IOFactory;

class AnnexImport implements WithMultipleSheets
{
    private $filePath;
    private $typeClient;
    private $uea;
    private $data;
    private $keywordPositions;

    public function __construct($filePath, $typeClient, $uea)
    {
        $this->filePath = $filePath;
        $this->typeClient = $typeClient;
        $this->uea = $uea;
        $this->data = [];
        $this->keywordPositions = [];
    }

    /**
     * @return array
     */
    public function sheets(): array
    {
        try {
            $spreadsheet = IOFactory::load($this->filePath);
            $sheetNames = $spreadsheet->getSheetNames();
            $data = $this->initializeDataArray();

            // Validar todas las hojas antes de procesarlas
            $this->validateAllSheets($spreadsheet);
            foreach ($sheetNames as $sheetName) {
                $sheet = $spreadsheet->getSheetByName($sheetName);
                $sheetData = $sheet->toArray();

                switch ($sheetName) {
                    case 'ANEXO 24':
                        $data[$sheetName] = $this->processAnexo24($sheetData);
                        break;
                    case 'ANEXO 25':
                        $data[$sheetName] = $this->processAnexo25($sheetData);
                        break;
                    case 'ANEXO 26':
                        $data[$sheetName] = $this->processAnexo26($sheetData);
                        break;
                    case 'ANEXO 27':
                        $data[$sheetName] = $this->processAnexo27($sheetData);
                        break;
                    case 'ANEXO 28':
                        $data[$sheetName] = $this->processAnexo28($sheetData);
                        break;
                    case 'ANEXO 30':
                        $data[$sheetName] = $this->processAnexo30($sheetData);
                        break;
                    case 'PLANTILLA MINEM 1':
                        $data[$sheetName] = $this->processPlantillaMinem1($sheetData);
                        break;
                    case 'PLANTILLA MINEM 2':
                        $data[$sheetName] = $this->processPlantillaMinem2($sheetData);
                        break;
                }
            }
            $this->data = $data;
            // Validaciones Generales
            $this->rulesGenerals();
            // Retornar un array vacío ya que solo queremos listar las hojas
            return $data;
        } catch (\Exception $e) {
            // Handle the exception (e.g., log the error, rethrow the exception, return an error message, etc.)
            throw new \Exception($e->getMessage());
        }
    }

    /**
     * Suma los valores de una columna específica en un array bidimensional.
     *
     * @param array $data El array bidimensional de datos.
     * @param int $columnIndex El índice de la columna a sumar.
     * @return float|int La sumatoria de los valores de la columna.
     */
    private function sumColumn(array $data, int $columnIndex)
    {
        $sum = 0;
        foreach ($data as $row) {
            if (isset($row[$columnIndex]) && is_numeric($row[$columnIndex])) {
                $sum += $row[$columnIndex];
            }
        }
        return $sum;
    }

    /**
     * Valida que todos los valores de una columna específica en un array bidimensional sean iguales.
     *
     * @param array $data El array bidimensional de datos.
     * @param int $columnIndex El índice de la columna a validar.
     * @return bool True si todos los valores son iguales, False en caso contrario.
     */
    /**
     * Valida que todos los valores en un array lineal sean iguales.
     *
     * @param array $data El array lineal de datos.
     * @return bool True si todos los valores son iguales, False en caso contrario.
     */

    private function areAllValuesEqualLinear(array $data): bool
    {
        if (empty($data)) {
            return true;
        }

        $firstValue = reset($data);
        foreach ($data as $value) {
            if ($value != $firstValue) { // Use loose comparison
                return false;
            }
        }

        return true;
    }
    /**
     * Suma los valores de un array bidimensional en un rango de índices específicos.
     *
     * @param array $data El array bidimensional de datos.
     * @param int $startIndex El índice de inicio del rango.
     * @param int $endIndex El índice de fin del rango.
     * @return float|int La sumatoria de los valores en el rango de índices.
     */
    private function sumRange(array $data, int $startIndex, int $endIndex)
    {
        $sum = 0;
        foreach ($data as $row) {
            for ($i = $startIndex; $i <= $endIndex; $i++) {
                if (isset($row[$i]) && is_numeric($row[$i])) {
                    $sum += $row[$i];
                }
            }
        }
        return $sum;
    }
    private function rulesGenerals()
    {
        // Validaciones de empleados, obreros y Total de trabajadores
        $dataEmpl = [
            $this->sumColumn($this->data['ANEXO 24'], 1),
            $this->sumColumn($this->data['ANEXO 25'], 1),
            $this->sumColumn($this->data['ANEXO 26'], 1),
            $this->sumColumn($this->data['ANEXO 27'], 1),
            $this->sumColumn($this->data['ANEXO 28'], 3),
        ];

        if (!$this->areAllValuesEqualLinear($dataEmpl)) {
            throw new \Exception('Los valores en la columna de empleados, obreros no coinciden de los ANEXOS.');
        }

        // Validacion de totales de obreros
        $dataObreros = [
            $this->sumColumn($this->data['ANEXO 24'], 2),
            $this->sumColumn($this->data['ANEXO 25'], 2),
            $this->sumColumn($this->data['ANEXO 26'], 2),
            $this->sumColumn($this->data['ANEXO 27'], 2),
            $this->sumColumn($this->data['ANEXO 28'], 4),
        ];

        if (!$this->areAllValuesEqualLinear($dataObreros)) {
            throw new \Exception('Los valores en la columna de totales de obreros no coinciden de los ANEXOS.');
        }

        // Validacion de totales de obreros y trabajadores
        $dataTotal = [
            $this->sumColumn($this->data['ANEXO 24'], 3),
            $this->sumColumn($this->data['ANEXO 25'], 3),
            $this->sumColumn($this->data['ANEXO 26'], 3),
            $this->sumColumn($this->data['ANEXO 27'], 3),
            $this->sumColumn($this->data['ANEXO 28'], 5),
            $this->sumColumn($this->data['PLANTILLA MINEM 1'], 21),
        ];

        if (!$this->areAllValuesEqualLinear($dataTotal)) {
            throw new \Exception('Los valores en la columna de totales de obreros y trabajadores no coinciden, entre los ANEXOS y MINEM 1');
        }

        // Validacion de numero de incidentes
        $dataIncidentes = [
            $this->sumColumn($this->data['ANEXO 28'], 6),
            $this->sumRange($this->data['ANEXO 24'], 4, 25)
        ];

        if (!$this->areAllValuesEqualLinear($dataIncidentes)) {
            throw new \Exception('Los valores en la columna de número de incidentes no coinciden, entre los ANEXO 28 y ANEXO 24');
        }

        // Validacion de incidentes peligros
        $dataIncidentesPeligros = [
            $this->sumColumn($this->data['ANEXO 28'], 8),
            $this->sumRange($this->data['ANEXO 25'], 4, 25),
        ];

        if (!$this->areAllValuesEqualLinear($dataIncidentesPeligros)) {
            throw new \Exception('Los valores en la columna de incidentes peligros no coinciden, entre los ANEXO 28 y ANEXO 25');
        }

        // validacion de accidentes leves
        $dataAccidentesLeves = [
            $this->sumColumn($this->data['ANEXO 28'], 10),
            $this->sumRange($this->data['ANEXO 26'], 4, 25),
        ];
        if (!$this->areAllValuesEqualLinear($dataAccidentesLeves)) {
            throw new \Exception('Los valores en la columna de accidentes leves no coinciden, entre los ANEXO 28 y ANEXO 26');
        }

        //Validacion de accidentes incapacitantes
        $dataAccidentesIncapacitantes = [
            $this->sumColumn($this->data['ANEXO 28'], 12),
            $this->sumRange($this->data['ANEXO 27'], 4, 25),
        ];

        if (!$this->areAllValuesEqualLinear($dataAccidentesIncapacitantes)) {
            throw new \Exception('Los valores en la columna de accidentes incapacitantes no coinciden, entre los ANEXO 28 y ANEXO 27');
        }


        // Validacion de accidentes incapacitantes con la cantidad de registros del anexo 30
        $dataAccidentesIncapacitantesAnexo30 = [
            $this->sumColumn($this->data['ANEXO 28'], 12),
            count($this->data['ANEXO 30']),
        ];

        if (!$this->areAllValuesEqualLinear($dataAccidentesIncapacitantesAnexo30)) {
            throw new \Exception('Los valores en la columna de accidentes incapacitantes no coinciden, entre los ANEXO 28 y el numero de registros del ANEXO 30');
        }

        //Validacion de horas trabajadas entre anexo 28 y MINEM 1
        $dataHorasTrabajadas = [
            $this->sumColumn($this->data['ANEXO 28'], 20),
            $this->sumColumn($this->data['PLANTILLA MINEM 1'], 22),
        ];

        if (!$this->areAllValuesEqualLinear($dataHorasTrabajadas)) {
            throw new \Exception('Los valores en la columna de horas trabajadas no coinciden, entre los ANEXO 28 y MINEM 1');
        }
    }

    /**
     * Initialize the data array with predefined sheet names.
     *
     * @return array
     */
    private function initializeDataArray(): array
    {
        return [
            'ANEXO 24' => [],
            'ANEXO 25' => [],
            'ANEXO 26' => [],
            'ANEXO 27' => [],
            'ANEXO 28' => [],
            'ANEXO 30' => [],
            'PLANTILLA MINEM 1' => [],
            'PLANTILLA MINEM 2' => []
        ];
    }

    /**
     * Get the processed data.
     *
     * @return array
     */
    public function getData(): array
    {
        return $this->data;
    }

    /**
     * Validate all sheets by checking for the presence of specific keywords.
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
            throw new \Exception(implode(", ", $errors));
        }
    }

    /**
     * Get the keywords for a specific sheet.
     *
     * @param string $sheetName
     * @return array
     */
    private function getKeywordsForSheet(string $sheetName): array
    {
        switch ($sheetName) {
            case 'ANEXO 24':
                return ['EMPL.', 'EMPRESA CONTRATISTA MINERO', 'EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS', 'TOTAL'];
            case 'ANEXO 25':
                return ['EMPL.', 'EMPRESA CONTRATISTA MINERO', 'EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS', 'TOTAL'];
            case 'ANEXO 26':
                return ['EMPL.', 'EMPRESA CONTRATISTA MINERO', 'EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS', 'TOTAL'];
            case 'ANEXO 27':
                return ['EMPL.', 'EMPRESA CONTRATISTA MINERO', 'EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS', 'TOTAL'];
            case 'ANEXO 28':
                return ['INCAP.', 'EMPRESA CONTRATISTA MINERO', 'EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS', 'TOTAL'];
            case 'ANEXO 30':
                return ['Día (F)', 'EMPRESA CONTRATISTA MINERO', 'EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS', 'Nota:'];
            case 'PLANTILLA MINEM 1':
                return ['RUC'];
            case 'PLANTILLA MINEM 2':
                return ['RUC'];
            default:
                return [];
        }
    }

    private function processAnexo(array $sheetData, string $anexo, int $columnCount): array
    {
        try {
            $limits = $this->keywordPositions[$anexo];

            switch ($this->typeClient) {
                case 'T':
                    $startRow = $limits['EMPL.'] + 1;
                    $endRow = $limits['EMPRESA CONTRATISTA MINERO'] - 1;
                    break;
                case 'E':
                    $startRow = $limits['EMPRESA CONTRATISTA MINERO'] + 1;
                    $endRow = $limits['EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS'] - 1;
                    break;
                case 'O':
                    $startRow = $limits['EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS'] + 1;
                    $endRow = $limits['TOTAL'] - 1;
                    break;
                default:
                    return [];
            }
            $rules = [
                [0, 'En la columna (A), debes colocar el nombre de la empresa a la que perteneces. El campo debe ser texto.', 'string', 'El campo en la columna (A) debe ser texto.'],
                [1, 'En la columna (B), debes colocar la cantidad de Empleados. El campo debe ser un número.', 'number', 'El campo en la columna (B) debe ser un número.'],
                [2, 'En la columna (C), debes colocar la cantidad de Obreros. El campo debe ser un número.', 'number', 'El campo en la columna (C) debe ser un número.'],
                [3, 'En la columna (D), debes colocar la sumatoria de Empleados y Obreros. El campo debe ser un número.', 'number', 'El campo en la columna (D) debe ser un número.'],
            ];
            return $this->extractData($sheetData, $startRow, $endRow, $columnCount, $rules);
        } catch (\Exception $e) {
            // Handle the exception (e.g., log the error, rethrow the exception, return an error message, etc.)
            throw new \Exception("Error procesando $anexo: " . $e->getMessage());
        }
    }

    private function processAnexo24(array $sheetData): array
    {
        return $this->processAnexo($sheetData, 'ANEXO 24', 26);
    }

    private function processAnexo25(array $sheetData): array
    {
        return $this->processAnexo($sheetData, 'ANEXO 25', 26);
    }

    private function processAnexo26(array $sheetData): array
    {
        return $this->processAnexo($sheetData, 'ANEXO 26', 26);
    }

    private function processAnexo27(array $sheetData): array
    {
        return $this->processAnexo($sheetData, 'ANEXO 27', 26);
    }

    private function processAnexo28(array $sheetData): array
    {
        try {
            $limits = $this->keywordPositions['ANEXO 28'];

            switch ($this->typeClient) {
                case 'T':
                    $startRow = $limits['INCAP.'] + 2;
                    $endRow = $limits['EMPRESA CONTRATISTA MINERO'] - 1;
                    break;
                case 'E':
                    $startRow = $limits['EMPRESA CONTRATISTA MINERO'] + 1;
                    $endRow = $limits['EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS'] - 1;
                    break;
                case 'O':
                    $startRow = $limits['EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS'] + 1;
                    $endRow = $limits['TOTAL'] - 1;
                    break;
                default:
                    return [];
            }

            $rules = [
                [0, 'En la columna (A), debes colocar el nombre de la empresa y este debe ser texto', 'string', 'En la columna (A) debe ser texto.'],
                [1, 'En la columna (B), debes colocar la situacion y este debe ser texto', 'string', 'En la columna (B) debe ser texto.'],
                [2, 'En la columna (C), debes colocar el nro de RUC y este debe ser texto', 'string', 'En la columna (C) debe ser texto.'],
                [3, 'En la columna (D), debes colocar la cantidad de Empleados y este debe ser un numero.', 'number', 'En la columna (D) debe ser un numero.'],
                [4, 'En la columna (E), debes colocar la cantidad de Obreros y este debe ser un numero.', 'number', 'En la columna (E) debe ser un numero.'],
                [5, 'En la columna (F), debes colocar la sumatoria de Empleados y Obreros y este debe ser un numero.', 'number', 'En la columna (F) debe ser un numero.'],
                [6, 'En la columna (G), debes colocar la cantidad de Incidentes y este debe ser un numero.', 'number', 'En la columna (G) debe ser un numero.'],
                [8, 'En la columna (I), debes colocar la cantidad de Incidentes Peligrosos y este debe ser un numero.', 'number', 'En la columna (I) debe ser un numero.'],
                [10, 'En la columna (K), debes colocar la cantidad de Accidentes Leves y este debe ser un numero.', 'number', 'En la columna (K) debe ser un numero.'],
                [12, 'En la columna (M), debes colocar la cantidad de Accidentes Incapacitantes y este debe ser un numero.', 'number', 'En la columna (M) debe ser un numero.'],
                [13, 'En la columna (N), debes colocar la cantidad de Accidentes Mortales y este debe ser un numero.', 'number', 'En la columna (N) debe ser un numero.'],
                [14, 'En la columna (O), debes colocar la sumatoria de la cantidad de Accidentes incapacitantes y mortales y este debe ser un numero.', 'number', 'En la columna (O) debe ser un numero.'],
                [18, 'En la columna (S), debes colocar los días perdidos y/o cargados y este debe ser un numero.', 'number', 'En la columna (S) debe ser un numero.'],
                [20, 'En la columna (U), debes colocar las horas hombres trabajadas y este debe ser un numero.', 'number', 'En la columna (U) debe ser un numero.'],
                [22, 'En la columna (W), debes colocar el índice de frecuencia y este debe ser un numero.', 'number', 'En la columna (W) debe ser un numero.'],
                [24, 'En la columna (Y), debes colocar el índice de severidad y este debe ser un numero.', 'number', 'En la columna (Y) debe ser un numero.'],
                [26, 'En la columna (AA), debes colocar el índice de accidentabilidad y este debe ser un numero.', 'number', 'En la columna (AA) debe ser un numero.'],
            ];
            return $this->extractData($sheetData, $startRow, $endRow, 28, $rules);
        } catch (\Exception $e) {
            throw new \Exception("Error procesando ANEXO 28: " . $e->getMessage());
        }
    }

    private function processAnexo30(array $sheetData): array
    {
        try {
            $limits = $this->keywordPositions['ANEXO 30'];

            switch ($this->typeClient) {
                case 'T':
                    $startRow = $limits['Día (F)'] + 3;
                    $endRow = $limits['EMPRESA CONTRATISTA MINERO'] - 1;
                    break;
                case 'E':
                    $startRow = $limits['EMPRESA CONTRATISTA MINERO'] + 1;
                    $endRow = $limits['EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS'] - 1;
                    break;
                case 'O':
                    $startRow = $limits['EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS'] + 1;
                    $endRow = $limits['Nota:'] - 1;
                    break;
                default:
                    return [];
            }
            $rules = [];

            return $this->extractData($sheetData, $startRow, $endRow, 17, $rules);
        } catch (\Exception $e) {
            throw new \Exception("Error procesando ANEXO 30: " . $e->getMessage());
        }
    }

    private function processPlantillaMinem1(array $sheetData): array
    {
        try {
            $limits = $this->keywordPositions['PLANTILLA MINEM 1'];
            $startRow = $limits['RUC'] + 2;
            $endRow = $endRow ?? count($sheetData) - 1;
            $rules = [
                [0, 'En la columna (A), debes colocar el RUC de la empresa', 'string', 'En la columna (A) debe ser texto.'],
                [1, 'En la columna (B), debes colocar el código de concesión', 'string', 'En la columna (B) debe ser texto.'],
                [2, 'En la columna (C), debes colocar el nombre de concesión o UEA', 'string', 'En la columna (C) debe ser texto.'],
                [3, 'En la columna (D), debes colocar el tipo de cliente', 'string', 'En la columna (D) debe ser texto.'],
                [4, 'En la columna (E), debes colocar el nombre de la empresa', 'string', 'En la columna (E) debe ser texto.'],
                [21, 'En la columna (V), debes colocar el total de trabajadores', 'number', 'En la columna (V) debe ser un número.'],
                [22, 'En la columna (W), debes colocar el total de horas trabajadas', 'number', 'En la columna (W) debe ser un número.'],
                [23, 'En la columna (X), debes colocar las actividades mineras', 'string', 'En la columna (X) debe ser texto.'],
            ];
            return $this->extractData($sheetData, $startRow, $endRow, 24, $rules);
        } catch (\Exception $e) {
            throw new \Exception("Error procesando PLANTILLA MINEM 1: " . $e->getMessage());
        }
    }

    private function processPlantillaMinem2(array $sheetData): array
    {
        try {
            $limits = $this->keywordPositions['PLANTILLA MINEM 2'];
            $startRow = $limits['RUC'] + 2;
            $endRow = $endRow ?? count($sheetData) - 1;
            $rules = [
                [0, 'En la columna (A), debes colocar el RUC de la empresa', 'string', 'En la columna (A) debe ser texto.'],
                [1, 'En la columna (B), debes colocar el código de concesión', 'string', 'En la columna (B) debe ser texto.'],
                [2, 'En la columna (C), debes colocar el nombre de concesión o UEA', 'string', 'En la columna (C) debe ser texto.'],
                [3, 'En la columna (D), debes colocar el tipo de cliente', 'string', 'En la columna (D) debe ser texto.'],
                [4, 'En la columna (E), debes colocar el nombre de la empresa', 'string', 'En la columna (E) debe ser texto.']
            ];
            return $this->extractData($sheetData, $startRow, $endRow, 13, $rules);
        } catch (\Exception $e) {
            throw new \Exception("Error procesando PLANTILLA MINEM 2: " . $e->getMessage());
        }
    }

    /**
     * Extract data from a specific range of rows and columns.
     *
     * @param array $data
     * @param int $startRow
     * @param int $endRow
     * @param int $columnCount
     * @param array $filterColumns
     * @return array
     */
    private function extractData(array $data, int $startRow, int $endRow, int $columnCount, array $filterColumns = [[0, 'Campo vacío', 'string', 'El campo debe ser texto.']]): array
    {
        $filteredData = array_filter(array_slice($data, $startRow, $endRow - $startRow + 1), function ($row) {
            return array_filter($row); // Ignore rows where all columns are empty
        });
        $filteredRows = [];
        $errors = [];


        foreach ($filteredData as $key => &$row) {
            if (strtoupper($row[0]) === 'TOTAL') {
                unset($filteredData[$key]);
                continue;
            }
            $row = array_slice($row, 0, $columnCount); // Columns A to specified column count
            foreach ($filterColumns as $filter) {
                list($columnIndex, $errorMessage, $expectedType, $typeErrorMessage) = $filter;
                if (!isset($row[$columnIndex]) || $row[$columnIndex] === '') {
                    $errors[] = $errorMessage;
                } else {
                    // Check the type of the data
                    if ($expectedType === 'number' && !is_numeric($row[$columnIndex])) {
                        $errors[] = $typeErrorMessage;
                    } elseif ($expectedType === 'string' && !is_string($row[$columnIndex])) {
                        $errors[] = $typeErrorMessage;
                    }
                }
            }
            $filteredRows[] = $row;
        }

        if (!empty($errors)) {
            // dd([
            //     'errors' => $errors,
            //     'filteredData' => $filteredData,
            //     'filteredRows' => $filteredRows,
            //     'rules' => $filterColumns,
            //     'data' => $data,
            //     'startRow' => $startRow,
            //     'endRow' => $endRow,
            // ]);
            throw new \Exception($errors[0]);
        }

        return array_values($filteredRows); // Reindex array to avoid gaps
    }
}
